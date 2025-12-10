<template>
  <span class="typewriter">
    <span> {{ displayText }} </span>
    
    <!-- <span class="cursor" :class="{ 'cursor--blink': cursorBlink }"></span> -->
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    required: true,
    default: () => []
  },
  typeSpeed: {
    type: Number,
    default: 100
  },
  deleteSpeed: {
    type: Number,
    default: 50
  },
  delayBetweenTexts: {
    type: Number,
    default: 2000
  },
  startDelay: {
    type: Number,
    default: 0
  },
  loop: {
    type: Boolean,
    default: true
  }
})

const displayText = ref('')
const currentTextIndex = ref(0)
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const cursorBlink = ref(true)
let timer = null

const type = () => {
  const currentText = props.texts[currentTextIndex.value]

  if (isDeleting.value) {
    displayText.value = currentText.substring(0, currentCharIndex.value - 1)
    currentCharIndex.value--
  } else {
    displayText.value = currentText.substring(0, currentCharIndex.value + 1)
    currentCharIndex.value++
  }

  let speed = isDeleting.value ? props.deleteSpeed : props.typeSpeed

  if (!isDeleting.value && currentCharIndex.value === currentText.length) {
    speed = props.delayBetweenTexts
    isDeleting.value = true
  } else if (isDeleting.value && currentCharIndex.value === 0) {
    isDeleting.value = false
    currentTextIndex.value++
    speed = 500

    if (currentTextIndex.value === props.texts.length) {
      if (props.loop) {
        currentTextIndex.value = 0
      } else {
        clearInterval(timer)
        cursorBlink.value = false
        return
      }
    }
  }

  timer = setTimeout(type, speed)
}

onMounted(() => {
  setTimeout(() => {
    type()
  }, props.startDelay)

  const cursorTimer = setInterval(() => {
    cursorBlink.value = !cursorBlink.value
  }, 500)

  onUnmounted(() => {
    clearInterval(cursorTimer)
  })
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped>
.typewriter {
  position: relative;
  display: inline-block;
  line-height: 1.5;  /* 确保统一的行高 */
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: rgba(255, 255, 255, 0.8);
  margin-left: 2px;
  animation: blink 1s infinite;
}

.cursor--blink {
  opacity: 0;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>
