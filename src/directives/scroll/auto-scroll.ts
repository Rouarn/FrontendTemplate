import type { ScrollOptions, ScrollState } from './types'

// 启动自动滚动
export function startAutoScroll(element: HTMLElement, options: ScrollOptions, state: ScrollState) {
  if (!options.autoScroll || state.autoScrollTimer) return

  const speed = options.autoScrollSpeed || 50
  const direction = options.direction || 'vertical'

  state.autoScrollTimer = window.setInterval(() => {
    if (direction === 'horizontal') {
      element.scrollLeft += speed / 20
      if (element.scrollLeft >= element.scrollWidth - element.clientWidth) {
        element.scrollLeft = 0
      }
    } else {
      element.scrollTop += speed / 20
      if (element.scrollTop >= element.scrollHeight - element.clientHeight) {
        element.scrollTop = 0
      }
    }
  }, 50)
}

// 停止自动滚动
export function stopAutoScroll(state: ScrollState) {
  if (state.autoScrollTimer) {
    clearInterval(state.autoScrollTimer)
    state.autoScrollTimer = undefined
  }
}
