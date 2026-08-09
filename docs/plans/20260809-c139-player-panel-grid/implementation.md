# 实现记录：算法播放器四面板网格与可视化防重叠

> Status: verified
> Stable ID: C-20260809-139
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；已完成提交、双轨部署与线上复查
> Replaces: none
> Replaced by: none
> Related plans: C-20260809-137, C-20260809-138
> Related tests: TC-PLAYER-GRID-139-01..04

## 当前复现

- 页面：`/docs/binary-answer`，2048×1158。
- `.visual-pane`：575.8125px；`.bars`：660px。
- `.bars` 右边界 1269.90625px；`.code-panel` 左边界 1243.8125px；重叠 26.09375px。
- 根因：固定 `array.length × 60px` 的柱轨在较窄 Grid 列中仍以 `overflow: visible` 居中绘制。

## 实施顺序

1. 新增四面板结构和二分答案几何回归，确认旧实现失败。
2. 调整共享舞台 DOM/CSS，并实现柱轨/箭头百分比槽位。
3. 运行定向 L4/L5、全量门禁和多视口视觉复核。
4. 回写真实改动、红绿证据、部署和遗留问题。

## 最终改动清单

- `AlgorithmPlayer.vue`：桌面改为 `visual/inspector` + `explanation/inspector` 两行两列；说明文字和 Quiz 独立到 explanation 面板；inspector 用 `subgrid` 对齐代码/变量，并保留 C138 的 `overflow: visible` 阴影边界；900px 以下按四面板阅读顺序单列。
- `BarsView.vue` / `AuxView.vue`：轨道宽度使用 `min(固有宽度, 父宽)`，每槽按元素数分配百分比宽度，箭头传入 `slotCount`。
- `ArrowTrack.vue`：新增可选百分比槽位定位；未传 `slotCount` 时继续使用原像素 `slotWidth`。
- `Bar.vue`：极窄槽位内柱体允许收窄，避免越出槽位。
- L4/L5：新增 C139 四个回归用例，覆盖结构、槽位、1440px 几何边界和 900px 单列顺序。

## 与设计的偏差

无。为覆盖合并排序的 auxiliary 柱轨，实际实现将同一响应式槽位策略 additive 扩展到 `AuxView`，不改变既有调用接口。

## 红绿与门禁验证记录

- 红灯（旧实现）：L4 结构用例因不存在 `.explanation-pane` 失败；L5 1440px 几何用例测得旧柱轨右边界 965.90625px、代码左边界 939.8125px，重叠 26.09375px。
- 定向绿灯：相关 4 个组件 spec 共 93/93 通过；二分答案、Dijkstra、合并排序、Top-down merge 四条 L5 回归共 10/10 通过。
- 全量绿灯：303 个 Vitest 文件 / 2163 条用例通过；125 条 Playwright 用例通过；`pnpm format:check`、`pnpm lint:check`、`pnpm type-check`、`pnpm build-only` 通过；production 190 页预渲染与 SEO 校验通过；selfhost 190 页构建与 SEO 校验通过。
- 真浏览器复核：1440px、1200px 双列无重叠，visual/code 与 explanation/vars 各自对齐；900px 顺序为 visual → explanation → code → vars，页面无横向溢出；合并排序的主/aux 柱轨均被视觉面板完整容纳。

## 部署与回滚

- 功能提交：`6547802`，已推送 `main`。
- 自有域：`./scripts/deploy.sh` 已完成 selfhost 190 页构建、上传和远程原子切换，旧版本保留在 `/var/www/algorithms/dist.old`。
- GitHub Pages：代码提交对应 workflow run `31309597186` success；build 与 Deploy job 均完成。
- 线上复查：两个 `/docs/binary-answer/` 入口均返回 HTTP 200；1440px 下均为 11 柱、柱轨到代码面板间距 28px、两行左右面板高度完全一致且页面横溢出为 0；900px 下均按 visual → explanation → code → vars 排列且横溢出为 0。
- 回滚：纯共享 CSS/轨道与测试变更，无数据迁移；按功能提交回退即可。
