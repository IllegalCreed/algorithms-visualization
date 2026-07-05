# 需求：区间 DP 石子合并（C-20260705-098，动态规划第 7 页 · 纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-098
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

DP 线已有序列/背包两族，缺**区间 DP**：石子合并——n 堆石子排一行，每次只能合并**相邻**两堆、代价为两堆之和，求合成一堆的最小总代价。贪心（每次挑最小）会错；正解是 `dp[i][j] = min over k (dp[i][k] + dp[k+1][j]) + sum(i..j)`——**区间由短及长、枚举分割点**，区间 DP 的模板题。

## 目标

动态规划第 7 页「石子合并」，接入播放器，**纯复用 MatrixView（第 11 消费者，零改动）**：

1. **上三角 dp 表**：4×4，对角线 dp[i][i]=0（init 即填）、下三角 null 隐藏；逐格 `active/updatedCell`，split 步 `sources` 黄高亮**最优拆分对** (i,k)/(k+1,j)。
2. 固定 `[4,1,3,2]`（Python 已核验）：len2 直合 5/4/5；len3 枚举拆分 dp[0][2]=12（k=0 胜）、dp[1][3]=10（k=2 胜）；len4 三候选 10/10/12 → **dp[0][3]=20 = 暴力枚举全部合并顺序**。**8 步** = init + pair×3 + split×3 + done。
3. 正文：贪心反例 → 状态设计（区间为阶段）→ 由短及长与分割点枚举 → 复杂度 O(n³) → 环形变体（拆环成链）与四边形不等式优化点到；链接 LCS/编辑距离（同为二维表 DP 的不同填表序）。

## 验收标准

- `/docs/stone-merge` 新页：正文 + 播放器同屏，四语言随步高亮；上三角逐格填 + 拆分对黄高亮；done 给 20 与贪心反例。
- 菜单 + 首页「动态规划」第 7 项，新图标；改 TC-HOOK（DP children 6→7，两 spec）。
- 全门禁 + 真机自检；MatrixView 纯复用零改动（既有 10 消费者零回归）。

## 非目标

- 不做环形石子合并 / 四边形不等式优化（正文点到）；不做合并过程的柱形动画（表驱动为主）。
- 不改 AlgorithmPlayer / MatrixView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。石子合并区间 DP，纯复用 MatrixView；dp[0][3]=20，8 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（DP 6→7）；真机 split 步候选枚举 caption + 拆分对黄格；MatrixView 10 既有消费者零回归（e2e 3/3）。
