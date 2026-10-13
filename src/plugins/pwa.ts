// 注册 PWA Service Worker
import { registerSW } from 'virtual:pwa-register'

export function setupPWARegister() {
  // 监听 PWA 状态
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.info('PWA 需要刷新')
    },
    onOfflineReady() {
      console.info('PWA 离线可用')
    },
  })
}
