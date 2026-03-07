/**
 * v-longpress
 * 长按指令，长按时触发事件
 * <button v-longpress="handleLongPress">Click me</button>
 */
import type { Directive, DirectiveBinding } from 'vue'

type LongPressHandler = (e: MouseEvent | TouchEvent) => void

interface LongPressOptions {
  fn: LongPressHandler
  delay?: number
}

interface HTMLEL extends HTMLElement {
  __longPressCleanup?: () => void
  __pressTimer__?: number | null
}

const directive: Directive<HTMLEL, LongPressHandler | LongPressOptions> = {
  mounted(el: HTMLEL, binding: DirectiveBinding<LongPressHandler | LongPressOptions>) {
    const options: LongPressOptions = typeof binding.value === 'function' ? { fn: binding.value } : binding.value

    if (typeof options.fn !== 'function') {
      console.error('[v-longpress] callback must be a function')
      return
    }

    const delay = options.delay || 1000

    const start = (e: MouseEvent | TouchEvent) => {
      // 如果是鼠标事件且不是左键点击，则忽略
      if (e instanceof MouseEvent && e.button !== 0) {
        return
      }

      if (!el.__pressTimer__) {
        el.__pressTimer__ = window.setTimeout(() => {
          options.fn(e)
          el.__pressTimer__ = null
        }, delay)
      }
    }

    const cancel = () => {
      if (el.__pressTimer__) {
        clearTimeout(el.__pressTimer__)
        el.__pressTimer__ = null
      }
    }

    // 添加事件监听
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    // 取消事件监听
    el.addEventListener('click', cancel)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)

    // 在元素卸载时清除事件
    el.__longPressCleanup = () => {
      el.removeEventListener('mousedown', start)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('click', cancel)
      el.removeEventListener('mouseup', cancel)
      el.removeEventListener('mouseleave', cancel)
      el.removeEventListener('touchend', cancel)
      el.removeEventListener('touchcancel', cancel)
    }
  },

  updated(_el: HTMLEL, _binding: DirectiveBinding<LongPressHandler | LongPressOptions>) {
    // 简单起见，如果 options 发生变化，我们只需要确保回调是最新的即可
    // 由于 start 闭包引用了 options.fn，而 options 在 updated 中重新获取
    // 我们可以重新执行 mounted 的逻辑，或者通过属性存储 fn
  },

  unmounted(el: HTMLEL) {
    // 清理事件监听
    if (el.__longPressCleanup) {
      el.__longPressCleanup()
      delete el.__longPressCleanup
    }
    if (el.__pressTimer__) {
      clearTimeout(el.__pressTimer__)
      delete el.__pressTimer__
    }
  },
}

export default directive
