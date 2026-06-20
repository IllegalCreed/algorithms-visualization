# 选择排序动画 实现计划

> Status: verified
> Stable ID: C-20260620-007
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-20
> Last reviewed: 2026-06-20
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006
> Related tests: test-cases.md
> Related design: design.md

> **For agentic workers:** 本计划用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐 Task 执行。步骤用 `- [ ]` 复选框跟踪。每个 Task 结束都有可独立测试的交付物。

**Goal:** 用 C-006 的「算法播放器」框架接入选择排序，实地验证框架可复用性——框架 100% 复用，仅对类型契约与可视化做向后兼容的小扩展。

**Architecture:** 选择排序实现一个 `AlgorithmModule<SelectionExecPoint>`（插桩 `buildSteps` 产胖步骤 + 四语言源码与行映射），外壳按 `index` 回放，零改动。选择特有的「当前最小值 minIdx」游标用第三指针（黄）+ 柱子专属紫高亮双重编码；已排序区在左侧 `[0, i)`。执行点泛型化让冒泡与选择各自类型安全。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + Pinia + Less；语法高亮复用现有 Shiki（`useHighlighter`）；测试 Vitest + @vue/test-utils（L3/L4）+ Playwright（L5）。

## Global Constraints

- 包管理器 **pnpm**（corepack，版本锁 `packageManager`）；禁用 npm/yarn。
- 路径别名 `@` → `src/`；优先 `@/...`。
- Less 全局混入（`.neumorphism-*`、`.row()`、`.center()`、颜色变量）已由 `vite.config.ts` 的 `additionalData` 注入，**组件内无需 import**。
- 多语言代码仅展示；动画唯一真相源是内置 TS 步骤流。单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，**不依赖异步 `delay`**。
- 语言集固定四门：**TypeScript / Python / Go / Rust**；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：`types.ts` 泛型化后，冒泡侧（`bubble-sort.module.ts` / `bubble-sort.sources.ts` / `bubble-sort.module.spec.ts`）**零行为变化**，全量现有 Case 保持绿。
- 柱态优先级：`sorted > swapped > min > comparing > idle`。
- min 柱专属色 `#9d8df0`；初始数据沿用冒泡同款 `[7,6,5,10,9,8,4,3,2,1]`；三指针 id `'0'`=i(红)/`'1'`=j(蓝)/`'2'`=min(黄)，取 `colors[0/1/2]`。
- 门禁：`pnpm lint:check` + `pnpm format:check` + `pnpm type-check` 必须绿；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）。提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: `types.ts` 泛型化 + 冒泡补标注 + CodePanel 放宽（向后兼容地基）

纯重构，**不加新测试**——冒泡的全量现有 Case 就是回归网。先做这步，证明泛型化不伤冒泡，后续选择排序才有干净地基。

**Files:**

- Modify: `src/components/player/types.ts`
- Modify: `src/algorithms/bubble-sort.module.ts`
- Modify: `src/algorithms/bubble-sort.sources.ts`
- Modify: `src/components/player/CodePanel.vue`

**Interfaces:**

- Produces（后续 Task 依赖）：
  - `SelectionExecPoint`（选择排序执行点 union）
  - `StepEmphasis` 新增可选字段 `minIndex?: number`、`sortedUpTo?: number`
  - `Step<P extends string = string>`、`LangSource<P extends string = string>`、`AlgorithmModule<P extends string = string>`

- [ ] **Step 1: 泛型化 `types.ts`**

整文件替换为：

