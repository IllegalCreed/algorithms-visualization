# 实现记录：最近点对（C-20260704-083，复用 HullView）

> Status: verified
> Stable ID: C-20260704-083
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. T0：types +divider/strip + ClosestPairExecPoint；HullView.spec 追加 TC-VIZ-HULLVIEW-CP-01/02 红→绿。
2. T1：closestpair.module.spec（TC-CP-MOD-01..12）红 → closestpair.{ts,sources,module} 绿。
3. T2：ClosestPair.vue + 路由 + 菜单/首页第 3 项 + svg + TC-HOOK + 页 spec + e2e。
4. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- HullView additive：divider（数学 x → 屏幕竖线贯穿）/strip（[lo,hi] → 半透明矩形垫底）；lineOf 复用。
- oracle closestpair.ts：一层分治（mid=3.25、两半暴力、δ、带内 y 序近邻扫描）+ bruteClosest 对拍。
- module 10 步：init/divide/half×2/strip/merge×4/done；merge 逐对 caliper + 刷新即换 best；fmt 去尾零。
- 教学亮点：δ=右半 1.803，带内 5 点，跨带两次刷新（1.581→1.118），最终答案跨中线。

## 自测报告

- 门禁全绿 1571/95.82%/95.4%；e2e 3/3；真机中线/带/刷新/末步 1.118。
- 回归：divider/strip additive，凸包/卡壳页不设 → 全绿。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
