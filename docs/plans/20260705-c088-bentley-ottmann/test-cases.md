# 测试用例：扫描线求交 Bentley-Ottmann（C-20260705-088，HullView additive）

> Status: verified
> Stable ID: C-20260705-088
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L4(VIZ) / L3 / L4 / L5
> 命名空间：`TC-VIZ-HULLVIEW-BO-*`、`TC-BO-MOD-*`、`TC-VIEW-BO-*`、`TC-E2E-BO-01`；改 `TC-HOOK`

## T0 —— HullView additive（L4）

| 用例 ID               | 场景               | 期望                                                 |
| --------------------- | ------------------ | ---------------------------------------------------- |
| TC-VIZ-HULLVIEW-BO-01 | marks + markActive | 设字段渲染 `.hull-mark` ×2 与 `.hull-mark-active` ×1 |
| TC-VIZ-HULLVIEW-BO-02 | 零回归             | 不设两字段则无 `.hull-mark`（凸包等旧页零回归）      |

## L3 —— `bentley.module`

固定 A(1,1)-(9,9)、B(2,8)-(8,2)、C(2.5,6)-(8.5,6)；oracle `bruteCrosses()`。

| 用例 ID      | 场景          | 期望                                                          |
| ------------ | ------------- | ------------------------------------------------------------- |
| TC-BO-MOD-01 | 交点对拍      | 事件流 cross 集合 = 暴力 {(4,6),(5,5),(6,6)}；done marks 3 个 |
| TC-BO-MOD-02 | 步合法        | point∈{init,start,cross,end,done} 带 hull、array=[]           |
| TC-BO-MOD-03 | 造型          | 6 点 3 边；init edgeClasses 全 null、无 divider               |
| TC-BO-MOD-04 | 事件序        | 9 事件 x=1/2/2.5/4/5/6/8/8.5/9，类型 start×3+cross×3+end×3    |
| TC-BO-MOD-05 | start 步      | divider=事件 x；主角边 seg-test；未入场边 seg-no              |
| TC-BO-MOD-06 | cross 步      | markActive=交点；双边 seg-yes；marks 累积 1/2/3               |
| TC-BO-MOD-07 | end 步        | 该边转 seg-no；marks 保持 3                                   |
| TC-BO-MOD-08 | 新相邻入队    | x=2 入队 (5,5)；x=2.5 入队 (6,6) 与 (4,6)（oracle enqueued）  |
| TC-BO-MOD-09 | 扫描线单调    | 事件步 divider 严格递增                                       |
| TC-BO-MOD-10 | done caption  | 含「3 个交点」与复杂度/扫描语义                               |
| TC-BO-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                               |
| TC-BO-MOD-12 | 元信息        | title 含「Bentley」或「扫描线」；initialInput()=[]            |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                                               |
| ------------- | ------------------------------------------------------------------ |
| TC-VIEW-BO-01 | Article + AlgorithmPlayer                                          |
| TC-VIEW-BO-02 | h1 含「扫描线」+ HullView + 无 .bars-view                          |
| TC-VIEW-BO-03 | 正文含「事件」与「相邻」+ HullView 同屏                            |
| TC-HOOK       | 计算几何 children = [...,'segment-intersection','bentley-ottmann'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                  |
| ------------ | --------------------------------------------------------------------- |
| TC-E2E-BO-01 | h1 含「扫描线」；`.hull-view` 存在；拖末步 caption 含 3 个交点；Shiki |

## 回归

HullView additive 零回归（VIZ-BO-02 + 凸包/卡壳/最近点对/线段相交页 spec 全量）；AlgorithmPlayer 零改动；TC-HOOK 仅计算几何 +1。

## 自测报告

- 执行：1655/1655 全绿、95.91%/95.45%；e2e bentley-ottmann + 几何 4 页回归 5/5（首跑全过）。
- 新增 18 Case：VIZ-HULLVIEW-BO 2 + BO-MOD 12 + VIEW-BO 3 + E2E-BO 1；改 TC-HOOK 2（计算几何 +bentley-ottmann）。
- 关键实测：事件流 cross 集合 = 暴力 {(4,6),(5,5),(6,6)}（TC-01）；事件序 9 项 x/类型（TC-04）；start/cross/end 三态类与 marks 累积（TC-05/06/07）；x=2 入队 (5,5)、x=2.5 入队 (6,6)+(4,6) 其后全空（TC-08）；扫描线严格递增（TC-09）。
- 真机：cross 步紫虚扫描线 + B/C 绿 + 交点红标琥珀圈正落交叉处；末步 11/11 3 红标 + caption「一个不漏」。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。18 Case 全绿。
