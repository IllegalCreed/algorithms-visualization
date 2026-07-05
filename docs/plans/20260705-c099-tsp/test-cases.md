# 测试用例：状压 DP 旅行商 TSP（C-20260705-099，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-099
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-TSP-MOD-*`、`TC-VIEW-TSP-*`、`TC-E2E-TSP-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例）

## L3 —— `tsp.module`

固定 `d=[[0,4,1,3],[4,0,2,1],[1,2,0,5],[3,1,5,0]]`；oracle `bruteTsp` 全排列。

| 用例 ID       | 场景          | 期望                                                             |
| ------------- | ------------- | ---------------------------------------------------------------- |
| TC-TSP-MOD-01 | 对拍          | tspDp().best=7=bruteTsp()                                        |
| TC-TSP-MOD-02 | fill 序       | 12 项 (mask,i,val) 全等（mask 升序）                             |
| TC-TSP-MOD-03 | 候选与胜者    | (1111,1) 候选 (2,10)/(3,7) j=3；(1111,3) 候选 (1,4)/(2,11) j=1   |
| TC-TSP-MOD-04 | 步合法        | point∈{init,fill,close,done} 带 matrix、array=[]                 |
| TC-TSP-MOD-05 | 步数结构      | 15 步 = init + fill×12 + close + done                            |
| TC-TSP-MOD-06 | 表结构        | 8 行 mask（含 bit0）× 4 列；rowLabels 二进制；init 仅 (0001,0)=0 |
| TC-TSP-MOD-07 | fill 步       | updatedCell 行列正确；无效格保持 null                            |
| TC-TSP-MOD-08 | fill sources  | 指向前置格 [rowOf(mask∖i), bestJ]（抽 (0111,1) 与 (1111,1) 验）  |
| TC-TSP-MOD-09 | close 步      | sources=全集行三格；caption 含三候选与取 min                     |
| TC-TSP-MOD-10 | done caption  | 含 7 与 O(2ⁿ·n²)                                                 |
| TC-TSP-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 4 执行点                                  |
| TC-TSP-MOD-12 | 元信息        | title 含「TSP」或「旅行商」；initialInput()=[]                   |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                        |
| -------------- | ------------------------------------------- |
| TC-VIEW-TSP-01 | Article + AlgorithmPlayer                   |
| TC-VIEW-TSP-02 | h1 含「旅行商」+ MatrixView + 无 .bars-view |
| TC-VIEW-TSP-03 | 正文含「状压」与「mask」                    |
| TC-HOOK        | DP children 7→8、尾 +tsp（两 spec）         |

## L5 —— e2e

| 用例 ID       | 期望                                                             |
| ------------- | ---------------------------------------------------------------- |
| TC-E2E-TSP-01 | h1 含「旅行商」；`.matrix-view` 可见；拖末步 caption 含 7；Shiki |

## 回归

MatrixView 纯复用零改动（11 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅 DP +1。

## 自测报告

- 执行：1820/1820 全绿、96.10%/95.79%；e2e tsp + stone-merge + knapsack 回归 4/4（首跑全过）。
- 新增 16 Case：TSP-MOD 12 + VIEW-TSP 3 + E2E-TSP 1；改 TC-HOOK 2（DP 7→8 + 尾 +tsp）。
- 关键实测：best=7=暴力全排列（TC-01）；fill 12 项全等（TC-02）；(1111,1) 候选 10/7 取 j=3（TC-03）；sources 前置格与全集行三格（TC-08/09）。
- 真机：fill 步「经城 2：10、经城 3：7，取小 → 7」+ 前置黄格；close 步 11/7/7 三候选 + 3 黄格。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
