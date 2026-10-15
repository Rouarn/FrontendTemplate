/**
 * 页面脚手架：pnpm new:page
 *
 * 用法：
 *   pnpm new:page                → 交互式输入页面目录
 *   pnpm new:page profile        → 单菜单（顶级路由 /profile）
 *   pnpm new:page settings/users → 菜单组子页（路由 /settings/users）
 *
 * 目录支持任意层数：段内用 - 连接，段间用 / 分隔（如 demos/forms/basic）
 *
 * 键名约定（均按路径层级嵌套，与菜单分组约定一致）：
 *   page.<段.段.段>.title        页面标题
 *   route.<段>…<段>.title        各级分组标题
 *   route.<段>…<段>             叶子路由的 i18nKey
 *
 * 完成内容（全部自动写入，无需手动补充）：
 *   1. 创建 src/views/<dir>/index.vue（含与路由名一致的 defineOptions name）
 *   2. zh-cn / en-us 语言包：page 段按路径嵌套写入标题键
 *   3. zh-cn / en-us 语言包：route 段按路径嵌套写入分组与叶子键（已存在的分组自动合并）
 *   4. src/typings/app.d.ts：同步 page / route 两段的嵌套类型声明
 *   5. 执行 er generate 生成路由，并回填新路由的 meta.i18nKey
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

/** 合法标识符键（无需引号） */
const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/

/** kebab 段 → PascalCase：loading-demo → LoadingDemo */
function toPascalCase(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** 键名仅在不是合法标识符时加引号，与语言包既有风格一致 */
function formatKey(key: string) {
  return IDENTIFIER_PATTERN.test(key) ? key : `'${key}'`
}

/** 跳过字符串字面量，返回其结束后的下标 */
function skipString(content: string, startIndex: number) {
  const quote = content[startIndex]
  let index = startIndex + 1

  while (index < content.length) {
    const char = content[index]

    if (char === '\\') {
      index += 2
      continue
    }

    if (char === quote) return index + 1

    index += 1
  }

  return content.length
}

/** 跳过注释，返回其结束后的下标 */
function skipComment(content: string, startIndex: number) {
  if (content[startIndex + 1] === '/') {
    const end = content.indexOf('\n', startIndex)
    return end === -1 ? content.length : end
  }

  const end = content.indexOf('*/', startIndex + 2)
  return end === -1 ? content.length : end + 2
}

/** 跳过空白，返回首个非空白字符的下标 */
function skipSpace(content: string, startIndex: number) {
  let index = startIndex

  while (index < content.length && /\s/.test(content[index])) index += 1

  return index
}

/** 跳过成对方括号，返回其结束后的下标 */
function skipBracket(content: string, startIndex: number) {
  let depth = 0
  let index = startIndex

  while (index < content.length) {
    const char = content[index]

    if (char === "'" || char === '"' || char === '`') {
      index = skipString(content, index)
      continue
    }

    if (char === '/' && (content[index + 1] === '/' || content[index + 1] === '*')) {
      index = skipComment(content, index)
      continue
    }

    if (char === '[') {
      depth += 1
    } else if (char === ']') {
      depth -= 1
      if (depth === 0) return index + 1
    }

    index += 1
  }

  return content.length
}

/** 由 { 的下标定位与之匹配的 } 的下标（跳过字符串与注释中的括号） */
function findObjectEnd(content: string, startIndex: number) {
  let depth = 0
  let index = startIndex

  while (index < content.length) {
    const char = content[index]

    if (char === "'" || char === '"' || char === '`') {
      index = skipString(content, index)
      continue
    }

    if (char === '/' && (content[index + 1] === '/' || content[index + 1] === '*')) {
      index = skipComment(content, index)
      continue
    }

    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) return index
    }

    index += 1
  }

  handleError('模板文件格式异常', `未找到下标 ${startIndex} 处对象的结束括号`)
}

/** 若下标处是「键:」，返回键名与冒号后的下标 */
function matchKeyAt(content: string, index: number) {
  const char = content[index]
  let keyEnd = index

  if (char === "'" || char === '"' || char === '`') {
    keyEnd = skipString(content, index)
  } else if (IDENTIFIER_PATTERN.test(char)) {
    keyEnd = index + 1
    while (keyEnd < content.length && /[\w$]/.test(content[keyEnd])) keyEnd += 1
  } else {
    return null
  }

  const afterColon = skipSpace(content, keyEnd)
  if (content[afterColon] !== ':') return null

  const key =
    char === "'" || char === '"' || char === '`'
      ? content.slice(index + 1, keyEnd - 1)
      : content.slice(index, keyEnd)

  return { key, afterColon: afterColon + 1 }
}

