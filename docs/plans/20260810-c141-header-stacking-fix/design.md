# 设计：修复固定 Header 的图层遮挡

> Status: verified
> Stable ID: C-20260810-141
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察真实 Safari/触控设备的固定壳表现
> Replaces: none
> Replaced by: none
> Related plans: C-20260810-140, C-20260809-139, C-20260809-138
> Related tests: TC-HEADER-141-01

## 方案

在共享 `Header.vue` 的 `#header` 上设置 `z-index: 1000`。该值高于文章中普通 `positioned` 内容及其 `z-index: 1/3` 装饰层，同时低于已有模态层：consent 1200、Docs 抽屉 1300、首页 Sheet 1301、搜索 1400。这样只修复固定壳与滚动内容的绘制顺序，不引入新的 stacking context 或改变交互层级。

## 回归策略

E2E 先在移除层级的基线行为上确认 `elementFromPoint` 命中 `.tag`，再验证修复后命中 Header；整组移动端用例继续覆盖抽屉、搜索、播放器、路由焦点和横向溢出。单测、production/selfhost 构建与双域 smoke 作为发布门禁。

## 设计边界

真实 iOS safe-area、短视高搜索面板和 44px Header 控件不属于本次层叠缺陷；继续作为后续维护项观察，不在本修复中扩大改动面。
