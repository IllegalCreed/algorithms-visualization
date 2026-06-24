# 设计：计数排序动画（简单计数「萝卜一个坑」+ CountView 计数桶轨）

> Status: verified
> Stable ID: C-20260624-014
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

复用 C-006 算法播放器全部外壳，新增「计数桶轨」作为继归并 `AuxView`（数组轨）、快排 `StackView`（栈轨）、堆排 `TreeView`（树轨）之后的**第四条轨**，也是首条**按「值」索引**的轨（前三条均按位置/下标索引）。

```
countingSortModule.buildSteps(input)  →  Step<CountingExecPoint>[]   （插桩重走「计数 + 走桶回写」，每步带 count 桶快照）
            │
            ▼
usePlayer(steps)  →  index / current / play / pause / step* / seek / reset   （零改动）
            │
            ▼
AlgorithmPlayer  ┌─ BarsView   (主轨：计数读游标蓝 / 回写写游标绿；回写时柱原地形变、[0,w) 前缀绿、(w,n) 尾部淡)
                 ├─ CountView  (新轨：current.count 为真才渲染——一排按值 min..max 的桶，单元格堆叠 = 计数)  ← 唯一外壳新增
                 ├─ CodePanel / VariablePanel / TransportControls  (零改动)
```

**唯一外壳改动**：`AlgorithmPlayer.vue` 在 `BarsView` 之下加一行 `<CountView v-if="current.count">`。其余全是 `src/algorithms/` 新文件 + `types.ts`/`BarsView.vue` 纯加法。计数桶轨与主轨**异源**（桶按值索引、主轨按位置索引），但同步推进：计数阶段「读哪个位置 → 哪个桶 +1」，回写阶段「倒哪个桶 → 写哪个位置」。

## 2. 数据契约（`types.ts` 扩展，全部向后兼容加法）

```ts
/** 计数排序的执行点（简单计数 + 走桶回写） */
export type CountingExecPoint =
  | 'count' // 计数阶段：读 a[i]，桶 count[a[i]-min]++（主轨柱不动，对应桶 +1）
  | 'bucketStart' // 回写阶段：桶游标走到桶 v（高亮当前桶；空桶则其后无 writeBack）
  | 'writeBack' // 回写阶段：从当前桶倒出一颗 → a[w]=v+min、w++、count[v]--（柱原地形变、前缀转绿）
  | 'done'; // 全部回写完毕，数组升序

/** 计数桶轨快照——计数排序专用，按「值」索引（区别于所有按位置索引的轨） */
export interface CountTrack {
  min: number; // 桶 0 对应的值（演示中 =1）；桶 b 对应值 b+min
  buckets: number[]; // buckets[v-min] = 值 v 当前计数；长度 = max-min+1
  activeBucket?: number; // 当前高亮的桶下标(v-min)：count 步=被 +1 的桶；bucketStart/writeBack 步=正在出货的桶
}
```

`StepEmphasis` 增一个可选字段：

```ts
export interface StepEmphasis {
  // …现有字段不变…
  dimFrom?: number; // 计数排序回写：连续后缀 [dimFrom, n) 淡出（原值已计入桶、作废）；区别于希尔的离散集合 groupMembers
}
```

`Step` 增一个可选字段：`count?: CountTrack;`（纯加法；其它算法不设 → CountView 不渲染）。

**复用既有字段（不新增）**：`sortedUpTo`（连续前缀 `[0, sortedUpTo)` 已就位 → 绿，与选择排序同语义）；`pointers`（读/写游标箭头）。**不新增任何 `Bar` 态**——回写淡尾复用既有 `dimmed`。

## 3. 算法步序推演（初始数据 `[3,1,4,1,6,2,3,6,4,1]`，n=10，min=1，max=6，k=6）

### 3.1 计数阶段（`count`，i 从 0 到 9，桶下标 = 值 − 1）

