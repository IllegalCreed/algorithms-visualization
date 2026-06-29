# 实现：跳表 Skip List（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260629-032
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序

`T1 useSkipList` → `T2 SkipListViz` → `T3 新页 + 4 处接线 + 改 2 HOOK` → `T4 e2e`。先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T1 — `useSkipList.ts`（L3，先写测试）

**先写失败测试** `src/components/structures/useSkipList.spec.ts`（`TC-SKIP-LOGIC-*`，10 条）。

**实现** `src/components/structures/useSkipList.ts`：

```ts
export const SKIP_VALUES = [1, 3, 5, 7, 9, 11, 13, 15];
export const SKIP_HEIGHTS = [4, 1, 2, 1, 3, 1, 2, 1];
export const SKIP_MAX_LEVEL = 4;

export interface SkipNode {
  id: string;
  value: number;
  height: number;
  col: number;
  isHead: boolean;
}
export interface SkipStep {
  node: number;
  level: number;
  move: 'start' | 'right' | 'down';
}
export interface SkipSearchResult {
  found: boolean;
  path: SkipStep[];
  visitedValues: number[];
}
export interface UseSkipList {
  nodes: SkipNode[];
  maxLevel: number;
  present: (nodeIdx: number, level: number) => boolean;
  levelNodes: (level: number) => number[];
  search: (target: number) => SkipSearchResult;
}

export function useSkipList(): UseSkipList {
  const nodes: SkipNode[] = [
    { id: 'sk-head', value: -Infinity, height: SKIP_MAX_LEVEL, col: 0, isHead: true },
    ...SKIP_VALUES.map((value, i) => ({
      id: `sk${i}`,
      value,
      height: SKIP_HEIGHTS[i],
      col: i + 1,
      isHead: false,
    })),
  ];
  const maxLevel = SKIP_MAX_LEVEL;
  const present = (n: number, lv: number): boolean => lv < nodes[n].height;
  const levelNodes = (lv: number): number[] => nodes.map((_, i) => i).filter((i) => present(i, lv));
  const nextAtLevel = (cur: number, lv: number): number => {
    for (let j = cur + 1; j < nodes.length; j++) if (present(j, lv)) return j;
    return -1;
  };

  const search = (target: number): SkipSearchResult => {
    const path: SkipStep[] = [];
    let cur = 0;
    let level = maxLevel - 1;
    path.push({ node: 0, level, move: 'start' });
    while (level >= 0) {
      let nx = nextAtLevel(cur, level);
      while (nx !== -1 && nodes[nx].value <= target) {
        cur = nx;
        path.push({ node: cur, level, move: 'right' });
        nx = nextAtLevel(cur, level);
      }
      if (level === 0) break;
      level -= 1;
      path.push({ node: cur, level, move: 'down' });
    }
    const found = !nodes[cur].isHead && nodes[cur].value === target;
    const visitedValues = [
      ...new Set(
        path
          .map((s) => nodes[s.node])
          .filter((n) => !n.isHead)
          .map((n) => n.value),
      ),
    ];
    return { found, path, visitedValues };
  };

  return { nodes, maxLevel, present, levelNodes, search };
}
```

**验证**：`pnpm test:unit run src/components/structures/useSkipList.spec.ts`。

---

## T2 — `SkipListViz.vue`（L4，先写测试）

**先写失败测试** `src/components/structures/SkipListViz.spec.ts`（`TC-VIZ-SKIPVIZ-*`，8 条）。`btn` 用稳定子串（查找/重置）；`.val-input`；同步断言 skip-cell 数、status、lit。

**实现** `src/components/structures/SkipListViz.vue`（用 `useSkipList` + SVG 网格）。骨架：

```vue
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
// 所有单元格 (节点,层)
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
  Array.from({ length: sk.maxLevel }, (_, lv) => sk.levelNodes(lv)).flatMap((ids, lv) =>
    ids.slice(0, -1).map((a, k) => ({
      key: `l${lv}-${k}`,
      x1: colX(sk.nodes[a].col),
      x2: colX(sk.nodes[ids[k + 1]].col),
      y: levelY(lv),
    })),
  ),
);
const validVal = (): number | null => (Number.isInteger(target.value) ? target.value : null);

const onSearch = async () => {
  if (busy.value) return;
  const t = validVal();
  if (t === null) return;
  busy.value = true;
  lit.value = new Set();
  hot.value = '';
  const r = sk.search(t);
  status.value = `查找 ${t}：走过 ${r.visitedValues.join(' → ')}，${r.found ? '找到了！' : '没找到（不存在）'}靠上层快车道跳过了中间元素。`;
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
      <button class="btn" :disabled="busy" @click="onReset">重置</button>
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
/* SVG 网格：skip-cell(idle 浅绿/head 灰/lit 黄/hot 深绿) + 同层连线 skip-link；输入/按钮取 HashViz 样式；画布定宽 */
</style>
```

