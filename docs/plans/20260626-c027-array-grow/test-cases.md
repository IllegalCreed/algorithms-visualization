# 测试用例：数组·扩容（翻倍扩容 + 均摊 O(1)）

> Status: verified
> Stable ID: C-20260626-027
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级                | 文件                                             | 编号区间                | 数量 |
| ------------------- | ------------------------------------------------ | ----------------------- | ---- |
| L3 扩容逻辑         | `src/components/structures/useGrow.spec.ts`      | `TC-GROW-LOGIC-01..10`  | 10   |
| L4 ArrayGrowViz互动 | `src/components/structures/ArrayGrowViz.spec.ts` | `TC-VIZ-GROWVIZ-01..08` | 8    |
| L4 数组页（追加）   | `src/views/Article/DataStructure/Array.spec.ts`  | `TC-VIEW-ARRAY-03`      | 1    |
| L5 e2e（追加）      | `e2e/array.e2e.ts`                               | `TC-E2E-ARRAY-02`       | 1    |

**合计新增 20 个 Case。** 无现存 `GROW` Case，命名空间干净；视图/ e2e 追加沿用数组页 `ARRAY` 命名（同页）。

**回归（不新增、必须仍绿）**：数组页现有 `TC-VIEW-ARRAY-01/02`、`TC-E2E-ARRAY-01`（ArrayViz 静态）+ 8 排序 + 其余 7 结构（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁证明 ArrayViz/骨架零改动、零回归。`TC-E2E-ARRAY-01` 仅第 10 行 `.playground` 需 `.first()` 消歧（两 Playground），断言意图不变。

## L3 — useGrow（`TC-GROW-LOGIC-*`）

| TC               | 描述                                                | 预期                         |
| ---------------- | --------------------------------------------------- | ---------------------------- |
| TC-GROW-LOGIC-01 | 初始 cap 4、len 3、items [1,2,3]、appends/copies 0  | 各值一致                     |
| TC-GROW-LOGIC-02 | append 未满（len<cap）：grew false、copies 0、cap 4 | len 4、cap 4、grew false     |
| TC-GROW-LOGIC-03 | append 到满再 append：grew true、copies 4、cap 8    | 第 2 次 grew、cap 8          |
| TC-GROW-LOGIC-04 | 连续翻倍 4→8→16（append 6 次后 cap 16）             | capacity 16                  |
| TC-GROW-LOGIC-05 | appends 计数随每次 +1                               | append 3 次后 appends 3      |
| TC-GROW-LOGIC-06 | totalCopies 累计 = 各次扩容拷贝和（4+8）            | append 6 次后 totalCopies 12 |
| TC-GROW-LOGIC-07 | amortized = (appends+totalCopies)/appends           | 公式一致                     |
| TC-GROW-LOGIC-08 | amortized 有界：append 20 次后 ≤ 3（体现 O(1)）     | ≤ 3、> 1                     |
| TC-GROW-LOGIC-09 | value = ++seq 递增（4,5,6…）                        | 依次 4、5、6                 |
| TC-GROW-LOGIC-10 | reset 复原 cap 4 len 3、计数归零                    | 各值复原                     |

## L4 — ArrayGrowViz 互动（`TC-VIZ-GROWVIZ-*`）

| TC                | 描述                                                        | 预期                |
| ----------------- | ----------------------------------------------------------- | ------------------- |
| TC-VIZ-GROWVIZ-01 | 初始 4 gcell + 3 filled + 追加/重置 按钮 + readout 含 3 / 4 | 各断言通过          |
| TC-VIZ-GROWVIZ-02 | filled 格值 1/2/3                                           | ['1','2','3']       |
| TC-VIZ-GROWVIZ-03 | append 未满：4 filled、status 含「O(1)」、仍 4 gcell        | 4 filled、status 含 |
| TC-VIZ-GROWVIZ-04 | append×2 触发扩容：8 gcell、status 含「扩容」               | 8 gcell、status 含  |
| TC-VIZ-GROWVIZ-05 | 扩容那次 status 含「O(n)」                                  | status 含           |
| TC-VIZ-GROWVIZ-06 | stats 含均摊统计（append 次数）                             | stats 含「append」  |
| TC-VIZ-GROWVIZ-07 | 连续 append 6 次：容量翻倍到 16（16 gcell）                 | 16 gcell            |
| TC-VIZ-GROWVIZ-08 | 重置回 3 filled、4 gcell                                    | 3 filled、4 gcell   |

## L4 — 数组页（追加 `TC-VIEW-ARRAY-03`）

| TC               | 描述                            | 预期     |
| ---------------- | ------------------------------- | -------- |
| TC-VIEW-ARRAY-03 | 数组页含 ArrayGrowViz（扩容节） | 组件存在 |

## L5 — e2e（追加 `TC-E2E-ARRAY-02`）

| TC              | 描述                                                                                                           | 预期       |
| --------------- | -------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-ARRAY-02 | `/docs/array` 限定 `.array-grow-viz`：初始 4 gcell/3 filled / 追加到扩容 8 gcell+status含扩容 / 重置回 4 gcell | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useGrow` 纯逻辑（append 未满/扩容两分支、amortized、reset）L3 全覆盖；ArrayGrowViz 同步分支（onAppend grew/不 grew、onReset、readout/stats）L4 覆盖（拷贝高亮 setTimeout 分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-26：创建并落地。M4 深度 D5（**深度收官**）。实际新增 20 个 Case（useGrow 10 + ArrayGrowViz 8 + view 1 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.6%/89.48%/93.34%/93.8%（聚合均过门槛）；useGrow 纯逻辑 L3 全覆盖、ArrayGrowViz 100% 行（拷贝高亮 setTimeout 由 e2e 复核）。单测 621 passed（91 文件）+ e2e 23 passed。注：① 初稿 status 用「容量满了/2 倍新数组」未含术语「扩容」→ 改解说为「触发扩容——…」（更准、TC-04 断言通过）；② 数组页加第二个 Playground 后，现有 `TC-E2E-ARRAY-01` 第 10 行 `.playground` 命中 2 个（严格模式）→ 改 `.first()`（断言意图不变）。其余 ArrayViz/骨架零改动、零回归。命名空间 `GROW`/`GROWVIZ` 干净。
