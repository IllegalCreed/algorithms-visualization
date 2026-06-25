# 实现：树 Tree 知识页（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260625-019
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 useTree` → `T2 TreeViz` → `T3 树页` → `T4 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。骨架与 `TreeView.vue` 复用、零改动、不重测。

---

## T1 — `useTree.ts` BST 逻辑（L3，先写测试）

**先写失败测试** `src/components/structures/useTree.spec.ts`（`TC-TREE-LOGIC-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { useTree } from './useTree';

describe('useTree', () => {
  it('TC-TREE-LOGIC-01 初始平衡树 50/30/70/20/40/60/80、pos 正确', () => {
    const t = useTree();
    expect(t.nodes.value).toHaveLength(7);
    expect(t.nodeAt(0)?.value).toBe(50);
    expect(t.nodeAt(1)?.value).toBe(30);
    expect(t.nodeAt(2)?.value).toBe(70);
    expect(t.nodeAt(6)?.value).toBe(80);
  });
  it('TC-TREE-LOGIC-02 has 命中/未命中', () => {
    const t = useTree();
    expect(t.has(50)).toBe(true);
    expect(t.has(99)).toBe(false);
  });
  it('TC-TREE-LOGIC-03 insert 走位落正确 pos + 返回 path', () => {
    const t = useTree();
    const r = t.insert(35);
    expect(r.ok).toBe(true);
    expect(r.pos).toBe(9);
    expect(r.path).toEqual([0, 1, 4]);
    expect(t.nodeAt(9)?.value).toBe(35);
    expect(t.nodes.value).toHaveLength(8);
  });
  it('TC-TREE-LOGIC-04 insert 查重返回 dup、不增', () => {
    const t = useTree();
    const r = t.insert(50);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('dup');
    expect(t.nodes.value).toHaveLength(7);
  });
  it('TC-TREE-LOGIC-05 insert 维持 BST：任意插入后 inorder 升序', () => {
    const t = useTree();
    [35, 10, 90, 45].forEach((v) => t.insert(v));
    const io = t.inorder();
    expect(io).toEqual([...io].sort((a, b) => a - b));
    expect(io).toContain(35);
  });
  it('TC-TREE-LOGIC-06 insert 超 4 层返回 depth', () => {
    const t = useTree();
    expect(t.insert(90).ok).toBe(true); // 落 pos14（第 4 层）
    const r = t.insert(95);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('depth');
    expect(r.path).toEqual([0, 2, 6, 14]);
  });
  it('TC-TREE-LOGIC-07 search 命中返回 found + path', () => {
    const t = useTree();
    const r = t.search(60);
    expect(r.found).toBe(true);
    expect(r.pos).toBe(5);
    expect(r.path).toEqual([0, 2, 5]);
  });
  it('TC-TREE-LOGIC-08 search 未命中返回 false + 走到空位的 path', () => {
    const t = useTree();
    const r = t.search(55);
    expect(r.found).toBe(false);
    expect(r.path).toEqual([0, 2, 5]);
  });
  it('TC-TREE-LOGIC-09 inorder 初始 = 升序', () => {
    const t = useTree();
    expect(t.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
  it('TC-TREE-LOGIC-10 reset 复位 7 节点、清插入', () => {
    const t = useTree();
    t.insert(35);
    t.insert(10);
    t.reset();
    expect(t.nodes.value).toHaveLength(7);
    expect(t.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
```

**实现** `src/components/structures/useTree.ts`（见 design §2）：

