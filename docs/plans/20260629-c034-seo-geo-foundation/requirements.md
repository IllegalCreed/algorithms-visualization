# 需求：SEO + GEO 可检索地基（预渲染 + per-page meta + 结构化数据，M5 增长首项）

> Status: draft
> Stable ID: C-20260629-034
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Progress: 0%
> Blocked by: none
> Next action: 四文档评审通过后进 writing-plans / TDD（T1 routes+pageMeta → T2 注入 → T3 预渲染脚本 → T4 robots/sitemap/llms → T5 e2e/产物校验）
> Replaces: none
> Replaced by: none
> Related plans: 营销路线图 `docs/marketing/roadmap.md`（M5 地基）；与 C-033 线段树（M4 广度，进行中）无关、编号顺延避让；复用 C-002 自有域名部署的 nginx（预渲染目录需配合）
> Related tests: 计划新增 `TC-SEO-ROUTES-*`（routes 单一事实源 + 与 router 同步守护）/ `TC-SEO-META-*`（PAGE_META 完整性 + 注入）/ `TC-GEO-*`（JSON-LD / robots / llms 生成）/ `TC-SEO-SITEMAP-*`（sitemap 生成）/ `TC-VIEW-SEO-01`（根组件路由切换 title/meta 更新）/ `TC-E2E-SEO-01`（预渲染产物校验）

> ⚠️ 编号说明：全局计数 033 已被 `C-20260629-033`（线段树 Segment Tree，M4 广度 B5，进行中）占用，本变更顺延为 **C-20260629-034**；且本项属**增长/可发现性**方向，不在 `backlog.md` 数据结构候选池，归**新里程碑 M5**。

## 背景

营销路线图（`docs/marketing/roadmap.md`，M5）确立「双线并行（国内攒口碑 + 海外接 AdSense）」战略，其**地基缺口**是：本站为 Vue3 history 模式 SPA，搜索引擎爬虫（Baiduspider/Googlebot）与 AI 爬虫（GPTBot/ClaudeBot/PerplexityBot/Bytespider）抓到的是空壳 `<div id="app">`，自然搜索与 AI 推荐这条「免费长尾流量」基本为零。

**定位**：本变更让**每个路由页对所有机器读者（搜索引擎 + 生成式 AI 引擎）可见、语义清晰、可引用**。SEO 与 GEO **同源**——两者第一前提都是「爬虫能读到 HTML 里的真实文本」，预渲染一次性为两边打开这道门（约 80% 共用地基）；GEO 增量＝放行 AI 爬虫 + 结构化数据 + llms.txt。

**范围（E1 机制先行）**：本期只做**地基机制**——预渲染 + per-page meta + JSON-LD + robots + sitemap + llms.txt，meta/描述从集中映射表读取；**不逐页创作内容**、**不做 i18n 双语**（均留下一阶段）。地基是 1、内容是 0，先把 1 立起来、验证收录有效。

## 三个地基决策

1. **预渲染走「构建后处理 + 复用 Playwright chromium」，不上 SSG。** 页面动画密集（`setTimeout`/`reactive`/大量 DOM 与浏览器 API），vite-ssg 这类 Node 端 SSR 会 `window is not defined`、需给 18+ 组件加 client-only 守卫，风险高。改为：`vite build` 出 SPA → 起本地 preview → 用项目**已装的 `@playwright/test` chromium** 逐个访问全部页面路由（由 `SEO_ROUTES` 枚举）→ 抓渲染后 HTML 写回 `dist/<route>/index.html`。真浏览器跑、零 SSR 风险、与现有 `build-only`（`vite build && cp 404.html dist/`）后处理风格一致。
2. **meta 走「路由级集中注入」，0 改动各 Article 页。** 建单一事实源 `src/seo/routes.ts`（纯路由清单）+ `src/seo/pageMeta.ts`（route name → 标题/描述/关键词），在根组件 `App.vue` 用 `@unhead/vue` 监听路由注入 per-page `<title>`/description/canonical/OG/JSON-LD。**不改 20+ 个页面组件**、与项目「数据驱动」风格一致。
3. **GEO 与 SEO 同源，增量低成本。** robots.txt 显式**放行** AI 爬虫；JSON-LD（`SoftwareApplication`/`LearningResource`/`BreadcrumbList`）；`llms.txt` 站点说明书；canonical/sitemap 统一指向主站自有域名（避免双域名重复内容）。

## 要做什么

1. **路由单一事实源 + SEO 元数据表**（`src/seo/routes.ts` + `src/seo/pageMeta.ts`）
   - `SEO_ROUTES`：`{ path, name }[]`，覆盖 router 全部页面路由（home/docs 各算法页/about）。
   - `PAGE_META`：每个 name → `{ title, description, keywords? }`；`SITE`：站名/主域名/默认描述/默认 OG 图。
2. **head/meta 注入**（`src/seo/useSeoHead.ts` + `App.vue` + `main.ts`）
   - `main.ts` `createHead()` + `app.use(head)`；`App.vue` 调 `useSeoHead()`：监听 `route.name` 从 `PAGE_META` 注入 `<title>`/`<meta description>`/`<link canonical>`/OG（og:title/description/url/type/image）/Twitter card + JSON-LD。
