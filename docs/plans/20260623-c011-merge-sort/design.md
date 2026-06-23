# 设计：归并排序动画（接入算法播放器框架，首个双数组可视化）

> Status: verified
> Stable ID: C-20260623-011
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Progress: 100%
> Blocked by: none
> Next action: 已完成（37 Case 全绿，已落 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007、C-20260621-008、C-20260622-010
> Related tests: 见 §8「对现有测试的影响」
> Related requirement: requirements.md

## 总体方案

**复用 C-006 播放器框架 + C-010 的 `groupMembers`/`dimmed` 分组淡化，主轨可视化（`BarsView`）零改动；归并的「第二条数据轨」靠新增一个 `AuxView` + 一处外壳条件渲染表达。** 框架与算法的契约仍是预计算的「胖步骤」`Step[]`：归并排序实现一个 `AlgorithmModule`，外壳按 `index` 回放，单步 / 暂停 / 后退 / 拖动全是「移动下标」——交互模型一字不改。

两条关键链路：

1. **主轨完全复用希尔机制**：合并段 `[lo,hi)` 的全部下标进 `groupMembers` → 段外自动 `dimmed`，`BarsView.stateOf` **一行不改**；`compare` 用 `comparing:[i,j]` 标黄；`writeBack` 让段内元素（稳定 id）FLIP 平移重排。主轨 `emphasis` **不需要任何新字段**。
2. **辅助轨是唯一的新可视化**：`Step` 增可选 `aux?: AuxTrack`；`AlgorithmPlayer` 在主轨下 `v-if="current.aux"` 渲染新组件 `AuxView`（temp 槽逐格点亮 + `k` 指针）。前四个算法 `aux` 恒 `undefined`，`AuxView` 不渲染——**零回归**。

复用矩阵：

| 件                                                             | 角色                           | 归并排序如何对待                                                    |
| -------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `usePlayer.ts` / `TransportControls.vue` / `VariablePanel.vue` | 传输状态机 + 控制条 + 变量面板 | **零改动**，原样复用                                                |
| `CodePanel.vue`                                                | 多语言 Shiki 高亮 + 当前行     | **零改动**（`point: string` 已由 C-007 放宽）                       |
| `BarsView.vue`                                                 | 主柱状可视化                   | **零改动**（合并段聚焦/淡化复用 C-010 的 `groupMembers`→`dimmed`）  |
| `ArrowTrack.vue` / `Arrow.vue`                                 | 雪佛龙指针                     | **零改动**，主轨两指针 `colors[0/1]`、辅助轨 `k` 用 `colors[2]`     |
| `Bar.vue`                                                      | 单柱渲染                       | 加 `'empty'` 态 + `.bar.empty` 虚框（纯加法）                       |
| `AlgorithmPlayer.vue`                                          | 装配壳                         | **唯一外壳改动**：主轨下加一行 `<AuxView v-if="current.aux" …/>`    |
| `types.ts`                                                     | 数据契约                       | 加 `MergeExecPoint` + `AuxTrack` + `Step.aux?`（纯加法）            |
| **`AuxView.vue`**                                              | **辅助数组轨（新）**           | **新增**：temp 槽（已填/空）+ `k` 指针，内部复用 `Bar`/`ArrowTrack` |

归并排序新增的，只有 `src/algorithms/merge-sort.*` 三件 + `AuxView.vue` + `MergeSort.vue` 薄壳 + 一条路由；改动的只有 `Bar.vue`（加态）、`types.ts`（加类型）、`AlgorithmPlayer.vue`（加一行）。

## 1. 数据契约扩展（`src/components/player/types.ts`）— 纯加法

