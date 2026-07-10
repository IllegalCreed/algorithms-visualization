<script setup lang="ts">
import { computed } from 'vue';
import HeaderComp from './Header/Header.vue';
import { useCategoryData, useEnglishCategoryData, useMenuSelect } from './hooks';
import { useSiteLocale } from '@/i18n/useSiteLocale';

const { isEnglish } = useSiteLocale();
const categoryData = computed(() =>
  isEnglish.value ? useEnglishCategoryData() : useCategoryData(),
);
useMenuSelect();
</script>
<template>
  <div id="menu">
    <HeaderComp v-for="item in categoryData" :key="item.title" :data="item"></HeaderComp>
  </div>
</template>
<style scoped lang="less">
#menu {
  padding: 30px;
}
</style>
