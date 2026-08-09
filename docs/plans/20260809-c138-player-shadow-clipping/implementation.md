# 实现记录：修复算法播放器右侧面板阴影裁剪

> Status: verified
> Stable ID: C-20260809-138
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；C138 已提交、推送并完成双轨部署
> Replaces: none
> Replaced by: none
> Related plans: C-20260809-137
> Related tests: TC-PLAYER-SHADOW-138-01..02

## 根因与最小修复

本地 2048×1158 真浏览器测量显示旧 `.inspector-pane` 的计算样式为 `overflow: auto`、`overflow-x: auto`、`overflow-y: auto`，其边界与 `.code-panel`/`.var-panel` 完全重合；这正是截图中外阴影被裁掉的共享父级。

修复只改共享外壳：移除桌面检查区的 `max-height` 与 `overflow-y: auto`，显式设置 `overflow: visible`。代码长行仍由 `.code` 自己滚动，变量区仍保留现有有限高度行为；窄屏原本的 `overflow: visible` 规则继续生效。

## 改动清单

已实现：

- `src/components/player/AlgorithmPlayer.vue`：移除桌面检查区的滚动裁剪。
- `e2e/dijkstra.e2e.ts`：新增 C138 失败复现与通过断言。
- C138 计划、全局 Case 索引、roadmap 与自测记录。

## 红绿证据

- 红灯：恢复旧 `overflow-y: auto` 后，`TC-PLAYER-SHADOW-138-01` 收到 `overflowX/overflowY = auto`，与期望 `visible/visible` 不一致。
- 绿灯：C138 两个 L5 用例与 C137 桌面布局用例 3/3 通过；全量 Playwright 123/123、Vitest 303 文件 / 2160 用例通过。
- 门禁：`pnpm format:check`、`pnpm lint:check`、`pnpm type-check`、`pnpm build-only` 均通过；production 预渲染与 SEO 验证 190 页通过；selfhost 构建与 SEO 验证 190 页通过。
- 真实浏览器：2048px/1440px 截图中代码面板四周外阴影完整；1440px 仍双栏，900px 仍单列且无横向溢出。

## 部署

- 功能提交：`1190cda`，已推送 `main`。
- GitHub Pages：run `31296824236` success，build 190 页并完成 Pages 发布。
- 自有域：`./scripts/deploy.sh` 成功完成 selfhost 190 页构建、上传和远程原子切换；旧版本保留在 `/var/www/algorithms/dist.old`。
- 线上复查：`https://algo.illegalscreed.cn/docs/dijkstra/` 与 `https://illegalcreed.github.io/algorithms-visualization/docs/dijkstra/` 均返回 HTTP 200。

## 回滚

纯 CSS 与测试变更，无数据迁移；按文件回退即可。
