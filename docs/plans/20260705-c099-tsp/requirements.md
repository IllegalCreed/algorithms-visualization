# 需求：状压 DP 旅行商 TSP（C-20260705-099，动态规划第 8 页 · 纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-099
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

DP 线收官补**状压 DP**：旅行商问题（TSP）——n 城各访问一次回到起点，求最短回路。全排列 O(n!) 爆炸；**Held-Karp** 把「访问过哪些城」压成二进制 mask：`dp[mask][i]` = 从城 0 出发、已访问 mask 集合、现在在城 i 的最短路程，转移 `dp[mask][i] = min over j∈mask∖{i} (dp[mask∖{i}][j] + d[j][i])`，O(2ⁿ·n²)——「集合当下标」是状压 DP 的灵魂。

## 目标

动态规划第 8 页「旅行商 TSP」，接入播放器，**纯复用 MatrixView（第 12 消费者，零改动）**：

1. **状态表**：8 行（含起点的 mask，二进制 rowLabels `0001..1111`）× 4 列（当前城）；无效格 null 隐藏；逐格 `active/updatedCell`，fill 步 `sources` 黄高亮胜出前置格 `dp[mask∖{i}][bestJ]`；close 步 sources 高亮全集行三格。
2. 固定 4 城距离 `[[0,4,1,3],[4,0,2,1],[1,2,0,5],[3,1,5,0]]`（Python 已核验）：12 次 fill（mask 升序）→ 全集行 `dp[1111]=[·,7,6,4]` → 回边收尾 `min(7+4, 6+1, 4+3) = 7 = 暴力全排列`。**15 步** = init + fill×12 + close + done。
3. 正文：n! 爆炸 → 集合当状态的洞察（在乎「去过哪些」而非「顺序」）→ 转移与填表序（mask 升序天然拓扑）→ 复杂度 O(2ⁿ·n²) 与 n≈20 上限 → 状压家族（子集枚举/轮廓线）点到；链接石子合并（DP 第三种状态设计）。

## 验收标准

- `/docs/tsp` 新页：正文 + 播放器同屏，四语言随步高亮；状态表逐格填 + 前置黄格；done 给 7 与复杂度。
- 菜单 + 首页「动态规划」第 8 项，新图标；改 TC-HOOK（DP 7→8，两 spec）。
- 全门禁 + 真机自检；MatrixView 纯复用零改动（既有 11 消费者零回归）。

## 非目标

- 不做路径回溯高亮回路（vars/caption 给最优路线文字）；不做近似算法（正文点到）。
- 不改 AlgorithmPlayer / MatrixView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。TSP 状压 DP，纯复用 MatrixView；12 fill → 7 = 暴力，15 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（DP 7→8）；真机 fill 候选枚举 + 前置黄格、close 三候选 3 黄格；MatrixView 11 既有消费者零回归（e2e 4/4）。
