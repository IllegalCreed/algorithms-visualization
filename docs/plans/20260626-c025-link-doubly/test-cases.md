# 测试用例：链表·双向（反向遍历 + O(1) 删除）

> Status: verified
> Stable ID: C-20260626-025
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级              | 文件                                           | 编号区间                 | 数量 |
| ----------------- | ---------------------------------------------- | ------------------------ | ---- |
| L3 双向链表逻辑   | `src/components/structures/useDlink.spec.ts`   | `TC-DLINK-LOGIC-01..10`  | 10   |
| L4 DlinkViz 互动  | `src/components/structures/DlinkViz.spec.ts`   | `TC-VIZ-DLINKVIZ-01..08` | 8    |
| L4 链表页（追加） | `src/views/Article/DataStructure/Link.spec.ts` | `TC-VIEW-LINK-03`        | 1    |
| L5 e2e（追加）    | `e2e/link.e2e.ts`                              | `TC-E2E-LINK-02`         | 1    |

**合计新增 20 个 Case。** 无现存 `DLINK` Case，命名空间干净；视图/ e2e 追加沿用链表页 `LINK` 命名（同页）。

**回归（不新增、必须仍绿）**：链表页现有 `TC-VIEW-LINK-01/02`、`TC-E2E-LINK-01`（LinkViz 单链表）+ 8 排序 + 其余 7 结构（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁证明 LinkViz/骨架零改动、零回归。`TC-E2E-LINK-01` 仅第 10 行 `.playground` 需 `.first()` 消歧（两 Playground），断言意图不变。

## L3 — useDlink（`TC-DLINK-LOGIC-*`）

| TC                | 描述                                               | 预期                             |
| ----------------- | -------------------------------------------------- | -------------------------------- |
| TC-DLINK-LOGIC-01 | 初始 items 值 [10,20,30,40]、长度 4                | 值序/长度一致                    |
| TC-DLINK-LOGIC-02 | forward = [10,20,30,40]（沿 next）                 | 一致                             |
| TC-DLINK-LOGIC-03 | backward = [40,30,20,10]（沿 prev）                | 一致                             |
| TC-DLINK-LOGIC-04 | select toggle + hasSelection                       | 选中/再点取消、hasSelection 随之 |
| TC-DLINK-LOGIC-05 | removeAt 中部（选1=20）：→[10,30,40]、rewire{0,2}  | value 20、items/rewire 一致      |
| TC-DLINK-LOGIC-06 | removeAt 头（选0=10）：→[20,30,40]、rewire{head,1} | rewire.left='head'               |
| TC-DLINK-LOGIC-07 | removeAt 尾（选3=40）：→[10,20,30]、rewire{2,tail} | rewire.right='tail'              |
| TC-DLINK-LOGIC-08 | removeAt 无选中 → null                             | null、items 不变                 |
| TC-DLINK-LOGIC-09 | 删除后 backward 更新（删1后 [40,30,10]）           | backward 一致                    |
| TC-DLINK-LOGIC-10 | reset 复原 [10,20,30,40]、清选中                   | items 复原、selected=null        |

## L4 — DlinkViz 互动（`TC-VIZ-DLINKVIZ-*`）

| TC                 | 描述                                                  | 预期                  |
| ------------------ | ----------------------------------------------------- | --------------------- |
| TC-VIZ-DLINKVIZ-01 | 初始 4 dnode + 双箭头(→/←) + 3 按钮 + head + tail     | 各断言通过            |
| TC-VIZ-DLINKVIZ-02 | dnode 值 10/20/30/40                                  | ['10','20','30','40'] |
| TC-VIZ-DLINKVIZ-03 | 点 dnode[1] 选中 is-sel                               | 含 is-sel             |
| TC-VIZ-DLINKVIZ-04 | 反向遍历：status 含「反向」且含「40 → 30」            | status 含             |
| TC-VIZ-DLINKVIZ-05 | 删除选中（选1）：dnode→3、status 含「O(1)」且「prev」 | 3 dnode、status 含    |
| TC-VIZ-DLINKVIZ-06 | 删头（选0）删除：首 dnode 变 20、dnode→3              | 首值 20、3 dnode      |
| TC-VIZ-DLINKVIZ-07 | 未选中时删除按钮禁用、dnode 仍 4（与 LinkViz 一致）   | disabled、4 dnode     |
| TC-VIZ-DLINKVIZ-08 | 重置回 4 dnode                                        | 4 dnode               |

## L4 — 链表页（追加 `TC-VIEW-LINK-03`）

| TC              | 描述                            | 预期     |
| --------------- | ------------------------------- | -------- |
| TC-VIEW-LINK-03 | 链表页含 DlinkViz（双向链表节） | 组件存在 |

## L5 — e2e（追加 `TC-E2E-LINK-02`）

| TC             | 描述                                                                                                     | 预期       |
| -------------- | -------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-LINK-02 | `/docs/link` 限定 `.dlink-viz`：初始 4 dnode / 反向遍历 status 含「反向」/ 点节点删除 dnode→3 / 重置回 4 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useDlink` 纯逻辑（forward/backward、select toggle、removeAt 中/头/尾/空、reset）L3 全覆盖；DlinkViz 同步分支（onReverse、onRemove ok/无选中、onSelect、reset）L4 覆盖（反向点亮/接线脉冲 setTimeout 分步分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-26：创建并落地。M4 深度 D3。实际新增 20 个 Case（useDlink 10 + DlinkViz 8 + view 1 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.26%/89.34%/93.29%/93.44%（聚合均过门槛）；useDlink 纯逻辑 L3 全覆盖、DlinkViz 94.23% 行（反向遍历点亮 setTimeout 分支由 e2e 复核）。单测 583 passed（87 文件）+ e2e 21 passed。注：链表页加第二个 Playground 后，现有 `TC-E2E-LINK-01` 第 10 行 `.playground` 命中 2 个（严格模式），改为 `.first()` 消歧（断言意图不变、非语义改写）；e2e 顺序把「选中+删除」放反向遍历前（反向遍历 busy 锁工具栏），重置点击自动等 busy 解除。其余 LinkViz/骨架零改动、零回归。命名空间 `DLINK`/`DLINKVIZ` 干净。
