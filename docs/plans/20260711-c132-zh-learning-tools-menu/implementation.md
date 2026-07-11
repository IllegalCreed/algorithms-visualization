# 实现记录：中文侧边栏补齐学习工具

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
> Related plans: C-20260705-114、C-20260705-115、C-20260709-119、C-20260711-131
> Related tests: TC-MENU-TOOLS-132-01..04、TC-E2E-MENU-TOOLS-132-01

## 只读审计

- `/docs/complexity`、`/docs/paths` 及页面均存在。
- `LOCALIZED_PAGE_PAIRS` 已登记两组 tool 页面，英文菜单因此显示 `Learning Tools`。
- 中文菜单数据只有九个学习分类；现有测试通过 `slice(1)` 主动忽略英文工具组。

## 实施记录

- 红灯：`pnpm test:unit run src/views/Docs/Menu/hooks.spec.ts src/views/Docs/Menu/Menu.spec.ts src/router/index.spec.ts` 得到 3 个文件失败、5 条失败；证据为中文仅 92 项、无学习工具组且完整目录不对齐。
- 最小实现：在中文 `useCategoryData()` 首位加入“学习工具”，子项 route name 固定为 `complexity`、`paths`；不改页面、router、Home 或 SEO registry。
- 绿灯：同一命令 3 个文件 / 18 条通过；新增 Playwright 定向文件 2/2 通过。
- 全门禁：`pnpm verify` 通过，299 个 Vitest 文件 / 2131 条用例与 production 190 页预渲染/SEO 校验全绿。
- 覆盖率：Statements 95.48%、Branches 86.31%、Functions 92.03%、Lines 95.82%。
- L5：104 个文件 / 118 条用例全绿。
- 视觉：1440、900、720 宽度无横向溢出，菜单与正文间距稳定，选中项文本完整；控制台无 warning/error。
- 残余风险：390px 下 Docs 既有双栏布局不可用；roadmap 已明确项目当前最小宽度 600px，真正手机响应式需独立计划，不混入本次导航修复。

## 文件范围

- `src/views/Docs/Menu/hooks.ts`
- `src/views/Docs/Menu/hooks.spec.ts`
- `src/views/Docs/Menu/Menu.spec.ts`
- `src/router/index.spec.ts`
- `e2e/docs-menu.e2e.ts`
- C132 四文档、计划索引、测试索引及 C131 受影响记录
