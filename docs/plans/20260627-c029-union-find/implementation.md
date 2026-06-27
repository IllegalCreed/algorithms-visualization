# 实现：并查集 Union-Find（TDD 任务分解 T1–T4）

> Status: verified
> Stable ID: C-20260627-029
> Owner: IllegalCreed
> Created: 2026-06-27
> Last reviewed: 2026-06-27
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序

`T1 useUnionFind` → `T2 UnionFindViz` → `T3 新页 + 4 处接线 + 改 2 HOOK` → `T4 e2e`。先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T1 — `useUnionFind.ts`（L3，先写测试）

**先写失败测试** `src/components/structures/useUnionFind.spec.ts`（`TC-UF-LOGIC-*`，10 条，见 test-cases.md）。

**实现** `src/components/structures/useUnionFind.ts`：

```ts
import { ref, computed, type Ref, type ComputedRef } from 'vue';

export const UF_SIZE = 8; // 元素 0..7

export interface FindResult {
  root: number;
  path: number[];
}
export interface UnionResult {
  merged: boolean;
  root: number;
  child: number;
}
export interface UseUnionFind {
  parent: Ref<number[]>;
  groupCount: ComputedRef<number>;
  find: (x: number) => FindResult;
  union: (a: number, b: number) => UnionResult;
  connected: (a: number, b: number) => boolean;
  compress: (x: number) => FindResult;
  reset: () => void;
}

const initial = (): number[] => Array.from({ length: UF_SIZE }, (_, i) => i);

export function useUnionFind(): UseUnionFind {
  const parent = ref<number[]>(initial());
  const groupCount = computed(() => parent.value.filter((p, i) => p === i).length);

  const find = (x: number): FindResult => {
    const path = [x];
    let cur = x;
    while (parent.value[cur] !== cur) {
      cur = parent.value[cur];
      path.push(cur);
    }
    return { root: cur, path };
  };
  const union = (a: number, b: number): UnionResult => {
    const ra = find(a).root;
    const rb = find(b).root;
    if (ra === rb) return { merged: false, root: ra, child: -1 };
    parent.value[ra] = rb; // rootA → rootB
    return { merged: true, root: rb, child: ra };
  };
  const connected = (a: number, b: number): boolean => find(a).root === find(b).root;
  const compress = (x: number): FindResult => {
    const { root, path } = find(x);
    for (const n of path) if (n !== root) parent.value[n] = root; // 沿途直接指根
    return { root, path };
  };
  const reset = (): void => {
    parent.value = initial();
  };

  return { parent, groupCount, find, union, connected, compress, reset };
}
```

**验证**：`pnpm test:unit run src/components/structures/useUnionFind.spec.ts`。

---

## T2 — `UnionFindViz.vue`（L4，先写测试）

**先写失败测试** `src/components/structures/UnionFindViz.spec.ts`（`TC-VIZ-UFVIZ-*`，8 条）。两输入用 `.val-input`（[0]=a、[1]=b）；`btn` 用稳定子串（合并/查根/连通/重置）；同步断言 ufnode/uf-edge 数、readout、status（操作同步、无锁、多操作直接生效）。

**实现** `src/components/structures/UnionFindViz.vue`（用 `useUnionFind` + SVG 固定节点 + 父指针弧线）。骨架：

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useUnionFind, UF_SIZE } from './useUnionFind';

const uf = useUnionFind();
const valA = ref(0);
const valB = ref(1);
const status = ref('选两个元素「合并」，或「查根 / 连通?」试试。一开始 8 个元素各自成组。');
const litPath = ref<number[]>([]);
const litRoot = ref(-1);
let timers: ReturnType<typeof setTimeout>[] = [];
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};
const flash = (path: number[], root: number) => {
  litPath.value = path;
  litRoot.value = root;
  timers.push(
    setTimeout(() => {
      litPath.value = [];
      litRoot.value = -1;
    }, 900),
  );
};
const posX = (i: number) => 35 + i * 50;
const posY = 175;
const arc = (i: number, j: number) => {
  const x1 = posX(i);
  const x2 = posX(j);
  const mx = (x1 + x2) / 2;
  const my = posY - 55 - Math.abs(i - j) * 9;
  return `M ${x1} ${posY - 16} Q ${mx} ${my} ${x2} ${posY - 16}`;
};
const ok = (v: number) => Number.isInteger(v) && v >= 0 && v < UF_SIZE;

