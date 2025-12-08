import { marked } from "marked"
import hljs from "highlight.js"
import 'highlight.js/styles/androidstudio.css'
import { markedHighlight } from "marked-highlight"
import markedKatex from "marked-katex-extension";
import 'highlight.js/styles/androidstudio.css'

import 'katex/dist/katex.min.css';

// 配置 marked
    marked
      .setOptions({
        langPrefix: 'language-',
        gfm: true
      })
      .use(markedKatex({ strict: false }))
      

// 创建自定义渲染器
const renderer = new marked.Renderer()

// 自定义 code 渲染函数，添加语言标签和复制按钮
renderer.code = function(code,lang,text,raw) {
  let language = lang || "text";
  console.log(code);
  
  // 如果没有指定语言，通过 highlight.js 自动识别
  if (!lang) {
    const autoHighlight = hljs.highlightAuto(code)
    language = autoHighlight.language || "text"
    code = autoHighlight.value;
  }
  else {
    code = hljs.highlight(code, { language: lang }).value;
  }

  // 生成代码块的 HTML，包含语言标签和复制按钮
  return (
    `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${language}</span>
        <button class="copy-btn" onclick="console.log(this)" >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          复制
        </button>
      </div>
      <pre><code class="hljs language-${language}">${code}</code></pre>
    </div>`
  )
}

marked.use({ renderer });

export default marked
