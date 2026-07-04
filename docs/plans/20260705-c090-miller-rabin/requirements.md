# 需求：米勒-拉宾素性测试（C-20260705-090，数学与数论第 8 页 · 纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-090
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

RSA 要挑几百位的大质数——试除到 √n 天文数字。费马小定理给了快测：质数必满足 `a^(n−1) ≡ 1 (mod n)`；可**卡迈克尔数**（如 `561 = 3·11·17`）对所有互质底数都过费马测试（`2^560 ≡ 1 (mod 561)`，Python 已核验）。**米勒-拉宾**在「开平方」处设卡：质数模下 `x² ≡ 1` 只有平凡解 `x ≡ ±1`；把 `n−1 = 2^s·d` 拆开、从 `a^d` 连续平方，若中途从「既非 1 也非 −1」的数平方出 1——**非平凡平方根**现形，必是合数。

## 目标

数学与数论第 8 页「米勒-拉宾」，接入播放器，**纯复用 MatrixView（第 10 消费者，零改动）**：

1. **平方链表**：2 行试验 × 4 列 `[a^d, 平方¹, 平方², 平方³]`；rowLabels `['41（真质数）','561（伪装者）']`。逐步填链，verdict 步 `sources` 黄高亮判定依据格。
2. 固定双实例（Python 已核验）：**n=41**（`40=2³·5`，链 `32→40=−1` 撞 −1 → 通过）；**n=561**（`560=2⁴·35`，链 `263→166→67→1`，`67²≡1` 且 67∉{1,560} → 非平凡平方根 → 合数）。**12 步** = init + 试验①(decomp/pow/square/verdict) + 试验②(decomp/pow/square×3/verdict) + done。
3. 正文：大数判素动机 → 费马测试与卡迈克尔漏洞 → 平方根卡点原理 → 概率界（单轮误报 ≤1/4、k 轮 4^−k、64 位确定性底数集）；链接快速幂（powMod 子程序）与欧拉函数（费马小定理）。

## 验收标准

- `/docs/miller-rabin` 新页：正文 + 播放器同屏，四语言随步高亮；平方链逐格填、verdict 高亮依据；done 给概率语义。
- 菜单 + 首页「数学与数论」第 8 项，新图标；改 TC-HOOK（数论 children +miller-rabin）。
- 全门禁 + 真机自检；MatrixView 纯复用零改动（既有 9 消费者零回归）。

## 非目标

- 不做大数（BigInt）实现与随机底数（固定 a=2 教学实例）；不做 BPSW 组合测试动画。
- 不改 AlgorithmPlayer / MatrixView（纯复用，同 C-086/087/089 先例，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。米勒-拉宾平方链表，纯复用 MatrixView；41 通过 / 561 现形，12 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机 verdict 步 67 与 1 黄高亮「作案证据」、caption 非平凡平方根 + 费马被骗；MatrixView 9 既有消费者零回归。
