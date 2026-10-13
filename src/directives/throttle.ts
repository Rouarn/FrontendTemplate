/**
 * v-throttle
 * 节流指令：每隔 delay 时间最多执行一次，用于限制高频事件的触发频率。
 * 接收参数：Function 或 { fn: Function, delay?: number, event?: string }
 */

import type { Directive, DirectiveBinding } from 'vue'

interface ThrottleOptions {
  fn: (event?: Event) => void
  delay?: number
  event?: string
}

interface ElType extends HTMLElement {
  __throttleHandler__?: (event: Event) => void
  __throttleLastTime__?: number
  __throttleOptions__?: ThrottleOptions
}

function getOptions(binding: DirectiveBinding<(() => void) | ThrottleOptions>): ThrottleOptions {
  if (typeof binding.value === 'function') {
    return { fn: binding.value }
  }
  return binding.value
}

const throttle: Directive<ElType, (() => void) | ThrottleOptions> = {
  mounted(el, binding) {
    const options = getOptions(binding)
    el.__throttleOptions__ = options
    const { event = 'click' } = options

    el.__throttleHandler__ = function (e: Event) {
      const { fn, delay = 1000 } = el.__throttleOptions__!
      const now = Date.now()

      if (!el.__throttleLastTime__ || now - el.__throttleLastTime__ >= delay) {
        fn.call(el, e)
        el.__throttleLastTime__ = now
      }
    }

    el.addEventListener(event, el.__throttleHandler__)
  },

  updated(el, binding) {
    const options = getOptions(binding)
    const oldOptions =
      typeof binding.oldValue === 'function'
        ? { fn: binding.oldValue }
        : (binding.oldValue as ThrottleOptions)

    const event = options.event || 'click'
    const oldEvent = oldOptions?.event || 'click'

    if (event !== oldEvent) {
      if (el.__throttleHandler__) {
        el.removeEventListener(oldEvent, el.__throttleHandler__)
      }
      el.addEventListener(event, el.__throttleHandler__!)
    }

    el.__throttleOptions__ = options
  },

  beforeUnmount(el, binding) {
    const options = getOptions(binding)
    const event = options.event || 'click'

    if (el.__throttleHandler__) {
      el.removeEventListener(event, el.__throttleHandler__)
    }
    delete el.__throttleHandler__
    delete el.__throttleLastTime__
    delete el.__throttleOptions__
  },
}

export default throttle
