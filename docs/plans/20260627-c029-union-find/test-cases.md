# 测试用例：并查集 Union-Find（find/union/连通 + 路径压缩）

> Status: verified
> Stable ID: C-20260627-029
> Owner: IllegalCreed
> Created: 2026-06-27
> Last reviewed: 2026-06-27
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级                | 文件                                                | 编号区间              | 数量 |
| ------------------- | --------------------------------------------------- | --------------------- | ---- |
| L3 并查集逻辑       | `src/components/structures/useUnionFind.spec.ts`    | `TC-UF-LOGIC-01..10`  | 10   |
| L4 UnionFindViz互动 | `src/components/structures/UnionFindViz.spec.ts`    | `TC-VIZ-UFVIZ-01..08` | 8    |
| L4 并查集页         | `src/views/Article/DataStructure/UnionFind.spec.ts` | `TC-VIEW-UF-01/02`    | 2    |
| L5 e2e              | `e2e/union-find.e2e.ts`                             | `TC-E2E-UF-01`        | 1    |

**合计新增 21 个 Case。** 无现存 `UF` Case，命名空间干净（新结构、新前缀）。

**修改（计数变化，非回归）**：`TC-HOOK-01-2`（Home 数据结构 9→10）、`TC-HOOK-02-4`（Menu 数据结构 9→10）。

**回归（不新增、必须仍绿）**：既有 9 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case（除上述 2 处 HOOK 计数）—— 由全门禁证明零改动、零回归。

## L3 — useUnionFind（`TC-UF-LOGIC-*`）

| TC             | 描述                                              | 预期                       |
| -------------- | ------------------------------------------------- | -------------------------- |
| TC-UF-LOGIC-01 | 初始 parent [0..7]、groupCount 8                  | 一致                       |
| TC-UF-LOGIC-02 | union(0,1)：merged、parent[0]=1、groupCount 7     | 一致                       |
| TC-UF-LOGIC-03 | union 同组：再 union(0,1) → merged false、组不减  | merged false、groupCount 7 |
| TC-UF-LOGIC-04 | 链 0→1→2→3 后 find(0)：root 3、path [0,1,2,3]     | 一致                       |
| TC-UF-LOGIC-05 | find 纯走位不改 parent                            | 调用前后 parent 相同       |
| TC-UF-LOGIC-06 | compress(0)（链后）：parent[0/1/2]=3、root 3      | 沿途指根                   |
| TC-UF-LOGIC-07 | connected：union(0,1)(2,3)；(0,1)true、(0,2)false | 一致                       |
| TC-UF-LOGIC-08 | connected 经链：链后 connected(0,3) true          | true                       |
| TC-UF-LOGIC-09 | groupCount 随 union 递减（3 次后 5）              | 5                          |
| TC-UF-LOGIC-10 | reset 复原 parent [0..7]、groupCount 8            | 一致                       |

## L4 — UnionFindViz 互动（`TC-VIZ-UFVIZ-*`）

| TC              | 描述                                                         | 预期       |
| --------------- | ------------------------------------------------------------ | ---------- |
| TC-VIZ-UFVIZ-01 | 初始 8 ufnode + 两输入 + 合并/查根/连通?/重置 + readout 含 8 | 各断言通过 |
| TC-VIZ-UFVIZ-02 | 节点标 0..7                                                  | ['0'..'7'] |
| TC-VIZ-UFVIZ-03 | 合并 0,1：readout 含 7、uf-edge 1 条                         | 7、1 边    |
| TC-VIZ-UFVIZ-04 | 合并链(0,1;1,2;2,3)：uf-edge 3、readout 含 5                 | 3 边、5    |
| TC-VIZ-UFVIZ-05 | 链后查根 0：status 含「压缩」                                | status 含  |
| TC-VIZ-UFVIZ-06 | 连通?（合并 0,1 后 a=0,b=1）：status 含「连通」              | status 含  |
| TC-VIZ-UFVIZ-07 | 连通?（0 与 2 未并）：status 含「不连通」                    | status 含  |
| TC-VIZ-UFVIZ-08 | 重置：8 ufnode、0 uf-edge、readout 含 8                      | 各断言通过 |

## L4 — 并查集页（`TC-VIEW-UF-*`）

| TC            | 描述                            | 预期   |
| ------------- | ------------------------------- | ------ |
| TC-VIEW-UF-01 | 挂载渲染 Article + UnionFindViz | 均存在 |
| TC-VIEW-UF-02 | 含「并查集」标题与 Playground   | 含     |

## L5 — e2e（`TC-E2E-UF-01`）

| TC           | 描述                                                                                           | 预期       |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-UF-01 | `/docs/union-find` 限定 `.union-find-viz`：8 节点 / 合并 0,1 后 readout 变 / 连通? 判定 / 重置 | 各断言通过 |

## 修改（计数）

| TC           | 文件                                | 改动          |
| ------------ | ----------------------------------- | ------------- |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构 9→10 |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构 9→10 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useUnionFind` 纯逻辑（find/union 合并与同组/compress/connected/groupCount/reset）L3 全覆盖；UnionFindViz 同步分支（onUnion merged/同组、onFind 根/压缩、onConnected 连通/不连通、onReset）L4 覆盖（高亮 setTimeout 由 e2e/肉眼复核）。

## 变更历史

- 2026-06-27：创建并落地。M4 广度 B2。实际新增 21 个 Case（useUnionFind 10 + UnionFindViz 8 + view 2 + e2e 1）+ 改 2 处 HOOK 计数（数据结构 9→10），全绿；已回写三索引。覆盖率 All files 92.55%/89.45%/93.47%/93.73%（聚合均过门槛）；useUnionFind 纯逻辑 L3 全覆盖、UnionFindViz 92.3% 行。单测 661 passed（97 文件）+ e2e 25 passed。新页 4 处接线（路由/菜单/首页/union-find.svg）均接通；真机另验——链 0→1→2→3 后查根 0：节点 0/1/2 箭头齐刷刷直接指向根 3（路径压缩）、组数 5、解说齐全。连通/不连通用「同根」「根不同」区分（避子串误判）；`.uf-edge` 用 computed 过滤（避 v-for+v-if 同元素 Vue3 陷阱）。既有 9 结构 + 8 排序 + 播放器 + 骨架零回归。命名空间 `UF`/`UFVIZ` 干净。
