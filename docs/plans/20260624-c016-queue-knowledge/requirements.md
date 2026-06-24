# 需求：队列 Queue 知识页（复用知识页骨架，M3 数据结构第二个，FIFO 镜像）

> Status: verified
> Stable ID: C-20260624-016
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Progress: 100%
> Blocked by: none
> Next action: 已完成（19 Case 全绿，全门禁通过，待提交 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-015（知识页骨架 + 栈——本变更**复用**其 `Article`/`Callout`/`Playground` 排版骨架与「reactive + `<TransitionGroup>`」互动范式，并验证骨架可复用性；队列是栈的 FIFO 镜像）
> Related tests: 计划新增 `TC-QUEUE-LOGIC-*`（useQueue 纯逻辑）/ `TC-VIZ-QUEUEVIZ-*`（队列互动组件）/ `TC-VIEW-QUEUE-*`（队列页）/ `TC-E2E-QUEUE-*`（端到端）；**不改写任何现有 Case，不新增骨架测试**（骨架 C-015 已测）
> Related requirement: —

## 背景

C-015 立起「知识页」通用骨架（`components/article/` 排版三件套 + `components/structures/` 互动件范式）并用**栈**跑通。本变更是 M3 数据结构动画的**第二个**，做**队列 Queue**——它是栈的 FIFO 镜像，正好是验证「骨架真的可复用」的最佳第二例（一个例子容易抽错抽象，第二个才检验得出）。

队列与栈都是受限线性表，但约束相反：

