# 测试用例：旋转数组搜索（C-20260705-093，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-093
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-RS-MOD-*`、`TC-VIEW-RS-*`、`TC-E2E-RS-01`；改 `TC-HOOK`（纯复用主柱轨，无 VIZ/PLAYER 新用例，同 C-091/092）

## L3 —— `rotsearch.module`

固定 `[13,15,17,1,3,5,7,9,11]`；oracle `linearIndex` 线性扫。

| 用例 ID      | 场景          | 期望                                                           |
| ------------ | ------------- | -------------------------------------------------------------- |
| TC-RS-MOD-01 | 对拍          | rotTrace(5).index=5=线性、rotTrace(15).index=1=线性            |
| TC-RS-MOD-02 | t=5 轨迹      | 两探 (0,8,4) right/in、(5,8,6) left/in + HIT(5,5,5)            |
| TC-RS-MOD-03 | t=15 轨迹     | 一探 (0,8,4) right/not-in + HIT(0,3,1)                         |
| TC-RS-MOD-04 | 步合法        | point∈{init,probe,found,done}；9 柱断崖恒序                    |
| TC-RS-MOD-05 | 步数结构      | 8 步 point 序列全等                                            |
| TC-RS-MOD-06 | probe 步      | pivotIndex=mid；groupMembers 闭区间收缩 [5..8]→[5..5] / [0..3] |
| TC-RS-MOD-07 | 判半 caption  | 含「有序」与 左半/右半 语义（各出现一次以上）                  |
| TC-RS-MOD-08 | found 步      | sortedIndices=[5]、[1]；caption 含命中                         |
| TC-RS-MOD-09 | vars          | probe 步 vars 含有序半标注（左半有序/右半有序）                |
| TC-RS-MOD-10 | done caption  | 含 O(log n) 与「一半」引理语义                                 |
| TC-RS-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 4 执行点                                |
| TC-RS-MOD-12 | 元信息        | title 含「旋转」；initialInput()=ROT_ARRAY（断崖形状）         |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                                   |
| ------------- | ------------------------------------------------------ |
| TC-VIEW-RS-01 | Article + AlgorithmPlayer                              |
| TC-VIEW-RS-02 | h1 含「旋转」+ BarsView 主柱轨                         |
| TC-VIEW-RS-03 | 正文含「断崖」或「一半有序」                           |
| TC-HOOK       | 查找 children = [...,'binary-bounds','rotated-search'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                |
| ------------ | ------------------------------------------------------------------- |
| TC-E2E-RS-01 | h1 含「旋转」；`.bars-view` 可见；拖末步 caption 含 O(log n)；Shiki |

## 回归

主柱轨/ArrowTrack/StepEmphasis 零改动（C-091/092 + 排序页零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅查找 +1。

## 自测报告

- 执行：1730/1730 全绿、95.95%/95.62%；e2e rotated-search + binary-search + binary-bounds 回归 3/3。
- 新增 16 Case：RS-MOD 12 + VIEW-RS 3 + E2E-RS 1；改 TC-HOOK 2（查找 children +rotated-search）。
- 关键实测：5→idx5、15→idx1 = 线性扫（TC-01）；两轨迹 sortedHalf/inSorted 全等（TC-02/03）；8 步序列（TC-05）；判半 caption 左半/右半都现身（TC-07）；断崖形状恰一处下降（TC-12）。
- 真机：probe 步 caption「断崖在左、右半有序，其范围 (3, 11] 包含 5」+ 区间外 4 柱淡出 + mid pivot 高亮。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
