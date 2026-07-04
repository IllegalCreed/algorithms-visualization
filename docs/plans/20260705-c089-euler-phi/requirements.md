# 需求：欧拉函数（C-20260705-089，数学与数论第 7 页 · 纯复用 SieveView）

> Status: verified
> Stable ID: C-20260705-089
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

数论线已有筛法（质数从哪来）、gcd/扩欧（互质与逆元）、快速幂（模幂）、CRT（合并同余）。**欧拉函数 φ(n)** = 1..n 中与 n 互质的个数，是这条线缺的一块：**欧拉定理** `a^φ(n) ≡ 1 (mod n)`（费马小定理的推广）给快速幂的指数「打折」，RSA 的私钥正是 `d ≡ e⁻¹ (mod φ(n))`、而 `φ(p·q)=(p−1)(q−1)` 是 RSA 安全性的根。

公式 `φ(n) = n·∏(1−1/p)`（p 取 n 的每个不同质因子）有个非常「筛法」的直观：**把含质因子 p 的数按比例划掉**——每 p 个划 1 个，幸存者就是互质的。

## 目标

数学与数论第 7 页「欧拉函数」，接入播放器，**纯复用 SieveView（第 3 消费者，零改动）**：

1. **互质筛网格**：1..12 网格（cols=6）。逐质因子两步走：find（试除找到质因子 p，琥珀环）→ cross（划掉 p 的倍数变灰、本步红闪，`res ← res·(1−1/p)`）；survive（幸存者 {1,5,7,11} 变绿）；done（公式 + 欧拉定理/RSA 语义）。
2. 固定 `n=12 = 2²·3`（Python 已核验）：划 2 的倍数 res 12→6、划 3 的倍数（新划 3、9）res 6→4；**φ(12) = 4**，幸存者 {1,5,7,11}。**init + 2×(find+cross) + survive + done = 7 步**。
3. 正文：定义 → 构造直观（按比例划掉）→ 性质（积性、φ(p)=p−1、φ(p^k)）→ 欧拉定理与 RSA；双向链接快速幂（指数打折）与 CRT（数论线闭环）。

## 验收标准

- `/docs/euler-phi` 新页：正文 + 播放器同屏，四语言随步高亮；网格逐质因子划格、幸存者变绿；done 报 φ(12)=4。
- 菜单 + 首页「数学与数论」第 7 项，新图标；改 TC-HOOK（数论 children +euler-phi）。
- 全门禁 + 真机自检；SieveView 纯复用零改动（埃氏筛/线性筛 2 既有消费者零回归）。

## 非目标

- 不做线性筛批量求 φ（正文点到即可）；不做欧拉定理的证明动画。
- 不改 AlgorithmPlayer / SieveView（纯复用，同 C-086/087 先例，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。欧拉函数互质筛，纯复用 SieveView；φ(12)=4，7 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机 cross 步 6 格红闪转灰、survive 幸存者 {1,5,7,11} 恰变绿；SieveView 2 既有消费者零回归（e2e 3/3）。
