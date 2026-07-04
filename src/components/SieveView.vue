<!-- src/components/SieveView.vue —— 数字网格轨（埃氏筛；数学与数论大类首发，第 16 轨 C-077） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { SieveTrack } from '@/components/player/types';

const props = defineProps<{ sieve: SieveTrack }>();

// 1..n 逐格：数字 + 状态
const cells = computed(() => {
  const s = props.sieve;
  const marking = new Set(s.marking ?? []);
  const list: { v: number; state: string; current: boolean; marking: boolean }[] = [];
  for (let v = 1; v <= s.n; v++) {
    list.push({
      v,
      state: s.states[v] ?? 'unknown',
      current: s.current === v,
      marking: marking.has(v),
    });
  }
  return list;
});
</script>

<template>
  <div class="sieve-view center">
    <div class="sieve-grid" :style="{ '--cols': sieve.cols }">
      <div
        v-for="cell in cells"
        :key="cell.v"
        class="sieve-cell center"
        :class="[
          `sieve-${cell.state}`,
          { 'sieve-current': cell.current, 'sieve-marking': cell.marking },
        ]"
      >
        {{ cell.v }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.sieve-view {
  width: 100%;
  padding: 14px;
  min-height: 200px;
}
.sieve-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 46px);
  gap: 6px;
  padding: 10px;
  border-radius: 12px;
  .neumorphism-pressed(4px, 12px);
}
.sieve-cell {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  color: @font-color;
  background-color: #eef3ef; /* unknown 中性 */
  transition:
    background-color 0.25s,
    box-shadow 0.25s,
    color 0.25s;
  user-select: none;
}
/* 1：既非素也非合，淡灰 */
.sieve-cell.sieve-special {
  background-color: #dfe5e0;
  color: #9aa8a0;
}
/* 素数：绿 */
.sieve-cell.sieve-prime {
  background-color: #8bd3a0;
  color: #1f5e3a;
}
/* 合数：灰 + 划掉 */
.sieve-cell.sieve-composite {
  background-color: #cdd8d0;
  color: #8a978d;
  text-decoration: line-through;
}
/* 本步正在划掉的倍数：红 */
.sieve-cell.sieve-marking {
  background-color: #e58a8a;
  color: #7a1f1f;
  text-decoration: none;
}
/* 当前素数 p：琥珀环 */
.sieve-cell.sieve-current {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
}
</style>