const onUnion = () => {
  if (!ok(valA.value) || !ok(valB.value)) {
    status.value = `请输入 0–${UF_SIZE - 1} 的元素。`;
    return;
  }
  const r = uf.union(valA.value, valB.value);
  status.value = r.merged
    ? `合并 ${valA.value} 和 ${valB.value}：把根 ${r.child} 指向根 ${r.root}，两组并成一组。`
    : `${valA.value} 和 ${valB.value} 已经在同一组，无需合并。`;
  flash([], r.root);
};
const onFind = () => {
  if (!ok(valA.value)) return;
  const fr = uf.find(valA.value);
  if (fr.root === valA.value) {
    status.value = `查根 ${valA.value}：它本身就是根（走 0 步）。`;
  } else {
    uf.compress(valA.value); // 同步路径压缩
    status.value = `查根 ${valA.value}：走 ${fr.path.length - 1} 步到根 ${fr.root}；路径压缩——把沿途节点直接指向根 ${fr.root}，下次一步到位。`;
  }
  flash(fr.path, fr.root);
};
const onConnected = () => {
  if (!ok(valA.value) || !ok(valB.value)) return;
  const c = uf.connected(valA.value, valB.value);
  status.value = c
    ? `连通？${valA.value} 和 ${valB.value} 同根，在同一组——连通。`
    : `连通？${valA.value} 和 ${valB.value} 根不同，不在同一组——不连通。`;
  flash([...uf.find(valA.value).path, ...uf.find(valB.value).path], -1);
};
const onReset = () => {
  clearTimers();
  litPath.value = [];
  litRoot.value = -1;
  uf.reset();
  status.value = '已重置 · 8 个元素各自成组。';
};
onUnmounted(clearTimers);
</script>

