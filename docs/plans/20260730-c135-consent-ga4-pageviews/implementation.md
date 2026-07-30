# 实现记录：同意后启用 GA4 最小页面浏览统计

> Status: verified
> Stable ID: C-20260730-135
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-30
> Last reviewed: 2026-07-30
> Progress: 100%
> Blocked by: none
> Next action: 按 48h / 7d 窗口观察聚合页面浏览；行为事件继续禁止
> Replaces: C-20260710-129
> Replaced by: none
> Related plans: C-20260710-125、C-20260710-129、C-20260727-134
> Related tests: TC-ANL-GA4-135-\_
> Related design: design.md

## 改动清单

- 新增三态 consent 存储、跨组件变更事件和异常失败关闭。
- 新增 production-only GA4 控制器；同意后单例加载 Google tag，只发送标准 `page_view`。
- 新增 pathname + 合法四字段 UTM 清洗；任意其他 query/hash 不进入 payload。
- 新增中英文同意提示和可重新打开的隐私设置入口。
- 将统计启动延后到应用挂载、首路由 ready 且 Vue head 更新完成，避免已同意访客直达深链时重复记录首页。
- production/selfhost 配置算法站公开 Measurement ID，development 保持无 ID。
- C129 标为 `superseded` 并指向 C135；同步计划、测试和营销事实源。

## 实际涉及文件

- 运行时代码：`src/analytics/{consent,googleAnalytics}.ts`、`src/components/AnalyticsConsent.vue`、`src/main.ts`、`src/App.vue`。
- 测试：`src/analytics/{consent,googleAnalytics,boundary}.spec.ts`、`src/components/AnalyticsConsent.spec.ts`、`e2e/analytics-consent.e2e.ts`。
- 配置：`.env.production`、`.env.selfhost`。
- 文档：本 plan 四文档、C129 四文档、overview/roadmap、计划/测试索引与 marketing 两份事实源。
- 跨仓库配套：个人站删除旧无条件标签并增加同边界 consent 实现与中英文隐私政策；Type Pal 由其独立三方签字任务继续推进，不纳入 C135 提交。

## 与设计偏差

- 无行为边界偏差。
- 为修复已同意访客直达深链的首屏竞态，接线比初始设计多等待 `router.isReady()` 与 Vue `nextTick()`；这是对单次首屏 page view 语义的收紧。

## 踩坑与处理

- 审计发现个人站旧标签在 `<head>` 中无条件加载，并指向旧 Measurement ID；将在个人站独立修正，不把旧 ID 复用到算法站。
- 个人站有 3176 个 Markdown 页面，完整 VitePress 构建会长期占用多核；并发跑算法站门禁时，一个既有英文 adapter 用例曾因 5 秒上限超时。暂停个人站构建后重跑，303 文件 / 2156 用例全绿，确认是资源争用而非断言回归。
- 初次接线在 router 首导航 ready 前启动；新增红灯源契约后改为 App mount → router ready → nextTick → analytics，后续导航也等待一次 nextTick 再读取标题。

## 数据处理

- 无数据库或服务端 migration。
- Measurement ID 是公开站点标识；不读取或保存 Google 账号凭据。

## 部署与重启

- 运行时代码提交 `ba6a694` 已推送；`scripts/deploy.sh` 完成 selfhost 190 页构建与远端原子切换。
- `https://algo.illegalscreed.cn/` 与 `/zh/privacy/` 均返回 200；真浏览器确认同意面板可见，未同意时 Google script / Google 网络资源均为 0。
- 个人站提交 `abf8f5b` 已随既有 16 个 ahead 提交一并推送，并同步至 `https://illegalscreed.cn`；首页与 `/zh/privacy` 返回 200，同意前同样零 Google script / 网络资源。
- Owner 明确本轮部署验收目标是上述两个 `illegalscreed.cn` 自有域，不以 `github.io` 监控结果作为验收条件。
- GA4 后台新 property 可能需要最多 48 小时显示常规报告。

## 验证记录

- 红灯 1：新增 analytics/consent/component 测试在实现文件不存在时失败。
- 红灯 2：首屏路由 ready 契约在 `main.ts` 直接启动统计时失败；改为 mount 后等待 router ready + nextTick 后转绿。
- C135 定向 L3/L4：4 文件、18 用例通过；analytics 核心行/函数覆盖率 100%。
- `pnpm verify`：format、lint、type-check、303 文件 / 2156 用例、production 190 页预渲染与 SEO 校验通过。
- `pnpm coverage`：全仓 statements 95.51%、branches 86.37%、functions 92.10%、lines 95.85%；`src/analytics` lines/functions 100%。
- `pnpm exec playwright test`：105 文件 / 119 用例全绿；最后接线调整后又定向复跑 C135 L5，1/1 通过。
- `pnpm build:selfhost`：selfhost 190 页预渲染与 SEO 校验通过。
- 个人站 `pnpm test:unit`：1 文件 / 3 用例通过；3176 个 Markdown 页的完整 VitePress 构建与 sitemap 生成通过（2955.68s），代表 HTML 不含无条件 Google tag、旧 ID 或新 ID。

## 遗留问题

- Type Pal 受其仓库三贤人 done 签字门禁约束，不属于本仓库 C135 的实现与提交范围。
- 仅观察聚合页面浏览；任何搜索、输入、播放、测验、分享或其他自定义事件必须另开 plan。
