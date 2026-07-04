<!-- src/components/SudokuView.vue —— 数独轨（n×n 数字盘 + 宫线 + 试填/冲突/回退；C-071） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { SudokuTrack } from '@/components/player/types';

const props = defineProps<{ sudoku: SudokuTrack }>();

const cells = computed(() => {
  const s = props.sudoku;
  const rows: {
    r: number;
    c: number;
    text: string;
    given: boolean;
    current: boolean;
    reject: boolean;
    place: boolean;
    boxTop: boolean;
    boxLeft: boolean;
  }[][] = [];
  for (let r = 0; r < s.n; r++) {
    const line = [];
    for (let c = 0; c < s.n; c++) {
      const isCurrent = !!s.current && s.current[0] === r && s.current[1] === c;
      const filled = s.grid[r][c];
      const val = filled != null ? filled : isCurrent && s.tryNum != null ? s.tryNum : null;
      line.push({
        r,
        c,
        text: val == null ? '' : String(val),
        given: s.given[r][c],
        current: isCurrent,
        reject: isCurrent && s.status === 'reject',
        place: isCurrent && s.status === 'place',
        boxTop: r % s.box === 0 && r !== 0,
        boxLeft: c % s.box === 0 && c !== 0,
      });
    }
    rows.push(line);
  }
  return rows;
});
</script>

<template>
  <div class="sudoku-view center">
    <div class="sudoku-grid" :style="{ '--n': sudoku.n }">
      <template v-for="line in cells" :key="'r' + line[0].r">
        <div
          v-for="cell in line"
          :key="'c' + cell.r + '-' + cell.c"
          class="sudoku-cell center"
          :class="{
            'sk-given': cell.given,
            'sk-current': cell.current,
            'sk-reject': cell.reject,
            'sk-place': cell.place,
            'bx-t': cell.boxTop,
            'bx-l': cell.boxLeft,
          }"
        >
          {{ cell.text }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.sudoku-view {
  width: 100%;
  padding: 14px;
}
.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(var(--n), 52px);
  grid-auto-rows: 52px;
  border: 3px solid #333333;
  background-color: #333333;
  gap: 1px;
}
.sudoku-cell {
  background-color: #eef3ef;
  font-weight: 500;
  font-size: 24px;
  color: #5a6b60;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}
/* 宫线：粗分隔（第 box 行/列的上/左边） */
.sudoku-cell.bx-t {
  border-top: 3px solid #333333;
  margin-top: -1px;
}
.sudoku-cell.bx-l {
  border-left: 3px solid #333333;
  margin-left: -1px;
}
/* 给定数字：加粗深色 */
.sudoku-cell.sk-given {
  font-weight: bold;
  color: @font-color;
  background-color: #e2e8e4;
}
/* 填入：绿 */
.sudoku-cell.sk-place {
  background-color: #8bd3a0;
  color: #1f5e3a;
}
/* 冲突：红 */
.sudoku-cell.sk-reject {
  background-color: #e6b0a8;
  color: #7a2018;
}
/* 当前格：琥珀环 */
.sudoku-cell.sk-current {
  box-shadow:
    inset 0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
  z-index: 1;
}
</style>
