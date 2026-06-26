# 需求：数组·扩容（数组页加一节「动态数组：容量满了怎么办——翻倍扩容」，M4 深度第五项 D5·深度收官）

> Status: verified
> Stable ID: C-20260626-027
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Progress: 100%
> Blocked by: none
> Next action: 已完成（20 Case 全绿，全门禁通过，已落 main）；**M4 深度 D5 ✓、深度 D1–D5 收官**，下一步转广度 B1 Trie
> Replaces: none
> Replaced by: none
> Related plans: C-20260624-017（数组/静态数组——本变更在其页**加一节**，补当年所砍的动态扩容）；M4 候选池 `docs/plans/backlog.md` D5；C-20260626-026（D4，同为「现有页加节」范式）
> Related tests: 计划新增 `TC-GROW-LOGIC-*`（useGrow 纯逻辑）/ `TC-VIZ-GROWVIZ-*`（ArrayGrowViz 互动）/ `TC-VIEW-ARRAY-03`（数组页含 ArrayGrowViz）/ `TC-E2E-ARRAY-02`（数组页扩容节 e2e）；不改写现有 TC-VIEW-ARRAY-01/02、修一处 TC-E2E-ARRAY-01（两 Playground 后 `.playground` 消歧）

## 背景

M4「数据结构深化与扩充」**深度第五项 D5、也是深度收官**。数组页（C-017）讲了**静态数组**：容量固定，随机访问 O(1)、中间增删 O(n)、尾部追加 O(1)。requirements「不做什么」当年砍掉了**动态扩容**（见 `docs/plans/backlog.md` D5）。本变更在数组页**加一节**，补上**动态数组的扩容机制**——容量满了就开一个翻倍的新数组、拷贝过去，并用**摊还分析**讲清「尾部追加为什么是均摊 O(1)」。

落点已与 Owner 确认：**数组页加一节**（不动菜单/路由/首页）。这是 backlog 点名「翻倍扩容 + 摊还分析这个漂亮论证」的兑现。

现状：数组页 `Article/DataStructure/Array.vue` 现有「什么是数组 / Playground(ArrayViz 静态) / 下标搬移正文 / 数组在哪里用」。本节插在**下标搬移正文之后、「数组在哪里用」之前**。

## 两个地基决策

1. **翻倍扩容 + 拷贝**：静态数组容量固定，`append` 到满了，动态数组（JS Array / C++ vector / Java ArrayList / Python list）的办法是——**分配一个 2 倍容量的新数组，把旧元素逐个拷过去（O(n)），再放入新元素**。这次拷贝很贵，但只在「正好装满」时才发生。
2. **摊还分析（均摊 O(1)）**：扩容虽是 O(n)，但**翻倍**使它**越来越少发生**——把每次扩容的拷贝成本摊到其后的多次 append 上，**每次 append 均摊只有常数次操作**。互动用一个**均摊读数**（append 次数 / 总拷贝 / 均摊值）让读者亲眼看到这个值始终**有界（≈常数）**。

## 与现有 ArrayViz 的关系（一句话）

`ArrayGrowViz` 是数组页第二个互动件，与 `ArrayViz`（C-017，静态数组访问/增删）**并列、互不依赖**；ArrayViz 讲「下标随机访问 + 中间搬移」，ArrayGrowViz 讲「容量满了翻倍扩容 + 均摊 O(1)」。元素类名用 `.gcell` 与数组 `.cell` 区隔（同页共存）。

## 要做什么

1. **扩容逻辑**（`src/components/structures/useGrow.ts`）
   - `items:[id,value][]` + `capacity`（当前容量）+ `length`；`append` 满则**容量翻倍 + 拷贝计数**再放入，返回 `{value, grew, copies, capacity}`；`appends`/`totalCopies` 累计 + `amortized` 计算属性（`(appends+totalCopies)/appends`，趋近常数）；`reset` 重建初始（容量 4、`[1,2,3]`）。可单测（不 mount）。
