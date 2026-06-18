# 实现记录：M1 测试体系

> Status: verified
> Stable ID: C-20260618-003
> Type: test-infrastructure
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: 已完成（M2 bugfix 见遗留问题）
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-001
> Related tests: `docs/test-cases/index.md`
> Related design: design.md

## 改动清单

### Task 1：Vitest + V8 覆盖率配置

- 新建 `vitest.config.ts`：environment `jsdom`、globals `true`、coverage provider `v8`、reporters `text + html`、thresholds `{ lines: 70, branches: 60, functions: 70, statements: 70 }`
- 新建 `tsconfig.vitest.json`
- `package.json` 增加脚本 `test:unit`（vitest）、`coverage`（vitest --coverage）

### Task 2：BubbleSort 算法纯函数抽离

- 新建 `src/algorithms/bubble-sort.ts`：导出 `SortStep` 接口 + `bubbleSortSteps(input: number[]): SortStep[]` 纯函数（无副作用）
- 修改 `src/views/Article/SortAlgorithm/BubbleSort.vue`：改为调用 `bubbleSortSteps()` 获取步骤序列，再逐步驱动 `numArray` / `pointerArray` 动画（渲染行为不变）
- 新建 `src/algorithms/bubble-sort.spec.ts`（L3 算法单元测试，6 个 case）

### Task 3：store 单元测试

- 新建 `src/store/modules/system.spec.ts`（L3，4 个 case）

### Task 4：hooks 单元测试

- 新建 `src/views/Home/Main/hooks.spec.ts`（L3，5 个 case）
- 新建 `src/views/Docs/Menu/hooks.spec.ts`（L3，4 个 case）

### Task 5：viz-engine 组件测试 + Block.vue typo 修复

- 新建 `src/components/Arrow.spec.ts`（L4，1 个 case）
- 新建 `src/components/ArrowTrack.spec.ts`（L4，1 个 case）
- 新建 `src/components/Block.spec.ts`（L4，3 个 case）
- 新建 `src/components/List.spec.ts`（L4，2 个 case）
- **Bug 修复**：`src/components/Block.vue` class 名 `'block'`→`'black'`（原 typo 导致文字色 CSS 选择器无效，测试发现、同步修复）

### Task 6：Home hooks 测试

- 新建 `src/views/Home/hooks.spec.ts`（L3，4 个 case，useControlHeaderShadow scroll 监听器）

### Task 7：Master Header hooks 测试

- 新建`src/views/Master/Header/hooks.spec.ts`（L3，3 个 case，useIconLink）

### Task 8：BubbleSort 组件测试

- 新建 `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`（L4，2 个 case，fake timers）

### Task 9：视图组件测试（Home/Docs/Master）

- 新建 `src/views/Home/Footer/Footer.spec.ts`（L4，4 个 case）
- 新建 `src/views/Home/Main/Category/Category.spec.ts`（L4，6 个 case）
- 新建 `src/views/Home/Main/Category/Item/Item.spec.ts`（L4，6 个 case）
- 新建 `src/views/Home/Splash/Splash.spec.ts`（L4，5 个 case）
- 新建 `src/views/Docs/hooks.spec.ts`（L3，2 个 case，useControlHeaderShadow）
- 新建 `src/views/Docs/Menu/Header/Item/Item.spec.ts`（L4，6 个 case）
- 新建 `src/views/Docs/Menu/Menu.spec.ts`（L4，8 个 case，含 onBeforeRouteUpdate 捕获）
- 新建 `src/views/Master/Header/Header.spec.ts`（L4，7 个 case）
- 新建 `src/views/Master/Header/IconLink/IconLink.spec.ts`（L4，6 个 case）

### Task 10：Playwright e2e 配置 + 首页导航 e2e

- 新建 `playwright.config.ts`：webServer `pnpm dev`、testDir `e2e/`、单浏览器 chromium
- `package.json` 增加脚本 `test:e2e`
- `.gitignore` 增加 `playwright-report/`、`test-results/`
- 新建 `e2e/home-navigation.e2e.ts`（L5，1 个 case）

### Task 11：docs-menu e2e

