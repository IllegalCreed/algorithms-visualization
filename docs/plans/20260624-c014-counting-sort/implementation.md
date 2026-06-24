# 实现：计数排序动画（TDD 任务分解 T1–T9）

> Status: approved
> Stable ID: C-20260624-014
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序（按依赖）

`T1 类型` → `T5 oracle` → `T7 四语言源码` → `T6 插桩 module` → `T2 BarsView dimFrom` → `T3 CountView` → `T4 外壳条件渲染` → `T8 视图+路由` → `T9 e2e`。每个任务铁律：先写失败测试 → 跑红 → 实现 → 跑绿。

---

## T1 — `types.ts` 类型扩展（纯加法）

```ts
export type CountingExecPoint = 'count' | 'bucketStart' | 'writeBack' | 'done';

/** 计数桶轨快照——计数排序专用，按「值」索引 */
export interface CountTrack {
  min: number; // 桶 0 对应的值；桶 b 对应值 b+min
  buckets: number[]; // buckets[v-min] = 值 v 当前计数；长度 = max-min+1
  activeBucket?: number; // 当前高亮桶下标(v-min)
}
```

`StepEmphasis` 增 `dimFrom?: number;`（连续后缀 `[dimFrom, n)` 淡出）；`Step` 增 `count?: CountTrack;`。**验证**：`pnpm type-check`。

---

## T5 — `counting-sort.ts` oracle（L3，先写测试）

**先写失败测试** `src/algorithms/counting-sort.spec.ts`（`TC-COUNT-ALGO-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { countingSortTrace } from './counting-sort';

const BASE = [3, 1, 4, 1, 6, 2, 3, 6, 4, 1];

describe('countingSortTrace', () => {
  it('TC-COUNT-ALGO-01 result 升序且与内置 sort 一致', () => {
    expect(countingSortTrace(BASE).result).toEqual([...BASE].sort((a, b) => a - b));
  });
  it('TC-COUNT-ALGO-02 counts/min/max 正确（含空桶=0）', () => {
    const t = countingSortTrace(BASE);
    expect(t.min).toBe(1);
    expect(t.max).toBe(6);
    expect(t.counts).toEqual([3, 1, 2, 2, 0, 2]);
  });
  it('TC-COUNT-ALGO-03 sum(counts) = n', () => {
    const t = countingSortTrace(BASE);
    expect(t.counts.reduce((a, b) => a + b, 0)).toBe(BASE.length);
  });
  it('TC-COUNT-ALGO-04 由 counts 按值域展开可重建 result', () => {
    const t = countingSortTrace(BASE);
    const rebuilt = t.counts.flatMap((c, b) => Array(c).fill(b + t.min));
    expect(rebuilt).toEqual(t.result);
  });
  it('TC-COUNT-ALGO-05 不修改入参', () => {
    const input = [3, 1, 2];
    countingSortTrace(input);
    expect(input).toEqual([3, 1, 2]);
  });
  it('TC-COUNT-ALGO-06 空 / 单元素', () => {
    expect(countingSortTrace([]).result).toEqual([]);
    expect(countingSortTrace([]).counts).toEqual([]);
    expect(countingSortTrace([5]).result).toEqual([5]);
    expect(countingSortTrace([5]).counts).toEqual([1]);
  });
  it('TC-COUNT-ALGO-07 重复 / 已序 / 逆序 / 全等值均升序', () => {
    for (const inp of [
      [2, 2, 1, 1, 3],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
      [4, 4, 4, 4],
    ])
      expect(countingSortTrace(inp).result).toEqual([...inp].sort((a, b) => a - b));
  });
});
```

**实现** `src/algorithms/counting-sort.ts`（见 design §7，纯函数不改入参）：

