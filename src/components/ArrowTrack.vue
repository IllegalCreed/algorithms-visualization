<script setup lang='ts'>
import type { Pointer } from '@/types/types';
import { useSystemStore } from '@/store/modules/system';
import ArrowComp from './Arrow.vue';

const props = defineProps<{
  data: Array<Pointer>
}>();

function genOffect(index: number): number {
  return index * 60;
}

const colors = useSystemStore().colors;
</script>
<template>
  <div class="track">
    <ArrowComp class="arrow" v-for="item in props.data" :key="item.id" :color="colors[Number(item.id)]"
      :style="{ 'transform': 'translateX(' + genOffect(item.index) + 'px)' }"></ArrowComp>
  </div>
</template>
<style scoped lang='less'>
.track {
  height: 50px;
  position: relative;

  .arrow {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>