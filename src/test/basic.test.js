import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useThemeStore } from '@/store/theme'

describe('Theme Store', () => {
  beforeEach(() => {
    // 创建新的 Pinia 实例
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should initialize with light theme', () => {
    localStorage.clear()
    const store = useThemeStore()
    
    expect(store.isDark).toBe(false)
  })

  it('should toggle theme', () => {
    const store = useThemeStore()
    
    store.toggleTheme()
    expect(store.isDark).toBe(true)
    
    store.toggleTheme()
    expect(store.isDark).toBe(false)
  })

  it('should apply theme to document', () => {
    const store = useThemeStore()
    
    store.toggleTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    
    store.toggleTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})

describe('Photo Store', () => {
  beforeEach(() => {
    localStorage.clear()
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should start with empty photos array', async () => {
    const { usePhotoStore } = await import('@/store/photos')
    const store = usePhotoStore()
    
    expect(store.photosCount).toBe(0)
  })

  it('should add a photo', async () => {
    const { usePhotoStore } = await import('@/store/photos')
    const store = usePhotoStore()
    
    const photoData = {
      title: 'Test Photo',
      url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
      date: '2025-11-19'
    }
    
    await store.addPhoto(photoData)
    
    expect(store.photosCount).toBe(1)
    expect(store.photos[0].title).toBe('Test Photo')
  })
})

describe('Blog Store', () => {
  beforeEach(() => {
    localStorage.clear()
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should start with sample post', async () => {
    const { useBlogStore } = await import('@/store/blog')
    const store = useBlogStore()
    
    expect(store.postsCount).toBeGreaterThan(0)
  })

  it('should generate excerpt from content', async () => {
    const { useBlogStore } = await import('@/store/blog')
    const store = useBlogStore()
    
    const content = '# Hello World\n\nThis is a long content that should be truncated.'
    const excerpt = store.generateExcerpt(content, 20)
    
    expect(excerpt.length).toBe(23) // 20 characters + '...'
    expect(excerpt.endsWith('...')).toBe(true)
  })
})

describe('Components', () => {
  it('Navbar renders correctly', async () => {
    const { default: Navbar } = await import('@/components/Navbar.vue')
    const wrapper = mount(Navbar)
    
    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.navbar-logo').text()).toBe('我的网站')
  })
})