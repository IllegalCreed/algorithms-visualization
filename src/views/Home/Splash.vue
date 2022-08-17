<script setup lang='ts'>
import { useRouter } from 'vue-router'

const router = useRouter();
function goDocsPage(): void {
  router.push({
    name: 'docs',
  })
}
</script>
<template>
  <div class="splash">
    <h1>可视化的</h1>
    <h2>数据结构与算法</h2>
    <span>使用Vue3 + Vite + TypeScript + Pinia编写</span>
    <div id="start-btn" @click="goDocsPage">
      开始学习
    </div>
  </div>
</template>
<style scoped lang='less'>
@import "../../styles/common.less";

.splash {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: 60px;
    margin-block-start: 10px;
    margin-block-end: 0px;
    text-align: center;
    background-image: linear-gradient(315deg, #42d392 25%, #647eff);
    -webkit-background-clip: text;
    color: transparent;
  }

  h2 {
    font-size: 80px;
    margin-block-start: 10px;
    margin-block-end: 20px;
    text-align: center;
  }

  span {
    font-size: 25px;
    margin-bottom: 50px;
    font-weight: lighter;
    text-align: center;
  }

  #start-btn {
    padding: 15px 30px;
    font-size: 20px;
    .neumorphism-btn(3px, 10px);
  }
}
</style>
