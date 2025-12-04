<template>
  <footer class="footer">
    <div class="container">
      <!-- 技术栈 -->
      <div class="footer-section tech-section">
        <h3>Community</h3>
        <div class="tech-grid">
          <a
            v-for="tech in TECH_STACK"
            :key="tech.name"
            :href="tech.link"
            target="_blank"
            rel="noopener noreferrer"
            class="tech-card"
            :title="tech.description"
          >
          <img :src="tech.src" :alt="tech.name" class="shield-logo" />
          </a>
        </div>
      </div>

      <!-- 友情链接 -->
      <div class="footer-section friends-section">
        <h3>友链</h3>
        <div class="friends-grid">
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


      <!-- 底部信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} Cisphus World.
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
import { FRIEND_LINKS, TECH_STACK, SITE_START_DATE } from '@/utils/config.js'

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

    return {
      photoStore,
      blogStore,
      currentYear,
      siteRuntime,
      TECH_STACK,
      FRIEND_LINKS,
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  margin-top: var(--spacing-24);
  padding: var(--spacing-16) 0 var(--spacing-8);
}

/* 技术栈区域 */
.tech-section {
  margin-bottom: var(--spacing-12);
}

.tech-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
  text-align: center;
}

.tech-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.tech-card {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-2px);
}

.shield-logo {
  height: 24px;
}

/* 友情链接区域 */
.friends-section {
  margin-bottom: var(--spacing-12);
}

.friends-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
  text-align: center;
}

.friends-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-4);
  max-width: 100%;
}

.friend-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background-color: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2);
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

/* 快速链接区域 */
.links-section {
  margin-bottom: var(--spacing-12);
}

.links-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
  text-align: center;
}

.footer-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
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

  .tech-grid {
    gap: var(--spacing-3);
  }

  .friends-grid {
    justify-content: center;
  }

  .friend-link {
    width: 100%;
  }

  .footer-nav {
    gap: var(--spacing-2);
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
  .tech-section h3,
  .friends-section h3,
  .links-section h3 {
    font-size: 16px;
  }

  .tech-card {
    padding: var(--spacing-2) var(--spacing-3);
  }

  .tech-name {
    font-size: 13px;
  }

  .footer-stats {
    font-size: 12px;
  }
}
</style>