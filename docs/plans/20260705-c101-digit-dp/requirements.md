# 需求：数位 DP（C-20260705-101，动态规划第 10 页 · 纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-101
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

「统计 [1, N] 里有多少个数不含数字 4」——逐个检查 O(N) 在 N=10¹⁸ 时爆炸。**数位 DP** 按十进制位从高到低「走位」：每一位分两类——**自由分支**（本位填小于上界位的合法数字，后缀彻底自由，每位 9 种选择 → 乘 `9^剩余位`）与**贴着走**（本位恰填上界位数字，继续受上界约束）；若上界位本身是被禁数字，**tight 断裂**，后面整段无路。O(位数) 完成天文量级计数。

## 目标

动态规划第 10 页「数位 DP」，接入播放器，**纯复用 MatrixView（第 14 消费者，零改动）**：

1. **走位表**：4 行（百位 2 / 十位 4 / 个位 5 / 合计）× 4 列 `[位上, 可选数, 后缀 9^k, 小计]`；free 步填行并 `updatedCell`=小计格；tight 步 `active`=位上格判定；broken 行仅位上数字、其余空；sum 步 `sources`=两个小计格。
2. 固定 `N=245`、禁数字 4（Python 已核验）：百位 free {0,1}×81=162、tight 2✓；十位 free {0,1,2,3}×9=36、**tight 4✗ 断裂**；个位整位跳过；合计 198（含 0）→ **[1,245] 答案 197 = 暴力逐个检查**。**8 步** = init + (free+tight)×2 + broken + sum + done。
3. 正文：暴力爆炸 → 走位两分支直觉 → tight 断裂与「N 自身」补偿 → 记忆化模板 `dp(pos, tight, state)` 与常见 state（前导零/上一位/余数）→ 应用（不含 62、二进制 1 计数、windy 数）。

## 验收标准

- `/docs/digit-dp` 新页：正文 + 播放器同屏，四语言随步高亮；走位表逐行点亮 + tight 断裂戏剧点；done 给 197。
- 菜单 + 首页「动态规划」第 10 项，新图标；改 TC-HOOK（DP 9→10，两 spec）。
- 全门禁 + 真机自检；MatrixView 纯复用零改动（既有 13 消费者零回归）。

## 非目标

- 不做记忆化搜索版动画（正文给模板）；不做多状态（前导零等）实例。
- 不改 AlgorithmPlayer / MatrixView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。数位 DP 走位表，纯复用 MatrixView；162+36→197，8 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（DP 9→10）；真机 tight 断裂戏剧点 caption + sum 197；MatrixView 13 既有消费者零回归（e2e 3/3）。
