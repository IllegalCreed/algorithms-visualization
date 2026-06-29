# 测试用例：线段树 Segment Tree（C-20260629-033）

> Status: verified
> Stable ID: C-20260629-033
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（useSegTree 纯逻辑）/ L4（SegTreeViz 互动 + SegmentTree 视图）/ L5（线段树页 e2e）
> 命名空间：`TC-SEG-LOGIC-*`、`TC-VIZ-SEGVIZ-*`、`TC-VIEW-SEG-*`、`TC-E2E-SEG-*`；**改** `TC-HOOK-01-2` / `TC-HOOK-02-4`

## L3 —— `useSegTree` 纯逻辑（`src/components/structures/useSegTree.spec.ts`）

固定数组 `[2,5,1,4,9,3,7,6]`，求和线段树 15 节点（pos 0..14、叶 pos 7..14）。

| 用例 ID         | 场景            | 输入 / 操作                    | 期望                                                                    |
| --------------- | --------------- | ------------------------------ | ----------------------------------------------------------------------- |
| TC-SEG-LOGIC-01 | 建树规模与根    | 初始                           | `nodes.length===15`；root（pos0）`sum===37`、`lo===0 hi===7`            |
| TC-SEG-LOGIC-02 | 叶子还原原数组  | 初始                           | pos 7..14 的 `sum` 依序 `[2,5,1,4,9,3,7,6]`、均 `isLeaf`                |
| TC-SEG-LOGIC-03 | 节点管辖区间    | 初始                           | pos1 `[0,3]`、pos2 `[4,7]`、pos4 `[2,3]`、pos10 `[3,3]`                 |
| TC-SEG-LOGIC-04 | 内部节点聚合和  | 初始                           | pos1 `12`、pos2 `25`、pos3 `7`、pos4 `5`、pos5 `12`、pos6 `13`          |
| TC-SEG-LOGIC-05 | 区间查询·拆两段 | `query(2,5)`                   | `sum===17`、`covered` 等于 `[4,5]`（取用 2 个整段覆盖 4 元素）          |
| TC-SEG-LOGIC-06 | 区间查询·整树   | `query(0,7)`                   | `sum===37`、`covered` 等于 `[0]`（root 一个整段）                       |
| TC-SEG-LOGIC-07 | 区间查询·单点   | `query(3,3)`                   | `sum===4`、`covered` 等于 `[10]`（叶 [3,3]）                            |
| TC-SEG-LOGIC-08 | 区间查询·四段   | `query(1,6)`                   | `sum===29`、`covered.length===4`（[1,1]+[2,3]+[4,5]+[6,6]）             |
| TC-SEG-LOGIC-09 | 单点更新·路径   | `update(2,10)`                 | 返回 `path` 等于 `[9,4,1,0]`（叶→根）；root `sum===46`、pos4 `sum===14` |
| TC-SEG-LOGIC-10 | 更新后再查询    | `update(2,10)` 后 `query(2,5)` | `sum===26`（10+4+9+3）                                                  |
| TC-SEG-LOGIC-11 | 重置复原        | `update(2,10)` 后 `reset()`    | root `sum===37`；其后 `query(2,5).sum===17`                             |

## L4 —— `SegTreeViz` 互动（`src/components/structures/SegTreeViz.spec.ts`）

挂载组件断言。

