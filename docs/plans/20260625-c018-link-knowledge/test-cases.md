# 测试用例：链表 Linked List 知识页

> Status: verified
> Stable ID: C-20260625-018
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级            | 文件                                           | 编号区间                | 数量 |
| --------------- | ---------------------------------------------- | ----------------------- | ---- |
| L3 链表逻辑     | `src/components/structures/useLink.spec.ts`    | `TC-LINK-LOGIC-01..10`  | 10   |
| L4 LinkViz 互动 | `src/components/structures/LinkViz.spec.ts`    | `TC-VIZ-LINKVIZ-01..10` | 10   |
| L4 链表页       | `src/views/Article/DataStructure/Link.spec.ts` | `TC-VIEW-LINK-01..02`   | 2    |
| L5 e2e          | `e2e/link.e2e.ts`                              | `TC-E2E-LINK-01`        | 1    |

**合计新增 23 个 Case。**

**回归（不新增、必须仍绿）**：8 排序 + 栈 + 队列 + 数组（含 `Article`/`Callout`/`Playground` 及各 `use*`/`*Viz`）+ 播放器全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明骨架可复用、零回归。

## L3 — useLink（`TC-LINK-LOGIC-*`）

| TC               | 描述                                                                   | 预期                        |
| ---------------- | ---------------------------------------------------------------------- | --------------------------- |
| TC-LINK-LOGIC-01 | 初始 [1,2,3]、selected null、hasSelection F、canInsert F、canPrepend T | 一致                        |
| TC-LINK-LOGIC-02 | valueAt 按位置读、越界（-1/len）null                                   | 1/3/null/null               |
| TC-LINK-LOGIC-03 | select toggle：选中 / 再点取消 / 换选                                  | 1→null→0                    |
| TC-LINK-LOGIC-04 | insertAfter 未选返回 null 且不变                                       | null、[1,2,3]               |
| TC-LINK-LOGIC-05 | insertAfter 在选中后插递增、选中落 i+1、链序、id 唯一                  | 4、[1,2,4,3]、sel=2、a[3]=3 |
| TC-LINK-LOGIC-06 | remove 删选中、清空选中                                                | 2、[1,3]、sel=null          |
| TC-LINK-LOGIC-07 | remove 未选返回 null                                                   | null、[1,2,3]               |
| TC-LINK-LOGIC-08 | prepend 头插递增、落表头、选中随之 +1                                  | 4、[4,1,2,3]、sel=2         |
| TC-LINK-LOGIC-09 | 满 LINK_MAX：canPrepend/canInsert F、返回 null                         | 长度=6                      |
| TC-LINK-LOGIC-10 | reset 复位 [1,2,3]、清选中、下次 prepend=4                             | 一致                        |

## L4 — LinkViz 互动（`TC-VIZ-LINKVIZ-*`）

| TC                | 描述                                     | 预期                             |
| ----------------- | ---------------------------------------- | -------------------------------- |
| TC-VIZ-LINKVIZ-01 | 初始 3 节点 + head + null + 无选中禁三键 | 3 node、head/null、三键 disabled |
| TC-VIZ-LINKVIZ-02 | 点节点选中：is-sel + 启用查找/插入/删除  | node[1] is-sel、按钮启用         |
| TC-VIZ-LINKVIZ-03 | insertAfter 增节点、新值落选中后         | 4 node、box[2]=4                 |
| TC-VIZ-LINKVIZ-04 | remove 减节点                            | 2 node、值 [1,3]                 |
| TC-VIZ-LINKVIZ-05 | prepend 头插落表头                       | 4 node、box[0]=4                 |
| TC-VIZ-LINKVIZ-06 | 每节点带 next 箭头 + 有 head/null        | .node .arrow ≥3、head/null 存在  |
| TC-VIZ-LINKVIZ-07 | 满 6 禁插入/头插                         | 6 node、头插/插入 disabled       |
| TC-VIZ-LINKVIZ-08 | find 同步解说含 O(n)                     | status 含「O(n)」                |
| TC-VIZ-LINKVIZ-09 | reset 复位 3 节点、清选中                | 3 node、无 is-sel                |
| TC-VIZ-LINKVIZ-10 | 删空显示 empty-hint + 禁三键             | 0 node、empty-hint、disabled     |

## L4 — 链表页（`TC-VIEW-LINK-*`）

| TC              | 描述                        | 预期                     |
| --------------- | --------------------------- | ------------------------ |
| TC-VIEW-LINK-01 | 挂载渲染 Article + LinkViz  | 两组件存在               |
| TC-VIEW-LINK-02 | 含「链表」标题与 Playground | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-LINK-01`）

| TC             | 描述                                                                                                                                            | 预期       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-LINK-01 | 导航 / 正文 + Playground / 初始 3 节点+head+null / 点节点选中(is-sel) / insertAfter 见 4 节点新值落选中后 / 头插见 5 节点落表头 / 重置回 3 节点 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。`useLink` 纯逻辑目标行覆盖 ≥90%；LinkViz 交互分支（select/find/insertAfter/remove/prepend/reset/禁用/选中/空态）全覆盖（查找逐跳 setTimeout 视觉分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-25：创建并落地。实际新增 23 个 Case（useLink 10 + LinkViz 10 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 93.86%/91.82%/90.63%/94.55%（stmts/branch/funcs/lines，均过门槛）；LinkViz 行覆盖 92.18%（未覆盖仅查找 setTimeout 回调 + onUnmounted）；单测 440 passed（69 文件）+ e2e 14 passed，骨架零改动复用、8 排序 + 栈 + 队列 + 数组零回归。
