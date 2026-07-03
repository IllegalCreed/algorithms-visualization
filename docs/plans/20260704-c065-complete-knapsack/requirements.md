# 需求：完全背包（C-20260704-065，动态规划第 5 页 · 背包问题族补全）

> Status: verified
> Stable ID: C-20260704-065
> Owner: IllegalCreed
> Created: 2026-07-04
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

动态规划大类已有 4 页：编辑距离（C-053，序列对齐 min）、0-1 背包（C-054，优化取舍 max）、LCS（C-060，填表 + 回溯）、LIS（C-061，一维 DP）。其中 0-1 背包每个物品**只能取一次**。**完全背包**是它的经典变体——每个物品可**无限次重复取**，把「背包问题族」讲全，也是理解 DP「递推来源」维度的绝佳对照。

## 目标

在动态规划大类新增第 5 页「完全背包」，接入算法播放器（`AlgorithmPlayer`）：

1. **纯复用 MatrixView 矩阵轨**（第 6 消费者，零改动）：行=物品（∅/A/B/C）、列=容量（0..6），逐格填 DP 表，`active` 琥珀环标当前格、`sources` 黄高亮参与计算的来源格、`updatedCell` 绿闪刚填格。
2. **与 0-1 背包直接对照**：递推式几乎相同，唯一差别在「取」的来源——
   - 0-1：`dp[i][w] = max(dp[i-1][w]，dp[i-1][w-wt] + val)`，「取」来自**上一行**（取完这件就换下一个物品）；
   - 完全：`dp[i][w] = max(dp[i-1][w]，dp[i][w-wt] + val)`，「取」来自**本行**（取完还能再取同一件）。
     代码仅一处下标之差（`i-1` → `i`），可视化上「取」的来源格从**左上方**变成**同一行左侧**。
3. 固定输入：物品 A(重2,值5)/B(重3,值6)/C(重4,值7)、容量 6 → 最大价值 **15**（A 拿 3 次）；同批物品若按 0-1 只能拿 12，凸显「可重复取」的价值。

## 验收标准

- `/docs/complete-knapsack` 新页：介绍正文（点明与 0-1 的递推来源差异）+ 播放器同屏，右侧四语言代码随步高亮。
- 逐格填表动画：`init` 边界 → 每格 `cellSkip`（装不下沿用上一行）/`cellChoose`（装得下做取舍，「取」来源在本行）→ `done` 右下角 = 15。
- 菜单 + 首页「动态规划」新增第 3 项（紧接 0-1 背包），新图标 `complete-knapsack.svg`。
- 全门禁绿（format/lint/type-check/单测覆盖率/e2e）；真机自检确认 A×3 链条全在第 1 行、右下角 15。

## 非目标

- 不做完全背包的一维滚动数组优化版（二维表更利于教学对照，与 0-1 页保持同构）。
- 不做多重背包（有限次数）/ 分组背包——留待后续。
- 不改 MatrixView、不改 AlgorithmPlayer、不新增执行点类型（复用 `KnapsackExecPoint`）。

## 变更历史

- 2026-07-04：创建（draft → approved）。动态规划第 5 页，完全背包，纯复用 MatrixView（第 6 消费者）+ 复用 KnapsackExecPoint，与 0-1 背包递推来源对照。
- 2026-07-04：交付验收（approved → verified）。16 Case 全绿（module 12 + 视图 3 + e2e 1）+ 改 TC-HOOK 2；真机自检确认 cellChoose「取」来源在本行（dp[1][6] 的取源 dp[1][4] 同行高亮）、A×3 链 0→5→10→15、右下角 15；MatrixView/AlgorithmPlayer/类型零改动。
