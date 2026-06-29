<!-- 跳表互动组件：SVG 网格（列=元素、行=层）+ 同层连线 + 楼梯式查找（右走→下沉），高层快车道跳过中间元素 -->
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useSkipList } from './useSkipList';

const sk = useSkipList();
const target = ref(11);
const status = ref('输入一个值「查找」——看它怎么在高层快车道上大步跳。');
const lit = ref<Set<string>>(new Set()); // 'col-level'
const hot = ref(''); // 命中 cell 'col-level'
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const colX = (c: number) => 28 + c * 54;
const levelY = (lv: number) => 18 + (sk.maxLevel - 1 - lv) * 46;
// 所有单元格 (节点, 层)
const cells = computed(() =>
  sk.nodes.flatMap((n, i) =>
    Array.from({ length: n.height }, (_, lv) => ({
      key: `${n.col}-${lv}`,
      node: i,
      col: n.col,
      level: lv,
      value: n.value,
      isHead: n.isHead,
    })),
  ),
);
// 每层相邻 present 节点连线
const links = computed(() =>
  Array.from({ length: sk.maxLevel }, (_, lv) => ({ lv, ids: sk.levelNodes(lv) })).flatMap(
    ({ lv, ids }) =>
      ids.slice(0, -1).map((a, k) => ({
        key: `l${lv}-${k}`,
        x1: colX(sk.nodes[a].col),
        x2: colX(sk.nodes[ids[k + 1]].col),
        y: levelY(lv),
      })),
  ),
);

const onSearch = async () => {
  if (busy.value) return;
  if (!Number.isInteger(target.value)) {
    status.value = '请输入一个整数。';
    return;
  }
  const t = target.value;
  busy.value = true;
  lit.value = new Set();
  hot.value = '';
  const r = sk.search(t);
  status.value = `查找 ${t}：走过 ${r.visitedValues.join(' → ')}，${r.found ? '找到了！' : '没找到（不存在）。'}靠上层快车道跳过了中间元素。`;
  for (const step of r.path) {
    lit.value = new Set([...lit.value, `${sk.nodes[step.node].col}-${step.level}`]);
    await sleep(420);
  }
  if (r.found) {
    const last = r.path[r.path.length - 1];
    hot.value = `${sk.nodes[last.node].col}-${last.level}`;
  }
  busy.value = false;
};
const onReset = () => {
  clearTimers();
  busy.value = false;
  lit.value = new Set();
  hot.value = '';
  status.value = '已重置 · 输入一个值「查找」看楼梯走位。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="skip-list-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="target" type="number" />
      <button class="btn" :disabled="busy" @click="onSearch">查找</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="500" height="210">
          <g class="links">
            <line
              v-for="l in links"
              :key="l.key"
              class="skip-link"
              :x1="l.x1"
              :y1="l.y"
              :x2="l.x2"
              :y2="l.y"
            />
          </g>
          <g class="cells">
            <g
              v-for="c in cells"
              :key="c.key"
              class="skip-cell"
              :class="{ lit: lit.has(c.key), hot: hot === c.key, head: c.isHead }"
              :transform="`translate(${colX(c.col)},${levelY(c.level)})`"
            >
              <rect x="-20" y="-15" width="40" height="30" rx="7" />
              <text>{{ c.isHead ? 'H' : c.value }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.skip-list-viz {
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
  width: 520px;
  padding: 10px;
  .neumorphism-pressed(4px, 14px);
}
.skip-link {
  stroke: #b9c6bd;
  stroke-width: 2.5;
}
.skip-cell {
  rect {
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
.skip-cell.head rect {
  fill: #cfd8d2;
}
.skip-cell.head text {
  fill: #5b6b62;
}
.skip-cell.lit rect {
  fill: #ffcf5c;
}
.skip-cell.lit text {
  fill: #6b4e00;
}
.skip-cell.hot rect {
  fill: #4caf50;
  stroke: #2e7d32;
}
.skip-cell.hot text {
  fill: #ffffff;
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
