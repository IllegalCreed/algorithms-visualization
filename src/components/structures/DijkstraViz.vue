<!-- Dijkstra 单源最短路互动：SVG 带权有向图 + 距离表 + 「下一步」单步松弛演示（确定最近点→松弛邻边→更新距离） -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDijkstra } from './useDijkstra';

const dij = useDijkstra();
const result = dij.run();
const steps = result.steps;
const lastIndex = steps.length - 1;

const stepIndex = ref(0);
const cur = computed(() => steps[stepIndex.value]);
const settledSet = computed(() => new Set(cur.value.settled));
const relaxedKeys = computed(() => new Set(cur.value.relaxed.map((e) => `${e.from}-${e.to}`)));
const updSet = computed(() => new Set(cur.value.relaxed.map((e) => e.to)));
const showTree = computed(() => stepIndex.value === lastIndex);
const treeKeys = computed(
  () => new Set(result.prev.flatMap((p, v) => (p === null ? [] : [`${p}-${v}`]))),
);
const labelOf = (i: number) => dij.vertices[i].label;

// 边视图：起→止坐标 + 缩短到圆边露出箭头 + 权重中点
const R = 19;
const edgeViews = computed(() =>
  dij.edges.map((e) => {
    const a = dij.vertices[e.from];
    const b = dij.vertices[e.to];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return {
      key: `${e.from}-${e.to}`,
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

const distLabel = (d: number) => (d === Infinity ? '∞' : String(d));

const statusText = computed(() => {
  const s = cur.value;
  if (stepIndex.value === 0)
    return '源 A 距离 0，其余 ∞。点「下一步」开始：每次确定一个最近点并松弛它的邻边。';
  if (stepIndex.value === lastIndex) {
    const path = dij.pathTo(5).map(labelOf).join('→');
    return `全部确定！A 到各点最短距离已定。A→F 最短路 = ${path}，长度 ${result.dist[5]}。`;
  }
  const u = s.justSettled as number;
  const relaxed = s.relaxed.map((e) => `${labelOf(e.from)}→${labelOf(e.to)}`).join('、');
  return `确定 ${labelOf(u)}（当前最近，dist=${s.dist[u]}）；松弛 ${relaxed || '无'}。`;
});

const onNext = () => {
  if (stepIndex.value < lastIndex) stepIndex.value++;
};
const onReset = () => {
  stepIndex.value = 0;
};
</script>

<template>
  <div class="dijkstra-viz column center">
    <div class="toolbar row-wrap">
      <button class="btn" :disabled="stepIndex >= lastIndex" @click="onNext">下一步</button>
      <button class="btn" @click="onReset">重置</button>
      <span class="hint">源 = A · 第 {{ stepIndex }}/{{ lastIndex }} 步</span>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="460" height="300">
          <defs>
            <marker id="dij-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="#9aa8a0" />
            </marker>
          </defs>
          <g class="edges">
            <g
              v-for="e in edgeViews"
              :key="e.key"
              class="dedge"
              :class="{ relaxed: relaxedKeys.has(e.key), tree: showTree && treeKeys.has(e.key) }"
            >
              <line :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" marker-end="url(#dij-arrow)" />
              <text :x="e.wx" :y="e.wy">{{ e.w }}</text>
            </g>
          </g>
          <g class="verts">
            <g
              v-for="v in dij.vertices"
              :key="v.id"
              class="dvert"
              :class="{ settled: settledSet.has(v.id), just: cur.justSettled === v.id }"
              :transform="`translate(${v.x},${v.y})`"
            >
              <circle r="18" />
              <text>{{ v.label }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <div class="dist-table row-wrap">
      <div
        v-for="v in dij.vertices"
        :key="v.id"
        class="dcell"
        :class="{ upd: updSet.has(v.id), settled: settledSet.has(v.id) }"
      >
        <span class="dlabel">{{ v.label }}</span>
        <span class="dval">{{ distLabel(cur.dist[v.id]) }}</span>
      </div>
    </div>
    <p class="status">{{ statusText }}</p>
  </div>
</template>

<style scoped lang="less">
.dijkstra-viz {
  width: 100%;
  gap: 14px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
.hint {
  font-size: 13px;
  color: #888888;
}
.lane-wrap {
  display: flex;
  justify-content: center;
}
.lane {
  width: 480px;
  padding: 10px;
  .neumorphism-pressed(4px, 14px);
}
.dedge {
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
.dedge.relaxed line {
  stroke: #ffcf5c;
  stroke-width: 4;
}
.dedge.tree line {
  stroke: #2e7d32;
  stroke-width: 4;
}
.dvert {
  circle {
    fill: #8bd3a0;
    stroke: transparent;
    stroke-width: 3;
    transition:
      fill 0.25s,
      stroke 0.25s;
  }
  text {
    fill: #1f5e3a;
    font-size: 14px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
.dvert.settled circle {
  fill: #4caf50;
}
.dvert.settled text {
  fill: #ffffff;
}
.dvert.just circle {
  stroke: #f0a000;
}
.dist-table {
  gap: 6px;
  justify-content: center;
}
.dcell {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
  padding: 5px 0;
  border-radius: 8px;
  .neumorphism-flat(3px, 8px);
  transition: background 0.25s;
  .dlabel {
    font-size: 12px;
    color: #888888;
  }
  .dval {
    font-size: 16px;
    font-weight: bold;
    color: @font-color;
  }
}
.dcell.settled .dval {
  color: #2e7d32;
}
.dcell.upd {
  background: #fff2cc;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 520px;
  text-align: center;
  color: #555555;
}
</style>
