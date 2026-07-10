<script setup lang="ts">
import type { Item } from '../../types';

const props = defineProps<{
  data: Item;
}>();
</script>
<template>
  <RouterLink class="item" :to="{ name: props.data.url }">
    <img :src="props.data.icon" :alt="props.data.title" />

    <h3>{{ props.data.title }}</h3>
    <span>{{ props.data.desc }}</span>
  </RouterLink>
</template>
<style scoped lang="less">
.item {
  width: 280px;
  padding: 30px;
  color: inherit;
  text-decoration: none;
  .column-center();
  .neumorphism-btn(4px, 10px);

  img {
    width: 60px;
    height: 60px;
    padding: 10px;
    .neumorphism-pressed(4px, 50%);
  }

  span {
    font-weight: lighter;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
