<!-- src/components/TreeView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { StepEmphasis } from '@/components/player/types';

const props = withDefaults(
  defineProps<{
    array: [string, number][];
    emphasis: StepEmphasis;
    heapSize: number; // [0,heapSize) 在堆中，[heapSize,n) 已就位脱离堆
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const LEVEL_HEIGHT = 60;
const NODE_RADIUS = 18;

const vizWidth = computed(() => props.array.length * props.slotWidth);
const maxDepth = computed(() =>
  props.array.length ? Math.floor(Math.log2(props.array.length)) : 0,
);
const treeHeight = computed(() => (maxDepth.value + 1) * LEVEL_HEIGHT);

// 节点态：与主轨同优先级（就位 sorted > heapNode > swapped > comparing > idle）
function stateOf(k: number): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'heapNode' {
  const e = props.emphasis;
  if (k >= props.heapSize) return 'sorted'; // 脱离堆、已就位
  if (e.heapNode === k) return 'heapNode';
  if (e.comparing && (k === e.comparing[0] || k === e.comparing[1]))
    return e.swapped ? 'swapped' : 'comparing';
  return 'idle';
}

const nodes = computed(() =>
  props.array.map((item, k) => {
    const depth = Math.floor(Math.log2(k + 1));
    const levelStart = 2 ** depth - 1;
    const cap = 2 ** depth;
    const xPct = ((k - levelStart + 0.5) / cap) * 100;
    const top = depth * LEVEL_HEIGHT;
    return {
      id: item[0],
      value: item[1],
      k,
      xPct,
      top,
      centerY: top + NODE_RADIUS,
      state: stateOf(k),
    };
  }),
);

// 父子边：每个 k>0 连到 parent ⌊(k-1)/2⌋
const edges = computed(() =>
  nodes.value
    .filter((nd) => nd.k > 0)
    .map((nd) => {
      const parent = nodes.value[Math.floor((nd.k - 1) / 2)];
      return { k: nd.k, x1: nd.xPct, y1: nd.centerY, x2: parent.xPct, y2: parent.centerY };
    }),
);
</script>
<template>
  <div class="tree-view center" :style="{ width: vizWidth + 'px', height: treeHeight + 'px' }">
    <svg class="edges" :width="vizWidth" :height="treeHeight">
      <line
        v-for="e in edges"
        :key="e.k"
        :x1="e.x1 + '%'"
        :y1="e.y1"
        :x2="e.x2 + '%'"
        :y2="e.y2"
        class="edge"
      />
    </svg>
    <div
      v-for="nd in nodes"
      :key="nd.id"
      class="tree-node center"
      :class="nd.state"
      :style="{ left: nd.xPct + '%', top: nd.top + 'px' }"
    >
      {{ nd.value }}
    </div>
  </div>
</template>
<style scoped lang="less">
.tree-view {
  position: relative;
}
.edges {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.edge {
  stroke: fade(@font-color, 30%);
  stroke-width: 2;
}
.tree-node {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 13px;
  color: @font-color;
  background-color: #8bd3a0;
  transition: background-color 0.3s ease;
  .neumorphism-flat(3px, 6px);
  z-index: 1;
}
.tree-node.comparing {
  background-color: #ffcf5c;
}
.tree-node.swapped {
  background-color: #ff8a65;
}
.tree-node.sorted {
  background-color: #4caf50;
}
.tree-node.heapNode {
  background-color: #7e57c2;
  color: #fff;
}
</style>
