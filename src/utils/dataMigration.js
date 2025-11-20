// 数据导出工具 - 用于将localStorage数据导出为静态文件
// 使用方法：在浏览器控制台中运行此脚本

const exportData = () => {
  // 导出照片数据
  const photosData = localStorage.getItem('photos')
  if (photosData) {
    const photos = JSON.parse(photosData)
    
    // 创建照片数据文件
    const photosFile = {
      photos: photos.map(photo => ({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        date: photo.date,
        tags: photo.tags,
        // 注意：实际图片需要手动上传到仓库
        imagePath: `assets/photos/${photo.id}.jpg`
      }))
    }
    
    console.log('照片数据:', JSON.stringify(photosFile, null, 2))
    
    // 创建示例README
    const photosReadme = `# 照片数据

共 ${photos.length} 张照片

${photos.map(photo => `
## ${photo.title}
- 日期: ${photo.date}
- 标签: ${photo.tags.join(', ')}
- 描述: ${photo.description || '无描述'}
- 图片路径: assets/photos/${photo.id}.jpg
`).join('\n')}

> 请手动将对应的照片文件复制到 assets/photos/ 目录中
> 照片文件名应为: [照片ID].jpg

例如：
${photos.map(photo => `cp /path/to/your/photo ${photo.id}.jpg`).join('\n')}
`
    
    console.log('照片README:', photosReadme)
  }
  
  // 导出博客数据
  const blogData = localStorage.getItem('blogPosts')
  if (blogData) {
    const posts = JSON.parse(blogData)
    
    // 创建文章目录结构
    posts.forEach(post => {
      const fileName = `${post.id}.md`
      const content = `# ${post.title}

---
**发布日期**: ${post.date}
**标签**: ${post.tags ? post.tags.join(', ') : ''}
**摘要**: ${post.excerpt || ''}

---

${post.content}

---
*文章ID: ${post.id}*
`
      
      console.log(`\n=== ${fileName} ===`)
      console.log(content)
    })
  }
}

// 导入静态数据脚本
const importStaticData = () => {
  // 这里可以加载从Git仓库获取的静态数据
  // 用于替代localStorage
  const loadPhotosFromStatic = () => {
    // 模拟从GitHub API获取数据
    // 实际使用时应该调用GitHub API
    return fetch('/src/assets/data/photos.json')
      .then(response => response.json())
      .catch(() => {
        // 如果文件不存在，返回空数组
        return { photos: [] }
      })
  }
  
  const loadPostsFromStatic = () => {
    // 模拟从GitHub API获取博客文章
    return fetch('/src/assets/posts/')
      .then(response => response.text())
      .catch(() => {
        return ''
      })
  }
  
  console.log('使用静态数据加载功能')
}

// 生成部署脚本
const generateDeployScript = () => {
  const script = `# 部署脚本
# 1. 导出当前数据
echo "导出当前数据..."
npm run export-data

# 2. 提交到Git
git add .
git commit -m "更新内容和数据"
git push origin main

# 3. 等待GitHub Pages部署
echo "请等待5-10分钟后访问 https://your-username.github.io/"
`
  
  console.log('部署脚本:', script)
}

// 执行导出
exportData()

console.log('\n=== 使用说明 ===')
console.log('1. 复制上面的输出到对应的静态数据文件')
console.log('2. 修改vite.config.js中的base配置')
console.log('3. 运行生成部署脚本')
console.log('4. 按照GITHUB_DEPLOY.md指南部署')