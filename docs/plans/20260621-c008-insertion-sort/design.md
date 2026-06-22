# 设计：插入排序动画（接入算法播放器框架）

> Status: verified
> Stable ID: C-20260621-008
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-21
> Last reviewed: 2026-06-22
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007
> Related tests: 见 §7「对现有测试的影响」
> Related requirement: requirements.md

## 总体方案

**复用 C-006 播放器框架 + C-007 已铺好的泛型化地基，只为插入排序加纯加法扩展。** 框架与算法的契约仍是预计算的「胖步骤」`Step[]`：插入排序实现一个 `AlgorithmModule`，外壳按 `index` 回放，单步 / 暂停 / 后退 / 拖动全是「移动下标」——交互模型一字不改。

相比选择排序，本次**更省**：执行点泛型化（`Step<P>` / `AlgorithmModule<P>`）、`CodePanel` 的 `point: string` 已由 C-007 完成，**本次 `types.ts` 只是加法**，无任何重构。

复用矩阵：

| 件                                                                                     | 角色                                    | 插入排序如何对待                                             |
| -------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| `usePlayer.ts` / `TransportControls.vue` / `AlgorithmPlayer.vue` / `VariablePanel.vue` | 传输状态机 + 控制条 + 装配壳 + 变量面板 | **零改动**，原样复用                                         |
| `CodePanel.vue`                                                                        | 多语言 Shiki 高亮 + 当前行              | **零改动**（`point: string` 已由 C-007 放宽）                |
| `ArrowTrack.vue` / `Arrow.vue`                                                         | 雪佛龙指针                              | **零改动**，两指针取 `colors[0/1]`                           |
| `Bar.vue`                                                                              | 单柱渲染                                | 加 `'key'` 态 + `.bar.key` 玫红配色                          |
| `BarsView.vue`                                                                         | 柱状可视化                              | `stateOf` 加 `keyIndex` 分支（最高优先级）                   |
| `types.ts`                                                                             | 数据契约                                | 加 `InsertionExecPoint` + `StepEmphasis.keyIndex?`（纯加法） |

插入排序新增的，只有 `src/algorithms/insertion-sort.*` 三件 + `InsertionSort.vue` 薄壳 + 一条路由。

## 1. 数据契约扩展（`src/components/player/types.ts`）— 纯加法

```ts
/** 插入排序的执行点（shift：已排序元素右移腾位；insert：key 落定） */
export type InsertionExecPoint = 'outerLoop' | 'compare' | 'shift' | 'insert' | 'done';

export interface StepEmphasis {
  comparing?: [number, number]; // 正在比较的两个下标
  swapped?: boolean; // 本步是否交换
  sortedFrom?: number; // 冒泡：右侧 [sortedFrom, n) 已就位
  minIndex?: number; // 选择：当前已知最小值下标 → min 态
  sortedUpTo?: number; // 选择 / 插入：左侧 [0, sortedUpTo) 已就位
  keyIndex?: number; // 插入：被取出的 key 柱当前下标 → key 态（最高优先）
}
```

**为什么零风险**：泛型化在 C-007 已完成，`AlgorithmModule<P>` / `Step<P>` / `LangSource<P>` 已就位，本次只加一个 `InsertionExecPoint` union（`⊆ string`，与既有协变契约自洽）和一个**可选** `keyIndex?` 字段。冒泡 / 选择不设 `keyIndex`，其值恒 `undefined`，新柱态分支不触发。`InsertionSort.vue` 传 `insertionSortModule: AlgorithmModule<InsertionExecPoint>` 给 `AlgorithmPlayer` 的 `module: AlgorithmModule`（默认 `P=string`）成立。

## 2. 目录与文件

