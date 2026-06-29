<!-- B+ 树互动组件：SVG 多 key 宽框节点 + root→叶 子指针 + 叶链；查找多路下钻点亮（绿）+ 范围叶链横扫点亮（黄） -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBTree } from './useBTree';

const bt = useBTree();
const a = ref(30);
const b = ref(38);
const status = ref('填 a 点「查找」看从根下钻几层就命中；填 a、b 点「范围查」看顺着叶链横扫一段。');
const onpath = ref<Set<string>>(new Set()); // 下钻路径 / 范围涉及叶（节点 id）
const hit = ref<Set<string>>(new Set()); // 查找命中 key（`${leafId}:${key}`）
const inrange = ref<Set<string>>(new Set()); // 范围命中 key
const flow = ref<Set<string>>(new Set()); // 范围扫描点亮的叶链（`lnk-${fromLeafId}`）

const KW = 34;
const KH = 30;
const layout: Record<string, { x: number; y: number }> = {
  'bt-root': { x: 236, y: 46 },
  'bt-l0': { x: 20, y: 160 },
  'bt-l1': { x: 202, y: 160 },
  'bt-l2': { x: 384, y: 160 },
};
const cx = (id: string) => layout[id].x + (bt.byId(id).keys.length * KW) / 2;

// 节点（带坐标 + 宽度）
const verts = computed(() =>
  bt.nodes.map((n) => ({ ...n, x: layout[n.id].x, y: layout[n.id].y, w: n.keys.length * KW })),
);
// root → 叶 子指针
const childLines = computed(() => {
  const root = bt.byId('bt-root');
  return root.childrenIds.map((cid) => ({
    key: `c-${cid}`,
    x1: cx('bt-root'),
    y1: layout['bt-root'].y + KH,
    x2: cx(cid),
    y2: layout[cid].y,
  }));
});
// 叶链（相邻叶之间）
const leafLinks = computed(() =>
  bt.nodes
    .filter((n) => n.isLeaf && n.nextId)
    .map((n) => ({
      id: `lnk-${n.id}`,
      x1: layout[n.id].x + n.keys.length * KW,
      y1: layout[n.id].y + KH / 2,
      x2: layout[n.nextId as string].x,
      y2: layout[n.nextId as string].y + KH / 2,
    })),
);

const onSearch = () => {
  const t = a.value;
  if (!Number.isInteger(t)) {
    status.value = '请输入一个整数 a。';
    return;
  }
  const r = bt.search(t);
  onpath.value = new Set(r.path);
  hit.value = r.found ? new Set([`${r.leafId}:${t}`]) : new Set();
  inrange.value = new Set();
  flow.value = new Set();
  status.value = r.found
    ? `查找 ${t}：从根下钻 ${r.path.length} 层就到叶子，找到了 ${t}。`
    : `查找 ${t}：下钻到对应叶子，${t} 不存在。`;
};

const onRange = () => {
  const lo = a.value;
  const hi = b.value;
  if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo > hi) {
    status.value = '请输入合法区间整数：a ≤ b。';
    return;
  }
  const r = bt.rangeScan(lo, hi);
  onpath.value = new Set(r.leafPath);
  hit.value = new Set();
  const cells = new Set<string>();
  for (const leafId of r.leafPath)
    for (const k of bt.byId(leafId).keys) if (k >= lo && k <= hi) cells.add(`${leafId}:${k}`);
  inrange.value = cells;
  const links = new Set<string>();
  for (let i = 0; i < r.leafPath.length - 1; i++) links.add(`lnk-${r.leafPath[i]}`);
  flow.value = links;
  status.value = `范围查 [${lo}, ${hi}]：定位起点叶后顺着叶链扫到 ${r.values.length} 个值${
    r.values.length ? '：' + r.values.join(', ') : ''
  }。`;
};

const onReset = () => {
  onpath.value = new Set();
  hit.value = new Set();
  inrange.value = new Set();
  flow.value = new Set();
  status.value = '已重置 · 填 a 点「查找」，或填 a、b 点「范围查」。';
};
</script>

<template>
  <div class="b-tree-viz column center">
    <div class="toolbar row-wrap">
      <label class="lab">a</label>
      <input class="val-input in-a" v-model.number="a" type="number" />
      <label class="lab">b</label>
      <input class="val-input in-b" v-model.number="b" type="number" />
      <button class="btn" @click="onSearch">查找</button>
      <button class="btn" @click="onRange">范围查</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="540" height="230">
          <defs>
            <marker id="bt-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#b9a36a" />
            </marker>
          </defs>
          <g class="children">
            <line
              v-for="l in childLines"
              :key="l.key"
              class="bt-child"
              :x1="l.x1"
              :y1="l.y1"
              :x2="l.x2"
              :y2="l.y2"
            />
          </g>
          <g class="links">
            <line
              v-for="l in leafLinks"
              :key="l.id"
              class="bt-link"
              :class="{ flow: flow.has(l.id) }"
              :x1="l.x1"
              :y1="l.y1"
              :x2="l.x2"
              :y2="l.y2"
              marker-end="url(#bt-arrow)"
            />
          </g>
          <g class="nodes">
            <g
              v-for="n in verts"
              :key="n.id"
              class="bt-node"
              :class="{ onpath: onpath.has(n.id), leaf: n.isLeaf }"
              :transform="`translate(${n.x},${n.y})`"
            >
              <rect class="node-frame" x="0" y="0" :width="n.w" :height="KH" rx="6" />
              <g
                v-for="(k, i) in n.keys"
                :key="`${n.id}:${k}`"
                class="bt-key"
                :class="{ hit: hit.has(`${n.id}:${k}`), inrange: inrange.has(`${n.id}:${k}`) }"
                :transform="`translate(${i * KW},0)`"
              >
                <rect class="cell" x="0" y="0" :width="KW" :height="KH" />
                <text :x="KW / 2" :y="KH / 2">{{ k }}</text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.b-tree-viz {
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
  width: 560px;
  padding: 10px;
  .neumorphism-pressed(4px, 14px);
}
.bt-child {
  stroke: #c2cdc6;
  stroke-width: 2.5;
}
.bt-link {
  stroke: #c9b87f;
  stroke-width: 2.5;
  stroke-dasharray: 5 4;
  transition: stroke 0.25s;
}
.bt-link.flow {
  stroke: #f0a000;
  stroke-dasharray: none;
  stroke-width: 3.5;
}
.node-frame {
  fill: transparent;
  stroke: transparent;
  stroke-width: 3;
  transition: stroke 0.25s;
}
.bt-node.onpath .node-frame {
  stroke: #2e7d32;
}
.bt-key {
  .cell {
    fill: #8bd3a0;
    stroke: #ffffff;
    stroke-width: 1.5;
    transition: fill 0.25s;
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
.bt-node.leaf .bt-key .cell {
  fill: #aee0bb;
}
.bt-key.hit .cell {
  fill: #4caf50;
}
.bt-key.hit text {
  fill: #ffffff;
}
.bt-key.inrange .cell {
  fill: #ffcf5c;
}
.bt-key.inrange text {
  fill: #6b4e00;
}
.status {
  font-weight: bold;
  font-size: 15px;
  min-height: 44px;
  max-width: 540px;
  text-align: center;
  color: #555555;
}
</style>
