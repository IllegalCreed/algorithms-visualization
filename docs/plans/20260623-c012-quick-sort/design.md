# 设计：快速排序动画（Lomuto + 显式区间栈 + StackView 双轨）

> Status: verified
> Stable ID: C-20260623-012
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

复用 C-006 算法播放器全部外壳，新增「区间栈轨」作为继归并 `AuxView` 之后的第二条可视化轨。数据流与前五个算法一致：

```
quickSortModule.initialInput()  →  [7,6,5,10,9,8,4,3,2,1]
            │
            ▼
quickSortModule.buildSteps(input)  →  Step<QuickExecPoint>[]   （插桩重走 Lomuto+显式栈，每步带 stack 快照）
            │
            ▼
usePlayer(steps)  →  index / current / play / pause / step* / seek / reset   （零改动，按 index 回放）
            │
            ▼
AlgorithmPlayer  ┌─ BarsView   (主轨：groupMembers/dimmed + pivot + sortedIndices + i/j 箭头)
                 ├─ StackView  (新轨：current.stack 为真才渲染——区间栈水平条)   ← 唯一外壳新增
                 ├─ CodePanel  (四语言源码 + lineMap[current.point] 行高亮，零改动)
                 ├─ VariablePanel (current.vars 逐行，零改动)
                 └─ TransportControls (零改动)
```

**唯一外壳改动**：`AlgorithmPlayer.vue` 在 `<AuxView v-if="current.aux">` 旁并列加一行 `<StackView v-if="current.stack">`。其余全是 `src/algorithms/` 下的新文件 + `types.ts`/`Bar.vue`/`BarsView.vue` 的纯加法。

## 2. 数据契约（`types.ts` 扩展，全部向后兼容加法）

```ts
/** 快速排序的执行点（Lomuto + 显式区间栈） */
export type QuickExecPoint =
  | 'pop' // 从区间栈弹出一个待处理区间 [lo,hi]
  | 'pivotSelect' // 选定 pivot = a[hi]（品红点亮）
  | 'compare' // 比较 a[j] 与 pivot
  | 'swap' // a[j] < pivot：swap(a[i],a[j]); i++（扩张小于区）
  | 'noSwap' // a[j] >= pivot：不交换，继续扫描
  | 'pivotPlace' // 扫描完：swap(a[i],a[hi]) → pivot 一步飞到最终位置 i
  | 'push' // 把子区间压回栈（先右后左）；单元素直接就位
  | 'done'; // 栈空，全部有序

/** 区间栈轨快照——快排专用，与主轨同 slotWidth 坐标系对齐 */
export interface StackTrack {
  frames: { lo: number; hi: number }[]; // 栈内待处理区间；frames[0]=栈底，frames[last]=栈顶
  popped?: { lo: number; hi: number }; // 本步刚弹出/正在处理的区间（高亮，pop 步用）
}
```

`StepEmphasis` 增两个可选字段（不动现有字段）：

```ts
export interface StepEmphasis {
  // …现有 comparing / swapped / sortedFrom / minIndex / sortedUpTo / keyIndex / groupMembers 不变…
  pivotIndex?: number; // 快排：当前 pivot 下标 → pivot 品红态（最高优先）
  sortedIndices?: number[]; // 快排：离散「已就位」下标集 → sorted 绿（区别于连续前后缀）
}
```

`Step` 增一个可选字段：

```ts
export interface Step<P extends string = string> {
  // …array / pointers / emphasis / vars / point / caption / aux 不变…
  stack?: StackTrack; // 纯加法：快排的区间栈轨；其它算法不设 → StackView 不渲染
}
```

**为何不复用 `keyIndex` 表达 pivot**：`keyIndex`（插入排序「被取出的 key」）语义是「悬空、原位滑动的待插入元素」，颜色浅玫红；pivot 语义是「本轮分区的基准、扫描完一步归位」，二者概念不同、且需在优先级链上分别定位。新增 `pivotIndex` + 品红 `#c2185b` 使两者在视觉与语义上都不混淆。

**为何 `sortedIndices` 是数组而非区间**：见 requirements「本质差异 §2」——快排钉死的最终位置离散散落（本数据钉死顺序 `0,6,1,5,2,3,4,9,7,8`），`sortedFrom`/`sortedUpTo` 的连续前后缀模型表达不了。

