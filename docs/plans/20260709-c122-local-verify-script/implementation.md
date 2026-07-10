# 实现记录：本地一键门禁脚本（C-20260709-122）

> Status: verified
> Stable ID: C-20260709-122
> Owner: IllegalCreed
> Created: 2026-07-09
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序

1. 确认 `npm-run-all2` 已在项目中使用，`run-s` 可复用。
2. 新增 `test:unit:run` 与 `verify` scripts。
3. 回写 AGENTS / CLAUDE / overview / roadmap / plans index。
4. 运行 `pnpm verify` 与格式/diff 检查。

## 自测报告

- `pnpm verify`：通过，依次完成 `format:check`、`lint:check`、`type-check`、`test:unit:run`、`build-only`。
- `pnpm test:unit:run`：278 个测试文件 / 2023 条用例通过（作为 `pnpm verify` 的一部分）。
- `pnpm build-only`：通过（作为 `pnpm verify` 的一部分）。
- `git diff --check`：通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：`pnpm verify` 通过（implemented → verified）。
- 2026-07-10：收口复验 `pnpm verify` 通过（278 个测试文件 / 2023 条用例）。