- 新建 `e2e/docs-menu.e2e.ts`（L5，1 个 case，#menu 作用域点击）

### Task 12：bubble-sort e2e

- 新建 `e2e/bubble-sort.e2e.ts`（L5，1 个 case，`test.setTimeout(120s)`+`toPass({ timeout: 90000 })`）

### Task 13：全局测试索引 + 回填文档（本任务）

- 重写 `docs/test-cases/index.md`：83 个 Case 全量登记
- 新建 `docs/test-cases/by-layer.md`：L3/L4/L5 分组视图
- 新建 `docs/test-cases/by-module.md`：algorithms/store/viz-engine/home/docs/article-sort/master 分组视图
- 回填本文件（implementation.md）
- 回填 `test-cases.md`
- 更新 `docs/plans/index.md`：C-003 状态 draft→verified、完成度 100%
- 更新 `docs/roadmap.md`：M1 状态 in-progress→done

## 实际涉及文件

**新建（测试文件，23 个）：**

```
src/algorithms/bubble-sort.spec.ts
src/store/modules/system.spec.ts
src/views/Home/Main/hooks.spec.ts
src/views/Home/hooks.spec.ts
src/views/Home/Footer/Footer.spec.ts
src/views/Home/Main/Category/Category.spec.ts
src/views/Home/Main/Category/Item/Item.spec.ts
src/views/Home/Splash/Splash.spec.ts
src/views/Docs/hooks.spec.ts
src/views/Docs/Menu/hooks.spec.ts
src/views/Docs/Menu/Menu.spec.ts
src/views/Docs/Menu/Header/Item/Item.spec.ts
src/views/Article/SortAlgorithm/BubbleSort.spec.ts
src/components/Arrow.spec.ts
src/components/ArrowTrack.spec.ts
src/components/Block.spec.ts
src/components/List.spec.ts
src/views/Master/Header/hooks.spec.ts
src/views/Master/Header/Header.spec.ts
src/views/Master/Header/IconLink/IconLink.spec.ts
e2e/home-navigation.e2e.ts
e2e/docs-menu.e2e.ts
e2e/bubble-sort.e2e.ts
```

**新建（配置 / 基础设施）：**

```
vitest.config.ts
tsconfig.vitest.json
playwright.config.ts
src/algorithms/bubble-sort.ts
```

**修改（源码 + 配置）：**

```
src/views/Article/SortAlgorithm/BubbleSort.vue   -- 算法抽离 + 调用 bubbleSortSteps
src/components/Block.vue                          -- typo 修复 'block'->'black'
package.json                                      -- 增加 test:unit / coverage / test:e2e 脚本
.gitignore                                        -- 增加 coverage/ playwright-report/ test-results/
```

**修改（文档）：**

```
docs/test-cases/index.md
docs/test-cases/by-layer.md       （新建）
docs/test-cases/by-module.md      （新建）
docs/plans/20260618-c003-test-suite/implementation.md
docs/plans/20260618-c003-test-suite/test-cases.md
docs/plans/index.md
docs/roadmap.md
```

## 与设计偏差

- 设计中 ArrowTrack 测试打算覆盖 `genOffect` 函数，实际通过 props→渲染断言（translateX）间接覆盖，未抽离导出。与设计 §2 L3 注释一致（不强行抽离）。
- Task 4 中 `useMenuSelect` 因依赖 `provide`/`onBeforeRouteUpdate` 生命周期上下文，无法在 hooks.spec 中独立测试，留在 Task 9 的 Menu 组件挂载测试中覆盖（见 TC-VIEW-MENU-06/08）。

## 踩坑与处理

