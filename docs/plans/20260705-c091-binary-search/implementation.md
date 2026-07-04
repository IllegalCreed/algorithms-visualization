# 实现记录：二分查找（C-20260705-091，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-091
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：bsearch.module.spec（TC-BS-MOD-01..12）红 → bsearch.{ts,sources,module} 绿（types 仅 +BsExecPoint）。
2. T2：BinarySearch.vue + 路由 + 菜单/首页新大类「查找」 + svg + TC-HOOK（8→9）+ 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **主柱轨回归初心（零新 View、零轨字段）**：array 10 柱恒序（无 FLIP）；pointers lo='0'红/mid='1'蓝/hi='2'黄；emphasis 语义复用——groupMembers=候选区间（区间外 dimmed，「扔掉一半」可视化）、pivotIndex=mid 探针、sortedIndices=[idx] 命中绿。types 仅 +BsExecPoint。
- oracle bsearch.ts：linearFind 线性扫（独立真值）；bsearchTrace 闭区间轨迹（probes + finalLo/finalHi）。
- module 16 步：runTrial(17 命中) + runTrial(4 未命中) + done；cut 步 caption 记「扔掉 k 个候选」，empty 步「没有一个格子被冤枉」。
- 新大类接线：菜单/首页第 9 大类「查找」；TC-HOOK 两 spec toHaveLength(9) + data[8]。
- 踩坑：主柱轨 e2e 选择器是 .bars-view（BarsView 组件），不是 .list。

## 自测报告

- 门禁全绿 1700/95.95%/95.51%；e2e 3/3（新页修选择器后过）；真机淡出/命中/箭头全对。
- 回归：主柱轨/ArrowTrack/emphasis 零改动，排序 16 页零回归（抽 bubble/quick e2e 过）。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
