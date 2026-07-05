# 需求：FFT 快速傅里叶变换（C-20260705-107，数论第 9 页 · 复用 NetworkView additive 蝶形 · M9-5）

> Status: verified
> Stable ID: C-20260705-107
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M9 完结清单第 5 项。**FFT**：多项式/大数乘法的加速器——系数表示做卷积 O(n²)；换<strong>点值表示</strong>逐点相乘只要 O(n)，代价是「取点值」（DFT）本身要快。FFT 取<strong>单位根</strong> ω 的幂做取样点，利用 ω 的对称性把 n 点变换折叠成两个 n/2 点变换：**位反转重排 + log n 层蝶形**（(u,v) → (u+ωv, u−ωv)），O(n log n)。蝶形网络与比较器网络结构同构——正好复用双调排序的 NetworkView。

## 目标

数论第 9 页「FFT」，接入播放器，**复用 NetworkView（第 2 消费者）+ additive 蝶形字段**：

1. **T0**：`NetworkTrack.wireLabels?: string[]`（线值显示字符串——复数；设时替代 wires 数值并加宽左标注区）+ `Comparator.tag?: string`（连线旁 ω 标注；设时不画大值三角——蝶形无方向语义）；双调排序不设 → 零回归（VIZ 2 例）。
2. 固定输入 [1,2,3,4,0,0,0,0]（多项式 1+2x+3x²+4x³ 补零到 8，Python 已核验）：位反转 [0,4,2,6,1,5,3,7] → 三层蝶形逐层值（layer1 全实数 → layer2 出现 1±3i → layer3 = DFT [10, -0.41-7.24i, -2+2i, 2.41-1.24i, -2, …]）**= 直算 DFT 全等对拍**。**9 步** = init + bitrev + (twiddle+butterfly)×3 + done。
3. 正文：为什么点值乘法快 → 单位根与折叠对称 → 位反转的由来（偶奇递归展平）→ 蝶形层结构 → 乘法三部曲（DFT → 逐点乘 → IDFT）与 NTT 点到。

## 验收标准

- `/docs/fft` 新页：正文 + 播放器同屏，四语言随步高亮；蝶形网络逐层执行、线值复数更新、ω 标注可见；done 给 O(n log n) 与三部曲。
- 菜单 + 首页「数学与数论」第 9 项，新图标；改 TC-HOOK（数论 8→9，两 spec）。
- 全门禁 + 真机自检；双调排序页零回归（不设新字段，e2e 回归）。

## 非目标

- 不做 IDFT/点乘的第二段动画、不做 NTT 页（done/正文点到）；复数只显示 2 位小数字符串。
- 不改 AlgorithmPlayer（复用 network 轨字段）。

## 变更历史

- 2026-07-05：创建（draft → approved）。蝶形网络复用 NetworkView + additive wireLabels/tag；9 步。
- 2026-07-05：交付验收（approved → verified）。18 Case 全绿 + 真机自检通过。
