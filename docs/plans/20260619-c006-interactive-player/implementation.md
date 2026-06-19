# 实现计划：交互式算法播放器

> Status: verified
> Stable ID: C-20260619-006
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-19
> Last reviewed: 2026-06-19
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-003
> Related tests: test-cases.md
> Related design: design.md

> **For agentic workers:** 本计划用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐 Task 执行。步骤用 `- [ ]` 复选框跟踪。每个 Task 结束都有可独立测试的交付物。

**Goal:** 把冒泡排序重做成一个可交互的"算法播放器"，并沉淀为后续算法可复用的通用框架。

**Architecture:** 通用外壳（播放控制 / 代码面板 / 变量面板 / 可视化插槽）+ 算法插件，二者唯一契约是一个预计算的"胖步骤"数组 `Step[]`；外壳按当前下标 `index` 回放 `steps[index]`，单步/暂停/后退/拖动全是"移动下标"。先用冒泡验证。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript + Pinia + Less；语法高亮用 Shiki（JS 正则引擎，免 WASM）；测试 Vitest + @vue/test-utils（L3/L4）+ Playwright（L5）。

## Global Constraints

- 包管理器 **pnpm**（corepack，版本锁 `packageManager`）；禁用 npm/yarn。
- 路径别名 `@` → `src/`；优先 `@/...`。
- Less 全局混入（`.neumorphism-*`、`.row()`、`.center()`、颜色变量）已由 `vite.config.ts` 的 `additionalData` 注入，**组件内无需 import**。
- 多语言代码仅展示；动画唯一真相源是内置 TS 步骤流。
- 单步/暂停/后退/拖动 = 预计算 `Step[]` + 移动 `index`，**不依赖异步 `delay`**。
- 语言集固定四门：**TypeScript / Python / Go / Rust**；默认进页面**暂停在第 0 步**。
- 门禁：`pnpm lint:check` + `pnpm format:check` + `pnpm type-check` 必须绿；覆盖率沿用本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目，无需分支）。提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: 播放器契约 `types.ts` + 传输状态机 `usePlayer`

纯逻辑、可独立 L3 测试，是整个外壳的地基。**先做**，让后续 UI 有真实状态可绑。

**Files:**

- Create: `src/components/player/types.ts`
- Create: `src/components/player/usePlayer.ts`
- Test: `src/components/player/usePlayer.spec.ts`

**Interfaces:**

- Consumes: `Pointer` from `src/types/types.ts`（`{ id: string; index: number }`）
- Produces:
  - `types.ts`：`Lang`、`ExecPoint`、`VarRow`、`StepEmphasis`、`Step`、`LangSource`、`AlgorithmModule`（见下，后续所有 Task 依赖）
  - `usePlayer(steps: Step[], opts?): { index: Ref<number>; isPlaying: Ref<boolean>; speed: Ref<number>; total: ComputedRef<number>; current: ComputedRef<Step>; atStart/atEnd: ComputedRef<boolean>; progress: ComputedRef<number>; play(); pause(); toggle(); stepForward(); stepBackward(); seek(i:number); reset(); setSpeed(s:number) }`

- [ ] **Step 1: 写契约 `types.ts`**

```ts
// src/components/player/types.ts
export type { Pointer } from '@/types/types';
import type { Pointer } from '@/types/types';

/** 代码面板支持的语言 */
export type Lang = 'ts' | 'python' | 'go' | 'rust';

/** 执行点：源码里语义上的一个位置，用于跨语言定位"当前高亮行" */
export type ExecPoint =
  | 'outerLoop' // 外层循环头
  | 'innerLoop' // 内层循环头
  | 'compare' // 比较 a[j] 与 a[j+1]
  | 'swap' // 发生交换
  | 'noSwap' // 条件不成立、不交换
  | 'done'; // 排序完成

/** 变量面板的一行 */
export interface VarRow {
  name: string;
  value: string | number | boolean;
}

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 已排序边界：该下标起已就位
}

/** 胖步骤：自带渲染所需的一切 */
export interface Step {
  array: [string, number][]; // 当前数组快照；[0]=稳定 key（驱动柱子 FLIP），[1]=值
  pointers: Pointer[]; // 指针箭头（冒泡里是 i、j）
  emphasis: StepEmphasis;
  vars: VarRow[]; // 变量面板按顺序渲染
  point: ExecPoint; // 当前执行点 → 经 lineMap 查每语言行号
  caption?: string; // 解说，如 "10 > 9，交换"
}

export interface LangSource {
  lang: Lang;
  label: string; // Tab 文案，如 "TypeScript"
  code: string; // 该语言完整源码（静态字符串）
  lineMap: Record<ExecPoint, number>; // 执行点 → 1-based 行号
}

export interface AlgorithmModule {
  title: string;
  initialInput(): number[];
  buildSteps(input: number[]): Step[];
  sources: LangSource[];
}
```

- [ ] **Step 2: 写失败测试 `usePlayer.spec.ts`**

```ts
// src/components/player/usePlayer.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Step } from './types';
import { usePlayer } from './usePlayer';

// 造 N 个最简步骤
function steps(n: number): Step[] {
  return Array.from({ length: n }, (_, k) => ({
    array: [],
    pointers: [],
    emphasis: {},
    vars: [{ name: 'k', value: k }],
    point: 'compare' as const,
  }));
}

describe('usePlayer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('初始停在第 0 步且未播放', () => {
    const p = usePlayer(steps(5));
    expect(p.index.value).toBe(0);
    expect(p.isPlaying.value).toBe(false);
    expect(p.atStart.value).toBe(true);
    expect(p.atEnd.value).toBe(false);
  });

  it('stepForward 前进且不越过末步', () => {
    const p = usePlayer(steps(2));
    p.stepForward();
    expect(p.index.value).toBe(1);
    expect(p.atEnd.value).toBe(true);
    p.stepForward(); // 已在末步，不动
    expect(p.index.value).toBe(1);
  });

  it('stepBackward 后退且不越过首步', () => {
    const p = usePlayer(steps(3));
    p.seek(2);
    p.stepBackward();
    expect(p.index.value).toBe(1);
    p.seek(0);
    p.stepBackward();
    expect(p.index.value).toBe(0);
  });

  it('seek 越界夹紧到合法范围', () => {
    const p = usePlayer(steps(4));
    p.seek(99);
    expect(p.index.value).toBe(3);
    p.seek(-5);
    expect(p.index.value).toBe(0);
  });

  it('reset 回到第 0 步并停止', () => {
    const p = usePlayer(steps(4));
    p.seek(3);
    p.reset();
    expect(p.index.value).toBe(0);
    expect(p.isPlaying.value).toBe(false);
  });

  it('play 按基准间隔逐步推进，到末步自动暂停', () => {
    const p = usePlayer(steps(3), { baseDelayMs: 100 });
    p.play();
    expect(p.isPlaying.value).toBe(true);
    vi.advanceTimersByTime(100);
    expect(p.index.value).toBe(1);
    vi.advanceTimersByTime(100);
    expect(p.index.value).toBe(2);
    expect(p.isPlaying.value).toBe(false); // 到末步自停
    vi.advanceTimersByTime(1000);
    expect(p.index.value).toBe(2); // 不再前进
  });

  it('pause 停止自动推进', () => {
    const p = usePlayer(steps(5), { baseDelayMs: 100 });
    p.play();
    vi.advanceTimersByTime(100);
    p.pause();
    expect(p.isPlaying.value).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(p.index.value).toBe(1);
  });

  it('setSpeed 加速后按新速率推进', () => {
    const p = usePlayer(steps(5), { baseDelayMs: 100 });
    p.setSpeed(2); // 间隔变 50ms
    p.play();
    vi.advanceTimersByTime(50);
    expect(p.index.value).toBe(1);
  });

  it('current 跟随 index', () => {
    const p = usePlayer(steps(3));
    expect(p.current.value.vars[0].value).toBe(0);
    p.stepForward();
    expect(p.current.value.vars[0].value).toBe(1);
  });

  it('progress 从 0 到 1', () => {
    const p = usePlayer(steps(5));
    expect(p.progress.value).toBe(0);
    p.seek(4);
    expect(p.progress.value).toBe(1);
  });
});
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/player/usePlayer.spec.ts`
Expected: FAIL（`usePlayer` 未定义 / 模块不存在）

