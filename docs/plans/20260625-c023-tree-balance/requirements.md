# 需求：树·平衡深化（树页加一节「为什么会失衡 · 平衡的思想」，M4 深度第一项 D1）

> Status: verified
> Stable ID: C-20260625-023
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Progress: 100%
> Blocked by: none
> Next action: 已完成（18 Case 全绿，全门禁通过，已落 main）；**M4 深度 D1 ✓**，下一项 D2 哈希·开放寻址
> Replaces: none
> Replaced by: none
> Related plans: C-20260625-019（树/BST——本变更在其页**加一节**，还其 callout 里「红黑/B 树」提了没讲的债）；M4 候选池 `docs/plans/backlog.md` D1
> Related tests: 计划新增 `TC-BAL-LOGIC-*`（useBalance 纯逻辑）/ `TC-VIZ-BALVIZ-*`（BalanceViz 互动）/ `TC-VIEW-TREE-03`（树页含 BalanceViz）/ `TC-E2E-TREE-02`（树页平衡节 e2e）；不改写现有 TC-VIEW-TREE-01/02、TC-E2E-TREE-01

## 背景

M3 数据结构 8/8 收官后盘点（见 `docs/plans/backlog.md`）确认：**树是最该加厚的一篇**——现有树页只讲了 BST 的插入/查找/中序，却在「树在哪里用」callout 里提了「红黑树、B 树是数据库索引核心」**却没讲为什么**。本变更是 M4「数据结构深化与扩充」的**深度第一项 D1**：在树页**加一节**，补上「BST 会退化、为什么要平衡」。

落点已与 Owner 确认：**树页加一节**（不动菜单/路由/首页），区别于「单独做平衡树新页」。完整的红黑/AVL 旋转实现留给 M4 广度进阶单独成页（候选池 B 阶）；这一节聚焦**「为什么要平衡」**——把失衡的代价演给读者看。

现状：树页 `Article/DataStructure/Tree.vue` 现有「什么是树 / Playground(TreeViz) / 中序遍历段 / 树在哪里用」。本节插在**中序遍历段之后、应用段之前**。

## 两个地基决策（brainstorming + 交互原型已确认）

1. **退化 ↔ 平衡 对照（同 7 个值两种形状）**。同样的值 `1–7`：**顺序插入→退化成右斜链**（高度 7、查找 O(n)）vs **平衡的树**（高度 3、查找 O(log n)）。一键切换两种布局，读数行显**高度 + 最坏查找次数**（退化橙警示、平衡绿）。
2. **查找走位对比**。点「查找 7」：链上逐节点点亮**走 7 步**、平衡树**走 3 步**——把 `O(n)` vs `O(log n)` 的差距演出来。互动深度选 **A**（对照 + 查找走位，不做真旋转）。

## 与现有 TreeViz 的关系（一句话）

`BalanceViz` 是树页第二个互动件，与 `TreeViz`（C-019，读者自建 BST）**并列、互不依赖**；TreeViz 讲「BST 怎么走位」，BalanceViz 讲「BST 会退化、平衡才稳」。两套固定布局（链/平衡）由 `useBalance` 提供，复用树/堆的「圆形节点 + SVG 边」画法。

## 要做什么

1. **平衡逻辑**（`src/components/structures/useBalance.ts`）
   - 两套固定布局：`chain`（值 1–7、右斜链、高度 7、最坏 7）+ `balanced`（值 4/2/6/1/3/5/7 按完全二叉树 pos、高度 3、最坏 3）；每套含 `nodes:{id,value,x,y}[]` + `edges:[i,j][]` + `height` + `worst`。`search(target, mode)` 返回 `{path:number[], steps}`（BST 走位）。可单测（不 mount）。
2. **平衡互动组件**（`src/components/structures/BalanceViz.vue`）
   - 复用 `useBalance`，渲染 顺序插入(退化)/平衡的树/查找7 工具栏 + SVG（边 + 圆形节点）+ 读数行（高度·最坏查找，退化橙/平衡绿）+ 查找走位点亮 + 状态解说。对标 `GraphViz`（async + busy）。
3. **树页加节**（`src/views/Article/DataStructure/Tree.vue`，中序段后插入）
   - `<h2>为什么会失衡 · 平衡的思想</h2>` + 正文（顺序插入退化成链 O(n) → 平衡树旋转保 O(log n)）+ `<Playground><BalanceViz/></Playground>` + 收尾正文（真实有序 map/索引用自平衡树）。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（D1 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M4 进度）。

## 不做什么（边界）

- **不做真旋转 / AVL 平衡因子 / 红黑树着色 / 完整自平衡插入**：本节只对照「退化 vs 平衡」+ 查找步数，**完整旋转留 M4 广度进阶单独成页**。
- **不改 TreeViz / useTree / 骨架 / 菜单 / 路由 / 首页**：仅新增 useBalance/BalanceViz + 树页加节。
- **不做其余深度项**（D2–D5）/ 广度项：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；切换/查找的点亮为延时动画（setTimeout、卸载清理、busy 防重入）；`search` 纯函数同步返回步数（L4 可断言）。
- **数据**：固定两布局，值 1–7；`chain` BST 退化（每节点右孩子+1，高度 7、search(7)=7 步）；`balanced` 完全二叉树（4 为根，高度 3、search(7)=3 步、任意值 ≤3 步）；search 走 BST 比较路径。
- **可视化**：圆形节点（idle 浅绿 / path 黄 / hot 深绿）；SVG 边；容器定宽。
- **向后兼容硬约束**：仅新增 `useBalance`/`BalanceViz` + 树页加节；TreeViz/useTree 及 8 排序 + 其余 7 结构 + 播放器 全部现有 Case 零改动通过（树页现有 TC-VIEW-TREE-01/02、TC-E2E-TREE-01 仍绿）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 树页中序段后多一节「为什么会失衡 · 平衡的思想」：正文 + 内嵌 BalanceViz。
- [ ] **互动**：默认见退化的右斜链（高度 7、最坏 7 次，橙）；切「平衡的树」见矮胖树（高度 3、最坏 3 次，绿）；点「查找 7」链走 7 步 / 平衡走 3 步；同 7 个值对照鲜明。
- [ ] **正文质量**：讲清「顺序插入退化成链 → O(n)」「平衡树旋转保 O(log n)」「真实索引用自平衡树」，还上 callout 欠的债。
- [ ] **零回归**：TreeViz 及全部现有 Case 仍绿；树页两个 Playground（TreeViz + BalanceViz）共存。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog D1 出池标完成。

## 开放问题

- 加节后树页变长（两个互动件）：可接受；若日后过长再考虑拆姊妹页。
- search 固定演示 target=7：组件按钮固定「查找 7」（最坏值，对比最鲜明）；useBalance.search 仍支持任意 target（便于单测多值）。

## 变更历史

- 2026-06-25：创建。M4 深度 D1 出池。brainstorming + 交互原型（`scratchpad/balance-prototype.html`，浏览器实点切换 + 查找验证退化 7 步 vs 平衡 3 步）确认两条决策——① 退化↔平衡对照（同 7 值两形状 + 高度/最坏读数）；② 查找走位对比。落点=树页加节；完整旋转留广度进阶。
