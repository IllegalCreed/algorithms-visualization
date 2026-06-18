# 需求：工具链现代化（依赖升级 + pnpm + lint 门禁）

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

## 背景

项目依赖停留在 2024 年版本（vite 5、vitest 1、pinia 2、vue-router 4、typescript 5.4 等），多项已落后 2~3 个大版本；仓库同时存在 `package-lock.json` 与 `yarn.lock` 两个 lockfile，易不同步；且没有任何代码门禁（lint / format），代码风格与潜在错误无自动拦截。用户要求一次性现代化工具链。

## 要做什么

1. **全量升级依赖**：`dependencies` 与 `devDependencies` 全部升到 latest，包含破坏性大版本（pinia 3、vue-router 5、vite 8、vitest 4、typescript 6、vue-tsc 3、@vitejs/plugin-vue 6 等）。
2. **迁移包管理器到 pnpm**：删除 `package-lock.json` 与 `yarn.lock`，生成 `pnpm-lock.yaml`，在 `package.json` 加 `packageManager` 字段锁版本。
3. **接入代码门禁**：ESLint 9（flat config）+ `eslint-plugin-vue` + `@vue/eslint-config-typescript` + Prettier + `@vue/eslint-config-prettier`；新增 `lint` / `format` 等脚本。
4. **pre-commit 钩子**：husky + lint-staged，提交前对暂存文件自动 lint + format。
5. **CI 接入门禁**：`.github/workflows/deploy.yml` 改用 pnpm，并在构建前卡 `type-check` + `lint` + `format:check`。

## 不做什么（边界）

- **不改业务逻辑与 UI 行为**：仅在破坏性迁移确有必要时做最小适配性改动（如配置 API 变更），不重构、不改动画/样式表现。
- **不补算法功能**：菜单中缺失的排序算法/数据结构本次不实现（归 M2）。
- **本次不补 L3/L4/L5 自动化测试**：测试体系单列后续 `test-infrastructure` plan（M1）。验证仅靠 `type-check` + `build` + 本地冒烟。
- **不改部署目标**：GitHub Pages 与 `VITE_BASE_URL` base 策略保持不变。
- **不引入 oxlint / oxfmt**：作为后续可选项，本次主门禁用 ESLint。

## 业务规则 / 约束

- 升级后 `pnpm build`（含 `vue-tsc` type-check）必须通过。
- 本地 `pnpm dev` 下首页、`bubble-sort` 动画、docs 侧边菜单导航冒烟正常。
- `lint` 与 `format:check` 可运行；现有代码若有大量风格差异，允许先 `format` 一次性归一 + 规则起步从宽（warn），不阻塞本次落地。

## 边界与异常

- pnpm 通过 corepack 提供（已确认 10.29.2 可用）。
- 破坏性升级可能导致 type-check / build 报错：逐个按编译器/构建器实际报错修复，不预先大改。
- 若某大版本升级引入不可控破坏且短期难解，记录在 `implementation.md` 偏差中，必要时该单项回退到次新稳定版并说明。

## 验收口径

- [ ] 仅保留 `pnpm-lock.yaml`，`package-lock.json` / `yarn.lock` 已删除。
- [ ] `pnpm install` 干净通过。
- [ ] `pnpm type-check`、`pnpm build` 全绿。
- [ ] `pnpm lint`、`pnpm format:check` 可运行且无阻塞性错误。
- [ ] pre-commit 钩子生效。
- [ ] 本地冒烟（首页 / 冒泡排序 / docs 菜单）正常。
- [ ] CI 配置已改为 pnpm 并含门禁步骤。

## 开放问题

- 是否后续引入 oxlint 做提交前快速预检（owner: 用户，待定）。
- L3/L4/L5 测试体系落地排期（owner: 用户，归 M1）。

## 变更历史

- 2026-06-18：创建，依据用户「全量升级 + pnpm + 我来选型门禁」的决策。
