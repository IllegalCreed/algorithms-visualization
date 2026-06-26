# 需求：队列·双端（队列页加一节「双端队列 Deque：两端都能进出」，M4 深度第四项 D4）

> Status: verified
> Stable ID: C-20260626-026
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Progress: 100%
> Blocked by: none
> Next action: 已完成（20 Case 全绿，全门禁通过，已落 main）；**M4 深度 D4 ✓**，下一项 D5 数组·扩容
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-016（队列/FIFO——本变更在其页**加一节**，补当年所砍的双端队列）；M4 候选池 `docs/plans/backlog.md` D4；C-20260626-025（D3，同为「现有页加节」范式）
> Related tests: 计划新增 `TC-DEQUE-LOGIC-*`（useDeque 纯逻辑）/ `TC-VIZ-DEQUEVIZ-*`（DequeViz 互动）/ `TC-VIEW-QUEUE-03`（队列页含 DequeViz）/ `TC-E2E-QUEUE-02`（队列页双端节 e2e）；不改写现有 TC-VIEW-QUEUE-01/02、修一处 TC-E2E-QUEUE-01（两 Playground 后 `.playground` 消歧）

## 背景

M4「数据结构深化与扩充」**深度第四项 D4**。队列页（C-016）只讲了**普通队列**：FIFO，只能**尾进头出**。requirements「不做什么」当年砍掉了**循环队列 / 双端队列 / 优先队列**（见 `docs/plans/backlog.md` D4）。本变更在队列页**加一节**，补上**双端队列 deque**——头尾两端都能进、都能出，是栈和队列的共同推广。

落点已与 Owner 确认：**队列页加一节**（不动菜单/路由/首页）。互动深度：四个方向操作（pushFront/pushBack/popFront/popBack）+ 头/尾双标记；优先队列（≈堆）正文一句带过、不做互动。

现状：队列页 `Article/DataStructure/Queue.vue` 现有「什么是队列 / Playground(QueueViz FIFO) / FIFO 对比正文 / 队列在哪里用」。本节插在**FIFO 对比正文之后、「队列在哪里用」之前**。

## 两个地基决策

1. **deque 放宽 FIFO 限制**：普通队列只能尾进头出；双端队列**头尾两端都能进、都能出**——四个操作 `pushFront`/`pushBack`/`popFront`/`popBack`。它是**栈与队列的共同推广**：只用一端进出就是栈（LIFO），一端进另一端出就是队列（FIFO）。
2. **可视化用横向车道 + 头/尾双标记**：复用 QueueViz 的「横向车道 + 端标记跟随 + TransitionGroup」画法，标记标在首/尾元素（头 front / 尾 back）；四个方向按钮各驱动一端进出，状态解说四个方向。

## 与现有 QueueViz 的关系（一句话）

`DequeViz` 是队列页第二个互动件，与 `QueueViz`（C-016，FIFO 队列）**并列、互不依赖**；QueueViz 讲「尾进头出 FIFO」，DequeViz 讲「两端都能进出、栈和队列的推广」。复用横向车道 + 端标记 + TransitionGroup 画法，元素类名用 `.dqitem` 与队列 `.qitem` 区隔（同页共存）。

## 要做什么

1. **双端队列逻辑**（`src/components/structures/useDeque.ts`）
   - `items:[id,value][]`（front=0、back=last）；`pushFront`/`pushBack`（++seq，满返回 null）/`popFront`/`popBack`（空返回 null）；`size`/`isEmpty`/`isFull`/`front`/`back`；`reset` 重建初始 `[1,2,3]`。可单测（不 mount）。
2. **双端队列互动组件**（`src/components/structures/DequeViz.vue`）
   - 复用 `useDeque`，渲染 头部入/尾部入/头部出/尾部出/重置 工具栏 + 横向车道（`.dqitem` + 头/尾标记 + TransitionGroup）+ 状态解说。四个方向各驱动一端，空态出队按钮禁用 + empty-hint。对标 `QueueViz`。
3. **队列页加节**（`src/views/Article/DataStructure/Queue.vue`，FIFO 对比正文后插入）
   - `<h2>双端队列 Deque：两端都能进出</h2>` + 正文（放宽 FIFO → 四个方向 → 栈/队列特例 → 滑动窗口等用途；优先队列≈堆一句带过）+ `<Playground><DequeViz/></Playground>`。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（D4 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M4 进度）。

## 不做什么（边界）

- **不做循环队列 / 优先队列互动 / 定长环形缓冲**：本节聚焦 deque 的四向进出 + 栈/队列特例；优先队列（≈堆，见堆页）正文一句带过，不做互动。
- **不改 QueueViz / useQueue / 骨架 / 菜单 / 路由 / 首页**：仅新增 useDeque/DequeViz + 队列页加节。
- **不做其余深度项**（D5）/ 广度项：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；deque 四个操作**同步**改 items 并同步返回结果、同步置 status（无动画锁、L4 可断言、多击无需计时器）；元素进出由 TransitionGroup 做（cosmetic）。
- **数据**：固定初始 `[1,2,3]`；`DEQUE_MAX` 限容；front=index 0、back=末位；push 用 ++seq（看落点 front/back）；满禁止 push、空禁止 pop。
- **可视化**：`.dqitem`（idle 浅绿 / 头 front 深绿）；头/尾标记跟随首/尾元素；横向车道**定宽定高、空与满同尺寸**（不跳版）；标记**贴元素跟随**（非手算坐标）；空态显 empty-hint。
- **向后兼容硬约束**：仅新增 `useDeque`/`DequeViz` + 队列页加节；QueueViz/useQueue 及 8 排序 + 其余 7 结构 + 播放器 全部现有 Case 零改动通过（队列页现有 TC-VIEW-QUEUE-01/02 仍绿；TC-E2E-QUEUE-01 仅因第二个 `.playground` 出现需 `.first()` 消歧、断言意图不变）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 队列页 FIFO 对比段后多一节「双端队列 Deque：两端都能进出」：正文 + 内嵌 DequeViz。
- [ ] **互动**：默认见 3 元素（头/尾标记）；头部入/尾部入各从对应端加入、头部出/尾部出各从对应端移出；空态出队禁用 + empty-hint；与普通队列「只尾进头出」对照鲜明。
- [ ] **正文质量**：讲清「deque 放宽 FIFO、两端都能进出」「四个操作」「只用一端=栈、一端进一端出=队列（共同推广）」「滑动窗口最值等用途」；优先队列≈堆带过。
- [ ] **零回归**：QueueViz 及全部现有 Case 仍绿；队列页两个 Playground（QueueViz + DequeViz）共存。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog D4 出池标完成。

## 开放问题

- 加节后队列页变长（两个互动件）：可接受；若日后过长再考虑拆姊妹页。
- 优先队列只正文带过（其本质是堆，堆页已讲）：避免与堆页重复；若日后想要可单列。

## 变更历史

- 2026-06-26：创建。M4 深度 D4 出池。落点=队列页加节；四向进出 deque + 栈/队列特例，优先/循环队列正文带过。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
