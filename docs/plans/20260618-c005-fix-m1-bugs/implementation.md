# 实现记录：修复 M1 发现的 bug

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
> Related plans: C-20260618-003
> Related tests: TC-VIEW-SPLASH-05、TC-HOOK-02-4
> Related requirement: requirements.md

## 改动清单

**Bug 1（Splash 路由）**

- `src/views/Home/Splash/Splash.vue`：`router.push({ name: 'array' })`（原 `{ name: 'docs', params: { page: 'array' } }`）。
- `src/views/Home/Splash/Splash.spec.ts`：TC-VIEW-SPLASH-05 断言改 `{ name: 'array' }`，删除 pre-existing-bug 注释。
- `e2e/home-navigation.e2e.ts`：断言收紧为 URL 含 `/docs/array`，删除 bug 注释。

**Bug 2（菜单条目一致性）**

- `src/views/Docs/Menu/hooks.ts`：删除排序分类的 `桶排序`/`基数排序` 两项（10 → 8，与 Home 一致）。
- `src/views/Docs/Menu/hooks.spec.ts`：TC-HOOK-02-4 断言排序分类 8 项。

## 实际涉及文件

`Splash.vue`、`Splash.spec.ts`、`home-navigation.e2e.ts`、`Docs/Menu/hooks.ts`、`Docs/Menu/hooks.spec.ts`

## 与设计偏差

无。`Menu.spec.ts` 经核不断言 bucket/radix 或条目数，无需改。

## 验证记录

- `pnpm test:unit run`：20 文件 85 测试全绿。
- `pnpm type-check`：通过。
- `pnpm test:e2e e2e/home-navigation.e2e.ts`：通过（「开始学习」→ `/docs/array`，确认 Splash 修复）。

## 遗留问题

- bucket/radix 及其余排序算法、各数据结构页内容 = M2（roadmap 已记）。
