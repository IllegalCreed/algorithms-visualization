# 测试用例：增长执行审计与阶段编排

> Status: verified
> Stable ID: C-20260710-123
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-11
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md
> 适用层级：文档检查

## 用例

| Case ID              | 层级 | 检查对象                              | 预期                                                                                                                       |
| -------------------- | ---- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| TC-DOC-GROWTH-123-01 | docs | `docs/marketing/execution-backlog.md` | 默认 meta/OG、robots、sitemap、llms、route meta、机器可读首屏、分析、多语言、自动分发与复盘均明确区分已有/部分/未验证/缺失 |
| TC-DOC-GROWTH-123-02 | docs | `docs/marketing/execution-backlog.md` | 只存在一个主顺序 C124 -> C125 -> C126 -> C127 -> C128，且每阶段都有退出条件和依赖                                          |
| TC-DOC-GROWTH-123-03 | docs | C127 章节                             | 同时包含 dry-run、人工批准、官方 API、secrets、禁止模拟登录与 schedule 后置约束                                            |
| TC-DOC-GROWTH-123-04 | docs | C034 四文档 + `docs/plans/index.md`   | 状态均为 deprecated/0%，不得直接实施，并能回到 C123                                                                        |
| TC-DOC-GROWTH-123-05 | docs | roadmap/overview/AGENTS/CLAUDE        | 四个当前入口都链接 `docs/marketing/execution-backlog.md`，C124 是下一阶段                                                  |
| TC-DOC-GROWTH-123-06 | docs | 官方依据表                            | Google JS SEO/hreflang/structured data、OpenAI crawler、GitHub schedule、Bing IndexNow、llms.txt 原始链接及限制齐全        |
| TC-DOC-GROWTH-123-07 | docs | `pnpm format:check`                   | 所有本次文档符合 Prettier                                                                                                  |
| TC-DOC-GROWTH-123-08 | docs | `git diff --check`                    | diff 无尾随空白或空白错误                                                                                                  |

> 当前状态：TC-DOC-GROWTH-123-03 是 C123 完成时的历史验收，已于 2026-07-11 被 `TC-DOC-AUTO-127-01..05` supersede。逐帖人工审批不再是当前要求；官方 API、secrets 和禁止模拟登录红线继续有效。

## 验证方法

```bash
rg -n "已有|部分|未验证|缺失|next|planned" docs/marketing/execution-backlog.md
rg -n "提示词|官方 adapter|失败关闭|Environment Secrets|浏览器模拟" docs/marketing/execution-backlog.md docs/marketing/channel-automation-audit.md
rg -n "Status: deprecated|不得直接实施|C-20260710-123" docs/plans/20260629-c034-seo-geo-foundation docs/plans/index.md
rg -n "docs/marketing/execution-backlog.md" docs/roadmap.md docs/overview.md AGENTS.md CLAUDE.md
pnpm format:check
git diff --check
```

## 覆盖说明

本变更无运行时代码、配置或 public 资产变化，不新增 L3/L4/L5 自动化。六个事实 Case 登记到三份全局索引；格式与 diff 两个交付 Case 保留在局部 plan。

> 后续状态：TC-DOC-GROWTH-123-04 是 C123 完成时的历史验收。C124 开始实施后，C034 已从 deprecated 转为 superseded；该 Case 于 2026-07-10 标记 obsolete，并由 `TC-DOC-SEO-124-01` 接管当前替代关系。
>
> TC-DOC-GROWTH-123-03 的逐帖人工审批约束于 2026-07-11 被 Owner 新需求取代，由 C127 文档 Case 接管；其安全红线继续保留。

## 验证结果

| Case                     | 结果   | 日期       |
| ------------------------ | ------ | ---------- |
| TC-DOC-GROWTH-123-01..08 | passed | 2026-07-10 |

## 变更历史

- 2026-07-10：创建八个 docs-only Case，其中六个事实 Case 纳入全局测试索引。
- 2026-07-10：八个 Case 全部通过，状态转 verified。
- 2026-07-10：C124 接管 C034 后，Case 04 作为历史时点断言转 obsolete；当前关系由 TC-DOC-SEO-124-01 验证。
- 2026-07-10：C129 在 C125 后插入撤销决策；Case 02 作为历史顺序断言转 superseded，当前顺序以 execution backlog 为准。
- 2026-07-11：Case 03 的逐帖人工审批断言转 superseded；当前提示词授权和 capability gate 由 TC-DOC-AUTO-127-01..05 验证。
