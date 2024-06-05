<script setup lang='ts'>
import type { Item } from '../../types';
import { useRouter } from 'vue-router';

const props = defineProps<{
  data: Item
}>();

const router = useRouter();

function goDocs(): void {
  router.push({
    name: props.data.url,
  })
}
</script>
<template>
  <div class="item" @click="goDocs">
    <img :src="props.data.icon" />

    <h3>{{ props.data.title }}</h3>
    <span>{{ props.data.desc }}</span>
  </div>
</template>
<style scoped lang='less'>
.item {
  width: 280px;
  padding: 30px;
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