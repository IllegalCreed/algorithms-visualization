# 设计：M1 测试体系

> Status: draft
> Stable ID: C-20260618-003
> Type: test-infrastructure
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 0%
> Blocked by: none
> Next action: 用户审 spec → writing-plans
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-001
> Related tests: none
> Related requirement: requirements.md

## 总体方案

四步推进：① BubbleSort 算法抽离（为可测）→ ② Vitest 配置 + 覆盖率 → ③ 全量 L3/L4 测试 → ④ Playwright + L5 e2e。每步以 `pnpm test:unit` / `pnpm test:e2e` 绿为关卡。测试 co-locate，命名功能化。

## 1. BubbleSort 算法逻辑抽离（前置重构，行为不变）

**现状**：`BubbleSort.vue` 的 `doSort()` 把「比较/交换逻辑」与「动画（mutate reactive + `await delay`）」耦合在组件里，无法单独测算法。

**方案**：抽出纯函数到 `src/algorithms/bubble-sort.ts`：

```ts
// 返回排序全过程的步骤序列，纯函数、无副作用、可测
export interface SortStep {
  array: number[];      // 该步的数组快照
  compare: [number, number]; // 本步比较的两个下标
  swapped: boolean;     // 是否发生交换
}
export function bubbleSortSteps(input: number[]): SortStep[] { ... }
```

`BubbleSort.vue` 改为：调用 `bubbleSortSteps(getInitialNum())` 得到步骤序列，再用 `await delay` 逐步驱动现有的 `numArray` / `pointerArray` 动画。**对外渲染与动画时序保持不变**（L4/L5 验证）。这也为 M2 的其他排序立下「`algorithms/*.ts` 纯逻辑 + 复用可视化组件」模式。

## 2. 测试分层设计

### L3 前端单元（Vitest，不 mount）

| 被测            | 文件                                 | 重点 case                                                                          |
| --------------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| 冒泡排序算法    | `src/algorithms/bubble-sort.spec.ts` | 已排序/逆序/含重复/单元素/空数组；步骤序列正确、最终有序、每步 compare 下标合法    |
| system store    | `src/store/modules/system.spec.ts`   | 初始值；changeDarkMode 切换；changeHeaderShadowe 设值；colors 内容                 |
| 菜单/分类 hooks | `src/views/**/hooks.spec.ts`         | useCategoryData 结构与 url 与路由一致；useMenuSelect 路由名联动（mock vue-router） |
| 纯函数          | 随组件 spec 或就近                   | List 归一化 percent（min→0、max→1）、ArrowTrack genOffect（index×60）              |

> List/ArrowTrack 的内联纯函数若不便导出，则在对应 L4 组件测试中通过 props→渲染断言间接覆盖，不强行抽离。

### L4 前端组件（Vitest + @vue/test-utils，mount）

| 组件               | 重点 case                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Block              | 按 percent 渲染背景透明度、显示数值、文字颜色阈值（<0.5 黑 / 否则白）                    |
| List               | 传入数组渲染对应数量 Block；min/max 归一化正确；TransitionGroup 存在                     |
| Arrow / ArrowTrack | 按 color 着色；按 index 定位（translateX）；多指针渲染                                   |
| BubbleSort         | 挂载后渲染 List+ArrowTrack+表达式；消费抽离算法（可 mock delay 加速）                    |
| 视图组件           | Splash/Category/Item/Header/IconLink/Menu 等：渲染关键元素、点击/导航交互（mock router） |

展示型无交互组件（Footer 等）：测关键元素渲染即可，不强求交互。

### L5 端到端（Playwright）

| 路径     | 步骤 / 断言                                                               |
| -------- | ------------------------------------------------------------------------- |
| 首页导航 | 打开 `/` → Splash 可见 → 点「开始学习」→ 进入 `/docs/*`                   |
| 菜单切换 | docs 侧边菜单点击 → 路由变化 + 当前项高亮                                 |
| 冒泡动画 | 访问 `/docs/bubble-sort` → 方块渲染 → 等待动画结束 → 断言方块数值最终升序 |

## 3. 工具与配置

- **Vitest**：`vitest.config.ts`（或并入 `vite.config`），`environment: jsdom`，`globals: true`；覆盖率 `provider: v8`，`reporter: text + html`，`thresholds`（lines/branches 按规范默认）。`tsconfig.vitest.json` 已存在，沿用。
- **Playwright**：`@playwright/test`，`playwright.config.ts`，`webServer` 自动 `pnpm dev`（base=/，端口固定），`testDir: e2e/`，单浏览器（chromium）起步。
- **脚本**：`test:unit`（已有，vitest）、`test:unit -- --coverage`、`test:e2e`（playwright test）。
- `.gitignore` 增加 `coverage/`、`playwright-report/`、`test-results/`。

## 4. 组织与命名（co-locate）

- L3/L4：`Foo.spec.ts` 紧贴 `Foo.vue` / `foo.ts`。
- L5：`e2e/<flow>.e2e.ts`。
- 命名功能化（规范 §5.3）：`bubble-sort.spec.ts`、`List.spec.ts`、`home-navigation.e2e.ts`，禁用 Phase/Stage 等内部代号。

## 5. 全局测试索引

建 `docs/test-cases/`：

- `index.md`：Case ID 主索引（owner plan = C-003、层级、自动化路径、状态、最后验证）。
- `by-layer.md`：L3 / L4 / L5 分层视图。
- `by-module.md`：viz-engine / home / docs-shell / article-sort 等模块视图。
- 同一 Case ID 在三处一致；一个用例归一个主层级，可属多个模块。

## 6. 风险与回滚

- **BubbleSort 抽离改动现有组件**：用 L4/L5 验证「动画行为不变」；改动隔离在 `bubble-sort.ts` + `BubbleSort.vue`，可单独回滚。
- **L5 flaky**：动画用「等待可判定的结束状态」而非固定 sleep；端口固定避免冲突。
- **全量工作量大**：按 L3→L4→L5 分阶段，每阶段独立可交付。
