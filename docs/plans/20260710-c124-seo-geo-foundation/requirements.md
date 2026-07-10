# 需求：SEO/GEO 技术地基重建

> Status: verified
> Stable ID: C-20260710-124
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Progress: 100%
> Blocked by: none
> Next action: Owner 提交 Search Console/Bing sitemap；工程侧下一阶段为 C126 `/en` 十页试点
> Replaces: C-20260629-034
> Replaced by: none
> Related plans: C-20260710-123、C-20260705-117、C-20260705-118、C-20260709-119、C-20260709-121、C-20260709-122
> Related tests: TC-SEO-PAGES-124-_、TC-GEO-JSONLD-124-_、TC-SEO-HEAD-124-_、TC-SEO-ROBOTS-124-_、TC-SEO-PRERENDER-124-_、TC-E2E-SEO-124-_

## 背景

C-117/C-118 已提供默认 meta、OG 图、robots、静态 sitemap、简版 llms.txt 与发布物料，但当前 `index.html` 仍是 `lang="en"`，所有路由共用一套标题/描述，无 canonical、JSON-LD 或静态正文产物。现有 sitemap 与 router/catalog 分离，新增路由存在漏同步风险。

C-034 曾计划使用 `@unhead/vue` + Playwright 预渲染，但从未获批或实施，且包含“所有爬虫只能看到空壳”“放行所有 AI bot”等绝对化假设。C-123 已完成重新审计，本变更基于当前 Vue 3/Vite 8/Playwright 架构重新设计并正式接管 C-034。

## 目标

1. 为 95 个可索引页面提供唯一 title、description、canonical、Open Graph/Twitter 与 robots 语义。
2. 修正 HTML 语言，并在 SPA 路由切换时同步更新 head，不产生重复标签。
3. 为首页输出 WebSite + SoftwareApplication JSON-LD，为内容页输出 LearningResource + BreadcrumbList JSON-LD，且只描述页面可见内容。
4. 构建后生成 95 个含真实正文的静态 HTML 入口，Google Pages 子路径和自有域根路径使用同一套管线。
5. 从真实首页 catalog 发现 92 个条目，加三个功能页生成 sitemap 与完整 llms.txt，避免第四份手工 URL 清单。
6. 构建阶段自动验证所有 HTML、canonical、JSON-LD、sitemap、llms 与 base；任一漏页或空壳都失败。
7. robots 明确允许 OAI-SearchBot 做搜索发现、禁止 GPTBot 训练抓取，其他正常搜索爬虫继续允许。

## 不做什么

- 不实现 `/en`、hreflang 或任何站点多语言；它们属于 C126。
- 不接入 GA4/Plausible/Umami、UTM 或事件埋点；它们历史上属于 C125，C129 后仅保留独立 UTM 工具。
- 不提交 Search Console/Bing 账号验证，不主动调用 IndexNow；只提供可提交的生产资产与检查清单。
- 不重写 92 篇文章正文，也不添加页面上不存在的 FAQ、评分、作者资历或收益承诺。
- 不引入 `@unhead/vue`、SSG 框架或新的页面 catalog；现有规模下使用小型 head composable 与构建后预渲染。
- 不把 JSON-LD、robots、llms.txt 或预渲染写成排名、收录、富结果或 AI 引用保证。

## 功能需求

### R1 页面注册表

- 首页 catalog 是 92 个内容页标题、描述、分类与 slug 的唯一来源。
- 增加 Home、Complexity、Paths 三个功能页，共 95 个 indexable page。
- page registry 的 name/path/title/canonical 必须唯一，并与 router 的全部可索引 route 完全一致。
- `/docs` 与空白 `/about` 不进入 sitemap，运行时标记 `noindex,nofollow`。

### R2 路由级 head

- `<html lang="zh-CN">`。
- 每个 indexable page 有唯一 title、非空 description、主站 canonical、`og:*`、`twitter:*` 与 `index,follow,max-image-preview:large`。
- canonical 忽略 `?input=` 等查询参数，GitHub Pages 镜像也统一指向 `https://algo.illegalscreed.cn`；内容页使用尾斜杠，与 `dist/<route>/index.html` 的真实静态入口一致。
- SPA 切路由时原地更新同一组标签，不累计重复节点。

### R3 结构化数据

- 首页 `@graph` 至少含 `WebSite` 和 `SoftwareApplication`。
- 内容页 `@graph` 至少含 `LearningResource` 和 `BreadcrumbList`。
- `name`、`description`、`url`、语言与 breadcrumb 必须来自 page registry；不得生成不可见 FAQ 或评分。
- 使用单个 `script#seo-json-ld[type="application/ld+json"]`，路由切换时更新。

### R4 预渲染与发现

- `vite build` 后启动本地 preview，Playwright 访问真实 Vue 页面并等待路由 head 与首个 h1 就绪。
- 首页从实际 `.item` RouterLink 发现 92 个内容页；脚本断言数量、唯一性与 `/docs/*` 形态。
- Home/Complexity/Paths 加入后并行渲染 95 页到 `dist/<path>/index.html`。
- 每页保留 SPA 脚本，客户端接管后原有交互、懒加载与 history 路由继续工作。
- 预渲染 HTML 的站内内容链接使用尾斜杠；构建阶段逐一请求 95 个 canonical 形态的本地静态 URL，避免误命中首页 SPA fallback。

### R5 构建产物

- sitemap 由本轮发现结果生成，包含 95 个主站绝对 URL。
- llms.txt 包含站点说明、三个功能入口及 92 个标题/描述/URL；文案明确其为辅助说明文件。
- JSDOM 产物检查逐页验证 lang/title/description/canonical/robots/JSON-LD/正文长度、唯一 title、sitemap/llms 覆盖与资源 base。
- `build-only`、`verify`、Pages workflow 与 `scripts/deploy.sh` 都使用同一预渲染和验证步骤。

### R6 robots 策略

- `OAI-SearchBot`：Allow `/`，支持 ChatGPT 搜索发现。
- `GPTBot`：Disallow `/`，不授权模型训练抓取。
- `User-agent: *`：Allow `/`，保留正常搜索抓取。
- 保留主站 sitemap URL。

## 验收标准

- [x] 95-page registry 与 router/catalog 完全一致，L3 全绿。
- [x] head composable 在首次加载和 SPA 路由切换时正确，L4 全绿。
- [x] `pnpm build-only` 生成并验证 95 个 production-base 静态入口。
- [x] selfhost 模式生成并验证 95 个 root-base 静态入口。
- [x] `pnpm verify`、coverage、107+ 条 Playwright e2e 全绿。
- [x] 两个线上目标的代表性深链返回 200、静态 HTML 含正文与正确 canonical。
- [x] 四文档、plans index、roadmap、测试三索引、agent 记忆与 marketing execution backlog 回写。

## 变更历史

- 2026-07-10：创建并进入 TDD。正式接管 C-034，采用现有 catalog + 小型 head composable + Playwright post-build prerender + JSDOM artifact gate。
- 2026-07-10：本地实现与门禁完成；审计发现无尾斜杠 URL 会命中首页 fallback，改以尾斜杠 canonical/静态内链并增加 95 URL HTTP 命中门禁。待双轨上线后转 verified。
- 2026-07-10：功能提交 `c98dcaa` 完成双轨发布；Pages run `29065426100` / deployment `5385855614` 与自有域代表深链均验证通过，状态转 verified。
