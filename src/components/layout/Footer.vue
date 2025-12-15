<template>
  <footer class="footer">
    <div class="container">
      <!-- 主要内容区域 - 左右分栏 -->
      <div class="footer-main">
        <!-- 左侧：随机博客 -->
        <div class="footer-left">
          <div class="image-link-container">
            <a
              v-for="link in randomBlogLinks"
              :key="link.name"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="image-link"
              :title="link.description"
            >
              <img src="/transport.png" :alt="link.name" class="link-image" />
              <span class="link-label">{{ link.name }}</span>
            </a>
          </div>
          <div class="image-link-container">
            <!-- 虫洞链接 -->
            <a
              v-if="wormholeLink"
              :href="wormholeLink.url"
              target="_blank"
              rel="noopener noreferrer"
              class="image-link"
              :title="wormholeLink.description"
            >
              <img src="/blackhole.png" :alt="wormholeLink.name" class="link-image" />
              <span class="link-label">{{ wormholeLink.name }}</span>
            </a>
          </div>
        </div>

        <div class="footer-middle">
          <h3 class="section-title">社区</h3>
          <div class="links-grid">
            <a
              v-for="tech in TECH_STACK"
              :key="tech.name"
              :href="tech.link"
              target="_blank"
              rel="noopener noreferrer"
              class="tech-badge"
              :title="tech.description"
            >
              <img :src="tech.src" :alt="tech.name" class="shield-logo" />
            </a>
          </div>
        </div>

        <div class="footer-right">
          <h3 class="section-title">友链</h3>
          <div class="links-grid">
            <a
              v-for="link in FRIEND_LINKS"
              :key="link.name"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="friend-link"
              :title="link.description"
            >
              <div class="friend-avatar">
                <img :src="link.avatar" :alt="link.name" />
              </div>
              <div class="friend-info">
                <span class="friend-name">{{ link.name }}</span>
                <span class="friend-desc">{{ link.description }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} Cisyphus World.
          </p>
          <div class="footer-stats">
            <span class="stat-item">{{ photoStore.photosCount }} 张照片</span>
            <span class="stat-separator">•</span>
            <span class="stat-item">{{ blogStore.postsCount }} 篇文章</span>
            <span class="stat-separator">•</span>
            <span class="stat-item">运行 {{ siteRuntime.days }} 天 {{ siteRuntime.hours }} 时</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePhotoStore } from '@/store/photos'
import { useBlogStore } from '@/store/blog'
import { FRIEND_LINKS, TECH_STACK, RANDOM_BLOG_LINKS, SITE_START_DATE } from '@/utils/config.js'

export default {
  name: 'Footer',
  setup() {
    const photoStore = usePhotoStore()
    const blogStore = useBlogStore()

    const currentYear = computed(() => new Date().getFullYear())

    // 网站创建时间
    const siteStartDate = SITE_START_DATE;

    const siteRuntime = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })

    let runtimeTimer = null

    const updateRuntime = () => {
      const now = new Date()
      const diff = now - siteStartDate

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      siteRuntime.value = { days, hours, minutes, seconds }
    }

    onMounted(() => {
      updateRuntime()
      runtimeTimer = setInterval(updateRuntime, 60000) // 每分钟更新一次
    })

    onUnmounted(() => {
      if (runtimeTimer) {
        clearInterval(runtimeTimer)
      }
    })

    // 分离随机博客和虫洞链接
    const randomBlogLinks = computed(() => {
      return RANDOM_BLOG_LINKS.filter(link => link.name !== 'ForeverBlog')
    })

    const wormholeLink = computed(() => {
      return RANDOM_BLOG_LINKS.find(link => link.name === 'ForeverBlog')
    })

    return {
      photoStore,
      blogStore,
      currentYear,
      siteRuntime,
      TECH_STACK,
      FRIEND_LINKS,
      RANDOM_BLOG_LINKS,
      randomBlogLinks,
      wormholeLink,
    }
  }
}
</script>

<style scoped>
.footer {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: var(--spacing-24);
  padding: var(--spacing-16) 0 var(--spacing-8);
}

/* 暗色主题下的底部毛玻璃效果 */
[data-theme="dark"] .footer {
  background: rgba(20, 20, 20, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 主内容区域 - 左中右分栏 */
.footer-main {
  display: flex;
  gap: var(--spacing-12);
  margin-bottom: var(--spacing-12);
}

.footer-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.footer-right {
  flex: 4;
  display: flex;
  flex-direction: column;
}

.footer-middle{
  flex: 8;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
  text-align: center;
}

/* 图片链接容器 */
.image-link-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  align-items: center;
}

.image-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: var(--spacing-2);
}

.image-link:hover {
  transform: translateY(-4px);
}

.link-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.image-link:hover .link-image {
  transform: scale(1.1);
  filter: brightness(1.2);
}

/* 暗色主题下将图片变为白色 */
:host(.dark) .link-image,
:root[data-theme="dark"] .link-image {
  filter: invert(1) brightness(1.5);
}

.link-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

/* 技术栈和友情链接网格 */
.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: center;
  margin-top: var(--spacing-4);
}

/* 技术栈徽章 */
.tech-badge {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: var(--spacing-2);
}

.tech-badge:hover {
  transform: translateY(-2px);
}

.shield-logo {
  height: 24px;
}

/* 友情链接 */
.friend-link {
  display: flex;
  align-items: center;
  padding: var(--spacing-4);
  text-decoration: none;
  transition: all 0.3s ease;
  width: 280px;
  max-width: 100%;
}

.friend-link:hover {
  border-color: var(--primary-500);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.friend-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--border-default);
  transition: transform 0.3s ease;
}

.friend-link:hover .friend-avatar {
  transform: rotate(360deg);
  border-color: var(--primary-500);
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.friend-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.friend-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-desc {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部信息 */
.footer-bottom {
  border-top: 1px solid var(--border-default);
  padding-top: var(--spacing-6);
  margin-top: var(--spacing-8);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.copyright {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.footer-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-secondary);
  font-size: 13px;
}

.stat-separator {
  color: var(--border-default);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: var(--spacing-12) 0 var(--spacing-6);
  }

  .footer-main {
    flex-direction: column;
    gap: var(--spacing-8);
  }

  .links-grid {
    justify-content: center;
  }

  .friend-link {
    width: 100%;
  }

  .link-image {
    width: 60px;
    height: 60px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-3);
  }

  .footer-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 16px;
  }

  .tech-badge {
    padding: var(--spacing-2);
  }

  .footer-stats {
    font-size: 12px;
  }

  .link-image {
    width: 50px;
    height: 50px;
    background-color: var(--bg-page);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-2);
    padding: var(--spacing-2);
  }
}
</style>