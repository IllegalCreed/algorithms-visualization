# 设计：希尔排序动画（接入算法播放器框架）

> Status: draft
> Stable ID: C-20260622-010
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 0%
> Blocked by: none
> Next action: 待用户 review 本 spec → writing-plans 产出 implementation + test-cases
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007、C-20260621-008
> Related tests: 见 §7「对现有测试的影响」
> Related requirement: requirements.md

## 总体方案

**复用 C-006 播放器框架 + C-008 已成熟的「移位插桩」范式，只把步长从 1 泛化为可变 gap，并为「分组聚焦」加纯加法可视化。** 框架与算法的契约仍是预计算的「胖步骤」`Step[]`：希尔排序实现一个 `AlgorithmModule`，外壳按 `index` 回放，单步 / 暂停 / 后退 / 拖动全是「移动下标」——交互模型一字不改。

希尔排序的 module **几乎就是插入排序 module 的泛化**：插入排序「相邻交换 + `j--`」→ 希尔「跨 gap 交换 + `j -= gap`」，外面再套两层循环（`gap` 减半 + 逐组 `start`），并给每组打 `groupMembers` 让非当前组淡出。`key` 玫红态、`keyIndex` 最高优先、FLIP 移位、两指针红蓝、四语言行映射——**全部沿用 C-008，不动**。

复用矩阵：

| 件                                                                                     | 角色                                    | 希尔排序如何对待                                              |
| -------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| `usePlayer.ts` / `TransportControls.vue` / `AlgorithmPlayer.vue` / `VariablePanel.vue` | 传输状态机 + 控制条 + 装配壳 + 变量面板 | **零改动**，原样复用                                          |
| `CodePanel.vue`                                                                        | 多语言 Shiki 高亮 + 当前行              | **零改动**（`point: string` 已由 C-007 放宽）                 |
| `ArrowTrack.vue` / `Arrow.vue`                                                         | 雪佛龙指针                              | **零改动**，两指针取 `colors[0/1]`                            |
| `Bar.vue`                                                                              | 单柱渲染                                | 加 `'dimmed'` 态 + `.bar.dimmed` 降透明度                     |
| `BarsView.vue`                                                                         | 柱状可视化                              | `stateOf` 加 `groupMembers` → `dimmed` 分支（**最低有效档**） |
| `types.ts`                                                                             | 数据契约                                | 加 `ShellExecPoint` + `StepEmphasis.groupMembers?`（纯加法）  |

希尔排序新增的，只有 `src/algorithms/shell-sort.*` 三件 + `ShellSort.vue` 薄壳 + 一条路由。

## 1. 数据契约扩展（`src/components/player/types.ts`）— 纯加法

```ts
/** 希尔排序的执行点（gap 减半 → 逐组 start → 组内插入：gapChange/groupStart 为分组标记步） */
export type ShellExecPoint =
  | 'gapChange' // 进入新 gap 一轮，步长减半
  | 'groupStart' // 进入新子序列（当前组高亮锚点）
  | 'outerLoop' // 组内取出 key = a[i]
  | 'compare' // 比较 a[j] 与 key（j 按 gap 左跳）
  | 'shift' // a[j] > key，跨 gap 交换让位
  | 'insert' // key 落定
  | 'done';

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 冒泡 / 希尔 done：右侧 [sortedFrom, n) 已就位
  minIndex?: number; // 选择：当前已知最小值下标 → min 态
  sortedUpTo?: number; // 选择 / 插入：左侧 [0, sortedUpTo) 已就位
  keyIndex?: number; // 插入 / 希尔：被取出的 key 柱当前下标 → key 态（最高优先）
  groupMembers?: number[]; // 希尔：当前子序列的下标集；不在其中且无其它强调 → dimmed 淡出
}
```

**为什么零风险**：泛型化（C-007）、`keyIndex`/`key` 态（C-008）已就位，本次只加一个 `ShellExecPoint` union（`⊆ string`，与既有协变契约自洽）和一个**可选** `groupMembers?` 字段。冒泡 / 选择 / 插入都不设 `groupMembers`，其值恒 `undefined`，`dimmed` 分支不触发。`ShellSort.vue` 传 `shellSortModule: AlgorithmModule<ShellExecPoint>` 给 `AlgorithmPlayer` 的 `module: AlgorithmModule`（默认 `P=string`）成立。

## 2. 目录与文件

