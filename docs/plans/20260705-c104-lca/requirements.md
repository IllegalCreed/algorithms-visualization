# 需求：LCA 倍增（C-20260705-104，图算法第 11 页 · 纯复用 MatrixView · M9-2）

> Status: verified
> Stable ID: C-20260705-104
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M9 完结清单第 2 项。**最近公共祖先（LCA）**：树上两点的「家谱交汇处」——树上距离、路径查询的地基。朴素做法逐步爬父链 O(n)；**倍增**预处理 `up[k][u]`（u 往上跳 2^k 步的祖先，「爸爸的爸爸」递推 `up[k][u] = up[k-1][up[k-1][u]]`），查询三段式：①深的先**对齐**（深度差按二进制拆跳）；②相同即答案；③否则**从高位试跳**——祖先不同才跳（相同则可能越过 LCA），最后停在 LCA 的两个孩子上，父亲即答案。O(n log n) 预处理 + O(log n) 查询。

## 目标

图算法第 11 页「LCA 倍增」，接入播放器，**纯复用 MatrixView（第 16 消费者，零改动）**：

1. **倍增表**：8 行节点 × 4 列 `[depth, up⁰, up¹, up²]`（-1 显示空）；build 三步逐列（递推 caption + 示例格 sources）；查询步 sources 指向被查的表格。
2. 固定 8 节点树（Python 已核验；up 表见设计）：**LCA(7,4)**——7 沿 up¹ 跳到 3 对齐，此后 k=2,1,0 **全程祖先相同不跳**，答案 fa[3]=**1**；**LCA(6,5)**——6 对齐到 3，k=0 **双跳** 3→1、5→2，答案 fa[1]=**0**。两查询覆盖「不跳/双跳」两走向，**均 = 暴力爬父链**。**11 步** = init + build×3 + (align+jump+answer)×2 + done。
3. 正文：家谱直觉 → 倍增表构建（爸爸的爸爸）→ 三段式查询与「为什么祖先相同不能跳」→ O(log n) 与应用（树上距离 = dep[u]+dep[v]−2·dep[lca]、路径求和）；Tarjan 离线 LCA/树剖点到。

## 验收标准

- `/docs/lca` 新页：正文 + 播放器同屏，四语言随步高亮；建表递推 + 查询跳跃黄格；done 给复杂度与树上距离公式。
- 菜单 + 首页「图算法」第 11 项，新图标；改 TC-HOOK（图算法 10→11，两 spec）。
- 全门禁 + 真机自检；MatrixView 纯复用零改动（既有 15 消费者零回归）。

## 非目标

- 不做 Tarjan 离线 LCA / 树链剖分（正文点到）；不做带权树上距离动画。
- 不改 AlgorithmPlayer / MatrixView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。LCA 倍增表 + 双查询，纯复用 MatrixView；11 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 真机自检通过。
