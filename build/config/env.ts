type EnvRecord = Record<string, string | undefined>

/** 各模式必填的环境变量（启动期校验，缺失即报错，避免运行期 undefined 静默失败） */
const REQUIRED_ENV_KEYS = ['VITE_APP_TITLE', 'VITE_SERVICE_BASE_URL', 'VITE_BASE_URL'] as const

/**
 * 启动期校验必填环境变量
 *
 * @param viteEnv loadEnv 解析后的环境变量
 * @param envName 当前模式名（development / production 等）
 */
export function validateEnv(viteEnv: EnvRecord, envName: string) {
  const missing = REQUIRED_ENV_KEYS.filter((key) => {
    const value = viteEnv[key]
    return value === undefined || value.trim() === ''
  })

  if (missing.length > 0) {
    throw new Error(
      `[env] 模式 ${envName} 缺少必填环境变量：${missing.join('、')}，请检查 .env / .env.${envName}`,
    )
  }
}
