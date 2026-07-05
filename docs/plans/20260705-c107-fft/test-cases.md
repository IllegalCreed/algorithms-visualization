# 测试用例：FFT（C-20260705-107，复用 NetworkView additive 蝶形 · M9-5）

> Status: verified
> Stable ID: C-20260705-107
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-FFT-MOD-*`、`TC-VIZ-NETVIEW-04/05`（additive）、`TC-VIEW-FFT-*`、`TC-E2E-FFT-01`；改 `TC-HOOK`

## T0 —— NetworkView additive（L4）

| 用例 ID           | 场景              | 期望                                                                   |
| ----------------- | ----------------- | ---------------------------------------------------------------------- |
| TC-VIZ-NETVIEW-04 | wireLabels/tag 设 | 线值显示 '1-3i' 等字符串；tag 渲染 ×ω 标注；设 tag 的比较器无三角 path |
| TC-VIZ-NETVIEW-05 | 不设回退          | 缺省显示 wires 数值 + 大值三角（双调排序零回归）                       |

## L3 —— `fft.module`

固定 a=[1,2,3,4,0,0,0,0]；oracle `dftBrute` 直算 DFT。

| 用例 ID       | 场景          | 期望                                                                        |
| ------------- | ------------- | --------------------------------------------------------------------------- |
| TC-FFT-MOD-01 | 对拍          | fftTrace().layers[3] = dftBrute()（含 '10'、'-2+2i'、'-0.41-7.24i'）        |
| TC-FFT-MOD-02 | 逐层值        | 位反转 [1,0,3,0,2,0,4,0]；layer1=[1,1,3,3,2,2,4,4]；layer2 含 '1-3i'/'1+3i' |
| TC-FFT-MOD-03 | 步合法        | point∈{init,bitrev,twiddle,butterfly,done} 带 network、array=[]             |
| TC-FFT-MOD-04 | 步数结构      | 9 步 = init+bitrev+(twiddle+butterfly)×3+done                               |
| TC-FFT-MOD-05 | init 步       | wireLabels=['1','2','3','4','0','0','0','0']；comparators 12 个 3 列        |
| TC-FFT-MOD-06 | bitrev 步     | wireLabels=['1','0','3','0','2','0','4','0']；caption 含位反转              |
| TC-FFT-MOD-07 | twiddle 步    | currentCol 逐层 0/1/2；值与上一步不变；caption 含蝶形公式或 ω               |
| TC-FFT-MOD-08 | butterfly 步  | 三步后值分别 = layer1/2/3；L=4 步 caption 含 1-3i 或 −i                     |
| TC-FFT-MOD-09 | tag 标注      | col0 全 ×1；col1 含 ×ω²；col2 含 ×ω/×ω²/×ω³                                 |
| TC-FFT-MOD-10 | done          | done=true + caption 含 O(n log n) 与三部曲（点乘/IDFT）语义                 |
| TC-FFT-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                                             |
| TC-FFT-MOD-12 | 元信息        | title 含「FFT」；initialInput()=[]                                          |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                      |
| -------------- | ----------------------------------------- |
| TC-VIEW-FFT-01 | Article + AlgorithmPlayer                 |
| TC-VIEW-FFT-02 | h1 含「FFT」+ NetworkView + 无 .bars-view |
| TC-VIEW-FFT-03 | 正文含「单位根」与「点值」                |
| TC-HOOK        | 数论 children 8→9、尾 +fft（两 spec）     |

## L5 —— e2e

| 用例 ID       | 期望                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| TC-E2E-FFT-01 | h1 含「FFT」；`.network-view` 可见；拖末步 caption 含 O(n log n)；Shiki |

## 回归

双调排序零回归（不设 wireLabels/tag 全回退，TC-VIZ-NETVIEW-01..03 原样通过 + e2e bitonic）；AlgorithmPlayer 零改动；TC-HOOK 仅数论 +1。

## 自测报告

- 执行：1944/1944 全绿、96.26%/95.88%；e2e fft + bitonic-sort 回归 2/2（首跑全过）。
- 新增 18 Case：FFT-MOD 12 + VIZ-NETVIEW 2（additive）+ VIEW-FFT 3 + E2E-FFT 1；改 TC-HOOK 2（数论 8→9 + 尾 +fft）。
- 关键实测：末层 = 直算 DFT 全等（'10'/'-2+2i'/'-0.41-7.24i'，TC-01）；位反转 [0,4,2,6,1,5,3,7] + 三层逐层值（TC-02）；tag col0 全 ×1 / col1 ×ω² / col2 ×ω·×ω³（TC-09）；twiddle 值不变 + butterfly 三步 = layers 1/2/3（TC-07/08）。
- 真机：L=4 butterfly 步复数线值 [4, 1-3i, -2, 1+3i, 6, 2-4i, …] + 列进度三色（绿/琥珀/灰）+ ω 标注全可见、左标注区加宽无截断；bitonic e2e 原样通过（additive 零回归实证）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。18 Case 全绿。
