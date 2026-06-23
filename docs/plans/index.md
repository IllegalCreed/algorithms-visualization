# Plans Index

> Status: active
> Last reviewed: 2026-06-23
> Owner: IllegalCreed

## All Changes

| Change ID      | Type                | 标题                | 简介                                                                                                                                                                                                            | 状态     | 完成度 | 阻塞项 | 下一步                                    | 模块 / 里程碑                  | Owner        | Plan                                  | 最近更新   | 替代关系      |
| -------------- | ------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------ | ----------------------------------------- | ------------------------------ | ------------ | ------------------------------------- | ---------- | ------------- |
| C-20260618-001 | ops                 | 工具链现代化        | 全量升级依赖到最新、迁移到 pnpm、接入 ESLint+Prettier 门禁与 CI                                                                                                                                                 | verified | 100%   | 无     | 已合并 main，CI 门禁实跑通过              | infra / M0                     | IllegalCreed | `20260618-c001-deps-and-gates/`       | 2026-06-18 | -             |
| C-20260618-002 | ops                 | 自有服务器部署      | 部署到 algo.illegalscreed.cn（双 base 构建 + nginx + Let's Encrypt HTTPS）                                                                                                                                      | verified | 100%   | 无     | 已上线                                    | infra / M0                     | IllegalCreed | `20260618-c002-selfhost-deploy/`      | 2026-06-18 | -             |
| C-20260618-003 | test-infrastructure | M1 测试体系         | 全量 L3/L4 + L5 测试、Vitest 覆盖率、Playwright、全局测试索引、BubbleSort 算法抽离                                                                                                                              | verified | 100%   | 无     | 已完成                                    | infra / M1                     | IllegalCreed | `20260618-c003-test-suite/`           | 2026-06-18 | -             |
| C-20260618-004 | ops                 | GitHub Actions 升级 | deploy.yml action 升级到最新主版本，消除 Node 20 deprecation                                                                                                                                                    | verified | 100%   | 无     | 已完成                                    | infra                          | IllegalCreed | `20260618-c004-ci-actions-upgrade/`   | 2026-06-18 | -             |
| C-20260618-005 | bugfix              | 修复 M1 发现的 bug  | Splash 路由跳 array + Docs 菜单删 bucket/radix 对齐 Home                                                                                                                                                        | verified | 100%   | 无     | 已完成                                    | home / docs-shell              | IllegalCreed | `20260618-c005-fix-m1-bugs/`          | 2026-06-18 | 由 C-003 发现 |
| C-20260619-006 | feature             | 交互式算法播放器    | 重做冒泡为可交互播放器（多语言代码视图+行高亮+单步/暂停+变量面板+柱状条动画），建可复用框架                                                                                                                     | verified | 100%   | 无     | 已完成                                    | viz-engine / M2                | IllegalCreed | `20260619-c006-interactive-player/`   | 2026-06-19 | -             |
| C-20260620-007 | feature             | 选择排序动画        | 用算法播放器框架接入选择排序（minIdx 双重编码 + 三指针 + 左侧已排序 + 执行点泛型化），M3 首个算法                                                                                                               | verified | 100%   | 无     | 已完成                                    | viz-engine / article-sort / M3 | IllegalCreed | `20260620-c007-selection-sort/`       | 2026-06-20 | -             |
| C-20260621-008 | feature             | 插入排序动画        | 用算法播放器框架接入插入排序（移位插入：取 key + 右移腾位 + 插入；key 玫红原位滑动；纯加法扩展），M3 第二个算法                                                                                                 | verified | 100%   | 无     | 已完成（24 Case 全绿，已落 main）         | viz-engine / article-sort / M3 | IllegalCreed | `20260621-c008-insertion-sort/`       | 2026-06-22 | -             |
| C-20260622-009 | feature             | 头部分享/仓库按钮   | 头部三按钮各司其职：GitHub 开本仓库；微博/X 分享当前页（线上域名+当前 path+文案）；抽 share.ts 纯函数 + useIconLink 响应式                                                                                      | verified | 100%   | 无     | 已完成（35 文件 184 测试全绿，已落 main） | home / docs-shell              | IllegalCreed | `20260622-c009-header-share-buttons/` | 2026-06-22 | -             |
| C-20260622-010 | feature             | 希尔排序动画        | 用算法播放器框架接入希尔排序（gap 分组插入：步长 ⌊n/2⌋ 减半、逐组插入；复用插入排序移位插桩、泛化为 gap 步长；新增 groupMembers/dimmed 聚焦当前组淡化其余），M3 第三个算法                                      | verified | 100%   | 无     | 已完成（26 Case 全绿，已落 main）         | viz-engine / article-sort / M3 | IllegalCreed | `20260622-c010-shell-sort/`           | 2026-06-22 | -             |
| C-20260623-011 | feature             | 归并排序动画        | 用算法播放器框架接入归并排序（自底向上：width 倍增、相邻段合并；首扩外壳为双轨——新增 AuxView 辅助数组轨表达 temp 填充/拷回；主轨复用希尔 groupMembers/dimmed 聚焦当前合并段），M3 第四个、首个非原地/双数组算法 | verified | 100%   | 无     | 已完成（37 Case 全绿，已落 main）         | viz-engine / article-sort / M3 | IllegalCreed | `20260623-c011-merge-sort/`           | 2026-06-23 | -             |

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

