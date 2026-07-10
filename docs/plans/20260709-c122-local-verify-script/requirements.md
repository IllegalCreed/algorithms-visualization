# 需求：本地一键门禁脚本（C-20260709-122）

> Status: verified
> Stable ID: C-20260709-122
> Owner: IllegalCreed
> Created: 2026-07-09
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

C-20260709-121 已把 GitHub Pages build job 补强为 `lint:check`、`format:check`、`type-check`、`test:unit:run`、`build-only`。维护期需要一个本地一键命令复现 CI 同款门禁，减少每次交付前手动串命令的漏项风险。

## 目标

1. 新增无歧义的 `test:unit:run` 脚本，等价于 `vitest run`。
2. 新增 `verify` 脚本，按 CI 同款顺序串行运行格式检查、lint、类型检查、全量 Vitest、构建。
3. 回写 AGENTS / CLAUDE / overview / roadmap / plans index，说明 `pnpm verify` 是本地快速交付门禁。

## 非目标

- 不把 Playwright e2e 或 coverage 纳入 `verify`；它们仍用于高风险改动、发版前或需要覆盖率证据的场景。
- 不把 GitHub Pages workflow 改成单个 `pnpm verify` 步骤，保留 CI 分步日志便于定位失败。
- 不新增依赖。

## 验收标准

- `package.json` 包含 `test:unit:run` 与 `verify`。
- `pnpm verify` 通过。
- 现有 `pnpm test:unit run` 仍可继续使用，不破坏历史命令。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：`pnpm verify` 通过（implemented → verified）。
