# 设计：堆排序动画（Floyd 大顶堆 + TreeView 二叉树轨）

> Status: verified
> Stable ID: C-20260623-013
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

复用 C-006 算法播放器全部外壳，新增「二叉树轨」作为继归并 `AuxView`（数组轨）、快排 `StackView`（栈轨）之后的第三条、也是首条**非线性**可视化轨。

```
heapSortModule.buildSteps(input)  →  Step<HeapExecPoint>[]   （插桩重走 Floyd 堆排序，每步带 tree 快照）
            │
            ▼
usePlayer(steps)  →  index / current / play / pause / step* / seek / reset   （零改动）
            │
            ▼
AlgorithmPlayer  ┌─ TreeView   (新轨：current.tree 为真才渲染——完全二叉树，节点 div + SVG 边)  ← 唯一外壳新增
                 ├─ BarsView   (数组轨：与树轨同源 array + emphasis，同步高亮)
                 ├─ CodePanel / VariablePanel / TransportControls  (零改动)
```

**唯一外壳改动**：`AlgorithmPlayer.vue` 在 `BarsView` 之上加一行 `<TreeView v-if="current.tree">`。其余全是 `src/algorithms/` 新文件 + `types.ts`/`Bar.vue`/`BarsView.vue` 纯加法。树轨与数组轨**同源**（同一 `array` + `emphasis`），保证「下标 ↔ 节点」同步高亮。

## 2. 数据契约（`types.ts` 扩展，全部向后兼容加法）

```ts
/** 堆排序的执行点（Floyd 大顶堆 + 单一 siftDown） */
export type HeapExecPoint =
  | 'heapify' // 建堆阶段：对节点 i 开始 siftDown
  | 'compare' // siftDown 内：父与左/右子比较，确定 largest
  | 'swap' // siftDown 内：父与较大子交换、下沉
  | 'settle' // siftDown 内：largest==i，停止（子树成堆）
  | 'extract' // 排序阶段：堆顶 a[0] 与堆末 a[end] 交换、end 脱离堆就位
  | 'done'; // 全部有序

/** 二叉树轨快照——堆排序专用 */
export interface TreeTrack {
  heapSize: number; // 当前堆大小：下标 [0,heapSize) 在堆中，[heapSize,n) 已就位脱离堆
}
```

`StepEmphasis` 增一个可选字段：

```ts
export interface StepEmphasis {
  // …现有字段不变…
  heapNode?: number; // 堆排序：当前 siftDown 活动父节点 → heapNode 深紫态
}
```

`Step` 增一个可选字段：`tree?: TreeTrack;`（纯加法；其它算法不设 → TreeView 不渲染）。

## 3. 算法步序推演（初始数据 `[7,6,5,10,9,8,4,3,2,1]`，n=10）

### 3.1 建堆（Floyd，i 从 ⌊n/2⌋-1=4 逆序 siftDown）

| siftDown(i) | 动作                        | 结果数组                 |
| ----------- | --------------------------- | ------------------------ |
| i=4 (9)     | 9≥1，无交换                 | `[7,6,5,10,9,8,4,3,2,1]` |
| i=3 (10)    | 10≥3,2，无交换              | `[7,6,5,10,9,8,4,3,2,1]` |
| i=2 (5)     | 5<8，5↔8                    | `[7,6,8,10,9,5,4,3,2,1]` |
| i=1 (6)     | 6<10，6↔10（下沉到 3 后停） | `[7,10,8,6,9,5,4,3,2,1]` |
| i=0 (7)     | 7<10→7↔10；再 7<9→7↔9       | `[10,9,8,6,7,5,4,3,2,1]` |

**建堆后大顶堆 = `[10,9,8,6,7,5,4,3,2,1]`**。校验：`a[0]=10≥a[1]=9,a[2]=8`；`a[1]=9≥a[3]=6,a[4]=7`；`a[2]=8≥a[5]=5,a[6]=4`；`a[3]=6≥a[7]=3,a[8]=2`；`a[4]=7≥a[9]=1` ✓。

### 3.2 排序（end 从 n-1=9 递减，swap(0,end) + siftDown(0,end)）

每次 `extract` 把当前堆顶（最大）换到 `end`、`heapSize` 减 1。堆顶被取出序列 = **`10,9,8,7,6,5,4,3,2`**，最后 `a[0]=1`。末态 **`[1,2,3,4,5,6,7,8,9,10]`** 严格升序 ✓。已就位区是数组**连续后缀** `[end+1, n)`（绿），堆边界 = `heapSize` = `sortedFrom`。

oracle `heapSortTrace` 返回 `{ built: [10,9,8,6,7,5,4,3,2,1], result: [1..10] }`；module 校验「建堆阶段末步数组 = built 且 isMaxHeap」「末步 = result」。

## 4. 插桩流程（`buildHeapSortSteps`）

