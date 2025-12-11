---
title: "Marked"
createdAt: "2025-12-08T10:30:00"
updatedAt: "2025-12-11T14:20:00"
---
# Marked配置

## 基本使用



`v-html`会自动渲染html结构的字符串

`npm install marked `

```Vue
<article class="post-content content-container">
        <div class="markdown-content" v-html="renderedContent"></div>
 </article>
...

import { marked } from 'marked'
...
const renderedContent = computed(() => {
      if (!post.value) return ''
      return marked(post.value.content)
      })
```



## 扩展插件



### katex



支持解析katex数学公式

`npm install marked-katex-extension `

```JavaScript
import { marked } from 'marked'
import markedKatex from "marked-katex-extension";
import 'katex/dist/katex.min.css';

marked.use(markedKatex({strict: false}))
```

如果不引入特定的样式，就会出现一行公式最后解析出两行的情况。

`strict: false`非严格模式下，公式块中输入中文不会报错，否则控制台会输出警告。

### highlight

高亮代码块

代码块高亮风格可以在这个网站中查看，选择好了对应的样式之后，```import```导入即可 [Demo - highlight.js](https://highlightjs.org/demo)

`npm install marked-highlight `

```JavaScript
import { markedHighlight } from "marked-highlight"
import 'highlight.js/styles/androidstudio.css'
...
marked.use(markedHighlight({
      highlight: function(code, lang) {
        // 逻辑优先级：指定有效语言 → 自动识别 → 降级为 shell
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value
          } catch (error) {
            console.error('Code highlighting error:', error)
            // 异常时回退到自动识别
            return hljs.highlightAuto(code).value
          }
        }
        // 未指定语言/语言无效 → 先自动识别，识别失败则用 shell 兜底
        const autoHighlight = hljs.highlightAuto(code)
        return autoHighlight.value || hljs.highlight(code, { language: 'shell' }).value
      }
    }))
```



### DOMPurify

过滤恶意输出，防止XSS攻击

这其实并不属于marked的插件，但也可以一起用。

`npm install dompurify `

```JavaScript
import DOMPurify from 'dompurify'
...

 const renderedContent = computed(() => {
      if (!post.value) return ''
      
      try {
        const html = marked(post.value.content)
        return DOMPurify.sanitize(html)
      } catch (error) {
        console.error('Markdown rendering error:', error)
        return post.value.content
      }
    })

```

