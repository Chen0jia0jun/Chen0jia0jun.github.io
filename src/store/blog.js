import { defineStore } from 'pinia'

/**
 * 动态导入所有 markdown 文件
 * 支持格式：
 * - title: 文章标题
 * - createdAt: 创建时间 (ISO 8601)
 * - updatedAt: 更新时间 (ISO 8601)
 * - tags: 标签数组
 */
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
     * 优先级：frontmatter.title > 第一个 # 标题 > 文件名
     */
    extractTitleFromContent(content, filePath, metadata = {}) {
      // 1. 优先使用 frontmatter 中的 title
      if (metadata.title) {
        return metadata.title
      }

      // 2. 从内容中提取第一个 # 标题
      const lines = content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('# ')) {
          return trimmed.replace(/^#\s+/, '').trim()
        }
        if (trimmed.length > 0) {
          // 3. 如果第一个非空行不是标题，尝试从文件名提取
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
     * 从 markdown 内容解析 frontmatter 元数据
     * 支持的字段：
     * - title: 文章标题
     * - createdAt: 创建时间
     * - updatedAt: 更新时间
     * - tags: 标签数组
     * - date: 日期（作为 createdAt 的后备）
     */
    parseFrontmatter(content) {
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
      const match = content.match(frontmatterRegex)

      if (!match) {
        return {}
      }

      const yamlContent = match[1]
      const metadata = {}

      // 解析 YAML 格式的 frontmatter
      yamlContent.split('\n').forEach(line => {
        const trimmed = line.trim()

        // 跳过空行和注释
        if (!trimmed || trimmed.startsWith('#')) {
          return
        }

        // 解析键值对
        if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':')
          const value = valueParts.join(':').trim()
          const cleanKey = key.trim()
          let cleanValue = value.replace(/^['"]|['"]$/g, '') // 移除引号

          // 处理数组格式的标签
          if (cleanKey === 'tags') {
            // 支持两种格式：
            // tags: [tag1, tag2]
            // tags:
            //   - tag1
            //   - tag2
            if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
              // 数组格式
              const arrayStr = cleanValue.slice(1, -1)
              cleanValue = arrayStr.split(',').map(item => item.trim()).filter(Boolean)
            } else if (cleanValue === '') {
              // 多行格式，后续会处理
              cleanValue = []
            } else {
              // 单个标签
              cleanValue = [cleanValue]
            }
          }

          // 处理日期时间格式
          if (cleanKey === 'createdAt' || cleanKey === 'updatedAt' || cleanKey === 'date') {
            // 如果只有日期（没有时间），补充时间为 00:00:00
            if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
              cleanValue = `${cleanValue}T00:00:00`
            }
          }

          metadata[cleanKey] = cleanValue
        } else if (trimmed.startsWith('-')) {
          // 处理多行数组格式：- tag1
          const tag = trimmed.replace(/^-\s*/, '').trim()
          if (tag) {
            if (!metadata.tags) {
              metadata.tags = []
            }
            metadata.tags.push(tag)
          }
        }
      })

      return metadata
    },

    /**
     * 提取文章的时间戳
     * 优先级：frontmatter.updatedAt > frontmatter.createdAt > frontmatter.date > 当前时间
     */
    extractTimestamps(metadata = {}) {
      const now = new Date().toISOString()

      // 提取创建时间
      const createdAt = metadata.createdAt || metadata.date || now

      // 提取更新时间
      const updatedAt = metadata.updatedAt || metadata.createdAt || metadata.date || now

      return {
        createdAt: new Date(createdAt).toISOString(),
        updatedAt: new Date(updatedAt).toISOString()
      }
    },

    /**
     * 加载所有 markdown 文件并提取元数据
     */
    async loadMarkdownFiles() {
      const posts = []

      for (const [filePath, content] of Object.entries(mdFiles)) {
        try {
          // 1. 解析 frontmatter
          const metadata = this.parseFrontmatter(content)

          // 2. 提取标签（frontmatter.tags > 目录名）
          let tags = metadata.tags
          if (!tags || tags.length === 0) {
            tags = this.extractTagsFromPath(filePath)
          }

          // 3. 提取标题
          const title = this.extractTitleFromContent(content, filePath, metadata)

          // 4. 生成唯一 ID
          const id = this.generateIdFromPath(filePath)

          // 5. 提取时间戳
          const timestamps = this.extractTimestamps(metadata)

          // 6. 移除 frontmatter，获取纯净的内容
          const cleanContent = this.removeFrontmatter(content)

          // 7. 生成摘要
          const excerpt = this.generateExcerpt(cleanContent)

          // 8. 创建文章对象
          posts.push({
            id,
            title,
            content: cleanContent, // 使用移除 frontmatter 后的纯净内容
            excerpt,
            date: timestamps.updatedAt.split('T')[0], // 用于显示的日期
            tags,
            published: true,
            createdAt: timestamps.createdAt,
            updatedAt: timestamps.updatedAt,
            metadata, // 保存完整的 frontmatter 元数据
            isFromFile: true
          })
        } catch (error) {
          console.error(`处理文件 ${filePath} 时出错:`, error)
        }
      }

      return posts
    },

    /**
     * 从内容中移除 frontmatter，返回纯净的 markdown 内容
     */
    removeFrontmatter(content) {
      // 使用正则表达式移除 frontmatter 块
      return content.replace(/^---\s*[\r\n]+(?:.*?[\r\n]+)*?---\s*[\r\n]*/, '')
    },

    /**
     * 基于文件路径生成唯一 ID
     * 使用 DJB2 哈希算法
     */
    generateIdFromPath(filePath) {
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

    /**
     * 从内容生成摘要
     * 移除 Markdown 标记，提取纯文本
     */
    generateExcerpt(content, length = 150) {
      // 移除 Markdown 标记
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

    /**
     * 初始化博客
     * 加载所有 markdown 文件
     */
    async initBlog() {
      try {
        this.isLoading = true
        const postsFromFiles = await this.loadMarkdownFiles()
        this.posts = [...postsFromFiles]
      } catch (err) {
        console.error('加载 markdown 文件失败:', err)
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500) // 减少加载时间
      }
    }
  }
})