## 3. 算法步序推演（初始数据 `[7,6,5,10,9,8,4,3,2,1]`，n=10）

栈序：partition 后**先 push 右 `(p+1,hi)`、后 push 左 `(lo,p-1)`** → `pop` 先取左半（深度优先左侧、视觉从左到右）。单元素子区间（`lo==hi`）不入栈、直接计入已就位；空区间忽略。

| #   | pop 区间 | pivot=a[hi] | partition 后数组         | pivot 落点 p | 入栈 / 单元素就位      | 栈（底→顶）     |
| --- | -------- | ----------- | ------------------------ | ------------ | ---------------------- | --------------- |
| 1   | [0,9]    | 1           | `[1,6,5,10,9,8,4,3,2,7]` | **0**        | 右→push(1,9)；左空     | `[(1,9)]`       |
| 2   | [1,9]    | 7           | `[1,6,5,4,3,2,7,9,8,10]` | **6**        | push(7,9)、push(1,5)   | `[(7,9),(1,5)]` |
| 3   | [1,5]    | 2           | `[1,2,5,4,3,6,7,9,8,10]` | **1**        | 右→push(2,5)；左空     | `[(7,9),(2,5)]` |
| 4   | [2,5]    | 6           | `[1,2,5,4,3,6,7,9,8,10]` | **5**        | 左→push(2,4)；右空     | `[(7,9),(2,4)]` |
| 5   | [2,4]    | 3           | `[1,2,3,4,5,6,7,9,8,10]` | **2**        | 右→push(3,4)；左空     | `[(7,9),(3,4)]` |
| 6   | [3,4]    | 5           | `[1,2,3,4,5,6,7,9,8,10]` | **4**        | 左单元素→就位(3)；右空 | `[(7,9)]`       |
| 7   | [7,9]    | 10          | `[1,2,3,4,5,6,7,9,8,10]` | **9**        | 左→push(7,8)；右空     | `[(7,8)]`       |
| 8   | [7,8]    | 8           | `[1,2,3,4,5,6,7,8,9,10]` | **7**        | 右单元素→就位(8)；左空 | `[]`            |

末步：栈空 → `done`，数组 `[1,2,3,4,5,6,7,8,9,10]` 严格升序 ✓。

**pivot 落点钉死校验**：每次 partition 后 `a[p]` 即为最终有序数组该下标的值——event 落点 `p ∈ {0,6,1,5,2,4,9,7}`，加单元素就位 `{3,8}`，并集 = `{0..9}` 全覆盖。oracle `PartitionEvent.pivotIndex` 对应上表「pivot 落点 p」列，`PartitionEvent.array` 对应「partition 后数组」列。

**教育性注记**：首个 pivot=1（全局最小）导致首次划分极不平衡（左空、右几乎全部）——真实展示「Lomuto 取末位时若末位恰为极值，单次划分退化为 O(n) 且只钉死一个端点」。这正是引出「随机化 pivot / 三数取中」动机的好反例（本次不实现，仅可视化呈现）。

## 4. 插桩流程（`buildQuickSortSteps`）

伪代码（实际见 implementation.md）：

```
work = input.map((v,i) => [String(i), v])      // 稳定 id 驱动 FLIP
n = work.length
sorted = []                                     // 离散已就位下标（累积）
if n <= 1: push 'done'(sortedIndices=[0..n-1]); return
stack = [{lo:0, hi:n-1}]
push '初始'：可并入第一个 pop 前——实际首步即 pop
while stack 非空:
  frame = stack.pop()
  push 'pop'      (popped=frame, stack 快照=pop 后, groupMembers=[lo..hi], 指针无)
  pivot = work[hi][1]
  push 'pivotSelect' (pivotIndex=hi, i=lo, j=lo?, groupMembers=[lo..hi])
  i = lo
  for j in [lo, hi):
    push 'compare' (comparing=[j,hi], pivotIndex=hi, i,j, groupMembers)
    if work[j][1] < pivot:
      swap(work[i], work[j]); swapCount++
      push 'swap' (pivotIndex=hi, i=i+1(归位后), j, groupMembers)   // i 已自增
      i++
    else:
      push 'noSwap' (pivotIndex=hi, i, j, groupMembers)
  swap(work[i], work[hi]); swapCount++          // pivot 归位
  sorted.push(i)
  push 'pivotPlace' (sortedIndices=[...sorted], i, groupMembers, pivot 现在在 i → 但已就位转绿)
  p = i
  // 先右后左入栈；单元素直接就位
  if hi > p+1: stack.push({lo:p+1, hi})
  elif p+1 == hi: sorted.push(hi)
  if p-1 > lo: stack.push({lo, hi:p-1})
  elif p-1 == lo: sorted.push(lo)
  push 'push' (stack 快照=push 后, sortedIndices=[...sorted], groupMembers=[lo..hi])
push 'done' (sortedIndices=[0..n-1], stack=[])
```

