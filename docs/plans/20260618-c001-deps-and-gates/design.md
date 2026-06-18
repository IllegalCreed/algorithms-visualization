# 设计：工具链现代化

> Status: approved
> Stable ID: C-20260618-001
> Type: ops
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 10%
> Blocked by: none
> Next action: 执行升级与破坏性迁移
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: none
> Related requirement: requirements.md

## 总体方案

分四步推进，每步以 `type-check` + `build` 作为关卡：①切 pnpm → ②全量升级 + 破坏性迁移 → ③接入 lint/format 门禁 → ④更新 CI。验证由编译器/构建器实际报错驱动，不预先大改代码。

## 1. 包管理器迁移（npm → pnpm）

- 删除 `package-lock.json`、`yarn.lock`。
- `package.json` 增加 `"packageManager": "pnpm@<corepack 版本>"`（锁定 10.x，由 corepack 提供）。
- `pnpm install` 生成 `pnpm-lock.yaml`。
- `.gitignore` 确认忽略 `node_modules`；无需忽略 lockfile。
- 风险：pnpm 默认严格 node_modules（非扁平），可能暴露隐式依赖（phantom deps）。本项目依赖简单，预计无影响；如有缺包按报错显式补 `dependencies`。

## 2. 依赖升级与破坏性迁移

直接把 `package.json` 各依赖写成 latest 版本号后 `pnpm install`，再按报错处理。关注点：

| 包                                           | 升级        | 关注点                                                                                                     |
| -------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| typescript 5.4 → 6                           | major       | 移除的废弃选项、更严格的类型；调 tsconfig（如有报错）                                                      |
| vue 3.4 → 3.5                                | minor       | 兼容，基本无感                                                                                             |
| vue-router 4 → 5                             | major       | 核对迁移指南；本项目仅用 createRouter/createWebHistory/RouterView/useRoute/onBeforeRouteUpdate，预计影响小 |
| pinia 2 → 3                                  | major       | drop 旧 Vue 支持、TS 要求提高；本项目用 createPinia + setup-style defineStore，预计无需改代码              |
| vite 5 → 8                                   | 跨 3 major  | 配置 API、Node 要求、less 集成、env 加载（`loadEnv`）；以 `vite build` 报错为准                            |
| @vitejs/plugin-vue 5 → 6                     | major       | 与 vite 8 对齐                                                                                             |
| vitest 1 → 4                                 | 跨 3 major  | 无测试文件，升级近乎无感；需与 vite 8 peer 对齐；`tsconfig.vitest.json` 保留                               |
| vue-tsc 2 → 3                                | major       | 与 TS 6 对齐；`type-check` 脚本 `vue-tsc --build`                                                          |
| jsdom 24 → 29                                | major       | 仅测试环境用，无测试暂无影响                                                                               |
| npm-run-all2 6 → 8                           | major       | `build` 脚本用其 `run-p`；与包管理器无关，保留                                                             |
| less / @vue/test-utils / @tsconfig/node20 等 | minor/patch | 低风险                                                                                                     |

- 回退策略：若单个大版本短期不可控，回退到次新稳定版并在 `implementation.md` 记录原因；其余保持 latest。

## 3. 代码门禁（ESLint + Prettier）

- **ESLint flat config**：`eslint.config.ts`（或 `.js`），组合：
  - `@vue/eslint-config-typescript`（typescript-eslint 的 Vue 封装，处理 `.vue` + TS）
  - `eslint-plugin-vue` 的 `flat/recommended`
  - `@vue/eslint-config-prettier`（放最后，关闭与 Prettier 冲突的格式化规则）
- **Prettier**：`.prettierrc.json`（最小配置）+ `.prettierignore`（dist、pnpm-lock、node_modules）。
- **package.json 脚本**：
  - `lint`：`eslint . --fix`
  - `lint:check`：`eslint .`（CI 用，不自动改）
  - `format`：`prettier --write .`
  - `format:check`：`prettier --check .`（CI 用）
- **起步策略**：先 `prettier --write` 全量归一，再让 `lint:check` 通过；规则若与现有代码冲突过多，先降为 warn，后续收紧（记入 implementation）。
- **pre-commit**：husky（`.husky/pre-commit`）调用 lint-staged；`lint-staged` 配置对 `*.{ts,vue}` 跑 `eslint --fix`、对 `*.{ts,vue,less,json,md}` 跑 `prettier --write`。

## 4. CI 更新（`.github/workflows/deploy.yml`）

- `Setup Node` 后增加 `pnpm/action-setup`（或 corepack enable），缓存改 `pnpm`。
- 安装改 `pnpm install --frozen-lockfile`。
- 在 `Build` 前增加门禁步骤：`pnpm type-check`、`pnpm lint:check`、`pnpm format:check`。
- 构建仍 `pnpm build`，上传 `dist`。
- 部署 job 不变。
- 注：当前仅有 deploy.yml 一个工作流，门禁直接并入其 build job；不单开 ci.yml，避免重复安装。

## 测试设计

本变更不产出业务测试用例。验证为工具链级冒烟：`pnpm install` / `type-check` / `build` / `lint:check` / `format:check` + 本地 `pnpm dev` 页面冒烟。L3/L4/L5 自动化测试缺位，归 M1。

## 风险与替代方案

- **零测试兜底弱**：靠编译期 + 构建 + 人工冒烟。项目体量小、运行时代码简单，风险可控。
- **为何选 ESLint+Prettier 而非 oxlint+oxfmt**：Vue SFC 项目，`eslint-plugin-vue` 对 `.vue` 覆盖最全且官方维护；oxlint 对 `.vue` 支持不完整、oxfmt 未成熟。oxlint 作为后续可选的快速预检保留。
- **回滚**：整个变更在 `chore/deps-and-gates` 分支；任何不可控问题可整体弃用分支回到 `main`。
