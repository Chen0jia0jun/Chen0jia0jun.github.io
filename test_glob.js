// 测试import.meta.glob
const mdFiles = import.meta.glob('/src/assets/posts/**/*.md', { query: '?raw', import: 'default', eager: true })

console.log('找到的文件数量:', Object.keys(mdFiles).length)
console.log('文件路径:', Object.keys(mdFiles))

for (const [path, content] of Object.entries(mdFiles)) {
  console.log('文件:', path, '内容长度:', content.length)
}
