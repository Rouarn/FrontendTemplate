import { h } from 'vue'
import { NButton } from 'naive-ui'
import { $t } from '@/locales'
import { logger } from '@/utils/logger'
import type { App } from 'vue'

/**
 * 统一错误上报适配点
 *
 * 全局异常（Vue errorHandler / unhandledrejection / window.error）均经过本函数收口；
 * 接入 Sentry 等监控平台时仅需替换此处实现
 */
export function reportError(error: unknown, origin: string) {
  logger.error(`[${origin}]`, error)
}

export function setupAppErrorHandle(app: App) {
  // Vue 应用级异常（组件渲染、生命周期、事件处理器）
  app.config.errorHandler = (err, _vm, info) => {
    reportError(err, `vue:${info}`)
  }

  // 未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, 'unhandledrejection')
  })

  // 全局运行时异常（过滤资源加载错误，event.error 仅在脚本异常时有值）
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLElement) return
    reportError(event.error ?? event.message, 'window.error')
  })
}

async function getHtmlBuildTime(): Promise<string | null> {
  const baseUrl = import.meta.env.VITE_BASE_URL || '/'

  try {
    const res = await fetch(`${baseUrl}index.html?time=${Date.now()}`)

    if (!res.ok) {
      console.error('getHtmlBuildTime error:', res.status, res.statusText)
      return null
    }

    const html = await res.text()
    const match = html.match(/<meta name="buildTime" content="(.*)">/)
    return match?.[1] || null
  } catch (error) {
    console.error('getHtmlBuildTime error:', error)
    return null
  }
}

export function setupAppVersionNotification() {
  // Update check interval in milliseconds
  const UPDATE_CHECK_INTERVAL = 3 * 60 * 1000

  const canAutoUpdateApp =
    import.meta.env.VITE_AUTOMATICALLY_DETECT_UPDATE === 'Y' &&
    import.meta.env.VITE_USER_NODE_ENV === 'production'
  if (!canAutoUpdateApp) return

  let isShow = false
  let updateInterval: ReturnType<typeof setInterval> | undefined

  const checkForUpdates = async () => {
    if (isShow) return

    const buildTime = await getHtmlBuildTime()

    // If failed to get build time or build time hasn't changed, no update is needed.
    if (!buildTime || buildTime === BUILD_TIME) {
      return
    }

    isShow = true

    // Show update notification
    const n = window.$notification?.create({
      title: $t('system.updateTitle'),
      content: $t('system.updateContent'),
      action() {
        return h(
          'div',
          { style: { display: 'flex', justifyContent: 'end', gap: '12px', width: '325px' } },
          [
            h(
              NButton,
              {
                onClick() {
                  n?.destroy()
                  isShow = false
                },
              },
              () => $t('system.updateCancel'),
            ),
            h(
              NButton,
              {
                type: 'primary',
                onClick() {
                  location.reload()
                },
              },
              () => $t('system.updateConfirm'),
            ),
          ],
        )
      },
      onClose() {
        isShow = false
      },
    })
  }

  const startUpdateInterval = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    updateInterval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL)
  }

  // If updates should be checked, set up the visibility change listener and start the update interval
  if (!isShow && document.visibilityState === 'visible') {
    // Check for updates when the document is visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void checkForUpdates()
        startUpdateInterval()
      }
    })

    // Start the update interval
    startUpdateInterval()
  }
}
