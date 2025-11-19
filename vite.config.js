import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/',  // 用户站点 (username.github.io) 使用根路径
  build: {
    outDir: 'dist', // 构建输出目录（默认即为 dist）
  },
})

/**
 * 使用说明：
 * 
 * 1. 开发环境：
 *    npm run dev
 * 
 * 2. 构建GitHub Pages版本：
 *    npm run build:github
 * 
 * 3. 本地预览GitHub Pages构建：
 *    npm run preview:github
 * 
 * 4. 修改base配置：
 *    将 'your-username.github.io' 替换为你的GitHub用户名
 *    如果仓库名不是 username.github.io，则使用 'username.github.io/repository-name'
 */