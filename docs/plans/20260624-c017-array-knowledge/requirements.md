# 需求：数组 Array 知识页（复用知识页骨架，M3 数据结构第三个，首个「下标 + 搬移」线性结构）

> Status: verified
> Stable ID: C-20260624-017
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Progress: 100%
> Blocked by: none
> Next action: 已完成（23 Case 全绿，全门禁通过，待提交 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-015（知识页骨架 + 栈——本变更**复用**其 `Article`/`Callout`/`Playground` 排版骨架与「reactive + `<TransitionGroup>`」互动范式）；C-20260624-016（队列——同为线性结构、同复用骨架；数组与队列同为横向布局，但数组讲「下标随机访问 + 中间增删搬移」而非端点进出）
> Related tests: 计划新增 `TC-ARRAY-LOGIC-*`（useArray 纯逻辑）/ `TC-VIZ-ARRAYVIZ-*`（数组互动组件）/ `TC-VIEW-ARRAY-*`（数组页）/ `TC-E2E-ARRAY-*`（端到端）；**不改写任何现有 Case，不新增骨架测试**（骨架 C-015 已测）
> Related requirement: —

## 背景

C-015 立起「知识页」通用骨架（`components/article/` 排版三件套 + `components/structures/` 互动件范式）并用**栈**跑通；C-016 用**队列**零改动复用骨架、验证可复用性。本变更是 M3 数据结构动画的**第三个**，做**数组 Array**——它是菜单里数据结构的**第 1 位**，却一直是空壳，先把这块地基补上。

数组与栈/队列都是线性表，但**看点完全不同**：

