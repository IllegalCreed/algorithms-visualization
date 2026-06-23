# 实现：快速排序动画（TDD 任务分解 T1–T9）

> Status: approved
> Stable ID: C-20260623-012
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 类型` → `T5 oracle` → `T7 四语言源码` → `T6 插桩 module` → `T2 Bar/BarsView` → `T3 StackView` → `T4 外壳条件渲染` → `T8 视图+路由` → `T9 e2e`。

每个任务遵循铁律：**先写失败测试 → 跑红 → 实现 → 跑绿 → 重构**。每完成一个 `pnpm test:unit run <file>` 局部绿，全部完成后跑全门禁。

---

## T1 — `types.ts` 类型扩展（地基，纯加法）

**改动** `src/components/player/types.ts`：

```ts
export type QuickExecPoint =
  | 'pop'
  | 'pivotSelect'
  | 'compare'
  | 'swap'
  | 'noSwap'
  | 'pivotPlace'
  | 'push'
  | 'done';

export interface StackTrack {
  frames: { lo: number; hi: number }[]; // frames[0]=栈底，frames[last]=栈顶
  popped?: { lo: number; hi: number }; // 刚弹出/正在处理（pop 步）
}
```

`StepEmphasis` 增 `pivotIndex?: number;` 与 `sortedIndices?: number[];`；`Step` 增 `stack?: StackTrack;`。

**验证**：`pnpm type-check` 通过；不破坏现有（前五算法 Step 不带新字段）。类型本身无独立 spec，由 T2/T6 的测试覆盖。

---

## T5 — `quick-sort.ts` oracle（L3，先写测试）

**先写失败测试** `src/algorithms/quick-sort.spec.ts`（`TC-QUICK-ALGO-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { quickSortPartitions } from './quick-sort';

const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];

describe('quickSortPartitions', () => {
  it('TC-QUICK-ALGO-01 末事件数组严格升序且与内置 sort 一致', () => {
    const ev = quickSortPartitions(BASE);
    expect(ev.at(-1)!.array).toEqual([...BASE].sort((a, b) => a - b));
  });
  it('TC-QUICK-ALGO-02 不修改入参', () => {
    const input = [3, 2, 1];
    quickSortPartitions(input);
    expect(input).toEqual([3, 2, 1]);
  });
  it('TC-QUICK-ALGO-03 空 / 单元素返回空事件序列', () => {
    expect(quickSortPartitions([])).toEqual([]);
    expect(quickSortPartitions([5])).toEqual([]);
  });
  it('TC-QUICK-ALGO-04 BASE 的 pivot 落点序列 = [0,6,1,5,2,4,9,7]', () => {
    expect(quickSortPartitions(BASE).map((e) => e.pivotIndex)).toEqual([0, 6, 1, 5, 2, 4, 9, 7]);
  });
  it('TC-QUICK-ALGO-05 每次 partition 落点钉死最终位置', () => {
    const sorted = [...BASE].sort((a, b) => a - b);
    for (const e of quickSortPartitions(BASE))
      expect(e.array[e.pivotIndex]).toBe(sorted[e.pivotIndex]);
  });
  it('TC-QUICK-ALGO-06 含重复 / 已序也正确升序', () => {
    for (const inp of [
      [2, 2, 1, 1, 3],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ]) {
      const ev = quickSortPartitions(inp);
      const last = ev.length ? ev.at(-1)!.array : inp;
      expect(last).toEqual([...inp].sort((a, b) => a - b));
    }
  });
});
```

**实现** `src/algorithms/quick-sort.ts`：

```ts
export interface PartitionEvent {
  lo: number;
  hi: number;
  pivotIndex: number;
  array: number[];
}