```ts
// src/components/player/types.ts
export type { Pointer } from '@/types/types';
import type { Pointer } from '@/types/types';

/** 代码面板支持的语言 */
export type Lang = 'ts' | 'python' | 'go' | 'rust';

/** 冒泡的执行点（保留原名，向后兼容） */
export type ExecPoint = 'outerLoop' | 'innerLoop' | 'compare' | 'swap' | 'noSwap' | 'done';

/** 选择排序的执行点（多了 newMin：发现更小值、更新 minIdx） */
export type SelectionExecPoint =
  | 'outerLoop'
  | 'innerLoop'
  | 'compare'
  | 'newMin'
  | 'swap'
  | 'noSwap'
  | 'done';

/** 变量面板的一行 */
export interface VarRow {
  name: string;
  value: string | number | boolean;
}

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 冒泡：右侧 [sortedFrom, n) 已就位
  minIndex?: number; // 选择：当前已知最小值下标 → min 态 + min 柱高亮
  sortedUpTo?: number; // 选择：左侧 [0, sortedUpTo) 已就位
}

/** 胖步骤：自带渲染所需的一切。P = 该算法的执行点集合 */
export interface Step<P extends string = string> {
  array: [string, number][]; // 当前数组快照；[0]=稳定 key（驱动柱子 FLIP），[1]=值
  pointers: Pointer[]; // 指针箭头
  emphasis: StepEmphasis;
  vars: VarRow[]; // 变量面板按顺序渲染
  point: P; // 当前执行点 → 经 lineMap 查每语言行号
  caption?: string; // 解说
}

export interface LangSource<P extends string = string> {
  lang: Lang;
  label: string; // Tab 文案
  code: string; // 该语言完整源码（静态字符串）
  lineMap: Record<P, number>; // 执行点 → 1-based 行号
}

export interface AlgorithmModule<P extends string = string> {
  title: string;
  initialInput(): number[];
  buildSteps(input: number[]): Step<P>[];
  sources: LangSource<P>[];
}
```

- [ ] **Step 2: 给冒泡 module 补泛型标注 `bubble-sort.module.ts`**

改三处（`push` 的 `Step['emphasis']` 不动——`Step` 默认 `P=string` 时它仍解析为 `StepEmphasis`）：

- 第 2 行 import 不变（已含 `ExecPoint`）。
- `export function buildBubbleSortSteps(input: number[]): Step[]` → `export function buildBubbleSortSteps(input: number[]): Step<ExecPoint>[]`
- 函数体 `const steps: Step[] = [];` → `const steps: Step<ExecPoint>[] = [];`（否则推断成 `Step<string>[]`，与返回类型不符）
- `export const bubbleSortModule: AlgorithmModule = {` → `export const bubbleSortModule: AlgorithmModule<ExecPoint> = {`

- [ ] **Step 3: 给冒泡 sources 补泛型标注 `bubble-sort.sources.ts`**

- 第 2 行 import 补 `ExecPoint`：`import type { LangSource } from '@/components/player/types';` → `import type { ExecPoint, LangSource } from '@/components/player/types';`
- `export const bubbleSortSources: LangSource[] = [` → `export const bubbleSortSources: LangSource<ExecPoint>[] = [`

- [ ] **Step 4: CodePanel 放宽 `point` 类型 `CodePanel.vue`**

- 第 6 行 import：`import type { ExecPoint, Lang, LangSource } from './types';` → `import type { Lang, LangSource } from './types';`
- 第 9 行 props：`const props = defineProps<{ sources: LangSource[]; point: ExecPoint }>();` → `const props = defineProps<{ sources: LangSource[]; point: string }>();`

> `lineMap[props.point]`（第 15 行）查表行为不变；`LangSource<ExecPoint>[]` / `LangSource<SelectionExecPoint>[]` 都能赋给 `LangSource[]`（= `LangSource<string>[]`），因 `Record<具名, number>` 可赋给 `Record<string, number>`。

- [ ] **Step 5: type-check（期望绿）**

Run: `pnpm type-check`
Expected: PASS（无类型错误；泛型默认 `string` 让外壳零感知）

- [ ] **Step 6: 全量测试回归（向后兼容硬验收）**

Run: `pnpm test:unit run`
Expected: PASS（**全部现有 Case 绿**，尤其 `bubble-sort.module.spec.ts` 的 `TC-BUBBLE-MOD-*`、`CodePanel.spec.ts`、`BarsView.spec.ts`、`Bar.spec.ts`）

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add src/components/player/types.ts src/algorithms/bubble-sort.module.ts src/algorithms/bubble-sort.sources.ts src/components/player/CodePanel.vue
git commit -m "refactor(player): 执行点泛型化 AlgorithmModule<P>，冒泡向后兼容补标注

types.ts 加类型参数 P + StepEmphasis 增 minIndex/sortedUpTo；
保留 ExecPoint 原名，冒泡侧仅补泛型标注、行为零变化；
CodePanel.point 放宽到 string。为选择排序接入铺路。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: 选择排序 oracle `selection-sort.ts`（L3）

纯算法 oracle，对标 `bubble-sort.ts`，作为后续 `buildSteps` 的正确性交叉校验源。

