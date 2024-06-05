<script setup lang='ts'>
import type { Category } from '../types';
import ItemComp from './Item/Item.vue';

const props = defineProps<{
  data: Category
}>();

</script>
<template>
  <div class="category">
    <h2>{{ props.data.title }}</h2>
    <span>{{ props.data.desc }}</span>
  </div>

  <div class="item-container">
    <ItemComp v-for="item in props.data.children" :key="item.title" :data="item"></ItemComp>
  </div>
</template>
<style scoped lang='less'>
.category {
  margin-bottom: 50px;
  .column();
  .center();

  h2 {
    margin-block-end: 10px;
  }
}

.item-container {
  margin-bottom: 100px;
  padding: 30px;
  width: 100%;
  max-width: @screen-max-width;
  min-width: @screen-min-width;
  align-self: center;
  justify-content: center;
  .row-wrap();


  .item {
    margin: 15px 20px;
  }
}
</style>