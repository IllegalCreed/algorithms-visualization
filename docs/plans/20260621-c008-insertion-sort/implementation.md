# 插入排序动画 实现计划

> Status: verified
> Stable ID: C-20260621-008
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-21
> Last reviewed: 2026-06-22
> Progress: 100%
> Blocked by: none
> Next action: 已完成（5 Task 全部落地，24 Case 全绿）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007
> Related tests: test-cases.md
> Related design: design.md

> **For agentic workers:** 本计划用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐 Task 执行。步骤用 `- [ ]` 复选框跟踪。每个 Task 结束都有可独立测试的交付物。

**Goal:** 用 C-006「算法播放器」框架 + C-007 已铺好的泛型化地基接入插入排序，呈现「移位插入」动画（key 柱原位滑动让位），纯加法扩展，冒泡 + 选择零回归。

**Architecture:** 插入排序实现一个 `AlgorithmModule<InsertionExecPoint>`（插桩 `buildSteps` 产胖步骤 + 四语言源码与行映射），外壳零改动。移位用相邻交换 `work` 元素产生 FLIP：key 柱玫红高亮（`keyIndex` 最高优先、压过 `sorted`），一路左滑、被越过的大元素右让；两指针 i 红 / j 蓝；已排序区在左侧 `[0, i)`。插入排序是稳定排序，用元素稳定 id 验证。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + Pinia + Less；语法高亮复用现有 Shiki（`useHighlighter`）；测试 Vitest + @vue/test-utils（L3/L4）+ Playwright（L5）。

## Global Constraints

- 包管理器 **pnpm**（corepack，版本锁 `packageManager`）；禁用 npm/yarn。
- 路径别名 `@` → `src/`；优先 `@/...`。
- Less 全局混入（`.neumorphism-*`、`.row()`、`.center()`、颜色变量）已由 `vite.config.ts` 的 `additionalData` 注入，**组件内无需 import**。
- 多语言代码仅展示；动画唯一真相源是内置 TS 步骤流。单步 / 暂停 / 后退 / 拖动 = 预计算 `Step[]` + 移动 `index`，**不依赖异步 `delay`**。
- 语言集固定四门：**TypeScript / Python / Go / Rust**；默认进页面**暂停在第 0 步**。
- **向后兼容硬约束**：`types.ts` 加 `InsertionExecPoint` + `keyIndex?` 后，冒泡侧（`bubble-sort.*` / `*.spec.ts`）与选择侧（`selection-sort.*` / `*.spec.ts`）**零行为变化**，全量现有 Case 保持绿。
- 柱态优先级：`key > sorted > swapped > min > comparing > idle`（`key` 压过 `sorted`，保证 key 滑入已排序区仍醒目）。
- key 柱专属色 `#e07b9a`（玫红）；初始数据沿用 `[7,6,5,10,9,8,4,3,2,1]`；两指针 id `'0'`=i(红)/`'1'`=j(蓝)，取 `colors[0/1]`。
- 门禁：`pnpm lint:check` + `pnpm format:check` + `pnpm type-check` 必须绿；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）。提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: 数据契约加法 + 可视化 `key` 态（`types` + `Bar` + `BarsView`，L4）

`types.ts` 加 `InsertionExecPoint` union + `StepEmphasis.keyIndex?`（纯加法）；`Bar` 加常驻 `key` 态与玫红配色；`BarsView.stateOf` 支持 `keyIndex` 并置于**最高优先级**。冒泡 / 选择路径不触发新分支——它们 emphasis 无 `keyIndex`，恒 `undefined`。

**Files:**

- Modify: `src/components/player/types.ts`
- Modify: `src/components/Bar.vue`
- Modify: `src/components/BarsView.vue`
- Test: `src/components/Bar.spec.ts`（追加 1 case）
- Test: `src/components/BarsView.spec.ts`（追加 3 case）

**Interfaces:**

