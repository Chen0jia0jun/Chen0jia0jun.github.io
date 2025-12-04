import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'


export default defineConfig({
  plugins: [
    vue(),
    // 插件：替换 404.html 中的 %BASE_URL% 占位符
    {
      name: 'replace-base-url',
      apply(config, { mode }) {
        return mode === 'production' || config.command === 'build'
      },
      generateBundle() {
        try {
          const distPath = resolve(__dirname, 'dist', '404.html')
          const content = readFileSync(distPath, 'utf-8')
          const updated = content.replace(/%BASE_URL%/g, '/')
          writeFileSync(distPath, updated)
          console.log('✓ 404.html 中的 %BASE_URL% 已替换为 /')
        } catch (e) {
          console.warn('⚠ 未能替换 404.html 中的 %BASE_URL%:', e.message)
        }
      }
    }
  ],
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