```ts
/** 归并排序的执行点（自底向上：width 倍增 → 逐对合并 → 比较取小写 temp → 收尾 drain → 拷回） */
export type MergeExecPoint =
  | 'widthChange' // 进入新一轮，width ×2
  | 'mergeStart' // 开始合并一对相邻段 [lo,mid)+[mid,hi)，i=lo j=mid k=lo
  | 'compare' // 比较 a[i] 与 a[j]
  | 'takeLeft' // a[i] <= a[j]，取左写入 temp[k]
  | 'takeRight' // a[i] > a[j]，取右写入 temp[k]
  | 'drainLeft' // 右段已空，把左段剩余逐个搬进 temp
  | 'drainRight' // 左段已空，把右段剩余逐个搬进 temp
  | 'writeBack' // temp[lo,hi) 整段拷回原数组（主轨该段 FLIP 重排）
  | 'done';

/** 辅助数组轨（temp）快照——归并排序专用，与主轨等长、上下对齐 */
export interface AuxTrack {
  array: [string, number][]; // 定长 = 主轨长度；位置 id 't0'..'t{n-1}'（稳定渲染，不重排）
  filled: number[]; // 已写入的下标集；不在其中 → empty 空槽（虚框）
  pointer?: number; // k 写入位（辅助轨指针，ArrowTrack 取 colors[2]=yellow）
  activeRange?: [number, number]; // 当前合并段 [lo, hi)（语义/测试用）
}

export interface Step<P extends string = string> {
  array: [string, number][];
  pointers: Pointer[];
  emphasis: StepEmphasis;
  vars: VarRow[];
  point: P;
  caption?: string;
  aux?: AuxTrack; // 纯加法：归并的辅助轨；其它算法不设 → AuxView 不渲染
}
```

**`StepEmphasis` 不动**——主轨「聚焦当前合并段」复用 C-010 已有的 `groupMembers`，不新增字段。

**为什么零风险**：`MergeExecPoint`（`⊆ string`）与既有协变契约自洽；`AuxTrack` 是全新独立类型；`Step.aux?` 是**可选**字段，冒泡/选择/插入/希尔的步骤都不设它，其值恒 `undefined`，`AlgorithmPlayer` 的 `v-if` 短路、`AuxView` 不渲染。`MergeSort.vue` 传 `mergeSortModule: AlgorithmModule<MergeExecPoint>` 给 `module: AlgorithmModule`（默认 `P=string`）成立。

## 2. 目录与文件

```
src/algorithms/
  merge-sort.ts            ← 新增：纯算法 oracle（自底向上，返回每趟 width 后快照）
  merge-sort.module.ts     ← 新增：插桩重走 + buildSteps + mergeSortModule（每步带 aux）
  merge-sort.sources.ts    ← 新增：四语言自底向上源码 + lineMap
  bubble-sort.* / selection-sort.* / insertion-sort.* / shell-sort.*  ← 不动

src/components/
  Bar.vue                  ← 改：state 加 'empty' + .bar.empty 虚框；empty 时不显示数值
  AuxView.vue              ← 新增：辅助数组轨（temp 槽 + k 指针）
  BarsView.vue             ← 不动
  player/types.ts          ← 改：加 MergeExecPoint + AuxTrack + Step.aux?
  player/AlgorithmPlayer.vue ← 改：主轨下加 <AuxView v-if="current.aux" …/>

src/views/Article/SortAlgorithm/
  MergeSort.vue            ← 新增：<AlgorithmPlayer :module="mergeSortModule" />

src/router/index.ts        ← 改：新增 merge-sort 懒加载路由
```

菜单（`Docs/Menu/hooks.ts:64-66`）与首页网格（`Home/Main/hooks.ts:102-107`）已含 `merge-sort` 条目与 `merge.svg` 图标，**无需改动**。

## 3. 归并排序算法模块

### 执行点语义与强调

| ExecPoint     | 含义                                              | 主轨 emphasis / 指针                                | 辅助轨 aux                                                   |
| ------------- | ------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `widthChange` | 进入新一轮 `width`（×2），caption `width=X`       | **不设** `groupMembers`（全亮）                     | 整排 `empty`（`filled=[]`，无 `activeRange`/`pointer`）      |
| `mergeStart`  | 开始合并 `[lo,mid)+[mid,hi)`；`i=lo,j=mid,k=lo`   | `groupMembers=[lo..hi)`；红=`lo` 蓝=`mid`           | `activeRange=[lo,hi)`，`filled=[]`，`pointer=lo`（该段清空） |
| `compare`     | 比较 `a[i]` 与 `a[j]`                             | `comparing:[i,j]`，`groupMembers`                   | `filled` 当前，`pointer=k`                                   |
| `takeLeft`    | `a[i] ≤ a[j]`，`temp[k]=a[i]`，`i++,k++`          | `groupMembers`；红 `i` 前进                         | `filled += 原k`，`pointer=新k`                               |
| `takeRight`   | `a[i] > a[j]`，`temp[k]=a[j]`，`j++,k++`          | `groupMembers`；蓝 `j` 前进                         | `filled += 原k`，`pointer=新k`                               |
| `drainLeft`   | 右段已空，`temp[k]=a[i]`，`i++,k++`               | `groupMembers`                                      | `filled += 原k`，`pointer=新k`                               |
| `drainRight`  | 左段已空，`temp[k]=a[j]`，`j++,k++`               | `groupMembers`                                      | `filled += 原k`，`pointer=新k`                               |
| `writeBack`   | `temp[lo,hi)` 拷回 `a[lo,hi)`；主轨该段 FLIP 重排 | `groupMembers`；段内元素按合并序重排                | `activeRange=[lo,hi)`，`filled=[lo..hi)`（满）               |
| `done`        | 排序完成                                          | `sortedFrom:0`（全 `sorted` 绿），清 `groupMembers` | 整排 `empty`                                                 |

