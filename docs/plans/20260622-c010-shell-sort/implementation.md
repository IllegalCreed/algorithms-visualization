# 希尔排序动画 实现计划

> Status: draft
> Stable ID: C-20260622-010
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 0%
> Blocked by: none
> Next action: 按 Task 1→5 逐步执行（subagent-driven 或 inline）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007、C-20260621-008
> Related tests: test-cases.md
> Related design: design.md

> **For agentic workers:** 本计划用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐 Task 执行。步骤用 `- [ ]` 复选框跟踪。每个 Task 结束都有可独立测试的交付物。

**Goal:** 用 C-006「算法播放器」框架 + C-008 已成熟的「移位插桩」范式接入希尔排序，把步长从 1 泛化为可变 gap，呈现「按 gap 分组、聚焦当前组、逐组插入排序」动画，纯加法扩展，冒泡 + 选择 + 插入零回归。

**Architecture:** 希尔排序实现一个 `AlgorithmModule<ShellExecPoint>`（插桩 `buildSteps` 产胖步骤 + 四语言源码与行映射），外壳零改动。module 是插入排序 module 的泛化：「相邻交换 + `j--`」→「跨 gap 交换 + `j -= gap`」，外面套两层循环（`gap` 减半 + 逐组 `start`），并为每组打 `groupMembers`。可视化新增 `dimmed` 柱态淡出非当前组（`stateOf` 最低有效档）；`key` 玫红态、两指针红蓝、FLIP 移位沿用 C-008。希尔不稳定，故不测稳定性，改测「各 gap-pass 后子序列有序」与 oracle 交叉校验。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + Pinia + Less；语法高亮复用现有 Shiki（`useHighlighter`）；测试 Vitest + @vue/test-utils（L3/L4）+ Playwright（L5）。

## Global Constraints

- 包管理器 **pnpm**（corepack，版本锁 `packageManager`）；禁用 npm/yarn。
- 路径别名 `@` → `src/`；优先 `@/...`。
- Less 全局混入（`.neumorphism-*`、`.row()`、`.center()`、颜色变量）已由 `vite.config.ts` 的 `additionalData` 注入，**组件内无需 import**。
- 多语言代码仅展示；动画唯一真相源是内置 TS 步骤流。单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，**不依赖异步 `delay`**。
- 语言集固定四门：**TypeScript / Python / Go / Rust**；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：`types.ts` 加 `ShellExecPoint` + `groupMembers?` 后，冒泡（`bubble-sort.*`）、选择（`selection-sort.*`）、插入（`insertion-sort.*`）三侧**零行为变化**，全量现有 Case 保持绿。
- 柱态优先级（扩展后）：`key > sorted > swapped > min > comparing > dimmed > idle`（`dimmed` 最低有效档，只淡化「既不在当前组、又无其它强调」的旁观柱）。
- gap 序列固定 `gap = ⌊n/2⌋` 逐次 `/2` 到 1；`dimmed` 暂定 `opacity: 0.28`；初始数据沿用 `[7,6,5,10,9,8,4,3,2,1]`；两指针 id `'0'`=i(红，本轮取出位置)/`'1'`=j(蓝，左探位置，按 gap 跳)，取 `colors[0/1]`。
- 门禁：`pnpm lint:check` + `pnpm format:check` + `pnpm type-check` 必须绿；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）。提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: 数据契约加法 + 可视化 `dimmed` 态（`types` + `Bar` + `BarsView`，L4）

`types.ts` 加 `ShellExecPoint` union + `StepEmphasis.groupMembers?`（纯加法）；`Bar` 加 `dimmed` 态与降透明度样式；`BarsView.stateOf` 支持 `groupMembers` 并置于**最低有效档**（`comparing` 之后、`idle` 之前）。冒泡 / 选择 / 插入路径不触发新分支——它们 emphasis 无 `groupMembers`，恒 `undefined`。

**Files:**

- Modify: `src/components/player/types.ts`
- Modify: `src/components/Bar.vue`
- Modify: `src/components/BarsView.vue`
- Test: `src/components/Bar.spec.ts`（追加 1 case）
- Test: `src/components/BarsView.spec.ts`（追加 3 case）

**Interfaces:**

- Produces（后续 Task 依赖）：
  - `ShellExecPoint = 'gapChange' | 'groupStart' | 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done'`
  - `StepEmphasis` 新增可选字段 `groupMembers?: number[]`
  - `Bar` 的 `state` 扩为 `'idle'|'comparing'|'swapped'|'sorted'|'min'|'key'|'dimmed'`
  - `BarsView.stateOf` 按 `key > sorted > swapped > min > comparing > dimmed > idle` 取态

