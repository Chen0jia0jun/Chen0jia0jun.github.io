<template>
  <div class="about-page">
    <div class="container">
      <!-- Page Header -->
      <header class="page-header">
        <div class="avatar-wrapper">
          <img src="/avatar.jpg" alt="头像" class="avatar-image" />
        </div>
        <p class="page-subtitle">Hello,world</p>
      </header>

      <!-- Main Content -->
      <div class="about-content">
        <!-- Personal Introduction -->
        <section>
          <div class="section-header">
            <h2 class="section-title">
              Introduce
            </h2>
          </div>
          <ul class="about-list">
            <li
              v-for="(item, index) in introduce"
              :key="index"
              class="about-item"
              :class="{ 'strikethrough': item === '土木老哥' }"
            >
              {{ item }}
            </li>
          </ul>
        </section>

        <!-- Spiritual Mentors -->
        <section>
          <div class="section-header">
            <h2 class="section-title">
              spiritFriends
            </h2>
          </div>
          <div class="mentors-grid">
            <div v-for="(mentor, index) in spiritFriend" :key="index" class="mentor-card">
              <div class="mentor-image">
                <img :src="mentor.image || '/default-avatar.png'" :alt="mentor.name" />
              </div>
              <div class="mentor-info">
                <h3 class="mentor-name">{{ mentor.name }}</h3>
                <p class="mentor-description">{{ mentor.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Life Bucket List -->
        <section>
          <div class="section-header">
            <h2 class="section-title">
              LifeLists
            </h2>
          </div>
          <div class="bucket-list">
            <div v-for="(item, index) in lifeList" :key="index" class="bucket-item">
              <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ item }}
            </div>
          </div>
        </section>

        <!-- Annual Goals -->
        <section>
          <div class="section-header">
            <h2 class="section-title">
              YearGoal
            </h2>
          </div>
          <div class="goals-grid">
            <div v-for="(goal, index) in yearGoal" :key="index" class="goal-card">
              <div class="goal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="goal-content">
                <div class="goal-text">{{ goal }}</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 0%"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入图片资源
import stsImage from '@/assets/photos/sts.png'
import jmImage from '@/assets/photos/jm.png'
import adlImage from '@/assets/photos/adl.png'
import kdlImage from '@/assets/photos/kdl.png'
import kwdsImage from '@/assets/photos/kwds.png'

const spiritFriend = [
    {
        name: '史铁生',
        image: stsImage,
        url: '',
        description: '著名作家，作品《我与地坛》'
    },
    {
        name: '加缪',
        image: jmImage,
        url: '',
        description: '存在主义哲学家'
    },
    {
        name: '阿尔弗雷德·阿德勒',
        image: adlImage,
        url: '',
        description: '个体心理学创始人'
    },
    {
        name: '米兰·昆德拉',
        image: kdlImage,
        url: '',
        description: '捷克作家，《不能承受的生命之轻》'
    },
    {
        name: '卡文迪什',
        image: kwdsImage,
        url: '',
        description: '环法传奇车手'
    }
];

const lifeList = [
    "跑全马",
    "到拉萨",
    "出国旅游",
    "露营看日出",
    "蹦极",
    "滑雪",
    "安排父母旅游",
    // "学习潜水",
    // "攀岩",
    // "写一本书"
];

const yearGoal = [
    "学会吉他",
    "提升摄影技术",
    "学会rust",
    "练好字",
    "坚持健身"
];

const introduce = [
    "土木老哥",
    "业余摄影",
    "心理学爱好者",
];
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: var(--spacing-8) 0;
  background: linear-gradient(135deg, var(--bg-page) 0%, var(--bg-surface) 100%);
  width: 75%;
  margin: var(--spacing-12) auto;
  border-radius: var(--radius-3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: var(--spacing-12);
}

.avatar-wrapper {
  margin: 0 auto var(--spacing-8);
  width: 150px;
  height: 150px;
  position: relative;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-500);
  box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.3);
  transition: all 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 48px rgba(var(--primary-rgb), 0.4);
}

.page-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
}

/* About Content */
.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
}

.section-header {
  margin-bottom: var(--spacing-8);
  padding-bottom: var(--spacing-4);
  border-bottom: 2px solid var(--border-default);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.section-title svg {
  color: var(--primary-500);
}

/* Personal About List */
.about-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.about-item {
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--bg-page);
  border-radius: var(--radius-2);
  font-size: 18px;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  margin-bottom: var(--spacing-3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.about-item::before {
  content: '▹';
  color: var(--primary-500);
  font-size: 20px;
  font-weight: bold;
}

.about-item:hover {
  background-color: var(--primary-100);
  border-color: var(--primary-300);
  transform: translateX(5px);
}

.about-item.strikethrough {
  opacity: 0.6;
}

.about-item.strikethrough::after {
  content: '';
  position: absolute;
  left: var(--spacing-6);
  right: var(--spacing-6);
  top: 50%;
  height: 2px;
  background-color: var(--text-secondary);
}

.about-item.strikethrough {
  text-decoration: line-through;
  color: var(--text-secondary);
  position: relative;
}

/* Spiritual Mentors */
.mentors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-6);
}

.mentor-card {
  background-color: var(--bg-page);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-default);
}

.mentor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-300);
}

.mentor-image {
  width: 100px;
  height: 100px;
  margin: 0 auto var(--spacing-4);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-300);
}

.mentor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mentor-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.mentor-description {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Bucket List */
.bucket-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-4);
}

.bucket-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background-color: var(--bg-page);
  border-radius: var(--radius-2);
  font-size: 16px;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  transition: all 0.3s ease;
}

.bucket-item:hover {
  background-color: var(--primary-100);
  border-color: var(--primary-300);
  transform: translateX(5px);
}

.check-icon {
  color: var(--primary-500);
  flex-shrink: 0;
}

/* Annual Goals */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.goal-card {
  background-color: var(--bg-page);
  border-radius: var(--radius-3);
  padding: var(--spacing-6);
  border: 1px solid var(--border-default);
  transition: all 0.3s ease;
}

.goal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-300);
}

.goal-icon {
  color: var(--primary-500);
  margin-bottom: var(--spacing-4);
}

.goal-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-surface);
  border-radius: var(--radius-1);
  overflow: hidden;
  border: 1px solid var(--border-default);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
  border-radius: var(--radius-1);
  transition: width 0.5s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .avatar-wrapper {
    width: 120px;
    height: 120px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .mentors-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-4);
  }

  .bucket-list {
    grid-template-columns: 1fr;
  }

  .goals-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 var(--spacing-4);
  }

  .avatar-wrapper {
    width: 100px;
    height: 100px;
  }

  .mentors-grid {
    grid-template-columns: 1fr;
  }
}
</style>