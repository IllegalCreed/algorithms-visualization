# 设计：路线图维护期刷新（C-20260709-120）

> Status: verified
> Stable ID: C-20260709-120
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 文档边界

`docs/roadmap.md` 定位为维护期导航页，而不是历史计划数据库：

- 当前阶段：一句话说明 1.0 封版、营销执行、维护期。
- 当前事实：列出类别/条目数、核心架构、测试规模和部署双轨。
- 维护队列：列出 P0/P1/P2/P3 的下一步方向，只保留可行动的维护主题。
- 入口：指向 AGENTS、overview、completion-backlog、plans index、test-cases 和营销物料。
- 变更历史：记录本次从旧长表收束为维护期文档。

## 一致性规则

- 当前源码与本地测试结果仍是最高优先级。
- C-118 与 completion backlog 的“1.0 封版”结论优先于 roadmap 旧表述。
- C-117/C-118 已纠偏 C-034：robots/sitemap/llms 已补齐，prerender/JSON-LD/routing meta 不再作为已实现事实写入。

## 取舍

不在 roadmap 内继续复制全部历史计划。完整历史保留在 `docs/plans/index.md` 和各 plan 目录；roadmap 只承担“后续该往哪里走”的工作台职责。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：文档格式与 diff 检查通过（implemented → verified）。
