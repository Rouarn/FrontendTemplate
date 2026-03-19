import { usePermission } from '@/hooks/auth/use-permission'
import type { Directive, DirectiveBinding } from 'vue'

/**
 * 权限点名称类型
 * 示例：'admin' | 'editor' | 'user' ...
 */
type PermissionName = string

/**
 * v-permission 指令配置
 *
 * permissions：需要匹配的权限点（单个或多个）
 * mode：匹配模式（some：包含其一即可；every：必须全部包含）
 * fallback：
 *  - hide：无权限时直接隐藏元素
 *  - disable：无权限时禁用元素（展示但不可操作）
 */
interface PermissionConfig {
  permissions: PermissionName | PermissionName[]
  mode?: 'some' | 'every'
  fallback?: 'hide' | 'disable'
}

/**
 * 指令支持的三种绑定形式：
 * - v-permission="'admin'"
 * - v-permission="['admin', 'editor']"
 * - v-permission="{ permissions: 'admin', mode: 'every', fallback: 'disable' }"
 */
type PermissionBindingValue = PermissionName | PermissionName[] | PermissionConfig

/**
 * 记录每个元素对应的“权限重算函数”
 */
const recheckMap = new WeakMap<HTMLElement, () => void>()

/**
 * 恢复元素到“有权限可见”的状态
 */
function restoreElement(el: HTMLElement) {
  el.style.display = ''
  el.removeAttribute('disabled')
  el.classList.remove('permission-disabled')
  el.style.pointerEvents = ''
  el.style.opacity = ''
}

/**
 * 无权限时根据 fallback 配置处理元素
 */
function handleNoPermission(el: HTMLElement, config: PermissionConfig) {
  if (config.fallback === 'disable') {
    el.setAttribute('disabled', 'true')
    el.classList.add('permission-disabled')
    if (el.tagName.toLowerCase() === 'button') {
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
    }
    return
  }
  el.style.display = 'none'
}

/**
 * 核心检查逻辑：根据指令绑定值解析配置，并调用 usePermission.hasPermission 进行判断
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionBindingValue>) {
  const { value } = binding

  if (!value) {
    console.warn('v-permission: 权限值不能为空')
    return
  }

  let config: PermissionConfig

  // 简写形式：v-permission="'admin'" 或 v-permission="['admin', 'editor']"
  if (typeof value === 'string' || Array.isArray(value)) {
    config = { permissions: value, mode: 'some', fallback: 'hide' }
  } else {
    // 完整配置形式：v-permission="{ permissions, mode, fallback }"
    config = {
      permissions: value.permissions,
      mode: value.mode || 'some',
      fallback: value.fallback || 'hide',
    }
  }

  const { hasPermission } = usePermission()
  const ok = hasPermission(config.permissions, config.mode)

  if (ok) {
    restoreElement(el)
  } else {
    handleNoPermission(el, config)
  }
}

/**
 * v-permission 自定义指令
 */
const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionBindingValue>) {
    // 初始挂载时先做一次权限检查
    checkPermission(el, binding)

    // 标记该元素受权限控制
    el.setAttribute('data-permission', '')

    // 保存并绑定重算函数
    const recheck = () => checkPermission(el, binding)
    recheckMap.set(el, recheck)
    el.addEventListener('permissionCheck', recheck)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionBindingValue>) {
    // 指令绑定值变化时重新检查
    checkPermission(el, binding)

    // 替换旧的重算函数
    const oldRecheck = recheckMap.get(el)
    if (oldRecheck) {
      el.removeEventListener('permissionCheck', oldRecheck)
    }

    const recheck = () => checkPermission(el, binding)
    recheckMap.set(el, recheck)
    el.addEventListener('permissionCheck', recheck)
  },
  unmounted(el: HTMLElement) {
    // 指令卸载时移除事件监听
    const recheck = recheckMap.get(el)
    if (recheck) {
      el.removeEventListener('permissionCheck', recheck)
      recheckMap.delete(el)
    }
  },
}

export default permission
