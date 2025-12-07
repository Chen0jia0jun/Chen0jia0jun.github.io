import { marked } from "marked"
import hljs from "highlight.js"
import 'highlight.js/styles/androidstudio.css'

// 创建自定义渲染器
const markdownRender = new marked.Renderer()

// 保存原有的 code 渲染函数
const originalCode = markdownRender.code.bind(markdownRender)

// 自定义 code 渲染函数，添加语言标签和复制按钮
markdownRender.code = function(code, lang) {
  // 获取语言名称（如果没有指定语言，尝试自动识别）
  let language = lang || "text"
  let hightLightHtml = code;
  // 如果没有指定语言，通过 highlight.js 自动识别
  if (!lang) {
    const autoHighlight = hljs.highlightAuto(code)
    language = autoHighlight.language || "text"
  }
  hightLightHtml = hljs.highlight(code, { language }).value;
  console.log(originalCode(code, lang));
  console.log(hightLightHtml);
  // 获取语言的显示名称
  const languageMap = {
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "python": "Python",
    "java": "Java",
    "cpp": "C++",
    "c": "C",
    "csharp": "C#",
    "php": "PHP",
    "go": "Go",
    "rust": "Rust",
    "ruby": "Ruby",
    "swift": "Swift",
    "kotlin": "Kotlin",
    "scala": "Scala",
    "html": "HTML",
    "xml": "XML",
    "css": "CSS",
    "scss": "SCSS",
    "less": "LESS",
    "bash": "Bash",
    "shell": "Shell",
    "sh": "Shell",
    "json": "JSON",
    "yaml": "YAML",
    "yml": "YAML",
    "markdown": "Markdown",
    "sql": "SQL",
    "dockerfile": "Docker",
    "vue": "Vue",
    "jsx": "JSX",
    "tsx": "TSX",
    "text": "Text",
    "plain": "Text"
  }

  const displayLang = languageMap[language] || language.toUpperCase()

  // 生成代码块的 HTML，包含语言标签和复制按钮
  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${displayLang}</span>
        <button class="copy-btn" onclick="console.log(this)" data-code="${encodeURIComponent(code)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          复制
        </button>
      </div>
      ${originalCode(code, lang)}
    </div>
  `
}

export default markdownRender
