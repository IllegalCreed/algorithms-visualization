# 需求：M1 测试体系落地

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
> Related plans: C-20260618-001（提供 Vitest/工具链）
> Related tests: 本变更建立首批 Case

## 背景

项目当前 0 自动化测试。M1 目标：落地 L3/L4/L5 测试体系，给现有代码**全量补测试**，建立可持续的测试基础设施与全局测试索引。Vitest/jsdom/@vue/test-utils 已随 C-001 装好但未配置覆盖率，Playwright 尚未引入。

## 要做什么

1. **测试基础设施**：Vitest 配置（L3/L4）+ V8 覆盖率 + Playwright 配置（L5）。
2. **全量测试**：
   - L3 单元：Pinia store、所有 `hooks.ts`、抽离后的算法逻辑、可抽离的纯函数。
   - L4 组件：可视化引擎（List/Block/Arrow/ArrowTrack）+ 所有视图组件。
   - L5 端到端：首页→docs 导航、菜单切换+高亮、bubble-sort 动画跑通。
3. **BubbleSort 算法逻辑抽离**：把纯排序逻辑从 `BubbleSort.vue` 抽到 `src/algorithms/bubble-sort.ts`（返回排序过程步骤序列），组件消费它播放动画。**行为不变**，为可测性与 M2 立「纯逻辑 + 可视化组件」分离模式。
4. **覆盖率本地门槛**：沿用通用测试规范默认值（核心 ≥85%/75%、一般 ≥70%/60%），配为 Vitest thresholds（本地卡，不卡 CI）。
5. **全局测试索引**：建 `docs/test-cases/index.md` + `by-layer.md` + `by-module.md`，登记所有 Case ID（双维度可查）。
6. **组织**：co-locate（`*.spec.ts` 贴源码，`e2e/` 单独），功能化命名（规范 §5.3）。

## 不做什么（边界）

- **不加 CI 测试门禁**：`.github/workflows/deploy.yml` 不动，测试本地跑。
- **不改 UI / 动画表现**：BubbleSort 抽离后行为保持不变。
- **不补新算法 / 数据结构**：菜单中缺失项归 M2。
- **不改业务逻辑**：除为可测性做的 BubbleSort 抽离。

## 业务规则 / 约束

- 所有测试本地 `pnpm test:unit` / `pnpm test:e2e` 可跑、全绿。
- 覆盖率达本地门槛；本项目无认证/权限/金额等安全敏感代码 → 无安全类 100% 要求。
- 测试遵循规范：精确断言（不写 ≥N 条松断言）、功能化命名、反例 case（如菜单未实现路由的处理）。

## 验收口径

- [ ] L3/L4 测试全绿，覆盖率达本地门槛。
- [ ] L5 e2e 关键路径全绿。
- [ ] BubbleSort 抽离后动画行为不变（L4/L5 验证）。
- [ ] 全局测试索引建立，所有 Case ID 双维度（层级 + 模块）可查。
- [ ] `pnpm test:unit` / `pnpm test:e2e` 脚本可用。

## 开放问题

- L4 展示型组件（Footer/Splash 等无交互）测试粒度：设计里按「测渲染快照/关键元素，不强求交互 case」处理。

## 变更历史

- 2026-06-18：创建。brainstorming 设计确认：全量 L3/L4+L5、co-locate、不卡 CI、BubbleSort 抽离、覆盖率本地门槛。
