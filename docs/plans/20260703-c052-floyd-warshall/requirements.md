# 需求：Floyd-Warshall 多源最短路（新图算法页 + 新 MatrixView 矩阵轨）

> Status: verified
> Stable ID: C-20260703-052
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；新建 MatrixView 第 8 轨，供 DP 大类复用）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 图算法分类扩充**（G4）；C-047 Dijkstra / C-050 Bellman-Ford（单源最短路，本页为其「全源」升级）；C-006 算法播放器框架（本变更新增第 8 条 MatrixView 轨）；**后续 DP 大类（背包/LCS/编辑距离）复用本变更建的 MatrixView 轨**
> Related tests: 计划新增 `TC-VIZ-MATRIXVIEW-*`（MatrixView 新轨）/ `TC-PLAYER-MATRIX-*`（播放器接矩阵轨）/ `TC-FLOYD-MOD-*`（floyd.module）/ `TC-VIEW-FLOYD-01/02/03`（页）/ `TC-E2E-FLOYD-01`（e2e）；**修改** `TC-HOOK-01-1`/`TC-HOOK-02-1`（图算法 5→6、新增 floyd-warshall）

> ⚠️ 编号：全局计数到 051；本变更为 **C-20260703-052**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 图算法**已有单源最短路（Dijkstra C-047、Bellman-Ford C-050）+ MST（Kruskal/Prim）+ 拓扑（C-051）。本变更加 **Floyd-Warshall**——**全源（任意两点）最短路**，是单源最短路的自然升级（一次求出所有点对之间的最短距离）。
- **教学点**：Floyd 是「矩阵上的动态规划」——三重循环 `for k: for i: for j: dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])`。核心思想：逐个允许把点 k 作为「中转点」，看「i 经 k 到 j」是否比「i 直接到 j」更短。
- **新可视化原语**：单源算法用 GraphView 的节点徽标（dist），全源要展示的是**一整张 n×n 距离矩阵**——这是项目缺的可视化原语。本变更新建 **MatrixView 矩阵轨**（第 8 条轨），承载距离矩阵 + 中转点行列高亮 + 单元更新。**该轨为后续 DP 大类（背包/LCS/编辑距离，都是矩阵 DP）铺路**。

## 三个地基决策

1. **新建 MatrixView 矩阵轨（第 8 轨，additive）**：`AlgorithmPlayer` 加 `<MatrixView v-if="current.matrix">`（同既有 7 轨的可插拔模式，其它算法不设 matrix → 零回归）。`MatrixTrack` 通用字段：labels（行列标签）、cells（n×n 值，∞ 记 null）、pivot（中转点 k 高亮行列）、active（当前单元 (i,j)）、sources（参与求和的 (i,k)/(k,j)）、updatedCell（更新绿闪）。Floyd 无柱数组 → array:[]（BarsView 已可选，零回归），只渲 MatrixView。
2. **固定 4 点有向带权图**：新建一张 4 点 6 边有向带权图（含环 → 全点对可达，终态矩阵无 ∞），矩阵 4×4 紧凑可读。图数据放 `floyd.ts`（module + oracle 共用）。
3. **Floyd 三重循环细粒度重走**：init（矩阵 = 邻接）→ 每个中转点 k（pivotStart 高亮第 k 行/列）→ 对候选单元 (i,j)（i≠k、j≠k、i≠j、且 (i,k)/(k,j) 两腿均有限）relaxUpdate/relaxSkip → done。~19 步，对齐 4 语言逐行高亮。

## 要做什么

