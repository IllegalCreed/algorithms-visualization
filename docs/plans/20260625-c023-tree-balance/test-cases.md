# 测试用例：树·平衡深化（退化↔平衡 + 查找走位）

> Status: verified
> Stable ID: C-20260625-023
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级               | 文件                                           | 编号区间               | 数量 |
| ------------------ | ---------------------------------------------- | ---------------------- | ---- |
| L3 平衡逻辑        | `src/components/structures/useBalance.spec.ts` | `TC-BAL-LOGIC-01..08`  | 8    |
| L4 BalanceViz 互动 | `src/components/structures/BalanceViz.spec.ts` | `TC-VIZ-BALVIZ-01..08` | 8    |
| L4 树页（追加）    | `src/views/Article/DataStructure/Tree.spec.ts` | `TC-VIEW-TREE-03`      | 1    |
| L5 e2e（追加）     | `e2e/tree.e2e.ts`                              | `TC-E2E-TREE-02`       | 1    |

**合计新增 18 个 Case。** 无现存 `BAL` Case，命名空间干净；视图/ e2e 追加沿用树页 `TREE` 命名（同页）。

**回归（不新增、必须仍绿）**：树页现有 `TC-VIEW-TREE-01/02`、`TC-E2E-TREE-01`（TreeViz）+ 8 排序 + 其余 7 结构（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁证明 TreeViz/骨架零改动、零回归。

## L3 — useBalance（`TC-BAL-LOGIC-*`）

| TC              | 描述                                               | 预期                  |
| --------------- | -------------------------------------------------- | --------------------- |
| TC-BAL-LOGIC-01 | chain 结构：7 节点 1-7、6 边、高度 7、最坏 7       | 一致                  |
| TC-BAL-LOGIC-02 | balanced 结构：4/2/6/1/3/5/7、6 边、高度 3、最坏 3 | 一致                  |
| TC-BAL-LOGIC-03 | 节点带坐标 + id 唯一                               | x 为数、Set.size==len |
| TC-BAL-LOGIC-04 | search(7, chain) 走 7 步                           | steps 7、path[0..6]   |
| TC-BAL-LOGIC-05 | search(7, balanced) 走 3 步                        | steps 3、path[0,2,6]  |
| TC-BAL-LOGIC-06 | chain search 步数 = 值                             | 3→3、5→5              |
| TC-BAL-LOGIC-07 | balanced：根 1 步、叶 3 步                         | 4→1、1→3、5→3         |
| TC-BAL-LOGIC-08 | 同值两 mode 步数不同（7：7 vs 3）                  | 不相等                |

## L4 — BalanceViz 互动（`TC-VIZ-BALVIZ-*`）

| TC               | 描述                                                           | 预期               |
| ---------------- | -------------------------------------------------------------- | ------------------ |
| TC-VIZ-BALVIZ-01 | 初始退化：7 节点 + 6 边 + 3 按钮 + 退化 on + readout 7 层/7 次 | 各断言通过         |
| TC-VIZ-BALVIZ-02 | 切平衡：readout 3 层/3 次、节点 7、平衡 on                     | 各断言通过         |
| TC-VIZ-BALVIZ-03 | 退化节点值 1–7                                                 | ['1'..'7']         |
| TC-VIZ-BALVIZ-04 | 查找 7（退化）status 含「7 步」                                | status 含「7 步」  |
| TC-VIZ-BALVIZ-05 | 查找 7（平衡）status 含「3 步」                                | status 含「3 步」  |
| TC-VIZ-BALVIZ-06 | 切回退化：readout 回 7 层                                      | readout 含「7 层」 |
| TC-VIZ-BALVIZ-07 | 退化 vs 平衡 readout 不同                                      | 两 readout 不同    |
| TC-VIZ-BALVIZ-08 | 边数两 mode 均 6                                               | 6 / 6              |

## L4 — 树页（追加 `TC-VIEW-TREE-03`）

| TC              | 描述                        | 预期     |
| --------------- | --------------------------- | -------- |
| TC-VIEW-TREE-03 | 树页含 BalanceViz（平衡节） | 组件存在 |

## L5 — e2e（追加 `TC-E2E-TREE-02`）

| TC             | 描述                                                                                            | 预期       |
| -------------- | ----------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-TREE-02 | `/docs/tree` 限定 `.bal-viz`：初始 7 节点 / 切平衡 readout 含「3 层」/ 查找 7 status 含「3 步」 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useBalance` 纯逻辑（两布局 + search chain/balanced）L3 全覆盖；BalanceViz 同步分支（onMode chain/balanced、onFind、readout/cur）L4 覆盖（走位点亮 setTimeout 分步分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-25：创建并落地。M4 深度 D1。实际新增 18 个 Case（useBalance 8 + BalanceViz 8 + view 1 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.47%/89.86%/92.80%/93.53%（聚合均过门槛）；useBalance 92.85% 行、BalanceViz 93.18% 行。单测 545 passed（83 文件）+ e2e 19 passed。注：树页加第二个 Playground 后，现有 `TC-E2E-TREE-01` 第 8 行 `.playground` 选择器命中 2 个（严格模式），改为 `.first()` 消歧（断言意图不变、非语义改写）；其余 TreeViz/骨架零改动、零回归。
