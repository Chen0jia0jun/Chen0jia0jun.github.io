# 我的个人网站

一个基于 Vue.js 3 构建的现代化个人网站，包含照片画廊和博客功能，支持 Markdown 格式文章编辑和响应式设计。

## 🔮 To Do List

### Website features

- [ ] **仓库存储博客和图片**
- [ ] **数据可视化** - 博客统计和访问分析
- [ ] **AI 助手** - 智能内容建议和语法检查
- [ ] **主题商店** - 更多预设主题
- [ ] **插件系统** - 支持第三方扩展
- [ ] **音乐播放器** - 音乐从本地读取


### Technology optimization

- [ ] **自定义域名**
- [ ] **PWA 支持** - 离线访问和原生应用体验
- [ ] **SEO 优化** - 更好的搜索引擎优化
- [ ] **性能监控** - 页面加载性能分析
- [ ] **国际化** - 多语言支持


## ✨ 功能特点

- 📸 **照片画廊** - 瀑布流布局展示照片，支持拖拽上传
- ✍️ **博客系统** - 支持 Markdown 格式，语法高亮
- 🌙 **主题切换** - 深色/浅色主题无缝切换
- 📱 **响应式设计** - 完美适配各种设备
- 🎨 **现代化 UI** - 简洁优雅的设计风格
- 🧪 **预留测试模块** - 为未来功能扩展预留空间
- 💾 **本地存储** - 数据持久化到浏览器本地存储

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 运行测试

```bash
# 运行单元测试
npm run test

# 运行测试并查看 UI
npm run test:ui
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Navbar.vue      # 导航栏
│   ├── Footer.vue      # 页脚
│   └── PhotoModal.vue  # 照片弹窗
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── Gallery.vue     # 照片画廊
│   ├── Blog.vue        # 博客列表
│   ├── BlogPost.vue    # 文章详情
│   └── Tests.vue       # 实验室(测试模块)
├── store/              # 状态管理
│   ├── theme.js        # 主题状态
│   ├── photos.js       # 照片数据
│   └── blog.js         # 博客数据
├── router/             # 路由配置
│   └── index.js        # 路由定义
├── test/               # 测试文件
│   ├── setup.ts        # 测试环境配置
│   └── basic.test.js   # 基础测试用例
├── App.vue             # 根组件
├── main.js             # 应用入口
└── style.css           # 全局样式
```

## 🎯 核心功能使用

### 照片管理

1. **照片筛选**：
   - 按标签筛选照片
   - 支持按时间、标题排序
   - 分页浏览大量照片

2. **照片详情**：
   - 点击照片查看大图
   - 编辑照片信息
   - 下载或删除照片

### 博客系统


1. **文章管理**：
   - 支持搜索和标签筛选
   - 按时间、标题排序
   - 自动计算阅读时间

2. **Markdown 支持**：
   - 代码语法高亮
   - 表格、引用、列表
   - 链接和图片支持

### 主题切换

- 点击导航栏中的太阳/月亮图标
- 自动保存用户偏好
- 支持深色和浅色两种主题

## 🛠️ 技术栈

- **前端框架**: Vue.js 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: 原生 CSS3
- **Markdown 解析**: marked.js
- **代码高亮**: highlight.js
- **测试框架**: Vitest + Vue Test Utils
- **包管理**: npm

## 🎨 设计特色

### 现代化极简设计

- **色彩系统**: 以中性色为主体，辅以专业蓝色作为品牌色
- **字体系统**: 使用 Inter 字体，确保优秀的阅读体验
- **间距系统**: 基于 4px 网格系统，保证视觉一致性
- **动画效果**: 微妙的过渡动画，提升交互体验

### 响应式设计

- **移动端优先**: 从小屏幕开始设计，逐步适配大屏幕
- **断点设计**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px  
  - Desktop: > 1024px
- **自适应布局**: 网格布局自动调整列数

### 无障碍设计

- **高对比度**: 确保文字在各种主题下都有足够的对比度
- **键盘导航**: 支持键盘操作所有功能
- **语义化 HTML**: 使用正确的 HTML 标签和属性
- **屏幕阅读器支持**: 为辅助技术提供合适的标签

## 🔧 开发说明

### 组件开发规范

1. **命名**: 使用 PascalCase 命名组件
2. **结构**: 单文件组件 (SFC) 格式
3. **props**: 使用 `defineProps` 和 `defineEmits`
4. **状态**: 使用 Composition API 和 Pinia

### 样式规范

1. **CSS 变量**: 使用 CSS 自定义属性管理主题色
2. **响应式**: 优先考虑移动端，然后扩展到桌面
3. **动画**: 使用 CSS transitions 和 transforms
4. **命名**: 使用 BEM 命名规范或 CSS Modules

### 测试规范

1. **单元测试**: 使用 Vitest 测试组件和业务逻辑
2. **集成测试**: 测试组件间的交互
3. **E2E 测试**: 可使用 Cypress 进行端到端测试

## 📝 数据存储

### 本地存储

- **照片数据**: 存储在 `localStorage` 的 `photos` 字段
- **博客文章**: 存储在 `localStorage` 的 `blogPosts` 字段
- **主题设置**: 存储在 `localStorage` 的 `theme` 字段

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