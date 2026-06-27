# 需求：并查集 Union-Find（新页，M4 广度第二项 B2）

> Status: verified
> Stable ID: C-20260627-029
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-27
> Last reviewed: 2026-06-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成（21 Case 全绿 + 改 2 HOOK，全门禁通过，已落 main）；**M4 广度 B2 ✓**，下一项 B3 LRU 缓存
> Replaces: none
> Replaced by: none
> Related plans: M4 候选池 `docs/plans/backlog.md` B2；C-20260626-028（B1 Trie，同为「广度新页 + 4 处接线」范式）
> Related tests: 计划新增 `TC-UF-LOGIC-*`（useUnionFind 纯逻辑）/ `TC-VIZ-UFVIZ-*`（UnionFindViz 互动）/ `TC-VIEW-UF-01/02`（并查集页）/ `TC-E2E-UF-01`（并查集页 e2e）；**修改** `TC-HOOK-01-2`、`TC-HOOK-02-4`（数据结构数 9→10，因新增结构）

## 背景

M4 广度第二项 B2。继 B1 字典树后新增**并查集 Union-Find（不相交集合 / DSU）**独立页。它是 backlog 点名「连通性、Kruskal、岛屿合并；合并 + 找根 + 路径压缩，出彩」的兑现。

**定位**：并查集把一堆元素分成若干**不相交的组**，专门极快地回答两类问题——`find(x)`「x 属于哪个组」（返回组的代表元/根）、`union(a,b)`「把 a、b 所在两组合并」。它不像前面的结构存「数据序列」，而是维护「**谁和谁同组**」的连通关系，是一种用途专一、实现精巧的结构。亮点是**路径压缩**：find 找到根后，把沿途节点直接指向根，使后续 find 几乎 O(1)。

**新页 vs 加节**：广度项与深度加节不同，需 **4 处接线**——路由 + 侧边菜单 + 首页网格 + 图标（套路同 B1 Trie，C-028 已跑通），外加 `Article/DataStructure/UnionFind.vue`。

## 三个地基决策

1. **固定 8 元素 + 父指针箭头**（定位同 Trie 固定结构的稳妥做法）：元素 0–7 **固定排一行、位置不动**；每个非根节点画一根**指向其 parent 的箭头**；初始各自成组（`parent[i]=i`、无箭头）。结构变化只体现在箭头增删/改向，**不反流**，可单测、好断言。
2. **三个操作**：`合并 union(a,b)`——把 a 的根指向 b 的根，连一根箭头；`查根 find(a)`——走位到根并演**路径压缩**（沿途节点箭头齐刷刷改指根）；`连通? connected(a,b)`——两者是否同根。读数显**组数（连通分量）**。
3. **路径压缩是核心卖点**：先连成一条链（如 0→1→2→3），再 `查根 0`——看它走 3 步到根、然后所有沿途箭头**直接指向根**，下次一步到位。这是并查集「近乎 O(1)」的关键，要演给读者看。

## 与现有结构页的关系（一句话）

`UnionFindViz` 复用「SVG 节点 + 边（箭头）+ 走位点亮」画法，但节点**位置固定、父指针为箭头**，演的是「分组连通 + 合并 + 路径压缩」——前面任何结构都没有的「维护等价关系」视角。

## 要做什么

1. **并查集逻辑**（`src/components/structures/useUnionFind.ts`）
   - `parent: number[]`（root 满足 `parent[i]===i`）；`find(x)` **纯走位**返回 `{root, path}`（不改 parent）；`union(a,b)` 合并（rootA→rootB）返回 `{merged, root, child}`；`connected(a,b)`；`compress(x)` 路径压缩（沿途指根，改 parent）；`groupCount`；`reset`。可单测（不 mount）。
2. **并查集互动组件**（`src/components/structures/UnionFindViz.vue`）
   - 复用 `useUnionFind`，渲染 两输入(a,b) + 合并/查根/连通?/重置 工具栏 + SVG（8 个固定节点 + 父指针箭头 `.uf-edge`）+ 组数读数 + 走位/压缩点亮 + 状态解说。
3. **并查集页**（`src/views/Article/DataStructure/UnionFind.vue`）
   - 「什么是并查集（分组、find/union）/ Playground(UnionFindViz) / 路径压缩正文 / 在哪里用（连通性、Kruskal MST、岛屿合并、网络连通）」。
4. **新页 4 处接线**：路由 `/docs/union-find` name `union-find`；菜单 + 首页网格各加「并查集」（数据结构分类，字典树之后）；`assets/union-find.svg` 图标。
5. **测试与文档**：补 L3/L4/L5；**改** TC-HOOK-01-2 / TC-HOOK-02-4（9→10）；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（B2 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`。

## 不做什么（边界）

- **不做按秩/按大小合并（union by rank/size）的对比 / 真实 Kruskal 跑图 / 删除**：本页聚焦「find/union/连通 + 路径压缩」一条主线；按秩合并正文一句带过、不做互动。
- **不改既有 9 结构页 / 排序 / 骨架 / 播放器**：仅新增 useUnionFind/UnionFindViz/UnionFind.vue + 4 处接线 + 改 2 处 HOOK 计数。
- **不做其余广度项**（B3 LRU…）：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；`union`/`find`/`connected`/`compress` **同步**改 parent 并同步返回结果、同步置 status（L4 可断言、无计时器锁）；走位/压缩/合并的点亮为短延时高亮（setTimeout、卸载清理）。
- **数据**：固定 8 元素 0–7；`union(a,b)` 把 rootA 指向 rootB；`find` 纯走位（不压缩）；`compress` 沿途指根；`groupCount` = 根的个数；输入 a/b 限 0–7。
- **可视化**：8 节点**固定排一行**、位置不动；父指针为**指向 parent 的箭头**（`.uf-edge`，每个非根一根）；走位点亮（path 黄 / root 深绿）；路径压缩后箭头改向根；组数读数；容器定宽定高。
- **新页接线**：路由 name = slug `union-find`（与菜单 url 一致）；菜单/首页「并查集」置数据结构分类末（字典树之后）；图标 1024 viewBox 黑剪影、`<img :src>` 引入。
- **向后兼容硬约束**：仅新增 + 4 处接线 + 2 处 HOOK 计数改（9→10，合理变更）；既有 9 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case 零改动通过（除 HOOK 两条计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 新增「并查集」页（`/docs/union-find`）：菜单/首页可进入、不 404；正文 + 内嵌 UnionFindViz。
- [ ] **互动**：见固定 8 节点（初始 8 组、无箭头）；合并连箭头、组数减少；连成链后查根演**路径压缩**（箭头齐刷刷指根）；连通? 正确判同组/异组。
- [ ] **正文质量**：讲清「分组 / find 找根 / union 合并」「路径压缩使近乎 O(1)」「连通性、Kruskal、岛屿合并等用途」。
- [ ] **零回归**：既有 9 结构 + 8 排序 + 播放器 全绿；仅 TC-HOOK-01-2/02-4 计数 9→10（合理）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog B2 出池标完成。

## 开放问题

- 父指针箭头用弧线绘制：8 节点一行、少量 union 下可读；若日后元素更多需换布局。
- 始终 rootA→rootB（不按秩合并）：可能造链——正好利于演路径压缩；按秩合并正文带过。

## 变更历史

- 2026-06-27：创建。M4 广度 B2 出池。定位＝维护「谁和谁同组」的连通关系结构。固定 8 元素 + 父指针箭头 + find/union/连通 + 路径压缩。新页 4 处接线（套路同 B1 Trie）+ 改 2 处 HOOK 计数 9→10。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
