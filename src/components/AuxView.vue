<!-- src/components/AuxView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { AuxTrack } from '@/components/player/types';
import ArrowTrackComp from './ArrowTrack.vue';
import BarComp from './Bar.vue';

const props = withDefaults(
  defineProps<{
    aux: AuxTrack;
    mainArray: [string, number][]; // 用主轨 min/max 算 percent，两轨同尺度可比
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const min = computed(() => Math.min(...props.mainArray.map((t) => t[1])));
const max = computed(() => Math.max(...props.mainArray.map((t) => t[1])));
const vizWidth = computed(() => props.aux.array.length * props.slotWidth);
const filledSet = computed(() => new Set(props.aux.filled));
const pointers = computed(() =>
  props.aux.pointer === undefined ? [] : [{ id: '2', index: props.aux.pointer }],
);

function percent(v: number): number {
  const span = max.value - min.value;
  if (span === 0) return 1;
  return 0.08 + 0.92 * ((v - min.value) / span);
}
function stateOf(index: number): 'sorted' | 'empty' {
  return filledSet.value.has(index) ? 'sorted' : 'empty';
}
</script>
<template>
  <div class="aux-view column center">
    <div class="row bars">
      <BarComp
        v-for="(item, index) in props.aux.array"
        :key="item[0]"
        :value="item[1]"
        :percent="stateOf(index) === 'empty' ? 0 : percent(item[1])"
        :state="stateOf(index)"
        :style="{ width: props.slotWidth + 'px' }"
      />
    </div>
    <ArrowTrackComp
      :data="pointers"
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
</style>
