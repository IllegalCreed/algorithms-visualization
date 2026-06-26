# 需求：链表·双向（链表页加一节「双向链表：再加一根 prev 指针」，M4 深度第三项 D3）

> Status: verified
> Stable ID: C-20260626-025
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Progress: 100%
> Blocked by: none
> Next action: 已完成（20 Case 全绿，全门禁通过，已落 main）；**M4 深度 D3 ✓**，下一项 D4 队列·双端
> Replaces: none
> Replaced by: none
> Related plans: C-20260625-018（链表/单链表——本变更在其页**加一节**，补当年所砍的双向链表）；M4 候选池 `docs/plans/backlog.md` D3；C-20260625-023（D1）、C-20260626-024（D2，同为「现有页加节」范式）
> Related tests: 计划新增 `TC-DLINK-LOGIC-*`（useDlink 纯逻辑）/ `TC-VIZ-DLINKVIZ-*`（DlinkViz 互动）/ `TC-VIEW-LINK-03`（链表页含 DlinkViz）/ `TC-E2E-LINK-02`（链表页双向节 e2e）；不改写现有 TC-VIEW-LINK-01/02、修一处 TC-E2E-LINK-01（两 Playground 后 `.playground` 消歧）

## 背景

M4「数据结构深化与扩充」**深度第三项 D3**。链表页（C-018）只讲了**单链表**：每个节点一根 `next`，只能从 head 往后走。requirements「不做什么」当年砍掉了**双向链表 / 循环链表**（见 `docs/plans/backlog.md` D3）。本变更在链表页**加一节**，补上**双向链表**——给每个节点再加一根 `prev` 指针，换来两件单链表做不到的事。

落点已与 Owner 确认：**链表页加一节**（不动菜单/路由/首页）。互动深度：聚焦 prev 指针带来的**两个标志性能力**（反向遍历 + 给定节点 O(1) 删除），循环链表正文一句带过。

现状：链表页 `Article/DataStructure/Link.vue` 现有「什么是链表 / Playground(LinkViz 单链表) / 查找逐跳正文 / 链表在哪里用」。本节插在**查找逐跳正文之后、「链表在哪里用」之前**。

## 两个地基决策

1. **prev 指针的两个标志性收益**（对照单链表）：① **反向遍历**——双链表能从 tail 沿 `prev` 往回走，单链表只有 `next` 做不到；② **给定任意节点 O(1) 删除**——单链表只拿到一个节点时，得从 head 走 O(n) 找它的前驱才能删；双链表节点自带 `prev`，直接 `prev.next=next; next.prev=prev`，O(1)，不用找前驱。
2. **可视化用双向连接**：节点间画 `→`(next) + `←`(prev) 一对箭头，**视觉上就是「双链」**；head/tail 双锚点 + 两端 null。点节点选中 → 「删除选中」演 O(1) 接线（高亮重新桥接的两侧）；「← 反向遍历」从 tail 沿 prev 逐个点亮。

## 与现有 LinkViz 的关系（一句话）

`DlinkViz` 是链表页第二个互动件，与 `LinkViz`（C-018，单链表查找/增删）**并列、互不依赖**；LinkViz 讲「单链表访问 O(n)/增删 O(1)」，DlinkViz 讲「prev 指针带来反向遍历 + 无需找前驱的 O(1) 删除」。复用「节点 + 箭头 + null + TransitionGroup」画法，节点类名用 `.dnode` 与单链表 `.node` 区隔（同页共存）。

## 要做什么

1. **双向链表逻辑**（`src/components/structures/useDlink.ts`）
   - `items:[id,value][]`（head→tail）；`forward`（正向值序）/`backward`（反向值序，沿 prev）；`select` 选中 toggle；`removeAt` 删 selected 并返回 O(1) 接线信息 `{value, rewire:{left, right}}`；`reset` 重建初始 `[10,20,30,40]`。可单测（不 mount）。
