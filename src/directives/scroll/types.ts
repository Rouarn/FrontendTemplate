// 扩展 CSSStyleDeclaration 类型（支持非标准滚动相关属性）
declare global {
  interface CSSStyleDeclaration {
    msOverflowStyle?: string
    webkitOverflowScrolling?: string
  }
}

// 扩展 CSSStyleDeclaration 接口以支持非标准 CSS 属性
export type ExtendedCSSStyleDeclaration = CSSStyleDeclaration & {
  scrollbarWidth?: string
  msOverflowStyle?: string
}

// 滚动数据接口
export interface ScrollData {
  position: number
  percentage: number
  direction: string
  velocity: number
}

// 滚动配置接口
export interface ScrollOptions {
  direction?: 'vertical' | 'horizontal' | 'both'
  threshold?: number
  smooth?: boolean
  showScrollbar?: boolean
  autoScroll?: boolean
  autoScrollSpeed?: number
  responsive?: boolean
  mobileOptimized?: boolean
  touchEnabled?: boolean
  momentum?: boolean
  wheelHorizontal?: boolean // 支持鼠标滚轮水平滚动
  onScroll?: (data: ScrollData) => void
  onScrollStart?: () => void
  onScrollEnd?: () => void
  onEnter?: (el: HTMLElement) => void
  onLeave?: (el: HTMLElement) => void
}

// 滚动状态数据
export interface ScrollState {
  isScrolling: boolean
  lastScrollTop: number
  lastScrollLeft: number
  lastTimestamp: number
  velocity: number
  direction: string
  scrollEndTimer?: number
  autoScrollTimer?: number
  resizeObserver?: ResizeObserver
}

// 扩展元素类型
export interface ElType extends HTMLElement {
  __scrollState?: ScrollState
  __scrollHandler?: () => void
  __wheelHandler?: (event: WheelEvent) => void
  scrollbarWidth?: number
}

/** 兼容函数式绑定值或对象配置 */
export type ScrollBindingValue = ScrollOptions | ((data: ScrollData) => void) | undefined