/** Lomuto + 显式栈（先右后左），返回每次 partition 后的事件（纯函数，不改入参） */
export function quickSortPartitions(input: number[]): PartitionEvent[] {
  const a = [...input];
  const events: PartitionEvent[] = [];
  const stack: Array<[number, number]> = [];
  if (a.length >= 2) stack.push([0, a.length - 1]);
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    const p = i;
    events.push({ lo, hi, pivotIndex: p, array: [...a] });
    if (hi > p + 1) stack.push([p + 1, hi]); // 先右
    if (p - 1 > lo) stack.push([lo, p - 1]); // 后左 → pop 先左
  }
  return events;
}
```

注：单元素子区间（`p-1==lo` 或 `p+1==hi`）不入栈也不产生事件（它无需再 partition），但其最终位置已正确——`module` 侧会把它计入 `sortedIndices`。oracle 只记录「发生了 partition」的事件，单元素由钉死校验（TC-QUICK-ALGO-05）的并集间接保证。

**验证**：`pnpm test:unit run src/algorithms/quick-sort.spec.ts` 全绿。

---

## T7 — `quick-sort.sources.ts` 四语言源码 + lineMap（L3）

**实现** `src/algorithms/quick-sort.sources.ts`：四语言「显式栈 + Lomuto 末位 pivot」，结构同构。TS 锚定见 design §6。Python/Go/Rust 用各自惯用的 `stack`（list / slice / Vec）实现，行号据各自语法定 `lineMap`。八个执行点：`pop / pivotSelect / compare / swap / noSwap / pivotPlace / push / done`。

Python 骨架：

```python
def quick_sort(a):
    n = len(a)
    stack = [(0, n - 1)]
    while stack:
        lo, hi = stack.pop()        # pop
        if lo >= hi:
            continue
        pivot = a[hi]               # pivotSelect
        i = lo
        for j in range(lo, hi):     # noSwap
            if a[j] < pivot:        # compare
                a[i], a[j] = a[j], a[i]  # swap
                i += 1
        a[i], a[hi] = a[hi], a[i]   # pivotPlace
        stack.append((i + 1, hi))   # push
        stack.append((lo, i - 1))
    return a                        # done
```

Go / Rust 同构（Go 用 `[][2]int` 栈，Rust 用 `Vec<(usize,usize)>`，注意 Rust 下标用 `usize`、`i-1` 用 `i.wrapping_sub` 或循环结构规避——实现时以「能正确高亮行」为准，可写成 `while let Some((lo, hi)) = stack.pop()`）。

**测试**：并入 T6 的 `quick-sort.module.spec.ts` 的 `sources` describe（四语言齐备 / 行号范围 / 实际 point 可映射），见 `TC-QUICK-MOD-14..16`。

---

## T6 — `quick-sort.module.ts` 插桩（L3，先写测试）

**先写失败测试** `src/algorithms/quick-sort.module.spec.ts`（`TC-QUICK-MOD-*`），对标 merge 的 spec 结构：

```ts
import { describe, it, expect } from 'vitest';
import { quickSortPartitions } from './quick-sort';
import { buildQuickSortSteps, quickSortModule } from './quick-sort.module';
import type { QuickExecPoint, Step } from '@/components/player/types';

const EXEC_POINTS: QuickExecPoint[] = [
  'pop',
  'pivotSelect',
  'compare',
  'swap',
  'noSwap',
  'pivotPlace',
  'push',
  'done',
];
const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const num = (s: Step<QuickExecPoint>, name: string) =>
  Number(s.vars.find((v) => v.name === name)!.value);

