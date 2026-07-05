# 测试用例：区间 DP 石子合并（C-20260705-098，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-098
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-ST-MOD-*`、`TC-VIEW-ST-*`、`TC-E2E-ST-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例）

## L3 —— `stones.module`

固定 `[4,1,3,2]`；oracle `bruteMerge` 枚举全部合并顺序。

| 用例 ID      | 场景          | 期望                                                                              |
| ------------ | ------------- | --------------------------------------------------------------------------------- |
| TC-ST-MOD-01 | 对拍          | stonesDp().dp[0][3]=20=bruteMerge()                                               |
| TC-ST-MOD-02 | 填表序        | fills 六项 (i,j,len,val) 全等：len2 5/4/5 → len3 12/10 → len4 20                  |
| TC-ST-MOD-03 | 拆分候选      | dp[0][2] 候选 (0,4)/(1,5) k=0；dp[1][3] 候选 (1,5)/(2,4) k=2；dp[0][3] 三候选 k=0 |
| TC-ST-MOD-04 | 步合法        | point∈{init,pair,split,done} 带 matrix、array=[]                                  |
| TC-ST-MOD-05 | 步数结构      | 8 步 = init + pair×3 + split×3 + done                                             |
| TC-ST-MOD-06 | init 表       | 对角线全 0、其余 null；labels=堆值                                                |
| TC-ST-MOD-07 | pair 步       | updatedCell 依次 (0,1)/(1,2)/(2,3)；值 5/4/5                                      |
| TC-ST-MOD-08 | split sources | 依次 [[0,0],[1,2]] / [[1,1],[2,3]]（k=2 胜）/ [[0,0],[1,3]]                       |
| TC-ST-MOD-09 | split caption | 含全部候选代价枚举与「取小」语义                                                  |
| TC-ST-MOD-10 | done caption  | 含 20 与 O(n³) 或区间语义                                                         |
| TC-ST-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 4 执行点                                                   |
| TC-ST-MOD-12 | 元信息        | title 含「石子」；initialInput()=ST_PILES                                         |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                        |
| ------------- | ------------------------------------------- |
| TC-VIEW-ST-01 | Article + AlgorithmPlayer                   |
| TC-VIEW-ST-02 | h1 含「石子」+ MatrixView + 无 .bars-view   |
| TC-VIEW-ST-03 | 正文含「区间」与「分割点」                  |
| TC-HOOK       | DP children 6→7、尾 +stone-merge（两 spec） |

## L5 —— e2e

| 用例 ID      | 期望                                                            |
| ------------ | --------------------------------------------------------------- |
| TC-E2E-ST-01 | h1 含「石子」；`.matrix-view` 可见；拖末步 caption 含 20；Shiki |

## 回归

MatrixView 纯复用零改动（10 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅 DP +1。

## 自测报告

- 执行：1805/1805 全绿、96.07%/95.75%；e2e stone-merge + lcs + coin-change 回归 3/3（首跑全过）。
- 新增 16 Case：ST-MOD 12 + VIEW-ST 3 + E2E-ST 1；改 TC-HOOK 2（DP 6→7 + 尾 +stone-merge）。
- 关键实测：dp[0][3]=20=暴力全序枚举（TC-01）；填表六项与候选/胜者全等（TC-02/03）；sources 拆分对（TC-08）；候选枚举 caption（TC-09）。
- 真机：split 步「k=0：10、k=1：10、k=2：12 取小」caption + 2 黄格拆分对。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
