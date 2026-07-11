<!-- 堆互动组件：大顶堆 数组+树双视图联动 + 上浮/下沉真实分步（复用 TreeView pos 定位） -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import type { SiteLocale } from '@/i18n/catalog';
import { useHeap } from './useHeap';

const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), { locale: 'zh-CN' });
const english = props.locale === 'en';
const LEVEL_H = 64;
const h = useHeap();
const val = ref(95);
const status = ref(
  english
    ? 'Enter a value and insert it to watch it sift up from the array tail.'
    : '输入一个数，点「插入」，看它从数组末尾上浮到位。',
);
const cmp = ref<number[]>([]); // 比较交换中的 pos（黄）
const hot = ref(-1); // 到位 / 堆顶（深绿）
const enterId = ref<string | null>(null);
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

// 树定位公式照搬 TreeView.vue（堆是完全二叉树，pos = 数组下标）
const depthOf = (i: number) => Math.floor(Math.log2(i + 1));
const xPctOf = (i: number) => {
  const d = depthOf(i);
  return ((i - (2 ** d - 1) + 0.5) / 2 ** d) * 100;
};
const topOf = (i: number) => depthOf(i) * LEVEL_H + 6;
const laid = computed(() =>
  h.items.value.map((it, i) => ({ id: it[0], val: it[1], i, xPct: xPctOf(i), top: topOf(i) })),
);
const edges = computed(() =>
  h.items.value
    .map((_, i) => i)
    .filter((i) => i > 0)
    .map((i) => {
      const p = (i - 1) >> 1;
      return { i, x1: xPctOf(i), y1: topOf(i) + 20, x2: xPctOf(p), y2: topOf(p) + 20 };
    }),
);
const validVal = (): number | null => {
  if (!Number.isInteger(val.value) || val.value < 1 || val.value > 99) {
    status.value = english ? 'Enter an integer from 1 to 99.' : '请输入 1–99 的整数。';
    return null;
  }
  return val.value;
};

