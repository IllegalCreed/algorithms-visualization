<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    locale?: 'zh-CN' | 'en';
  }>(),
  {
    locale: 'zh-CN',
  },
);

const privacyLink = computed(() =>
  props.locale === 'en'
    ? {
        href: 'https://illegalscreed.cn/privacy',
        label: 'Privacy',
      }
    : {
        href: 'https://illegalscreed.cn/zh/privacy',
        label: '隐私政策',
      },
);
</script>
<template>
  <footer id="footer">
    <span>MIT Licensed | Copyright © 2022-PRESENT Zhang Xu</span>
    <span aria-hidden="true">|</span>
    <a :href="privacyLink.href" target="_blank" rel="noopener noreferrer">
      {{ privacyLink.label }}
    </a>
  </footer>
</template>
<style scoped lang="less">
#footer {
  height: 100px;
  box-sizing: border-box;
  padding: 0 16px;
  gap: 8px;
  flex-wrap: wrap;
  text-align: center;
  .neumorphism-flat (5px, 0px);
  .center();

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
