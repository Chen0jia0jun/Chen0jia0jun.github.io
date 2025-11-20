<template>
  <div class="blog-post" v-if="post">
    <div class="container">
      <!-- Back Button -->
      <div class="post-navigation">
        <button @click="$router.push('/blog')" class="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
          返回博客
        </button>
      </div>

      <!-- Article Header -->
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        
        <div class="post-meta">
          <div class="post-info">
            <span class="post-date">{{ formatDate(post.createdAt || post.date) }}</span>
            <span class="post-separator">•</span>
            <span class="post-reading-time">{{ getReadingTime(post.content) }}</span>
          </div>
          
          <div class="post-tags" v-if="post.tags.length > 0">
            <router-link
              v-for="tag in post.tags"
              :key="tag"
              :to="`/blog?tag=${encodeURIComponent(tag)}`"
              class="post-tag"
            >
              {{ tag }}
            </router-link>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <article class="post-content content-container">
        <div class="markdown-content" v-html="renderedContent"></div>
      </article>

      <!-- Article Footer -->
      <footer class="post-footer">
        <div class="post-footer-content">
          <div class="post-sharing">
            <h3>分享文章</h3>
            <div class="sharing-buttons">
              <button @click="sharePost('wechat')" class="share-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 4A1.5 1.5 0 0 0 7 5.5v1A1.5 1.5 0 0 0 8.5 8h1A1.5 1.5 0 0 0 11 6.5v-1A1.5 1.5 0 0 0 9.5 4h-1z"/>
                  <path d="M16.5 4A1.5 1.5 0 0 0 15 5.5v1A1.5 1.5 0 0 0 16.5 8h1A1.5 1.5 0 0 0 19 6.5v-1A1.5 1.5 0 0 0 17.5 4h-1z"/>
                  <path d="M8.5 10A1.5 1.5 0 0 0 7 11.5v1A1.5 1.5 0 0 0 8.5 14h1A1.5 1.5 0 0 0 11 12.5v-1A1.5 1.5 0 0 0 9.5 10h-1z"/>
                  <path d="M8.5 16A1.5 1.5 0 0 0 7 17.5v1A1.5 1.5 0 0 0 8.5 20h7A1.5 1.5 0 0 0 17 18.5v-1A1.5 1.5 0 0 0 15.5 16h-7z"/>
                  <path d="M6.5 7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5S6.5 8.33 6.5 7.5z"/>
                  <path d="M14.5 7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/>
                  <path d="M12 6c-3.31 0-6 2.24-6 5s2.69 5 6 5 6-2.24 6-5-2.69-5-6-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                微信
              </button>
              <button @click="sharePost('weibo')" class="share-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.31 2.54c.71 2.13.33 4.52-.97 6.13-1.3 1.61-3.5 2.68-5.85 2.84-.2.01-.33.2-.24.38l.63 1.25c.08.16.27.25.45.21 1.23-.26 2.58-.69 3.83-1.63 1.25-.94 2.05-2.33 2.08-3.74.03-1.41-.72-2.78-1.93-3.44-.17-.09-.35.08-.3.26z"/>
                  <path d="M21.5 6.25c-.7-.15-1.49-.12-2.17.11-.68.23-1.31.62-1.72 1.08-.41.46-.66 1.01-.64 1.5.02.49.3.96.74 1.27.44.31 1.01.42 1.55.29.54-.13 1.02-.49 1.3-.96.28-.47.37-1.05.24-1.58-.13-.53-.5-.96-1-1.15-.5-.19-1.08-.13-1.57.16-1.05.62-1.35 2.11-.69 3.43.36.72 1.04 1.22 1.83 1.36.79.14 1.62-.02 2.24-.43.62-.41 1.02-1.05 1.07-1.73.05-.68-.27-1.35-.82-1.8-.55-.45-1.31-.62-2.05-.44z"/>
                </svg>
                微博
              </button>
              <button @click="copyLink" class="share-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                复制链接
              </button>
            </div>
          </div>
          
          <div class="post-actions" v-if="showEditButton">
            <button @click="editPost" class="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
              编辑文章
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <!-- Loading State -->
  <div class="loading-state" v-else-if="isLoading">
    <div class="container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div class="error-state" v-else>
    <div class="container">
      <div class="error-content">
        <h2>文章不存在</h2>
        <p>抱歉，您访问的文章不存在或已被删除。</p>
        <button @click="$router.push('/blog')" class="btn btn-primary">
          返回博客
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import { useBlogStore } from '@/store/blog'

