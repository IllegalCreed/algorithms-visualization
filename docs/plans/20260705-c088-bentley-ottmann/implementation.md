# 实现记录：扫描线求交 Bentley-Ottmann（C-20260705-088，HullView additive）

> Status: verified
> Stable ID: C-20260705-088
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. T0：HullView.spec 加 VIZ-BO-01/02 红 → types HullTrack +marks/markActive（additive）+ HullView 渲染 绿。
2. T1：bentley.module.spec（TC-BO-MOD-01..12）红 → bentley.{ts,sources,module} 绿（types +BentleyExecPoint）。
3. T2：BentleyOttmann.vue + 路由 + 菜单/首页计算几何第 5 项 + svg + TC-HOOK + 页 spec + e2e；C-084 页双向链接。
4. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **HullView additive 第 5 消费者**：+marks?（红标 r5.5）/+markActive?（r9 琥珀描边）两可选字段顶层渲染；divider 复用当扫描线、edgeClasses 复用表状态（未入场/离场 seg-no、主角 seg-test、相交对 seg-yes）。4 既有消费者不传零回归（VIZ-BO-02 显式回归例）。
- oracle bentley.ts：bruteCrosses 暴力全对（独立真值）；boEvents 模拟事件流（端点先入队、交点动态入队 + Set 去重 + pt.x≤curX 过滤陈旧、状态按 y 插入/删除/交换、只查新相邻对），statusAfter/enqueued 全记录供 spec 断言。
- module 11 步：init → 9 事件（start 主角琥珀 + 相邻检查叙事 / cross 报告 + 换序 + markActive / end 离场）→ done；vars 展示状态结构（下→上）与新入队交点。
- 双向链接：C-084 页尾「下一站」预告改为实链；本页回链线段相交/凸包。

## 自测报告

- 门禁全绿 1655/95.91%/95.45%；e2e 5/5 首跑全过；真机 cross/done 步全对。
- 回归：HullView 4 既有消费者零回归；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
