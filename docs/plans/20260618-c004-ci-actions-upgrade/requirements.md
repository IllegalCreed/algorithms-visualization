# 需求：GitHub Actions 升级

> Status: verified
> Stable ID: C-20260618-004
> Type: ops
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-001（建立的 CI）
> Related tests: none

## 背景

`deploy.yml` 的 action 仍 target Node 20，GitHub 平台自 2025-09 起 deprecate（运行被强制迁到 Node 24，CI 输出 deprecation warning，见 C-003 推送后的 CI 注解）。

## 要做什么

升级 `.github/workflows/deploy.yml` 各 action 到最新主版本：

- `actions/checkout` v4 → **v6**（注：v7.0.0 存在但无 `@v7` 浮动 major tag，用最高浮动 tag v6）
- `pnpm/action-setup` v4 → **v6**
- `actions/setup-node` v4 → **v6**
- `actions/configure-pages` v4 → **v6**
- `actions/upload-pages-artifact` v3 → **v5**
- `actions/deploy-pages` v4 → **v5**

## 不做什么

不改 CI 流程逻辑（门禁步骤、Node 22、pnpm、部署目标均不变）。

## 验收口径

- [ ] 推送后 CI 全绿（install → 门禁 → build → deploy）。
- [ ] 不再有 Node 20 deprecation warning。

## 变更历史

- 2026-06-18：创建并完成。版本号经 `gh api releases/latest` 查证。