```ts
export interface CountingTrace {
  counts: number[];
  min: number;
  max: number;
  result: number[];
}

export function countingSortTrace(input: number[]): CountingTrace {
  if (input.length === 0) return { counts: [], min: 0, max: 0, result: [] };
  const min = Math.min(...input);
  const max = Math.max(...input);
  const counts = new Array(max - min + 1).fill(0);
  for (const x of input) counts[x - min]++;
  const result: number[] = [];
  for (let b = 0; b < counts.length; b++) for (let c = 0; c < counts[b]; c++) result.push(b + min);
  return { counts, min, max, result };
}
```

**验证**：`pnpm test:unit run src/algorithms/counting-sort.spec.ts`。

---

## T7 — `counting-sort.sources.ts` 四语言 + lineMap（L3）

四语言「简单计数 + 走桶回写」。完整源码（行号已对齐 lineMap，由 `TC-COUNT-MOD-14/15` 守护）：

**ts**（13 行）`count:4, bucketStart:6, writeBack:8, done:12`（`prettier-ignore` 保持 `const` 单行，物理行号 = lineMap）

<!-- prettier-ignore -->
```ts
function countingSort(a: number[]): number[] {
  const min = Math.min(...a), max = Math.max(...a);
  const count = new Array(max - min + 1).fill(0);
  for (let i = 0; i < a.length; i++) count[a[i] - min]++;
  let w = 0;
  for (let v = 0; v < count.length; v++) {
    while (count[v] > 0) {
      a[w++] = v + min;
      count[v]--;
    }
  }
  return a;
}
```

> 注：`sources.ts` 里 `code` 是字符串字面量、不受 prettier 重排，源码字符串内行号与 lineMap 一一对应（上方文档块用 `prettier-ignore` 同步保持单行 `const`，便于核对）。

**python**（13 行）`count:6, bucketStart:8, writeBack:10, done:13`

```python
def counting_sort(a):
    lo = min(a)
    hi = max(a)
    count = [0] * (hi - lo + 1)
    for x in a:
        count[x - lo] += 1
    w = 0
    for v in range(len(count)):
        while count[v] > 0:
            a[w] = v + lo
            w += 1
            count[v] -= 1
    return a
```

**go**（24 行）`count:13, bucketStart:16, writeBack:18, done:23`

```go
func countingSort(a []int) []int {
    lo, hi := a[0], a[0]
    for _, x := range a {
        if x < lo {
            lo = x
        }
        if x > hi {
            hi = x
        }
    }
    count := make([]int, hi-lo+1)
    for _, x := range a {
        count[x-lo]++
    }
    w := 0
    for v := 0; v < len(count); v++ {
        for count[v] > 0 {
            a[w] = v + lo
            w++
            count[v]--
        }
    }
    return a
}
```

**rust**（17 行）`count:6, bucketStart:9, writeBack:11, done:16`

```rust
fn counting_sort(mut a: Vec<i32>) -> Vec<i32> {
    let lo = *a.iter().min().unwrap();
    let hi = *a.iter().max().unwrap();
    let mut count = vec![0; (hi - lo + 1) as usize];
    for &x in a.iter() {
        count[(x - lo) as usize] += 1;
    }
    let mut w = 0;
    for v in 0..count.len() {
        while count[v] > 0 {
            a[w] = v as i32 + lo;
            w += 1;
            count[v] -= 1;
        }
    }
    a
}
```

`counting-sort.sources.ts` 导出 `countingSortSources: LangSource<CountingExecPoint>[]`（四项，每项 `{ lang, label, code, lineMap }`）。**测试**并入 T6 的 `sources` describe（`TC-COUNT-MOD-14..16`）。

---

## T6 — `counting-sort.module.ts` 插桩（L3，先写测试）

**先写失败测试** `src/algorithms/counting-sort.module.spec.ts`（`TC-COUNT-MOD-*`）：

