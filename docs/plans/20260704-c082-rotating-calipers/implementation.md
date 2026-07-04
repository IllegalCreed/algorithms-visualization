# 实现记录：旋转卡壳（C-20260704-082，复用 HullView）

> Status: verified
> Stable ID: C-20260704-082
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 HullView 三字段**（L4）：types +activeEdge/caliper/best + CalipersExecPoint；先 HullView.spec 追加 TC-VIZ-HULLVIEW-CAL-01/02 跑红 → HullView.vue 渲染三连线跑绿。C-081 用例保持绿。
2. **T1**（L3）：先 calipers.module.spec（TC-CAL-MOD-01..12）跑红 → calipers.{ts,sources.ts,module.ts} 跑绿。
3. **T2**：RotatingCalipers.vue + 路由 + 菜单/首页几何第 2 项 + svg + 改 TC-HOOK + 页 spec + e2e；凸包页双向链接。
4. 全门禁 → 真机自检 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- **HullView additive 三字段（零回归）**：`activeEdge`（琥珀 4px）/`caliper`（蓝虚线）/`best`（绿 4px）三条可选连线，`lineOf(pair)` 复用坐标换算；凸包页不设即不渲染。
- **oracle `calipers.ts`**：`diameter()` 旋转卡壳（对踵点按 |cross| 面积单调前移、每边查两候选）+ `bruteDiameter()` 全点对对拍；d2=36、pair=[0,6]。
- **module 8 步**：init（凸包常显：phase='done'+finalHull 全程设置）→ spin×6（每条凸包边：activeEdge、advance 计数入 caption、caliper=更远候选、best 累积）→ done（直径 6）。
- **e2e 坑**：水平 `<line>` 零高度 bbox 被 Playwright `toBeVisible` 判 hidden → 存在性断言。

## 自测报告

- 门禁全绿：1554/1554、95.78%/95.39%；e2e rotating-calipers + convex-hull 回归 2/2。
- 真机 2 图眼验：首边（对踵前移 2 次、候选 36/25、绿线 (0,3)↔(6,3)）；末步直径 6。
- 回归：HullView 三字段 additive，凸包页不设 → TC-VIZ-HULLVIEW-01..03 + convex-hull e2e 全绿。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填笔记 + 报告；19 Case 全绿、双轨部署。
