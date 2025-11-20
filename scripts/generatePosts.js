#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const postsDir = path.join(root, 'src', 'assets', 'posts')
const outFile = path.join(root, 'public', 'posts_index.json')

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const res = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(res)))
    } else if (entry.isFile() && res.toLowerCase().endsWith('.md')) {
      files.push(res)
    }
  }
  return files
}

function getParentTag(filePath) {
  const parts = filePath.split(path.sep)
  const postsIndex = parts.lastIndexOf('posts')
  if (postsIndex === -1) return ['未分类']
  const parentPath = path.dirname(filePath)
  const parentName = path.basename(parentPath)
  if (parentName === 'posts') return ['未分类']
  return [parentName]
}

async function generate() {
  try {
    const files = await walk(postsDir)
    const posts = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const raw = await fs.promises.readFile(file, 'utf-8')
      const lines = raw.split(/\r?\n/)
      let title = ''
      for (const line of lines) {
        const t = line.trim()
        if (t.length === 0) continue
        title = t.replace(/^#\s*/, '').trim()
        break
      }
      if (!title) {
        title = path.basename(file, path.extname(file))
      }

      const stats = await fs.promises.stat(file)
      const tags = getParentTag(file)

      const post = {
        id: i.toString(),
        title,
        content: raw,
        tags,
        published: true,
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString()
      }
      posts.push(post)
    }

    await fs.promises.mkdir(path.dirname(outFile), { recursive: true })
    await fs.promises.writeFile(outFile, JSON.stringify(posts, null, 2), 'utf-8')
    console.log(`Generated ${posts.length} posts -> ${outFile}`)
  } catch (err) {
    console.error('Error generating posts index:', err)
    process.exitCode = 1
  }
}

generate()