**Files:**

- Create: `src/algorithms/selection-sort.ts`
- Test: `src/algorithms/selection-sort.spec.ts`

**Interfaces:**

- Produces:
  - `interface SelectionSortStep { array: number[]; i: number; minIdx: number; swapped: boolean }`
  - `selectionSortSteps(input: number[]): SelectionSortStep[]`（纯函数，不改入参；空/单元素返回 `[]`）

- [ ] **Step 1: 写失败测试 `selection-sort.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { selectionSortSteps } from './selection-sort';

describe('selectionSortSteps', () => {
  it('TC-SEL-ALGO-01 空数组与单元素不产生步骤', () => {
    expect(selectionSortSteps([])).toEqual([]);
    expect(selectionSortSteps([5])).toEqual([]);
  });

  it('TC-SEL-ALGO-02 最终数组升序排列', () => {
    const steps = selectionSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    expect(steps.at(-1)!.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SEL-ALGO-03 含重复元素结果正确且不越界', () => {
    expect(selectionSortSteps([3, 1, 3, 2]).at(-1)!.array).toEqual([1, 2, 3, 3]);
  });

  it('TC-SEL-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    selectionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/selection-sort.spec.ts`
Expected: FAIL（`selectionSortSteps` 未定义）

- [ ] **Step 3: 实现 `selection-sort.ts`**

```ts
export interface SelectionSortStep {
  array: number[];
  i: number; // 当前轮（要填的位置）
  minIdx: number; // 该轮选出的最小值下标
  swapped: boolean; // 是否发生交换
}

/** 标准选择排序，返回每轮一步的步骤序列（纯函数，不改入参） */
export function selectionSortSteps(input: number[]): SelectionSortStep[] {
  const arr = [...input];
  const steps: SelectionSortStep[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    let swapped = false;
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swapped = true;
    }
    steps.push({ array: [...arr], i, minIdx, swapped });
  }
  return steps;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/selection-sort.spec.ts`
Expected: PASS（4 个 case）

- [ ] **Step 5: 提交**

```bash
pnpm type-check
git add src/algorithms/selection-sort.ts src/algorithms/selection-sort.spec.ts
git commit -m "feat(algo): 选择排序纯逻辑 oracle selectionSortSteps（L3）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: 选择排序模块 `buildSteps` + 四语言源码（L3）

把选择排序插桩重走为胖 `Step<SelectionExecPoint>[]`，配四语言源码与 `lineMap`。与 oracle 交叉校验 + 选择特有不变量。

**Files:**

- Create: `src/algorithms/selection-sort.sources.ts`
- Create: `src/algorithms/selection-sort.module.ts`
- Test: `src/algorithms/selection-sort.module.spec.ts`

**Interfaces:**

- Consumes: `AlgorithmModule`/`Step`/`LangSource`/`SelectionExecPoint`/`VarRow` from `@/components/player/types`（Task 1）；`selectionSortSteps` from `./selection-sort`（Task 2，测试里交叉校验用）
- Produces:
  - `selectionSortSources: LangSource<SelectionExecPoint>[]`
  - `buildSelectionSortSteps(input: number[]): Step<SelectionExecPoint>[]`
  - `selectionSortModule: AlgorithmModule<SelectionExecPoint>`

- [ ] **Step 1: 写四语言源码 `selection-sort.sources.ts`**

> `lineMap` 行号 1-based，对应 `code` 字符串去掉首行换行后的物理行。改源码即同步改 `lineMap`（Step 4 的 L3 校验每个 `SelectionExecPoint` 行号 ∈ `[1, 行数]`）。

```ts
import type { LangSource, SelectionExecPoint } from '@/components/player/types';

const ts = `function selectionSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}`;

const python = `def selection_sort(a):
    n = len(a)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
    return a`;

const go = `func selectionSort(a []int) []int {
\tn := len(a)
\tfor i := 0; i < n-1; i++ {
\t\tminIdx := i
\t\tfor j := i + 1; j < n; j++ {
\t\t\tif a[j] < a[minIdx] {
\t\t\t\tminIdx = j
\t\t\t}
\t\t}
\t\tif minIdx != i {
\t\t\ta[i], a[minIdx] = a[minIdx], a[i]
\t\t}
\t}
\treturn a
}`;

