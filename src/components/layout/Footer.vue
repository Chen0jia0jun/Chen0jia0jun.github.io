<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我</h3>
          <p class="footer-description">
            欢迎来到我的个人网站！这里是我分享照片、记录思考和展示作品的地方。
          </p>
        </div>
        
        <div class="footer-section">
          <h3>快速链接</h3>
          <nav class="footer-nav">
            <router-link to="/" class="footer-link">首页</router-link>
            <router-link to="/gallery" class="footer-link">照片画廊</router-link>
            <router-link to="/blog" class="footer-link">博客</router-link>
            <router-link to="/tests" class="footer-link">实验室</router-link>
          </nav>
        </div>
        
        <div class="footer-section">
          <h3>技术栈</h3>
          <div class="tech-stack">
            <span class="tech-item">Vue.js 3</span>
            <span class="tech-item">Vite</span>
            <span class="tech-item">Pinia</span>
            <span class="tech-item">Markdown</span>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} 我的个人网站. 用 ❤️ 构建
          </p>
          <div class="footer-stats">
            <span class="stat-item">{{ photoStore.photosCount }} 张照片</span>
            <span class="stat-separator">•</span>
            <span class="stat-item">{{ blogStore.postsCount }} 篇文章</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { usePhotoStore } from '@/store/photos'
import { useBlogStore } from '@/store/blog'

export default {
  name: 'Footer',
  setup() {
    const photoStore = usePhotoStore()
    const blogStore = useBlogStore()
    
    const currentYear = computed(() => new Date().getFullYear())
    
    return {
      photoStore,
      blogStore,
      currentYear
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

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

.footer-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.footer-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  padding: var(--spacing-1) 0;
}

.footer-link:hover {
  color: var(--primary-500);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tech-item {
  background-color: var(--bg-page);
  color: var(--text-secondary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-2);
  font-size: 14px;
  border: 1px solid var(--border-default);
}

.footer-bottom {
  border-top: 1px solid var(--border-default);
  padding-top: var(--spacing-8);
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
  font-size: 14px;
}

.stat-separator {
  color: var(--border-default);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: var(--spacing-12) 0 var(--spacing-6);
  }
  
  .footer-content {
    gap: var(--spacing-6);
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-2);
  }
}

@media (max-width: 480px) {
  .tech-stack {
    justify-content: center;
  }
}
</style>