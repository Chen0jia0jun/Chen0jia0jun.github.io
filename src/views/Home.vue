<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title fade-in">欢迎来到我的世界</h1>
          <p class="hero-subtitle fade-in">
            这里是我分享照片、记录思考和展示创作的空间。
            每一张照片都有它的故事，每一篇文章都承载着我的思考。
          </p>
          <div class="hero-actions fade-in">
            <router-link to="/gallery" class="btn btn-primary">
              浏览照片
            </router-link>
            <router-link to="/blog" class="btn btn-secondary">
              阅读博客
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ photoStore.photosCount }}</div>
            <div class="stat-label">照片</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ blogStore.postsCount }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ blogStore.allTags.length }}</div>
            <div class="stat-label">标签</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Photos -->
    <section class="recent-photos" v-if="recentPhotos.length > 0">
      <div class="container">
        <div class="section-header">
          <h2>最新照片</h2>
          <router-link to="/gallery" class="view-all">
            查看全部 →
          </router-link>
        </div>
        <div class="photo-grid">
          <div
            v-for="photo in recentPhotos.slice(0, 6)"
            :key="photo.id"
            class="photo-card"
            @click="$router.push('/gallery')"
          >
            <div class="photo-image">
              <img :src="photo.thumbnail || photo.url" :alt="photo.title" loading="lazy" />
              <div class="photo-overlay">
                <span class="photo-title">{{ photo.title }}</span>
                <span class="photo-date">{{ formatDate(photo.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Posts -->
    <section class="recent-posts" v-if="recentPosts.length > 0">
      <div class="container">
        <div class="section-header">
          <h2>最新文章</h2>
          <router-link to="/blog" class="view-all">
            查看全部 →
          </router-link>
        </div>
        <div class="posts-grid">
          <article
            v-for="post in recentPosts.slice(0, 3)"
            :key="post.id"
            class="post-card card"
            @click="$router.push(`/blog/${post.id}`)"
          >
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.createdAt || post.date) }}</span>
              <div class="post-tags">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="post-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2>网站功能</h2>
        </div>
        <div class="features-grid">
          <div class="feature-item card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <h3>照片画廊</h3>
            <p>精美的瀑布流布局展示照片，支持分类和标签管理</p>
          </div>
          
          <div class="feature-item card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
            </div>
            <h3>博客系统</h3>
            <p>支持Markdown格式编写文章，语法高亮，优雅排版</p>
          </div>
          
          <div class="feature-item card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </div>
            <h3>主题切换</h3>
            <p>支持深色和浅色主题，适应不同使用习惯</p>
          </div>
          
          <div class="feature-item card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2l3 3V8l-3 3z"/>
                <path d="M17 9a6 6 0 0 0-12 0c0 2.5 1.5 4.6 3.7 5.7L9 21h8l1.3-6.3c2.3-1.1 3.7-3.2 3.7-5.7"/>
              </svg>
            </div>
            <h3>响应式设计</h3>
            <p>完美适配各种设备，从手机到桌面都有优秀体验</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePhotoStore } from '@/store/photos'
import { useBlogStore } from '@/store/blog'

export default {
  name: 'Home',
  setup() {
    const photoStore = usePhotoStore()
    const blogStore = useBlogStore()

    const recentPhotos = computed(() => photoStore.photosByDate)
    const recentPosts = computed(() => blogStore.postsByDate)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return {
      photoStore,
      blogStore,
      recentPhotos,
      recentPosts,
      formatDate
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  padding: var(--spacing-24) 0;
  text-align: center;
  background: linear-gradient(135deg, var(--bg-page) 0%, var(--bg-surface) 100%);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* Stats Section */
.stats {
  padding: var(--spacing-16) 0;
  background-color: var(--bg-surface);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-8);
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: var(--spacing-6);
  border-radius: var(--radius-3);
  background-color: var(--bg-page);
  border: 1px solid var(--border-default);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.view-all {
  color: var(--primary-500);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: var(--primary-600);
}

/* Recent Photos */
.recent-photos {
  padding: var(--spacing-16) 0;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.photo-card {
  position: relative;
  border-radius: var(--radius-3);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: var(--shadow-light);
}

.photo-card:hover {
  transform: translateY(-4px);
}

.photo-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.photo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-image img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: var(--spacing-6);
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-overlay {
  transform: translateY(0);
}

.photo-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--spacing-2);
}

.photo-date {
  display: block;
  font-size: 14px;
  opacity: 0.8;
}

/* Recent Posts */
.recent-posts {
  padding: var(--spacing-16) 0;
  background-color: var(--bg-page);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.post-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
  line-height: 1.3;
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.post-date {
  color: var(--text-secondary);
  font-size: 14px;
}

.post-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.post-tag {
  background-color: var(--bg-page);
  color: var(--text-secondary);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-2);
  font-size: 12px;
  border: 1px solid var(--border-default);
}

/* Features */
.features {
  padding: var(--spacing-16) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

.feature-item {
  text-align: center;
  cursor: default;
}

.feature-item:hover {
  transform: none;
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-4);
  color: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-item h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.feature-item p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero {
    padding: var(--spacing-16) 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-header h2 {
    font-size: 28px;
  }
  
  .stats-grid {
    gap: var(--spacing-4);
  }
  
  .stat-item {
    padding: var(--spacing-4);
  }
  
  .stat-number {
    font-size: 28px;
  }
  
  .photo-grid,
  .posts-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>