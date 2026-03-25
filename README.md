# 我的个人网站

一个基于 Vue.js 3 构建的现代化个人网站，包含照片画廊和博客功能，支持 Markdown 格式文章编辑和响应式设计。

## 🔮 To Do List

### Website features
- [x] **仓库存储图片**
- [x] **随机门-访问别人的博客**
- [x] **背景美化**
- [x] **MarkDown渲染器**
- [x] **过渡动画**
- [x] **音乐播放器**
- [x] **字体美化**
- [x] **资讯汇总**
- [x] **博客封面**
- [x] **多端适应**
- [ ] **图片压缩功能**

### Technology optimization

- [ ] **自定义域名**
- [ ] **PWA 支持** - 离线访问和原生应用体验
- [ ] **SEO 优化** - 更好的搜索引擎优化
- [ ] **性能监控** - 页面加载性能分析
- [ ] **国际化** - 多语言支持
- [ ] **文章评论系统**

### 数据格式

```javascript
// 照片数据结构
{
  id: "unique-id",
  title: "照片标题",
  description: "照片描述",
  url: "data:image/jpeg;base64,...",
  thumbnail: "data:image/jpeg;base64,...",
  date: "2025-11-19",
  tags: ["风景", "旅行"],
  uploadedAt: "2025-11-19T10:30:00.000Z"
}

// 博客文章数据结构
{
  id: "unique-id",
  title: "文章标题",
  slug: "article-slug",
  content: "# Markdown 内容",
  excerpt: "文章摘要",
  date: "2025-11-19",
  tags: ["技术", "Vue"],
  published: true,
  createdAt: "2025-11-19T10:30:00.000Z",
  updatedAt: "2025-11-19T10:30:00.000Z"
}
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情