# 需求：线段树 Segment Tree（新页，M4 广度第五项 B5·进阶）

> Status: verified
> Stable ID: C-20260629-033
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Progress: 100%
> Blocked by: none
> Next action: 已完成（23 Case + 改 2 HOOK，全门禁绿，双轨部署）
> Replaces: none
> Replaced by: none
> Related plans: M4 候选池 `docs/plans/backlog.md` B5；C-028/029/031/032（广度新页 + 4 处接线范式）；回扣 C-019/C-013（树/堆——线段树是「数组装的二叉树」、复用 pos 定位）
> Related tests: 计划新增 `TC-SEG-LOGIC-*`（useSegTree 纯逻辑）/ `TC-VIZ-SEGVIZ-*`（SegTreeViz 互动）/ `TC-VIEW-SEG-01/02`（线段树页）/ `TC-E2E-SEG-01`（线段树页 e2e）；**修改** `TC-HOOK-01-2`、`TC-HOOK-02-4`（数据结构数 12→13，因新增结构）

> ⚠️ 编号：全局计数 030 个人主页外链、031 LRU、032 跳表，本变更顺延为 **C-20260629-033**。

## 背景

M4 广度第五项 B5（进阶）。继跳表后新增**线段树 Segment Tree** 独立页。backlog 点名「区间查询（竞赛向）」。

**定位**：线段树是一棵二叉树，**每个节点管一段区间、存这段的聚合值**（这里用**区间和**，也可换成 min/max）。它专治「**区间查询 + 单点/区间更新**」：区间求和不必逐个累加，只要把目标区间拆成 **O(log n) 个「现成的整段」**相加；改一个元素，只需更新它到根的**一条路径**。两者都是 `O(log n)`。它本质是「用数组装的二叉树」，复用前面树/堆的 pos 定位。

**新页 vs 加节**：广度项需 **4 处接线**——路由 + 侧边菜单 + 首页网格 + 图标（套路已跑通 4 次），外加 `Article/DataStructure/SegmentTree.vue`。

**与树状数组的关系**：树状数组（Fenwick/BIT）是更紧凑（一维数组 + lowbit）但不那么直观的同类区间结构；本页聚焦更可视、更通用的**线段树**，树状数组作为「更省空间的替代」正文一句带过，不单独成页。

## 三个地基决策

1. **固定线段树**（仿图/字典树/并查集/跳表固定结构的稳妥做法，结构定死→可单测）：数组 `[2,5,1,4,9,3,7,6]`（8 元素）建**求和**线段树，**15 节点完美二叉树**（8 叶 + 7 内部），复用堆/树的 `pos`（0 下标，children 2p+1/2p+2）+ 定位数学。root 管 `[0,7]`、和 37。
2. **区间查询演「拆成整段」**：`query(l,r)` 递归——节点区间**完全落在 [l,r] 内**就整段取用（一个「canonical 整段」），否则下沉左右孩子。可视化把这些**被取用的整段节点点亮**，显「只碰了 N 个节点（≈log n）就求出区间和」，对照逐个累加的 O(n)。
3. **单点更新演「一条路径」**：`update(i,v)` 把第 i 个叶子改成 v，再沿**叶→根路径**更新每个祖先的和。可视化点亮这条路径，显「只动 log n 个节点」。

## 与现有结构页的关系（一句话）

`SegTreeViz` 复用「SVG 二叉树（圆/方节点 + 边）+ pos 定位 + 走位点亮」画法（承袭 TreeViz/HeapViz），但节点存的是**区间聚合**、查询点亮的是**覆盖区间的整段集合**——讲 BST/堆都没讲的「区间查询」。

## 要做什么

1. **线段树逻辑**（`src/components/structures/useSegTree.ts`）
   - 固定数组建求和线段树，`nodes`（pos/lo/hi/sum/depth/isLeaf）；`query(l,r)` 纯函数返回 `{sum, covered}`（覆盖的整段 pos 集）；`update(i,val)` 改叶 + 沿叶→根更新 sum，返回 `{path}`；`reset`。可单测（不 mount）。