- [ ] **Step 1: 追加 Bar 失败测试 `src/components/Bar.spec.ts`**

在现有 `describe('Bar', () => { ... })` 末尾、闭合 `});` 之前追加：

```ts
it('TC-VIZ-BAR-06 state=dimmed 时柱体加 dimmed class', () => {
  const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'dimmed' } });
  expect(w.find('.bar').classes()).toContain('dimmed');
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: FAIL（`state: 'dimmed'` 不被类型接受 / 无 `.bar.dimmed` 类）

- [ ] **Step 3: 改 `src/components/Bar.vue`**

- `state` 类型加 `'dimmed'`（`defineProps` 内）：

```ts
defineProps<{
  value: number;
  percent: number;
  state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' | 'dimmed';
}>();
```

- 在 `<style>` 的 `.bar.key { ... }` 之后追加：

```less
.bar.dimmed {
  opacity: 0.28;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: PASS（6 个 case）

- [ ] **Step 5: 给 `types.ts` 加 `ShellExecPoint` + `groupMembers?`**

- 在 `InsertionExecPoint` 定义之后追加：

```ts
/** 希尔排序的执行点（gap 减半 → 逐组 start → 组内插入：gapChange/groupStart 为分组标记步） */
export type ShellExecPoint =
  | 'gapChange'
  | 'groupStart'
  | 'outerLoop'
  | 'compare'
  | 'shift'
  | 'insert'
  | 'done';
```

- 在 `StepEmphasis` 的 `keyIndex?: number;` 行之后追加一个字段：

```ts
  groupMembers?: number[]; // 希尔：当前子序列的下标集；不在其中且无其它强调 → dimmed 淡出
```

- [ ] **Step 6: 追加 BarsView 失败测试 `src/components/BarsView.spec.ts`**

在现有 `describe('BarsView', () => { ... })` 末尾、闭合 `});` 之前追加（`base` 为该文件已定义的 3 元素夹具 `[['0',5],['1',9],['2',1]]`）：

```ts
it('TC-VIZ-BARSVIEW-12 groupMembers 内的柱保持 idle、外的柱 dimmed', () => {
  const w = mountIt({ ...base, emphasis: { groupMembers: [0, 2] } });
  const bars = w.findAllComponents(Bar);
  expect(bars[0].props('state')).toBe('idle'); // 在当前组
  expect(bars[1].props('state')).toBe('dimmed'); // 不在 [0,2] → 淡出
  expect(bars[2].props('state')).toBe('idle'); // 在当前组
});

it('TC-VIZ-BARSVIEW-13 dimmed 是最低档：组外的 key/comparing 仍取本态（不被淡化掩盖）', () => {
  const w = mountIt({ ...base, emphasis: { groupMembers: [0], keyIndex: 1, comparing: [1, 2] } });
  const bars = w.findAllComponents(Bar);
  expect(bars[0].props('state')).toBe('idle'); // 组内、无其它强调
  expect(bars[1].props('state')).toBe('key'); // keyIndex 压过 dimmed（即便不在组内）
  expect(bars[2].props('state')).toBe('comparing'); // comparing 压过 dimmed（即便不在组内）
});

it('TC-VIZ-BARSVIEW-14 空 groupMembers 不淡化任何柱', () => {
  const w = mountIt({ ...base, emphasis: { groupMembers: [] } });
  for (const bar of w.findAllComponents(Bar)) {
    expect(bar.props('state')).toBe('idle');
  }
});
```

- [ ] **Step 7: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/BarsView.spec.ts`
Expected: FAIL（`stateOf` 尚不识别 `groupMembers`）

- [ ] **Step 8: 改 `src/components/BarsView.vue` 的 `stateOf`**

把现有 `stateOf` 整体替换为（返回类型加 `'dimmed'`，并在 `comparing` 分支**之后、`idle` 之前**加 `groupMembers` 分支）：

```ts
function stateOf(
  index: number,
): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' | 'dimmed' {
  const e = props.emphasis;
  if (e.keyIndex === index) return 'key'; // key 压过一切（含 sorted）：滑入已排序区也保持玫红
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min'; // min 压过 comparing
  if (inCompare) return 'comparing'; // 另一根（j）才是 comparing 黄
  // 希尔：当前组之外、且无任何其它强调 → 淡出（最低有效档，绝不掩盖活跃柱）
  if (e.groupMembers && e.groupMembers.length > 0 && !e.groupMembers.includes(index))
    return 'dimmed';
  return 'idle';
}
```

- [ ] **Step 9: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/BarsView.spec.ts src/components/Bar.spec.ts`
Expected: PASS（BarsView 11+3=14、Bar 5+1=6，全绿；原 `sortedFrom`/`comparing`/`swapped`/`minIndex`/`sortedUpTo`/`keyIndex` case 不受影响）

