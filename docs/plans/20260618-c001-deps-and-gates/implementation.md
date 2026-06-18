# 实现记录：工具链现代化

> Status: verified
> Stable ID: C-20260618-001
> Type: ops
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: none（已合并 main，GitHub Actions CI 门禁实跑通过）
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: none
> Related design: design.md

## 改动清单

**包管理器（npm/yarn → pnpm）**

- 删除 `package-lock.json`、`yarn.lock`，生成 `pnpm-lock.yaml`。
- `package.json` 增加 `"packageManager": "pnpm@10.29.2"`、`pnpm.onlyBuiltDependencies: ["esbuild"]`。

**依赖全量升级到 latest**

- 运行时：pinia 2→3、vue 3.4→3.5、vue-router 4→5。
- 工具链：vite 5→8、vitest 1→4、typescript 5.4→6、vue-tsc 2→3、@vitejs/plugin-vue 5→6、jsdom 24→29、npm-run-all2 6→9、@types/node→25、@vue/tsconfig→0.9、less→4.6 等。

**代码门禁（新增）**

- ESLint 10 + eslint-plugin-vue 10 + @vue/eslint-config-typescript 14 + Prettier 3 + @vue/eslint-config-prettier 10 + jiti。
- 配置：`eslint.config.ts`、`.prettierrc.json`、`.prettierignore`。
- 脚本：`lint` / `lint:check` / `format` / `format:check` / `prepare`。
- pre-commit：husky + lint-staged。

**CI**

- `.github/workflows/deploy.yml` 改 pnpm（`pnpm/action-setup@v4`）、Node 20→22，构建前加 `lint:check` / `format:check` / `type-check` 门禁，构建用 `build-only`。

## 实际涉及文件

- 配置：`package.json`、`pnpm-lock.yaml`、`tsconfig.app.json`、`eslint.config.ts`、`.prettierrc.json`、`.prettierignore`、`.husky/pre-commit`、`.github/workflows/deploy.yml`
- 代码适配：
  - `src/components/List.vue`、`src/views/Article/SortAlgorithm/BubbleSort.vue`：`@vue/reactivity` → `vue` 导入 `computed`
  - `src/vite-env.d.ts`：删除过时 `*.vue` 类型 shim
  - `src/views/Home/Main/hooks.ts`：删除未使用的 `RadixIcon` / `BucketIcon` import
  - `src/views/Docs/Menu/hooks.ts`：删除未使用的 `from` 参数
  - `src/views/About/About.vue` + 8 个 `Article/DataStructure/*.vue`：空 `<template>` 加 `<div>` 占位根元素
  - 全 `src/` 经 Prettier 归一 + ESLint `--fix`（`prefer-const` 等）

## 与设计偏差

- `@types/node` 跟随 latest（^25），未强制对齐 runtime（Node 22）；项目仅用稳定 node API，类型无影响。
- `vite-env.d.ts` 选择**删除**过时 `*.vue` shim（而非改写），vue-tsc 自带 `.vue` 类型，type-check 验证通过。
- 删除 `Home/Main/hooks.ts` 未使用的 `RadixIcon` / `BucketIcon` import（对应注释掉的桶排序/基数排序）；**M2 实现这两个排序时需恢复 import**。
- 关闭 `vue/multi-word-component-names`（项目页面/布局组件单字命名惯例）。

## 踩坑与处理

| 现象                                              | 根因                            | 处理                                                                        |
| ------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| `TS5101: baseUrl is deprecated`                   | TS 6 将 `baseUrl` 废弃为错误    | 删 `tsconfig.app.json` 的 `baseUrl`（`paths` 用 `./` 相对写法，本不依赖它） |
| `Cannot find module '@vue/reactivity'`            | pnpm 严格结构不暴露 phantom dep | `computed` 改从 `vue` 主包导入                                              |
| pnpm 提示 `Ignored build scripts: esbuild`        | pnpm 默认拦截依赖构建脚本       | `pnpm.onlyBuiltDependencies: ["esbuild"]`                                   |
| `vue/valid-template-root: requires child element` | 占位文章页 `<template>` 为空    | 加 `<div>` 占位根元素                                                       |

## 数据处理

不适用（无后端 / DB / migration）。

## 验证记录

按 CI 顺序在本地完整跑通（详见 `test-cases.md` V1–V9）：

- `pnpm install --frozen-lockfile` ✅（`prepare` 跑 husky）
- `pnpm lint:check` ✅ 0 错误
- `pnpm format:check` ✅ All matched files use Prettier code style
- `pnpm type-check` ✅
- `pnpm build-only` ✅ vite 8，产物输出 `dist/`
- 运行时冒烟（dev server + Playwright）✅ 首页 + `/docs/bubble-sort` 渲染正常、冒泡动画运行、**0 console error**

## 遗留问题

- pre-commit（V6）未单独触发演示，但 husky + lint-staged 已按标准配置，首次提交即生效。
- `@tsconfig/node20` 包名仍为 node20（环境 Node 22），仅 tsconfig 基础配置，无实际影响；可在后续 chore 换 `@tsconfig/node22`。
- L3/L4/L5 测试体系仍缺位，归 M1。
