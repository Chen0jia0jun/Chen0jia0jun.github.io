<template>
  <div class="gallery-carousel-background">
    <div class="carousel-container">
      <div class="carousel-track" :style="trackStyle">
        <!-- 第一组图片 -->
        <div class="carousel-group" v-for="(row, rowIndex) in rows" :key="`group1-${rowIndex}`">
          <div class="photo-row">
            <div
              v-for="photo in row"
              :key="photo.id"
              class="carousel-photo"
            >
              <img
                :src="photoStore.getImageUrl(photo.url)"
                :alt="photo.title"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>

        <!-- 第二组图片（用于无缝循环） -->
        <div class="carousel-group" v-for="(row, rowIndex) in rows" :key="`group2-${rowIndex}`">
          <div class="photo-row">
            <div
              v-for="photo in row"
              :key="photo.id"
              class="carousel-photo"
            >
              <img
                :src="photoStore.getImageUrl(photo.url)"
                :alt="photo.title"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePhotoStore } from '@/store/photos'

export default {
  name: 'GalleryCarousel',
  setup() {
    const photoStore = usePhotoStore()
    const defaultImageUrl = photoStore.getDefaultImageUrl()
    const screenWidth = ref(0)

    // 更新屏幕宽度
    const updateScreenWidth = () => {
      screenWidth.value = window.innerWidth
    }

    onMounted(() => {
      updateScreenWidth()
      window.addEventListener('resize', updateScreenWidth)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateScreenWidth)
    })

    // 获取所有照片
    const allPhotos = computed(() => {
      return photoStore.photosByDate
    })

    // 计算每行显示多少张图片（固定为10张铺满屏幕）
    const photosPerRow = computed(() => {
      return 10 // 固定10张图片铺满屏幕宽度
    })

    // 创建多行图片
    const rows = computed(() => {
      const result = []
      const photos = [...allPhotos.value]
      const rowCount = 6 // 显示6行

      // 如果没有照片，使用默认图片
      if (photos.length === 0) {
        photos.push(
          { id: '1', title: 'Image 1', url: 'https://picsum.photos/200?random=1' },
          { id: '2', title: 'Image 2', url: 'https://picsum.photos/200?random=2' },
          { id: '3', title: 'Image 3', url: 'https://picsum.photos/200?random=3' },
          { id: '4', title: 'Image 4', url: 'https://picsum.photos/200?random=4' },
          { id: '5', title: 'Image 5', url: 'https://picsum.photos/200?random=5' },
          { id: '6', title: 'Image 6', url: 'https://picsum.photos/200?random=6' },
          { id: '7', title: 'Image 7', url: 'https://picsum.photos/200?random=7' },
          { id: '8', title: 'Image 8', url: 'https://picsum.photos/200?random=8' },
          { id: '9', title: 'Image 9', url: 'https://picsum.photos/200?random=9' },
          { id: '10', title: 'Image 10', url: 'https://picsum.photos/200?random=10' }
        )
      }

      // 填充到足够数量
      while (photos.length < photosPerRow.value * rowCount) {
        photos.push(...allPhotos.value)
      }

      // 创建多行
      for (let i = 0; i < rowCount; i++) {
        const start = i * photosPerRow.value
        const end = start + photosPerRow.value
        result.push(photos.slice(start, end))
      }

      // 复制一组用于无缝循环
      const allRows = [...result, ...result]

      return allRows
    })

    // 计算滑动速度
    const animationDuration = computed(() => {
      const rowCount = rows.value.length / 2 // 实际行数（去除重复）
      return 30000 / rowCount // 每行30秒
    })

    const trackStyle = computed(() => {
      return {
        '--animation-duration': `${animationDuration.value}ms`
      }
    })

    const handleImageError = (event) => {
      event.target.src = defaultImageUrl
    }

    return {
      photoStore,
      rows,
      trackStyle,
      handleImageError
    }
  }
}
</script>

<style scoped>
.gallery-carousel-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
}

.carousel-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
}

.carousel-track {
  display: flex;
  flex-direction: column;
  animation: slide var(--animation-duration) linear infinite;
}

.carousel-group {
  flex-shrink: 0;
  height: 100px;
}

.photo-row {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-4);
  height: 100%;
  justify-content: center;
}

.carousel-photo {
  flex: 0 0 calc((100vw - var(--spacing-4) * 2 - var(--spacing-2) * 9) / 10);
  height: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-1);
  overflow: hidden;
  opacity: 0.5;
  transition: all 0.3s ease;
  filter: blur(0.5px);
}

.carousel-photo:hover {
  transform: scale(1.05);
  opacity: 0.8;
  filter: blur(0);
}

.carousel-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@keyframes slide {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

/* 悬停时暂停动画 */
.carousel-container:hover .carousel-track {
  animation-play-state: paused;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .carousel-photo {
    --photos-per-row: 5;
  }
}

@media (max-width: 1023px) {
  .carousel-photo {
    --photos-per-row: 4;
  }
}

@media (max-width: 639px) {
  .carousel-photo {
    --photos-per-row: 3;
  }

  .photo-row {
    gap: var(--spacing-3);
  }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none;
  }
}
</style>
