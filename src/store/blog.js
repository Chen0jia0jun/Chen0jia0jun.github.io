/*
数据格式：
        id: '1',
        title: '欢迎来到我的博客',
        content: `# 欢迎来到我的博客
`,
        excerpt: '这是我的第一篇博客文章，介绍这个网站的功能和技术栈。',
        date: '2025-11-19',
        tags: ['介绍', '个人', '技术'],
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
*/

import { defineStore } from 'pinia'

// 动态导入所有 markdown 文件
const mdFiles = import.meta.glob('../assets/posts/**/*.md', { query: '?raw', import: 'default', eager: true })

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    isLoading: false
  }),
  
  getters: {
    publishedPosts: (state) => {
      return state.posts.filter(post => post.published)
    },
    
    postsByDate: (state) => {
      return [...state.publishedPosts].sort((a, b) => {
        const aTime = a.updatedAt || a.createdAt || a.date || ''
        const bTime = b.updatedAt || b.createdAt || b.date || ''
        return new Date(bTime) - new Date(aTime)
      })
    },

    getPostById: (state) => (id) => {
      if (!id) return null
      return state.posts.find(post => post.id === id)
    },
    
    postsCount: (state) => state.publishedPosts.length,
    
    allTags: (state) => {
      const tags = new Set()
      state.posts.forEach(post => {
        const t = Array.isArray(post.tags) ? post.tags : []
        t.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    },
    
    getPostsByTag: (state) => (tag) => {
      return state.posts.filter(post => post.published && post.tags.includes(tag))
    }
  },
  
  actions: {
    /**
     * 从文件路径提取分类标签
     * 例如: ../assets/posts/Algorithm/STL学习.md -> ['Algorithm']
     * 例如: ../assets/posts/test_blog.md -> ['未分类']
     */
    extractTagsFromPath(filePath) {
      // 提取相对路径，兼容 Windows 和 Unix 路径
      const relativePath = filePath.replace(/^.*assets\/posts[\\/]/, '')
      // 统一使用 / 作为分隔符
      const normalizedPath = relativePath.replace(/\\/g, '/')
      const pathParts = normalizedPath.split('/')

      // 如果只有一个部分，说明在根目录
      if (pathParts.length === 1) {
        return ['未分类']
      }

      // 第一个部分是分类文件夹名
      return [pathParts[0]]
    },

    /**
     * 从 markdown 内容提取标题
     */
    extractTitleFromContent(content, filePath) {
      const lines = content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('# ')) {
          return trimmed.replace(/^#\s+/, '').trim()
        }
        if (trimmed.length > 0) {
          // 如果第一个非空行不是标题，尝试从文件名提取
          const match = filePath.match(/([^/\\]+)\.md$/)
          if (match) {
            return match[1].replace(/[~_]/g, ' ')
          }
          break
        }
      }
      return '无标题'
    },

    /**
     * 加载 markdown 文件
     */
    loadMarkdownFiles() {
      const posts = []

      for (const [filePath, content] of Object.entries(mdFiles)) {
        try {
          const tags = this.extractTagsFromPath(filePath)
          const title = this.extractTitleFromContent(content, filePath)

          // 生成唯一 ID (基于文件路径的哈希)
          const id = this.generateIdFromPath(filePath)

          // 提取日期 (可以后续添加日期支持)
          const date = new Date().toISOString().split('T')[0]

          posts.push({
            id,
            title,
            content,
            excerpt: this.generateExcerpt(content),
            date,
            tags,
            published: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFromFile: true // 标记来自文件
          })
        } catch (error) {
          console.error(`处理文件 ${filePath} 时出错:`, error)
        }
      }

      return posts
    },

    /**
     * 基于文件路径生成唯一 ID
     */
    generateIdFromPath(filePath) {
      // 提取相对路径并创建哈希，兼容 Windows 和 Unix 路径
      const relativePath = filePath.replace(/^.*assets\/posts[\\/]/, '')
      const normalizedPath = relativePath.replace(/\\/g, '/')
      let hash = 0
      for (let i = 0; i < normalizedPath.length; i++) {
        const char = normalizedPath.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // 转换为 32 位整数
      }
      return Math.abs(hash).toString(36)
    },

    async addPost(postData) {
      const newPost = {
        id: Date.now().toString(),
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt || this.generateExcerpt(postData.content),
        date: postData.date || new Date().toISOString().split('T')[0],
        tags: postData.tags || [],
        published: postData.published !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      this.posts.unshift(newPost)
      this.saveToLocalStorage()
      return newPost
    },
    
    async updatePost(postId, updates) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        Object.assign(post, {
          ...updates,
          updatedAt: new Date().toISOString()
        })
        this.saveToLocalStorage()
      }
    },
    
    async removePost(postId) {
      const index = this.posts.findIndex(p => p.id === postId)
      if (index !== -1) {
        this.posts.splice(index, 1)
        this.saveToLocalStorage()
      }
    },
    
    // generateSlug 已移除；不再使用 slug 字段
    
    generateExcerpt(content, length = 150) {
      // 移除Markdown标记，提取纯文本
      const plainText = content
        .replace(/#{1,6}\s+/g, '') // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
        .replace(/`(.*?)`/g, '$1') // 移除代码标记
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
        .replace(/\n+/g, ' ') // 替换换行为空格
        .trim()
      
      return plainText.length > length 
        ? plainText.substring(0, length) + '...'
        : plainText
    },
    
    
    saveToLocalStorage() {
      try {
        // 只保存非示例文章
        const postsToSave = this.posts.filter(p => p.id !== '1')
        localStorage.setItem('blogPosts', JSON.stringify(postsToSave))
      } catch (error) {
        console.error('保存博客数据失败:', error)
      }
    },
    
    async initBlog() {
      try {
        this.isLoading = true

        // 直接从 markdown 文件加载
        const postsFromFiles = this.loadMarkdownFiles()

        this.posts = [...postsFromFiles]
      } catch (err) {
        console.error('加载 markdown 文件失败:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})