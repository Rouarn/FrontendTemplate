import { calculatePercentage } from './scroll-utils'
import type { ScrollOptions, ScrollState } from './types'

// 检测移动设备
export function detectMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone']
  const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword))
  const isMobileScreen = window.innerWidth <= 768
  const hasTouch = 'ontouchstart' in window

  return isMobileUA || (isMobileScreen && hasTouch)
}

// 检测平板设备
export function detectTabletDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  const tabletKeywords = ['ipad', 'tablet', 'kindle']
  const isTabletUA = tabletKeywords.some((keyword) => userAgent.includes(keyword))
  const isTabletScreen = window.innerWidth > 768 && window.innerWidth <= 1024
  const hasTouch = 'ontouchstart' in window

  return isTabletUA || (isTabletScreen && hasTouch && !detectMobileDevice())
}

// 更新设备显示状态
export function updateDeviceDisplay(isMobile: boolean, isTablet: boolean) {
  // 查找所有设备标签页
  const deviceTabs = document.querySelectorAll('.device-tabs .tab')

  deviceTabs.forEach((tab) => {
    tab.classList.remove('active')
  })

  // 根据设备类型激活相应标签
  if (isMobile) {
    deviceTabs[2]?.classList.add('active') // 移动端
  } else if (isTablet) {
    deviceTabs[1]?.classList.add('active') // 平板端
  } else {
    deviceTabs[0]?.classList.add('active') // 桌面端
  }
}

// 设置响应式优化
export function setupResponsive(element: HTMLElement, options: ScrollOptions, state: ScrollState) {
  if (!options.responsive) return

  // 检测设备类型
  const isMobile = detectMobileDevice()
  const isTablet = detectTabletDevice()

  // 动态更新设备显示状态
  updateDeviceDisplay(isMobile, isTablet)

  // 监听尺寸变化
  state.resizeObserver = new ResizeObserver(() => {
    // 重新检测设备类型
    const newIsMobile = detectMobileDevice()
    const newIsTablet = detectTabletDevice()
    updateDeviceDisplay(newIsMobile, newIsTablet)

    // 重新计算滚动参数
    if (options.onScroll) {
      const percentage = calculatePercentage(element, options.direction || 'vertical')
      const position = options.direction === 'horizontal' ? element.scrollLeft : element.scrollTop

      options.onScroll({
        position,
        percentage,
        direction: state.direction,
        velocity: state.velocity,
      })
    }
  })

  state.resizeObserver.observe(element)

  // 移动端优化
  if (options.mobileOptimized && isMobile) {
    // 使用类型断言处理 webkit 滚动优化
    element.style.webkitOverflowScrolling = 'touch'
    element.style.overscrollBehavior = 'contain'

    // 移动端禁用鼠标滚轮水平滚动
    options.wheelHorizontal = false
  }
}
