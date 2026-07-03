# 实现记录：全排列（C-20260703-057，复用决策树轨）

> Status: verified
> Stable ID: C-20260703-057
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T1 module + oracle + sources**（L3，复用决策树轨）：types.ts +`PermuteExecPoint`（无新轨/新字段）；先 permute.module.spec（TC-PERMUTE-MOD-01..12）跑红 → permute.{ts,sources.ts,module.ts}（多叉排列树 DFS 重走）跑绿。
2. **T2 新页 + 接线**：Permute.vue（Article + AlgorithmPlayer）；路由 /docs/permutations；菜单 + 首页「回溯与搜索」第 3 项（新 permute.svg）；改 TC-HOOK-01-1/02-1（回溯 children +permutations）；Permute.spec + permutations.e2e。
3. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 回溯第 3 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **复用 DecisionTreeView 决策树轨（零改动）**：仅 types.ts +`PermuteExecPoint`（无新轨、无 `Step` 新字段、DecisionTreeView.vue / AlgorithmPlayer.vue 零改动）。这是决策树原语的第 2 个消费者（子集第 1），验证其通用性。
- **T1 module + oracle + sources**：`permute.ts`（`PERMUTE_ELEMS=[1,2,3]` + `buildPermuteTree` 前序建**多叉**排列树〈子 = 剩余未用元素升序，每个一支〉并算坐标 + `permutationsAll` oracle + `permLabel`〈`[1,3,2]` 有序元组，区别于子集 `{1,3}` 集合〉）+ `permute.sources.ts`（4 语言 `used[]` 标记 + 挑未用回溯 + lineMap）+ `permute.module.ts`（与建树同构的 DFS 细粒度重走：start 根、choose 下降、record 叶记录、backtrack 换枝、done 收尾）。**28 步**（start 1 + choose 15 + record 6 + backtrack 5 + done 1）；backtrack 数 = Σ内部节点(子数−1) = 根(3−1)+深1 三节点各(2−1) = 5。
- **T2 新页 + 接线**：Permute.vue（Article 正文：排列/n!、从剩余挑一个的多叉决策树、与子集二叉对照、used 剪枝、三视角总结 + AlgorithmPlayer）；路由 `/docs/permutations`；菜单 + 首页「回溯与搜索」第 3 项（新 `permute.svg`：多叉决策树分叉图标）；改 TC-HOOK-01-1/02-1（回溯 children → `['n-queens','subsets','permutations']`）。

### 坑点

- 无坑。permute.module 12 首跑即绿。多叉树 `childrenOf(id)=tree.filter(parent===id)` 保持前序（升序建子）顺序，与 oracle DFS 一致；`backtrack` 步在「子 idx>0」时 emit（回到父挑下一个剩余元素），active=父节点。
- **决策树轨复用验证成功**：DecisionTreeView 按 `nodes`/`edges` 泛化渲染，多叉树（根 3 子）无需任何改动即承载。播放器可插拔轨仍 10 条，子集（二叉）+ 全排列（多叉）共用第 10 轨。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：155 文件 **1110 passed**（+15：permute.module 12 + Permute 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.38% / Branch 93.39% / Func 94.48% / Line 95.12%**。DecisionTreeView / AlgorithmPlayer 零改动。
- **e2e**：Playwright **49 passed**（+1 TC-E2E-PERMUTE-01）。
- **真机自检**（Playwright 脚本，`/docs/permutations`）：
  - 首步——16 节点、15 边、无 `.bars-view`、counter `1 / 28`、Shiki **132 token**、字幕「空排列：每个位置从剩余未用元素里挑一个」。
  - 步 2（选 1 后选 2）——字幕「选 2 → 当前排列 [1,2]，剩余 {3}」、active 1 + **on-path 3**（根→选1→选2 路径高亮）。
  - 末步——counter `28`、**6 排列叶**、字幕「全部 6（= 3!）个排列枚举完毕」、排列叶 `["[1,2,3]","[1,3,2]","[2,1,3]","[2,3,1]","[3,1,2]","[3,2,1]"]`（DFS 序 6 排列精确无误）。
- **零回归**：既有 10 轨 + 6 图算法 + 2 DP + N 皇后 + 子集 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。复用 DecisionTreeView 决策树轨（第 2 消费者，零改动）+ types +PermuteExecPoint + permute.module（多叉排列树 DFS 28 步）+ 新页 Permute.vue + 「回溯与搜索」第 3 项 + 路由/菜单/首页接线 + TC-HOOK（回溯 children +permutations）。门禁全绿（单测 1110 / e2e 49 / 覆盖率 94.38%）；真机 28 步、多叉决策树 DFS 路径高亮、末步 6 排列叶序无误。**M6 回溯与搜索第 3 页达成，决策树轨复用验证成功。**
