import type { RequestError } from '@vakao/axios'

interface ValidationErrorItem {
  field?: unknown
  messages?: unknown
}

/** 收集字符串（支持 string 与 string[]，用于提取顶层 message） */
function collectStrings(value: unknown, output: string[]): void {
  if (typeof value === 'string') {
    const text = value.trim()
    if (text) output.push(text)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output))
  }
}

/**
 * 从 data.validationErrors 提取用户可见的校验错误文案
 *
 * 结构：[{ field: string, messages: string[] }]
 * 只取 messages 内容，绝不向用户暴露 field 等内部字段名
 */
function extractValidationMessages(data: unknown): string[] {
  if (!data || typeof data !== 'object') return []
  const list = (data as Record<string, unknown>).validationErrors
  if (!Array.isArray(list)) return []

  const result: string[] = []
  list.forEach((item: ValidationErrorItem) => {
    if (item && typeof item === 'object') collectStrings(item.messages, result)
  })
  return result
}

/**
 * 从错误响应信封提取用户可见文案（nestjs-template 信封 { code, message, timestamp, data }）
 *
 * - 顶层 message（string | string[]）作为主消息
 * - data.validationErrors 中的 messages 作为编号详情列表（不显示 field）
 * - 不递归 data 的其他内容，避免内部字段名泄露给用户
 */
function extractBodyMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return ''
  const record = body as Record<string, unknown>

  const mainParts: string[] = []
  collectStrings(record.message, mainParts)
  const main = mainParts.join('；')

  const validationMessages = extractValidationMessages(record.data)
  if (validationMessages.length === 0) return main

  const detail = validationMessages.map((text, index) => `${index + 1}. ${text}`).join('\n')
  return main ? `${main}\n原因：\n${detail}` : `原因：\n${detail}`
}

/** 传输层错误（无响应体）的类型兜底文案 */
const FALLBACK_MESSAGE: Partial<Record<RequestError['type'], string>> = {
  network: '网络连接异常，请检查网络',
  timeout: '请求超时，请稍后重试',
}

/**
 * 解析接口错误的用户可见提示文案
 *
 * 通用库不提供任何文案，完整错误信息挂在 error 上，这里统一处理：
 * - timeout / network：按错误类型映射项目文案
 * - business / http：从原始响应体 error.response.data 提取信封文案，提取不到兜底「请求失败」
 * - cancel：不会进入 onError，无需文案
 */
export function resolveErrorMessage(error: RequestError): string {
  const fallback = FALLBACK_MESSAGE[error.type]
  if (fallback) return fallback
  return extractBodyMessage(error.response?.data) || '请求失败'
}
