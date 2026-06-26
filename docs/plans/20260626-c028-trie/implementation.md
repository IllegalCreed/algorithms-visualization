# 实现：字典树 Trie（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260626-028
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useTrie` → `T2 TrieViz` → `T3 新页 + 4 处接线 + 改 2 HOOK` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T1 — `useTrie.ts` 固定词集建 trie + 布局 + 纯 search/startsWith（L3，先写测试）

**先写失败测试** `src/components/structures/useTrie.spec.ts`（`TC-TRIE-LOGIC-*`，10 条，见 test-cases.md）。

**实现** `src/components/structures/useTrie.ts`（见 design §2）：

```ts
export const TRIE_WORDS = ['cat', 'car', 'card', 'cup', 'do', 'dog'];

export interface TNode {
  id: string;
  char: string;
  isEnd: boolean;
  depth: number;
  x: number;
  y: number;
  parent: number;
}
export interface TrieSearchResult {
  path: number[];
  found: boolean;
  reason: 'found' | 'prefix-only' | 'no-edge';
}
export interface PrefixResult {
  path: number[];
  prefixNode: number;
  subtree: number[];
  words: string[];
}
export interface UseTrie {
  nodes: TNode[];
  edges: [number, number][];
  words: string[];
  search: (word: string) => TrieSearchResult;
  startsWith: (prefix: string) => PrefixResult;
}

interface BuildNode {
  char: string;
  isEnd: boolean;
  children: Map<string, BuildNode>;
}

