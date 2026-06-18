# 实现记录：GitHub Actions 升级

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
> Related plans: C-20260618-001
> Related tests: none
> Related requirement: requirements.md

## 改动清单

`.github/workflows/deploy.yml`：6 个 action 版本升级（checkout v6 / setup-node v6 / configure-pages v6 / upload-pages-artifact v5 / deploy-pages v5 / pnpm/action-setup v6）。流程逻辑、Node 22、门禁步骤不变。

**踩坑**：首次用 `checkout@v7` 导致 CI `Unable to resolve action ... unable to find version v7`——`gh api releases/latest` 返回具体 release `v7.0.0`，但 GitHub 未维护 `@v7` 浮动 major tag。改用各 action 实际存在的最高浮动 major tag（`gh api repos/<action>/tags | grep '^v[0-9]+$'` 查证）后通过。

## 实际涉及文件

`.github/workflows/deploy.yml`

## 与设计偏差

无。

## 验证记录

action 只能在 GitHub Actions 实跑验证（本地无法跑）。推送 main 后由 CI 验证：install --frozen-lockfile + 门禁 + build-only + deploy 全绿、无 Node 20 warning。

## 遗留问题

无。
