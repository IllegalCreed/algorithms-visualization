# 需求：CI 与格式门禁补强（C-20260709-121）

> Status: verified
> Stable ID: C-20260709-121
> Owner: IllegalCreed
> Created: 2026-07-09
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

1.0 封版后维护期的 P0 是保持门禁与线上可用。当前 GitHub Pages build job 已运行 `lint:check`、`format:check`、`type-check` 与 `build-only`，但没有运行 Vitest 单元/组件测试；同时 `format:check` 只检查 `src/`，文档、e2e、根配置和 workflow 仍需要维护者手动记得显式检查。

## 目标

1. 将 `pnpm test:unit:run` 加入 GitHub Pages build job，部署前先挡住 L3/L4 回归。
2. 扩展 `pnpm format` / `pnpm format:check` 覆盖项目内可格式化文件：`src/`、`docs/`、`e2e/`、`public/`、workflow、根部 HTML/JSON/MD/TS 配置。
3. 格式化既有不合规的 `404.html`，保持 SPA GitHub Pages 路由语义不变。
4. 回写项目记忆文档，避免后续 agent 继续按旧的 `src/`-only 格式检查理解门禁。

## 非目标

- 不把 Playwright e2e 加入 Pages CI（当前耗时与浏览器依赖更重，仍作为本地/发版前门禁）。
- 不调整依赖版本、不改测试框架配置。
- 不改部署解卡流程、不触发部署。

## 验收标准

- `package.json` 中 `format` 与 `format:check` 覆盖项目文档和配置文件。
- `.github/workflows/deploy.yml` 在 build job 中运行 `pnpm test:unit:run`。
- `404.html` 格式化后仍保留 `pathSegmentsToKeep = 1` 和原有跳转逻辑。
- 目标门禁通过：格式检查、lint、type-check、build-only、unit test。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：目标门禁通过（implemented → verified）。
