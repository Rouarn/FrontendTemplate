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
  /** 最新回调（updated 时刷新，避免 start 闭包引用旧 fn 导致行为错乱） */
  __longPressFn__?: LongPressHandler
  __longPressDelay__?: number
}

const directive: Directive<HTMLEL, LongPressHandler | LongPressOptions> = {
  mounted(el: HTMLEL, binding: DirectiveBinding<LongPressHandler | LongPressOptions>) {
    const options: LongPressOptions =
      typeof binding.value === 'function' ? { fn: binding.value } : binding.value

    if (typeof options.fn !== 'function') {
      console.error('[v-longpress] callback must be a function')
      return
    }

    // 将 fn/delay 存储到元素属性上，start 运行时动态读取，保证 updated 刷新后回调不陈旧
    el.__longPressFn__ = options.fn
    el.__longPressDelay__ = options.delay || 1000

    const start = (e: MouseEvent | TouchEvent) => {
      // 如果是鼠标事件且不是左键点击，则忽略
      if (e instanceof MouseEvent && e.button !== 0) {
        return
      }

      if (!el.__pressTimer__) {
        el.__pressTimer__ = window.setTimeout(() => {
          el.__longPressFn__?.(e)
          el.__pressTimer__ = null
        }, el.__longPressDelay__!)
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

  updated(el: HTMLEL, binding: DirectiveBinding<LongPressHandler | LongPressOptions>) {
    const options: LongPressOptions =
      typeof binding.value === 'function' ? { fn: binding.value } : binding.value
    if (typeof options.fn === 'function') {
      el.__longPressFn__ = options.fn
    }
    el.__longPressDelay__ = options.delay || 1000
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
    delete el.__longPressFn__
    delete el.__longPressDelay__
  },
}

export default directive
