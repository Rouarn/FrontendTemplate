import { computed } from 'vue'
import router from '@/router'
import { fetchLogin, fetchLogout, fetchUserInfo } from '@/service/api'
import { routeLogger } from '@/utils/logger'
import { useRouteStore } from '../route'
import { useTokenStore } from './token'
import { useUserStore } from './user'
import { SETUP_STORE_ID } from '@/constants/store'
import { useRouterPush } from '@/hooks/router'
import { defineStore } from 'pinia'

/**
 * Auth 编排层（Facade）
 *
 * 自身不持有状态：凭证态由 useTokenStore 承载，用户资料态由 useUserStore 承载。
 * 本 Store 仅组合两者并编排 login / getUserInfo / resetStore（退出登录）等跨域流程，
 * 退出登录时分别调用 tokenStore / userStore / themeStore / routeStore 各自的 resetStore，
 * 不再集中持有其它域的重置逻辑。
 */
export const useAuthStore = defineStore(SETUP_STORE_ID.Auth, () => {
  const tokenStore = useTokenStore()
  const userStore = useUserStore()
  const routeStore = useRouteStore()
  const { toLogin, redirectFromLogin } = useRouterPush(false)

  // 凭证（委托 tokenStore）
  const token = computed(() => tokenStore.token)
  const tokenType = computed(() => tokenStore.tokenType)
  const refreshToken = computed(() => tokenStore.refreshToken)
  const setToken = (value: string) => tokenStore.setToken(value)
  const setTokenType = (value: string) => tokenStore.setTokenType(value)
  const setRefreshToken = (value: string) => tokenStore.setRefreshToken(value)

  // 用户资料（委托 userStore）
  const userInfo = userStore.userInfo
  const isUserInfoFetched = computed(() => userStore.isUserInfoFetched)
  const setUserInfo = (value?: Api.Auth.UserInfo) => userStore.setUserInfo(value)

  const isLogin = computed<boolean>(() => Boolean(tokenStore.token))

  /**
   * 重置认证态：只清凭证、用户资料与路由权限
   *
   * 主题与语言属于设备级偏好，不随登出重置。
   */
  function resetAuthStore() {
    tokenStore.resetTokenStore()
    userStore.resetUserStore()
    routeStore.resetStore()
  }

  /** 退出登录并清理本地数据（无论后端登出成败都执行本地清理） */
  async function resetStore() {
    try {
      await fetchLogout()
    } catch (error) {
      routeLogger.error('[auth.resetStore] logout failed:', error)
      // 即使后端登出失败，也必须清理本地凭证，避免残留
    }

    resetAuthStore()

    const currentRoute = router.currentRoute.value

    if (currentRoute?.meta?.isAuth) {
      await toLogin()
    }
  }

  /** 获取用户信息 */
  async function getUserInfo() {
    try {
      const data = await fetchUserInfo()
      userStore.setUserInfo(data)
      userStore.setIsUserInfoFetched(true)
      return true
    } catch (error) {
      routeLogger.error('[auth.getUserInfo] 获取用户信息异常:', error)
      routeStore.resetStore()
      resetAuthStore()
      return false
    }
  }

  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @param captchaCode 验证码
   * @param captchaToken 验证码令牌
   * @param [redirect=true] 登录后是否重定向，默认 true
   */
  async function login(
    username: string,
    password: string,
    captchaCode: string,
    captchaToken: string,
    redirect = true,
  ) {
    try {
      // 只 trim 用户名：密码允许首尾空格，避免两端同时「修正」用户输入
      const data = await fetchLogin({
        username: username.trim(),
        password,
        captchaCode,
        captchaToken,
      })
      tokenStore.setToken(data.accessToken)
      tokenStore.setTokenType(data.tokenType)
      tokenStore.setRefreshToken(data.refreshToken ?? '')
    } catch {
      // 登录失败提示由全局 onError 处理
      return
    }

    // 先拉取用户资料：欢迎语依赖昵称/手机号/邮箱，且失败时不应继续跳转
    const userInfoLoaded = await getUserInfo()
    if (!userInfoLoaded) return

    await redirectFromLogin(redirect)

    window.$notification?.success({
      title: '登录成功',
      content: `欢迎回来：${userStore.userInfo.nickname || userStore.userInfo.mobile || userStore.userInfo.email}`,
      duration: 4500,
    })
  }

  return {
    // 凭证
    token,
    tokenType,
    refreshToken,
    setToken,
    setTokenType,
    setRefreshToken,
    // 用户资料
    userInfo,
    isUserInfoFetched,
    setUserInfo,
    // 派生
    isLogin,
    // 编排
    login,
    getUserInfo,
    resetStore,
  }
})
