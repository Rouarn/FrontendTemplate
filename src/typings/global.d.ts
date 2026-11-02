export {}

declare global {
  export interface Window {
    /** NProgress 实例 */
    NProgress?: import('nprogress').NProgress
    /** 加载进度条实例 */
    $loadingBar?: import('naive-ui').LoadingBarProviderInst
    /** 加载动画实例 */
    $dialog?: import('naive-ui').DialogProviderInst
    /** 消息实例 */
    $message?: import('naive-ui').MessageProviderInst
    /** 通知实例 */
    $notification?: import('naive-ui').NotificationProviderInst
    /** 加载实例 */
    $loading?: import('@/plugins/loading').LoadingAPI
  }

  /** 项目构建时间 */
  export const BUILD_TIME: string

  /** 构建期注入的应用基础信息（替代直接 import package.json） */
  export const __APP_NAME__: string
  export const __APP_VERSION__: string
  export const __APP_HOMEPAGE__: string
  export const __APP_WEBSITE__: string
  export const __APP_LICENSE__: string
  export const __APP_DEP_COUNT__: number
  export const __APP_DEPS__: { name: string; version: string }[]
  export const __APP_DEV_DEPS__: { name: string; version: string }[]
}