2. **线段树互动组件**（`src/components/structures/SegTreeViz.vue`）
   - 复用 `useSegTree`，渲染 a/b 两输入 + 区间和/更新/重置 工具栏 + SVG 二叉树（节点显区间和 + 边）+ 查询覆盖点亮 / 更新路径点亮 + 状态解说（和 + 碰到节点数 / 更新路径）。
3. **线段树页**（`src/views/Article/DataStructure/SegmentTree.vue`）
   - 「什么是线段树（每节点管一段、存聚合）/ Playground(SegTreeViz) / 区间查询拆整段 O(log n) + 单点更新一条路径 + 树状数组带过 / 在哪里用（区间和·最值、竞赛、统计）」+ 回扣树/堆。
4. **新页 4 处接线**：路由 `/docs/segment-tree` name `segment-tree`；菜单 + 首页网格各加「线段树」（数据结构分类，跳表之后）；`assets/segment-tree.svg` 图标。
5. **测试与文档**：补 L3/L4/L5；**改** TC-HOOK-01-2 / TC-HOOK-02-4（12→13）；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（B5 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`。

## 不做什么（边界）

- **不做区间更新 + 懒标记（lazy propagation）/ 单独的树状数组页 / 可变数组长度**：本页聚焦「区间查询拆整段 + 单点更新一条路径」一条主线；懒标记、树状数组用正文带过。
- **不改既有 12 结构页 / 排序 / 骨架 / 播放器**：仅新增 useSegTree/SegTreeViz/SegmentTree.vue + 4 处接线 + 改 2 处 HOOK 计数。
- **不做其余进阶项**（B6 B 树 / B7 布隆）：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；`query` 纯函数同步返回 `{sum, covered}`、`update` 同步改 sum 返回 path（L4 可断言）；点亮为延时动画（setTimeout、卸载清理、busy 防重入）；重置始终可点（中断）。
- **数据**：固定数组 `[2,5,1,4,9,3,7,6]`；求和线段树 15 节点（pos 0..14、叶 7..14）；root [0,7] 和 37；query 递归拆整段；update 沿叶→根。输入 a/b 限合法下标范围。
- **可视化**：SVG 二叉树（节点显 sum / 叶显值 / 可带 [lo,hi]）；覆盖整段点亮（绿）、更新路径点亮（黄）；复用 pos 定位；容器定宽定高。
- **新页接线**：路由 name = slug `segment-tree`；菜单/首页「线段树」置数据结构分类末（跳表之后）；图标 1024 viewBox 黑剪影、`<img :src>` 引入。
- **向后兼容硬约束**：仅新增 + 4 处接线 + 2 处 HOOK 计数改（12→13，合理变更）；既有 12 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case 零改动通过（除 HOOK 两条计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 新增「线段树」页（`/docs/segment-tree`）：菜单/首页可进入、不 404；正文 + 内嵌 SegTreeViz。
- [ ] **互动**：见 15 节点求和线段树（root 37、叶 = 原数组）；区间和拆成少数整段点亮、显和；单点更新点亮叶→根路径、各和更新；只碰 O(log n) 个节点一眼可见。
- [ ] **正文质量**：讲清「每节点管一段存聚合」「区间查询拆整段 O(log n)」「单点更新一条路径 O(log n)」「树状数组是更省空间的替代」「竞赛/区间统计用途」，回扣树/堆。
- [ ] **零回归**：既有 12 结构 + 8 排序 + 播放器 全绿；仅 TC-HOOK-01-2/02-4 计数 12→13（合理）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog B5 出池标完成。

## 开放问题

- 固定数组、不做区间更新/懒标记：保证可测 + 聚焦；懒标记由正文交代。
- 8 元素 15 节点的树宽度：定宽容纳；更多元素会更宽，暂不扩。

## 变更历史

- 2026-06-29：创建。M4 广度 B5（进阶）出池。定位＝每节点管一段区间存聚合的二叉树，区间查询拆整段 / 单点更新一条路径，均 O(log n)。固定 8 元素求和树 + 查询/更新走位，区间更新懒标记 + 树状数组正文带过。新页 4 处接线 + 改 2 处 HOOK 计数 12→13。编号顺延 033。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