### `buildSteps` 骨架（插桩重走自底向上归并，逐行粒度）

```
work = input.map((v, i) => [String(i), v])          // 主轨，稳定原 id
n = work.length
tempArr: ([string,number] | undefined)[] 长度 n      // 内部 temp：存「带原 id」的元素，供 writeBack
writeCount = 0
两指针 id：'0'=i(红，左段游标) '1'=j(蓝，右段游标)；辅助轨 k 用 id '2'(黄)

// 每步的 aux 快照：array 用「位置 id」't'+idx（稳定渲染），value 取 tempArr[idx]?.[1] ?? 0
auxSnap(filled, lo?, hi?, k?) =>
  { array: Array.from({length:n}, (_,idx)=> ['t'+idx, tempArr[idx]?.[1] ?? 0]),
    filled: [...filled], activeRange: lo!==undefined ? [lo,hi] : undefined, pointer: k }

vars = [n, width, lo, mid, hi, i, j, k, a[i], a[j], writeCount]   // 未进入对时 lo/mid/hi/i/j/k = '-'
每个 push 带 emphasis + aux + caption；指针越界一律 clampIdx 到 [0, n-1]

if n <= 1: push('done', emphasis={sortedFrom:0}, aux=空轨, '完成'); return

for (width = 1; width < n; width *= 2):
  push('widthChange', emphasis={}, aux=空轨, `width=${width}：合并相邻 ${width} 元素段`)
  for (lo = 0; lo < n; lo += 2*width):
    mid = min(lo + width, n)
    hi  = min(lo + 2*width, n)
    if (mid >= hi) continue            // 残段（无右段），本轮无需合并，留到更大 width
    members = [lo, lo+1, …, hi-1]
    i = lo; j = mid; k = lo
    清空 tempArr[lo..hi)                // 该段重新开始收集
    filled = []
    push('mergeStart', emphasis={groupMembers:members}, aux=auxSnap(filled, lo, hi, k),
         `合并 [${lo},${mid}) 与 [${mid},${hi})`)
    while (i < mid && j < hi):
      push('compare', emphasis={comparing:[i,j], groupMembers:members}, aux=auxSnap(filled,lo,hi,k),
           `a[${i}]=${work[i][1]} ${work[i][1] <= work[j][1] ? '≤' : '>'} a[${j}]=${work[j][1]}`)
      if (work[i][1] <= work[j][1]):
        tempArr[k] = work[i]; filled.push(k); writeCount++
        push('takeLeft', emphasis={groupMembers:members}, aux=auxSnap(filled,lo,hi,k+1),
             `取左 ${work[i][1]} → temp[${k}]`)
        i++; k++
      else:
        tempArr[k] = work[j]; filled.push(k); writeCount++
        push('takeRight', emphasis={groupMembers:members}, aux=auxSnap(filled,lo,hi,k+1),
             `取右 ${work[j][1]} → temp[${k}]`)
        j++; k++
    while (i < mid):                    // 右段已空
      tempArr[k] = work[i]; filled.push(k); writeCount++
      push('drainLeft', …, `左段剩余 ${work[i][1]} → temp[${k}]`); i++; k++
    while (j < hi):                     // 左段已空
      tempArr[k] = work[j]; filled.push(k); writeCount++
      push('drainRight', …, `右段剩余 ${work[j][1]} → temp[${k}]`); j++; k++
    for (t = lo; t < hi; t++): work[t] = tempArr[t]    // 拷回（元素带原 id 跟着值走 → FLIP）
    push('writeBack', emphasis={groupMembers:members}, aux=auxSnap(filled, lo, hi),
         `temp[${lo},${hi}) 拷回原数组`)
push('done', emphasis={sortedFrom:0}, aux=空轨, '完成，全部有序')
```

