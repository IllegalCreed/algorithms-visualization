# 实现记录：提示词驱动的全自动内容分发

> Status: approved
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 25%
> Blocked by: none；Owner 明确将宣传自动化后置
> Next action: 多语言与内容主线完成后，再实施独立 `marketing-ops` MCP
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130
> Related tests: TC-DOC-AUTO-127-\_；运行时 Case 待 T1 先红后绿建立
> Related design: design.md

## 执行顺序

`T0 渠道能力与 MCP 方案审计` -> `T1 CampaignSpec/能力注册表/dry-run` -> `T2 MCP contract/凭据边界` -> `T3 首批 API adapters/receipt` -> `T4 collectors/回复/报告` -> `T5 RPA 评审/Reddit 后备/人工桥接` -> `T6 全门禁/真实 smoke/C128 移交`。

## T0 渠道审计与方案收束

- [x] 从 marketing 清单提取掘金、V2EX、B站、知乎、小红书、微信公众号、Hacker News、Reddit、Product Hunt、GitHub 十个正式渠道。
- [x] 补充审计 Header 已有分享目标微博/X，以及 DEV、Bluesky、Mastodon 三个可替代自动渠道。
- [x] 逐项核验官方发布、指标、评论、回复、授权、准入、成本和规则。
- [x] 建立 A/B/C/D 能力等级；原始依据集中落在 `docs/marketing/channel-automation-audit.md`。
- [x] Owner 的提示词改为 campaign 授权；保留官方 API 优先、secret 隔离和受控 RPA 失败关闭红线。
- [x] 确认独立本地 `marketing-ops` MCP：凭据/浏览器 Profile 服务侧持有，Codex 只调用高层工具。

## T1 基础层

- [ ] 先写 `CampaignSpec` schema、规范化、幂等键和非法输入红测。
- [ ] 先写十五渠道能力集合、关键禁用项和授权/cost gate 红测。
- [ ] 实现渠道 renderer、当前站点事实读取、内容限制校验和 dry-run manifest。
- [ ] 复用现有 UTM 纯函数与 CLI，不复制参数规则。

## T2 MCP contract 与凭据边界

- [ ] 先写七个高层 MCP 工具的 schema、鉴权、脱敏与任意浏览器执行拒绝红测。
- [ ] 建立 macOS Keychain、每平台持久化 Profile、健康检查与 `REAUTH_REQUIRED` 边界。
- [ ] 建立本地队列、Unix Socket/stdio、campaign 并发控制和 receipt 存储。

## T3 首批 API adapters

- [ ] GitHub Release/Issue adapter 与 traffic/feedback collector。
- [ ] 微博官方 Agent CLI adapter。
- [ ] Bluesky AT Protocol adapter。
- [ ] DEV/Forem article 与 metrics/comments adapter，保持 `reply=false`。
- [ ] Mastodon statuses/notifications adapter。
- [ ] 每个 adapter 完成成功、认证失败、限流、未知结果、幂等和日志脱敏 contract tests。

- [ ] 每个 adapter 只通过 `marketing-ops` 读取所需 secret；公开仓库和 GitHub Actions 不持有渠道凭据。
- [ ] 设置最小平台权限、campaign concurrency、超时、重试和预算 guard。
- [ ] receipt 记录 ID/URL/hash/幂等键/adapter version，不记录 token、Cookie 或 storage state。
- [ ] dry-run 与正式 publish 路径有可自动验证的副作用边界。

## T4 监测、回复与复盘

- [ ] 实现 1h/48h/7d collector 和跨渠道指标 schema。
- [ ] 发布成功后创建三个一次性 Codex 跟进任务，到点采集并回写原任务；验证中断恢复路径。
- [ ] 实现 FAQ-only 回复白名单和人工升级分类；硬禁用 V2EX/HN/Product Hunt/DEV 自动回复。
- [ ] 缺陷反馈去重后创建 GitHub Issue。
- [ ] 生成包含观测限制、投入时间和下一步判断的报告。

## T5 RPA 评审、Reddit 后备与人工桥接

- [ ] 只有逐渠道规则评审通过且 Owner 显式启用时才实现 RPA adapter；挑战页、未知 DOM 和重复风险全部失败关闭。
- [ ] Reddit adapter 仅在个人应用审核与目标社区授权完成后启用，不阻塞首期。
- [ ] V2EX、Hacker News、Product Hunt 生成人工发布包，接收真实 URL 后自动采集。
- [ ] 掘金、知乎、小红书保持禁用并输出官方能力缺失原因。
- [ ] 微信公众号、B站因无企业主体禁用；X 因零新增费用禁用。

## T6 交付

- [ ] 每个启用渠道至少一次低风险真实 smoke，记录公开 URL 与可用撤回结果。
- [ ] `pnpm format`、`pnpm verify`、coverage 与需要的 L5 全绿。
- [ ] 四文档、plan/test 三索引、marketing、roadmap 与 agent 记忆转 verified。
- [ ] 精确提交、push；代码变更若影响站点再双轨部署，纯 contract/docs 不盲目部署 SPA。
- [ ] C128 以真实 campaign 开始 48h/7d 发布复盘。

## 当前实际变更

当前只完成 T0 调研和方案设计，没有新增发布器、adapter、MCP、secret、依赖或站外发布动作。C127 为 approved/25%，由 Owner 明确后置，不能表述为“全自动系统已经可用”。

## 验证记录

- 官方资料核验日期：2026-07-11。
- 当前仓库：`main` 与 `origin/main` 同步，调研开始时工作区 clean。
- 十个正式渠道与五个补充/替代渠道集合检查通过；C123 的逐帖审批 Case 已标记 superseded。
- 本地 Markdown 相对链接检查通过；账号与密码原文扫描无结果。
- `pnpm format:check` 与 `git diff --check` 通过。
- 本轮没有改功能代码、发布器、依赖或站点产物，因此未重复运行 Vitest、Playwright、coverage 或 build。

## 变更历史

- 2026-07-11：完成 T0；确认五个免费个人首批、Reddit 后备、三个人工监测、三个 D 级禁用、微信/B站主体禁用和 X 费用禁用。
- 2026-07-11：独立 `marketing-ops` MCP/RPA 边界设计批准；停止 T1 开工，宣传自动化后置到多语言与内容主线之后。