```ts
import { ref, type Ref } from 'vue';

/** 限 4 层：完全二叉树 pos 0..14（第 4 层 8 个槽） */
export const TREE_MAX_POS = 14;

export interface TreeNode {
  id: string;
  value: number;
  pos: number; // 完全二叉树位序号：根=0，左=2·pos+1，右=2·pos+2
}
export interface InsertResult {
  ok: boolean;
  reason?: 'dup' | 'depth';
  pos?: number;
  path: number[];
}
export interface SearchResult {
  found: boolean;
  pos?: number;
  path: number[];
}
export interface UseTree {
  nodes: Ref<TreeNode[]>;
  has: (value: number) => boolean;
  nodeAt: (pos: number) => TreeNode | undefined;
  insert: (value: number) => InsertResult;
  search: (value: number) => SearchResult;
  inorder: () => number[];
  reset: () => void;
}

const INITIAL = [50, 30, 70, 20, 40, 60, 80];

export function useTree(): UseTree {
  let idn = 0;
  const nodes = ref<TreeNode[]>([]);
  const nodeAt = (pos: number): TreeNode | undefined => nodes.value.find((n) => n.pos === pos);
  const has = (value: number): boolean => nodes.value.some((n) => n.value === value);

  const place = (value: number): InsertResult => {
    let pos = 0;
    const path: number[] = [];
    while (nodeAt(pos)) {
      path.push(pos);
      pos = value < nodeAt(pos)!.value ? 2 * pos + 1 : 2 * pos + 2;
      if (pos > TREE_MAX_POS) return { ok: false, reason: 'depth', path };
    }
    nodes.value.push({ id: `t${idn++}`, value, pos });
    return { ok: true, pos, path };
  };
  const insert = (value: number): InsertResult => {
    if (has(value)) return { ok: false, reason: 'dup', path: [] };
    return place(value);
  };
  const search = (value: number): SearchResult => {
    let pos = 0;
    const path: number[] = [];
    while (nodeAt(pos)) {
      const nd = nodeAt(pos)!;
      path.push(pos);
      if (nd.value === value) return { found: true, pos, path };
      pos = value < nd.value ? 2 * pos + 1 : 2 * pos + 2;
    }
    return { found: false, path };
  };
  const inorder = (): number[] => {
    const acc: number[] = [];
    const walk = (pos: number): void => {
      const nd = nodeAt(pos);
      if (!nd) return;
      walk(2 * pos + 1);
      acc.push(nd.value);
      walk(2 * pos + 2);
    };
    walk(0);
    return acc;
  };
  const reset = (): void => {
    nodes.value = [];
    for (const v of INITIAL) place(v);
  };

  reset();
  return { nodes, has, nodeAt, insert, search, inorder, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useTree.spec.ts`。

---

## T2 — `TreeViz.vue` 树互动组件（L4，先写测试）

**先写失败测试** `src/components/structures/TreeViz.spec.ts`（`TC-VIZ-TREEVIZ-*`；树用绝对定位、无 TransitionGroup，无需 stub）：

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeViz from './TreeViz.vue';

const mountIt = () => mount(TreeViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('TreeViz', () => {
  it('TC-VIZ-TREEVIZ-01 初始 7 节点 + 6 边 + 输入框 + 4 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.findAll('.edge')).toHaveLength(6);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '中序遍历')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-TREEVIZ-02 insert 增节点、含新值', async () => {
    const w = mountIt();
    await setVal(w, 35);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.node')).toHaveLength(8);
    expect(w.findAll('.node').some((n) => n.text() === '35')).toBe(true);
  });
  it('TC-VIZ-TREEVIZ-03 insert 查重不增、解说已存在', async () => {
    const w = mountIt();
    await setVal(w, 50);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.find('.status').text()).toContain('已经在树里');
  });
  it('TC-VIZ-TREEVIZ-04 search 找到解说', async () => {
    const w = mountIt();
    await setVal(w, 60);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('找到');
  });
  it('TC-VIZ-TREEVIZ-05 search 没找到解说', async () => {
    const w = mountIt();
    await setVal(w, 55);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('没找到');
  });
  it('TC-VIZ-TREEVIZ-06 中序遍历解说含升序序列', async () => {
    const w = mountIt();
    await btn(w, '中序遍历').trigger('click');
    expect(w.find('.status').text()).toContain('20 30 40 50 60 70 80');
  });
  it('TC-VIZ-TREEVIZ-07 超 4 层解说上限', async () => {
    const w = mountIt();
    await setVal(w, 90);
    await btn(w, '插入').trigger('click');
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('上限');
  });
  it('TC-VIZ-TREEVIZ-08 reset 复位 7 节点', async () => {
    const w = mountIt();
    await setVal(w, 35);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.node')).toHaveLength(7);
  });
  it('TC-VIZ-TREEVIZ-09 非法值提示、不增', async () => {
    const w = mountIt();
    await setVal(w, 0);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('请输入');
    expect(w.findAll('.node')).toHaveLength(7);
  });
  it('TC-VIZ-TREEVIZ-10 边数 = 节点数 - 1', async () => {
    const w = mountIt();
    await setVal(w, 35);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.edge')).toHaveLength(7);
  });
});
```

**实现** `src/components/structures/TreeViz.vue`（见 design §3；用 `useTree` + 照搬 `TreeView.vue` 定位公式）。骨架：

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useTree } from './useTree';

const LEVEL_H = 70;
const t = useTree();
const val = ref(35);
const status = ref('输入一个 1–99 的数，点「插入」看它走到哪、落在哪。');
const pathSet = ref<number[]>([]); // 走位高亮中的 pos
const foundPos = ref(-1);
const enterId = ref<string | null>(null);
let timers: ReturnType<typeof setTimeout>[] = [];
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const clearMarks = () => {
  pathSet.value = [];
  foundPos.value = -1;
};

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
    status.value = '请输入 1–99 的整数。';
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
    status.value = `${v} 已经在树里了（BST 不放重复值）。`;
    return;
  }
  if (!r.ok && r.reason === 'depth') {
    status.value = '这一支已到演示深度上限（限 4 层）。换个值或重置试试。';
    animatePath(r.path);
    return;
  }
  enterId.value = t.nodeAt(r.pos!)?.id ?? null;
  status.value = `插入 ${v}：比较 ${r.path.length} 次、走到空位落子。每层排除一半，O(log n)。`;
  animatePath(r.path, () => (enterId.value = null));
};
const onSearch = () => {
  const v = validVal();
  if (v === null) return;
  const r = t.search(v);
  status.value = r.found
    ? `找到 ${v}！只比较了 ${r.path.length} 次，O(log n)。`
    : `没找到 ${v}：走到空位就停了（比较 ${r.path.length} 次）。`;
  animatePath(r.path, () => {
    if (r.found) foundPos.value = r.pos!;
  });
};
const onInorder = () => {
  if (!t.nodes.value.length) return;
  const seq = t.inorder();
  status.value = `中序遍历 = ${seq.join(' ')} —— 正好是升序！这是 BST 的招牌性质。`;
  clearTimers();
  clearMarks();
  // 按中序顺序逐个点亮（纯视觉）
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
  status.value = '已重置 · 输入一个 1–99 的数，点「插入」或「查找」。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="tree-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="val" type="number" min="1" max="99" />
      <button class="btn" @click="onInsert">插入</button>
      <button class="btn" @click="onSearch">查找</button>
      <button class="btn" @click="onInorder">中序遍历</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <span v-if="!t.nodes.value.length" class="empty-hint">树为空</span>
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
/* 输入框内凹、圆形节点新拟物、path 黄放大、found 深绿放大、SVG 边、画布 520×300 定宽定高；取原型样式 */
</style>
```

