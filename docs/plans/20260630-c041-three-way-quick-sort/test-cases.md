# 测试用例：三路快排 3-way Quicksort（C-20260630-041）

> Status: verified
> Stable ID: C-20260630-041
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（three-way-quick.module）/ L4（三路快排页）/ L5（e2e）
> 命名空间：`TC-3WQUICK-MOD-*`、`TC-VIEW-3WQUICK-*`、`TC-E2E-3WQUICK-*`；**改** `TC-HOOK-02-4`

## L3 —— `three-way-quick.module`（`src/algorithms/three-way-quick.module.spec.ts`）

固定 `BASE = [5,3,8,3,5,8,3,5]`；oracle `threeWayQuickSortTrace`。

| 用例 ID           | 场景                | 期望                                                                                             |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| TC-3WQUICK-MOD-01 | 末步有序            | 末步 `done`，值序列 = `threeWayQuickSortTrace(BASE).result` = `[3,3,3,5,5,5,8,8]`                |
| TC-3WQUICK-MOD-02 | 不改入参            | `BASE` 不变                                                                                      |
| TC-3WQUICK-MOD-03 | 位置键稳定          | 每步 `array` key 集合恒 = `{'0'..'7'}`                                                           |
| TC-3WQUICK-MOD-04 | 步合法 + 带区间栈   | 每步 `point ∈ {pop,pivotSelect,compare,less,greater,equal,push,done}` 且带 `stack`               |
| TC-3WQUICK-MOD-05 | 三路分支守恒        | `#compare == #less + #greater + #equal`（每次比较恰好走一个分支）                                |
| TC-3WQUICK-MOD-06 | 弹/选/压守恒        | `#pop == #pivotSelect == #push`（每弹一个区间 → 一次选基准 + 一次压栈）                          |
| TC-3WQUICK-MOD-07 | 首划分基准          | 首个 `pivotSelect` 步基准 = a[lo] = `5`（vars/caption 含 pivot=5）                               |
| TC-3WQUICK-MOD-08 | 首划分后三段 + 钉死 | 首个 `push` 步 `array` 值 = `[3,3,3,5,5,5,8,8]` 且 `emphasis.sortedIndices` 含 3,4,5（中段钉死） |
| TC-3WQUICK-MOD-09 | 三分支均出现        | 步序列含 `less`、`greater`、`equal` 各至少一次                                                   |
| TC-3WQUICK-MOD-10 | done 步             | done 步 `emphasis.sortedIndices` 长度 = n、`pointers===[]`                                       |
| TC-3WQUICK-MOD-11 | 三指针              | 存在某 `compare` 步同时含 lt(`'3'`)/i(`'1'`)/gt(`'0'`) 三指针                                    |
| TC-3WQUICK-MOD-12 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                    |
| TC-3WQUICK-MOD-13 | module 元信息       | `title==='三路快排'`、`initialInput()` = BASE                                                    |

## L4 —— `ThreeWayQuickSort` 视图（`src/views/Article/SortAlgorithm/ThreeWayQuickSort.spec.ts`，全模板）

参照 BucketSort.spec：mock `useHighlighter`、`createPinia()`。

| 用例 ID            | 场景               | 期望                                                      |
| ------------------ | ------------------ | --------------------------------------------------------- |
| TC-VIEW-3WQUICK-01 | 正文 + 播放器      | 含 `Article`、h1 文本含「三路快排」；含 `AlgorithmPlayer` |
| TC-VIEW-3WQUICK-02 | 区间栈 + 主轨 8 柱 | 渲染 `StackView`；主轨 8 个 `Bar`；`.counter` 含 `1 / `   |

## L5 —— 三路快排页 e2e（`e2e/three-way-quick-sort.e2e.ts`）

| 用例 ID           | 场景          | 操作                                                 | 期望                                                                                                                 |
| ----------------- | ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-3WQUICK-01 | 全模板 + 互动 | 访问 `/docs/three-way-quick-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「三路快排」；区间栈 `.stack-view` 可见；主轨 8 `.bar-cell`；拖末步主轨值 = `[3,3,3,5,5,5,8,8]` |

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                            |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 10→**11**（新增「三路快排」） |

## 其它回归

- 既有 10 排序 + 15 结构 + 图算法 + 播放器（含 stack/count/aux/tree/bucket 各轨 Case）：现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- 仅追加 `ThreeWayExecPoint` 类型 + 复用 StackView/BarsView，不改任何轨组件/AlgorithmPlayer → 既有 Case 全绿。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-06-30 执行）

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **865 passed**（125 文件，较 C-040 的 850 +15；本变更新增 16 Case，原 1 个 TC-HOOK-02-4 由「排序 10」改「排序 11」故净增 15）；e2e **35 passed**（+1 TC-E2E-3WQUICK-01）；format/lint/type-check exit 0。
- 新增 16 Case 全绿：three-way-quick.module 13（TC-3WQUICK-MOD-01..13）+ ThreeWayQuickSort 视图 2（TC-VIEW-3WQUICK-01/02）+ e2e 1（TC-E2E-3WQUICK-01）；改 TC-HOOK-02-4（排序 10→11）通过。
- 覆盖率（聚合）：statements **93.39%**、branches **90.65%**、functions **94.12%**、lines **94.26%**——均超门槛。
- 零回归：既有 10 排序 + 15 结构 + 图算法 + 播放器各轨 Case 全部通过（仅追加 ThreeWayExecPoint 类型，复用 StackView/BarsView，不改任何轨组件/AlgorithmPlayer）。
- 真机自检（dev /docs/three-way-quick-sort，reload 后）：初始正文 h1「三路快排 3-way Quicksort」+ 主轨 8 柱 + 区间栈 StackView + counter 1/36；中段（step 24）lt 绿/i 蓝/gt 红三指针 + 区间栈 a[6,7] + 主轨 [3,3,3,5,5,5,8,8]；末步 36/36 主轨 **[3,3,3,5,5,5,8,8] 升序**、caption「完成，全部有序」。
- 结论：**通过**，进入回写与提交。