export default {
  name: 'BlogPost',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const blogStore = useBlogStore()
    
    const isLoading = ref(true)
    
    // Configure marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value
          } catch (error) {
            console.error('Code highlighting error:', error)
          }
        }
        return hljs.highlightAuto(code).value
      },
      langPrefix: 'hljs language-',
      breaks: true,
      gfm: true
    })
    
    const post = computed(() => {
      return blogStore.getPostById(route.params.id)
    })
    
    const renderedContent = computed(() => {
      if (!post.value) return ''
      
      try {
        const html = marked(post.value.content)
        return DOMPurify.sanitize(html)
      } catch (error) {
        console.error('Markdown rendering error:', error)
        return post.value.content
      }
    })
    
    const showEditButton = computed(() => {
      // 这里可以添加编辑权限检查
      return true
    })
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    }
    
    const getReadingTime = (content) => {
      const wordsPerMinute = 200
      const textLength = content.replace(/[#*`]/g, '').length
      const readingTime = Math.ceil(textLength / wordsPerMinute)
      return `${readingTime} 分钟阅读`
    }
    
    const sharePost = (platform) => {
      const url = window.location.href
      const title = post.value.title
      const description = post.value.excerpt || '分享一篇文章'
      
      let shareUrl = ''
      
      switch (platform) {
        case 'wechat':
          // 微信分享需要特殊处理，通常需要二维码
          alert('请复制链接分享到微信')
          break
        case 'weibo':
          shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
          window.open(shareUrl, '_blank', 'width=600,height=400')
          break
      }
    }
    
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('链接已复制到剪贴板')
      }
    }
    
    const editPost = () => {
      // 这里可以实现编辑功能
      router.push(`/blog/edit/${post.value.id}`)
    }
    
    // 滚动到锚点
    const scrollToHash = () => {
      const hash = route.hash
      if (hash) {
        nextTick(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
    }
    
    // Load post data
    const loadPost = () => {
      isLoading.value = true
      
      // 如果文章不存在，稍等片刻再检查（可能是数据还没加载）
      if (!post.value) {
        setTimeout(() => {
          isLoading.value = false
        }, 1000)
      } else {
        isLoading.value = false
        scrollToHash()
      }
    }
    
    onMounted(() => {
      loadPost()
    })
    
    watch(() => route.params.id, () => {
      loadPost()
    })
    
    return {
      post,
      renderedContent,
      showEditButton,
      isLoading,
      formatDate,
      getReadingTime,
      sharePost,
      copyLink,
      editPost
    }
  }
}
</script>

<style scoped>
.blog-post {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

/* Navigation */
.post-navigation {
  margin-bottom: var(--spacing-8);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.back-btn:hover {
  background-color: var(--bg-page);
  color: var(--text-primary);
}

/* Header */
.post-header {
  margin-bottom: var(--spacing-12);
  text-align: center;
}

.post-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: var(--spacing-6);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.post-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-6);
}

.post-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-secondary);
  font-size: 16px;
}

.post-separator {
  color: var(--border-default);
}

.post-reading-time {
  white-space: nowrap;
}

.post-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  justify-content: center;
}

.post-tag {
  background-color: var(--primary-100);
  color: var(--primary-600);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-2);
  font-size: 14px;
  border: 1px solid var(--primary-200);
  text-decoration: none;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

/* Content */
.post-content {
  margin-bottom: var(--spacing-12);
}