```ts
import { describe, it, expect } from 'vitest';
import { countingSortTrace } from './counting-sort';
import { buildCountingSortSteps, countingSortModule } from './counting-sort.module';
import type { CountingExecPoint, Step } from '@/components/player/types';

const EXEC: CountingExecPoint[] = ['count', 'bucketStart', 'writeBack', 'done'];
const BASE = [3, 1, 4, 1, 6, 2, 3, 6, 4, 1];
const val = (s: Step<CountingExecPoint>) => s.array.map((t) => t[1]);

describe('buildCountingSortSteps', () => {
  it('TC-COUNT-MOD-01 空只产 done(sortedUpTo=0)；单元素末步 done 且升序', () => {
    const empty = buildCountingSortSteps([]);
    expect(empty.length).toBe(1);
    expect(empty[0].point).toBe('done');
    expect(empty[0].emphasis.sortedUpTo).toBe(0);
    const one = buildCountingSortSteps([5]);
    expect(one.at(-1)!.point).toBe('done');
    expect(val(one.at(-1)!)).toEqual([5]);
  });
  it('TC-COUNT-MOD-02 末步升序 = oracle result', () => {
    expect(val(buildCountingSortSteps(BASE).at(-1)!)).toEqual(countingSortTrace(BASE).result);
    expect(val(buildCountingSortSteps(BASE).at(-1)!)).toEqual([1, 1, 1, 2, 3, 3, 4, 4, 6, 6]);
  });
  it('TC-COUNT-MOD-03 每步 id 集合恒等于初始（FLIP）', () => {
    const all = buildCountingSortSteps(BASE);
    const init = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) expect(new Set(s.array.map((t) => t[0]))).toEqual(init);
  });
  it('TC-COUNT-MOD-04 不修改入参', () => {
    const input = [3, 1, 2];
    buildCountingSortSteps(input);
    expect(input).toEqual([3, 1, 2]);
  });
  it('TC-COUNT-MOD-05 每步 point 合法、带 count 快照', () => {
    for (const s of buildCountingSortSteps(BASE)) {
      expect(EXEC).toContain(s.point);
      expect(Array.isArray(s.count!.buckets)).toBe(true);
      expect(typeof s.count!.min).toBe('number');
    }
  });
  it('TC-COUNT-MOD-06 计数阶段末步桶快照 = oracle counts', () => {
    const steps = buildCountingSortSteps(BASE);
    const lastCount = steps.filter((s) => s.point === 'count').at(-1)!;
    expect(lastCount.count!.buckets).toEqual(countingSortTrace(BASE).counts);
    expect(lastCount.count!.buckets).toEqual([3, 1, 2, 2, 0, 2]);
  });
  it('TC-COUNT-MOD-07 count 步 activeBucket = a[i]-min（被增桶）', () => {
    const counts = buildCountingSortSteps(BASE).filter((s) => s.point === 'count');
    counts.forEach((s, i) => expect(s.count!.activeBucket).toBe(BASE[i] - 1));
  });
  it('TC-COUNT-MOD-08 回写 sortedUpTo 单调不减、done = n', () => {
    let prev = -1;
    for (const s of buildCountingSortSteps(BASE)) {
      if (s.emphasis.sortedUpTo !== undefined) {
        expect(s.emphasis.sortedUpTo).toBeGreaterThanOrEqual(prev);
        prev = s.emphasis.sortedUpTo;
      }
    }
    expect(buildCountingSortSteps(BASE).at(-1)!.emphasis.sortedUpTo).toBe(BASE.length);
  });
  it('TC-COUNT-MOD-09 每条 writeBack 当前桶余量较其 bucketStart 递减', () => {
    let lastByBucket = new Map<number, number>();
    for (const s of buildCountingSortSteps(BASE)) {
      if (s.point === 'writeBack') {
        const b = s.count!.activeBucket!;
        const cur = s.count!.buckets[b];
        if (lastByBucket.has(b)) expect(cur).toBeLessThan(lastByBucket.get(b)!);
        lastByBucket.set(b, cur);
      }
    }
  });
  it('TC-COUNT-MOD-10 空桶（值5）有 bucketStart 但其后无 writeBack', () => {
    const steps = buildCountingSortSteps(BASE);
    const idx = steps.findIndex((s) => s.point === 'bucketStart' && s.count!.activeBucket === 4);
    expect(idx).toBeGreaterThan(-1);
    expect(steps[idx + 1].point).not.toBe('writeBack'); // 下一步是 bucketStart 或 done
  });
  it('TC-COUNT-MOD-11 done 步 sortedUpTo=n、所有桶=0、无游标', () => {
    const d = buildCountingSortSteps(BASE).at(-1)!;
    expect(d.emphasis.sortedUpTo).toBe(BASE.length);
    expect(d.count!.buckets.every((c) => c === 0)).toBe(true);
    expect(d.pointers).toEqual([]);
  });
  it('TC-COUNT-MOD-12 count 步蓝读游标(id 1)；bucketStart/writeBack 绿写游标(id 3)', () => {
    for (const s of buildCountingSortSteps(BASE)) {
      if (s.point === 'count') expect(s.pointers[0]?.id).toBe('1');
      if (s.point === 'bucketStart' || s.point === 'writeBack') expect(s.pointers[0]?.id).toBe('3');
    }
  });
  it('TC-COUNT-MOD-13 writeBack 步 dimFrom = 写入位+1、活跃格不提前转绿', () => {
    for (const s of buildCountingSortSteps(BASE).filter((x) => x.point === 'writeBack')) {
      const w = s.pointers[0]!.index; // 刚写的活跃格 w-1
      expect(s.emphasis.sortedUpTo).toBe(w); // [0,w) 绿，活跃格 w 不含
      expect(s.emphasis.dimFrom).toBe(w + 1); // (w,n) 淡
    }
  });
});

describe('countingSortModule.sources', () => {
  it('TC-COUNT-MOD-14 四门语言齐备', () => {
    expect(countingSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });
  it('TC-COUNT-MOD-15 每门语言每个 point 行号在源码行范围内', () => {
    for (const src of countingSortModule.sources) {
      const lc = src.code.split('\n').length;
      for (const p of EXEC) {
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeLessThanOrEqual(lc);
      }
    }
  });
  it('TC-COUNT-MOD-16 实际出现的 point 都能映射到行', () => {
    const used = new Set(
      buildCountingSortSteps(countingSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of countingSortModule.sources)
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
  });
});
```

