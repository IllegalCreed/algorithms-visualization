# 需求：0-1 背包（动态规划大类第 2 页，纯复用 MatrixView 矩阵轨）

> Status: verified
> Stable ID: C-20260703-054
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；DP 大类第 2 页，MatrixView 经数值轴 DP 三验通用）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 动态规划大类**（DP2）；**C-053 编辑距离（DP 大类首发，本页与之配对「优化 DP vs 序列对齐 DP」）**；C-052 Floyd（建 MatrixView 矩阵轨——本页纯复用零改动）
> Related tests: 计划新增 `TC-KNAP-MOD-*`（knapsack.module）/ `TC-VIEW-KNAP-01/02/03`（页）/ `TC-E2E-KNAP-01`（e2e）；**修改** `TC-HOOK-01-1`/`TC-HOOK-02-1`（动态规划分类 1→2、新增 knapsack）

> ⚠️ 编号：全局计数到 053；本变更为 **C-20260703-054**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 动态规划大类**：C-053 编辑距离开张（序列对齐类二维 DP，min 递推）。本变更加 **0-1 背包**——最经典的**入门 DP**、**优化/取舍类**二维 DP（max 递推）。与编辑距离配对，让 DP 大类同时有「序列对齐」与「优化选择」两类范例。
- **教学点**：每件物品**取或不取**（0-1）。`dp[i][w]` = 前 i 件物品、容量 w 时的最大价值。递推：装不下（重 > w）就<strong>沿用上一行</strong>（不取）；装得下就取 <strong>max(不取 = 上格, 取 = 上一行剩余容量格 + 本物品价值)</strong>。
- **复用 C-052/053 的 MatrixView 矩阵轨**：0-1 背包也是「填表」DP——**纯复用 MatrixView 零改动**（行 = 物品、列 = 容量，行列异标签 + 未填空白均已由 C-053 支持）。这验证 MatrixView 对**数值轴 DP**（非字符串）同样通用，是矩阵原语的第 3 个消费者。

## 三个地基决策

1. **纯复用 MatrixView（零改动）**：行 = 物品（∅/A/B/C/D）、列 = 容量（0..5）。MatrixTrack 的 rowLabels/colLabels/emptyText 已支持（C-053）——本变更**不改 MatrixView.vue / MatrixTrack**。唯一 additive：`types.ts` +`KnapsackExecPoint`。
2. **固定物品 + 容量**：4 件物品 A(重2,值3) B(重3,值4) C(重4,值5) D(重5,值6)，容量 W=5。DP 表 5×6，最优值 = **7**（选 A+B：重 2+3=5、值 3+4=7）。图数据放 `knapsack.ts`（module + oracle 共用）。
3. **二维 DP 逐格重走**：init 填边界（第 0 行/列 = 0）→ 逐格填（装不下 cellSkip 沿用上格 / 装得下 cellChoose 取 max(不取,取)，sources 高亮「上格(不取)」+「左上偏移格(取)」）→ done。22 步。

## 要做什么

1. **框架扩展**（`player/types.ts`，additive）：+`KnapsackExecPoint`（`'init'|'cellSkip'|'cellChoose'|'done'`）。MatrixView/MatrixTrack 零改动。
2. **算法模块**（`src/algorithms/knapsack.module.ts` + `knapsack.ts`〈物品/容量 + oracle〉 + `knapsack.sources.ts` 4 语言）：二维 DP 重走。22 步。
3. **新页面**（`src/views/Article/Algorithm/Knapsack.vue`）：Article 正文（什么是 0-1 背包 / 取舍递推 / DP 表填法 / vs 编辑距离〈优化 max vs 对齐 min〉/ 应用）+ AlgorithmPlayer。
4. **接线**：路由 `/docs/knapsack`（name='knapsack'）；菜单 + 首页「动态规划」分类各 +0-1 背包（新 knapsack.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1/02-1 动态规划分类 1→2 项、url 加 'knapsack'。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case）、roadmap（DP2）。

## 不做什么（边界）

- **不改 MatrixView / 编辑距离 / Floyd / 图算法 / 15 排序 / 15 结构**（纯复用 + 新页）。
- **不做物品回溯（选了哪些）/ 空间优化一维 DP 的可视化**（正文点到为止）；不做可调物品。
- 固定物品与容量，经典二维 DP，主线呈现。

## 业务规则 / 约束

- **数据**：物品 A(2,3)B(3,4)C(4,5)D(5,6)、容量 5，DP 表 5×6，最优值 7（选 A+B）。
- **可视化**：MatrixView（行 ∅ABCD、列 0-5，单元 = 最大价值，未填空白，当前格 active 琥珀环，「不取(上格)」+「取(左上偏移格)」sources 黄，填入绿）+ vars（物品/容量、不取值/取值、取 max）。
- **向后兼容硬约束**：KnapsackExecPoint 追加 → MatrixView + 编辑距离 + Floyd + 8 轨 + 6 图算法 + 15 排序 + 15 结构零改动通过。仅 TC-HOOK-01-1/02-1 因动态规划加项而改。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] 0-1 背包页 `/docs/knapsack`：**正文 + 交互可视化（MatrixView DP 表）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——init 边界 0、逐格填（装不下沿用上格、装得下取 max(不取,取)，源格黄、填入绿）、末步右下角 = 最优值 7。真机末步 DP 表 [∅:0/A:0,0,3,3,3,3/B:0,0,3,4,4,7/C:0,0,3,4,5,7/D:0,0,3,4,5,7]、右下角=7。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 141 Shiki token。
- [x] **零回归**：MatrixView + 编辑距离 + Floyd + 8 轨 + 6 图算法 + 15 排序 + 15 结构全绿（MatrixView 零改动）。单测 1053 绿、e2e 46 绿。
- [x] 动态规划菜单/首页 2 项（编辑距离 + 0-1 背包），TC-HOOK-01-1/02-1 更新；新 knapsack.svg；三索引 + roadmap 回写。
- [x] MatrixView 第 3 消费者（数值轴 DP）验证：矩阵原语通用于非字符串 DP（真机异标签 列 0-5/行 ∅ABCD + 空白未填格）。

## 开放问题

- 无天然柱数组 → array:[]（BarsView 隐藏）。
- 步粒度：init + 每内部格一步（cellSkip/cellChoose）+ done ≈ 22 步（4×5 内部格）。
- sources：cellSkip 单个「上格」；cellChoose 两个「上格(不取)」+「左上偏移 weight 格(取)」。

## 变更历史

- 2026-07-03：创建。M6 动态规划 DP2——0-1 背包。**纯复用 C-052/053 MatrixView 矩阵轨零改动**（第 3 消费者，数值轴 DP），唯一 additive types +KnapsackExecPoint。与编辑距离配对「优化 DP vs 序列对齐 DP」。固定 4 物品 + 容量 5 二维 DP 重走 + 4 语言 sources。新页 + 接线 + TC-HOOK（动态规划 1→2）。编号 054。按 skip-visual-confirmation 直接进文档+TDD。
