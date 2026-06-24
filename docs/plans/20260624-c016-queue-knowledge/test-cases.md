# 测试用例：队列 Queue 知识页

> Status: verified
> Stable ID: C-20260624-016
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级             | 文件                                            | 编号区间                 | 数量 |
| ---------------- | ----------------------------------------------- | ------------------------ | ---- |
| L3 队列逻辑      | `src/components/structures/useQueue.spec.ts`    | `TC-QUEUE-LOGIC-01..08`  | 8    |
| L4 QueueViz 互动 | `src/components/structures/QueueViz.spec.ts`    | `TC-VIZ-QUEUEVIZ-01..08` | 8    |
| L4 队列页        | `src/views/Article/DataStructure/Queue.spec.ts` | `TC-VIEW-QUEUE-01..02`   | 2    |
| L5 e2e           | `e2e/queue.e2e.ts`                              | `TC-E2E-QUEUE-01`        | 1    |

**合计新增 19 个 Case。**

**回归（不新增、必须仍绿）**：8 个排序 + 栈（含 `Article`/`Callout`/`Playground`/`useStack`/`StackViz`）+ 播放器全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明骨架可复用、零回归。

## L3 — useQueue（`TC-QUEUE-LOGIC-*`）

| TC                | 描述                                                  | 预期                 |
| ----------------- | ----------------------------------------------------- | -------------------- |
| TC-QUEUE-LOGIC-01 | 初始空：items 空/front null/canDequeue F/canEnqueue T | 一致                 |
| TC-QUEUE-LOGIC-02 | enqueue 追加递增序号、返回值；front 不变（非空）      | [1,2]、front 恒 1    |
| TC-QUEUE-LOGIC-03 | dequeue 删队首返回原队首；空 dequeue 返回 null        | 1→2→null、front 更新 |
| TC-QUEUE-LOGIC-04 | peek 返回队首不改 items                               | 1、长度不变          |
| TC-QUEUE-LOGIC-05 | reset 清空且 seq 归零                                 | []、下次 enqueue=1   |
| TC-QUEUE-LOGIC-06 | canEnqueue 满 QUEUE_MAX 为 false、enqueue null        | 长度=6               |
| TC-QUEUE-LOGIC-07 | 每个元素 id 唯一                                      | Set.size == 长度     |
| TC-QUEUE-LOGIC-08 | canDequeue 随空/非空切换                              | F→T→F                |

## L4 — QueueViz 互动（`TC-VIZ-QUEUEVIZ-*`）

| TC                 | 描述                                         | 预期                              |
| ------------------ | -------------------------------------------- | --------------------------------- |
| TC-VIZ-QUEUEVIZ-01 | 初始空：队列为空 + dequeue/peek 禁用         | empty-hint、disabled              |
| TC-VIZ-QUEUEVIZ-02 | enqueue 增元素、值为递增序号                 | 1 元素、文本「1」                 |
| TC-VIZ-QUEUEVIZ-03 | 队首 is-front 落 index0、队尾 is-rear 落末位 | 首 is-front、末 is-rear           |
| TC-VIZ-QUEUEVIZ-04 | 每 qitem 含队首/队尾 marker 节点             | .m-front/.m-rear 各 n             |
| TC-VIZ-QUEUEVIZ-05 | dequeue 移队首并解说                         | 减一、新队首=2、status 含「出队」 |
| TC-VIZ-QUEUEVIZ-06 | enqueue 到 6 后 enqueue 禁用                 | 6 元素、enqueue disabled          |
| TC-VIZ-QUEUEVIZ-07 | 重置清空                                     | 0 元素、empty-hint                |
| TC-VIZ-QUEUEVIZ-08 | peek 解说队首不取走                          | 元素不变、status 含「队首」       |

## L4 — 队列页（`TC-VIEW-QUEUE-*`）

| TC               | 描述                        | 预期                     |
| ---------------- | --------------------------- | ------------------------ |
| TC-VIEW-QUEUE-01 | 挂载渲染 Article + QueueViz | 两组件存在               |
| TC-VIEW-QUEUE-02 | 含「队列」标题与 Playground | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-QUEUE-01`）

| TC              | 描述                                                                                                      | 预期       |
| --------------- | --------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-QUEUE-01 | 导航 / 正文 + Playground / enqueue×3 见 3 元素 + 队首深绿 + 双指针 / dequeue 移队首(1出/2成首) / 重置空态 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。`useQueue` 纯逻辑目标行覆盖 ≥90%；QueueViz 交互分支（enqueue/dequeue/peek/reset/禁用/双指针）全覆盖。

## 变更历史

- 2026-06-24：创建并落地。实际新增 19 个 Case（useQueue 8 + QueueViz 8 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 93.84%/93%/90.53%/93.82%（stmts/branch/funcs/lines）；单测 396 passed（62 文件）+ e2e 12 passed，骨架零改动复用、8 排序 + 栈零回归。
