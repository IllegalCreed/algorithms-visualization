# 实现记录：算法播放器可视化与代码同屏布局

> Status: in-progress
> Stable ID: C-20260809-137
> Type: feature
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 10%
> Blocked by: none
> Next action: 完成共享组件实现并运行门禁
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006, C-20260705-116
> Related tests: TC-PLAYER-LAYOUT-137-01..05

## 实施顺序

1. 在 `AlgorithmPlayer.spec.ts` 和 Dijkstra L5 用例加入会在旧 DOM/CSS 上失败的布局断言。
2. 调整 `AlgorithmPlayer` 舞台层级和响应式 Grid；调整 `Article` 播放器页宽度。
3. 给 `CodePanel` 增加当前执行行的容器内滚动。
4. 运行定向 Vitest，再运行格式、lint、type-check、全量 Vitest；用 Playwright 在 1440px、1200px、900px 复核尺寸和滚动。
5. 回写本记录、四文档状态、roadmap（若需要）及三份测试索引。

## 变更清单

待实现。

## 红绿证据

待补：先记录旧实现下的失败用例，再记录实现后的定向/全量结果。

## 回滚

纯前端结构和 CSS 变更，无数据迁移；回滚 `AlgorithmPlayer.vue`、`CodePanel.vue`、`Article.vue` 及对应测试即可。