3. **JSON-LD 结构化数据**：站点级 `SoftwareApplication`，每页 `LearningResource` + `BreadcrumbList`，从 `PAGE_META`/`SITE` 生成。
4. **预渲染管线**（`scripts/prerender.ts`）：见决策 1；产物 `dist/<route>/index.html`；参数化 base（production `/algorithms-visualization/`、selfhost `/`）。
5. **SEO 静态/生成文件**：`public/robots.txt`（放行 AI 爬虫 + Sitemap 指向）；构建生成 `sitemap.xml`（从 `SEO_ROUTES` + 主域名）；生成 `llms.txt`（从 `PAGE_META`，站点说明书）。
6. **杂项修正**：`index.html` `<html lang="en">` → `zh-CN`，补默认 description/OG fallback。
7. **构建集成**：`build-only` 接入预渲染 + sitemap/llms 生成；新增 `prerender` script；加 `@unhead/vue` 依赖。
8. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`（追加 C-034 行，**不动 C-033 线段树行**）、`docs/roadmap.md`（新增 M5）、`docs/test-cases/{index,by-layer,by-module}.md`（TDD 落地后）。

## 不做什么（边界）

- **不做 i18n 双语**：英文版/`/en` 路由/内容翻译留下一阶段（营销路线图已定 B 方案）。
- **不做逐页内容增强（E2）**：每页「是什么/复杂度/适用场景/FAQ」结构化内容留后续内容迭代；本期 meta/描述用集中表的一句话概述。
- **不动算法可视化本体**：不改各 Article 页/`structures`·`player` 组件/store/路由的**运行时行为与结构**（`routes.ts` 是新增旁路事实源，不改 `router/index.ts` 的路由定义）。
- **不接 AdSense / 不解决 ICP 备案**：变现代码与备案属营销路线图后续阶段，非本变更。
- **不上 SSG/SSR 框架**（Nuxt/vite-ssg）：见决策 1。

## 业务规则 / 约束

- **预渲染两套 base**：production（GitHub Pages 子路径 `/algorithms-visualization/`）与 selfhost（自有域名根路径 `/`）各自构建、各自预渲染；脚本读 `VITE_BASE_URL`。
- **canonical 唯一**：所有页 canonical 与 sitemap 指向主站 `https://algo.illegalscreed.cn`；GitHub Pages 镜像版加 canonical 指向主站，避免重复内容。
- **预渲染语义**：产物 HTML 给爬虫/首屏；真实用户浏览器加载 JS 后 Vue `mount('#app')` 接管重渲染（非 SSR hydration）。算法页内容轻，短暂重渲可接受（E1 不做消除闪烁优化）。
- **向后兼容硬约束**：仅新增 `src/seo/*`、`scripts/*`、`public/robots.txt` + 改 `main.ts`/`App.vue`/`index.html`/`package.json`；既有全部结构页与排序页 + 播放器 + 骨架全部现有 Case **零改动通过**（无测试依赖 document.title/lang）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`（预渲染目录需 nginx 配合，见 design §7）。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] **预渲染产物非空壳**：`dist/docs/array/index.html`、`dist/docs/bubble-sort/index.html` 等含对应算法标题与正文文本（不再是空 `<div id="app">`）。
- [ ] **per-page meta**：每页 `<title>`、`<meta description>` 唯一且贴合内容；`<html lang="zh-CN">`；canonical 指向主站对应路径。
- [ ] **GEO**：每页注入 JSON-LD（`SoftwareApplication` + `LearningResource` + `BreadcrumbList`）；`robots.txt` 放行 AI 爬虫（GPTBot/ClaudeBot/PerplexityBot/Google-Extended/Bytespider）且含 `Sitemap:`；`llms.txt` 列出全部算法页。
- [ ] **sitemap**：`sitemap.xml` 含全部页面路由的主站绝对 URL。
- [ ] **同步守护**：新增算法页若漏加 `SEO_ROUTES`/`PAGE_META`，`TC-SEO-ROUTES-*` 失败（防回归）。
- [ ] **零回归**：既有全部结构页与排序页 + 播放器全绿；构建（两套 base）成功、预渲染无报错。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`plans/index.md`（追加 C-034、不动 C-033）+ `roadmap.md`（M5）+ 三测试索引回写。

## 开放问题

- **OG 预览图**：E1 先用站点统一图或纯文字 OG，精美 per-page 预览图后补（不阻塞）。
- **预渲染重渲染闪烁**：内容轻、E1 接受；若体验明显再评估 `v-once`/延迟挂载。
- **selfhost nginx**：预渲染产生 `docs/<x>/index.html` 目录结构，nginx 需 `try_files $uri $uri/ /index.html`，确保直接命中预渲染页而非回落 SPA 壳（implementation 标注，属 C-002 部署侧配合）。
- **sitemap/robots 的双域名**：本期 canonical 统一主站；GitHub Pages 版是否上 sitemap 待定（默认只主站提交）。

## 变更历史

- 2026-06-29：创建。M5「增长与可发现性」首项，承接营销路线图地基。范围 E1（机制先行，中文，不 i18n、不逐页内容）。技术选预渲染（复用 Playwright chromium）+ 路由级集中 meta 注入（@unhead/vue），不上 SSG。GEO 与 SEO 同源，增量＝放行 AI 爬虫 + JSON-LD + llms.txt。编号顺延 034（033 被线段树占用）。
