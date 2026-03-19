import { computed } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

/**
 * 权限点类型（可以根据项目实际权限点进行扩展）
 * 示例：'admin' | 'editor' | 'user' | 'user_add' ...
 */
type PermissionName = string

interface UsePermissionOptions {
  mode?: 'some' | 'every'
}

export function usePermission(options?: UsePermissionOptions) {
  const authStore = useAuthStore()

  /**
   * 当前用户拥有的权限点清单
   * 这里是一个示例逻辑：根据角色映射权限点
   * 实际项目中通常是后端直接返回权限点数组
   */
  const permissions = computed<PermissionName[]>(() => {
    const roles = authStore.userInfo.roles ?? []
    const roleNames = roles.map((r) => r.name)
    const permissionSet = new Set<PermissionName>()

    if (roleNames.includes('R_SUPER_ADMIN')) {
      permissionSet.add('admin')
      permissionSet.add('editor')
      permissionSet.add('user')
    }
    if (roleNames.includes('R_EDITOR')) {
      permissionSet.add('editor')
      permissionSet.add('user')
    }
    if (roleNames.includes('R_USER')) {
      permissionSet.add('user')
    }

    return Array.from(permissionSet)
  })

  /**
   * 判断是否拥有指定权限
   * @param required 要求的权限点（单个或数组）
   * @param mode 匹配模式（some: 满足其一即可; every: 必须全部满足）
   */
  function hasPermission(required: PermissionName | PermissionName[], mode: 'some' | 'every' = options?.mode ?? 'some') {
    const list = Array.isArray(required) ? required : [required]
    if (!list.length) return true

    const current = permissions.value
    if (mode === 'every') {
      return list.every((p) => current.includes(p))
    }
    return list.some((p) => current.includes(p))
  }

  return {
    permissions,
    hasPermission,
  }
}
