/* eslint-disable */
/**
 * 由 pnpm gen:api 自动生成，来源：http://127.0.0.1:8849/static/api-docs.json
 * Schema 版本：V1 — 请勿手改，重新生成会覆盖
 */

declare namespace OpenAPI {
export interface HelloResponseDto {
 /** 欢迎消息 */
        message: string
 /** 服务端当前时间（ISO 8601） */
        timestamp: string
 /** 版本号 */
        version: string
  }

export interface AppInfoResponseDto {
 /** 应用名称 */
        name: string
 /** 版本号 */
        version: string
 /** 应用描述 */
        description?: string
 /** 作者 */
        author?: string
 /** 许可证 */
        license?: string
 /** 进程运行时长（秒） */
        uptime: number
  }

export interface HealthResponseDto {
 /** 服务状态 */
        status: string
 /** 数据库状态 */
        database: string
 /** 进程运行时长（秒） */
        uptime: number
 /** 检查时间（ISO 8601） */
        timestamp: string
  }

export interface CaptchaResponseDto {
 /** 验证码令牌 */
        token: string
 /** 验证码图片（Base64编码） */
        image: string
  }

export interface CaptchaVerifyDto {
 /** 验证码令牌 */
        token: string
 /** 用户输入的验证码 */
        code: string
  }

export interface CaptchaVerifyResponseDto {
 /** 验证结果消息 */
        message: string
  }

export interface RegisterDto {
 /** 用户名 */
        username: string
 /** 密码 */
        password: string
 /** 验证码令牌 */
        captchaToken: string
 /** 验证码 */
        captchaCode: string
 /** 用户昵称 */
        nickname?: string
 /** 用户头像URL */
        avatar?: string
 /** 用户性别 */
        gender?: 0 | 1 | 2
 /** 手机号码 */
        mobile?: string
 /** 邮箱地址 */
        email?: string
  }

export interface AuthCreateUserResponse {
 /** 结果消息 */
        message: string
  }

export interface LoginDto {
 /** 用户名 */
        username: string
 /** 密码 */
        password: string
 /** 验证码令牌 */
        captchaToken: string
 /** 验证码 */
        captchaCode: string
  }

export interface TokenResponseDto {
 /** 访问令牌 */
        accessToken: string
 /** 刷新令牌 */
        refreshToken?: string
 /** 令牌类型 */
        tokenType: string
 /** 访问令牌过期时间（秒） */
        accessTokenTtl: number
 /** 刷新令牌过期时间（秒） */
        refreshTokenTtl?: number
  }

export interface RefreshTokenDto {
 /** 刷新令牌 */
        refreshToken: string
  }

export interface User {
 /** 账号状态（来自关联认证记录） */
        status?: 0 | 1
 /** 登录名（来自关联认证记录） */
        username?: string
 /** 角色（来自关联认证记录） */
        role?: 'admin' | 'user'
    id: string
    nickname: string | null
    avatar: string | null
    gender: 0 | 1 | 2 | null
    mobile: string | null
    bio: string | null
    email: string | null
    birthday: string | null
    city: string | null
    profession: string | null
    createdAt: string
    updatedAt: string
  }

export interface ChangePasswordDto {
 /** 旧密码 */
        oldPassword: string
 /** 新密码 */
        newPassword: string
 /** 确认新密码 */
        confirmPassword: string
  }

export interface UserListResponseDto {
 /** 分页数据列表 */
        records: Array<User>
 /** 总记录数 */
        total: number
 /** 总页数 */
        totalPages: number
 /** 当前页码 */
        current: number
 /** 每页数量 */
        size: number
  }

export interface UpdateUserDto {
 /** 用户昵称 */
        nickname?: string
 /** 用户头像URL */
        avatar?: string
 /** 用户性别 */
        gender?: 0 | 1 | 2
 /** 手机号码 */
        mobile?: string
 /** 邮箱地址 */
        email?: string
 /** 个人简介 */
        bio?: string
 /** 生日 */
        birthday?: string
 /** 所在城市 */
        city?: string
 /** 职业 */
        profession?: string
  }

export interface ToggleUserStatusDto {
 /** 目标状态（可选，不提供则自动切换） */
        status?: 0 | 1
  }

export interface BatchDeleteUserDto {
 /** 要删除的用户ID数组 */
        ids: Array<string>
  }

export interface FileUploadResponseDto {
 /** 文件访问URL */
        url: string
 /** 完整文件访问URL */
        completeUrl: string
  }
}
