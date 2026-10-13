import type { Directive, DirectiveBinding } from 'vue'

// 动画配置接口
interface AnimateOptions {
  name?: string
  duration?: number
  delay?: number
  iteration?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  timingFunction?: string
  trigger?: 'immediate' | 'hover' | 'click' | 'visible'
  disabled?: boolean
}

// 动画数据
interface AnimateData {
  observer?: IntersectionObserver
  animation?: Animation
  originalTransform?: string
  originalTransition?: string
}

// 预定义动画
const animations = {
  // 淡入
  fadeIn: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 2000, fill: 'forwards' },
  },
  // 淡出
  fadeOut: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 500, fill: 'forwards' },
  },
  // 从左侧滑入
  slideInLeft: {
    keyframes: [
      { transform: 'translateX(-100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  // 从右侧滑入
  slideInRight: {
    keyframes: [
      { transform: 'translateX(100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  // 从上方滑入
  slideInUp: {
    keyframes: [
      { transform: 'translateY(100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  // 从下方滑入
  slideInDown: {
    keyframes: [
      { transform: 'translateY(-100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    options: { duration: 600, fill: 'forwards' },
  },
  // 放大进入
  zoomIn: {
    keyframes: [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    options: { duration: 500, fill: 'forwards' },
  },
  // 缩小退出
  zoomOut: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0)', opacity: 0 },
    ],
    options: { duration: 500, fill: 'forwards' },
  },
  // 弹跳
  bounce: {
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-30px)' },
      { transform: 'translateY(0)' },
      { transform: 'translateY(-15px)' },
      { transform: 'translateY(0)' },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
  // 摇晃
  shake: {
    keyframes: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' },
    ],
    options: { duration: 500, fill: 'forwards' },
  },
  // 摇摆
  swing: {
    keyframes: [
      { transform: 'rotate3d(0, 0, 1, 0deg)' },
      { transform: 'rotate3d(0, 0, 1, 15deg)' },
      { transform: 'rotate3d(0, 0, 1, -10deg)' },
      { transform: 'rotate3d(0, 0, 1, 5deg)' },
      { transform: 'rotate3d(0, 0, 1, -5deg)' },
      { transform: 'rotate3d(0, 0, 1, 0deg)' },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
  // 脉冲
  pulse: {
    keyframes: [
      { transform: 'scale3d(1, 1, 1)' },
      { transform: 'scale3d(1.05, 1.05, 1.05)' },
      { transform: 'scale3d(1, 1, 1)' },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
  // X轴翻转
  flipInX: {
    keyframes: [
      { transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: 0 },
      { transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', opacity: 1 },
      { transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)' },
      { transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)' },
      { transform: 'perspective(400px)' },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
  // 旋转进入
  rotateIn: {
    keyframes: [
      { transform: 'rotate3d(0, 0, 1, -200deg)', opacity: 0 },
      { transform: 'rotate3d(0, 0, 1, 0)', opacity: 1 },
    ],
    options: { duration: 1000, fill: 'forwards' },
  },
}

// 执行动画
function playAnimation(el: HTMLElement, binding: DirectiveBinding<AnimateOptions | string>) {
  const animateData = (el as HTMLElement & { __animateData?: AnimateData }).__animateData
  if (!animateData) return

  // 如果有正在播放的动画，先取消
  if (animateData.animation) {
    animateData.animation.cancel()
  }

  const options = typeof binding.value === 'string' ? { name: binding.value } : binding.value || {}

  if (options.disabled || !options.name) return

  const {
    name = 'fadeIn',
    duration = 500,
    delay = 0,
    iteration = 1,
    direction = 'normal',
    fillMode = 'forwards',
    timingFunction = 'ease',
  } = options

  // 获取预定义动画
  const animation = animations[name as keyof typeof animations]
  if (!animation) {
    console.warn(`Animation '${name}' not found`)
    return
  }

  // 设置动画选项
  const animationOptions: KeyframeAnimationOptions = {
    duration,
    delay,
    iterations:
      typeof iteration === 'number' ? iteration : iteration === 'infinite' ? Infinity : undefined,
    direction,
    fill: fillMode as FillMode,
    easing: timingFunction,
  }

  // 执行动画
  animateData.animation = el.animate(animation.keyframes, animationOptions)

  // 分发动画开始事件
  el.dispatchEvent(
    new CustomEvent('animationstart', { detail: { name, options }, bubbles: true, composed: true }),
  )

  // 动画完成后重置状态
  animateData.animation.addEventListener('finish', () => {
    animateData.animation = undefined
    // 分发动画结束事件
    el.dispatchEvent(
      new CustomEvent('animationend', { detail: { name, options }, bubbles: true, composed: true }),
    )
  })
}

// 处理可见性触发
function handleVisibilityTrigger(
  el: HTMLElement,
  binding: DirectiveBinding<AnimateOptions | string>,
) {
  const animateData = (el as HTMLElement & { __animateData?: AnimateData }).__animateData
  if (!animateData) return

  // 创建 Intersection Observer
  animateData.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playAnimation(el, binding)
          // 一次性动画，观察完成后断开连接
          if (animateData.observer) {
            animateData.observer.disconnect()
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  )

  animateData.observer.observe(el)
}

// 处理悬停触发
function handleMouseEnter(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (
    el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }
  ).__animateBinding
  if (binding) playAnimation(el, binding)
}

// 处理点击触发
function handleClick(event: Event) {
  const el = event.currentTarget as HTMLElement
  const binding = (
    el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }
  ).__animateBinding
  if (binding) playAnimation(el, binding)
}

// 绑定动画
function bindAnimate(el: HTMLElement, binding: DirectiveBinding<AnimateOptions | string>) {
  const options = typeof binding.value === 'string' ? { name: binding.value } : binding.value || {}

  // 存储数据
  ;(
    el as HTMLElement & {
      __animateBinding?: DirectiveBinding<AnimateOptions | string>
      __animateData?: AnimateData
    }
  ).__animateBinding = binding
  ;(
    el as HTMLElement & {
      __animateBinding?: DirectiveBinding<AnimateOptions | string>
      __animateData?: AnimateData
    }
  ).__animateData = {
    originalTransform: el.style.transform,
    originalTransition: el.style.transition,
  }

  const { trigger = 'immediate' } = options

  // 根据触发方式绑定事件
  switch (trigger) {
    case 'immediate':
      // 立即执行动画
      setTimeout(() => playAnimation(el, binding), 0)
      break
    case 'hover':
      el.addEventListener('mouseenter', handleMouseEnter)
      break
    case 'click':
      el.addEventListener('click', handleClick)
      break
    case 'visible':
      handleVisibilityTrigger(el, binding)
      break
  }
}

// 解绑动画
function unbindAnimate(el: HTMLElement) {
  const animateData = (el as HTMLElement & { __animateData?: AnimateData }).__animateData

  // 断开观察器
  if (animateData?.observer) {
    animateData.observer.disconnect()
  }

  // 移除事件监听
  el.removeEventListener('mouseenter', handleMouseEnter)
  el.removeEventListener('click', handleClick)

  // 恢复原始样式
  if (animateData) {
    if (animateData.originalTransform !== undefined) {
      el.style.transform = animateData.originalTransform
    }
    if (animateData.originalTransition !== undefined) {
      el.style.transition = animateData.originalTransition
    }
  }

  // 清理数据
  delete (
    el as HTMLElement & {
      __animateBinding?: DirectiveBinding<AnimateOptions | string>
      __animateData?: AnimateData
    }
  ).__animateBinding
  delete (
    el as HTMLElement & {
      __animateBinding?: DirectiveBinding<AnimateOptions | string>
      __animateData?: AnimateData
    }
  ).__animateData
}

// 更新动画

// 动画指令
const animate: Directive<HTMLElement, AnimateOptions | string> = {
  mounted(el, binding) {
    bindAnimate(el, binding)
  },

  updated(el, binding) {
    // 如果配置发生变化，重新绑定
    const oldBinding = (
      el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }
    ).__animateBinding
    if (JSON.stringify(oldBinding?.value) !== JSON.stringify(binding.value)) {
      unbindAnimate(el)
      bindAnimate(el, binding)
    } else {
      // 即使配置没有变化，也要更新 binding，以便 oldBinding 在下一次更新时是正确的
      ;(
        el as HTMLElement & { __animateBinding?: DirectiveBinding<AnimateOptions | string> }
      ).__animateBinding = binding
    }
  },

  beforeUnmount(el) {
    unbindAnimate(el)
  },
}

export default animate