- Produces（后续 Task 依赖）：
  - `InsertionExecPoint = 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done'`
  - `StepEmphasis` 新增可选字段 `keyIndex?: number`
  - `Bar` 的 `state` 扩为 `'idle'|'comparing'|'swapped'|'sorted'|'min'|'key'`
  - `BarsView.stateOf` 按 `key > sorted > swapped > min > comparing > idle` 取态

- [ ] **Step 1: 追加 Bar 失败测试 `src/components/Bar.spec.ts`**

在现有 `describe('Bar', () => { ... })` 末尾、闭合 `});` 之前追加：

```ts
it('TC-VIZ-BAR-05 state=key 时柱体加 key class', () => {
  const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'key' } });
  expect(w.find('.bar').classes()).toContain('key');
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: FAIL（`state: 'key'` 不被类型接受 / 无 `.bar.key` 类）

- [ ] **Step 3: 改 `src/components/Bar.vue`**

- `state` 类型加 `'key'`（`defineProps` 内）：

```ts
defineProps<{
  value: number;
  percent: number;
  state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key';
}>();
```

- 在 `<style>` 的 `.bar.min { ... }` 之后追加：

```less
.bar.key {
  background-color: #e07b9a;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: PASS（5 个 case）

- [ ] **Step 5: 给 `types.ts` 加 `InsertionExecPoint` + `keyIndex?`**

- 在 `SelectionExecPoint` 定义之后追加：

```ts
/** 插入排序的执行点（shift：已排序元素右移腾位；insert：key 落定） */
export type InsertionExecPoint = 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done';
```

- 在 `StepEmphasis` 的 `sortedUpTo?: number;` 行之后追加一个字段：

```ts
  keyIndex?: number; // 插入：被取出的 key 柱当前下标 → key 态（最高优先）
```

- [ ] **Step 6: 追加 BarsView 失败测试 `src/components/BarsView.spec.ts`**

在现有 `describe('BarsView', () => { ... })` 末尾、闭合 `});` 之前追加（`base` 为该文件已定义的 3 元素夹具 `[['0',5],['1',9],['2',1]]`）：

```ts
it('TC-VIZ-BARSVIEW-09 keyIndex 指向的 Bar 进入 key 态', () => {
  const w = mountIt({ ...base, emphasis: { keyIndex: 1 } });
  expect(w.findAllComponents(Bar)[1].props('state')).toBe('key');
});

it('TC-VIZ-BARSVIEW-10 key 优先级压过 sorted：keyIndex 落在已排序区仍取 key 态', () => {
  const w = mountIt({ ...base, emphasis: { sortedUpTo: 3, keyIndex: 1 } });
  const bars = w.findAllComponents(Bar);
  expect(bars[1].props('state')).toBe('key'); // 下标 1 在 [0,3) 已排序区，但 key 压过 sorted
  expect(bars[0].props('state')).toBe('sorted'); // 其他已排序柱仍绿
  expect(bars[2].props('state')).toBe('sorted');
});

it('TC-VIZ-BARSVIEW-11 比较帧：keyIndex 那根取 key、comparing 另一根取 comparing', () => {
  const w = mountIt({ ...base, emphasis: { comparing: [0, 1], keyIndex: 1 } });
  const bars = w.findAllComponents(Bar);
  expect(bars[1].props('state')).toBe('key'); // key 压过 comparing
  expect(bars[0].props('state')).toBe('comparing'); // 另一根（j）才是 comparing
});
```

- [ ] **Step 7: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/BarsView.spec.ts`
Expected: FAIL（`stateOf` 尚不识别 `keyIndex`）

- [ ] **Step 8: 改 `src/components/BarsView.vue` 的 `stateOf`**

把现有 `stateOf` 整体替换为（返回类型加 `'key'`，并在**最前面**加 `keyIndex` 分支）：

```ts
function stateOf(index: number): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' {
  const e = props.emphasis;
  if (e.keyIndex === index) return 'key'; // key 压过一切（含 sorted）：滑入已排序区也保持玫红
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min'; // min 压过 comparing
  if (inCompare) return 'comparing'; // 另一根（j）才是 comparing 黄
  return 'idle';
}
```

- [ ] **Step 9: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/BarsView.spec.ts src/components/Bar.spec.ts`
Expected: PASS（BarsView 10+3=13、Bar 4+1=5，全绿；原 `sortedFrom`/`comparing`/`swapped`/`minIndex`/`sortedUpTo` case 不受影响）

