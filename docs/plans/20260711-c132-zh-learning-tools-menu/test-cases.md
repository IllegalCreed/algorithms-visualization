# 测试用例：中文侧边栏补齐学习工具

> Status: verified
> Stable ID: C-20260711-132
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 恢复 C127 T3-C；真实 smoke 仍等待固定 campaign 明确授权
> Replaces: none
> Replaced by: none
> Related plans: C-20260711-131
> Related tests: TC-MENU-TOOLS-132-01..04、TC-E2E-MENU-TOOLS-132-01

| Case ID                  | 层级 | 场景                       | 预期结果                                              | 自动化路径                          | 状态   |
| ------------------------ | ---- | -------------------------- | ----------------------------------------------------- | ----------------------------------- | ------ |
| TC-MENU-TOOLS-132-01     | L3   | 读取中文菜单数据           | 首组为学习工具，route name 依次为 complexity、paths   | `src/views/Docs/Menu/hooks.spec.ts` | active |
| TC-MENU-TOOLS-132-02     | L4   | 中文复杂度页挂载侧边栏     | 渲染 94 项并高亮“算法复杂度速查”                      | `src/views/Docs/Menu/Menu.spec.ts`  | active |
| TC-MENU-TOOLS-132-03     | L3   | 对比中英文完整菜单         | 均为 10 组，去除英文 route name 前缀后逐组同序        | `src/views/Docs/Menu/Menu.spec.ts`  | active |
| TC-MENU-TOOLS-132-04     | L3   | 对比 Home、Menu 与 router  | Home 保持 92 学习项，Menu 另含 2 工具且 94 项均有路由 | `src/router/index.spec.ts`          | active |
| TC-E2E-MENU-TOOLS-132-01 | L5   | 从中文侧边栏点击复杂度速查 | URL 进入 `/docs/complexity`，正文 H1 为“复杂度速查表” | `e2e/docs-menu.e2e.ts`              | active |

## 执行记录

- 红灯：3 个定向 Vitest 文件中 5 条失败，准确复现中文菜单缺少工具组。
- 绿灯：定向 Vitest 18/18；定向 Playwright 2/2。
- 全量：299 个 Vitest 文件 / 2131 条、104 个 Playwright 文件 / 118 条、coverage、production 190 页均通过。
- 视觉：1440/900/720 宽度通过；390px 既有最小宽度限制已作为独立风险披露。
