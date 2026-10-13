import { stopAutoScroll } from './auto-scroll'
import type {
  ExtendedCSSStyleDeclaration,
  ScrollBindingValue,
  ScrollData,
  ScrollOptions,
  ScrollState,
} from './types'

// 计算滚动百分比
export function calculatePercentage(element: HTMLElement, direction: string): number {
  if (direction === 'horizontal') {
    const maxScroll = element.scrollWidth - element.clientWidth
    return maxScroll > 0 ? (element.scrollLeft / maxScroll) * 100 : 0
  } else {
    const maxScroll = element.scrollHeight - element.clientHeight
    return maxScroll > 0 ? (element.scrollTop / maxScroll) * 100 : 0
  }
}

// 计算滚动方向
export function calculateDirection(
  currentTop: number,
  currentLeft: number,
  lastTop: number,
  lastLeft: number,
  direction: string,
): string {
  if (direction === 'horizontal') {
    if (currentLeft > lastLeft) return 'right'
    if (currentLeft < lastLeft) return 'left'
  } else if (direction === 'vertical') {
    if (currentTop > lastTop) return 'down'
    if (currentTop < lastTop) return 'up'
  } else if (direction === 'both') {
    const vDiff = Math.abs(currentTop - lastTop)
    const hDiff = Math.abs(currentLeft - lastLeft)
    if (vDiff > hDiff) {
      return currentTop > lastTop ? 'down' : 'up'
    } else if (hDiff > 0) {
      return currentLeft > lastLeft ? 'right' : 'left'
    }
  }
  return 'none'
}

// 处理滚动事件
export function handleScroll(element: HTMLElement, options: ScrollOptions, state: ScrollState) {
  const now = Date.now()
  const deltaTime = now - state.lastTimestamp

  const currentTop = element.scrollTop
  const currentLeft = element.scrollLeft

  // 计算滚动速度
  if (deltaTime > 0) {
    const deltaY = Math.abs(currentTop - state.lastScrollTop)
    const deltaX = Math.abs(currentLeft - state.lastScrollLeft)
    const delta = options.direction === 'horizontal' ? deltaX : deltaY
    state.velocity = (delta / deltaTime) * 1000 // px/s
  }

  // 计算滚动方向
  const direction = calculateDirection(
    currentTop,
    currentLeft,
    state.lastScrollTop,
    state.lastScrollLeft,
    options.direction || 'vertical',
  )

  // 计算滚动百分比
  const percentage = calculatePercentage(element, options.direction || 'vertical')

  // 计算滚动位置
  const position = options.direction === 'horizontal' ? currentLeft : currentTop

  // 创建滚动数据
  const scrollData: ScrollData = {
    position,
    percentage,
    direction,
    velocity: state.velocity,
  }

  // 触发滚动回调
  if (options.onScroll) {
    options.onScroll(scrollData)
  }

  // 更新状态
  state.lastScrollTop = currentTop
  state.lastScrollLeft = currentLeft
  state.lastTimestamp = now
  state.direction = direction

  // 处理滚动开始
  if (!state.isScrolling) {
    state.isScrolling = true
    if (options.onScrollStart) {
      options.onScrollStart()
    }
  }

  // 处理滚动结束
  if (state.scrollEndTimer) {
    clearTimeout(state.scrollEndTimer)
  }

  state.scrollEndTimer = window.setTimeout(() => {
    state.isScrolling = false
    if (options.onScrollEnd) {
      options.onScrollEnd()
    }
  }, 150)
}

// 处理鼠标滚轮事件（支持水平滚动）
export function handleWheel(event: WheelEvent, element: HTMLElement, options: ScrollOptions) {
  // 只在水平滚动模式下处理
  if (options.direction === 'horizontal' && options.wheelHorizontal !== false) {
    event.preventDefault()

    // 根据滚轮方向计算滚动距离
    const deltaY = event.deltaY || event.detail || 0
    const scrollAmount = deltaY * 2 // 调整滚动灵敏度

    // 执行水平滚动
    element.scrollLeft += scrollAmount
  }

  // 支持双向滚动
  if (options.direction === 'both') {
    // 检测 Shift 键按下，切换为水平滚动
    if (event.shiftKey) {
      event.preventDefault()
      const deltaY = event.deltaY || event.detail || 0
      const scrollAmount = deltaY * 2
      element.scrollLeft += scrollAmount
    }
  }
}

// 设置滚动条样式
export function setScrollbarStyle(element: HTMLElement, options: ScrollOptions) {
  if (options.showScrollbar === false) {
    // 使用扩展接口处理非标准 CSS 属性
    const extendedStyle = element.style as ExtendedCSSStyleDeclaration
    extendedStyle.scrollbarWidth = 'none'
    // 处理 IE/Edge 滚动条隐藏
    extendedStyle.msOverflowStyle = 'none'

    // 添加 webkit 滚动条隐藏样式（单例守卫，避免多次挂载堆积 <style> 标签）
    const styleId = 'v-scroll-hidden-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .v-scroll-hidden::-webkit-scrollbar {
          display: none;
        }
      `
      document.head.appendChild(style)
    }
    element.classList.add('v-scroll-hidden')
  }

  // 设置平滑滚动
  if (options.smooth) {
    element.style.scrollBehavior = 'smooth'
  }
}

// 清理函数
export function cleanup(element: HTMLElement, state: ScrollState) {
  stopAutoScroll(state)

  if (state.scrollEndTimer) {
    clearTimeout(state.scrollEndTimer)
  }

  if (state.resizeObserver) {
    state.resizeObserver.disconnect()
  }

  element.classList.remove('v-scroll-hidden')
}

// 规范化配置选项
export function normalizeOptions(value: ScrollBindingValue): ScrollOptions {
  if (typeof value === 'function') {
    return { onScroll: value }
  }
  return value || {}
}
