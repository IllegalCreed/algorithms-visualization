# 需求：播放器自定义输入 + ?input= 分享（C-20260705-110，M10-P1）

> Status: verified
> Stable ID: C-20260705-110
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M10 播放器 2.0 首项（清单 `docs/plans/completion-backlog.md`）。`AlgorithmModule` 接口天生是 `initialInput() + buildSteps(input)`，22 个模块真正消费输入（其余固定剧本传空数组）——但播放器从不暴露输入口，观众只能看默认数据。自定义输入是「交互性增强」的第一块砖：改数据 → 看同一算法走不同的路；`?input=` 让任何一次输入可以一键分享。

## 目标

1. **播放器层（全 additive，零回归）**：
   - `AlgorithmModule.inputSpec?: InputSpec`（`{hint, lenMin, lenMax, valMin, valMax}`）——**不设 = 不渲染输入条**，102 个既有页面零变化。
   - 新组件 `InputBar.vue`：文本框（逗号/空格分隔）+「应用」+「恢复默认」+ 行内错误提示。
   - `parseInputArray(text, spec)` 纯函数：整数数组解析 + 长度/值域校验，中文逗号容错。
   - `usePlayer` 兼容 `Ref<Step[]>`（既有静态数组调用行为不变）；应用输入 → 重建 steps + 回到第 0 步。
   - **URL 分享**：挂载时读 `?input=5,3,8`（合法才生效）；应用时 `history.replaceState` 写回 URL、恢复默认时清除——不依赖 vue-router，与 spa-github-pages 共存。
2. **模块层第一批**：常规排序 12 模块（bubble/cocktail/insertion/binary-insertion/selection/shell/merge/top-down-merge/quick/dual-pivot/three-way/heap）加统一 `SORT_INPUT_SPEC`（2~12 个 1..99 整数）。counting（值域）/radix（位数）/bitonic（2 的幂）/查找类（有序/单峰）约束特殊，本批不开、后续逐个评估。

## 验收标准

- 12 个排序页出现输入条：改输入 → 动画/步数随之变化；非法输入红字提示不生效；恢复默认一键还原。
- 带 `?input=` 打开页面直接播自定义数据；应用后 URL 同步可复制分享。
- 无 inputSpec 的页面（图/DP/字符串等全部）界面零变化；全量单测 + e2e 回归绿。

## 非目标

- 不做非数组输入（字符串/图/矩阵的自定义）——后续批次；不做「随机生成」按钮（P2 一并评估）；不做输入历史。

## 变更历史

- 2026-07-05：创建（draft → approved）。M10-P1：inputSpec + InputBar + ?input= 分享，第一批 12 排序模块。
- 2026-07-05：交付验收（approved → verified）。17 Case 全绿 + 全量 e2e 101 回归 + 真机自检。