**关键不变量**：

- 每步 `work` 的 id 集合恒等于初始（FLIP 前提；只交换不增删）。
- `pivotPlace` 后 `sorted` 严格增长；`done` 时 `sorted` = 全集。
- `stack` 快照在 `pop` 步是「弹出后」的栈、在 `push` 步是「压入后」的栈——回放任意 index 都自洽。
- 指针 `clampIdx` 到 `[0, n-1]`（`pivotPlace`/`pop` 等无 i/j 的步不画箭头）。

## 5. 可视化映射

### 5.1 主轨（BarsView）

复用现有 `stateOf`，扩展两处判定，优先级链：`pivot > key > sorted > swapped > min > comparing > dimmed > idle`。

```ts
function stateOf(index): '…' | 'pivot' {
  const e = props.emphasis;
  if (e.pivotIndex === index) return 'pivot'; // 新增：最高优先
  if (e.keyIndex === index) return 'key';
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  const sortedDisc = e.sortedIndices?.includes(index); // 新增：离散已就位
  if (sortedRight || sortedLeft || sortedDisc) return 'sorted';
  // …其余分支不变（swapped / min / comparing / dimmed / idle）…
}
```

| 执行点      | groupMembers | pivotIndex | comparing | sortedIndices | i 红箭头 | j 蓝箭头 |
| ----------- | ------------ | ---------- | --------- | ------------- | -------- | -------- |
| pop         | [lo..hi]     | —          | —         | 累积          | —        | —        |
| pivotSelect | [lo..hi]     | hi         | —         | 累积          | lo       | lo       |
| compare     | [lo..hi]     | hi         | [j,hi]    | 累积          | i        | j        |
| swap        | [lo..hi]     | hi         | —         | 累积          | i(已++)  | j        |
| noSwap      | [lo..hi]     | hi         | —         | 累积          | i        | j        |
| pivotPlace  | [lo..hi]     | —          | —         | 累积+p        | p        | —        |
| push        | [lo..hi]     | —          | —         | 累积          | —        | —        |
| done        | —            | —          | —         | [0..n-1]      | —        | —        |

注：`pivotPlace` 步 pivot 已落到 `i` 并立刻进 `sortedIndices` → 该柱显绿（不再 pivot 品红），形成「基准归位即钉死」的视觉闭环。`compare` 步 pivot 仍品红、被比较的 `j` 柱标黄（`comparing:[j,hi]` 中 `hi` 是 pivot 已被 `pivotIndex` 品红覆盖，`j` 取 comparing 黄）。

### 5.2 栈轨（StackView，新组件）

- props：`stack: StackTrack`（仅此一项；不再依赖主轨宽度/坐标系）。
- 渲染：`frames` **逆序**渲染（栈顶在最上、最显眼）；每帧**固定等宽**（`160px`）、**水平居中**的格子，文字用数组切片记法 **`a[lo..hi]`**——明确「数组的一段待排序子区间」，比旧的 `[lo,hi]` 更直观（用户反馈 `[0,9]` 像「一条数据」而非区间，易困惑）。`<TransitionGroup>` + **稳定 key（区间 `lo-hi`）** 包裹，支撑入栈/出栈动画。
- 动画：入栈（push）新帧从上方滑入（`translateY(-26px)` + fade）；出栈（pop）栈顶帧向右滑出 + fade（`stack-leave-active` 用 `position:absolute` 脱离流、其余帧 `stack-move` 平滑上移）。**修复了旧实现「`:key` 用下标 + 无 TransitionGroup 导致出栈时帧瞬间消失、无动画」的问题。**
- 态：栈顶帧（逆序后第一个）靛蓝高亮；其余帧半透明描边。
- 空栈：渲染占位「栈空 → 全部就位」。
- 不复用 `Bar`（栈帧是区间格、非数值柱）；复用 `.center` 布局与新拟物色。

