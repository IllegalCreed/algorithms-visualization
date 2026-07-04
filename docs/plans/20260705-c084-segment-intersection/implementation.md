# 实现记录：线段相交（C-20260705-084，复用 HullView）

> Status: verified
> Stable ID: C-20260705-084
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. T0：types +edgeClasses + SegIntExecPoint；HullView.spec 追加 TC-VIZ-HULLVIEW-SEG-01/02 红→绿。
2. T1：segint.module.spec（TC-SI-MOD-01..12）红 → segint.{ts,sources,module} 绿。
3. T2：SegmentIntersection.vue + 路由 + 菜单/首页第 4 项 + svg + TC-HOOK + 页 spec + e2e。
4. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- HullView additive edgeClasses：与 edges 平行类数组，edgeViews 注入 cls；CSS seg-test（琥珀 4px）/seg-yes（绿 4px）/seg-no（灰虚线）。
- oracle segint.ts：cross2 + onSeg + segIntersect 返回 {hit,kind,ds}；三对 → proper（D=(-4,4,4,-4)）/none（D1D2 同负速判）/touch（D3=0+框上）。
- module 8 步：init 全默认 → 每对 test（该对 seg-test + caption 四叉积）+ verdict（定色累积 + 分 kind 解说）→ done（2 相交 1 不相交）。
- 修复：ts lineMap done 越界 14→12。

## 自测报告

- 门禁全绿 1588/95.8%/95.34%；e2e 3/3；真机三对分色 + 特判字幕。
- 回归：edgeClasses additive，凸包/卡壳/最近点对页不传 → 默认样式全绿。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
