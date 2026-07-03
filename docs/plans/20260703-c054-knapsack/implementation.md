# 实现记录：0-1 背包（C-20260703-054，DP 大类 DP2）

> Status: verified
> Stable ID: C-20260703-054
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 类型扩展**：types.ts +KnapsackExecPoint（唯一框架改动，纯追加）。MatrixView/MatrixTrack 零改动（复用 C-053 的 rowLabels/colLabels/emptyText）。
2. **T1 module + oracle + sources**（L3）：先 knapsack.module.spec（TC-KNAP-MOD-01..12）跑红 → knapsack.{ts,sources.ts,module.ts}（二维 DP 重走）跑绿。
3. **T2 新页 + 接线**：Knapsack.vue（Article + AlgorithmPlayer）；路由 /docs/knapsack；菜单 + 首页「动态规划」+0-1 背包（新 knapsack.svg）；改 TC-HOOK-01-1/02-1（动态规划 1→2）；Knapsack.spec + knapsack.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap DP2）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 唯一框架改动**：types.ts +`KnapsackExecPoint`（init/cellSkip/cellChoose/done 4 点）。**MatrixView/MatrixTrack 零改动**——纯复用 C-053 的 rowLabels/colLabels/emptyText。
- **T1 module + oracle + sources**：`knapsack.ts`（固定 4 物品 A(2,3)B(3,4)C(4,5)D(5,6) + 容量 5 + 二维 DP oracle `knapsackTrace`）+ `knapsack.sources.ts`（4 语言 0-1 背包）+ `knapsack.module.ts`（逐格重走：init 填边界 0、每格 cellSkip〈重>容量沿用上格，sources 单个上格〉/cellChoose〈max(不取=上格, 取=左上偏移 weight 格+价值)，sources 两格〉；updatedCell 绿）。DP 表 5×6，最优值=7（选 A+B），10 skip + 10 choose，22 步。rowLabels=['∅','A','B','C','D']、colLabels=['0'..'5']、emptyText=''。
- **T2 新页 + 接线**：Knapsack.vue（Article 正文：0-1 背包/取舍递推〈装不下沿用、装得下 max(不取,取)〉/DP 表填法/vs 编辑距离〈优化 max vs 对齐 min〉/应用 + AlgorithmPlayer）；路由 `/docs/knapsack`；菜单 + 首页「动态规划」分类 +0-1 背包（新 `knapsack.svg`：背包外形 + 内装物品方块）；改 TC-HOOK-01-1/02-1（动态规划 children 1→2）。

### 坑点

- 无坑。knapsack.module 12 首跑即绿；MatrixView 零改动 → 既有方阵/字符轴用法（Floyd/编辑距离）+ TC-VIZ-MATRIXVIEW-\* 零回归。
- **MatrixView 通用矩阵原语三验成立**：Floyd（方阵 + labels 双用 + null='∞'）+ 编辑距离（字符轴 + 异标签 + null=''空白）+ 0-1 背包（数值轴 + 物品×容量异标签 + null=''空白）——第 3 消费者零改动，矩阵原语稳定，后续 DP（LCS/完全背包/子集和填表）继续复用。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：147 文件 **1053 passed**（+15：knapsack.module 12 + Knapsack 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.05% / Branch 92.81% / Func 94.27% / Line 94.84%**。MatrixView + 编辑距离 + Floyd + 8 轨零回归。
- **e2e**：Playwright **46 passed**（+1 TC-E2E-KNAP-01）。
- **真机自检**（Playwright 脚本，`/docs/knapsack`）：
  - 首步——30 单元（5×6）、counter `1/22`、**行列异标签（列 0-5 容量 / 行 ∅ABCD 物品）**、**20 空白未填格**、无 `.bars-view`、Shiki **141 token**。
  - 步 17（D 容量 1，cellSkip）——**当前格琥珀环 + 单个上格源**、字幕「D 重 5 装不下容量 1：沿用上一行 = 0」。
  - 末步——counter `22/22`、DP 表 **[∅:0×6/A:0,0,3,3,3,3/B:0,0,3,4,4,7/C:0,0,3,4,5,7/D:0,0,3,4,5,7]（= oracle）**、**右下角 = 最优值 7**。
- **零回归**：MatrixView（方阵 Floyd + 字符 编辑距离用法）+ 编辑距离 + Floyd + 既有 8 轨 + 6 图算法 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 types +KnapsackExecPoint（MatrixView 零改动）+ T1 knapsack.module（二维 DP 22 步）+ T2 新页 Knapsack.vue + 菜单/首页动态规划 +0-1 背包 + TC-HOOK（动态规划 1→2）。**纯复用 MatrixView 矩阵轨零改动**（第 3 消费者，数值轴 DP）。门禁全绿（单测 1053 / e2e 46 / 覆盖率 94.05%）；真机 DP 表 = oracle、右下角=7 无误。**M6 动态规划 DP2 达成——DP 大类兼有序列对齐（编辑距离）与优化选择（背包）两类范例。**