- **栈**：只在**一端**（栈顶）进出 → 后进先出 LIFO。
- **队列**：**两端各管一件事**——一端只进（队尾 `enqueue`）、另一端只出（队首 `dequeue`）→ 先进先出 FIFO。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:22-25` 已列 `queue`（标题「队列」）。
- 首页网格 `src/views/Home/Main/hooks.ts:42-47` 已有队列条目（desc「队列是一种特殊的线性表,允许在队列的一端进行插入，而在队列的另一端进行删除」，与本次 FIFO 实现一致，**无需改文案**）。
- 路由 `src/router/index.ts:38-42` 已注册 `/docs/queue` → `Article/DataStructure/Queue.vue`。
- **唯一缺口**：`Queue.vue` 是空壳。**无需动路由/菜单/首页/骨架**。

## 两个地基决策（brainstorming + 交互原型已确认）

继承 C-015 的全部页种决策（互动小组件嵌入正文 / 手写 `.vue` + 共享骨架 / 递增序号值），队列只新增两条：

1. **布局 = 横向车道**。队首在左、队尾在右，元素从右（队尾）入、从左（队首）出。区别于栈的竖直单端布局——队列两端有别，横向最贴「排队」直觉，也与栈形成视觉对照。代价：横向比竖直放得少，故最大容量取 **6**（栈是 8）。
2. **双指针 = 队首 + 队尾**。`↑队首`（最左，下一个出队，深绿高亮）+ `↑队尾`（最右，新元素入处）。两指针均**挂在对应端元素上、跟着元素走**（沿用 C-015 硬约束，不手算位置）。单元素时它既是队首又是队尾，两指针同时显示。

## 队列与栈的可视化差异（一句话）

**横向车道 + 双端指针**取代栈的**竖直坑 + 单端指针**；`useQueue` 用 `push`（入队尾）/ `shift`（出队首）取代栈的 `push`/`pop`（同一端）；`front` = `items[0]`（最旧）取代栈的 `top` = `items[last]`（最新）——**enqueue 不改变 front**（除非原本为空），这是 FIFO 区别于 LIFO 的关键不变量。`<TransitionGroup>` 入队从右滑入、出队从左滑出、其余元素 FLIP 左移。

## 要做什么

1. **队列逻辑**（`src/components/structures/useQueue.ts`）
   - reactive `items: [string, number][]`（index 0 = 队首，末位 = 队尾）+ `enqueue/dequeue/peek/reset` + `front` + `canEnqueue/canDequeue`（最大 6）+ 递增 seq。可单测（不 mount）。对标 `useStack`。
2. **队列互动组件**（`src/components/structures/QueueViz.vue`）
   - 复用 `useQueue`，渲染 enqueue/dequeue/peek/重置工具栏 + 横向车道（定宽 472「车道」、左对齐、`<TransitionGroup>` 入右滑/出左滑/FLIP）+ 队首元素深绿 + `↑队首`/`↑队尾` 双指针挂端元素 + 状态解说行 + 空态提示 + 禁用态（空时禁 dequeue/peek、满 6 时禁 enqueue）。对标 `StackViz`。
3. **队列页**（`src/views/Article/DataStructure/Queue.vue`，填充空壳）
   - 在 `<Article>` 里穿插正文（什么是队列 / FIFO / enqueue·dequeue·peek / 与栈对比 / 应用：消息队列·任务调度·BFS·打印缓冲 / 引出树）与 `<Playground><QueueViz/></Playground>`。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 数据结构第二个）。

## 不做什么（边界）

- **不改/不重抽骨架**：`Article`/`Callout`/`Playground` 原样复用、零改动、不新增骨架测试（C-015 已测）。本次正是**验证**骨架可复用，若发现需抽公共「互动外壳」再单列 plan（避免现在过早抽象）。
- **不做循环队列 / 双端队列 / 优先队列 / 链式队列**：固定「简单顺序队列 + FIFO」。
- **不做其余 6 个结构**（数组/链表/树/堆/哈希/图）：各自后续 plan。
- **不复用算法播放器**；**不改路由/菜单/首页/部署**；**不引入新依赖 / 不进 Pinia**（同 C-015）。

## 业务规则 / 约束

- **互动模型**：读者驱动、组件局部状态、`<TransitionGroup>` enter/leave + FLIP；无预计算步序、无回放（同 C-015）。
- **队列语义**：FIFO；`enqueue` 入队尾、`dequeue` 出队首、`peek` 看队首；均 O(1)；演示最大容量 6（满禁 enqueue）；值为递增序号。**enqueue 不改 front（除非原空）** 是 FIFO 核心不变量。
- **可视化硬约束**（沿用 C-015）：队首/队尾指针挂端元素跟随、车道定宽 472（空满一致）。
- **视觉**：沿用新拟物；队首深绿 `#4caf50`、其余 idle 浅绿 `#8bd3a0`；队首指针深绿、队尾指针主题绿。
- **向后兼容硬约束**：仅新增 `useQueue`/`QueueViz` + 填 `Queue.vue`；8 个排序 + 栈 + 播放器全部现有 Case 零改动通过。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 进 `/docs/queue` 不再白屏：一篇「可探索讲解」——标题 + 分节正文 + 内嵌互动队列 + 提示框。
- [ ] **互动队列**：enqueue 从队尾加入递增序号；dequeue 从队首移除并解说；peek 高亮队首不取走；重置清空。**队首深绿、`↑队首`/`↑队尾` 双指针始终贴对应端**；空队列显「队列为空」且 dequeue/peek 禁用；满 6 时 enqueue 禁用；**车道宽空/满一致**。
- [ ] **FIFO 正确**：连入 1/2/3 后连出，顺序为 1/2/3（先进先出）；enqueue 期间队首保持不变（除原空）。
- [ ] **正文质量**：讲清 FIFO、与栈对比、典型应用，并自然引出下一篇「树」。
- [ ] **骨架可复用（硬验收）**：队列页靠「复用 `Article`/`Callout`/`Playground` + 新 `QueueViz` + `useQueue`」拼成，**骨架零改动**；8 排序 + 栈 + 播放器全部现有 Case 仍绿。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap 回写。

## 开放问题

- 最大容量 6 是否合适：横向车道 472px 放 6 个 60px 盘 + 间距刚好；超大不在演示范围。
- 单元素时队首/队尾双指针同时显示：暂定上下堆叠两行（`↑队首` / `↑队尾`），实现期看是否需合并为一行。
- 出队动画：队首左滑出、其余 FLIP 左移补位——`<TransitionGroup>` 自动处理；实现期肉眼复核补位平滑。

## 变更历史

- 2026-06-24：创建。brainstorming + 交互原型确认两条队列特有决策——① **横向车道布局**（队首左/队尾右，容量 6）；② **双指针**（队首 + 队尾，挂端元素跟随）。其余页种决策继承 C-015。
- 2026-06-24：C-20260624-017（数组）微调本页 `Queue.vue` 结尾一句引子——由「再往后是树」改为承接「线性表家族还有数组/链表，再往后才是树」，使菜单顺序叙事连贯。仅正文措辞，行为契约与测试断言不变（`Queue.spec.ts`/`queue.e2e.ts` 不断言该句），本 plan 仍 verified。详见 `../20260624-c017-array-knowledge/requirements.md`。
