<template>
  <article
    class="post-card card"
    @click="handleClick"
  >
    <!-- 封面图片 -->
    <div class="post-cover">
      <img
        :src="post.coverImage || '/default-cover.png'"
        :alt="post.title"
        class="cover-image"
      />
      <div class="cover-overlay"></div>
    </div>

    <!-- 文章内容 -->
    <div class="post-content">
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-meta">
        <div class="post-info">
          <span class="post-date">{{ formattedDate }}</span>
          <span class="post-separator">•</span>
          <span class="post-reading-time">{{ readingTime }}</span>
        </div>
        <div class="post-tags" v-if="post.tags && post.tags.length > 0">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="post-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate, getReadingTime } from '@/views/Blog/helpers'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formattedDate = computed(() => {
  return formatDate(props.post.createdAt || props.post.date)
})

const readingTime = computed(() => {
  return getReadingTime(props.post.content)
})

const handleClick = () => {
  router.push(`/blog/${props.post.id}`)
}
</script>

<style scoped>
.post-card {
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: var(--spacing-6);
  padding: var(--spacing-6);
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  margin-bottom: var(--spacing-6);
  overflow: hidden;
}

.post-card:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary-500);
}

/* 封面图片 */
.post-cover {
  flex-shrink: 0;
  width: 280px;
  height: 180px;
  position: relative;
  border-radius: var(--radius-2);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .cover-image {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
}

/* 文章内容 */
.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.post-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
  line-height: 1.3;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-5);
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-default);
}

.post-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--text-secondary);
  font-size: 14px;
}

.post-separator {
  color: var(--text-secondary);
  opacity: 0.5;
}

.post-date,
.post-reading-time {
  color: var(--text-secondary);
  white-space: nowrap;
}

.post-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.post-tag {
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-2);
  font-size: 13px;
  border: 1px solid var(--border-default);
  white-space: nowrap;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .post-card {
    flex-direction: column;
  }

  .post-cover {
    width: 100%;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .post-card {
    padding: var(--spacing-4);
  }

  .post-title {
    font-size: 20px;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
}
</style>