```
src/algorithms/
  shell-sort.ts            ← 新增：纯算法 oracle（对标 insertion-sort.ts）
  shell-sort.module.ts     ← 新增：插桩重走 + buildSteps + shellSortModule
  shell-sort.sources.ts    ← 新增：四语言源码 + lineMap
  bubble-sort.* / selection-sort.* / insertion-sort.*  ← 不动

src/components/
  Bar.vue                  ← 改：state 加 'dimmed' + .bar.dimmed 配色
  BarsView.vue             ← 改：stateOf 加 groupMembers → dimmed 分支（最低有效档）
  player/types.ts          ← 改：加 ShellExecPoint + StepEmphasis.groupMembers?

src/views/Article/SortAlgorithm/
  ShellSort.vue            ← 新增：<AlgorithmPlayer :module="shellSortModule" />

src/router/index.ts        ← 改：新增 shell-sort 懒加载路由
```

菜单（`Docs/Menu/hooks.ts:60-62`）与首页网格（`Home/Main/hooks.ts:96-101`）已含 `shell-sort` 条目与 `shell.svg` 图标，**无需改动**。

## 3. 希尔排序算法模块

### 执行点语义与强调

| ExecPoint    | 含义                                                       | 指针 / 强调                                          |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------- |
| `gapChange`  | 进入新 `gap` 一轮（`gap = ⌊n/2⌋`，逐次 `/2`），分 `gap` 组 | **不设** `groupMembers`（全亮）；caption `gap=X`     |
| `groupStart` | 进入子序列 `start`，成员 `{start, start+gap, …}`           | `groupMembers=该组`；红=蓝=`start`                   |
| `outerLoop`  | 组内取出 `key = a[i]`，`keyIdx ← i`，`j ← i-gap`           | `keyIndex=i`, `groupMembers`；红=`i` 蓝=`j`          |
| `compare`    | 比较 `a[j]` 与 `key`（`j` 按 `gap` 左跳）                  | `comparing:[j, keyIdx]`, `keyIndex`, `groupMembers`  |
| `shift`      | `a[j] > key`，跨 `gap` 交换：`a[j]` 右让、`key` 跳到 `j`   | `keyIndex`（=新位 `j`）, `groupMembers`              |
| `insert`     | `a[j] ≤ key` 或越组下界，`key` 落定 `keyIdx`               | `keyIndex`（插入点）, `groupMembers`                 |
| `done`       | 排序完成                                                   | `sortedFrom: 0`（全 `sorted` 绿），清 `groupMembers` |

### `buildSteps` 骨架（插桩重走「按组显式三层」，逐行粒度）

```
work = input.map((v, i) => [String(i), v]);  n = work.length
shiftCount = 0
两指针 id：'0'=i(红，本轮取出位置) '1'=j(蓝，左探位置，按 gap 跳)
keyIdx 跟踪 key 柱当前下标（随移位按 gap 左跳）
groupOf(start, gap) = [start, start+gap, start+2gap, … < n]   // 当前子序列下标集
每个 push 带 emphasis，vars = [n, gap, group(=start), i, key, j, a[j], shiftCount]

if n <= 1: push('done', {sortedFrom: 0}, '完成'); return        // 空 / 单元素

for (gap = n>>1; gap > 0; gap >>= 1):
  push('gapChange', i=0, key=-, j=0, {}, `gap=${gap}：步长减半，分 ${gap} 组`)
  for (start = 0; start < gap; start++):
    members = groupOf(start, gap)
    push('groupStart', i=start, key=work[start][1], j=start,
         { groupMembers: members }, `步长 ${gap} · 组 ${start}`)
    for (i = start + gap; i < n; i += gap):
      key = work[i][1];  keyIdx = i;  j = i - gap
      push('outerLoop', i, key, j, { keyIndex: keyIdx, groupMembers: members },
           `取出 key=${key}（下标 ${i}）`)
      while (j >= start):                                       // j>=start ⟺ keyIdx-gap>=start，不越组下界
        aj = work[j][1];  greater = aj > key
        push('compare', i, key, j,
             { comparing: [j, keyIdx], keyIndex: keyIdx, groupMembers: members },
             `a[${j}]=${aj} ${greater ? '>' : '≤'} key=${key}`)
        if (!greater) break                                     // 找到插入点，停
        [work[j], work[keyIdx]] = [work[keyIdx], work[j]]        // 跨 gap 交换：key 左跳、aj 右让
        keyIdx = j;  shiftCount++
        push('shift', i, key, j, { keyIndex: keyIdx, groupMembers: members },
             `${aj} 右移 gap=${gap}，key 跳到 ${keyIdx}`)
        j -= gap
      push('insert', i, key, j, { keyIndex: keyIdx, groupMembers: members },
           `key=${key} 插入下标 ${keyIdx}`)
push('done', n-1, work[n-1][1], n-1, { sortedFrom: 0 }, '完成，全部有序')
```

