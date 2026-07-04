# 实现记录：三分查找（C-20260705-095，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-095
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD；纯复用无 T0）

1. T1：ternary.module.spec（TC-TER-MOD-01..12）红 → ternary.{ts,sources,module} 绿（types 仅 +TerExecPoint）。
2. T2：TernarySearch.vue + 路由 + 菜单/首页查找第 5 项 + svg + TC-HOOK + 页 spec + e2e。
3. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **四指针四色首次全用**（lo红/m1蓝/m2黄/hi绿）+ `comparing=[m1,m2]` 对决高亮（排序页比较对语义天然契合）；山形由数据 [1,4,7,9,12,10,6,3,2] 天然呈现。types 仅 +TerExecPoint。
- oracle ternary.ts：brutePeak argmax（独立真值）、isUnimodal 严格单峰断言、terTrace（dropRight 逐探记录）。
- module 7 步：init（二分为何失灵）→ probe×4（双探针对决 + 丢哪侧 1/3）→ peak（峰顶绿）→ done（log₍₃⁄₂₎ n + 坡度二分变体 + 实数三分 + 查找五页收官）。
- 本页链前四页收官地图；查找大类灵魂句「每一步用 O(1) 信息安全扔掉一大块候选」。

## 自测报告

- 门禁全绿 1760/95.98%/95.68%；e2e 3/3；真机对决高亮/四箭头全对。
- 回归：主柱轨/ArrowTrack/emphasis 零改动；查找前 4 页零回归。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
