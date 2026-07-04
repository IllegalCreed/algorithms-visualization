<!-- src/components/MazeView.vue —— 迷宫轨（网格 DFS + 回溯；为岛屿/单词搜索/BFS 铺路） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { MazeTrack } from '@/components/player/types';

const props = defineProps<{ maze: MazeTrack }>();

const key = (r: number, c: number) => r + ',' + c;

// 逐行（上→下）逐列（左→右）铺格 + 状态判定
const cells = computed(() => {
  const m = props.maze;
  const pathSet = new Set((m.path ?? []).map(([r, c]) => key(r, c)));
  const visitedSet = new Set((m.visited ?? []).map(([r, c]) => key(r, c)));
  const filledSet = new Set((m.filled ?? []).map(([r, c]) => key(r, c)));
  const isCurrent = (r: number, c: number) =>
    !!m.current && m.current[0] === r && m.current[1] === c;
  const rows: {
    r: number;
    c: number;
    wall: boolean;
    start: boolean;
    goal: boolean;
    current: boolean;
    path: boolean;
    solution: boolean;
    visited: boolean;
  }[][] = [];
  for (let r = 0; r < m.rows; r++) {
    const line = [];
    for (let c = 0; c < m.cols; c++) {
      const onPath = pathSet.has(key(r, c));
      const isFilled = filledSet.has(key(r, c));
      line.push({
        r,
        c,
        wall: m.walls[r][c],
        start: !!m.start && m.start[0] === r && m.start[1] === c,
        goal: !!m.goal && m.goal[0] === r && m.goal[1] === c,
        current: isCurrent(r, c),
        path: onPath && !m.solved,
        solution: (onPath && !!m.solved) || isFilled, // filled 陆地复用绿（岛屿 C-066）
        visited: visitedSet.has(key(r, c)) && !onPath && !isFilled,
      });
    }
    rows.push(line);
  }
  return rows;
});
</script>

<template>
  <div class="maze-view center">
    <div class="maze-grid" :style="{ '--cols': maze.cols }">
      <template v-for="line in cells" :key="'r' + line[0].r">
        <div
          v-for="cell in line"
          :key="'c' + cell.r + '-' + cell.c"
          class="maze-cell center"
          :class="{
            'mz-wall': cell.wall,
            'mz-start': cell.start,
            'mz-goal': cell.goal,
            'mz-current': cell.current,
            'mz-path': cell.path,
            'mz-solution': cell.solution,
            'mz-visited': cell.visited,
          }"
        >
          <span v-if="cell.current" class="mz-mark">{{ maze.mark ?? '🐭' }}</span>
          <span v-else-if="cell.goal" class="mz-mark">🚩</span>
          <span v-else-if="cell.start" class="mz-mark mz-s">S</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.maze-view {
  width: 100%;
  padding: 14px;
  min-height: 200px;
}
.maze-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 48px);
  gap: 4px;
  padding: 8px;
  border-radius: 12px;
  .neumorphism-pressed(4px, 12px);
}
.maze-cell {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-color: #eef3ef; /* 通路 */
  transition:
    background-color 0.25s,
    box-shadow 0.25s;
}
.mz-mark {
  font-size: 24px;
  line-height: 1;
  user-select: none;
}
.mz-mark.mz-s {
  font-size: 18px;
  font-weight: bold;
  color: #1f5e3a;
}
/* 墙：暗实块 */
.maze-cell.mz-wall {
  background-color: #5b6b60;
}
/* 已访问（放弃的死路）：浅蓝 */
.maze-cell.mz-visited {
  background-color: #cfe0ef;
}
/* 当前尝试路径：琥珀 trail */
.maze-cell.mz-path {
  background-color: #ffe6a8;
}
/* 解路径：绿 */
.maze-cell.mz-solution {
  background-color: #8bd3a0;
}
/* 起点/终点底色 */
.maze-cell.mz-start {
  background-color: #d7ecdd;
}
.maze-cell.mz-goal {
  background-color: #d7ecdd;
}
/* 当前格：琥珀环（叠加在任何底色上） */
.maze-cell.mz-current {
  box-shadow:
    0 0 0 3px #f0a000,
    inset 2px 2px 5px @neumorphis-dark-shadow;
}
</style>
