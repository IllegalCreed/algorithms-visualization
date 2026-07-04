# 测试用例：线段相交（C-20260705-084，复用 HullView）

> Status: verified
> Stable ID: C-20260705-084
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-VIZ-HULLVIEW-SEG-*`、`TC-SI-MOD-*`、`TC-VIEW-SI-*`、`TC-E2E-SI-01`；改 `TC-HOOK`

## L4 —— HullView edgeClasses（追加）

| 用例 ID                | 场景         | 期望                                                                |
| ---------------------- | ------------ | ------------------------------------------------------------------- |
| TC-VIZ-HULLVIEW-SEG-01 | 边类渲染     | edgeClasses=['seg-yes','seg-no',null] → 对应边带类、第 3 条无附加类 |
| TC-VIZ-HULLVIEW-SEG-02 | 不设即零回归 | 不传 edgeClasses → 所有边无 seg-\* 类                               |

## L3 —— `segint.module`

三对固定线段；oracle `segIntersect` 与手算叉积对拍。

| 用例 ID      | 场景             | 期望                                                 |
| ------------ | ---------------- | ---------------------------------------------------- |
| TC-SI-MOD-01 | 末步 done + 结论 | 末步 done；三对结论 [proper, none, touch]            |
| TC-SI-MOD-02 | 步合法           | point∈{init,test,verdict,done} 带 hull、array=[]     |
| TC-SI-MOD-03 | 对 1 规范相交    | ds=(-4,4,4,-4)，两两异号 → proper                    |
| TC-SI-MOD-04 | 对 2 同侧判否    | D1、D2 同号（同为负）→ none                          |
| TC-SI-MOD-05 | 对 3 相触特判    | D3=0 且 (7,1) 在 (6,0)-(8,2) 框上 → touch            |
| TC-SI-MOD-06 | 结构             | test 3 步 + verdict 3 步；init 6 边全灰              |
| TC-SI-MOD-07 | test 高亮        | 各 test 步该对两边类为 seg-test                      |
| TC-SI-MOD-08 | verdict 定色累积 | verdict 后该对 seg-yes/seg-no；已判对颜色保持到 done |
| TC-SI-MOD-09 | 12 点 6 边       | 每步 points 12、edges 6                              |
| TC-SI-MOD-10 | done caption     | 含「2」相交与「1」不相交语义                         |
| TC-SI-MOD-11 | 四语言 + 行号    | 四语言、行号在源码内、覆盖 4 执行点                  |
| TC-SI-MOD-12 | 元信息           | title 含「线段相交」；initialInput()=[]              |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                                        |
| ------------- | ----------------------------------------------------------- |
| TC-VIEW-SI-01 | Article + AlgorithmPlayer                                   |
| TC-VIEW-SI-02 | h1 含「线段相交」+ HullView + 无柱数组                      |
| TC-VIEW-SI-03 | 正文含「跨立」+ HullView 同屏                               |
| TC-HOOK       | 几何 children = [...,'closest-pair','segment-intersection'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| TC-E2E-SI-01 | h1 含「线段相交」；12 `.hull-point` 6 `.hull-edge`；拖末步 2 `.seg-yes` + 1 `.seg-no` + caption 含 2；Shiki |

## 回归

HullView edgeClasses additive：凸包/卡壳/最近点对页不传 → 默认样式；AlgorithmPlayer 零改动。

## 自测报告

- 执行：1588/1588 全绿、95.8%/95.34%；e2e segment-intersection + closest-pair + convex-hull 3/3。
- 新增 19 Case：HULLVIEW-SEG 2 + SI-MOD 12 + VIEW-SI 3 + E2E-SI 1；改 TC-HOOK 2。
- 关键实测：三对 [proper,none,touch]（TC-01/03/04/05）；verdict 累积色 [yes,yes,no,no,yes,yes]（TC-08）；test 步 seg-test（TC-07）。
- 修复：ts sources done 行号越界 14→12。
- 真机：三对分色（绿 X / 灰虚线平行 / 绿相触），字幕 D3=0 特判清晰。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。19 Case 全绿。
