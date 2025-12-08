# GitHub Action 使用记录

GitHub Actions是GitHub提供的**持续集成/持续部署(CI/CD)**平台，基于**事件驱动**的自动化工作流系统。它让开发者可以自动化构建、测试和部署流程，实现"代码推送即部署"的理想状态。

基本架构如下：

```scss
GitHub Repository
    ↓ (事件触发)
GitHub Actions Runner
    ↓ (执行工作流)
Workflow YAML文件
    ↓ (定义步骤)
Actions (可重用组件)
    ↓ (执行任务)
结果反馈
```

# 优化

从触发时机和缓存机制入手对它进行了优化

## 触发时机

忽视了一些与网站部署无关文件的更改

```tex
paths-ignore:
      - 'README.md'
      - 'LICENSE'
      - 'GITHUB_DEPLOY.md'
      # - '.github/**'
      - 'test/**'
      - '.vscode/**'
      - 'scripts/setupGitHub.js'
```

## 缓存机制

缓存需要让系统关注：**缓存什么、何时缓存**。

本次实践使用的方法是用官方预设好的key，大概如下：`npm-${{ hashFiles('package-lock.json') }}-${{ matrix.node-version }}` 意思是下载对应node版本的包，依据`package-lock.json`来下载，若`package-lock.json`没变，则不重新下载了。若有`yarn.lock`或者其他复杂的情况，则不能使用官方预设了，则许哟自己去设置key。

官方同时还预设了缓存默认缓存 `node_modules` 目录（或 npm 缓存目录），`cache-dependency-path` 的作用是告诉 Action：「以这个文件的哈希值作为 `key` 的一部分」，确保文件不变时复用缓存。

[依赖项缓存参考 - GitHub 文档](https://docs.github.com/zh/actions/reference/workflows-and-actions/dependency-caching)

将npm下载下的node_modules缓存到服务器中，在下次构建的时候就可以直接从服务器获取，而不是重新联网下载node_modules，`--prefer-offline` 则是优先从本地获取（包括服务器），`--no-audit` 不对下载的包进行审计，加快下载速度，`--progress=false` 则是隐藏细节。

```
steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: package-lock.json
      - name: Install dependencies
        run: npm install --prefer-offline --no-audit --progress=false
```

而因为npm存在会忽略可选包的下载问题，因此不得不在每次构建的时候都删除所有node_module重新构建，因为不重新下载就会存在缺失。

**补充：**取消了删除所有包的操作，而是只下载缺少的包。

修改部分如下

```
steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: package-lock.json
      - name: Install dependencies
        run: |
          npm ci --no-audit --progress=false
          npm install @rollup/rollup-linux-x64-gnu
```



# Vue3流水线Code

```
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
    paths-ignore:
      - 'README.md'
      - 'LICENSE'
      - 'GITHUB_DEPLOY.md'
      # - '.github/**'
      - 'test/**'
      - '.vscode/**'
      - 'scripts/setupGitHub.js'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: package-lock.json
      - name: Clean cache (fix npm optional dependencies bug)
        run: |
          if [ -f package-lock.json ]; then
            rm package-lock.json
          fi
          if [ -d node_modules ]; then
            rm -rf node_modules
          fi
      - name: Install dependencies
        run: npm install --prefer-offline --no-audit --progress=false

      - name: Generate posts index
        run: npm run generate:posts

      - name: Build
        run: npm run build

      - name: Upload artifact for GitHub Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

# More

可以考虑使用act来进行本地workflow运行；暂时没这个需求就没去折腾了。

[突破GitHub Actions性能瓶颈：act缓存机制全解析与优化指南-CSDN博客](https://blog.csdn.net/gitblog_00728/article/details/151436097)

[act:nektos/act: 是一个开源的 GitHub Actions 辅助工具](https://gitcode.com/GitHub_Trending/ac/act?utm_source=csdn-blog-iframe&uuid_tt_dd=10_21307064330-1752381084394-638330&from_id=151436097&isLogin=1&uid=C1160793279)

# 参考链接

[GitHub Actions工作原理深度解析 - 吾以观复 - 博客园](https://www.cnblogs.com/xtkyxnx/p/19077445)

[GitHub Actions 快速入门 - GitHub 文档](https://docs.github.com/zh/actions/get-started/quickstart)

[GitHub Actions 缓存教程-CSDN博客](https://blog.csdn.net/gitblog_00133/article/details/141153931)

[Automating a software company with GitHub Actions - PostHog](https://posthog.com/blog/automating-a-software-company-with-github-actions)