**实现** `src/algorithms/counting-sort.module.ts`（按 design §4 插桩）。骨架要点：

```ts
const DASH = '-';
export function buildCountingSortSteps(input: number[]): Step<CountingExecPoint>[] {
  const steps: Step<CountingExecPoint>[] = [];
  const work: [string, number][] = input.map((v, i) => [String(i), v]);
  const n = work.length;
  const snap = () => work.map((t) => [t[0], t[1]] as [string, number]);

  if (n === 0) {
    steps.push({
      array: [],
      pointers: [],
      emphasis: { sortedUpTo: 0 },
      vars: [
        { name: 'n', value: 0 },
        { name: '阶段', value: '完成' },
      ],
      point: 'done',
      count: { min: 0, buckets: [] },
      caption: '空数组，已完成',
    });
    return steps;
  }

  const min = Math.min(...work.map((t) => t[1]));
  const max = Math.max(...work.map((t) => t[1]));
  const k = max - min + 1;
  const buckets = new Array(k).fill(0);

  const vars = (phase: string, i: number | string, v: number | string, w: number | string) => [
    { name: 'n', value: n },
    { name: 'min', value: min },
    { name: 'max', value: max },
    { name: 'k', value: k },
    { name: '阶段', value: phase },
    { name: 'i', value: i },
    { name: 'v', value: v },
    { name: 'w', value: w },
  ];

  // 计数阶段
  for (let i = 0; i < n; i++) {
    const b = work[i][1] - min;
    buckets[b]++;
    steps.push({
      array: snap(),
      pointers: [{ id: '1', index: i }], // 蓝读游标
      emphasis: {}, // 主轨全 idle（计数零比较、不动数组）
      vars: vars('计数', i, DASH, DASH),
      point: 'count',
      count: { min, buckets: [...buckets], activeBucket: b },
      caption: `读 a[${i}]=${work[i][1]} → 桶「${work[i][1]}」+1（现 ${buckets[b]} 颗）`,
    });
  }

  // 回写阶段
  let w = 0;
  for (let b = 0; b < k; b++) {
    steps.push({
      array: snap(),
      pointers: [{ id: '3', index: w }], // 绿写游标停在下一写入位
      emphasis: { sortedUpTo: w, dimFrom: w },
      vars: vars('回写', DASH, b + min, w),
      point: 'bucketStart',
      count: { min, buckets: [...buckets], activeBucket: b },
      caption:
        buckets[b] > 0
          ? `走到桶「${b + min}」，里面有 ${buckets[b]} 颗 → 依次倒回数组`
          : `走到桶「${b + min}」，空桶（0 颗）→ 跳过`,
    });
    while (buckets[b] > 0) {
      work[w][1] = b + min;
      buckets[b]--;
      w++;
      steps.push({
        array: snap(),
        pointers: [{ id: '3', index: w - 1 }], // 写游标落在刚写的活跃格
        emphasis: { sortedUpTo: w - 1, dimFrom: w }, // 活跃格 w-1 不提前转绿
        vars: vars('回写', DASH, b + min, w),
        point: 'writeBack',
        count: { min, buckets: [...buckets], activeBucket: b },
        caption: `桶「${b + min}」倒出一颗 → a[${w - 1}]=${b + min}；桶「${b + min}」剩 ${buckets[b]} 颗`,
      });
    }
  }

  steps.push({
    array: snap(),
    pointers: [],
    emphasis: { sortedUpTo: n },
    vars: vars('完成', DASH, DASH, DASH),
    point: 'done',
    count: { min, buckets: [...buckets], activeBucket: undefined },
    caption: '回写完毕，全部有序',
  });
  return steps;
}

export const countingSortModule: AlgorithmModule<CountingExecPoint> = {
  title: '计数排序',
  initialInput: () => [3, 1, 4, 1, 6, 2, 3, 6, 4, 1],
  buildSteps: buildCountingSortSteps,
  sources: countingSortSources,
};
```

