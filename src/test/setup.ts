import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createApp } from 'vue'

// 创建测试应用实例
export function createTestApp() {
  const app = createApp({})
  const pinia = createPinia()
  
  app.use(pinia)
  setActivePinia(pinia)
  
  config.global.plugins = [pinia]
  config.global.config.globalProperties = {}
  
  return app
}