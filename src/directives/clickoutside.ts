import type { Directive, DirectiveBinding } from 'vue'

interface ClickOutsideBinding {
  handler: (event: Event) => void
  exclude?: string[]
}

interface State {
  /** 最新回调（updated 时刷新，避免闭包陈旧） */
  callback: (event: Event) => void
  /** 挂载/更新时解析的排除元素引用，避免每次点击重复 querySelector */
  excludeEls: HTMLElement[]
  /** 绑定到 document 的稳定处理函数，内部读取最新 callback/excludeEls */
  handler: (event: Event) => void
}

/** 用 WeakMap 存储元素→状态，避免在 DOM 元素上挂载自定义属性 */
const stateMap = new WeakMap<HTMLElement, State>()

function resolveExcludeElements(exclude?: string[]): HTMLElement[] {
  if (!exclude || exclude.length === 0) return []
  const els: HTMLElement[] = []
  for (const selector of exclude) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el) els.push(el)
  }
  return els
}

function readCallback(value: DirectiveBinding['value']): ((event: Event) => void) | undefined {
  if (typeof value === 'function') return value
  if (value && typeof value === 'object' && typeof value.handler === 'function')
    return value.handler
  return undefined
}

function readExclude(value: DirectiveBinding['value']): string[] | undefined {
  if (value && typeof value === 'object') return value.exclude
  return undefined
}

/**
 * v-clickoutside 点击外部指令
 * 用法：
 * <div v-clickoutside="handleClickOutside">内容</div>
 * <div v-clickoutside="{ handler: handleClickOutside, exclude: ['#exclude'] }">内容</div>
 */
const clickoutside: Directive<HTMLElement, ((event: Event) => void) | ClickOutsideBinding> = {
  mounted(el, binding) {
    const callback = readCallback(binding.value)
    if (!callback) {
      console.error('[v-clickoutside] handler must be a function')
      return
    }

    const excludeEls = resolveExcludeElements(readExclude(binding.value))

    const state: State = {
      callback,
      excludeEls,
      handler: () => {
        /* 占位，下方立即覆写以引用自身 */
      },
    }

    // 稳定处理函数：始终从 state 读取最新 callback/excludeEls，updated 时无需重新绑定监听
    state.handler = (event: Event) => {
      const target = event.target as Node
      if (el.contains(target)) return
      for (const excludeEl of state.excludeEls) {
        if (excludeEl.contains(target)) return
      }
      state.callback(event)
    }

    stateMap.set(el, state)

    // 用 rAF 延后一帧绑定，规避触发挂载的同一点击事件竞态（替代原 100ms 延迟）
    requestAnimationFrame(() => {
      document.addEventListener('mousedown', state.handler)
    })
  },

  updated(el, binding) {
    const state = stateMap.get(el)
    if (!state) return
    const callback = readCallback(binding.value)
    if (callback) state.callback = callback
    state.excludeEls = resolveExcludeElements(readExclude(binding.value))
  },

  beforeUnmount(el) {
    const state = stateMap.get(el)
    if (state) {
      document.removeEventListener('mousedown', state.handler)
      stateMap.delete(el)
    }
  },
}

export default clickoutside