- **栈 / 队列**：受限线性表，只在**端点**进出（栈顶 / 队首队尾）。看点是 LIFO / FIFO。
- **数组**：一段**连续内存**里的带下标序列，任意位置都能访问。看点是**按下标 `O(1)` 随机访问**，以及**中间插入 / 删除要把后续元素整体搬移 `O(n)`**。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:9-12` 已列 `array`（标题「数组」），且排在数据结构**第一位**。
- 首页网格 `src/views/Home/Main/hooks.ts:24-29` 已有数组条目（desc「数组是有序元素的序列,每个元素都会被分配一个自增连续下标」，与本次实现一致，**无需改文案**）。
- 路由 `src/router/index.ts:23-26` 已注册 `/docs/array` → `Article/DataStructure/Array.vue`。
- **主缺口**：`Array.vue` 是空壳（`<template><div></div></template>`，进去是白屏）。**无需动路由/菜单/首页/骨架**。
- **次要联动**：`Queue.vue` 结尾原句「再往后是树」承接到非线性结构，但数组/链表这两个更基础的线性结构排在前面尚未讲；本次微调该句，承接「线性表家族还有数组/链表，再往后才是树」，让菜单顺序的叙事连贯（内容措辞微调，**非改写历史需求**，已在 C-016 变更历史登记交叉链接）。

## 两个地基决策（brainstorming + 交互原型已确认）

继承 C-015 的全部页种决策（互动小组件嵌入正文 / 手写 `.vue` + 共享骨架 / 递增序号值），数组只新增两条：

1. **格子相邻贴合 + 下方固定下标**。格子挨着排（仅 2px 缝透出凹槽底），强调「**连续内存**」；每格正下方标固定下标 `0/1/2…`。关键区别于队列：**下标是位置、不跟值走**——这正是数组与队列「指针挂元素跟随」相反的一面。连插几次后形如 `[1,2,5,3,4]`，下标 2 的值是 5——自然讲清「**下标 ≠ 值**」。
2. **`↑i` 指针挂在「槽位」上**。点一个格子选中下标 `i`，`↑` 深绿指针落在第 `i` 个**槽位**（下标行内，flex 对齐自动定位，不手算坐标）。插入 / 删除时**值在滑动、`↑i` 留在原位**——因为下标本就是固定位置。区别于队列「指针挂端元素跟着 FLIP 走」。

## 数组与栈/队列的可视化差异（一句话）

数组用**横向贴合格 + 固定下标行 + 槽位指针**取代队列的**横向车道 + 端元素双指针**；`useArray` 暴露 `insert`（中部插、`splice` 右移）/ `remove`（中部删、`splice` 左移）/ `append`（尾插）/ `valueAt`（按下标读）而非端点 `enqueue/dequeue`；选中态 `selected` 进入逻辑层。`<TransitionGroup>` 让插入时新元素从右滑入、后续元素 **FLIP 右移腾位**；删除时目标元素离场、后续 **FLIP 左移补位**——把「搬移」这个数组的核心代价**演给读者看**。

## 要做什么

1. **数组逻辑**（`src/components/structures/useArray.ts`）
   - reactive `items: [string, number][]`（index = 位置）+ `selected: number | null` + `valueAt/insert/remove/append/select/reset` + `hasSelection/canInsert/canAppend`（最大 8）+ 递增 seq + 初始预填 `[1,2,3,4]`。可单测（不 mount）。对标 `useStack`/`useQueue`，但多了**选中态**与**按下标的中部增删**。
2. **数组互动组件**（`src/components/structures/ArrayViz.vue`）
   - 复用 `useArray`，渲染 访问/插入/删除/尾部追加/重置 工具栏 + 横向贴合格（定宽 448、左对齐、`<TransitionGroup>` 插右滑入 / 删离场 / FLIP 搬移）+ 选中格深绿 + 固定下标行 + `↑i` 槽位指针 + access 瞬时高亮 + 状态解说行 + 空态提示 + 禁用态（无选中禁访问/插入/删除、满 8 禁插入/追加）。对标 `StackViz`/`QueueViz`。
3. **数组页**（`src/views/Article/DataStructure/Array.vue`，填充空壳）
   - 在 `<Article>` 里穿插正文（什么是数组 / 连续内存 + 下标 / 随机访问 O(1) / 中间增删搬移 O(n) / 下标≠值 / 端部 vs 中部对比 / 应用：查表·矩阵·其它结构底座 / 引出链表）与 `<Playground><ArrayViz/></Playground>`。正文以原型文案为基础。
4. **联动微调**：`Queue.vue` 结尾引子改为承接数组/链表（一句）。
5. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 数据结构第三个）。

## 不做什么（边界）

- **不改/不重抽骨架**：`Article`/`Callout`/`Playground` 原样复用、零改动、不新增骨架测试（C-015 已测）。
- **不做动态数组扩容 / 多维数组 / 稀疏数组 / 泛型元素**：固定「一维顺序数组 + 整数值 + 下标增删访问」。
- **不做排序 / 查找算法**：那些归排序系列与后续结构。
- **不做其余 5 个结构**（链表/树/堆/哈希/图）：各自后续 plan。
- **不复用算法播放器**；**不改路由/菜单/首页/部署**；**不引入新依赖 / 不进 Pinia**（同 C-015/C-016）。

## 业务规则 / 约束

- **互动模型**：读者驱动、组件局部状态、`<TransitionGroup>` enter/leave + FLIP；无预计算步序、无回放（同 C-015/C-016）。
- **数组语义**：连续下标序列；`valueAt(i)` 按下标读 O(1)；`insert(i)` 在下标 i 插入、i 起右移 O(n)；`remove(i)` 删下标 i、后续左移 O(n)；`append()` 尾插 O(1)；演示最大容量 8（满禁插入/追加）；新值为递增序号；初始预填 `[1,2,3,4]`。**插入后下标 ≠ 值** 是数组区别于「下标即序号」直觉的关键认知点。
- **可视化硬约束**（沿用 C-015/C-016）：`↑i` 指针挂槽位（flex 对齐、不手算坐标）；车道定宽 448（空/满一致，杜绝加第一个元素时跳变）。
- **视觉**：沿用新拟物；选中格深绿 `#4caf50` + 白字、其余 idle 浅绿 `#8bd3a0` + 深绿字 `#1f5e3a`；`↑i` 指针与选中下标深绿；下标行 idle 灰。**选中态只用配色 + 指针 + 阴影，不用 transform 位移**（避免与 `<TransitionGroup>` 的 FLIP transform 冲突）。
- **向后兼容硬约束**：仅新增 `useArray`/`ArrayViz` + 填 `Array.vue` + 改 `Queue.vue` 一句结尾；8 个排序 + 栈 + 队列 + 播放器全部现有 Case 零改动通过（queue 测试不断言被改的那句）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 进 `/docs/array` 不再白屏：一篇「可探索讲解」——标题 + 分节正文 + 内嵌互动数组 + 提示框。
- [ ] **互动数组**：初始见 `[1,2,3,4]` 四格 + 下标 `0/1/2/3`；**点格子选中下标**（深绿 + `↑i` 槽位指针 + 启用访问/插入/删除）；访问瞬时高亮该格（O(1)）；**在 i 处插入**新值、下标 i 起整体**右移腾位**且选中落在新元素；**删除 i** 后后续**左移补位**且清空选中；**尾部追加**末尾加值不搬移（O(1)）；满 8 时禁插入/追加；空时禁访问/插入/删除并显「数组为空」；**下标行固定、车道宽空/满一致**。
- [ ] **下标≠值 正确**：连插后形如 `[1,2,5,3,4]`，下标 2 的值是 5。
- [ ] **正文质量**：讲清连续内存 + 下标随机访问 O(1) + 中间增删搬移 O(n) + 下标≠值，并自然引出下一篇「链表」。
- [ ] **骨架可复用（硬验收）**：数组页靠「复用 `Article`/`Callout`/`Playground` + 新 `ArrayViz` + `useArray`」拼成，**骨架零改动**；8 排序 + 栈 + 队列 + 播放器全部现有 Case 仍绿（含 queue 改句后其测试仍绿）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap 回写。

## 开放问题

- 最大容量 8 是否合适：横向车道 448px 放 8 个 50px 贴合格刚好；超大不在演示范围。
- 选中态用 transform 位移 vs 仅配色：原型用了 `translateY` 上浮，但 Vue 版与 `<TransitionGroup>` 的 move(FLIP) transform 会打架（搬移时选中格会掉下去再弹回）。**实现期改为仅配色 + 指针 + 阴影环**，access 一次性 flash 保留 transform（不触发布局搬移、无冲突）。
- 删除目标元素的离场 + 后续左移补位——`<TransitionGroup>` 自动处理；实现期肉眼复核补位平滑、离场不抖。

## 变更历史

- 2026-06-24：创建。brainstorming + 交互原型（`scratchpad/array-prototype.html`，浏览器实点四操作验证）确认两条数组特有决策——① **格子贴合 + 固定下标行**（讲连续内存 + 下标≠值）；② **`↑i` 指针挂槽位**（位置而非值，与队列相反）；操作集 **A**（点选下标 + 中部插删 + 尾部追加对比）。其余页种决策继承 C-015/C-016。
