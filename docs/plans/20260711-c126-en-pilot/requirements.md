# 需求：`/en` 十页多语言试点

> Status: verified
> Stable ID: C-20260711-126
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 进入 C127 内容生成与半自动分发
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-124、C-20260710-129
> Related tests: TC-I18N-REGISTRY-126-_、TC-I18N-MODULE-126-_、TC-SEO-I18N-126-_、TC-I18N-UI-126-_、TC-I18N-BUILD-126-_、TC-E2E-I18N-126-_

## 背景

C124 已建立 95 页中文 SEO/GEO 地基，C129 明确当前不承担第三方分析成本。增长主线下一步是用可控范围验证英文内容是否值得继续投入，而不是一次性翻译 92 个条目。

本计划交付一个可独立访问、可预渲染、可被搜索发现的 `/en` 十页试点。试点必须是真正的英文阅读与交互体验，不能只翻译标题和导航后继续展示中文正文、播放器字幕或代码注释。

## 要做什么

首批固定十页：

| 页面           | 中文 URL               | 英文 URL                  |
| -------------- | ---------------------- | ------------------------- |
| Home           | `/`                    | `/en/`                    |
| Complexity     | `/docs/complexity/`    | `/en/docs/complexity/`    |
| Learning Paths | `/docs/paths/`         | `/en/docs/paths/`         |
| Quick Sort     | `/docs/quick-sort/`    | `/en/docs/quick-sort/`    |
| Binary Search  | `/docs/binary-search/` | `/en/docs/binary-search/` |
| Dijkstra       | `/docs/dijkstra/`      | `/en/docs/dijkstra/`      |
| 0/1 Knapsack   | `/docs/knapsack/`      | `/en/docs/knapsack/`      |
| KMP            | `/docs/kmp/`           | `/en/docs/kmp/`           |
| Fenwick Tree   | `/docs/fenwick/`       | `/en/docs/fenwick/`       |
| Convex Hull    | `/docs/convex-hull/`   | `/en/docs/convex-hull/`   |

- 提供英文首页、英文 Docs 菜单、英文搜索索引和明确的中英切换入口。
- 英文算法页复用现有 oracle、步骤结构、可视化轨和四语言源码，只本地化可见文案。
- Header、搜索、播放器控制、输入校验、测验和 KMP 状态等共享界面随路由语言切换。
- C124 registry、route head、JSON-LD、预渲染、manifest、sitemap 与 llms 扩展到 105 页。
- 十组页面各自自指 canonical，并生成完整、双向的 `zh-CN` / `en` / `x-default` HTML alternate 集合。

## 不做什么

- 不翻译其余 85 个中文索引页，不在未翻译页面上声明不存在的英文 alternate。
- 不做浏览器语言、IP 或地区自动重定向；语言由 URL 和用户显式选择决定。
- 不引入 CMS、服务端渲染、后端接口或第三方翻译服务。
- 不复制或改写七个算法 oracle，不改变中文步骤、输入、测验和最终结果。
- 不在本期接入统计、付费服务或自动发帖。

## 业务规则

- `/en` 首页只宣称并展示本次试点内容，不得写成“92 个条目已全量英文”。
- 已成对页面切换语言时进入对应页面并保留安全 query；未翻译中文页切换英文时明确回退到 `/en/`。
- 英文页面的可见正文、导航、搜索、播放器字幕/变量/题卡、输入错误与源码注释不得残留中文。
- 中文 95 页的 URL、内容、route name 和交互行为保持兼容。
- 英文与中文页面均使用自身语言 URL 作为 canonical；不得把英文页 canonical 到中文页。

## 边界与异常

- `/en/docs` 是布局路由，不进入索引，直接访问使用 `noindex` fallback。
- query 不进入 canonical；快速排序从中英切换时保留合法 `?input=`。
- 若 route name 不在十组映射中，语言切换只回到目标语言首页，不猜测不存在的翻译路径。
- English source adapter 只改注释和展示文案，`lineMap`、代码行数与执行点必须保持一致。

## 验收口径

- [x] 十个英文路由可直接访问并从英文首页或菜单到达。
- [x] 英文页面可见文本无中文残留，七个播放器与中文版本步骤结构、轨快照和最终状态一致。
- [x] 语言切换、英文搜索、英文菜单高亮和 quick-sort query 保留行为通过 L3/L4/L5。
- [x] registry 共 105 页，其中 `zh-CN` 95 页、`en` 10 页；十组 alternate 双向且完整。
- [x] production/selfhost 均生成并验证 105 个目录静态入口、sitemap、llms 和 manifest。
- [x] `pnpm verify`、coverage、全量 Playwright、双 base 构建与桌面/900px 窄视口视觉检查通过。
- [x] 两次精确提交与 push 完成；功能版本已双轨部署，两域英文首页与两个英文深链均为 200。

## 开放问题

无阻塞问题。若试点产生持续英文自然流量，再另立计划评估完整 i18n 框架和下一批页面；本期不提前建设全量翻译平台。

## 变更历史

- 2026-07-11：批准十页范围、`/en/docs/*` URL、自指 canonical、显式切换和未翻译页首页回退规则。
- 2026-07-11：十页内容、共享界面、105 页 SEO 产物、全门禁与双轨上线核验完成，状态转 verified。
