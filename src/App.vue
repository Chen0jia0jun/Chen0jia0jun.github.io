<template>
  <div id="app" :class="{ 'dark-theme': themeStore.isDark }">
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useThemeStore } from '@/store/theme'
import { usePhotoStore } from '@/store/photos'
import { useBlogStore } from '@/store/blog'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const themeStore = useThemeStore()
    const photoStore = usePhotoStore()
    const blogStore = useBlogStore()

    onMounted(() => {
      // 初始化主题
      themeStore.initTheme()
      
      // 初始化数据
      photoStore.initPhotos()
      blogStore.initBlog()
    })

    return {
      themeStore
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 64px; /* 为固定导航栏留出空间 */
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 56px;
  }
}
</style>