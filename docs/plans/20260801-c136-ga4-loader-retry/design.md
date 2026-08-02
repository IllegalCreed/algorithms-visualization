# 设计：GA4 标签加载失败后的安全重试

> Status: verified
> Stable ID: C-20260801-136
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-01
> Last reviewed: 2026-08-02
> Progress: 100%
> Blocked by: none for code change
> Next action: 无代码动作；四站已部署并完成受控 `g/collect` 验证，继续观察 GA4 Realtime/普通报告刷新即可
> Replaces: none
> Replaced by: none
> Related plans: C-20260730-135
> Related tests: TC-ANL-GA4-136-01..04, TC-ANL-HYDRATION-136-01

## 根因

旧实现用单一 `initialized` 同时代表“命令队列已初始化”和“外部标签可用”。script 没有 `onerror` 清理，因此一次失败会留下 DOM 节点；后续初始化因 `initialized` 或 script 查询命中而提前返回。

## 方案

- `initialized` 只控制 `js` / `config` 是否已入队。
- 每次 `initialize()` 都检查 script 是否存在；不存在时插入新节点。
- 新节点的 `onerror` 只执行 `script.remove()`，使下一次 granted 活动可以重试。
- 保留已排队命令，避免重试时重复 `config` 或当前页事件。
- 内建 `gtag` 改为普通函数并将其 `arguments` 推入 `dataLayer`，与 Google 官方 snippet 一致；读取测试统一用 `Array.from()`。

## 涉及文件

- 算法站：`src/analytics/googleAnalytics.ts`、`src/analytics/googleAnalytics.spec.ts`。
- 个人站：`.vitepress/theme/analytics.ts`、`.vitepress/theme/analytics.spec.ts`。
- Type Pal 第一阶段：`packages/game/src/analytics/google-analytics.ts`、对应测试。
- Quiz：`apps/quiz-app/src/analytics/googleAnalytics.ts`、对应测试；不修改 `baiduAnalytics.ts`。
- 个人站同意 UI：`.vitepress/theme/AnalyticsConsent.vue`、`.vitepress/theme/privacy.spec.ts`，只修复 SSR 首屏树一致性。
- 文档：C136 四文档、C135 受影响记录、计划/测试索引、roadmap。

## 保持不变

- Measurement ID、production gate、basic consent、DNT/GPC、URL 白名单和 pathname 去重。
- 算法站/个人站 SPA 计页语义与 Type Pal 单页一次计页语义。
- 不触碰 Type Pal 第二阶段 `reforge`、`editor`、`content`、migration 或现有脏改动。

## 测试设计

- L3：派发 script `error`，再次 granted 后断言新 script 已替换、DOM 仍为单例、当前页仍只排队一次。
- L3：断言内建 gtag 的队列项不是 Array，且可转换为预期 `config` 命令。
- 回归：复跑 C135 原有 gate、隐私、SPA 与撤回用例。

## 风险与回滚

- 长期不可达时，用户活动可能再次尝试加载；每次失败都会清理节点，但不会循环定时请求。
- 回滚只需还原控制器和两条新增用例；不会涉及数据迁移或 consent 存储变更。
- 本方案不承诺解决任一访客网络中的 Google 可达性；同浏览器对照前不预判需要网关或替代统计。

## 四站跟进验收

- TUN 接管时四站明确同意后，Network 必须出现各自合法 Measurement ID 的 `gtag.js` 与 `google-analytics.com/g/collect` 成功响应，再以 GA4 Realtime 为最终证据。
- Chrome 若仍由 ZeroOmega 显式指向 `127.0.0.1:7897`，不能把 TUN 的 shell 成功外推为浏览器成功；切换代理模式属于独立的 Owner 操作，未获即时确认前不自动执行。
- 2026-08-02 终验：个人站、算法站、Quiz、Type Pal 第一阶段均已部署修复后的 production bundle。受控 Chromium 在四站明确 `granted` 后均得到合法 `page_view` 的 `g/collect` 204；Owner 的 GA4 截图也已显示四站 Realtime 活跃用户。Home 顶部 “No data received yet” banner 与 Realtime 卡片刷新路径不同，不再作为链路失败判据。