1. **Block.vue typo**（Task 5）：`Block.vue` 中文字色使用 CSS 选择器 `.block`（应为 `.black`），导致 `percent<0.5` 时文字色断言失败。定位为源码 typo，在 Task 5b 中修复，测试改为双向断言（black/not-white、white/not-black）。
2. **onBeforeRouteUpdate 单元测试**（Task 9）：路由导航守卫在 jsdom 中无法真实触发。解决方案：mock 时用 `vi.fn((cb) => { capturedBeforeRouteUpdateCallback = cb; })` 捕获注册的回调，测试中手动调用 + `await nextTick()` 断言。
3. **BubbleSort e2e 超时**（Task 12）：冒泡动画 10 元素需数十秒，Playwright 默认 30s 超时不足。使用 `test.setTimeout(120_000)` + `toPass({ timeout: 90_000 })` 轮询最终状态，避免固定 sleep。
4. **jsdom 中 fake timers**（Task 8）：BubbleSort 组件使用 `setTimeout` 驱动动画。L4 测试只验证初始渲染快照，使用 `vi.useFakeTimers()` / `vi.useRealTimers()` 防止动画泄漏至后续测试。

## 数据处理

不适用（纯前端）。

## 验证记录

### L3 + L4 全量单元测试（`pnpm test:unit`）

- 测试文件：20 个 spec
- 测试用例：80 个（全绿）
- 覆盖率（`pnpm coverage`）：

| 指标       | 实际值 | 阈值 | 状态 |
| ---------- | ------ | ---- | ---- |
| Statements | 77.04% | 70%  | 达标 |
| Branches   | 88.46% | 60%  | 达标 |
| Functions  | 80.70% | 70%  | 达标 |
| Lines      | 77.24% | 70%  | 达标 |

### L5 e2e（`pnpm test:e2e`）

- 测试文件：3 个 e2e
- 测试用例：3 个（全绿）

| e2e 文件                     | 描述                  | 结果 |
| ---------------------------- | --------------------- | ---- |
| `e2e/home-navigation.e2e.ts` | 首页加载并能进入 docs | 通过 |
| `e2e/docs-menu.e2e.ts`       | docs 菜单点击切换路由 | 通过 |
| `e2e/bubble-sort.e2e.ts`     | 冒泡排序动画最终升序  | 通过 |

## 遗留问题

### ① Block.vue typo（已修复）

**状态：已在本变更 Task 5b 修复。**

`Block.vue` 中 class 名 `'block'` 应为 `'black'`，原 CSS 选择器 `.black { color: white }` / `.block` 不匹配，导致 `percent >= 0.5` 时文字始终显示 black 而非 white。已修复并通过双向断言验证。

### ② Splash「开始学习」路由跳转 bug（pre-existing，未修，留 M2）

**状态：已知 bug，未修复，留 M2 或独立 bugfix。**

`Splash.vue` 中「开始学习」按钮调用 `router.push({ name: 'docs', params: { page: 'array' } })`。`params.page` 在当前路由定义中无效（路由 `docs` 不接受 `page` 动态参数），实际跳转到空 `/docs` 页面而非 `/docs/array`。

**影响**：用户点击「开始学习」进入 docs 壳页，无法定位到「数组」文章；L5 e2e `home-navigation.e2e.ts` 只断言 URL 含 `/docs`，当前通过，但未验证实际内容。

**建议修复**：改为 `router.push({ name: 'array' })`（直接跳转到具名路由 `array`）。

### ③ Home/Main vs Docs/Menu 排序算法条目数不一致（已知，留 M2）

`Home/Main/hooks` 的 `useCategoryData` 排序算法分类返回 8 项（TC-HOOK-01-2 断言），`Docs/Menu/hooks` 的 `useCategoryData` 返回 10 项（TC-HOOK-02-4 断言）。两处数据来源不同，属已知的菜单数据不同步，留 M2 补全算法时一并统一。

### ④ Minor 改进点（低优先级）

- `docs-menu.e2e.ts`：当前只断言 URL 含 `bubble-sort`，未验证当前菜单项高亮变化，测试稍弱。
- `Category.spec.ts`：mock 中 icon 路径为裸字符串（`array.svg`），实际运行时 Vite 会处理 import，测试与运行时差异可接受，但后续可引入 `vi.mock` 规范化。
- `Menu.spec.ts`：排序菜单 10 项 vs 首页 8 项不一致，TC-VIEW-MENU-04 仅断言含「数组」「链表」，未全量断言条目数，与 TC-HOOK-02-4 有细节差异——均为已知且可接受。
