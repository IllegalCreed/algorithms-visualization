# 测试用例：维护期搜索与可访问性收束（C-20260709-119）

> Status: verified
> Stable ID: C-20260709-119
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4

## 用例

| 用例 ID               | 层级 | 自动化路径                                          | 期望                                             |
| --------------------- | ---- | --------------------------------------------------- | ------------------------------------------------ |
| TC-VIZ-SEARCH-09      | L4   | `src/components/SearchPalette.spec.ts`              | 英文名、别名、拼音首字母均能命中对应算法         |
| TC-VIZ-SEARCH-10      | L4   | `src/components/SearchPalette.spec.ts`              | 搜索面板具备 dialog、输入框、listbox/option 语义 |
| TC-VIZ-SEARCH-11      | L3   | `src/components/SearchPalette.spec.ts`              | 92 个条目与 9 个分类均有完整拼音首字母映射       |
| TC-VIZ-SEARCH-12      | L3   | `src/components/SearchPalette.spec.ts`              | “调”“长”等多音字按标题语境生成正确首字母         |
| TC-CTRL-A11Y-01       | L4   | `src/components/player/TransportControls.spec.ts`   | 控制按钮、倍速 select、进度 range 均有可访问名称 |
| TC-CTRL-A11Y-02       | L4   | `src/components/player/TransportControls.spec.ts`   | 播放中主按钮可访问名称切换为“暂停”               |
| TC-VIZ-INPUTBAR-05    | L4   | `src/components/player/InputBar.spec.ts`            | 输入框 label 与错误提示通过 aria 正确关联        |
| TC-VIZ-INPUTBAR-06    | L4   | `src/components/player/InputBar.spec.ts`            | 多个输入条同屏时 id 不重复                       |
| TC-VIZ-LIST-03        | L4   | `src/components/List.spec.ts`                       | 全等数值 percent 为 0.5，不产生 NaN              |
| TC-ROUTER-CATALOG-01  | L3   | `src/router/index.spec.ts`                          | 首页与侧边菜单 slug 集合完全一致                 |
| TC-ROUTER-CATALOG-02  | L3   | `src/router/index.spec.ts`                          | 每个首页/菜单 slug 都有同名 `/docs/{slug}` 路由  |
| TC-VIEW-\*-RouterLink | L4   | Home/Splash/Header/Docs/Menu 相关组件 spec          | 导航入口渲染为 RouterLink 并指向正确 route name  |
| TC-VIEW-ICONLINK-05/6 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` | 外链渲染为安全 `<a>`，含 target 与 rel           |

## 自测报告

- 补漏目标单测：`pnpm test:unit:run src/components/SearchPalette.spec.ts src/components/player/InputBar.spec.ts`，2 个文件 / 18 条通过。
- 全量单测：`pnpm test:unit:run`，278 个测试文件 / 2023 条用例通过。
- 覆盖率：`pnpm coverage` 通过；Statements 96.36%，Branches 95.68%，Functions 94.85%，Lines 96.84%。
- E2E：`pnpm test:e2e`，107 条用例通过。
- 门禁：`format:check` / `lint:check` / `type-check` / `build-only` 均通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：本地门禁通过（implemented → verified）。
- 2026-07-10：新增 TC-VIZ-SEARCH-11/12，覆盖全目录拼音映射和多音字。
