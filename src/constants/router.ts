/**
 * @description：项目级默认鉴权策略
 * - 后台项目（多数页面需登录）：true，仅登录/404 等白名单显式 meta.isAuth = false
 * - 前台项目（博客/官网，多数页面公开）：false，仅个人中心/管理后台等显式 meta.isAuth = true
 */
export const DEFAULT_ROUTE_AUTH_REQUIRED = true
