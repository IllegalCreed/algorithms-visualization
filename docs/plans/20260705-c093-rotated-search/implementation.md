# 实现记录：旋转数组搜索（C-20260705-093，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-093
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：rotsearch.module.spec（TC-RS-MOD-01..12）红 → rotsearch.{ts,sources,module} 绿（types 仅 +RsExecPoint）。
2. T2：RotatedSearch.vue + 路由 + 菜单/首页查找第 3 项 + svg + TC-HOOK + 页 spec + e2e；C-091 页尾实链。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **同 C-091/092 纯复用**：闭区间 groupMembers、pivotIndex=mid、found sortedIndices；断崖造型由数据 [13,15,17,1,3,5,7,9,11] 天然呈现。types 仅 +RsExecPoint。
- oracle rotsearch.ts：linearIndex（独立真值）；rotTrace 判半轨迹（sortedHalf/inSorted 逐探记录，spec 可全断言）。
- module 8 步：两试验（t=5 右半在内→左半在内→HIT；t=15 有序半排除→HIT）+ done（引理 + 重复元素退化 O(n) 坑）；probe caption 完整讲「判半 → 范围 → 去留」三段论。
- 双向链接：C-091 页尾「旋转有序数组」改实链；本页预告二分答案（收官技）。

## 自测报告

- 门禁全绿 1730/95.95%/95.62%；e2e 3/3；真机判半叙事 + 淡出全对。
- 回归：主柱轨/ArrowTrack/emphasis 零改动；查找前 2 页零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
