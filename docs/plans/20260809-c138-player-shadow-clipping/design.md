# 设计：修复算法播放器右侧面板阴影裁剪

> Status: verified
> Stable ID: C-20260809-138
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；共享检查区已恢复可见绘制
> Replaces: none
> Replaced by: none
> Related plans: C-20260809-137
> Related tests: TC-PLAYER-SHADOW-138-01..02

## 总体方案

保持 C137 的 DOM 和 Grid 分栏不变，只调整 `AlgorithmPlayer.vue` 的共享检查区：桌面 `.inspector-pane` 不再设置 `max-height` 与 `overflow-y: auto`，使其成为可绘制阴影的可见布局容器。代码面板的 `.code` 已经拥有 `max-height`/`overflow: auto`，变量面板在当前规模下直接随内容增长；窄屏继续使用静态、可见的检查区。

## 涉及模块与文件

- 修改 `src/components/player/AlgorithmPlayer.vue`：移除桌面检查区的滚动裁剪属性；保持窄屏规则显式可见。
- 修改 `e2e/dijkstra.e2e.ts`：增加桌面检查区 overflow 与阴影安全边界回归。
- 新增本目录四份 C138 计划文档，并回写三份全局测试索引和路线图。
- 不修改算法 modules、轨 View、`CodePanel.vue` 或 `VariablePanel.vue` 的数据/语义。

## 兼容与回滚

- CSS-only、无数据迁移；回滚 `AlgorithmPlayer.vue` 与新增 e2e 断言即可。
- 代码内部滚动继续由 `.code` 负责；如后续变量规模确实需要滚动，应新增带阴影留白的专用 viewport plan，不在本缺陷中重新引入裁剪父级。

## 测试设计

- L5：在 1440px `/docs/dijkstra` 断言 `.inspector-pane` 两轴 overflow 为 `visible`，代码/变量卡片有至少 1px 的外部绘制空间；保留 C137 桌面双栏和 900px 单列用例。
- L4/L3：复用 C137 现有播放器结构、同步和代码行滚动用例，确保共享 DOM/数据流不变。
- 门禁：`pnpm type-check`、`pnpm format:check`、`pnpm lint:check`、全量 Vitest、全量 Playwright、production/selfhost 构建。

## 风险与替代方案

- 风险：移除外层高度限制后变量区会让页面变长。当前变量轨是有限的步骤变量，页面滚动比裁剪拟物阴影更符合可读性；代码区已有独立滚动上限。
- 放弃方案：给每个面板加负 margin/额外阴影伪元素，会扩大宽度计算并可能造成新的横向溢出，故不采用。
