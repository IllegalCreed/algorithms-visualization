# 实现记录：`/en` 十页多语言试点

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
> Related design: design.md

## 执行顺序

`T1 registry/route/SEO 红绿` -> `T2 英文算法适配` -> `T3 Header/Menu/Search/Player` -> `T4 十页正文` -> `T5 105 页构建门禁` -> `T6 L5/全门禁/部署/回写`。

## T1 Registry、路由与 SEO

- [x] 先写十组页面、唯一性、fallback 与 105 页 SEO 红测。
- [x] 实现 `src/i18n/pilot.ts` 与 `useSiteLocale()`。
- [x] 注册 `/en`、`/en/docs` 和九个内容路由。
- [x] 扩展 SeoPage locale/alternates、route head 与 JSON-LD。

## T2 七个英文算法适配器

- [x] 先写“步骤/轨结构不变 + 展示文本无中文 + lineMap 不变”红测。
- [x] 适配 Quick Sort、Binary Search、Dijkstra、0/1 Knapsack、KMP、Fenwick、Convex Hull。
- [x] 本地化四语言源码中的中文注释，不复制 oracle。

## T3 共享界面

- [x] Header 增加路由感知的语言分段切换和英文辅助文案。
- [x] Menu/SearchPalette 使用英文 9 页索引并保持中文 92 页现状。
- [x] AlgorithmPlayer/InputBar/QuizCard/TransportControls/KmpView 支持可选 locale。
- [x] 输入校验错误支持英文且中文默认行为不变。

## T4 十页内容

- [x] 英文 Home 只呈现试点范围。
- [x] 英文 Complexity 只列 7 个算法，英文 Paths 只链接已翻译页面。
- [x] 七个英文算法正文完成并接入英文 module adapter。

## T5 预渲染与产物门禁

- [x] 英文首页发现 9 条内容链接，任务总数改为 105。
- [x] manifest 保存 locale/alternates，verifier 校验数量、映射、正文语言与静态内链。
- [x] sitemap 包含 105 canonical；llms 增加 English pilot 分区。
- [x] production/selfhost 双 base 构建均通过。

## T6 交付

- [x] 新增 `e2e/i18n.e2e.ts`，覆盖深链、切换、搜索、播放器、query 与 SEO。
- [x] `pnpm format`、`pnpm verify`、`pnpm coverage`、全量 Playwright 全绿。
- [x] 桌面与 900px 窄视口浏览器截图检查无文本溢出、遮挡或空内容。
- [x] 回写四文档、plan/test 三索引、roadmap、marketing backlog 与 agent 记忆。
- [x] 两次精确提交，fetch/sync 后 push；Pages/selfhost 双轨发布并验证。

## 实际涉及文件

- Registry 与 locale：`src/i18n/pilot.ts`、`useSiteLocale.ts`、对应 L3 spec。
- 英文算法展示适配：`src/i18n/englishAlgorithmModules.ts` 与 spec，不复制 oracle。
- 页面与路由：`src/views/English/` 十页、`src/router/index.ts`。
- 共享界面：Header、Docs Menu、SearchPalette、AlgorithmPlayer 及 InputBar/Quiz/Transport/Kmp/Stack 子组件。
- SEO 产物：`src/seo/`、`scripts/prerender.mjs`、`scripts/verify-seo.mjs`。
- L5：`e2e/i18n.e2e.ts`。

## 与设计偏差

无需求偏差。实现中将 `StackView` 的静态栈标题纳入 locale 接口，这是英文 Quick Sort 使用既有轨道时发现的必要 additive 扩展；中文默认值不变。

## 踩坑与处理

- 第一轮 selfhost verifier 在英文 Quick Sort 捕获 StackView 静态中文标签；没有放宽无 Han 门禁，而是补齐组件 locale。
- 全量 verify 首轮暴露 Header hooks 旧 mock 缺少 `route.path`；补全测试环境后全绿。
- L5 首轮暴露导航时序与逗号 URL 编码差异；改为等待目标页面并兼容浏览器合法编码，不降低业务断言。

## 验证记录

- TDD：registry/SEO、英文 module、route head、Header/Search/Menu/Player 均经历缺实现或旧中文行为的红测，再逐层转绿。
- `pnpm verify`：format/lint/type 全绿；284 个 Vitest 文件、2055 个 L3/L4 用例通过；production 105 页预渲染与 SEO 验证通过。
- `pnpm coverage`：statements 95.64%、branches 92.76%、functions 93.08%、lines 96.09%。
- `pnpm exec playwright test`：104 个文件、114 个 L5 用例全绿，其中 C126 新增 4 条。
- `pnpm build:selfhost`：root base 下 105 页预渲染与验证通过。
- 浏览器审计：1280×720 与 900×900 的英文 Home/Quick Sort 无重叠或横向溢出，控制台零 error。
- 双轨发布：功能提交 `862169c`；Pages run `29107386491` 成功；自有域与 Pages 的 `/en/`、`/en/docs/quick-sort/`、`/en/docs/kmp/` 均为 200；自有域 sitemap 为 105 条。

## 遗留问题

C126 不扩展其余 85 个中文索引页，也不引入完整 i18n 框架；扩容必须另立计划。经 Owner 最新排序，当前主线评审 C130 的 30 页英文扩容草案，C127 宣传自动化后置。

## 变更历史

- 2026-07-11：创建并进入 T1；仓库起点 clean，main 与 origin/main 同步。
- 2026-07-11：T1-T6、全门禁、视觉审计与双轨上线核验完成，状态转 verified。
