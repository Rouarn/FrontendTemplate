import ElegantRouter from 'elegant-router/vite'
import type { PluginOption } from 'vite'

export function setupElegantRouterPlugin(): PluginOption {
  return ElegantRouter()
}
