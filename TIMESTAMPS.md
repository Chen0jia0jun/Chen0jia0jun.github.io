# 博客时间戳功能说明

## 概述

博客系统现在支持从 markdown 文件中提取创建时间和更新时间。系统会按以下优先级获取时间戳：

1. **Frontmatter**（最高优先级，推荐使用）
2. **当前时间**（回退方案）

## 为什么文件系统时间戳不可用？

由于浏览器的安全限制和 Vite 的开发模式特性，无法在客户端直接获取文件的真实文件系统时间戳（包括创建时间和最后修改时间）。这是所有纯前端静态网站的共同限制。

## 使用方法

### 方法 1：使用 Frontmatter（强烈推荐）

在你的 markdown 文件顶部添加 YAML frontmatter：

```yaml
---
title: "文章标题"
createdAt: "2024-01-15T10:30:00"
updatedAt: "2024-12-01T14:20:00"
tags:
  - 技术
  - 教程
---
```

#### 支持的字段

- `createdAt`: 文章创建时间（ISO 8601 格式）
- `updatedAt`: 文章最后更新时间（ISO 8601 格式）
- `date`: 如果没有 createdAt，会使用此字段作为创建时间
- `title`: 文章标题（可选，会覆盖从内容中提取的标题）

#### 时间格式

使用 ISO 8601 格式：
- 完整格式：`2024-01-15T10:30:00`
- 带时区：`2024-01-15T10:30:00+08:00`
- 只有日期：`2024-01-15`（会自动转换为完整格式）

### 方法 2：无 frontmatter（不推荐）

如果没有 frontmatter，系统会使用当前时间作为创建和更新时间。这会导致所有没有 frontmatter 的文章显示相同的时间（系统当前时间）。

## 示例

### 示例 1：完整 frontmatter

```markdown
---
title: "Vue 3 最佳实践"
createdAt: "2024-06-01T09:00:00"
updatedAt: "2024-12-10T15:30:00"
tags:
  - Vue
  - 前端
---

# Vue 3 最佳实践

本文介绍了 Vue 3 的一些最佳实践...
```

### 示例 2：简化 frontmatter

```markdown
---
date: "2024-06-01"
tags: ["JavaScript", "ES6"]
---

# ES6 新特性

本文介绍 ES6 的新特性...
```

### 示例 3：无 frontmatter（不推荐）

```markdown
# 无 frontmatter 文章

这篇文章没有 frontmatter，系统会使用当前时间。
```

## 代码实现

### blog.js 关键方法

1. **extractFrontmatter(content)**: 解析 YAML frontmatter
2. **extractTimestamps(content, filePath, metadata)**: 提取时间戳
3. **loadMarkdownFiles()**: 加载所有 markdown 文件并提取时间戳

### 排序逻辑

博客文章按 `updatedAt` 降序排列：

```javascript
postsByDate: (state) => {
  return [...state.publishedPosts].sort((a, b) => {
    const aTime = a.updatedAt || a.createdAt || a.date || ''
    const bTime = b.updatedAt || b.createdAt || b.date || ''
    return new Date(bTime) - new Date(aTime)
  })
}
```

## 开发模式 vs 生产模式

### 开发模式（`npm run dev`）

- 无法获取文件系统时间戳
- 没有 frontmatter 的文章会使用当前时间
- 控制台会显示提示信息，建议使用 frontmatter

### 生产模式（部署到 GitHub Pages）

- 构建时时间戳已固定
- 无法动态获取文件系统时间戳
- 仍然建议使用 frontmatter 获得精确时间戳

## 高级用法：获取真实文件时间戳的方案

如果确实需要获取文件的真实时间戳，有以下方案：

### 方案 1：使用 Git 提交时间（推荐）

通过构建插件获取 Git 提交时间：

```javascript
// 安装 vite-plugin-git-info
npm install --save-dev vite-plugin-git-info

// 在 vite.config.js 中配置
import gitInfo from 'vite-plugin-git-info'

export default defineConfig({
  plugins: [
    vue(),
    gitInfo({
      // 配置选项
      format: 'iso'
    })
  ]
})
```

### 方案 2：使用构建时静态生成

在构建过程中，将时间戳写入 JSON 文件：

```bash
# scripts/generateTimestamps.js
const fs = require('fs')
const path = require('path')

// 扫描所有 .md 文件，生成时间戳
const timestamps = {}
// ... 生成逻辑

fs.writeFileSync(
  path.join(__dirname, '../public/timestamps.json'),
  JSON.stringify(timestamps, null, 2)
)
```

### 方案 3：使用 GitHub API

在运行时调用 GitHub API 获取文件的最后提交时间：

```javascript
// 仅在生产模式下使用
const getGitTimestamp = async (filePath) => {
  const response = await fetch(
    `https://api.github.com/repos/username/repo/commits?path=${filePath}`
  )
  const commits = await response.json()
  return commits[0].commit.author.date
}
```

**注意**：这需要 GitHub API 调用，可能受到速率限制。

## 最佳实践

1. **始终使用 frontmatter**：这是最可靠、最简单的方法
2. **为每篇文章添加时间戳**：确保时间戳的准确性
3. **使用标准时间格式**：遵循 ISO 8601 标准
4. **定期更新 updatedAt**：当文章有修改时，记得更新时间戳

## 注意事项

1. **性能**：
   - frontmatter 解析是同步的，性能很好
   - 建议使用 frontmatter 获得最佳性能

2. **维护性**：
   - frontmatter 方式易于理解和维护
   - 可以在编辑器中通过插件预览 frontmatter

3. **兼容性**：
   - 支持标准的 YAML frontmatter 语法
   - 仅支持简单的键值对，不支持复杂结构

## 测试文件

系统包含两个测试文件：

1. **`src/assets/posts/timestamp-demo.md`**: 演示 frontmatter 功能
2. **`src/assets/posts/tech/filesystem-timestamp.md`**: 演示无 frontmatter 的情况

访问博客页面查看效果！

## 总结

- ✅ **推荐**：使用 frontmatter 声明时间戳
- ❌ **不推荐**：依赖文件系统时间戳（不可行）
- ✅ **最佳实践**：为每篇文章添加 `createdAt` 和 `updatedAt`
