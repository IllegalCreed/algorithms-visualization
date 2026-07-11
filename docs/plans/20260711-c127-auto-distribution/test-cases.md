# 测试用例：提示词驱动的全自动内容分发

> Status: approved
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 25%
> Blocked by: none；C130 已 verified
> Next action: T1 建立 CampaignSpec、能力注册表、幂等键与 dry-run 红测
> Replaces: C-20260710-123 中 TC-DOC-GROWTH-123-03 的“每帖人工审批”历史断言
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130
> Related tests: TC-DOC-AUTO-127-\_；运行时 Case 待 T1 先红后绿建立
> Related requirement: requirements.md

## T0 文档用例

| Case ID            | 层级 | 检查对象                     | 预期                                                                                              |
| ------------------ | ---- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| TC-DOC-AUTO-127-01 | docs | 渠道审计                     | 十个正式渠道与微博、X、DEV、Bluesky、Mastodon 五个补充渠道各出现一次，集合无遗漏                  |
| TC-DOC-AUTO-127-02 | docs | 官方依据                     | 每个渠道都有发布、监测、回复、授权/准入、成本或限制结论，并链接官方资料                           |
| TC-DOC-AUTO-127-03 | docs | 能力等级与 Owner 约束        | 免费个人首批、Reddit 后备、人工监测、主体禁用和费用禁用集合明确；不把聚合评论数误写成评论正文能力 |
| TC-DOC-AUTO-127-04 | docs | marketing/roadmap/agent 记忆 | C127 一致为 approved/当前下一阶段的提示词驱动自动化；不再把每帖人工审批写成当前方案               |
| TC-DOC-AUTO-127-05 | docs | 凭据与失败策略               | API/RPA 凭据隔离、幂等与失败关闭完整；禁止主密码回传、内部 API、stealth 和验证码绕过              |
| TC-DOC-AUTO-127-06 | docs | `pnpm format:check`          | 本轮文档符合 Prettier                                                                             |
| TC-DOC-AUTO-127-07 | docs | `git diff --check`           | diff 无尾随空白或空白错误                                                                         |
| TC-DOC-AUTO-127-08 | docs | plan 状态                    | T0 调研已完成，但 MCP/adapter/secret/真实发布均保持未完成；四文档不得误标 verified                |
| TC-DOC-AUTO-127-09 | docs | MCP 凭据边界                 | Codex 只见高层工具与脱敏结果；凭据/Profile 位于独立本地服务且不存在任意浏览器执行工具             |

前六个事实 Case（01..05、09）登记到三份全局测试索引；格式、diff 和当前实施状态只保留在本 plan。

## T1-T5 运行时用例框架

实现阶段必须先把以下类别展开为稳定 Case ID，再写实现：

| 层级             | 范围                                                                                |
| ---------------- | ----------------------------------------------------------------------------------- |
| L3               | CampaignSpec schema、规范化、能力 gate、UTM、renderer、幂等键、指标归一化、回复分类 |
| adapter contract | 官方 HTTP/CLI 的成功、401、403、429、5xx、超时、未知结果、重复请求、删除和日志脱敏  |
| MCP contract     | 高层工具 schema、凭据不可见、任意执行不可达、RPA challenge 失败关闭、幂等 receipt   |
| smoke            | 每个启用渠道的低风险真实发布、读取和可用时撤回；证据只保留公开 URL/ID               |
| C128             | 1h/48h/7d collector、跨渠道报告、FAQ-only 回复、Bug Issue 分流                      |

## 验证方法

```bash
rg -n "掘金|V2EX|B站|知乎|小红书|微信公众号|Hacker News|Reddit|Product Hunt|GitHub" docs/marketing/channel-automation-audit.md
rg -n "微博|X|DEV|Bluesky|Mastodon" docs/marketing/channel-automation-audit.md
rg -n "主密码|Cookie|内部 API|浏览器模拟|验证码|失败关闭|幂等" docs/marketing/channel-automation-audit.md docs/plans/20260711-c127-auto-distribution
rg -n "C127|提示词|approved|marketing-ops|MCP" AGENTS.md CLAUDE.md docs/overview.md docs/roadmap.md docs/marketing docs/plans/20260711-c127-auto-distribution
pnpm format:check
git diff --check
```

## 当前结果

| Case                           | 结果    | 日期       | 说明                                 |
| ------------------------------ | ------- | ---------- | ------------------------------------ |
| TC-DOC-AUTO-127-01..05、08..09 | passed  | 2026-07-11 | 渠道、约束、MCP 隔离、记忆与状态一致 |
| TC-DOC-AUTO-127-06..07         | passed  | 2026-07-11 | format:check 与 diff check 通过      |
| T1-T5 运行时 Case              | planned | -          | 实现阶段按 TDD 先红后绿建立          |

## 变更历史

- 2026-07-11：创建 T0 八个 docs-only Case，并预留 T1-T5 运行时测试类别。
- 2026-07-11：T0 八个 docs-only Case 全部通过；当时 C127 保持 implementing，运行时 Case 尚未开始。
- 2026-07-11：增加 MCP 隔离 Case；C127 转 approved/25% 并后置，运行时 Case 尚未开始。
- 2026-07-11：C130 verified 后 C127 恢复为当前下一阶段；运行时 Case 仍须从 T1 先红后绿建立。