export function useTrie(): UseTrie {
  // 1) 建树
  const root: BuildNode = { char: '', isEnd: false, children: new Map() };
  for (const w of TRIE_WORDS) {
    let cur = root;
    for (const ch of w) {
      if (!cur.children.has(ch))
        cur.children.set(ch, { char: ch, isEnd: false, children: new Map() });
      cur = cur.children.get(ch)!;
    }
    cur.isEnd = true;
  }

  // 2) DFS 前序扁平化 + leaf-packing 布局
  const nodes: TNode[] = [];
  const edges: [number, number][] = [];
  let idc = 0;
  let leafX = 0;
  const layout = (bn: BuildNode, depth: number, parent: number): number => {
    const idx = nodes.length;
    const node: TNode = {
      id: `t${idc++}`,
      char: bn.char,
      isEnd: bn.isEnd,
      depth,
      x: 0,
      y: 30 + depth * 60,
      parent,
    };
    nodes.push(node);
    if (parent >= 0) edges.push([parent, idx]);
    const keys = [...bn.children.keys()].sort();
    if (keys.length === 0) {
      node.x = 50 + leafX * 105;
      leafX += 1;
    } else {
      let sum = 0;
      for (const k of keys) sum += nodes[layout(bn.children.get(k)!, depth + 1, idx)].x;
      node.x = sum / keys.length;
    }
    return idx;
  };
  layout(root, 0, -1);

  // 3) 纯查询
  const childByChar = (parent: number, ch: string): number => {
    for (const [p, c] of edges) if (p === parent && nodes[c].char === ch) return c;
    return -1;
  };
  const descendants = (r: number): number[] => {
    const out = [r];
    for (const [p, c] of edges) if (p === r) out.push(...descendants(c));
    return out;
  };
  const wordOf = (idx: number): string => {
    const chars: string[] = [];
    let cur = idx;
    while (cur > 0) {
      chars.push(nodes[cur].char);
      cur = nodes[cur].parent;
    }
    return chars.reverse().join('');
  };

  const search = (word: string): TrieSearchResult => {
    const path = [0];
    let cur = 0;
    for (const ch of word) {
      const next = childByChar(cur, ch);
      if (next === -1) return { path, found: false, reason: 'no-edge' };
      cur = next;
      path.push(cur);
    }
    return nodes[cur].isEnd
      ? { path, found: true, reason: 'found' }
      : { path, found: false, reason: 'prefix-only' };
  };
  const startsWith = (prefix: string): PrefixResult => {
    const path = [0];
    let cur = 0;
    for (const ch of prefix) {
      const next = childByChar(cur, ch);
      if (next === -1) return { path, prefixNode: -1, subtree: [], words: [] };
      cur = next;
      path.push(cur);
    }
    const subtree = descendants(cur);
    const words = subtree
      .filter((i) => nodes[i].isEnd)
      .map(wordOf)
      .sort();
    return { path, prefixNode: cur, subtree, words };
  };

  const words = nodes
    .filter((n) => n.isEnd)
    .map((_, i) => i)
    .map((i) => wordOf(nodes.findIndex((n) => n === nodes.filter((m) => m.isEnd)[i])));
  // 简化：直接由 isEnd 节点下标回溯
  const allWords = nodes
    .map((n, i) => (n.isEnd ? wordOf(i) : null))
    .filter((w): w is string => w !== null)
    .sort();

  return { nodes, edges, words: allWords, search, startsWith };
}
```

> 注：上方 `words` 中间变量为草稿，最终用 `allWords`（按 isEnd 节点下标回溯 + 排序）= `[car,card,cat,cup,do,dog]`。实现时直接用 `allWords` 赋给返回的 `words`，删除草稿行。

**验证**：`pnpm test:unit run src/components/structures/useTrie.spec.ts`。

---

## T2 — `TrieViz.vue` 查找三结局 + 前缀子树点亮（L4，先写测试）

**先写失败测试** `src/components/structures/TrieViz.spec.ts`（`TC-VIZ-TRIEVIZ-*`，8 条）。`btn` 用稳定子串（查找/前缀/重置）；`setVal` 改输入框；同步断言 status 文本与 `.tnode.lit` 数。

**实现** `src/components/structures/TrieViz.vue`（见 design §3；用 `useTrie` + SVG）。骨架：

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useTrie } from './useTrie';

const t = useTrie();
const word = ref('card');
const status = ref('输入一个词，点「查找」（精确）或「前缀」（看以它开头的词）。');
const litPath = ref<number[]>([]);
const hotIdx = ref(-1);
const subtreeLit = ref<number[]>([]);
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
  if (!w) return;
  busy.value = true;
  clearMarks();
  const r = t.search(w);
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
  if (!p) return;
  busy.value = true;
  clearMarks();
  const r = t.startsWith(p);
  if (r.prefixNode === -1) {
    status.value = `前缀 "${p}"：没有任何词以它开头。`;
    busy.value = false;
    return;
  }
  status.value = `前缀 "${p}"：以它开头的词有 ${r.words.length} 个——${r.words.join('、')}。这就是自动补全。`;
  subtreeLit.value = r.subtree; // 同步：L4 可断言子树点亮
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
/* 圆形字符节点(idle 浅绿/path 黄/hot 深绿/lit 子树描边/end 单词结尾环) + SVG 边；输入框 + 按钮取 HashViz 样式；画布定宽 */
</style>
```

注：`search`/`startsWith` 同步返回 + 同步置 status；前缀子树 `subtreeLit` 同步置（L4 断言）；走位点亮延时（卸载清理、busy 防重入）。**验证**：`pnpm test:unit run src/components/structures/TrieViz.spec.ts`。

---

## T3 — 新页 `Trie.vue` + 4 处接线 + 改 2 HOOK（L4，先写测试）

**先写失败测试**（视图）`src/views/Article/DataStructure/Trie.spec.ts`（`TC-VIEW-TRIE-01/02`，仿 Hash.spec）。

**改 HOOK 计数测试**（计数变化）：`Home/Main/hooks.spec.ts` TC-HOOK-01-2 `toHaveLength(8)`→`9`；`Docs/Menu/hooks.spec.ts` TC-HOOK-02-4 数据结构 `toHaveLength(8)`→`9`（排序仍 8）。

**实现**：

