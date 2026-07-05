# 测试用例：Pollard's Rho（C-20260705-108，纯复用 GraphView · M9-6 收官）

> Status: verified
> Stable ID: C-20260705-108
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-RHO-MOD-*`、`TC-VIEW-RHO-*`、`TC-E2E-RHO-01`；改 `TC-HOOK`（纯复用 GraphView，无 VIZ/PLAYER 新用例）

## L3 —— `rho.module`

固定 n=8051、f(x)=x²+1、x₀=2；oracle `isPrimeBrute` 试除判素。

| 用例 ID       | 场景          | 期望                                                                    |
| ------------- | ------------- | ----------------------------------------------------------------------- |
| TC-RHO-MOD-01 | 对拍          | factor=97、cofactor=83、97×83=8051、两者均 isPrimeBrute                 |
| TC-RHO-MOD-02 | 序列与 ρ      | xs=[2,5,26,677,7474,2839,871,1848]；mod 97 尾 1 环 3                    |
| TC-RHO-MOD-03 | 龟兔轨迹      | race1 (5,26) g=1；race2 (26,7474) g=1；race3 (677,871) diff=194 g=97    |
| TC-RHO-MOD-04 | 步合法        | point∈{init,seed,race,hit,reveal,done} 带 graph、array=[]               |
| TC-RHO-MOD-05 | 步数结构      | 7 步 = init+seed+race×2+hit+reveal+done                                 |
| TC-RHO-MOD-06 | seed 步       | activeNode=0（x₀）；caption 含 x²+1 与伪随机语义                        |
| TC-RHO-MOD-07 | race 步       | checkPair=[1,2]/[2,4]；链边 mst 数随 fast 前进（2→4）；caption 含 gcd=1 |
| TC-RHO-MOD-08 | hit 步        | checkPair=[3,6]；caption 含 194 与 97；8051 = 83 × 97                   |
| TC-RHO-MOD-09 | reveal 步     | nodeGroup=[0,1,2,3,1,2,3,1]；caption 含 mod 97 与环语义                 |
| TC-RHO-MOD-10 | done          | caption 含 O(n^¼)（或 n^{1/4}）与判素/流水线语义                        |
| TC-RHO-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 6 执行点                                         |
| TC-RHO-MOD-12 | 元信息        | title 含「Pollard」或「Rho」；initialInput()=[]                         |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                           |
| -------------- | ---------------------------------------------- |
| TC-VIEW-RHO-01 | Article + AlgorithmPlayer                      |
| TC-VIEW-RHO-02 | h1 含「Pollard」+ GraphView + 无 .bars-view    |
| TC-VIEW-RHO-03 | 正文含「生日悖论」与「gcd」                    |
| TC-HOOK        | 数论 children 9→10、尾 +pollard-rho（两 spec） |

## L5 —— e2e

| 用例 ID       | 期望                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| TC-E2E-RHO-01 | h1 含「Pollard」；`.graph-view` 可见；拖末步 caption 含 n^¼（或 O(n）；Shiki |

## 回归

GraphView 纯复用零改动（10 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅数论 +1。

## 自测报告

- 执行：1959/1959 全绿、96.27%/95.90%；e2e pollard-rho + scc + hungarian 回归 3/3（首跑全过）。
- 新增 16 Case：RHO-MOD 12 + VIEW-RHO 3 + E2E-RHO 1；改 TC-HOOK 2（数论 9→10 + 尾 +pollard-rho）。
- 关键实测：97×83=8051 + 双素性试除（TC-01）；序列全等 + mod 97 尾 1 环 3（TC-02）；龟兔三轮 gcd 21/7448→1、194→97（TC-03）；race 步 checkPair [1,2]/[2,4] + 链边 2→4（TC-07）；reveal nodeGroup=[0,1,2,3,1,2,3,1]（TC-09）。
- 真机：reveal 步四色站台（2 尾 / 5·7474·1848 / 26·2839 / 677·871）+ 龟兔双蓝环落在余 95 粉站台（环上相遇实证）+ 7 链边绿箭头。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
