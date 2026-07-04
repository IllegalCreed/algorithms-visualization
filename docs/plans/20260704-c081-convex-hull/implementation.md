# 实现记录：凸包（C-20260704-081，新建 HullView 点平面轨）

> Status: verified
> Stable ID: C-20260704-081
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新建 HullView + 播放器接线**（L4）：types.ts +`Pt`/`HullExecPoint`/`HullTrack`/`Step.hull?`；先 HullView.spec（TC-VIZ-HULLVIEW-01..03）+ AlgorithmPlayer.spec（TC-PLAYER-HULL-01/02）跑红 → 新建 HullView.vue（散点 + 折线 + 弹栈红）+ AlgorithmPlayer 加一行 v-if 跑绿。既有轨用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 convexhull.module.spec（TC-CH-MOD-01..12）跑红 → convexhull.{ts,sources.ts,module.ts}（Andrew 单调链）跑绿。
3. **T2 新页 + 新大类接线**：ConvexHull.vue；路由 /docs/convex-hull；菜单 + 首页新增第 8 大类「计算几何」（新 convex-hull.svg）；改 TC-HOOK（分类 7→8 + 新分类断言）；ConvexHull.spec + convex-hull.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 新大类）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 19 条 HullView 点平面轨**：viewBox 460×300，点坐标等比缩放居中 + **y 上翻**（数学 y 向上）；渲染散点（小圆点，`current` 琥珀放大、`popped` 红）+ `edges` 凸壳折线 + `done` 时 `finalHull` 凸包多边形（半透明绿填充）。新 `Step.hull?` additive，AlgorithmPlayer 加一行 v-if。
- **oracle `convexhull.ts`**：`cross(o,a,b)` 叉积；`convexHull()` Andrew 单调链（下凸壳 + 上凸壳，非左转 cross≤0 弹栈）。固定 7 点 → 凸包 [0,1,4,6,5,2] 6 点、内部点 (3,3) 排除。
- **module 16 步**：init（散点）→ lower×7（逐点下凸壳：while 右转弹栈收集 popped、压入 current；edges=当前链）→ upper×7（保留下凸壳 edges，同法构上凸壳）→ done（edges 空、finalHull 多边形）。stepCaption 区分「右转弹出/左转直接压入」。
- **四语言 sources**：TS/Python/Go/Rust Andrew 单调链（unroll 下/上凸壳两趟），lineMap 逐行核对（ts 16/py 13/go 24/rust 21 行）对齐 init/lower/upper/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1537/1537 全绿**、聚合 statements 95.74% · branches 95.31%。
- **e2e（真机 Playwright/Chromium）**：`convex-hull` + 回归 `fast-power`/`bubble-sort` **3/3 通过**——点平面 7 点、无柱数组、Shiki、拖末步凸包多边形 + 字幕含 6。
- **真机视觉自检（2 图眼验）**：第 5/16 步（下凸壳加 (3,3)）——7 散点、当前点琥珀、弹出点 (2,5) 红、凸壳链折线、字幕「右转弹出 (2,5)」；末步 16/16——凸包 6 顶点闭合多边形、内部点 (3,3) 排除、字幕「6 个顶点」。
- **回归**：新 Step.hull? additive；既有算法不设 hull → HullView 不渲染（TC-PLAYER-\* 全绿）；TC-HOOK 分类 7→8。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；21 Case + 改 2 HOOK 全绿、双轨部署。
