# 测试用例：计数排序动画

> Status: verified
> Stable ID: C-20260624-014
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级                              | 文件                                                         | 编号区间                  | 数量 |
| --------------------------------- | ------------------------------------------------------------ | ------------------------- | ---- |
| L3 oracle                         | `src/algorithms/counting-sort.spec.ts`                       | `TC-COUNT-ALGO-01..07`    | 7    |
| L3 module（buildSteps + sources） | `src/algorithms/counting-sort.module.spec.ts`                | `TC-COUNT-MOD-01..16`     | 16   |
| L4 BarsView dimFrom               | `src/components/BarsView.spec.ts`（扩展）                    | `TC-VIZ-BARSVIEW-21..22`  | 2    |
| L4 CountView 组件                 | `src/components/CountView.spec.ts`（新）                     | `TC-VIZ-COUNTVIEW-01..06` | 6    |
| L4 外壳条件渲染                   | `src/components/player/AlgorithmPlayer.spec.ts`（扩展）      | `TC-PLAYER-COUNT-01..03`  | 3    |
| L4 视图薄壳                       | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`（新） | `TC-VIEW-COUNT-01..02`    | 2    |
| L5 e2e                            | `e2e/counting-sort.e2e.ts`（新）                             | `TC-E2E-COUNT-01`         | 1    |

**合计新增 37 个 Case。**

**回归（不新增、必须仍绿）**：冒泡 / 选择 / 插入 / 希尔 / 归并 / 快速 / 堆的全部现有 Case（含 `Bar.spec` / `BarsView.spec` / `AlgorithmPlayer.spec` / `AuxView.spec` / `StackView.spec` / `TreeView.spec`）—— 由全门禁 `pnpm test:unit run` 证明向后兼容。

## L3 — oracle（`TC-COUNT-ALGO-*`）

| TC               | 描述                            | 预期                               |
| ---------------- | ------------------------------- | ---------------------------------- |
| TC-COUNT-ALGO-01 | result 升序                     | === 内置 sort                      |
| TC-COUNT-ALGO-02 | counts/min/max 正确（含空桶=0） | counts=`[3,1,2,2,0,2]`、min1、max6 |
| TC-COUNT-ALGO-03 | sum(counts) = n                 | =10                                |
| TC-COUNT-ALGO-04 | 由 counts 展开可重建 result     | === result                         |
| TC-COUNT-ALGO-05 | 不修改入参                      | 入参不变                           |
| TC-COUNT-ALGO-06 | 空 / 单元素                     | counts/result 正确                 |
| TC-COUNT-ALGO-07 | 重复 / 已序 / 逆序 / 全等值     | === 内置 sort                      |

## L3 — module buildSteps（`TC-COUNT-MOD-01..13`）

| TC              | 描述                                            | 预期                      |
| --------------- | ----------------------------------------------- | ------------------------- |
| TC-COUNT-MOD-01 | 空只产 done(sortedUpTo=0)；单元素末步 done 升序 | 一致                      |
| TC-COUNT-MOD-02 | 末步升序 = oracle result                        | `[1,1,1,2,3,3,4,4,6,6]`   |
| TC-COUNT-MOD-03 | 每步 id 集合恒等初始（FLIP）                    | 一致                      |
| TC-COUNT-MOD-04 | 不修改入参                                      | 入参不变                  |
| TC-COUNT-MOD-05 | point 合法、每步带 count 快照                   | 一致                      |
| TC-COUNT-MOD-06 | 计数阶段末步桶 = oracle counts                  | `[3,1,2,2,0,2]`           |
| TC-COUNT-MOD-07 | count 步 activeBucket = a[i]-min                | 逐步一致                  |
| TC-COUNT-MOD-08 | 回写 sortedUpTo 单调不减、done=n                | 递增、=10                 |
| TC-COUNT-MOD-09 | 每条 writeBack 当前桶余量递减                   | 严格减                    |
| TC-COUNT-MOD-10 | 空桶（值5）有 bucketStart 无后续 writeBack      | 下一步非 writeBack        |
| TC-COUNT-MOD-11 | done 步 sortedUpTo=n、桶全0、无游标             | 一致                      |
| TC-COUNT-MOD-12 | count 蓝读游标(id1)、回写绿写游标(id3)          | 一致                      |
| TC-COUNT-MOD-13 | writeBack 步 dimFrom=写入位+1、活跃格不提前绿   | sortedUpTo=w、dimFrom=w+1 |

## L3 — module sources（`TC-COUNT-MOD-14..16`）

| TC              | 描述                            | 预期                  |
| --------------- | ------------------------------- | --------------------- |
| TC-COUNT-MOD-14 | 四门语言齐备                    | {ts,python,go,rust}   |
| TC-COUNT-MOD-15 | 每门语言每个 point 行号在范围内 | 1 ≤ lineMap[p] ≤ 行数 |
| TC-COUNT-MOD-16 | 实际出现的 point 都能映射到行   | number                |

## L4 — BarsView dimFrom（扩展现有 spec）

| TC                 | 描述                                           | 预期                                            |
| ------------------ | ---------------------------------------------- | ----------------------------------------------- |
| TC-VIZ-BARSVIEW-21 | dimFrom 连续后缀淡化（index≥dimFrom → dimmed） | index≥dimFrom 取 dimmed、其余不受影响           |
| TC-VIZ-BARSVIEW-22 | dimFrom 与 sortedUpTo 共存                     | [0,s) sorted、[s,dimFrom) idle、≥dimFrom dimmed |

## L4 — CountView（`TC-VIZ-COUNTVIEW-*`，新组件）

| TC                  | 描述                          | 预期               |
| ------------------- | ----------------------------- | ------------------ |
| TC-VIZ-COUNTVIEW-01 | 渲染桶数 = buckets.length     | `.count-bucket` 数 |
| TC-VIZ-COUNTVIEW-02 | 每桶单元格数 = buckets[b]     | `.count-cell` 数   |
| TC-VIZ-COUNTVIEW-03 | 桶底值标签 = b + min          | 文本正确           |
| TC-VIZ-COUNTVIEW-04 | activeBucket 桶带 .active     | 仅该桶 active      |
| TC-VIZ-COUNTVIEW-05 | 空桶渲染 0 格、仍显值与计数 0 | 0 个 cell、计数 0  |
| TC-VIZ-COUNTVIEW-06 | 桶顶计数数字 = buckets[b]     | 文本正确           |

## L4 — AlgorithmPlayer 条件渲染（扩展）

| TC                 | 描述                                  | 预期                      |
| ------------------ | ------------------------------------- | ------------------------- |
| TC-PLAYER-COUNT-01 | 带 count 的 module → 渲染 CountView   | 存在 CountView            |
| TC-PLAYER-COUNT-02 | 不带 count（冒泡）→ 不渲染            | 无 CountView              |
| TC-PLAYER-COUNT-03 | 带 tree 不带 count → 不渲染 CountView | 无 CountView、有 TreeView |

## L4 — 视图薄壳（`TC-VIEW-COUNT-*`）

| TC               | 描述                                          | 预期                            |
| ---------------- | --------------------------------------------- | ------------------------------- |
| TC-VIEW-COUNT-01 | 挂载渲染 AlgorithmPlayer + countingSortModule | 标题「计数排序」、默认停第 0 步 |
| TC-VIEW-COUNT-02 | 页面存在计数桶轨 CountView                    | CountView 渲染                  |

## L5 — e2e（`TC-E2E-COUNT-01`）

| TC              | 描述                                                                                                     | 预期       |
| --------------- | -------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-COUNT-01 | 导航 / 默认暂停 / 桶轨可见 / 计数填桶 / 回写写游标领绿前缀 / 空桶跳过 / 跳末升序全绿 / 重置 / 四语言切换 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。新增算法模块（oracle + module + sources）纯函数/纯数据，目标行覆盖 ≥90%；CountView 布局（多桶/空桶/活动桶分支）全覆盖。

## 变更历史

- 2026-06-24：创建并落地。实际新增 37 个 Case（oracle 7 + module 16 + BarsView 2 + CountView 6 + Player 3 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.96%/93.31%/88.99%/92.93%（stmts/branch/funcs/lines）。单测 355 passed（54 文件）+ e2e 10 passed，七个既有排序零回归。
