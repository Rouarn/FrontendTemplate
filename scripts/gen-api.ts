/**
 * OpenAPI 类型生成：pnpm gen:api
 *
 * 从 NestJS 后端拉取 OpenAPI JSON（/static/api-docs.json），
 * 将 components.schemas 生成为全局命名空间 OpenAPI 下的 interface。
 *
 * 说明：openapi-typescript 官方工具依赖 ts.factory，与 TypeScript 7 不兼容，
 * 故采用本脚本基于 jiti 的轻量实现（覆盖 string/number/boolean/enum/array/$ref/nullable）。
 */
import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { consola } from 'consola'

const API_DOCS_URL = 'http://127.0.0.1:8898/static/api-docs.json'
const OUTPUT_PATH = 'src/typings/openapi.d.ts'

type SchemaObject = {
  type?: string
  format?: string
  enum?: (string | number)[]
  items?: SchemaObject
  properties?: Record<string, SchemaObject>
  required?: string[]
  additionalProperties?: boolean | SchemaObject
  $ref?: string
  nullable?: boolean
  description?: string
}

type OpenAPIDocument = {
  info?: { title?: string; version?: string }
  components?: { schemas?: Record<string, SchemaObject> }
}

/** 将 $ref 路径解析为 schema 名称：#/components/schemas/User → User */
function resolveRef($ref: string): string {
  const name = $ref.split('/').pop()!
  return name
}

/** 将 schema 转换为 TS 类型表达式 */
function toTypeExpression(schema: SchemaObject, indent: string): string {
  if (!schema) return 'unknown'

  if (schema.$ref) return resolveRef(schema.$ref)

  if (schema.enum)
    return schema.enum.map((v) => (typeof v === 'string' ? `'${v}'` : String(v))).join(' | ')

  switch (schema.type) {
    case 'string':
      return 'string'
    case 'integer':
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return `Array<${toTypeExpression(schema.items ?? {}, indent)}>`
    case 'object': {
      const { properties, required } = schema
      if (!properties || Object.keys(properties).length === 0) {
        return schema.additionalProperties ? 'Record<string, unknown>' : 'Record<string, unknown>'
      }
      const lines = Object.entries(properties).map(([key, prop]) => {
        const optional = required?.includes(key) ? '' : '?'
        const desc = prop.description ? ` /** ${prop.description} */\n${indent}  ` : ''
        const type = toTypeExpression(prop, `${indent}  `)
        const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `'${key}'`
        return `${desc}${indent}  ${safeKey}${optional}: ${type}`
      })
      return `{\n${lines.join('\n')}\n${indent}}`
    }
    default:
      return 'unknown'
  }
}

async function main() {
  consola.start(`拉取 OpenAPI 文档：${API_DOCS_URL}`)

  const res = await fetch(API_DOCS_URL)
  if (!res.ok) {
    consola.error(`拉取失败：HTTP ${res.status}，请确认后端服务已启动（默认 127.0.0.1:8898）`)
    process.exit(1)
  }
  const doc = (await res.json()) as OpenAPIDocument
  const schemas = doc.components?.schemas ?? {}

  if (Object.keys(schemas).length === 0) {
    consola.error('文档中未找到 components.schemas，无法生成类型')
    process.exit(1)
  }

  const blocks = Object.entries(schemas).map(([name, schema]) => {
    const desc = schema.description ? `/** ${schema.description} */\n` : ''
    return `${desc}export interface ${name} ${toTypeExpression(schema, '  ')}`
  })

  const header = [
    '/* eslint-disable */',
    '/**',
    ` * 由 pnpm gen:api 自动生成，来源：${API_DOCS_URL}`,
    ` * Schema 版本：${doc.info?.version ?? 'unknown'} — 请勿手改，重新生成会覆盖`,
    ' */',
  ].join('\n')

  const content = `${header}\n\ndeclare namespace OpenAPI {\n${blocks.join('\n\n')}\n}\n`

  writeFileSync(OUTPUT_PATH, content)
  consola.success(`已生成 ${OUTPUT_PATH}（${blocks.length} 个 Schema）`)
}

main().catch((error) => {
  consola.error('类型生成失败：', error)
  process.exit(1)
})
