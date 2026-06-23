# 实现：堆排序动画（TDD 任务分解 T1–T9）

> Status: approved
> Stable ID: C-20260623-013
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 类型` → `T5 oracle` → `T7 四语言源码` → `T6 插桩 module` → `T2 Bar/BarsView` → `T3 TreeView` → `T4 外壳条件渲染` → `T8 视图+路由` → `T9 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T1 — `types.ts` 类型扩展（纯加法）

```ts
export type HeapExecPoint = 'heapify' | 'compare' | 'swap' | 'settle' | 'extract' | 'done';

export interface TreeTrack {
  heapSize: number; // [0,heapSize) 在堆中，[heapSize,n) 已就位
}
```

`StepEmphasis` 增 `heapNode?: number;`；`Step` 增 `tree?: TreeTrack;`。**验证**：`pnpm type-check`。

---

## T5 — `heap-sort.ts` oracle（L3，先写测试）

**先写失败测试** `src/algorithms/heap-sort.spec.ts`（`TC-HEAP-ALGO-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { heapSortTrace, isMaxHeap } from './heap-sort';

const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];

describe('heapSortTrace', () => {
  it('TC-HEAP-ALGO-01 result 升序且与内置 sort 一致', () => {
    expect(heapSortTrace(BASE).result).toEqual([...BASE].sort((a, b) => a - b));
  });
  it('TC-HEAP-ALGO-02 built 是大顶堆', () => {
    expect(isMaxHeap(heapSortTrace(BASE).built)).toBe(true);
  });
  it('TC-HEAP-ALGO-03 BASE 建堆后 = [10,9,8,6,7,5,4,3,2,1]', () => {
    expect(heapSortTrace(BASE).built).toEqual([10, 9, 8, 6, 7, 5, 4, 3, 2, 1]);
  });
  it('TC-HEAP-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    heapSortTrace(input);
    expect(input).toEqual([3, 2, 1]);
  });
  it('TC-HEAP-ALGO-05 空 / 单元素 result 原样、built 平凡', () => {
    expect(heapSortTrace([]).result).toEqual([]);
    expect(heapSortTrace([5]).result).toEqual([5]);
  });
  it('TC-HEAP-ALGO-06 含重复 / 已序 / 逆序均升序', () => {
    for (const inp of [
      [2, 2, 1, 1, 3],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ])
      expect(heapSortTrace(inp).result).toEqual([...inp].sort((a, b) => a - b));
  });
  it('TC-HEAP-ALGO-07 isMaxHeap 能识别非堆', () => {
    expect(isMaxHeap([1, 2, 3])).toBe(false);
    expect(isMaxHeap([3, 2, 1])).toBe(true);
  });
});
```

**实现** `src/algorithms/heap-sort.ts`：见 design §7（`heapSortTrace` + `isMaxHeap`，Floyd siftDown，纯函数不改入参）。**验证**：`pnpm test:unit run src/algorithms/heap-sort.spec.ts`。

---

## T7 — `heap-sort.sources.ts` 四语言 + lineMap（L3）

四语言「Floyd 大顶堆 + 单一 siftDown」，TS 锚定见 design §6。`lineMap`（design §6）：ts `heapify:3,compare:15,swap:18,settle:17,extract:6,done:9`；python `3/14/20/18/6/8`；go `3/17/26/23/7/10`；rust `3/16/25/22/7/10`。**测试**并入 T6 的 `sources` describe（`TC-HEAP-MOD-13..15`）。

---

## T6 — `heap-sort.module.ts` 插桩（L3，先写测试）

