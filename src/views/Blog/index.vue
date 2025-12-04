<template>
  <div class="blog">
    <div class="container">
      <!-- Header -->
      <div class="blog-header">
        <h1>博客</h1>
        <p class="blog-subtitle">
          Recording my journey in coding and technology.
        </p>
        <div class="blog-stats">
          <span>共 {{ blogStore.postsCount }} 篇文章</span>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="blog-controls" v-if="blogStore.postsCount > 0">
        <div class="controls-left">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="search-input"
            />
          </div>
        </div>
        
        <div class="controls-right">
          <select v-model="sortBy" class="sort-select">
            <option value="date-desc">最新优先</option>
            <option value="date-asc">最早优先</option>
            <option value="title-asc">标题 A-Z</option>
            <option value="title-desc">标题 Z-A</option>
          </select>
        </div>
      </div>

      <!-- Tag Filter -->
      <div class="tag-filters" v-if="blogStore.allTags.length > 0">
        <button
          class="tag-filter"
          :class="{ active: selectedTag === '' }"
          @click="setTagFilter('')"
        >
          全部 ({{ blogStore.postsCount }})
        </button>
        <button
          v-for="tag in blogStore.allTags"
          :key="tag"
          class="tag-filter"
          :class="{ active: selectedTag === tag }"
          @click="setTagFilter(tag)"
        >
          {{ tag }} ({{ blogStore.getPostsByTag(tag).length }})
        </button>
      </div>

      <!-- Posts Grid -->
      <div class="posts-grid" v-if="filteredPosts.length > 0">
        <BlogCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :post="post"
        />
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h7"/>
          </svg>
          <h3>{{ searchQuery || selectedTag ? '没有找到相关文章' : '还没有文章' }}</h3>
          <p>
            {{ searchQuery || selectedTag ? '试试调整搜索条件或标签筛选' : '开始写你的第一篇文章吧！' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-number"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script >
import { ref, computed } from 'vue'
import { useBlogStore } from '@/store/blog'
import { paginatePosts, calculateVisiblePages } from './helpers'
import BlogCard from '@/components/common/blogCard.vue'

export default {
  name: 'Blog',
  components: {
    BlogCard
  },
  setup() {
    const blogStore = useBlogStore()
    
    // Reactive data
    const showCreateForm = ref(false)
    const showCreateButton = ref(true)
    const searchQuery = ref('')
    const selectedTag = ref('')
    const sortBy = ref('date-desc')
    const currentPage = ref(1)
    const postsPerPage = 9
    
    // New post data
    const newPost = ref({
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      date: new Date().toISOString().split('T')[0],
      published: true
    })
    
    const tagsInput = ref('')
    
    // Computed properties
    const filteredPosts = computed(() => {
      let posts = [...blogStore.postsByDate]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // Tag filter
      if (selectedTag.value) {
        posts = posts.filter(post => post.tags.includes(selectedTag.value))
      }
      
      // Sort
      switch (sortBy.value) {
        case 'date-desc':
          posts.sort((a, b) => new Date(b.date) - new Date(a.date))
          break
        case 'date-asc':
          posts.sort((a, b) => new Date(a.date) - new Date(b.date))
          break
        case 'title-asc':
          posts.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
          break
        case 'title-desc':
          posts.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'))
          break
      }
      
      return posts
    })
    
    const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))
    
    const paginatedPosts = computed(() => paginatePosts(filteredPosts.value, currentPage.value, postsPerPage))
    
    const visiblePages = computed(() => calculateVisiblePages(totalPages.value, currentPage.value, 2))
    
    const isFormValid = computed(() => {
      return newPost.value.title.trim() && newPost.value.content.trim()
    })
    
    const resetForm = () => {
      newPost.value = {
        title: '',
        excerpt: '',
        content: '',
        tags: [],
        date: new Date().toISOString().split('T')[0],
        published: true
      }
      tagsInput.value = ''
    }
    
    
    const setTagFilter = (tag) => {
      selectedTag.value = tag
      currentPage.value = 1
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        // Scroll to top of blog
        document.querySelector('.blog').scrollIntoView({ behavior: 'smooth' })
      }
    }
    // Reset pagination when filters change
    const resetPagination = () => {
      currentPage.value = 1
    }

    
    return {
      blogStore,
      showCreateForm,
      showCreateButton,
      searchQuery,
      selectedTag,
      sortBy,
      currentPage,
      newPost,
      tagsInput,
      filteredPosts,
      paginatedPosts,
      totalPages,
      visiblePages,
      isFormValid,
      setTagFilter,
      changePage,
      resetForm,
      resetPagination
    }
  },
  watch: {
    searchQuery() {
      this.resetPagination()
    },
    selectedTag() {
      this.resetPagination()
    },
    sortBy() {
      this.resetPagination()
    }
  }
}
</script>

<style scoped>
.blog {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

/* Header */
.blog-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.blog-header h1 {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.blog-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.blog-stats {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Create Section */
.create-post-section {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.create-form-section {
  margin-bottom: var(--spacing-12);
}

.create-form-section .card {
  max-width: 800px;
  margin: 0 auto;
}

.create-form h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
}

/* Form Styles */
.form-group {
  margin-bottom: var(--spacing-6);
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.form-hint {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: var(--spacing-2);
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.markdown-help {
  background-color: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2);
  padding: var(--spacing-4);
  margin-top: var(--spacing-3);
}

.markdown-help p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
}

.help-links {
  display: flex;
  gap: var(--spacing-4);
}

.help-links a {
  font-size: 14px;
  color: var(--primary-500);
  text-decoration: none;
}

.help-links a:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: var(--spacing-4);
  justify-content: flex-end;
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border-default);
}

/* Controls */
.blog-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.controls-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
}

.search-box {
  max-width: 400px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: var(--spacing-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.controls-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.sort-select {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-size: 15px;
  min-height: 40px;
}

/* Tag Filters */
.tag-filters {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
}

.tag-filter {
  padding: var(--spacing-2);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  white-space: nowrap;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tag-filter:hover,
.tag-filter.active {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-12);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-24) 0;
}

.empty-content svg {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.empty-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.empty-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-8);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.page-btn {
  padding: var(--spacing-3) var(--spacing-6);
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  min-height: 40px;
}

.page-btn:hover:not(:disabled) {
  background-color: var(--bg-page);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: var(--spacing-2);
}

.page-number {
  min-width: 42px;
  height: 42px;
  border: 1px solid var(--border-default);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.page-number:hover,
.page-number.active {
  background-color: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-header h1 {
    font-size: 36px;
  }
  
  .blog-subtitle {
    font-size: 16px;
  }
  
  .blog-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .controls-left {
    width: 100%;
  }
  
  .search-box {
    max-width: none;
  }
  
  .controls-right {
    justify-content: center;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .form-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
  
  .pagination {
    gap: var(--spacing-2);
  }
  
  .page-numbers {
    order: -1;
  }
}

@media (max-width: 480px) {
  .tag-filters {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .tag-filter {
    text-align: center;
  }
}
</style>