const rust = `fn selection_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for i in 0..n - 1 {
        let mut min_idx = i;
        for j in i + 1..n {
            if a[j] < a[min_idx] {
                min_idx = j;
            }
        }
        if min_idx != i {
            a.swap(i, min_idx);
        }
    }
}`;

export const selectionSortSources: LangSource<SelectionExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 1 fn / 2 n / 3 外层for / 4 minIdx / 5 内层for / 6 if比较 / 7 newMin / 11 swap / 10 if(noSwap) / 14 return
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 11, noSwap: 10, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 1 def / 2 n / 3 外层for / 4 min_idx / 5 内层for / 6 if比较 / 7 newMin / 9 swap / 8 if(noSwap) / 10 return
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 9, noSwap: 8, done: 10 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 1 func / 2 n / 3 外层for / 4 minIdx / 5 内层for / 6 if比较 / 7 newMin / 11 swap / 10 if(noSwap) / 14 return
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 11, noSwap: 10, done: 14 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 1 fn / 2 n / 3 外层for / 4 min_idx / 5 内层for / 6 if比较 / 7 newMin / 11 swap / 10 if(noSwap) / (无 return，done 落 14)
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 11, noSwap: 10, done: 14 },
  },
];
```

- [ ] **Step 2: 写失败测试 `selection-sort.module.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { selectionSortSteps } from './selection-sort';
import { buildSelectionSortSteps, selectionSortModule } from './selection-sort.module';
import type { SelectionExecPoint } from '@/components/player/types';

const EXEC_POINTS: SelectionExecPoint[] = [
  'outerLoop',
  'innerLoop',
  'compare',
  'newMin',
  'swap',
  'noSwap',
  'done',
];

