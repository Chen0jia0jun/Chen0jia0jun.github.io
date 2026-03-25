# 博客详情页与多端适配修改说明

## 修改目标

这次修改主要解决了 3 个问题：

1. 修复移动端，尤其是 iPhone Safari 下的页面显示稳定性
2. 修复页面缩放时字体和布局容易失衡的问题
3. 为博客详情页新增左侧目录导航，支持点击跳转到对应章节

## 具体改动

### 1. 全局多端适配与缩放兼容

修改文件：

- `index.html`
- `src/styles/_base.scss`
- `src/views/About.vue`

处理内容：

- 给 `viewport` 增加了 `viewport-fit=cover`，提升 iPhone 刘海屏适配
- 增加 `-webkit-text-size-adjust: 100%`，减少 iOS/Safari 在缩放和横竖屏切换时的字体异常放大
- 为 `body` 增加 `min-width: 320px` 和 `overflow-x: hidden`，避免缩放后横向抖动
- 对 `img / svg / video / canvas / iframe` 增加 `max-width: 100%`
- 在触屏设备和较小屏幕上将 `background-attachment: fixed` 改为 `scroll`
  - 这是为了规避 iPhone Safari 上固定背景常见的卡顿、错位和白屏问题
- 将 `About` 页面原本固定的 `width: 75%` 改成更稳定的流式宽度

### 2. 博客详情页布局重构

修改文件：

- `src/views/Blog/BlogPost.vue`

处理内容：

- 移除了原先固定的 `width: 75%`
- 改为桌面端两栏布局：
  - 左侧：目录栏
  - 右侧：文章正文
- 改为移动端单栏布局，目录自动移到正文上方
- 使用 `clamp()` 处理正文标题、元信息、正文文字大小
- 优化代码块、表格、长链接、图片在窄屏和缩放下的表现
- 给标题增加 `scroll-margin-top`，避免点击目录后被顶部导航遮住

### 3. 博客目录栏

修改文件：

- `src/views/Blog/BlogPost.vue`

实现方式：

- 在 markdown 渲染完成后，自动扫描 `h1 / h2 / h3`
- 为每个标题自动生成唯一锚点 `id`
- 基于这些标题生成目录数据
- 点击目录项后：
  - 更新地址栏 hash
  - 平滑滚动到对应标题
- 使用 `IntersectionObserver` 跟踪当前阅读位置，并高亮当前目录项

## 影响说明

- 旧文章无需手动改 markdown，即可自动生成目录
- 没有标题的文章不会显示目录栏
- 移动端仍然可以使用目录，只是位置会从左侧改为正文上方

## 建议验证项

建议你重点检查下面几项：

1. iPhone Safari 打开首页、博客页、关于页时是否仍有背景错位或白屏
2. 在浏览器缩放到 `80% / 125% / 150%` 时，博客详情页是否仍保持稳定布局
3. 打开任意博客详情页，检查目录是否：
   - 正常生成
   - 点击后可跳转
   - 滚动时高亮跟随变化

