<script setup lang="ts">
import { useIconLink } from './hooks';
import { useSystemStore } from '@/store/modules/system';
import { useRouter } from 'vue-router';
import IconLinkComp from './IconLink/IconLink.vue';

const systemStore = useSystemStore();

const iconLinkData = useIconLink();

const router = useRouter();
function goHomePage(): void {
  router.push({
    name: 'home',
  });
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

      <button class="search-btn" title="搜索算法（⌘K / Ctrl+K）" @click="systemStore.openSearch()">
        <svg
          class="sb-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span class="sb-kbd">⌘K</span>
      </button>

      <IconLinkComp v-for="item in iconLinkData" :key="item.title" :data="item" />
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

    .search-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 14px;
      margin-right: 30px;
      border: none;
      cursor: pointer;
      color: @font-color;
      .neumorphism-btn(3px, 10px);

      .sb-icon {
        width: 18px;
        height: 18px;
      }
      .sb-kbd {
        font-size: 12px;
        font-weight: bold;
        color: #8a978f;
      }
    }
  }
}
</style>
