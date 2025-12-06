<template>
  <div id="app" :class="{ 'dark-theme': themeStore.isDark }">

    <!-- <GalleryCarousel v-if="$route.path.startsWith('/gallery')" /> -->

    <Navbar v-if="!$route.path.startsWith('/notfound')" />
    <main class="main-content" :class="{ 'fullscreen': $route.path.startsWith('/notfound') }">
      <router-view />
    </main>
    <Footer v-if="!$route.path.startsWith('/notfound')" />

    <!-- 路由加载动画 -->
    <Loading v-if="isLoading" />
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useThemeStore } from '@/store/theme'
import { usePhotoStore } from '@/store/photos'
import { useBlogStore } from '@/store/blog'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import GalleryCarousel from '@/components/GalleryCarousel.vue'
import Loading from '@/components/common/loading.vue'
import { storeToRefs } from 'pinia'


export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    GalleryCarousel,
    Loading
  },
  setup() {
    const themeStore = useThemeStore()
    const photoStore = usePhotoStore()
    const blogStore = useBlogStore()
    // const router = useRouter()
    const { isLoading: blogLoading } = storeToRefs(blogStore);
    const { isLoading: photoLoading } = storeToRefs(photoStore);

    // 计算属性：当任一store正在加载时显示加载动画
    const isLoading = computed(() => {
      return blogLoading.value || photoLoading.value;
    });



    // router.beforeEach((to, from, next) => {

    // })

    // router.afterEach(() => {

    // })

    onMounted(() => {
      // 初始化主题
      themeStore.initTheme()

      // 初始化数据
      photoStore.initPhotos()
      blogStore.initBlog()
    })

    return {
      themeStore,
      isLoading
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  padding-top: 64px; /* 为固定导航栏留出空间 */
  position: relative;
  z-index: 1;
}

.main-content.fullscreen {
  padding-top: 0;
}

.navbar {
  position: relative;
  z-index: 10;
}

.footer {
  position: relative;
  z-index: 1;
}

/* 路由加载动画样式 */
#app :deep(.loader) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-page);
  z-index: 9999;
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