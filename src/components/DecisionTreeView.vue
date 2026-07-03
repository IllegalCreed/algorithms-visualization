<!-- src/components/DecisionTreeView.vue —— 回溯与搜索通用决策树轨（子集/排列/组合：DFS 走决策树 + 回溯） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { DecisionTreeTrack } from '@/components/player/types';

const props = defineProps<{ decisionTree: DecisionTreeTrack }>();

const nodeById = computed(() => {
  const m: Record<number, { id: number; label: string; x: number; y: number }> = {};
  for (const n of props.decisionTree.nodes) m[n.id] = n;
  return m;
});

const inPath = (id: number) => props.decisionTree.pathIds?.includes(id) ?? false;

// 边视图：父→子直线 + 决策标签放中点略上；父子同在递归路径上 → on-path 高亮
const edgeViews = computed(() =>
  props.decisionTree.edges.map((e) => {
    const a = nodeById.value[e.from];
    const b = nodeById.value[e.to];
    return {
      key: `${e.from}-${e.to}`,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      lx: (a.x + b.x) / 2,
      ly: (a.y + b.y) / 2 - 4,
      label: e.label ?? '',
      onPath: inPath(e.from) && inPath(e.to),
    };
  }),
);

const isActive = (id: number) => props.decisionTree.activeId === id;
const isVisited = (id: number) => props.decisionTree.visitedIds?.includes(id) ?? false;
const isSolution = (id: number) => props.decisionTree.solutionIds?.includes(id) ?? false;
</script>

<template>
  <div class="dtree-view center">
    <svg viewBox="0 0 640 300" width="640" height="300">
      <g class="edges">
        <g v-for="e in edgeViews" :key="e.key" class="dtree-edge" :class="{ 'on-path': e.onPath }">
          <line :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" />
          <text :x="e.lx" :y="e.ly">{{ e.label }}</text>
        </g>
      </g>
      <g class="nodes">
        <g
          v-for="n in decisionTree.nodes"
          :key="n.id"
          class="dtree-node"
          :class="{
            active: isActive(n.id),
            'on-path': inPath(n.id),
            visited: isVisited(n.id),
            solution: isSolution(n.id),
          }"
          :transform="`translate(${n.x},${n.y})`"
        >
          <circle r="13" />
          <text v-if="n.label" class="node-label" x="0" y="26">{{ n.label }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="less">
.dtree-view {
  width: 100%;
  padding: 10px;
}
svg {
  max-width: 100%;
  height: auto;
}
.dtree-edge {
  line {
    stroke: #b9c6bd;
    stroke-width: 2.5;
    transition: stroke 0.25s;
  }
  text {
    fill: #6b7d72;
    font-size: 11px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
.dtree-edge.on-path line {
  stroke: #ffcf5c;
  stroke-width: 4;
}
.dtree-node {
  circle {
    fill: #eef3ef;
    stroke: #cdd8d0;
    stroke-width: 2;
    transition:
      fill 0.25s,
      stroke 0.25s;
  }
  .node-label {
    fill: @font-color;
    font-size: 12px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
/* 已访问：淡实填充 */
.dtree-node.visited circle {
  fill: #cfe4d6;
}
/* 当前递归路径：浅琥珀 */
.dtree-node.on-path circle {
  fill: #ffe6a8;
  stroke: #f0c14b;
}
/* 当前节点：琥珀环 */
.dtree-node.active circle {
  stroke: #f0a000;
  stroke-width: 4;
}
/* 解叶：绿 */
.dtree-node.solution circle {
  fill: #4caf50;
  stroke: #2e7d32;
}
.dtree-node.solution .node-label {
  fill: #1f5e3a;
}
</style>
