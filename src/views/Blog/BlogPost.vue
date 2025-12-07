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
                <img
                :src="base + 'wx.svg'"
                width="16"
                height="16"
                alt="wechat icon"
                />
                微信
              </button>
              <button @click="sharePost('weibo')" class="share-btn">
                <img
                :src="base + 'wb.svg'"
                width="16"
                height="16"
                alt="weibo icon"
                />
                微博
              </button>
              <button @click="copyLink" class="share-btn">
                <img
                :src="base + 'link.svg'"
                width="16"
                height="16"
                alt="link icon"
                />
                复制链接
              </button>
            </div>
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
import { markedHighlight } from "marked-highlight"
import renderer from '@/utils/markDownRender.js'
import 'highlight.js/styles/androidstudio.css'
import markedKatex from "marked-katex-extension";
import 'katex/dist/katex.min.css';

export default {
  name: 'BlogPost',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const blogStore = useBlogStore()
    const base = import.meta.env.BASE_URL || '/'
    const isLoading = ref(true)

    // 配置 marked
    marked
      .setOptions({
        langPrefix: 'language-',
        gfm: true
      })
      .use(markedKatex({ strict: false }))
      .use(markedHighlight({
        highlight: function(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value
            } catch (error) {
              console.error('Code highlighting error:', error)
              return hljs.highlightAuto(code).value
            }
          }
          const autoHighlight = hljs.highlightAuto(code)
          return autoHighlight.value || hljs.highlight(code, { language: 'shell' }).value
        }
      }))
      // .use({ renderer })

    const post = computed(() => {
      return blogStore.getPostById(route.params.id)
    })
    
    const renderedContent = computed(() => {
      if (!post.value) return ''

      try {
        const html = marked(post.value.content)
        // 配置 DOMPurify 允许代码块的标签和属性
        return DOMPurify.sanitize(html);
      } catch (error) {
        console.error('Markdown rendering error:', error)
        return post.value.content
      }
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
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板');
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
      isLoading,
      base,
      formatDate,
      getReadingTime,
      sharePost,
      copyLink,
    }
  }
}
</script>

<style scoped>
/* 博客详情页样式 */
.blog-post {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  width: 75%;
  margin: 0 auto;
  margin-top: var(--spacing-12);
}

/* Navigation */
.post-navigation {
  margin-bottom: var(--spacing-8);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4) var(--spacing-4);
  color: var(--text-primary);
  background-color: unset;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

/* Header */
.post-header {
  margin-bottom: var(--spacing-12);
  text-align: center;
}

.post-title {
  font-size: 48px;
  font-weight: 700;
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
  font-size: 17px;
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
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-2);
  font-size: 15px;
  border: 1px solid var(--primary-200);
  text-decoration: none;
  transition: all 0.2s ease;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  color: var(--primary-100);
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
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-4);
}

.sharing-buttons {
  display: flex;
  gap: var(--spacing-4);
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  background-color: unset;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.share-btn:hover {
  color: var(--primary-100);
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