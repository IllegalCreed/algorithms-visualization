<!-- 树互动组件：读者驱动的 BST 插入/查找/中序遍历（二维 SVG 边 + 圆形节点，复用 TreeView 定位） -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useTree } from './useTree';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const LEVEL_H = 70;
const t = useTree();
const val = ref(35);
const status = ref(
  english
    ? 'Enter an integer from 1 to 99, then insert it to trace its path.'
    : '输入一个 1–99 的数，点「插入」看它走到哪、落在哪。',
);
const pathSet = ref<number[]>([]); // 走位逐层高亮中的 pos
const foundPos = ref(-1); // 命中 / 中序当前点亮的 pos
const enterId = ref<string | null>(null); // 新节点入场
let timers: ReturnType<typeof setTimeout>[] = [];
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  pathSet.value = [];
  foundPos.value = -1;
};

// 定位公式照搬 TreeView.vue：按 pos 算 深度 + 水平%（从结构推导、随 nodes 重算）
const depthOf = (pos: number) => Math.floor(Math.log2(pos + 1));
const xPctOf = (pos: number) => {
  const d = depthOf(pos);
  return ((pos - (2 ** d - 1) + 0.5) / 2 ** d) * 100;
};
const topOf = (pos: number) => depthOf(pos) * LEVEL_H + 6;
const laid = computed(() =>
  t.nodes.value.map((n) => ({ ...n, xPct: xPctOf(n.pos), top: topOf(n.pos) })),
);
const edges = computed(() =>
  t.nodes.value
    .filter((n) => n.pos > 0)
    .map((n) => {
      const p = Math.floor((n.pos - 1) / 2);
      return {
        pos: n.pos,
        x1: xPctOf(n.pos),
        y1: topOf(n.pos) + 21,
        x2: xPctOf(p),
        y2: topOf(p) + 21,
      };
    }),
);

