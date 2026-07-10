# 测试用例：路线图维护期刷新（C-20260709-120）

> Status: verified
> Stable ID: C-20260709-120
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：文档检查

## 用例

| 用例 ID             | 层级 | 自动化路径            | 期望                                           |
| ------------------- | ---- | --------------------- | ---------------------------------------------- |
| TC-DOC-ROADMAP-120  | docs | `docs/roadmap.md`     | 当前阶段为 1.0 封版后的营销执行与维护期        |
| TC-DOC-ROADMAP-121  | docs | `docs/roadmap.md`     | 不再把 C-034 写作当前 P0 待 TDD 项             |
| TC-DOC-PLAN-INDEX-1 | docs | `docs/plans/index.md` | All Changes、By Type、By Module 均能找到 C-120 |
| TC-DOC-PLAN-INDEX-2 | docs | `docs/plans/index.md` | By Type 中 docs/refactor 分类不再遗漏维护项    |
| TC-DOC-FORMAT-1     | docs | `pnpm format:check`   | 文档格式符合 Prettier                          |
| TC-DOC-DIFF-1       | docs | `git diff --check`    | diff 无尾随空白或空白错误                      |

## 自测报告

- `pnpm exec prettier --write docs/roadmap.md docs/plans/index.md docs/plans/20260709-c120-roadmap-maintenance-refresh/*.md`：通过。
- `pnpm exec prettier --check docs/roadmap.md docs/plans/index.md docs/plans/20260709-c120-roadmap-maintenance-refresh/*.md`：通过。
- `pnpm format:check`：通过。
- `pnpm lint:check`：通过。
- `git diff --check`：通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：文档格式与 diff 检查通过（implemented → verified）。