const onInsert = async () => {
  if (busy.value) return;
  const v = validVal();
  if (v === null) return;
  if (!h.canInsert.value) {
    status.value = english
      ? 'The demo heap is full at 15 values. Extract the root or reset first.'
      : '堆满了（演示限 15 个），先弹出或重置。';
    return;
  }
  busy.value = true;
  cmp.value = [];
  hot.value = -1;
  let i = h.insert(v)!; // 末尾追加（同步）
  enterId.value = h.items.value[i][0];
  status.value = english
    ? `Insert ${v} at the array tail, then sift it up from the last leaf.`
    : `插入 ${v}：先放到数组末尾（最后一个叶子），开始上浮……`;
  await sleep(600);
  enterId.value = null;
  let hops = 0;
  while (i > 0 && h.items.value[i][1] > h.items.value[(i - 1) >> 1][1]) {
    cmp.value = [i, (i - 1) >> 1];
    await sleep(520);
    i = h.siftUpStep(i); // 交换、返回 parent
    cmp.value = [];
    hops++;
    await sleep(340);
  }
  hot.value = i;
  status.value = english
    ? `Inserted ${v} after ${hops} upward swaps. The maximum ${h.peek()} remains at the root.`
    : `插入 ${v}：上浮 ${hops} 次到位，堆顶始终是最大值 ${h.peek()}，O(log n)。`;
  await sleep(700);
  hot.value = -1;
  busy.value = false;
};
const onExtract = async () => {
  if (busy.value || !h.canExtract.value) return;
  busy.value = true;
  cmp.value = [];
  const max = h.extractRoot(); // 取根、末位补根（同步）
  status.value = english
    ? `Extract ${max}, move the last value to the root, and begin sifting down.`
    : `弹出堆顶 ${max}（最大值）：末尾元素补到根，开始下沉……`;
  if (!h.items.value.length) {
    busy.value = false;
    return;
  }
  hot.value = 0;
  await sleep(560);
  hot.value = -1;
  let i = 0;
  let hops = 0;
  for (;;) {
    const n = h.items.value.length;
    let big = i;
    if (2 * i + 1 < n && h.items.value[2 * i + 1][1] > h.items.value[big][1]) big = 2 * i + 1;
    if (2 * i + 2 < n && h.items.value[2 * i + 2][1] > h.items.value[big][1]) big = 2 * i + 2;
    if (big === i) break;
    cmp.value = [i, big];
    await sleep(520);
    i = h.siftDownStep(i);
    cmp.value = [];
    hops++;
    await sleep(340);
  }
  status.value = english
    ? `Extracted ${max}; the replacement settled after ${hops} downward swaps. The new root is ${h.peek()}.`
    : `弹出堆顶 ${max}：末位补根后下沉 ${hops} 次归位，新堆顶 ${h.peek()}，O(log n)。`;
  busy.value = false;
};
const onReset = () => {
  clearTimers(); // 重置可随时中断进行中的上浮/下沉动画
  busy.value = false;
  cmp.value = [];
  hot.value = -1;
  enterId.value = null;
  h.reset();
  status.value = english
    ? 'Reset complete. Insert a value to watch it sift up.'
    : '已重置 · 输入一个数，点「插入」看它上浮。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="heap-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" :disabled="busy" @click="onInsert">
        {{ english ? 'Insert' : '插入' }}
      </button>
      <button class="btn" :disabled="busy || !h.canExtract.value" @click="onExtract">
        {{ english ? 'Extract root' : '弹出堆顶' }}
      </button>
      <button class="btn" @click="onReset">{{ english ? 'Reset' : '重置' }}</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <div class="row-label">{{ english ? 'Array' : '数组' }}</div>
        <div class="arr">
          <!-- 数组轨：值格按下标排，交换时 FLIP 滑动；与树轨同 id 同步 -->
          <TransitionGroup name="cellmv" tag="div" class="cells">
            <div
              v-for="(it, i) in h.items.value"
              :key="it[0]"
              class="cell"
              :class="{ cmp: cmp.includes(i), hot: hot === i }"
              :data-i="i"
            >
              {{ it[1] }}
            </div>
          </TransitionGroup>
          <div class="indices">
            <div v-for="(_, i) in h.items.value" :key="i" class="idx">{{ i }}</div>
          </div>
        </div>
        <div class="row-label">{{ english ? 'Tree view of the same heap' : '树（同一个堆）' }}</div>
        <div class="tree">
          <svg class="edges" width="524" height="280">
            <line
              v-for="e in edges"
              :key="e.i"
              class="edge"
              :x1="e.x1 + '%'"
              :y1="e.y1"
              :x2="e.x2 + '%'"
              :y2="e.y2"
            />
          </svg>
          <span v-if="!h.items.value.length" class="empty-hint">
            {{ english ? 'Heap is empty' : '堆为空' }}
          </span>
          <!-- 树轨：节点按 pos 绝对定位、过渡 left/top；与数组轨同 id 同步移动 -->
          <div
            v-for="nd in laid"
            :key="nd.id"
            class="node"
            :class="{ cmp: cmp.includes(nd.i), hot: hot === nd.i, enter: nd.id === enterId }"
            :data-i="nd.i"
            :style="{ left: nd.xPct + '%', top: nd.top + 'px' }"
          >
            {{ nd.val }}
          </div>
        </div>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.heap-viz {
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

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}
.lane-wrap {
  display: flex;
  justify-content: center;
}
.lane {
  position: relative;
  width: 552px;
  padding: 14px;
  .neumorphism-pressed(4px, 14px);
}
.row-label {
  font-size: 12px;
  font-weight: bold;
  color: #999;
  margin: 2px 0 4px;
}
.cells,
.indices {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 3px;
}
.cell {
  flex: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
  color: #1f5e3a;
  background: #8bd3a0;
  border-radius: 6px;
  box-shadow:
    2px 2px 4px @neumorphis-dark-shadow,
    -2px -2px 4px @neumorphis-light-shadow;
  transition:
    background-color 0.25s,
    color 0.25s;
}
.idx {
  flex: none;
  width: 32px;
  text-align: center;
  font-size: 11px;
  font-weight: bold;
  color: #aaa;
}
.cellmv-move {
  transition: transform 0.42s cubic-bezier(0.4, 1, 0.5, 1);
}
.tree {
  position: relative;
  width: 524px;
  height: 280px;
  margin-top: 6px;
}
.edges {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
.edge {
  stroke: rgba(51, 51, 51, 0.26);
  stroke-width: 2;
}
.node {
  position: absolute;
  width: 40px;
  height: 40px;
  margin-left: -20px;
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
    left 0.42s cubic-bezier(0.4, 1, 0.5, 1),
    top 0.42s cubic-bezier(0.4, 1, 0.5, 1),
    background-color 0.25s,
    color 0.25s,
    transform 0.25s;
  z-index: 1;
}
.node.enter {
  opacity: 0;
  transform: scale(0.2);
}
// 比较交换中：黄、抬层级；两视图同步
.cell.cmp,
.node.cmp {
  background: #ffcf5c;
  color: #6b4e00;
  z-index: 3;
}
// 到位 / 堆顶：深绿
.cell.hot,
.node.hot {
  background: #4caf50;
  color: #ffffff;
  z-index: 3;
}
.empty-hint {
  position: absolute;
  left: 0;
  right: 0;
  top: 120px;
  text-align: center;
  color: #aaa;
  font-size: 14px;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 500px;
  text-align: center;
  color: #555555;
}
</style>
