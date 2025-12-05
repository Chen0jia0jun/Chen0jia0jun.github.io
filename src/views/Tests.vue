<template>
  <div class="tests">
    <div class="container">
      <!-- Header -->
      <div class="tests-header">
        <h1>实验室</h1>
      </div>

      <!-- Feature Grid -->
      <div class="features-grid">
        <!-- Coming Soon Card -->
        <div class="feature-card card coming-soon">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <h3>实时协作编辑</h3>
          <p>多人实时协作编辑文章，支持评论和版本控制</p>
          <div class="feature-status">
            <span class="status-badge coming-soon">开发中</span>
          </div>
        </div>

        <!-- Demo Card -->
        <div class="feature-card card demo">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
          </div>
          <h3>组件测试演示</h3>
          <p>展示可复用组件的设计和交互效果</p>
          <div class="demo-controls">
            <button @click="showComponentDemo" class="btn btn-primary">
              查看演示
            </button>
          </div>
        </div>

        <!-- Coming Soon Card -->
        <div class="feature-card card coming-soon">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="7.5,4.21 12,6.81 16.5,4.21"/>
              <polyline points="7.5,19.79 7.5,14.6 3,12"/>
              <polyline points="21,12 16.5,14.6 16.5,19.79"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h3>数据可视化</h3>
          <p>博客数据统计、网站访问分析和图表展示</p>
          <div class="feature-status">
            <span class="status-badge coming-soon">计划中</span>
          </div>
        </div>

        <!-- Coming Soon Card -->
        <div class="feature-card card coming-soon">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
            </svg>
          </div>
          <h3>AI 助手</h3>
          <p>智能文章生成、内容建议和语法检查</p>
          <div class="feature-status">
            <span class="status-badge coming-soon">研究中</span>
          </div>
        </div>
      </div>

      <!-- Test Statistics -->
      <div class="test-stats">
        <h2>开发进度</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">4</div>
            <div class="stat-label">计划功能</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1</div>
            <div class="stat-label">可演示功能</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">0</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">25%</div>
            <div class="stat-label">完成进度</div>
          </div>
        </div>
      </div>

      <!-- Component Demo Modal -->
      <div v-if="showDemo" class="demo-modal-overlay" @click="closeDemo">
        <div class="demo-modal" @click.stop>
          <div class="demo-header">
            <h3>组件测试演示</h3>
            <button @click="closeDemo" class="demo-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="demo-content">
            <!-- Button Variations -->
            <div class="demo-section">
              <h4>按钮组件</h4>
              <div class="demo-buttons">
                <button class="btn btn-primary">主要按钮</button>
                <button class="btn btn-secondary">次要按钮</button>
                <button class="btn btn-danger">危险按钮</button>
                <button class="btn" style="background: var(--success); color: white;">成功按钮</button>
              </div>
            </div>

            <!-- Card Variations -->
            <div class="demo-section">
              <h4>卡片组件</h4>
              <div class="demo-cards">
                <div class="card" style="max-width: 200px;">
                  <h5>默认卡片</h5>
                  <p>这是一个标准的卡片组件</p>
                </div>
                <div class="card" style="border: 2px dashed var(--primary-500); max-width: 200px;">
                  <h5>虚线边框</h5>
                  <p>演示不同样式的卡片</p>
                </div>
              </div>
            </div>

            <!-- Form Elements -->
            <div class="demo-section">
              <h4>表单元素</h4>
              <div class="demo-forms">
                <div class="form-group">
                  <label>文本输入</label>
                  <input type="text" placeholder="请输入文本" />
                </div>
                <div class="form-group">
                  <label>选择框</label>
                  <select>
                    <option>选项一</option>
                    <option>选项二</option>
                    <option>选项三</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" />
                    <span>复选框</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Animation Test -->
            <div class="demo-section">
              <h4>动画效果</h4>
              <div class="animation-demo">
                <div class="animation-box" :class="{ 'animate': isAnimating }"></div>
                <button @click="toggleAnimation" class="btn btn-secondary">
                  {{ isAnimating ? '停止动画' : '开始动画' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Tests',
  setup() {
    const showDemo = ref(false)
    const isAnimating = ref(false)

    const showComponentDemo = () => {
      showDemo.value = true
    }

    const closeDemo = () => {
      showDemo.value = false
      isAnimating.value = false
    }

    const toggleAnimation = () => {
      isAnimating.value = !isAnimating.value
    }

    return {
      showDemo,
      isAnimating,
      showComponentDemo,
      closeDemo,
      toggleAnimation
    }
  }
}
</script>

<style scoped>
.tests {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

/* Header */
.tests-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.tests-header h1 {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-16);
}

.feature-card {
  padding: var(--spacing-8);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card.coming-soon {
  opacity: 0.7;
  cursor: not-allowed;
}

.feature-card.demo {
  border: 2px dashed var(--border-default);
  cursor: pointer;
}

.feature-card.demo:hover {
  border-color: var(--primary-500);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-6);
  color: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-100);
  border-radius: 50%;
}

.feature-card.coming-soon .feature-icon {
  background-color: var(--bg-page);
  color: var(--text-secondary);
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
}

.feature-status {
  margin-top: var(--spacing-6);
}

.status-badge {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-2);
  font-size: 14px;
  font-weight: 500;
}

.status-badge.coming-soon {
  background-color: var(--warning);
  color: white;
}

.demo-controls {
  margin-top: var(--spacing-6);
}

/* Stats Section */
.test-stats {
  background-color: var(--bg-page);
  padding: var(--spacing-12);
  border-radius: var(--radius-3);
  margin-bottom: var(--spacing-8);
}

.test-stats h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-6);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-6);
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  border: 1px solid var(--border-default);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Demo Modal */
.demo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.demo-modal {
  background-color: var(--bg-surface);
  border-radius: var(--radius-3);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-default);
}

.demo-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.demo-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-2);
  transition: all 0.2s ease;
}

.demo-close:hover {
  background-color: var(--bg-page);
  color: var(--text-primary);
}

.demo-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

.demo-section {
  margin-bottom: var(--spacing-8);
}

.demo-section:last-child {
  margin-bottom: 0;
}

.demo-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--border-default);
}

.demo-buttons {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.demo-cards {
  display: flex;
  gap: var(--spacing-6);
  flex-wrap: wrap;
}

.demo-forms {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.demo-forms .form-group {
  max-width: 300px;
}

.animation-demo {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.animation-box {
  width: 60px;
  height: 60px;
  background-color: var(--primary-500);
  border-radius: var(--radius-3);
  transition: all 0.3s ease;
}

.animation-box.animate {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tests-header h1 {
    font-size: 36px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }
  
  .demo-buttons {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .demo-cards {
    flex-direction: column;
  }
  
  .animation-demo {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .demo-modal {
    margin: var(--spacing-2);
    max-height: 95vh;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .demo-header {
    padding: var(--spacing-4);
  }
  
  .demo-content {
    padding: var(--spacing-4);
  }
  
  .demo-modal-overlay {
    padding: var(--spacing-2);
  }
}
</style>