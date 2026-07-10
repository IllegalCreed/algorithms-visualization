# 实现记录：提示词驱动的全自动内容分发

> Status: implementing
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 20%
> Blocked by: 首批站外账号尚未完成官方 token/OAuth 接入；不阻塞本地基础层实现
> Next action: T1 实现 CampaignSpec、能力注册表、renderer 与 dry-run
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126
> Related tests: TC-DOC-AUTO-127-\_；运行时 Case 待 T1 先红后绿建立
> Related design: design.md

## 执行顺序

`T0 渠道官方能力审计` -> `T1 CampaignSpec/能力注册表/dry-run` -> `T2 首批官方 adapters` -> `T3 workflow/receipt` -> `T4 collectors/回复/报告` -> `T5 条件与人工桥接渠道` -> `T6 全门禁/真实 smoke/C128 移交`。

## T0 渠道审计与方案收束

- [x] 从 marketing 清单提取掘金、V2EX、B站、知乎、小红书、微信公众号、Hacker News、Reddit、Product Hunt、GitHub 十个正式渠道。
- [x] 补充审计 Header 已有分享目标微博/X，以及 DEV、Bluesky、Mastodon 三个可替代自动渠道。
- [x] 逐项核验官方发布、指标、评论、回复、授权、准入、成本和规则。
- [x] 建立 A/B/C/D 能力等级；原始依据集中落在 `docs/marketing/channel-automation-audit.md`。
- [x] Owner 的提示词改为 campaign 授权；保留官方 API、secret 隔离和禁止模拟登录红线。

## T1 基础层

- [ ] 先写 `CampaignSpec` schema、规范化、幂等键和非法输入红测。
- [ ] 先写十五渠道能力集合、关键禁用项和授权/cost gate 红测。
- [ ] 实现渠道 renderer、当前站点事实读取、内容限制校验和 dry-run manifest。
- [ ] 复用现有 UTM 纯函数与 CLI，不复制参数规则。

## T2 首批官方 adapters

- [ ] GitHub Release/Issue adapter 与 traffic/feedback collector。
- [ ] 微博官方 Agent CLI adapter。
- [ ] Bluesky AT Protocol adapter。
- [ ] DEV/Forem article 与 metrics/comments adapter，保持 `reply=false`。
- [ ] Mastodon statuses/notifications adapter。
- [ ] 每个 adapter 完成成功、认证失败、限流、未知结果、幂等和日志脱敏 contract tests。

## T3 Workflow 与 receipt

- [ ] 新增手工触发的 marketing workflow，spec 校验后才接触 Environment Secrets。
- [ ] 设置最小 GitHub 权限、campaign concurrency、超时、重试和预算 guard。
- [ ] receipt 记录 ID/URL/hash/幂等键/adapter version，不记录 token 或 Cookie。
- [ ] dry-run 与正式 publish 路径有可自动验证的副作用边界。

## T4 监测、回复与复盘

- [ ] 实现 1h/48h/7d collector 和跨渠道指标 schema。
- [ ] 发布成功后创建三个一次性 Codex 跟进任务，到点采集并回写原任务；验证中断恢复路径。
- [ ] 实现 FAQ-only 回复白名单和人工升级分类；硬禁用 V2EX/HN/Product Hunt/DEV 自动回复。
- [ ] 缺陷反馈去重后创建 GitHub Issue。
- [ ] 生成包含观测限制、投入时间和下一步判断的报告。

## T5 条件与人工桥接渠道

- [ ] 微信公众号、B站、Reddit adapter 等 Owner 取得官方资质后启用。
- [ ] V2EX、Hacker News、Product Hunt 生成人工发布包，接收真实 URL 后自动采集。
- [ ] 掘金、知乎、小红书保持禁用并输出官方能力缺失原因。
- [ ] X 保持付费禁用，除非 Owner 设置明确预算。

## T6 交付

- [ ] 每个启用渠道至少一次低风险真实 smoke，记录公开 URL 与可用撤回结果。
- [ ] `pnpm format`、`pnpm verify`、coverage 与需要的 L5 全绿。
- [ ] 四文档、plan/test 三索引、marketing、roadmap 与 agent 记忆转 verified。
- [ ] 精确提交、push；代码变更若影响站点再双轨部署，纯 workflow/docs 不盲目部署 SPA。
- [ ] C128 以真实 campaign 开始 48h/7d 发布复盘。

## 当前实际变更

本轮只完成 T0 调研和文档收束，没有新增 workflow、adapter、secret、依赖或站外发布动作。C127 仍处于 implementing，不能表述为“全自动系统已经可用”。

## 验证记录

- 官方资料核验日期：2026-07-11。
- 当前仓库：`main` 与 `origin/main` 同步，调研开始时工作区 clean。
- 十个正式渠道与五个补充/替代渠道集合检查通过；C123 的逐帖审批 Case 已标记 superseded。
- 本地 Markdown 相对链接检查通过；账号与密码原文扫描无结果。
- `pnpm format:check` 与 `git diff --check` 通过。
- 本轮没有改功能代码、workflow、依赖或站点产物，因此未重复运行 Vitest、Playwright、coverage 或 build。

## 变更历史

- 2026-07-11：完成 T0；确认五个首批、三个条件、三个人工监测、三个禁用和一个付费可选渠道的边界。