**验证**：`pnpm test:unit run src/algorithms/counting-sort.module.spec.ts`。

---

## T2 — `BarsView.vue` dimFrom 淡化分支（L4，先写测试）

**失败测试** `BarsView.spec.ts` 加 `TC-VIZ-BARSVIEW-21`（设 `dimFrom=3` → index≥3 的 Bar 进入 dimmed 态、index<3 不受影响）、`-22`（`dimFrom` 与 `sortedUpTo` 共存：`sortedUpTo=2, dimFrom=3` → [0,2) sorted、index2 idle、index≥3 dimmed）。

**实现**：`BarsView.vue` `stateOf` 在 `groupMembers` 淡化分支之后、`return 'idle'` 之前加：

```ts
if (e.dimFrom !== undefined && index >= e.dimFrom) return 'dimmed'; // 计数排序：回写尾部连续后缀淡出
```

**`Bar.vue` 不改**（复用既有 `dimmed`）。**验证**：`pnpm test:unit run src/components/BarsView.spec.ts`。

---

## T3 — `CountView.vue` 新组件（L4，先写测试）

**失败测试** `src/components/CountView.spec.ts`（`TC-VIZ-COUNTVIEW-*`）：

- `-01` 渲染桶数 = `count.buckets.length`（`.count-bucket`）。
- `-02` 每桶单元格数 = `buckets[b]`（`.count-cell`）。
- `-03` 桶底值标签 = `b + min`。
- `-04` `activeBucket` 桶带 `.active` 类，其余不带。
- `-05` 空桶（`buckets[b]===0`）渲染 0 个单元格、仍显值标签与计数 0。
- `-06` 桶顶计数数字 = `buckets[b]`。