- [ ] **Step 10: 全量回归（向后兼容硬验收）+ type-check**

Run: `pnpm type-check && pnpm test:unit run`
Expected: PASS（**冒泡 + 选择 + 插入全部现有 Case 绿**；新加分支不触发它们的路径）

- [ ] **Step 11: 提交**

```bash
git add src/components/player/types.ts src/components/Bar.vue src/components/BarsView.vue src/components/Bar.spec.ts src/components/BarsView.spec.ts
git commit -m "feat(viz): types 加 ShellExecPoint/groupMembers + Bar dimmed 态 + BarsView dimmed 优先级

纯加法扩展：StepEmphasis 加 groupMembers（最低有效档，不掩盖活跃强调）；
Bar 加 dimmed 态 opacity:0.28；冒泡/选择/插入路径不触发新分支、全量回归绿。为希尔排序铺路。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: 希尔排序 oracle `shell-sort.ts`（L3）

纯算法 oracle，对标 `insertion-sort.ts`，作为后续 `buildSteps` 的正确性交叉校验源。返回**每个 gap-pass 完成后的快照**序列——既验证最终升序，又验证 gap 序列与各阶段中间态（`buildSteps` 的 `gapChange` 边界据此交叉校验）。

**Files:**

- Create: `src/algorithms/shell-sort.ts`
- Test: `src/algorithms/shell-sort.spec.ts`

**Interfaces:**

- Produces:
  - `interface ShellSortPass { gap: number; array: number[] }`
  - `shellSortPasses(input: number[]): ShellSortPass[]`（纯函数，不改入参；空/单元素返回 `[]`）

- [ ] **Step 1: 写失败测试 `src/algorithms/shell-sort.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { shellSortPasses } from './shell-sort';

