# 实现记录：子集生成（C-20260703-056，决策树轨首发）

> Status: verified
> Stable ID: C-20260703-056
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 DecisionTreeView**：types.ts +DecisionTreeTrack/Step.decisionTree?/SubsetsExecPoint；AlgorithmPlayer +`<DecisionTreeView v-if>`；先 DecisionTreeView.spec（TC-VIZ-DTREEVIEW-01..04）+ AlgorithmPlayer.spec（TC-PLAYER-DTREE-01/02）跑红 → DecisionTreeView.vue 跑绿。
2. **T1 module + oracle + sources**（L3）：先 subsets.module.spec（TC-SUBSETS-MOD-01..12）跑红 → subsets.{ts,sources.ts,module.ts}（决策树 DFS 重走）跑绿。
3. **T2 新页 + 接线**：Subsets.vue（Article + AlgorithmPlayer）；路由 /docs/subsets；菜单 + 首页「回溯与搜索」第 2 项（新 subsets.svg）；改 TC-HOOK-01-1/02-1（回溯 children +subsets）；Subsets.spec + subsets.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 回溯第 2 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 新建第 10 条 DecisionTreeView 决策树轨**：types.ts +`DecisionTreeTrack`（nodes/edges/activeId/pathIds/visitedIds/solutionIds）+ `Step.decisionTree?` + `SubsetsExecPoint`；AlgorithmPlayer +import + `<DecisionTreeView v-if="current.decisionTree">`（同既有 9 轨可插拔模式，既有轨零改动）。`DecisionTreeView.vue` 对齐 GraphView 的 SVG 定位节点 + 边范式（viewBox `0 0 640 300`）：边 `<line>` + 中点决策标签，父子同在 `pathIds` → `.on-path`（琥珀加粗）；节点 `<circle>` + 叶标签（圆下方），状态类 `.active`（琥珀环）/`.on-path`（浅琥珀）/`.visited`（淡实）/`.solution`（绿）。TC-VIZ-DTREEVIEW 4 + TC-PLAYER-DTREE 2。
- **T1 module + oracle + sources**：`subsets.ts`（`SUBSET_ELEMS=[1,2,3]` + `buildSubsetTree` 前序建满二叉决策树并算坐标〈叶子横向均分、内部取子中点、y 按深度〉 + `subsetsAll` oracle + `subsetLabel`）+ `subsets.sources.ts`（4 语言经典「逐元素选/不选」回溯 + lineMap）+ `subsets.module.ts`（与建树同构的 DFS 细粒度重走：start 根、include/exclude 下降、record 叶记录、backtrack 回退换枝、done 收尾）。**31 步**（start 1 + include/exclude 14 + record 8 + backtrack 7 + done 1）。
- **T2 新页 + 接线**：Subsets.vue（Article 正文：子集/幂集、选/不选决策树、DFS 回溯、2^n、决策树通用心智模型 + 与 N 皇后对比 + AlgorithmPlayer）；路由 `/docs/subsets`；菜单 + 首页「回溯与搜索」第 2 项（新 `subsets.svg`：二叉决策树分叉图标）；改 TC-HOOK-01-1/02-1（回溯 children → `['n-queens','subsets']`）。

### 坑点

- 无坑。DecisionTreeView 4 + subsets.module 12 首跑即绿。决策树布局用「前序即叶子左→右」性质，叶子横向均分后内部节点自底向上取子中点，一遍成型；module 用 `pathKey`（'I'/'E' 决策串）+ `byKey` 映射精确对齐建树递归，`pathTo` 由 `tree[parent]` 上溯（id == 数组下标）得根→当前路径。
- **播放器可插拔轨达 10 条**：Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/**DecisionTree**。AlgorithmPlayer 仅 additive 加一行 v-if，既有 9 轨 + 9 算法页（6 图 + 2 DP + N 皇后）+ 15 排序 + 15 结构零改动全绿。决策树原语通用，后续回溯题（排列/组合/组合总和）可复用。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：153 文件 **1095 passed**（+21：DecisionTreeView 4 + 播放器接决策树轨 2 + subsets.module 12 + Subsets 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.28% / Branch 93.2% / Func 94.39% / Line 95.03%**。既有 9 轨零改动。
- **e2e**：Playwright **48 passed**（+1 TC-E2E-SUBSETS-01）。
- **真机自检**（Playwright 脚本，`/docs/subsets`）：
  - 首步——15 节点、14 边、0 解叶、无 `.bars-view`、counter `1 / 31`、Shiki **100 token**、字幕「从空集 ∅ 出发，对每个元素依次决定选/不选」。
  - 步 3（选 3 到底）——字幕「选 3 → 当前子集 {1,2,3}」、active 1 + **on-path 4**（根→选1→选2→选3 路径高亮）。
  - 末步——counter `31`、**8 解叶**、字幕「全部 2^3 = 8 个子集枚举完毕（幂集）」、解叶标签 `["{1,2,3}","{1,2}","{1,3}","{1}","{2,3}","{2}","{3}","∅"]`（DFS 序 8 子集精确无误）。
- **零回归**：既有 9 轨 + 6 图算法 + 2 DP + N 皇后 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 新建第 10 条 DecisionTreeView 决策树轨（types +DecisionTreeTrack/Step.decisionTree?/SubsetsExecPoint + AlgorithmPlayer +v-if；DecisionTreeView.vue + 6 Case）+ T1 subsets.module（决策树 DFS 31 步）+ T2 新页 Subsets.vue + 「回溯与搜索」第 2 项 + 路由/菜单/首页接线 + TC-HOOK（回溯 children +subsets）。**新决策树原语为回溯家族（排列/组合/组合总和）铺路**。门禁全绿（单测 1095 / e2e 48 / 覆盖率 94.28%）；真机 31 步、决策树 DFS 路径高亮、末步 8 解叶序无误。**M6 回溯与搜索第 2 页达成，可插拔轨达 10 条。**
