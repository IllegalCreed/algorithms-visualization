# 设计：`/en` 十页多语言试点

> Status: verified
> Stable ID: C-20260711-126
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 评审 C130 英文目录扩展到 30 页
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-124、C-20260710-129、C-20260711-130
> Related tests: TC-I18N-REGISTRY-126-_、TC-I18N-MODULE-126-_、TC-SEO-I18N-126-_、TC-I18N-UI-126-_、TC-I18N-BUILD-126-_、TC-E2E-I18N-126-_
> Related requirement: requirements.md

## 总体方案

采用“URL 前缀 + typed pilot registry + 小型 route-aware copy”而不是引入完整 i18n 运行时。原因是试点仅十页、无服务端语言协商，当前最重要的是把页面对、SEO 和英文可见文本做实；新增依赖会扩大维护面，却不能替代正文翻译。

`src/i18n/pilot.ts` 作为十组页面、英文标题/描述/分类和中英 route 映射的单一事实源。路由、Header、菜单、搜索、SEO 与测试均从该 registry 派生，不各自维护十份 slug 表。

## 路由与语言状态

- 保留现有 `/` 与 `/docs/*` 中文路由。
- 新增 `/en` 首页和 `/en/docs` 布局；九个英文内容页位于 `/en/docs/*`。
- 英文 route name 使用 `en-*`，避免与中文菜单高亮和 SEO name 冲突。
- `useSiteLocale()` 只根据当前 route path 判定语言，并从 registry 计算首页、语言切换目标与 fallback。
- 不自动读取 `navigator.language`，不做自动跳转；Header 中提供 `ZH / EN` 分段切换。

## 页面与共享界面

- 英文首页复用现有 Category/Item 视觉组件，只呈现十页试点，不伪装成全量英文站。
- Docs/Menu 根据 route locale 在中文 92 条与英文 9 条之间切换；Item 继续使用 route name。
- SearchPalette 中文沿用 92 条索引，英文只索引 9 个内容页，并本地化 dialog、空态和快捷入口。
- Header 本地化站名、首页/搜索/分享辅助文案；语言切换保留成对页面 query，未成对页面回退目标首页。
- AlgorithmPlayer 新增默认 `zh-CN` 的可选 locale prop，向 InputBar、QuizCard、TransportControls 与 KmpView 传递；中文消费者零改动。

## 算法本地化

新增英文模块适配层，调用原模块 `buildSteps()` 后只替换以下展示字段：

- `module.title`、`inputSpec.hint`；
- `Step.caption`、`vars`、`quiz`；
- 四语言源码中的中文注释。

数组、pointer、emphasis、point、所有可视化轨、source `lineMap` 和步骤数量原样保留。七个适配器按执行点和轨快照生成英文字幕，避免用脆弱的全文字符串替换解析算法状态。

## SEO/GEO

- `SeoPage` 增加 locale 与 alternates；英文十页加入 registry，总量 105。
- 十组页面各自使用 self-canonical；成对页面的 `<head>` 都输出相同的 `zh-CN`、`en`、`x-default` 三项，并包含自身。
- 未翻译中文页不输出英文 alternate；SPA 导航到此类页面时清理旧 alternate 节点。
- JSON-LD、breadcrumb、Open Graph locale/site name 按页面语言生成。
- 预渲染从中文首页发现 92 条、从英文首页发现 9 条，连同两组 Home 生成 105 个静态入口。
- sitemap 继续列出全部 canonical URL；HTML alternate 是本期唯一 `hreflang` 声明机制，避免维护两套等价映射。llms 分成中文全量与 English pilot 两节。

Google Search Central 要求每个语言版本列出自身与所有其他版本、使用绝对 URL 且映射双向；canonical 应指向同语言版本。官方同时说明 HTML、HTTP header、sitemap 三种 alternate 方法等价，没有必要重复维护。本设计因此选择预渲染 HTML head 作为唯一 alternate 载体：

- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Canonical best practices](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Managing multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

## 测试设计

- L3：pilot registry/route pair/fallback、七个英文算法适配器、105 页 SEO/JSON-LD。
- L4：route head alternate 清理、Header 切换、英文 SearchPalette、播放器共享文案。
- build：105 页 manifest、静态入口、base、无中文正文、sitemap/llms。
- L5：英文深链、语言切换、搜索、播放器、query、head 与窄视口不重叠。

## 风险与替代方案

- **中文残留**：构建 verifier 对所有英文页面的 `#app` 可见文本做 Han 字符门禁，算法 adapter 另有 L3 检查。
- **映射漂移**：页面对、route name、path 与 SEO alternate 均由 registry 唯一性测试锁定。
- **共享 UI 回归**：locale prop 默认中文；未传时快照和交互保持现状。
- **未来扩容成本**：若试点扩到数十页，再评估 vue-i18n 与内容文件拆分；当前 adapter API 可作为迁移输入，不提前抽象全站翻译平台。

## 变更历史

- 2026-07-11：设计批准；选择 typed registry、显式语言切换、HTML-only hreflang 与英文模块展示适配。
- 2026-07-11：实现与设计一致；构建 verifier 促使共享 StackView 一并完成英文静态标签适配。