注：`search` 同步返回 + 同步置 status（L4 可断言）；楼梯点亮延时（卸载清理、busy 防重入）。**验证**：`pnpm test:unit run src/components/structures/SkipListViz.spec.ts`。

---

## T3 — 新页 `SkipList.vue` + 4 处接线 + 改 2 HOOK（L4，先写测试）

**先写失败测试**（视图）`src/views/Article/DataStructure/SkipList.spec.ts`（`TC-VIEW-SKIP-01/02`，仿 Lru.spec）。

**改 HOOK 计数**：`Home/Main/hooks.spec.ts` TC-HOOK-01-2 `11`→`12`；`Docs/Menu/hooks.spec.ts` TC-HOOK-02-4 数据结构 `11`→`12`。

**实现**：

1. `SkipList.vue`（见 design §4）。
2. `router/index.ts`：lru 之后 + `{ path: '/docs/skip-list', name: 'skip-list', component: () => import('../views/Article/DataStructure/SkipList.vue') }`。
3. `Docs/Menu/hooks.ts`：数据结构 children 末（LRU 后）+ `{ title: '跳表', url: 'skip-list' }`。
4. `Home/Main/hooks.ts`：import `SkipListIcon from '@/assets/skip-list.svg'`；数据结构 children 末 + `{ title: '跳表', desc: '给有序链表加几层快车道，平均 O(log n)，Redis 有序集合底层', icon: SkipListIcon, url: 'skip-list' }`。
5. `assets/skip-list.svg`：1024 viewBox 黑剪影（三层：底层 5 点、中层 3 点、顶层 2 点 + 同列竖连，象征多层快车道）：

```svg
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <g fill="none" stroke="#333333" stroke-width="34" stroke-linecap="round">
    <line x1="160" y1="300" x2="864" y2="300" />
    <line x1="160" y1="512" x2="864" y2="512" />
    <line x1="160" y1="724" x2="864" y2="724" />
    <line x1="160" y1="300" x2="160" y2="724" />
    <line x1="512" y1="512" x2="512" y2="724" />
    <line x1="864" y1="300" x2="864" y2="724" />
  </g>
  <g fill="#333333">
    <circle cx="160" cy="300" r="60" /><circle cx="864" cy="300" r="60" />
    <circle cx="160" cy="512" r="60" /><circle cx="512" cy="512" r="60" /><circle cx="864" cy="512" r="60" />
    <circle cx="160" cy="724" r="56" /><circle cx="356" cy="724" r="56" /><circle cx="512" cy="724" r="56" /><circle cx="668" cy="724" r="56" /><circle cx="864" cy="724" r="56" />
  </g>
</svg>
```

**验证**：`pnpm test:unit run src/views/Article/DataStructure/SkipList.spec.ts src/views/Home/Main/hooks.spec.ts src/views/Docs/Menu/hooks.spec.ts`。

---

## T4 — e2e（L5）

新建 `e2e/skip-list.e2e.ts`（`TC-E2E-SKIP-01`，导航 `/docs/skip-list`、限定 `.skip-list-viz`）：skip-cell 渲染（>0）；输入 11 查找 → `.status` 含「找到」；输入 8 查找 → `.status` 含「没找到」；重置 → status 复位。**验证**：`pnpm exec playwright test e2e/skip-list.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（B4 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useSkipList 全绿（10 Case）— TDD：先红 → 实现 → 绿；nodes 9/heights/各层数 8·4·2·1 + search 命中·未命中·visitedValues 跳过([1,9,11]/[1,5,7] 等) + path 楼梯单调，一次通过
- [x] T2 SkipListViz 全绿（8 Case）— search 同步返回 + 同步置 status，楼梯点亮/命中 hot/重置；网格 cell 19；found 用「找到了」避「没找到」子串；**修一处**：查找 busy 时重置被 disabled 拦截 → 重置改始终可点（中断）
- [x] T3 跳表页 TC-VIEW-SKIP-01/02 绿 + 4 处接线（router /docs/skip-list / Menu / Home + SkipListIcon / skip-list.svg）+ 改 2 HOOK（TC-HOOK-01-2、TC-HOOK-02-4 数据结构 11→12）绿；菜单/首页/路由可达
- [x] T4 e2e 全绿（新增 TC-E2E-SKIP-01）— 真机另验：查找 11 楼梯走位经高层 1→9 跳过 3/5/7、落 11 命中
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 92.7%/89.75%/93.69%/93.79%（聚合过门槛）
- [x] 单测 703 passed（103 文件，含新增 20 单测 + 改 2 HOOK）+ e2e 27 passed（含新增 1）；既有 11 结构 + 8 排序 + 播放器零回归；**M4 广度 B4 落地**
