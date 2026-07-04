<!-- src/components/HullView.vue —— 点平面轨（凸包；计算几何大类首发，第 19 轨 C-081） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { HullTrack } from '@/components/player/types';

const props = defineProps<{ hull: HullTrack }>();

const VW = 460;
const VH = 300;
const M = 30;

// 点坐标等比缩放居中 + y 上翻（数学 y 向上）
const layout = computed(() => {
  const xs = props.hull.points.map((p) => p.x);
  const ys = props.hull.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const scale = Math.min((VW - 2 * M) / w, (VH - 2 * M) / h);
  const ox = (VW - w * scale) / 2;
  const oy = (VH - h * scale) / 2;
  const sx = (x: number) => ox + (x - minX) * scale;
  const sy = (y: number) => oy + (maxY - y) * scale; // y 上翻
  return { sx, sy };
});

const screen = computed(() => {
  const { sx, sy } = layout.value;
  return props.hull.points.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
});

const isCurrent = (i: number) => props.hull.current === i;
const isPopped = (i: number) => (props.hull.popped ?? []).includes(i);

const edgeViews = computed(() =>
  props.hull.edges.map(([a, b], i) => ({
    key: `${a}-${b}-${i}`,
    cls: props.hull.edgeClasses?.[i] ?? '', // 线段相交（C-084）：可选边样式类
    x1: screen.value[a].x,
    y1: screen.value[a].y,
    x2: screen.value[b].x,
    y2: screen.value[b].y,
  })),
);

const polygonPoints = computed(() => {
  if (props.hull.phase !== 'done' || !props.hull.finalHull) return '';
  return props.hull.finalHull.map((i) => `${screen.value[i].x},${screen.value[i].y}`).join(' ');
});

// 旋转卡壳三连线（C-082）：当前边 / 候选点对 / 最优点对
const lineOf = (pair: [number, number] | null | undefined) => {
  if (!pair) return null;
  const [a, b] = pair;
  return {
    x1: screen.value[a].x,
    y1: screen.value[a].y,
    x2: screen.value[b].x,
    y2: screen.value[b].y,
  };
};
const activeEdgeLine = computed(() => lineOf(props.hull.activeEdge));
const caliperLine = computed(() => lineOf(props.hull.caliper));
const bestLine = computed(() => lineOf(props.hull.best));

// 最近点对（C-083）：分治中线（数学 x → 屏幕 x）与 δ 带矩形
const dividerX = computed(() =>
  props.hull.divider != null ? layout.value.sx(props.hull.divider) : null,
);
// 扫描线求交（C-088）：已发现交点标记 + 本步报告交点
const markViews = computed(() => {
  const { sx, sy } = layout.value;
  return (props.hull.marks ?? []).map((p) => ({ x: sx(p.x), y: sy(p.y) }));
});
const markActiveView = computed(() => {
  const p = props.hull.markActive;
  if (!p) return null;
  return { x: layout.value.sx(p.x), y: layout.value.sy(p.y) };
});
const stripRect = computed(() => {
  const st = props.hull.strip;
  if (!st) return null;
  const x1 = layout.value.sx(st[0]);
  const x2 = layout.value.sx(st[1]);
  return { x: Math.min(x1, x2), w: Math.abs(x2 - x1) };
});
</script>

