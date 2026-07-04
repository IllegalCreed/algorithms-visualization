# 测试用例：最近点对（C-20260704-083，复用 HullView）

> Status: verified
> Stable ID: C-20260704-083
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-VIZ-HULLVIEW-CP-*`、`TC-CP-MOD-*`、`TC-VIEW-CP-*`、`TC-E2E-CP-01`；改 `TC-HOOK`

## L4 —— HullView divider/strip（追加）

| 用例 ID               | 场景         | 期望                                                         |
| --------------------- | ------------ | ------------------------------------------------------------ |
| TC-VIZ-HULLVIEW-CP-01 | 中线 + 带    | 传 divider/strip → 1 条 `.hull-divider` + 1 个 `.hull-strip` |
| TC-VIZ-HULLVIEW-CP-02 | 不设即零回归 | 不传 → 无上述元素                                            |

## L3 —— `closestpair.module`

固定 8 点；oracle `closestPair()`≈{d:1.118, pair:[3,5]}，与 `bruteClosest` 对拍。

| 用例 ID      | 场景               | 期望                                                           |
| ------------ | ------------------ | -------------------------------------------------------------- |
| TC-CP-MOD-01 | 末步 done + 最近对 | 末步 done；best=[3,5]；d≈1.118（±1e-9）                        |
| TC-CP-MOD-02 | 步合法             | point∈{init,divide,half,strip,merge,done} 且带 hull、array=[]  |
| TC-CP-MOD-03 | 暴力对拍           | closestPair() 与 bruteClosest(全点) d/无序对一致               |
| TC-CP-MOD-04 | 分治结构           | divide 1 步（divider=3.25）、half 2 步、strip 1 步、merge 4 步 |
| TC-CP-MOD-05 | δ 正确             | 右 half 步后 δ=min(√5,1.803…)=右侧值                           |
| TC-CP-MOD-06 | 带范围             | strip 步 strip=[3.25−δ, 3.25+δ]；带内恰 5 点                   |
| TC-CP-MOD-07 | merge 两次刷新     | merge 步中恰 2 步刷新 best（1.581 → 1.118）                    |
| TC-CP-MOD-08 | best 单调不增      | 各步 best 距离单调不增，末步≈1.118                             |
| TC-CP-MOD-09 | 跨中线答案         | 末步 best 两点分居中线两侧（x<3.25 与 x>3.25）                 |
| TC-CP-MOD-10 | done caption       | 含 `1.118` 与「最近」                                          |
| TC-CP-MOD-11 | 四语言 + 行号      | 四语言、行号在源码内、覆盖 6 执行点                            |
| TC-CP-MOD-12 | 元信息             | title 含「最近点对」；initialInput()=[]                        |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                                               |
| ------------- | ------------------------------------------------------------------ |
| TC-VIEW-CP-01 | Article + AlgorithmPlayer                                          |
| TC-VIEW-CP-02 | h1 含「最近点对」+ HullView + 无柱数组                             |
| TC-VIEW-CP-03 | 正文含「分治」+ HullView 同屏                                      |
| TC-HOOK       | 几何 children = ['convex-hull','rotating-calipers','closest-pair'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| TC-E2E-CP-01 | h1 含「最近点对」；8 `.hull-point`；拖末步 `.hull-best` 存在 + caption 含 1.118；Shiki |

## 回归

HullView 两字段 additive：凸包/卡壳页不设 → 全绿；AlgorithmPlayer 零改动。

## 自测报告

- 执行：1571/1571 全绿、95.82%/95.4%；e2e closest-pair + rotating-calipers + convex-hull 3/3。
- 新增 19 Case：HULLVIEW-CP 2 + CP-MOD 12 + VIEW-CP 3 + E2E-CP 1；改 TC-HOOK 2。
- 关键实测：oracle {d:√1.25,pair:[3,5]} 暴力对拍（TC-01/03）；结构 divide1/half2/strip1/merge4（TC-04）；带内 5 点（TC-06）；两次刷新 1.581→1.118（TC-07）；答案跨中线（TC-09）。
- 修复：spec s.caption 可空（?.）过 type-check。
- 真机：中线紫虚线 + δ 带 + 带内比较 + 末步 1.118 跨中线。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。19 Case 全绿。
