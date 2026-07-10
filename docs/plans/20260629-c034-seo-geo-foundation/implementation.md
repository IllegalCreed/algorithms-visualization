# 实现：SEO + GEO 可检索地基（TDD 任务分解 T1–T5）

> Status: deprecated
> Stable ID: C-20260629-034
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md
> Related plan: C-20260710-123

> 历史状态说明：以下 T1-T5 从未执行。2026-07-10 起不得按本任务表开工；后续 C124 需要基于当前源码、官方资料和新测试重新拆解。

## 执行顺序

`T1 数据与纯函数（routes/pageMeta/jsonld/sitemap/llms/distPath）` → `T2 head 注入（useSeoHead/main/App）` → `T3 robots + gen-seo 脚本` → `T4 预渲染脚本` → `T5 构建集成 + index.html + L5 产物校验`。每个任务**先写失败测试 → 跑红 → 实现 → 跑绿**。

> 可测性原则：所有**纯逻辑**（路由集、元数据、JSON-LD 串、sitemap/llms 字符串、route→dist 路径映射）落在 `src/seo/`，由 L3 单测覆盖；`scripts/*` 只做 IO（起 server、Playwright、写文件），由 L5 产物校验兜底。`context7` 在 T2 落地前核实 `@unhead/vue` 当前 API。

---

## T1 — `src/seo/` 数据与纯函数（L3，先写测试）

**先写失败测试**：

- `src/seo/routes.spec.ts`（`TC-SEO-ROUTES-*`）：`SEO_ROUTES` 与 `router/index.ts` 的路由集合一致（提取 router 全部 `name` 与 `SEO_ROUTES` 比对——守护「加新页漏加 SEO」）；path 唯一；name 唯一。
- `src/seo/pageMeta.spec.ts`（`TC-SEO-META-*`）：`PAGE_META` 覆盖 `SEO_ROUTES` 每个 name；每条 title 非空且全局唯一；description 非空且 ≤120 字；`SITE.origin` 为 https。
- `src/seo/jsonld.spec.ts`（`TC-GEO-JSONLD-*`）：`buildJsonLd(name,path)` 合法 JSON；含 `@context=schema.org`；`@graph` 含 `SoftwareApplication`/`LearningResource`/`BreadcrumbList`；url = origin+path。
- `src/seo/sitemap.spec.ts`（`TC-SEO-SITEMAP-*`）：`buildSitemapXml(SEO_ROUTES, origin)` 含每条路由的 `<loc>`、URL 数 = 路由数、为合法 urlset。
- `src/seo/llms.spec.ts`（`TC-GEO-LLMS-*`）：`buildLlmsTxt(PAGE_META, SITE)` 含站名标题、含全部页链接。

**实现**：

- `src/seo/routes.ts`：`SEO_ROUTES`（见 design §2，覆盖当前全部页面路由）。
- `src/seo/pageMeta.ts`：`SITE` + `PAGE_META`（每页一句话概述定稿）。
- `src/seo/jsonld.ts`：`buildJsonLd`（见 design §4）。
- `src/seo/sitemap.ts`：`buildSitemapXml(routes, origin): string`（纯函数）。
- `src/seo/llms.ts`：`buildLlmsTxt(meta, site): string`（纯函数）。
- `src/seo/distPath.ts`：`routeToDistPath(path): string`（`'/'→'index.html'`、`'/docs/array'→'docs/array/index.html'`）。

**验证**：`pnpm test:unit run src/seo/`。

---

## T2 — head 注入 `useSeoHead.ts` + `main.ts` + `App.vue`（L4，先写测试）

**先写失败测试** `src/seo/useSeoHead.spec.ts` / `src/App.spec.ts`（`TC-VIEW-SEO-*`）：用 `@vue/test-utils` mount `App` + 真路由（memory history），`router.push` 到 array → `nextTick` → 断言 `document.title` = `PAGE_META.array.title`、`<meta name=description>` content = 对应描述、存在 `script[type="application/ld+json"]`；切到 bubble-sort → title 随之变。

**实现**（见 design §3）：

1. `src/seo/useSeoHead.ts`：`useHead` 响应式注入 title/description/canonical/OG/twitter/JSON-LD/`htmlAttrs.lang`。
2. `src/main.ts`：`createHead()` + `app.use(head)`。
3. `src/App.vue`：`useSeoHead()`。

**验证**：`pnpm test:unit run src/seo/useSeoHead.spec.ts src/App.spec.ts`。