<template>
  <div class="hull-view center">
    <svg :viewBox="`0 0 ${VW} ${VH}`" :width="VW" :height="VH">
      <!-- 最近点对（C-083）：δ 带 + 分治中线（垫底） -->
      <rect
        v-if="stripRect"
        class="hull-strip"
        :x="stripRect.x"
        y="0"
        :width="stripRect.w"
        :height="VH"
      />
      <line
        v-if="dividerX != null"
        class="hull-divider"
        :x1="dividerX"
        y1="0"
        :x2="dividerX"
        :y2="VH"
      />
      <!-- 完整凸包多边形（done） -->
      <polygon v-if="polygonPoints" class="hull-polygon" :points="polygonPoints" />
      <!-- 当前凸壳链折线 -->
      <line
        v-for="e in edgeViews"
        :key="e.key"
        class="hull-edge"
        :class="e.cls"
        :x1="e.x1"
        :y1="e.y1"
        :x2="e.x2"
        :y2="e.y2"
      />
      <!-- 旋转卡壳三连线（C-082）：最优绿 / 候选蓝虚线 / 当前边琥珀 -->
      <line
        v-if="bestLine"
        class="hull-best"
        :x1="bestLine.x1"
        :y1="bestLine.y1"
        :x2="bestLine.x2"
        :y2="bestLine.y2"
      />
      <line
        v-if="caliperLine"
        class="hull-caliper"
        :x1="caliperLine.x1"
        :y1="caliperLine.y1"
        :x2="caliperLine.x2"
        :y2="caliperLine.y2"
      />
      <line
        v-if="activeEdgeLine"
        class="hull-active-edge"
        :x1="activeEdgeLine.x1"
        :y1="activeEdgeLine.y1"
        :x2="activeEdgeLine.x2"
        :y2="activeEdgeLine.y2"
      />
      <!-- 散点 -->
      <circle
        v-for="(p, i) in screen"
        :key="i"
        class="hull-point"
        :class="{ 'hull-current': isCurrent(i), 'hull-popped': isPopped(i) }"
        :cx="p.x"
        :cy="p.y"
        r="7"
      />
      <!-- 扫描线求交（C-088）：交点标记（顶层） -->
      <circle
        v-for="(m, i) in markViews"
        :key="`mk-${i}`"
        class="hull-mark"
        :cx="m.x"
        :cy="m.y"
        r="5.5"
      />
      <circle
        v-if="markActiveView"
        class="hull-mark-active"
        :cx="markActiveView.x"
        :cy="markActiveView.y"
        r="9"
      />
    </svg>
  </div>
</template>

<style scoped lang="less">
.hull-view {
  width: 100%;
  padding: 10px;
}
svg {
  max-width: 100%;
  height: auto;
}
.hull-polygon {
  fill: rgba(139, 211, 160, 0.28);
  stroke: #2e7d32;
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.hull-edge {
  stroke: #6b7d72;
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke 0.25s;
}
.hull-point {
  fill: #6b7d72;
  stroke: #ffffff;
  stroke-width: 2;
  transition:
    fill 0.25s,
    r 0.25s;
}
/* 当前处理点：琥珀 + 大 */
.hull-point.hull-current {
  fill: #f0a000;
  r: 10;
}
/* 本步被弹出的点：红 */
.hull-point.hull-popped {
  fill: #e03131;
  r: 9;
}
/* 旋转卡壳（C-082）：当前边琥珀粗线 / 候选蓝虚线 / 最优绿粗线 */
.hull-active-edge {
  stroke: #f0a000;
  stroke-width: 4;
  stroke-linecap: round;
}
.hull-caliper {
  stroke: #4a90d9;
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
  stroke-linecap: round;
}
.hull-best {
  stroke: #2e7d32;
  stroke-width: 4;
  stroke-linecap: round;
}
/* 线段相交（C-084）：当前测试琥珀 / 相交绿 / 不相交灰虚线 */
.hull-edge.seg-test {
  stroke: #f0a000;
  stroke-width: 4;
}
.hull-edge.seg-yes {
  stroke: #2e7d32;
  stroke-width: 4;
}
.hull-edge.seg-no {
  stroke: #9aa8a0;
  stroke-dasharray: 6 4;
}
/* 最近点对（C-083）：δ 带浅紫 / 分治中线紫虚线 */
.hull-strip {
  fill: rgba(156, 106, 222, 0.14);
}
.hull-divider {
  stroke: #9c6ade;
  stroke-width: 2.5;
  stroke-dasharray: 8 5;
}
/* 扫描线求交（C-088）：已发现交点红标 / 本步报告交点放大 + 琥珀描边 */
.hull-mark {
  fill: #e03131;
  stroke: #ffffff;
  stroke-width: 2;
}
.hull-mark-active {
  fill: #e03131;
  stroke: #f0a000;
  stroke-width: 3.5;
}
</style>