**先写失败测试** `src/algorithms/heap-sort.module.spec.ts`（`TC-HEAP-MOD-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { heapSortTrace, isMaxHeap } from './heap-sort';
import { buildHeapSortSteps, heapSortModule } from './heap-sort.module';
import type { HeapExecPoint, Step } from '@/components/player/types';

const EXEC: HeapExecPoint[] = ['heapify', 'compare', 'swap', 'settle', 'extract', 'done'];
const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const val = (s: Step<HeapExecPoint>) => s.array.map((t) => t[1]);

describe('buildHeapSortSteps', () => {
  it('TC-HEAP-MOD-01 空 / 单元素只产出 done、sortedFrom=0', () => {
    expect(buildHeapSortSteps([]).at(-1)!.point).toBe('done');
    const s1 = buildHeapSortSteps([5]).at(-1)!;
    expect(s1.point).toBe('done');
    expect(s1.emphasis.sortedFrom).toBe(0);
  });
  it('TC-HEAP-MOD-02 末步升序 = oracle result', () => {
    expect(val(buildHeapSortSteps(BASE).at(-1)!)).toEqual(heapSortTrace(BASE).result);
    expect(val(buildHeapSortSteps(BASE).at(-1)!)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('TC-HEAP-MOD-03 每步 id 集合恒等于初始（FLIP）', () => {
    const all = buildHeapSortSteps([3, 1, 2, 5]);
    const init = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) expect(new Set(s.array.map((t) => t[0]))).toEqual(init);
  });
  it('TC-HEAP-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildHeapSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });
  it('TC-HEAP-MOD-05 每步 point 合法；compare 带 comparing', () => {
    for (const s of buildHeapSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC).toContain(s.point);
      if (s.point === 'compare') expect(Array.isArray(s.emphasis.comparing)).toBe(true);
    }
  });
  it('TC-HEAP-MOD-06 建堆阶段末步 = oracle built 且为大顶堆', () => {
    const steps = buildHeapSortSteps(BASE);
    const idx = steps.findIndex((s) => s.point === 'extract'); // 首个 extract 前一步=建堆完成
    const built = val(steps[idx - 1]);
    expect(built).toEqual(heapSortTrace(BASE).built);
    expect(isMaxHeap(built)).toBe(true);
  });
  it('TC-HEAP-MOD-07 extract 步 sortedFrom = tree.heapSize 且单调递减', () => {
    let prev = Infinity;
    for (const s of buildHeapSortSteps(BASE).filter((x) => x.point === 'extract')) {
      expect(s.emphasis.sortedFrom).toBe(s.tree!.heapSize);
      expect(s.emphasis.sortedFrom!).toBeLessThan(prev);
      prev = s.emphasis.sortedFrom!;
    }
  });
  it('TC-HEAP-MOD-08 extract 堆顶取出序列 = [10,9,8,7,6,5,4,3,2]', () => {
    const tops = buildHeapSortSteps(BASE)
      .filter((s) => s.point === 'extract')
      .map((s) => s.array[s.tree!.heapSize][1]); // 换到 end=heapSize 的最大值
    expect(tops).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2]);
  });
  it('TC-HEAP-MOD-09 heapify 步 heapNode=i（建堆活动节点）', () => {
    for (const s of buildHeapSortSteps(BASE).filter((x) => x.point === 'heapify'))
      expect(typeof s.emphasis.heapNode).toBe('number');
  });
  it('TC-HEAP-MOD-10 done 步 sortedFrom=0、tree.heapSize=0', () => {
    const d = buildHeapSortSteps([5, 3, 8, 1]).at(-1)!;
    expect(d.emphasis.sortedFrom).toBe(0);
    expect(d.tree!.heapSize).toBe(0);
  });
  it('TC-HEAP-MOD-11 每步带 tree 快照', () => {
    for (const s of buildHeapSortSteps(BASE)) expect(typeof s.tree!.heapSize).toBe('number');
  });
  it('TC-HEAP-MOD-12 堆用节点高亮、无指针箭头', () => {
    for (const s of buildHeapSortSteps(BASE)) expect(s.pointers).toEqual([]);
  });
});

describe('heapSortModule.sources', () => {
  it('TC-HEAP-MOD-13 四门语言齐备', () => {
    expect(heapSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });
  it('TC-HEAP-MOD-14 每门语言每个 point 行号在源码行范围内', () => {
    for (const src of heapSortModule.sources) {
      const lc = src.code.split('\n').length;
      for (const p of EXEC) {
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeLessThanOrEqual(lc);
      }
    }
  });
  it('TC-HEAP-MOD-15 实际出现的 point 都能映射到行', () => {
    const used = new Set(buildHeapSortSteps(heapSortModule.initialInput()).map((s) => s.point));
    for (const src of heapSortModule.sources)
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
  });
});
```

