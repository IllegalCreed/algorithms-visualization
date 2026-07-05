# 需求：换根 DP 树中距离之和（C-20260705-103，动态规划第 11 页 · 纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-103
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M9 完结清单首项。树形 DP 算的是「以固定根看子树」；很多题要「**以每个点为根**」的答案（树中距离之和、最远距离、子树外信息）——逐点重跑 O(n²)。**换根 DP（二次扫描）**：第一趟后序算子树内信息，第二趟前序**从父推子**——根从 u 换到相邻的 v 时，v 子树里 size[v] 个点**近了 1 步**、其余 n−size[v] 个点**远了 1 步**：`ans[v] = ans[u] − size[v] + (n − size[v])`，全树摊成 O(n)。

## 目标

动态规划第 11 页「换根 DP」（DP 真收官），接入播放器，**纯复用 MatrixView（第 15 消费者，零改动）**：

1. **三列节点表**：5 行（rowLabels 树位置 `0·根 / 1·L / 2·R / 3·LL / 4·LR`）× 3 列 `[size, down, ans]`；后序填 size+down（内部节点 sources=孩子四格）、root 步 `ans[0]=down[0]`（sources=down 格）、reroot 步 sources=[父 ans 格, 自己 size 格]。
2. 固定 5 节点完全二叉树（Python 已核验）：后序 `3,4,1,2,0` 得 `size=[5,3,1,1,1]、down=[6,2,0,0,0]`；换根 DFS 序 `1→3→4→2` 得 **ans=[6,5,9,8,8] = 暴力 BFS 逐点对拍**（每步公式 caption：近 size[v] 远 n−size[v]）。**12 步** = init + down×5 + root + reroot×4 + done。
3. 正文：O(n²) 之痛 → 二次扫描直觉（一让一收的账本迁移）→ 换根公式推导 → 换根三件套（可减性/子树外信息/DFS 序）→ 应用（834 距离和、最远节点、树的中心）；与树形 DP 页互链。

## 验收标准

- `/docs/reroot-dp` 新页：正文 + 播放器同屏，四语言随步高亮；两趟填表 + 换根公式黄格；done 给 ans 与 O(n)。
- 菜单 + 首页「动态规划」第 11 项，新图标；改 TC-HOOK（DP 10→11，两 spec）；TreeDp 页「换根」预告改实链。
- 全门禁 + 真机自检；MatrixView 纯复用零改动（既有 14 消费者零回归）。

## 非目标

- 不做带权边/最远距离版本（正文点到）；不做多实例。
- 不改 AlgorithmPlayer / MatrixView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。换根 DP 二次扫描，纯复用 MatrixView；ans=[6,5,9,8,8]，12 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（DP 10→11）；真机换根公式逐项代入 + 父 ans/自 size 双黄格；MatrixView 14 既有消费者零回归（e2e 3/3）。
