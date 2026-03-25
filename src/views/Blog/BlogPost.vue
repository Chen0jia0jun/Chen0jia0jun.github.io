<template>
  <div class="blog-post" v-if="post">
    <div class="container">
      <div class="post-shell">
        <aside class="post-sidebar" v-if="tocHeadings.length > 0">
          <div class="toc-card">
            <p class="toc-eyebrow">On This Page</p>
            <h2 class="toc-title">目录</h2>
            <nav class="toc-nav" aria-label="文章目录">
              <button
                v-for="heading in tocHeadings"
                :key="heading.id"
                type="button"
                class="toc-link"
                :class="[
                  `level-${heading.level}`,
                  { active: activeHeadingId === heading.id }
                ]"
                @click="navigateToHeading(heading.id)"
              >
                {{ heading.text }}
              </button>
            </nav>
          </div>
        </aside>

        <div class="post-main">
          <div class="post-surface">
            <div class="post-navigation">
              <button @click="$router.push('/blog')" class="back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                返回博客
              </button>
            </div>

            <header class="post-header">
              <h1 class="post-title">{{ post.title }}</h1>

              <div class="post-meta">
                <div class="post-info">
                  <span class="post-date">{{ formatDate(post.createdAt || post.date) }}</span>
                  <span class="post-separator">·</span>
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

            <article class="post-content content-container">
              <div
                ref="contentRef"
                class="markdown-content"
                v-html="renderedContent"
                @click="handleCodeCopy"
              ></div>
            </article>

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
      </div>
    </div>
  </div>

  <div class="loading-state" v-else-if="isLoading">
    <div class="container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  </div>

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
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { useBlogStore } from '@/store/blog'
import marked from '@/utils/markDownRender.js'

const TOC_LEVELS = ['H1', 'H2', 'H3']

export default {
  name: 'BlogPost',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const blogStore = useBlogStore()
    const base = import.meta.env.BASE_URL || '/'
    const isLoading = ref(true)
    const contentRef = ref(null)
    const activeHeadingId = ref('')
    let headingObserver = null

    const post = computed(() => {
      return blogStore.getPostById(route.params.id)
    })

    const createHeadingId = (text, index) => {
      const normalized = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '')

      return normalized ? `${normalized}-${index}` : `section-${index}`
    }

    const parsedPost = computed(() => {
      if (!post.value) {
        return {
          html: '',
          headings: []
        }
      }

      try {
        const rawHtml = marked(post.value.content)
        const sanitizedHtml = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['id', 'tabindex'] })

        if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
          return {
            html: sanitizedHtml,
            headings: []
          }
        }

        const parser = new window.DOMParser()
        const doc = parser.parseFromString(`<div>${sanitizedHtml}</div>`, 'text/html')
        const root = doc.body.firstElementChild
        const headings = []
        let headingIndex = 0

        root?.querySelectorAll(TOC_LEVELS.join(',')).forEach((heading) => {
          const text = heading.textContent?.trim()
          if (!text) return

          const id = createHeadingId(text, headingIndex++)
          heading.setAttribute('id', id)
          heading.setAttribute('tabindex', '-1')

          headings.push({
            id,
            text,
            level: Number(heading.tagName.slice(1))
          })
        })

        return {
          html: root?.innerHTML || sanitizedHtml,
          headings
        }
      } catch (error) {
        console.error('Markdown rendering error:', error)
        return {
          html: post.value.content,
          headings: []
        }
      }
    })

    const renderedContent = computed(() => parsedPost.value.html)
    const tocHeadings = computed(() => parsedPost.value.headings)

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

      switch (platform) {
        case 'wechat':
          alert('请复制链接分享到微信')
          break
        case 'weibo': {
          const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
          window.open(shareUrl, '_blank', 'width=600,height=400')
          break
        }
      }
    }

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板')
      } catch (error) {
        console.error('Copy link failed:', error)
      }
    }

    const handleCodeCopy = (event) => {
      const button = event.target.closest('.copy-btn')
      if (!button) return

      const code = decodeURIComponent(button.dataset.code)
      navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerHTML
        button.innerHTML = '已复制'
        setTimeout(() => {
          button.innerHTML = originalText
        }, 2000)
      })
    }

    const scrollToHeading = (id, behavior = 'smooth') => {
      const element = document.getElementById(id)
      if (!element) return

      activeHeadingId.value = id
      element.scrollIntoView({ behavior, block: 'start' })
      element.focus({ preventScroll: true })
    }

    const navigateToHeading = async (id) => {
      await router.replace({ path: route.path, hash: `#${id}` })
      scrollToHeading(id)
    }

    const scrollToHash = () => {
      const hash = route.hash.replace(/^#/, '')
      if (!hash) {
        activeHeadingId.value = tocHeadings.value[0]?.id || ''
        return
      }

      nextTick(() => {
        scrollToHeading(hash, 'smooth')
      })
    }

    const disconnectHeadingObserver = () => {
      if (headingObserver) {
        headingObserver.disconnect()
        headingObserver = null
      }
    }

    const setupHeadingObserver = async () => {
      disconnectHeadingObserver()
      await nextTick()

      if (!contentRef.value || tocHeadings.value.length === 0 || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
        return
      }

      const headings = Array.from(contentRef.value.querySelectorAll(TOC_LEVELS.join(',')))
      if (headings.length === 0) return

      activeHeadingId.value = route.hash.replace(/^#/, '') || headings[0].id

      headingObserver = new IntersectionObserver((entries) => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleEntries.length > 0) {
          activeHeadingId.value = visibleEntries[0].target.id
        }
      }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 1]
      })

      headings.forEach((heading) => headingObserver.observe(heading))
    }

    const loadPost = async () => {
      isLoading.value = true
      if (!post.value) {
        setTimeout(() => {
          isLoading.value = false
        }, 1000)
        return
      }

      isLoading.value = false
      await setupHeadingObserver()
      scrollToHash()
    }

    onMounted(() => {
      loadPost()
    })

    onBeforeUnmount(() => {
      disconnectHeadingObserver()
    })

    watch(() => route.params.id, () => {
      loadPost()
    })

    watch(() => route.hash, () => {
      scrollToHash()
    })

    watch(renderedContent, async () => {
      await setupHeadingObserver()
      scrollToHash()
    })

    return {
      post,
      base,
      isLoading,
      contentRef,
      renderedContent,
      tocHeadings,
      activeHeadingId,
      formatDate,
      getReadingTime,
      sharePost,
      copyLink,
      handleCodeCopy,
      navigateToHeading
    }
  }
}
</script>

