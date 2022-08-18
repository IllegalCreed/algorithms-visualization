<script setup lang='ts'>
import CategoryComp from './Category/Category.vue';
import { useCategoryData } from './hooks';

const categoryData = useCategoryData();
</script>
<template>
  <CategoryComp v-for="item in categoryData" :key="item.title" :data="item">
  </CategoryComp>
</template>
<style scoped lang='less'>
</style>