```
（主轨下方，固定等宽居中堆叠 + 入栈/出栈动画）
区间栈 · 每格 = 一段待排序子数组 a[lo..hi]（栈顶先弹出分区）
栈顶 →  ┌────── a[1..5] ──────┐   （靛蓝高亮：下一个 pop）
        ┌────── a[7..9] ──────┐   （常态）
```

## 6. 四语言源码与 lineMap（显式栈 Lomuto）

四语言均为「显式栈 + Lomuto 末位 pivot」，结构同构。以 TypeScript 为锚定（其余按各自语法行号映射，实现见 `quick-sort.sources.ts`）：

```ts
function quickSort(a: number[]): number[] {
  // 1
  const n = a.length; // 2
  const stack: [number, number][] = [[0, n - 1]]; // 3
  while (stack.length > 0) {
    // 4
    const [lo, hi] = stack.pop()!; // 5  ← pop
    if (lo >= hi) continue; // 6
    const pivot = a[hi]; // 7  ← pivotSelect
    let i = lo; // 8
    for (let j = lo; j < hi; j++) {
      // 9  ← noSwap（条件不满足，继续扫描）
      if (a[j] < pivot) {
        // 10 ← compare
        [a[i], a[j]] = [a[j], a[i]]; // 11 ← swap
        i++; // 12
      } // 13
    } // 14
    [a[i], a[hi]] = [a[hi], a[i]]; // 15 ← pivotPlace
    stack.push([i + 1, hi]); // 16 ← push（先右）
    stack.push([lo, i - 1]); // 17    （后左）
  } // 18
  return a; // 19 ← done
} // 20
```

`lineMap`（ts）：`pop:5, pivotSelect:7, compare:10, swap:11, noSwap:9, pivotPlace:15, push:16, done:19`。

**源码与 module 的受控差异**（与归并先例一致、可接受）：源码为教学清晰**不跳过单元素入栈**（靠 `if (lo>=hi) continue` 在下一轮 pop 时处理），module 为可视化精简**跳过单元素入栈、直接计入 sortedIndices**。`lineMap` 只要求「执行点 → 合理行号」，不要求控制流逐字一致。`noSwap` 映射到 `for` 行（语义：`a[j] < pivot` 不成立，回到循环继续扫描下一个 `j`）。

## 7. oracle 设计（`quick-sort.ts`）

```ts
export interface PartitionEvent {
  lo: number;
  hi: number;
  pivotIndex: number; // partition 后 pivot 的最终落点
  array: number[]; // 该次 partition 完成后的整数组快照
}
export function quickSortPartitions(input: number[]): PartitionEvent[];
```

纯函数，不改入参；用与 module **同一栈序**（先右后左）跑 Lomuto，每次 partition 后 push 一个事件。交叉校验三件事：① `module` 末步数组 === `quickSortPartitions` 最后事件的 `array`（且 === 内置 `[...].sort()`）；② `module` 各 `pivotPlace` 步的落点序列 === oracle `pivotIndex` 序列；③ 每个 `PartitionEvent` 的 `array[pivotIndex]` === 最终有序数组的 `array[pivotIndex]`（钉死最终位置）。

## 8. 变量面板字段

| name      | 含义                                        | 非分区步占位                        |
| --------- | ------------------------------------------- | ----------------------------------- |
| n         | 数组长度                                    | 常显                                |
| 栈深      | `stack.frames.length`（当前待处理子问题数） | 常显                                |
| lo        | 当前区间左界                                | pop 起有值，done 为 `-`             |
| hi        | 当前区间右界                                | 同上                                |
| pivot     | `a[hi]` 基准值                              | pivotSelect 起有值                  |
| i         | 小于区右边界游标                            | compare/swap/noSwap/pivotPlace 有值 |
| j         | 扫描游标                                    | compare/swap/noSwap 有值            |
| a[j]      | 当前扫描元素值                              | compare/swap/noSwap 有值            |
| swapCount | 累计交换次数（含 pivot 归位）               | 常显累积                            |

