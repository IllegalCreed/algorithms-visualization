# 测试用例：跳表 Skip List（多层快车道 + 楼梯查找）

> Status: verified
> Stable ID: C-20260629-032
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级               | 文件                                               | 编号区间                | 数量 |
| ------------------ | -------------------------------------------------- | ----------------------- | ---- |
| L3 跳表逻辑        | `src/components/structures/useSkipList.spec.ts`    | `TC-SKIP-LOGIC-01..10`  | 10   |
| L4 SkipListViz互动 | `src/components/structures/SkipListViz.spec.ts`    | `TC-VIZ-SKIPVIZ-01..08` | 8    |
| L4 跳表页          | `src/views/Article/DataStructure/SkipList.spec.ts` | `TC-VIEW-SKIP-01/02`    | 2    |
| L5 e2e             | `e2e/skip-list.e2e.ts`                             | `TC-E2E-SKIP-01`        | 1    |

**合计新增 21 个 Case。** 无现存 `SKIP` Case，命名空间干净（新结构、新前缀）。

**修改（计数变化，非回归）**：`TC-HOOK-01-2`（Home 数据结构 11→12）、`TC-HOOK-02-4`（Menu 数据结构 11→12）。

**回归（不新增、必须仍绿）**：既有 11 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case（除上述 2 处 HOOK 计数）—— 由全门禁证明零改动、零回归。

## L3 — useSkipList（`TC-SKIP-LOGIC-*`）

| TC               | 描述                                             | 预期        |
| ---------------- | ------------------------------------------------ | ----------- |
| TC-SKIP-LOGIC-01 | nodes 9（head+8）、maxLevel 4、元素值 [1..15 奇] | 一致        |
| TC-SKIP-LOGIC-02 | 元素 heights [4,1,2,1,3,1,2,1]、head height 4    | 一致        |
| TC-SKIP-LOGIC-03 | 各层元素数（不含 head）：L0 8、L1 4、L2 2、L3 1  | 一致        |
| TC-SKIP-LOGIC-04 | search(11) found                                 | found true  |
| TC-SKIP-LOGIC-05 | search(11) visitedValues [1,9,11]（跳过 3,5,7）  | 一致        |
| TC-SKIP-LOGIC-06 | search(8) not found、visitedValues [1,5,7]       | found false |
| TC-SKIP-LOGIC-07 | search(1) found（首元素）                        | found true  |
| TC-SKIP-LOGIC-08 | search(15) found、visitedValues [1,9,13,15]      | 一致        |
| TC-SKIP-LOGIC-09 | search(99) not found（落 15）                    | found false |
| TC-SKIP-LOGIC-10 | path：level 单调不增、move ∈ {start,right,down}  | 一致        |

## L4 — SkipListViz 互动（`TC-VIZ-SKIPVIZ-*`）

| TC                | 描述                                        | 预期       |
| ----------------- | ------------------------------------------- | ---------- |
| TC-VIZ-SKIPVIZ-01 | 网格 19 skip-cell + 输入 + 查找/重置 + head | 各断言通过 |
| TC-VIZ-SKIPVIZ-02 | 元素值 1/3/5/7/9/11/13/15 出现              | 文本包含   |
| TC-VIZ-SKIPVIZ-03 | 查找 11：status 含「跳过」且「找到」        | status 含  |
| TC-VIZ-SKIPVIZ-04 | 查找 8：status 含「没找到」                 | status 含  |
| TC-VIZ-SKIPVIZ-05 | 查找 11：路径点亮 skip-cell.lit > 0         | lit > 0    |
| TC-VIZ-SKIPVIZ-06 | 查找 15：status 含「找到」                  | status 含  |
| TC-VIZ-SKIPVIZ-07 | 查找 99：status 含「没找到」                | status 含  |
| TC-VIZ-SKIPVIZ-08 | 重置：清高亮（skip-cell.lit/.hot 为 0）     | 0          |

## L4 — 跳表页（`TC-VIEW-SKIP-*`）

| TC              | 描述                           | 预期   |
| --------------- | ------------------------------ | ------ |
| TC-VIEW-SKIP-01 | 挂载渲染 Article + SkipListViz | 均存在 |
| TC-VIEW-SKIP-02 | 含「跳表」标题与 Playground    | 含     |

## L5 — e2e（`TC-E2E-SKIP-01`）

| TC             | 描述                                                                                         | 预期       |
| -------------- | -------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-SKIP-01 | `/docs/skip-list` 限定 `.skip-list-viz`：cell 渲染 / 查找 11「找到」/ 查找 8「没找到」/ 重置 | 各断言通过 |

## 修改（计数）

| TC           | 文件                                | 改动           |
| ------------ | ----------------------------------- | -------------- |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构 11→12 |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构 11→12 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useSkipList` 纯逻辑（present/levelNodes/search 命中·未命中·楼梯路径）L3 全覆盖；SkipListViz 同步分支（onSearch found/not、onReset）L4 覆盖（楼梯点亮 setTimeout 由 e2e/肉眼复核）。

## 变更历史

- 2026-06-29：创建并落地。M4 广度 B4（进阶首项）。实际新增 21 个 Case（useSkipList 10 + SkipListViz 8 + view 2 + e2e 1）+ 改 2 处 HOOK 计数（数据结构 11→12），全绿；已回写三索引。覆盖率 All files 92.7%/89.75%/93.69%/93.79%（聚合均过门槛）；useSkipList 纯逻辑 L3 全覆盖、SkipListViz 88.88% 行。单测 703 passed（103 文件）+ e2e 27 passed。新页 4 处接线（路由/菜单/首页/skip-list.svg）均接通；真机另验——查找 11 楼梯走位经高层快车道 1→9 跳过 3/5/7、落 11 命中，解说「走过 1 → 9 → 11，找到了！」。坑：查找 busy 时「重置」原被 disabled 拦截（trigger 不触发）→ 重置改为始终可点（中断 setTimeout + busy=false），与既有结构页重置=中断的范式一致。既有 11 结构 + 8 排序 + 播放器零回归。命名空间 `SKIP`/`SKIPVIZ` 干净。编号顺延 032。
