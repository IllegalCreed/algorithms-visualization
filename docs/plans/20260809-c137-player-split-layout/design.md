# 设计：算法播放器可视化与代码同屏布局

> Status: in-progress
> Stable ID: C-20260809-137
> Type: feature
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 10%
> Blocked by: none
> Next action: L4 失败用例
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006, C-20260705-116
> Related tests: TC-PLAYER-LAYOUT-137-01..05

## 方案概览

保留 `AlgorithmPlayer` 的轨道条件渲染和 `current` 数据流，只调整外壳层级：输入条与控制条占全宽；中间新增 `.player-stage`，其中 `.visual-pane` 承载所有可视化、字幕和测验，`.inspector-pane` 承载 `CodePanel` 与 `VariablePanel`。桌面使用 CSS Grid，窄屏切回单列。

`Article` 增加一个共享的 `:has(.algo-player)` 宽度规则：仅包含播放器的文章自动使用右侧可用空间（上限 1080px），普通知识页仍保持 720px 阅读宽度，因此无需编辑每个算法页。

## 关键布局

- `.player-stage`: `minmax(0, 1fr) minmax(300px, 0.82fr)`；两列之间 16px 间距。
- `.inspector-pane`: `position: sticky`，在正文滚动时保持代码/变量可见；内部最大高度随视口限制并允许滚动。
- `CodePanel .code`: 增加垂直滚动上限；`point` 变化后滚动到当前行（`block: nearest`），不抢页面滚动。
- `VariablePanel`: 变量过多时限制自身高度并滚动，避免把代码推到视口外。
- 约 1180px 以下（包含左侧 300px 目录后的窄桌面）切回纵向；900px L5 用例检查不横向溢出。

## 涉及文件

- `src/components/article/Article.vue`：播放器页共享宽度规则。
- `src/components/player/AlgorithmPlayer.vue`：新增舞台、视觉区、检查区层级及响应式样式。
- `src/components/player/CodePanel.vue`：高亮行自动滚动和代码区高度约束。
- `src/components/player/AlgorithmPlayer.spec.ts`：L4 外壳结构回归。
- `e2e/dijkstra.e2e.ts`：L5 桌面同屏、900px 堆叠/无横溢出回归。
- `docs/test-cases/*` 与本目录四文档：测试事实和实现记录。

## 保持不变与风险控制

- 不改变 Step/AlgorithmModule 类型，不移动任何可视化轨的条件判断语义。
- `:has` 只用于样式选择，不改变 SSR 内容；若构建目标不接受该选择器，则改为 `Article` 的显式 `wide` class 方案。
- sticky 元素只在右侧滚动容器内生效；窄屏取消 sticky 和内部高度限制。
