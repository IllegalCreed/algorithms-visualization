# 测试用例：修复固定 Header 的图层遮挡

> Status: verified
> Stable ID: C-20260810-141
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察真实 Safari/触控设备的固定壳表现
> Replaces: none
> Replaced by: none
> Related plans: C-20260810-140, C-20260809-139, C-20260809-138
> Related tests: TC-HEADER-141-01

## 用例

| Case ID          | 标题                        | 层级 | 自动化路径                     | 状态     |
| ---------------- | --------------------------- | ---- | ------------------------------ | -------- |
| TC-HEADER-141-01 | 滚动内容不能覆盖固定 Header | L5   | `e2e/responsive.mobile.e2e.ts` | verified |

## 执行结果

- 基线红灯：固定 Header 没有 `z-index` 时，重叠点由 `.playground .tag` 命中。
- 修复绿灯：targeted 1/1；mobile Chromium 整组 6/6。
- 全局门禁：304 个 Vitest、production/selfhost 各 190 页 SEO/Bundle、Pages build/deploy 均通过。
