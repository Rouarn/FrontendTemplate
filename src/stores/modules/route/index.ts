import { routes as elegantRoutes } from '@/router/_generated/routes'
import router from '@/router'
import { fetchGetUserPermissions } from '@/service/api'
import { routeLogger } from '@/utils/logger'
import { useUserStore } from '../auth/user'
import { getCacheRouteNames, getGlobalMenus, transformMenuToSearchMenus } from './shared'
import { SETUP_STORE_ID } from '@/constants/store'
import useBoolean from '@/hooks/state/use-boolean'
import { defineStore } from 'pinia'

/**
 * 路由 Store
 *
 * 路由表由 elegant-router 在构建期生成（全量静态注册），本 Store 仅负责：
 * - 登录后拉取当前用户的路由权限码
 * - 由生成路由派生全局菜单（按权限码与 hideInMenu 过滤）与 keep-alive 缓存名单
 */
export const useRouteStore = defineStore(SETUP_STORE_ID.Route, () => {
  const { bool: isInitPermissions, setBool: setIsInitPermissions } = useBoolean()

  /** 当前用户的路由权限码（route name 列表） */
  const permissions = ref<App.Global.RouteKey[]>([])

  const userStore = useUserStore()

  /** 全局菜单（按权限码与角色过滤；label 由 $t 求值，语言切换随 computed 自动更新） */
  const menus = computed<App.Global.Menu[]>(() =>
    getGlobalMenus(elegantRoutes, permissions.value, userStore.userInfo.role),
  )
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /** 需要缓存的路由名（meta.isKeepAlive） */
  const cacheRoutes = computed<App.Global.RouteKey[]>(() => getCacheRouteNames(elegantRoutes))

  /** 排除需要缓存的路由（用于重置路由缓存） */
  const excludeCacheRoutes = ref<App.Global.RouteKey[]>([])

  /** 拉取路由权限码（登录后首次执行，幂等） */
  async function initPermissions() {
    if (isInitPermissions.value) return

    try {
      permissions.value = await fetchGetUserPermissions()
    } catch (error) {
      routeLogger.error('获取路由权限码失败，按无权限处理:', error)
      permissions.value = []
    }

    setIsInitPermissions(true)
  }

  /**
   * 重置路由缓存
   *
   * @default router.currentRoute.value.name 当前路由名称
   * @param routeKey 路由名称
   */
  async function resetRouteCache(routeKey?: App.Global.RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as App.Global.RouteKey)

    excludeCacheRoutes.value.push(routeName)

    await nextTick()

    excludeCacheRoutes.value = []
  }

  /** 重置 Store（setup store 无内置 $reset，手动重置状态） */
  function resetStore() {
    permissions.value = []
    excludeCacheRoutes.value = []
    setIsInitPermissions(false)
  }

  return {
    resetStore,
    menus,
    searchMenus,
    permissions,
    isInitPermissions,
    initPermissions,
    excludeCacheRoutes,
    cacheRoutes,
    resetRouteCache,
  }
})