/** 在对象字面量第一层查找键，返回其值的下标；未找到返回 null */
function findValueStart(content: string, objStart: number, key: string) {
  let index = objStart + 1

  while (index < content.length) {
    const char = content[index]

    if (char === '}') return null

    if (char === '{') {
      index = findObjectEnd(content, index) + 1
      continue
    }

    if (char === '[') {
      index = skipBracket(content, index)
      continue
    }

    if (char === '/' && (content[index + 1] === '/' || content[index + 1] === '*')) {
      index = skipComment(content, index)
      continue
    }

    const matched = matchKeyAt(content, index)

    if (matched) {
      const valueStart = skipSpace(content, matched.afterColon)
      if (matched.key === key) return valueStart
      index = valueStart
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      index = skipString(content, index)
      continue
    }

    index += 1
  }

  return null
}

/** 查找对象第一层的子对象，返回其 { 的下标；键不存在或值不是对象时返回 null */
function findChildObject(content: string, objStart: number, key: string) {
  const valueStart = findValueStart(content, objStart, key)
  return valueStart !== null && content[valueStart] === '{' ? valueStart : null
}

/**
 * 在对象的关闭括号前插入条目，缩进与既有条目对齐
 * withComma 为 true 时给上一个缺逗号的条目补逗号（语言包风格）；
 * 为 false 时不补逗号（app.d.ts 类型声明的多行无逗号风格）
 */
function insertChild(
  content: string,
  objStart: number,
  buildBlock: (indent: string) => string,
  withComma = true,
): string {
  const objEnd = findObjectEnd(content, objStart)
  const closeLineStart = content.lastIndexOf('\n', objEnd) + 1
  const closeIndent = content.slice(closeLineStart, objEnd)
  const objLineStart = content.lastIndexOf('\n', objStart) + 1
  const objLineMatch = content.slice(objLineStart, objStart).match(/^\s*/)
  const baseIndent = /^\s*$/.test(closeIndent) ? closeIndent : (objLineMatch?.[0] ?? '  ')
  const before = content.slice(0, objEnd).trimEnd()
  const lastChar = before.slice(-1)
  const comma = withComma && lastChar !== ',' && lastChar !== '{' ? ',' : ''

  return `${before}${comma}\n${buildBlock(`${baseIndent}  `)}\n${baseIndent}${content.slice(objEnd)}`
}

/** 按路径层级把键写入目标段，返回更新后的文本；锚点缺失或键冲突时直接终止 */
function applyNestedKeys(
  content: string,
  anchor: string,
  segments: string[],
  buildBlock: (segments: string[], indent: string) => string,
  withComma = true,
) {
  const anchorIndex = content.indexOf(anchor)

  if (anchorIndex === -1) {
    handleError('页面键写入失败', `未找到锚点 ${anchor.trim()}`)
  }

  let objStart = anchorIndex + anchor.length - 1

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    const child = findChildObject(content, objStart, segment)

    if (child !== null) {
      objStart = child
      continue
    }

    if (findValueStart(content, objStart, segment) !== null) {
      handleError(
        '页面键写入失败',
        `${anchor.trim()} 中已存在 ${segments.slice(0, index + 1).join('.')} 且不是分组对象，请先手动调整`,
      )
    }

    // 中间分组缺失：把剩余层级整体插入当前对象
    return insertChild(
      content,
      objStart,
      (indent) => buildBlock(segments.slice(index), indent),
      withComma,
    )
  }

  const leaf = segments[segments.length - 1]

  if (findValueStart(content, objStart, leaf) !== null) {
    return content
  }

  return insertChild(content, objStart, (indent) => buildBlock([leaf], indent), withComma)
}

/** page 段语言包：按路径嵌套，仅叶子带 title */
function buildLangPageBlock(segments: string[], indent: string, title: string): string {
  const [head, ...rest] = segments
  const key = formatKey(head)

  if (rest.length === 0) {
    return [`${indent}${key}: {`, `${indent}  title: '${title}',`, `${indent}},`].join('\n')
  }

  return [`${indent}${key}: {`, buildLangPageBlock(rest, `${indent}  `, title), `${indent}},`].join(
    '\n',
  )
}

/** route 段语言包：各级分组带 title，叶子为段名 */
function buildLangRouteBlock(segments: string[], indent: string): string {
  const [head, ...rest] = segments
  const key = formatKey(head)

  if (rest.length === 0) {
    return `${indent}${key}: '${head}',`
  }

  return [
    `${indent}${key}: {`,
    `${indent}  title: '${head}',`,
    buildLangRouteBlock(rest, `${indent}  `),
    `${indent}},`,
  ].join('\n')
}

/** page 段类型声明：按路径嵌套，仅叶子带 title */
function buildTypePageBlock(segments: string[], indent: string): string {
  const [head, ...rest] = segments
  const key = formatKey(head)

  if (rest.length === 0) {
    return [`${indent}${key}: {`, `${indent}  title: string`, `${indent}}`].join('\n')
  }

  return [`${indent}${key}: {`, buildTypePageBlock(rest, `${indent}  `), `${indent}}`].join('\n')
}

