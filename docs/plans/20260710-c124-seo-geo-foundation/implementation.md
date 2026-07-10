# 实现：SEO/GEO 技术地基重建

> Status: verified
> Stable ID: C-20260710-124
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序

`T1 registry/JSON-LD 红绿` -> `T2 head 红绿` -> `T3 prerender/artifact gate` -> `T4 build/CI/selfhost` -> `T5 e2e/全门禁/部署/回写`。

## T1 页面 registry 与 JSON-LD（L3）

- [x] 先建 `src/seo/site.spec.ts`，覆盖 95 页、唯一性、router 对齐、canonical 与 JSON-LD，确认红。
- [x] 实现 `site.ts`，复用 Home catalog，不增加 92-page 手工表。
- [x] L3 定向全绿。

## T2 路由级 head（L4）

- [x] 先建 `useRouteSeo.spec.ts`，覆盖首次应用、切路由单节点更新、noindex fallback，确认红。
- [x] 实现 DOM upsert + route watcher，接入 `App.vue`。
- [x] 修正 `index.html` root fallback 与 `lang`。
- [x] L4 定向全绿。

## T3 预渲染与产物门禁（build）

- [x] 实现 `scripts/prerender.mjs`，先验证单页，再扩到 4 worker/95 页。
- [x] 生成 route HTML、sitemap、llms.txt、seo-manifest.json。
- [x] 实现 `scripts/verify-seo.mjs`，用 JSDOM/XML DOM 验证全部产物。
- [x] 删除手工 sitemap/llms 源文件，确认 dist 仍完整生成。
- [x] 加固文章正文、失败请求、静态内链与 95 个 canonical URL 的 HTTP 命中检查。

## T4 构建、CI 与双 base

- [x] 新增 `build:selfhost`，`build-only` 接预渲染与 verifier。
- [x] deploy script 改走 `pnpm build:selfhost`。
- [x] Pages workflow 在 Build 前安装 Chromium。
- [x] production/selfhost 两套构建各跑一次并记录时间、大小与 95 页结果。

## T5 端到端与交付

- [x] 新增 `e2e/seo.e2e.ts`，覆盖根/深链/SPA 切换/query canonical。
- [x] `pnpm verify`、`pnpm coverage`、`pnpm test:e2e` 全绿。
- [x] 独立 Chromium 全量 e2e 与静态 HTTP 抽查通过；本轮不改视觉布局。
- [x] 回写四文档、plan/test 三索引、roadmap、agent 记忆、marketing backlog。
- [x] feat + docs 两提交，fetch/sync 后 push。
- [x] GitHub Pages 与 selfhost 双轨部署；curl 静态 HTML、canonical、JSON-LD 与 deployment SHA。

## 自测报告

| 项目                  | 结果                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------- |
| T1 registry/JSON-LD   | 7 个 `site.spec.ts` 用例通过                                                          |
| T2 route head         | 3 个 `useRouteSeo.spec.ts` 用例通过                                                   |
| T3 prerender/artifact | 95 页、文章正文、静态内链、sitemap/llms/JSON-LD 与逐 URL HTTP 命中全部通过            |
| production build      | 95 页，base=`/algorithms-visualization/`，20.4s                                       |
| selfhost build        | 95 页，base=`/`，20.1s                                                                |
| 产物体积              | `dist` 约 6.8 MB；内容页 HTML 约 30–75 KB，首页约 186 KB                              |
| `pnpm verify`         | 280 个文件 / 2033 条 Vitest 用例通过；production build gate 通过                      |
| coverage              | 全局 statements 96.35%、branches 95.68%、functions 94.88%、lines 96.85%               |
| Playwright e2e        | 全量 110/110 通过；canonical 尾斜杠调整后 SEO/quality 定向 4/4 再验证                 |
| 浏览器自检            | 项目 Playwright Chromium 通过；Codex 内置 Browser 无法访问本机端口，未作为通过依据    |
| Pages CI              | run `29065426100` 全绿；deployment `5385855614`，SHA=`c98dcaa`，状态 success          |
| 自有域部署            | `scripts/deploy.sh` 原子切换成功；根页/quick-sort/sitemap/llms/robots 全部核验通过    |
| 双轨静态响应          | 两域根页与 `/docs/quick-sort/` 200 且含对应正文/head；自有域无尾斜杠 301 到 canonical |

## 变更历史

- 2026-07-10：创建，进入 T1 红测。
- 2026-07-10：T1/T2 均先因模块不存在失败后转绿；旧 dist 首次运行 artifact verifier 因缺 `seo-manifest.json` 失败，完成预渲染后转绿。
- 2026-07-10：production/selfhost 双 base、本地 verify、coverage 与 110 条 e2e 通过；静态托管审计后补尾斜杠 canonical 与逐 URL HTTP 门禁，进入发布验证。
- 2026-07-10：功能提交 `c98dcaa` 推送；Pages CI 首次验证 Chromium + 95 页管线并成功部署，自有域同步原子发布，C124 交付完成。
