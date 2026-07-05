# 测试用例：数位 DP（C-20260705-101，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-101
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-DD-MOD-*`、`TC-VIEW-DD-*`、`TC-E2E-DD-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例）

## L3 —— `digitdp.module`

固定 N=245、禁 4；oracle `bruteCount` 逐个检查。

| 用例 ID      | 场景          | 期望                                                               |
| ------------ | ------------- | ------------------------------------------------------------------ |
| TC-DD-MOD-01 | 对拍          | digitWalk().ans=197=bruteCount()                                   |
| TC-DD-MOD-02 | 走位行        | 三行 (d,cnt,pow,sub,tightOk)：(2,2,81,162,✓)/(4,4,9,36,✗)/(5,跳过) |
| TC-DD-MOD-03 | 步合法        | point∈{init,free,tight,broken,sum,done} 带 matrix、array=[]        |
| TC-DD-MOD-04 | 步数结构      | 8 步 = init + (free+tight)×2 + broken + sum + done                 |
| TC-DD-MOD-05 | init 表       | 4×4 全 null；rowLabels/colLabels 正确                              |
| TC-DD-MOD-06 | free 步       | 行填 [d,cnt,9^k,sub]；updatedCell=小计格；caption 含 162/36        |
| TC-DD-MOD-07 | tight 步      | active=位上格；百位 caption 贴着走、十位 caption 含断裂            |
| TC-DD-MOD-08 | broken 步     | 个位行 [5,null,null,null]；caption 含跳过语义                      |
| TC-DD-MOD-09 | sum 步        | 合计格 198；sources=[[0,3],[1,3]]；caption 含 197（去 0）          |
| TC-DD-MOD-10 | done caption  | 含 197 与 O(位数) 或记忆化语义                                     |
| TC-DD-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 6 执行点                                    |
| TC-DD-MOD-12 | 元信息        | title 含「数位」；initialInput()=[]                                |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                      |
| ------------- | ----------------------------------------- |
| TC-VIEW-DD-01 | Article + AlgorithmPlayer                 |
| TC-VIEW-DD-02 | h1 含「数位」+ MatrixView + 无 .bars-view |
| TC-VIEW-DD-03 | 正文含「贴着」与「自由」                  |
| TC-HOOK       | DP children 9→10、尾 +digit-dp（两 spec） |

## L5 —— e2e

| 用例 ID      | 期望                                                             |
| ------------ | ---------------------------------------------------------------- |
| TC-E2E-DD-01 | h1 含「数位」；`.matrix-view` 可见；拖末步 caption 含 197；Shiki |

## 回归

MatrixView 纯复用零改动（13 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅 DP +1。

## 自测报告

- 执行：1850/1850 全绿、96.14%/95.81%；e2e digit-dp + tree-dp + edit-distance 回归 3/3（首跑全过）。
- 新增 16 Case：DD-MOD 12 + VIEW-DD 3 + E2E-DD 1；改 TC-HOOK 2（DP 9→10 + 尾 +digit-dp）。
- 关键实测：ans=197=bruteCount、total=198（TC-01）；三行走位全等（TC-02）；free 行填齐 + 小计格（TC-06）；tight 断裂 caption（TC-07）；sum sources 两小计（TC-09）。
- 真机：tight 步「上界位就是 4——被禁数字！tight 断裂」+ sum 步「162 + 36 = 198 → 197」。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
