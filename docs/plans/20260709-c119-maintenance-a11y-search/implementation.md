# 实现记录：维护期搜索与可访问性收束（C-20260709-119）

> Status: verified
> Stable ID: C-20260709-119
> Owner: IllegalCreed
> Created: 2026-07-09
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序

1. SearchPalette：补 tokens、拼音首字母、别名、dialog/listbox/option 语义。
2. Player 表单与控制条：补 label、aria、错误播报和焦点样式。
3. 导航语义：可导航元素改 RouterLink，外链改 `<a>` 安全属性。
4. 防回归：新增 router 覆盖测试；List 全等值 percent 兜底。
5. 回写计划与测试索引，跑门禁。

## 关键实现笔记

- 搜索索引仍从首页九大类数据拍平，不额外维护 92 条完整目录；别名只维护少量高频项，英文名主要由 slug 派生。
- 拼音映射与 token 构造提取到 `searchIndex.ts`；完整性测试覆盖 92 个条目、9 个分类及标题语境中的多音字。
- RouterLink 改造保留原 CSS class，测试从 mock `router.push` 改为断言 `to` prop。
- `List.vue` 的 0.5 是中性透明度；旧的 min/max 归一化在非全等数组中保持不变。

## 自测报告

- 目标单测：12 个文件 / 81 条通过。
- `pnpm format:check`：通过。
- `pnpm lint:check`：通过。
- `pnpm type-check`：通过。
- `pnpm build-only`：通过。
- `pnpm test:unit:run`：278 个测试文件 / 2023 条用例通过。
- `pnpm coverage`：278 个测试文件 / 2023 条用例通过；Statements 96.36%，Branches 95.68%，Functions 94.85%，Lines 96.84%。
- `pnpm test:e2e`：107 条用例通过。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：本地门禁通过（implemented → verified）。
- 2026-07-10：收口审计补齐拼音完整性与多音字用例，目标测试更新为 81 条。
