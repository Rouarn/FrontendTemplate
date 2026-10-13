// import { request } from '@/service/request'
import { routes } from '@/router/_generated/routes'

/**
 * 获取当前用户的路由权限码（route name 列表）
 *
 * 本地 mock：返回全部路由名，开发态全量可见
 */
export function fetchGetUserPermissions(): Promise<{ data: App.Global.RouteKey[]; error: null }> {
  const data = routes.map((route) => route.name)
  return Promise.resolve({ data, error: null })
  // return request.get<App.Global.RouteKey[]>(`/api/route/permissions`)
}