- **主轨 FLIP 的关键**：`tempArr[k] = work[i]`（**引用同一个 `[id,value]` 元素**），`writeBack` 时 `work[t] = tempArr[t]`——元素带着**原 id** 落到新位置。`work` 在 `[lo,hi)` 内重排，id 集合不变，`<TransitionGroup>` 据 id 产生平移：左右两段的柱子同时滑到合并后的位置。这是「合并」动画的核心。
- **辅助轨 vs 主轨 id 解耦**：`aux.array` 用**位置 id** `'t'+idx`（每槽固定，`AuxView` 渲染稳定、无误判重排）；`tempArr`（内部）用**原 id** 元素供 `writeBack`。二者分离，互不干扰。
- **残段处理**：`mid >= hi`（`min` 截断后右段为空）时 `continue`——该段已是本轮结果，留到更大 `width`。这是自底向上对非 2 的幂长度的自然处理。
- **id 集合每步恒定**：`takeLeft/takeRight/drain` 只写 `tempArr`（不动 `work`）；`writeBack` 在 `[lo,hi)` 内重排 `work`、无增删。满足「每步主轨 id 集合 = 初始」断言，FLIP 前提成立。
- **防漂移**：`merge-sort.ts`（oracle）与 `buildSteps`（插桩）是同一自底向上归并的两份实现；L3 用 oracle 末态**交叉校验** `buildSteps` 末步，并断言每趟 `width` 后各 `2*width` 段内有序。

```ts
export const mergeSortModule: AlgorithmModule<MergeExecPoint> = {
  title: '归并排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入/希尔同款，便于横向对比
  buildSteps: buildMergeSortSteps,
  sources: mergeSortSources,
};
```

### 初始数据验算（`[7,6,5,10,9,8,4,3,2,1]`，n=10 → width=1,2,4,8）

| 轮      | 入                       | 出（本轮各对合并后）       | 对数（合并 / 跳过残段）                      |
| ------- | ------------------------ | -------------------------- | -------------------------------------------- |
| width=1 | `[7,6,5,10,9,8,4,3,2,1]` | `[6,7,5,10,8,9,3,4,1,2]`   | 5 对：(0,1)(2,3)(4,5)(6,7)(8,9)              |
| width=2 | `[6,7,5,10,8,9,3,4,1,2]` | `[5,6,7,10,3,4,8,9,1,2]`   | 2 对：(0..4)(4..8)；残段 `[8,10)=[1,2]` 跳过 |
| width=4 | `[5,6,7,10,3,4,8,9,1,2]` | `[3,4,5,6,7,8,9,10,1,2]`   | 1 对：(0..8)；残段 `[8,10)=[1,2]` 跳过       |
| width=8 | `[3,4,5,6,7,8,9,10,1,2]` | `[1,2,3,4,5,6,7,8,9,10]` ✓ | 1 对：(0..8)+(8..10) → 全段合并              |

末轮 `width=8` 把一直「残守」到最后的 `[1,2]` 与前 8 个有序段做一次大合并归位——直观体现自底向上「段宽倍增、残段延后、最终全合并」。`width` 序列 `1,2,4,8`（`8 < 10` 进、`16 ≥ 10` 停）。这组数据将作为 `TC-MERGE-MOD-*` 的交叉校验夹具。

## 4. 四语言源码 + `lineMap`（`merge-sort.sources.ts`）

四份等价的**自底向上**归并排序（TS / Python / Go / Rust），每份配一张 `lineMap: Record<MergeExecPoint, number>`。TS 示意：

