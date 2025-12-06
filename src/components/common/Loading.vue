<!-- https://zhuanlan.zhihu.com/p/692168492 -->
<!-- https://codepen.io/nazarelen/pen/GjKdVM -->
<template>
<div class="loader">
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <div class="wineglass left">
    <div class="top"></div>
  </div>
  
  <div class="wineglass right">
    <div class="top"></div>
  </div>
</div>
</template>

<script setup>
console.log("Loading component loaded");
</script>

<style scoped>
.loader {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #C4D9EB;
  /* 脱离文档流覆盖全屏 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--max-zindex);
}
.wineglass {
  height: 36px;
  position: relative;
}
.wineglass:after {
  content: ''; 
  position: absolute;
  top: 47px;
  left: 5px;
  width: 20px;
  height: 5px;
  background: white;
  box-shadow: 0 0 1px white;
}
.top {
  background: white;
  width: 30px;
  height: 36px;
  border-radius: 0 0 36px 36px;
  box-shadow: 0 0 1px white;
}
.top:before {
  content: ''; 
  position: absolute;
  left: 4px;
  bottom: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(transparent 50%, #F36E3E 50%);
}
.left .top:before {
  animation: rotate2 2s linear infinite;
}
.right .top:before {
  animation: rotate1 2s linear infinite;
}
.top:after {
  content: ''; 
  position: absolute;
  top: 35px;
  left: 12px;
  width: 6px;
  height: 13px;
  background: white;
  box-shadow: 0 0 1px white;
}
.left {
  display: inline-block;
  margin-right: 10px;
  animation: rotate1 2s cubic-bezier(.39,1.52,.46,.92) infinite;
}
.right {
  display: inline-block;
  animation: rotate2 2s cubic-bezier(.39,1.52,.46,.92) infinite;
}
@keyframes rotate1{
  0% {transform: rotate(0deg);}
  50% {transform:rotate(22deg);}
}
@keyframes rotate2{
  0% {transform:rotate(0deg);}
  50% {transform:rotate(-22deg);}
}
ul {
  list-style: none;
  bottom: 5%;
  padding: 0;
  height: 25px;
  position: relative;
  opacity: 0;
  animation: 2s fadeInUp infinite linear 2s;
}
li {
  width: 6px;
  height: 15px;
  background: white;
  position: absolute;
  box-shadow: 0 0 1px white;
  transform-origin: bottom;
}
li:nth-child(1) {
  left: 26px;
  bottom: 5px;
  transform: rotate(-35deg);
}
li:nth-child(2) {
  left: 34px;
  bottom: 8px;
}
li:nth-child(3) {
  left: 42px;
  bottom: 5px;
  transform: rotate(35deg);
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: scaleY(1);
  }
  
  33% {
    opacity: 1;
    transform: scaleY(1.4);
  }
  64% {
     opacity: .1;
     transform: scaleY(1);
  }
  100% { 
    opacity: 0;
    transform: scaleY(.3);
  }
}
</style>