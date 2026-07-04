# 测试用例：二分答案（C-20260705-094，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-094
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-BA-MOD-*`、`TC-VIEW-BA-*`、`TC-E2E-BA-01`；改 `TC-HOOK`（纯复用主柱轨，无 VIZ/PLAYER 新用例，同 C-091/092/093）

## L3 —— `banswer.module`

固定 piles=[3,6,7,11]、h=8；oracle `bruteMinSpeed` 线性首个可行。

| 用例 ID      | 场景           | 期望                                                              |
| ------------ | -------------- | ----------------------------------------------------------------- |
| TC-BA-MOD-01 | 对拍           | baTrace().result=4=bruteMinSpeed；hoursAt(4)=8≤8、hoursAt(3)=10>8 |
| TC-BA-MOD-02 | 单调谓词       | k=1..11 可行序列 ✗✗✗✓✓✓✓✓✓✓✓（恰一次翻转）                        |
| TC-BA-MOD-03 | 轨迹           | 四探 (1,11,6,6h,✓)/(1,6,3,10h,✗)/(4,6,5,8h,✓)/(4,5,4,8h,✓)        |
| TC-BA-MOD-04 | 步合法         | point∈{init,probe,settle,done}；11 柱 = 1..11 爬坡                |
| TC-BA-MOD-05 | 步数结构       | 7 步 point 序列全等                                               |
| TC-BA-MOD-06 | probe 步       | pivotIndex=mid−1（速度→柱下标）依次 5,2,4,3；groupMembers 收缩    |
| TC-BA-MOD-07 | 可行性 caption | ✓ 步含「还能更小」、✗ 步含「加速」；耗时数字在 caption            |
| TC-BA-MOD-08 | settle 步      | sortedIndices=[3]（速度 4 的柱）；caption 含最小与 4              |
| TC-BA-MOD-09 | vars           | probe 步 vars 含本次耗时（6/10/8/8）                              |
| TC-BA-MOD-10 | done caption   | 含「答案空间」与单调语义                                          |
| TC-BA-MOD-11 | 四语言 + 行号  | 四语言、行号在内、覆盖 4 执行点                                   |
| TC-BA-MOD-12 | 元信息         | title 含「二分答案」；initialInput()=[1..11] 答案空间             |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                                   |
| ------------- | ------------------------------------------------------ |
| TC-VIEW-BA-01 | Article + AlgorithmPlayer                              |
| TC-VIEW-BA-02 | h1 含「二分答案」+ BarsView 主柱轨                     |
| TC-VIEW-BA-03 | 正文含「答案空间」与「单调」                           |
| TC-HOOK       | 查找 children = [...,'rotated-search','binary-answer'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| TC-E2E-BA-01 | h1 含「二分答案」；`.bars-view` 可见；拖末步 caption 含答案空间；Shiki |

## 回归

主柱轨/ArrowTrack/StepEmphasis 零改动（查找前 3 页 + 排序页零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅查找 +1。

## 自测报告

- 执行：1745/1745 全绿、95.96%/95.67%；e2e binary-answer + rotated-search + binary-bounds 回归 3/3。
- 新增 16 Case：BA-MOD 12 + VIEW-BA 3 + E2E-BA 1；改 TC-HOOK 2（查找 children +binary-answer）。
- 关键实测：result=4=线性首个可行、hoursAt(4)=8/hoursAt(3)=10（TC-01）；可行序列恰一次翻转（TC-02）；四探 6✓/3✗/5✓/4✓（TC-03）；pivotIndex=速度−1（TC-06）；耗时 vars 6/10/8/8（TC-09）。
- 真机：probe 步「⌈3/3⌉+⌈6/3⌉+⌈7/3⌉+⌈11/3⌉ = 10 小时 > 8 不可行——只能加速」+ 7 柱淡出；settle 速度 4 绿。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
