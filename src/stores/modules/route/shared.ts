import { useSvgIcon } from '@/hooks/icon'
import { $t, $te } from '@/locales'
import type { AutoRouterRoute, AutoRouterSingleView } from '@elegant-router/types'

/** 是否为页面路由（非重定向路由） */
function isSingleViewRoute(route: AutoRouterRoute): route is AutoRouterSingleView {
  return !('redirect' in route)
}

/**
 * 判断路由是否可显示为菜单
 * - 排除重定向路由与 hideInMenu 路由
 * - 显式声明 isAuth 的路由按权限码过滤
 */
function isVisibleMenuRoute(
  route: AutoRouterRoute,
  permissions: App.Global.RouteKey[],
): route is AutoRouterSingleView {
  if (!isSingleViewRoute(route)) return false
  if (route.meta?.hideInMenu) return false
  if (route.meta?.isAuth === true && !permissions.includes(route.name)) return false
  return true
}

/** 按 order 字段对菜单列表排序 */
export function sortMenusByOrder(menus: App.Global.Menu[]) {
  menus.sort((next, prev) => (Number(next.order) || 0) - (Number(prev.order) || 0))
  return menus
}

/**
 * 由 elegant-router 生成的路由构建全局菜单
 * - 单段路径路由直接作为顶级菜单
 * - 多段路径路由按路径首段分组为父菜单
 * - 分组标题的 i18n 键约定为 route.{segment}.title，order 取首个子菜单的 order
 *
 * 菜单 label 通过 $t 求值，在 computed 中调用时随语言切换自动更新
 */
export function getGlobalMenus(
  routes: AutoRouterRoute[],
  permissions: App.Global.RouteKey[],
): App.Global.Menu[] {
  const { SvgIconVNode } = useSvgIcon()

  function mapRouteToMenu(route: AutoRouterSingleView): App.Global.Menu {
    const { name, path, meta } = route
    const {
      title,
      i18nKey,
      icon = import.meta.env.VITE_MENU_ICON,
      localIcon,
      iconFontSize,
    } = meta ?? {}

    const label = i18nKey && $te(i18nKey) ? $t(i18nKey) : title!

    return {
      key: name,
      label,
      i18nKey,
      routeKey: name,
      routePath: path,
      icon: SvgIconVNode({ icon, localIcon, fontSize: iconFontSize || 20 }),
      order: meta?.order,
    }
  }

  const topMenus: App.Global.Menu[] = []
  const groupMap = new Map<string, App.Global.Menu[]>()

  routes
    .filter((route) => isVisibleMenuRoute(route, permissions))
    .forEach((route) => {
      const menu = mapRouteToMenu(route)
      const [first, second] = route.path.split('/').filter(Boolean)

      if (first && second) {
        groupMap.set(first, [...(groupMap.get(first) ?? []), menu])
      } else {
        topMenus.push(menu)
      }
    })

  const groupMenus: App.Global.Menu[] = [...groupMap.entries()].map(([segment, children]) => {
    const sortedChildren = sortMenusByOrder(children)
    const firstChild = sortedChildren[0]
    const groupI18nKey = `route.${segment}.title` as App.I18n.I18nKey

    const label = $te(groupI18nKey) ? $t(groupI18nKey) : segment

    return {
      key: segment,
      label,
      i18nKey: groupI18nKey,
      routeKey: firstChild.routeKey,
      routePath: firstChild.routePath,
      icon: firstChild.icon,
      order: firstChild.order,
      children: sortedChildren,
    }
  })

  return sortMenusByOrder([...topMenus, ...groupMenus])
}

/** 获取需要缓存的路由名称（meta.isKeepAlive；组件 name 由 elegant-router 注入，与路由名一致） */
export function getCacheRouteNames(routes: AutoRouterRoute[]): App.Global.RouteKey[] {
  return routes
    .filter(isSingleViewRoute)
    .filter((route) => route.meta?.isKeepAlive)
    .map((route) => route.name)
}

/**
 * 将菜单转换为可搜索菜单列表
 *
 * @param menus 菜单列表
 * @param treeMap 聚合列表
 */
export function transformMenuToSearchMenus(
  menus: App.Global.Menu[],
  treeMap: App.Global.Menu[] = [],
) {
  if (menus && menus.length === 0) return []
  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap)
    }
    return acc
  }, treeMap)
}