- [ ] **Step 10: 全量回归（向后兼容硬验收）+ type-check**

Run: `pnpm type-check && pnpm test:unit run`
Expected: PASS（**冒泡 + 选择全部现有 Case 绿**；新加分支不触发它们的路径）

- [ ] **Step 11: 提交**

```bash
git add src/components/player/types.ts src/components/Bar.vue src/components/BarsView.vue src/components/Bar.spec.ts src/components/BarsView.spec.ts
git commit -m "feat(viz): types 加 InsertionExecPoint/keyIndex + Bar key 玫红态 + BarsView key 优先级

纯加法扩展：StepEmphasis 加 keyIndex（最高优先，压过 sorted）；
Bar 加 key 态 #e07b9a；冒泡/选择路径不触发新分支、全量回归绿。为插入排序铺路。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: 插入排序 oracle `insertion-sort.ts`（L3）

纯算法 oracle，对标 `selection-sort.ts`，作为后续 `buildSteps` 的正确性交叉校验源。用覆盖式右移（`arr[j+1]=arr[j]`，纯 `number[]` 不涉及 id，与 module 的相邻交换结果等价）。

**Files:**

- Create: `src/algorithms/insertion-sort.ts`
- Test: `src/algorithms/insertion-sort.spec.ts`

**Interfaces:**

- Produces:
  - `interface InsertionSortStep { array: number[]; i: number; insertedAt: number; shifts: number }`
  - `insertionSortSteps(input: number[]): InsertionSortStep[]`（纯函数，不改入参；空/单元素返回 `[]`）

- [ ] **Step 1: 写失败测试 `src/algorithms/insertion-sort.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { insertionSortSteps } from './insertion-sort';

