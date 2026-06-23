# 测试用例：快速排序动画

> Status: verified
> Stable ID: C-20260623-012
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级                              | 文件                                                      | 编号区间                    | 数量 |
| --------------------------------- | --------------------------------------------------------- | --------------------------- | ---- |
| L3 oracle                         | `src/algorithms/quick-sort.spec.ts`                       | `TC-QUICK-ALGO-01..06`      | 6    |
| L3 module（buildSteps + sources） | `src/algorithms/quick-sort.module.spec.ts`                | `TC-QUICK-MOD-01..16`       | 16   |
| L4 Bar 态                         | `src/components/Bar.spec.ts`（扩展）                      | `TC-VIZ-BAR-*`（接续）      | 1    |
| L4 BarsView 判定                  | `src/components/BarsView.spec.ts`（扩展）                 | `TC-VIZ-BARSVIEW-*`（接续） | 3    |
| L4 StackView 组件                 | `src/components/StackView.spec.ts`（新）                  | `TC-VIZ-STACKVIEW-01..06`   | 6    |
| L4 外壳条件渲染                   | `src/components/player/AlgorithmPlayer.spec.ts`（扩展）   | `TC-PLAYER-*`（接续）       | 2    |
| L4 视图薄壳                       | `src/views/Article/SortAlgorithm/QuickSort.spec.ts`（新） | `TC-VIEW-QUICK-01..02`      | 2    |
| L5 e2e                            | `e2e/quick-sort.e2e.ts`（新）                             | `TC-E2E-QUICK-01`           | 1    |

**回归（不新增、必须仍绿）**：冒泡 / 选择 / 插入 / 希尔 / 归并的全部现有 Case（含 `Bar.spec` / `BarsView.spec` / `AlgorithmPlayer.spec` / `AuxView.spec`）—— 由全门禁 `pnpm test:unit run` 证明向后兼容。

## L3 — oracle（`TC-QUICK-ALGO-*`）

| TC               | 描述                        | 预期                                                   |
| ---------------- | --------------------------- | ------------------------------------------------------ |
| TC-QUICK-ALGO-01 | 末事件数组严格升序          | `quickSortPartitions(BASE).at(-1).array` === 内置 sort |
| TC-QUICK-ALGO-02 | 不修改入参                  | 入参数组不变                                           |
| TC-QUICK-ALGO-03 | 空 / 单元素                 | 返回 `[]`（无 partition 事件）                         |
| TC-QUICK-ALGO-04 | BASE pivot 落点序列         | `[0,6,1,5,2,4,9,7]`                                    |
| TC-QUICK-ALGO-05 | 每次 partition 钉死最终位置 | `event.array[event.pivotIndex]` === 有序数组该下标值   |
| TC-QUICK-ALGO-06 | 重复 / 已序 / 逆序均升序    | 末态 === 内置 sort                                     |

## L3 — module buildSteps（`TC-QUICK-MOD-01..13`）

| TC              | 描述                                                 | 预期                                                |
| --------------- | ---------------------------------------------------- | --------------------------------------------------- |
| TC-QUICK-MOD-01 | 空 / 单元素只产出 done，sortedIndices 全集           | `[].point==='done'`；`[5]` 的 `sortedIndices===[0]` |
| TC-QUICK-MOD-02 | 末步数组与 oracle 一致（升序）                       | === oracle 末态 === `[1..10]`                       |
| TC-QUICK-MOD-03 | 每步 id 集合恒等初始（FLIP 前提）                    | 所有步 id 集合相同                                  |
| TC-QUICK-MOD-04 | 不修改入参                                           | 入参不变                                            |
| TC-QUICK-MOD-05 | 每步 point 合法；compare 带 comparing=[j,hi]         | point ∈ EXEC_POINTS；compare 的 comparing[1]===hi   |
| TC-QUICK-MOD-06 | pivotPlace 落点序列 = oracle pivotIndex 序列         | 一致                                                |
| TC-QUICK-MOD-07 | sortedIndices 单调不减、末步全集                     | 长度不减；末步 `[0..9]`                             |
| TC-QUICK-MOD-08 | pivotSelect 步 pivotIndex=hi 且 pivot 值=a[hi]       | 一致                                                |
| TC-QUICK-MOD-09 | 栈序：pop 弹出的区间 = 前一步栈顶（先右后左→先取左） | popped === prevStack 栈顶                           |
| TC-QUICK-MOD-10 | done 步 stack 空、sortedIndices 全集                 | `frames===[]`                                       |
| TC-QUICK-MOD-11 | 每步指针 clamp 在 [0,n-1]                            | 所有 pointer.index ∈ [0,n-1]                        |
| TC-QUICK-MOD-12 | 每步带 stack 快照（StackTrack）                      | `Array.isArray(stack.frames)`                       |
| TC-QUICK-MOD-13 | swap 步小于区不变量：a[lo..i-1] 全 < pivot           | 区间内严格小于 pivot                                |

