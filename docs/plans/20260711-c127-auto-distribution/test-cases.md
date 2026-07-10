# 测试用例：提示词驱动的全自动内容分发

> Status: implementing
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 20%
> Blocked by: 首批站外账号尚未完成官方 token/OAuth 接入；不阻塞本地基础层实现
> Next action: T1 先建立 CampaignSpec 与 capability gate 红测
> Replaces: C-20260710-123 中 TC-DOC-GROWTH-123-03 的“每帖人工审批”历史断言
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126
> Related tests: TC-DOC-AUTO-127-\_；运行时 Case 待 T1 先红后绿建立
> Related requirement: requirements.md

## T0 文档用例

| Case ID            | 层级 | 检查对象                     | 预期                                                                                                            |
| ------------------ | ---- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| TC-DOC-AUTO-127-01 | docs | 渠道审计                     | 十个正式渠道与微博、X、DEV、Bluesky、Mastodon 五个补充渠道各出现一次，集合无遗漏                                |
| TC-DOC-AUTO-127-02 | docs | 官方依据                     | 每个渠道都有发布、监测、回复、授权/准入、成本或限制结论，并链接官方资料                                         |
| TC-DOC-AUTO-127-03 | docs | 能力等级                     | 首批、条件、人工发布后监测、禁用、付费可选集合明确；不把聚合评论数误写成评论正文能力                            |
| TC-DOC-AUTO-127-04 | docs | marketing/roadmap/agent 记忆 | C127 一致为 implementing 的提示词驱动自动化，C128 在其后；不再把每帖人工审批写成当前方案                        |
| TC-DOC-AUTO-127-05 | docs | 凭据与失败策略               | 明确只用官方 API/OAuth/token、secret 隔离、幂等与失败关闭；禁止主密码、Cookie、内部 API、浏览器模拟和验证码绕过 |
| TC-DOC-AUTO-127-06 | docs | `pnpm format:check`          | 本轮文档符合 Prettier                                                                                           |
| TC-DOC-AUTO-127-07 | docs | `git diff --check`           | diff 无尾随空白或空白错误                                                                                       |
| TC-DOC-AUTO-127-08 | docs | plan 状态                    | T0 调研已完成，但 workflow/adapter/secret/真实发布均保持未完成；四文档不得误标 verified                         |

前五个事实 Case 登记到三份全局测试索引；格式、diff 和当前实施状态只保留在本 plan。

## T1-T5 运行时用例框架

实现阶段必须先把以下类别展开为稳定 Case ID，再写实现：

| 层级             | 范围                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| L3               | CampaignSpec schema、规范化、能力 gate、UTM、renderer、幂等键、指标归一化、回复分类       |
| adapter contract | 官方 HTTP/CLI 的成功、401、403、429、5xx、超时、未知结果、重复请求、删除和日志脱敏        |
| workflow         | dry-run 零副作用、secret 缺失失败关闭、Environment 权限、concurrency、预算 guard、receipt |
| smoke            | 每个启用渠道的低风险真实发布、读取和可用时撤回；证据只保留公开 URL/ID                     |
| C128             | 1h/48h/7d collector、跨渠道报告、FAQ-only 回复、Bug Issue 分流                            |

## 验证方法

```bash
rg -n "掘金|V2EX|B站|知乎|小红书|微信公众号|Hacker News|Reddit|Product Hunt|GitHub" docs/marketing/channel-automation-audit.md
rg -n "微博|X|DEV|Bluesky|Mastodon" docs/marketing/channel-automation-audit.md
rg -n "主密码|Cookie|内部 API|浏览器模拟|验证码|失败关闭|幂等" docs/marketing/channel-automation-audit.md docs/plans/20260711-c127-auto-distribution
rg -n "C127|提示词|implementing|全自动" AGENTS.md CLAUDE.md docs/overview.md docs/roadmap.md docs/marketing
pnpm format:check
git diff --check
```

## 当前结果

| Case                       | 结果    | 日期       | 说明                                 |
| -------------------------- | ------- | ---------- | ------------------------------------ |
| TC-DOC-AUTO-127-01..05、08 | passed  | 2026-07-11 | 渠道集合、依据、分级、记忆与状态一致 |
| TC-DOC-AUTO-127-06..07     | passed  | 2026-07-11 | format:check 与 diff check 通过      |
| T1-T5 运行时 Case          | planned | -          | 实现阶段按 TDD 先红后绿建立          |

## 变更历史

- 2026-07-11：创建 T0 八个 docs-only Case，并预留 T1-T5 运行时测试类别。
- 2026-07-11：T0 八个 docs-only Case 全部通过；C127 保持 implementing，运行时 Case 尚未开始。
