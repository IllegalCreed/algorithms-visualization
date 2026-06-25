# 需求：图 Graph 知识页（复用知识页骨架，M3 数据结构第八个 · 收官 · BFS/DFS 遍历）

> Status: verified
> Stable ID: C-20260625-022
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Progress: 100%
> Blocked by: none
> Next action: 已完成（23 Case 全绿，全门禁通过，待提交 main）；**M3 数据结构 8/8 收官**
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-015（知识页骨架）；C-20260625-019/020（树/堆——复用其 SVG 边 + 圆形节点二维画法）；C-20260624-015/016（栈/队列——**收官回扣**：BFS 用队列、DFS 用栈）
> Related tests: 计划新增 `TC-GRAPH-LOGIC-*`（useGraph 纯逻辑）/ `TC-VIZ-GRAPHVIZ-*`（图互动组件）/ `TC-VIEW-GRAPH-*`（图页）/ `TC-E2E-GRAPH-*`（端到端）；无现存 GRAPH Case，命名空间干净

## 背景

数据结构七个页（栈/队列/数组/链表/树/堆/哈希）已做完。本变更是 M3 数据结构动画的**第八个、也是收官**：做**图 Graph**——最一般的结构。前面的结构都有约束（线性、层次、父子、散列），图彻底放开：任意顶点之间想连就连一条边，可成环、可多对多。

互动核心选**遍历（BFS/DFS）**——它正好是 M3 系列的**收官回扣**：BFS 广度优先靠**队列**（一层层向外）、DFS 深度优先靠**栈**（一条道走到底），把最早做的栈、队列两篇串回来。

现状盘点：

- 侧边菜单 `src/views/Docs/Menu/hooks.ts:38-40` 已列 `graph`（标题「图」），数据结构最后一项。
- 首页网格 `src/views/Home/Main/hooks.ts:66-70` 已有图条目（desc「图是一系列顶点的集合，这些顶点通过一系列边连接起来组成图这种数据结构」，与本次实现一致，**无需改文案**）。
- 路由 `src/router/index.ts:57-60` 已注册 `/docs/graph` → `Article/DataStructure/Graph.vue`。
- **可复用资产**：树/堆的「SVG 边 + 圆形节点」二维画法；栈/队列概念（遍历辅助结构）。
- **唯一缺口**：`Graph.vue` 是空壳（白屏）。**无需动路由/菜单/首页/骨架**。

## 两个地基决策（brainstorming + 交互原型已确认）

继承 C-015 页种决策，图新增两条：

1. **固定无向图 + 二维 SVG 画法 + 点顶点换起点**。一张固定小图：**6 顶点 A–F、7 条边**（连通且含环——D-E-F 三角 + A 经两臂下接，故 BFS/DFS 顺序明显不同、且布局无交叉线）。顶点坐标固定、SVG `<line>` 画边、圆形顶点（复用树/堆画法）。图**不增删**；**点顶点设为起点**（默认 A）。为什么 7 条：连通需 ≥5（树），有环需 ≥6，选 7 让环更明显、布局更舒服。
2. **BFS/DFS 遍历 + 辅助结构面板（收官回扣）**。点 BFS / DFS 从起点遍历，访问顺序在图上依次点亮（当前顶点强调）；旁边**辅助面板**显示队列（BFS「队列 →」）/ 栈（DFS「栈 ↑」）的当前前沿（frontier），跟着填/弹——「BFS 用队列、DFS 用栈」一目了然。BFS=`A B C D E F`、DFS=`A B D E F C`。

## 图与前面结构的差异（一句话）

图是**最一般**的结构（顶点 + 任意边、可成环），区别于树的「单父层次」；`useGraph` 暴露固定图（vertices/edges/adj）+ 纯 `bfs(start)`/`dfs(start)`（返回步序 `[{visit, frontier}]`）；可视化用 SVG 二维图 + 遍历点亮 + 队列/栈辅助面板；遍历把栈、队列两篇收官回扣。

## 要做什么

1. **图逻辑**（`src/components/structures/useGraph.ts`）
   - 固定图：`vertices: {id,label,x,y}[]`（6）+ `edges: [number,number][]`（7）+ `adj: number[][]`（邻接表）+ `labelOf` + 纯 `bfs(start)` / `dfs(start)`（返回 `[{visit, frontier}]` 步序，frontier = 队列/栈当前内容）。可单测（不 mount）。
