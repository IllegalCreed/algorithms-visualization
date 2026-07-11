# 需求：中文侧边栏补齐学习工具

> Status: verified
> Stable ID: C-20260711-132
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 恢复 C127 T3-C；真实 smoke 仍等待固定 campaign 明确授权
> Replaces: none
> Replaced by: none
> Related plans: C-20260705-114、C-20260705-115、C-20260709-119、C-20260711-131
> Related tests: TC-MENU-TOOLS-132-01..04、TC-E2E-MENU-TOOLS-132-01

## 缺陷背景

中文 `/docs/*` 侧边栏只有九个学习分类，没有展示已经存在的 `/docs/complexity` 与 `/docs/paths`。英文侧边栏则在首组 `Learning Tools` 中展示对应两项，造成中英文导航能力不一致。

两个中文页面、命名路由、SEO registry 和语言切换关系均已存在，缺陷仅位于中文菜单数据没有接入工具页。既有 `TC-I18N-UI-131-08` 通过跳过英文首组掩盖了该差异。

## 功能需求

1. 中文侧边栏首组新增“学习工具”。
2. 组内按“算法复杂度速查”“算法学习路径”顺序展示，分别导航到命名路由 `complexity`、`paths`。
3. 当前位于两个工具页时，对应菜单项正常高亮。
4. 中文与英文侧边栏均为 10 组、94 个非 Home 页面，并保持每组条目顺序一一对应。
5. 中文首页仍只展示九类、92 个学习条目，不把工具页伪装成算法卡片。

## 非目标

- 不新增页面、路由、SEO URL、首页卡片或第三语言。
- 不修改复杂度速查和学习路径正文。
- 不改变 95 组中英页面对、190 个静态入口或播放器行为。

## 验收口径

- [x] 中文侧边栏首组显示“学习工具”及两个可点击入口。
- [x] `/docs/complexity` 与 `/docs/paths` 对应项可高亮并可真机导航。
- [x] 中文、英文菜单各 10 组 / 94 项，规范化 route name 后逐组同序。
- [x] 首页仍为九类 / 92 项，菜单额外两项均有同名 `/docs/*` 路由。
- [x] L3/L4/L5、全门禁与桌面/窄视口视觉检查通过。

## 变更历史

- 2026-07-11：Owner 发现英文 `Learning Tools` 在中文版侧边栏缺失，建立 C132 缺陷修复。
- 2026-07-11：按先红后绿补齐中文工具组；全门禁、coverage、118 条 L5 与 720/900/1440 视觉验证通过，状态转 verified。
