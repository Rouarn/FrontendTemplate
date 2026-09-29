import { localStg, sessionStg } from '@/utils/storage'

/** 获取令牌（sessionStorage：关闭标签页即失效，缩小泄漏窗口） */
export function getToken() {
  return sessionStg.get('token') || ''
}

export function getRefreshToken() {
  return sessionStg.get('refreshToken') || ''
}

export function getTokenType() {
  return (localStg.get('tokenType') as string) || 'Bearer'
}
