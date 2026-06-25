# 需求：树 Tree 知识页（复用知识页骨架，M3 数据结构第五个，首个非线性结构）

> Status: verified
> Stable ID: C-20260625-019
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Progress: 100%
> Blocked by: none
> Next action: 已完成（23 Case 全绿，全门禁通过，待提交 main）
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-015（知识页骨架 + 栈，**复用**其 `Article`/`Callout`/`Playground` 排版骨架）；C-20260625-018（链表——本变更复用其「节点 + 连线」概念，但从线性升为二维分叉）；C-20260623-013（堆排序，**复用其 `TreeView.vue` 的完全二叉树定位数学**：节点按数组下标算 深度+水平%、SVG 画父子边）
> Related tests: 计划新增 `TC-TREE-LOGIC-*`（useTree 纯逻辑）/ `TC-VIZ-TREEVIZ-*`（树互动组件）/ `TC-VIEW-TREE-*`（树页）/ `TC-E2E-TREE-*`（端到端）；**不改写任何现有 Case，不新增骨架/TreeView 测试**
> Related requirement: —

## 背景

栈/队列/数组/链表四个**线性**结构页已用知识页骨架做完。本变更是 M3 数据结构动画的**第五个**，做**树 Tree**——**首个非线性结构**，也是数据结构里学习曲线的关键一跳：从「一条线」升到「会分叉的层次」。