<style scoped>
.blog-post {
  min-height: 100svh;
  padding: var(--spacing-8) 0;
}

.post-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 240px;
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
}

.post-sidebar {
  order: 2;
  position: sticky;
  top: calc(64px + var(--spacing-6));
}

.post-main {
  order: 1;
  min-width: 0;
}

.toc-card {
  background-color: color-mix(in srgb, var(--bg-surface) 88%, transparent);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-light);
  width: 240px;
  height: clamp(300px, 52vh, 460px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toc-eyebrow {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2);
}

.toc-title {
  font-size: 22px;
  margin-bottom: var(--spacing-4);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 2px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.toc-nav::-webkit-scrollbar {
  display: none;
}

.toc-link {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-2);
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  line-height: 1.45;
}

.toc-link:hover,
.toc-link.active {
  background-color: var(--primary-100);
  color: var(--primary-600);
  transform: translateX(2px);
}

.toc-link.level-2 {
  padding-left: 20px;
  font-size: 14px;
}

.toc-link.level-3 {
  padding-left: 32px;
  font-size: 13px;
}

.post-surface {
  background-color: color-mix(in srgb, var(--bg-surface) 92%, transparent);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-light);
  padding: clamp(20px, 4vw, 40px);
  backdrop-filter: blur(18px);
}

.post-navigation {
  margin-bottom: var(--spacing-8);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0;
  color: var(--text-primary);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 16px;
}

.back-btn:hover {
  color: var(--primary-500);
}

.post-header {
  margin-bottom: var(--spacing-12);
  text-align: center;
}

.post-title {
  font-size: clamp(32px, 6vw, 52px);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: var(--spacing-6);
  text-wrap: balance;
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
  font-size: clamp(14px, 2.2vw, 17px);
}

.post-reading-time,
.post-date {
  white-space: nowrap;
}

