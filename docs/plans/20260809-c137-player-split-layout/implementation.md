# 实现记录：算法播放器可视化与代码同屏布局

> Status: verified
> Stable ID: C-20260809-137
> Type: feature
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；C137 已提交、推送并完成双轨部署
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

- `AlgorithmPlayer` 新增 `.player-stage`、`.visual-pane`、`.inspector-pane`，桌面 Grid 双栏，1179px 以下自动单列；代码/变量仍由同一个 `current` 驱动。
- `Article` 通过 `.article:has(.algo-player)` 只放宽播放器页，上限 1080px，77 个算法页面无需逐页改模板。
- `CodePanel` 给代码行增加 `data-line`，步骤变化后在代码容器内滚动当前执行行；代码区支持垂直/水平滚动。
- 新增 L4 外壳与代码行回归，以及 Dijkstra 1440px/900px L5 布局用例。

## 红绿证据

红灯：旧实现执行新增 L4 用例时，`.player-stage` 不存在、代码行没有 `data-line`，共 2 个定向断言失败。

绿灯：定向 3 文件/65 用例、全量 303 文件/2160 用例、Playwright 121/121 全绿；production `build-only` 与 selfhost build 均完成 190 页 SEO 门禁。真实浏览器测量：1440px 文章 1080px、Grid 两列 575.812px/472.188px；1200px 文章 860px、两列 454.938px/373.062px；900px 单列且文档滚动宽度等于视口。

部署：提交 `e2ca1a3` 已推送；GitHub Pages run `31295217255` success（head SHA 与提交一致）；`./scripts/deploy.sh` 完成自有域原子切换；两个 Dijkstra 目标 URL 均 HTTP 200 且预渲染 HTML 含三个布局容器。

## 回滚

纯前端结构和 CSS 变更，无数据迁移；回滚 `AlgorithmPlayer.vue`、`CodePanel.vue`、`Article.vue` 及对应测试即可。