2. **双向链表互动组件**（`src/components/structures/DlinkViz.vue`）
   - 复用 `useDlink`，渲染 反向遍历/删除选中/重置 工具栏 + 节点链（节点 `.dnode` + `→/←` 双箭头 + head/tail + 两端 null + TransitionGroup）+ 状态解说。反向遍历沿 prev 逐点点亮、删除演 O(1) 接线高亮。对标 `LinkViz`（setTimeout + 卸载清理）。
3. **链表页加节**（`src/views/Article/DataStructure/Link.vue`，查找逐跳正文后插入）
   - `<h2>双向链表：再加一根 prev 指针</h2>` + 正文（prev 指针 → 反向遍历 + 无需找前驱的 O(1) 删除；循环链表一句带过）+ `<Playground><DlinkViz/></Playground>`。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（D3 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M4 进度）。

## 不做什么（边界）

- **不做循环链表互动 / 双向插入（before）/ 反向增删全套**：本节聚焦 prev 的两个标志收益（反向遍历 + O(1) 删除）；循环链表仅正文一句带过。
- **不改 LinkViz / useLink / 骨架 / 菜单 / 路由 / 首页**：仅新增 useDlink/DlinkViz + 链表页加节。
- **不做其余深度项**（D4–D5）/ 广度项：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；反向遍历/删除接线的点亮为延时动画（setTimeout、卸载清理）；`removeAt` 同步改 items 并同步返回结果，`forward`/`backward` 计算属性，L4 可断言不依赖计时器。
- **数据**：固定初始 `[10,20,30,40]`（4 节点，便于演示中部删除 + 反向遍历）；`DLINK_MAX` 限容；removeAt 返回前驱/后继锚点（`left:number|'head'`、`right:number|'tail'`）供高亮。
- **可视化**：节点 `.dnode`（idle 浅绿 / 选中深绿环 / 反向遍历点亮白底绿环）；`→/←` 双箭头（改写时脉冲）；head/tail 双锚点 + 两端 null；容器**定宽定高、空与满同尺寸**（不跳版）；箭头/高亮**贴节点跟随**（非手算坐标）。
- **向后兼容硬约束**：仅新增 `useDlink`/`DlinkViz` + 链表页加节；LinkViz/useLink 及 8 排序 + 其余 7 结构 + 播放器 全部现有 Case 零改动通过（链表页现有 TC-VIEW-LINK-01/02 仍绿；TC-E2E-LINK-01 仅因第二个 `.playground` 出现需 `.first()` 消歧、断言意图不变）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 链表页查找逐跳段后多一节「双向链表：再加一根 prev 指针」：正文 + 内嵌 DlinkViz。
- [ ] **互动**：默认见 4 节点双向链（`→/←` 双箭头 + head/tail + 两端 null）；点「← 反向遍历」从 tail 沿 prev 逐个点亮（40→30→20→10）；点节点选中 → 「删除选中」演 O(1) 接线、节点离场、解说强调「自带 prev、不用找前驱」。
- [ ] **正文质量**：讲清「prev 指针」「反向遍历（单链表做不到）」「给定节点 O(1) 删除 vs 单链表 O(n) 找前驱」「循环链表（尾接头）」。
- [ ] **零回归**：LinkViz 及全部现有 Case 仍绿；链表页两个 Playground（LinkViz + DlinkViz）共存。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog D3 出池标完成。

## 开放问题

- 加节后链表页变长（两个互动件）：可接受；若日后过长再考虑拆姊妹页。
- 互动只删不增：聚焦 prev 收益、保持精炼；删空后用「重置」复原（与单链表 LinkViz 的增删互补，不重复）。

## 变更历史

- 2026-06-26：创建。M4 深度 D3 出池。落点=链表页加节；聚焦 prev 的两个标志收益（反向遍历 + O(1) 删除无需找前驱），循环链表正文带过。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
