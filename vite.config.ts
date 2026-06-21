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
      // Vite 8 使用 Rolldown 内置压缩，无需 terserOptions
      // 是否生成源码视图
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 1000,
      // Vite 8 使用 Rolldown 的最佳实践配置
      rolldownOptions: {
        // 目标环境：现代浏览器
        target: 'es2022',
        // 启用 Tree-shaking
        treeShaking: true,
        // 压缩配置
        minify: true,
        // 根据环境变量控制是否移除 console
        dropConsole: viteEnv.VITE_DROP_CONSOLE === 'Y',
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
      // CSS 代码分割
      cssCodeSplit: true,
      // 模块预加载
      modulePreload: true,
    },
  }
})
