import type { Directive, DirectiveBinding } from 'vue'

interface HighlightElement extends HTMLElement {
  __highlightOriginalHTML__?: string
}

interface HighlightOptions {
  /** 要高亮的关键词，支持单个或多个关键词 */
  keywords: string | string[]
  /** 高亮元素的CSS类名 */
  className?: string
  /** 自定义样式对象 */
  style?: Partial<CSSStyleDeclaration>
  /** 是否大小写敏感匹配 */
  caseSensitive?: boolean
  /** 是否全词匹配 */
  wholeWord?: boolean
  /** 高亮背景色，支持单个颜色或多个颜色数组 */
  colors: string | string[]
  /** 高亮文本颜色 */
  textColor?: string
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** 净化 class 名，仅允许字母数字连字符，防止属性注入 */
function sanitizeClassName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50)
  return cleaned || 'highlight'
}

/** 净化样式值，移除可闭合属性/标签的字符 */
function sanitizeStyleValue(value: unknown): string {
  return String(value).replace(/["'<>]/g, '')
}

function createHighlightTag(options: HighlightOptions): { start: string; end: string } {
  let styleAttr = ''
  const styles: string[] = []

  // 处理统一的颜色字段（支持单个或数组，这里取第一个值）
  const colorValue = Array.isArray(options.colors) ? options.colors[0] : options.colors
  if (colorValue) {
    styles.push(`background-color: ${sanitizeStyleValue(colorValue)}`)
  }

  // 处理文本颜色
  if (options.textColor) {
    styles.push(`color: ${sanitizeStyleValue(options.textColor)}`)
  }

  // 处理自定义样式
  if (options.style) {
    const customStyles = Object.entries(options.style).map(([key, value]) => `${kebabCase(key)}: ${sanitizeStyleValue(value)}`)
    styles.push(...customStyles)
  }

  // 组合所有样式
  if (styles.length > 0) {
    styleAttr = ` style="${styles.join('; ')}"`
  }

  const className = sanitizeClassName(options.className || 'highlight')

  return {
    start: `<span class="${className}"${styleAttr}>`,
    end: '</span>',
  }
}

function highlightText(html: string, options: HighlightOptions): string {
  // 统一处理关键词数组
  const keywordList = Array.isArray(options.keywords) ? options.keywords : [options.keywords]
  // 统一处理颜色数组
  const colorList = Array.isArray(options.colors) ? options.colors : [options.colors]

  const validKeywords = keywordList.filter((k) => k && k.trim())
  if (validKeywords.length === 0) {
    return html
  }

  // 预建关键词→颜色映射，避免每次匹配重复查找
  const tagCache = new Map<string, { start: string; end: string }>()
  validKeywords.forEach((keyword, index) => {
    const color = colorList[index] || colorList[0] || '#ffeb3b'
    tagCache.set(keyword, createHighlightTag({ ...options, colors: color }))
  })

  // 构建联合正则（所有关键词单次匹配，O(n)）
  const patternParts = validKeywords.map((k) => {
    const escaped = escapeRegExp(k)
    return options.wholeWord ? `\\b${escaped}\\b` : escaped
  })
  const flags = options.caseSensitive ? 'g' : 'gi'
  const regex = new RegExp(patternParts.join('|'), flags)

  // 按 HTML 标签分割：偶数段为纯文本，奇数段为标签（天然避免标签内替换）
  const segments = html.split(/(<[^>]*>)/g)

  for (let i = 0; i < segments.length; i += 2) {
    segments[i] = segments[i].replace(regex, (match) => {
      // 找到匹配的关键词（大小写敏感时精确匹配，否则忽略大小写）
      const matchedKeyword = validKeywords.find((k) => (options.caseSensitive ? k === match : k.toLowerCase() === match.toLowerCase()))
      if (!matchedKeyword) return match
      const tag = tagCache.get(matchedKeyword)!
      return `${tag.start}${match}${tag.end}`
    })
  }

  return segments.join('')
}

function parseOptions(value: unknown): HighlightOptions {
  if (typeof value === 'string') {
    return {
      keywords: value,
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
      colors: '#ffeb3b', // 默认颜色
    }
  }

  if (Array.isArray(value)) {
    return {
      keywords: value,
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
      colors: '#ffeb3b', // 默认颜色
    }
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>

    // 统一处理关键词字段（向后兼容）
    const keywords = obj.keywords || obj.keyword || ''
    // 统一处理颜色字段（向后兼容）
    const colors = obj.colors || obj.color || '#ffeb3b'

    return {
      keywords: keywords as string | string[],
      className: (obj.className as string) || 'highlight',
      style: obj.style as Partial<CSSStyleDeclaration> | undefined,
      caseSensitive: (obj.caseSensitive as boolean) || false,
      wholeWord: (obj.wholeWord as boolean) || false,
      colors: colors as string | string[],
      textColor: obj.textColor as string | undefined,
    }
  }

  return {
    keywords: '',
    className: 'highlight',
    caseSensitive: false,
    wholeWord: false,
    colors: '#ffeb3b',
  }
}

function updateHighlight(el: HighlightElement, binding: DirectiveBinding) {
  const options = parseOptions(binding.value)

  if (!options.keywords || (Array.isArray(options.keywords) && options.keywords.length === 0)) {
    // 如果没有关键词，恢复原始内容
    if (el.__highlightOriginalHTML__) {
      el.innerHTML = el.__highlightOriginalHTML__
    }
    return
  }

  // 获取原始文本内容
  const originalHTML = el.__highlightOriginalHTML__ || el.innerHTML

  // 执行高亮处理
  const highlightedHTML = highlightText(originalHTML, options)

  // 更新元素内容
  el.innerHTML = highlightedHTML
}

/**
 * v-highlight 文本高亮指令
 * 用法：
 * <div v-highlight="'关键词'">包含关键词的文本</div>
 * <div v-highlight="{ keyword: '关键词', className: 'highlight', caseSensitive: false }">文本</div>
 * <div v-highlight="{ keyword: ['关键词1', '关键词2'], style: { backgroundColor: 'yellow' } }">文本</div>
 */
const highlight: Directive = {
  mounted(el: HighlightElement, binding: DirectiveBinding) {
    // 保存原始HTML内容
    el.__highlightOriginalHTML__ = el.innerHTML
    updateHighlight(el, binding)
  },

  updated(el: HighlightElement, binding: DirectiveBinding) {
    updateHighlight(el, binding)
  },

  beforeUnmount(el: HighlightElement) {
    // 恢复原始内容
    if (el.__highlightOriginalHTML__) {
      el.innerHTML = el.__highlightOriginalHTML__
    }
  },
}

// 添加默认样式
if (typeof document !== 'undefined') {
  const styleId = 'v-highlight-default-styles'

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .highlight {
        background-color: #ffeb3b;
        color: #333;
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: 500;
      }

      .highlight-primary {
        background-color: #2196f3;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }

      .highlight-success {
        background-color: #4caf50;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }

      .highlight-warning {
        background-color: #ff9800;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }

      .highlight-error {
        background-color: #f44336;
        color: white;
        padding: 1px 4px;
        border-radius: 3px;
      }
    `
    document.head.appendChild(style)
  }
}

// 导出高亮辅助函数
export const HighlightHelper = {
  /**
   * 手动高亮文本
   */
  highlightText(text: string, keywords: string | string[], options: Partial<HighlightOptions> = {}): string {
    const fullOptions: HighlightOptions = {
      keywords,
      className: 'highlight',
      caseSensitive: false,
      wholeWord: false,
      colors: '#ffeb3b',
      ...options,
    }

    return highlightText(text, fullOptions)
  },

  /**
   * 移除高亮标签
   */
  removeHighlight(html: string): string {
    return html.replace(/<span[^>]*class="[^"]*highlight[^"]*"[^>]*>(.*?)<\/span>/gi, '$1')
  },

  /**
   * 获取高亮的关键词数量
   */
  getHighlightCount(html: string): number {
    const matches = html.match(/<span[^>]*class="[^"]*highlight[^"]*"[^>]*>/gi)
    return matches ? matches.length : 0
  },
}

export default highlight
