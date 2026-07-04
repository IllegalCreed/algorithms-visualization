# 测试用例：二分边界 lower/upper bound（C-20260705-092，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-092
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-BB-MOD-*`、`TC-VIEW-BB-*`、`TC-E2E-BB-01`；改 `TC-HOOK`（纯复用主柱轨，无 VIZ/PLAYER 新用例，同 C-091）

## L3 —— `bbound.module`

固定 `[1,2,2,2,3,5,5,7,8,9]`、t=2；oracle 线性扫 bruteLb/bruteUb。

| 用例 ID      | 场景          | 期望                                                             |
| ------------ | ------------- | ---------------------------------------------------------------- |
| TC-BB-MOD-01 | 边界对拍      | lb=1=bruteLb、ub=4=bruteUb、count=3                              |
| TC-BB-MOD-02 | lb 轨迹       | 四探 (0,10,5)/(0,5,2)/(0,2,1)/(0,1,0)，只有末探 goRight          |
| TC-BB-MOD-03 | ub 轨迹       | 四探 (0,10,5)/(0,5,2)/(3,5,4)/(3,4,3)，goRight 交替 F/T/F/T      |
| TC-BB-MOD-04 | 步合法        | point∈{init,probe,settle,range,done}；10 柱升序恒序含重复        |
| TC-BB-MOD-05 | 步数结构      | 14 步 point 序列全等（两阶段各 init+probe×4+settle）             |
| TC-BB-MOD-06 | probe 步      | pivotIndex 依次 5,2,1,0 / 5,2,4,3；groupMembers=[lo,hi) 收缩     |
| TC-BB-MOD-07 | 哨兵位        | hi=10 时无 id '2' 指针；hi<10 后黄箭头出现                       |
| TC-BB-MOD-08 | settle 步     | sortedIndices 依次 [1]、[4]；caption 含「第一个 ≥」/「第一个 >」 |
| TC-BB-MOD-09 | range 步      | sortedIndices=[1,2,3]；caption 含 3                              |
| TC-BB-MOD-10 | done caption  | 含 count 或 ub − lb 与 O(log n)                                  |
| TC-BB-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                                  |
| TC-BB-MOD-12 | 元信息        | title 含「边界」；initialInput()=BB_ARRAY（含重复升序）          |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                              |
| ------------- | ------------------------------------------------- |
| TC-VIEW-BB-01 | Article + AlgorithmPlayer                         |
| TC-VIEW-BB-02 | h1 含「边界」+ BarsView 主柱轨                    |
| TC-VIEW-BB-03 | 正文含「lower」与「半开」                         |
| TC-HOOK       | 查找 children = ['binary-search','binary-bounds'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                |
| ------------ | ------------------------------------------------------------------- |
| TC-E2E-BB-01 | h1 含「边界」；`.bars-view` 可见；拖末步 caption 含 O(log n)；Shiki |

## 回归

主柱轨/ArrowTrack/StepEmphasis 零改动（C-091 二分查找 + 排序页零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅查找 +1。

## 自测报告

- 执行：1715/1715 全绿、95.95%/95.59%；e2e binary-bounds + binary-search 回归 2/2。
- 新增 16 Case：BB-MOD 12 + VIEW-BB 3 + E2E-BB 1；改 TC-HOOK 2（查找 children +binary-bounds）。
- 关键实测：lb=1/ub=4/count=3 = 线性扫（TC-01）；两轨迹四探全等（TC-02/03）；14 步序列（TC-05）；哨兵位无黄箭头（TC-07）；settle [1]/[4] + range [1,2,3]（TC-08/09）。
- 真机：range 步三个 2 全绿（greens=3）+ caption「个数 = ub − lb = 3」。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
