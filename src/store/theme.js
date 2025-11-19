import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),
  
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
    },
    
    applyTheme() {
      const html = document.documentElement
      if (this.isDark) {
        html.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
    },
    
    initTheme() {
      this.applyTheme()
    }
  }
})