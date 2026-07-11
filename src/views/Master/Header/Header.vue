<script setup lang="ts">
import { computed } from 'vue';
import { useIconLink } from './hooks';
import { useSystemStore } from '@/store/modules/system';
import IconLinkComp from './IconLink/IconLink.vue';
import { useSiteLocale } from '@/i18n/useSiteLocale';

const systemStore = useSystemStore();

const iconLinkData = useIconLink();
const { isEnglish, homeRoute, chineseRoute, englishRoute } = useSiteLocale();
const copy = computed(() =>
  isEnglish.value
    ? {
        siteName: 'Algorithm Visualizer',
        home: 'Home',
        search: 'Search algorithms (Cmd+K / Ctrl+K)',
        language: 'Choose language',
      }
    : {
        siteName: '算法可视化',
        home: '首页',
        search: '搜索算法（⌘K / Ctrl+K）',
        language: '选择语言',
      },
);
</script>

<template>
  <div id="header" :class="[systemStore.isShowHeaderShadow ? 'neumorphism-bottom-shadow' : null]">
    <div id="main">
      <RouterLink id="logo" :title="copy.home" :aria-label="copy.home" :to="homeRoute">
        <span>V</span>
      </RouterLink>
      <h1>{{ copy.siteName }}</h1>
      <button
        type="button"
        class="search-btn"
        :title="copy.search"
        :aria-label="copy.search"
        @click="systemStore.openSearch()"
      >
        <svg
          class="sb-icon"
          aria-hidden="true"
          focusable="false"
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
      <div class="blank"></div>

      <nav class="language-switch" :aria-label="copy.language">
        <RouterLink
          class="locale-option"
          :class="{ active: !isEnglish }"
          :aria-current="!isEnglish ? 'page' : undefined"
          :to="chineseRoute"
          >ZH</RouterLink
        >
        <RouterLink
          class="locale-option"
          :class="{ active: isEnglish }"
          :aria-current="isEnglish ? 'page' : undefined"
          :to="englishRoute"
          >EN</RouterLink
        >
      </nav>

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
      color: inherit;
      text-decoration: none;
      .center();
      .neumorphism-btn(5px, 10px);

      span {
        font-size: 35px;
        font-weight: bold;
      }
    }

    h1 {
      font-size: 30px;
      margin-left: 40px;
      white-space: nowrap;
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
      margin-left: 24px;
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

    .language-switch {
      display: flex;
      align-items: center;
      height: 36px;
      margin-right: 24px;
      padding: 3px;
      .neumorphism-concave(2px, 8px);

      .locale-option {
        width: 38px;
        height: 30px;
        color: #6b7d72;
        text-decoration: none;
        font-size: 12px;
        font-weight: bold;
        .center();
      }

      .locale-option.active {
        color: #1f5e3a;
        .neumorphism-pressed(2px, 6px);
      }
    }
  }
}
</style>
