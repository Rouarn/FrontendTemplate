import apiPrefix from '@/service/api/prefix'
import { request } from '@/service/request'

/** 用户登录（验证码校验由登录接口一并完成） */
export function fetchLogin(username: string, password: string, captchaCode: string, captchaToken: string) {
  return request.post<Api.Auth.LoginToken>(`${apiPrefix.auth}/login`, {
    username,
    password,
    captchaCode,
    captchaToken,
  })
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<Api.Auth.UserInfo>(`${apiPrefix.auth}/getUserInfo`)
}

/** 注册用户 */
export function fetchRegister(user: Api.Auth.RegisterUser) {
  return request.post<Api.Auth.LoginToken>(`${apiPrefix.auth}/register`, user)
}

/** 生成验证码 */
export function fetchCaptcha() {
  return request.get<Api.Auth.Captcha>(`${apiPrefix.auth}/captcha`, {}, { loading: false })
}

/** 退出登录 */
export function fetchLogout() {
  return request.post(`${apiPrefix.auth}/logout`)
}

/** 刷新令牌 集成在请求拦截器中 */
