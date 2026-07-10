# 实现记录：CI 与格式门禁补强（C-20260709-121）

> Status: verified
> Stable ID: C-20260709-121
> Owner: IllegalCreed
> Created: 2026-07-09
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序

1. 读取 `package.json`、`.github/workflows/deploy.yml`、`vite.config.ts`、`playwright.config.ts` 与 `404.html`。
2. 验证项目范围 Prettier check，确认仅 `404.html` 需要格式化。
3. 更新 `package.json` 的格式脚本，并在 Pages build job 加 `pnpm test:unit:run`。
4. 格式化 `404.html`，保留 SPA fallback 逻辑。
5. 回写 AGENTS / CLAUDE / overview / roadmap / plans index / 测试索引。
6. 运行目标门禁。

## 自测报告

- `pnpm format`：通过，使用新格式脚本覆盖 src/docs/e2e/public/workflow/root 配置。
- `pnpm format:check`：通过。
- `pnpm lint:check`：通过。
- `pnpm type-check`：通过。
- `pnpm test:unit:run`：278 个测试文件 / 2023 条用例通过。
- `pnpm build-only`：通过。
- `git diff --check`：通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：目标门禁通过（implemented → verified）。
- 2026-07-10：收口复验 278 个测试文件 / 2023 条用例与构建通过。
