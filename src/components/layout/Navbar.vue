<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="url(#gradient1)" opacity="0.2"/>
            <circle cx="20" cy="20" r="12" fill="url(#gradient2)"/>
            <path d="M20 8 L26 20 L20 32 L14 20 Z" fill="white" opacity="0.9"/>
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" style="stop-color:var(--primary-400);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--primary-600);stop-opacity:1" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" style="stop-color:var(--primary-500);stop-opacity:1" />
                <stop offset="100%" style="stop-color:var(--primary-700);stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">Cisphus</span>
      </router-link>

      <!-- 桌面导航 -->
      <div class="navbar-nav desktop-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-link"
          :class="{ active: $route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <!-- 主题切换按钮 -->
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :title="themeStore.isDark ? '切换到浅色主题' : '切换到深色主题'"
        >
        
          <img
            v-if="themeStore.isDark"
            :src="base + 'moon.svg'"
            width="38"
            height="38"
            alt="moon icon"
          />
          <img
            v-else
            :src="base + 'sun.svg'"
            width="38"
            height="38"
            alt="sun icon"
          />
        </button>

        <!-- 移动端菜单按钮 -->
        <button
          class="mobile-menu-toggle"
          @click="toggleMobileMenu"
          :class="{ active: showMobileMenu }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div
      class="mobile-nav"
      :class="{ show: showMobileMenu }"
      @click.self="hideMobileMenu"
    >
      <div class="mobile-nav-content">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="mobile-nav-link"
          @click="hideMobileMenu"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/store/theme'

export default {
  name: 'Navbar',
  setup() {
    const themeStore = useThemeStore()
    const showMobileMenu = ref(false)
    const base = import.meta.env.BASE_URL || '/'
    
    const navItems = [
      { name: '首页', path: '/' },
      { name: '照片', path: '/gallery' },
      { name: '博客', path: '/blog' },
      // { name: '实验室', path: '/tests' }
      { name: '关于我', path: '/about' }
    ]

    const toggleTheme = () => {
      themeStore.toggleTheme()
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const hideMobileMenu = () => {
      showMobileMenu.value = false
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        hideMobileMenu()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
    })

    return {
      themeStore,
      navItems,
      showMobileMenu,
      toggleTheme,
      toggleMobileMenu,
      hideMobileMenu,
      base
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: all 0.25s ease;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--spacing-6);
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.navbar-logo:hover {
  color: var(--primary-500);
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.navbar-logo:hover .logo-icon {
  transform: rotate(180deg) scale(1.1);
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.5px;
}

.desktop-nav {
  display: flex;
  gap: var(--spacing-8);
}

.nav-link {
  position: relative;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-2) 0;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-500);
  border-radius: 1px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
  gap: 3px;
}

.mobile-menu-toggle span {
  width: 20px;
  height: 2px;
  background-color: var(--text-primary);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 移动端菜单 */
.mobile-nav {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-nav.show {
  opacity: 1;
  visibility: visible;
}

.mobile-nav-content {
  background-color: var(--bg-surface);
  margin: var(--spacing-4);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-light);
}

.mobile-nav-link {
  display: block;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  padding: var(--spacing-4) 0;
  border-bottom: 1px solid var(--border-default);
  transition: color 0.2s ease;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  color: var(--primary-500);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .navbar-container {
    padding: 0 var(--spacing-4);
  }

  .navbar {
    height: 56px;
    background: rgba(255, 255, 255, 0.75);
  }

  .mobile-nav {
    top: 56px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .navbar-logo {
    font-size: 18px;
    gap: var(--spacing-2);
  }
}

/* 暗色主题适配 */
[data-theme="dark"] .navbar {
  background: rgba(20, 20, 20, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>