- [ ] **Step 4: 实现 `usePlayer.ts`**

```ts
// src/components/player/usePlayer.ts
import { ref, computed, onUnmounted, getCurrentInstance } from 'vue';
import type { Step } from './types';

export interface UsePlayerOptions {
  baseDelayMs?: number; // 1× 时每步间隔，默认 800
  initialSpeed?: number; // 默认 1
}

export function usePlayer(steps: Step[], opts: UsePlayerOptions = {}) {
  const baseDelayMs = opts.baseDelayMs ?? 800;
  const index = ref(0);
  const isPlaying = ref(false);
  const speed = ref(opts.initialSpeed ?? 1);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const total = computed(() => steps.length);
  const current = computed(() => steps[index.value]);
  const atStart = computed(() => index.value <= 0);
  const atEnd = computed(() => index.value >= steps.length - 1);
  const progress = computed(() => (steps.length <= 1 ? 1 : index.value / (steps.length - 1)));

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleNext() {
    clearTimer();
    timer = setTimeout(() => {
      if (index.value >= steps.length - 1) {
        isPlaying.value = false;
        return;
      }
      index.value++;
      if (index.value >= steps.length - 1) {
        isPlaying.value = false; // 展示完末步即停
        return;
      }
      scheduleNext();
    }, baseDelayMs / speed.value);
  }

  function play() {
    if (atEnd.value) return;
    isPlaying.value = true;
    scheduleNext();
  }
  function pause() {
    isPlaying.value = false;
    clearTimer();
  }
  function toggle() {
    isPlaying.value ? pause() : play();
  }
  function stepForward() {
    pause();
    if (index.value < steps.length - 1) index.value++;
  }
  function stepBackward() {
    pause();
    if (index.value > 0) index.value--;
  }
  function seek(i: number) {
    pause();
    index.value = Math.max(0, Math.min(i, steps.length - 1));
  }
  function reset() {
    pause();
    index.value = 0;
  }
  function setSpeed(s: number) {
    speed.value = s;
    if (isPlaying.value) scheduleNext();
  }

  if (getCurrentInstance()) onUnmounted(pause); // 组件内自动清理；纯 L3 调用时跳过

  return {
    index,
    isPlaying,
    speed,
    total,
    current,
    atStart,
    atEnd,
    progress,
    play,
    pause,
    toggle,
    stepForward,
    stepBackward,
    seek,
    reset,
    setSpeed,
  };
}
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/player/usePlayer.spec.ts`
Expected: PASS（10 个 case 全绿）

- [ ] **Step 6: type-check + 提交**

```bash
pnpm type-check
git add src/components/player/types.ts src/components/player/usePlayer.ts src/components/player/usePlayer.spec.ts
git commit -m "feat(player): 播放器契约 types + usePlayer 传输状态机（L3）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: 冒泡算法模块 `buildSteps` + 四语言源码

把冒泡走成胖 `Step[]`（插桩重走，逐行粒度）+ 四语言源码与 `lineMap`。纯逻辑，L3 可测，与已测 oracle 交叉校验。

**Files:**

- Create: `src/algorithms/bubble-sort.sources.ts`
- Create: `src/algorithms/bubble-sort.module.ts`
- Test: `src/algorithms/bubble-sort.module.spec.ts`
- 不动：`src/algorithms/bubble-sort.ts`（继续作正确性 oracle）

**Interfaces:**

- Consumes: `AlgorithmModule`/`Step`/`LangSource`/`ExecPoint` from `./player/types`；`bubbleSortSteps` from `./bubble-sort`（仅测试里交叉校验用）
- Produces:
  - `bubbleSortSources: LangSource[]`（四门语言）
  - `buildBubbleSortSteps(input: number[]): Step[]`
  - `bubbleSortModule: AlgorithmModule`

- [ ] **Step 1: 写四语言源码 `bubble-sort.sources.ts`**

> `lineMap` 的行号是 1-based，对应下面 `code` 字符串里**去掉首行换行后**的物理行。每改一行代码就同步改 `lineMap`（Task 2 的 L3 会校验每个 `ExecPoint` 行号落在 `[1, 行数]` 内）。

```ts
// src/algorithms/bubble-sort.sources.ts
import type { LangSource } from '@/components/player/types';

const ts = `function bubbleSort(a: number[]): number[] {
  const n = a.length;
  for (let end = n - 1; end > 0; end--) {
    for (let j = 0; j < end; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}`;

const python = `def bubble_sort(a):
    n = len(a)
    for end in range(n - 1, 0, -1):
        for j in range(end):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a`;

const go = `func bubbleSort(a []int) []int {
\tn := len(a)
\tfor end := n - 1; end > 0; end-- {
\t\tfor j := 0; j < end; j++ {
\t\t\tif a[j] > a[j+1] {
\t\t\t\ta[j], a[j+1] = a[j+1], a[j]
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn bubble_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for end in (1..n).rev() {
        for j in 0..end {
            if a[j] > a[j + 1] {
                a.swap(j, j + 1);
            }
        }
    }
}`;

export const bubbleSortSources: LangSource[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 行: 1 fn / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / 10 return / 11 }
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 10 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 行: 1 def / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / 7 return
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 7 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 行: 1 func / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / 10 return
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 10 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 行: 1 fn / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / (无 return，done 落 fn 末行 10)
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 10 },
  },
];
```

- [ ] **Step 2: 写失败测试 `bubble-sort.module.spec.ts`**

```ts
// src/algorithms/bubble-sort.module.spec.ts
import { describe, it, expect } from 'vitest';
import { bubbleSortSteps } from './bubble-sort';
import { buildBubbleSortSteps, bubbleSortModule } from './bubble-sort.module';
import type { ExecPoint } from '@/components/player/types';

const EXEC_POINTS: ExecPoint[] = ['outerLoop', 'innerLoop', 'compare', 'swap', 'noSwap', 'done'];

