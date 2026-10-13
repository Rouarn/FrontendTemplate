import { request } from '../request'

/** 用户登录（验证码校验由登录接口一并完成） */
export function fetchLogin(body: {
  username: string
  password: string
  captchaCode: string
  captchaToken: string
}) {
  return request.post<Api.Auth.LoginToken>('/api/auth/login', body, { skipAuthRetry: true })
}

/** 获取当前用户信息 */
export function fetchUserInfo() {
  return request.get<Api.Auth.UserInfo>('/api/auth/getUserInfo')
}

/** 注册用户 */
export function fetchRegister(body: Api.Auth.RegisterUser) {
  return request.post<Api.Auth.LoginToken>('/api/auth/register', body)
}

/** 获取验证码 */
export function fetchCaptcha() {
  return request.get<Api.Auth.Captcha>('/api/auth/captcha')
}

/** 退出登录 */
export function fetchLogout() {
  return request.post('/api/auth/logout')
}

/** 修改密码 */
export function changePassword(body: {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}) {
  return request.put<{ message: string }>('/api/auth/change-password', body)
}