2. **扩容互动组件**（`src/components/structures/ArrayGrowViz.vue`）
   - 复用 `useGrow`，渲染 追加/重置 工具栏 + 定容格阵（`.gcell`：已用浅绿、预留虚框）+ 长度/容量读数 + **均摊统计读数** + 状态解说。`append` 未满直接放（O(1)）；满则翻倍 + 拷贝高亮（O(n)）。
3. **数组页加节**（`src/views/Article/DataStructure/Array.vue`，下标搬移正文后插入）
   - `<h2>动态数组：容量满了怎么办——翻倍扩容</h2>` + 正文（静态容量固定 → 满了翻倍 + 拷贝 O(n) → 摊还分析均摊 O(1) → 真实 vector/ArrayList/list）+ `<Playground><ArrayGrowViz/></Playground>`。
4. **测试与文档**：补 L3/L4/L5；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（D5 出池/完成、**深度收官**）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`（M4 深度收官、转广度）。

## 不做什么（边界）

- **不做缩容 / 不同增长因子对比（1.5×）/ 真实内存地址 / 删除触发缩容**：本节聚焦「翻倍扩容 + 均摊 O(1)」一条主线；增长因子取舍等正文可一句带过、不做互动。
- **不改 ArrayViz / useArray / 骨架 / 菜单 / 路由 / 首页**：仅新增 useGrow/ArrayGrowViz + 数组页加节。
- **不做广度项**：D5 完成后 M4 转广度 B1 Trie，另起变更。

## 业务规则 / 约束

- **互动模型**：读者驱动；`append` **同步**改 items/capacity/计数并同步返回结果、同步置 status（L4 可断言）；扩容时的「拷贝高亮」为延时动画（setTimeout、卸载清理）。
- **数据**：初始容量 `GROW_INIT_CAP=4`、`[1,2,3]`（长度 3，留 1 空位先演 O(1) 再演扩容）；`append` 值 ++seq；满（length==capacity）翻倍；`amortized=(appends+totalCopies)/appends`（append 0 时 0）。
- **可视化**：`.gcell`（已用浅绿 / 预留虚框 / 扩容拷贝高亮黄）；长度/容量 + 均摊读数；容器**定宽、随容量翻倍横向扩展但不跳版错乱**；高亮**贴格**（非手算坐标）。
- **向后兼容硬约束**：仅新增 `useGrow`/`ArrayGrowViz` + 数组页加节；ArrayViz/useArray 及 8 排序 + 其余 7 结构 + 播放器 全部现有 Case 零改动通过（数组页现有 TC-VIEW-ARRAY-01/02 仍绿；TC-E2E-ARRAY-01 仅因第二个 `.playground` 出现需 `.first()` 消歧、断言意图不变）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 数组页下标搬移段后多一节「动态数组：容量满了怎么办——翻倍扩容」：正文 + 内嵌 ArrayGrowViz。
- [ ] **互动**：默认见 4 格（3 已用 + 1 预留）；追加未满直接放（O(1)）；追加到满再追加触发**容量翻倍**（4→8→16）+ 拷贝高亮（O(n)）；均摊读数随追加更新、**始终有界（≈常数）**。
- [ ] **正文质量**：讲清「静态容量固定」「满了开 2 倍新数组 + 拷贝 O(n)」「翻倍使扩容越来越少 → 均摊 O(1)」「真实 vector/ArrayList/list 都这么做」。
- [ ] **零回归**：ArrayViz 及全部现有 Case 仍绿；数组页两个 Playground（ArrayViz + ArrayGrowViz）共存。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog D5 出池标完成、**M4 深度收官**。

## 开放问题

- 加节后数组页变长（两个互动件）：可接受；若日后过长再考虑拆姊妹页。
- 容量翻倍后格阵变宽：用合适初始容量（4）+ 限制连续扩容次数（到 16 即可说明问题），避免横向溢出。

## 变更历史

- 2026-06-26：创建。M4 深度 D5（**深度收官**）出池。落点=数组页加节；翻倍扩容 + 摊还分析均摊 O(1)，缩容/增长因子对比正文带过。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
