# 设计：算法播放器四面板网格与可视化防重叠

> Status: verified
> Stable ID: C-20260809-139
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；设计已按实现与线上复核闭环
> Replaces: none
> Replaced by: none
> Related plans: C-20260809-137, C-20260809-138
> Related tests: TC-PLAYER-GRID-139-01..04

## 总体方案

保持 `AlgorithmPlayer` 的数据流和条件轨渲染不变，把舞台改成共享两行两列 Grid：`.visual-pane` 与代码面板在第一行，新增 `.explanation-pane` 与变量面板在第二行。`.inspector-pane` 继续作为语义和阴影边界，桌面使用 CSS `subgrid` 让右侧两面板与左侧两行对齐；窄屏恢复普通两行并整体落到视觉/说明之后。

视觉面板本身提供带内边距的横向滚动边界，固定宽度轨只能在该面板内滚动。`BarsView` 进一步采用响应式槽位：整轨宽度为 `min(100%, count × preferredSlotWidth)`，每根柱占整轨的 `1 / count`；`ArrowTrack` 新增可选 `slotCount`，以百分比位移保持指针和柱槽严格对齐。原有像素 `slotWidth` 路径继续供其他调用方使用。

## 涉及模块与文件

- `src/components/player/AlgorithmPlayer.vue`：拆出说明面板，定义四面板网格、subgrid 与窄屏顺序。
- `src/components/BarsView.vue`：主柱轨最大宽度受父面板约束，按元素数分配百分比槽位。
- `src/components/AuxView.vue`：辅助柱轨沿用相同的父宽约束与百分比槽位，避免合并排序页面出现同类侵入。
- `src/components/ArrowTrack.vue`：增加可选百分比槽位定位，保留旧像素定位兼容。
- `src/components/Bar.vue`：柱体在极窄槽位中允许收窄，不越出自身槽位。
- `src/components/player/AlgorithmPlayer.spec.ts`、`src/components/BarsView.spec.ts`、`src/components/ArrowTrack.spec.ts`：L4 结构与槽位回归。
- `e2e/binary-answer.e2e.ts`：L5 几何不重叠与响应式顺序回归。

## 布局规则

- 桌面：`grid-template-areas: "visual inspector" "explanation inspector"`；inspector 跨两行并用 `grid-template-rows: subgrid` 对齐 code/vars。
- 窄屏：`"visual" "explanation" "inspector"`；inspector 内部再按 code/vars 两行排列。
- 可视化、说明、代码、变量均保持独立圆角面板；外阴影由舞台可见 overflow 保留。
- 可视化面板只在自身内部处理横向超宽内容。

## 兼容与回滚

- 无接口、数据、路由与存储变化；旧 `slotWidth` 定位仍是默认兼容路径。
- 不支持 subgrid 的浏览器仍由 inspector 的普通两行 Grid 呈现，只是不保证左右行高完全同步。
- 回滚共享四个组件和 C139 测试即可。

## 测试设计

- L4：字幕迁入 `.explanation-pane`，四种信息仍由同一 `current` 驱动。
- L4：`BarsView` 轨宽使用父宽上限；`ArrowTrack(slotCount)` 使用等比例槽宽和位移。
- L5：1440px 二分答案 11 柱全部位于代码面板左侧；四面板形成两行两列。
- L5：900px 四面板单列且无页面级横向溢出。
- 门禁：格式、lint、type-check、全量 Vitest、全量 Playwright、production/selfhost 190 页构建。

## 实现确认

实际实现同时覆盖 `AuxView` 与 `Bar` 的窄槽收缩；原有 `ArrowTrack` 像素定位调用方保持兼容，只有传入 `slotCount` 的柱轨使用百分比槽位。C138 的 `overflow: visible` 阴影边界继续保留。

## 风险与替代方案

- 风险：极窄双栏中柱体会变细。仍保留数值和状态色；比水平侵入代码面板更可读。
- 放弃方案：仅给视觉列 `overflow: hidden` 会直接裁掉首尾柱；仅提高代码 z-index 只会遮住缺陷；固定扩大左列会严重压缩代码并在 1200px 再次溢出。
