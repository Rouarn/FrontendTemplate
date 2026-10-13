/** 全局状态管理 Store ID */
export const SETUP_STORE_ID = {
  App: 'app-store',
  Theme: 'theme-store',
  Auth: 'auth-store',
  Route: 'route-store',
  Token: 'token-store',
  User: 'user-store',
} as const

export type SetupStoreId = (typeof SETUP_STORE_ID)[keyof typeof SETUP_STORE_ID]
