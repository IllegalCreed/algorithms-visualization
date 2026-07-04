# 设计：扫描线求交 Bentley-Ottmann（C-20260705-088，HullView additive）

> Status: verified
> Stable ID: C-20260705-088
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

A(1,1)-(9,9)、B(2,8)-(8,2)、C(2.5,6)-(8.5,6)。交点：B×C=(4,6)、A×B=(5,5)、A×C=(6,6)。
事件序（x 升序）：1 start A → 2 start B（状态 [A,B]，查 (A,B) 入队 (5,5)）→ 2.5 start C（[A,C,B]，查 (A,C) 入队 (6,6)、(C,B) 入队 (4,6)）→ 4 cross B×C（报告 #1，换序 [A,B,C]，(A,B) 已在队去重）→ 5 cross A×B（#2，[B,A,C]，(A,C) 已在队）→ 6 cross A×C（#3，[B,C,A]，(B,C) 交点在左不入队）→ 8 end B（[C,A]，(C,A) 交点在左）→ 8.5 end C（[A]）→ 9 end A（[]）。懒惰删除法：陈旧事件不出队去重即可（固定实例无陈旧触发）。

## T0：HullView additive（第 5 消费者）

`HullTrack` 加 2 可选字段：`marks?: Pt[]`（已发现交点，红实心点）、`markActive?: Pt | null`（本步报告交点，放大 + 琥珀描边）。渲染在散点层之上；不设不渲染（凸包/卡壳/最近点对/线段相交 4 既有消费者零回归）。`BentleyExecPoint = 'init'|'start'|'cross'|'end'|'done'`。VIZ 用例 2：BO-01 设字段出红标与放大标；BO-02 不设无 `.hull-mark`。

## T1：oracle + module + sources

`bentley.ts`：`BO_POINTS`（6 端点）、`BO_SEGS`（3 边下标对 + 名 A/B/C）；`segCrossAt(i,j)` 参数式求真相交点（分数精度→浮点）；`bruteCrosses()` 暴力全对（独立真值，按 x 排序）；`boEvents()` 模拟事件流返回 `{x,type,seg?,pt?,pair?,statusAfter,enqueued}[]`（与暴力对拍：cross 事件集合 = 暴力集合）。
`bentley.module.ts`：init（三线段全貌 + 事件队列说明）→ 逐事件（divider=事件 x；start：主角 seg-test、入状态、查新相邻入队；cross：双边 seg-yes、markActive=交点、marks 累积、换序；end：该边 seg-no 离场）→ done（3 交点全亮 + 复杂度语义）。11 步。vars：事件、状态（下→上）、已发现交点数、队列新增。
`bentley.sources.ts`：四语言事件循环骨架（EventQueue/SweepStatus/交换与新相邻检查），lineMap init/start/cross/end/done。

## T2：页面 + 接线

`BentleyOttmann.vue`（Algorithm 目录）正文（暴力 → 扫描线三事件 → 相邻洞察 → GIS/CAD 应用、链 C-084）；路由 `/docs/bentley-ottmann`；菜单/首页计算几何第 5 项；新 svg（扫描线扫过三线段 + 交点红标）；改 TC-HOOK；C-084 页尾双向链接。

## 复用与零回归

HullView additive（不设 marks/markActive 不渲染，4 既有消费者零回归 + VIZ-BO-02 显式回归例）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：HullTrack additive +marks/markActive 2 可选字段；oracle boEvents 事件流与 bruteCrosses 暴力对拍（cross 集合相等）；module 11 步。
