import { useAuthStore } from '@/stores/modules/auth'
import { useRouteStore } from '@/stores/modules/route'
import { DEFAULT_ROUTE_AUTH_REQUIRED } from '@/constants/router'
import type { Router } from 'vue-router'

/** 创建路由守卫（登录鉴权、用户信息初始化、权限码校验） */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()
    const routeStore = useRouteStore()

    const isLoginPage = to.name === 'Login'

    // 已登录但未拉取用户信息：先获取，失败则跳转登录
    if (!isLoginPage && authStore.isLogin && !authStore.isUserInfoFetched) {
      const success = await authStore.getUserInfo()
      if (!success) {
        return { name: 'Login', replace: false, query: { redirect: to.fullPath } }
      }
    }

    // 需要登录的页面（未显式声明 meta.isAuth 时按项目默认策略）
    const requireAuth = to.meta.isAuth ?? DEFAULT_ROUTE_AUTH_REQUIRED
    if (requireAuth && !authStore.isLogin) {
      return { name: 'Login', replace: false, query: { redirect: to.fullPath } }
    }

    // 已登录：初始化权限码，并校验显式需鉴权路由的访问权限
    if (authStore.isLogin) {
      await routeStore.initPermissions()

      if (
        to.meta.isAuth === true &&
        !routeStore.permissions.includes(to.name as App.Global.RouteKey)
      ) {
        return { name: '403', replace: true }
      }

      // 角色限制：声明了 meta.roles 的路由只允许对应角色访问
      const allowedRoles = to.meta.roles
      if (allowedRoles?.length) {
        const currentRole = authStore.userInfo.role
        if (!currentRole || !allowedRoles.includes(currentRole)) {
          return { name: '403', replace: true }
        }
      }
    }

    // 访问登录页：已登录则留在原页，未登录允许访问
    if (isLoginPage) {
      if (authStore.isLogin) return from.fullPath
      return true
    }

    // 正常访问页面
    return true
  })

  // 开发态输出导航轨迹；生产环境保持控制台干净，异常统一走 reportError
  router.afterEach((to) => {
    if (!import.meta.env.DEV) return
    console.info('[router.afterEach]: ', to)
  })

  router.onError((error) => {
    if (!import.meta.env.DEV) return
    console.info('[router.onError]: ', error)
  })
}
