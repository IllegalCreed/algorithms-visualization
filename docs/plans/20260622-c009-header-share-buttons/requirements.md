# 需求：头部分享/仓库按钮（微博 / X / GitHub）

> Status: draft
> Stable ID: C-20260622-009
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-22
> Last reviewed: 2026-06-22
> Progress: 0%
> Blocked by: none
> Next action: 写 implementation.md（TDD 任务分解）后开始实现
> Replaces: none
> Replaced by: none
> Related plans: none（独立小功能，不依赖播放器框架）
> Related tests: 计划新增 `TC-SHARE-*`（L3 纯函数）；**更新** `TC-HOOK-05-*`（行为变化）；`TC-VIEW-ICONLINK-*` 不改、作为零回归验证
> Related requirement: —

## 背景

全局 `Header` 右上角有三个新拟物圆形按钮，数据由 `src/views/Master/Header/hooks.ts` 的 `useIconLink()` 提供，点击行为在 `src/views/Master/Header/IconLink/IconLink.vue` 里是 `window.open(props.data.url)`。

现状是**三个按钮都只是占位**：

| 按钮     | 当前 url                  | 当前行为                         |
| -------- | ------------------------- | -------------------------------- |
| github   | `https://www.github.com`  | 打开 GitHub 首页（非本项目仓库） |
| twitter  | `https://www.twitter.com` | 打开 Twitter 首页（不是分享）    |
| 新浪微博 | `https://www.weibo.com`   | 打开微博首页（不是分享）         |

用户期望这三个按钮**各司其职**：

1. **GitHub** —— 打开本项目的 GitHub 仓库；
2. **X（原 Twitter）** —— 把当前网站「分享到 X」（跳转 X 的分享页，预填链接 + 文案）；
3. **微博** —— 把当前网站「分享到微博」（跳转微博分享页，预填链接 + 文案）。

「分享」与「打开仓库」是两种不同行为：GitHub 是跳转**固定**仓库地址；微博/X 是带上**当前站点链接 + 文案**去拼对应平台的分享 intent URL。

## 要做什么

1. **GitHub 按钮**：固定打开 `https://github.com/IllegalCreed/algorithms-visualization`（取自 git remote origin）。
2. **微博 / X 按钮**：拼对应平台的分享 intent URL，分享链接 = **线上自有域名 + 当前路由 path**，并附统一文案。
   - 微博：`https://service.weibo.com/share/share.php?url=<链接>&title=<文案>`
   - X：`https://twitter.com/intent/tweet?url=<链接>&text=<文案>`
3. **抽纯函数模块** `src/views/Master/Header/share.ts`：集中放常量（线上域名、仓库地址、分享文案）与 3 个构造 URL 的纯函数，便于 L3 单测。
4. **`useIconLink()` 改为响应式**：依赖 `useRoute().fullPath`，用 `computed` 在导航后实时重算微博/X 的分享 url（GitHub 项恒定）。
5. **测试与文档**：新增 L3 纯函数用例、更新 hooks 用例、保持 IconLink 组件用例零回归；回写 `docs/plans/index.md` 与 `docs/test-cases/{index,by-layer,by-module}.md`。

## 不做什么（边界）

- **不改 `IconLink.vue` 的点击模型**：仍是 `window.open(props.data.url)` 单参数调用。变的只是「url 从哪来」，组件本身零改动 → `TC-VIEW-ICONLINK-*` 保持绿。
- **不改图标资源**：X 沿用已有的 `twitter.svg`（不新增 `x.svg`）。
- **不引入其它分享方式**：不做 Web Share API、复制链接、二维码、更多平台（微信/QQ 等）。YAGNI。
- **不改路由 / 部署结构**：沿用现有 base / Pages / 自有域名方案。
- **不引入新依赖**：用浏览器内置 `URLSearchParams` 编码。
- **不改 Header 的视觉外观**：仍是三个新拟物圆按钮，仅顺序、hover 提示文案、点击目标变化。

## 业务规则 / 约束

- **分享链接域名固定为线上自有域名** `https://algo.illegalscreed.cn`（该站 `--mode selfhost` 构建，`VITE_BASE_URL=/`，根路径部署）。
- **用 vue-router 的 `route.fullPath`（不含 base）拼接**：保证无论用户在 localhost(`/`) / GitHub Pages(`/algorithms-visualization/`) / 自有域名(`/`) 哪个环境浏览，分享出去的都是规范的线上 URL（`https://algo.illegalscreed.cn` + 纯路由路径），不会把 `localhost` 或 `/algorithms-visualization/` 前缀泄漏出去。
- **URL 参数一律经 `URLSearchParams` 编码**：分享链接、中文文案、`&` 等特殊字符安全转义。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 缺陷修复 / 行为变化遵循测试规范：**先写/改能反映新行为的用例，再改实现，再验证通过**。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

## 验收口径

- [ ] **GitHub** 按钮新标签打开 `https://github.com/IllegalCreed/algorithms-visualization`。
- [ ] 在任意算法页点 **微博 / X**，跳到对应平台分享页，预填链接 = `https://algo.illegalscreed.cn` + 当前页 `fullPath`、预填统一文案。
- [ ] 先停在 A 算法页分享得到 A 的链接；导航到 B 算法页再分享，链接随当前页变为 B（验证 `computed` 响应式）。
- [ ] hover 提示文案明确表达行为（`分享到微博` / `分享到 X` / `GitHub 仓库`）。
- [ ] L3 `TC-SHARE-*` 全绿；`TC-HOOK-05-*` 按新行为更新后通过；`TC-VIEW-ICONLINK-*` **零回归**。
- [ ] 覆盖率达门槛；lint / format / type-check 三门禁绿。
- [ ] `docs/plans/index.md` 与 `docs/test-cases/` 三索引均回写。

## 开放问题

- **分享文案最终措辞**：暂定 `算法可视化 —— 交互式数据结构与算法可视化`（brainstorming 已选「标题 + 一句简介」方向，具体措辞实现期可微调）。
- **X 分享域名**：用 `twitter.com/intent/tweet`（与 `x.com/intent/tweet` 等价，前者兼容性更稳）。

## 变更历史

- 2026-06-22：创建。brainstorming 确认两项决策——① 分享链接 = **当前路由 path + 线上域名**（非首页、非 `window.location.href`，规避 localhost/Pages 前缀泄漏）；② 分享文案 = **标题 + 一句简介**。
