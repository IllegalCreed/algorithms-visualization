<!-- src/components/CountView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { CountTrack } from '@/components/player/types';

const props = defineProps<{ count: CountTrack }>();

// 按「值」索引：桶 b 对应值 b+min，单元格堆叠数 = 计数（萝卜一个坑）
const bucketsView = computed(() =>
  props.count.buckets.map((c, b) => ({
    value: b + props.count.min,
    count: c,
    active: props.count.activeBucket === b,
  })),
);
</script>
<template>
  <div class="count-view row center">
    <div
      v-for="bucket in bucketsView"
      :key="bucket.value"
      class="count-bucket column center"
      :class="{ active: bucket.active }"
    >
      <span class="count-num">{{ bucket.count }}</span>
      <div class="count-pit">
        <div v-for="c in bucket.count" :key="c" class="count-cell"></div>
      </div>
      <span class="count-val">{{ bucket.value }}</span>
    </div>
  </div>
</template>
<style scoped lang="less">
.count-view {
  gap: 14px;
  align-items: flex-end;
  flex-wrap: wrap;
  min-height: 190px;
}
.count-bucket {
  gap: 6px;
}
.count-num {
  font-weight: bold;
  font-size: 15px;
  min-height: 20px;
  transition: color 0.3s ease;
}
/* 「坑」：内凹的桶容器，单元格从底向上堆叠 */
.count-pit {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  min-height: 150px;
  padding: 6px;
  gap: 4px;
  .neumorphism-pressed(3px, 10px);
}
/* 「萝卜」：一格 = 一次计数 */
.count-cell {
  width: 38px;
  height: 20px;
  background-color: #ff8a65;
  transition: background-color 0.3s ease;
  .neumorphism-flat(2px, 5px);
}
.count-val {
  font-weight: bold;
  font-size: 14px;
  width: 50px;
  text-align: center;
  padding: 4px 0;
  .neumorphism-flat(3px, 8px);
}
/* 活动桶：高亮环 + 文字变色 + 萝卜变亮 */
.count-bucket.active {
  .count-num,
  .count-val {
    color: @font-highlight-color;
  }
  .count-pit {
    box-shadow:
      0 0 0 3px @font-highlight-color,
      inset 3px 3px 6px @neumorphis-dark-shadow,
      inset -3px -3px 6px @neumorphis-light-shadow;
  }
  .count-cell {
    background-color: #ff7043;
  }
}
</style>