**实现** `src/components/CountView.vue`：prop `count: CountTrack`。computed `bucketsView`（`buckets.map((c,b)=>({ value:b+min, count:c, active:activeBucket===b }))`）。模板：`.count-view` 行 `v-for` 桶 → 桶顶计数数字 + `.count-pit`（`column-reverse` 堆叠 `v-for(c in count) .count-cell`）+ `.count-val` 值标签；`:class="{ active }"`。样式取 design §5.2（萝卜橙单元格 + 内凹坑 + 活动桶高亮环），新拟物变量直接用（`common.less` 注入）。**验证**：`pnpm test:unit run src/components/CountView.spec.ts`。

---

## T4 — `AlgorithmPlayer.vue` 条件渲染（L4，先写测试）

**失败测试** `AlgorithmPlayer.spec.ts` 加 `TC-PLAYER-COUNT-01`（带 `count` 的桩 module → 渲染 CountView）、`-02`（不带 `count`（冒泡）→ 不渲染）、`-03`（带 `tree` 不带 `count` → 不渲染 CountView、渲染 TreeView）。

**实现**：在 `BarsView` 之下加 `<CountView v-if="current.count" :count="current.count" />` + import。**验证**：`pnpm test:unit run src/components/player/AlgorithmPlayer.spec.ts`。

---

## T8 — `CountingSort.vue` + 路由（L4，先写测试）

**失败测试** `src/views/Article/SortAlgorithm/CountingSort.spec.ts`（`TC-VIEW-COUNT-01/02`）：挂载渲染 `AlgorithmPlayer` + `countingSortModule`、默认停第 0 步、存在 `CountView`。

**实现**：`CountingSort.vue` 薄壳；`router/index.ts` 在 `heap-sort` 后加 `counting-sort` 路由。**验证**：`pnpm test:unit run src/views/Article/SortAlgorithm/CountingSort.spec.ts`。

---

## T9 — e2e（L5，Playwright）

`e2e/counting-sort.e2e.ts`（`TC-E2E-COUNT-01`）：导航 `/docs/counting-sort`、默认暂停第 0 步、计数桶轨 `.count-view` 可见、真机 Shiki、单步看计数填桶、拖到回写阶段看写游标领绿前缀 + 空桶跳过、拖末步主轨升序全绿、重置、四语言切换、视觉截图。**验证**：`pnpm exec playwright test e2e/counting-sort.e2e.ts`。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test`，全绿后回写三索引 + roadmap，提交 main。

## 自测报告（实现期回填）

- [x] T1 type-check 通过
- [x] T5 oracle 全绿（7 Case）
- [x] T7+T6 sources + module 全绿（16 Case，含四语言行号守护）
- [x] T2 BarsView dimFrom 全绿（21/22 红→绿，含 22 条既有 Case 回归）
- [x] T3 CountView 全绿（6 Case，含空桶/活动桶分支）
- [x] T4 AlgorithmPlayer 全绿（COUNT-01/02/03，含 AuxView/StackView/TreeView 回归）
- [x] T8 视图+路由全绿（2 Case）
- [x] T9 e2e 全绿（TC-E2E-COUNT-01：计数填桶 + 空桶 + 跳末升序全绿 + 重置；真机视觉复核写游标领绿前缀、无滞后）
- [x] 全门禁达标：type-check ✓ / lint:check ✓ / format:check ✓ / coverage All files 92.96%/93.31%/88.99%/92.93%（stmts/branch/funcs/lines，均超门槛）
- [x] 单测 355 passed（54 文件）+ e2e 10 passed；冒泡 / 选择 / 插入 / 希尔 / 归并 / 快速 / 堆全部现有 Case 零回归