describe('insertionSortSteps', () => {
  it('TC-INS-ALGO-01 空数组与单元素不产生步骤', () => {
    expect(insertionSortSteps([])).toEqual([]);
    expect(insertionSortSteps([5])).toEqual([]);
  });

  it('TC-INS-ALGO-02 最终数组升序排列', () => {
    const steps = insertionSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    expect(steps.at(-1)!.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-INS-ALGO-03 含重复元素结果正确且不越界', () => {
    expect(insertionSortSteps([3, 1, 3, 2]).at(-1)!.array).toEqual([1, 2, 3, 3]);
  });

  it('TC-INS-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    insertionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-INS-ALGO-05 已升序输入：每轮零移位（最佳情况 O(n)）', () => {
    const steps = insertionSortSteps([1, 2, 3, 4, 5]);
    for (const s of steps) expect(s.shifts).toBe(0);
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/insertion-sort.spec.ts`
Expected: FAIL（`insertionSortSteps` 未定义）

- [ ] **Step 3: 实现 `src/algorithms/insertion-sort.ts`**

```ts
export interface InsertionSortStep {
  array: number[];
  i: number; // 当前轮取出的元素原始下标
  insertedAt: number; // key 最终插入的位置
  shifts: number; // 本轮右移次数
}

/** 标准插入排序，返回每轮一步的步骤序列（纯函数，不改入参） */
export function insertionSortSteps(input: number[]): InsertionSortStep[] {
  const arr = [...input];
  const steps: InsertionSortStep[] = [];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    let shifts = 0;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      shifts++;
    }
    arr[j + 1] = key;
    steps.push({ array: [...arr], i, insertedAt: j + 1, shifts });
  }
  return steps;
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/insertion-sort.spec.ts`
Expected: PASS（5 个 case）

- [ ] **Step 5: 提交**

```bash
pnpm type-check
git add src/algorithms/insertion-sort.ts src/algorithms/insertion-sort.spec.ts
git commit -m "feat(algo): 插入排序纯逻辑 oracle insertionSortSteps（L3）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: 插入排序模块 `buildSteps` + 四语言源码（L3）

把插入排序插桩重走为胖 `Step<InsertionExecPoint>[]`，配四语言源码与 `lineMap`。移位用相邻交换 `work` 元素（key 与左邻换位），保持 id 集合恒定。与 oracle 交叉校验 + 插入特有不变量（前缀有序、key 单调左滑、稳定性）。

**Files:**

- Create: `src/algorithms/insertion-sort.sources.ts`
- Create: `src/algorithms/insertion-sort.module.ts`
- Test: `src/algorithms/insertion-sort.module.spec.ts`

**Interfaces:**

- Consumes: `AlgorithmModule`/`Step`/`LangSource`/`InsertionExecPoint`/`VarRow` from `@/components/player/types`（Task 1）；`insertionSortSteps` from `./insertion-sort`（Task 2，测试里交叉校验用）
- Produces:
  - `insertionSortSources: LangSource<InsertionExecPoint>[]`
  - `buildInsertionSortSteps(input: number[]): Step<InsertionExecPoint>[]`
  - `insertionSortModule: AlgorithmModule<InsertionExecPoint>`

- [ ] **Step 1: 写四语言源码 `src/algorithms/insertion-sort.sources.ts`**

> `lineMap` 行号 1-based，对应 `code` 字符串去掉首行换行后的物理行。改源码即同步改 `lineMap`（Step 4 的 L3 校验每个 `InsertionExecPoint` 行号 ∈ `[1, 行数]`）。Rust 的 `j` 会递减到 `-1`，故用 `i32` + `as usize` 索引。

```ts
import type { InsertionExecPoint, LangSource } from '@/components/player/types';

const ts = `function insertionSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`;

const python = `def insertion_sort(a):
    n = len(a)
    for i in range(1, n):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`;

const go = `func insertionSort(a []int) []int {
\tn := len(a)
\tfor i := 1; i < n; i++ {
\t\tkey := a[i]
\t\tj := i - 1
\t\tfor j >= 0 && a[j] > key {
\t\t\ta[j+1] = a[j]
\t\t\tj--
\t\t}
\t\ta[j+1] = key
\t}
\treturn a
}`;

const rust = `fn insertion_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for i in 1..n {
        let key = a[i];
        let mut j = i as i32 - 1;
        while j >= 0 && a[j as usize] > key {
            a[(j + 1) as usize] = a[j as usize];
            j -= 1;
        }
        a[(j + 1) as usize] = key;
    }
}`;

export const insertionSortSources: LangSource<InsertionExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 1 fn / 2 n / 3 外层for / 4 key / 5 j / 6 while比较 / 7 右移 / 8 j-- / 10 insert / 12 return
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 10, done: 12 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 1 def / 2 n / 3 外层for / 4 key / 5 j / 6 while比较 / 7 右移 / 8 j-=1 / 9 insert / 10 return
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 9, done: 10 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 1 func / 2 n / 3 外层for / 4 key / 5 j / 6 for比较 / 7 右移 / 8 j-- / 10 insert / 12 return
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 10, done: 12 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 1 fn / 2 n / 3 外层for / 4 key / 5 j(i32) / 6 while比较 / 7 右移 / 8 j-=1 / 10 insert / 12 末尾}（无 return）
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 10, done: 12 },
  },
];
```

- [ ] **Step 2: 写失败测试 `src/algorithms/insertion-sort.module.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { insertionSortSteps } from './insertion-sort';
import { buildInsertionSortSteps, insertionSortModule } from './insertion-sort.module';
import type { InsertionExecPoint } from '@/components/player/types';

const EXEC_POINTS: InsertionExecPoint[] = ['outerLoop', 'compare', 'shift', 'insert', 'done'];

describe('buildInsertionSortSteps', () => {
  it('TC-INSERTION-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildInsertionSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildInsertionSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-INSERTION-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildInsertionSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = insertionSortSteps(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-INSERTION-MOD-03 每步 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildInsertionSortSteps([3, 1, 2]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-INSERTION-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildInsertionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-INSERTION-MOD-05 每步 point 合法；shift 步必带数值型 keyIndex', () => {
    for (const s of buildInsertionSortSteps([5, 3, 8, 1])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'shift') expect(typeof s.emphasis.keyIndex).toBe('number');
    }
  });

  it('TC-INSERTION-MOD-06 每个 insert 步后，[0, i] 前缀升序（插入核心不变量）', () => {
    const steps = buildInsertionSortSteps([5, 3, 8, 1, 9, 2]);
    for (const s of steps) {
      if (s.point !== 'insert') continue;
      const i = s.pointers.find((p) => p.id === '0')!.index;
      const prefix = s.array.slice(0, i + 1).map((t) => t[1]);
      const sorted = [...prefix].sort((a, b) => a - b);
      expect(prefix).toEqual(sorted);
    }
  });

  it('TC-INSERTION-MOD-07 一轮内 keyIndex 单调不增（key 只向左滑）', () => {
    const steps = buildInsertionSortSteps([5, 3, 8, 1, 9, 2]);
    let prevKey = Infinity;
    for (const s of steps) {
      if (s.point === 'outerLoop') {
        prevKey = s.emphasis.keyIndex!; // 新一轮起点
        continue;
      }
      if (s.emphasis.keyIndex === undefined) continue;
      expect(s.emphasis.keyIndex).toBeLessThanOrEqual(prevKey);
      prevKey = s.emphasis.keyIndex;
    }
  });

  it('TC-INSERTION-MOD-08 sortedUpTo 单调不减且末步为 n', () => {
    const steps = buildInsertionSortSteps([5, 3, 8, 1, 9]);
    let prev = -1;
    for (const s of steps) {
      const su = s.emphasis.sortedUpTo!;
      expect(su).toBeGreaterThanOrEqual(prev);
      prev = su;
    }
    expect(steps.at(-1)!.emphasis.sortedUpTo).toBe(5);
  });

  it('TC-INSERTION-MOD-09 稳定性：相等元素的原始相对顺序保持不变', () => {
    // [3,1,3,2]：两个 3 的 id 为 '0'、'2'，排序后 '0' 仍在 '2' 之前
    const last = buildInsertionSortSteps([3, 1, 3, 2]).at(-1)!;
    const ids = last.array.map((t) => t[0]);
    const values = last.array.map((t) => t[1]);
    expect(values).toEqual([1, 2, 3, 3]);
    expect(ids.indexOf('0')).toBeLessThan(ids.indexOf('2'));
  });
});

describe('insertionSortModule.sources', () => {
  it('TC-INSERTION-MOD-10 四门语言齐备', () => {
    expect(insertionSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-INSERTION-MOD-11 每门语言每个 InsertionExecPoint 行号落在源码物理行范围内', () => {
    for (const src of insertionSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-INSERTION-MOD-12 实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildInsertionSortSteps(insertionSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of insertionSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/insertion-sort.module.spec.ts`
Expected: FAIL（`buildInsertionSortSteps` / `insertionSortModule` 未定义）

- [ ] **Step 4: 实现 `src/algorithms/insertion-sort.module.ts`**

```ts
import type { AlgorithmModule, InsertionExecPoint, Step, VarRow } from '@/components/player/types';
import { insertionSortSources } from './insertion-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）：本轮边界 / 已排序区右界
const ID_J = '1'; // 蓝箭头（colors[1]）：左探位置

/** 插桩重走标准插入排序，产出逐行粒度的胖步骤 */
export function buildInsertionSortSteps(input: number[]): Step<InsertionExecPoint>[] {
  const steps: Step<InsertionExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let shiftCount = 0;
  let sortedUpTo = 1; // [0, sortedUpTo) 已（相对）就位；单元素天然有序

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (i: number, key: number, j: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'i', value: i },
    { name: 'key', value: key },
    { name: 'j', value: j },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'shiftCount', value: shiftCount },
    { name: 'sortedUpTo', value: sortedUpTo },
  ];

  const push = (
    point: InsertionExecPoint,
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
      emphasis: { sortedUpTo, ...emphasis },
      vars: vars(i, key, j),
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedUpTo = n;
    push('done', 0, work[0]?.[1] ?? 0, 0, {}, '完成');
    return steps;
  }

  for (let i = 1; i < n; i++) {
    const key = work[i][1];
    let keyIdx = i;
    let j = i - 1;
    push('outerLoop', i, key, j, { keyIndex: keyIdx }, `第 ${i} 轮：取出 key=${key}`);
    while (j >= 0) {
      const aj = work[j][1];
      const greater = aj > key;
      push(
        'compare',
        i,
        key,
        j,
        { comparing: [j, keyIdx], keyIndex: keyIdx },
        `a[${j}]=${aj} ${greater ? '>' : '≤'} key=${key}`,
      );
      if (!greater) break; // a[j] ≤ key，找到插入点，停
      // 右移：key 与左邻 a[j] 相邻交换（keyIdx == j+1）；key 左滑、aj 右让
      [work[j], work[keyIdx]] = [work[keyIdx], work[j]];
      keyIdx = j;
      shiftCount++;
      push('shift', i, key, j, { keyIndex: keyIdx }, `${aj} 右移，key 滑到 ${keyIdx}`);
      j--;
    }
    push('insert', i, key, j, { keyIndex: keyIdx }, `key=${key} 插入位置 ${keyIdx}`);
    sortedUpTo = i + 1;
  }
  sortedUpTo = n;
  push('done', n - 1, work[n - 1][1], n - 1, {}, '完成');
  return steps;
}

export const insertionSortModule: AlgorithmModule<InsertionExecPoint> = {
  title: '插入排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildInsertionSortSteps,
  sources: insertionSortSources,
};
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/insertion-sort.module.spec.ts`
Expected: PASS（12 个 case 全绿）

- [ ] **Step 6: 提交**

```bash
pnpm type-check
git add src/algorithms/insertion-sort.sources.ts src/algorithms/insertion-sort.module.ts src/algorithms/insertion-sort.module.spec.ts
git commit -m "feat(algo): 插入排序 buildSteps 移位插桩 + 四语言源码/行映射（L3）

两指针 i/j + key 玫红柱（keyIndex）+ 左侧 sortedUpTo；相邻交换实现移位、
id 集合恒定；交叉校验 oracle，覆盖插入不变量（前缀有序、key 单调左滑、稳定性）。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: 接入 `InsertionSort.vue` + 路由（L4）

薄壳 + 懒加载路由，把插入排序模块挂进播放器，修复菜单/首页点击 404。

**Files:**

- Create: `src/views/Article/SortAlgorithm/InsertionSort.vue`
- Modify: `src/router/index.ts`
- Test: `src/views/Article/SortAlgorithm/InsertionSort.spec.ts`

**Interfaces:**

- Consumes: `insertionSortModule`（Task 3）；`AlgorithmPlayer`（现有）
- Produces: `insertion-sort` 命名路由（`name` = slug，菜单/首页据此高亮与跳转）

- [ ] **Step 1: 写失败测试 `src/views/Article/SortAlgorithm/InsertionSort.spec.ts`**

```ts
// src/views/Article/SortAlgorithm/InsertionSort.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import InsertionSort from './InsertionSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('InsertionSort', () => {
  it('TC-VIEW-INSERTION-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(InsertionSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-INSERTION-02 初始渲染 10 根柱子且默认停在第 0 步', async () => {
    const w = mount(InsertionSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/InsertionSort.spec.ts`
Expected: FAIL（`InsertionSort.vue` 不存在）

- [ ] **Step 3: 实现 `src/views/Article/SortAlgorithm/InsertionSort.vue`**

```vue
<!-- src/views/Article/SortAlgorithm/InsertionSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { insertionSortModule } from '@/algorithms/insertion-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="insertionSortModule" />
</template>
```

- [ ] **Step 4: 注册路由 `src/router/index.ts`**

在 `selection-sort` 路由对象之后、`children` 数组内追加：

```ts
          {
            path: '/docs/insertion-sort',
            name: 'insertion-sort',
            component: () => import('../views/Article/SortAlgorithm/InsertionSort.vue'),
          },
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/views/Article/SortAlgorithm/InsertionSort.spec.ts`
Expected: PASS（2 个 case）

- [ ] **Step 6: 手动核对（开发服）**

Run: `pnpm dev` → 打开 `/docs/insertion-sort`
Expected: 不再 404；柱状图 + 两指针（红 i / 蓝 j）+ 代码面板渲染；默认停第 0 步。单步播放，肉眼复核：key 玫红柱一路左滑、被越过的大元素右让；left `[0,i)` sorted 绿；key 滑入绿区仍保持玫红（不被绿盖）。明 / 暗主题下 `#e07b9a` 与 comparing 黄 / sorted 绿区分清晰（不满意可微调）。

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add src/views/Article/SortAlgorithm/InsertionSort.vue src/router/index.ts src/views/Article/SortAlgorithm/InsertionSort.spec.ts
git commit -m "feat(viz): 插入排序视图 InsertionSort + 懒加载路由（修复菜单/首页 404）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: 端到端 + 索引/文档回写

补 L5，再把测试与计划索引、roadmap、文档状态全部回写到位（规范 §11 收尾）。

**Files:**

- Create: `e2e/insertion-sort.e2e.ts`
- Modify: `docs/test-cases/index.md`、`docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/index.md`、`docs/roadmap.md`
- Modify: `docs/plans/20260621-c008-insertion-sort/{requirements,design,test-cases,implementation}.md`（状态 draft → verified、Progress 100%）

**Interfaces:**

- Consumes: 已上线的 `/docs/insertion-sort` 页（Task 4）

- [ ] **Step 1: 写 L5 端到端 `e2e/insertion-sort.e2e.ts`**

```ts
import { test, expect } from '@playwright/test';

test('TC-E2E-INSERTION-01 插入排序播放器：默认暂停/单步/跳末升序/重置', async ({ page }) => {
  await page.goto('/docs/insertion-sort');

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

Run: `pnpm test:e2e insertion-sort`
Expected: PASS（TC-E2E-INSERTION-01 绿）

> 选择器与冒泡/选择 e2e 共用同一外壳（`.ctl[title]` / `.scrub` / `.counter` / `.bar-cell .val` / `.code .tok`），理应一致；若有出入以 `TransportControls.vue` / `BarsView.vue` / `CodePanel.vue` 实际 class 为准。

- [ ] **Step 3: 全量测试 + 门禁总检**

Run: `pnpm test:unit run && pnpm test:e2e && pnpm lint:check && pnpm format:check && pnpm type-check`
Expected: 全绿。统计：新增 L3 17 + L4 6 + L5 1 = 24 Case 全通过，冒泡 + 选择全量回归绿。

- [ ] **Step 4: 回写测试三索引 `docs/test-cases/{index,by-layer,by-module}.md`**

按现有表格式追加 24 行（Owner Plan = `C-20260621-008`，状态 active，最后验证当日）：

- `index.md`「All Cases」：追加 `TC-INS-ALGO-01..05`、`TC-INSERTION-MOD-01..12`、`TC-VIZ-BAR-05`、`TC-VIZ-BARSVIEW-09..11`、`TC-VIEW-INSERTION-01..02`、`TC-E2E-INSERTION-01`。
- `by-layer.md`：按 L3（17）/ L4（6）/ L5（1）分别归入。
- `by-module.md`：`algorithms` 组加 `TC-INS-ALGO-*` + `TC-INSERTION-MOD-*`；`viz-engine` 组加 `TC-VIZ-BAR-05` + `TC-VIZ-BARSVIEW-09..11`；`article-sort` 组加 `TC-VIEW-INSERTION-*` + `TC-E2E-INSERTION-01`。

示范（`index.md` 一行，其余照此格式，列与现有表对齐；`YYYY-MM-DD` 填执行当日）：

```
| TC-INS-ALGO-01      | 空数组与单元素不产生步骤 | algorithms / insertion-sort | C-20260621-008 | L3   | `src/algorithms/insertion-sort.spec.ts` | active | YYYY-MM-DD |
```

- [ ] **Step 5: 回写计划与路线图**

- `docs/plans/index.md`：C-20260621-008 行 状态 `draft → verified`、完成度 `0% → 100%`、下一步 `已完成`、最近更新改执行当日（All Changes / By Type / By Module 三处同步）。
- `docs/roadmap.md`：当前优先级表 C-008 下一步改为「已完成（24 Case 全绿，已落 main）」；M3 行关联计划把「插入排序，设计中」改为「插入排序 ✓」。

- [ ] **Step 6: 文档状态机收尾**

把本变更四文档头部 `Status: draft → verified`、`Progress: 0% → 100%`、`Next action: 已完成`、`Last reviewed` 改执行当日；`test-cases.md` 补「汇总统计（实测）」表（仿 c007）。

- [ ] **Step 7: 提交**

```bash
pnpm type-check
git add e2e/insertion-sort.e2e.ts docs/
git commit -m "test(c008): 插入排序 L5 端到端 + 三索引/roadmap/文档状态回写

新增 24 个 Case 全绿（L3 17 + L4 6 + L5 1），冒泡 + 选择全量回归绿；
C-20260621-008 收尾为 verified。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## 推进顺序与依赖

```
Task 1（types 加法 + Bar/BarsView key 态）── 可视化 + 契约地基，先证明不伤冒泡/选择
   ├─ Task 2（oracle，独立）
   │     └─ Task 3（module + sources，交叉校验依赖 oracle；类型依赖 Task 1 的 InsertionExecPoint）
   └─ Task 3（module 用 InsertionExecPoint + keyIndex）
        └─ Task 4（视图 + 路由，依赖 Task 3 module + Task 1 可视化）
             └─ Task 5（e2e + 回写，依赖整页可跑）
```

每个 Task 以「对应测试绿 + `pnpm type-check` 绿」为关卡；Task 1 额外以「冒泡 + 选择全量回归绿」为硬关卡。

## 自检要点（执行者每 Task 结束核对）

- 类型一致：`buildInsertionSortSteps` / `insertionSortModule` / `insertionSortSources` / `insertionSortSteps` 命名跨 Task 一致。
- 行号准确：改插入排序四语言源码任一行，必须同步 `lineMap`，并靠 `TC-INSERTION-MOD-11` 兜底。
- key 优先级：`stateOf` 里 `keyIndex` 分支必须在 `sorted` **之前**（`TC-VIZ-BARSVIEW-10` 兜底），否则 key 滑入已排序区会变绿。
- 向后兼容：任何一步若让冒泡 / 选择现有 Case 变红，停下排查（优先怀疑 `stateOf` 分支顺序或 `keyIndex` 误判）。
- 无占位符：每个 Step 的代码块均可直接落地，无 TODO。