- 指针下标越界（如 `j` 退到 `start-gap < 0`）一律 `clampIdx`（沿用插入 module 做法）；`vars` 里 `a[j]` 用 `work[j]?.[1] ?? '-'`。
- `vars` 的 `group` 字段：`gapChange` / `done` 帧（尚未进入 / 已离开任何子序列）显示 `'-'`，`groupStart` 起显示当前 `start`（用 `start >= 0` 判定；进 `gapChange` 前与 `done` 前把 `start` 置 `-1`）。
- **循环条件 `j >= start`**（而非插入排序的 `j >= 0`）：保证 `j` 不越当前组下界 `start`，**绝不跨组比较**。等价于标准写法的 `keyIdx >= start + gap`。
- `shift` 帧靠稳定 key + `<TransitionGroup>` 产生 FLIP：`key` 柱（玫红）从 `keyIdx` 跨 `gap` 跳到 `j`，被越过的元素从 `j` 滑到 `keyIdx`，**两根同时平移**（跨距比插入排序更大，正是希尔「长跳」的观感）。
- **id 集合每步恒定**：移位只做跨 gap 交换、无增删，满足「每步 id 集合不变」断言，FLIP 前提成立。
- **防漂移**：`shell-sort.ts`（oracle）与 `buildSteps`（插桩）是同一标准希尔排序的两份实现；L3 用 oracle 末态**交叉校验** `buildSteps` 末步，并断言每个 gap-pass 后各子序列内部有序。

```ts
export const shellSortModule: AlgorithmModule<ShellExecPoint> = {
  title: '希尔排序',
  initialInput: () => [7, 6, 5, 10, 9, 8, 4, 3, 2, 1], // 与插入排序同款，便于横向对比
  buildSteps: buildShellSortSteps,
  sources: shellSortSources,
};
```

### 初始数据验算（`[7,6,5,10,9,8,4,3,2,1]`，n=10 → gap=5,2,1）

| 阶段  | 入                       | 出（gap-pass 后）          | 移位次数 |
| ----- | ------------------------ | -------------------------- | -------- |
| gap=5 | `[7,6,5,10,9,8,4,3,2,1]` | `[7,4,3,2,1,8,6,5,10,9]`   | 4        |
| gap=2 | `[7,4,3,2,1,8,6,5,10,9]` | `[1,2,3,4,6,5,7,8,10,9]`   | 6        |
| gap=1 | `[1,2,3,4,6,5,7,8,10,9]` | `[1,2,3,4,5,6,7,8,9,10]` ✓ | 2        |

末轮 `gap=1` **仅 2 次移位**即完成——前两轮大 gap 已把数组预排到接近有序，直观体现希尔比纯插入排序省力（同款数据下插入排序末轮要移位多得多）。这组数据将作为 `TC-SHELL-MOD-*` 的交叉校验夹具。

## 4. 四语言源码 + `lineMap`（`shell-sort.sources.ts`）

四份等价的「按组显式三层」希尔排序（TS / Python / Go / Rust），每份配一张 `lineMap: Record<ShellExecPoint, number>`。示意（TS）：

```ts
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
// lineMap(TS): gapChange:3, groupStart:4, outerLoop:5, compare:8, shift:9, insert:12, done:16
```

> 注：源码里的 `j` 是 **key 的当前位置**（对应 `buildSteps` 的 `keyIdx`），教科书惯用 `while (j >= gap && a[j-gap] > key)` 紧凑判停；`buildSteps` 另用变量 `j` 表示**蓝指针指向的被比较位**（= `keyIdx - gap`）——二者只是变量命名不同，不冲突。`lineMap` 只把执行点映射到**源码物理行**，与 `buildSteps` 内部命名无关：`compare`→`while` 条件行、`shift`→`a[j]=a[j-gap]` 右移行、`insert`→`a[j]=key` 落定行。两份实现结果一致，逐行映射成立。

