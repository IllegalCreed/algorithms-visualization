<!-- src/components/NetworkView.vue —— 比较器网络轨（双调排序；排序阶段三，第 20 轨 C-085） -->
<script setup lang="ts">
import { computed } from 'vue';
import type { NetworkTrack } from '@/components/player/types';

const props = defineProps<{ network: NetworkTrack }>();

const VW = 460;
const VH = 300;
const LEFT = 44; // 左侧留值标注
const RIGHT = 16;
const TOP = 22;
const BOTTOM = 22;

const n = computed(() => props.network.wires.length);
const wireY = (i: number): number => TOP + (i * (VH - TOP - BOTTOM)) / (n.value - 1);
const colX = (c: number): number =>
  LEFT + ((c + 1) * (VW - LEFT - RIGHT)) / (props.network.cols + 1);

const compViews = computed(() =>
  props.network.comparators.map((cp, i) => {
    const cur = props.network.currentCol;
    const state =
      props.network.done || (cur != null && cp.col < cur)
        ? 'net-done'
        : cur != null && cp.col === cur
          ? 'net-active'
          : '';
    // 大值流向端：asc → 大值去编号大的 wire（下端）；desc → 上端
    const bigEnd = cp.dir === 'asc' ? Math.max(cp.a, cp.b) : Math.min(cp.a, cp.b);
    return {
      i,
      x: colX(cp.col),
      y1: wireY(cp.a),
      y2: wireY(cp.b),
      arrowY: wireY(bigEnd),
      arrowUp: bigEnd === Math.min(cp.a, cp.b), // 三角朝上？
      state,
    };
  }),
);
</script>

<template>
  <div class="network-view center">
    <svg :viewBox="`0 0 ${VW} ${VH}`" :width="VW" :height="VH">
      <!-- 水平 wire + 左端当前值 -->
      <g v-for="(v, i) in network.wires" :key="'w' + i">
        <line class="net-wire" :x1="LEFT" :y1="wireY(i)" :x2="VW - RIGHT" :y2="wireY(i)" />
        <text class="net-val" :x="LEFT - 10" :y="wireY(i)">{{ v }}</text>
      </g>
      <!-- 比较器（竖线 + 端点 + 大值流向三角） -->
      <g v-for="c in compViews" :key="'c' + c.i" class="net-comp" :class="c.state">
        <line :x1="c.x" :y1="c.y1" :x2="c.x" :y2="c.y2" />
        <circle :cx="c.x" :cy="c.y1" r="4" />
        <circle :cx="c.x" :cy="c.y2" r="4" />
        <path
          :d="
            c.arrowUp
              ? `M ${c.x - 5} ${c.arrowY + 9} L ${c.x + 5} ${c.arrowY + 9} L ${c.x} ${c.arrowY + 1} Z`
              : `M ${c.x - 5} ${c.arrowY - 9} L ${c.x + 5} ${c.arrowY - 9} L ${c.x} ${c.arrowY - 1} Z`
          "
        />
      </g>
    </svg>
  </div>
</template>

<style scoped lang="less">
.network-view {
  width: 100%;
  padding: 10px;
}
svg {
  max-width: 100%;
  height: auto;
}
.net-wire {
  stroke: #b9c6bd;
  stroke-width: 2;
}
.net-val {
  fill: @font-color;
  font-size: 14px;
  font-weight: bold;
  text-anchor: end;
  dominant-baseline: central;
  user-select: none;
}
.net-comp {
  line {
    stroke: #9aa8a0;
    stroke-width: 2.5;
    transition: stroke 0.25s;
  }
  circle,
  path {
    fill: #9aa8a0;
    transition: fill 0.25s;
  }
}
/* 当前列：琥珀 */
.net-comp.net-active {
  line {
    stroke: #f0a000;
    stroke-width: 4;
  }
  circle,
  path {
    fill: #f0a000;
  }
}
/* 已执行列：绿 */
.net-comp.net-done {
  line {
    stroke: #2e7d32;
  }
  circle,
  path {
    fill: #2e7d32;
  }
}
</style>
