import { setupVitePlugins } from './build/plugins/index.ts'
import { createViteProxy, getBuildTime, validateEnv } from './build/config/index.ts'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta

  // 启动期校验必填环境变量，缺失即报错
  validateEnv(viteEnv, configEnv.mode)

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
      target: 'es2022',
      // 是否生成源码视图
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 1000,
      // 静态资产分类与打包
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // CSS 代码分割
      cssCodeSplit: true,
      // 模块预加载
      modulePreload: true,
    },
    // Oxfmt 格式化配置（替代 Prettier）
    fmt: {
      ignorePatterns: [
        'dist/**',
        'src/typings/auto-imports.d.ts',
        'src/typings/components.d.ts',
        'src/typings/elegant-router.d.ts',
        'src/typings/typed-router.d.ts',
        'src/router/_generated/**',
      ],
      singleQuote: true,
      semi: false,
      sortPackageJson: true,
    },
    // Oxlint 检查配置（替代 ESLint，含类型检查，替代 vue-tsc）
    lint: {
      ignorePatterns: [
        'dist/**',
        'src/typings/auto-imports.d.ts',
        'src/typings/components.d.ts',
        'src/typings/elegant-router.d.ts',
        'src/typings/typed-router.d.ts',
        'src/router/_generated/**',
      ],
      options: {
        typeAware: true,
        typeCheck: true,
      },
      rules: {
        'no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
        ],
        'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
      },
    },
    // 暂存区检查（替代 lint-staged）：代码文件跑 lint + 类型卡口，纯文本文件仅格式化
    staged: {
      '*.{ts,vue,tsx,jsx}': 'vp check',
      '*.{json,md,css,scss,html}': 'vp fmt',
    },
  }
})