| count(i) | a[i] | 桶下标 | 动作       | buckets（值 1..6） |
| -------- | ---- | ------ | ---------- | ------------------ |
| i=0      | 3    | 2      | count[2]++ | `[0,0,1,0,0,0]`    |
| i=1      | 1    | 0      | count[0]++ | `[1,0,1,0,0,0]`    |
| i=2      | 4    | 3      | count[3]++ | `[1,0,1,1,0,0]`    |
| i=3      | 1    | 0      | count[0]++ | `[2,0,1,1,0,0]`    |
| i=4      | 6    | 5      | count[5]++ | `[2,0,1,1,0,1]`    |
| i=5      | 2    | 1      | count[1]++ | `[2,1,1,1,0,1]`    |
| i=6      | 3    | 2      | count[2]++ | `[2,1,2,1,0,1]`    |
| i=7      | 6    | 5      | count[5]++ | `[2,1,2,1,0,2]`    |
| i=8      | 4    | 3      | count[3]++ | `[2,1,2,2,0,2]`    |
| i=9      | 1    | 0      | count[0]++ | `[3,1,2,2,0,2]`    |

**计数后桶快照 = `[3,1,2,2,0,2]`**（值 1→3、2→1、3→2、4→2、**5→0 空桶**、6→2）。校验 `sum=3+1+2+2+0+2=10=n` ✓。oracle `counts` 即此快照。

### 3.2 回写阶段（`bucketStart`/`writeBack`，b 从 0 到 5、w 从 0 递增）

| 步                  | 桶 b（值 v）     | 动作                              | w→  | 结果数组前缀          |
| ------------------- | ---------------- | --------------------------------- | --- | --------------------- |
| bucketStart b=0     | 值 1（3 颗）     | 高亮桶 1，准备倒                  | 0   | —                     |
| writeBack           | 值 1             | a[0]=1，count[0]=2                | 1   | `1`                   |
| writeBack           | 值 1             | a[1]=1，count[0]=1                | 2   | `1 1`                 |
| writeBack           | 值 1             | a[2]=1，count[0]=0                | 3   | `1 1 1`               |
| bucketStart b=1     | 值 2（1 颗）     | 高亮桶 2                          | 3   | `1 1 1`               |
| writeBack           | 值 2             | a[3]=2，count[1]=0                | 4   | `1 1 1 2`             |
| bucketStart b=2     | 值 3（2 颗）     | 高亮桶 3                          | 4   | `1 1 1 2`             |
| writeBack           | 值 3             | a[4]=3，count[2]=1                | 5   | `1 1 1 2 3`           |
| writeBack           | 值 3             | a[5]=3，count[2]=0                | 6   | `1 1 1 2 3 3`         |
| bucketStart b=3     | 值 4（2 颗）     | 高亮桶 4                          | 6   | `1 1 1 2 3 3`         |
| writeBack           | 值 4             | a[6]=4，count[3]=1                | 7   | `1 1 1 2 3 3 4`       |
| writeBack           | 值 4             | a[7]=4，count[3]=0                | 8   | `1 1 1 2 3 3 4 4`     |
| **bucketStart b=4** | **值 5（0 颗）** | **空桶 → 高亮即过、无 writeBack** | 8   | `1 1 1 2 3 3 4 4`     |
| bucketStart b=5     | 值 6（2 颗）     | 高亮桶 6                          | 8   | `1 1 1 2 3 3 4 4`     |
| writeBack           | 值 6             | a[8]=6，count[5]=1                | 9   | `1 1 1 2 3 3 4 4 6`   |
| writeBack           | 值 6             | a[9]=6，count[5]=0                | 10  | `1 1 1 2 3 3 4 4 6 6` |
| done                | —                | 全部就位                          | 10  | `1 1 1 2 3 3 4 4 6 6` |

**末态 `[1,1,1,2,3,3,4,4,6,6]` 严格升序** ✓。已就位区是数组**连续前缀** `[0, w)` → `sortedUpTo=w`。步骤总数 = 计数 10 + 回写（bucketStart 6 + writeBack 10）+ done 1 = **27 步**（index 0..26）。

