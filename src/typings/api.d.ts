/**
 * Api 命名空间
 *
 * 后端接口类型定义
 */
declare namespace Api {
  namespace Common {
    /**
     * 启用状态
     *
     * - "1": 启用
     * - "0": 禁用
     */
    type EnableStatus = 0 | 1

    /**
     * 性别
     *
     * - "0": 男
     * - "1": 女
     * - "2": 未知
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
   * Auth 命名空间
   *
   * 后端接口模块："auth"
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
