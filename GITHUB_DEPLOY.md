# GitHub Pages 部署指南

## 1. 创建 GitHub 仓库

### 步骤：
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "New repository" 按钮
3. 仓库设置：
   - **仓库名**: `your-username.github.io` （替换为你的GitHub用户名）
   - **描述**: 我的个人网站
   - **Public** （GitHub Pages免费版只支持公开仓库）
   - 勾选 "Add a README file"
4. 点击 "Create repository"

### 重要提示：
- 仓库名必须是 `your-username.github.io` 格式，这样才会自动启用 GitHub Pages
- 如果仓库名不是这个格式，GitHub Pages 会通过 `your-username.github.io/repository-name` 访问

## 2. 配置本地 Git 环境

在您的项目目录下执行：

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加远程仓库（替换 your-username 为你的GitHub用户名）
git remote add origin https://github.com/your-username/your-username.github.io.git

# 添加所有文件
git add .

# 提交更改
git commit -m "init: 初始版本：个人网站"

# 推送到GitHub
git push -u origin main
```

## 3. 修改 Vite 配置

由于 GitHub Pages 部署到子目录，需要修改 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/your-username.github.io/',  // 替换为你的GitHub用户名
})
```

## 4. 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择：
   - **Source**: `GitHub Actions`
4. 保存设置

## 5. 部署过程

每次您推送代码到 `main` 分支时，GitHub Actions 会自动：
1. 检出您的代码
2. 安装依赖
3. 构建项目
4. 部署到 GitHub Pages

部署成功后，您的网站将可以通过以下地址访问：
- `https://Chen0jia0jun.github.io/`

## 6. 数据存储问题解决方案

### 当前问题：
目前的存储方式（localStorage）不适合GitHub Pages部署，因为：
- 数据无法同步到GitHub
- 每台设备访问的都是独立的存储空间
- 清理浏览器数据会丢失所有内容

## 7. 常见问题

**Q: 网站无法访问？**
A: 检查构建是否成功，GitHub Actions 页面查看详细错误信息

**Q: CSS/JS文件404错误？**
A: 确保 `vite.config.js` 中的 `base` 配置正确
