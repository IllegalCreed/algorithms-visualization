<script setup lang='ts'>
import type { Category } from '../types';
import ItemComp from './Item/Item.vue'

const props = defineProps<{
  data: Category
}>();
</script>
<template>
  <div class="header">
    <span class="title">{{ props.data.title }}</span>
    <ItemComp v-for="item in props.data.children" :key="item.title" :data="item"></ItemComp>
  </div>
</template>
<style scoped lang='less'>
.header {
  &:not(:first-child) {
    margin-top: 30px;
  }

  .title {
    padding: 8px 20px;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    .column();
    .neumorphism-flat(5px, 10px);
  }
}
</style>