各语言行号（同构，缩进 / 语法差异致行号不同）：

| Lang   | gapChange | groupStart | outerLoop | compare | shift | insert | done |
| ------ | --------- | ---------- | --------- | ------- | ----- | ------ | ---- |
| ts     | 3         | 4          | 5         | 8       | 9     | 12     | 16   |
| python | 4         | 5          | 6         | 9       | 10    | 12     | 14   |
| go     | 3         | 4          | 5         | 8       | 9     | 12     | 16   |
| rust   | 4         | 5          | 7         | 10      | 11    | 14     | 20   |

- **Python** 的 gap 循环用 `while gap > 0:`（`gap //= 2` 在体末），故 `gapChange` 落 `while` 行（第 4 行），`done` 落 `return a`（第 14 行）。
- **Rust** 关键差异（比插入排序更简洁）：希尔的 `j`（=`keyIdx`）满足 `j >= gap` 才进循环、`j -= gap` 后 `j >= 0`，**永不下溢**，故 `j` 可用 `usize`（**无需** 插入排序那样的 `i32` + `as usize`）。`outerLoop` 用 `while i < n {` 表达（第 7 行）；`done` 无 `return`，落最后的 `}`（第 20 行）。
- 行号正确性由 L3 兜底（每个 `ShellExecPoint` 行号 ∈ `[1, 行数]`，且实际出现的 point 都能映射）。

## 5. 可视化扩展

### `Bar.vue`

```ts
state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' | 'dimmed'; // 加 'dimmed'
```

```less
.bar.dimmed {
  opacity: 0.28;
} /* 非当前组淡出：保留柱形与数值可读，明显退到背景 */
```

现有 `TC-VIZ-BAR-*`（state 决定 class）不受影响——只是多一个合法取值。

### `BarsView.vue` — `stateOf` 加 `dimmed`（最低有效档）

```ts
function stateOf(
  index: number,
): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' | 'dimmed' {
  const e = props.emphasis;
  if (e.keyIndex === index) return 'key'; // 最高优先：key 跨 gap 滑动也保持玫红
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min';
  if (inCompare) return 'comparing';
  // 新增：当前组之外、且无任何其它强调 → 淡出（绝不掩盖活跃柱）
  if (e.groupMembers && e.groupMembers.length > 0 && !e.groupMembers.includes(index))
    return 'dimmed';
  return 'idle';
}
```

- **为什么 `dimmed` 必须置于最末**：它是「背景淡化」，只对旁观柱生效。当前组里正在比较 / 移动的柱（`key` 玫红、`comparing` 黄）以及任何 `sorted`/`swapped`/`min`，都在它**之前**返回——`dimmed` 绝不会盖住活跃强调。组内未参与本步的柱走 `idle`（亮绿），组外走 `dimmed`（淡）。
- 冒泡 / 选择 / 插入路径完全不变（`groupMembers` 恒 `undefined`，新分支短路不触发），`TC-VIZ-BARSVIEW-*` 全绿。新优先级链：`key > sorted > swapped > min > comparing > dimmed > idle`。

### 两指针

`pointers = [{id:'0',index:i}, {id:'1',index:j}]`，经 `ArrowTrack` 自动取 `colors[0]=red` / `colors[1]=blue`。`i` 红固定本轮取出位置、`j` 蓝按 `gap` 左跳；`key` 柱靠 `keyIndex` 玫红高亮，不占指针位。

> 配色语义分层：**箭头标「位置」（红 i / 蓝 j），柱子标「状态」（玫红 key / 黄 comparing / 绿 sorted / 淡 dimmed / …）**。沿用既定的「箭头色 ≠ 柱色」双系统。

## 6. 接入

`ShellSort.vue`：

```vue
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { shellSortModule } from '@/algorithms/shell-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="shellSortModule" />
</template>
```

`src/router/index.ts` 在 `insertion-sort` 之后加：

```ts
{
  path: '/docs/shell-sort',
  name: 'shell-sort',
  component: () => import('../views/Article/SortAlgorithm/ShellSort.vue'),
},
```

## 7. 对现有测试的影响

**本变更不 supersede 任何现有 Case**——全是新增 + 向后兼容加法。

