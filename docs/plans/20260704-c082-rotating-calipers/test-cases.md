# 测试用例：旋转卡壳（C-20260704-082，复用 HullView）

> Status: verified
> Stable ID: C-20260704-082
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（calipers.module）/ L4（HullView 三字段 + RotatingCalipers 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-HULLVIEW-CAL-*`、`TC-CAL-MOD-*`、`TC-VIEW-RC-*`、`TC-E2E-RC-01`；**改** `TC-HOOK`（几何 children）

## L4 —— HullView 三字段（`src/components/HullView.spec.ts`，追加）

| 用例 ID                | 场景         | 期望                                                                                      |
| ---------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| TC-VIZ-HULLVIEW-CAL-01 | 三连线渲染   | 传 activeEdge/caliper/best → 各渲染 1 条 `.hull-active-edge`/`.hull-caliper`/`.hull-best` |
| TC-VIZ-HULLVIEW-CAL-02 | 不设即零回归 | 不传三字段（凸包页）→ 无上述三类元素                                                      |

## L3 —— `calipers.module`（`src/algorithms/calipers.module.spec.ts`）

固定 C-081 7 点；oracle `diameter()`={d2:36, pair:[0,6]}，与 `bruteDiameter()` 对拍。

| 用例 ID       | 场景              | 期望                                                              |
| ------------- | ----------------- | ----------------------------------------------------------------- |
| TC-CAL-MOD-01 | 末步 done + 直径  | 末步 `done`；`diameter().d2`=36、pair=[0,6]；末步 best=[0,6]      |
| TC-CAL-MOD-02 | 步合法 + 带 hull  | 每步 `point ∈ {init,spin,done}` 且带 `hull`、`array===[]`         |
| TC-CAL-MOD-03 | 暴力对拍          | `diameter()` 与 `bruteDiameter()`（所有点对）d2/无序对一致        |
| TC-CAL-MOD-04 | spin 步逐边       | `spin` 步恰 6 个（凸包 6 条边各一步）                             |
| TC-CAL-MOD-05 | 凸包常显          | 每步 `hull.finalHull`=[0,1,4,6,5,2] 且 phase='done'（多边形常显） |
| TC-CAL-MOD-06 | activeEdge 合法   | 各 spin 步 activeEdge 为凸包相邻顶点对且按序推进                  |
| TC-CAL-MOD-07 | caliper/best 存在 | 各 spin 步 caliper 非空；best 从首个 spin 起非空                  |
| TC-CAL-MOD-08 | best 单调不减     | 各步 best 两点距离² 单调不减，末步 = 36                           |
| TC-CAL-MOD-09 | best 点对可行     | 每步 best 两端都是凸包顶点                                        |
| TC-CAL-MOD-10 | done caption      | done 步 caption 含 `6`（直径）与「最远」语义                      |
| TC-CAL-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每 point 行号在源码内               |
| TC-CAL-MOD-12 | module 元信息     | `title` 含「卡壳」；`initialInput()`=[]                           |

## L4 —— `RotatingCalipers` 视图（新增）

| 用例 ID       | 场景          | 期望                                                |
| ------------- | ------------- | --------------------------------------------------- |
| TC-VIEW-RC-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                  |
| TC-VIEW-RC-02 | 点平面轨      | h1 含「旋转卡壳」；渲染 `HullView`；无 `.bars-view` |
| TC-VIEW-RC-03 | 全模板同屏    | 正文含「对踵」+ HullView 同屏                       |

## L4 —— TC-HOOK（计算几何第 2 项）

| 用例 ID | 改动                                                                                   |
| ------- | -------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[7]`（计算几何）children url = `['convex-hull','rotating-calipers']` |

## L5 —— e2e（`e2e/rotating-calipers.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                            | 期望                                                                                                                      |
| ------------ | ------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-RC-01 | 全模板 + 互动 | 访问 `/docs/rotating-calipers`；`.scrub` 拖末步 | h1 含「旋转卡壳」；`.hull-view` 可见；7 `.hull-point` + `.hull-polygon`；拖末步 `.hull-best` 可见 + caption 含 `6`；Shiki |

## 回归

- HullView 三字段 additive：C-081 凸包页不设 → 渲染不变（TC-VIZ-HULLVIEW-01..03 + convex-hull e2e 全绿）；AlgorithmPlayer 零改动。
- TC-HOOK 仅几何 children 追加。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1554 用例全绿**；`pnpm exec playwright test rotating-calipers convex-hull` → **2/2 绿**。
- **本单新增 19 Case 全绿**：`TC-VIZ-HULLVIEW-CAL-01/02` 2 + `TC-CAL-MOD-01..12` 12 + `TC-VIEW-RC-01..03` 3 + `TC-E2E-RC-01` 1；改 `TC-HOOK` 2。
- **关键断言实测**：diameter()={d2:36,pair:[0,6]} 与暴力对拍（TC-01/03）；spin 6 步（TC-04）；activeEdge 按凸包边序推进（TC-06）；best 距离²单调不减至 36（TC-08）。
- **修复记录**：e2e `.hull-best` 是水平线（零高度 bbox）被 Playwright toBeVisible 判 hidden → 改存在性断言 toHaveCount(1)；calipers.sources ts lineMap done 16→13（越界）。
- **真机自检**：凸包常显 + 首边对踵前移 2 次 + 候选 36/25 + 绿最优线；末步直径 6。
- **覆盖**：statements 95.78% / branches 95.39%。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；19 Case + 改 2 HOOK 全绿。
