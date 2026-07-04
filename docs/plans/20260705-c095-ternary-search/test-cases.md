# 测试用例：三分查找（C-20260705-095，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-095
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-TER-MOD-*`、`TC-VIEW-TER-*`、`TC-E2E-TER-01`；改 `TC-HOOK`（纯复用主柱轨，无 VIZ/PLAYER 新用例，同 C-091~094）

## L3 —— `ternary.module`

固定 `[1,4,7,9,12,10,6,3,2]`；oracle `brutePeak` argmax。

| 用例 ID       | 场景          | 期望                                                                                 |
| ------------- | ------------- | ------------------------------------------------------------------------------------ |
| TC-TER-MOD-01 | 对拍          | terTrace().result=4=brutePeak；峰值 12                                               |
| TC-TER-MOD-02 | 单峰断言      | isUnimodal 严格先升后降（恰一个峰）                                                  |
| TC-TER-MOD-03 | 轨迹          | 四探 (0,8,2,6,7,6,丢右)/(0,5,1,4,4,12,丢左)/(2,5,3,4,9,12,丢左)/(4,5,4,5,12,10,丢右) |
| TC-TER-MOD-04 | 步合法        | point∈{init,probe,peak,done}；9 柱山形恒序                                           |
| TC-TER-MOD-05 | 步数结构      | 7 步 point 序列全等                                                                  |
| TC-TER-MOD-06 | 四指针        | probe 步含 '0'/'1'/'2'/'3' 四指针，m1/m2 位置正确                                    |
| TC-TER-MOD-07 | 对决高亮      | probe 步 comparing=[m1,m2]；groupMembers 收缩                                        |
| TC-TER-MOD-08 | peak 步       | sortedIndices=[4]；caption 含峰顶与 12                                               |
| TC-TER-MOD-09 | 丢弃语义      | caption 丢右/丢左（1/3）各至少一次                                                   |
| TC-TER-MOD-10 | done caption  | 含 log 与「坡度」或「1/3」变体语义                                                   |
| TC-TER-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 4 执行点                                                      |
| TC-TER-MOD-12 | 元信息        | title 含「三分」；initialInput()=TER_ARRAY（单峰）                                   |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                                   |
| -------------- | ------------------------------------------------------ |
| TC-VIEW-TER-01 | Article + AlgorithmPlayer                              |
| TC-VIEW-TER-02 | h1 含「三分」+ BarsView 主柱轨                         |
| TC-VIEW-TER-03 | 正文含「单峰」与「探针」                               |
| TC-HOOK        | 查找 children = [...,'binary-answer','ternary-search'] |

## L5 —— e2e

| 用例 ID       | 期望                                                           |
| ------------- | -------------------------------------------------------------- |
| TC-E2E-TER-01 | h1 含「三分」；`.bars-view` 可见；拖末步 caption 含 log；Shiki |

## 回归

主柱轨/ArrowTrack/StepEmphasis 零改动（查找前 4 页 + 排序页零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅查找 +1。

## 自测报告

- 执行：1760/1760 全绿、95.98%/95.68%；e2e ternary-search + binary-answer + binary-search 回归 3/3。
- 新增 16 Case：TER-MOD 12 + VIEW-TER 3 + E2E-TER 1；改 TC-HOOK 2（查找 children +ternary-search）。
- 关键实测：result=4=argmax、峰 12（TC-01）；isUnimodal 严格性（TC-02）；四探丢右/左/左/右全等（TC-03）；四指针 '0'-'3' 全出场（TC-06）；comparing=[m1,m2]（TC-07）。
- 真机：probe 步 4 箭头 + 双柱对决高亮（comparing=2）+ caption「a[2]=7 vs a[6]=6 → 丢掉右侧 1/3」。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
