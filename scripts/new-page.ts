/**
 * 页面脚手架：pnpm new:page <dir>
 *
 * 用法：
 *   pnpm new:page profile             → 单菜单（顶级路由 /profile）
 *   pnpm new:page settings/users      → 菜单组子页（路由 /settings/users）
 *
 * 完成内容：
 *   1. 创建 src/views/<dir>/index.vue（含与路由名一致的 defineOptions name）
 *   2. 在 zh-cn / en-us 语言包插入 page.<camel>.title 键（单段路由同时插入 route 键）
 *   3. 在 App.I18n.Schema（src/typings/app.d.ts）同步插入键声明
 *   4. 执行 er generate 生成路由
 *   5. 打印剩余手动步骤（routes.ts 补 meta 等）
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { consola } from 'consola'

const VIEWS_DIR = path.resolve('src/views')
const LANGS_DIR = path.resolve('src/locales/langs')
const LANG_FILES = ['zh-cn', 'en-us'] as const

/** kebab 段 → PascalCase：loading-demo → LoadingDemo */
function toPascalCase(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** kebab 段 → camelCase */
function toCamelCase(segment: string) {
  const pascal = toPascalCase(segment)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/** 校验并解析目录参数 */
function parseDirArg(): string {
  const raw = process.argv[2]

  if (!raw) {
    consola.error('缺少页面目录参数。用法：pnpm new:page <dir>（如 profile 或 settings/users）')
    process.exit(1)
  }

  const dir = raw.replace(/^\/+|\/+$/g, '')

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(dir)) {
    consola.error(`目录名不合法：${dir}。仅允许小写字母/数字，段内用 - 连接，段间用 / 分隔`)
    process.exit(1)
  }

  const target = path.join(VIEWS_DIR, dir)
  if (existsSync(target)) {
    consola.error(`页面目录已存在：src/views/${dir}`)
    process.exit(1)
  }

  return dir
}

/** 在文件锚点行（如 "  route: {"）之后插入代码片段 */
function insertAfterAnchor(filePath: string, anchor: string, snippet: string) {
  const content = readFileSync(filePath, 'utf-8')
  const anchorIndex = content.indexOf(anchor)

  if (anchorIndex === -1) {
    consola.warn(`${filePath} 中未找到锚点 "${anchor}"，请手动添加：\n${snippet.trim()}`)
    return
  }

  const insertAt = anchorIndex + anchor.length
  writeFileSync(filePath, `${content.slice(0, insertAt)}\n${snippet}${content.slice(insertAt)}`)
}

function main() {
  const dir = parseDirArg()

  const segments = dir.split('/')
  const isNested = segments.length > 1
  const routeName = segments.map(toPascalCase).join('')
  const pageKey = toCamelCase(segments.map(toPascalCase).join(''))

  // 1. 创建页面文件
  const pageDir = path.join(VIEWS_DIR, dir)
  mkdirSync(pageDir, { recursive: true })
  writeFileSync(
    path.join(pageDir, 'index.vue'),
    `<script setup lang="ts">
import { $t } from '@/locales'

defineOptions({ name: '${routeName}' })
</script>

<template>
  <PageHeader :title="$t('page.${pageKey}.title')" icon="ph:layout-duotone" />
</template>
`,
  )
  consola.success(`已创建 src/views/${dir}/index.vue（组件名 ${routeName}）`)

  // 2. 插入语言包键 + App.I18n.Schema 类型声明
  const schemaPath = path.resolve('src/typings/app.d.ts')
  const lastSegment = segments[segments.length - 1]!

  // Schema 类型声明（与语言包无关，仅插入一次）
  insertAfterAnchor(schemaPath, '      page: {', `        ${pageKey}: { title: string }\n`)
  if (isNested) {
    consola.warn(
      'app.d.ts 的 route Schema 请手动添加嵌套声明：\n' +
        `        ${segments[0]}: { title: string; '${lastSegment}': string }`,
    )
  } else {
    insertAfterAnchor(schemaPath, '      route: {', `        '${lastSegment}': string\n`)
  }

  for (const file of LANG_FILES) {
    const langPath = path.join(LANGS_DIR, `${file}.ts`)

    // 页面标题键（page 段，统一顶层插入）
    insertAfterAnchor(langPath, '  page: {', `    ${pageKey}: {\n      title: '${dir}',\n    },\n`)

    if (isNested) {
      // 嵌套分组键插入位置因文件而异，打印片段交由手动添加
      consola.warn(
        `${file}.ts 的 route 段请手动添加嵌套键：\n` +
          `    ${segments[0]}: {\n      title: '${segments[0]}',\n      '${lastSegment}': '${lastSegment}',\n    },`,
      )
    } else {
      insertAfterAnchor(langPath, '  route: {', `    '${lastSegment}': '${lastSegment}',\n`)
    }
  }
  consola.success(
    `已插入语言包键：page.${pageKey}.title${isNested ? '' : ` / route.${lastSegment}`}（含 Schema 声明）`,
  )

  // 3. 生成路由
  const result = spawnSync('npx', ['er', 'generate'], { stdio: 'inherit' })
  if (result.status !== 0) {
    consola.warn('er generate 执行失败，请稍后手动运行 npx er generate')
  }

  // 4. 后续手动步骤提示
  consola.info('剩余手动步骤：')
  consola.info(
    `  1. 在 src/router/_generated/routes.ts 中为 ${routeName} 补 meta（i18nKey/order/isAuth 等）`,
  )
  consola.info('  2. 将语言包占位文案改为实际标题')
  if (isNested) {
    consola.info('  3. 补充 route 段嵌套分组键（见上方片段）')
  }
}

main()