**实现** `src/algorithms/heap-sort.module.ts`：按 design §4 插桩。骨架要点：

```ts
const DASH = '-';
export function buildHeapSortSteps(input: number[]): Step<HeapExecPoint>[] {
  const steps: Step<HeapExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  let swapCount = 0;
  let heapSize = n;
  const vars = (phase, i, l, r, largest) => [
    { name: 'n', value: n },
    { name: '阶段', value: phase },
    { name: 'heapSize', value: heapSize },
    { name: 'i', value: i },
    { name: 'left', value: l },
    { name: 'right', value: r },
    { name: 'largest', value: largest },
    { name: 'swapCount', value: swapCount },
  ];
  const push = (point, v, emphasis, caption?) =>
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers: [],
      emphasis,
      vars: v,
      point,
      tree: { heapSize },
      caption,
    });

  if (n <= 1) {
    push('done', vars('完成', DASH, DASH, DASH, DASH), { sortedFrom: 0 }, '完成');
    return steps;
  }

  const siftDown = (start: number, size: number, phase: string) => {
    let i = start;
    while (2 * i + 1 < size) {
      const l = 2 * i + 1,
        r = 2 * i + 2;
      let largest = i;
      if (work[l][1] > work[largest][1]) largest = l;
      if (r < size && work[r][1] > work[largest][1]) largest = r;
      push(
        'compare',
        vars(phase, i, l, r < size ? r : DASH, largest),
        { heapNode: i, comparing: [l, r < size ? r : l] },
        `比较 a[${i}] 与子，最大=a[${largest}]`,
      );
      if (largest === i) {
        push(
          'settle',
          vars(phase, i, l, r < size ? r : DASH, largest),
          { heapNode: i },
          `a[${i}] 已最大，子树成堆`,
        );
        break;
      }
      [work[i], work[largest]] = [work[largest], work[i]];
      swapCount++;
      push(
        'swap',
        vars(phase, i, l, r < size ? r : DASH, largest),
        { comparing: [i, largest], swapped: true },
        `下沉：a[${i}] ↔ a[${largest}]`,
      );
      i = largest;
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    push(
      'heapify',
      vars('建堆', i, 2 * i + 1, 2 * i + 2 < n ? 2 * i + 2 : DASH, i),
      { heapNode: i },
      `建堆：siftDown(${i})`,
    );
    siftDown(i, n, '建堆');
  }
  for (let end = n - 1; end > 0; end--) {
    [work[0], work[end]] = [work[end], work[0]];
    swapCount++;
    heapSize = end;
    push(
      'extract',
      vars('排序', 0, DASH, DASH, DASH),
      { comparing: [0, end], swapped: true, sortedFrom: end },
      `取堆顶最大 → a[${end}] 就位`,
    );
    siftDown(0, end, '排序');
  }
  heapSize = 0;
  push('done', vars('完成', DASH, DASH, DASH, DASH), { sortedFrom: 0 }, '完成，全部有序');
  return steps;
}
export const heapSortModule: AlgorithmModule<HeapExecPoint> = {
  title: '堆排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildHeapSortSteps,
  sources: heapSortSources,
};
```

注：`extract` 步 `tree.heapSize` 已设为 `end`（该步 push 时 heapSize=end），故 `s.array[s.tree.heapSize]` = `s.array[end]` = 刚换上去的最大值（TC-MOD-08）。**验证**：`pnpm test:unit run src/algorithms/heap-sort.module.spec.ts`。

---

## T2 — `Bar.vue` heapNode 态 + `BarsView.vue` 接入（L4，先写测试）

**失败测试**：`Bar.spec.ts` 加 `TC-VIZ-BAR-09`（`state='heapNode'` → `.bar.heapNode`）；`BarsView.spec.ts` 加 `TC-VIZ-BARSVIEW-18`（heapNode 指向的 Bar 进入 heapNode 态）、`-19`（heapNode 让位 sorted：同时落在 sortedFrom 后缀时取 sorted）、`-20`（heapNode 压过 comparing：同 index 时取 heapNode）。

