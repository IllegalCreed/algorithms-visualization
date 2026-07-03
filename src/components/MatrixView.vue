<!-- src/components/MatrixView.vue —— 通用 n×n 矩阵轨（Floyd 距离矩阵；为 DP 大类铺路） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { MatrixTrack } from '@/components/player/types';

const props = defineProps<{ matrix: MatrixTrack }>();

const n = computed(() => props.matrix.labels.length);

const eq = (a: [number, number] | null | undefined, i: number, j: number) =>
  !!a && a[0] === i && a[1] === j;

const cellOf = (i: number, j: number) => {
  const m = props.matrix;
  const v = m.cells[i][j];
  return {
    text: v === null ? '∞' : String(v),
    cls: {
      'mx-pivot': m.pivot != null && (i === m.pivot || j === m.pivot),
      'mx-active': eq(m.active, i, j),
      'mx-source': (m.sources ?? []).some((s) => s[0] === i && s[1] === j),
      'mx-updated': eq(m.updatedCell, i, j),
      'mx-diag': i === j,
    },
  };
};
</script>

<template>
  <div class="matrix-view center">
    <table class="matrix-table">
      <thead>
        <tr>
          <th class="mx-corner"></th>
          <th v-for="(l, j) in matrix.labels" :key="'h' + j" class="mx-head">{{ l }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(l, i) in matrix.labels" :key="'r' + i">
          <th class="mx-head">{{ l }}</th>
          <td
            v-for="j in n"
            :key="'c' + i + '-' + (j - 1)"
            class="matrix-cell"
            :class="cellOf(i, j - 1).cls"
          >
            {{ cellOf(i, j - 1).text }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="less">
.matrix-view {
  width: 100%;
  padding: 14px;
  min-height: 200px;
}
.matrix-table {
  border-collapse: separate;
  border-spacing: 6px;
}
.mx-corner {
  width: 40px;
}
.mx-head {
  width: 46px;
  height: 34px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: @font-highlight-color;
}
.matrix-cell {
  width: 46px;
  height: 40px;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  font-size: 15px;
  color: @font-color;
  border-radius: 8px;
  .neumorphism-flat(2px, 6px);
  transition:
    background-color 0.25s,
    box-shadow 0.25s,
    color 0.25s;
}
/* 对角线（自己到自己 = 0）：淡化 */
.matrix-cell.mx-diag {
  color: #9aa8a0;
}
/* 中转点 k 所在行/列：浅染，提示「经 k 中转」 */
.matrix-cell.mx-pivot {
  background-color: #eaf3ec;
}
/* 参与相加的两个源单元 (i,k)/(k,j)：黄 */
.matrix-cell.mx-source {
  background-color: #ffe9a8;
}
/* 当前考察单元 (i,j)：琥珀环 */
.matrix-cell.mx-active {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow,
    inset -2px -2px 5px @neumorphis-light-shadow;
}
/* 刚被降低的单元：绿 */
.matrix-cell.mx-updated {
  background-color: #8bd3a0;
  color: #1f5e3a;
}
</style>
