# 设计：旋转卡壳（C-20260704-082，复用 HullView + activeEdge/caliper/best）

> Status: verified
> Stable ID: C-20260704-082
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用 C-081 HullView（点平面轨），additive 扩 3 个可选字段。旋转卡壳按「每条凸包边一步」重走，产出 `Step<CalipersExecPoint>`（复用 `Step.hull`）。

## 固定实例（Python 已核验）

- 7 点同 C-081；凸包 `[0,1,4,6,5,2]`（逆时针）。
- 逐边对踵：边 0→1 起对踵点从 hull[1] 单调前移；6 条边共 19 原子事件（advance/check）合并为 6 步。
- 直径² = 36（暴力对拍一致），点对原下标 `(0,6)` 即 `(0,3)↔(6,3)`，直径 = 6。

## T0：HullView additive 三字段

`types.ts`（`HullTrack` 补，均可选，凸包页不设即不变）：

```ts
activeEdge?: [number, number] | null; // 当前卡壳边（琥珀粗线）
caliper?: [number, number] | null;    // 当前候选点对（蓝虚线）
best?: [number, number] | null;       // 当前最远点对（绿粗线）
```

`CalipersExecPoint = 'init' | 'spin' | 'done'`。

`HullView.vue`：三条可选连线渲染（`.hull-active-edge` 琥珀 4px / `.hull-caliper` 蓝虚线 / `.hull-best` 绿 4px）。

## T1：oracle + module + sources

`calipers.ts`：复用 `CH_POINTS`/`cross`/`convexHull`；`export function diameter(): { d2: number; pair: [number, number] }`（旋转卡壳）+ `bruteDiameter()`（暴力对拍）→ d2=36、pair=[0,6]。

`calipers.module.ts`：`buildCalipersSteps()`——init（散点 + 凸包多边形 finalHull + phase done 样式复用？不：phase 用 'done' 会画多边形，正合适——全程 `phase:'done', finalHull` 常显凸包）→ spin×6（每条边：activeEdge、对踵点前移后 caliper=[最远候选端点, 对踵点]、best 累积更新；caption 给面积前移与两候选 d²）→ done（best=[0,6]、直径 6）。共 8 步。vars：当前边/对踵点/当前最远 d²。

`calipers.sources.ts`：四语言旋转卡壳（while 面积前移 + 两候选），lineMap init/spin/done。

## T2：页面 + 接线

`RotatingCalipers.vue`：正文（卡板比喻、对踵点、面积单调、O(n)、延伸最小外接矩形）+ 播放器；与凸包页双向链接。路由 `/docs/rotating-calipers`；菜单/首页「计算几何」第 2 项；新 svg；改 TC-HOOK（几何 children +rotating-calipers）。

## 复用与零回归

- HullView 三字段 additive；C-081 凸包页不设 → 渲染不变。无新轨；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。旋转卡壳求直径，复用 HullView additive 三字段；直径 6、8 步。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：HullView +activeEdge/caliper/best 三连线（琥珀/蓝虚线/绿）；calipers oracle diameter()={d2:36,pair:[0,6]} 与暴力对拍、module init+spin×6+done 8 步；4 语言 sources lineMap 对齐 init/spin/done；e2e 断言改为存在性（水平绿线零高度 bbox 被 Playwright 判 hidden 的坑）。
