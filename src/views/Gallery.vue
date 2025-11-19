<template>
  <div class="gallery">
    <div class="container">
      <!-- Header -->
      <div class="gallery-header">
        <h1>照片画廊</h1>
        <p class="gallery-subtitle">
          记录生活中的美好瞬间，分享视觉的故事
        </p>
        <div class="gallery-stats">
          <span>共 {{ photoStore.photosCount }} 张照片</span>
        </div>
      </div>

      <!-- Upload Section -->
      <div class="upload-section">
        <div class="upload-area" 
             @drop="handleDrop" 
             @dragover="handleDragOver"
             @dragenter="handleDragEnter"
             @dragleave="handleDragLeave"
             :class="{ 'drag-over': isDragging }"
        >
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            multiple
            style="display: none"
          >
          
          <div class="upload-content">
            <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <h3>上传照片</h3>
            <p>拖拽照片到此处，或点击选择文件</p>
            <button @click="openFileDialog" class="btn btn-primary">
              选择文件
            </button>
            <p class="upload-hint">
              支持 JPG、PNG、GIF 格式，单张最大 10MB
            </p>
          </div>
        </div>
      </div>

      <!-- Filters and Sort -->
      <div class="gallery-controls" v-if="photoStore.photosCount > 0">
        <div class="controls-left">
          <button 
            class="filter-btn"
            :class="{ active: filterTag === '' }"
            @click="setFilterTag('')"
          >
            全部 ({{ photoStore.photosCount }})
          </button>
          <button 
            v-for="tag in allTags"
            :key="tag"
            class="filter-btn"
            :class="{ active: filterTag === tag }"
            @click="setFilterTag(tag)"
          >
            {{ tag }} ({{ getTagCount(tag) }})
          </button>
        </div>
        
        <div class="controls-right">
          <select v-model="sortBy" class="sort-select">
            <option value="date-desc">最新优先</option>
            <option value="date-asc">最早优先</option>
            <option value="title-asc">标题 A-Z</option>
            <option value="title-desc">标题 Z-A</option>
          </select>
        </div>
      </div>

      <!-- Photo Grid -->
      <div class="photo-grid" v-if="filteredPhotos.length > 0">
        <div 
          v-for="photo in paginatedPhotos"
          :key="photo.id"
          class="photo-item"
          @click="openPhotoModal(photo)"
        >
          <div class="photo-wrapper">
            <img 
              :src="photo.thumbnail || photo.url" 
              :alt="photo.title"
              loading="lazy"
              class="photo-img"
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
          <h3>还没有照片</h3>
          <p>开始上传你的第一张照片吧！</p>
          <button @click="openFileDialog" class="btn btn-primary">
            上传照片
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { usePhotoStore } from '@/store/photos'
import PhotoModal from '@/components/PhotoModal.vue'

