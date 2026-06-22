<!-- src/components/BarsView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { Pointer, StepEmphasis } from '@/components/player/types';
import ArrowTrackComp from './ArrowTrack.vue';
import BarComp from './Bar.vue';

const props = withDefaults(
  defineProps<{
    array: [string, number][];
    pointers: Pointer[];
    emphasis: StepEmphasis;
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const min = computed(() => Math.min(...props.array.map((t) => t[1])));
const max = computed(() => Math.max(...props.array.map((t) => t[1])));

// 指针轨道与柱子行同宽，保证二者左原点重合，箭头才能对齐到对应柱子
const vizWidth = computed(() => props.array.length * props.slotWidth);

function percent(v: number): number {
  const span = max.value - min.value;
  if (span === 0) return 1;
  return 0.08 + 0.92 * ((v - min.value) / span); // 最小值给 0.08 基准，避免看不见
}

function stateOf(index: number): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' {
  const e = props.emphasis;
  if (e.keyIndex === index) return 'key'; // key 压过一切（含 sorted）：滑入已排序区也保持玫红
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min'; // min 压过 comparing
  if (inCompare) return 'comparing'; // 另一根（j）才是 comparing 黄
  return 'idle';
}
</script>
<template>
  <div class="bars-view column center">
    <TransitionGroup name="bars" tag="div" class="row bars">
      <BarComp
        v-for="(item, index) in props.array"
        :key="item[0]"
        :value="item[1]"
        :percent="percent(item[1])"
        :state="stateOf(index)"
        :style="{ width: props.slotWidth + 'px' }"
      />
    </TransitionGroup>
    <ArrowTrackComp
      :data="props.pointers"
      :slot-width="props.slotWidth"
      :style="{ width: vizWidth + 'px' }"
    />
  </div>
</template>
<style scoped lang="less">
.bars {
  align-items: flex-end;
  min-height: 180px;
}
/* FLIP：交换时柱子平滑移动 */
.bars-move {
  transition: transform 0.4s ease;
}
</style>