oracle `countingSortTrace` 返回 `{ counts:[3,1,2,2,0,2], min:1, max:6, result:[1,1,1,2,3,3,4,4,6,6] }`；module 校验「计数阶段末步桶 = counts」「末步数组 = result」「sum(counts)=n」。

## 4. 插桩流程（`buildCountingSortSteps`）

```
work = input.map((v,i) => [String(i), v])   // 稳定 id 驱动 FLIP（计数排序只改值不换位，id 恒定）
n = work.length
if n == 0: push 'done'(sortedUpTo=0, count{min:0,buckets:[]}); return
min = Math.min(...vals); max = Math.max(...vals); k = max-min+1
buckets = Array(k).fill(0)
// 计数阶段
for i = 0..n-1:
  b = work[i][1] - min; buckets[b]++
  push 'count'(pointers=[{id:'1', index:i}],            // 蓝读游标
               emphasis={},                              // 主轨全 idle（计数不动数组、零比较）
               count={min, buckets:[...], activeBucket:b})
// 回写阶段
w = 0
for b = 0..k-1:
  push 'bucketStart'(pointers=[{id:'3', index:w}],       // 绿写游标停在下一写入位
                     emphasis={sortedUpTo:w, dimFrom:w}, // [0,w) 绿、[w,n) 淡（含 w 格）
                     count={min, buckets:[...], activeBucket:b})
  while buckets[b] > 0:
    work[w][1] = b + min; buckets[b]--; w++
    push 'writeBack'(pointers=[{id:'3', index:w-1}],     // 写游标落在刚写的活跃格 w-1
                     emphasis={sortedUpTo:w-1, dimFrom:w}, // [0,w-1) 绿、w-1 活跃 idle、[w,n) 淡
                     count={min, buckets:[...], activeBucket:b})
push 'done'(pointers=[], emphasis={sortedUpTo:n}, count={min, buckets:[...全 0], activeBucket:undefined})
```

**关键不变量**：① 每步 `work` id 集合恒等初始（计数排序只 `work[w][1]=…` 改值、从不换位，FLIP id 天然恒定）；② 计数阶段末步 `buckets` === oracle `counts`；③ 回写阶段 `sortedUpTo` 单调不减、收官 = n；④ 回写阶段 `activeBucket` 对应桶在其 `writeBack` 序列里单调减到 0；⑤ 空桶（`buckets[b]==0`）的 `bucketStart` 之后紧跟下一个 `bucketStart` 或 `done`，**无 `writeBack`**。

## 5. 可视化映射

### 5.1 主轨态（BarsView，复用既有判定 + 一条 dimFrom 分支）

计数排序**不引入任何新柱态**，只复用 `sortedUpTo`（→ sorted 绿）与新增 `dimFrom`（→ dimmed 淡）。`stateOf` 在 `groupMembers` 淡化分支之后、`idle` 之前加一行：

```ts
if (e.dimFrom !== undefined && index >= e.dimFrom) return 'dimmed'; // 计数排序：回写尾部连续后缀淡出
```

| 执行点      | pointers（箭头） | sortedUpTo | dimFrom | 主轨观感                                                     |
| ----------- | ---------------- | ---------- | ------- | ------------------------------------------------------------ |
| count       | `[{1, i}]` 蓝    | —          | —       | 全 idle，蓝读游标在 i                                        |
| bucketStart | `[{3, w}]` 绿    | w          | w       | `[0,w)` 绿、`[w,n)` 淡（绿写游标在 w，落在淡格上「准备写」） |
| writeBack   | `[{3, w-1}]` 绿  | w-1        | w       | `[0,w-1)` 绿、`w-1` 活跃 idle（刚形变 + 绿游标）、`[w,n)` 淡 |
| done        | `[]`             | n          | —       | 全绿（升序）                                                 |

