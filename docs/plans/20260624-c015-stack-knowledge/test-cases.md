# 测试用例：知识页骨架 + 栈

> Status: verified
> Stable ID: C-20260624-015
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级               | 文件                                            | 编号区间                   | 数量 |
| ------------------ | ----------------------------------------------- | -------------------------- | ---- |
| L3 栈逻辑          | `src/components/structures/useStack.spec.ts`    | `TC-STACK-LOGIC-01..08`    | 8    |
| L4 Article 骨架    | `src/components/article/Article.spec.ts`        | `TC-VIZ-ARTICLE-01..02`    | 2    |
| L4 Callout 骨架    | `src/components/article/Callout.spec.ts`        | `TC-VIZ-CALLOUT-01`        | 1    |
| L4 Playground 骨架 | `src/components/article/Playground.spec.ts`     | `TC-VIZ-PLAYGROUND-01..02` | 2    |
| L4 StackViz 互动   | `src/components/structures/StackViz.spec.ts`    | `TC-VIZ-STACKVIZ-01..08`   | 8    |
| L4 栈页            | `src/views/Article/DataStructure/Stack.spec.ts` | `TC-VIEW-STACK-01..02`     | 2    |
| L5 e2e             | `e2e/stack.e2e.ts`                              | `TC-E2E-STACK-01`          | 1    |

**合计新增 24 个 Case。**

**回归（不新增、必须仍绿）**：8 个排序（冒泡/选择/插入/希尔/归并/快速/堆/计数）与播放器全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明向后兼容（新骨架不被它们 import）。

## L3 — useStack（`TC-STACK-LOGIC-*`）

| TC                | 描述                                          | 预期             |
| ----------------- | --------------------------------------------- | ---------------- |
| TC-STACK-LOGIC-01 | 初始空：items 空/top null/canPop F/canPush T  | 一致             |
| TC-STACK-LOGIC-02 | push 追加递增序号、返回值、top 更新           | [1,2]、top=2     |
| TC-STACK-LOGIC-03 | pop 删尾返回原栈顶；空 pop 返回 null          | 2→1→null         |
| TC-STACK-LOGIC-04 | peek 返回栈顶不改 items                       | 2、长度不变      |
| TC-STACK-LOGIC-05 | reset 清空且 seq 归零                         | []、下次 push=1  |
| TC-STACK-LOGIC-06 | canPush 满 STACK_MAX 为 false、push 返回 null | 长度=8           |
| TC-STACK-LOGIC-07 | 每个元素 id 唯一                              | Set.size == 长度 |
| TC-STACK-LOGIC-08 | canPop 随空/非空切换                          | F→T→F            |

## L4 — 排版骨架

| TC                   | 描述                         | 预期              |
| -------------------- | ---------------------------- | ----------------- |
| TC-VIZ-ARTICLE-01    | 渲染 `.article` 容器         | 存在              |
| TC-VIZ-ARTICLE-02    | slot 内容透传                | 标题/正文文本出现 |
| TC-VIZ-CALLOUT-01    | 渲染 `.callout` 且 slot 出现 | 存在 + 文本       |
| TC-VIZ-PLAYGROUND-01 | 默认角标「亲手试试」+ slot   | tag 文案 + 内容   |
| TC-VIZ-PLAYGROUND-02 | 自定义 title 角标            | 用传入文案        |

## L4 — StackViz 互动（`TC-VIZ-STACKVIZ-*`）

| TC                 | 描述                                     | 预期                        |
| ------------------ | ---------------------------------------- | --------------------------- |
| TC-VIZ-STACKVIZ-01 | 初始空：栈为空 + pop/peek 禁用           | empty-hint、disabled        |
| TC-VIZ-STACKVIZ-02 | push 增盘子、值为递增序号                | 1 盘、文本「1」             |
| TC-VIZ-STACKVIZ-03 | 栈顶 is-top 落在最后压入元素             | 尾 item is-top、首非        |
| TC-VIZ-STACKVIZ-04 | 「← 栈顶」结构存在（仅栈顶可见由类约束） | 每 item 含 .arrow           |
| TC-VIZ-STACKVIZ-05 | pop 减盘子并解说                         | 减一、status 含「弹出」     |
| TC-VIZ-STACKVIZ-06 | push 到 8 后 push 禁用                   | 8 盘、push disabled         |
| TC-VIZ-STACKVIZ-07 | 重置清空                                 | 0 盘、empty-hint            |
| TC-VIZ-STACKVIZ-08 | peek 解说栈顶不取走                      | 盘数不变、status 含「栈顶」 |

## L4 — 栈页（`TC-VIEW-STACK-*`）

| TC               | 描述                        | 预期                     |
| ---------------- | --------------------------- | ------------------------ |
| TC-VIEW-STACK-01 | 挂载渲染 Article + StackViz | 两组件存在               |
| TC-VIEW-STACK-02 | 含「栈」标题与 Playground   | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-STACK-01`）

| TC              | 描述                                                                                         | 预期       |
| --------------- | -------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-STACK-01 | 导航 / 正文 + Playground 可见 / push×3 见 3 盘 + 栈顶深绿 + 「栈顶」在顶 / pop 减 / 重置空态 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。`useStack` 纯逻辑目标行覆盖 ≥90%；StackViz 交互分支（push/pop/peek/reset/禁用/栈顶标记）全覆盖；排版骨架为纯 presentational，slot 渲染覆盖即可。

## 变更历史

- 2026-06-24：创建并落地。实际新增 24 个 Case（useStack 8 + Article 2 + Callout 1 + Playground 2 + StackViz 8 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 93.44%/93.14%/89.82%/93.41%（stmts/branch/funcs/lines）；单测 378 passed（60 文件）+ e2e 11 passed，8 个排序与播放器零回归。
