import { ref } from 'vue'
import { localStg, sessionStg } from '@/utils/storage'
import { getRefreshToken, getToken, getTokenType } from './shared'
import { SETUP_STORE_ID } from '@/constants/store'
import { defineStore } from 'pinia'

/**
 * 凭证 Store：仅承载 token / refreshToken / tokenType
 * 退出登录时由编排层（useAuthStore.resetStore）调用 resetTokenStore，与用户资料/主题/路由解耦
 */
export const useTokenStore = defineStore(SETUP_STORE_ID.Token, () => {
  const token = ref<string>(getToken())
  const refreshToken = ref<string>(getRefreshToken())
  const tokenType = ref<string>(getTokenType())

  const setToken = (value: string) => {
    token.value = value
    sessionStg.set('token', value)
  }

  const setTokenType = (value: string) => {
    tokenType.value = value || 'Bearer'
    localStg.set('tokenType', tokenType.value)
  }

  const setRefreshToken = (value: string) => {
    refreshToken.value = value
    sessionStg.set('refreshToken', value)
  }

  /** 仅重置凭证态（不触及用户资料/主题/路由） */
  function resetTokenStore() {
    setToken('')
    setRefreshToken('')
  }

  return {
    token,
    refreshToken,
    tokenType,
    setToken,
    setTokenType,
    setRefreshToken,
    resetTokenStore,
  }
})