.post-separator {
  opacity: 0.5;
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
  padding: 8px 14px;
  border-radius: var(--radius-2);
  font-size: 14px;
  border: 1px solid var(--primary-200, var(--border-default));
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

.post-content {
  margin-bottom: var(--spacing-12);
}

.markdown-content {
  font-size: clamp(16px, 2.2vw, 18px);
  line-height: 1.9;
  overflow-wrap: anywhere;
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
  scroll-margin-top: 92px;
}

.markdown-content h1 {
  font-size: clamp(30px, 4vw, 38px);
  border-bottom: 2px solid var(--border-default);
  padding-bottom: var(--spacing-4);
}

.markdown-content h2 {
  font-size: clamp(24px, 3vw, 30px);
}

.markdown-content h3 {
  font-size: clamp(20px, 2.6vw, 24px);
}

.markdown-content p,
.markdown-content ul,
.markdown-content ol,
.markdown-content blockquote,
.markdown-content table,
.markdown-content pre {
  margin-bottom: var(--spacing-6);
}

.markdown-content ul,
.markdown-content ol {
  padding-left: clamp(20px, 4vw, 32px);
}

.markdown-content li {
  margin-bottom: var(--spacing-3);
}

.markdown-content a {
  color: var(--primary-500);
  text-decoration: none;
  border-bottom: 1px solid var(--primary-200, var(--border-default));
  transition: all 0.2s ease;
}

.markdown-content a:hover {
  color: var(--primary-600);
  border-bottom-color: var(--primary-600);
}

.markdown-content blockquote {
  border-left: 4px solid var(--primary-500);
  background-color: var(--bg-page);
  padding: var(--spacing-6);
  border-radius: var(--radius-2);
  font-style: italic;
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

.markdown-content table {
  width: 100%;
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-light);
}

.markdown-content th,
.markdown-content td {
  padding: var(--spacing-4);
  text-align: left;
  border-bottom: 1px solid var(--border-default);
  min-width: 120px;
}

.markdown-content th {
  background-color: var(--bg-page);
  font-weight: 600;
  color: var(--primary-100);
}

.markdown-content tr:last-child td {
  border-bottom: none;
}

.markdown-content :not(pre) > code {
  background-color: var(--bg-page);
  padding: 2px 6px;
  border-radius: var(--radius-2);
  font-size: 0.92em;
  border: 1px solid var(--border-default);
}

.markdown-content pre {
  background-color: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  overflow-x: auto;
  font-size: 14px;
}

.markdown-content pre code {
  background: none;
  padding: 0;
  border: none;
  border-radius: 0;
}

.markdown-content .code-block-wrapper {
  background-color: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-3);
  margin: var(--spacing-8) 0;
  overflow: hidden;
}

.markdown-content .code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  font-size: 14px;
}

.markdown-content .code-lang {
  color: var(--text-secondary);
  font-weight: 500;
}

.markdown-content .copy-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 8px 12px;
  border: 1px solid var(--border-default);
  background-color: var(--bg-page);
  color: var(--text-secondary);
  border-radius: var(--radius-2);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.markdown-content .copy-btn:hover {
  background-color: var(--primary-100);
  color: var(--primary-600);
  border-color: var(--primary-200, var(--border-default));
}

.markdown-content .code-block-wrapper pre {
  margin: 0;
  border: none;
  border-radius: 0;
}

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
  flex-wrap: wrap;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: 10px 16px;
  border: 1px solid var(--border-default);
  background-color: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  border-radius: var(--radius-2);
}

.share-btn:hover {
  color: var(--primary-500);
  border-color: var(--primary-500);
}

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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

@media (max-width: 1024px) {
  .post-shell {
    grid-template-columns: 1fr;
  }

  .post-sidebar {
    order: 1;
    position: static;
  }

  .post-main {
    order: 2;
  }

  .toc-card {
    width: 100%;
    height: 260px;
    padding: var(--spacing-4);
  }
}

@media (max-width: 768px) {
  .blog-post {
    padding: var(--spacing-6) 0;
  }

  .post-surface {
    padding: var(--spacing-4);
  }

  .post-meta {
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .post-footer-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .sharing-buttons {
    justify-content: center;
  }

  .markdown-content {
    line-height: 1.8;
  }
}

@media (max-width: 480px) {
  .sharing-buttons {
    flex-direction: column;
  }

  .share-btn {
    width: 100%;
  }

  .toc-link {
    padding-left: 10px;
  }

  .toc-link.level-2,
  .toc-link.level-3 {
    padding-left: 18px;
  }
}
</style>
