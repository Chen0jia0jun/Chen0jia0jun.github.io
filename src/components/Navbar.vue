<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
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
      { name: '实验室', path: '/tests' }
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
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
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
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-logo:hover {
  color: var(--primary-500);
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
  }
  
  .mobile-nav {
    top: 56px;
  }
}
</style>