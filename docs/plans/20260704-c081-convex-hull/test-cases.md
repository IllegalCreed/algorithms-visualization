# 测试用例：凸包（C-20260704-081，新建 HullView 点平面轨）

> Status: verified
> Stable ID: C-20260704-081
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（convexhull.module）/ L4（HullView + 播放器接线 + ConvexHull 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-HULLVIEW-*`、`TC-PLAYER-HULL-*`、`TC-CH-MOD-*`、`TC-VIEW-CH-*`、`TC-E2E-CH-01`；**改** `TC-HOOK`（顶层分类 7→8）

## L4 —— HullView 组件（`src/components/HullView.spec.ts`，新增）

| 用例 ID            | 场景           | 期望                                                                   |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| TC-VIZ-HULLVIEW-01 | 散点 + 折线    | points 7 个 → 7 个 `.hull-point`；edges 3 条 → 3 条 `.hull-edge`       |
| TC-VIZ-HULLVIEW-02 | 当前 + 弹出    | `current=3` → 1 个 `.hull-current`；`popped=[2]` → 1 个 `.hull-popped` |
| TC-VIZ-HULLVIEW-03 | 完整凸包多边形 | `phase='done'` + finalHull → 渲染 `.hull-polygon`                      |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID           | 场景           | 期望                                    |
| ----------------- | -------------- | --------------------------------------- |
| TC-PLAYER-HULL-01 | step 带 hull   | step 含 `hull` → 渲染 `HullView`        |
| TC-PLAYER-HULL-02 | 无 hull 零回归 | 排序 step 无 `hull` → 不渲染 `HullView` |

## L3 —— `convexhull.module`（`src/algorithms/convexhull.module.spec.ts`）

固定 7 点；oracle `convexHull()`=`[0,1,4,6,5,2]`（凸包点下标，逆时针）。

| 用例 ID      | 场景                | 期望                                                                        |
| ------------ | ------------------- | --------------------------------------------------------------------------- |
| TC-CH-MOD-01 | 末步 done + 凸包    | 末步 `done`；`convexHull()` = `[0,1,4,6,5,2]`（6 点）                       |
| TC-CH-MOD-02 | 步合法 + 带 hull 轨 | 每步 `point ∈ {init,lower,upper,done}` 且带 `hull`、`array===[]`            |
| TC-CH-MOD-03 | 排序点              | `CH_POINTS` 已按 (x,y) 排序；共 7 点，含内部点 (3,3)                        |
| TC-CH-MOD-04 | 下 + 上凸壳         | `lower` 步 7 个、`upper` 步 7 个（每输入点一步）                            |
| TC-CH-MOD-05 | 叉积转向            | `cross((0,0),(1,0),(0,1))`>0（左转）、`cross((0,0),(1,0),(1,-1))`<0（右转） |
| TC-CH-MOD-06 | 弹栈发生            | lower/upper 阶段各至少 1 步 `popped` 非空（右转弹栈）                       |
| TC-CH-MOD-07 | 内部点被排除        | 末步 finalHull 不含内部点 (3,3) 的下标 3                                    |
| TC-CH-MOD-08 | 凸包点在凸包上      | finalHull = `[0,1,4,6,5,2]`；每条相邻边其余点都在左侧（cross≥0）            |
| TC-CH-MOD-09 | 所有点在凸包内/上   | 7 点每个都在凸包多边形内或边上                                              |
| TC-CH-MOD-10 | 凸包 caption        | done 步 caption 含凸包点数 `6` 与内部点排除语义                             |
| TC-CH-MOD-11 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内               |
| TC-CH-MOD-12 | module 元信息       | `title` 含「凸包」；`initialInput()` = `[]`                                 |

## L4 —— `ConvexHull` 视图（`src/views/Article/Algorithm/ConvexHull.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                            |
| ------------- | ------------- | ----------------------------------------------- |
| TC-VIEW-CH-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`              |
| TC-VIEW-CH-02 | 点平面轨      | h1 含「凸包」；渲染 `HullView`；无 `.bars-view` |
| TC-VIEW-CH-03 | 全模板同屏    | 正文含「叉积」+ HullView 同屏                   |

## L4 —— TC-HOOK（新增第 8 顶层大类）

| 用例 ID | 改动                                                                                         |
| ------- | -------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data` 长度 7→8；`data[7].title==='计算几何'`、children url = `['convex-hull']` |

## L5 —— 凸包页 e2e（`e2e/convex-hull.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                        | 期望                                                                                                                                              |
| ------------ | ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-CH-01 | 全模板 + 互动 | 访问 `/docs/convex-hull`；`.scrub` 拖到末步 | 正文 `.article h1` 含「凸包」；`.hull-view` 可见；7 `.hull-point`；无 `.bars-view`；拖末步 渲染 `.hull-polygon` + caption 含 `6`；真机 Shiki 着色 |

## 回归

- 既有 18 轨 + 7 大类现有 Case **零改动**全绿。
- **新 `Step.hull?` additive**：7 大类既有算法不设 `hull` → HullView 不渲染，`TC-PLAYER-*` 全绿；AlgorithmPlayer 仅加一行 v-if。
- TC-HOOK：分类数 7→8、原 7 类不变，仅追加计算几何大类。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1537 用例全绿**；`pnpm exec playwright test convex-hull fast-power bubble-sort` → **3/3 绿**。
- **本单新增 21 Case 全绿**：`TC-VIZ-HULLVIEW-01..03`（L4）3 + `TC-PLAYER-HULL-01/02`（L4）2 + `TC-CH-MOD-01..12`（L3）12 + `TC-VIEW-CH-01..03`（L4）3 + `TC-E2E-CH-01`（L5）1；**改** `TC-HOOK`（分类 7→8 + 计算几何）menu+home 各 1。
- **关键断言实测**：convexHull()=[0,1,4,6,5,2] 6 点（TC-01）；叉积左转>0/右转<0/共线=0（TC-05）；lower/upper 各 7 步（TC-04）、各≥1 步弹栈（TC-06）；内部点 (3,3) 排除（TC-07）；所有 7 点在凸包内/上（TC-09）；凸包顶点逆时针其余点在左侧（TC-08）。
- **真机自检**：7 散点、下凸壳右转弹出 (2,5) 红 + 当前琥珀、末步凸包 6 顶点多边形、内部点排除，与设计一致。
- **覆盖**：statements 95.74% / branches 95.31%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；21 Case + 改 2 HOOK 全绿。
