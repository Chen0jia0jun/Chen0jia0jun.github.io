import { marked } from "marked"
import hljs from "highlight.js"
import 'highlight.js/styles/androidstudio.css'
import markedKatex from "marked-katex-extension"
import 'highlight.js/styles/androidstudio.css'
import 'katex/dist/katex.min.css'

// 配置 marked
marked
  .setOptions({
    langPrefix: 'language-',
    gfm: true,
    breaks: true  // 启用换行符支持
  })
  .use(markedKatex({ strict: false }))

// 创建自定义渲染器
const renderer = new marked.Renderer()

// 自定义 code 渲染函数
renderer.code = function(code, lang) {
  // 获取语言标识符
  const language = lang || 'text'

  // 使用 highlight.js 高亮代码
  let highlightedCode
  if (language && hljs.getLanguage(language)) {
    try {
      highlightedCode = hljs.highlight(code, { language }).value
    } catch (err) {
      highlightedCode = hljs.highlightAuto(code).value
    }
  } else {
    highlightedCode = hljs.highlightAuto(code).value
  }

  return `
<div class="code-block-wrapper">
  <div class="code-block-header">
    <span class="code-lang">${language}</span>
    <button class="copy-btn" data-code="${encodeURIComponent(code)}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      复制
    </button>
  </div>
  <pre><code class="hljs language-${language}">${highlightedCode}</code></pre>
</div>`
}

marked.use({ renderer })

export default marked
