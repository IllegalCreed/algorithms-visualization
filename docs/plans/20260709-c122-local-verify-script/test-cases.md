# 测试用例：本地一键门禁脚本（C-20260709-122）

> Status: verified
> Stable ID: C-20260709-122
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：配置 / L3 / L4

## 用例

| 用例 ID          | 层级  | 自动化路径           | 期望                                     |
| ---------------- | ----- | -------------------- | ---------------------------------------- |
| TC-VERIFY-122-01 | cfg   | `package.json`       | 存在 `test:unit:run` 与 `verify` scripts |
| TC-VERIFY-122-02 | cfg   | `pnpm verify`        | 本地一键门禁按 CI 同款顺序通过           |
| TC-VERIFY-122-03 | L3/L4 | `pnpm test:unit:run` | 全量 Vitest 单元/组件测试通过            |

## 自测报告

- `pnpm verify`：通过，依次完成 `format:check`、`lint:check`、`type-check`、`test:unit:run`、`build-only`。
- `pnpm test:unit:run`：278 个测试文件 / 2023 条用例通过（作为 `pnpm verify` 的一部分）。
- `pnpm build-only`：通过（作为 `pnpm verify` 的一部分）。
- `git diff --check`：通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：`pnpm verify` 通过（implemented → verified）。
- 2026-07-10：收口复验 `pnpm verify` 通过（278 个测试文件 / 2023 条用例）。