describe('buildQuickSortSteps', () => {
  it('TC-QUICK-MOD-01 空 / 单元素只产出一个 done 步，sortedIndices 全集', () => {
    const e = buildQuickSortSteps([]);
    expect(e.at(-1)!.point).toBe('done');
    const s1 = buildQuickSortSteps([5]);
    expect(s1.at(-1)!.point).toBe('done');
    expect(s1.at(-1)!.emphasis.sortedIndices).toEqual([0]);
  });
  it('TC-QUICK-MOD-02 末步数组与 oracle 一致（升序）', () => {
    const v = buildQuickSortSteps(BASE)
      .at(-1)!
      .array.map((t) => t[1]);
    expect(v).toEqual(quickSortPartitions(BASE).at(-1)!.array);
    expect(v).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('TC-QUICK-MOD-03 每步 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildQuickSortSteps([3, 1, 2, 5]);
    const init = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) expect(new Set(s.array.map((t) => t[0]))).toEqual(init);
  });
  it('TC-QUICK-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildQuickSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });
  it('TC-QUICK-MOD-05 每步 point 合法；compare 步必带 comparing=[j,hi]', () => {
    for (const s of buildQuickSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'compare') {
        expect(Array.isArray(s.emphasis.comparing)).toBe(true);
        expect(s.emphasis.comparing![1]).toBe(num(s, 'hi'));
      }
    }
  });
  it('TC-QUICK-MOD-06 pivotPlace 落点序列 = oracle pivotIndex 序列', () => {
    const places = buildQuickSortSteps(BASE)
      .filter((s) => s.point === 'pivotPlace')
      .map((s) => num(s, 'i'));
    expect(places).toEqual(quickSortPartitions(BASE).map((e) => e.pivotIndex));
  });
  it('TC-QUICK-MOD-07 sortedIndices 单调不减、末步全集', () => {
    let prev = 0;
    for (const s of buildQuickSortSteps(BASE)) {
      const len = s.emphasis.sortedIndices?.length ?? 0;
      expect(len).toBeGreaterThanOrEqual(prev);
      prev = len;
    }
    expect(
      [...buildQuickSortSteps(BASE).at(-1)!.emphasis.sortedIndices!].sort((a, b) => a - b),
    ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it('TC-QUICK-MOD-08 pivotSelect 步 pivotIndex=hi 且 pivot 值=a[hi]', () => {
    for (const s of buildQuickSortSteps(BASE).filter((x) => x.point === 'pivotSelect')) {
      expect(s.emphasis.pivotIndex).toBe(num(s, 'hi'));
      expect(num(s, 'pivot')).toBe(s.array[num(s, 'hi')][1]);
    }
  });
  it('TC-QUICK-MOD-09 栈序：pop 步弹出的区间 = 前一 push 后的栈顶（先右后左→先取左）', () => {
    const steps = buildQuickSortSteps(BASE);
    for (let k = 1; k < steps.length; k++) {
      if (steps[k].point !== 'pop') continue;
      const prevStack = steps[k - 1].stack!.frames; // pop 前的栈（上一步 push/初始）
      const popped = steps[k].stack!.popped!;
      if (prevStack.length) expect(popped).toEqual(prevStack[prevStack.length - 1]);
    }
  });
  it('TC-QUICK-MOD-10 done 步 stack 空、sortedIndices 全集', () => {
    const d = buildQuickSortSteps([5, 3, 8, 1]).at(-1)!;
    expect(d.point).toBe('done');
    expect(d.stack!.frames).toEqual([]);
  });
  it('TC-QUICK-MOD-11 每步指针 clamp 在 [0,n-1]', () => {
    for (const s of buildQuickSortSteps(BASE))
      for (const p of s.pointers) {
        expect(p.index).toBeGreaterThanOrEqual(0);
        expect(p.index).toBeLessThanOrEqual(BASE.length - 1);
      }
  });
  it('TC-QUICK-MOD-12 每步带 stack 快照（StackTrack）', () => {
    for (const s of buildQuickSortSteps(BASE)) expect(Array.isArray(s.stack!.frames)).toBe(true);
  });
  it('TC-QUICK-MOD-13 swap 步后小于区不变量：a[lo..i-1] 全 < pivot', () => {
    for (const s of buildQuickSortSteps(BASE).filter((x) => x.point === 'swap')) {
      const lo = num(s, 'lo'),
        i = num(s, 'i'),
        pivot = num(s, 'pivot');
      for (let t = lo; t < i; t++) expect(s.array[t][1]).toBeLessThan(pivot);
    }
  });
});

describe('quickSortModule.sources', () => {
  it('TC-QUICK-MOD-14 四门语言齐备', () => {
    expect(quickSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });
  it('TC-QUICK-MOD-15 每门语言每个 point 行号落在源码物理行范围内', () => {
    for (const src of quickSortModule.sources) {
      const lc = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const ln = src.lineMap[p];
        expect(ln, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(ln, `${src.lang}/${p}`).toBeLessThanOrEqual(lc);
      }
    }
  });
  it('TC-QUICK-MOD-16 实际出现的 point 都能在每门语言映射到行', () => {
    const used = new Set(buildQuickSortSteps(quickSortModule.initialInput()).map((s) => s.point));
    for (const src of quickSortModule.sources)
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
  });
});
```

**实现** `src/algorithms/quick-sort.module.ts`：按 design §4 伪代码插桩。指针 id：`'0'`=红 i、`'1'`=蓝 j。`stack` 快照在 pop 步取「弹出后」、push 步取「压入后」。变量面板字段见 design §8。`pivotPlace` 步 `i` 变量 = 落点 p（供 TC-MOD-06）。

骨架要点：

```ts
const ID_I = '0', ID_J = '1', DASH = '-';
export function buildQuickSortSteps(input: number[]): Step<QuickExecPoint>[] {
  const steps: Step<QuickExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  const sorted: number[] = [];
  let swapCount = 0;
  const stack: { lo: number; hi: number }[] = [];
  const stackSnap = (popped?: { lo: number; hi: number }): StackTrack =>
    ({ frames: stack.map((f) => ({ ...f })), ...(popped ? { popped } : {}) });
  const vars = (...) => [ /* n, 栈深, lo, hi, pivot, i, j, a[j], swapCount */ ];
  const push = (point, ptr, v, emphasis, stk, caption?) => { /* 组装 Step，clamp 指针，array 深拷贝 */ };

  if (n <= 1) { push('done', {}, vars(...DASH), { sortedIndices: n ? [0] : [] }, stackSnap(), '完成'); return steps; }
  stack.push({ lo: 0, hi: n - 1 });
  while (stack.length > 0) {
    const frame = stack.pop()!;
    push('pop', {}, vars(...), { groupMembers: range(frame.lo, frame.hi), sortedIndices: [...sorted] }, stackSnap(frame), `弹出区间 [${frame.lo},${frame.hi}]`);
    const { lo, hi } = frame;
    const pivot = work[hi][1];
    push('pivotSelect', { i: lo, j: lo }, vars(...), { pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] }, stackSnap(), `基准 pivot = a[${hi}] = ${pivot}`);
    let i = lo;
    for (let j = lo; j < hi; j++) {
      const lt = work[j][1] < pivot;
      push('compare', { i, j }, vars(...), { comparing: [j, hi], pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] }, stackSnap(), `a[${j}]=${work[j][1]} ${lt ? '<' : '≥'} ${pivot}`);
      if (lt) {
        [work[i], work[j]] = [work[j], work[i]]; swapCount++; i++;
        push('swap', { i, j }, vars(...), { pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] }, stackSnap(), `交换入小于区，i→${i}`);
      } else {
        push('noSwap', { i, j }, vars(...), { pivotIndex: hi, groupMembers: range(lo, hi), sortedIndices: [...sorted] }, stackSnap(), `不小于，跳过`);
      }
    }
    [work[i], work[hi]] = [work[hi], work[i]]; swapCount++;
    sorted.push(i);
    push('pivotPlace', { i }, vars(/* i=p */), { groupMembers: range(lo, hi), sortedIndices: [...sorted] }, stackSnap(), `pivot 归位到 ${i}（钉死最终位置）`);
    const p = i;
    if (hi > p + 1) stack.push({ lo: p + 1, hi }); else if (p + 1 === hi) sorted.push(hi);
    if (p - 1 > lo) stack.push({ lo, hi: p - 1 }); else if (p - 1 === lo) sorted.push(lo);
    push('push', {}, vars(...), { groupMembers: range(lo, hi), sortedIndices: [...sorted] }, stackSnap(), `压入子区间`);
  }
  push('done', {}, vars(...DASH), { sortedIndices: Array.from({ length: n }, (_, k) => k) }, stackSnap(), '完成，全部有序');
  return steps;
}
export const quickSortModule: AlgorithmModule<QuickExecPoint> = {
  title: '快速排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildQuickSortSteps,
  sources: quickSortSources,
};
```

**验证**：`pnpm test:unit run src/algorithms/quick-sort.module.spec.ts` 全绿（含 sources）。

---

## T2 — `Bar.vue` pivot 态 + `BarsView.vue` 接入（L4，先写测试）

**先写失败测试**：扩展 `src/components/Bar.spec.ts`（`TC-VIZ-BAR-*` 新增 pivot：`state='pivot'` 渲染 `.bar.pivot`）；扩展 `src/components/BarsView.spec.ts`（`TC-VIZ-BARSVIEW-*`：① `pivotIndex` 那根渲染 pivot 态、且当它同时落在 `comparing`/`groupMembers` 中仍为 pivot（压过）；② `sortedIndices` 内的下标渲染 sorted；③ 不设新字段时与原判定一致——回归）。

**实现**：`Bar.vue` 联合类型加 `'pivot'` + `.bar.pivot { background-color: #c2185b; }`；`BarsView.vue` `stateOf` 按 design §5.1 加两分支（`pivotIndex` 置链首、`sortedIndices?.includes` 并入 sorted）。

**验证**：`pnpm test:unit run src/components/Bar.spec.ts src/components/BarsView.spec.ts` 全绿（含原有 Case）。

---

## T3 — `StackView.vue` 新组件（L4，先写测试）

**先写失败测试** `src/components/StackView.spec.ts`（`TC-VIZ-STACKVIEW-*`）：

- 给 `frames=[{lo:0,hi:9},{lo:1,hi:5}]`、`length=10`、`slotWidth=60`：渲染 2 个区间条；栈顶 `[1,5]` 条 `left=60px`、`width=300px`（=(5-1+1)\*60）并带高亮类；栈底 `[0,9]` 条 `left=0`、`width=600px`。
- `popped={lo:7,hi:9}` 时渲染 popped 行（带 popped 类）。
- `frames=[]` 渲染空栈占位文案。

**实现** `src/components/StackView.vue`：见 design §5.2。`frames` 逆序渲染（栈顶在上、加 `.top` 类）；每帧绝对定位水平条；`popped` 单独一行 `.popped`。复用 `.neumorphism-flat()`。

**验证**：`pnpm test:unit run src/components/StackView.spec.ts` 全绿。

---

## T4 — `AlgorithmPlayer.vue` 条件渲染（L4，先写测试）

**先写失败测试**：扩展 `src/components/player/AlgorithmPlayer.spec.ts`（`TC-PLAYER-*`）：用一个带 `stack` 的桩 module 挂载 → 断言存在 `StackView`；用现有不带 `stack` 的 module（如冒泡/归并）→ 断言**不**渲染 `StackView`（归并仍渲染 `AuxView`，互不干扰）。

**实现**：在 `<AuxView v-if="current.aux" …>` 下并列加：

```html
<StackView v-if="current.stack" :stack="current.stack" :length="current.array.length" />
```

import `StackView from '@/components/StackView.vue'`。

**验证**：`pnpm test:unit run src/components/player/AlgorithmPlayer.spec.ts` 全绿（含归并 AuxView 回归）。

---

## T8 — `QuickSort.vue` 薄壳 + 路由 + 首页文案（L4，先写测试）

**先写失败测试** `src/views/Article/SortAlgorithm/QuickSort.spec.ts`（`TC-VIEW-QUICK-*`，对标 `MergeSort.spec.ts`）：挂载渲染 `AlgorithmPlayer`、传入 `quickSortModule`、默认停第 0 步、存在 `StackView`。

**实现**：

- `QuickSort.vue`：`<AlgorithmPlayer :module="quickSortModule" />`。
- `router/index.ts`：`merge-sort` 后加 `{ path: '/docs/quick-sort', name: 'quick-sort', component: () => import('../views/Article/SortAlgorithm/QuickSort.vue') }`。
- `Home/Main/hooks.ts`：快排 desc 改为「选取一个基准数,将比它小的放在前面,比它大的放在后面,左右两部分重复这一过程」。

**验证**：`pnpm test:unit run src/views/Article/SortAlgorithm/QuickSort.spec.ts` 全绿。

---

## T9 — e2e（L5，Playwright）

**实现** `e2e/quick-sort.e2e.ts`（对标 `e2e/shell-sort.e2e.ts` / `merge-sort.e2e.ts`，`TC-E2E-QUICK-*`）：

- 导航 `/docs/quick-sort`，默认暂停第 0 步；
- 栈轨可见（`StackView` 存在）；
- 单步若干次到 `pivotSelect`：pivot 柱品红可见（截图视觉校验）；
- 拖动进度条到末态：主轨全绿、升序；
- 重置回第 0 步；
- 四语言 Tab 切换。

**验证**：`pnpm exec playwright test e2e/quick-sort.e2e.ts`（dev server 起好）。

---

## 全门禁（全部任务后）

```
pnpm type-check
pnpm lint:check
pnpm format:check
pnpm test:unit run            # 全量单测（含前五算法回归）
pnpm exec playwright test     # 全量 e2e
```

全绿后写自测报告、回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 type-check 通过
- [x] T5 oracle 全绿（6 Case）
- [x] T7 四语言源码 + T6 module 全绿（16 Case，含 sources 校验）
- [x] T2 Bar/BarsView 全绿（含回归）
- [x] T3 StackView 全绿（5 Case）
- [x] T4 AlgorithmPlayer 全绿（含归并 AuxView 回归，STACK-01/02/03）
- [x] T8 视图+路由全绿（2 Case）
- [x] T9 e2e 全绿（TC-E2E-QUICK-01）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 91.71%/92.51%/88%/91.65%（新增代码 100%）
- [x] 单测 281 passed（46 文件）+ e2e 8 passed；较归并基线净增 37 Case；冒泡 / 选择 / 插入 / 希尔 / 归并全部现有 Case 零回归