注：`writeBack` 步 `sortedUpTo=w-1`（不含刚写的 `w-1` 格）→ 该格保持 idle（活跃浅绿）、绿写游标落其上；下一步（下个 writeBack 或 bucketStart）`sortedUpTo` 进到 `w`，`w-1` 才收为 sorted 绿。**写游标始终领着绿色前缀走、不滞后**——此为交互原型确认的关键语义。

### 5.2 CountView 布局（按值索引的计数桶）

桶 `b`（值 `v=b+min`）：

```
桶数        = max - min + 1 = buckets.length
桶 b 横排   = 第 b 个槽位（居中行，槽宽固定，不需与主轨位置对齐——桶按值不按位置）
单元格      = 从底向上堆叠 buckets[b] 个「萝卜格」（一格 = 一次计数）
值标签      = b + min（桶底）
计数数字    = buckets[b]（桶顶）
活动桶      = activeBucket === b → .count-bucket.active（高亮边 + 计数数字变色 + 格变亮）
空桶        = buckets[b] === 0 → 0 格（只剩值标签与计数 0，「没萝卜的坑」）
```

- 桶单元格：从底向上 `column-reverse` 堆叠 `div.count-cell`（萝卜橙 `#ff8a65`、活动桶 `#ff7043`），新拟物浮起；计数阶段顶格弹入、回写阶段顶格出列。
- 桶容器：新拟物**内凹**（`.neumorphism-pressed`，像一个「坑」）；活动桶加高亮环。
- `n=10` → 桶高最多 3 格（值 1）；固定单元格高 20px、桶最小高 150px 足够。

## 6. 四语言源码与 lineMap（简单计数 + 走桶回写）

TS 锚定（其余按各自语法，详见 `counting-sort.sources.ts`）：

```ts
function countingSort(a: number[]): number[] {
  // 1
  const min = Math.min(...a),
    max = Math.max(...a); // 2
  const count = new Array(max - min + 1).fill(0); // 3
  for (let i = 0; i < a.length; i++) count[a[i] - min]++; // 4  ← count
  let w = 0; // 5
  for (let v = 0; v < count.length; v++) {
    // 6  ← bucketStart
    while (count[v] > 0) {
      // 7
      a[w++] = v + min; // 8  ← writeBack
      count[v]--; // 9
    } // 10
  } // 11
  return a; // 12  ← done
} // 13
```

`lineMap`：

- ts：`count:4, bucketStart:6, writeBack:8, done:12`
- python：`count:6, bucketStart:8, writeBack:10, done:13`
- go：`count:13, bucketStart:16, writeBack:18, done:23`
- rust：`count:6, bucketStart:9, writeBack:11, done:16`

（各语言完整源码见 implementation.md T7；行号在该任务实现期对源码逐行复核、由 `TC-COUNT-MOD-14/15` 守护「行号在范围内 + 实际 point 可映射」。）

## 7. oracle 设计（`counting-sort.ts`）

```ts
export interface CountingTrace {
  counts: number[]; // 按值索引计数：counts[v-min]；空桶为 0
  min: number; // 值域下界（空输入约定为 0）
  max: number; // 值域上界（空输入约定为 0）
  result: number[]; // 升序结果
}
export function countingSortTrace(input: number[]): CountingTrace; // 纯函数，不改入参
```

交叉校验：① `result` === 内置 `[...input].sort((a,b)=>a-b)`；② `sum(counts)` === `input.length`；③ 由 `counts` 按值域顺序展开（值 `min+b` 重复 `counts[b]` 次）=== `result`（含空桶=0 自然跳过）；④ 不修改入参；⑤ 空输入 `counts=[]`、`result=[]`；单元素 `[x]` → `counts=[1]`、`result=[x]`。

## 8. 变量面板字段

| name | 含义                                          |
| ---- | --------------------------------------------- |
| n    | 数组长度                                      |
| min  | 值域下界                                      |
| max  | 值域上界                                      |
| k    | 桶数 = max − min + 1                          |
| 阶段 | 计数 / 回写 / 完成                            |
| i    | 计数阶段读位（回写/完成阶段为 `-`）           |
| v    | 回写阶段当前桶的值 = b+min（计数/完成为 `-`） |
| w    | 回写阶段写入位（计数/完成阶段为 `-`）         |