/** route 段类型声明：各级分组带 title，叶子为 string，与既有 Schema 的多行风格一致 */
function buildTypeRouteBlock(segments: string[], indent: string): string {
  const [head, ...rest] = segments
  const key = formatKey(head)

  if (rest.length === 0) {
    return `${indent}${key}: string`
  }

  return [
    `${indent}${key}: {`,
    `${indent}  title: string`,
    buildTypeRouteBlock(rest, `${indent}  `),
    `${indent}}`,
  ].join('\n')
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
      const answer = await rl.question(
        '请输入页面目录（如 profile 或 settings/users，可多层；回车取消）：',
      )
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

/** 在 er generate 产物的路由 meta 中回填 i18nKey（生成器只补缺失属性，不会覆盖手写 meta） */
function writeRouteI18nKey(routeName: string, i18nKey: string) {
  const filePath = path.resolve('src/router/_generated/routes.ts')
  const content = readFileSync(filePath, 'utf-8')
  const nameIndex = content.indexOf(`name: '${routeName}'`)

  if (nameIndex === -1) {
    log(`${filePath} 中未找到路由 ${routeName}，请手动补充 meta.i18nKey`, 'warning')
    return
  }

  const metaIndex = content.indexOf('meta: {', nameIndex)

  if (metaIndex === -1) {
    log(`路由 ${routeName} 的 meta 未生成，请手动补充 i18nKey`, 'warning')
    return
  }

  const objStart = metaIndex + 'meta: {'.length - 1

  if (findValueStart(content, objStart, 'i18nKey') !== null) {
    return
  }

  writeFileSync(
    filePath,
    insertChild(content, objStart, (indent) => `${indent}i18nKey: '${i18nKey}',`),
  )
}

async function main() {
  showBanner('新建页面')

  const dir = await resolveDir()
  if (!dir) {
    log('未创建页面。用法：pnpm new:page [dir]（如 profile 或 settings/users）', 'warning')
    process.exit(1)
  }

  const segments = dir.split('/')
  const routeName = segments.map(toPascalCase).join('')
  const pageKey = `page.${segments.join('.')}.title`
  const routeKey = `route.${segments.join('.')}`

  // 1. 语言包与类型声明先在内存中生成，全部生成成功后再统一落盘
  const updates: { filePath: string; content: string }[] = []

  for (const file of LANG_FILES) {
    const filePath = path.join(LANGS_DIR, `${file}.ts`)

    let content = applyNestedKeys(
      readFileSync(filePath, 'utf-8'),
      '\n  page: {',
      segments,
      (rest, indent) => buildLangPageBlock(rest, indent, dir),
    )
    content = applyNestedKeys(content, '\n  route: {', segments, buildLangRouteBlock)

    updates.push({ filePath, content })
  }

  const schemaPath = path.resolve('src/typings/app.d.ts')

  let schemaContent = applyNestedKeys(
    readFileSync(schemaPath, 'utf-8'),
    '\n      page: {',
    segments,
    buildTypePageBlock,
    false,
  )
  schemaContent = applyNestedKeys(
    schemaContent,
    '\n      route: {',
    segments,
    buildTypeRouteBlock,
    false,
  )

  updates.push({ filePath: schemaPath, content: schemaContent })
  updates.forEach(({ filePath, content }) => writeFileSync(filePath, content))
  log(`已写入语言包键：${pageKey} / ${routeKey}，并同步 App.I18n.Schema`, 'success')

  // 2. 创建页面文件
  const pageDir = path.join(VIEWS_DIR, dir)
  mkdirSync(pageDir, { recursive: true })
  writeFileSync(
    path.join(pageDir, 'index.vue'),
    `<script setup lang="ts">
import { $t } from '@/locales'

defineOptions({ name: '${routeName}' })
</script>

<template>
  <PageHeader :title="$t('${pageKey}')" icon="ph:layout-duotone" />
</template>
`,
  )
  log(`已创建 src/views/${dir}/index.vue（组件名 ${routeName}）`, 'success')

  // 3. 生成路由
  const result = spawnSync('npx', ['er', 'generate'], { stdio: 'inherit' })

  if (result.status !== 0) {
    log('er generate 执行失败，请稍后手动运行 npx er generate', 'warning')
  } else {
    writeRouteI18nKey(routeName, routeKey)
    log(`已回填路由 meta.i18nKey：${routeKey}`, 'success')
  }

  // 4. 收尾提示
  separator()
  log('剩余手动步骤：', 'info')
  log('  1. 将语言包占位文案改为实际标题', 'info')
  log(`  2. 按需为 ${routeName} 的 meta 补充 order / isKeepAlive 等`, 'info')

  showSuccess(`页面 ${routeName} 创建完成`)
}

main().catch((error) => handleError('页面创建失败', error))
