import router from '@/router'
import { useAuthStore } from '@/stores/modules/auth'
import { logger } from '@/utils/logger'
import { RouteNameEnum } from '@/enum'
import { createClient } from '@vakao-ui/axios'

/**
 * 全局请求实例
 *
 * 由 @vakao-ui/axios 提供内置能力：
 * 后端信封解包、token 注入、401 单例刷新并重放原请求、重复请求取消、全局 loading 计数、统一错误出口
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
      router.replace(`/${RouteNameEnum.LOGIN}`)
    },
  },

  onLoading: (pending) => (pending ? window.$loading?.open() : window.$loading?.close()),
  onError: (error) => window.$message?.error(error.message),
})

export default request
