# 需求：撤销第三方分析接入

> Status: verified
> Stable ID: C-20260710-129
> Type: refactor
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Progress: 100%
> Blocked by: none
> Next action: 已完成；增长主线进入 C126 `/en` 十页试点
> Replaces: C-20260710-125
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-124、C-20260710-125
> Related tests: TC-ANL-ROLLBACK-129-\_

## 背景

C125 已实现但未激活 Umami Cloud。Owner 确认 `cloud.umami.is` 无法稳定访问，并明确不接受项目尚未产生收入时先承担分析订阅成本，因此撤销第三方分析路线。

本变更保留零成本且供应商无关的 UTM 链接生成能力，删除当前没有消费者的 tracker、会话归因、交互事件与隐私入口。未来若确有流量，再另立计划评审 Nginx 白名单日志；本期不顺带部署采集端。

## 验收标准

- [x] production/selfhost 环境不含第三方分析 provider、script URL 或 website ID。
- [x] 应用源码不加载 tracker，不建立 page view watcher，不发送交互事件。
- [x] 删除仅服务第三方统计的隐私页、analytics Playwright 项目和测试。
- [x] `marketing:link` 与 UTM 纯函数继续可用，发布草稿中的 UTM 链接保留。
- [x] `pnpm verify`、coverage、全量 Playwright 与双 base 构建通过。
- [x] C125 标记 superseded，当前索引、路线图与 agent 记忆改指 C129 结论。

## 变更历史

- 2026-07-10：Owner 明确撤销第三方分析；创建 C129，保留 UTM、移除 tracker。
- 2026-07-10：282/2041 Vitest、110/110 Playwright、coverage 与双 base 95 页通过；状态转 verified。
