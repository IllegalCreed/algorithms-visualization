# 测试用例：米勒-拉宾素性测试（C-20260705-090，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-090
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-MR-MOD-*`、`TC-VIEW-MR-*`、`TC-E2E-MR-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例，同 C-086/087/089 先例）

## L3 —— `mr.module`

固定 a=2；试验① n=41（真质数）、试验② n=561（卡迈克尔数）；oracle `isPrimeBrute` 试除。

| 用例 ID      | 场景            | 期望                                                                              |
| ------------ | --------------- | --------------------------------------------------------------------------------- |
| TC-MR-MOD-01 | 真值对拍        | mrChain(41)=probable-prime=试除；mrChain(561)=composite=试除                      |
| TC-MR-MOD-02 | 费马被骗        | powMod(2,560,561)=1（卡迈克尔）而 MR 判合数                                       |
| TC-MR-MOD-03 | 分解            | 40=2³·5、560=2⁴·35（decompose 对拍）                                              |
| TC-MR-MOD-04 | 链值            | 41 链 [32,40]；561 链 [263,166,67,1]（mrChain）                                   |
| TC-MR-MOD-05 | 步合法          | point∈{init,decomp,pow,square,verdict,done} 带 matrix、array=[]                   |
| TC-MR-MOD-06 | 表结构          | 2×4、labels/rowLabels 正确；init 全 null                                          |
| TC-MR-MOD-07 | 填格            | pow/square 步 updatedCell 依次 [0,0],[0,1],[1,0],[1,1],[1,2],[1,3]；值=链         |
| TC-MR-MOD-08 | verdict sources | 试验① [[0,1]]（−1 格）；试验② [[1,2],[1,3]]（67 与 1）                            |
| TC-MR-MOD-09 | 步数结构        | 12 步 = init + (decomp,pow,square,verdict) + (decomp,pow,square×3,verdict) + done |
| TC-MR-MOD-10 | caption         | 试验① verdict 含 −1/通过；试验② verdict 含 非平凡/合数；done 含 1/4 概率语义      |
| TC-MR-MOD-11 | 四语言 + 行号   | 四语言、行号在内、覆盖 6 执行点                                                   |
| TC-MR-MOD-12 | 元信息          | title 含「米勒-拉宾」；initialInput()=[]                                          |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                             |
| ------------- | ------------------------------------------------ |
| TC-VIEW-MR-01 | Article + AlgorithmPlayer                        |
| TC-VIEW-MR-02 | h1 含「米勒-拉宾」+ MatrixView + 无 .bars-view   |
| TC-VIEW-MR-03 | 正文含「卡迈克尔」与「平方根」+ MatrixView 同屏  |
| TC-HOOK       | 数论 children = [...,'euler-phi','miller-rabin'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| TC-E2E-MR-01 | h1 含「米勒-拉宾」；`.matrix-view` 可见；拖末步 caption 含 1/4 概率语义；Shiki |

## 回归

MatrixView 纯复用零改动（既有 9 消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅数论 +1。

## 自测报告

- 执行：1685/1685 全绿、95.92%/95.46%；e2e miller-rabin + fast-power + crt 3/3（首跑全过）。
- 新增 16 Case：MR-MOD 12 + VIEW-MR 3 + E2E-MR 1；改 TC-HOOK 2（数论 +miller-rabin）。
- 关键实测：41 通过=试除、561 合数=试除（TC-01）；2^560≡1 费马被骗 + MR 判合数（TC-02）；链 [32,40]/[263,166,67,1]（TC-04）；填格序与 sources 依据格（TC-07/08）；12 步步序（TC-09）。
- 真机：verdict 步 67 与 1 黄高亮、caption「非平凡平方根 → 561 是合数」；末步 1/4 概率语义。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
