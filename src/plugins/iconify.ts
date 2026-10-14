import { addAPIProvider } from '@iconify/vue'

/** 配置 Iconify 离线图标源 */
export function setupIconifyOffline() {
  const { VITE_ICONIFY_URL } = import.meta.env

  if (VITE_ICONIFY_URL) {
    addAPIProvider('', { resources: [VITE_ICONIFY_URL] })
  }
}
