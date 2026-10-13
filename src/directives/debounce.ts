/**
 * v-debounce
 * 防抖指令：事件触发后延迟一定时间再执行，如果在延迟时间内再次触发，则重新计时。
 * 接收参数：Function 或 { fn: Function, delay?: number, immediate?: boolean, event?: string }
 */

import type { Directive, DirectiveBinding } from 'vue'

interface DebounceOptions {
  fn: (event?: Event) => void
  delay?: number
  immediate?: boolean
  event?: string
}

interface ElType extends HTMLElement {
  __debounceHandler__?: (event: Event) => void
  __debounceTimer__?: ReturnType<typeof setTimeout> | null
  __debounceOptions__?: DebounceOptions
}

function getOptions(binding: DirectiveBinding<(() => void) | DebounceOptions>): DebounceOptions {
  if (typeof binding.value === 'function') {
    return { fn: binding.value }
  }
  return binding.value
}

const debounce: Directive<ElType, (() => void) | DebounceOptions> = {
  mounted(el, binding) {
    const options = getOptions(binding)
    el.__debounceOptions__ = options
    const { event = 'click' } = options

    el.__debounceHandler__ = function (e: Event) {
      const { fn, delay = 500, immediate = false } = el.__debounceOptions__!

      if (el.__debounceTimer__) {
        clearTimeout(el.__debounceTimer__)
      }

      if (immediate) {
        const callNow = !el.__debounceTimer__
        el.__debounceTimer__ = setTimeout(() => {
          el.__debounceTimer__ = null
        }, delay)
        if (callNow) fn.call(el, e)
      } else {
        el.__debounceTimer__ = setTimeout(() => {
          fn.call(el, e)
          el.__debounceTimer__ = null
        }, delay)
      }
    }

    el.addEventListener(event, el.__debounceHandler__)
  },

  updated(el, binding) {
    const options = getOptions(binding)
    const oldOptions =
      typeof binding.oldValue === 'function'
        ? { fn: binding.oldValue }
        : (binding.oldValue as DebounceOptions)

    const event = options.event || 'click'
    const oldEvent = oldOptions?.event || 'click'

    if (event !== oldEvent) {
      if (el.__debounceHandler__) {
        el.removeEventListener(oldEvent, el.__debounceHandler__)
      }
      el.addEventListener(event, el.__debounceHandler__!)
    }

    el.__debounceOptions__ = options
  },

  beforeUnmount(el, binding) {
    const options = getOptions(binding)
    const event = options.event || 'click'

    if (el.__debounceHandler__) {
      el.removeEventListener(event, el.__debounceHandler__)
    }
    if (el.__debounceTimer__) {
      clearTimeout(el.__debounceTimer__)
    }
    delete el.__debounceHandler__
    delete el.__debounceTimer__
    delete el.__debounceOptions__
  },
}

export default debounce
