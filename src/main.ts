import { createApp } from 'vue'
import App from './App.vue'
import './plugins/assets'
import { setupI18n } from './locales'
import {
  setupAppErrorHandle,
  setupAppVersionNotification,
  setupDayjs,
  setupDirectives,
  setupIconifyOffline,
  setupLoading,
  setupNProgress,
  setupPWARegister,
} from './plugins'
import { setupRouter } from './router'
import { setupStore } from './stores'

async function setupApp(): Promise<void> {
  setupNProgress()

  setupIconifyOffline()

  setupDayjs()

  const app = createApp(App)

  setupStore(app)

  setupLoading(app)

  await setupRouter(app)

  setupDirectives(app)

  setupI18n(app)

  setupAppErrorHandle(app)

  setupAppVersionNotification()

  setupPWARegister()

  app.mount('#app')
}

void setupApp()
