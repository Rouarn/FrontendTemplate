import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { logger } from '@/utils/logger'
import { resolveErrorMessage } from './error-message'
import { createClient } from '@vakao/axios'

/**
 * 全局请求实例
 *
 * 由 @vakao/axios 提供内置能力：
 * 后端信封解包、token 注入、401 单例刷新并重放原请求、重复请求取消、全局 loading 计数、统一错误出口
 * 库不处理错误文案，接口报错时完整错误信息在 onError 的 error 上，由 resolveErrorMessage 自行解析
 */
export const request = createClient({
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  timeout: 10000,
  headers: { 'X-Api-Version': '1' },

  auth: {
    getToken: () => {
      const { token, tokenType } = useAuthStore()
      return token ? `${tokenType} ${token}` : undefined
    },
    onRefresh: async (client) => {
      const authStore = useAuthStore()
      if (!authStore.refreshToken) return false
      try {
        const data = await client.post<Api.Auth.LoginToken>(
          '/api/auth/refresh',
          { refreshToken: authStore.refreshToken },
          { skipAuthRetry: true, silent: true },
        )
        authStore.setToken(data.accessToken)
        authStore.setTokenType(data.tokenType)
        if (data.refreshToken) authStore.setRefreshToken(data.refreshToken)
        return true
      } catch (error) {
        // 刷新链路异常可观测：记录错误便于追溯，调用方仍按 false 处理（触发登出/跳登录）
        logger.error('[request.onRefresh] 刷新令牌失败:', error)
        return false
      }
    },
    onRefreshFailed: () => {
      const authStore = useAuthStore()
      authStore.setToken('')
      authStore.setRefreshToken('')
      void router.replace('/login')
    },
  },

  onLoading: (pending) => (pending ? window.$loading?.open() : window.$loading?.close()),
  // cancel 类型库内已过滤不会进入 onError；其余错误文案统一由 resolveErrorMessage 解析
  onError: (error) => window.$message?.error(resolveErrorMessage(error)),
})

export default request
