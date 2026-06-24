# 需求：链表 Linked List 知识页（复用知识页骨架，M3 数据结构第四个，首个「节点 + 连线」结构）

> Status: verified
> Stable ID: C-20260625-018
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Progress: 100%
> Blocked by: none
> Next action: 已完成（23 Case 全绿，全门禁通过，待提交 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-015（知识页骨架 + 栈，**复用**其 `Article`/`Callout`/`Playground` 排版骨架与「reactive + `<TransitionGroup>`」互动范式）；C-20260624-017（数组——本变更是数组的**镜像**：数组按下标访问 O(1)/中部增删搬移 O(n)，链表按位置访问 O(n)/增删改指针 O(1)，正文与互动均与数组对照）
> Related tests: 计划新增 `TC-LINK-LOGIC-*`（useLink 纯逻辑）/ `TC-VIZ-LINKVIZ-*`（链表互动组件）/ `TC-VIEW-LINK-*`（链表页）/ `TC-E2E-LINK-*`（端到端）；**不改写任何现有 Case，不新增骨架测试**（骨架 C-015 已测）
> Related requirement: —

## 背景

知识页骨架（C-015）已被栈/队列/数组三次复用验证可复用。本变更是 M3 数据结构动画的**第四个**，做**链表 Linked List**——数据结构菜单第 2 位，目前是空壳。它是上一篇**数组的镜像**，把两个互补结论讲透：

- **数组**：连续内存 + 下标 → 随机访问 `O(1)`，但中部插入/删除要整体搬移 `O(n)`。
- **链表**：节点散落、靠 `next` 指针串联 → 按位置访问得**从 head 逐跳走** `O(n)`，但增删**只改几根指针、不搬移** `O(1)`。

