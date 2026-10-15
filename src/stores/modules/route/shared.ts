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

/** 菜单前缀树节点：每个节点对应一段路径，层数不限 */
type MenuTrieNode = {
  /** 当前路径段名 */
  segment: string
  /** 路径前缀（首段起逐级拼接，如 demos 或 demos/forms） */
  prefix: string
  /** 精确命中该路径的路由菜单（该路径无页面时为空） */
  self?: App.Global.Menu
  /** 子节点，按路径段聚合 */
  children: Map<string, MenuTrieNode>
}

/**
 * 由 elegant-router 生成的路由构建全局菜单
 * - 单段路径路由直接作为顶级菜单
 * - 多段路径路由按路径前缀递归分组为父菜单，层级不设上限
 * - 分组标题的 i18n 键约定为 route.{路径段以点号连接}.title，order 取首个子菜单的 order
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

  const root: MenuTrieNode = { segment: '', prefix: '', children: new Map() }

  // 将可显示的路由按路径段插入前缀树
  routes
    .filter((route) => isVisibleMenuRoute(route, permissions))
    .forEach((route) => {
      let node = root

      for (const segment of route.path.split('/').filter(Boolean)) {
        let child = node.children.get(segment)

        if (!child) {
          child = {
            segment,
            prefix: node.prefix ? `${node.prefix}/${segment}` : segment,
            children: new Map(),
          }
          node.children.set(segment, child)
        }

        node = child
      }

      node.self = mapRouteToMenu(route)
    })

  /** 前缀树 → 菜单树：有子节点则为分组，分组键取路径前缀 */
  function mapTrieToMenus(node: MenuTrieNode): App.Global.Menu | null {
    const childMenus = [...node.children.values()]
      .map((child) => mapTrieToMenus(child))
      .filter((menu) => menu !== null)

    if (childMenus.length === 0) {
      return node.self ?? null
    }

    // 该路径本身也是页面时，与子菜单一并排序，保留其可点击性
    if (node.self) childMenus.push(node.self)

    const sortedChildren = sortMenusByOrder(childMenus)
    const firstChild = sortedChildren[0]!
    // i18n 键按点号拼接路径段（如 route.sales.report.title），与语言包的嵌套结构一致
    const groupI18nKey = `route.${node.prefix.split('/').join('.')}.title` as App.I18n.I18nKey

    const label = $te(groupI18nKey) ? $t(groupI18nKey) : node.segment

    return {
      key: node.prefix,
      label,
      i18nKey: groupI18nKey,
      routeKey: firstChild.routeKey,
      routePath: firstChild.routePath,
      icon: firstChild.icon,
      order: firstChild.order,
      children: sortedChildren,
    }
  }

  return sortMenusByOrder(
    [...root.children.values()]
      .map((child) => mapTrieToMenus(child))
      .filter((menu) => menu !== null),
  )
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