**实现**：`Bar.vue` 联合类型加 `'heapNode'` + `.bar.heapNode{background-color:#7e57c2}`；`BarsView.vue` `stateOf` 在 sorted 判定后加 `if (e.heapNode === index) return 'heapNode'`。**验证**：`pnpm test:unit run src/components/Bar.spec.ts src/components/BarsView.spec.ts`。

---

## T3 — `TreeView.vue` 新组件（L4，先写测试）

**失败测试** `src/components/TreeView.spec.ts`（`TC-VIZ-TREEVIEW-*`）：

- `-01` 渲染节点数 = array.length（`.tree-node`）。
- `-02` 布局：k=0 居顶层中央（x≈50%）；k=1 第二层左半、k=2 右半。
- `-03` 父子边数 = n-1（`.tree-edge` / SVG `line`）。
- `-04` heapNode 节点带 `.heapNode` 类；sortedFrom 后缀节点带 `.sorted` 类。
- `-05` heapSize 区分：`k>=heapSize` 节点为 sorted（已就位）。

**实现** `src/components/TreeView.vue`：props `array`/`emphasis`/`heapSize`/`slotWidth?`。computed `nodes`（按 design §5.2 算 x,y,state）+ `edges`（k→parent）。模板：容器 relative + SVG 画 `line` 边 + `v-for` 节点 `div`（绝对定位，class=state）。stateOf 复用主轨优先级（heapNode/comparing/swapped/sorted/idle）。**验证**：`pnpm test:unit run src/components/TreeView.spec.ts`。

---

## T4 — `AlgorithmPlayer.vue` 条件渲染（L4，先写测试）

**失败测试** `AlgorithmPlayer.spec.ts` 加 `TC-PLAYER-TREE-01`（带 `tree` 的桩 module → 渲染 TreeView）、`-02`（不带 `tree`（冒泡）→ 不渲染）、`-03`（带 aux 不带 tree → 不渲染 TreeView）。

**实现**：在 `BarsView` 之上加 `<TreeView v-if="current.tree" :array="current.array" :emphasis="current.emphasis" :heap-size="current.tree.heapSize" />` + import。**验证**：`pnpm test:unit run src/components/player/AlgorithmPlayer.spec.ts`。

---

## T8 — `HeapSort.vue` + 路由（L4，先写测试）

**失败测试** `src/views/Article/SortAlgorithm/HeapSort.spec.ts`（`TC-VIEW-HEAP-01/02`）：挂载渲染 `AlgorithmPlayer` + `heapSortModule`、默认停第 0 步、存在 `TreeView`。

**实现**：`HeapSort.vue` 薄壳；`router/index.ts` 在 `quick-sort` 后加 `heap-sort` 路由。**验证**：`pnpm test:unit run src/views/Article/SortAlgorithm/HeapSort.spec.ts`。

---

## T9 — e2e（L5，Playwright）

`e2e/heap-sort.e2e.ts`（`TC-E2E-HEAP-01`）：导航 `/docs/heap-sort`、默认暂停第 0 步、树轨 `.tree-view` 可见、真机 Shiki、单步到 heapNode 深紫可见、拖末步主轨升序全绿、重置。**验证**：`pnpm exec playwright test e2e/heap-sort.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 type-check 通过
- [x] T5 oracle 全绿（7 Case）
- [x] T7+T6 sources + module 全绿（15 Case）
- [x] T2 Bar/BarsView 全绿（含回归）
- [x] T3 TreeView 全绿（6 Case，含 comparing/swapped 分支）
- [x] T4 AlgorithmPlayer 全绿（含 AuxView/StackView 回归，TREE-01/02/03）
- [x] T8 视图+路由全绿（2 Case）
- [x] T9 e2e 全绿（TC-E2E-HEAP-01）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 92.47%/91.53%/88.83%/92.48%
- [x] 单测 318 passed（51 文件）+ e2e 9 passed；冒泡 / 选择 / 插入 / 希尔 / 归并 / 快速全部现有 Case 零回归
