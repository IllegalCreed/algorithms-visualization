# 需求：播放控制增强（C-20260705-111，M10-P2）

> Status: verified
> Stable ID: C-20260705-111
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M10 播放器 2.0 第二项（backlog P2：「自动播放/暂停、速度 0.5×–3×、键盘 ←/→/空格、播完循环」）。自动播放/暂停已有；本变更补齐其余三件——播放器单点改动，114 页全站受益。

## 目标

1. **速度 3×**：倍速档 [0.5, 1, 2] → [0.5, 1, 2, 3]。
2. **播完循环**：TransportControls 新「循环」开关（激活高亮）；开启时播到末步自动回第 0 步续播；`loop` 默认关——既有行为全等（additive）。循环开启时在末步点「播放」也从头播。
3. **键盘快捷键**（AlgorithmPlayer 挂载期间全局生效）：`→` 下一步、`←` 上一步、`空格` 播放/暂停（preventDefault 防页面滚动）；**输入框/下拉聚焦时不响应**（InputBar 文本框里按空格/方向键是打字，不是操控）。

## 验收标准

- 任一算法页：3× 可选且更快；循环开启播完自动重来；键盘三键可用、在输入框内打字不受干扰。
- `loop` 默认关 + 快捷键不改变既有点击路径——全量单测/e2e 回归绿。

## 非目标

- 不做进度条键盘 seek（Home/End）、不做逐帧长按加速；测验模式（P3）另行。

## 变更历史

- 2026-07-05：创建（draft → approved）。M10-P2：3× + 循环 + 键盘三键。
- 2026-07-05：交付验收（approved → verified）。8 Case 全绿 + 全量 e2e 回归 + 真机自检。
