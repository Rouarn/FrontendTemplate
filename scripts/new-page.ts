/**
 * 页面脚手架：pnpm new:page
 *
 * 用法：
 *   pnpm new:page                → 交互式输入页面目录
 *   pnpm new:page profile        → 单菜单（顶级路由 /profile）
 *   pnpm new:page settings/users → 菜单组子页（路由 /settings/users）
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
import { createInterface } from 'node:readline/promises'
import { handleError, log, separator, showBanner, showSuccess } from '@vakao-ui/scripts-utils'

const VIEWS_DIR = path.resolve('src/views')
const LANGS_DIR = path.resolve('src/locales/langs')
const LANG_FILES = ['zh-cn', 'en-us'] as const

/** 合法目录名：小写字母/数字，段内用 - 连接，段间用 / 分隔 */
const DIR_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/

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

/** 去除首尾空白与斜杠 */
function normalizeDir(raw: string) {
  return raw.trim().replace(/^\/+|\/+$/g, '')
}

/** 校验目录名：返回错误信息，合法时返回 null */
function validateDir(dir: string): string | null {
  if (!DIR_PATTERN.test(dir)) {
    return `目录名不合法：${dir}。仅允许小写字母/数字，段内用 - 连接，段间用 / 分隔`
  }

  if (existsSync(path.join(VIEWS_DIR, dir))) {
    return `页面目录已存在：src/views/${dir}`
  }

  return null
}

/** 交互式输入目录名：直接回车或 Ctrl+C 视为取消并退出 */
async function readDirFromPrompt(): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  rl.on('SIGINT', () => {
    log('已取消，未创建页面', 'warning')
    process.exit(0)
  })

  try {
    let dir = ''

    while (!dir) {
      const answer = await rl.question('请输入页面目录（如 profile 或 settings/users，回车取消）：')
      const candidate = normalizeDir(answer)

      if (!candidate) {
        log('已取消，未创建页面', 'warning')
        process.exit(0)
      }

      const error = validateDir(candidate)
      if (error) {
        log(error, 'error')
      } else {
        dir = candidate
      }
    }

    return dir
  } finally {
    rl.close()
  }
}

/** 解析目标目录：未传参则交互式输入，传参则校验后使用（非法返回 null） */
async function resolveDir(): Promise<string | null> {
  const raw = process.argv[2]

  if (raw === undefined) {
    return readDirFromPrompt()
  }

  const dir = normalizeDir(raw)
  const error = validateDir(dir)

  if (error) {
    log(error, 'error')
    return null
  }

  return dir
}

/** 在文件锚点行（如 "  route: {"）之后插入代码片段 */
function insertAfterAnchor(filePath: string, anchor: string, snippet: string) {
  const content = readFileSync(filePath, 'utf-8')
  const anchorIndex = content.indexOf(anchor)

  if (anchorIndex === -1) {
    log(`${filePath} 中未找到锚点 "${anchor}"，请手动添加：\n${snippet.trim()}`, 'warning')
    return
  }

  const insertAt = anchorIndex + anchor.length
  writeFileSync(filePath, `${content.slice(0, insertAt)}\n${snippet}${content.slice(insertAt)}`)
}

async function main() {
  showBanner('新建页面')

  const dir = await resolveDir()
  if (!dir) {
    log('未创建页面。用法：pnpm new:page [dir]（如 profile 或 settings/users）', 'warning')
    process.exit(1)
  }

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
  log(`已创建 src/views/${dir}/index.vue（组件名 ${routeName}）`, 'success')

  // 2. 插入语言包键 + App.I18n.Schema 类型声明
  const schemaPath = path.resolve('src/typings/app.d.ts')
  const lastSegment = segments[segments.length - 1]!

  // Schema 类型声明（与语言包无关，仅插入一次）
  insertAfterAnchor(schemaPath, '      page: {', `        ${pageKey}: { title: string }\n`)
  if (isNested) {
    log(
      'app.d.ts 的 route Schema 请手动添加嵌套声明：\n' +
        `        ${segments[0]}: { title: string; '${lastSegment}': string }`,
      'warning',
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
      log(
        `${file}.ts 的 route 段请手动添加嵌套键：\n` +
          `    ${segments[0]}: {\n      title: '${segments[0]}',\n      '${lastSegment}': '${lastSegment}',\n    },`,
        'warning',
      )
    } else {
      insertAfterAnchor(langPath, '  route: {', `    '${lastSegment}': '${lastSegment}',\n`)
    }
  }
  log(
    `已插入语言包键：page.${pageKey}.title${isNested ? '' : ` / route.${lastSegment}`}（含 Schema 声明）`,
    'success',
  )

  // 3. 生成路由
  const result = spawnSync('npx', ['er', 'generate'], { stdio: 'inherit' })
  if (result.status !== 0) {
    log('er generate 执行失败，请稍后手动运行 npx er generate', 'warning')
  }

  // 4. 后续手动步骤提示
  separator()
  log('剩余手动步骤：', 'info')
  log(
    `  1. 在 src/router/_generated/routes.ts 中为 ${routeName} 补 meta（i18nKey/order/isAuth 等）`,
    'info',
  )
  log('  2. 将语言包占位文案改为实际标题', 'info')
  if (isNested) {
    log('  3. 补充 route 段嵌套分组键（见上方片段）', 'info')
  }

  showSuccess(`页面 ${routeName} 创建完成`)
}

main().catch((error) => handleError('页面创建失败', error))
