<!-- src/components/BoardView.vue —— 通用棋盘轨（N 皇后回溯；为回溯题数独/排列/迷宫铺路） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { BoardTrack } from '@/components/player/types';

const props = defineProps<{ board: BoardTrack }>();

const eq = (a: [number, number] | null | undefined, r: number, c: number) =>
  !!a && a[0] === r && a[1] === c;

// 逐行（上→下）逐列（左→右）铺格
const cells = computed(() => {
  const b = props.board;
  const rows: {
    row: number;
    col: number;
    dark: boolean;
    queen: boolean;
    tryC: boolean;
    conflict: boolean;
  }[][] = [];
  for (let row = 0; row < b.n; row++) {
    const line = [];
    for (let col = 0; col < b.n; col++) {
      line.push({
        row,
        col,
        dark: (row + col) % 2 === 1,
        queen: b.queens[col] === row,
        tryC: eq(b.tryCell, row, col),
        conflict: (b.conflictCells ?? []).some((p) => p[0] === row && p[1] === col),
      });
    }
    rows.push(line);
  }
  return rows;
});
</script>

<template>
  <div class="board-view center">
    <div class="board-grid" :style="{ '--n': board.n }">
      <template v-for="line in cells" :key="'r' + line[0].row">
        <div
          v-for="cell in line"
          :key="'c' + cell.row + '-' + cell.col"
          class="board-cell center"
          :class="{ dark: cell.dark, 'bc-try': cell.tryC, 'bc-conflict': cell.conflict }"
        >
          <span v-if="cell.queen" class="board-queen">♛</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.board-view {
  width: 100%;
  padding: 14px;
  min-height: 200px;
}
.board-grid {
  display: grid;
  grid-template-columns: repeat(var(--n), 52px);
  grid-template-rows: repeat(var(--n), 52px);
  gap: 4px;
  padding: 8px;
  border-radius: 12px;
  .neumorphism-pressed(4px, 12px);
}
.board-cell {
  width: 52px;
  height: 52px;
  border-radius: 6px;
  background-color: #eef3ef; /* 浅格 */
  transition:
    background-color 0.25s,
    box-shadow 0.25s;
}
.board-cell.dark {
  background-color: #cdd8d0; /* 深格 */
}
.board-queen {
  font-size: 30px;
  line-height: 1;
  color: #1f5e3a;
  user-select: none;
}
/* 当前尝试格：琥珀环 */
.board-cell.bc-try {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
}
/* 冲突格（冲突皇后所在）：红 */
.board-cell.bc-conflict {
  background-color: #e58a8a;
  .board-queen {
    color: #7a1f1f;
  }
}
</style>
