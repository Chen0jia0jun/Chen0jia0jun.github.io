<template>
  <div class="gallery">
    <div class="container">
      <!-- Header -->
      <div class="gallery-header">
        <h1 style="color:var(--primary-100)">照片画廊</h1>
        <div class="gallery-stats">
          <span>共 {{ photoStore.collectionsCount }} 个相册</span>
          <span>共 {{ photoStore.photosCount }} 张照片</span>
        </div>
      </div>

      <!-- Collections Grid -->
      <div class="collections-grid" v-if="photoStore.collectionsCount > 0">
        <div
          v-for="collection in collections"
          :key="collection.id"
          class="collection-item"
          @click="goToCollection(collection.id)"
        >
          <div class="collection-wrapper">
            <div class="collection-cover">
              <img
                :src="getCollectionCover(collection)"
                :alt="collection.name"
                loading="lazy"
                class="collection-cover-img"
                @error="handleImageError"
              />
              <div class="collection-overlay">
                <div class="collection-info">
                  <h3 class="collection-name">{{ collection.name }}</h3>
                  <p class="collection-description" v-if="collection.description">
                    {{ collection.description }}
                  </p>
                  <div class="collection-meta">
                    <span class="photos-count">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                      </svg>
                      {{ collection.photosCount }} 张照片
                    </span>
                    <span class="collection-date" v-if="collection.date">
                      {{ formatDate(collection.date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="collection-footer">
              <h4 class="collection-title">{{ collection.name }}</h4>
              <button class="view-btn">
                查看相册
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <h3>还没有相册</h3>
          <p>开始创建你的第一个相册吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePhotoStore } from '@/store/photos'

export default {
  name: 'Gallery',
  setup() {
    const router = useRouter()
    const photoStore = usePhotoStore()

    const defaultImageUrl = photoStore.getDefaultImageUrl()

    const collections = computed(() => {
      return photoStore.collectionsWithPhotos
    })

    const getCollectionCover = (collection) => {
      if (collection.cover) {
        return photoStore.getImageUrl(collection.cover)
      }
      // 如果相册没有封面，使用第一张照片作为封面
      if (collection.photos && collection.photos.length > 0) {
        return photoStore.getImageUrl(collection.photos[0].url)
      }
      return defaultImageUrl
    }

    const handleImageError = (event) => {
      event.target.src = defaultImageUrl
    }

    const goToCollection = (collectionId) => {
      router.push(`/gallery/${collectionId}`)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(() => {

      // 如果没有照片，添加一些示例图片用于展示轮播效果
      if (photoStore.photosCount === 0) {
        const sampleImages = [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
          'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
          'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400'
        ]

        const collectionId = Date.now().toString()

        // 创建默认相册
        photoStore.collections = [{
          id: collectionId,
          name: '示例相册',
          description: '美丽的风景照片',
          cover: '',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }]

        // 添加示例照片
        sampleImages.forEach((url, index) => {
          photoStore.photos.push({
            id: `sample-${index}`,
            title: `示例图片 ${index + 1}`,
            description: '这是示例图片',
            url: url,
            collectionId: collectionId,
            date: new Date().toISOString().split('T')[0],
            tags: ['示例'],
            uploadedAt: new Date().toISOString()
          })
        })

        // 保存到本地存储
        photoStore.saveToLocalStorage()
      }
    })

    return {
      photoStore,
      collections,
      getCollectionCover,
      handleImageError,
      goToCollection,
      formatDate
    }
  }
}
</script>

<style scoped>
.gallery {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

/* Header */
.gallery-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.gallery-header h1 {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.gallery-stats {
  color: var(--primary-100);
  font-size: 14px;
  display: flex;
  justify-content: center;
  gap: var(--spacing-6);
}

/* Collections Grid */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-12);
}

@media (max-width: 640px) {
  .collections-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
}

.collection-item {
  cursor: pointer;
}

.collection-wrapper {
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.collection-wrapper:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-medium);
}

.collection-cover {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.collection-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.collection-wrapper:hover .collection-cover-img {
  transform: scale(1.1);
}

.collection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.collection-wrapper:hover .collection-overlay {
  opacity: 1;
}

.collection-info {
  color: white;
  width: 100%;
}

.collection-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--spacing-2);
  color: white;
}

.collection-description {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: var(--spacing-3);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.photos-count {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: 13px;
  opacity: 0.95;
}

.collection-date {
  font-size: 12px;
  opacity: 0.8;
}

.collection-footer {
  padding: var(--spacing-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collection-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-2);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-btn:hover {
  background-color: var(--primary-600);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-24) 0;
}

.empty-content svg {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.empty-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.empty-content p {
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gallery-header h1 {
    font-size: 36px;
  }

  .gallery-stats {
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .collections-grid {
    grid-template-columns: 1fr;
  }

  .collection-cover {
    height: 250px;
  }

  .collection-name {
    font-size: 20px;
  }

  .collection-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }

  .view-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
