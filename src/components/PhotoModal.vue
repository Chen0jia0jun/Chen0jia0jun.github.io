<template>
  <div class="photo-modal-overlay" @click="handleOverlayClick">
    <div class="photo-modal" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">{{ photo.title }}</h2>
        <button class="modal-close" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Image -->
      <div class="modal-image">
        <img :src="photo.url" :alt="photo.title" />
      </div>

      <!-- Details -->
      <div class="modal-details">
        <div class="detail-section" v-if="photo.description">
          <h3>描述</h3>
          <p>{{ photo.description }}</p>
        </div>

        <div class="detail-section">
          <h3>拍摄时间</h3>
          <p>{{ formatDate(photo.date) }}</p>
        </div>

        <div class="detail-section" v-if="photo.tags.length > 0">
          <h3>标签</h3>
          <div class="photo-tags">
            <span 
              v-for="tag in photo.tags"
              :key="tag"
              class="photo-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="detail-section">
          <h3>上传时间</h3>
          <p>{{ formatDate(photo.uploadedAt) }}</p>
        </div>

        <div class="modal-actions">
          <button 
            class="btn btn-secondary"
            @click="downloadImage"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            下载图片
          </button>
          <button 
            class="btn btn-danger"
            @click="confirmDelete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            删除照片
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click="cancelDelete">
      <div class="delete-confirm-modal" @click.stop>
        <h3>确认删除</h3>
        <p>确定要删除这张照片「{{ photo.title }}」吗？此操作不可撤销。</p>
        <div class="delete-actions">
          <button class="btn btn-secondary" @click="cancelDelete">
            取消
          </button>
          <button class="btn btn-danger" @click="confirmDeleteAction">
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PhotoModal',
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'delete'],
  setup(props, { emit }) {
    const showDeleteConfirm = ref(false)

    const handleOverlayClick = () => {
      emit('close')
    }

    const downloadImage = () => {
      const link = document.createElement('a')
      link.href = props.photo.url
      link.download = props.photo.title || 'photo'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const confirmDelete = () => {
      showDeleteConfirm.value = true
    }

    const cancelDelete = () => {
      showDeleteConfirm.value = false
    }

    const confirmDeleteAction = () => {
      emit('delete', props.photo.id)
      showDeleteConfirm.value = false
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      showDeleteConfirm,
      handleOverlayClick,
      downloadImage,
      confirmDelete,
      cancelDelete,
      confirmDeleteAction,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Modal Overlay */
.photo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

/* Modal */
.photo-modal {
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-default);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-2);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--bg-page);
  color: var(--text-primary);
}

/* Image */
.modal-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-page);
  min-height: 300px;
  max-height: 400px;
  overflow: hidden;
}

.modal-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Details */
.modal-details {
  padding: var(--spacing-6);
  max-height: 300px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: var(--spacing-6);
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
}

.detail-section p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.photo-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.photo-tag {
  background-color: var(--primary-100);
  color: var(--primary-600);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-2);
  font-size: 14px;
  border: 1px solid var(--primary-200);
}

/* Actions */
.modal-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border-default);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  border-radius: var(--radius-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-danger {
  background-color: var(--error);
  color: white;
}

.btn-danger:hover {
  background-color: #DC2626;
}

/* Delete Confirmation */
.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.delete-confirm-modal {
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  padding: var(--spacing-8);
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.delete-confirm-modal h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.delete-confirm-modal p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-8);
}

.delete-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .photo-modal {
    width: 95vw;
    height: 90vh;
  }
  
  .modal-header {
    padding: var(--spacing-4);
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .modal-image {
    max-height: 300px;
  }
  
  .modal-details {
    padding: var(--spacing-4);
    max-height: 200px;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .delete-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .delete-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .photo-modal-overlay {
    padding: var(--spacing-2);
  }
  
  .modal-image {
    max-height: 250px;
  }
  
  .modal-details {
    max-height: 150px;
  }
}
</style>