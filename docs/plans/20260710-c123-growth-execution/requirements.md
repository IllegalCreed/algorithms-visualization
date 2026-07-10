# 需求：增长执行审计与阶段编排

> Status: verified
> Stable ID: C-20260710-123
> Type: ops
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 创建 C124 四文档并重新评审 SEO/GEO 技术方案
> Replaces: none
> Replaced by: none
> Related plans: C-20260629-034、C-20260705-117、C-20260705-118、C-20260709-119 至 C-20260709-122
> Related tests: TC-DOC-GROWTH-123-01 至 TC-DOC-GROWTH-123-06

## 背景

项目已经完成 1.0 功能封版和营销启动物料，但增长执行信息分散在旧 C-034 草案、C-117/C-118 结果、`docs/marketing/roadmap.md` 与 `launch-posts.md` 中。旧草案把尚未实现的预渲染、路由级 meta 和 JSON-LD 写成待直接实施方案，营销路线图又把 SPA 抓取能力写成绝对结论，容易让后续 agent 跳过重新审计。

Owner 已明确下一阶段还包括站点多语言、SEO、GEO、分析归因与自动发帖宣传，并要求按顺序推进。本变更先建立唯一的当前执行清单，再让后续每个阶段独立走四文档、TDD、门禁、提交与发布流程。

## 目标

1. 审计当前仓库的营销、SEO/GEO、多语言、分析和分发自动化资产，区分已完成、部分完成与缺失。
2. 建立 `docs/marketing/execution-backlog.md`，锁定 C124-C128 顺序、边界、依赖、退出条件和 Owner 输入。
3. 将 `docs/marketing/roadmap.md` 收束为当前策略文档，删除绝对化或无法核验的旧事实。
4. 将 C-034 标记为 `deprecated`，只保留历史设计，不再允许直接实施；后续由 C124 重新建 plan。
5. 同步总路线图、项目概览、agent 记忆、plan index、completion backlog 与三份全局测试索引。
6. 记录 Google、OpenAI、Bing、GitHub 和 llms.txt 提案的原始资料及适用边界。

## 不做什么

- 不修改 `src/`、`public/`、workflow、脚本、依赖或任何线上功能。
- 不在本变更接入统计、实现预渲染、添加多语言或调用渠道 API。
- 不替 Owner 创建搜索平台、分析工具或社交平台账号，也不写入任何 token。
- 不把 C-034 的历史内容重写成新方案；只更新状态、复审日期和历史说明。
- 不承诺 SEO 排名、搜索收录、富结果、AI 引用、渠道流量或广告收益。

## 需求

### R1 当前事实可追溯

执行清单必须列出每项能力的状态、仓库证据与结论，至少覆盖：默认 meta/OG、robots、sitemap、llms.txt、路由级 meta、机器可读首屏、分析归因、多语言、内容自动化、发布复盘。

### R2 顺序不可漂移

必须固定为：C124 SEO/GEO -> C125 分析归因 -> C126 `/en` 十页试点 -> C127 内容生成与半自动分发 -> C128 发布与复盘。每项必须有必做范围、退出条件和依赖。

### R3 自动分发有人工闸门

C127 必须先 dry-run 和 `workflow_dispatch`，生成可审阅产物；只有人工批准且官方 API 可用时才允许产生站外副作用。禁止以无头浏览器模拟登录、绕过验证码或处理明文凭据。

> Superseded on 2026-07-11 by C-20260711-127：Owner 改为“提示词即单次 campaign 授权”，不再逐帖人工审批；官方能力、凭据隔离、禁止模拟登录/验证码绕过的红线继续有效。

### R4 多语言小样本验证

C126 保持中文根路径，以 `/en` 做十页试点。必须翻译真实 UI 与正文，并覆盖搜索、canonical、hreflang、sitemap、结构化数据和语言切换；未验证前不承诺全站 92 页翻译。

### R5 历史状态明确

C-034 四文档与 plan index 必须显示 `deprecated`、0% 和“不得直接实施”，并链接 C123。C123 不能声称已经替代实现；待 C124 建立后再决定是否将 C-034 改为 `superseded`。

### R6 策略与执行分层

- `docs/marketing/roadmap.md`：策略、渠道、指标原则。
- `docs/marketing/execution-backlog.md`：当前状态、顺序、退出条件。
- `docs/marketing/launch-posts.md`：发布文案、素材和人工动作。
- `docs/plans/*`：单次变更的需求、设计、实现和测试证据。

## 验收标准

- [x] `execution-backlog.md` 完整覆盖 R1-R6，C124-C128 顺序唯一。
- [x] C-034 四文档只补历史元信息，状态为 `deprecated`。
- [x] `docs/plans/index.md` 的 All Changes、By Type、By Module 同时登记 C123，并同步 C034 状态。
- [x] `docs/roadmap.md`、`docs/overview.md`、`AGENTS.md`、`CLAUDE.md` 都能找到当前执行清单入口。
- [x] 三份测试索引登记 `TC-DOC-GROWTH-123-01..06`。
- [x] `pnpm format:check` 与 `git diff --check` 通过。

## 变更历史

- 2026-07-10：创建。以本地仓库事实和官方一手资料重建增长执行顺序，不改功能代码。
- 2026-07-10：八个文档 Case、格式检查和 diff 检查通过，状态转 verified。
