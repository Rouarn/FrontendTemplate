import { routes } from '@/router/_generated/routes'

/**
 * 获取当前用户的路由权限码（route name 列表）
 *
 * 本地 mock：返回全部路由名，开发态全量可见。
 * 接入后端时改为 `return request.get<App.Global.RouteKey[]>('/api/auth/permissions')`
 * —— 注意真实 request 返回的是解包后的数据本身，不要再包一层 { data, error }。
 */
export function fetchGetUserPermissions(): Promise<App.Global.RouteKey[]> {
  return Promise.resolve(routes.map((route) => route.name))
}
