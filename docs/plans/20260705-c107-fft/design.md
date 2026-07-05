# 设计：FFT（C-20260705-107，复用 NetworkView additive 蝶形 · M9-5）

> Status: verified
> Stable ID: C-20260705-107
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验，= 直算 DFT 全等）

输入 a = [1,2,3,4,0,0,0,0]（1+2x+3x²+4x³ 补零）；位反转序 [0,4,2,6,1,5,3,7] → 重排 [1,0,3,0,2,0,4,0]。

| 层  | 跨度 | ω（=ω₈）      | 输出                                                                     |
| --- | ---- | ------------- | ------------------------------------------------------------------------ |
| L=2 | 1    | ×1 全部       | [1,1,3,3,2,2,4,4]                                                        |
| L=4 | 2    | ×1 / ×ω²      | [4, 1-3i, -2, 1+3i, 6, 2-4i, -2, 2+4i]                                   |
| L=8 | 4    | ×1/×ω/×ω²/×ω³ | [10, -0.41-7.24i, -2+2i, 2.41-1.24i, -2, 2.41+1.24i, -2-2i, -0.41+7.24i] |

## T0：NetworkView additive（第 2 消费者）

`NetworkTrack.wireLabels?: string[]`：设时左端显示字符串值（复数），左标注区加宽（44→96）；`Comparator.tag?: string`：竖线中点右侧小字标注（'×1'/'×ω²'…），设 tag 的比较器**不画大值三角**。双调排序不设 → 全回退零回归。VIZ 2 例（TC-VIZ-NETVIEW-04/05）。

## T1：oracle + module + sources

`fft.ts`：复数 {re,im} 手写四则 + `fmtC`（2 位小数、去 -0）；`FFT_A`；`bitRev`；`fftTrace()` → `{input, rev, layers: string[][]（4 层）}`；`dftBrute()` 直算 DFT 字符串数组（独立真值）。
`fft.module.ts`：蝶形 comparators 3 列（col0 相邻对×4 全 ×1；col1 跨 2：×1/×ω²；col2 跨 4：×1/×ω/×ω²/×ω³）。9 步：init（顺序输入 + 点值乘法动机）→ bitrev（重排 + 偶奇递归展平）→ twiddle(L=2)（currentCol=0 预告 + 蝶形公式）→ butterfly（值→layer1）→ twiddle(L=4)（ω 半层）→ butterfly（1±3i 登场）→ twiddle(L=8) → butterfly（=DFT）→ done（对拍 + O(n log n) + 三部曲 + NTT）。`FftExecPoint = 'init'|'bitrev'|'twiddle'|'butterfly'|'done'`。
`fft.sources.ts`：四语言迭代 FFT，lineMap init/bitrev/twiddle/butterfly/done。

## T2：页面 + 接线

`Fft.vue`（Algorithm 目录）；路由 `/docs/fft`；菜单/首页「数学与数论」第 9 项（miller-rabin 后）；新 svg（蝶形交叉线）；改 TC-HOOK（数论 8→9 两 spec）。

## 复用与零回归

NetworkView additive 零破坏（bitonic 不设 wireLabels/tag 全回退）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致（LEFT 常量改 computed 随 wireLabels 加宽）。