注：定位公式照搬 `TreeView.vue`；数据变更同步、动画为叠加 CSS 类（setTimeout 推进、卸载清理）、**无 busy 阻塞**（L4 同步断言）。**验证**：`pnpm test:unit run src/components/structures/TreeViz.spec.ts`。

---

## T3 — `Tree.vue` 树页（L4，先写测试）

**先写失败测试** `src/views/Article/DataStructure/Tree.spec.ts`（`TC-VIEW-TREE-*`）：

- `-01` 挂载渲染 `Article` + `TreeViz`（`findComponent` 存在）。
- `-02` 含「树」标题与 `Playground`（`.playground` 存在）。

**实现**：填充 `Tree.vue`（见 design §4 大纲；`<Article>` 套正文 + `<Playground><TreeViz/></Playground>` + `<Callout>`），正文以原型文案为基础。**验证**：`pnpm test:unit run src/views/Article/DataStructure/Tree.spec.ts`。

---

## T4 — e2e（L5，Playwright）

`e2e/tree.e2e.ts`（`TC-E2E-TREE-01`）：导航 `/docs/tree`、见标题「树」与 `.playground`；限定 `.tree-viz` 内：初始 7 节点；填输入框 `35` 点插入见 8 节点且有节点文本 `35`；点中序遍历 status 含「20 30 40 50」升序；重置回 7 节点。（菜单也用 `.btn`，全部限定 `.tree-viz`/`.article`。）**验证**：`pnpm exec playwright test e2e/tree.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 useTree 全绿（10 Case）— TDD：先红（模块缺失）→ 实现 → 绿；BST insert/search/inorder/place 走位一次通过
- [x] T2 TreeViz 全绿（10 Case）— 一次通过；数据变更同步、动画为叠加 CSS 类（setTimeout 卸载清理）、无 busy 阻塞 → L4 同步断言；定位公式照搬 TreeView.vue
- [x] T3 树页全绿（2 Case）
- [x] T4 e2e 全绿（TC-E2E-TREE-01）— 中途修正 e2e 自身断言笔误（插入 35 后中序是 `20 30 35 40 50…`，含 35，非 `20 30 40 50`），实现正确；真机另验（dev server 截图）：二维 BST `50/30/70/20/40/60/80` 圆形节点 + SVG 父子边按 pos 精确定位、走位插入 O(log n)、中序=升序
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓（Tree.vue 经 prettier --write）/ coverage All files 94.15%/91.65%/90.88%/95.09%（stmts/branch/funcs/lines，均过门槛）；TreeViz 98.8% 行覆盖
- [x] 单测 462 passed（72 文件，含新增 22 单测 Case）+ e2e 15 passed（含新增 1）；8 排序 + 栈 + 队列 + 数组 + 链表 + 播放器 + TreeView 全部现有 Case 零回归；**骨架（article/）与 TreeView 零改动**
