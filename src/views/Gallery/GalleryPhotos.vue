<template>
  <div class="gallery-photos">
    <div class="container">
      <!-- Header -->
      <div class="gallery-header">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回相册列表
        </button>

        <div v-if="collection" class="collection-info">
          <h1>{{ collection.name }}</h1>
          <p class="gallery-subtitle" v-if="collection.description">
            {{ collection.description }}
          </p>
          <div class="gallery-stats">
            <span>共 {{ collection.photosCount || 0 }} 张照片</span>
            <span v-if="collection.date">创建于 {{ formatDate(collection.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Photo Grid -->
      <div class="photo-grid" v-if="photos.length > 0">
        <div
          v-for="photo in paginatedPhotos"
          :key="photo.id"
          class="photo-item"
          @click="openPhotoModal(photo)"
        >
          <div class="photo-wrapper">
            <img
              :src="photoStore.getImageUrl(photo.url)"
              :alt="photo.title"
              loading="lazy"
              class="photo-img"
              @error="handleImageError"
            />
            <div class="photo-overlay">
              <div class="photo-info">
                <h3 class="photo-title">{{ photo.title }}</h3>
                <p class="photo-description" v-if="photo.description">
                  {{ photo.description }}
                </p>
                <div class="photo-meta">
                  <span class="photo-date">{{ formatDate(photo.date) }}</span>
                  <div class="photo-tags" v-if="photo.tags.length > 0">
                    <span
                      v-for="tag in photo.tags"
                      :key="tag"
                      class="photo-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <h3>暂无照片</h3>
          <p>此相册中还没有照片</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-number"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- Photo Modal -->
    <PhotoModal
      v-if="selectedPhoto"
      :photo="selectedPhoto"
      @close="closePhotoModal"
      @delete="deletePhoto"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePhotoStore } from '@/store/photos'
import PhotoModal from '@/components/layout/PhotoModal.vue'

export default {
  name: 'GalleryPhotos',
  components: {
    PhotoModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const photoStore = usePhotoStore()

    const currentPage = ref(1)
    const photosPerPage = 20
    const selectedPhoto = ref(null)
    const defaultImageUrl = photoStore.getDefaultImageUrl()

    const collectionId = computed(() => route.params.id)

    const collection = computed(() => {
      return photoStore.collections.find(c => c.id === collectionId.value)
    })

    const photos = computed(() => {
      return photoStore.getPhotosByCollection(collectionId.value)
    })

    const totalPages = computed(() => Math.ceil(photos.value.length / photosPerPage))

    const paginatedPhotos = computed(() => {
      const start = (currentPage.value - 1) * photosPerPage
      const end = start + photosPerPage
      return photos.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      const delta = 2

      pages.push(1)

      for (let i = current - delta; i <= current + delta; i++) {
        if (i > 1 && i < total) {
          pages.push(i)
        }
      }

      if (total > 1) {
        pages.push(total)
      }

      return [...new Set(pages)].sort((a, b) => a - b)
    })

    const goBack = () => {
      router.push('/gallery')
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        document.querySelector('.gallery-photos').scrollIntoView({ behavior: 'smooth' })
      }
    }

    const openPhotoModal = (photo) => {
      selectedPhoto.value = photo
    }

    const closePhotoModal = () => {
      selectedPhoto.value = null
    }

    const deletePhoto = async (photoId) => {
      await photoStore.removePhoto(photoId)
      closePhotoModal()
    }

    const handleImageError = (event) => {
      event.target.src = defaultImageUrl
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
      if (!collection.value) {
        router.push('/gallery')
      }
    })

    watch(collectionId, () => {
      currentPage.value = 1
    })

    return {
      photoStore,
      collection,
      photos,
      currentPage,
      selectedPhoto,
      paginatedPhotos,
      totalPages,
      visiblePages,
      goBack,
      changePage,
      openPhotoModal,
      closePhotoModal,
      deletePhoto,
      handleImageError,
      formatDate
    }
  }
}
</script>

<style scoped>
.gallery-photos {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

/* Header */
.gallery-header {
  margin-bottom: var(--spacing-12);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4) var(--spacing-4);
  color: var(--primary-100);
  background-color: unset;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  margin-bottom: var(--spacing-6);
}


.collection-info {
  text-align: center;
}

.collection-info h1 {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-100);
  margin-bottom: var(--spacing-4);
}

.gallery-subtitle {
  font-size: 18px;
  color: var(--primary-100);
  margin-bottom: var(--spacing-6);
}

.gallery-stats {
  color: var(--primary-100);
  font-size: 14px;
  display: flex;
  justify-content: center;
  gap: var(--spacing-6);
}

/* Photo Grid */
.photo-grid {
  columns: 1;
  column-gap: var(--spacing-6);
  margin-bottom: var(--spacing-12);
}

@media (min-width: 640px) {
  .photo-grid {
    columns: 2;
  }
}

@media (min-width: 1024px) {
  .photo-grid {
    columns: 3;
  }
}

@media (min-width: 1280px) {
  .photo-grid {
    columns: 4;
  }
}

.photo-item {
  break-inside: avoid;
  margin-bottom: var(--spacing-6);
  cursor: pointer;
}

.photo-wrapper {
  position: relative;
  border-radius: var(--radius-3);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: transform 0.3s ease;
}

.photo-wrapper:hover {
  transform: translateY(-4px);
}

.photo-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.photo-wrapper:hover .photo-img {
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

.photo-wrapper:hover .photo-overlay {
  transform: translateY(0);
}

.photo-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--spacing-2);
}

.photo-description {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: var(--spacing-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.photo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.photo-date {
  font-size: 12px;
  opacity: 0.8;
}

.photo-tags {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.photo-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
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

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.page-btn {
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--bg-page);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: var(--spacing-2);
}

.page-number {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.page-number:hover,
.page-number.active {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .collection-info h1 {
    font-size: 36px;
  }

  .gallery-subtitle {
    font-size: 16px;
  }

  .gallery-stats {
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .back-btn {
    margin-bottom: var(--spacing-4);
  }

  .photo-grid {
    columns: 1;
  }

  .pagination {
    gap: var(--spacing-2);
  }

  .page-numbers {
    order: -1;
  }
}
</style>