describe('shellSortPasses', () => {
  it('TC-SHELL-ALGO-01 空数组与单元素不产生 pass', () => {
    expect(shellSortPasses([])).toEqual([]);
    expect(shellSortPasses([5])).toEqual([]);
  });

  it('TC-SHELL-ALGO-02 最终 pass 升序排列', () => {
    const passes = shellSortPasses([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    expect(passes.at(-1)!.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SHELL-ALGO-03 含重复元素结果正确且不越界', () => {
    expect(shellSortPasses([3, 1, 3, 2]).at(-1)!.array).toEqual([1, 2, 3, 3]);
  });

  it('TC-SHELL-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    shellSortPasses(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-SHELL-ALGO-05 gap 序列为 ⌊n/2⌋ 减半到 1', () => {
    expect(shellSortPasses([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]).map((p) => p.gap)).toEqual([5, 2, 1]);
    expect(shellSortPasses([4, 3, 2, 1]).map((p) => p.gap)).toEqual([2, 1]);
  });

  it('TC-SHELL-ALGO-06 已升序输入：最终仍升序、gap 序列不变（幂等正确）', () => {
    const passes = shellSortPasses([1, 2, 3, 4, 5]);
    expect(passes.at(-1)!.array).toEqual([1, 2, 3, 4, 5]);
    expect(passes.map((p) => p.gap)).toEqual([2, 1]);
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/shell-sort.spec.ts`
Expected: FAIL（`shellSortPasses` 未定义）

- [ ] **Step 3: 实现 `src/algorithms/shell-sort.ts`**

```ts
export interface ShellSortPass {
  gap: number; // 该轮步长
  array: number[]; // 该 gap-pass 完成后的数组快照
}

/** 标准希尔排序（gap = ⌊n/2⌋ 减半），返回每个 gap-pass 后的快照（纯函数，不改入参） */
export function shellSortPasses(input: number[]): ShellSortPass[] {
  const arr = [...input];
  const n = arr.length;
  const passes: ShellSortPass[] = [];
  for (let gap = n >> 1; gap > 0; gap >>= 1) {
    for (let start = 0; start < gap; start++) {
      for (let i = start + gap; i < n; i += gap) {
        const key = arr[i];
        let j = i;
        while (j >= gap && arr[j - gap] > key) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = key;
      }
    }
    passes.push({ gap, array: [...arr] });
  }
  return passes;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/shell-sort.spec.ts`
Expected: PASS（6 个 case）

- [ ] **Step 5: 提交**

```bash
pnpm type-check
git add src/algorithms/shell-sort.ts src/algorithms/shell-sort.spec.ts
git commit -m "feat(algo): 希尔排序纯逻辑 oracle shellSortPasses（L3）

返回每个 gap-pass 快照，供 module buildSteps 交叉校验 gap 序列与各阶段中间态。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: 希尔排序模块 `buildSteps` + 四语言源码（L3）

把希尔排序插桩重走为胖 `Step<ShellExecPoint>[]`，配四语言源码与 `lineMap`。移位用跨 gap 交换 `work` 元素（key 与 `keyIdx-gap` 处元素换位），保持 id 集合恒定。与 oracle 交叉校验 + 希尔不变量（各 gap-pass 边界一致、gap 序列、`groupMembers` 正确、key 跨 gap 单调左跳）。

**Files:**

- Create: `src/algorithms/shell-sort.sources.ts`
- Create: `src/algorithms/shell-sort.module.ts`
- Test: `src/algorithms/shell-sort.module.spec.ts`

**Interfaces:**

- Consumes: `AlgorithmModule`/`Step`/`LangSource`/`ShellExecPoint`/`VarRow` from `@/components/player/types`（Task 1）；`shellSortPasses` from `./shell-sort`（Task 2，测试里交叉校验用）
- Produces:
  - `shellSortSources: LangSource<ShellExecPoint>[]`
  - `buildShellSortSteps(input: number[]): Step<ShellExecPoint>[]`
  - `shellSortModule: AlgorithmModule<ShellExecPoint>`

- [ ] **Step 1: 写四语言源码 `src/algorithms/shell-sort.sources.ts`**

> `lineMap` 行号 1-based，对应 `code` 字符串去掉首行换行后的物理行。改源码即同步改 `lineMap`（Step 4 的 L3 校验每个 `ShellExecPoint` 行号 ∈ `[1, 行数]`）。希尔的 `j` 满足 `j >= gap` 才进循环、`j -= gap` 后 `j >= 0`，**永不下溢**，故 Rust 用 `usize`（无需插入排序的 `i32`）。

```ts
import type { LangSource, ShellExecPoint } from '@/components/player/types';

const ts = `function shellSort(a: number[]): number[] {
  const n = a.length;
  for (let gap = n >> 1; gap > 0; gap >>= 1) {
    for (let start = 0; start < gap; start++) {
      for (let i = start + gap; i < n; i += gap) {
        const key = a[i];
        let j = i;
        while (j >= gap && a[j - gap] > key) {
          a[j] = a[j - gap];
          j -= gap;
        }
        a[j] = key;
      }
    }
  }
  return a;
}`;

const python = `def shell_sort(a):
    n = len(a)
    gap = n // 2
    while gap > 0:
        for start in range(gap):
            for i in range(start + gap, n, gap):
                key = a[i]
                j = i
                while j >= gap and a[j - gap] > key:
                    a[j] = a[j - gap]
                    j -= gap
                a[j] = key
        gap //= 2
    return a`;

const go = `func shellSort(a []int) []int {
\tn := len(a)
\tfor gap := n / 2; gap > 0; gap /= 2 {
\t\tfor start := 0; start < gap; start++ {
\t\t\tfor i := start + gap; i < n; i += gap {
\t\t\t\tkey := a[i]
\t\t\t\tj := i
\t\t\t\tfor j >= gap && a[j-gap] > key {
\t\t\t\t\ta[j] = a[j-gap]
\t\t\t\t\tj -= gap
\t\t\t\t}
\t\t\t\ta[j] = key
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn shell_sort(a: &mut Vec<i32>) {
    let n = a.len();
    let mut gap = n / 2;
    while gap > 0 {
        for start in 0..gap {
            let mut i = start + gap;
            while i < n {
                let key = a[i];
                let mut j = i;
                while j >= gap && a[j - gap] > key {
                    a[j] = a[j - gap];
                    j -= gap;
                }
                a[j] = key;
                i += gap;
            }
        }
        gap /= 2;
    }
}`;

export const shellSortSources: LangSource<ShellExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 3 gap循环 / 4 start循环 / 5 i循环 / 6 key / 7 j / 8 while比较 / 9 右移 / 10 j-=gap / 12 insert / 16 return
    lineMap: {
      gapChange: 3,
      groupStart: 4,
      outerLoop: 5,
      compare: 8,
      shift: 9,
      insert: 12,
      done: 16,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 3 gap=n//2 / 4 while gap>0 / 5 start循环 / 6 i循环 / 7 key / 8 j / 9 while比较 / 10 右移 / 11 j-=gap / 12 insert / 13 gap//=2 / 14 return
    lineMap: {
      gapChange: 4,
      groupStart: 5,
      outerLoop: 6,
      compare: 9,
      shift: 10,
      insert: 12,
      done: 14,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 3 gap循环 / 4 start循环 / 5 i循环 / 6 key / 7 j / 8 for比较 / 9 右移 / 10 j-=gap / 12 insert / 16 return
    lineMap: {
      gapChange: 3,
      groupStart: 4,
      outerLoop: 5,
      compare: 8,
      shift: 9,
      insert: 12,
      done: 16,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 4 while gap>0 / 5 start循环 / 7 while i<n / 8 key / 9 j / 10 while比较 / 11 右移 / 12 j-=gap / 14 insert / 20 末尾}（无 return）
    lineMap: {
      gapChange: 4,
      groupStart: 5,
      outerLoop: 7,
      compare: 10,
      shift: 11,
      insert: 14,
      done: 20,
    },
  },
];
```

- [ ] **Step 2: 写失败测试 `src/algorithms/shell-sort.module.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { shellSortPasses } from './shell-sort';
import { buildShellSortSteps, shellSortModule } from './shell-sort.module';
import type { ShellExecPoint, Step } from '@/components/player/types';

const EXEC_POINTS: ShellExecPoint[] = [
  'gapChange',
  'groupStart',
  'outerLoop',
  'compare',
  'shift',
  'insert',
  'done',
];

const num = (s: Step<ShellExecPoint>, name: string) =>
  Number(s.vars.find((v) => v.name === name)!.value);

describe('buildShellSortSteps', () => {
  it('TC-SHELL-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildShellSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildShellSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-SHELL-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildShellSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = shellSortPasses(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SHELL-MOD-03 每步 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildShellSortSteps([3, 1, 2]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-SHELL-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildShellSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-SHELL-MOD-05 每步 point 合法；shift 步必带数值型 keyIndex', () => {
    for (const s of buildShellSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'shift') expect(typeof s.emphasis.keyIndex).toBe('number');
    }
  });

  it('TC-SHELL-MOD-06 gapChange 步的 gap 依次为 ⌊n/2⌋ 减半到 1', () => {
    const steps = buildShellSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]); // n=10
    const gaps = steps.filter((s) => s.point === 'gapChange').map((s) => num(s, 'gap'));
    expect(gaps).toEqual([5, 2, 1]);
  });

  it('TC-SHELL-MOD-07 各 gap-pass 边界数组与 oracle 快照一致', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const steps = buildShellSortSteps(input);
    const passes = shellSortPasses(input);
    const gapChanges = steps.filter((s) => s.point === 'gapChange');
    // 第 k 个 gapChange（k≥1）的 array = 第 k-1 个 pass 完成态；done = 最后一个 pass
    for (let k = 1; k < gapChanges.length; k++) {
      expect(gapChanges[k].array.map((t) => t[1])).toEqual(passes[k - 1].array);
    }
    expect(steps.at(-1)!.array.map((t) => t[1])).toEqual(passes.at(-1)!.array);
  });

  it('TC-SHELL-MOD-08 每个 groupStart 的 groupMembers = 该 gap 下的子序列下标', () => {
    const n = 10;
    const steps = buildShellSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    for (const s of steps.filter((x) => x.point === 'groupStart')) {
      const gap = num(s, 'gap');
      const start = num(s, 'group');
      const expected: number[] = [];
      for (let k = start; k < n; k += gap) expected.push(k);
      expect([...s.emphasis.groupMembers!]).toEqual(expected);
    }
  });

  it('TC-SHELL-MOD-09 一轮内 keyIndex 单调不增（key 只向左跳）', () => {
    const steps = buildShellSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    let prev = Infinity;
    for (const s of steps) {
      if (s.point === 'outerLoop') {
        prev = s.emphasis.keyIndex!; // 新一轮起点
        continue;
      }
      if (s.point === 'gapChange' || s.point === 'groupStart' || s.point === 'done') {
        prev = Infinity; // 轮间重置
        continue;
      }
      if (s.emphasis.keyIndex === undefined) continue;
      expect(s.emphasis.keyIndex).toBeLessThanOrEqual(prev);
      prev = s.emphasis.keyIndex;
    }
  });

  it('TC-SHELL-MOD-10 done 步标 sortedFrom=0（全部有序）', () => {
    const done = buildShellSortSteps([5, 3, 8, 1, 9, 2]).at(-1)!;
    expect(done.point).toBe('done');
    expect(done.emphasis.sortedFrom).toBe(0);
  });
});

describe('shellSortModule.sources', () => {
  it('TC-SHELL-MOD-11 四门语言齐备', () => {
    expect(shellSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-SHELL-MOD-12 每门语言每个 ShellExecPoint 行号落在源码物理行范围内', () => {
    for (const src of shellSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-SHELL-MOD-13 实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildShellSortSteps(shellSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of shellSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/shell-sort.module.spec.ts`
Expected: FAIL（`buildShellSortSteps` / `shellSortModule` 未定义）

- [ ] **Step 4: 实现 `src/algorithms/shell-sort.module.ts`**

```ts
import type { AlgorithmModule, ShellExecPoint, Step, VarRow } from '@/components/player/types';
import { shellSortSources } from './shell-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）：本轮取出元素的原始下标
const ID_J = '1'; // 蓝箭头（colors[1]）：左探位置（被比较元素，按 gap 跳）

/** 插桩重走「按组显式三层」希尔排序，产出逐行粒度的胖步骤 */
export function buildShellSortSteps(input: number[]): Step<ShellExecPoint>[] {
  const steps: Step<ShellExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let shiftCount = 0;
  let gap = 0;
  let start = -1; // -1：尚未进入子序列（gapChange/done 帧 group 显示 '-'）

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (i: number, key: number, j: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'gap', value: gap },
    { name: 'group', value: start >= 0 ? start : '-' },
    { name: 'i', value: i },
    { name: 'key', value: key },
    { name: 'j', value: j },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'shiftCount', value: shiftCount },
  ];

  const push = (
    point: ShellExecPoint,
    i: number,
    key: number,
    j: number,
    emphasis: Step['emphasis'] = {},
    caption?: string,
  ) => {
    steps.push({
      array: work.map((t) => [t[0], t[1]] as [string, number]),
      pointers: [
        { id: ID_I, index: clampIdx(i) },
        { id: ID_J, index: clampIdx(j) },
      ],
      emphasis,
      vars: vars(i, key, j),
      point,
      caption,
    });
  };

  if (n <= 1) {
    push('done', 0, work[0]?.[1] ?? 0, 0, { sortedFrom: 0 }, '完成');
    return steps;
  }

  const groupOf = (s: number, g: number): number[] => {
    const r: number[] = [];
    for (let k = s; k < n; k += g) r.push(k);
    return r;
  };

  for (gap = n >> 1; gap > 0; gap >>= 1) {
    start = -1;
    push('gapChange', 0, work[0][1], 0, {}, `gap=${gap}：步长减半，分 ${gap} 组`);
    for (start = 0; start < gap; start++) {
      const members = groupOf(start, gap);
      push(
        'groupStart',
        start,
        work[start][1],
        start,
        { groupMembers: members },
        `步长 ${gap} · 组 ${start}`,
      );
      for (let i = start + gap; i < n; i += gap) {
        const key = work[i][1];
        let keyIdx = i;
        let j = i - gap;
        push(
          'outerLoop',
          i,
          key,
          j,
          { keyIndex: keyIdx, groupMembers: members },
          `取出 key=${key}（下标 ${i}）`,
        );
        while (j >= start) {
          const aj = work[j][1];
          const greater = aj > key;
          push(
            'compare',
            i,
            key,
            j,
            { comparing: [j, keyIdx], keyIndex: keyIdx, groupMembers: members },
            `a[${j}]=${aj} ${greater ? '>' : '≤'} key=${key}`,
          );
          if (!greater) break; // 找到插入点，停
          // 跨 gap 交换：key 与左邻 work[j] 换位；key 左跳、aj 右让
          [work[j], work[keyIdx]] = [work[keyIdx], work[j]];
          keyIdx = j;
          shiftCount++;
          push(
            'shift',
            i,
            key,
            j,
            { keyIndex: keyIdx, groupMembers: members },
            `${aj} 右移 gap=${gap}，key 跳到 ${keyIdx}`,
          );
          j -= gap;
        }
        push(
          'insert',
          i,
          key,
          j,
          { keyIndex: keyIdx, groupMembers: members },
          `key=${key} 插入下标 ${keyIdx}`,
        );
      }
    }
  }
  start = -1;
  push('done', n - 1, work[n - 1][1], n - 1, { sortedFrom: 0 }, '完成，全部有序');
  return steps;
}

export const shellSortModule: AlgorithmModule<ShellExecPoint> = {
  title: '希尔排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入排序同款，便于横向对比
  buildSteps: buildShellSortSteps,
  sources: shellSortSources,
};
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/shell-sort.module.spec.ts`
Expected: PASS（13 个 case 全绿）

- [ ] **Step 6: 提交**

```bash
pnpm type-check
git add src/algorithms/shell-sort.sources.ts src/algorithms/shell-sort.module.ts src/algorithms/shell-sort.module.spec.ts
git commit -m "feat(algo): 希尔排序 buildSteps 跨 gap 插桩 + 四语言源码/行映射（L3）

按组显式三层：gap 减半 → 逐组 start → 组内插入；跨 gap 交换实现移位、id 集合恒定；
groupMembers 标记当前组；交叉校验 oracle 各 gap-pass 边界，覆盖 gap 序列、组成员、key 跨 gap 单调左跳。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: 接入 `ShellSort.vue` + 路由（L4）

薄壳 + 懒加载路由，把希尔排序模块挂进播放器，修复菜单/首页点击 404。

**Files:**

- Create: `src/views/Article/SortAlgorithm/ShellSort.vue`
- Modify: `src/router/index.ts`
- Test: `src/views/Article/SortAlgorithm/ShellSort.spec.ts`

**Interfaces:**

- Consumes: `shellSortModule`（Task 3）；`AlgorithmPlayer`（现有）
- Produces: `shell-sort` 命名路由（`name` = slug，菜单/首页据此高亮与跳转）

- [ ] **Step 1: 写失败测试 `src/views/Article/SortAlgorithm/ShellSort.spec.ts`**

```ts
// src/views/Article/SortAlgorithm/ShellSort.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ShellSort from './ShellSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('ShellSort', () => {
  it('TC-VIEW-SHELL-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(ShellSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-SHELL-02 初始渲染 10 根柱子且默认停在第 0 步', async () => {
    const w = mount(ShellSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/ShellSort.spec.ts`
Expected: FAIL（`ShellSort.vue` 不存在）

- [ ] **Step 3: 实现 `src/views/Article/SortAlgorithm/ShellSort.vue`**

```vue
<!-- src/views/Article/SortAlgorithm/ShellSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { shellSortModule } from '@/algorithms/shell-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="shellSortModule" />
</template>
```

- [ ] **Step 4: 注册路由 `src/router/index.ts`**

在 `insertion-sort` 路由对象之后、`children` 数组内追加：

```ts
          {
            path: '/docs/shell-sort',
            name: 'shell-sort',
            component: () => import('../views/Article/SortAlgorithm/ShellSort.vue'),
          },
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/ShellSort.spec.ts`
Expected: PASS（2 个 case）

- [ ] **Step 6: 手动核对（开发服）**

Run: `pnpm dev` → 打开 `/docs/shell-sort`
Expected: 不再 404；柱状图 + 两指针（红 i / 蓝 j）+ 代码面板渲染；默认停第 0 步。单步播放，肉眼复核：每轮 gap 下当前组高亮、其余柱 dimmed 淡出；key 玫红柱跨 gap 跳跃左滑；逐组完成后 gap 减半、组变少变大；末轮 gap=1 仅少量微调即全绿。明 / 暗主题下 `opacity:0.28` 的淡出明显但仍可读（不满意可微调）。

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add src/views/Article/SortAlgorithm/ShellSort.vue src/router/index.ts src/views/Article/SortAlgorithm/ShellSort.spec.ts
git commit -m "feat(viz): 希尔排序视图 ShellSort + 懒加载路由（修复菜单/首页 404）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: 端到端 + 索引/文档回写

补 L5，再把测试与计划索引、roadmap、文档状态全部回写到位（规范 §11 收尾）。

**Files:**

- Create: `e2e/shell-sort.e2e.ts`
- Modify: `docs/test-cases/index.md`、`docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/index.md`、`docs/roadmap.md`
- Modify: `docs/plans/20260622-c010-shell-sort/{requirements,design,test-cases,implementation}.md`（状态 draft → verified、Progress 100%）

**Interfaces:**

- Consumes: 已上线的 `/docs/shell-sort` 页（Task 4）

- [ ] **Step 1: 写 L5 端到端 `e2e/shell-sort.e2e.ts`**

```ts
import { test, expect } from '@playwright/test';

test('TC-E2E-SHELL-01 希尔排序播放器：默认暂停/单步/跳末升序/重置', async ({ page }) => {
  await page.goto('/docs/shell-sort');

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

Run: `pnpm test:e2e shell-sort`
Expected: PASS（TC-E2E-SHELL-01 绿）

> 选择器与冒泡/选择/插入 e2e 共用同一外壳（`.ctl[title]` / `.scrub` / `.counter` / `.bar-cell .val` / `.code .tok`），理应一致；若有出入以 `TransportControls.vue` / `BarsView.vue` / `CodePanel.vue` 实际 class 为准。

- [ ] **Step 3: 全量测试 + 门禁总检**

Run: `pnpm test:unit run && pnpm test:e2e && pnpm lint:check && pnpm format:check && pnpm type-check`
Expected: 全绿。统计：新增 L3 19 + L4 6 + L5 1 = 26 Case 全通过，冒泡 + 选择 + 插入全量回归绿。

- [ ] **Step 4: 回写测试三索引 `docs/test-cases/{index,by-layer,by-module}.md`**

按现有表格式追加 26 行（Owner Plan = `C-20260622-010`，状态 active，最后验证当日）：

- `index.md`「All Cases」：追加 `TC-SHELL-ALGO-01..06`、`TC-SHELL-MOD-01..13`、`TC-VIZ-BAR-06`、`TC-VIZ-BARSVIEW-12..14`、`TC-VIEW-SHELL-01..02`、`TC-E2E-SHELL-01`。
- `by-layer.md`：按 L3（19）/ L4（6）/ L5（1）分别归入。
- `by-module.md`：`algorithms` 组加 `TC-SHELL-ALGO-*` + `TC-SHELL-MOD-*`；`viz-engine` 组加 `TC-VIZ-BAR-06` + `TC-VIZ-BARSVIEW-12..14`；`article-sort` 组加 `TC-VIEW-SHELL-*` + `TC-E2E-SHELL-01`。

示范（`index.md` 一行，其余照此格式，列与现有表对齐；`YYYY-MM-DD` 填执行当日）：

```
| TC-SHELL-ALGO-01    | 空数组与单元素不产生 pass | algorithms / shell-sort | C-20260622-010 | L3   | `src/algorithms/shell-sort.spec.ts` | active | YYYY-MM-DD |
```

- [ ] **Step 5: 回写计划与路线图**

- `docs/plans/index.md`：C-20260622-010 行 状态 `draft → verified`、完成度 `0% → 100%`、下一步 `已完成`、最近更新改执行当日（All Changes / By Type / By Module 三处同步）。
- `docs/roadmap.md`：当前优先级表把 C-010 列为已完成；M3 行关联计划加「希尔排序 ✓」。

- [ ] **Step 6: 文档状态机收尾**

把本变更四文档头部 `Status: draft → verified`、`Progress: 0% → 100%`、`Next action: 已完成`、`Last reviewed` 改执行当日；`test-cases.md` 补「汇总统计（实测）」表（仿 c008）。

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add e2e/shell-sort.e2e.ts docs/
git commit -m "test(c010): 希尔排序 L5 端到端 + 三索引/roadmap/文档状态回写

新增 26 个 Case 全绿（L3 19 + L4 6 + L5 1），冒泡 + 选择 + 插入全量回归绿；
C-20260622-010 收尾为 verified。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## 推进顺序与依赖

```
Task 1（types 加法 + Bar/BarsView dimmed 态）── 可视化 + 契约地基，先证明不伤冒泡/选择/插入
   ├─ Task 2（oracle，独立）
   │     └─ Task 3（module + sources，交叉校验依赖 oracle；类型依赖 Task 1 的 ShellExecPoint）
   └─ Task 3（module 用 ShellExecPoint + groupMembers）
        └─ Task 4（视图 + 路由，依赖 Task 3 module + Task 1 可视化）
             └─ Task 5（e2e + 回写，依赖整页可跑）
```

每个 Task 以「对应测试绿 + `pnpm type-check` 绿」为关卡；Task 1 额外以「冒泡 + 选择 + 插入全量回归绿」为硬关卡。

## 自检要点（执行者每 Task 结束核对）

- 类型一致：`buildShellSortSteps` / `shellSortModule` / `shellSortSources` / `shellSortPasses` 命名跨 Task 一致。
- 行号准确：改希尔四语言源码任一行，必须同步 `lineMap`，并靠 `TC-SHELL-MOD-12` 兜底。
- dimmed 优先级：`stateOf` 里 `groupMembers` 分支必须在 `comparing` **之后、`idle` 之前**（`TC-VIZ-BARSVIEW-13` 兜底），否则会盖住当前组里正在比较/移动的活跃柱。
- 循环不越组：`buildShellSortSteps` 内层 `while (j >= start)`（非 `j >= 0`），`TC-SHELL-MOD-07` 各 gap-pass 交叉校验兜底。
- 向后兼容：任何一步若让冒泡 / 选择 / 插入现有 Case 变红，停下排查（优先怀疑 `stateOf` 分支顺序或 `groupMembers` 误判）。
- 无占位符：每个 Step 的代码块均可直接落地，无 TODO。
