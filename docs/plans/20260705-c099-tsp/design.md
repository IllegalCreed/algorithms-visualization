# 设计：状压 DP 旅行商 TSP（C-20260705-099，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-099
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`d=[[0,4,1,3],[4,0,2,1],[1,2,0,5],[3,1,5,0]]`。fill 序（mask 升序、i 升序，12 项）：`(0011,1)=4 / (0101,2)=1 / (0111,1)=3(j=2) / (0111,2)=6(j=1) / (1001,3)=3 / (1011,1)=4(j=3) / (1011,3)=5(j=1) / (1101,2)=8(j=3) / (1101,3)=6(j=2) / (1111,1)=7(j=3，候选 10/7) / (1111,2)=6(j=1) / (1111,3)=4(j=1)`。close：`min(7+4, 6+1, 4+3) = 7`；**7 = 暴力全排列**（最优路线 0→2→1→3→0 / 0→3→1→2→0）。

## 复用（无 T0）

MatrixView 第 12 消费者零改动：8 行（含 bit0 的 mask：1,3,5,7,9,11,13,15）× 4 列；`rowLabels` 二进制 `['0001'..'1111']`、`colLabels=['0','1','2','3']`；无效格 null、`emptyText:''`；fill 步 `sources`=[[rowOf(prev), bestJ]]、close 步 sources=全集行三格。`TspExecPoint = 'init'|'fill'|'close'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`tsp.ts`：`TSP_DIST`；`tspDp()` 返回 `{fills:[{mask,i,cands:[{j,cost}],bestJ,val}], close:[{i,cost}], best}`；`bruteTsp()` 全排列（独立真值）。
`tsp.module.ts`：init（问题 + n! 爆炸 + dp[0001][0]=0 起点）→ fill×12（caption：mask 集合读法 + 候选枚举 + 胜者，sources 前置格）→ close（回边三候选取 min）→ done（7 + O(2ⁿ·n²) + n≈20 + 状压家族）。**15 步**。vars：mask 二进制与集合、当前城、dp 值、最优路线（done）。
`tsp.sources.ts`：四语言 Held-Karp（pull 式转移 + 回边收尾），lineMap init/fill/close/done。

## T2：页面 + 接线

`Tsp.vue`（Algorithm 目录）；路由 `/docs/tsp`；菜单/首页「动态规划」第 8 项（stone-merge 后）；新 svg（四城回路 + 二进制 mask）；改 TC-HOOK（DP 7→8 两 spec）。

## 复用与零回归

MatrixView 零改动（11 既有消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：8 行二进制 mask 表、fill sources=胜出前置格、close 高亮全集行；oracle tspDp 与 bruteTsp 全排列对拍；module 15 步。踩坑：module 引入未用的 TSP_DIST 被 lint 拦下，删除即过。
