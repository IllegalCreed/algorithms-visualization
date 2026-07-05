# 设计：M9 B 档变体正文补强（C-20260705-109）

> Status: verified
> Stable ID: C-20260705-109
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 设计

纯正文（无代码/轨改动）：

- **Bellman.vue** 新增 `<h2>彩蛋：差分约束——最短路解不等式组</h2>` 一节：核心是「不等式 x_v − x_u ≤ w 与三角不等式 dist[v] ≤ dist[u] + w 同构」→ 建边跑 Bellman-Ford、dist 即可行解、负环即矛盾；点出负权天然出现故非 BF 莫属。
- **SuffixArray.vue** 结尾段扩写：SAM = 所有子串的 O(n) 自动机、在线构造、「后缀们的合并版 Trie」直觉、数不同子串/最长公共子串线性；定位为后缀数组之后的进阶。

## 测试

L4 各 +1：TC-VIEW-BELLMAN-04（含「差分约束」与不等式）、TC-VIEW-SA-04（含「后缀自动机」与「SAM」）。

## 变更历史

- 2026-07-05：创建即交付（draft → verified）。
