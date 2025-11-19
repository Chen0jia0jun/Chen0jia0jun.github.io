import { defineStore } from 'pinia'

export const usePhotoStore = defineStore('photos', {
  state: () => ({
    photos: [],
    isLoading: false
  }),
  
  getters: {
    photosCount: (state) => state.photos.length,
    
    photosByDate: (state) => {
      return [...state.photos].sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  
  actions: {
    async addPhoto(photoData) {
      const newPhoto = {
        id: Date.now().toString(),
        title: photoData.title || '无标题',
        description: photoData.description || '',
        url: photoData.url,
        thumbnail: photoData.thumbnail || photoData.url,
        date: photoData.date || new Date().toISOString(),
        tags: photoData.tags || [],
        uploadedAt: new Date().toISOString()
      }
      
      this.photos.unshift(newPhoto)
      this.saveToLocalStorage()
      return newPhoto
    },
    
    async removePhoto(photoId) {
      const index = this.photos.findIndex(p => p.id === photoId)
      if (index !== -1) {
        this.photos.splice(index, 1)
        this.saveToLocalStorage()
      }
    },
    
    async updatePhoto(photoId, updates) {
      const photo = this.photos.find(p => p.id === photoId)
      if (photo) {
        Object.assign(photo, updates)
        this.saveToLocalStorage()
      }
    },
    
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('photos')
        if (saved) {
          this.photos = JSON.parse(saved)
        }
      } catch (error) {
        console.error('加载照片数据失败:', error)
      }
    },
    
    saveToLocalStorage() {
      try {
        localStorage.setItem('photos', JSON.stringify(this.photos))
      } catch (error) {
        console.error('保存照片数据失败:', error)
      }
    },
    
    initPhotos() {
      this.loadFromLocalStorage()
    }
  }
})