import { defineStore } from 'pinia'

export const usePhotoStore = defineStore('photos', {
  state: () => ({
    photos: [],
    collections: [],
    isLoading: false,
    // GitHub图床基础URL
    githubImageBase: 'https://raw.githubusercontent.com/Chen0jia0jun/PicGo_Repo/main'
  }),

  getters: {
    photosCount: (state) => state.photos.length,
    collectionsCount: (state) => state.collections.length,

    photosByDate: (state) => {
      return [...state.photos].sort((a, b) => new Date(b.date) - new Date(a.date))
    },

    collectionsWithPhotos: (state) => {
      return state.collections.map(collection => {
        const photos = state.photos.filter(photo => photo.collectionId === collection.id)
        return {
          ...collection,
          photosCount: photos.length,
          photos: photos
        }
      })
    },

    getPhotosByCollection: (state) => {
      return (collectionId) => {
        return state.photos
          .filter(photo => photo.collectionId === collectionId)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      }
    }
  },
  
  actions: {
    // 生成GitHub图床图片URL
    getImageUrl(relativePath) {
      if (!relativePath) return ''
      // 如果已经是完整URL，直接返回
      if (relativePath.startsWith('http')) return relativePath
      // 拼接GitHub图床URL
      return `${this.githubImageBase}/${relativePath.replace(/^\//, '')}`
    },

    // 获取带默认图片的URL
    getImageUrlWithFallback(relativePath) {
      const url = this.getImageUrl(relativePath)
      return {
        src: url,
        error: () => {
          return this.getDefaultImageUrl()
        }
      }
    },

    // 默认图片URL
    getDefaultImageUrl() {
      return '/default-image.svg'
    },

    // 添加相册
    async addCollection(collectionData) {
      const newCollection = {
        id: Date.now().toString(),
        name: collectionData.name || '新相册',
        description: collectionData.description || '',
        cover: collectionData.cover || '',
        date: collectionData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      }

      this.collections.unshift(newCollection)
      this.saveToLocalStorage()
      return newCollection
    },

    // 删除相册
    async removeCollection(collectionId) {
      const index = this.collections.findIndex(c => c.id === collectionId)
      if (index !== -1) {
        // 删除相册及其所有照片
        this.collections.splice(index, 1)
        this.photos = this.photos.filter(p => p.collectionId !== collectionId)
        this.saveToLocalStorage()
      }
    },

    // 更新相册
    async updateCollection(collectionId, updates) {
      const collection = this.collections.find(c => c.id === collectionId)
      if (collection) {
        Object.assign(collection, updates)
        this.saveToLocalStorage()
      }
    },

    // 添加照片到相册
    async addPhoto(photoData) {
      const newPhoto = {
        id: Date.now().toString(),
        title: photoData.title || '无标题',
        description: photoData.description || '',
        url: photoData.url, // 存储相对路径
        thumbnail: photoData.thumbnail || photoData.url,
        date: photoData.date || new Date().toISOString().split('T')[0],
        tags: photoData.tags || [],
        collectionId: photoData.collectionId || null,
        uploadedAt: new Date().toISOString()
      }

      this.photos.unshift(newPhoto)
      this.saveToLocalStorage()
      return newPhoto
    },

    // 从GitHub图床同步照片数据（示例方法）
    async syncPhotosFromGitHub(collectionId, imagePaths) {
      this.isLoading = true
      try {
        for (const path of imagePaths) {
          await this.addPhoto({
            title: path.split('/').pop() || '未命名',
            url: path,
            collectionId: collectionId,
            date: new Date().toISOString().split('T')[0],
            tags: []
          })
        }
      } finally {
        this.isLoading = false
      }
    },

    // 删除照片
    async removePhoto(photoId) {
      const index = this.photos.findIndex(p => p.id === photoId)
      if (index !== -1) {
        this.photos.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    // 更新照片
    async updatePhoto(photoId, updates) {
      const photo = this.photos.find(p => p.id === photoId)
      if (photo) {
        Object.assign(photo, updates)
        this.saveToLocalStorage()
      }
    },

    // 初始化默认相册（示例）
    initDefaultCollections() {
      if (this.collections.length === 0) {
        this.addCollection({
          name: '风景摄影',
          description: '自然风光摄影作品集',
          cover: 'landscape.jpg'
        })
        this.addCollection({
          name: '人像摄影',
          description: '人物摄影作品集',
          cover: 'portrait.jpg'
        })
        this.addCollection({
          name: '生活随拍',
          description: '日常生活的美好瞬间',
          cover: 'daily.jpg'
        })
      }
    },

    // 从GitHub仓库同步相册
    async syncCollectionsFromGitHub(owner, repo, branch = 'main', path = '') {
      this.isLoading = true
      try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || '获取GitHub仓库内容失败')
        }

        // 只处理目录
        const directories = data.filter(item => item.type === 'dir')

        // 为每个目录创建相册
        for (const dir of directories) {
          // 检查相册是否已存在
          let collection = this.collections.find(c => c.name === dir.name)

          if (!collection) {
            // 创建新相册
            collection = await this.addCollection({
              name: dir.name,
              description: `${dir.name}相册`,
              cover: ''
            })
          }

          // 获取目录下的图片
          await this.syncPhotosFromDirectory(owner, repo, branch, dir.name, collection.id)
        }

        return true
      } catch (error) {
        console.error('同步GitHub相册失败:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 从GitHub仓库目录同步图片
    async syncPhotosFromDirectory(owner, repo, branch, directoryName, collectionId) {
      try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${directoryName}?ref=${branch}`
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || '获取目录内容失败')
        }

        // 图片文件扩展名
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']

        // 筛选图片文件
        const imageFiles = data.filter(item =>
          item.type === 'file' &&
          imageExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
        )

        // 为每个图片创建记录
        for (const imageFile of imageFiles) {
          // 跳过已存在的图片（基于URL判断）
          const exists = this.photos.some(p =>
            p.url === `${directoryName}/${imageFile.name}` ||
            p.url === imageFile.path
          )

          if (!exists) {
            await this.addPhoto({
              title: imageFile.name.replace(/\.[^/.]+$/, ''),
              description: '',
              url: `${directoryName}/${imageFile.name}`, // 存储相对路径
              collectionId: collectionId,
              date: new Date().toISOString().split('T')[0],
              tags: []
            })
          }
        }

        return true
      } catch (error) {
        console.error(`同步目录 ${directoryName} 失败:`, error)
        throw error
      }
    },

    // 手动添加单个目录的图片（通过完整的GitHub链接解析）
    async addCollectionFromGitHubLink(githubLink) {
      // 解析 GitHub 链接: https://github.com/owner/repo/blob/main/folder/image.jpg
      const match = githubLink.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+?)\/([^\/]+)$/)
      if (!match) {
        throw new Error('无效的GitHub链接格式')
      }

      const [, owner, repo, branch, directoryName, imageName] = match
      const directoryPath = directoryName

      // 检查相册是否已存在
      let collection = this.collections.find(c => c.name === directoryName)

      if (!collection) {
        // 创建新相册
        collection = await this.addCollection({
          name: directoryName,
          description: `${directoryName}相册 - 来自GitHub仓库 ${owner}/${repo}`,
          cover: `${directoryPath}/${imageName}`
        })
      }

      // 同步该目录下的所有图片
      await this.syncPhotosFromDirectory(owner, repo, branch, directoryPath, collection.id)

      return collection
    },

    // 获取目录信息（不创建相册，只查看）
    async getDirectoryInfo(owner, repo, branch = 'main', path = '') {
      try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '获取GitHub仓库内容失败')
        }

        const data = await response.json()

        // 统计目录和图片数量
        const directories = data.filter(item => item.type === 'dir')
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
        const imageFiles = data.filter(item =>
          item.type === 'file' &&
          imageExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
        )

        return {
          directories: directories.map(dir => ({
            name: dir.name,
            path: dir.path
          })),
          images: imageFiles.map(img => ({
            name: img.name,
            path: img.path,
            download_url: img.download_url
          })),
          imageCount: imageFiles.length,
          directoryCount: directories.length
        }
      } catch (error) {
        console.error('获取目录信息失败:', error)
        throw error
      }
    },

    // 加载本地存储数据
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('photos')
        if (saved) {
          const data = JSON.parse(saved)
          this.photos = data.photos || []
          this.collections = data.collections || []
        }
      } catch (error) {
        console.error('加载照片数据失败:', error)
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        localStorage.setItem('photos', JSON.stringify({
          photos: this.photos,
          collections: this.collections
        }))
      } catch (error) {
        console.error('保存照片数据失败:', error)
      }
    },

    // 初始化
    initPhotos() {
      this.loadFromLocalStorage()
      if (this.collections.length === 0) {
        this.initDefaultCollections()
      }
    }
  }
})