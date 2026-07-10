# 需求：路线图维护期刷新（C-20260709-120）

> Status: verified
> Stable ID: C-20260709-120
> Owner: IllegalCreed
> Created: 2026-07-09
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

项目已在 C-20260705-118 进入 1.0 封版后的营销执行与维护期，C-20260709-119 又完成了一轮低风险维护修复。但 `docs/roadmap.md` 仍停留在 2026-06-29 的长表形态，保留了 C-034 等已被后续计划纠偏的旧描述，容易让后续 agent 把历史待办当成当前任务。

## 目标

1. 把 `docs/roadmap.md` 更新为维护期入口文档，只保留当前阶段、当前事实、维护队列和关键入口。
2. 明确 M0-M12 已完成，后续扩展必须回到 `completion-backlog` 或新计划评审。
3. 把历史计划明细交还给 `docs/plans/index.md`，避免 roadmap 继续复制超宽历史表。
4. 在 `docs/plans/index.md` 追加 C-120，保证本次文档维护可追溯。

## 非目标

- 不修改功能代码。
- 不新增算法页或营销物料。
- 不改写历史计划正文，不对 C-034 等历史文档做静默覆盖。

## 验收标准

- `docs/roadmap.md` 不再含有过期的“C-034 待 TDD / M5 增长首项”等当前待办表述。
- `docs/roadmap.md` 与 `docs/overview.md`、`docs/plans/completion-backlog.md` 对当前阶段和测试事实保持一致。
- `docs/plans/index.md` 能查到 C-20260709-120。
- 文档格式检查通过，diff 无尾随空白。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：文档格式与 diff 检查通过（implemented → verified）。