describe('buildSelectionSortSteps', () => {
  it('TC-SELECTION-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildSelectionSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildSelectionSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-SELECTION-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildSelectionSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = selectionSortSteps(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SELECTION-MOD-03 每步 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildSelectionSortSteps([3, 1, 2]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-SELECTION-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildSelectionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-SELECTION-MOD-05 每步 point 合法；swap 步 swapped 为真、noSwap 步不交换', () => {
    // [1,3,2]：i=0 时 1 已最小→noSwap，i=1 时→swap，同时覆盖两分支
    for (const s of buildSelectionSortSteps([1, 3, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'swap') expect(s.emphasis.swapped).toBe(true);
      if (s.point === 'noSwap') expect(s.emphasis.swapped).toBeFalsy();
    }
  });

  it('TC-SELECTION-MOD-06 newMin 步 min 指针落在 emphasis.minIndex 上', () => {
    const newMins = buildSelectionSortSteps([5, 3, 8, 1]).filter((s) => s.point === 'newMin');
    expect(newMins.length).toBeGreaterThan(0);
    for (const s of newMins) {
      const minIdx = s.emphasis.minIndex!;
      const minPointer = s.pointers.find((p) => p.id === '2')!;
      expect(minPointer.index).toBe(minIdx);
    }
  });

  it('TC-SELECTION-MOD-07 每轮结束后 i 位置即 [i,n) 最小（选择核心不变量）', () => {
    for (const s of buildSelectionSortSteps([5, 3, 8, 1, 9, 2])) {
      if (s.point !== 'swap' && s.point !== 'noSwap') continue;
      const i = s.pointers.find((p) => p.id === '0')!.index;
      const vals = s.array.map((t) => t[1]);
      expect(vals[i]).toBe(Math.min(...vals.slice(i)));
    }
  });

  it('TC-SELECTION-MOD-08 sortedUpTo 单调不减且末步为 n', () => {
    const steps = buildSelectionSortSteps([5, 3, 8, 1, 9]);
    let prev = -1;
    for (const s of steps) {
      const su = s.emphasis.sortedUpTo!;
      expect(su).toBeGreaterThanOrEqual(prev);
      prev = su;
    }
    expect(steps.at(-1)!.emphasis.sortedUpTo).toBe(5);
  });

  it('TC-SELECTION-MOD-09 交换次数 ≤ n-1', () => {
    const input = [5, 3, 8, 1, 9, 2];
    const swaps = buildSelectionSortSteps(input).filter((s) => s.point === 'swap').length;
    expect(swaps).toBeLessThanOrEqual(input.length - 1);
  });
});

describe('selectionSortModule.sources', () => {
  it('TC-SELECTION-MOD-10 四门语言齐备', () => {
    expect(selectionSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-SELECTION-MOD-11 每门语言每个 SelectionExecPoint 行号落在源码物理行范围内', () => {
    for (const src of selectionSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-SELECTION-MOD-12 实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildSelectionSortSteps(selectionSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of selectionSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/selection-sort.module.spec.ts`
Expected: FAIL（`buildSelectionSortSteps` / `selectionSortModule` 未定义）

- [ ] **Step 4: 实现 `selection-sort.module.ts`**

```ts
import type { AlgorithmModule, SelectionExecPoint, Step, VarRow } from '@/components/player/types';
import { selectionSortSources } from './selection-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）：待填位
const ID_J = '1'; // 蓝箭头（colors[1]）：扫描位
const ID_MIN = '2'; // 黄箭头（colors[2]）：当前最小

/** 插桩重走标准选择排序，产出逐行粒度的胖步骤 */
export function buildSelectionSortSteps(input: number[]): Step<SelectionExecPoint>[] {
  const steps: Step<SelectionExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let swapCount = 0;
  let sortedUpTo = 0; // [0, sortedUpTo) 已就位

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (i: number, j: number, minIdx: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'i', value: i },
    { name: 'j', value: j },
    { name: 'minIdx', value: minIdx },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'a[minIdx]', value: work[minIdx]?.[1] ?? '-' },
    { name: 'swapCount', value: swapCount },
    { name: 'sortedUpTo', value: sortedUpTo },
  ];

  const push = (
    point: SelectionExecPoint,
    i: number,
    j: number,
    minIdx: number,
    emphasis: Step['emphasis'] = {},
    caption?: string,
  ) => {
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers: [
        { id: ID_I, index: clampIdx(i) },
        { id: ID_J, index: clampIdx(j) },
        { id: ID_MIN, index: clampIdx(minIdx) },
      ],
      emphasis: { sortedUpTo, ...emphasis },
      vars: vars(i, j, minIdx),
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedUpTo = n;
    push('done', 0, 0, 0, {}, '完成');
    return steps;
  }

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    push('outerLoop', i, i, minIdx, { minIndex: minIdx }, `第 ${i + 1} 轮：先假定位置 ${i} 最小`);
    for (let j = i + 1; j < n; j++) {
      push('innerLoop', i, j, minIdx, { minIndex: minIdx }, `看位置 ${j}`);
      const aj = work[j][1];
      const amin = work[minIdx][1];
      const smaller = aj < amin;
      push(
        'compare',
        i,
        j,
        minIdx,
        { comparing: [j, minIdx], minIndex: minIdx },
        `${aj} ${smaller ? '<' : '≥'} ${amin}`,
      );
      if (smaller) {
        minIdx = j;
        push('newMin', i, j, minIdx, { minIndex: minIdx }, `更小，min ← ${j}`);
      }
    }
    if (minIdx !== i) {
      const a = work[i][1];
      const b = work[minIdx][1];
      [work[i], work[minIdx]] = [work[minIdx], work[i]];
      swapCount++;
      push('swap', i, i, minIdx, { comparing: [i, minIdx], swapped: true }, `交换 ${a} 与 ${b}`);
    } else {
      push('noSwap', i, i, i, { minIndex: i }, `位置 ${i} 已是最小，不交换`);
    }
    sortedUpTo = i + 1;
  }
  sortedUpTo = n;
  push('done', n - 1, n - 1, n - 1, {}, '完成');
  return steps;
}

export const selectionSortModule: AlgorithmModule<SelectionExecPoint> = {
  title: '选择排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildSelectionSortSteps,
  sources: selectionSortSources,
};
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/selection-sort.module.spec.ts`
Expected: PASS（12 个 case 全绿）

- [ ] **Step 6: 提交**

```bash
pnpm type-check
git add src/algorithms/selection-sort.sources.ts src/algorithms/selection-sort.module.ts src/algorithms/selection-sort.module.spec.ts
git commit -m "feat(algo): 选择排序 buildSteps 插桩重走 + 四语言源码/行映射（L3）

三指针 i/j/min + newMin 执行点 + 左侧 sortedUpTo；交叉校验 oracle，
覆盖选择核心不变量（每轮 i 位即 [i,n) 最小、sortedUpTo 单调、交换≤n-1）。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: 可视化扩展 `Bar` + `BarsView`（L4）

`Bar` 加常驻 `min` 态与紫配色；`BarsView.stateOf` 支持 `minIndex` / `sortedUpTo` 并落实优先级。冒泡路径不触发新分支。

**Files:**

- Modify: `src/components/Bar.vue`
- Modify: `src/components/BarsView.vue`
- Test: `src/components/Bar.spec.ts`（追加 1 case）
- Test: `src/components/BarsView.spec.ts`（追加 3 case）

**Interfaces:**

- Consumes: `StepEmphasis`（Task 1 的 `minIndex` / `sortedUpTo`）
- Produces:
  - `Bar` 的 `state` 扩为 `'idle'|'comparing'|'swapped'|'sorted'|'min'`
  - `BarsView.stateOf` 按 `sorted > swapped > min > comparing > idle` 取态

- [ ] **Step 1: 追加 Bar 失败测试 `Bar.spec.ts`**

在现有 `describe('Bar')` 末尾、闭合 `});` 之前追加：

```ts
it('TC-VIZ-BAR-04 state=min 时柱体加 min class', () => {
  const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'min' } });
  expect(w.find('.bar').classes()).toContain('min');
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: FAIL（`state: 'min'` 不被类型接受 / 无 `.bar.min` 类）

- [ ] **Step 3: 改 `Bar.vue`**

- `state` 类型加 `'min'`：

```ts
defineProps<{
  value: number;
  percent: number;
  state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min';
}>();
```

- 在 `<style>` 的 `.bar.sorted { ... }` 之后追加：

```less
.bar.min {
  background-color: #9d8df0;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: PASS（4 个 case）

- [ ] **Step 5: 追加 BarsView 失败测试 `BarsView.spec.ts`**

在现有 `describe('BarsView')` 末尾、闭合 `});` 之前追加：

```ts
it('TC-VIZ-BARSVIEW-06 minIndex 指向的 Bar 进入 min 态', () => {
  const w = mountIt({ ...base, emphasis: { minIndex: 1 } });
  expect(w.findAllComponents(Bar)[1].props('state')).toBe('min');
});

it('TC-VIZ-BARSVIEW-07 sortedUpTo 左侧的 Bar 进入 sorted 态', () => {
  const w = mountIt({ ...base, emphasis: { sortedUpTo: 2 } });
  const bars = w.findAllComponents(Bar);
  expect(bars[0].props('state')).toBe('sorted');
  expect(bars[1].props('state')).toBe('sorted');
  expect(bars[2].props('state')).toBe('idle'); // 下标 2 不在 [0,2)
});

it('TC-VIZ-BARSVIEW-08 比较帧优先级：minIndex 那根取 min、另一根取 comparing', () => {
  const w = mountIt({ ...base, emphasis: { comparing: [1, 2], minIndex: 2 } });
  const bars = w.findAllComponents(Bar);
  expect(bars[2].props('state')).toBe('min'); // minIndex 压过 comparing
  expect(bars[1].props('state')).toBe('comparing'); // 另一根（j）才是 comparing
});
```

- [ ] **Step 6: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/BarsView.spec.ts`
Expected: FAIL（`stateOf` 尚不识别 `minIndex` / `sortedUpTo`）

- [ ] **Step 7: 改 `BarsView.vue` 的 `stateOf`**

把现有 `stateOf` 整体替换为（注意返回类型加 `'min'`，并按优先级排序判断）：

```ts
function stateOf(index: number): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' {
  const e = props.emphasis;
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min'; // min 压过 comparing：比较帧 min 柱保持紫
  if (inCompare) return 'comparing'; // 另一根（j）才是 comparing 黄
  return 'idle';
}
```

- [ ] **Step 8: 运行测试，确认通过（含冒泡回归）**

Run: `pnpm test:unit run src/components/BarsView.spec.ts src/components/Bar.spec.ts`
Expected: PASS（BarsView 7+3=10、Bar 4，全绿；原 `sortedFrom`/`comparing`/`swapped` case 不受影响）

- [ ] **Step 9: 提交**

```bash
pnpm type-check
git add src/components/Bar.vue src/components/BarsView.vue src/components/Bar.spec.ts src/components/BarsView.spec.ts
git commit -m "feat(viz): Bar 增 min 紫态 + BarsView stateOf 支持 minIndex/sortedUpTo

柱态优先级 sorted>swapped>min>comparing>idle；冒泡路径不触发新分支。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: 接入 `SelectionSort.vue` + 路由（L4）

薄壳 + 懒加载路由，把选择排序模块挂进播放器。

**Files:**

- Create: `src/views/Article/SortAlgorithm/SelectionSort.vue`
- Modify: `src/router/index.ts`
- Test: `src/views/Article/SortAlgorithm/SelectionSort.spec.ts`

**Interfaces:**

- Consumes: `selectionSortModule`（Task 3）；`AlgorithmPlayer`（现有）
- Produces: `selection-sort` 命名路由（`name` = slug，菜单/首页据此高亮与跳转）

- [ ] **Step 1: 写失败测试 `SelectionSort.spec.ts`**

```ts
// src/views/Article/SortAlgorithm/SelectionSort.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import SelectionSort from './SelectionSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('SelectionSort', () => {
  it('TC-VIEW-SELECTION-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(SelectionSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-SELECTION-02 初始渲染 10 根柱子且默认停在第 0 步', async () => {
    const w = mount(SelectionSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/SelectionSort.spec.ts`
Expected: FAIL（`SelectionSort.vue` 不存在）

- [ ] **Step 3: 实现 `SelectionSort.vue`**

```vue
<!-- src/views/Article/SortAlgorithm/SelectionSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { selectionSortModule } from '@/algorithms/selection-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="selectionSortModule" />
</template>
```

- [ ] **Step 4: 注册路由 `src/router/index.ts`**

在 `bubble-sort` 路由对象之后、`children` 数组内追加：

```ts
          {
            path: '/docs/selection-sort',
            name: 'selection-sort',
            component: () => import('../views/Article/SortAlgorithm/SelectionSort.vue'),
          },
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/SelectionSort.spec.ts`
Expected: PASS（2 个 case）

- [ ] **Step 6: 手动核对（开发服）**

Run: `pnpm dev` → 打开 `/docs/selection-sort`
Expected: 不再 404；柱状图 + 三指针（红 i / 蓝 j / 黄 min）+ 代码面板渲染；默认停第 0 步。肉眼复核 min 紫柱与 comparing 黄、sorted 绿、swapped 橙区分清晰（不满意可微调 `#9d8df0`）。

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add src/views/Article/SortAlgorithm/SelectionSort.vue src/router/index.ts src/views/Article/SortAlgorithm/SelectionSort.spec.ts
git commit -m "feat(viz): 选择排序视图 SelectionSort + 懒加载路由（修复菜单/首页 404）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: 端到端 + 索引/文档回写

补 L5，再把测试与计划索引、roadmap、文档状态全部回写到位（规范 §11 收尾）。

**Files:**

- Create: `e2e/selection-sort.e2e.ts`
- Modify: `docs/test-cases/index.md`、`docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/index.md`、`docs/roadmap.md`
- Modify: `docs/plans/20260620-c007-selection-sort/{requirements,design,test-cases,implementation}.md`（状态 draft → verified、Progress 100%）

**Interfaces:**

- Consumes: 已上线的 `/docs/selection-sort` 页（Task 5）

- [ ] **Step 1: 写 L5 端到端 `e2e/selection-sort.e2e.ts`**

```ts
import { test, expect } from '@playwright/test';

test('TC-E2E-SELECTION-01 选择排序播放器：默认暂停/单步/跳末升序/重置', async ({ page }) => {
  await page.goto('/docs/selection-sort');

  const bars = page.locator('.bar-cell');
  await expect(bars).toHaveCount(10);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

  // 真机 Shiki 着色（单测里 useHighlighter 被 mock，这里补真机覆盖）
  await expect(page.locator('.code .tok[style*="color"]').first()).toBeVisible();

  // 单步前进
  await page.locator('.ctl[title="下一步"]').click();
  await expect(page.locator('.counter')).toContainText('2 / ');

  // 拖到末步 → 数值升序
  const scrub = page.locator('.scrub');
  const max = await scrub.getAttribute('max');
  await scrub.evaluate((el: HTMLInputElement, v: string) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, max!);
  const values = await page.locator('.bar-cell .val').allInnerTexts();
  const nums = values.map((t) => parseInt(t, 10));
  expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // 重置回第 0 步
  await page.locator('.ctl[title="重置"]').click();
  await expect(page.locator('.counter')).toContainText('1 / ');
});
```

- [ ] **Step 2: 运行端到端，确认通过**

Run: `pnpm test:e2e selection-sort`
Expected: PASS（TC-E2E-SELECTION-01 绿）

> 若选择器与冒泡 e2e 不一致（`.ctl[title]` / `.scrub` / `.counter` / `.bar-cell .val`），以 `TransportControls.vue` / `BarsView.vue` 实际 class 为准对齐——它们与冒泡共用同一外壳，理应一致。

- [ ] **Step 3: 全量测试 + 门禁总检**

Run: `pnpm test:unit run && pnpm test:e2e && pnpm lint:check && pnpm format:check && pnpm type-check`
Expected: 全绿。统计：新增 L3 16 + L4 6 + L5 1 = 23 Case 全通过，冒泡全量回归绿。

- [ ] **Step 4: 回写测试三索引 `docs/test-cases/{index,by-layer,by-module}.md`**

按现有表格式追加 23 行（Owner Plan = `C-20260620-007`，状态 active，最后验证 2026-06-20）：

- `index.md`「All Cases」：追加 `TC-SEL-ALGO-01..04`、`TC-SELECTION-MOD-01..12`、`TC-VIZ-BAR-04`、`TC-VIZ-BARSVIEW-06..08`、`TC-VIEW-SELECTION-01..02`、`TC-E2E-SELECTION-01`。
- `by-layer.md`：按 L3/L4/L5 分别归入。
- `by-module.md`：`algorithms` 组加 `TC-SEL-ALGO-*` + `TC-SELECTION-MOD-*`；`viz-engine` 组加 `TC-VIZ-BAR-04` + `TC-VIZ-BARSVIEW-06..08`；`article-sort` 组加 `TC-VIEW-SELECTION-*` + `TC-E2E-SELECTION-01`。

示范（`index.md` 一行，其余照此格式，列与现有表对齐）：

```
| TC-SEL-ALGO-01      | 空数组与单元素不产生步骤 | algorithms / selection-sort | C-20260620-007 | L3   | `src/algorithms/selection-sort.spec.ts` | active | 2026-06-20 |
```

- [ ] **Step 5: 回写计划与路线图**

- `docs/plans/index.md`：C-20260620-007 行 状态 `draft → verified`、完成度 `0% → 100%`、下一步 `已完成`（All Changes / By Type / By Module 三处同步）。
- `docs/roadmap.md`：M3 行下一步更新；优先级表 C-007 下一步改为「已完成，待接入下一个算法」。

- [ ] **Step 6: 文档状态机收尾**

把本变更四文档头部 `Status: draft → verified`、`Progress: 0% → 100%`、`Next action: 已完成`；`test-cases.md` 补「汇总统计（实测）」表（仿 c006）。

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add e2e/selection-sort.e2e.ts docs/
git commit -m "test(c007): 选择排序 L5 端到端 + 三索引/roadmap/文档状态回写

新增 23 个 Case 全绿（L3 16 + L4 6 + L5 1），冒泡全量回归绿；
C-20260620-007 收尾为 verified。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## 推进顺序与依赖

```
Task 1（types 泛型化 + 冒泡回归）── 地基，必须先绿
   └─ Task 2（oracle）
        └─ Task 3（module + sources，交叉校验依赖 oracle）
   └─ Task 4（Bar/BarsView 扩展，依赖 Task 1 的 StepEmphasis 字段）
        └─ Task 5（视图 + 路由，依赖 Task 3 module + Task 4 可视化）
             └─ Task 6（e2e + 回写，依赖整页可跑）
```

每个 Task 以「对应测试绿 + `pnpm type-check` 绿」为关卡；Task 1 额外以「冒泡全量回归绿」为硬关卡。

## 自检要点（执行者每 Task 结束核对）

- 类型一致：`buildSelectionSortSteps` / `selectionSortModule` / `selectionSortSources` / `selectionSortSteps` 命名跨 Task 一致。
- 行号准确：改选择排序四语言源码任一行，必须同步 `lineMap`，并靠 `TC-SELECTION-MOD-11` 兜底。
- 向后兼容：任何一步若让冒泡现有 Case 变红，停下排查（优先怀疑泛型标注或 `stateOf` 优先级）。
- 无占位符：每个 Step 的代码块均可直接落地，无 TODO。
