# 测试用例：队列·双端（四向进出 deque）

> Status: verified
> Stable ID: C-20260626-026
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级              | 文件                                            | 编号区间                 | 数量 |
| ----------------- | ----------------------------------------------- | ------------------------ | ---- |
| L3 双端队列逻辑   | `src/components/structures/useDeque.spec.ts`    | `TC-DEQUE-LOGIC-01..10`  | 10   |
| L4 DequeViz 互动  | `src/components/structures/DequeViz.spec.ts`    | `TC-VIZ-DEQUEVIZ-01..08` | 8    |
| L4 队列页（追加） | `src/views/Article/DataStructure/Queue.spec.ts` | `TC-VIEW-QUEUE-03`       | 1    |
| L5 e2e（追加）    | `e2e/queue.e2e.ts`                              | `TC-E2E-QUEUE-02`        | 1    |

**合计新增 20 个 Case。** 无现存 `DEQUE` Case，命名空间干净；视图/ e2e 追加沿用队列页 `QUEUE` 命名（同页）。

**回归（不新增、必须仍绿）**：队列页现有 `TC-VIEW-QUEUE-01/02`、`TC-E2E-QUEUE-01`（QueueViz FIFO）+ 8 排序 + 其余 7 结构（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁证明 QueueViz/骨架零改动、零回归。`TC-E2E-QUEUE-01` 仅第 10 行 `.playground` 需 `.first()` 消歧（两 Playground），断言意图不变。

## L3 — useDeque（`TC-DEQUE-LOGIC-*`）

| TC                | 描述                                        | 预期                            |
| ----------------- | ------------------------------------------- | ------------------------------- |
| TC-DEQUE-LOGIC-01 | 初始 [1,2,3]、size 3、front 1、back 3       | 各值一致                        |
| TC-DEQUE-LOGIC-02 | pushBack → 4 落尾：[1,2,3,4]、back 4        | 返回 4、items/back 一致         |
| TC-DEQUE-LOGIC-03 | pushFront → 4 落头：[4,1,2,3]、front 4      | 返回 4、items/front 一致        |
| TC-DEQUE-LOGIC-04 | popFront → 1、[2,3]                         | 返回 1、items 一致              |
| TC-DEQUE-LOGIC-05 | popBack → 3、[1,2]                          | 返回 3、items 一致              |
| TC-DEQUE-LOGIC-06 | popFront×3 → isEmpty、front/back null       | size 0、isEmpty、null           |
| TC-DEQUE-LOGIC-07 | 满（push 到 6）后 pushBack/pushFront → null | isFull、返回 null               |
| TC-DEQUE-LOGIC-08 | 空时 popFront/popBack → null                | 返回 null                       |
| TC-DEQUE-LOGIC-09 | reset 复原 [1,2,3]                          | items 复原                      |
| TC-DEQUE-LOGIC-10 | 栈=尾进尾出(LIFO)、队列=尾进头出(FIFO)      | popBack 拿刚压、popFront 拿最早 |

## L4 — DequeViz 互动（`TC-VIZ-DEQUEVIZ-*`）

| TC                 | 描述                                                     | 预期                |
| ------------------ | -------------------------------------------------------- | ------------------- |
| TC-VIZ-DEQUEVIZ-01 | 初始 3 dqitem + 5 按钮（头/尾 入/出 + 重置）+ 头/尾 标记 | 各断言通过          |
| TC-VIZ-DEQUEVIZ-02 | dqitem 值 1/2/3                                          | ['1','2','3']       |
| TC-VIZ-DEQUEVIZ-03 | 尾部入：4 dqitem、status 含「尾」                        | 4 dqitem、status 含 |
| TC-VIZ-DEQUEVIZ-04 | 头部入：4 dqitem、首位=新值、status 含「头」             | 4 dqitem、首值/含   |
| TC-VIZ-DEQUEVIZ-05 | 头部出：剩 2 dqitem、首位变 2、status 含「头」           | 2 dqitem、首值 2    |
| TC-VIZ-DEQUEVIZ-06 | 尾部出：剩 2 dqitem、末位变 2、status 含「尾」           | 2 dqitem、末值 2    |
| TC-VIZ-DEQUEVIZ-07 | 头部出×3 → 空：出队按钮禁用 + empty-hint                 | disabled、empty 显  |
| TC-VIZ-DEQUEVIZ-08 | 重置回 3 dqitem                                          | 3 dqitem            |

## L4 — 队列页（追加 `TC-VIEW-QUEUE-03`）

| TC               | 描述                            | 预期     |
| ---------------- | ------------------------------- | -------- |
| TC-VIEW-QUEUE-03 | 队列页含 DequeViz（双端队列节） | 组件存在 |

## L5 — e2e（追加 `TC-E2E-QUEUE-02`）

| TC              | 描述                                                                            | 预期       |
| --------------- | ------------------------------------------------------------------------------- | ---------- |
| TC-E2E-QUEUE-02 | `/docs/queue` 限定 `.deque-viz`：初始 3 dqitem / 头部入→4 / 尾部出→3 / 重置回 3 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useDeque` 纯逻辑（pushFront/pushBack/popFront/popBack 的满/空分支、front/back/size、reset）L3 全覆盖；DequeViz 同步分支（四个 on\* + onReset）L4 覆盖（TransitionGroup 进出动画由 e2e/肉眼复核）。

## 变更历史

- 2026-06-26：创建并落地。M4 深度 D4。实际新增 20 个 Case（useDeque 10 + DequeViz 8 + view 1 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.49%/89.28%/93.56%/93.62%（聚合均过门槛）；useDeque 纯逻辑 L3 全覆盖、DequeViz 100% 行（满/空 null 守卫分支因按钮 disabled 不触发，防御性保留）。单测 602 passed（89 文件）+ e2e 22 passed。注：① TC-VIZ-DEQUEVIZ-05/06 初稿误写出队后剩 3（实为 3-1=2），已改断言为 2（实现正确、修测试）；② 队列页加第二个 Playground 后，现有 `TC-E2E-QUEUE-01` 第 10 行 `.playground` 命中 2 个（严格模式）→ 改 `.first()`；③ e2e 头/尾标记每元素都有（仅端元素 display:block），断言限定 `.is-front .dm-front` / `.is-back .dm-back` 到可见的那个。其余 QueueViz/骨架零改动、零回归。命名空间 `DEQUE`/`DEQUEVIZ` 干净。
