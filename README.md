[English](README.en.md)

# 数据结构和算法可视化 · Algorithm Visualizer

把算法一步一步跑给你看：九大类 92 个数据结构与算法条目。77 个算法页可以逐步回放，并与 TypeScript / Python / Go / Rust 代码逐行同步高亮；另外 15 个基础数据结构页可以在页面里直接操作。

**在线体验：https://algo.illegalscreed.cn/** （镜像：https://illegalcreed.github.io/algorithms-visualization/）

![快速排序逐步回放](docs/assets/quick-sort-step-through.gif)

## 特性

- **可回放的逐步动画**：单步前进 / 后退、拖动进度条、0.5× / 1× / 2× / 3× 倍速、循环播放，键盘 ← → 空格
- **四语言代码同步**：TypeScript / Python / Go / Rust，当前执行行实时高亮；变量面板 + 每步解说
- **自定义输入**：12 个排序模块可输入自己的数组，自动写入 `?input=`，链接可分享
- **测验**：二分查找、快速排序在关键步骤拦停出题
- **学习工具**：⌘K / Ctrl+K 搜索、复杂度速查表。中文站 4 条学习路径（新手入门 / 面试高频 / 图论专线 / 进阶专题）；英文站把同一目录收成 8 条主题路线（Foundations / Sorting Systems / Graph Structure / Dynamic Programming / Backtracking / String Structure / Number Theory / Geometry）
- **中英双语、移动端适配**

## 内容（9 大类 92 个条目）

| 分类         | 数量 | 条目                                                                                                                                                                 |
| ------------ | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 数据结构     | 16   | 数组、链表、栈、队列、树、堆、哈希表、图、字典树、并查集、LRU 缓存、跳表、线段树、B+ 树、布隆过滤器、树状数组                                                        |
| 经典排序算法 | 16   | 冒泡排序、鸡尾酒排序、双调排序、选择排序、插入排序、二分插入排序、希尔排序、归并排序、自顶向下归并、快速排序、三路快排、双轴快排、堆排序、计数排序、基数排序、桶排序 |
| 图算法       | 12   | Dijkstra 最短路、Kruskal 最小生成树、Prim 最小生成树、Bellman-Ford 最短路、拓扑排序、Floyd 多源最短路、强连通分量、2-SAT、最大流、二分图匹配、LCA 倍增、欧拉路径     |
| 动态规划     | 11   | 编辑距离、0-1 背包、完全背包、最长公共子序列、最长递增子序列、硬币找零方案数、石子合并、旅行商 TSP、树形 DP、数位 DP、换根 DP                                        |
| 回溯与搜索   | 9    | N 皇后、子集生成、全排列、组合总和、迷宫寻路、岛屿数量、单词搜索、数独、A\* 寻路                                                                                     |
| 字符串       | 8    | KMP 字符串匹配、Rabin-Karp、Boyer-Moore、Manacher、后缀数组、LCP / height 数组、AC 自动机、Z 函数                                                                    |
| 数学与数论   | 10   | 埃氏筛、线性筛、欧几里得算法、快速幂、扩展欧几里得、中国剩余定理、欧拉函数、米勒-拉宾、FFT、Pollard's Rho                                                            |
| 计算几何     | 5    | 凸包、旋转卡壳、最近点对、线段相交、扫描线求交                                                                                                                       |
| 查找         | 5    | 二分查找、二分边界、旋转数组搜索、二分答案、三分查找                                                                                                                 |

## 截图

| 首页                                  | Dijkstra                                                    | 0-1 背包                                                      |
| ------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| ![首页](docs/assets/01-home-1440.png) | ![Dijkstra 播放器](docs/assets/04-dijkstra-1440-player.png) | ![0-1 背包播放器](docs/assets/05-knapsack-dp-1440-player.png) |

![手机端快速排序](docs/assets/08-quick-sort-mobile-390x844-player.png)

## 快速开始

需要 Node.js 22（与 CI 一致）和 pnpm（通过 corepack，版本锁定在 `package.json` 的 `packageManager`）。

```bash
corepack enable
pnpm install
pnpm dev          # 本地开发
pnpm test:unit    # Vitest
pnpm test:e2e     # Playwright
pnpm build        # 类型检查 + 构建 + 预渲染
```

## 实现简介

- Vue 3（`<script setup>`）+ TypeScript + Vite + Pinia + Less。运行时依赖为 Vue、Vue Router、Pinia 与 Shiki
- 接入播放器的 77 个算法各由 `xxx.ts`（oracle）+ `xxx.module.ts`（生成步骤快照 `Step[]`）+ `xxx.sources.ts`（四语言源码 + 执行点到行号的映射）组成。数据结构里的树状数组走这套播放器；其余 15 个结构页是可交互演示
- `AlgorithmPlayer` 只负责回放快照；柱状、树、图、矩阵、棋盘、迷宫、字符带等 20 种轨道按步骤字段按需渲染
- 构建后用 Playwright 预渲染中英文共 190 个页面（各 95 页：92 个条目，加上首页、复杂度速查和学习路径）

## 致谢 / 同类项目

[VisuAlgo](https://visualgo.net/)、[algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer)、[Hello 算法](https://github.com/krahets/hello-algo)

## 许可证

[MIT](LICENSE)
