# 设计：学习路径页（C-20260705-115，M11-S3）

> Status: verified
> Stable ID: C-20260705-115
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 数据

`src/data/paths.ts`：`LEARNING_PATHS: { id, title, emoji, desc, steps: string[] }[]`——四条：

1. 新手入门（12 步）：数组→栈→队列→链表→冒泡→选择→插入→二分查找→哈希→树→堆→快排。
2. 面试高频（14 步）：快排→归并→堆排→二分→二分边界→LRU→KMP→背包→LCS→硬币找零→N 皇后→岛屿→Dijkstra→拓扑。
3. 图论专线（10 步）：图→Dijkstra→Bellman-Ford→Floyd→Kruskal→Prim→拓扑→SCC→最大流→LCA。
4. 进阶专题（10 步）：线段树→树状数组→后缀数组→AC 自动机→Z 函数→TSP→数位 DP→换根 DP→FFT→Pollard's Rho。

## 页面 Paths.vue

`useCategoryData` 建 url→{title, category} 查找表；每条路径卡片：emoji+标题+desc+步骤流（`1 → 名称〔链接〕`，大类做 title 提示）；路由 `/docs/paths`。

## 入口

SearchPalette 空态第二快捷行「🗺 学习路径」→ `/docs/paths`。

## 测试

L3 PATHS-DATA 1（全部 steps url ∈ 九大类集合且各路径 ≥8 步无重复）+ L4 PAGE 3（四卡渲染/步骤链接/大类提示）+ SEARCH-08 1 + e2e 1 = 6 Case。

## 变更历史

- 2026-07-05：创建（draft → approved）。
