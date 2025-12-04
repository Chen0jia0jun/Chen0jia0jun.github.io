/**
 * Blog helper functions
 */

export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getReadingTime(content, wordsPerMinute = 200) {
  if (!content) return '1 分钟阅读'
  const textLength = content.replace(/[#*`]/g, '').length
  const readingTime = Math.max(1, Math.ceil(textLength / wordsPerMinute))
  return `${readingTime} 分钟阅读`
}

/**
 * 分页切片
 * @param {Array} posts
 * @param {number} page
 * @param {number} perPage
 * @returns {Array}
 */
export function paginatePosts(posts = [], page = 1, perPage = 10) {
  const start = (page - 1) * perPage
  const end = start + perPage
  return posts.slice(start, end)
}

/**
 * 计算可见页码（第一页、最后一页以及当前页周围若干页）
 * @param {number} total
 * @param {number} current
 * @param {number} delta
 * @returns {number[]} 可见页码数组
 */
export function calculateVisiblePages(total = 1, current = 1, delta = 2) {
  const pages = []
  if (total <= 0) return pages
  pages.push(1)
  for (let i = current - delta; i <= current + delta; i++) {
    if (i > 1 && i < total) pages.push(i)
  }
  if (total > 1) pages.push(total)
  return [...new Set(pages)].sort((a, b) => a - b)
}

export default {
  formatDate,
  getReadingTime,
  paginatePosts,
  calculateVisiblePages
}