```
src/algorithms/
  insertion-sort.ts            ← 新增：纯算法 oracle（对标 selection-sort.ts）
  insertion-sort.module.ts     ← 新增：插桩重走 + buildSteps + insertionSortModule
  insertion-sort.sources.ts    ← 新增：四语言源码 + lineMap
  bubble-sort.* / selection-sort.*  ← 不动

src/components/
  Bar.vue                      ← 改：state 加 'key' + .bar.key 配色
  BarsView.vue                 ← 改：stateOf 加 keyIndex 分支（最高优先级）
  player/types.ts              ← 改：加 InsertionExecPoint + StepEmphasis.keyIndex?

src/views/Article/SortAlgorithm/
  InsertionSort.vue            ← 新增：<AlgorithmPlayer :module="insertionSortModule" />

src/router/index.ts            ← 改：新增 insertion-sort 懒加载路由
```

菜单（`Docs/Menu/hooks.ts:56-58`）与首页网格（`Home/Main/hooks.ts:90-95`）已含 `insertion-sort` 条目与 `insertion.svg` 图标，**无需改动**。

## 3. 插入排序算法模块

### 执行点语义与行映射目标

| ExecPoint   | 含义                                              | 指针 / 强调                           |
| ----------- | ------------------------------------------------- | ------------------------------------- |
| `outerLoop` | 进入第 `i` 轮，取出 `key = a[i]`，`j ← i-1`       | i=i, j=i-1, `keyIndex=i`              |
| `compare`   | 比较 `a[j]` 与 `key`                              | `comparing:[j, keyIndex]`, `keyIndex` |
| `shift`     | `a[j] > key`，`a[j]` 右移、`key` 左滑（相邻交换） | `keyIndex`（左移后的新位）            |
| `insert`    | `a[j] <= key` 或 `j<0`，`key` 落定于 `j+1`        | `keyIndex`（插入点）                  |
| `done`      | 排序完成                                          | 全部 `sorted`                         |

### `buildSteps` 骨架（插桩重走，逐行粒度）

```
work = input.map((v, i) => [String(i), v]);  n = work.length
shiftCount = 0;  sortedUpTo = 1        // [0, sortedUpTo) 已（相对）就位；单元素天然有序
两指针 id：'0'=i(红) '1'=j(蓝)
keyIdx 跟踪 key 柱当前下标（随移位左移）
每个 push 带 { sortedUpTo, ...emphasis }，vars = [n, i, key, j, a[j], shiftCount, sortedUpTo]

if n <= 1: sortedUpTo = n; push('done'); return

for i in 1..n-1:
  key = work[i][1];  keyIdx = i;  j = i - 1
  push('outerLoop', i, j, {keyIndex: keyIdx}, `第 ${i} 轮：取出 key=${key}`)
  while j >= 0:
    push('compare', i, j, {comparing:[j, keyIdx], keyIndex: keyIdx},
         `a[${j}]=${work[j][1]} ${work[j][1] > key ? '>' : '≤'} key=${key}`)
    if work[j][1] > key:
      [work[j], work[keyIdx]] = [work[keyIdx], work[j]]   // keyIdx==j+1，相邻交换：key 左滑、a[j] 右让
      keyIdx = j;  shiftCount++
      push('shift', i, j, {keyIndex: keyIdx}, `${work[keyIdx+1][1]} 右移，key 滑到 ${keyIdx}`)
      j--
    else:
      break                                                // a[j] <= key，compare 帧已展示「≤」，停
  push('insert', i, keyIdx, {keyIndex: keyIdx}, `key=${key} 插入位置 ${keyIdx}`)
  sortedUpTo = i + 1
sortedUpTo = n
push('done', n-1, n-1, {}, '完成')
```

- 指针下标越界（如 `j` 退到 `-1`）一律 `clampIdx`（沿用选择 module 的做法）；`vars` 里 `a[j]` 用 `work[j]?.[1] ?? '-'`。
- `shift` 帧靠稳定 key + `<TransitionGroup>` 产生 FLIP：`key` 柱（玫红）从 `j+1` 滑到 `j`，被越过的大元素从 `j` 滑到 `j+1`，**两根同时平移**。按柱态优先级，`key` 那根取 `key` 态、保持玫红。
- **id 集合每步恒定**：移位只做相邻交换、无增删，满足 `TC-INSERTION-MOD-*` 的「每步 id 集合不变」断言，FLIP 前提成立。
- **防漂移**：`insertion-sort.ts`（oracle）与 `buildSteps`（插桩）是同一标准插入排序的两份实现；L3 用 oracle 末态**交叉校验** `buildSteps` 末步。

