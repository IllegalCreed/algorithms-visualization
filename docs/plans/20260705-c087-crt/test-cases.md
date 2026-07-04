# 测试用例：中国剩余定理（C-20260705-087，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-087
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-CRT-MOD-*`、`TC-VIEW-CRT-*`、`TC-E2E-CRT-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例，同 C-086 先例）

## L3 —— `crt.module`

固定孙子算经 `[2,3,2]/[3,5,7]`；oracle `crtBrute()`=23（暴力独立真值）。

| 用例 ID       | 场景           | 期望                                                    |
| ------------- | -------------- | ------------------------------------------------------- |
| TC-CRT-MOD-01 | 末步 done + 解 | crtBrute()=23=crtSolve().x；M=105；合计格 233           |
| TC-CRT-MOD-02 | 步合法         | point∈{init,mi,inv,term,sum,done} 带 matrix、array=[]   |
| TC-CRT-MOD-03 | 表结构         | 5 列 [r,m,Mᵢ,tᵢ,项] × 4 行；labels/rowLabels 正确       |
| TC-CRT-MOD-04 | init 就位      | r/m 两列 [2,3]/[3,5]/[2,7]，其余 null；合计行全 null    |
| TC-CRT-MOD-05 | Mᵢ             | mi 三步依次填 35/21/15（updatedCell=[i,2]）             |
| TC-CRT-MOD-06 | tᵢ + 逆对拍    | inv 依次 2/1/1；(Mᵢ mod mᵢ)·tᵢ ≡ 1 (mod mᵢ) 全验        |
| TC-CRT-MOD-07 | 专属项         | term 依次 140/63/30；对本模 ≡rᵢ、异模 ≡0（3×3 全验）    |
| TC-CRT-MOD-08 | 合计+归约      | sum 步合计格 233=140+63+30；233 mod 105 = 23 = 暴力     |
| TC-CRT-MOD-09 | sources 引用   | inv=[[i,2],[i,1]]；term=[[i,0],[i,2],[i,3]]；sum=三项格 |
| TC-CRT-MOD-10 | done caption   | 含 23 与 105（唯一性/RSA-CRT 语义）                     |
| TC-CRT-MOD-11 | 四语言 + 行号  | 四语言、行号在内、覆盖 6 执行点                         |
| TC-CRT-MOD-12 | 元信息         | title 含「中国剩余定理」；initialInput()=[]             |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                              |
| -------------- | ------------------------------------------------- |
| TC-VIEW-CRT-01 | Article + AlgorithmPlayer                         |
| TC-VIEW-CRT-02 | h1 含「中国剩余定理」+ MatrixView + 无 .bars-view |
| TC-VIEW-CRT-03 | 正文含「孙子算经」+ MatrixView 同屏               |
| TC-HOOK        | 数论 children = [...,'ext-gcd','crt']             |

## L5 —— e2e

| 用例 ID       | 期望                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| TC-E2E-CRT-01 | h1 含「中国剩余定理」；`.matrix-view` 可见；拖末步 caption 含 23 与 105；Shiki |

## 回归

MatrixView 纯复用零改动（既有 8 消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅数论 +1。

## 自测报告

- 执行：1638/1638 全绿、95.89%/95.49%；e2e crt + ext-gcd + gcd 3/3（首跑全过）。
- 新增 16 Case：CRT-MOD 12 + VIEW-CRT 3 + E2E-CRT 1；改 TC-HOOK 2（数论 +crt）。
- 关键实测：crtBrute=23=crtSolve().x（TC-01）；Mᵢ=35/21/15、tᵢ=2/1/1 逆元对拍（TC-05/06）；专属项本模 ≡rᵢ、异模 ≡0 3×3 全验（TC-07）；sources 引用格（TC-09）。
- 真机：inv 步当前格绿+琥珀框、引用 mᵢ/Mᵢ 黄高亮；末步 12/12 caption「233 mod 105 = 23」、vars x=23；首页图标 data-URI 加载正常。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
