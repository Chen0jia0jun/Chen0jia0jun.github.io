import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/main.scss'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')

// 处理 GitHub Pages 的路由重定向
// 当用户直接访问某个路径时，404.html 会将路径作为 ?p= 参数传递过来
router.isReady().then(() => {
  const params = new URLSearchParams(window.location.search)
  const redirectPath = params.get('p')

  if (redirectPath) {
    // 清理 URL 并导航到目标路径
    window.history.replaceState(null, '', redirectPath)
  }
})
