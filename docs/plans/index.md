# Plans Index

> Status: active
> Last reviewed: 2026-06-18
> Owner: IllegalCreed

## All Changes

| Change ID      | Type                | 标题           | 简介                                                                               | 状态     | 完成度 | 阻塞项 | 下一步                       | 模块 / 里程碑 | Owner        | Plan                             | 最近更新   | 替代关系 |
| -------------- | ------------------- | -------------- | ---------------------------------------------------------------------------------- | -------- | ------ | ------ | ---------------------------- | ------------- | ------------ | -------------------------------- | ---------- | -------- |
| C-20260618-001 | ops                 | 工具链现代化   | 全量升级依赖到最新、迁移到 pnpm、接入 ESLint+Prettier 门禁与 CI                    | verified | 100%   | 无     | 已合并 main，CI 门禁实跑通过 | infra / M0    | IllegalCreed | `20260618-c001-deps-and-gates/`  | 2026-06-18 | -        |
| C-20260618-002 | ops                 | 自有服务器部署 | 部署到 algo.illegalscreed.cn（双 base 构建 + nginx + Let's Encrypt HTTPS）         | verified | 100%   | 无     | 已上线                       | infra / M0    | IllegalCreed | `20260618-c002-selfhost-deploy/` | 2026-06-18 | -        |
| C-20260618-003 | test-infrastructure | M1 测试体系    | 全量 L3/L4 + L5 测试、Vitest 覆盖率、Playwright、全局测试索引、BubbleSort 算法抽离 | draft    | 0%     | 无     | 用户审 spec → writing-plans  | infra / M1    | IllegalCreed | `20260618-c003-test-suite/`      | 2026-06-18 | -        |

## By Type

### ops

| Change ID      | 标题           | 状态     | 完成度 | 阻塞项 | 下一步      | Plan                             |
| -------------- | -------------- | -------- | ------ | ------ | ----------- | -------------------------------- |
| C-20260618-001 | 工具链现代化   | verified | 100%   | 无     | 已合并 main | `20260618-c001-deps-and-gates/`  |
| C-20260618-002 | 自有服务器部署 | verified | 100%   | 无     | 已上线      | `20260618-c002-selfhost-deploy/` |

### test-infrastructure

| Change ID      | 标题        | 状态  | 完成度 | 阻塞项 | 下一步                      | Plan                        |
| -------------- | ----------- | ----- | ------ | ------ | --------------------------- | --------------------------- |
| C-20260618-003 | M1 测试体系 | draft | 0%     | 无     | 用户审 spec → writing-plans | `20260618-c003-test-suite/` |

## By Module

### infra

| Change ID      | Type                | 标题           | 状态     | 完成度 | Plan                             |
| -------------- | ------------------- | -------------- | -------- | ------ | -------------------------------- |
| C-20260618-001 | ops                 | 工具链现代化   | verified | 100%   | `20260618-c001-deps-and-gates/`  |
| C-20260618-002 | ops                 | 自有服务器部署 | verified | 100%   | `20260618-c002-selfhost-deploy/` |
| C-20260618-003 | test-infrastructure | M1 测试体系    | draft    | 0%     | `20260618-c003-test-suite/`      |
