<!-- 线段树互动组件：SVG 二叉树（节点显区间和）+ 区间查询拆「整段」点亮（绿）+ 单点更新叶→根路径点亮（黄） -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useSegTree } from './useSegTree';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const seg = useSegTree();
const a = ref(2);
const b = ref(5);
const status = ref(
  english
    ? 'Choose a range and sum a few precomputed segments instead of scanning every value.'
    : '选一段区间点「区间和」——看它把区间拆成几个「现成的整段」相加，而不是逐个累加。',
);
const covered = ref<Set<number>>(new Set()); // 查询取用的整段 pos（绿）
const onpath = ref<Set<number>>(new Set()); // 更新的叶→根路径 pos（黄）

const W = 440;
const xOf = (pos: number) => {
  const depth = Math.floor(Math.log2(pos + 1));
  const idxInLevel = pos - (2 ** depth - 1);
  return ((idxInLevel + 0.5) / 2 ** depth) * W + 10;
};
const yOf = (depth: number) => 24 + depth * 58;

// 节点（带坐标）
const verts = computed(() =>
  seg.nodes.value.map((n) => ({ ...n, x: xOf(n.pos), y: yOf(n.depth) })),
);
// 边：pos 1..14 连到 parent (pos-1)>>1
const edges = computed(() =>
  seg.nodes.value
    .filter((n) => n.pos > 0)
    .map((n) => {
      const parent = (n.pos - 1) >> 1;
      return {
        key: `e${n.pos}`,
        x1: xOf(parent),
        y1: yOf(seg.nodes.value[parent].depth),
        x2: xOf(n.pos),
        y2: yOf(n.depth),
      };
    }),
);

const validRange = (l: number, r: number) =>
  Number.isInteger(l) && Number.isInteger(r) && l >= 0 && r < seg.size && l <= r;

const onRange = () => {
  const l = a.value;
  const r = b.value;
  if (!validRange(l, r)) {
    status.value = english
      ? `Enter a valid range with 0 ≤ a ≤ b ≤ ${seg.size - 1}.`
      : `请输入合法区间：0 ≤ a ≤ b ≤ ${seg.size - 1}。`;
    return;
  }
  const res = seg.query(l, r);
  onpath.value = new Set();
  covered.value = new Set(res.covered);
  status.value = english
    ? `Range [${l}, ${r}] sums to ${res.sum} using ${res.covered.length} complete tree segments.`
    : `区间 [${l}, ${r}] 的和 = ${res.sum}，只取用了 ${res.covered.length} 个「整段」（≈log n 个节点），没有逐个累加。`;
};

const onUpdate = () => {
  const i = a.value;
  const val = b.value;
  if (!Number.isInteger(i) || i < 0 || i >= seg.size || !Number.isInteger(val)) {
    status.value = english
      ? `Enter an index 0 ≤ a ≤ ${seg.size - 1} and an integer replacement b.`
      : `请输入合法下标 0 ≤ a ≤ ${seg.size - 1} 和整数新值 b。`;
    return;
  }
  const res = seg.update(i, val);
  covered.value = new Set();
  onpath.value = new Set(res.path);
  status.value = english
    ? `Set index ${i} to ${val}; ${res.path.length} nodes changed from leaf to root. The total is ${seg.nodes.value[0].sum}.`
    : `把第 ${i} 个元素改成 ${val}，沿叶→根更新了 ${res.path.length} 个节点，根的总和 = ${seg.nodes.value[0].sum}。`;
};

const onReset = () => {
  seg.reset();
  covered.value = new Set();
  onpath.value = new Set();
  status.value = english
    ? 'Reset complete. Query a range sum or update one element.'
    : '已重置 · 选一段区间点「区间和」，或改某个元素点「更新」。';
};
</script>

<template>
  <div class="seg-tree-viz column center">
    <div class="toolbar row-wrap">
      <label class="lab">a</label>
      <input class="val-input in-a" v-model.number="a" type="number" />
      <label class="lab">b</label>
      <input class="val-input in-b" v-model.number="b" type="number" />
      <button class="btn" @click="onRange">{{ english ? 'Range sum' : '区间和' }}</button>
      <button class="btn" @click="onUpdate">{{ english ? 'Update' : '更新' }}</button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="460" height="248">
          <g class="edges">
            <line
              v-for="e in edges"
              :key="e.key"
              class="seg-edge"
              :x1="e.x1"
              :y1="e.y1"
              :x2="e.x2"
              :y2="e.y2"
            />
          </g>
          <g class="verts">
            <g
              v-for="n in verts"
              :key="n.id"
              class="seg-node"
              :class="{ covered: covered.has(n.pos), onpath: onpath.has(n.pos), leaf: n.isLeaf }"
              :transform="`translate(${n.x},${n.y})`"
            >
              <circle r="17" />
              <text>{{ n.sum }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.seg-tree-viz {
  width: 100%;
  gap: 16px;
}
.toolbar {
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.lab {
  font-weight: bold;
  font-size: 15px;
  color: @font-color;
}
.val-input {
  width: 56px;
  padding: 8px 10px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  color: @font-color;
  border: none;
  .neumorphism-pressed(3px, 10px);
}
.btn {
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: @font-color;
  padding: 9px 16px;
  .neumorphism-btn(4px, 12px);
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
.seg-edge {
  stroke: #b9c6bd;
  stroke-width: 2.5;
}
.seg-node {
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
    font-size: 13px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
    user-select: none;
  }
}
.seg-node.leaf circle {
  fill: #aee0bb;
}
.seg-node.covered circle {
  fill: #4caf50;
  stroke: #2e7d32;
}
.seg-node.covered text {
  fill: #ffffff;
}
.seg-node.onpath circle {
  fill: #ffcf5c;
  stroke: #f0a000;
}
.seg-node.onpath text {
  fill: #6b4e00;
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
