# 测试用例：`/en` 十页多语言试点

> Status: verified
> Stable ID: C-20260711-126
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 进入 C127 提示词驱动的全自动内容分发
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-124、C-20260710-129
> Related tests: TC-I18N-REGISTRY-126-_、TC-I18N-MODULE-126-_、TC-SEO-I18N-126-_、TC-I18N-UI-126-_、TC-I18N-BUILD-126-_、TC-E2E-I18N-126-_
> Related requirement: requirements.md

## 用例总览

| 层级  | Case ID 区间                    | 数量 | 自动化位置                                         |
| ----- | ------------------------------- | ---- | -------------------------------------------------- |
| L3    | `TC-I18N-REGISTRY-126-01..03`   | 3    | `src/i18n/pilot.spec.ts`                           |
| L3    | `TC-I18N-MODULE-126-01..03`     | 3    | `src/i18n/englishAlgorithmModules.spec.ts`         |
| L3    | `TC-SEO-I18N-126-01..03`        | 3    | `src/seo/site.spec.ts`                             |
| L4    | `TC-I18N-UI-126-01..04` + `03A` | 5    | Header/Menu/Search/Player/route-head specs         |
| build | `TC-I18N-BUILD-126-01..04`      | 4    | `scripts/prerender.mjs` + `scripts/verify-seo.mjs` |
| L5    | `TC-E2E-I18N-126-01..04`        | 4    | `e2e/i18n.e2e.ts`                                  |
| docs  | `TC-DOC-I18N-126-01`            | 1    | plan/marketing/test 三索引                         |
| 合计  |                                 | 23   |                                                    |

## L3 Registry 与算法适配

| Case ID                 | 场景                     | 预期                                                           |
| ----------------------- | ------------------------ | -------------------------------------------------------------- |
| TC-I18N-REGISTRY-126-01 | 读取 pilot registry      | 恰好 10 组；中英 name/path 唯一；7 个算法、2 个工具、1 个 Home |
| TC-I18N-REGISTRY-126-02 | 已翻译页面切换语言       | 命中对应 route；安全 query 保留                                |
| TC-I18N-REGISTRY-126-03 | 未翻译或未知页面切换语言 | 回退目标语言 Home，不构造不存在的 URL                          |
| TC-I18N-MODULE-126-01   | 七个英文 module 生成步骤 | 步骤数、point、array、emphasis 和所有视觉轨与中文 module 一致  |
| TC-I18N-MODULE-126-02   | 扫描英文 module 展示字段 | title/hint/caption/vars/quiz/source code 无 Han 字符           |
| TC-I18N-MODULE-126-03   | 检查四语言 source        | 语言集合、lineMap、代码行数与中文 source 一致且执行点仍可高亮  |

## L3/L4 SEO 与共享 UI

| Case ID            | 场景                                    | 预期                                                                  |
| ------------------ | --------------------------------------- | --------------------------------------------------------------------- |
| TC-SEO-I18N-126-01 | 读取 SEO registry                       | 总计 105；`zh-CN` 95、`en` 10；name/path/title/canonical 唯一         |
| TC-SEO-I18N-126-02 | 检查十组页面 alternate                  | 每页含自身、对方与 x-default；双方集合相同；其余 85 页无假 alternate  |
| TC-SEO-I18N-126-03 | 构建中英 JSON-LD                        | inLanguage、站名、breadcrumb Home 与 isPartOf 使用对应语言入口        |
| TC-I18N-UI-126-01  | route head 从英文成对页切到中文未翻译页 | lang/canonical/OG 更新，旧 hreflang 节点清空且无重复                  |
| TC-I18N-UI-126-02  | Header 中英切换                         | 标题/辅助文案本地化；成对页面与 fallback 目标正确                     |
| TC-I18N-UI-126-03  | SearchPalette 位于 `/en`                | 只搜 9 个英文内容页，英文空态/快捷入口/跳转正确                       |
| TC-I18N-UI-126-03A | Docs Menu 位于 `/en`                    | 只渲染 9 个英文内容页并按英文 route name 高亮当前项                   |
| TC-I18N-UI-126-04  | 英文 AlgorithmPlayer                    | 输入、错误、题卡、控制、分数与 KMP 状态均为英文；默认 locale 仍为中文 |

## 构建产物

| Case ID              | 场景                | 预期                                                                              |
| -------------------- | ------------------- | --------------------------------------------------------------------------------- |
| TC-I18N-BUILD-126-01 | prerender 发现任务  | 中文 catalog 92 + 中文工具/Home 3 + 英文内容 9 + 英文 Home 1 = 105                |
| TC-I18N-BUILD-126-02 | 逐页静态 HTML       | locale/head/canonical/alternate/JSON-LD 与 manifest 一致；英文 `#app` 无 Han 字符 |
| TC-I18N-BUILD-126-03 | sitemap 与 llms     | sitemap 等于 105 canonical；llms 同时覆盖中文全量和 English pilot                 |
| TC-I18N-BUILD-126-04 | production/selfhost | 105 个目录入口和本地资源分别使用 Pages base 与 root base                          |

## L5 浏览器回归

| Case ID            | 场景                           | 预期                                                       |
| ------------------ | ------------------------------ | ---------------------------------------------------------- |
| TC-E2E-I18N-126-01 | 直接访问 `/en/` 与英文算法深链 | 正文、菜单、lang、canonical、JSON-LD 与三项 alternate 正确 |
| TC-E2E-I18N-126-02 | 成对/未成对语言切换            | 对应页与 Home fallback 正确；quick-sort `?input=` 保留     |
| TC-E2E-I18N-126-03 | 英文搜索与播放器               | 搜到并进入英文页；单步、输入和测验界面无中文残留           |
| TC-E2E-I18N-126-04 | 桌面与窄视口                   | Header 语言控件、菜单、正文、播放器无重叠/溢出，页面非空   |

## 文档一致性

| Case ID            | 场景                                       | 预期                                                        |
| ------------------ | ------------------------------------------ | ----------------------------------------------------------- |
| TC-DOC-I18N-126-01 | plan/test/roadmap/marketing/agent 记忆回写 | 当前增长入口从 C129 指向已验证 C126，十页/105 页/测试数一致 |

## TDD 记录

- T1：pilot/SEO spec 首轮因 registry 不存在、页面数仍为 95 且无 locale/alternate 而红；实现后 6 条 L3 全绿。
- T2：英文 module spec 首轮因 adapter 不存在而红；七模块展示适配完成后 3 条 L3 全绿。
- T3：route-head、Header、Search、Menu、Player spec 首轮分别暴露硬编码中文或缺少英文索引；逐项实现后 5 条 L4 全绿。
- T5：旧 dist 首轮为 95 页而构建门禁红；105 页生成后又捕获 StackView 中文静态标题，补齐 locale 后 production/selfhost 均绿。
- T6：L5 首轮 2/4，修正等待目标与 URL 编码断言后 4/4；最终 `pnpm verify` 为 284 文件/2055 用例，coverage 达标，全量 Playwright 104 文件/114 用例通过。

## 变更历史

- 2026-07-11：批准 23 个 Case，进入 T1 registry/SEO 红测。
- 2026-07-11：23 个 Case 全部验证，production/selfhost 105 页与双轨英文深链核验通过。