1. `src/views/Article/DataStructure/Trie.vue`（见 design §4：标题 + 正文 + `<Playground><TrieViz/></Playground>` + callout + 与 BST/哈希区别点题）。
2. `src/router/index.ts`：数据结构路由组 + `{ path: '/docs/trie', name: 'trie', component: () => import('../views/Article/DataStructure/Trie.vue') }`（置 graph 之后）。
3. `src/views/Docs/Menu/hooks.ts`：数据结构 children 末（图之后）+ `{ title: '字典树', url: 'trie' }`。
4. `src/views/Home/Main/hooks.ts`：import `TrieIcon from '@/assets/trie.svg'`；数据结构 children 末 + `{ title: '字典树', desc: '把字符摊在边上的前缀树，天生支持前缀匹配/自动补全', icon: TrieIcon, url: 'trie' }`。
5. `src/assets/trie.svg`：1024 viewBox 黑剪影（root + 两层分叉的小前缀树）：

```svg
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <g fill="#333333" stroke="#333333" stroke-width="40" stroke-linecap="round">
    <line x1="512" y1="190" x2="300" y2="450" />
    <line x1="512" y1="190" x2="724" y2="450" />
    <line x1="300" y1="450" x2="200" y2="710" />
    <line x1="300" y1="450" x2="400" y2="710" />
    <line x1="724" y1="450" x2="724" y2="710" />
    <circle cx="512" cy="190" r="72" />
    <circle cx="300" cy="450" r="72" />
    <circle cx="724" cy="450" r="72" />
    <circle cx="200" cy="710" r="72" />
    <circle cx="400" cy="710" r="72" />
    <circle cx="724" cy="710" r="72" />
  </g>
</svg>
```

**验证**：`pnpm test:unit run src/views/Article/DataStructure/Trie.spec.ts src/views/Home/Main/hooks.spec.ts src/views/Docs/Menu/hooks.spec.ts`。

---

## T4 — e2e（L5，Playwright）

新建 `e2e/trie.e2e.ts`（`TC-E2E-TRIE-01`，导航 `/docs/trie`、限定 `.trie-viz`）：11 `.tnode`；输入 `card` 点「查找」→ `.status` 含「词」；输入 `ca` 点「前缀」→ `.status` 含 `car`；点「重置」→ status 复位。**验证**：`pnpm exec playwright test e2e/trie.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（B1 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useTrie 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；建树 + leaf-packing 布局（11 节点/10 边）+ search 三结局（found/prefix-only/no-edge）+ startsWith（ca→[car,card,cat]、do→[do,dog]、xyz→空）+ 词回溯排序，一次通过；草稿 words 中间式删去、改用 allWords
- [x] T2 TrieViz 全绿（8 Case）— search/startsWith 同步返回 + 同步置 status、前缀 subtreeLit 同步置（L4 断言子树点亮 .tnode.lit=4）、走位延时（卸载清理、busy 防重入）、reset 清高亮
- [x] T3 字典树页 TC-VIEW-TRIE-01/02 绿 + 4 处接线（router `/docs/trie` / Menu / Home + TrieIcon / trie.svg）+ 改 2 HOOK（TC-HOOK-01-2、TC-HOOK-02-4 数据结构 8→9）绿；菜单/首页/路由可达（真机验首页字典树卡片 + 图标）
- [x] T4 e2e 全绿（新增 TC-E2E-TRIE-01）— 真机另验：固定字符树、查找 card「是一个词」、前缀 ca 子树点亮 + 自动补全列 car/card/cat、单词结尾环
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Trie.vue/接线文件经 prettier --write）/ coverage All files 92.54%/89.43%/93.46%/93.73%（聚合过门槛）
- [x] 单测 641 passed（94 文件，含新增 20 单测 + 改 2 HOOK）+ e2e 24 passed（含新增 1）；既有 8 结构 + 8 排序 + 播放器 + 骨架零回归；**M4 广度 B1 落地、转广度首项**
