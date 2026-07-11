# 设计：中文侧边栏补齐学习工具

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

## 根因

`src/views/Docs/Menu/hooks.ts` 的中文 `useCategoryData()` 仍是历史九类手写数组；英文 `useEnglishCategoryData()` 已由 locale catalog 派生，因此自动包含两个 `kind: 'tool'` 页面。`Menu.spec.ts` 又用 `englishCategories.slice(1)` 与中文九类比较，错误地把缺口固化为预期行为。

## 方案

- 在中文 `useCategoryData()` 首位增加固定“学习工具”分类，复用已存在的命名路由 `complexity`、`paths`。
- 不改变 Home catalog；router 契约从“首页与菜单全集相等”改为“菜单学习九类与首页相等，菜单另含两个工具且全部有路由”。
- 保留 C131 的学习九类顺序断言，新增 C132 的完整十类/94 项中英文对齐断言。
- L4 锁定中文渲染、数量和高亮；L5 从中文侧栏进入两个工具页之一并验证 URL/H1。

## 风险与回滚

- 风险仅为菜单长度增加导致滚动区域变长；现有侧栏本就支持纵向内容流，不增加新布局结构。
- 回滚只需移除新增分类与 C132 用例；页面和路由不受影响。

## 验证结论

- 方案按设计落地，中文菜单仅新增首组两项，Home catalog 与 190 页 registry 均未变化。
- 1440、900、720 宽度下无横向溢出、菜单/正文重叠或文本截断；项目既有 600px 最小宽度策略不在本缺陷中改写。
