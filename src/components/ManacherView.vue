<!-- src/components/ManacherView.vue —— 回文轨（Manacher 转换串 + 半径数组 + 中心/镜像/最右回文带/最长回文；C-067） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { ManacherTrack } from '@/components/player/types';

const props = defineProps<{ manacher: ManacherTrack }>();

const sCells = computed(() => {
  const m = props.manacher;
  const inBox = (idx: number) => m.boxL != null && m.boxR != null && idx >= m.boxL && idx <= m.boxR;
  const inBest = (idx: number) => m.best != null && idx >= m.best[0] && idx <= m.best[1];
  return m.s.split('').map((ch, idx) => ({
    ch,
    idx,
    center: m.center === idx,
    mirror: m.mirror === idx,
    box: inBox(idx),
    best: inBest(idx),
  }));
});
const pCells = computed(() =>
  props.manacher.p.map((v, idx) => ({
    v: v == null ? '' : String(v),
    idx,
    active: props.manacher.center === idx,
  })),
);

const statusText = computed(() => {
  switch (props.manacher.status) {
    case 'mirror':
      return '🪞 镜像复用';
    case 'expand':
      return '↔ 中心扩展';
    case 'done':
      return '🎯 完成';
    default:
      return '';
  }
});
</script>

<template>
  <div class="mn-view column center">
    <div class="mn-status" :class="'st-' + (manacher.status ?? 'none')">{{ statusText }}</div>
    <div class="mn-row">
      <span class="mn-label">S</span>
      <div class="mn-cells">
        <div
          v-for="c in sCells"
          :key="'s' + c.idx"
          class="mn-cell mn-s-cell center"
          :class="{
            'mn-box': c.box,
            'mn-best': c.best,
            'mn-center': c.center,
            'mn-mirror': c.mirror,
          }"
        >
          {{ c.ch }}
        </div>
      </div>
    </div>
    <div class="mn-row">
      <span class="mn-label">p</span>
      <div class="mn-cells">
        <div
          v-for="c in pCells"
          :key="'p' + c.idx"
          class="mn-cell mn-p-cell center"
          :class="{ 'mn-p-active': c.active }"
        >
          {{ c.v }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.mn-view {
  width: 100%;
  padding: 14px;
  gap: 8px;
  overflow-x: auto;
}
.mn-status {
  height: 24px;
  font-weight: bold;
  font-size: 15px;
}
.mn-status.st-mirror {
  color: #1565c0;
}
.mn-status.st-expand {
  color: #f0a000;
}
.mn-status.st-done {
  color: #1f5e3a;
}
.mn-row {
  display: flex;
  align-items: center;
}
.mn-label {
  width: 26px;
  font-weight: bold;
  font-size: 15px;
  color: @font-highlight-color;
  flex-shrink: 0;
}
.mn-cells {
  display: flex;
  gap: 6px;
}
.mn-cell {
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
/* 半径行：小一点、淡一点 */
.mn-p-cell {
  height: 30px;
  font-size: 14px;
  color: #6b7d72;
  background-color: #f3f6f4;
}
/* 当前最右回文带 [L,R]：浅蓝底 */
.mn-cell.mn-box {
  background-color: #d7e6f2;
}
/* 最长回文：浅绿底（覆盖回文带） */
.mn-cell.mn-best {
  background-color: #cfe9d6;
  color: #1f5e3a;
}
/* 当前中心 i：琥珀环 */
.mn-cell.mn-center {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
}
/* 镜像点 2C-i：蓝环 */
.mn-cell.mn-mirror {
  box-shadow: 0 0 0 3px #1565c0;
}
/* 当前中心对应的半径格：琥珀底 */
.mn-cell.mn-p-active {
  background-color: #ffe6a8;
  color: #7a5a00;
}
</style>
