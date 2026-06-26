<!-- 字典树互动组件：SVG 字符树 + 查找三结局（不存在/只是前缀/是一个词）+ 前缀子树点亮（自动补全） -->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useTrie } from './useTrie';

const t = useTrie();
const word = ref('card');
const status = ref('输入一个词，点「查找」（精确）或「前缀」（看以它开头的词）。');
const litPath = ref<number[]>([]); // 走位点亮
const hotIdx = ref(-1); // 精确命中
const subtreeLit = ref<number[]>([]); // 前缀子树点亮
const busy = ref(false);
let timers: ReturnType<typeof setTimeout>[] = [];
const sleep = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  litPath.value = [];
  hotIdx.value = -1;
  subtreeLit.value = [];
};
const input = () => word.value.trim().toLowerCase();

const onSearch = async () => {
  if (busy.value) return;
  const w = input();
  if (!w) {
    status.value = '先输入一个词。';
    return;
  }
  busy.value = true;
  clearMarks();
  const r = t.search(w); // 同步：三结局
  status.value =
    r.reason === 'found'
      ? `查找 "${w}"：顺着 ${w.length} 个字符走到底，这节点是单词结尾 → "${w}" 是一个词，存在！`
      : r.reason === 'prefix-only'
        ? `查找 "${w}"：走到了，但这节点不是单词结尾 → "${w}" 只是前缀，不算一个词。`
        : `查找 "${w}"：走着走着没有往下的边了 → "${w}" 不存在。`;
  for (let k = 0; k < r.path.length; k++) {
    if (k === r.path.length - 1 && r.found) hotIdx.value = r.path[k];
    else litPath.value = [...litPath.value, r.path[k]];
    await sleep(420);
  }
  busy.value = false;
};
const onPrefix = async () => {
  if (busy.value) return;
  const p = input();
  if (!p) {
    status.value = '先输入一个前缀。';
    return;
  }
  busy.value = true;
  clearMarks();
  const r = t.startsWith(p); // 同步
  if (r.prefixNode === -1) {
    status.value = `前缀 "${p}"：没有任何词以它开头。`;
    busy.value = false;
    return;
  }
  status.value = `前缀 "${p}"：以它开头的词有 ${r.words.length} 个——${r.words.join('、')}。这就是自动补全。`;
  subtreeLit.value = r.subtree; // 同步置子树点亮（L4 可断言）
  for (let k = 0; k < r.path.length; k++) {
    litPath.value = [...litPath.value, r.path[k]];
    await sleep(360);
  }
  busy.value = false;
};
const onReset = () => {
  clearTimers();
  busy.value = false;
  clearMarks();
  status.value = '已重置 · 输入一个词，点「查找」或「前缀」。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="trie-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model="word" type="text" maxlength="6" />
      <button class="btn" :disabled="busy" @click="onSearch">查找</button>
      <button class="btn" :disabled="busy" @click="onPrefix">前缀</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="430" height="320">
          <g class="edges">
            <line
              v-for="(e, i) in t.edges"
              :key="i"
              class="edge"
              :x1="t.nodes[e[0]].x"
              :y1="t.nodes[e[0]].y"
              :x2="t.nodes[e[1]].x"
              :y2="t.nodes[e[1]].y"
            />
          </g>
          <g class="verts">
            <g
              v-for="(n, i) in t.nodes"
              :key="n.id"
              class="tnode"
              :class="{
                path: litPath.includes(i),
                hot: hotIdx === i,
                lit: subtreeLit.includes(i),
                end: n.isEnd,
              }"
              :transform="`translate(${n.x},${n.y})`"
            >
              <circle r="16" />
              <text>{{ n.char }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
.trie-viz {
  width: 100%;
  gap: 16px;
}
.toolbar {
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.val-input {
  width: 90px;
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
  width: 460px;
  padding: 10px;
  .neumorphism-pressed(4px, 14px);
}
.edge {
  stroke: #b9c6bd;
  stroke-width: 2.5;
}
.tnode {
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
// 单词结尾：深绿描边环（标「这是一个词」）
.tnode.end circle {
  stroke: #2e7d32;
}
// 前缀子树点亮：浅绿亮底 + 描边（自动补全候选）
.tnode.lit circle {
  fill: #a8e6b8;
  stroke: #42b883;
}
// 走位中：黄
.tnode.path circle {
  fill: #ffcf5c;
}
.tnode.path text {
  fill: #6b4e00;
}
// 精确命中：深绿 + 白字
.tnode.hot circle {
  fill: #4caf50;
  stroke: #2e7d32;
}
.tnode.hot text {
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