<template>
  <div class="union-find-viz column center">
    <div class="toolbar row-wrap">
      <input class="val-input" v-model.number="valA" type="number" min="0" :max="UF_SIZE - 1" />
      <input class="val-input" v-model.number="valB" type="number" min="0" :max="UF_SIZE - 1" />
      <button class="btn" @click="onUnion">合并</button>
      <button class="btn" @click="onFind">查根</button>
      <button class="btn" @click="onConnected">连通?</button>
      <button class="btn" @click="onReset">重置</button>
    </div>
    <div class="lane-wrap">
      <div class="lane">
        <svg width="430" height="220">
          <defs>
            <marker id="uf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 z" fill="#9aa8a0" />
            </marker>
          </defs>
          <g class="edges">
            <path
              v-for="(p, i) in uf.parent.value"
              v-show="p !== i"
              :key="'e' + i"
              class="uf-edge"
              :d="arc(i, p)"
              marker-end="url(#uf-arrow)"
            />
          </g>
          <g class="verts">
            <g
              v-for="(p, i) in uf.parent.value"
              :key="i"
              class="ufnode"
              :class="{ path: litPath.includes(i), root: litRoot === i }"
              :transform="`translate(${posX(i)},${posY})`"
            >
              <circle r="16" />
              <text>{{ i }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <p class="readout">
      当前 <b>{{ uf.groupCount.value }}</b> 个组（连通分量）
    </p>
    <p class="status">{{ status }}</p>
  </div>
</template>

<style scoped lang="less">
/* 固定 8 节点(idle 浅绿/path 黄/root 深绿) + 父指针弧线箭头 .uf-edge + 组数读数 + status；输入/按钮取 HashViz 样式；画布定宽 */
</style>
```

注：`v-show` 隐藏根节点的边（每个非根一根箭头 → `.uf-edge` 计数 = 非根数）。`union/find/connected/compress` 同步改 parent + 同步置 status（L4 可断言）；高亮短延时。**验证**：`pnpm test:unit run src/components/structures/UnionFindViz.spec.ts`。

> 注意：`.uf-edge` 用 `v-show`（非 `v-if`）会保留 DOM 节点。L4 断言「边数」应数**可见**的：用 `wrapper.findAll('.uf-edge').filter(e => e.attributes('style')?.includes('display: none') !== true)`，或改用 `v-if`。**实现用 `v-if`** 让 `.uf-edge` 仅渲染非根边，断言直接数 `findAll('.uf-edge').length`。

---

## T3 — 新页 `UnionFind.vue` + 4 处接线 + 改 2 HOOK（L4，先写测试）

**先写失败测试**（视图）`src/views/Article/DataStructure/UnionFind.spec.ts`（`TC-VIEW-UF-01/02`，仿 Trie.spec）。

**改 HOOK 计数**：`Home/Main/hooks.spec.ts` TC-HOOK-01-2 `9`→`10`；`Docs/Menu/hooks.spec.ts` TC-HOOK-02-4 数据结构 `9`→`10`（排序仍 8）。

**实现**：

1. `UnionFind.vue`（见 design §4）。
2. `router/index.ts`：graph/trie 之后 + `{ path: '/docs/union-find', name: 'union-find', component: () => import('../views/Article/DataStructure/UnionFind.vue') }`。
3. `Docs/Menu/hooks.ts`：数据结构 children 末（字典树后）+ `{ title: '并查集', url: 'union-find' }`。
4. `Home/Main/hooks.ts`：import `UnionFindIcon from '@/assets/union-find.svg'`；数据结构 children 末 + `{ title: '并查集', desc: '极快维护「谁和谁同组」：合并、找根、路径压缩', icon: UnionFindIcon, url: 'union-find' }`。
5. `assets/union-find.svg`：1024 viewBox 黑剪影（一个根 + 3 子指向根，象征合并成组）：

```svg
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <g fill="#333333" stroke="#333333" stroke-width="40" stroke-linecap="round">
    <line x1="512" y1="300" x2="300" y2="630" />
    <line x1="512" y1="300" x2="512" y2="630" />
    <line x1="512" y1="300" x2="724" y2="630" />
    <circle cx="512" cy="280" r="86" />
    <circle cx="300" cy="660" r="66" />
    <circle cx="512" cy="660" r="66" />
    <circle cx="724" cy="660" r="66" />
  </g>
</svg>
```

**验证**：`pnpm test:unit run src/views/Article/DataStructure/UnionFind.spec.ts src/views/Home/Main/hooks.spec.ts src/views/Docs/Menu/hooks.spec.ts`。

---

## T4 — e2e（L5）

新建 `e2e/union-find.e2e.ts`（`TC-E2E-UF-01`，导航 `/docs/union-find`、限定 `.union-find-viz`）：8 `.ufnode`；输入 a=0,b=1 点「合并」→ `.readout` 含「7」；点「连通?」→ `.status` 含「连通」；点「重置」→ `.readout` 含「8」。**验证**：`pnpm exec playwright test e2e/union-find.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap + backlog（B2 出池/完成），提交 main。

## 自测报告（实现期回填）

- [x] T1 useUnionFind 全绿（10 Case）— TDD：先红 → 实现 → 绿；find 纯走位（链 root+path、不改 parent）+ union 合并/同组 + compress 沿途指根 + connected + groupCount 递减 + reset，一次通过
- [x] T2 UnionFindViz 全绿（8 Case）— union/find/connected/compress 同步改 parent + 同步置 status（L4 可断言）、合并/查根(压缩)/连通?/重置；`.uf-edge` 改用 **computed 过滤非根边**（避 v-for+v-if 同元素的 Vue3 陷阱：v-if 取不到循环变量）；连通/不连通用「同根」「根不同」措辞区分（避子串误判）
- [x] T3 并查集页 TC-VIEW-UF-01/02 绿 + 4 处接线（router /docs/union-find / Menu / Home + UnionFindIcon / union-find.svg）+ 改 2 HOOK（TC-HOOK-01-2、TC-HOOK-02-4 数据结构 9→10）绿；菜单/首页/路由可达
- [x] T4 e2e 全绿（新增 TC-E2E-UF-01）— 真机另验：链 0→1→2→3 后查根 0，节点 0/1/2 箭头直接指向根 3（路径压缩）、组数 5
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 92.55%/89.45%/93.47%/93.73%（聚合过门槛）
- [x] 单测 661 passed（97 文件，含新增 20 单测 + 改 2 HOOK）+ e2e 25 passed（含新增 1）；既有 9 结构 + 8 排序 + 播放器 + 骨架零回归；**M4 广度 B2 落地**
