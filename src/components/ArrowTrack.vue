<script setup lang="ts">
import type { Pointer } from '@/types/types';
import { useSystemStore } from '@/store/modules/system';
import ArrowComp from './Arrow.vue';

const props = withDefaults(
  defineProps<{
    data: Array<Pointer>;
    slotWidth?: number;
    slotCount?: number;
  }>(),
  { slotWidth: 60 },
);

function arrowStyle(index: number): Record<string, string> {
  if (props.slotCount && props.slotCount > 0) {
    return {
      width: `calc(100% / ${props.slotCount})`,
      transform: `translateX(${index * 100}%)`,
    };
  }
  return { transform: `translateX(${index * props.slotWidth}px)` };
}

const colors = useSystemStore().colors;
</script>
<template>
  <div class="track">
    <ArrowComp
      class="arrow"
      v-for="item in props.data"
      :key="item.id"
      :color="colors[Number(item.id)]"
      :style="arrowStyle(item.index)"
    ></ArrowComp>
  </div>
</template>
<style scoped lang="less">
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
