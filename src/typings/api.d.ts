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

    interface Captcha {
      image: string
      token: string
      accessTokenTtl: number
      nonce: string
    }

    interface AuthType {
      createTime: Date
      updateTime: Date
      id: string
      username: string
      status: number
      lastLoginAt: Date
      lastLoginIp: string
      loginAttempts: number
      lockedAt: null
      passwordChangedAt: Date
    }

    interface UserInfo {
      id: string
      nickname?: string
      avatar?: string
      gender?: Common.Gender
      mobile?: string
      email?: string
      bio?: string
      birthday?: string
      city?: string
      profession?: string
      authId?: string
      status?: Common.EnableStatus
      auth: AuthType
    }

    interface RegisterUser extends Omit<UserInfo, 'id' | 'status' | 'auth'> {
      username: string
      password: string
      captchaCode: string
      captchaToken: string
    }
  }
}
