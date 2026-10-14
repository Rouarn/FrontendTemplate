/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /**
     * enable status
     *
     * - "1": enabled
     * - "0": disabled
     */
    type EnableStatus = 0 | 1

    /**
     * gender
     *
     * - "0": male
     * - "1": female
     * - "2": unknown
     */
    type Gender = 0 | 1 | 2

    /**
     * 分页查询参数（后端识别 current + size）
     */
    interface PageParams {
      /** 当前页码 */
      current?: number
      /** 每页数量 */
      size?: number
    }

    /**
     * 分页响应数据（与后端 PaginatedData 对齐）
     */
    interface Paginated<T> {
      /** 分页数据列表 */
      records: T[]
      /** 总记录数 */
      total: number
      /** 总页数 */
      totalPages: number
      /** 当前页码 */
      current: number
      /** 每页数量 */
      size: number
    }
  }
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    /**
     * 登录令牌 — 引用 pnpm gen:api 生成的 OpenAPI.TokenResponseDto
     * 后端契约变更后运行 gen:api 即自动同步
     */
    type LoginToken = OpenAPI.TokenResponseDto

    /** 图形验证码 — 引用生成类型（后端 CaptchaResponseDto） */
    type Captcha = OpenAPI.CaptchaResponseDto

    /**
     * 认证信息 — 基于 gen:api 生成的 OpenAPI.Auth 裁剪：
     * password 运行时不下发（select: false + @Exclude）；user 为反向关联；时间戳字段前端未使用
     */
    type AuthInfo = Omit<OpenAPI.Auth, 'password' | 'user' | 'createdAt' | 'updatedAt'>

    /** 用户信息 — 引用 gen:api 生成的 OpenAPI.User，auth 与未使用的时间戳字段按上述裁剪 */
    type UserInfo = Omit<OpenAPI.User, 'auth' | 'createdAt' | 'updatedAt'> & {
      auth: AuthInfo
    }

    /** 注册用户 — 认证三要素 + 可选基础资料 */
    type RegisterUser = {
      username: string
      password: string
      captchaCode: string
      captchaToken: string
    } & Partial<
      Pick<
        UserInfo,
        | 'nickname'
        | 'avatar'
        | 'gender'
        | 'mobile'
        | 'email'
        | 'bio'
        | 'birthday'
        | 'city'
        | 'profession'
      >
    >
  }
}
