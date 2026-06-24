# 需求：知识页通用骨架 + 栈 Stack 参考实现（M3 数据结构动画首发，新页种「可探索讲解」）

> Status: verified
> Stable ID: C-20260624-015
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Progress: 100%
> Blocked by: none
> Next action: 已完成（24 Case 全绿，全门禁通过，待提交 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006（算法播放器框架——本变更**不复用**它，但沿用其「reactive + TransitionGroup FLIP」动画范式与新拟物视觉）；C-20260624-014（计数排序，M3 排序系列收官，本变更开启 M3 剩余的**数据结构动画**）
> Related tests: 计划新增 `TC-STACK-LOGIC-*`（useStack 纯逻辑）/ `TC-VIZ-ARTICLE-*`/`TC-VIZ-CALLOUT-*`/`TC-VIZ-PLAYGROUND-*`（排版骨架组件）/ `TC-VIZ-STACKVIZ-*`（栈互动组件）/ `TC-VIEW-STACK-*`（栈页）/ `TC-E2E-STACK-*`（端到端）；**不改写任何现有 Case**
> Related requirement: —

## 背景

M3「算法补全」的排序部分已收官（8/8，C-014 计数排序落地）。M3 还剩**数据结构动画**——菜单已列 8 个数据结构（数组/链表/栈/队列/树/堆/哈希/图），路由也已注册到对应 `src/views/Article/DataStructure/*.vue`，**但这 8 个 `.vue` 全是空壳**（`<template><div></div></template>`），点进去是白屏。

数据结构页和已做的排序页是**两种不同的东西**：

- **排序页**（C-006 起的算法播放器）= **被动回放**：预计算一个固定算法的步序，读者播放/单步/拖动 index 看它跑。
- **数据结构页** = **可探索讲解（explorable explanation）**：正文讲概念，正文里**穿插读者可亲手操作的互动小组件**（push/pop、insert/delete……）。数据结构的精髓不是「看一个算法跑」，而是「你能对它做哪些操作」——所以交互模型是**读者驱动**，和播放器相反。

