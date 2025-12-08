<template>
  <div class="music-player" id="music-player"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';

// 音乐列表
const musicList = ref([
  {
    name: "China-Y",//歌名
		artist: '徐梦圆',//歌手
		url: 'https://music.163.com/#/song?id=1394167216',//音频文件地址
		cover: 'http://imge.kugou.com/stdmusic/150/20170815/20170815070007812976.jpg',//音乐封面地址
		lrc: ""// 歌词
  },
])

// 在组件挂载后初始化播放器
onMounted(() => {
  const option = {
    container: document.getElementById('music-player'),
    mini: false,
    autoplay: false,
    theme: '#FADFA3',
    loop: 'all',
    order: 'random',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false,
    listMaxHeight: 90,
    lrcType: 3,
    audio: musicList.value
  }
  const ap = new APlayer(option);
})
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

/* 响应式 - 在小屏幕上调整位置 */
@media (max-width: 768px) {
  .music-player {
    bottom: 70px;
    right: 10px;
    left: 10px;
  }
}
</style>
