# 实现记录：FFT（C-20260705-107，复用 NetworkView additive 蝶形 · M9-5）

> Status: verified
> Stable ID: C-20260705-107
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. T0：VIZ spec（TC-VIZ-NETVIEW-04/05）红 → types +wireLabels?/tag? + NetworkView 回退消费 绿。
2. T1：fft.module.spec（TC-FFT-MOD-01..12）红 → fft.{ts,sources,module} 绿（types +FftExecPoint）。
3. T2：Fft.vue + 路由 + 菜单/首页数论第 9 项 + svg + TC-HOOK（8→9）+ 页 spec + e2e。
4. 门禁 → 真机 → 回写 → 两提交 → 双轨部署。

## 关键实现笔记

- 复数手写 {re,im} 四则 + fmtC（round 2 位、Object.is 去 -0、±1 虚部简写 'i'/'-i'）——浮点尾差 round 后归零，layer1/2 全整数显示干净。
- NetworkView additive：LEFT 由常量改 computed（wireLabels 设时 44→96 加宽，colX 随动）；tag 设时 v-if 切换三角 path → ω 文本；三态色（默认/active/done）同步作用于 .net-tag。
- 蝶形网络 12 单元硬编码（网络与数据无关，同双调排序惯例）；tag 约定 ω≡ω₈，L=4 层的 ω₄¹ 写成 ×ω²（换算 ω_L^k = ω₈^{8k/L}），caption 注明 ω²=−i。
- twiddle/butterfly 拆步：twiddle 亮当前列但值不变（预告 + 公式），butterfly 同列值刷新——同一 currentCol 两步，视觉「预告→执行」。
- 教训：sources 首版 import 串台成 '@type-pal/shared'（并行处理另一项目遗留）——立即改回 '@/components/player/types'；lineMap 四语言各错一处 done/butterfly 落点，逐行数后修正。

## 自测报告

见 [test-cases.md](./test-cases.md) 自测报告节：1944/1944 全绿、96.26%/95.88%，e2e 2/2，真机 L=4 蝶形步核验通过。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