brainstorming + 可交互原型已确认本页种的三个地基决策（见下）。本变更**只做两件事**：① 立起「知识页」通用骨架（排版 + 互动组件外框）；② 用**栈 Stack** 作为首个参考实现把骨架跑通。队列及其余 6 个结构是后续各自 plan，复用本骨架。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:19-21` 已列 `stack`（标题「栈」）。
- 首页网格 `src/views/Home/Main/hooks.ts:36-41` 已有栈条目（`StackIcon` 已 import）。
- 路由 `src/router/index.ts:32-36` 已注册 `/docs/stack` → `Article/DataStructure/Stack.vue`。
- **唯一缺口**：`Stack.vue` 是空壳，需填充内容。**无需动路由/菜单/首页**。

## 三个地基决策（brainstorming + 原型已确认）

1. **互动模型 = 互动小组件嵌入正文（读者驱动）**。每种结构 = 一个可操作的小 viz 组件（栈 = push/pop/peek 按钮 + 竖直栈），读者自己点、看动画。区别于排序播放器的「回放」。代价：要造一套与播放器不同的、用户事件驱动的互动组件；但底层「reactive 状态 + `<TransitionGroup>` 进出场动画」范式与现有 `List.vue` 一致，可复用。
2. **撰写形式 = 手写 `.vue` 页 + 共享排版骨架**。正文（标题/段落/提示）与内嵌互动组件都写在页面 `.vue` 的 `<template>` 里，配一小套共享「排版组件」（`Article`/`Callout`/`Playground`）保证风格一致。**零新依赖**，与现有「每页一个 `.vue`」惯例完全一致（放弃 Markdown 流水线，归入「不做」）。代价：长段中文写在模板里略啰嗦，但本项目规模可接受。
3. **首个标杆 = 栈 Stack（只做栈）**。最小完整例（push/pop/peek、竖直列、面最小），一次立起三层骨架并验证。队列（FIFO 镜像）及其余结构为后续 plan。push 压入的值用**递增序号** `1/2/3…`（最清晰展示 LIFO：压 1/2/3，弹出即 3/2/1）。

## 原型暴露的两条实现要点（已并入设计）

可交互原型（`/tmp/stack-knowledge-mockup.html`，本次设计依据）跑通了整套 genre，并在两轮检验中定下两条**栈可视化的硬约束**：

1. **「栈顶」指针必须挂在栈顶元素那一行上、跟着它走**——不能用「固定高度容器 + 手算 translateY」的独立指针去追（会算错位置）。做法：指针绝对定位贴在栈顶盘子右侧、漂在「坑」外。
2. **栈容器（「坑」）必须定宽**——空栈与满栈宽度一致（本设计 134px），否则 push 第一个元素时容器会突然变宽（视觉跳变）。

## 要做什么

1. **排版骨架**（`src/components/article/`，presentational，所有知识页复用）
   - `Article.vue`：页面内容外壳——限定阅读宽度、给 `<h1>/<h2>/<h3>/<p>/<ul>/<code>/<strong>` 一套 scoped 排版（slot 透传，作者直接写语义标签）。
   - `Callout.vue`：提示/注意框（新拟物卡片 + slot）。
   - `Playground.vue`：互动组件外框——新拟物卡片 + 角标「亲手试试」+ slot 放互动组件。
2. **栈互动组件**（`src/components/structures/`）
   - `useStack.ts`：纯逻辑 composable——reactive `items: [string, number][]`（稳定 id 驱动 `<TransitionGroup>`）+ `push/pop/peek/reset` + `canPush/canPop`（最大 8）+ 递增 seq。可单测（不 mount）。
   - `StackViz.vue`：复用 `useStack`，渲染 push/pop/peek/重置工具栏 + 竖直栈（定宽 134「坑」、底部锚定向上长、`<TransitionGroup>` 进出场）+ 栈顶元素深绿 +「← 栈顶」绝对定位挂顶行外侧 + 状态解说行 + 空态提示 + 禁用态（空时禁 pop/peek、满时禁 push）。
3. **栈页**（`src/views/Article/DataStructure/Stack.vue`，填充空壳）
   - 在 `<Article>` 里穿插正文（什么是栈 / LIFO / push·pop·peek / 应用：函数调用栈·撤销·括号匹配·浏览器后退 / 引出队列）与 `<Playground><StackViz/></Playground>`。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 数据结构动画开篇 + 新骨架记录）。

## 不做什么（边界）

- **不做队列及其余 6 个结构**（链表/数组/树/堆/哈希/图）：本次只做**栈**，把骨架跑通。其余各自后续 plan 复用骨架（队列优先，FIFO 镜像验证复用性）。
- **不做 Markdown/MDX 流水线**：固定「手写 `.vue` + 共享排版组件」，零新依赖。
- **不复用算法播放器**（`AlgorithmPlayer`/`usePlayer`/`TransportControls`/代码面板/变量面板）：知识页是读者驱动的互动，不是回放；不强塞进播放器框架，也不改播放器一行。
- **不做多语言代码视图 / 复杂度证明 / 测验**：本页种聚焦「概念讲解 + 亲手操作」；代码示例如需，用 `<code>`/`<pre>` 静态展示即可，不接 Shiki 播放器。
- **不改排序页 / 播放器 / 既有 viz 组件**：`Article` 骨架是全新、独立的一套；对冒泡/选择/…/计数 8 个排序与播放器**零行为变化**。
- **不改路由 / 菜单 / 首页 / 部署**：`/docs/stack` 路由、菜单项、首页卡片、图标均已就位；本次仅填充 `Stack.vue` 空壳。
- **不引入状态库 / 不进 Pinia**：栈状态是组件局部 reactive（`useStack`），不进全局 store。

## 业务规则 / 约束

- **互动模型**：读者驱动、组件局部状态、用户事件触发动画；无预计算步序、无 index 回放、无 async 算法循环。动画用 Vue `<TransitionGroup>` 的 enter/leave（与 `List.vue` 同范式）。
- **栈语义**：LIFO；只在栈顶 push/pop/peek；`push`/`pop` O(1)；演示最大容量 8（满时禁 push，避免溢出容器）；push 值为递增序号。
- **栈可视化硬约束**（见上「原型要点」）：栈顶指针挂顶行、坑定宽 134。
- **视觉**：沿用新拟物（`common.less` 注入的颜色/阴影 mixin）；盘子用既有块色（idle 浅绿 `#8bd3a0` / 栈顶深绿 `#4caf50`）；按钮新拟物。
- **向后兼容硬约束**：新增的 `article/` 与 `structures/` 组件**完全独立**，不 import 也不被现有任何组件 import（除新栈页）；播放器/排序侧全部现有 Case 零改动通过。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率本地门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`（单人项目）；提交信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 自动部署 GitHub Pages；自有域名 `algo.illegalscreed.cn` 需手动 `./scripts/deploy.sh`。
- 缺陷修复遵循铁律：先写能复现的失败用例，再改代码，再验证通过。

## 验收口径

- [ ] 进 `/docs/stack` 不再白屏：呈现一篇「可探索讲解」——标题 + 分节正文 + 内嵌互动栈 + 提示框。
- [ ] **排版骨架**：`Article` 限宽易读、标题/段落/`code` 芯片/`strong` 高亮风格统一；`Callout` 提示框、`Playground`「亲手试试」外框正常。
- [ ] **互动栈**：点 push 压入递增序号、动画落到栈顶；pop 弹出栈顶并解说；peek 高亮栈顶不取走；重置清空。**栈顶元素深绿、「← 栈顶」始终贴真正的栈顶**；空栈显「栈为空」且 pop/peek 禁用；满 8 时 push 禁用；**坑宽空/满一致（134px）**。
- [ ] **正文质量**：讲清 LIFO、三种操作、典型应用，并自然引出下一篇「队列」。
- [ ] **骨架可复用 + 向后兼容（硬验收）**：栈页靠「`Article`/`Callout`/`Playground` + 一个 `StackViz` + `useStack`」拼成；**8 个排序与播放器全部现有 Case 仍绿**；新骨架不被排序/播放器 import。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；`docs/plans/index.md`、`docs/test-cases/` 三索引、`docs/roadmap.md` 均回写。

## 开放问题

- `StackViz` 盘子是否复用 `Block.vue`：`Block` 按 percent 调透明度（为柱状图设计），栈不需要；暂定 `StackViz` 用自己的「盘子」渲染（更贴栈语义），实现期评估是否值得复用 `Block`。
- 状态解说行措辞：暂定「push：把 N 压到栈顶」「pop：弹出栈顶 N」「peek：栈顶是 N（只看，不取走）」「栈为空」；实现期视清晰度微调。
- 排版组件落 `src/components/article/` 还是别处：暂定 `src/components/article/`（与 `player/` 子目录并列）；互动组件落 `src/components/structures/`。
- 最大容量 8 是否合适：`n=8` 时坑约 8×50px 高，配合 280 min-height 够看；超大不在演示范围。
- 后续结构复用边界：本次先不强抽「通用互动外壳」，等队列落地后再看 StackViz/QueueViz 共性决定是否抽公共件（避免一个例子抽错抽象）。

## 变更历史

- 2026-06-24：创建。brainstorming + 交互原型确认三大地基决策——① **互动小组件嵌入正文（读者驱动）**；② **手写 `.vue` + 共享排版骨架**（零新依赖）；③ **首发只做栈、push 用递增序号**。原型另定两条栈可视化硬约束：栈顶指针挂顶行、坑定宽。