```ts
const ts = `function mergeSort(a: number[]): number[] {
  const n = a.length;
  const temp = new Array(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      let i = lo, j = mid, k = lo;
      while (i < mid && j < hi) {
        if (a[i] <= a[j]) {
          temp[k++] = a[i++];
        } else {
          temp[k++] = a[j++];
        }
      }
      while (i < mid) temp[k++] = a[i++];
      while (j < hi) temp[k++] = a[j++];
      for (let t = lo; t < hi; t++) a[t] = temp[t];
    }
  }
  return a;
}`;
// lineMap(TS): widthChange:4, mergeStart:5, compare:10, takeLeft:11, takeRight:13,
//              drainLeft:16, drainRight:17, writeBack:18, done:21
```

各语言行号（同构，缩进 / 语法差异致行号不同，均已核对）：

| Lang   | widthChange | mergeStart | compare | takeLeft | takeRight | drainLeft | drainRight | writeBack | done |
| ------ | ----------- | ---------- | ------- | -------- | --------- | --------- | ---------- | --------- | ---- |
| ts     | 4           | 5          | 10      | 11       | 13        | 16        | 17         | 18        | 21   |
| python | 5           | 6          | 11      | 12       | 14        | 17        | 19         | 21        | 23   |
| go     | 4           | 5          | 10      | 11       | 14        | 20        | 25         | 30        | 34   |
| rust   | 5           | 7          | 12      | 13       | 16        | 22        | 27         | 32        | 38   |

- **Python**：`width` 循环用 `while width < n:`（`width *= 2` 在体末），`widthChange` 落 `while` 行；`done` 落 `return a`。`take*` 把 `i += 1`/`j += 1` 与赋值同行、`k += 1` 提到分支外（第 15 行）。
- **Go**：用内置 `min`；`take*`/`drain*` 把自增拆成独立行，故行号比 TS 拉开（`drainRight:25`、`writeBack:30`、`done:34`）。
- **Rust**：`lo` 循环用 `while lo < n {`（无 C 式 for），`mergeStart` 落第 7 行；`i,j,k` 为 `usize`，循环条件 `i < mid && j < hi`、`i < mid`、`j < hi` 保证 `temp[k]`/`a[i]`/`a[j]` 不越界，**无下溢**；`done` 无 `return`，落最后的 `}`（第 38 行）。
- 行号正确性由 L3 兜底（每个 `MergeExecPoint` 行号 ∈ `[1, 行数]`，且实际出现的 point 都能映射）。

## 5. 可视化扩展

### `Bar.vue` — 加 `empty` 态（纯加法）

```ts
state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' | 'dimmed' | 'empty'; // 加 'empty'
```

```vue
<!-- 模板：empty 槽不显示数值（保留占位高度） -->
<span class="val">{{ state === 'empty' ? ' ' : value }}</span>
```

```less
.bar.empty {
  background-color: transparent;
  border: 2px dashed fade(@font-color, 35%);
  box-shadow: none; /* 覆盖 .neumorphism-flat 浮起，呈「待填空槽」 */
}
```

现有 `TC-VIZ-BAR-*`（state 决定 class）不受影响——只是多一个合法取值；主轨 `BarsView.stateOf` **不返回** `empty`，`empty` 仅由 `AuxView` 使用。

### `AuxView.vue` — 辅助数组轨（新增）

```vue
<!-- src/components/AuxView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { AuxTrack } from '@/components/player/types';
import ArrowTrackComp from './ArrowTrack.vue';
import BarComp from './Bar.vue';

const props = withDefaults(
  defineProps<{
    aux: AuxTrack;
    mainArray: [string, number][]; // 用主轨 min/max 算 percent，两轨同尺度可比
    slotWidth?: number;
  }>(),
  { slotWidth: 60 },
);

const min = computed(() => Math.min(...props.mainArray.map((t) => t[1])));
const max = computed(() => Math.max(...props.mainArray.map((t) => t[1])));
const vizWidth = computed(() => props.aux.array.length * props.slotWidth);
const filledSet = computed(() => new Set(props.aux.filled));
const pointers = computed(() =>
  props.aux.pointer === undefined ? [] : [{ id: '2', index: props.aux.pointer }],
);

function percent(v: number): number {
  const span = max.value - min.value;
  if (span === 0) return 1;
  return 0.08 + 0.92 * ((v - min.value) / span);
}
function stateOf(index: number): 'sorted' | 'empty' {
  return filledSet.value.has(index) ? 'sorted' : 'empty';
}
</script>
<template>
  <div class="aux-view column center">
    <div class="row bars">
      <BarComp
        v-for="(item, index) in props.aux.array"
        :key="item[0]"
        :value="item[1]"
        :percent="stateOf(index) === 'empty' ? 0 : percent(item[1])"
        :state="stateOf(index)"
        :style="{ width: props.slotWidth + 'px' }"
      />
    </div>
    <ArrowTrackComp
      :data="pointers"
      :slot-width="props.slotWidth"
      :style="{ width: vizWidth + 'px' }"
    />
  </div>
</template>
<style scoped lang="less">
.bars {
  align-items: flex-end;
  min-height: 180px;
}
</style>
```

