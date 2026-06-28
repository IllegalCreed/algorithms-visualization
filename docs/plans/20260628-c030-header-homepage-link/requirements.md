# 需求：头部「个人主页」外链

> Status: verified
> Stable ID: C-20260628-030
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-28
> Last reviewed: 2026-06-28
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260622-009（在其「头部分享/仓库按钮」基础上**新增一类外链**，未推翻其行为，故 C-009 不标 superseded）
> Related tests: 新增 `TC-SHARE-07`（HOME_PAGE_URL 常量）、`TC-HOOK-05-4`（个人主页项 url）；更新 `TC-HOOK-05-1`、`TC-VIEW-HEADER-06`（数量 3→4）
> Related requirement: —

## 背景

全局 `Header` 右上角现有三个新拟物圆形外链（C-009）：分享到微博、分享到 X、GitHub 仓库。数据由 `src/views/Master/Header/hooks.ts` 的 `useIconLink()` 提供，点击行为是 `IconLink.vue` 的 `window.open(props.data.url)`。

Owner 希望再加**第四个**——「个人主页」，指向作者个人主页 `https://illegalscreed.cn/zh/`。

## 要做什么

1. `share.ts` 新增常量 `HOME_PAGE_URL = 'https://illegalscreed.cn/zh/'`（与 `GITHUB_REPO_URL` 并列，静态地址）。
2. `useIconLink()` 返回数组**末尾追加**一项 `{ title: '个人主页', src: homepageIcon, url: HOME_PAGE_URL }`。
3. 新增图标 `src/assets/homepage.svg`（单色人像剪影）。
4. 测试与三索引回写。

## 不做什么（边界）

- 不改 `IconLink.vue` 点击模型（仍 `window.open(url)`）；微博/X/GitHub 三项零改动。
- 不为本项单独引入 `rel=noopener`（沿用既有 `window.open` 模式，详见 design 的「安全」）。
- 不改 Header 布局 / 样式 / 其余三项顺序。
- 个人主页地址为**静态常量**，不做任何动态拼接（无用户输入、无注入面）。

## 业务规则 / 约束

- 图标为单色剪影，与现有微博/X/GitHub 图标视觉一致（黑色 path、圆形新拟物按钮内 30px）。
- 位置放 **GitHub 之后**：与 GitHub 同属「作者 / 项目导向」外链（区别于「分享当前页」的微博/X），且不破坏既有 `[weibo, x, github]` 解构断言（TC-HOOK-05-3）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；行为变化遵循 TDD（先改/写用例见失败，再改实现，再验证）。
- 提交直接落 `main`，信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

## 验收口径

- [x] 分享区渲染 **4 项**，末项 hover 文案「个人主页」。
- [x] 点击「个人主页」新标签打开 `https://illegalscreed.cn/zh/`。
- [x] `TC-SHARE-07` / `TC-HOOK-05-4` 新增通过；`TC-HOOK-05-1` / `TC-VIEW-HEADER-06` 按 4 项更新后通过；其余 Header 用例零回归。
- [x] lint / format / type-check / build 四门禁绿；全量单测 663 passed。
- [x] `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md` 回写。

## 变更历史

- 2026-06-28：创建并完成。在 C-009 三外链基础上新增「个人主页」第四项（2 新 + 2 改用例，TDD），与 C-009 双向链接（C-009 行为未变，不 superseded）。
