# 设计：最近点对（C-20260704-083，复用 HullView + divider/strip）

> Status: verified
> Stable ID: C-20260704-083
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

8 点（按 x 排序）`(0,0),(1,3),(2,1),(3,4),(3.5,1.5),(4,4.5),(5,0.5),(6,3)`；中线 x=3.25；左最近 (0,0)↔(2,1)=√5、右最近 (3.5,1.5)↔(5,0.5)≈1.803 → δ=1.803；带内（y 序）5 点，merge 4 次比较、两次刷新：(2,1)↔(3.5,1.5)=1.581 → (3,4)↔(4,4.5)=**1.118**；与暴力一致。

## T0：HullView additive 两字段

`HullTrack` 补：`divider?: number | null`（中线 x，数学坐标，紫竖线贯穿画布）+ `strip?: [number, number] | null`（带 x 范围 [lo,hi]，浅紫半透明矩形）。`ClosestPairExecPoint = 'init'|'divide'|'half'|'strip'|'merge'|'done'`。`caliper`/`best` 复用（比较对蓝虚线 / 最近对绿线）。

## T1：oracle + module + sources

`closestpair.ts`：`CP_POINTS`（8 点）+ `bruteClosest(ps)`（暴力）+ `closestPair()`（一层分治：mid、左右暴力、δ、带内 y 序近邻扫描）→ {d:≈1.118, pair:[3,5]}（下标）。
`closestpair.module.ts`：10 步——init / divide（divider=3.25）/ half 左（best 绿线 + d）/ half 右（δ=min）/ strip（strip=[3.25−δ,3.25+δ] + caption 带内 5 点）/ merge×4（caliper=比较对；刷新时更新 best）/ done。距离显示保留 3 位小数。
`closestpair.sources.ts`：四语言分治（sort/递归/δ/strip 扫描），lineMap init/divide/half/strip/merge/done。

## T2：页面 + 接线

`ClosestPair.vue` 正文（分治、δ 带、鸽笼常数邻居、O(n log n)、与凸包对偶）；路由 `/docs/closest-pair`；菜单/首页几何第 3 项；新 svg；改 TC-HOOK。

## 复用与零回归

HullView 两字段 additive；凸包/卡壳页不设 → 不变。AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：HullView +divider（紫虚线贯穿）/strip（浅紫矩形）；closestpair oracle 与暴力对拍、module 10 步（divide/half×2/strip/merge×4）；fmt 去尾零；type 修 s.caption 可空。
