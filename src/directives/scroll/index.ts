import { startAutoScroll, stopAutoScroll } from './auto-scroll'
import { setupResponsive } from './device-detect'
import { cleanup, handleScroll, handleWheel, normalizeOptions, setScrollbarStyle } from './scroll-utils'
import type { ElType, ScrollBindingValue, ScrollState } from './types'
import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-scroll 滚动指令
 *
 * 仅做组装：设备检测/响应式、自动滚动、滚动事件处理、样式等职责
 * 分别拆分到 device-detect / auto-scroll / scroll-utils 子模块。
 */
const scroll: Directive<HTMLElement, ScrollBindingValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ScrollBindingValue>) {
    const options = normalizeOptions(binding.value)

    // 创建滚动状态
    const state: ScrollState = {
      isScrolling: false,
      lastScrollTop: el.scrollTop,
      lastScrollLeft: el.scrollLeft,
      lastTimestamp: Date.now(),
      velocity: 0,
      direction: 'none',
    }

    // 存储状态到元素上
    ;(el as ElType).__scrollState = state

    // 设置样式
    setScrollbarStyle(el, options)

    // 设置响应式
    setupResponsive(el, options, state)

    // 绑定滚动事件
    const scrollHandler = () => handleScroll(el, options, state)
    el.addEventListener('scroll', scrollHandler, { passive: true })

    // 绑定鼠标滚轮事件（支持水平滚动）
    const wheelHandler = (event: WheelEvent) => handleWheel(event, el, options)
    if (options.direction === 'horizontal' || options.direction === 'both') {
      el.addEventListener('wheel', wheelHandler, { passive: false })
    }

    // 存储事件处理器以便清理
    const elWithHandlers = el as HTMLElement & { __scrollHandler?: () => void; __wheelHandler?: (event: WheelEvent) => void }
    elWithHandlers.__scrollHandler = scrollHandler
    elWithHandlers.__wheelHandler = wheelHandler

    // 启动自动滚动
    if (options.autoScroll) {
      startAutoScroll(el, options, state)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<ScrollBindingValue>) {
    const options = normalizeOptions(binding.value)
    const elementWithState = el as HTMLElement & { __scrollState?: ScrollState; __scrollHandler?: () => void }
    const state = elementWithState.__scrollState

    if (!state) return

    // 更新滚动事件处理器（如果 options 发生了变化，尤其是回调函数）
    if (elementWithState.__scrollHandler) {
      el.removeEventListener('scroll', elementWithState.__scrollHandler)
    }
    const newScrollHandler = () => handleScroll(el, options, state)
    el.addEventListener('scroll', newScrollHandler, { passive: true })
    elementWithState.__scrollHandler = newScrollHandler

    // 更新自动滚动
    if (options.autoScroll) {
      startAutoScroll(el, options, state)
    } else {
      stopAutoScroll(state)
    }

    // 更新样式
    setScrollbarStyle(el, options)
  },

  unmounted(el: HTMLElement) {
    const elementWithHandlers = el as ElType
    const state = elementWithHandlers.__scrollState
    const scrollHandler = elementWithHandlers.__scrollHandler
    const wheelHandler = elementWithHandlers.__wheelHandler

    if (scrollHandler) {
      el.removeEventListener('scroll', scrollHandler)
    }

    if (wheelHandler) {
      el.removeEventListener('wheel', wheelHandler)
    }

    if (state) {
      cleanup(el, state)
    }

    // 清理引用
    delete elementWithHandlers.__scrollState
    delete elementWithHandlers.__scrollHandler
    delete elementWithHandlers.__wheelHandler
  },
}

export default scroll
