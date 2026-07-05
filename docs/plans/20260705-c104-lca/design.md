# 设计：LCA 倍增（C-20260705-104，纯复用 MatrixView · M9-2）

> Status: verified
> Stable ID: C-20260705-104
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

树（父数组 `[-1,0,0,1,1,2,3,6]`）：

```
        0
       / \
      1   2
     / \    \
    3   4    5
    |
    6
    |
    7
```

depth=[0,1,1,2,2,2,3,4]；up⁰=父；up¹=[−,−,−,0,0,0,1,3]；up²=[−×7,0]。
**LCA(7,4)**：深度差 2=10₂ → 沿 up¹ 跳 7→3；k=2（−1=−1 不跳）、k=1（0=0 不跳）、k=0（1=1 不跳）→ 全程相同，答案 up⁰[3]=**1**。**LCA(6,5)**：深度差 1 → up⁰ 跳 6→3；k=2,1 相同；k=0 up⁰[3]=1≠up⁰[5]=2 → **双跳** 3→1、5→2；答案 up⁰[1]=**0**。均 = 暴力爬父链。

## 复用（无 T0）

MatrixView 第 16 消费者零改动：8 行 `rowLabels=['0','1','2','3','4','5','6','7']` × 4 列 `colLabels=['depth','up⁰','up¹','up²']`（−1 → null 空）；build 步整列填 + 示例递推格 sources；align 步 sources=[[u, k+1]]（被用的跳表格）；jump 步 sources=[[u,1],[v,1]]；answer 步 sources=[[u,1]]。`LcaExecPoint = 'init'|'build'|'align'|'jump'|'answer'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`lca.ts`：`LCA_PAR`、`LOG=3`；`buildUp()` → `{depth, up}`；`lcaTrace(u,v)` → `{aligns:[{from,to,k}], checks:[{k,u,v,same,uTo?,vTo?}], answer}`；`bruteLca(u,v)` 爬父链（独立真值）。
`lca.module.ts`：init（树 ASCII + 问题）→ build×3（depth+up⁰ 一步、up¹「爸爸的爸爸」、up²）→ 查询 ①(7,4)：align（up¹ 跳）+ jump（三次判定合并一步：全程相同不跳 + 「为什么不能跳」caption）+ answer（fa=1）→ 查询 ②(6,5)：align + jump（k=0 双跳）+ answer（fa=0）→ done（复杂度 + 树上距离公式 + Tarjan/树剖点到）。**11 步**。vars：查询、u/v 当前位、k、深度。
`lca.sources.ts`：四语言（build 递推 + query 三段式），lineMap init/build/align/jump/answer/done。

## T2：页面 + 接线

`Lca.vue`（Algorithm 目录，正文树 ASCII）；路由 `/docs/lca`；菜单/首页「图算法」第 11 项（hungarian 后）；新 svg（树 + 双点跳跃汇合）；改 TC-HOOK（图算法 10→11 两 spec）。

## 复用与零回归

MatrixView 零改动（15 既有消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致（sources 面板 label 补四语言 Tab 文案）。
