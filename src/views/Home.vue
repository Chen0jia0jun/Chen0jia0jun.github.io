<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Cisphus</h1>
        <TypewriterText
          :texts="TEXT"
          :type-speed="100"
          :delete-speed="50"
          :delay-between-texts="2000"
          :start-delay="1800"
          :loop="true"
        />
      </div>
      <div class="scroll-indicator" @click="scrollToContent">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- Main Content Area -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- Left Content -->
        <div class="content-left">
          <!-- Recent Photos -->
          <section class="recent-photos" v-if="recentPhotos.length > 0">
            <div class="section-header">
              <h2 style="color:var(--primary-100)">最新照片</h2>
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
          </section>

          <!-- Recent Posts -->
          <section class="recent-posts" v-if="recentPosts.length > 0">
            <div class="section-header">
              <h2 style="color:var(--primary-100)">最新文章</h2>
              <router-link to="/blog" class="view-all">
                查看全部 →
              </router-link>
            </div>
            <div class="posts-grid">
              <BlogCard
                v-for="post in recentPosts.slice(0,3)"
                :key="post.id"
                :post="post"
                />
            </div>
          </section>
        </div>

        <!-- Right Sidebar -->
        <aside class="content-right">
          <ProfileCard
            :name="profile.name"
            :bio="profile.bio"
            :avatar-url="profile.avatarUrl"
            :social-links="profile.socialLinks"
            :stats="{
              posts: blogStore.postsCount,
              tags: blogStore.allTags.length,
              photos: photoStore.photosCount
            }"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePhotoStore } from '@/store/photos'
import { useBlogStore } from '@/store/blog'
import BlogCard from '@/components/common/blogCard.vue'
import TypewriterText from '@/components/common/TypewriterText.vue'
import ProfileCard from '@/components/common/ProfileCard.vue'
import { TEXT } from '@/utils/typeWriterText.js'
import { PROFILE } from '@/utils/config.js'

export default {
  name: 'Home',
  components: {
    BlogCard,
    TypewriterText,
    ProfileCard
  },
  setup() {
    const photoStore = usePhotoStore()
    const blogStore = useBlogStore()

    const recentPhotos = computed(() => photoStore.photosByDate)
    const recentPosts = computed(() => blogStore.postsByDate)

    // 个人资料信息
    const profile = computed(() => PROFILE);

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const scrollToContent = () => {
      const statsSection = document.querySelector('.recent-photos')
      console.log(statsSection);
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    return {
      photoStore,
      blogStore,
      TEXT,
      profile,
      recentPhotos,
      recentPosts,
      formatDate,
      scrollToContent
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  scroll-behavior: smooth;
}

/* Hero Section */
.hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
  transition: background 0.3s ease;
}

.hero:hover::before {
  background: rgba(0, 0, 0, 0.5);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 100%;
  animation: fadeInUp 1.2s ease-out;
}

.hero-title {
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  animation: fadeInScale 1.5s ease-out;
}

/* Typewriter Text Styles */
.hero-content :deep(.typewriter) {
  font-size: clamp(18px, 3vw, 28px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 20px;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  display: block;
  min-height: 1.5em;
}

.hero-content :deep(.cursor) {
  background-color: rgba(255, 255, 255, 0.8);
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  animation: bounce 2s infinite;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-indicator svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Main Content Area */
.main-content {
  padding: var(--spacing-16) 0;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--spacing-8);
}

/* Left Content */
.content-left {
  min-width: 0;
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
  color: var(--primary-100);
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
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .content-right {
    order: -1;
    max-width: 600px;
    margin: 0 auto var(--spacing-8) auto;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(36px, 12vw, 72px);
    padding: 0 var(--spacing-4);
  }

  .scroll-indicator {
    bottom: 30px;
  }

  .hero {
    background-attachment: scroll;
  }

  .content-wrapper {
    padding: 0 var(--spacing-4);
    gap: var(--spacing-6);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header h2 {
    font-size: 28px;
  }

  .photo-grid,
  .posts-grid {
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
}
</style>