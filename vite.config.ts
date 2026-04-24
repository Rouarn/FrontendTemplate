import { createViteProxy, getBuildTime } from './build/config'
import { setupVitePlugins } from './build/plugins'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta

  const buildTime = getBuildTime()

  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
        },
      },
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    define: {
      BUILD_TIME: JSON.stringify(buildTime),
    },
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN === 'Y',
      cors: true,
      proxy: createViteProxy(viteEnv, enableProxy),
    },
    preview: {
      port: 9725,
    },
    build: {
      outDir: 'dist',
      // terser 配置：生产环境下更好的代码压缩和清理
      terserOptions: {
        compress: {
          // 根据环境变量控制是否移除 console
          drop_console: viteEnv.VITE_DROP_CONSOLE === 'Y',
          drop_debugger: true,
          // 移除未使用的代码
          dead_code: true,
          // 移除无用的条件判断
          conditionals: true,
          // 压缩布尔值
          booleans: true,
          // 优化 if-return 和 if-continue
          if_return: true,
          // 合并连续的 var 声明
          join_vars: true,
          // 移除无用的分号
          sequences: true,
        },
        mangle: {
          // 混淆变量名以减少文件大小
          toplevel: true,
          // 保留类名（可选，根据需要调整）
          keep_classnames: false,
          // 保留函数名（可选，根据需要调整）
          keep_fnames: false,
        },
        format: {
          // 移除注释
          comments: false,
        },
      },
      // 是否生成源码视图
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          // 静态资源分类与打包
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 使用 Rolldown 特有的代码分割配置
          codeSplitting: {
            groups: [
              {
                name: 'vue-vendor',
                test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
                priority: 40,
              },
              {
                name: 'ui-vendor',
                test: /[\\/]node_modules[\\/]naive-ui[\\/]/,
                priority: 30,
              },
              {
                name: 'utils-vendor',
                test: /[\\/]node_modules[\\/](axios|dayjs|@vueuse[\\/]core)[\\/]/,
                priority: 20,
              },
              {
                name: 'icons-vendor',
                test: /[\\/]node_modules[\\/]@iconify[\\/]vue[\\/]/,
                priority: 15,
              },
              {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
  }
})