- **不用 `<TransitionGroup>`**：`temp` 只「填」不「重排」，普通 `v-for` + 位置 id 即可，无需 FLIP（避免与主轨 FLIP 语义混淆）。
- 已填槽 → `sorted` 绿（语义：已产出的有序部分）；未填槽 → `empty` 虚框（`percent=0` → 最矮）；`k` 指针 `colors[2]` 黄。
- `percent` 以**主轨** min/max 为基准，保证 temp 柱高与主轨同尺度，上下对照真实。

### `AlgorithmPlayer.vue` — 唯一外壳改动（向后兼容）

```vue
<BarsView :array="current.array" :pointers="current.pointers" :emphasis="current.emphasis" />
<AuxView v-if="current.aux" :aux="current.aux" :main-array="current.array" />
<!-- 新增 -->
<p class="caption">{{ current.caption }}</p>
```

外加 `import AuxView from '@/components/AuxView.vue'`。前四个算法 `current.aux === undefined`，`v-if` 短路、不渲染——`AlgorithmPlayer.spec.ts` 加「无 `aux` 不渲染 `AuxView`／有 `aux` 渲染」两 Case 锁死向后兼容。

### 指针配色分层

主轨 `pointers=[{id:'0',index:i},{id:'1',index:j}]` → 红 `i`（左段游标）/ 蓝 `j`（右段游标）；辅助轨 `k` → `colors[2]` 黄。沿用既定「**箭头标位置、柱子标状态**」双系统——黄箭头（`k`，辅助轨）与黄柱（`comparing`，主轨）分处两轨、语义不混。

## 6. 接入

`MergeSort.vue`：

```vue
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { mergeSortModule } from '@/algorithms/merge-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="mergeSortModule" />
</template>
```

`src/router/index.ts` 在 `shell-sort` 之后加：

```ts
{
  path: '/docs/merge-sort',
  name: 'merge-sort',
  component: () => import('../views/Article/SortAlgorithm/MergeSort.vue'),
},
```

## 7. 变量面板

`vars = [n, width, lo, mid, hi, i, j, k, a[i], a[j], writeCount]`。`widthChange`/`done` 帧未进入任何合并对，`lo/mid/hi/i/j/k` 显示 `'-'`；`a[i]`/`a[j]` 用 `work[i]?.[1] ?? '-'`（`drain` 阶段一侧越界显示 `'-'`）。沿用 `VariablePanel` 的「变化高亮」（与上一步比对），零改动。

## 8. 对现有测试的影响

**本变更不 supersede 任何现有 Case**——全是新增 + 向后兼容加法。

| 现有件                                                                                            | 改动                                              | 影响             |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------- |
| `bubble/selection/insertion/shell-sort.module.spec.ts`                                            | 不动                                              | **零影响**，全绿 |
| `Bar.spec.ts`（`TC-VIZ-BAR-*`）                                                                   | `state` 多一个合法值 `'empty'`                    | **零影响**，全绿 |
| `BarsView.spec.ts`（`TC-VIZ-BARSVIEW-*`）                                                         | **不动**（主轨 `stateOf` 不返回 `empty`）         | **零影响**，全绿 |
| `AlgorithmPlayer.spec.ts`（`TC-PLAYER-*`）                                                        | 加「无 `aux` 不渲染 `AuxView`」Case；旧 Case 不变 | **零影响**，全绿 |
| `CodePanel.spec.ts` / `usePlayer.spec.ts` / `TransportControls.spec.ts` / `VariablePanel.spec.ts` | 不动                                              | **零影响**，全绿 |