| 现有件                                                                                           | 改动                            | 影响             |
| ------------------------------------------------------------------------------------------------ | ------------------------------- | ---------------- |
| `bubble-sort.module.spec.ts` / `selection-sort.module.spec.ts` / `insertion-sort.module.spec.ts` | 不动                            | **零影响**，全绿 |
| `Bar.spec.ts`（`TC-VIZ-BAR-*`）                                                                  | `state` 多一个合法值 `'dimmed'` | **零影响**，全绿 |
| `BarsView.spec.ts`（`TC-VIZ-BARSVIEW-*`）                                                        | `stateOf` 加分支，旧路径不触发  | **零影响**，全绿 |
| `CodePanel.spec.ts`（`TC-CODEPANEL-*`）                                                          | 不动（`point: string` 已就位）  | **零影响**，全绿 |

新增 Case 详单见 `test-cases.md`（writing-plans 阶段产出）：L3 希尔 oracle（含已序 / 逆序 / 重复 / 空 / 单元素 + gap 序列）+ 希尔 module（交叉校验 + 希尔不变量：各 gap-pass 后子序列有序、末步全序、id 恒定、`groupMembers` 与 gap/start 对应、`key` 跨 gap 单调左跳）；L4 `Bar`/`BarsView` 的 `dimmed` 态扩展（含「`dimmed` 不掩盖活跃强调」）+ 希尔视图；L5 端到端。

## 8. 推进顺序（建议）

① `types.ts` 加 `ShellExecPoint` + `groupMembers?`（先跑全量回归，证明向后兼容）→ ② `Bar`/`BarsView` 加 `dimmed` 态（L4，含「`dimmed` 置于最末、不掩盖活跃强调」专测）→ ③ `shell-sort.ts` oracle（L3，含逆序 / 已序 / 重复 / 空 / 单元素 + gap 序列断言）→ ④ `shell-sort.sources.ts` 四语言 + `lineMap` → ⑤ `shell-sort.module.ts` `buildSteps`（L3，交叉校验 + 希尔不变量）→ ⑥ `ShellSort.vue` + 路由 + 视图 L4 → ⑦ L5 端到端 → ⑧ 三索引 + roadmap 回写。每步以 `type-check` + 对应测试绿为关卡；①②额外以「冒泡 + 选择 + 插入全量回归绿」为硬关卡。

> 与插入排序相比，本次省去「`keyIndex`/`key` 态」从零设计（C-008 已完成），第①②步只加一个 union + 一个可选字段 + 一个淡化态；module 是插入 module 的「gap 泛化 + 套两层」，工程量集中在 `buildSteps` 的分组循环与 oracle 的不变量校验。

## 9. 风险与回滚

- **`dimmed` 优先级误置**：最大语义风险。若 `dimmed` 排在 `comparing`/`key` **之前**，会盖住当前组里正在比较 / 移动的活跃柱。必须置于 `stateOf` **最末**。L4 专测「当前组内 `comparing` 柱仍取 `comparing`、`key` 柱仍取 `key`，组外柱才 `dimmed`」。
- **循环条件越组**：`j >= start` 写成 `j >= 0` 会跨组比较、排错；写成 `j >= gap` 在 `start>0` 时会漏比组首。L3 不变量「每个 gap-pass 后各子序列内部有序」+ 末步交叉校验兜底。
- **Rust `usize` 边界**：希尔 `j` 满足 `j >= gap` 才进循环、`j -= gap` 后 `j >= 0`，不下溢，用 `usize`；`a[j-gap]` 在 `j>=gap` 保护下安全。（这是希尔源码比插入排序简洁之处——无需 `i32`。）写错会编译不过，但源码是静态字符串、不参与运行，靠人工 + L3 行号校验把关。
- **`lineMap` 与源码漂移**：希尔源码一改、行号即错。L3 校验「每个 `ShellExecPoint` 行号合法」兜底；`lineMap` 与 `code` 同文件相邻。
- **步骤数偏多**：`gapChange`/`groupStart` 标记步 + 三层循环，10 元素总步数比插入排序多，但仍 O(n²) 量级。`usePlayer` 按 `index` 回放，无性能 / 竞态问题；初始数据 10 个元素，规模可控。
- **`dimmed` 辨识度**：`opacity: 0.28` 暂定，明 / 暗主题肉眼复核，必要时微调（不影响逻辑与测试）。
- **改动隔离**：算法三件 + `ShellSort.vue` + 路由是纯新增，可独立回滚；`Bar`/`BarsView`/`types` 的扩展均为加法，冒泡 / 选择 / 插入路径不变。回滚仅需还原三处加法 + 删新增文件。
