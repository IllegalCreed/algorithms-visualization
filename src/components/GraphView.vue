<!-- src/components/GraphView.vue —— 图算法通用可视化轨（带权图 + 节点态 + 边分类 + 距离徽标） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { GraphTrack } from '@/components/player/types';

const props = defineProps<{ graph: GraphTrack }>();

const vertexById = computed(() => {
  const m: Record<number, { id: number; label: string; x: number; y: number }> = {};
  for (const v of props.graph.vertices) m[v.id] = v;
  return m;
});

const R = 19;
// 边视图：起→止缩短到圆边露箭头 + 权重放线中点法向偏移
const edgeViews = computed(() =>
  props.graph.edges.map((e) => {
    const a = vertexById.value[e.from];
    const b = vertexById.value[e.to];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return {
      key: e.key,
      cls: props.graph.edgeClass?.[e.key] ?? '',
      x1: a.x + ux * R,
      y1: a.y + uy * R,
      x2: b.x - ux * R,
      y2: b.y - uy * R,
      wx: (a.x + b.x) / 2 + uy * 12,
      wy: (a.y + b.y) / 2 - ux * 12,
      w: e.w,
    };
  }),
);

const isDone = (id: number) => props.graph.doneNodes?.includes(id) ?? false;
const badgeOf = (id: number) => props.graph.nodeBadge?.[id] ?? null;

// SCC 分组着色（C-069）：一组一色，未归组中性灰；不设 nodeGroup 时用默认绿（CSS）
const GROUP_PALETTE = ['#a5d8ff', '#ffd8a8', '#b2f2bb', '#ffc9c9', '#d0bfff', '#ffec99'];
const isOnStack = (id: number) => props.graph.stackNodes?.includes(id) ?? false;
const groupStyle = (id: number): Record<string, string> | undefined => {
  const groups = props.graph.nodeGroup;
  if (!groups) return undefined;
  const g = groups[id];
  return { fill: g == null ? '#e0e6e2' : GROUP_PALETTE[g % GROUP_PALETTE.length] };
};
</script>

<template>
  <div class="graph-view center">
    <svg viewBox="0 0 460 300" width="460" height="300">
      <defs>
        <marker id="gv-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#9aa8a0" />
        </marker>
      </defs>
      <g class="edges">
        <g v-for="e in edgeViews" :key="e.key" class="graph-edge" :class="e.cls">
          <line
            :x1="e.x1"
            :y1="e.y1"
            :x2="e.x2"
            :y2="e.y2"
            :marker-end="graph.directed ? 'url(#gv-arrow)' : undefined"
          />
          <text :x="e.wx" :y="e.wy">{{ e.w }}</text>
        </g>
      </g>
      <g class="verts">
        <g
          v-for="v in graph.vertices"
          :key="v.id"
          class="graph-node"
          :class="{
            done: isDone(v.id),
            active: graph.activeNode === v.id,
            'on-stack': isOnStack(v.id),
          }"
          :transform="`translate(${v.x},${v.y})`"
        >
          <circle r="18" :style="groupStyle(v.id)" />
          <text class="node-label">{{ v.label }}</text>
          <text v-if="badgeOf(v.id) !== null" class="node-badge" x="20" y="-16">
            {{ badgeOf(v.id) }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="less">
.graph-view {
  width: 100%;
  padding: 10px;
}
svg {
  max-width: 100%;
  height: auto;
}
.graph-edge {
  line {
    stroke: #b9c6bd;
    stroke-width: 2.5;
    transition: stroke 0.25s;
  }
  text {
    fill: #6b7d72;
    font-size: 12px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
.graph-edge.relaxed line,
.graph-edge.current line {
  stroke: #ffcf5c;
  stroke-width: 4;
}
.graph-edge.tree line,
.graph-edge.mst line {
  stroke: #2e7d32;
  stroke-width: 4;
}
.graph-edge.rejected line {
  stroke: #d9a0a0;
  stroke-dasharray: 4 3;
}
.graph-node {
  circle {
    fill: #8bd3a0;
    stroke: transparent;
    stroke-width: 3;
    transition:
      fill 0.25s,
      stroke 0.25s;
  }
  .node-label {
    fill: #1f5e3a;
    font-size: 14px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
  .node-badge {
    fill: @font-color;
    font-size: 13px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
.graph-node.done circle {
  fill: #4caf50;
}
.graph-node.done .node-label {
  fill: #ffffff;
}
.graph-node.on-stack circle {
  stroke: #f0a000;
  stroke-dasharray: 4 2;
}
.graph-node.active circle {
  stroke: #f0a000;
  stroke-dasharray: none;
}
</style>
