<script setup lang="ts">
import { useIconLink } from './hooks';
import { useSystemStore } from '@/store/modules/system';
import { useRouter } from 'vue-router'
import IconLinkComp from './IconLink/IconLink.vue';

const systemStore = useSystemStore();

const iconLinkData = useIconLink();

const router = useRouter();
function goHomePage(): void {
  router.push({
    name: 'home',
  })
}
</script>

<template>
  <div id="header" :class="[systemStore.isShowHeaderShadow ? 'neumorphism-bottom-shadow' : null]">
    <div id="main">
      <div id="logo" title="首页" @click="goHomePage">
        <span>V</span>
      </div>
      <h1>算法可视化</h1>
      <div class="blank"></div>

      <IconLinkComp v-for="item in iconLinkData" :key="item.url" :data="item" />
    </div>
  </div>
</template>

<style scoped lang="less">
#header {
  width: 100vw;
  height: 100px;
  min-width: @screen-min-width;
  background-color: @neumorphis-background;
  .fixed-top();
  .center();
  transition: box-shadow 0.2s ease-in;

  #main {
    width: 100vw;
    max-width: @screen-max-width;
    min-width: @screen-min-width;
    padding: 10px 30px;
    .row-center();

    #logo {
      width: 50px;
      height: 50px;
      .center();
      .neumorphism-btn(5px, 10px);

      span {
        font-size: 35px;
        font-weight: bold;
      }
    }

    h1 {
      font-size: 30px;
      margin-left: 50px;
    }

    .icon-link:not(:last-child) {
      margin-right: 30px;
    }
  }
}
</style>