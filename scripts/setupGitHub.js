#!/usr/bin/env node

// GitHub Pages 初始化脚本
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

console.log('🚀 GitHub Pages 初始化脚本')
console.log('==============================')

// 检查是否有GitHub仓库
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (text) => new Promise((resolve) => readline.question(text, resolve))

const setupGitHub = async () => {
  try {
    // 获取GitHub用户名
    const githubUsername = await question('请输入您的GitHub用户名: ')
    
    if (!githubUsername) {
      console.log('❌ GitHub用户名不能为空')
      return
    }
    
    // 获取仓库名
    const repoName = await question(`请输入仓库名 (默认: ${githubUsername}.github.io): `) || `${githubUsername}.github.io`
    
    // 更新vite.config.js
    const viteConfigPath = join(process.cwd(), 'vite.config.js')
    let viteConfig = readFileSync(viteConfigPath, 'utf8')
    
    const oldBase = "'/your-username.github.io/'"
    const newBase = `'/${repoName}/'`
    
    if (viteConfig.includes(oldBase)) {
      viteConfig = viteConfig.replace(oldBase, newBase)
      writeFileSync(viteConfigPath, viteConfig)
      console.log('✅ 已更新 vite.config.js 中的base配置')
    }
    
    // 更新GitHub Actions配置
    const githubActionsPath = join(process.cwd(), '.github/workflows/deploy.yml')
    let actionsConfig = readFileSync(githubActionsPath, 'utf8')
    
    const oldRepoPath = '/your-username.github.io/'
    const newRepoPath = `/${repoName}/`
    
    actionsConfig = actionsConfig.replace(oldRepoPath, newRepoPath)
    writeFileSync(githubActionsPath, actionsConfig)
    console.log('✅ 已更新 GitHub Actions 配置')
    
    // 创建示例数据目录
    const assetsDir = join(process.cwd(), 'src/assets')
    const photosDir = join(assetsDir, 'photos')
    const postsDir = join(assetsDir, 'posts')
    const dataDir = join(assetsDir, 'data')
    
    try {
      mkdirSync(assetsDir, { recursive: true })
      mkdirSync(photosDir, { recursive: true })
      mkdirSync(postsDir, { recursive: true })
      mkdirSync(dataDir, { recursive: true })
      console.log('✅ 已创建静态数据目录')
    } catch (err) {
      console.log('⚠️ 目录已存在，跳过创建')
    }
    
    // 创建示例数据文件
    const samplePhotos = {
      photos: [
        {
          id: "sample-1",
          title: "示例照片",
          description: "这是示例照片",
          date: "2025-11-19",
          tags: ["示例"],
          imagePath: "assets/photos/sample-1.jpg"
        }
      ]
    }
    
    const samplePost = `# 欢迎来到我的博客

这是使用静态数据的第一篇博客文章！

## 说明

本文档存储在 \\`src/assets/posts/welcome.md\\` 文件中，
通过Git进行版本控制，数据持久化保存在GitHub仓库中。

## 优势

- ✅ 数据持久化
- ✅ 版本控制
- ✅ 跨设备同步
- ✅ 完全免费

感谢您的访问！
`
    
    writeFileSync(join(dataDir, 'photos.json'), JSON.stringify(samplePhotos, null, 2))
    writeFileSync(join(postsDir, 'welcome.md'), samplePost)
    console.log('✅ 已创建示例数据文件')
    
    // 生成Git初始化命令
    const gitCommands = [
      'git init',
      `git remote add origin https://github.com/${githubUsername}/${repoName}.git`,
      'git add .',
      'git commit -m "初始版本：个人网站"',
      'git branch -M main',
      'git push -u origin main'
    ]
    
    console.log('\n📋 下一步操作：')
    console.log('==============================')
    console.log('1. 在GitHub创建仓库:', `${githubUsername}/${repoName}`)
    console.log('2. 运行以下命令：')
    gitCommands.forEach(cmd => console.log(`   ${cmd}`))
    console.log('3. 在GitHub仓库设置中启用Pages:')
    console.log('   - 进入 Settings > Pages')
    console.log('   - Source 选择 "GitHub Actions"')
    console.log('4. 等待5-10分钟让部署完成')
    console.log(`5. 访问: https://${githubUsername}.github.io/${repoName}/`)
    
    readline.close()
    
  } catch (error) {
    console.error('❌ 设置失败:', error.message)
    readline.close()
  }
}

// 运行设置
setupGitHub()