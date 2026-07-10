# 实现：分析、事件与渠道归因

> Status: in-progress
> Stable ID: C-20260710-125
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 执行顺序

`T0 文档与评审` -> `T1 UTM/归因红绿` -> `T2 client/route 红绿` -> `T3 交互事件红绿` -> `T4 Umami/看板/隐私` -> `T5 全门禁/双轨发布/回写`。

## T0 文档与评审

- [x] 读取仓库规范、增长清单、C124 交付事实与当前接入点。
- [x] 用 GA4/Plausible/Umami 官方资料完成隐私、成本、托管、事件评审。
- [x] 建立 C125 四文档，确定 Umami 工程默认与 provider-neutral 前端边界。
- [x] 定义七类事件、UTM 规则、PII 禁止项、48h/7d 指标与远端变更红线。

## T1 UTM 与归因（L3）

- [x] 先建 `src/analytics/utm.spec.ts` 和 `attribution.spec.ts`，覆盖规范化、链接生成、首触/当前触、referrer、ChatGPT 与损坏 storage，确认红。
- [x] 实现 `types.ts`、`utm.ts`、`attribution.ts`。
- [x] 证明 query/hash 保留、`input` 不进入 page path、自由文本/超长 token 被拒绝。
- [x] L3 定向 9/9 与 type-check 全绿。

## T2 Client 与路由（L3/L4）

- [x] 先建 `client.spec.ts`，覆盖禁用配置、脚本属性、队列上限/flush、失败关闭、payload 白名单，确认红。
- [x] 实现 `none|umami` client 和公开配置读取，不引入第三方 SDK。
- [x] 先建 `useRouteAnalytics.spec.ts`，覆盖首次、SPA path 切换、query/hash 不重复，确认红。
- [x] 接入 `App.vue`，保证预渲染/测试/无配置环境不产生外部请求。

## T3 交互事件（L4）

- [x] SearchPalette：选择与 no-result 事件；测试不含 query 原文。
- [x] AlgorithmPlayer：播放按钮/键盘统一包装，input_apply 只发 count，quiz_complete 首次汇总。
- [x] Header/IconLink：微博/X share channel；GitHub/个人主页无 share。
- [x] 保留 `language_switch` 类型契约，不把代码语言标签误记为站点语言。
- [x] 相关 4 个组件/Hook suite 84/84 与 type-check 通过；并启用 AlgorithmPlayer spec 自动卸载，消除 window keydown 监听跨用例累积。

## T4 Umami、看板与隐私（ops）

- [x] 只读审计自有服务器资源、Docker/PostgreSQL、nginx、DNS/证书与备份条件；结论为资源不足，不在同机部署。
- [x] 选择 Umami Cloud Hobby 作为生产候选；官方确认 Hobby 免费、US/EU 区域、无 Cookie 与数据导出能力。
- [ ] Owner 注册 Cloud、选择 EU、创建 website 并提供公开 tracker URL/website ID；development 保持 none。
- [ ] 在 Cloud 账号内确认 Hobby 实际 retention/删除能力；目标不超过 180 天，无法执行时需 Owner 明确决策。
- [ ] 确认 Cloud website 的 replay、heatmap、performance 与 identity 能力保持关闭。
- [x] 建立 48h/7d 复盘模板与隐私说明；Footer 桌面/移动端可达。
- [x] analytics Chromium 定向 2/2；覆盖 UTM 深链、SPA page view、核心事件和自由文本边界。
- [ ] 线上发送 page_view、一个 UTM campaign 与至少三个核心事件，记录可见证据。

## T5 交付

- [x] `pnpm format` 后运行 `pnpm verify`、`pnpm coverage`、`pnpm exec playwright test`。
- [x] production/selfhost 两套构建验证 tracker 配置、无 secret 和 SEO 95 页门禁。
- [x] 回写四文档、plan/test 三索引、roadmap、AGENTS/CLAUDE 与 marketing backlog。
- [ ] fetch/sync 后精确暂存，feat + docs 两提交并 push main。
- [ ] GitHub Pages 与 selfhost 双轨部署，验证 SHA、HTTP、tracker、事件与主站体验。

## 自测报告

| 项目                      | 结果                                                  |
| ------------------------- | ----------------------------------------------------- |
| T1 UTM/归因               | 2 files / 9 tests + type-check 通过                   |
| T2 client/route           | 2 files / 9 tests + type-check 通过                   |
| T3 交互事件               | 4 files / 84 tests + type-check 通过                  |
| privacy                   | 2 tests + 桌面/移动端视觉检查通过                     |
| `pnpm verify`             | 285 files / 2060 tests + production 95 页通过         |
| coverage                  | 全局 96.15/95.24/95.01/96.74%；analytics stmts 87.85% |
| Playwright e2e            | 全量 112/112 通过                                     |
| production/selfhost build | 两套各 95 页通过；禁用态无 tracker script/凭据        |
| Umami/retention/dashboard | 自托管已否决；待 Cloud 账号/website ID/retention      |
| 双轨线上                  | 待执行                                                |

## 变更历史

- 2026-07-10：创建。T0 完成，进入 T1 UTM 与会话归因的先红后绿。
- 2026-07-10：T1 先因模块不存在红，最小实现后 9/9；测试读取文档改用 Vite `?raw` 以符合 app tsconfig，不引入 Node global。
- 2026-07-10：T2 先因 client/composable 不存在红；实现禁用配置、手动 Umami pageview、50 条队列、失败关闭与 route path 去重后 9/9。
- 2026-07-10：T3 新增六个交互事件用例先红后绿，相关 84/84；事件触发暴露 spec 未统一卸载导致全局监听累积，启用 `enableAutoUnmount` 后隔离通过。
- 2026-07-10：远端只读审计否决同机自托管；不修改服务器，生产候选改为 Umami Cloud Hobby，待邮箱验证/website ID/retention 外部输入。
- 2026-07-10：隐私与 L5 定向通过；修复 router ready 前误报 `/`、SPA referrer 重复消费、Umami 默认 URL/referrer 泄漏风险和移动端 Footer 裁切。
- 2026-07-10：队列新增入队时 title 快照，避免脚本延迟加载后早期页面误记末页标题；client 定向 statements 86.71% / functions 100% / lines 90.4%。
- 2026-07-10：`pnpm verify`（285/2060）、全量 Playwright 112/112、coverage 与 production/selfhost 各 95 页门禁通过；产物无 tracker script、website ID 或 secret。
