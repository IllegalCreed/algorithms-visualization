# 设计：区间 DP 石子合并（C-20260705-098，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-098
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`[4,1,3,2]`、前缀和区间 sum。填表序（len 由短及长）：`dp[0][1]=5 / dp[1][2]=4 / dp[2][3]=5`（len2 直合）；`dp[0][2]=min(0+4, 5+0)+8=12（k=0）`、`dp[1][3]=min(0+5, 4+0)+6=10（k=2）`（len3）；`dp[0][3]=min(0+10, 5+5, 12+0)+10=20（k=0，与 k=1 平手取先）`。**20 = 暴力枚举全部合并顺序**。

## 复用（无 T0）

MatrixView 第 11 消费者零改动：`labels/colLabels/rowLabels=['4','1','3','2']`（堆值）、`cells` 4×4（对角 0、下三角 null、`emptyText:''`）、`active/updatedCell` 当前格、split 步 `sources`=[[i,k],[k+1,j]] 最优拆分对。`StoneExecPoint = 'init'|'pair'|'split'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`stones.ts`：`ST_PILES=[4,1,3,2]`；`stonesDp()` 返回 `{dp, fills:[{i,j,len,sum,cands:[{k,cost}],bestK,val}]}`；`bruteMerge()` 递归枚举所有相邻合并顺序（独立真值）。
`stones.module.ts`：init（4 堆 + 表 + 对角 0 + 贪心反例预告）→ pair×3（相邻直合 caption 算式）→ split×3（caption 枚举全部拆分候选与代价、sources 黄高亮胜者对）→ done（20 + 区间 DP 范式 + 环形/四边形点到）。**8 步**。vars：len、[i,j]、区间和、最优 k、dp 值。
`stones.sources.ts`：四语言区间 DP（前缀和 + len/i/k 三层循环），lineMap init/pair/split/done。

## T2：页面 + 接线

`StoneMerge.vue`（Algorithm 目录）；路由 `/docs/stone-merge`；菜单/首页「动态规划」第 7 项（coin-change 后）；新 svg（石堆 + 合并箭头）；改 TC-HOOK（DP 6→7 两 spec）。

## 复用与零回归

MatrixView 零改动（Floyd/编辑距离/背包×2/LCS/LIS/硬币找零/扩欧/CRT/米勒-拉宾 10 消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：上三角表对角 0 起步、fills 六步逐格、sources=最优拆分对；oracle stonesDp 与 bruteMerge 全序枚举对拍；module 8 步。
