# 测试用例：基数排序 Radix Sort（C-20260630-039）

> Status: verified
> Stable ID: C-20260630-039
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（radix-sort.module 纯逻辑）/ L4（RadixSort 视图）/ L5（基数排序页 e2e）
> 命名空间：`TC-RADIX-MOD-*`、`TC-VIEW-RADIX-*`、`TC-E2E-RADIX-*`；**改** `TC-HOOK-02-4`（Menu 排序计数）

## L3 —— `radix-sort.module` 算法步骤（`src/algorithms/radix-sort.module.spec.ts`）

固定输入 `BASE = [42,7,25,63,18,31,56,9]`，LSD 2 轮（个位、十位）；oracle `radixSortTrace`。参照 `counting-sort.module.spec` 风格。

| 用例 ID         | 场景                       | 期望                                                                                                   |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| TC-RADIX-MOD-01 | 末步有序                   | 末步 `point==='done'`，值序列 = `radixSortTrace(BASE).result` = `[7,9,18,25,31,42,56,63]`              |
| TC-RADIX-MOD-02 | 不改入参                   | `buildRadixSortSteps(BASE)` 后 `BASE` 不变                                                             |
| TC-RADIX-MOD-03 | 位置键稳定                 | 每步 `array` 的 key 集合恒 = `{'0'..'7'}`（FLIP 前提）                                                 |
| TC-RADIX-MOD-04 | 步合法 + 带桶轨            | 每步 `point ∈ {passStart,distribute,collect,done}` 且带 `count`（桶轨）                                |
| TC-RADIX-MOD-05 | 步数结构                   | distribute 步 16、collect 步 16、passStart 步 2、done 步 1（共 35）；轮数 2                            |
| TC-RADIX-MOD-06 | 第 1 轮分桶计数            | 第 1 轮（个位）最后一个 distribute 步 `count.buckets` = `[0,1,1,1,0,1,1,1,1,1]`                        |
| TC-RADIX-MOD-07 | distribute 读游标 + 活跃桶 | 第 1 轮首个 distribute（a=42、个位 2）`count.activeBucket===2`、`pointers` 含读游标 id `'1'`           |
| TC-RADIX-MOD-08 | 第 1 轮收集结果            | 第 1 轮（个位）最后一个 collect 步 `array` 值 = `[31,42,63,25,56,7,18,9]`；collect 步含写游标 id `'3'` |
| TC-RADIX-MOD-09 | done 步                    | done 步 `emphasis.sortedUpTo===n`、`pointers===[]`                                                     |
| TC-RADIX-MOD-10 | 四语言齐备                 | `radixSortSources` 含 ts/python/go/rust 四语言                                                         |
| TC-RADIX-MOD-11 | 行号在范围                 | 每语言每个 point 的 `lineMap[point]` 在该语言源码行数内（1..lines）                                    |
| TC-RADIX-MOD-12 | point 可映射行号           | 实际产出的所有 point 都在每语言的 `lineMap` 中有行号                                                   |

## L4 —— `RadixSort` 视图（`src/views/Article/SortAlgorithm/RadixSort.spec.ts`）

参照 `CountingSort.spec`：mock `useHighlighter`、`createPinia()`。

| 用例 ID          | 场景             | 期望                                                        |
| ---------------- | ---------------- | ----------------------------------------------------------- |
| TC-VIEW-RADIX-01 | 挂载渲染播放器   | 含 `AlgorithmPlayer`                                        |
| TC-VIEW-RADIX-02 | 桶轨 + 主轨 8 柱 | 渲染 `CountView`；主轨 8 个 `Bar`；`.counter` 文本含 `1 / ` |

## L5 —— 基数排序页 e2e（`e2e/radix-sort.e2e.ts`）

| 用例 ID         | 场景            | 操作                                       | 期望                                                                                                                                  |
| --------------- | --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-RADIX-01 | 页面可达 + 互动 | 访问 `/docs/radix-sort`；`.scrub` 拖到末步 | 主轨 8 `.bar-cell` + `.counter` 含 `1 / `；桶轨 `.count-view` 可见、`.count-bucket` 10 个；拖到末步主轨值 = `[7,9,18,25,31,42,56,63]` |

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                          |
| ------------ | ----------------------------------- | --------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 8→**9**（新增「基数排序」） |

> 注：`Home/Main/hooks.spec.ts` 的 TC-HOOK-01-1 只断言 `data[1].title==='经典排序算法'`、不查排序 children 数 → **无需改**。

## 其它回归

- 既有 8 排序（含计数排序）+ 15 结构 + 图算法 + 播放器 + 骨架：现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- **CountView / AlgorithmPlayer / usePlayer / types.ts 既有内容零改动**（types.ts 仅 additive 加 `RadixExecPoint`）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位（参考既有 ~90%）。

## 自测报告（2026-06-30）

- 执行命令：`pnpm format` → `pnpm format:check` / `pnpm lint:check` / `pnpm type-check` / `pnpm test:unit run --coverage` / `pnpm exec playwright test`
- 新增用例：L3 module 13（TC-RADIX-MOD-01..13，含 module 元信息）+ L4 视图 2（TC-VIEW-RADIX-01/02）+ L5 1（TC-E2E-RADIX-01）= **16 新**；改 1 处 TC-HOOK-02-4（排序 8→9）。
- 结果：**全绿**。单测 `829 passed`（120 文件）；e2e `33 passed`（含 TC-E2E-RADIX-01）。
- 覆盖率（聚合）：Statements 93.26% / Branches 90.47% / Functions 94.09% / Lines 94.16%——均高于门槛（≥70% / ≥60%）。radix-sort.module 由 13 条 L3 全量覆盖；radix-sort.ts 83.33%（空输入分支未触发，BASE 非空，聚合达标）；RadixSort.vue 极简挂载渲染。
- 真机自检（Playwright 截图，localhost:5173 `/docs/radix-sort`）：初始主轨 8 柱（42,7,25,63,18,31,56,9）+ 桶轨 10 桶（0–9，passStart 全空）+ caption「第 1 轮：按个位…」+ 四语言代码 tab；拖到末步（34）主轨 8 柱**全部转绿、值 7,9,18,25,31,42,56,63 完全有序** + caption「2 轮分配收集完毕，全部有序」。
- 零回归：CountView/AlgorithmPlayer/usePlayer/types.ts 既有内容零改动（types.ts 仅 additive 加 RadixExecPoint）；既有 8 排序 + 15 结构 + 图算法全绿；仅 TC-HOOK-02-4 排序 8→9。
- 结论：达成验收口径，**verified**；排序大类 8→9，线性排序三件套补到第三件（计数 + 基数，差桶排序 S2）。
