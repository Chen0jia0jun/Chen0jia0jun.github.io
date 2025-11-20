import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Gallery from '@/views/Gallery.vue'
import Blog from '@/views/Blog.vue'
import BlogPost from '@/views/BlogPost.vue'
import Tests from '@/views/Tests.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
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
  document.title = to.meta.title ? `${to.meta.title} - 我的个人网站` : '我的个人网站'
  next()
})

export default router