新增 Case 详单见 `test-cases.md`（writing-plans / 实现阶段产出）：L3 归并 oracle（升序 / 空 / 单元素 / 已序 / 逆序 / 重复 / `width` 序列 / 各趟快照）+ 归并 module（交叉校验 + 归并不变量：每趟 `width` 后各段有序、末步全序、id 恒定、`mergeStart` 的 `groupMembers`/`activeRange`=`[lo,hi)`、`aux.filled` 单调增、`takeLeft`/`takeRight` 后 temp 对应位 = 较小值、`writeBack` 后主轨段升序、指针 clamp、四语言 lineMap 全覆盖）；L4 `Bar` 的 `empty` 态 + `AuxView`（空槽/已填/`k` 指针/同尺度 percent）+ `AlgorithmPlayer` 有/无 `aux` 渲染 + 归并视图；L5 端到端。

## 9. 推进顺序（建议，TDD 友好）

① `types.ts` 加 `MergeExecPoint` + `AuxTrack` + `Step.aux?`（先跑全量回归，证向后兼容）→ ② `Bar.vue` 加 `empty` 态（L4，`Bar.spec` 加 Case）→ ③ `AuxView.vue` 新增（L4 全套：空槽/已填/`k`/同尺度）→ ④ `AlgorithmPlayer.vue` 加条件渲染（L4，「有/无 `aux`」+ 前四算法回归）→ ⑤ `merge-sort.ts` oracle（L3，含空 / 单 / 已序 / 逆序 / 重复 / `width` 序列 / 各趟快照）→ ⑥ `merge-sort.sources.ts` 四语言 + `lineMap`（L3 行号校验）→ ⑦ `merge-sort.module.ts` `buildSteps`（L3，交叉校验 + 归并不变量 + `aux` 单调）→ ⑧ `MergeSort.vue` + 路由 + 视图 L4 → ⑨ L5 端到端 → ⑩ 三索引 + roadmap 回写。每步以 `type-check` + 对应测试绿为关卡；①②③④额外以**「冒泡 + 选择 + 插入 + 希尔全量回归绿、且四者页面不渲染 `AuxView`」**为硬关卡。

## 10. 风险与回滚

- **外壳条件渲染写错**：`v-if="current.aux"` 若误成恒真 / 漏判，会让前四算法渲染空 `AuxView` 或归并漏渲染。L4「无 `aux` 不渲染、有 `aux` 渲染」专测兜底。这是本次唯一的外壳风险点，必须以前四算法回归绿锁死。
- **`writeBack` 的 id 漂移**：拷回必须 `work[t] = tempArr[t]`（`tempArr` 存**原 id** 元素），写成「按值新建元素」会改变 id 集合、FLIP 错乱。L3「每步主轨 id 集合恒等初始」+「末步与 oracle 交叉校验」兜底。
- **辅助轨 id 误用**：`aux.array` 必须用**位置 id** `'t'+idx`（稳定），误用原 id 会让 `AuxView` 在填入时误判重排、key 警告。`AuxView` 不用 `TransitionGroup`，进一步规避。
- **残段处理**：`mid >= hi` 必须 `continue`；漏判会重复合并 / 越界，写成 `mid > hi` 会漏掉边界。L3「各趟 `width` 快照与 oracle 一致」+ 末步交叉校验兜底。
- **`empty` 态外溢到主轨**：`empty` 仅供 `AuxView`；主轨 `BarsView.stateOf` 不得返回 `empty`（不改它即可保证）。
- **Rust `usize` 边界**：`i/j/k` 由 `lo/mid` 推得（`usize`），循环条件保证不下溢、不越界；源码为静态字符串、不参与运行，靠人工 + L3 行号校验把关。
- **`lineMap` 与源码漂移**：源码一改、行号即错。L3 校验「每个 `MergeExecPoint` 行号合法」兜底；`lineMap` 与 `code` 同文件相邻。
- **步骤数偏多**：自底向上 + 双轨快照，`n=10` 步数比希尔略多，但仍 `O(n log n)` 量级；`usePlayer` 按 `index` 回放，无性能 / 竞态问题。
- **改动隔离 / 回滚**：算法三件 + `AuxView.vue` + `MergeSort.vue` + 路由是纯新增，可独立删除；`Bar`/`types`/`AlgorithmPlayer` 的扩展均为加法，前四算法路径不变。回滚仅需还原三处加法 + 删新增文件。
