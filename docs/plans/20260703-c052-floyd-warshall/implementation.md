# 实现记录：Floyd-Warshall 多源最短路（C-20260703-052，M6 图算法 G4）

> Status: verified
> Stable ID: C-20260703-052
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 MatrixView**：types.ts +MatrixTrack/Step.matrix?/FloydExecPoint；AlgorithmPlayer +`<MatrixView v-if>`；先 MatrixView.spec（TC-VIZ-MATRIXVIEW-01..04）+ AlgorithmPlayer.spec（TC-PLAYER-MATRIX-01/02）跑红 → MatrixView.vue 跑绿。
2. **T1 module + oracle + sources**（L3）：先 floyd.module.spec（TC-FLOYD-MOD-01..12）跑红 → floyd.{ts,sources.ts,module.ts}（三重循环重走）跑绿。
3. **T2 新页 + 接线**：Floyd.vue（Article + AlgorithmPlayer）；路由 /docs/floyd-warshall；菜单 + 首页 +Floyd（新 floyd.svg）；改 TC-HOOK-01-1/02-1（图算法 5→6）；Floyd.spec + floyd-warshall.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap M6 G4）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 新建第 8 条 MatrixView 轨**：types.ts +`MatrixTrack`（labels/cells〈null=∞〉/pivot/active/sources/updatedCell）+ `Step.matrix?` + `FloydExecPoint`；AlgorithmPlayer +import + `<MatrixView v-if="current.matrix">`（同既有 7 轨的可插拔模式，既有轨渲染逻辑零改动）。`MatrixView.vue` 用 `<table>` 渲染 (n+1)² 网格：`.matrix-cell` + `.mx-pivot`（第 k 行/列浅染）/`.mx-source`（求和源单元黄）/`.mx-active`（当前单元琥珀环）/`.mx-updated`（更新绿）/`.mx-diag`（对角淡化）。TC-VIZ-MATRIXVIEW 4 + TC-PLAYER-MATRIX 2。
- **T1 module + 图数据 + oracle**：`floyd.ts`（固定 4 点 6 边含环有向图 + `floydInitMatrix()` 邻接 + `floydTrace()` 三重循环 oracle）+ `floyd.sources.ts`（4 语言三重循环）+ `floyd.module.ts`（三重循环细粒度重走）。**只对候选单元出步**（i≠k、j≠k、i≠j、且 (i,k)/(k,j) 两腿有限）→ 避免 n³ 全枚举冗长，得 **19 步**（#pivotStart=4、#relaxUpdate=10、#relaxSkip=3）。终态矩阵 [0,3,5,6/8,0,2,3/6,9,0,1/5,8,10,0]。
- **T2 新页 + 接线**：Floyd.vue（Article 正文：全源 vs 单源 / 三重循环 / **它是矩阵 DP**〈k 最外层 = 逐步放开中转限制〉/ Floyd vs 单源 + AlgorithmPlayer）；路由 `/docs/floyd-warshall`；菜单 + 首页 +Floyd（新 `floyd.svg`：距离矩阵 3×3 网格 + 对角实心 + 中转行列浅染）；改 TC-HOOK-01-1/02-1（图算法 5→6）。Floyd.spec + floyd-warshall.e2e。

### 坑点

- 无坑。MatrixView 4 + floyd.module 12 均首跑即绿（矩阵逐 k 手算与 oracle 双验一致）。
- **可插拔轨模式再验成立**：MatrixView 是第 8 条轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/**Matrix**），AlgorithmPlayer 仅 additive 加一行 v-if，既有 7 轨 + 6 算法 Case 零改动全绿。矩阵原语通用（labels/cells/pivot/active/sources/updated），DP 大类（背包/LCS/编辑距离填表）可直接复用。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：143 文件 **1021 passed**（+21：MatrixView 4 + 播放器接矩阵轨 2 + floyd.module 12 + Floyd 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 93.89% / Branch 92.59% / Func 94.26% / Line 94.73%**。既有 7 轨组件零改动。
- **e2e**：Playwright **44 passed**（+1 TC-E2E-FLOYD-01）。
- **真机自检**（Playwright 脚本，`/docs/floyd-warshall`）：
  - 首步——16 单元（4×4）、counter `1/19`、**6 个 ∞**、无 `.bars-view`、Shiki **92 token**。
  - 步 7（中转 B）——**pivot 高亮 7 单元（B 行 + B 列）+ 2 源单元黄（A→B=3、B→D=4）+ active 单元 A→D 琥珀环变绿 = 7**、字幕「更短！A→D 更新为 7（经 B 中转）」。
  - 末步——counter `19/19`、矩阵 **[0,3,5,6/8,0,2,3/6,9,0,1/5,8,10,0]（= oracle）**、**无 ∞**（全点对可达）。
- **零回归**：既有 15 排序 + 7 轨 + 15 结构 + 5 图算法 + 播放器各轨 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 新建第 8 条 MatrixView 矩阵轨（types +MatrixTrack/Step.matrix?/FloydExecPoint + AlgorithmPlayer +v-if；MatrixView.vue + 6 Case）+ T1 floyd.module（三重循环 19 步）+ T2 新页 Floyd.vue + 路由/菜单/首页接线 + TC-HOOK（图算法 5→6）。**新矩阵原语为 DP 大类铺路**。门禁全绿（单测 1021 / e2e 44 / 覆盖率 93.89%）；真机中转高亮 + 末步矩阵 = oracle 无误。M6 图算法 G4 达成。
