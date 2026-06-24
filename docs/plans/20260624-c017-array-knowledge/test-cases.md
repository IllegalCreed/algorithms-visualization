# 测试用例：数组 Array 知识页

> Status: verified
> Stable ID: C-20260624-017
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级             | 文件                                            | 编号区间                 | 数量 |
| ---------------- | ----------------------------------------------- | ------------------------ | ---- |
| L3 数组逻辑      | `src/components/structures/useArray.spec.ts`    | `TC-ARRAY-LOGIC-01..10`  | 10   |
| L4 ArrayViz 互动 | `src/components/structures/ArrayViz.spec.ts`    | `TC-VIZ-ARRAYVIZ-01..10` | 10   |
| L4 数组页        | `src/views/Article/DataStructure/Array.spec.ts` | `TC-VIEW-ARRAY-01..02`   | 2    |
| L5 e2e           | `e2e/array.e2e.ts`                              | `TC-E2E-ARRAY-01`        | 1    |

**合计新增 23 个 Case。**

**回归（不新增、必须仍绿）**：8 个排序 + 栈 + 队列（含 `Article`/`Callout`/`Playground`/`useStack`/`StackViz`/`useQueue`/`QueueViz`）+ 播放器全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明骨架可复用、零回归；其中 `Queue.vue` 仅改结尾正文一句，`Queue.spec.ts`/`queue.e2e.ts` 不断言该句，仍全绿。

## L3 — useArray（`TC-ARRAY-LOGIC-*`）

| TC                | 描述                                                                    | 预期                          |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------- |
| TC-ARRAY-LOGIC-01 | 初始 [1,2,3,4]、selected null、hasSelection F、canInsert F、canAppend T | 一致                          |
| TC-ARRAY-LOGIC-02 | valueAt 按下标读、越界（-1/len）null                                    | 1/4/null/null                 |
| TC-ARRAY-LOGIC-03 | select toggle：选中 / 再点取消 / 换选                                   | 2→null→0                      |
| TC-ARRAY-LOGIC-04 | insert 未选返回 null 且不变                                             | null、[1,2,3,4]               |
| TC-ARRAY-LOGIC-05 | insert 在 i 插递增值、i 起右移、保持选中、下标≠值、id 唯一              | 5、[1,2,5,3,4]、sel=2、a[3]=3 |
| TC-ARRAY-LOGIC-06 | remove 删 i、后续左移、清空选中                                         | 5、[1,2,3,4]、sel=null        |
| TC-ARRAY-LOGIC-07 | remove 未选返回 null                                                    | null、[1,2,3,4]               |
| TC-ARRAY-LOGIC-08 | append 尾插递增、不动选中                                               | 5、[1,2,3,4,5]、sel=1         |
| TC-ARRAY-LOGIC-09 | 满 ARRAY_MAX：canAppend/canInsert F、append/insert null                 | 长度=8                        |
| TC-ARRAY-LOGIC-10 | reset 复位 [1,2,3,4]、清选中、下次 append=5                             | 一致                          |

## L4 — ArrayViz 互动（`TC-VIZ-ARRAYVIZ-*`）

| TC                 | 描述                                           | 预期                                   |
| ------------------ | ---------------------------------------------- | -------------------------------------- |
| TC-VIZ-ARRAYVIZ-01 | 初始 4 格 + 下标 0..3 + 无选中禁访问/插入/删除 | 4 cell/4 slot、三键 disabled、追加可用 |
| TC-VIZ-ARRAYVIZ-02 | 点格选中：cell/slot is-selected + 启用三键     | 第 3 格/槽 is-selected、按钮启用       |
| TC-VIZ-ARRAYVIZ-03 | insert 增元素、新值落 i、下标≠值               | 5 格、cell[2]=5、cell[3]=3             |
| TC-VIZ-ARRAYVIZ-04 | remove 减元素                                  | 3 格、值 [1,3,4]                       |
| TC-VIZ-ARRAYVIZ-05 | append 尾增（无需选中）                        | 5 格、cell[4]=5                        |
| TC-VIZ-ARRAYVIZ-06 | 下标行数量 = items 数、文本 0..n-1             | 5 slot、num [0..4]                     |
| TC-VIZ-ARRAYVIZ-07 | 满 8 禁插入/追加                               | 8 格、追加/插入 disabled               |
| TC-VIZ-ARRAYVIZ-08 | access 解说含 O(1)                             | status 含「O(1)」                      |
| TC-VIZ-ARRAYVIZ-09 | reset 复位 4 格、清选中                        | 4 格、无 is-selected                   |
| TC-VIZ-ARRAYVIZ-10 | 删空显示 empty-hint + 禁三键                   | 0 格、empty-hint、disabled             |

## L4 — 数组页（`TC-VIEW-ARRAY-*`）

| TC               | 描述                        | 预期                     |
| ---------------- | --------------------------- | ------------------------ |
| TC-VIEW-ARRAY-01 | 挂载渲染 Article + ArrayViz | 两组件存在               |
| TC-VIEW-ARRAY-02 | 含「数组」标题与 Playground | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-ARRAY-01`）

| TC              | 描述                                                                                                                            | 预期       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-ARRAY-01 | 导航 / 正文 + Playground / 初始 4 格 / 点下标 2 选中(深绿 + ↑) / insert 见 5 格且 a[2]=5、a[3]=3 / append 见 6 格 / 重置回 4 格 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。`useArray` 纯逻辑目标行覆盖 ≥90%；ArrayViz 交互分支（select/access/insert/remove/append/reset/禁用/选中/空态）全覆盖。

## 变更历史

- 2026-06-24：创建并落地。实际新增 23 个 Case（useArray 10 + ArrayViz 10 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 94.00%/92.37%/90.74%/94.39%（stmts/branch/funcs/lines，均过门槛）；ArrayViz 行覆盖 100%、分支 70.83%；单测 418 passed（66 文件）+ e2e 13 passed，骨架零改动复用、8 排序 + 栈 + 队列零回归（queue 改结尾一句后其测试仍绿）。