它也是**首个引入「节点 + 连线」视觉原语**的结构页——后续的树、图都将复用这套「节点盒 + 箭头」表达。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:13-16` 已列 `link`（标题「链表」），排数据结构第 2 位。
- 首页网格 `src/views/Home/Main/hooks.ts:30-35` 已有链表条目（desc「链表由一系列节点组成,每个节点包含储存数据的部分和保存相邻节点指针的部分」，与本次单链表实现一致，**无需改文案**）。
- 路由 `src/router/index.ts:28-31` 已注册 `/docs/link` → `Article/DataStructure/Link.vue`。
- **唯一缺口**：`Link.vue` 是空壳（`<template><div></div></template>`，进去白屏）。**无需动路由/菜单/首页/骨架**。

## 两个地基决策（brainstorming + 交互原型已确认）

继承 C-015 的全部页种决策（互动小组件嵌入正文 / 手写 `.vue` + 共享骨架 / 递增序号值），链表只新增两条：

1. **节点自带 `next` 箭头 + head 指针 + null 终止**。每个节点 = `[值盒 | next→]`，箭头是节点的子元素、靠 flex 相邻关系指向下一个节点（**不手算坐标** → 守住 C-015 硬约束）；`head` 绿胶囊指向首节点（链头）；末节点 `next→∅`（null）表示链尾。这是区别于数组「固定下标行」的链表身份可视化。
2. **查找走指针 + 改指针高亮**。查找时一个游标**从 head 逐跳高亮**到目标、计步（演 `O(n)` 访问代价）；插入/删除时**只高亮被改写的那 1–2 根 `next` 箭头**、其余节点纹丝不动（演 `O(1)` 改指针、不搬移）。与数组「右移/左移搬移」正相反。

## 链表与数组的可视化差异（一句话）

链表用**节点盒 + per-node next 箭头 + head + null** 取代数组的**贴合格 + 固定下标行**；`useLink` 暴露 `insertAfter`（选中节点后插、splice）/ `remove`（删选中、splice）/ `prepend`（头插、unshift）/ `valueAt`（按位置读）而非数组的中部 insert/append；**查找演逐跳走指针**（O(n)）、**增删演改指针高亮**（O(1)），与数组的搬移演示互为镜像。`<TransitionGroup>` 让插入节点滑入、删除节点离场、其余 FLIP——但增删只动局部、非整体搬移。

## 要做什么

1. **链表逻辑**（`src/components/structures/useLink.ts`）
   - reactive `items: [string, number][]`（顺序 = 从 head 起的链序，index 0 = head）+ `selected: number | null` + `valueAt/insertAfter/remove/prepend/select/reset` + `hasSelection/canInsert/canPrepend`（最大 6）+ 递增 seq + 初始预填 `[1,2,3]`。可单测（不 mount）。对标 `useArray`，但操作语义改为「后插 / 头插 / 改指针」。
2. **链表互动组件**（`src/components/structures/LinkViz.vue`）
   - 复用 `useLink`，渲染 查找/在其后插入/删除/头插/重置 工具栏 + 链表行（head 胶囊 + 节点[值|next→] + null）+ 选中节点深绿 + 查找逐跳高亮游标 + 增删改指针箭头脉冲高亮 + 状态解说行 + 空态提示 + 禁用态（无选中禁查找/插入/删除、满 6 禁插入/头插）。对标 `ArrayViz`。
3. **链表页**（`src/views/Article/DataStructure/Link.vue`，填充空壳）
   - 在 `<Article>` 里穿插正文（什么是链表 / 节点 + next + head + null / 访问 O(n) 逐跳 / 增删 O(1) 改指针 / 与数组互为镜像 / 应用：频繁增删·栈队列链式实现·树图基石 / 引出树）与 `<Playground><LinkViz/></Playground>`。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 数据结构第四个）。

## 不做什么（边界）

- **不改/不重抽骨架**：`Article`/`Callout`/`Playground` 原样复用、零改动、不新增骨架测试（C-015 已测）。
- **不做双链表（prev 指针）/ 循环链表 / 跳表**：固定「单链表 + next + head + null」。双链表留作后续进阶。
- **不做尾插/尾删**（单链表无 tail 指针时尾部操作 O(n)，会冲淡「增删 O(1)」主线）：插入只做「选中后插」+「头插」。
- **不做其余 4 个结构**（树/堆/哈希/图）：各自后续 plan。
- **不复用算法播放器**；**不改路由/菜单/首页/部署**；**不引入新依赖 / 不进 Pinia**（同 C-015~017）。

## 业务规则 / 约束

- **互动模型**：读者驱动、组件局部状态、`<TransitionGroup>` enter/leave + FLIP；无预计算步序、无回放（同 C-015~017）。
- **链表语义**：单链表；`valueAt(i)` 按位置读（演示为逐跳，概念 O(n)）；`insertAfter()` 在选中节点后插、改 2 根 next O(1)；`remove()` 删选中、前驱 next 跳过、改 1 根 O(1)；`prepend()` 头插 O(1)；演示最大容量 6（满禁插入/头插）；新值递增序号；初始预填 `[1,2,3]`。**增删只动局部指针、不搬移其余节点** 是链表区别于数组的关键。
- **可视化硬约束**（沿用 C-015~017）：`next` 箭头/head 挂节点（flex 相邻、不手算坐标）；链表行车道定宽 560（空/满一致，杜绝跳变）。
- **视觉**：沿用新拟物；选中节点深绿 `#4caf50` + 白字、其余 idle 浅绿 `#8bd3a0` + 深绿字 `#1f5e3a`；查找游标白底深绿环；改指针箭头脉冲深绿；head 主题绿胶囊；null 灰虚线框。**选中态只用配色 + 阴影环、不用 transform 位移**（避免与 FLIP 冲突，沿用 C-017 教训）。
- **向后兼容硬约束**：仅新增 `useLink`/`LinkViz` + 填 `Link.vue`；8 排序 + 栈 + 队列 + 数组 + 播放器全部现有 Case 零改动通过。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 进 `/docs/link` 不再白屏：一篇「可探索讲解」——标题 + 分节正文 + 内嵌互动链表 + 提示框。
- [ ] **互动链表**：初始见 `head → [1] → [2] → [3] → ∅`；**点节点选中**（深绿 + 启用查找/插入/删除）；**查找**游标从 head 逐跳高亮到选中、解说「走了 k 步、O(n)」；**在其后插入**新节点接进链、只高亮 2 根 next、其余不动、O(1)；**删除选中**前驱跳过、O(1)；**头插**接到表头、O(1)；满 6 禁插入/头插；空时禁查找/插入/删除并显「链表为空」；**节点带 next 箭头 + head + null、车道定宽空/满一致**。
- [ ] **镜像数组正确**：访问演逐跳 O(n)、增删演改指针 O(1)，与数组对照成立。
- [ ] **正文质量**：讲清节点 + next + head/null + 访问 O(n) + 增删 O(1) + 与数组互为镜像，并自然引出下一篇「树」。
- [ ] **骨架可复用（硬验收）**：链表页靠「复用 `Article`/`Callout`/`Playground` + 新 `LinkViz` + `useLink`」拼成，**骨架零改动**；8 排序 + 栈 + 队列 + 数组 + 播放器全部现有 Case 仍绿。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap 回写。

## 开放问题

- 最大容量 6：链表行较宽（head + 节点[值|箭头] + null），560px 放 6 节点刚好；超大不在演示范围。
- 查找动画与可测性：查找的逐跳高亮用 setTimeout（纯视觉），但**最终解说状态同步设置**（含 O(n)），使 L4 可不依赖计时器断言状态；逐跳视觉由 e2e/肉眼复核。
- 单链表删除严格需前驱：演示按 index 已知前驱，状态解说「让前一个节点 next 跳过它」，不展开 prev 查找细节（标准教学简化）。

## 变更历史

- 2026-06-25：创建。brainstorming + 交互原型（`scratchpad/link-prototype.html`，浏览器实点查找/插入验证）确认两条链表特有决策——① **节点自带 next 箭头 + head + null**（首个「节点 + 连线」原语，树/图复用）；② **查找走指针 O(n) + 改指针高亮 O(1)**（与数组搬移互为镜像）；操作集 **A**（点选节点 + 后插/删除 + 头插 + 走指针查找）。其余页种决策继承 C-015。
