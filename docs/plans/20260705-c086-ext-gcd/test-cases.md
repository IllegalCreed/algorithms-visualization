# 测试用例：扩展欧几里得（C-20260705-086，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-086
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-EG-MOD-*`、`TC-VIEW-EG-*`、`TC-E2E-EG-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例，同 C-065 先例）

## L3 —— `extgcd.module`

固定 30,18；oracle `extGcd(30,18)`={g:6,x:−1,y:2}。

| 用例 ID      | 场景               | 期望                                                                   |
| ------------ | ------------------ | ---------------------------------------------------------------------- |
| TC-EG-MOD-01 | 末步 done + Bézout | extGcd={6,−1,2}；30·(−1)+18·2=6；末表行 0 x=−1,y=2                     |
| TC-EG-MOD-02 | 步合法             | point∈{init,down,base,up,done} 带 matrix、array=[]                     |
| TC-EG-MOD-03 | 表结构             | 5 列 [a,b,q,x,y] × 4 行；labels/rowLabels 正确                         |
| TC-EG-MOD-04 | 下行填表           | down 3 步后行 0-2 的 a,b,q = [30,18,1]/[18,12,1]/[12,6,2]，x,y 仍 null |
| TC-EG-MOD-05 | 基例               | base 步行 3 = [6,0,null,1,0]，caption 含恒等语义                       |
| TC-EG-MOD-06 | 回代公式           | up 步依次填行 2 (0,1)、行 1 (1,−1)、行 0 (−1,2)                        |
| TC-EG-MOD-07 | sources 引用       | 各 up 步 sources = 下一行 x/y 两格 [[i+1,3],[i+1,4]]                   |
| TC-EG-MOD-08 | 每层恒等           | 各行填完后 a·x+b·y=6（4 行全验）                                       |
| TC-EG-MOD-09 | 结构计数           | down 3 / base 1 / up 3；active/updatedCell 落在当前行                  |
| TC-EG-MOD-10 | done caption       | 含 −1、2 与 Bézout/模逆元语义                                          |
| TC-EG-MOD-11 | 四语言 + 行号      | 四语言、行号在内、覆盖 5 执行点                                        |
| TC-EG-MOD-12 | 元信息             | title 含「扩展欧几里得」；initialInput()=[]                            |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                              |
| ------------- | ------------------------------------------------- |
| TC-VIEW-EG-01 | Article + AlgorithmPlayer                         |
| TC-VIEW-EG-02 | h1 含「扩展欧几里得」+ MatrixView + 无 .bars-view |
| TC-VIEW-EG-03 | 正文含「Bézout」或「模逆元」+ MatrixView 同屏     |
| TC-HOOK       | 数论 children = [...,'fast-power','ext-gcd']      |

## L5 —— e2e

| 用例 ID      | 期望                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| TC-E2E-EG-01 | h1 含「扩展欧几里得」；`.matrix-view` 可见；拖末步 caption 含 −1 与 2；Shiki |

## 回归

MatrixView 纯复用零改动（既有 7 消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅数论 +1。

## 自测报告

- 执行：1623/1623 全绿、95.86%/95.44%；e2e ext-gcd + gcd + fast-power 3/3（首跑全过）。
- 新增 16 Case：EG-MOD 12 + VIEW-EG 3 + E2E-EG 1；改 TC-HOOK 2（数论 +ext-gcd）。
- 关键实测：extGcd={6,−1,2}（TC-01）；下行表/基例/回代 (0,1)(1,−1)(−1,2)（TC-04/05/06）；sources 指向下一行（TC-07）；每层恒等 a·x+b·y=6（TC-08）。
- 真机：回代表三色高亮（当前琥珀/刚填绿/引用黄）、字幕公式+验证、末步 Bézout + 模逆元语义。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
