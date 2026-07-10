# 实现记录：路线图维护期刷新（C-20260709-120）

> Status: verified
> Stable ID: C-20260709-120
> Owner: IllegalCreed
> Created: 2026-07-09
> Last reviewed: 2026-07-09
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序

1. 读取 `docs/roadmap.md`、`docs/overview.md`、`docs/documentation-adapter.md`、`docs/plans/completion-backlog.md` 和 `docs/plans/index.md`，确认当前冲突点。
2. 创建 C-120 四文档，记录本次纯文档维护。
3. 将 `docs/roadmap.md` 改写为维护期事实与队列入口。
4. 在 `docs/plans/index.md` 的 All Changes、By Type/docs、By Module/site 区域追加 C-120，并顺手补齐 By Type 的 docs/refactor 分类。
5. 运行文档格式与 diff 检查。

## 关键实现笔记

- roadmap 只保留当前维护事实，不再复制超宽历史表；历史细节仍由 plans index 承接。
- C-034 不作为当前 P0 待办保留，避免与 C-118 的纠偏结论冲突。
- `docs/plans/index.md` 中 C-109/C-116 归入 docs，C-047/C-048/C-119 归入 refactor，减少 By Type 继续混放。
- 维护队列把“营销执行、CI/test 自动化、目录数据源收束、可访问性细修”作为候选方向，不把它们写成已承诺功能。

## 自测报告

- `pnpm exec prettier --write docs/roadmap.md docs/plans/index.md docs/plans/20260709-c120-roadmap-maintenance-refresh/*.md`：通过。
- `pnpm exec prettier --check docs/roadmap.md docs/plans/index.md docs/plans/20260709-c120-roadmap-maintenance-refresh/*.md`：通过。
- `pnpm format:check`：通过。
- `pnpm lint:check`：通过。
- `git diff --check`：通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：文档格式与 diff 检查通过（implemented → verified）。
