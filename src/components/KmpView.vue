<!-- src/components/KmpView.vue —— 字符串匹配轨（KMP 文本+模式对齐滑动 + LPS；为 Rabin-Karp/BM 铺路） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { KmpTrack } from '@/components/player/types';

const props = defineProps<{ kmp: KmpTrack }>();

const PITCH = 48; // 42 格宽 + 6 间隙

const textCells = computed(() => {
  const k = props.kmp;
  const m = k.pattern.length;
  const inFound = (idx: number) => k.found.some((s) => idx >= s && idx < s + m);
  const inWindow = (idx: number) =>
    k.windowStart != null && idx >= k.windowStart && idx < k.windowStart + m;
  return k.text.split('').map((ch, idx) => ({
    ch,
    idx,
    compare: k.compareText === idx,
    found: inFound(idx),
    window: inWindow(idx),
  }));
});
const patCells = computed(() => {
  const k = props.kmp;
  // 前缀 [0,matchedLen)（KMP/RK）或后缀 [matchedFrom,m)（Boyer-Moore）标绿
  const matched = (idx: number) =>
    idx < k.matchedLen || (k.matchedFrom != null && idx >= k.matchedFrom);
  return k.pattern.split('').map((ch, idx) => ({
    ch,
    idx,
    compare: k.comparePat === idx,
    matched: matched(idx),
  }));
});
const lpsCells = computed(() =>
  props.kmp.lps.map((v, idx) => ({ v, idx, active: props.kmp.lpsActive === idx })),
);
const shift = computed(() => props.kmp.offset * PITCH);

const statusText = computed(() => {
  switch (props.kmp.status) {
    case 'match':
      return '✓ 匹配';
    case 'mismatch':
      return '✗ 失配';
    case 'found':
      return '🎯 命中';
    default:
      return '';
  }
});
</script>

<template>
  <div class="kmp-view column center">
    <div class="kmp-status" :class="'st-' + (kmp.status ?? 'none')">{{ statusText }}</div>
    <div class="kmp-row">
      <span class="kmp-label">T</span>
      <div class="kmp-cells">
        <div
          v-for="c in textCells"
          :key="'t' + c.idx"
          class="kmp-cell kmp-text-cell center"
          :class="{ 'kmp-compare': c.compare, 'kmp-found': c.found, 'kmp-window': c.window }"
        >
          {{ c.ch }}
        </div>
      </div>
    </div>
    <div class="kmp-row">
      <span class="kmp-label">P</span>
      <div class="kmp-cells" :style="{ marginLeft: shift + 'px' }">
        <div
          v-for="c in patCells"
          :key="'p' + c.idx"
          class="kmp-cell kmp-pat-cell center"
          :class="{ 'kmp-compare': c.compare, 'kmp-matched': c.matched }"
        >
          {{ c.ch }}
        </div>
      </div>
    </div>
    <div v-if="kmp.lps.length" class="kmp-row">
      <span class="kmp-label">π</span>
      <div class="kmp-cells" :style="{ marginLeft: shift + 'px' }">
        <div
          v-for="c in lpsCells"
          :key="'l' + c.idx"
          class="kmp-cell kmp-lps-cell center"
          :class="{ 'kmp-lps-active': c.active }"
        >
          {{ c.v }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.kmp-view {
  width: 100%;
  padding: 14px;
  gap: 8px;
  overflow-x: auto;
}
.kmp-status {
  height: 24px;
  font-weight: bold;
  font-size: 15px;
}
.kmp-status.st-match {
  color: #2e7d32;
}
.kmp-status.st-mismatch {
  color: #b3402f;
}
.kmp-status.st-found {
  color: #1f5e3a;
}
.kmp-row {
  display: flex;
  align-items: center;
}
.kmp-label {
  width: 26px;
  font-weight: bold;
  font-size: 15px;
  color: @font-highlight-color;
  flex-shrink: 0;
}
.kmp-cells {
  display: flex;
  gap: 6px;
}
.kmp-cell {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 6px;
  font-weight: bold;
  font-size: 18px;
  color: @font-color;
  background-color: #eef3ef;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}
/* LPS 行：小一点、淡一点 */
.kmp-lps-cell {
  height: 30px;
  font-size: 14px;
  color: #6b7d72;
  background-color: #f3f6f4;
}
/* 已匹配前缀：绿 */
.kmp-cell.kmp-matched {
  background-color: #8bd3a0;
  color: #1f5e3a;
}
/* 当前窗口带（Rabin-Karp）：浅蓝底 */
.kmp-cell.kmp-window {
  background-color: #d7e6f2;
}
/* 命中区间：浅绿底（覆盖窗口带） */
.kmp-cell.kmp-found {
  background-color: #cfe9d6;
  color: #1f5e3a;
}
/* 当前比较：琥珀环 */
.kmp-cell.kmp-compare {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
}
/* 跳转用到的 LPS 格：琥珀底 */
.kmp-cell.kmp-lps-active {
  background-color: #ffe6a8;
  color: #7a5a00;
}
</style>