```
work = input.map((v,i) => [String(i), v])   // 稳定 id 驱动 FLIP
n = work.length; heapSize = n; swapCount = 0
if n <= 1: push 'done'(sortedFrom=0, tree{heapSize:n}); return
// 建堆
for i = ⌊n/2⌋-1 downto 0:
  push 'heapify'(heapNode=i, tree{heapSize:n})
  siftDown(i, n, phase='建堆')
// 排序
for end = n-1 downto 1:
  swap(work[0], work[end]); swapCount++; heapSize = end
  push 'extract'(comparing=[0,end], swapped, sortedFrom=end, tree{heapSize})
  siftDown(0, end, phase='排序')
push 'done'(sortedFrom=0, tree{heapSize:0})

siftDown(i, size, phase):
  while 2i+1 < size:
    l=2i+1; r=2i+2; largest=i
    if work[l] > work[largest]: largest=l
    if r<size and work[r]>work[largest]: largest=r
    push 'compare'(heapNode=i, comparing=[l, r<size?r:l], tree{heapSize})
    if largest == i:
      push 'settle'(heapNode=i, tree{heapSize}); break
    swap(work[i], work[largest]); swapCount++
    push 'swap'(comparing=[i,largest], swapped, tree{heapSize})
    i = largest
```

**关键不变量**：每步 `work` id 集合恒等初始（FLIP）；建堆末步 `isMaxHeap(work[0..n))`；排序中 `sortedFrom == heapSize` 单调减（堆缩小）；指针无（堆用节点高亮而非箭头，`pointers: []`）。

## 5. 可视化映射

### 5.1 态优先级（BarsView + TreeView 共用）

链：`pivot > key > sorted > heapNode > swapped > min > comparing > dimmed > idle`。`BarsView.stateOf` 在 sorted 判定后加：`if (e.heapNode === index) return 'heapNode'`。

| 执行点  | heapNode | comparing   | swapped | sortedFrom | heapSize |
| ------- | -------- | ----------- | ------- | ---------- | -------- |
| heapify | i        | —           | —       | —          | n        |
| compare | i        | [l,r]       | —       | —          | 当前     |
| swap    | —        | [i,largest] | ✓       | —          | 当前     |
| settle  | i        | —           | —       | —          | 当前     |
| extract | —        | [0,end]     | ✓       | end        | end      |
| done    | —        | —           | —       | 0          | 0        |

注：`extract` 步 `end` 同时落在 `comparing`(swapped) 与 `sortedFrom` —— `sorted` 优先级高于 `swapped`，故 `end` 显**绿（已就位最大值）**、`a[0]`（换下来的小值）显**橙（待 siftDown）**，正好表达「最大值归位、小值待下沉」。

### 5.2 TreeView 布局（完全二叉树）

节点 `k`（0-based 层序）：

```
depth        = ⌊log₂(k+1)⌋
levelStart   = 2^depth - 1
posInLevel   = k - levelStart
levelCapacity= 2^depth
x = (posInLevel + 0.5) / levelCapacity        // 归一化 0..1，乘容器宽
y = depth * levelHeight                         // 逐层下移
parent(k)    = ⌊(k-1)/2⌋  (k>0)               // 父子边
```

- 节点：绝对定位 `div`（圆 + 值），class 由 stateOf 决定（heapNode 深紫 / comparing 黄 / swapped 橙 / sorted 绿 / idle）。
- 边：单层 SVG，`line` 连每个 `k>0` 的节点中心到其父中心。
- `heapSize`：`k >= heapSize` 的节点已脱离堆（与 `sortedFrom` 一致显绿）。
- `n=10` → 4 层（depth 0:[0]、1:[1,2]、2:[3,4,5,6]、3:[7,8,9]）。

## 6. 四语言源码与 lineMap（Floyd siftDown）

TS 锚定（其余按各自语法，详见 `heap-sort.sources.ts`）：

```ts
function heapSort(a: number[]): number[] {
  // 1
  const n = a.length; // 2
  for (
    let i = Math.floor(n / 2) - 1;
    i >= 0;
    i-- // 3  ← heapify
  )
    siftDown(a, i, n); // 4
  for (let end = n - 1; end > 0; end--) {
    // 5
    [a[0], a[end]] = [a[end], a[0]]; // 6  ← extract
    siftDown(a, 0, end); // 7
  } // 8
  return a; // 9  ← done
} // 10
function siftDown(a: number[], i: number, size: number) {
  // 11
  while (2 * i + 1 < size) {
    // 12
    let largest = i; // 13
    const l = 2 * i + 1,
      r = 2 * i + 2; // 14
    if (a[l] > a[largest]) largest = l; // 15  ← compare
    if (r < size && a[r] > a[largest]) largest = r; // 16
    if (largest === i) break; // 17  ← settle
    [a[i], a[largest]] = [a[largest], a[i]]; // 18  ← swap
    i = largest; // 19
  } // 20
} // 21
```