const validVal = (): number | null => {
  const v = val.value;
  if (!Number.isInteger(v) || v < 1 || v > 99) {
    status.value = english ? 'Enter an integer from 1 to 99.' : '请输入 1–99 的整数。';
    return null;
  }
  return v;
};
const animatePath = (path: number[], tail?: () => void) => {
  clearTimers();
  clearMarks();
  path.forEach((pos, i) => {
    timers.push(setTimeout(() => (pathSet.value = [...pathSet.value, pos]), i * 480));
  });
  if (tail) timers.push(setTimeout(tail, path.length * 480));
};
const onInsert = () => {
  const v = validVal();
  if (v === null) return;
  const r = t.insert(v);
  if (!r.ok && r.reason === 'dup') {
    status.value = english
      ? `${v} is already in the tree; this BST ignores duplicates.`
      : `${v} 已经在树里了（BST 不放重复值）。`;
    return;
  }
  if (!r.ok && r.reason === 'depth') {
    status.value = english
      ? 'This branch reached the four-level demo limit. Try another value or reset.'
      : '这一支已到演示深度上限（限 4 层）。换个值或重置试试。';
    animatePath(r.path);
    return;
  }
  enterId.value = t.nodeAt(r.pos!)?.id ?? null;
  status.value = english
    ? `Inserted ${v} after ${r.path.length} comparisons, stopping at an empty child position.`
    : `插入 ${v}：比较 ${r.path.length} 次、走到空位落子。每层排除一半，O(log n)。`;
  animatePath(r.path, () => (enterId.value = null));
};
const onSearch = () => {
  const v = validVal();
  if (v === null) return;
  const r = t.search(v);
  status.value = english
    ? r.found
      ? `Found ${v} after ${r.path.length} comparisons.`
      : `${v} is absent; the search stopped at an empty child after ${r.path.length} comparisons.`
    : r.found
      ? `找到 ${v}！只比较了 ${r.path.length} 次，O(log n)。`
      : `没找到 ${v}：走到空位就停了（比较 ${r.path.length} 次）。`;
  animatePath(r.path, () => {
    if (r.found) foundPos.value = r.pos!;
  });
};
const onInorder = () => {
  if (!t.nodes.value.length) return;
  const seq = t.inorder();
  status.value = english
    ? `Inorder traversal = ${seq.join(' ')}. A BST visits its values in ascending order.`
    : `中序遍历 = ${seq.join(' ')} —— 正好是升序！这是 BST 的招牌性质。`;
  clearTimers();
  clearMarks();
  // 按中序（升序）顺序逐个点亮，纯视觉
  const order = t.nodes.value.slice().sort((a, b) => a.value - b.value);
  order.forEach((n, i) => {
    timers.push(setTimeout(() => (foundPos.value = n.pos), i * 460));
  });
  timers.push(setTimeout(() => (foundPos.value = -1), order.length * 460));
};
const onReset = () => {
  t.reset();
  clearTimers();
  clearMarks();
  status.value = english
    ? 'Reset complete. Enter an integer from 1 to 99, then insert or search.'
    : '已重置 · 输入一个 1–99 的数，点「插入」或「查找」。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="tree-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" @click="onInsert">{{ english ? 'Insert' : '插入' }}</button>
      <button class="btn" @click="onSearch">{{ english ? 'Search' : '查找' }}</button>
      <button class="btn" @click="onInorder">{{ english ? 'Inorder' : '中序遍历' }}</button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <!-- 画布：定宽定高（限 4 层）；二维 BST -->
      <div class="lane">
        <span v-if="!t.nodes.value.length" class="empty-hint">
          {{ english ? 'Tree is empty' : '树为空' }}
        </span>
        <div class="stage">
          <svg class="edges" width="492" height="272">
            <line
              v-for="e in edges"
              :key="e.pos"
              class="edge"
              :class="{ on: pathSet.includes(e.pos) }"
              :x1="e.x1 + '%'"
              :y1="e.y1"
              :x2="e.x2 + '%'"
              :y2="e.y2"
            />
          </svg>
          <!-- 节点：按 pos 算的二维坐标绝对定位；圆形 -->
          <div
            v-for="nd in laid"
            :key="nd.id"
            class="node"
            :class="{
              path: pathSet.includes(nd.pos),
              found: foundPos === nd.pos,
              enter: nd.id === enterId,
            }"
            :style="{ left: nd.xPct + '%', top: nd.top + 'px' }"
          >
            {{ nd.value }}
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.tree-viz {
  width: 100%;
  gap: 16px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.val-input {
  width: 64px;
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
  position: relative;
  width: 520px;
  height: 300px;
  padding: 14px;
  .neumorphism-pressed(4px, 14px);
}
.empty-hint {
  position: absolute;
  inset: 0;
  margin: auto;
  width: fit-content;
  height: fit-content;
  color: #aaa;
  font-size: 14px;
}
.stage {
  position: absolute;
  left: 14px;
  top: 14px;
  width: 492px;
  height: 272px;
}
.edges {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
.edge {
  stroke: rgba(51, 51, 51, 0.28);
  stroke-width: 2;
  transition: stroke 0.25s;
}
.edge.on {
  stroke: #4caf50;
  stroke-width: 3;
}
.node {
  position: absolute;
  width: 42px;
  height: 42px;
  margin-left: -21px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  color: #1f5e3a;
  background: #8bd3a0;
  box-shadow:
    3px 3px 6px @neumorphis-dark-shadow,
    -3px -3px 6px @neumorphis-light-shadow;
  transition:
    background-color 0.25s,
    color 0.25s,
    transform 0.25s,
    box-shadow 0.2s;
  z-index: 1;
}
.node.enter {
  opacity: 0;
  transform: scale(0.2);
}
// 走位路径：黄、放大（瞬时强调，树绝对定位无 FLIP，无冲突）
.node.path {
  background: #ffcf5c;
  color: #6b4e00;
  transform: scale(1.12);
  box-shadow: 0 4px 12px fade(#ffcf5c, 70%);
}
// 命中 / 中序当前：深绿、放大
.node.found {
  background: #4caf50;
  color: #ffffff;
  transform: scale(1.16);
  box-shadow: 0 6px 16px fade(#4caf50, 60%);
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 480px;
  text-align: center;
  color: #555555;
}
</style>