2. **图互动组件**（`src/components/structures/GraphViz.vue`）
   - 复用 `useGraph`，渲染 BFS/DFS/重置 工具栏 + SVG 图（边 + 圆形顶点，可点换起点、起点高亮）+ 遍历动画（访问点亮 + 当前强调）+ 辅助面板（队列/栈 frontier）+ 状态解说（含访问顺序）。对标 `HashViz`（async + busy + 重置可中断）。
3. **图页**（`src/views/Article/DataStructure/Graph.vue`，填充空壳）
   - 在 `<Article>` 里穿插正文（什么是图：顶点+边+成环 / 遍历两路线 BFS 队列·DFS 栈·各自所长 / 怎么存：邻接表 vs 邻接矩阵 / 应用：路网·社交·调度 / **全系列收尾**）与 `<Playground><GraphViz/></Playground>`。正文以原型文案为基础。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M3 数据结构 8/8 收官）。

## 不做什么（边界）

- **不改/不重抽骨架**：`Article`/`Callout`/`Playground` 原样复用、零改动。
- **不做有向图 / 带权图 / 加删顶点边 / Dijkstra·拓扑排序 / 邻接矩阵互动**：固定「无向图 + BFS/DFS 遍历」。有向/带权/最短路正文一句带过。
- **图固定**（不增删）：聚焦遍历这一互动；构建图/表示对照不做（避免互动件过胀）。
- **不复用算法播放器、不改路由/菜单/首页/部署、不引入新依赖 / 不进 Pinia**（同 C-015~021）。

## 业务规则 / 约束

- **互动模型**：读者驱动、组件局部状态；遍历点亮 + 辅助面板为延时动画（setTimeout、卸载清理、busy 防重入、重置可中断）；`bfs/dfs` 纯函数同步返回步序（L3 可断言顺序）。
- **图语义**：无向图；`adj` 邻接表；`bfs` 用队列（FIFO，邻居按序入队）、`dfs` 用栈（邻居逆序入栈，先入先深）；均访问全部连通顶点、不重不漏；frontier = 当步队列/栈内容。固定 6 顶点 7 边。
- **可视化范式**（图特有）：SVG 二维（顶点圆 + 边线）；起点可点；访问深绿、当前更深 + 白环、起点主题绿环；辅助面板横排槽位；容器定宽。
- **向后兼容硬约束**：仅新增 `useGraph`/`GraphViz` + 填 `Graph.vue`；8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆 + 哈希 + 播放器 全部现有 Case 零改动通过。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（lines/functions/statements ≥70%、branches ≥60%，聚合）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 进 `/docs/graph` 不再白屏：一篇「可探索讲解」——标题 + 分节正文 + 内嵌互动图（6 顶点 SVG）+ 提示框。
- [ ] **互动图**：初始见 6 顶点 A–F + 7 边 + 默认起点 A 高亮；**点顶点换起点**；点 **BFS** 用队列一层层点亮（顺序 `A B C D E F`）、点 **DFS** 用栈一条道点亮（顺序 `A B D E F C`），辅助面板显队列/栈前沿；**重置** 清空；**容器定宽**。
- [ ] **遍历正确**：BFS/DFS 各访问全部 6 顶点、不重不漏；两顺序不同；frontier 对应队列/栈。
- [ ] **正文质量**：讲清图（顶点+边+环）+ BFS/DFS（队列/栈、各自所长）+ 邻接表/矩阵存法，并**收尾全系列**。
- [ ] **骨架可复用（硬验收）**：图页靠「复用骨架 + 新 `GraphViz` + `useGraph`」拼成，骨架零改动；全部现有 Case 仍绿。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap 回写；**M3 数据结构 8/8 收官**。

## 开放问题

- 固定图 6 顶点 7 边：连通 + 一个三角环，BFS/DFS 顺序差异明显、布局无交叉；已与用户确认（7 非特殊数、可调密/稀）。
- 遍历动画与可测性：`bfs/dfs` 同步返回步序、可单测顺序；组件 setTimeout 逐步点亮（L4 断言同步设置的访问顺序状态 + 队列/栈标签）。
- 不做有向/带权/构建：聚焦无向图 BFS/DFS 遍历，作 M3 收官；进阶留后续里程碑。

## 变更历史

- 2026-06-25：创建。brainstorming + 交互原型（`scratchpad/graph-prototype.html`，浏览器实点 BFS/DFS 验证两顺序不同 + 队列/栈面板）确认两条图特有决策——① **固定无向图（6 顶点 7 边）+ SVG 二维 + 点顶点换起点**；② **BFS/DFS 遍历 + 队列/栈辅助面板（收官回扣栈/队列）**。其余页种决策继承 C-015。
