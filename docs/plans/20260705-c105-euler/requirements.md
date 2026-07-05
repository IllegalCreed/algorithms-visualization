# 需求：欧拉路径 Hierholzer（C-20260705-105，图算法第 12 页 · 纯复用 GraphView · M9-3）

> Status: verified
> Stable ID: C-20260705-105
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M9 完结清单第 3 项。**一笔画**（欧拉路径）：每条边恰走一次。判定定理：连通 + 奇度点 0 个（回路，随处起）或 2 个（路径，必从一个奇度点起、终于另一个）。**Hierholzer**：从起点沿未用边贪心走、边走边消（压栈）；卡住（当前点无未用边）就弹栈进路径；若栈顶还有余边则从它续走子环——环自动插进路径；栈清空后反转即欧拉路径，O(E)。

## 目标

图算法第 12 页「欧拉路径」，接入播放器，**纯复用 GraphView（第 10 消费者，零改动）**：

1. **消边动画**：`edgeClass` 已走边 mst 绿（=消掉）、`stackNodes` 虚线环表在栈、`activeNode` 栈顶、`nodeBadge` 动态显**剩余未用边数**（减到 0 即卡住，判定与执行一目了然）；栈/路径序列放 vars。
2. 固定 5 节点 7 边无向图（Python 已核验；度数 [2,3,4,3,2]、奇度 {1,3}）：从 1 贪心走 1-3-4-2-3 **在 3 卡住**（终点度数用光）→ 弹 3 进路径、**栈顶 2 还有余边** → 子环 2-1-0-2 插入 → 连环弹清栈 → 反转得 `[1,3,4,2,1,0,2,3]`，7 边各一次、起终=两奇度点，**= 暴力回溯搜路对拍**。**12 步** = init + check + walk×4 + back + walk×3 + back(清栈) + done。
3. 正文：七桥问题起源 → 判定定理（为什么奇度点 0/2）→ Hierholzer 栈法与「子环插入」→ O(E) 与应用（一笔画/DNA 测序 de Bruijn/中国邮递员点到）。

## 验收标准

- `/docs/euler-path` 新页：正文 + 播放器同屏，四语言随步高亮；消边渐绿 + 徽标递减 + 卡住弹栈剧情；done 给定理与复杂度。
- 菜单 + 首页「图算法」第 12 项，新图标；改 TC-HOOK（图算法 11→12，两 spec）。
- 全门禁 + 真机自检；GraphView 纯复用零改动（既有 9 消费者零回归）。

## 非目标

- 不做有向图欧拉路径 / 中国邮递员 / de Bruijn 图构造（正文点到）。
- 不改 AlgorithmPlayer / GraphView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。Hierholzer 消边 + 子环插入剧情，纯复用 GraphView；12 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 真机自检通过。
