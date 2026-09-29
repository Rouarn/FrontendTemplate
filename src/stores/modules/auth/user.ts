import { reactive } from 'vue'
import { localStg } from '@/utils/storage'
import { SetupStoreId } from '@/enum'
import useBoolean from '@/hooks/state/use-boolean'
import { defineStore } from 'pinia'

/** 用户资料初始值（退出登录/异常恢复时回退） */
export const initialUserInfo: Api.Auth.UserInfo = {
  id: '',
  nickname: '',
  avatar: '',
  gender: 2,
  mobile: '',
  email: '',
  bio: '',
  birthday: '',
  city: '',
  profession: '',
  roles: [],
  auth: {
    createTime: new Date(),
    updateTime: new Date(),
    id: '',
    username: '',
    status: 1,
    lastLoginAt: new Date(),
    lastLoginIp: '',
    loginAttempts: 0,
    lockedAt: null,
    passwordChangedAt: new Date(),
  },
}

/**
 * 用户资料 Store：仅承载 userInfo + 是否已拉取标记
 * 与凭证态分离，可独立重置与测试
 */
export const useUserStore = defineStore(SetupStoreId.User, () => {
  const { bool: isUserInfoFetched, setBool: setIsUserInfoFetched } = useBoolean(false)

  const userInfo: Api.Auth.UserInfo = reactive(localStg.get('userInfo') ?? initialUserInfo)

  const setUserInfo = (value: Api.Auth.UserInfo = initialUserInfo) => {
    Object.assign(userInfo, value)
    localStg.set('userInfo', userInfo)
  }

  /** 仅重置用户资料态 */
  function resetUserStore() {
    setUserInfo(initialUserInfo)
    setIsUserInfoFetched(false)
  }

  return {
    userInfo,
    isUserInfoFetched,
    setUserInfo,
    setIsUserInfoFetched,
    resetUserStore,
  }
})
