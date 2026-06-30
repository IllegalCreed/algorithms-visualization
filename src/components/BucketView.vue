<!-- src/components/BucketView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { BucketTrack } from '@/components/player/types';

const props = defineProps<{ bucket: BucketTrack }>();

// 每桶：实际元素列表（分配后乱序 / 桶内排序后有序 / 合并时递减）+ 值域标签 + 活动高亮
const bucketsView = computed(() =>
  props.bucket.buckets.map((items, b) => ({
    items,
    range: props.bucket.ranges[b],
    active: props.bucket.activeBucket === b,
  })),
);
</script>
<template>
  <div class="bucket-view row center">
    <div
      v-for="(bk, b) in bucketsView"
      :key="b"
      class="bucket-col column center"
      :class="{ active: bk.active }"
    >
      <div class="bucket-pit column">
        <div v-for="(v, i) in bk.items" :key="i" class="bucket-cell">{{ v }}</div>
      </div>
      <span class="bucket-range">{{ bk.range[0] }}–{{ bk.range[1] }}</span>
    </div>
  </div>
</template>
<style scoped lang="less">
.bucket-view {
  gap: 14px;
  align-items: flex-end;
  flex-wrap: wrap;
  min-height: 200px;
}
.bucket-col {
  gap: 8px;
}
/* 「桶」：内凹容器，元素自上而下排列 */
.bucket-pit {
  align-items: center;
  justify-content: flex-end;
  width: 50px;
  min-height: 160px;
  padding: 6px;
  gap: 4px;
  .neumorphism-pressed(3px, 10px);
}
/* 一格 = 一个实际元素（显数值） */
.bucket-cell {
  width: 38px;
  height: 26px;
  .center();
  font-weight: bold;
  font-size: 13px;
  color: @font-color;
  background-color: #64b5f6;
  transition: background-color 0.3s ease;
  .neumorphism-flat(2px, 5px);
}
.bucket-range {
  font-weight: bold;
  font-size: 13px;
  width: 50px;
  text-align: center;
  padding: 4px 0;
  .neumorphism-flat(3px, 8px);
}
/* 活动桶：高亮环 + 标签变色 + 元素变亮 */
.bucket-col.active {
  .bucket-range {
    color: @font-highlight-color;
  }
  .bucket-pit {
    box-shadow:
      0 0 0 3px @font-highlight-color,
      inset 3px 3px 6px @neumorphis-dark-shadow,
      inset -3px -3px 6px @neumorphis-light-shadow;
  }
  .bucket-cell {
    background-color: #2196f3;
  }
}
</style>
