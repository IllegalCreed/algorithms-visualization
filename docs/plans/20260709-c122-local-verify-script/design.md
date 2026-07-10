# 设计：本地一键门禁脚本（C-20260709-122）

> Status: verified
> Stable ID: C-20260709-122
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 脚本设计

新增两个 npm scripts：

- `test:unit:run`: `vitest run`，给 CI 与本地串行脚本一个无需附加参数的稳定入口。
- `verify`: `run-s format:check lint:check type-check test:unit:run build-only`，用 `npm-run-all2` 串行复现 GitHub Pages build job 的门禁顺序。

## 取舍

保留 `.github/workflows/deploy.yml` 的分步命令，不直接替换成 `pnpm verify`。CI 分步日志能让失败点更清楚；`pnpm verify` 面向本地快速自检。

`coverage` 与 `test:e2e` 不纳入 `verify`，避免日常维护命令过重。需要全门禁时仍按 AGENTS 中的复杂变更流程单独运行。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：`pnpm verify` 通过（implemented → verified）。
