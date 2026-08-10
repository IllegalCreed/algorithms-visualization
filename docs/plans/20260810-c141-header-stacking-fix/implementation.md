# 实现记录：修复固定 Header 的图层遮挡

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

## 改动清单

- `src/views/Master/Header/Header.vue`：为固定 `#header` 增加 `z-index: 1000`，并注明与模态层的层级关系。
- `e2e/responsive.mobile.e2e.ts`：新增 `TC-HEADER-141-01`，先等待 Playground 可见，再把标签滚入 Header 区域并用 `elementFromPoint` 验证绘制顺序。

## TDD 记录

- 红灯：基线 `z-index: auto` 时，390×844 `/docs/queue` 的重叠点命中 `.playground .tag`，断言失败。
- 绿灯：加入基础层级后 targeted E2E 1/1 通过；整组 mobile Chromium 6/6 通过。

## 验证与发布

- `pnpm verify`：format、lint、type-check、304/2178 Vitest、production 190 页 prerender/SEO/Bundle 全部通过。
- 自有域 `./scripts/deploy.sh`：selfhost 190 页构建、SEO/Bundle 通过，远端原子切换成功。
- GitHub Actions run `31351907649`：build（含 desktop/mobile browser tests）与 Pages Deploy 均 success。
- 线上 `/docs/queue/`：自有域与 Pages 均返回 200，CSS 资源均含 `z-index:1000`；自有域安全响应头保持正常。

## 设计偏差与遗留

本次没有设计偏差。真实 Safari/WebKit safe-area 与短视高 modal 可滚动性仍按 C140 维护队列观察。