## 9. 组件清单与改动面

| 文件                                               | 类型       | 改动                                                                         |
| -------------------------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| `src/components/player/types.ts`                   | 改（加法） | `CountingExecPoint` / `CountTrack` / `Step.count?` / `StepEmphasis.dimFrom?` |
| `src/components/BarsView.vue`                      | 改（加法） | `stateOf` 加 `dimFrom` 连续后缀淡化分支（groupMembers 之后、idle 之前）      |
| `src/components/CountView.vue`                     | **新增**   | 计数桶轨（按值索引、单元格堆叠 + 值标签 + 计数）                             |
| `src/components/player/AlgorithmPlayer.vue`        | 改（1 行） | `<CountView v-if="current.count" :count="current.count" />`                  |
| `src/algorithms/counting-sort.ts`                  | **新增**   | oracle `countingSortTrace`                                                   |
| `src/algorithms/counting-sort.module.ts`           | **新增**   | `buildCountingSortSteps` + `countingSortModule`                              |
| `src/algorithms/counting-sort.sources.ts`          | **新增**   | 四语言源码 + lineMap                                                         |
| `src/views/Article/SortAlgorithm/CountingSort.vue` | **新增**   | 薄壳                                                                         |
| `src/router/index.ts`                              | 改（加法） | `counting-sort` 懒加载路由                                                   |

**`Bar.vue` 零改动**（复用既有 `dimmed` 态）。菜单 / 首页网格 / 图标（`counting.svg`）**已就位、无需改**。

## 10. 向后兼容论证

- 前七算法 `Step` 不设 `count` → `v-if="current.count"` 为假 → `CountView` 不渲染、零回归。
- 前七算法不设 `dimFrom` → `stateOf` 新分支短路（`undefined !== undefined` 恒假）→ 判定与扩展前逐字相同。
- `CountTrack` / `CountingExecPoint` / `Step.count?` / `StepEmphasis.dimFrom?` 都是联合/可选加法；前七算法永不传入。
- **`Bar` 零改动**——计数排序不引入新柱态，比堆排（加 `heapNode`）/快排（加 `pivot`）改动面更小。
- 故冒泡/选择/插入/希尔/归并/快速/堆的全部 `*.spec.ts` 零改动通过——由全门禁回归证明。

## 11. 测试策略（详见 test-cases.md）

- L3 oracle（`TC-COUNT-ALGO-*`）：counts 正确（含空桶=0）、result 升序、sum=n、由 counts 可重建 result、不改入参、空/单元素/重复/已序/逆序/全等值。
- L3 module（`TC-COUNT-MOD-*`）：末步升序 + oracle 交叉、计数阶段末桶快照=counts、id 恒定、point 合法、sortedUpTo 单调增、回写桶单调减、空桶有 bucketStart 无 writeBack、count 步 activeBucket=a[i]-min、读/写游标正确、每步带 count 快照、四语言齐备 + 行号范围 + 实际 point 可映射。
- L4 组件：`TC-VIZ-COUNTVIEW-*`（桶数=k、单元格数=计数、值标签=v+min、activeBucket 高亮、空桶 0 格、计数数字）、`TC-VIZ-BARSVIEW-*`（dimFrom 连续后缀淡化分支，前七算法不受影响）、`TC-PLAYER-*`（current.count 真才渲染 CountView，前七算法不渲染、与 aux/tree 互不干扰）。
- L4 视图：`TC-VIEW-COUNT-*`（薄壳挂载、默认停第 0 步、桶轨存在）。
- L5 e2e：`TC-E2E-COUNT-*`（默认暂停、桶轨可见、计数填桶、回写跳末升序全绿、空桶跳过、重置、四语言切换、视觉截图）。