.markdown-content {
  font-size: 18px;
  line-height: 1.8;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  color: var(--text-primary);
  margin-top: var(--spacing-12);
  margin-bottom: var(--spacing-6);
  font-weight: 600;
}

.markdown-content h1 {
  font-size: 36px;
  border-bottom: 2px solid var(--border-default);
  padding-bottom: var(--spacing-4);
}

.markdown-content h2 {
  font-size: 28px;
}

.markdown-content h3 {
  font-size: 24px;
}

.markdown-content p {
  margin-bottom: var(--spacing-6);
  color: var(--text-primary);
}

.markdown-content a {
  color: var(--primary-500);
  text-decoration: none;
  border-bottom: 1px solid var(--primary-200);
  transition: all 0.2s ease;
}

.markdown-content a:hover {
  color: var(--primary-600);
  border-bottom-color: var(--primary-600);
}

.markdown-content ul,
.markdown-content ol {
  margin-bottom: var(--spacing-6);
  padding-left: var(--spacing-8);
}

.markdown-content li {
  margin-bottom: var(--spacing-3);
  color: var(--text-primary);
}

.markdown-content blockquote {
  border-left: 4px solid var(--primary-500);
  padding-left: var(--spacing-6);
  margin: var(--spacing-8) 0;
  background-color: var(--bg-page);
  padding: var(--spacing-6);
  border-radius: var(--radius-2);
  font-style: italic;
}

.markdown-content blockquote p {
  margin-bottom: var(--spacing-4);
}

.markdown-content blockquote p:last-child {
  margin-bottom: 0;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-3);
  margin: var(--spacing-8) 0;
  box-shadow: var(--shadow-light);
}

.markdown-content hr {
  border: none;
  height: 2px;
  background-color: var(--border-default);
  margin: var(--spacing-12) 0;
}

/* Code Styles */
.markdown-content :not(pre) > code {
  background-color: var(--bg-page);
  color: var(--primary-600);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-2);
  font-size: 14px;
  border: 1px solid var(--border-default);
}

.markdown-content pre {
  background-color: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  margin: var(--spacing-8) 0;
  overflow-x: auto;
  font-size: 14px;
}

.markdown-content pre code {
  background: none;
  padding: 0;
  border: none;
  border-radius: 0;
}

/* Table Styles */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-8) 0;
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.markdown-content th,
.markdown-content td {
  padding: var(--spacing-4);
  text-align: left;
  border-bottom: 1px solid var(--border-default);
}

.markdown-content th {
  background-color: var(--bg-page);
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-content td {
  color: var(--text-primary);
}

.markdown-content tr:last-child td {
  border-bottom: none;
}

/* Footer */
.post-footer {
  border-top: 1px solid var(--border-default);
  padding-top: var(--spacing-8);
  margin-top: var(--spacing-12);
}

.post-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-6);
}

.post-sharing h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.sharing-buttons {
  display: flex;
  gap: var(--spacing-3);
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.share-btn:hover {
  background-color: var(--bg-page);
  color: var(--text-primary);
}

.post-actions {
  display: flex;
  gap: var(--spacing-4);
}

/* Loading and Error States */
.loading-state,
.error-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content,
.error-content {
  text-align: center;
  padding: var(--spacing-12);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-default);
  border-top: 4px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-6);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.error-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-title {
    font-size: 36px;
  }
  
  .post-meta {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .markdown-content {
    font-size: 16px;
  }
  
  .post-footer-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .sharing-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .markdown-content h1 {
    font-size: 28px;
  }
  
  .markdown-content h2 {
    font-size: 24px;
  }
  
  .markdown-content h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .post-title {
    font-size: 28px;
  }
  
  .post-content {
    margin-bottom: var(--spacing-8);
  }
  
  .markdown-content {
    font-size: 16px;
  }
  
  .markdown-content ul,
  .markdown-content ol {
    padding-left: var(--spacing-6);
  }
  
  .sharing-buttons {
    flex-direction: column;
  }
  
  .share-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>