1. **框架扩展**（`player/types.ts` + `AlgorithmPlayer.vue` + 新 `MatrixView.vue`，additive）：+`MatrixTrack`/`Step.matrix?`/`FloydExecPoint`；`<MatrixView v-if="current.matrix">`。补 `TC-VIZ-MATRIXVIEW-*`（矩阵轨渲染）+ `TC-PLAYER-MATRIX-*`（播放器接矩阵轨 + 其它算法不渲染）。
2. **算法模块**（`src/algorithms/floyd.module.ts` + `floyd.ts`〈图数据 + oracle〉 + `floyd.sources.ts` 4 语言）：三重循环重走。约 19 步。
3. **新页面**（`src/views/Article/Algorithm/Floyd.vue`）：Article 正文（全源最短路 / Floyd 三重循环怎么做 / 它是矩阵 DP / vs 单源 Dijkstra·Bellman-Ford）+ AlgorithmPlayer。
4. **接线**：路由 `/docs/floyd-warshall`（name='floyd-warshall'）；菜单图算法 +Floyd；首页网格 +Floyd（新 floyd.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1/02-1 图算法 children 5→6、url 加 'floyd-warshall'。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case + HOOK 文案）、roadmap（M6 图算法 G4）。

## 不做什么（边界）

- **不改 GraphView / 4 图算法 / 15 排序 / 15 结构**（纯新增轨 + 新页）。
- **不做负环检测 / 路径重建的完整可视化**（正文一句带过）；不做可调图；Floyd 页不并显 GraphView（矩阵即完整表达，聚焦矩阵轨）。
- 固定图、三重循环，主线呈现。

## 业务规则 / 约束

- **数据**：新建固定有向带权图（4 点 A–D，6 边，含环），终态距离矩阵全有限（见 design.md）。
- **可视化**：MatrixView（n×n 单元 + 中转点 k 行列高亮 + 当前单元 active + 求和源单元 sources + 更新绿闪）+ vars（k/i/j / 当前比较 / 更新数）。
- **向后兼容硬约束**：MatrixTrack/Step.matrix?/FloydExecPoint 均追加；`<MatrixView v-if>` 可插拔（其它算法不设 matrix → 零回归）→ 既有 15 排序 + 7 轨 + 15 结构 + 5 图算法 + 播放器现有 Case 零改动通过。仅 TC-HOOK-01-1/02-1 因菜单加项而改（图算法 6 项）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] Floyd 页 `/docs/floyd-warshall`：**正文 + 交互可视化（MatrixView 矩阵轨）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——init 矩阵=邻接（6 个 ∞）、每个 k 高亮中转行列、候选单元比较「i→k→j vs i→j」并更新（绿闪）/跳过，末步全源最短距离矩阵。真机步 7 中转 B 行列高亮 + 源单元 A→B/B→D 黄 + A→D 更新为 7；末步矩阵 [0,3,5,6/8,0,2,3/6,9,0,1/5,8,10,0] 无 ∞。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 92 Shiki token。
- [x] **零回归**：既有 15 排序 + 7 轨 + 15 结构 + 5 图算法 + 播放器各轨全绿；既有 7 轨组件零改动（AlgorithmPlayer 仅 additive 加 MatrixView v-if + import）。单测 1021 绿、e2e 44 绿。
- [x] 图算法菜单/首页 6 项，TC-HOOK-01-1/02-1 更新；新 floyd.svg；三索引 + roadmap（M6 G4）回写。
- [x] MatrixView 为通用矩阵轨（labels/cells/pivot/active/sources/updatedCell），**后续 DP 大类可直接复用**（本变更验收其 Floyd 用法）。

## 开放问题

- 无天然柱数组 → array:[]（BarsView 隐藏，C-047 已实现）。
- 步粒度：只对「候选单元」（i→k→j 两腿有限、i≠k≠j）出 relaxUpdate/relaxSkip 步，避免 n³ 全枚举的冗长（~19 步）；正文说明 Floyd 逻辑上遍历所有 (k,i,j)。
- MatrixView 单元 ∞ 显示为空/「∞」；本图终态全有限，∞ 主要出现在 init/中途。

## 变更历史

- 2026-07-03：创建。M6 图算法 G4——Floyd-Warshall 全源最短路。**新建第 8 条 MatrixView 矩阵轨**（通用 n×n 矩阵原语，为 DP 大类铺路）+ 固定 4 点图三重循环重走 + 4 语言 sources。唯一新轨 additive（可插拔，零回归）。新页 + 路由/菜单/首页接线 + TC-HOOK（图算法 5→6）。编号 052。按 skip-visual-confirmation 直接进文档+TDD。
