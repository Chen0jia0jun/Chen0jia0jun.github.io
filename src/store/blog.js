import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [
      {
        id: '1',
        title: '欢迎来到我的博客',
        slug: 'welcome-to-my-blog',
        content: `# 欢迎来到我的博客
`,
        excerpt: '这是我的第一篇博客文章，介绍这个网站的功能和技术栈。',
        date: '2025-11-19',
        tags: ['介绍', '个人', '技术'],
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    isLoading: false
  }),
  
  getters: {
    publishedPosts: (state) => {
      return state.posts.filter(post => post.published)
    },
    
    postsByDate: (state) => {
      return [...state.publishedPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    
    getPostBySlug: (state) => (slug) => {
      return state.posts.find(post => post.slug === slug)
    },
    
    postsCount: (state) => state.publishedPosts.length,
    
    allTags: (state) => {
      const tags = new Set()
      state.posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    },
    
    getPostsByTag: (state) => (tag) => {
      return state.posts.filter(post => post.published && post.tags.includes(tag))
    }
  },
  
  actions: {
    async addPost(postData) {
      const slug = this.generateSlug(postData.title)
      
      const newPost = {
        id: Date.now().toString(),
        title: postData.title,
        slug,
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
    
    generateSlug(title) {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    },
    
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
    
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('blogPosts')
        if (saved) {
          const savedPosts = JSON.parse(saved)
          // 保留示例文章，只添加本地保存的文章
          const examplePost = this.posts[0]
          this.posts = [examplePost, ...savedPosts.filter(p => p.id !== '1')]
        }
      } catch (error) {
        console.error('加载博客数据失败:', error)
      }
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
    
    initBlog() {
      this.loadFromLocalStorage()
    }
  }
})