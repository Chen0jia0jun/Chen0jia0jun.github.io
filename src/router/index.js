import { createRouter, createWebHistory,createRouterMatcher } from 'vue-router'
import Home from '@/views/Home.vue'
import Gallery from '@/views/Gallery/index.vue'
import GalleryPhotos from '@/views/Gallery/GalleryPhotos.vue'
import Blog from '@/views/Blog/index.vue'
import BlogPost from '@/views/Blog/BlogPost.vue'
import Tests from '@/views/Tests.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
    meta: {
      title: '照片画廊'
    }
  },
  {
    path: '/gallery/:id',
    name: 'GalleryPhotos',
    component: GalleryPhotos,
    meta: {
      title: '相册详情'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: '博客'
    }
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: BlogPost,
    meta: {
      title: '文章详情'
    }
  },
  {
    path: '/tests',
    name: 'Tests',
    component: Tests,
    meta: {
      title: '实验室'
    }
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component:NotFound,
    meta:{
      title: '页面未找到'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/notfound'
  }
]

const matcher = createRouterMatcher(routes,{
    sensitive:false, // 不区分大小写
    strict:false, // 不严格匹配末尾斜杠
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  matcher,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Cisphus_World` : 'Welcome to Cisphus_World'
  next()
})

export default router