`lineMap`：

- ts：`heapify:3, compare:15, swap:18, settle:17, extract:6, done:9`
- python：`heapify:3, compare:14, swap:20, settle:18, extract:6, done:8`
- go：`heapify:3, compare:17, swap:26, settle:23, extract:7, done:10`
- rust：`heapify:3, compare:16, swap:25, settle:22, extract:7, done:10`

## 7. oracle 设计（`heap-sort.ts`）

```ts
export interface HeapTrace {
  built: number[]; // 建堆后大顶堆快照
  result: number[]; // 升序结果
}
export function isMaxHeap(a: number[], size?: number): boolean;
export function heapSortTrace(input: number[]): HeapTrace; // 纯函数，不改入参
```

交叉校验：① module 末步 === `result` === 内置 `[...].sort()`；② module 建堆阶段末步（最后一个 `heapify` 子树完成、进入排序前）数组 === `built` 且 `isMaxHeap` 为真；③ `built` 满足大顶堆性质。

## 8. 变量面板字段

| name         | 含义                                |
| ------------ | ----------------------------------- |
| n            | 数组长度                            |
| 阶段         | 建堆 / 排序                         |
| heapSize     | 当前堆大小 [0,heapSize)             |
| i            | 当前 siftDown 节点                  |
| left / right | 左子 2i+1 / 右子 2i+2（越界为 `-`） |
| largest      | 父与子中最大者下标                  |
| swapCount    | 累计交换次数                        |

## 9. 组件清单与改动面

| 文件                                           | 类型       | 改动                                                                    |
| ---------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| `src/components/player/types.ts`               | 改（加法） | `HeapExecPoint` / `TreeTrack` / `Step.tree?` / `StepEmphasis.heapNode?` |
| `src/components/Bar.vue`                       | 改（加法） | `state` 增 `'heapNode'` + `.bar.heapNode{background:#7e57c2}`           |
| `src/components/BarsView.vue`                  | 改（加法） | `stateOf` 接入 `heapNode`（sorted 后、swapped 前）                      |
| `src/components/TreeView.vue`                  | **新增**   | 完全二叉树轨（节点 div + SVG 边）                                       |
| `src/components/player/AlgorithmPlayer.vue`    | 改（1 行） | `<TreeView v-if="current.tree" :array :emphasis :heap-size />`          |
| `src/algorithms/heap-sort.ts`                  | **新增**   | oracle `heapSortTrace` + `isMaxHeap`                                    |
| `src/algorithms/heap-sort.module.ts`           | **新增**   | `buildHeapSortSteps` + `heapSortModule`                                 |
| `src/algorithms/heap-sort.sources.ts`          | **新增**   | 四语言源码 + lineMap                                                    |
| `src/views/Article/SortAlgorithm/HeapSort.vue` | **新增**   | 薄壳                                                                    |
| `src/router/index.ts`                          | 改（加法） | `heap-sort` 懒加载路由                                                  |

## 10. 向后兼容论证

- 前六算法 `Step` 不设 `tree` → `v-if="current.tree"` 为假 → `TreeView` 不渲染、零回归。
- 前六算法不设 `heapNode` → `stateOf` 新分支短路（`undefined === index` 恒假）→ 判定与扩展前逐字相同。
- `Bar` 的 `'heapNode'` 仅是联合类型多一个合法值 + 一条 CSS；前六算法永不传入。
- 故冒泡/选择/插入/希尔/归并/快速的全部 `*.spec.ts` 零改动通过——由全门禁回归证明。

## 11. 测试策略（详见 test-cases.md）

- L3 oracle（`TC-HEAP-ALGO-*`）：built 是大顶堆、result 升序、不改入参、空/单元素、isMaxHeap 正确、与内置 sort 一致。
- L3 module（`TC-HEAP-MOD-*`）：末步升序+oracle 交叉、建堆末步=built+isMaxHeap、id 恒定、point 合法、compare 带 comparing、sortedFrom 单调增、heapSize 单调减且=sortedFrom、extract 堆顶序列、四语言齐备+行号范围+实际 point 可映射。
- L4 组件：`TC-VIZ-BAR-*`（heapNode 态）、`TC-VIZ-BARSVIEW-*`（heapNode 接入优先级，压过 swapped/comparing、让位 sorted）、`TC-VIZ-TREEVIEW-*`（节点数=array.length、布局坐标、父子边数=n-1、heapNode/sorted 态、heapSize 区分就位）、`TC-PLAYER-*`（current.tree 真才渲染 TreeView，前六算法不渲染）。
- L4 视图：`TC-VIEW-HEAP-*`（薄壳挂载、默认停第 0 步、树轨存在）。
- L5 e2e：`TC-E2E-HEAP-*`（默认暂停、树轨可见、heapNode 深紫、跳末升序全绿、重置、四语言切换）。