| 用例 ID          | 场景            | 操作                 | 期望                                                                    |
| ---------------- | --------------- | -------------------- | ----------------------------------------------------------------------- |
| TC-VIZ-SEGVIZ-01 | 初始结构渲染    | mount                | 15 个 `.seg-node`、14 条 `.seg-edge`、a/b 两输入、区间和/更新/重置 按钮 |
| TC-VIZ-SEGVIZ-02 | 节点显聚合和    | mount                | 节点文本含根的和 `37`；叶子文本含 `9`（原数组最大）                     |
| TC-VIZ-SEGVIZ-03 | 区间和·点亮整段 | a=2,b=5 → 区间和     | status 含 `17`；`.seg-node.covered` 数量为 2                            |
| TC-VIZ-SEGVIZ-04 | 区间和·整树     | a=0,b=7 → 区间和     | status 含 `37`；`.seg-node.covered` 数量为 1                            |
| TC-VIZ-SEGVIZ-05 | 区间和·单点     | a=3,b=3 → 区间和     | status 含 `4`                                                           |
| TC-VIZ-SEGVIZ-06 | 单点更新·和变化 | a=2,b=10 → 更新      | status 含 `更新`；存在 `.seg-node` 文本含 `46`（root 重算）             |
| TC-VIZ-SEGVIZ-07 | 单点更新·路径亮 | a=2,b=10 → 更新      | `.seg-node.onpath` 数量为 4（叶→根路径）                                |
| TC-VIZ-SEGVIZ-08 | 重置清高亮复原  | 先区间和 2,5，再重置 | `.seg-node.covered` 与 `.onpath` 均为 0；节点文本含 `37`                |

## L4 —— `SegmentTree` 视图（`src/views/Article/DataStructure/SegmentTree.spec.ts`）

| 用例 ID        | 场景         | 期望                                                         |
| -------------- | ------------ | ------------------------------------------------------------ |
| TC-VIEW-SEG-01 | 页面骨架渲染 | 含 `Article`；含「线段树」标题文案；含 `Playground`          |
| TC-VIEW-SEG-02 | 内嵌互动组件 | 渲染 `SegTreeViz`（存在 `.seg-tree-viz`、15 个 `.seg-node`） |

## L5 —— 线段树页 e2e（`e2e/segment-tree.spec.ts`）

限定容器 `.seg-tree-viz`，避免与正文文字串扰。

| 用例 ID       | 场景            | 操作                                                   | 期望                                                                                |
| ------------- | --------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| TC-E2E-SEG-01 | 页面可达 + 互动 | 访问 `/docs/segment-tree`；区间和 2,5；更新 2→10；重置 | 15 个 `.seg-node`；区间和后 status 含 `17`；更新后 status 含 `更新`；重置后高亮清空 |

## 回归（改计数）

| 用例 ID      | 文件                                | 改动                                           |
| ------------ | ----------------------------------- | ---------------------------------------------- |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构分类条目数 12→**13**（新增「线段树」） |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构分类条目数 12→**13**（新增「线段树」） |

## 其它回归

- 既有 12 结构页 + 8 排序 + 播放器 + 骨架：现有 Case **零改动**全绿（除上面两条计数）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位（参考既有 ~90%）。

## 自测报告（2026-06-29）

- 执行命令：`pnpm format` → `pnpm format:check` / `pnpm lint:check` / `pnpm type-check` / `pnpm test:unit run --coverage` / `pnpm exec playwright test`
- 新增用例：L3 11（TC-SEG-LOGIC-01..11）+ L4 互动 8（TC-VIZ-SEGVIZ-01..08）+ L4 视图 2（TC-VIEW-SEG-01/02）+ L5 1（TC-E2E-SEG-01）= **22 新**；改 2 计数（TC-HOOK-01-2 / TC-HOOK-02-4）。合 **23 Case** 涉及本变更。
- 结果：**全绿**。单测 `724 passed`（106 文件，含新 23 - 2 改 = +21 文件级新增项）；e2e `28 passed`（含 TC-E2E-SEG-01）。
- 覆盖率（聚合）：Statements 92.8% / Branches 90.06% / Functions 93.78% / Lines 93.86%——均高于门槛（≥70% / ≥60%）。SegTreeViz.vue 93.33%/91.3%/100%/92.98%；useSegTree 纯逻辑由 11 条 L3 全量覆盖；SegmentTree.vue 静态模板挂载渲染。
- 真机自检（Playwright 截图，localhost:5173 `/docs/segment-tree`）：初始 root 37 + 15 节点二叉树正确；区间和 [2,5] → 点亮 pos4/pos5 两个整段（绿）+ 状态「和 = 17，只取用 2 个整段」；更新 第2→5 → 黄色点亮叶→根 4 节点（5→9→16→41）+ 各祖先和正确重算。
- 结论：达成验收口径，**verified**。