describe('buildBubbleSortSteps', () => {
  it('空数组/单元素也产出至少一个 done 步（播放器不能空）', () => {
    expect(buildBubbleSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildBubbleSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('末步数组与 oracle 最终结果一致（交叉校验）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildBubbleSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = bubbleSortSteps(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('稳定 key：每个步 array 的 id 集合恒等于初始 id 集合（FLIP 前提）', () => {
    const input = [3, 1, 2];
    const all = buildBubbleSortSteps(input);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('不修改入参', () => {
    const input = [3, 2, 1];
    buildBubbleSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('每个步的 point 合法，且 swap 步 emphasis.swapped 为真', () => {
    for (const s of buildBubbleSortSteps([3, 1, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'swap') expect(s.emphasis.swapped).toBe(true);
      if (s.point === 'noSwap') expect(s.emphasis.swapped).toBe(false);
    }
  });
});

describe('bubbleSortModule.sources', () => {
  it('四门语言齐备', () => {
    expect(bubbleSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('每门语言的每个 ExecPoint 行号都落在源码物理行范围内', () => {
    for (const src of bubbleSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildBubbleSortSteps(bubbleSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of bubbleSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm test:unit run src/algorithms/bubble-sort.module.spec.ts`
Expected: FAIL（`buildBubbleSortSteps` / `bubbleSortModule` 未定义）

- [ ] **Step 4: 实现 `bubble-sort.module.ts`**

```ts
// src/algorithms/bubble-sort.module.ts
import type { AlgorithmModule, ExecPoint, Step, VarRow } from '@/components/player/types';
import { bubbleSortSources } from './bubble-sort.sources';

const ID_I = '0'; // 红箭头（colors[0]）
const ID_J = '1'; // 蓝箭头（colors[1]）

/** 插桩重走标准冒泡，产出逐行粒度的胖步骤 */
export function buildBubbleSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;

  let pass = 0;
  let swapCount = 0;
  let sortedFrom = n; // 下标 >= sortedFrom 已就位；初始无

  const clampIdx = (k: number) => Math.min(Math.max(k, 0), Math.max(0, n - 1));

  const vars = (j: number): VarRow[] => [
    { name: 'n', value: n },
    { name: 'pass', value: pass },
    { name: 'j', value: j },
    { name: 'a[j]', value: work[j]?.[1] ?? '-' },
    { name: 'a[j+1]', value: work[j + 1]?.[1] ?? '-' },
    { name: 'swapCount', value: swapCount },
    { name: 'sortedFrom', value: sortedFrom },
  ];

  const push = (
    point: ExecPoint,
    i: number,
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
      emphasis: { sortedFrom, ...emphasis },
      vars: vars(j),
      point,
      caption,
    });
  };

  if (n <= 1) {
    sortedFrom = 0;
    push('done', 0, 0, {}, '完成');
    return steps;
  }

  for (let end = n - 1; end > 0; end--) {
    pass++;
    push('outerLoop', 0, 1, {}, `第 ${pass} 轮`);
    for (let j = 0; j < end; j++) {
      push('innerLoop', j, j + 1, {}, `看位置 ${j} 与 ${j + 1}`);
      const a = work[j][1];
      const b = work[j + 1][1];
      const willSwap = a > b;
      push('compare', j, j + 1, { comparing: [j, j + 1] }, `${a} ${willSwap ? '>' : '≤'} ${b}`);
      if (willSwap) {
        [work[j], work[j + 1]] = [work[j + 1], work[j]];
        swapCount++;
        push('swap', j, j + 1, { comparing: [j, j + 1], swapped: true }, `交换 ${a} 与 ${b}`);
      } else {
        push('noSwap', j, j + 1, { comparing: [j, j + 1], swapped: false }, '不交换');
      }
    }
    sortedFrom = end; // 本轮把 end 位置定下来
  }
  sortedFrom = 0; // 全部就位
  push('done', 0, 1, {}, '完成');
  return steps;
}

export const bubbleSortModule: AlgorithmModule = {
  title: '冒泡排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1],
  buildSteps: buildBubbleSortSteps,
  sources: bubbleSortSources,
};
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/algorithms/bubble-sort.module.spec.ts`
Expected: PASS（8 个 case 全绿）

- [ ] **Step 6: 全量 L3 回归（确认 oracle 未受影响）**

Run: `pnpm test:unit run src/algorithms/bubble-sort.spec.ts`
Expected: PASS（TC-ALGO-01..06 仍绿，`bubble-sort.ts` 未动）

- [ ] **Step 7: type-check + 提交**

```bash
pnpm type-check
git add src/algorithms/bubble-sort.sources.ts src/algorithms/bubble-sort.module.ts src/algorithms/bubble-sort.module.spec.ts
git commit -m "feat(player): 冒泡 buildSteps 插桩重走 + 四语言源码/行映射（L3）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `ArrowTrack` 槽宽参数化

让指针箭头能与柱状条共用槽宽对齐。改动极小、独立可测；默认 60 保证旧用例 `TC-VIZ-ARROWTRACK-01` 仍绿。

**Files:**

- Modify: `src/components/ArrowTrack.vue`
- Test: `src/components/ArrowTrack.spec.ts`（加 1 个 case）

**Interfaces:**

- Produces: `ArrowTrack` 新增可选 prop `slotWidth?: number`（默认 60）；定位公式 `translateX(index * slotWidth)`

- [ ] **Step 1: 加失败测试（自定义槽宽）`ArrowTrack.spec.ts`**

在现有 `describe('ArrowTrack')` 内追加：

```ts
it('slotWidth 自定义时按其定位', () => {
  const w = mount(ArrowTrack, {
    props: {
      data: [{ id: '0', index: 2 }],
      slotWidth: 50,
    },
    global: { plugins: [createPinia()] },
  });
  const arrow = w.findAllComponents(Arrow)[0];
  expect(arrow.attributes('style')).toContain('translateX(100px)'); // 2 * 50
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/ArrowTrack.spec.ts`
Expected: FAIL（仍按固定 60 → 得到 translateX(120px)）

- [ ] **Step 3: 实现 `ArrowTrack.vue` 参数化**

把脚本里的 `genOffect` 改为吃 prop（其余模板/样式不变）：

```ts
const props = withDefaults(
  defineProps<{
    data: Array<Pointer>;
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

function genOffect(index: number): number {
  return index * props.slotWidth;
}
```

> 注：原文件 `import type { Pointer }`、`useSystemStore`、模板与样式保持不变。

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/ArrowTrack.spec.ts`
Expected: PASS（旧 `TC-VIZ-ARROWTRACK-01` 120px + 新 `TC-VIZ-ARROWTRACK-02` 100px 均绿）

- [ ] **Step 5: type-check + 提交**

```bash
pnpm type-check
git add src/components/ArrowTrack.vue src/components/ArrowTrack.spec.ts
git commit -m "feat(player): ArrowTrack 槽宽参数化（默认 60 不破坏旧用例）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: 柱状条可视化 `Bar` + `BarsView`

新的动画主体：高度=值的柱子 + 顶部数值 + 状态配色 + FLIP 交换动画，下方挂参数化的 `ArrowTrack`。

**Files:**

- Create: `src/components/Bar.vue`
- Create: `src/components/BarsView.vue`
- Test: `src/components/Bar.spec.ts`
- Test: `src/components/BarsView.spec.ts`

**Interfaces:**

- Consumes: `Pointer`/`StepEmphasis` from `@/components/player/types`；`ArrowTrack`（Task 3 的 `slotWidth`）
- Produces:
  - `Bar` props：`{ value: number; percent: number; state: 'idle'|'comparing'|'swapped'|'sorted' }`
  - `BarsView` props：`{ array: [string,number][]; pointers: Pointer[]; emphasis: StepEmphasis; slotWidth?: number }`（默认 60）

- [ ] **Step 1: 写失败测试 `Bar.spec.ts`**

```ts
// src/components/Bar.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Bar from './Bar.vue';

describe('Bar', () => {
  it('渲染数值', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'idle' } });
    expect(w.text()).toContain('7');
  });

  it('高度随 percent 增大', () => {
    const low = mount(Bar, { props: { value: 1, percent: 0, state: 'idle' } });
    const high = mount(Bar, { props: { value: 9, percent: 1, state: 'idle' } });
    const h = (w: typeof low) =>
      parseFloat((w.find('.bar').attributes('style') || '').match(/height:\s*([\d.]+)px/)![1]);
    expect(h(high)).toBeGreaterThan(h(low));
  });

  it('state 决定柱体 class', () => {
    const w = mount(Bar, { props: { value: 7, percent: 0.5, state: 'comparing' } });
    expect(w.find('.bar').classes()).toContain('comparing');
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: FAIL（`Bar.vue` 不存在）

- [ ] **Step 3: 实现 `Bar.vue`**

```vue
<!-- src/components/Bar.vue -->
<script setup lang="ts">
defineProps<{
  value: number;
  percent: number;
  state: 'idle' | 'comparing' | 'swapped' | 'sorted';
}>();
</script>
<template>
  <div class="bar-cell column center">
    <span class="val">{{ value }}</span>
    <div class="bar" :class="state" :style="{ height: 30 + percent * 130 + 'px' }"></div>
  </div>
</template>
<style scoped lang="less">
.bar-cell {
  justify-content: flex-end;
}
.val {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}
.bar {
  width: 40px;
  border-radius: 8px;
  background-color: #8bd3a0;
  transition:
    height 0.3s ease,
    background-color 0.3s ease;
  .neumorphism-flat(3px, 8px);
}
.bar.comparing {
  background-color: #ffcf5c;
}
.bar.swapped {
  background-color: #ff8a65;
}
.bar.sorted {
  background-color: #4caf50;
}
</style>
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/Bar.spec.ts`
Expected: PASS

- [ ] **Step 5: 写失败测试 `BarsView.spec.ts`**

```ts
// src/components/BarsView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BarsView from './BarsView.vue';
import Bar from './Bar.vue';
import ArrowTrack from './ArrowTrack.vue';

const mountIt = (props: Record<string, unknown>) =>
  mount(BarsView, { props, global: { plugins: [createPinia()] } });

describe('BarsView', () => {
  const base = {
    array: [
      ['0', 5],
      ['1', 9],
      ['2', 1],
    ] as [string, number][],
    pointers: [{ id: '0', index: 0 }],
    emphasis: {},
  };

  it('渲染与数据等量的 Bar', () => {
    const w = mountIt(base);
    expect(w.findAllComponents(Bar)).toHaveLength(3);
  });

  it('最大值柱最高、最小值柱最低', () => {
    const w = mountIt(base);
    const bars = w.findAllComponents(Bar);
    expect(bars[1].props('percent')).toBeGreaterThan(bars[0].props('percent')); // 9 > 5
    expect(bars[2].props('percent')).toBeLessThan(bars[0].props('percent')); // 1 < 5
  });

  it('comparing 下标的 Bar 进入 comparing 态', () => {
    const w = mountIt({ ...base, emphasis: { comparing: [0, 1] } });
    expect(w.findAllComponents(Bar)[0].props('state')).toBe('comparing');
  });

  it('sortedFrom 之后的 Bar 进入 sorted 态', () => {
    const w = mountIt({ ...base, emphasis: { sortedFrom: 2 } });
    expect(w.findAllComponents(Bar)[2].props('state')).toBe('sorted');
  });

  it('把 slotWidth 透传给 ArrowTrack', () => {
    const w = mountIt({ ...base, slotWidth: 50 });
    expect(w.findComponent(ArrowTrack).props('slotWidth')).toBe(50);
  });
});
```

- [ ] **Step 6: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/BarsView.spec.ts`
Expected: FAIL（`BarsView.vue` 不存在）

- [ ] **Step 7: 实现 `BarsView.vue`**

```vue
<!-- src/components/BarsView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { Pointer, StepEmphasis } from '@/components/player/types';
import ArrowTrackComp from './ArrowTrack.vue';
import BarComp from './Bar.vue';

const props = withDefaults(
  defineProps<{
    array: [string, number][];
    pointers: Pointer[];
    emphasis: StepEmphasis;
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const min = computed(() => Math.min(...props.array.map((t) => t[1])));
const max = computed(() => Math.max(...props.array.map((t) => t[1])));

function percent(v: number): number {
  const span = max.value - min.value;
  if (span === 0) return 1;
  return 0.08 + 0.92 * ((v - min.value) / span); // 最小值给 0.08 基准，避免看不见
}

function stateOf(index: number): 'idle' | 'comparing' | 'swapped' | 'sorted' {
  const e = props.emphasis;
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (inCompare) return 'comparing';
  if (e.sortedFrom !== undefined && index >= e.sortedFrom) return 'sorted';
  return 'idle';
}
</script>
<template>
  <div class="bars-view column center">
    <TransitionGroup name="bars" tag="div" class="row bars">
      <BarComp
        v-for="(item, index) in props.array"
        :key="item[0]"
        :value="item[1]"
        :percent="percent(item[1])"
        :state="stateOf(index)"
        :style="{ width: props.slotWidth + 'px' }"
      />
    </TransitionGroup>
    <ArrowTrackComp :data="props.pointers" :slot-width="props.slotWidth" />
  </div>
</template>
<style scoped lang="less">
.bars {
  align-items: flex-end;
  min-height: 180px;
}
/* FLIP：交换时柱子平滑移动 */
.bars-move {
  transition: transform 0.4s ease;
}
</style>
```

- [ ] **Step 8: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/Bar.spec.ts src/components/BarsView.spec.ts`
Expected: PASS（Bar 3 + BarsView 5 = 8 个 case 全绿）

- [ ] **Step 9: type-check + 提交**

```bash
pnpm type-check
git add src/components/Bar.vue src/components/BarsView.vue src/components/Bar.spec.ts src/components/BarsView.spec.ts
git commit -m "feat(player): 柱状条可视化 Bar + BarsView（高度/数值/状态色/FLIP）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Shiki 高亮 `useHighlighter` + 代码面板 `CodePanel`

只读多语言代码视图：语言 Tab + Shiki 逐行高亮 + 当前执行行高亮（随 `point` 经 `lineMap` 定位）。

**Files:**

- Modify: `package.json`（加依赖 `shiki`）
- Create: `src/components/player/useHighlighter.ts`
- Create: `src/components/player/CodePanel.vue`
- Test: `src/components/player/CodePanel.spec.ts`

**Interfaces:**

- Consumes: `Lang`/`ExecPoint`/`LangSource` from `./types`；`useSystemStore().isDarkMode`
- Produces:
  - `highlightToLines(code: string, lang: Lang, dark: boolean): Promise<HlLines>`，`HlLines = { content: string; color?: string }[][]`（逐行 token）
  - `CodePanel` props：`{ sources: LangSource[]; point: ExecPoint }`

- [ ] **Step 1: 安装 Shiki**

```bash
pnpm add shiki
```

Expected: `package.json` `dependencies` 出现 `shiki`；`pnpm-lock.yaml` 更新。

> 选用 `shiki` 主包的 `createHighlighter` + `createJavaScriptRegexEngine`（免 WASM），只声明四门语言、两套主题。算法页是懒加载路由，Shiki chunk 只在打开算法页时下载。若日后要进一步压体积，可迁移到 `createHighlighterCore` + `@shikijs/langs/*` 细粒度（需把 `@shikijs/langs`/`@shikijs/themes` 提为直接依赖）。

- [ ] **Step 2: 实现 `useHighlighter.ts`**

```ts
// src/components/player/useHighlighter.ts
import { createHighlighter, type Highlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { Lang } from './types';

const SHIKI_LANG: Record<Lang, string> = {
  ts: 'typescript',
  python: 'python',
  go: 'go',
  rust: 'rust',
};
const LIGHT = 'github-light';
const DARK = 'github-dark';

let hlPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!hlPromise) {
    hlPromise = createHighlighter({
      langs: ['typescript', 'python', 'go', 'rust'],
      themes: [LIGHT, DARK],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return hlPromise;
}

export interface HlToken {
  content: string;
  color?: string;
}
export type HlLines = HlToken[][];

const cache = new Map<string, HlLines>();

export async function highlightToLines(code: string, lang: Lang, dark: boolean): Promise<HlLines> {
  const key = `${lang}|${dark ? 'd' : 'l'}|${code}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, {
    lang: SHIKI_LANG[lang],
    theme: dark ? DARK : LIGHT,
  });
  const lines: HlLines = tokens.map((line) =>
    line.map((t) => ({ content: t.content, color: t.color })),
  );
  cache.set(key, lines);
  return lines;
}
```

- [ ] **Step 3: 写失败测试 `CodePanel.spec.ts`（mock 掉 Shiki）**

```ts
// src/components/player/CodePanel.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import CodePanel from './CodePanel.vue';
import { bubbleSortSources } from '@/algorithms/bubble-sort.sources';

// 不在单测里真跑 Shiki：每行返回一个 token = 原始行文本
vi.mock('./useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = (point: string) =>
  mount(CodePanel, {
    props: { sources: bubbleSortSources, point },
    global: { plugins: [createPinia()] },
  });

describe('CodePanel', () => {
  it('渲染默认语言(TS)的所有行', async () => {
    const w = mountIt('compare');
    await flushPromises();
    const tsLines = bubbleSortSources[0].code.split('\n').length;
    expect(w.findAll('.code-line')).toHaveLength(tsLines);
  });

  it('当前执行行随 point 经 lineMap 高亮', async () => {
    const w = mountIt('swap'); // TS lineMap.swap = 6
    await flushPromises();
    const active = w.findAll('.code-line').filter((n) => n.classes().includes('is-active'));
    expect(active).toHaveLength(1);
    expect(w.findAll('.code-line')[5].classes()).toContain('is-active'); // 第 6 行（0-based 5）
  });

  it('切换语言 Tab 后按该语言 lineMap 高亮', async () => {
    const w = mountIt('done'); // TS done=11 → 切到 Python done=7
    await flushPromises();
    const pyTab = w.findAll('.tab').find((b) => b.text() === 'Python')!;
    await pyTab.trigger('click');
    await flushPromises();
    expect(w.findAll('.code-line')[6].classes()).toContain('is-active'); // Python 第 7 行
  });
});
```

- [ ] **Step 4: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/player/CodePanel.spec.ts`
Expected: FAIL（`CodePanel.vue` 不存在）

- [ ] **Step 5: 实现 `CodePanel.vue`**

```vue
<!-- src/components/player/CodePanel.vue -->
<script setup lang="ts">
import { ref, computed, shallowRef, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/store/modules/system';
import type { ExecPoint, Lang, LangSource } from './types';
import { highlightToLines, type HlLines } from './useHighlighter';

const props = defineProps<{ sources: LangSource[]; point: ExecPoint }>();

const activeLang = ref<Lang>(props.sources[0].lang);
const activeSource = computed(
  () => props.sources.find((s) => s.lang === activeLang.value) ?? props.sources[0],
);
const activeLine = computed(() => activeSource.value.lineMap[props.point]);

const { isDarkMode } = storeToRefs(useSystemStore());
const lines = shallowRef<HlLines | null>(null);

watchEffect(async () => {
  const src = activeSource.value;
  const dark = isDarkMode.value;
  lines.value = await highlightToLines(src.code, src.lang, dark);
});

const plainLines = computed(() => activeSource.value.code.split('\n'));
</script>
<template>
  <div class="code-panel" :class="{ dark: isDarkMode }">
    <div class="tabs row">
      <button
        v-for="s in props.sources"
        :key="s.lang"
        class="tab"
        :class="{ on: s.lang === activeLang }"
        @click="activeLang = s.lang"
      >
        {{ s.label }}
      </button>
    </div>
    <div class="code">
      <template v-if="lines">
        <div
          v-for="(line, i) in lines"
          :key="i"
          class="code-line"
          :class="{ 'is-active': i + 1 === activeLine }"
        >
          <span class="ln">{{ i + 1 }}</span
          ><span class="tok" v-for="(t, ti) in line" :key="ti" :style="{ color: t.color }">{{
            t.content
          }}</span>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(line, i) in plainLines"
          :key="i"
          class="code-line"
          :class="{ 'is-active': i + 1 === activeLine }"
        >
          <span class="ln">{{ i + 1 }}</span
          ><span class="tok">{{ line }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="less">
.code-panel {
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  border-radius: 12px;
  overflow: hidden;
  .neumorphism-flat(4px, 12px);
}
.tabs {
  gap: 4px;
  padding: 6px;
}
.tab {
  border: none;
  background: transparent;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}
.tab.on {
  .neumorphism-pressed(2px, 8px);
}
.code {
  padding: 8px 0;
  font-size: 13px;
  line-height: 1.6;
}
.code-line {
  display: block;
  white-space: pre;
  padding: 0 12px;
}
.code-line.is-active {
  background: rgba(255, 207, 92, 0.28);
}
.ln {
  display: inline-block;
  width: 2em;
  margin-right: 12px;
  text-align: right;
  opacity: 0.4;
  user-select: none;
}
</style>
```

> 若 `.neumorphism-pressed` 在 `common.less` 中名称不同，按实际混入名调整（与现有按钮一致即可）。

- [ ] **Step 6: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/player/CodePanel.spec.ts`
Expected: PASS（3 个 case 全绿）

- [ ] **Step 7: type-check + 提交**

```bash
pnpm type-check
git add package.json pnpm-lock.yaml src/components/player/useHighlighter.ts src/components/player/CodePanel.vue src/components/player/CodePanel.spec.ts
git commit -m "feat(player): Shiki 高亮 useHighlighter + 只读多语言 CodePanel（当前行高亮）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: 变量面板 `VariablePanel`

按 `current.vars` 渲染名/值行，与上一步比对、变化的行高亮。

**Files:**

- Create: `src/components/player/VariablePanel.vue`
- Test: `src/components/player/VariablePanel.spec.ts`

**Interfaces:**

- Consumes: `VarRow` from `./types`
- Produces: `VariablePanel` props：`{ vars: VarRow[]; prev?: VarRow[] }`

- [ ] **Step 1: 写失败测试 `VariablePanel.spec.ts`**

```ts
// src/components/player/VariablePanel.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VariablePanel from './VariablePanel.vue';
import type { VarRow } from './types';

const vars: VarRow[] = [
  { name: 'j', value: 2 },
  { name: 'a[j]', value: 9 },
];

describe('VariablePanel', () => {
  it('渲染每个变量的名与值', () => {
    const w = mount(VariablePanel, { props: { vars } });
    expect(w.findAll('.var-row')).toHaveLength(2);
    expect(w.text()).toContain('j');
    expect(w.text()).toContain('9');
  });

  it('与上一步比较，变化的行加 changed', () => {
    const prev: VarRow[] = [
      { name: 'j', value: 1 },
      { name: 'a[j]', value: 9 },
    ];
    const w = mount(VariablePanel, { props: { vars, prev } });
    const rows = w.findAll('.var-row');
    expect(rows[0].classes()).toContain('changed'); // j 1→2
    expect(rows[1].classes()).not.toContain('changed'); // a[j] 不变
  });

  it('无 prev 时都不高亮', () => {
    const w = mount(VariablePanel, { props: { vars } });
    expect(w.findAll('.var-row.changed')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/player/VariablePanel.spec.ts`
Expected: FAIL（组件不存在）

- [ ] **Step 3: 实现 `VariablePanel.vue`**

```vue
<!-- src/components/player/VariablePanel.vue -->
<script setup lang="ts">
import type { VarRow } from './types';

const props = defineProps<{ vars: VarRow[]; prev?: VarRow[] }>();

function changed(row: VarRow): boolean {
  if (!props.prev) return false;
  const p = props.prev.find((r) => r.name === row.name);
  return p !== undefined && p.value !== row.value;
}
</script>
<template>
  <div class="var-panel column">
    <div
      class="var-row row"
      v-for="row in props.vars"
      :key="row.name"
      :class="{ changed: changed(row) }"
    >
      <span class="name">{{ row.name }}</span>
      <span class="value">{{ row.value }}</span>
    </div>
  </div>
</template>
<style scoped lang="less">
.var-panel {
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  .neumorphism-flat(4px, 12px);
}
.var-row {
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  transition: background-color 0.3s ease;
}
.var-row.changed {
  background: rgba(255, 138, 101, 0.25);
}
.name {
  opacity: 0.65;
}
.value {
  font-weight: bold;
}
</style>
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/player/VariablePanel.spec.ts`
Expected: PASS（3 个 case）

- [ ] **Step 5: type-check + 提交**

```bash
pnpm type-check
git add src/components/player/VariablePanel.vue src/components/player/VariablePanel.spec.ts
git commit -m "feat(player): 变量面板 VariablePanel（变化高亮）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: 传输控制条 `TransportControls`

播放/暂停/上一步/下一步/重置/速度/进度条。纯展示组件，只 emit 事件、不持状态。

**Files:**

- Create: `src/components/player/TransportControls.vue`
- Test: `src/components/player/TransportControls.spec.ts`

**Interfaces:**

- Produces:
  - props：`{ isPlaying: boolean; atStart: boolean; atEnd: boolean; index: number; total: number; speed: number }`
  - emits：`play` / `pause` / `stepBack` / `stepForward` / `reset` / `seek(value:number)` / `setSpeed(value:number)`

- [ ] **Step 1: 写失败测试 `TransportControls.spec.ts`**

```ts
// src/components/player/TransportControls.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TransportControls from './TransportControls.vue';

const base = { isPlaying: false, atStart: false, atEnd: false, index: 3, total: 10, speed: 1 };
const mountIt = (over = {}) => mount(TransportControls, { props: { ...base, ...over } });

describe('TransportControls', () => {
  it('未播放时主按钮点了 emit play', async () => {
    const w = mountIt({ isPlaying: false });
    await w.find('.play').trigger('click');
    expect(w.emitted('play')).toHaveLength(1);
  });

  it('播放中主按钮点了 emit pause', async () => {
    const w = mountIt({ isPlaying: true });
    await w.find('.play').trigger('click');
    expect(w.emitted('pause')).toHaveLength(1);
  });

  it('atStart 时上一步禁用', () => {
    const w = mountIt({ atStart: true });
    expect(w.find('.ctl[title="上一步"]').attributes('disabled')).toBeDefined();
  });

  it('atEnd 时下一步禁用', () => {
    const w = mountIt({ atEnd: true });
    expect(w.find('.ctl[title="下一步"]').attributes('disabled')).toBeDefined();
  });

  it('下一步 emit stepForward', async () => {
    const w = mountIt();
    await w.find('.ctl[title="下一步"]').trigger('click');
    expect(w.emitted('stepForward')).toHaveLength(1);
  });

  it('重置 emit reset', async () => {
    const w = mountIt();
    await w.find('.ctl[title="重置"]').trigger('click');
    expect(w.emitted('reset')).toHaveLength(1);
  });

  it('计数器显示 index+1 / total', () => {
    const w = mountIt({ index: 3, total: 10 });
    expect(w.find('.counter').text()).toBe('4 / 10');
  });

  it('拖动进度条 emit seek(值)', async () => {
    const w = mountIt();
    const scrub = w.find('.scrub');
    (scrub.element as HTMLInputElement).value = '7';
    await scrub.trigger('input');
    expect(w.emitted('seek')![0]).toEqual([7]);
  });

  it('改速 emit setSpeed(值)', async () => {
    const w = mountIt();
    const sel = w.find('.speed');
    (sel.element as HTMLSelectElement).value = '2';
    await sel.trigger('change');
    expect(w.emitted('setSpeed')![0]).toEqual([2]);
  });
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm test:unit run src/components/player/TransportControls.spec.ts`
Expected: FAIL（组件不存在）

- [ ] **Step 3: 实现 `TransportControls.vue`**

```vue
<!-- src/components/player/TransportControls.vue -->
<script setup lang="ts">
defineProps<{
  isPlaying: boolean;
  atStart: boolean;
  atEnd: boolean;
  index: number;
  total: number;
  speed: number;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
  stepBack: [];
  stepForward: [];
  reset: [];
  seek: [value: number];
  setSpeed: [value: number];
}>();

const SPEEDS = [0.5, 1, 2];

function onSeek(e: Event) {
  emit('seek', Number((e.target as HTMLInputElement).value));
}
function onSpeed(e: Event) {
  emit('setSpeed', Number((e.target as HTMLSelectElement).value));
}
</script>
<template>
  <div class="transport row center">
    <button class="ctl" title="重置" @click="emit('reset')">↺</button>
    <button class="ctl" title="上一步" :disabled="atStart" @click="emit('stepBack')">⏮</button>
    <button class="ctl play" @click="isPlaying ? emit('pause') : emit('play')">
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
    <button class="ctl" title="下一步" :disabled="atEnd" @click="emit('stepForward')">⏭</button>
    <select class="speed" :value="speed" @change="onSpeed">
      <option v-for="s in SPEEDS" :key="s" :value="s">{{ s }}×</option>
    </select>
    <input
      class="scrub"
      type="range"
      min="0"
      :max="Math.max(0, total - 1)"
      :value="index"
      @input="onSeek"
    />
    <span class="counter">{{ index + 1 }} / {{ total }}</span>
  </div>
</template>
<style scoped lang="less">
.transport {
  gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  .neumorphism-flat(4px, 12px);
}
.ctl {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  .neumorphism-btn(3px, 50%);
}
.ctl:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.scrub {
  flex: 1;
  min-width: 120px;
}
.counter {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  min-width: 60px;
  text-align: right;
}
</style>
```

> 注：`.neumorphism-btn` 用现有 `common.less` 里实际的按钮混入名（与 Header/Menu 按钮一致）；若名称不同按实际改。

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/player/TransportControls.spec.ts`
Expected: PASS（9 个 case）

- [ ] **Step 5: type-check + 提交**

```bash
pnpm type-check
git add src/components/player/TransportControls.vue src/components/player/TransportControls.spec.ts
git commit -m "feat(player): 传输控制条 TransportControls（播放/单步/重置/速度/进度）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: 外壳装配 `AlgorithmPlayer` + 冒泡接入 `BubbleSort.vue`

把 6 个单元装成完整播放器，并让 `BubbleSort.vue` 瘦身接入。**改写**受影响的 `TC-VIEW-BUBBLE-01/02`。

**Files:**

- Create: `src/components/player/AlgorithmPlayer.vue`
- Test: `src/components/player/AlgorithmPlayer.spec.ts`
- Modify (rewrite): `src/views/Article/SortAlgorithm/BubbleSort.vue`
- Modify (rewrite): `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`

**Interfaces:**

- Consumes: `AlgorithmModule` from `./types`；`usePlayer`；`BarsView`、`CodePanel`、`VariablePanel`、`TransportControls`
- Produces: `AlgorithmPlayer` props：`{ module: AlgorithmModule }`

- [ ] **Step 1: 实现 `AlgorithmPlayer.vue`**

```vue
<!-- src/components/player/AlgorithmPlayer.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { AlgorithmModule } from './types';
import { usePlayer } from './usePlayer';
import BarsView from '@/components/BarsView.vue';
import CodePanel from './CodePanel.vue';
import VariablePanel from './VariablePanel.vue';
import TransportControls from './TransportControls.vue';

const props = defineProps<{ module: AlgorithmModule }>();

const steps = props.module.buildSteps(props.module.initialInput());
const {
  index,
  isPlaying,
  atStart,
  atEnd,
  total,
  speed,
  current,
  play,
  pause,
  stepForward,
  stepBackward,
  seek,
  reset,
  setSpeed,
} = usePlayer(steps);

const prevVars = computed(() => steps[index.value - 1]?.vars);
</script>
<template>
  <div class="algo-player column center">
    <BarsView :array="current.array" :pointers="current.pointers" :emphasis="current.emphasis" />
    <p class="caption">{{ current.caption }}</p>
    <div class="middle row">
      <CodePanel class="code-pane" :sources="props.module.sources" :point="current.point" />
      <VariablePanel class="var-pane" :vars="current.vars" :prev="prevVars" />
    </div>
    <TransportControls
      :is-playing="isPlaying"
      :at-start="atStart"
      :at-end="atEnd"
      :index="index"
      :total="total"
      :speed="speed"
      @play="play"
      @pause="pause"
      @step-back="stepBackward"
      @step-forward="stepForward"
      @reset="reset"
      @seek="seek"
      @set-speed="setSpeed"
    />
  </div>
</template>
<style scoped lang="less">
.algo-player {
  gap: 16px;
  width: 100%;
}
.caption {
  font-weight: bold;
  font-size: 16px;
  min-height: 24px;
}
.middle {
  gap: 16px;
  width: 100%;
  align-items: stretch;
}
.code-pane {
  flex: 2;
  min-width: 0;
}
.var-pane {
  flex: 1;
  min-width: 160px;
}
@media (max-width: @screen-max-width) {
  .middle {
    flex-direction: column;
  }
}
</style>
```

- [ ] **Step 2: 写测试 `AlgorithmPlayer.spec.ts`（mock Shiki）**

```ts
// src/components/player/AlgorithmPlayer.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AlgorithmPlayer from './AlgorithmPlayer.vue';
import TransportControls from './TransportControls.vue';
import Bar from '@/components/Bar.vue';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';

vi.mock('./useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(AlgorithmPlayer, {
    props: { module: bubbleSortModule },
    global: { plugins: [createPinia()] },
  });

describe('AlgorithmPlayer', () => {
  it('渲染柱状图 + 代码面板 + 变量面板 + 控制条', async () => {
    const w = mountIt();
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.code-panel').exists()).toBe(true);
    expect(w.find('.var-panel').exists()).toBe(true);
    expect(w.findComponent(TransportControls).exists()).toBe(true);
  });

  it('默认停在第 0 步，点下一步推进到第 2 步', async () => {
    const w = mountIt();
    await flushPromises();
    expect(w.find('.counter').text()).toContain('1 / ');
    await w.find('.ctl[title="下一步"]').trigger('click');
    expect(w.find('.counter').text()).toContain('2 / ');
  });
});
```

- [ ] **Step 3: 改写 `BubbleSort.vue`（瘦身）**

```vue
<!-- src/views/Article/SortAlgorithm/BubbleSort.vue -->
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="bubbleSortModule" />
</template>
```

- [ ] **Step 4: 改写 `BubbleSort.spec.ts`（supersede TC-VIEW-BUBBLE-01/02）**

```ts
// src/views/Article/SortAlgorithm/BubbleSort.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BubbleSort from './BubbleSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('BubbleSort', () => {
  it('挂载渲染 AlgorithmPlayer', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('初始渲染 10 根柱子且默认停在第 0 步', async () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm test:unit run src/components/player/AlgorithmPlayer.spec.ts src/views/Article/SortAlgorithm/BubbleSort.spec.ts`
Expected: PASS（AlgorithmPlayer 2 + BubbleSort 2）

- [ ] **Step 6: 全量单测回归 + type-check**

Run: `pnpm test:unit run` 然后 `pnpm type-check`
Expected: 全绿（旧 List/Block/ArrowTrack/ALGO/STORE 等用例不受影响；BubbleSort 两例已改写）

- [ ] **Step 7: 起 dev 真机自测（动画/高亮/暗色）**

Run: `pnpm dev` → 打开 `/docs/bubble-sort`：默认停第 0 步；播放看柱子交换 FLIP；单步看代码当前行高亮 + 变量变化；切四语言 Tab；切暗色看主题联动。

- [ ] **Step 8: 提交**

```bash
git add src/components/player/AlgorithmPlayer.vue src/components/player/AlgorithmPlayer.spec.ts src/views/Article/SortAlgorithm/BubbleSort.vue src/views/Article/SortAlgorithm/BubbleSort.spec.ts
git commit -m "feat(player): AlgorithmPlayer 外壳装配 + 冒泡接入（改写 TC-VIEW-BUBBLE）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: e2e 改写 + 全局索引/文档回填

把默认自动播放的 e2e 改成"默认暂停→单步→跳末升序→重置"，并把本变更的所有 Case 登记进全局索引，回填四文档状态。

**Files:**

- Modify (rewrite): `e2e/bubble-sort.e2e.ts`
- Modify: `docs/test-cases/index.md`、`docs/test-cases/by-layer.md`、`docs/test-cases/by-module.md`
- Modify: `docs/plans/20260619-c006-interactive-player/{implementation.md,test-cases.md}`
- Modify: `docs/plans/index.md`、`docs/roadmap.md`

- [ ] **Step 1: 改写 `e2e/bubble-sort.e2e.ts`**

> 保留原文件首行的 `page.goto(...)` 导航（已验证可达冒泡页），仅替换断言主体为下面逻辑。

```ts
import { test, expect } from '@playwright/test';

test('TC-E2E-PLAYER-01 冒泡播放器：默认暂停/单步/跳末升序/重置', async ({ page }) => {
  await page.goto('/docs/bubble-sort'); // ← 若原文件用别的路径，沿用原路径

  const bars = page.locator('.bar-cell');
  await expect(bars).toHaveCount(10);
  await expect(page.locator('.counter')).toContainText('1 / '); // 默认停第 0 步

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

- [ ] **Step 2: 运行 e2e，确认通过**

Run: `pnpm test:e2e bubble-sort`
Expected: PASS（`TC-E2E-PLAYER-01` 绿；不再依赖数十秒自动动画）

- [ ] **Step 3: 全局测试索引登记（`docs/test-cases/`）**

按 `test-cases.md` 的全量清单，把本变更新增 Case 登记进 `index.md`（主索引）、`by-layer.md`（L3/L4/L5）、`by-module.md`（新增 `player` 模块组 + 归入 `viz-engine`/`article-sort`）：

- 新增 L3：`TC-PLAYER-01..10`（usePlayer）、`TC-BUBBLE-MOD-01..08`（buildSteps + sources）
- 新增 L4：`TC-VIZ-BAR-01..03`、`TC-VIZ-BARSVIEW-01..05`、`TC-VIZ-ARROWTRACK-02`、`TC-CODEPANEL-01..03`、`TC-VARPANEL-01..03`、`TC-TRANSPORT-01..09`、`TC-PLAYER-VIEW-01..02`
- **改写**（同 ID、新含义）：`TC-VIEW-BUBBLE-01/02` 标注「C-006 改写：断言 AlgorithmPlayer / 柱子数 / 默认第 0 步」
- **superseded**：`TC-E2E-BUBBLE-01`（自动动画升序）→ 由 `TC-E2E-PLAYER-01` 取代，旧行状态改 `superseded` 并双向链接

- [ ] **Step 4: 回填本计划四文档状态**

- `implementation.md`（本文件）：`Progress: 0%→100%`、`Next action: 已完成`、补「实际涉及文件 / 与设计偏差 / 踩坑 / 验证记录（含覆盖率实测）」
- `test-cases.md`：补「汇总统计」实测数字
- `requirements.md` / `design.md`：`Status: draft→verified`
- `docs/plans/index.md`：C-006 `状态 draft→verified`、`完成度 0%→100%`、`下一步 已完成`
- `docs/roadmap.md`：`M2 交互式播放器 状态 draft→done`；当前优先级指向 M3

- [ ] **Step 5: 最终全量门禁**

Run: `pnpm lint:check && pnpm format:check && pnpm type-check && pnpm test:unit run && pnpm coverage && pnpm test:e2e`
Expected: 全绿；覆盖率达本地门槛（lines/functions/statements ≥70%、branches ≥60%）

- [ ] **Step 6: 提交**

```bash
git add e2e/bubble-sort.e2e.ts docs/
git commit -m "test(player): e2e 改写为单步/跳末/重置 + 全局索引与四文档回填（C-006 verified）

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## 自检（计划 vs 设计/需求）

**Spec 覆盖：**

| 需求/设计点                                                        | 落点 Task                                               |
| ------------------------------------------------------------------ | ------------------------------------------------------- |
| 通用播放器框架（外壳/算法解耦）                                    | Task 1（契约+usePlayer）、Task 8（装配）                |
| 只读多语言代码视图 + 当前行高亮                                    | Task 5（Shiki+CodePanel）、Task 2（四语言源码+lineMap） |
| 传输控制（播放/暂停/单步/重置/速度/进度）                          | Task 7 + Task 1（状态机）                               |
| 变量面板                                                           | Task 6                                                  |
| 柱状条可视化（高度/数值/状态/FLIP/指针）                           | Task 4 + Task 3（ArrowTrack 参数化）                    |
| 默认暂停第 0 步                                                    | Task 1（`isPlaying=false`）、L4/L5 断言                 |
| 冒泡接入验证                                                       | Task 2 + Task 8                                         |
| 对现有测试影响（ALGO 绿 / BUBBLE 改写 / E2E 改写 / ARROWTRACK 绿） | Task 2/3/8/9                                            |

**占位扫描：** 无 TBD/TODO；每个改码步骤都带完整代码或完整测试。

**类型一致性：** `Step`/`LangSource`/`AlgorithmModule`/`ExecPoint`/`VarRow`/`Pointer` 在 Task 1 定义，Task 2/4/5/6/8 一致消费；`usePlayer` 返回字段（`index/isPlaying/atStart/atEnd/total/speed/current/progress` + 方法）在 Task 8 装配处与 Task 7 props/emits 对齐（`stepBack→stepBackward`、`setSpeed`、`seek`）。

## 实际涉及文件（执行后回填）

### 新建文件

| 文件                                              | 说明                             |
| ------------------------------------------------- | -------------------------------- |
| `src/components/player/types.ts`                  | 播放器契约（Task 1）             |
| `src/components/player/usePlayer.ts`              | 传输状态机（Task 1）             |
| `src/components/player/usePlayer.spec.ts`         | usePlayer L3 测试 10 case        |
| `src/algorithms/bubble-sort.sources.ts`           | 四语言源码 + lineMap（Task 2）   |
| `src/algorithms/bubble-sort.module.ts`            | buildSteps + module（Task 2）    |
| `src/algorithms/bubble-sort.module.spec.ts`       | L3 测试 8 case                   |
| `src/components/Bar.vue`                          | 柱状条组件（Task 4）             |
| `src/components/BarsView.vue`                     | 柱状条视图（Task 4）             |
| `src/components/Bar.spec.ts`                      | Bar L4 测试 3 case               |
| `src/components/BarsView.spec.ts`                 | BarsView L4 测试 5 case          |
| `src/components/player/useHighlighter.ts`         | Shiki 语法高亮适配器（Task 5）   |
| `src/components/player/CodePanel.vue`             | 代码面板（Task 5）               |
| `src/components/player/CodePanel.spec.ts`         | CodePanel L4 测试 3 case         |
| `src/components/player/VariablePanel.vue`         | 变量面板（Task 6）               |
| `src/components/player/VariablePanel.spec.ts`     | VariablePanel L4 测试 3 case     |
| `src/components/player/TransportControls.vue`     | 传输控制条（Task 7）             |
| `src/components/player/TransportControls.spec.ts` | TransportControls L4 测试 9 case |
| `src/components/player/AlgorithmPlayer.vue`       | 外壳装配（Task 8）               |
| `src/components/player/AlgorithmPlayer.spec.ts`   | AlgorithmPlayer L4 测试 2 case   |

### 修改文件

| 文件                                                 | 说明                               |
| ---------------------------------------------------- | ---------------------------------- |
| `src/components/ArrowTrack.vue`                      | 增加 slotWidth prop（Task 3）      |
| `src/components/ArrowTrack.spec.ts`                  | 加 TC-VIZ-ARROWTRACK-02            |
| `src/views/Article/SortAlgorithm/BubbleSort.vue`     | 改写为 AlgorithmPlayer（Task 8）   |
| `src/views/Article/SortAlgorithm/BubbleSort.spec.ts` | 改写 TC-VIEW-BUBBLE-01/02          |
| `e2e/bubble-sort.e2e.ts`                             | 改写为单步/跳末/重置（Task 9）     |
| `package.json` / `pnpm-lock.yaml`                    | 增加 shiki 依赖（Task 5）          |
| `eslint.config.ts`                                   | 加 .remember/\*\* 到 globalIgnores |
| `docs/test-cases/index.md`                           | 全局索引登记（Task 9）             |
| `docs/test-cases/by-layer.md`                        | 分层视图登记（Task 9）             |
| `docs/test-cases/by-module.md`                       | 模块视图登记（Task 9）             |
| `docs/plans/index.md`                                | C-006 状态更新（Task 9）           |
| `docs/roadmap.md`                                    | M2 done（Task 9）                  |

### 与设计偏差

- **`useHighlighter` 高亮器实现**：Task 5 初版图省事用了 Shiki 主包 `createHighlighter`（只加一个 `shiki` 直接依赖）。但**自有服务器部署时实测**：构建把内置约 300 门语法全部生成 chunk（cpp 626KB、emacs-lisp 779KB、wasm 622KB…，懒加载但 dist 臃肿，`dist/assets` 共 311 个 JS）。随后**优化为 `design.md` §4 原定的 `createHighlighterCore` 细粒度路径**（`shiki/core` + 显式 `import('@shikijs/langs/<lang>')`，`@shikijs/langs`/`@shikijs/themes` 提为直接依赖）：dist 资源 chunk **311 → 16**，只保留 `typescript/python/go/rust` 4 门；BubbleSort chunk 216KB→172KB。功能与门禁不变，e2e 真机着色断言（`TC-E2E-PLAYER-01`）仍绿。`design.md` §4 / `requirements.md` 已同步为细粒度方案。

### 踩坑

1. `.remember/tmp/last-ndc.ts` 被 ESLint 扫描到（该文件含纯数字，触发 `no-unused-expressions`）——在 `eslint.config.ts` 中追加 `**/.remember/**` 到 `globalIgnores` 解决。

## 验证记录（执行后回填）

### 单元测试（2026-06-19）

- 测试文件数：28
- 测试用例数：130
- 结果：全部通过（PASS）

### 覆盖率（2026-06-19）

| 指标   | 实际值 | 阈值 | 状态 |
| ------ | ------ | ---- | ---- |
| Stmts  | 81.76% | 70%  | 达标 |
| Branch | 83.17% | 60%  | 达标 |
| Funcs  | 84.15% | 70%  | 达标 |
| Lines  | 81.9%  | 70%  | 达标 |

备注：`useHighlighter.ts` 在所有单元测试中被 mock（Shiki 依赖 JS 引擎，不适合在 jsdom 环境运行），该文件覆盖率 0%。但全局覆盖率仍通过所有阈值。e2e 测试（TC-E2E-PLAYER-01）在真实浏览器中覆盖了 Shiki 路径。

### e2e（2026-06-19）

- TC-E2E-PLAYER-01（冒泡播放器：默认暂停/单步/跳末升序/重置）：PASS，耗时 600ms

### 门禁状态

| 门禁              | 结果 |
| ----------------- | ---- |
| pnpm lint:check   | 通过 |
| pnpm format:check | 通过 |
| pnpm type-check   | 通过 |
| pnpm test:unit    | 通过 |
| pnpm coverage     | 通过 |
| pnpm test:e2e     | 通过 |

### 视觉冒烟（controller 终验，2026-06-19）

最终 review 后在真机（`pnpm dev` + Playwright 截图逐步走查）发现 2 个自动化测试未覆盖的视觉缺陷，已修复并各补一条回归用例（commit `bf5f7af`）：

1. **指针箭头错位**：`BarsView` 内 `ArrowTrack` 轨道无显式宽度 → 塌缩为 0 宽并被居中，箭头从可视区中心起算、整体偏到中部。修复 = 给轨道显式宽度 `array.length × slotWidth`，与柱子行同左原点对齐；补 `BarsView.spec` 轨道宽度断言。
2. **变量面板 j / a[j] / a[j+1] 错位一格**：`buildSteps` 的 `vars` 误用第二指针索引（j+1）而非内层循环计数器 i。修复 = `vars(i)`；补 `bubble-sort.module.spec` 变量语义断言。

修复后门禁仍全绿：单测 **132**（+2 回归）、coverage Lines 81.96% / Branch 83.17% / Funcs 84.31% / Stmts 81.86%、e2e 3。

> 教训：纯函数 + 组件单测覆盖不到"像素对齐"与"生成步骤的变量语义"；可视化功能必须辅以真机视觉走查。
