import { defineStore } from 'pinia'

const mdFiles = import.meta.glob('../assets/posts/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    isLoading: true
  }),

  getters: {
    publishedPosts: (state) => {
      return state.posts.filter(post => post.published)
    },

    postsByDate: (state) => {
      return [...state.publishedPosts].sort((a, b) => {
        const aTime = a.createdAt || a.updatedAt || a.date || ''
        const bTime = b.createdAt || b.updatedAt || b.date || ''
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
        const list = Array.isArray(post.tags) ? post.tags : []
        list.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    },

    getPostsByTag: (state) => (tag) => {
      return state.posts.filter(post => post.published && post.tags.includes(tag))
    }
  },

  actions: {
    normalizeTags(tags) {
      if (Array.isArray(tags)) {
        return tags
          .map(tag => String(tag).replace(/^['"]|['"]$/g, '').trim())
          .filter(Boolean)
      }

      if (typeof tags !== 'string') {
        return []
      }

      const trimmed = tags.trim()
      if (!trimmed) {
        return []
      }

      if ((trimmed.startsWith('[') && !trimmed.endsWith(']')) || (!trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        return []
      }

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        return trimmed
          .slice(1, -1)
          .split(',')
          .map(tag => tag.replace(/^['"]|['"]$/g, '').trim())
          .filter(Boolean)
      }

      return [trimmed.replace(/^['"]|['"]$/g, '').trim()].filter(Boolean)
    },

    resolvePostTags(metadata = {}, filePath) {
      const frontmatterTags = this.normalizeTags(metadata.tags)
      return frontmatterTags.length > 0
        ? frontmatterTags
        : this.extractTagsFromPath(filePath)
    },

    extractTagsFromPath(filePath) {
      const relativePath = filePath.replace(/^.*assets\/posts[\\/]/, '')
      const normalizedPath = relativePath.replace(/\\/g, '/')
      const pathParts = normalizedPath.split('/')

      if (pathParts.length === 1) {
        return ['uncategorized']
      }

      return [pathParts[0]]
    },

    extractTitleFromContent(content, filePath, metadata = {}) {
      if (metadata.title) {
        return metadata.title
      }

      const lines = content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('# ')) {
          return trimmed.replace(/^#\s+/, '').trim()
        }
        if (trimmed.length > 0) {
          const match = filePath.match(/([^/\\]+)\.md$/)
          if (match) {
            return match[1].replace(/[~_]/g, ' ')
          }
          break
        }
      }

      return 'Untitled'
    },

    parseFrontmatter(content) {
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
      const match = content.match(frontmatterRegex)

      if (!match) {
        return {}
      }

      const yamlContent = match[1]
      const metadata = {}

      yamlContent.split('\n').forEach(line => {
        const trimmed = line.trim()

        if (!trimmed || trimmed.startsWith('#')) {
          return
        }

        if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':')
          const value = valueParts.join(':').trim()
          const cleanKey = key.trim()
          let cleanValue = value.replace(/^['"]|['"]$/g, '')

          if (cleanKey === 'tags') {
            cleanValue = cleanValue === '' ? [] : this.normalizeTags(cleanValue)
          }

          if (cleanKey === 'createdAt' || cleanKey === 'updatedAt' || cleanKey === 'date') {
            if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
              cleanValue = `${cleanValue}T00:00:00`
            }
          }

          metadata[cleanKey] = cleanValue
          return
        }

        if (trimmed.startsWith('-')) {
          const tag = trimmed.replace(/^-\s*/, '').trim()
          if (!tag) {
            return
          }

          if (!Array.isArray(metadata.tags)) {
            metadata.tags = []
          }

          metadata.tags.push(tag)
        }
      })

      return metadata
    },

    extractTimestamps(metadata = {}) {
      const now = new Date().toISOString()
      const createdAt = metadata.createdAt || metadata.date || now
      const updatedAt = metadata.updatedAt || metadata.createdAt || metadata.date || now

      return {
        createdAt: new Date(createdAt).toISOString(),
        updatedAt: new Date(updatedAt).toISOString()
      }
    },

    async loadMarkdownFiles() {
      const posts = []

      for (const [filePath, content] of Object.entries(mdFiles)) {
        try {
          const metadata = this.parseFrontmatter(content)
          const tags = this.resolvePostTags(metadata, filePath)
          const title = this.extractTitleFromContent(content, filePath, metadata)
          const id = this.generateIdFromPath(filePath)
          const timestamps = this.extractTimestamps(metadata)
          const cleanContent = this.removeFrontmatter(content)
          const excerpt = this.generateExcerpt(cleanContent)

          posts.push({
            id,
            title,
            content: cleanContent,
            excerpt,
            date: timestamps.updatedAt.split('T')[0],
            tags,
            published: true,
            createdAt: timestamps.createdAt,
            updatedAt: timestamps.updatedAt,
            metadata,
            isFromFile: true
          })
        } catch (error) {
          console.error('Failed to process markdown file:', filePath, error)
        }
      }

      return posts
    },

    removeFrontmatter(content) {
      return content.replace(/^---\s*[\r\n]+(?:.*?[\r\n]+)*?---\s*[\r\n]*/, '')
    },

    generateIdFromPath(filePath) {
      const relativePath = filePath.replace(/^.*assets\/posts[\\/]/, '')
      const normalizedPath = relativePath.replace(/\\/g, '/')
      let hash = 0

      for (let i = 0; i < normalizedPath.length; i++) {
        const char = normalizedPath.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }

      return Math.abs(hash).toString(36)
    },

    generateExcerpt(content, length = 150) {
      const plainText = content
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim()

      return plainText.length > length
        ? `${plainText.substring(0, length)}...`
        : plainText
    },

    async initBlog() {
      try {
        this.isLoading = true
        const postsFromFiles = await this.loadMarkdownFiles()
        this.posts = [...postsFromFiles]
      } catch (error) {
        console.error('Failed to load markdown files:', error)
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    }
  }
})