## 9. 组件清单与改动面

| 文件                                            | 类型           | 改动                                                                                                         |
| ----------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/components/player/types.ts`                | 改（加法）     | `QuickExecPoint` / `StackTrack` / `Step.stack?` / `StepEmphasis.pivotIndex?` / `StepEmphasis.sortedIndices?` |
| `src/components/Bar.vue`                        | 改（加法）     | `state` 增 `'pivot'` + `.bar.pivot{background:#c2185b}`                                                      |
| `src/components/BarsView.vue`                   | 改（加法）     | `stateOf` 接入 `pivotIndex`（链首）+ `sortedIndices`（并入 sorted）                                          |
| `src/components/StackView.vue`                  | **新增**       | 区间栈水平条轨                                                                                               |
| `src/components/player/AlgorithmPlayer.vue`     | 改（1 行）     | `<StackView v-if="current.stack" :stack="current.stack" />`（固定等宽居中 + 入栈出栈动画）                   |
| `src/algorithms/quick-sort.ts`                  | **新增**       | oracle `quickSortPartitions`                                                                                 |
| `src/algorithms/quick-sort.module.ts`           | **新增**       | `buildQuickSortSteps` + `quickSortModule`                                                                    |
| `src/algorithms/quick-sort.sources.ts`          | **新增**       | 四语言源码 + lineMap                                                                                         |
| `src/views/Article/SortAlgorithm/QuickSort.vue` | **新增**       | 薄壳                                                                                                         |
| `src/router/index.ts`                           | 改（加法）     | `quick-sort` 懒加载路由                                                                                      |
| `src/views/Home/Main/hooks.ts`                  | 改（1 句文案） | 快排 desc 去「首位」措辞                                                                                     |

## 10. 向后兼容论证

- 前五算法的 `Step` 不设 `stack` → `AlgorithmPlayer` 的 `v-if="current.stack"` 为假 → `StackView` 不渲染、不 import 开销（组件已加载但不实例化）。
- 前五算法不设 `pivotIndex`/`sortedIndices` → `stateOf` 新分支短路（`undefined === index` 恒假、`undefined?.includes` 为 `undefined`）→ 判定结果与扩展前逐字相同。
- `Bar` 的 `'pivot'` 仅是联合类型多一个合法值 + 多一条 CSS 类；前五算法永不传入。
- 故冒泡/选择/插入/希尔/归并的 `*.spec.ts`（含 `Bar.spec.ts`/`BarsView.spec.ts`/`AlgorithmPlayer.spec.ts`/`AuxView.spec.ts`）全部 Case 零改动通过——这是硬验收，由「全门禁回归」证明。

## 11. 测试策略（详见 test-cases.md）

- L3 oracle（`TC-QUICK-ALGO-*`）：升序、不改入参、空/单元素、pivot 落点钉死、与内置 sort 一致。
- L3 module（`TC-QUICK-MOD-*`）：末步升序 + oracle 交叉、id 集合恒定、point 合法、compare 带 comparing、各 pivotPlace 落点序列 = oracle、sortedIndices 单调增长且末步全集、stack 快照自洽（pop 后/push 后）、栈序（先右后左 → pop 先左）、四语言齐备 + 行号范围 + 实际 point 可映射。
- L4 组件：`TC-VIZ-BAR-*`（pivot 态渲染 `.bar.pivot`）、`TC-VIZ-BARSVIEW-*`（pivotIndex 压过 sorted/comparing、sortedIndices 离散绿）、`TC-VIZ-STACKVIEW-*`（固定等宽居中、`a[lo..hi]` 记法、栈顶高亮、稳定 key 入栈出栈动画、空栈占位）、`TC-PLAYER-*`（current.stack 真才渲染 StackView、前五算法不渲染）。
- L4 视图：`TC-VIEW-QUICK-*`（薄壳挂载 quickSortModule、默认停第 0 步）。
- L5 e2e：`TC-E2E-QUICK-*`（默认暂停、栈轨可见、pivot 品红、拖动到末态升序全绿、重置、四语言切换截图）。