---

## T3 — `public/robots.txt` + `scripts/gen-seo.ts`（L3 覆盖纯函数 + 文件）

**先写失败测试** `src/seo/robots.spec.ts`（`TC-GEO-ROBOTS-*`）：读 `public/robots.txt`，断言含 `GPTBot`/`ClaudeBot`/`PerplexityBot`/`Google-Extended`/`Bytespider` 五个放行 UA + `Sitemap:` 行 + 主站域名。

**实现**：

1. `public/robots.txt`（见 design §5.1）。
2. `scripts/gen-seo.ts`：import `SEO_ROUTES`/`PAGE_META`/`SITE` + `buildSitemapXml`/`buildLlmsTxt`，写 `dist/sitemap.xml`、`dist/llms.txt`。

**验证**：`pnpm test:unit run src/seo/robots.spec.ts`；手动 `pnpm build-only` 后查 `dist/sitemap.xml`、`dist/llms.txt`。

---

## T4 — `scripts/prerender.ts`（预渲染管线）

**实现**（见 design §6）：起 `vite preview` 指向 `dist/` → Playwright `chromium` 逐 `SEO_ROUTES` 访问（base 取 `VITE_BASE_URL`）→ `waitForSelector('#app *')` → `page.content()` → 经 `routeToDistPath` 写回 `dist/`。任一路由失败 → 非零退出。

**验证**：`VITE_BASE_URL=/ pnpm build-only` 后，`dist/docs/array/index.html` 等存在且含算法标题正文（由 T5 的 L5 用例断言）。

---

## T5 — 构建集成 + `index.html` + L5 产物校验（先写测试）

**先写失败测试** `e2e/seo-prerender.e2e.ts` 或 `scripts/verify-prerender.spec.ts`（`TC-E2E-SEO-01`）：构建后读若干 `dist/<route>/index.html`，断言：① 非空壳（含对应算法标题文本）；② `<title>` = `PAGE_META[name].title`；③ 含 `application/ld+json`；④ `<html lang="zh-CN">`。

**实现**：

1. `index.html`：`<html lang="zh-CN">` + 默认 `<meta name="description">` / OG fallback。
2. `package.json`：
   - `+ "@unhead/vue"` 依赖（版本经 context7 核实）。
   - `"build-only": "vite build && tsx scripts/prerender.ts && tsx scripts/gen-seo.ts && cp 404.html dist/"`（预渲染→生成 SEO 文件→保留 404 拷贝；`tsx` 或 `vite-node` 跑 TS 脚本，依赖经 context7 核实）。
   - `"prerender": "tsx scripts/prerender.ts"`（可单独跑）。

**验证**：`pnpm build`（type-check + 两套 base 构建 + 预渲染）；跑 L5 产物校验。

---

## 全门禁

`pnpm type-check` / `pnpm lint:check` / `pnpm format:check` / `pnpm test:unit run` / `pnpm exec playwright test` / `pnpm build`（含预渲染，两套 base 各验一次），全绿后回写 `plans/index.md`（**追加 C-034 行，不动 C-033 线段树**）+ `roadmap.md`（M5）+ 三测试索引，提交 main，再按双轨部署（`push` → Pages；`./scripts/deploy.sh` → 自有域名，确认 nginx `try_files` 命中预渲染目录）。

## 自测报告（实现期回填）

- [ ] T1 `src/seo/` 数据与纯函数全绿（routes 同步守护 / pageMeta 完整 / jsonld / sitemap / llms / distPath）— TDD 先红后绿
- [ ] T2 head 注入全绿（切路由 title/description/JSON-LD 更新；`@unhead/vue` API 经 context7 核实）
- [ ] T3 robots + gen-seo 全绿（5 AI UA + Sitemap；dist 生成 sitemap.xml/llms.txt）
- [ ] T4 预渲染脚本跑通（两套 base；dist/<route>/index.html 非空壳；失败非零退出）
- [ ] T5 L5 产物校验全绿（标题正文 / title / JSON-LD / lang）+ 构建集成（build-only 链路）
- [ ] 全门禁达标：type-check / lint:check / format:check / coverage（聚合过门槛）/ build（含预渲染）
- [ ] 零回归：既有全部结构页与排序页 + 播放器全绿；三索引 + roadmap(M5) 回写；双轨部署 + nginx 配合确认

## 变更历史

- 2026-07-10：标记为 deprecated；所有未勾选任务保持历史原貌，不代表当前 backlog。
