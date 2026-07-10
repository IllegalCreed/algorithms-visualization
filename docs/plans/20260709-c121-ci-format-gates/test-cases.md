# 测试用例：CI 与格式门禁补强（C-20260709-121）

> Status: verified
> Stable ID: C-20260709-121
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：配置 / CI / L3 / L4

## 用例

| 用例 ID            | 层级  | 自动化路径                     | 期望                                                       |
| ------------------ | ----- | ------------------------------ | ---------------------------------------------------------- |
| TC-CI-UNIT-121     | CI    | `.github/workflows/deploy.yml` | Pages build job 在 build 前运行 `pnpm test:unit:run`       |
| TC-FORMAT-SCOPE-1  | cfg   | `package.json`                 | `format:check` 覆盖 src/docs/e2e/public/workflow/root 配置 |
| TC-404-FALLBACK-1  | cfg   | `404.html`                     | 保留 `pathSegmentsToKeep = 1` 与 SPA fallback 跳转逻辑     |
| TC-GATE-FORMAT-121 | cfg   | `pnpm format:check`            | 项目格式门禁通过                                           |
| TC-GATE-UNIT-121   | L3/L4 | `pnpm test:unit:run`           | 全量 Vitest 单元/组件测试通过                              |

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
