<!-- src/components/GcdView.vue —— 矩形铺砖轨（欧几里得 GCD；数学与数论第 3 页，第 17 轨 C-079） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { GcdTrack } from '@/components/player/types';

const props = defineProps<{ gcd: GcdTrack }>();

const VW = 460;
const VH = 300;
const M = 22; // 边距

// 把 a×b 矩形等比缩放居中到画布
const layout = computed(() => {
  const { a, b } = props.gcd;
  const scale = Math.min((VW - 2 * M) / a, (VH - 2 * M) / b);
  const ox = (VW - a * scale) / 2;
  const oy = (VH - b * scale) / 2;
  return { scale, ox, oy };
});

const PALETTE = ['#a5d8ff', '#b2f2bb', '#ffd8a8', '#d0bfff', '#ffec99', '#ffc9c9'];

const squareViews = computed(() => {
  const { scale, ox, oy } = layout.value;
  const cur = new Set(props.gcd.current ?? []);
  return props.gcd.squares.map((sq, i) => ({
    i,
    x: ox + sq.x * scale,
    y: oy + sq.y * scale,
    side: sq.size * scale,
    cx: ox + (sq.x + sq.size / 2) * scale,
    cy: oy + (sq.y + sq.size / 2) * scale,
    fill: PALETTE[sq.step % PALETTE.length],
    size: sq.size,
    current: cur.has(i),
  }));
});

const rect = computed(() => {
  const { scale, ox, oy } = layout.value;
  return { x: ox, y: oy, w: props.gcd.a * scale, h: props.gcd.b * scale };
});

const remView = computed(() => {
  const r = props.gcd.remaining;
  if (!r) return null;
  const { scale, ox, oy } = layout.value;
  return { x: ox + r.x * scale, y: oy + r.y * scale, w: r.w * scale, h: r.h * scale };
});
</script>

<template>
  <div class="gcd-view center">
    <svg :viewBox="`0 0 ${VW} ${VH}`" :width="VW" :height="VH">
      <!-- 原矩形外框 -->
      <rect class="gcd-rect" :x="rect.x" :y="rect.y" :width="rect.w" :height="rect.h" />
      <!-- 已切正方形 -->
      <g
        v-for="s in squareViews"
        :key="s.i"
        class="gcd-square"
        :class="{ 'gcd-current': s.current }"
      >
        <rect :x="s.x" :y="s.y" :width="s.side" :height="s.side" :style="{ fill: s.fill }" />
        <text :x="s.cx" :y="s.cy">{{ s.size }}</text>
      </g>
      <!-- 剩余子矩形（虚线框） -->
      <rect
        v-if="remView"
        class="gcd-remaining"
        :x="remView.x"
        :y="remView.y"
        :width="remView.w"
        :height="remView.h"
      />
    </svg>
  </div>
</template>

<style scoped lang="less">
.gcd-view {
  width: 100%;
  padding: 10px;
}
svg {
  max-width: 100%;
  height: auto;
}
.gcd-rect {
  fill: none;
  stroke: #6b7d72;
  stroke-width: 2;
}
.gcd-square {
  rect {
    stroke: #ffffff;
    stroke-width: 2;
    transition:
      fill 0.25s,
      stroke 0.25s;
  }
  text {
    fill: #1f5e3a;
    font-size: 15px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
/* 本步新切正方形：琥珀描边 */
.gcd-square.gcd-current rect {
  stroke: #f0a000;
  stroke-width: 4;
}
/* 剩余子矩形：琥珀虚线框 */
.gcd-remaining {
  fill: none;
  stroke: #f0a000;
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
}
</style>