## 4. 四语言源码 + `lineMap`（`insertion-sort.sources.ts`）

四份等价的标准插入排序（TS / Python / Go / Rust），每份配一张 `lineMap: Record<InsertionExecPoint, number>`。示意（TS）：

```ts
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
// lineMap(TS): outerLoop:3, compare:6, shift:7, insert:10, done:12
```

各语言行号（同构，缩进 / 语法差异致末尾行号不同）：

| Lang   | outerLoop | compare | shift | insert | done |
| ------ | --------- | ------- | ----- | ------ | ---- |
| ts     | 3         | 6       | 7     | 10     | 12   |
| python | 3         | 6       | 7     | 9      | 10   |
| go     | 3         | 6       | 7     | 10     | 12   |
| rust   | 3         | 6       | 7     | 10     | 12   |

- `compare` 落在 `while (j >= 0 && a[j] > key)` 条件行；`shift` 落在 `a[j+1] = a[j]` 右移行；`insert` 落在 `a[j+1] = key` 落定行。
- **Rust 注意**：`j` 会递减到 `-1`，须用 `i32`（`let mut j = i as i32 - 1`），索引时 `as usize`——与选择排序的 `usize` 不同。`done` 无 `return`，落最后的 `}`。
- 行号正确性由 L3 兜底（每个 `InsertionExecPoint` 行号 ∈ `[1, 行数]`）。

## 5. 可视化扩展

### `Bar.vue`

```ts
state: 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key'; // 加 'key'
```

```less
.bar.key {
  background-color: #e07b9a;
} /* 玫红，区分 idle 青绿 / comparing 黄 / swapped 橙 / sorted 绿 / min 紫 */
```

现有 `TC-VIZ-BAR-*`（state 决定 class）不受影响——只是多一个合法取值。

### `BarsView.vue` — `stateOf` 优先级（`key` 置顶）

```ts
function stateOf(index: number): 'idle' | 'comparing' | 'swapped' | 'sorted' | 'min' | 'key' {
  const e = props.emphasis;
  if (e.keyIndex === index) return 'key'; // 新增，最高优先：key 滑入已排序区也保持玫红
  const sortedRight = e.sortedFrom !== undefined && index >= e.sortedFrom;
  const sortedLeft = e.sortedUpTo !== undefined && index < e.sortedUpTo;
  if (sortedRight || sortedLeft) return 'sorted';
  const inCompare = !!e.comparing && (index === e.comparing[0] || index === e.comparing[1]);
  if (inCompare && e.swapped) return 'swapped';
  if (e.minIndex === index) return 'min';
  if (inCompare) return 'comparing'; // 另一根（j）才是 comparing 黄
  return 'idle';
}
```

- **为什么 `key` 必须压过 `sorted`**：`key` 一路向左滑动，会进入左侧 `[0, i)` 已排序区；若 `sorted` 优先，`key` 会变绿、丢失踪迹。故 `key` 置顶。
- 冒泡 / 选择路径完全不变（`keyIndex` 恒 `undefined`，`undefined === index` 恒 false，新分支不触发），`TC-VIZ-BARSVIEW-*` 全绿。新优先级链：`key > sorted > swapped > min > comparing > idle`。

### 两指针

`pointers = [{id:'0',index:i}, {id:'1',index:j}]`，经 `ArrowTrack` 自动取 `colors[0]=red` / `colors[1]=blue`。`key` 柱靠 `keyIndex` 玫红高亮，不占指针位。

> 配色语义分层：**箭头标「位置」（红 i / 蓝 j），柱子标「状态」（玫红 key / 黄 comparing / 绿 sorted / ...）**。沿用既定的「箭头色 ≠ 柱色」双系统。

## 6. 接入

