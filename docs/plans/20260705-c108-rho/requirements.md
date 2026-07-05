# 需求：Pollard's Rho 因数分解（C-20260705-108，数论第 10 页 · 纯复用 GraphView · M9-6 收官）

> Status: verified
> Stable ID: C-20260705-108
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M9 完结清单第 6 项（A 档收官）。**大数因数分解**：试除到 √n 太慢；**Pollard's Rho** 用伪随机序列 x ← x²+c (mod n) 加生日悖论——序列在未知因子 d 的世界（mod d）里 O(√d)=O(n^¼) 步就进入循环（ρ 形），两数 mod d 相同而 mod n 不同时，gcd(|差|, n) 就把 d「显影」出来。Floyd 龟兔（慢 1 步快 2 步）在环上必相遇，每步一次 gcd。与米勒-拉宾（C-090）配套成完整分解流水线：判素 → 分解 → 递归。

## 目标

数论第 10 页「Pollard's Rho」，接入播放器，**纯复用 GraphView（第 11 消费者，零改动）**：

1. **ρ 链图**：8 个序列值节点（2,5,26,677,7474,2839,871,1848）按「mod 97 同余同站台」布局成 ρ；`checkPair` 蓝环 = 龟兔当前位、`edgeClass` mst = 走过的链边、**reveal 步 `nodeGroup` 按余数类着色**（{2}/{5,7474,1848}/{26,2839}/{677,871} 四组）——上帝视角 ρ 现形。
2. 固定 n=8051=83×97、f(x)=x²+1、x₀=2（Python 已核验）：龟兔 race1 gcd(21)=1、race2 gcd(7448)=1、**race3 gcd(|677−871|)=gcd(194)=97 命中**；mod 97 序列尾 1 环 3、677≡871≡95（环上相遇实证）。**7 步** = init + seed + race×2 + hit + reveal + done。对拍：因子×余因子 = n 且 83/97 双双通过试除判素。
3. 正文：试除的墙 → 生日悖论直觉 → 「两个世界」（mod n 看乱跳、mod d 早转圈）与 gcd 显影 → Floyd 龟兔 → O(n^¼) 与分解流水线（米勒-拉宾判素 + Rho 分解 + 递归）、Brent 优化与 RSA 反面点到。

## 验收标准

- `/docs/pollard-rho` 新页：正文 + 播放器同屏，四语言随步高亮；龟兔蓝环追逐 + hit 揭晓 + reveal 四色 ρ 现形；done 给 O(n^¼) 与流水线。
- 菜单 + 首页「数学与数论」第 10 项，新图标；改 TC-HOOK（数论 9→10，两 spec）。
- 全门禁 + 真机自检；GraphView 纯复用零改动（既有 10 消费者零回归）。

## 非目标

- 不做 Brent 变体 / 大整数（BigInt）实现动画（正文点到）；不做完整递归分解树。
- 不改 AlgorithmPlayer / GraphView（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。ρ 链 + 龟兔 + reveal 四色现形，纯复用 GraphView；7 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 真机自检通过；M9 A 档六页收官。
