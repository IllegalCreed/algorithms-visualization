<!-- src/components/SuffixArrayView.vue —— 后缀数组轨（原串 + 后缀表逐轮细化；倍增法 C-072） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { SuffixArrayTrack } from '@/components/player/types';

const props = defineProps<{ suffixArray: SuffixArrayTrack }>();

const strCells = computed(() => props.suffixArray.s.split('').map((ch, idx) => ({ ch, idx })));

const isLcp = computed(() => props.suffixArray.lcp != null); // LCP 模式（C-073）

const rows = computed(() => {
  const t = props.suffixArray;
  const n = t.s.length;
  return t.order.map((i, row) => ({
    row,
    i,
    suffix: t.s.slice(i),
    rank: t.rank[i],
    k1: t.rank[i],
    k2: i + t.k < n ? t.rank[i + t.k] : -1, // -1 = ∞（越界）
    lcp: t.lcp ? t.lcp[row] : null,
    current: t.current === row,
    compare: t.compareRow === row,
  }));
});
const kNum = (v: number) => (v < 0 ? '∞' : String(v));
</script>

<template>
  <div class="suffix-array-view column center">
    <div class="sa-str">
      <div v-for="c in strCells" :key="'s' + c.idx" class="sa-str-cell center">
        <span class="sa-str-ch">{{ c.ch }}</span>
        <span class="sa-str-idx">{{ c.idx }}</span>
      </div>
    </div>
    <div class="sa-badge">
      {{ isLcp ? 'LCP：相邻后缀最长公共前缀（Kasai）' : '倍增长度 k = ' + suffixArray.k }}
    </div>
    <div class="sa-table">
      <div class="sa-head">
        <span class="sa-col">起点</span>
        <span class="sa-col sa-suffix">后缀</span>
        <span class="sa-col">rank</span>
        <span v-if="isLcp" class="sa-col">LCP↑</span>
        <span v-else class="sa-col">关键字 (前, 后)</span>
      </div>
      <div
        v-for="r in rows"
        :key="'r' + r.i"
        class="sa-row"
        :class="{ 'sa-current': r.current, 'sa-compare': r.compare }"
      >
        <span class="sa-col sa-index">{{ r.i }}</span>
        <span class="sa-col sa-suffix">{{ r.suffix }}</span>
        <span class="sa-col sa-rank" :class="{ 'sa-rank-active': suffixArray.phase === 'rank' }">{{
          r.rank
        }}</span>
        <span v-if="isLcp" class="sa-col sa-lcp">{{
          r.row === 0 ? '-' : r.lcp == null ? '' : r.lcp
        }}</span>
        <span
          v-else
          class="sa-col sa-key"
          :class="{ 'sa-key-active': suffixArray.phase === 'sort' }"
          >({{ kNum(r.k1) }}, {{ kNum(r.k2) }})</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.suffix-array-view {
  width: 100%;
  padding: 14px;
  gap: 8px;
  overflow-x: auto;
}
.sa-str {
  display: flex;
  gap: 4px;
}
.sa-str-cell {
  flex-direction: column;
  width: 34px;
}
.sa-str-ch {
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 18px;
  color: @font-color;
  background-color: #eef3ef;
}
.sa-str-idx {
  font-size: 12px;
  color: #8a9a90;
}
.sa-badge {
  font-weight: bold;
  font-size: 14px;
  color: @font-highlight-color;
}
.sa-table {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 320px;
}
.sa-row,
.sa-head {
  display: grid;
  grid-template-columns: 52px 1fr 60px 120px;
  align-items: center;
  height: 32px;
  border-radius: 6px;
  background-color: #f3f6f4;
}
.sa-head {
  background-color: transparent;
  font-size: 12px;
  color: #6b7d72;
  height: 22px;
}
.sa-col {
  text-align: center;
  font-size: 14px;
  color: @font-color;
}
.sa-suffix {
  text-align: left;
  padding-left: 10px;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: 1px;
}
.sa-rank {
  font-weight: bold;
}
.sa-rank-active {
  background-color: #cfe9d6;
  border-radius: 4px;
  color: #1f5e3a;
}
.sa-key-active {
  background-color: #ffe6a8;
  border-radius: 4px;
  color: #7a5a00;
}
/* LCP 模式（C-073） */
.sa-lcp {
  font-weight: bold;
  color: #7a5a00;
}
.sa-row.sa-current {
  box-shadow: inset 0 0 0 2px #f0a000; /* 当前后缀行：琥珀环 */
}
.sa-row.sa-compare {
  box-shadow: inset 0 0 0 2px #1565c0; /* 排序前驱行：蓝环 */
}
</style>
