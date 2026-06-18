# 测试用例：M1 测试体系

> Status: verified
> Stable ID: C-20260618-003
> Type: test-infrastructure
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**首批 L3/L4/L5 自动化用例（与一般 ops 变更不同），所有 Case ID 同步登记到 `docs/test-cases/{index,by-layer,by-module}.md`。完整 case 列表见全局索引，本文件列代表性 case 与汇总统计。

## 汇总统计

| 层级 | 测试文件数 | Case 数 | 运行命令         |
| ---- | ---------- | ------- | ---------------- |
| L3   | 8          | 28      | `pnpm test:unit` |
| L4   | 12         | 57      | `pnpm test:unit` |
| L5   | 3          | 3       | `pnpm test:e2e`  |
| 合计 | 23         | 88      | —                |

## 代表性 Case（各模块各层各取 1–2 例）

| Case ID              | 标题                                            | 层级 | 自动化路径                                           |
| -------------------- | ----------------------------------------------- | ---- | ---------------------------------------------------- |
| TC-ALGO-01           | 空数组与单元素不产生步骤                        | L3   | `src/algorithms/bubble-sort.spec.ts`                 |
| TC-ALGO-02           | 最终数组升序排列                                | L3   | `src/algorithms/bubble-sort.spec.ts`                 |
| TC-STORE-01          | 初始 isDarkMode=false、isShowHeaderShadow=false | L3   | `src/store/modules/system.spec.ts`                   |
| TC-STORE-02          | changeDarkMode 切换暗色                         | L3   | `src/store/modules/system.spec.ts`                   |
| TC-HOOK-01-1         | 返回数据结构与排序两个分类                      | L3   | `src/views/Home/Main/hooks.spec.ts`                  |
| TC-HOOK-02-4         | 数据结构含 8 项，排序算法含 10 项               | L3   | `src/views/Docs/Menu/hooks.spec.ts`                  |
| TC-HOOK-03-3         | scrollY > 0 时 isShowHeaderShadow 变为 true     | L3   | `src/views/Home/hooks.spec.ts`                       |
| TC-HOOK-04-1         | 组件挂载后 isShowHeaderShadow 变为 true         | L3   | `src/views/Docs/hooks.spec.ts`                       |
| TC-HOOK-05-1         | 返回 3 个社交链接（github/twitter/微博）        | L3   | `src/views/Master/Header/hooks.spec.ts`              |
| TC-VIZ-BLOCK-03      | percent<0.5 文字色 black，否则 white            | L4   | `src/components/Block.spec.ts`                       |
| TC-VIZ-LIST-02       | 最小值 percent=0、最大值 percent=1              | L4   | `src/components/List.spec.ts`                        |
| TC-VIZ-ARROWTRACK-01 | 每个 Pointer 渲染一个 Arrow 并按 index 定位     | L4   | `src/components/ArrowTrack.spec.ts`                  |
| TC-VIEW-BUBBLE-01    | 挂载渲染 List + 比较表达式                      | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts` |
| TC-VIEW-SPLASH-05    | 点击「开始学习」跳转到 docs/array 页            | L4   | `src/views/Home/Splash/Splash.spec.ts`               |
| TC-VIEW-MENU-06      | useMenuSelect 初始路由 array 使对应 Item 高亮   | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   |
| TC-VIEW-MENU-08      | onBeforeRouteUpdate 回调触发后高亮随路由更新    | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   |
| TC-VIEW-HEADER-05    | 点击 logo 跳转到 home 路由                      | L4   | `src/views/Master/Header/Header.spec.ts`             |
| TC-E2E-HOME-01       | 首页加载并能进入 docs                           | L5   | `e2e/home-navigation.e2e.ts`                         |
| TC-E2E-MENU-01       | docs 菜单点击切换路由                           | L5   | `e2e/docs-menu.e2e.ts`                               |
| TC-E2E-BUBBLE-01     | 冒泡排序动画最终升序                            | L5   | `e2e/bubble-sort.e2e.ts`                             |

## 全量 Case 列表

见 `docs/test-cases/index.md`（主索引）、`docs/test-cases/by-layer.md`（分层视图）、`docs/test-cases/by-module.md`（模块视图）。
