# 需求：修复 M1 发现的 pre-existing bug

> Status: verified
> Stable ID: C-20260618-005
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-003（补测试时发现这些 bug）
> Related tests: TC-VIEW-SPLASH-05、TC-HOOK-02-4、home-navigation e2e

## 背景

M1 测试体系（C-003）补测试时发现 2 个 pre-existing bug（Block typo 已在 C-003 顺手修复，此处修剩余 2 个）。

## 复现与根因

**Bug 1：Splash「开始学习」跳到空页**

- 复现：首页点「开始学习」→ 落到空 `/docs` 壳页，看不到任何文章。
- 预期 vs 实际：预期进入文章页；实际只到空 `/docs`。
- 根因：`Splash.vue` 调 `router.push({ name: 'docs', params: { page: 'array' } })`，但路由 `docs` 无 `:page` 动态参数，vue-router 运行时丢弃 `page`（控制台 warn `Discarded invalid param "page"`），只跳 `/docs`。

**Bug 2：Home / Docs 排序菜单条目不一致**

- 复现：首页排序分类 8 项，docs 侧边菜单 10 项（多 `bucket-sort`/`radix-sort`）。
- 根因：两处 `useCategoryData` 数据不同步；且这两个算法未实现，点击 404。

## 要做什么

1. `Splash.vue`：改 `router.push({ name: 'array' })`（用户选 array 原意图，跳 `/docs/array`）。
2. `Docs/Menu/hooks.ts`：删 `bucket-sort`/`radix-sort`（与 Home 一致 8 项，用户选；M2 实现时再加回）。
3. 同步更新测试：`Splash.spec`（TC-VIEW-SPLASH-05）、`home-navigation.e2e`、`Docs/Menu/hooks.spec`（TC-HOOK-02-4）。

## 不做什么

- 不实现 bucket/radix 或其他排序算法（M2）。
- 不改 `array` 页内容（仍是占位空壳，M2 填充）。

## 验收口径

- [ ] `pnpm test:unit` 全绿；`home-navigation` e2e 断言 `/docs/array` 通过。
- [ ] docs 排序菜单 8 项，与 Home 一致。

## 防复发（回归用例）

- `TC-VIEW-SPLASH-05`：断言 `mockPush` 以 `{ name: 'array' }` 调用。
- `home-navigation.e2e`：断言 URL 含 `/docs/array`。
- `TC-HOOK-02-4`：断言排序分类 8 项。

## 变更历史

- 2026-06-18：创建并完成。修复方向（Splash→array、Docs 删 bucket/radix）经用户确认。
