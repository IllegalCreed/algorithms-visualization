# Plans Index

> Status: active
> Last reviewed: 2026-06-20
> Owner: IllegalCreed

## All Changes

| Change ID      | Type                | 标题                | 简介                                                                                              | 状态     | 完成度 | 阻塞项 | 下一步                       | 模块 / 里程碑                  | Owner        | Plan                                | 最近更新   | 替代关系      |
| -------------- | ------------------- | ------------------- | ------------------------------------------------------------------------------------------------- | -------- | ------ | ------ | ---------------------------- | ------------------------------ | ------------ | ----------------------------------- | ---------- | ------------- |
| C-20260618-001 | ops                 | 工具链现代化        | 全量升级依赖到最新、迁移到 pnpm、接入 ESLint+Prettier 门禁与 CI                                   | verified | 100%   | 无     | 已合并 main，CI 门禁实跑通过 | infra / M0                     | IllegalCreed | `20260618-c001-deps-and-gates/`     | 2026-06-18 | -             |
| C-20260618-002 | ops                 | 自有服务器部署      | 部署到 algo.illegalscreed.cn（双 base 构建 + nginx + Let's Encrypt HTTPS）                        | verified | 100%   | 无     | 已上线                       | infra / M0                     | IllegalCreed | `20260618-c002-selfhost-deploy/`    | 2026-06-18 | -             |
| C-20260618-003 | test-infrastructure | M1 测试体系         | 全量 L3/L4 + L5 测试、Vitest 覆盖率、Playwright、全局测试索引、BubbleSort 算法抽离                | verified | 100%   | 无     | 已完成                       | infra / M1                     | IllegalCreed | `20260618-c003-test-suite/`         | 2026-06-18 | -             |
| C-20260618-004 | ops                 | GitHub Actions 升级 | deploy.yml action 升级到最新主版本，消除 Node 20 deprecation                                      | verified | 100%   | 无     | 已完成                       | infra                          | IllegalCreed | `20260618-c004-ci-actions-upgrade/` | 2026-06-18 | -             |
| C-20260618-005 | bugfix              | 修复 M1 发现的 bug  | Splash 路由跳 array + Docs 菜单删 bucket/radix 对齐 Home                                          | verified | 100%   | 无     | 已完成                       | home / docs-shell              | IllegalCreed | `20260618-c005-fix-m1-bugs/`        | 2026-06-18 | 由 C-003 发现 |
| C-20260619-006 | feature             | 交互式算法播放器    | 重做冒泡为可交互播放器（多语言代码视图+行高亮+单步/暂停+变量面板+柱状条动画），建可复用框架       | verified | 100%   | 无     | 已完成                       | viz-engine / M2                | IllegalCreed | `20260619-c006-interactive-player/` | 2026-06-19 | -             |
| C-20260620-007 | feature             | 选择排序动画        | 用算法播放器框架接入选择排序（minIdx 双重编码 + 三指针 + 左侧已排序 + 执行点泛型化），M3 首个算法 | verified | 100%   | 无     | 已完成                       | viz-engine / article-sort / M3 | IllegalCreed | `20260620-c007-selection-sort/`     | 2026-06-20 | -             |

## By Type

### ops

| Change ID      | 标题                | 状态     | 完成度 | 阻塞项 | 下一步      | Plan                                |
| -------------- | ------------------- | -------- | ------ | ------ | ----------- | ----------------------------------- |
| C-20260618-001 | 工具链现代化        | verified | 100%   | 无     | 已合并 main | `20260618-c001-deps-and-gates/`     |
| C-20260618-002 | 自有服务器部署      | verified | 100%   | 无     | 已上线      | `20260618-c002-selfhost-deploy/`    |
| C-20260618-004 | GitHub Actions 升级 | verified | 100%   | 无     | 已完成      | `20260618-c004-ci-actions-upgrade/` |

### test-infrastructure

| Change ID      | 标题        | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                        |
| -------------- | ----------- | -------- | ------ | ------ | ------ | --------------------------- |
| C-20260618-003 | M1 测试体系 | verified | 100%   | 无     | 已完成 | `20260618-c003-test-suite/` |

### bugfix

| Change ID      | 标题               | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                         |
| -------------- | ------------------ | -------- | ------ | ------ | ------ | ---------------------------- |
| C-20260618-005 | 修复 M1 发现的 bug | verified | 100%   | 无     | 已完成 | `20260618-c005-fix-m1-bugs/` |

### feature

| Change ID      | 标题             | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                                |
| -------------- | ---------------- | -------- | ------ | ------ | ------ | ----------------------------------- |
| C-20260619-006 | 交互式算法播放器 | verified | 100%   | 无     | 已完成 | `20260619-c006-interactive-player/` |
| C-20260620-007 | 选择排序动画     | verified | 100%   | 无     | 已完成 | `20260620-c007-selection-sort/`     |

## By Module

### infra

| Change ID      | Type                | 标题                | 状态     | 完成度 | Plan                                |
| -------------- | ------------------- | ------------------- | -------- | ------ | ----------------------------------- |
| C-20260618-001 | ops                 | 工具链现代化        | verified | 100%   | `20260618-c001-deps-and-gates/`     |
| C-20260618-002 | ops                 | 自有服务器部署      | verified | 100%   | `20260618-c002-selfhost-deploy/`    |
| C-20260618-003 | test-infrastructure | M1 测试体系         | verified | 100%   | `20260618-c003-test-suite/`         |
| C-20260618-004 | ops                 | GitHub Actions 升级 | verified | 100%   | `20260618-c004-ci-actions-upgrade/` |

### home / docs-shell

| Change ID      | Type   | 标题                                          | 状态     | 完成度 | Plan                         |
| -------------- | ------ | --------------------------------------------- | -------- | ------ | ---------------------------- |
| C-20260618-005 | bugfix | 修复 M1 发现的 bug（Splash 路由 + Docs 菜单） | verified | 100%   | `20260618-c005-fix-m1-bugs/` |

### viz-engine / article-sort

| Change ID      | Type    | 标题             | 状态     | 完成度 | Plan                                |
| -------------- | ------- | ---------------- | -------- | ------ | ----------------------------------- |
| C-20260619-006 | feature | 交互式算法播放器 | verified | 100%   | `20260619-c006-interactive-player/` |
| C-20260620-007 | feature | 选择排序动画     | verified | 100%   | `20260620-c007-selection-sort/`     |