具体做**二叉搜索树（BST）**——它是「可互动的树」最好的载体：每个节点最多两个孩子，且永远满足**左子树都比它小、右子树都比它大**。这条有序性让插入/查找像猜数字一样，从根**逐层比较**着往下走，是讲 `O(log n)` 与树形递归的最佳例子。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:27-29` 已列 `tree`（标题「树」）。
- 首页网格 `src/views/Home/Main/hooks.ts:49-53` 已有树条目（desc「树是由 n(n>=1) 个有限节点组成一个具有层次关系的集合」，与本次实现一致，**无需改文案**）。
- 路由 `src/router/index.ts:43-46` 已注册 `/docs/tree` → `Article/DataStructure/Tree.vue`。
- **可复用资产**：`src/components/TreeView.vue`（C-013 堆排树轨）已有「按下标算 深度+水平% + SVG 父子边 + 圆形新拟物节点」的完全二叉树定位法，可**复用其定位数学**到 BST。
- **唯一缺口**：`Tree.vue` 是空壳（白屏）。**无需动路由/菜单/首页/骨架/TreeView**。

## 两个地基决策（brainstorming + 交互原型已确认）

继承 C-015 的页种决策（互动小组件嵌入正文 / 手写 `.vue` + 共享骨架），树是非线性、需新增两条：

1. **二维布局（复用 TreeView 定位数学）+ 限 4 层**。每个节点一个「树位序号」`pos`（根=0、左孩子=2·pos+1、右孩子=2·pos+2），按 `pos` 算 深度(top) + 水平(left%)，SVG `<line>` 画父子边，圆形节点绝对定位。**坐标从树结构推导、每次插入后重算**（非写死像素，复用已测的 TreeView 公式）——这是非线性结构必然的二维范式，区别于前四篇线性 flex 相邻。容器**定宽定高 520×300、最大 pos=14（限 4 层）**，超出提示换值/重置；初始预填平衡树 `50/30/70/20/40/60/80`。
2. **走位插入 / 路径查找 / 中序遍历**。插入/查找时从根**逐层比较高亮路径**（比当前小走左、大走右），演 `O(log n)`；中序遍历按**左→根→右**依次点亮，吐出**升序**（BST 招牌性质 aha）。值由**输入框（1–99）**给出——用户主动选值、亲眼看落点。

## 树与线性结构的可视化差异（一句话）

树用**二维坐标 + SVG 父子边 + 圆形节点**取代线性结构的**一维 flex 排列**；`useTree` 用 BST 的 `pos` 索引（2·pos+1/2·pos+2）组织节点，暴露 `insert`（走位落子，返回比较路径）/ `search`（走位查找，返回路径 + 命中）/ `inorder`（中序=升序）而非线性的端点/下标操作；动画从「滑动/搬移」变为「沿树路径逐层高亮」。

## 要做什么

1. **树逻辑**（`src/components/structures/useTree.ts`）
   - reactive `nodes: { id, value, pos }[]`（pos 为完全二叉树位序号）+ `insert(v)/search(v)/inorder()/has(v)/nodeAt(pos)/reset` + `TREE_MAX_POS=14`（限 4 层）+ 初始预填 `[50,30,70,20,40,60,80]`。可单测（不 mount）。`insert/search` 返回比较 **path**（pos 数组）+ 结果，供组件做逐层高亮动画。
2. **树互动组件**（`src/components/structures/TreeViz.vue`）
   - 复用 `useTree` + TreeView 定位数学，渲染 输入框 + 插入/查找/中序遍历/重置 工具栏 + 二维树（SVG 边 + 圆形节点）+ 走位路径黄高亮 + 命中/中序当前深绿 + 状态解说行 + 空态提示。对标 `LinkViz`，但二维。
3. **树页**（`src/views/Article/DataStructure/Tree.vue`，填充空壳）
   - 在 `<Article>` 里穿插正文（什么是树 / 根·子·非线性 / BST 左小右大 / 走位 O(log n) / 中序=升序 / 应用：数据库索引·堆·文件系统 / 引出堆）与 `<Playground><TreeViz/></Playground>`。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 数据结构第五个、首个非线性）。

## 不做什么（边界）

- **不改/不重抽骨架与 TreeView**：`Article`/`Callout`/`Playground` 与 `TreeView.vue` 原样不动（仅**复用 TreeView 的定位公式**到新 `TreeViz`，不 import、不改它）。
- **不做删除节点**（BST 删除三种情况复杂，会胀大互动件）：插入 + 查找 + 中序遍历足以讲透 BST。
- **不做平衡树（AVL/红黑）/ 通用 n 叉树 / 树的序列化**：固定「BST + 插入/查找/中序」。
- **不做其余 3 个结构**（堆/哈希/图）：各自后续 plan（堆复用本树轨观感）。
- **不复用算法播放器**；**不改路由/菜单/首页/部署**；**不引入新依赖 / 不进 Pinia**（同 C-015~018）。

## 业务规则 / 约束

- **互动模型**：读者驱动、组件局部状态；插入/查找/中序的逐层高亮用 setTimeout（纯视觉），**数据变更同步**（`useTree` 操作同步返回结果），使 L4 可不依赖计时器断言（沿用 C-018 经验）。
- **BST 语义**：左 < 节点 < 右；`insert(v)` 从根比较落到空位（查重：已存在不插）；`search(v)` 从根比较到命中或空位；`inorder()` 左→根→右 = 升序；`pos` 完全二叉树编号，**限 `TREE_MAX_POS=14`（4 层）**，超出拒绝并提示；值取 1–99 整数（非法提示）；初始预填 `[50,30,70,20,40,60,80]`。
- **可视化范式**（树特有）：节点按 `pos` 算二维坐标（复用 TreeView 公式、从结构推导、插入后重算）；SVG 父子边连节点中心；容器 520×300 定宽定高。**选中/命中态用配色不位移**（沿用 C-017 教训）。
- **向后兼容硬约束**：仅新增 `useTree`/`TreeViz` + 填 `Tree.vue`；8 排序 + 栈 + 队列 + 数组 + 链表 + 播放器 + `TreeView` 全部现有 Case 零改动通过。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（lines/functions/statements ≥70%、branches ≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 进 `/docs/tree` 不再白屏：一篇「可探索讲解」——标题 + 分节正文 + 内嵌互动 BST + 提示框。
- [ ] **互动 BST**：初始见平衡树 `50/30/70/20/40/60/80`（圆形节点 + SVG 父子边）；**输入值插入**从根逐层比较高亮、走位落到正确空位（维持左小右大）、解说比较次数 + O(log n)；**查找**路径高亮 + 命中深绿/没找到走到空位；**中序遍历**依次点亮得**升序**；查重「已存在」、超 4 层提示、非法值提示；**重置**回初始；**容器定宽定高**。
- [ ] **BST 正确**：任意插入序列后中序遍历恒为升序。
- [ ] **正文质量**：讲清树/根/子/非线性 + BST 左小右大 + 走位 O(log n) + 中序=升序，并自然引出下一篇「堆」。
- [ ] **骨架可复用 + TreeView 定位复用（硬验收）**：树页靠「复用 `Article`/`Callout`/`Playground` + 新 `TreeViz`（借 TreeView 定位法）+ `useTree`」拼成，骨架与 TreeView 零改动；8 排序 + 栈 + 队列 + 数组 + 链表 + 播放器全部现有 Case 仍绿。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap 回写。

## 开放问题

- 限 4 层（pos≤14）：完全二叉树第 4 层有 8 个槽，520px 宽够放；用户按升序连插会快速触顶 → 提示换值/重置（这本身也是「BST 会退化成链」的隐性认知点）。
- 二维布局偏离前四篇 flex 范式：已与用户确认接受（非线性必然如此，复用已测 TreeView 公式从结构推导坐标，不写死像素）。
- 不做删除：BST 删除三情况（叶/单child/双child 找后继）复杂，留作后续；本页聚焦插入/查找/中序。

## 变更历史

- 2026-06-25：创建。brainstorming + 交互原型（`scratchpad/tree-prototype.html`，浏览器实点插入/中序验证）确认两条树特有决策——① **二维布局（复用 TreeView 定位数学）+ 限 4 层**；② **走位插入/路径查找/中序遍历（=升序）+ 输入框选值**。其余页种决策继承 C-015。