`InsertionSort.vue`：

```vue
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { insertionSortModule } from '@/algorithms/insertion-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="insertionSortModule" />
</template>
```

`src/router/index.ts` 在 `selection-sort` 之后加：

```ts
{
  path: '/docs/insertion-sort',
  name: 'insertion-sort',
  component: () => import('../views/Article/SortAlgorithm/InsertionSort.vue'),
},
```

## 7. 对现有测试的影响

**本变更不 supersede 任何现有 Case**——全是新增 + 向后兼容加法。

| 现有件                                                         | 改动                           | 影响             |
| -------------------------------------------------------------- | ------------------------------ | ---------------- |
| `bubble-sort.module.spec.ts` / `selection-sort.module.spec.ts` | 不动                           | **零影响**，全绿 |
| `Bar.spec.ts`（`TC-VIZ-BAR-*`）                                | `state` 多一个合法值 `'key'`   | **零影响**，全绿 |
| `BarsView.spec.ts`（`TC-VIZ-BARSVIEW-*`）                      | `stateOf` 加分支，旧路径不触发 | **零影响**，全绿 |
| `CodePanel.spec.ts`（`TC-CODEPANEL-*`）                        | 不动（`point: string` 已就位） | **零影响**，全绿 |

新增 Case 详单见 `test-cases.md`（writing-plans 阶段产出）：L3 插入 oracle（含稳定性）+ 插入 module（交叉校验 + 插入不变量 + `key` 单调左移 + id 恒定 + 四语言 `lineMap`）；L4 `Bar`/`BarsView` 的 `key` 态扩展（含「`key` 压过 `sorted`」）+ 插入视图；L5 端到端。

## 8. 推进顺序（建议）

① `types.ts` 加 `InsertionExecPoint` + `keyIndex?`（先跑全量回归，证明向后兼容）→ ② `insertion-sort.ts` oracle（L3，含**稳定性**用例）→ ③ `insertion-sort.sources.ts` 四语言 + `lineMap` → ④ `insertion-sort.module.ts` `buildSteps`（L3，交叉校验 + 插入不变量 + `key` 单调左移 + id 恒定）→ ⑤ `Bar`/`BarsView` 扩展 `key` 态（L4，含「`key` 压过 `sorted`」专测）→ ⑥ `InsertionSort.vue` + 路由 + 视图 L4 → ⑦ L5 端到端 → ⑧ 三索引 + roadmap 回写。每步以 `type-check` + 对应测试绿为关卡。

> 与选择排序相比，本次省去「泛型化大重构」与「`CodePanel` 放宽」（C-007 已完成），第①步地基更轻——只加一个 union + 一个可选字段。

## 9. 风险与回滚

- **`key` 优先级误置**：最大语义风险。`key` 必须压过 `sorted`，否则滑入已排序区变绿。L4 专测「`keyIndex` 那根取 `key` 态，即便落在 `sortedUpTo` 区间内」。
- **Rust `j` 负数**：`j` 递减到 `-1`，须 `i32` + `as usize` 索引；写错会编译不过（但这是静态源码字符串，不参与运行，靠人工 + L3 行号校验把关）。
- **`lineMap` 与源码漂移**：插入排序源码一改、行号即错。L3 校验「每个 `InsertionExecPoint` 行号合法」兜底；`lineMap` 与 `code` 同文件相邻。
- **步骤数偏多**：逆序数组每轮移位至多 `i` 次，总步骤数比选择排序多（O(n²) 帧）。`usePlayer` 按 `index` 回放，无性能 / 竞态问题；初始数据 10 个元素，规模可控。
- **`key` 配色辨识度**：`#e07b9a` 暂定，明 / 暗主题肉眼复核，必要时微调（不影响逻辑与测试）。
- **改动隔离**：算法三件 + `InsertionSort.vue` + 路由是纯新增，可独立回滚；`Bar`/`BarsView`/`types` 的扩展均为加法，冒泡 / 选择路径不变。回滚仅需还原三处加法 + 删新增文件。
