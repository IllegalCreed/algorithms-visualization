# 测试用例：欧拉函数（C-20260705-089，纯复用 SieveView）

> Status: verified
> Stable ID: C-20260705-089
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-PHI-MOD-*`、`TC-VIEW-PHI-*`、`TC-E2E-PHI-01`；改 `TC-HOOK`（纯复用 SieveView，无 VIZ/PLAYER 新用例，同 C-086/087 先例）

## L3 —— `phi.module`

固定 n=12；oracle `phiBrute(12)`=4（gcd 暴力独立真值）。

| 用例 ID       | 场景          | 期望                                                    |
| ------------- | ------------- | ------------------------------------------------------- |
| TC-PHI-MOD-01 | 真值对拍      | phiBrute(12)=4=phiFormula(12).res；factors=[2,3]        |
| TC-PHI-MOD-02 | 步合法        | point∈{init,find,cross,survive,done} 带 sieve、array=[] |
| TC-PHI-MOD-03 | 网格造型      | n=12、cols=6；init 全 unknown（1 也未定）               |
| TC-PHI-MOD-04 | find 步       | 依次 current=2、3；caption 含试除/质因子语义            |
| TC-PHI-MOD-05 | cross 划格    | p=2 marking=[2,4,6,8,10,12]；p=3 marking=[3,9]（增量）  |
| TC-PHI-MOD-06 | res 记账      | cross 后 vars res 链 12→6→4                             |
| TC-PHI-MOD-07 | survive       | 幸存者 {1,5,7,11} 全 prime；composite 恰 8 个           |
| TC-PHI-MOD-08 | 幸存者对拍    | 幸存者集合 = gcd 暴力互质集合                           |
| TC-PHI-MOD-09 | 步数结构      | 7 步 = init + 2×(find+cross) + survive + done           |
| TC-PHI-MOD-10 | done caption  | 含 φ(12) = 4 与欧拉定理/RSA 语义                        |
| TC-PHI-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                         |
| TC-PHI-MOD-12 | 元信息        | title 含「欧拉函数」；initialInput()=[]                 |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                         |
| -------------- | -------------------------------------------- |
| TC-VIEW-PHI-01 | Article + AlgorithmPlayer                    |
| TC-VIEW-PHI-02 | h1 含「欧拉函数」+ SieveView + 无 .bars-view |
| TC-VIEW-PHI-03 | 正文含「互质」与「欧拉定理」+ SieveView 同屏 |
| TC-HOOK        | 数论 children = [...,'crt','euler-phi']      |

## L5 —— e2e

| 用例 ID       | 期望                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| TC-E2E-PHI-01 | h1 含「欧拉函数」；`.sieve-view` 可见；拖末步 caption 含 4 与 φ；Shiki |

## 回归

SieveView 纯复用零改动（埃氏筛/线性筛零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅数论 +1。

## 自测报告

- 执行：1670/1670 全绿、95.93%/95.45%；e2e euler-phi + 筛法 2 页回归 3/3（首跑全过）。
- 新增 16 Case：PHI-MOD 12 + VIEW-PHI 3 + E2E-PHI 1；改 TC-HOOK 2（数论 +euler-phi）。
- 关键实测：phiBrute=4=phiFormula、factors=[2,3]（TC-01）；划格 p=2 全量 [2..12]、p=3 增量 [3,9]（TC-05）；res 链 12→6→4（TC-06）；幸存者 = gcd 暴力互质集合（TC-08）；步序 init/find/cross×2/survive/done（TC-09）。
- 真机：cross 步 6 格红闪转灰 + current 琥珀环；survive 幸存者 {1,5,7,11} 恰变绿；末步 caption 欧拉定理 + RSA。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