| Change ID      | 标题              | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                                  |
| -------------- | ----------------- | -------- | ------ | ------ | ------ | ------------------------------------- |
| C-20260619-006 | 交互式算法播放器  | verified | 100%   | 无     | 已完成 | `20260619-c006-interactive-player/`   |
| C-20260620-007 | 选择排序动画      | verified | 100%   | 无     | 已完成 | `20260620-c007-selection-sort/`       |
| C-20260621-008 | 插入排序动画      | verified | 100%   | 无     | 已完成 | `20260621-c008-insertion-sort/`       |
| C-20260622-009 | 头部分享/仓库按钮 | verified | 100%   | 无     | 已完成 | `20260622-c009-header-share-buttons/` |
| C-20260622-010 | 希尔排序动画      | verified | 100%   | 无     | 已完成 | `20260622-c010-shell-sort/`           |
| C-20260623-011 | 归并排序动画      | verified | 100%   | 无     | 已完成 | `20260623-c011-merge-sort/`           |

## By Module

### infra

| Change ID      | Type                | 标题                | 状态     | 完成度 | Plan                                |
| -------------- | ------------------- | ------------------- | -------- | ------ | ----------------------------------- |
| C-20260618-001 | ops                 | 工具链现代化        | verified | 100%   | `20260618-c001-deps-and-gates/`     |
| C-20260618-002 | ops                 | 自有服务器部署      | verified | 100%   | `20260618-c002-selfhost-deploy/`    |
| C-20260618-003 | test-infrastructure | M1 测试体系         | verified | 100%   | `20260618-c003-test-suite/`         |
| C-20260618-004 | ops                 | GitHub Actions 升级 | verified | 100%   | `20260618-c004-ci-actions-upgrade/` |

### home / docs-shell

| Change ID      | Type    | 标题                                           | 状态     | 完成度 | Plan                                  |
| -------------- | ------- | ---------------------------------------------- | -------- | ------ | ------------------------------------- |
| C-20260618-005 | bugfix  | 修复 M1 发现的 bug（Splash 路由 + Docs 菜单）  | verified | 100%   | `20260618-c005-fix-m1-bugs/`          |
| C-20260622-009 | feature | 头部分享/仓库按钮（微博/X 分享 + GitHub 仓库） | verified | 100%   | `20260622-c009-header-share-buttons/` |

### viz-engine / article-sort

| Change ID      | Type    | 标题             | 状态     | 完成度 | Plan                                |
| -------------- | ------- | ---------------- | -------- | ------ | ----------------------------------- |
| C-20260619-006 | feature | 交互式算法播放器 | verified | 100%   | `20260619-c006-interactive-player/` |
| C-20260620-007 | feature | 选择排序动画     | verified | 100%   | `20260620-c007-selection-sort/`     |
| C-20260621-008 | feature | 插入排序动画     | verified | 100%   | `20260621-c008-insertion-sort/`     |
| C-20260622-010 | feature | 希尔排序动画     | verified | 100%   | `20260622-c010-shell-sort/`         |
| C-20260623-011 | feature | 归并排序动画     | verified | 100%   | `20260623-c011-merge-sort/`         |