export default {
  name: 'Gallery',
  components: {
    PhotoModal
  },
  setup() {
    const photoStore = usePhotoStore()
    
    // Reactive data
    const isDragging = ref(false)
    const filterTag = ref('')
    const sortBy = ref('date-desc')
    const selectedPhoto = ref(null)
    const currentPage = ref(1)
    const photosPerPage = 12
    
    // Computed properties
    const allTags = computed(() => {
      const tags = new Set()
      photoStore.photos.forEach(photo => {
        photo.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    })
    
    const filteredPhotos = computed(() => {
      let photos = [...photoStore.photosByDate]
      
      // Filter by tag
      if (filterTag.value) {
        photos = photos.filter(photo => photo.tags.includes(filterTag.value))
      }
      
      // Sort
      switch (sortBy.value) {
        case 'date-desc':
          photos.sort((a, b) => new Date(b.date) - new Date(a.date))
          break
        case 'date-asc':
          photos.sort((a, b) => new Date(a.date) - new Date(b.date))
          break
        case 'title-asc':
          photos.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
          break
        case 'title-desc':
          photos.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'))
          break
      }
      
      return photos
    })
    
    const totalPages = computed(() => Math.ceil(filteredPhotos.value.length / photosPerPage))
    
    const paginatedPhotos = computed(() => {
      const start = (currentPage.value - 1) * photosPerPage
      const end = start + photosPerPage
      return filteredPhotos.value.slice(start, end)
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      const delta = 2
      
      // Always show first page
      pages.push(1)
      
      // Show pages around current page
      for (let i = current - delta; i <= current + delta; i++) {
        if (i > 1 && i < total) {
          pages.push(i)
        }
      }
      
      // Always show last page
      if (total > 1) {
        pages.push(total)
      }
      
      // Remove duplicates and sort
      return [...new Set(pages)].sort((a, b) => a - b)
    })
    
    // Methods
    const openFileDialog = () => {
      document.querySelector('input[type="file"]').click()
    }
    
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      uploadFiles(files)
      event.target.value = '' // Reset input
    }
    
    const handleDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
      uploadFiles(files)
    }
    
    const handleDragOver = (event) => {
      event.preventDefault()
    }
    
    const handleDragEnter = (event) => {
      event.preventDefault()
      isDragging.value = true
    }
    
    const handleDragLeave = (event) => {
      event.preventDefault()
      if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
        isDragging.value = false
      }
    }
    
    const uploadFiles = async (files) => {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`文件 ${file.name} 超过 10MB 限制`)
          continue
        }
        
        if (!file.type.startsWith('image/')) {
          alert(`文件 ${file.name} 不是图片格式`)
          continue
        }
        
        const reader = new FileReader()
        reader.onload = async (e) => {
          await photoStore.addPhoto({
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: e.target.result,
            thumbnail: e.target.result,
            date: new Date().toISOString().split('T')[0],
            tags: []
          })
        }
        reader.readAsDataURL(file)
      }
    }
    
    const setFilterTag = (tag) => {
      filterTag.value = tag
      currentPage.value = 1
    }
    
    const getTagCount = (tag) => {
      return photoStore.photos.filter(photo => photo.tags.includes(tag)).length
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        // Scroll to top of gallery
        document.querySelector('.gallery').scrollIntoView({ behavior: 'smooth' })
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
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    onMounted(() => {
      if (photoStore.photosCount === 0) {
        currentPage.value = 1
      }
    })
    
    return {
      photoStore,
      isDragging,
      filterTag,
      sortBy,
      selectedPhoto,
      currentPage,
      allTags,
      filteredPhotos,
      paginatedPhotos,
      totalPages,
      visiblePages,
      openFileDialog,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      setFilterTag,
      getTagCount,
      changePage,
      openPhotoModal,
      closePhotoModal,
      deletePhoto,
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

.gallery-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.gallery-stats {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Upload Section */
.upload-section {
  margin-bottom: var(--spacing-12);
}

.upload-area {
  border: 2px dashed var(--border-default);
  border-radius: var(--radius-3);
  padding: var(--spacing-12);
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--bg-surface);
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--primary-500);
  background-color: var(--primary-100);
}

.upload-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: var(--spacing-4) 0;
}

.upload-icon {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
}

.upload-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.upload-hint {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: var(--spacing-4);
}

/* Controls */
.gallery-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.controls-left {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.filter-btn:hover,
.filter-btn.active {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

.controls-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.sort-select {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-size: 14px;
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
  margin-bottom: var(--spacing-8);
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
  .gallery-header h1 {
    font-size: 36px;
  }
  
  .gallery-subtitle {
    font-size: 16px;
  }
  
  .gallery-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .controls-left {
    justify-content: center;
  }
  
  .controls-right {
    justify-content: center;
  }
  
  .upload-area {
    padding: var(--spacing-8);
  }
  
  .upload-content h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    columns: 1;
  }
  
  .controls-left {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .pagination {
    gap: var(--spacing-2);
  }
  
  .page-numbers {
    order: -1;
  }
}
</style>