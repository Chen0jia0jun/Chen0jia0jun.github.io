<template>
  <div class="profile-card">
    <!-- 头像部分 -->
    <div class="avatar-section">
      <div class="avatar-container">
        <img
          :src="avatarUrl"
          alt="个人头像"
          class="avatar"
        />
      </div>
      <!-- 资讯汇总链接 -->
       <div class="info-summary-link">
        <a
          href="https://tophub.today"
          target="_blank"
          rel="noopener noreferrer"
          title="点击打开资讯汇总"
        >
          <img
           src="@/assets/photos/go.svg"
           alt="资讯汇总"
           class="go-image-link"
           />
        </a>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="info-section">
      <h3 class="name">{{ name }}</h3>
      <p class="bio">{{ bio }}</p>
    </div>

    <!-- 社交链接 -->
    <div class="social-links">
      <a
        v-for="link in socialLinks"
        :key="link.platform"
        :href="link.url"
        :title="link.platform"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="social-icon" v-html="link.icon"></div>
      </a>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ stats.posts }}</div>
        <div class="stat-label">文章</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.tags }}</div>
        <div class="stat-label">标签</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.photos }}</div>
        <div class="stat-label">照片</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ProfileCard',
  props: {
    name: {
      type: String,
      default: 'Cisyphus'
    },
    bio: {
      type: String,
      default: '天气晴朗，万物可爱'
    },
    avatarUrl: {
      type: String,
      default: '/avatar.jpg'
    },
    stats: {
      type: Object,
      default: () => ({
        posts: 0,
        tags: 0,
        photos: 0
      })
    },
    socialLinks: {
      type: Array,
      default: () => []
    }
  },
}
</script>

<style scoped>
.profile-card {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: sticky;
  top: calc(var(--navbar-height, 60px) + var(--spacing-6));
  max-width: 360px;
  margin: 0 auto;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

/* 头像部分 */
.avatar-section {
  text-align: center;
  margin-bottom: var(--spacing-6);
  display: flex;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin: 0 auto;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-500);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.avatar-container:hover .avatar {
  transform: scale(1.05);
}

.info-summary-link{
  position: absolute;
  right: 5%;
  top: 5%;
}

.go-image-link {
  width: 30px;
  height: 30px;
  transition: transform 0.3s ease;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 基本信息 */
.info-section {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-3) 0;
  letter-spacing: 0.05em;
}

.bio {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
  line-height: 1.6;
}

/* 社交链接 */
.social-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-link:hover {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
  transform: translateY(-2px);
}

.social-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* 统计信息 */
.stats-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--spacing-4) 0;
  border-top: 1px solid var(--border-default);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background-color: var(--border-default);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-card {
    position: relative;
    top: 0;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .profile-card {
    padding: var(--spacing-4);
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .name {
    font-size: 20px;
  }

  .bio {
    font-size: 13px;
  }

  .social-links {
    gap: var(--spacing-3);
  }

  .social-link {
    width: 36px;
    height: 36px;
  }

  .social-icon {
    width: 18px;
    height: 18px;
  }

  .stat-number {
    font-size: 20px;
  }
}
</style>
