<template>
  <article
    class="post-card card"
    @click="handleClick"
  >
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
console.log(props.post);

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
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
  line-height: 1.3;
  flex-shrink: 0;
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  margin-top: auto;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-default);
}

.post-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-secondary);
  font-size: 15px;
}

.post-separator {
  color: var(--border-default);
}

.post-reading-time {
  white-space: nowrap;
}

.post-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.post-tag {
  background-color: var(--primary-100);
  color: var(--primary-600);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-2);
  font-size: 13px;
  border: 1px solid var(--primary-200);
  white-space: nowrap;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
}
</style>