## L3 — module sources（`TC-QUICK-MOD-14..16`）

| TC              | 描述                                    | 预期                            |
| --------------- | --------------------------------------- | ------------------------------- |
| TC-QUICK-MOD-14 | 四门语言齐备                            | lang 集合 = {ts,python,go,rust} |
| TC-QUICK-MOD-15 | 每门语言每个 point 行号落在物理行范围内 | 1 ≤ lineMap[p] ≤ 行数           |
| TC-QUICK-MOD-16 | 实际出现的 point 都能在每门语言映射到行 | typeof lineMap[p] === 'number'  |

## L4 — Bar / BarsView（扩展现有 spec，接续编号）

| TC                                | 描述                                                        | 预期                      |
| --------------------------------- | ----------------------------------------------------------- | ------------------------- |
| TC-VIZ-BAR-\*（新增 pivot）       | `state='pivot'` 渲染 `.bar.pivot`                           | DOM 带 pivot 类、品红背景 |
| TC-VIZ-BARSVIEW-\*（pivot 压过）  | `pivotIndex` 那根即便同在 comparing/groupMembers 仍为 pivot | stateOf===‘pivot’         |
| TC-VIZ-BARSVIEW-\*（离散 sorted） | `sortedIndices` 内下标渲染 sorted                           | stateOf===‘sorted’        |
| TC-VIZ-BARSVIEW-\*（回归）        | 不设新字段时判定与原一致                                    | 与扩展前逐字相同          |

## L4 — StackView（`TC-VIZ-STACKVIEW-*`，新组件）

| TC                  | 描述                                 | 预期                                             |
| ------------------- | ------------------------------------ | ------------------------------------------------ |
| TC-VIZ-STACKVIEW-01 | 渲染 frames 数量的栈帧               | `.frame` 数 = frames.length                      |
| TC-VIZ-STACKVIEW-02 | 栈顶在最上、内容为 `a[lo..hi]`       | frames[0]=`a[1..5]`（栈顶）、frames[1]=`a[0..9]` |
| TC-VIZ-STACKVIEW-03 | 栈顶帧高亮                           | 逆序后第一个带 `.top` 类                         |
| TC-VIZ-STACKVIEW-04 | 固定等宽居中（无 inline left/width） | frame 无可变 inline 宽/缩进                      |
| TC-VIZ-STACKVIEW-05 | 空栈占位                             | `frames=[]` 渲染占位、无 `.frame`                |
| TC-VIZ-STACKVIEW-06 | 稳定 key 入栈渲染                    | setProps 增帧后旧帧保留、新帧追加（支撑动画）    |

## L4 — AlgorithmPlayer 条件渲染（扩展，接续编号）

| TC                       | 描述                                                     | 预期                     |
| ------------------------ | -------------------------------------------------------- | ------------------------ |
| TC-PLAYER-\*（渲染栈轨） | 带 `stack` 的 module → 渲染 StackView                    | 存在 StackView           |
| TC-PLAYER-\*（不渲染）   | 不带 `stack`（如归并）→ 不渲染 StackView（AuxView 仍在） | 无 StackView、有 AuxView |

## L4 — 视图薄壳（`TC-VIEW-QUICK-*`）

| TC               | 描述                                       | 预期                            |
| ---------------- | ------------------------------------------ | ------------------------------- |
| TC-VIEW-QUICK-01 | 挂载渲染 AlgorithmPlayer + quickSortModule | 标题「快速排序」、默认停第 0 步 |
| TC-VIEW-QUICK-02 | 页面存在 StackView 轨                      | StackView 渲染                  |

## L5 — e2e（`TC-E2E-QUICK-01`）

| TC              | 描述                                                                           | 预期                    |
| --------------- | ------------------------------------------------------------------------------ | ----------------------- |
| TC-E2E-QUICK-01 | 导航 / 默认暂停 / 栈轨可见 / pivot 品红 / 拖到末态升序全绿 / 重置 / 四语言切换 | 各断言通过 + 关键帧截图 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。新增算法模块（oracle + module + sources）为纯函数/纯数据，目标行覆盖 ≥90%；StackView 组件分支（栈顶/固定宽度/空栈/稳定 key）全覆盖。

## 变更历史

- 2026-06-23：创建并落地。实际新增 37 个 Case（oracle 6 + module 16 + Bar 1 + BarsView 3 + StackView 5 + AlgorithmPlayer 3 + view 2 + e2e 1），全绿；已回写三索引（index / by-layer / by-module）。覆盖率 All files 91.71%/92.51%/88%/91.65%，新增代码 100%。
- 2026-06-23（修订）：据用户反馈重构 `StackView` 视觉（固定等宽居中 + `a[lo..hi]` 记法 + 入栈/出栈动画）；`TC-VIZ-STACKVIEW` 5→6（02/04 语义调整、新增 06「稳定 key 入栈渲染」），本 plan Case 总数 37→38；三索引同步。
