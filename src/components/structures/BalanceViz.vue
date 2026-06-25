<!-- 平衡互动组件：同 7 个值「退化的链 ↔ 平衡的树」对照 + 查找走位（讲为什么要平衡） -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useBalance } from './useBalance';

const b = useBalance();
const mode = ref<'chain' | 'balanced'>('chain');
const litPath = ref<number[]>([]); // 走位经过（黄）
const hotIdx = ref(-1); // 命中（深绿）
const busy = ref(false);
const status = ref('同样是 1–7 七个值。点「查找 7」看走几步。');
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const cur = computed(() => (mode.value === 'chain' ? b.chain : b.balanced));

const onMode = (m: 'chain' | 'balanced') => {
  if (busy.value) return;
  mode.value = m;
  litPath.value = [];
  hotIdx.value = -1;
  status.value =
    m === 'chain'
      ? '按顺序插入，全挂右边 → 一条链。点「查找 7」看走几步。'
      : '同样 7 个值，平衡后矮胖。点「查找 7」对比走几步。';
};
const onFind = async () => {
  if (busy.value) return;
  busy.value = true;
  litPath.value = [];
  hotIdx.value = -1;
  const r = b.search(7, mode.value);
  status.value =
    mode.value === 'chain'
      ? `查找 7：从根一路比下来，走了 ${r.steps} 步才到 —— 最坏 O(n)，链表速度。`
      : `查找 7：${r.steps} 步到（4 → 6 → 7）—— O(log n)。同样的值，平衡后快得多。`;
  for (let k = 0; k < r.path.length; k++) {
    if (k === r.path.length - 1) hotIdx.value = r.path[k];
    else litPath.value = [...litPath.value, r.path[k]];
    await sleep(560);
  }
  busy.value = false;
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="bal-viz column center">
    <div class="toolbar row-wrap">
      <button
        class="btn"
        :class="{ on: mode === 'chain' }"
        :disabled="busy"
        @click="onMode('chain')"
      >
        顺序插入（退化）
      </button>
      <button
        class="btn"
        :class="{ on: mode === 'balanced' }"
        :disabled="busy"
        @click="onMode('balanced')"
      >
        平衡的树
      </button>
      <button class="btn find" :disabled="busy" @click="onFind">查找 7</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="404" height="296">
          <g class="edges">
            <line
              v-for="(e, i) in cur.edges"
              :key="i"
              class="edge"
              :x1="cur.nodes[e[0]].x"
              :y1="cur.nodes[e[0]].y"
              :x2="cur.nodes[e[1]].x"
              :y2="cur.nodes[e[1]].y"
            />
          </g>
          <g class="verts">
            <g
              v-for="(n, i) in cur.nodes"
              :key="n.id"
              class="node"
              :class="{ path: litPath.includes(i), hot: hotIdx === i }"
              :transform="`translate(${n.x},${n.y})`"
            >
              <circle r="17" />
              <text>{{ n.value }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="readout">
      高度 <span :class="mode === 'chain' ? 'bad' : 'good'">{{ cur.height }} 层</span> · 最坏查找
      <span :class="mode === 'chain' ? 'bad' : 'good'">{{ cur.worst }} 次</span>
      <span class="note">（{{ mode === 'chain' ? '退回 O(n)，和链表一样慢' : 'O(log n)' }}）</span>
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.bal-viz {
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
// toggle 选中：内凹 + 主题绿字
.btn.on {
  color: @font-highlight-color;
  .neumorphism-pressed(4px, 12px);
}
.btn.find {
  color: #1f7a44;
}
.lane-wrap {
  display: flex;
  justify-content: center;
}
.lane {
  width: 420px;
  height: 300px;
  padding: 8px;
  .neumorphism-pressed(4px, 14px);
}
.edge {
  stroke: rgba(51, 51, 51, 0.26);
  stroke-width: 2.5;
}
.node circle {
  fill: #8bd3a0;
  stroke: transparent;
  stroke-width: 3;
  transition:
    fill 0.3s,
    stroke 0.3s;
}
.node text {
  fill: #1f5e3a;
  font-weight: bold;
  font-size: 14px;
  text-anchor: middle;
  dominant-baseline: central;
}
.node.path circle {
  fill: #ffcf5c;
}
.node.path text {
  fill: #6b4e00;
}
.node.hot circle {
  fill: #4caf50;
  stroke: #ffffff;
}
.node.hot text {
  fill: #ffffff;
}
.readout {
  font-size: 15px;
  font-weight: bold;
  color: #555555;
}
.readout .bad {
  color: #ff8a65;
}
.readout .good {
  color: #4caf50;
}
.readout .note {
  color: #999;
  font-weight: normal;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 460px;
  text-align: center;
  color: #555555;
}
</style>
