# 需求：跳表 Skip List（新页，M4 广度第四项 B4·进阶首项）

> Status: verified
> Stable ID: C-20260629-032
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Progress: 100%
> Blocked by: none
> Next action: 已完成（21 Case + 改 2 HOOK，全门禁通过，已落 main）；**M4 广度 B4 ✓**，下一项 B5+（线段树/B树/布隆，待定）
> Replaces: none
> Replaced by: none
> Related plans: M4 候选池 `docs/plans/backlog.md` B4；C-028/029/031（广度新页 + 4 处接线范式）；回扣 C-018/C-025（链表/双向链表，跳表是「多层链表」）
> Related tests: 计划新增 `TC-SKIP-LOGIC-*`（useSkipList 纯逻辑）/ `TC-VIZ-SKIPVIZ-*`（SkipListViz 互动）/ `TC-VIEW-SKIP-01/02`（跳表页）/ `TC-E2E-SKIP-01`（跳表页 e2e）；**修改** `TC-HOOK-01-2`、`TC-HOOK-02-4`（数据结构数 11→12，因新增结构）

> ⚠️ 编号说明：全局计数 030 已被 `C-20260628-030`（头部个人主页外链）占用、031 为 LRU（C-20260629-031），本变更顺延为 **C-20260629-032**。

## 背景

M4 广度第四项 B4，也是**进阶结构**首项。继常用广度结构（B1 Trie / B2 并查集 / B3 LRU）收官后，应 Owner 选择继续 B4+ 进阶，新增**跳表 Skip List** 独立页。backlog 点名「Redis 有序集合」。

**定位**：跳表是给**有序链表**加若干层「**快车道**」的概率型结构——底层是全部元素的有序链表，上层每隔几个元素抽一个做索引。查找时从最高层快车道大步往右跳，跳过头了就下沉一层继续，于是平均 **O(log n)**，却比平衡树好实现。Redis 的有序集合（zset）底层就用它。它本质是「**多层链表**」，回扣前面的链表/双向链表。

**新页 vs 加节**：广度项需 **4 处接线**——路由 + 侧边菜单 + 首页网格 + 图标（套路同 B1/B2/B3，已跑通三次），外加 `Article/DataStructure/SkipList.vue`。

## 三个地基决策

1. **固定跳表**（仿图/字典树/并查集固定结构的稳妥做法，结构定死→可单测、不反流）：8 个有序值 `[1,3,5,7,9,11,13,15]`，层高 `[4,1,2,1,3,1,2,1]`——完美折半：**L0 全 8 个、L1 [1,5,9,13]、L2 [1,9]、L3 [1]**，外加一个贯穿所有层的 head 哨兵。**插入的随机层数（抛硬币）用正文讲清，不做随机互动**（否则不可测）。
2. **查找演楼梯式走位**：`search(target)` 从 head 最高层开始，**向右走**到「下一个就超过 target」，**下沉一层**继续，到底层判定命中。可视化把这条楼梯路径点亮，**高层快车道一步跳过中间一串元素**一眼可见。
3. **跳过可见**：查找时解说显走过的元素序列（如 `1 → 9 → 11`），与底层要逐个走（`1→3→5→7→9→11`）对照——快车道跳过了 3、5、7，这就是 O(log n) 的来源。

## 与现有结构页的关系（一句话）

`SkipListViz` 用「网格（列=元素、行=层级）+ 同层横向连线 + 走位点亮」画法（新的二维网格布局），讲「多层链表的快车道查找」——是链表家族的概率型延伸。

## 要做什么

1. **跳表逻辑**（`src/components/structures/useSkipList.ts`）
   - 固定 `nodes`（head + 8 元素，各带 value/height/col）+ `maxLevel`；`levelNodes(level)`/`present(node,level)`；`search(target)` 返回 `{found, path, visitedValues}`（path = 楼梯步序 {node,level,move}）。可单测（不 mount）。
2. **跳表互动组件**（`src/components/structures/SkipListViz.vue`）
   - 复用 `useSkipList`，渲染 输入 + 查找/重置 工具栏 + SVG 网格（head 哨兵 + 各层节点单元格 + 同层横向连线）+ 走位楼梯点亮 + 状态解说（走过序列 + 命中/不存在 + 跳过提示）。
3. **跳表页**（`src/views/Article/DataStructure/SkipList.vue`）
   - 「什么是跳表（有序链表 + 快车道）/ Playground(SkipListViz) / 楼梯查找 O(log n) + 随机层数插入正文 / 在哪里用（Redis zset、有序集合、并发跳表）」+ 回扣链表。
4. **新页 4 处接线**：路由 `/docs/skip-list` name `skip-list`；菜单 + 首页网格各加「跳表」（数据结构分类，LRU 之后）；`assets/skip-list.svg` 图标。
5. **测试与文档**：补 L3/L4/L5；**改** TC-HOOK-01-2 / TC-HOOK-02-4（11→12）；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（B4 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`。

## 不做什么（边界）

- **不做随机层数的真实插入/删除 / 真实并发跳表**：本页用固定结构演「快车道查找」一条主线；插入的随机抛硬币定层用正文讲清，不做互动（保证确定性可测）。
- **不改既有 11 结构页 / 排序 / 骨架 / 播放器**：仅新增 useSkipList/SkipListViz/SkipList.vue + 4 处接线 + 改 2 处 HOOK 计数。
- **不做其余进阶项**（B5+ 线段树/B 树/布隆）：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；`search` 纯函数同步返回 `{found, path}`（L4 可断言）；楼梯点亮为延时动画（setTimeout、卸载清理、busy 防重入）。
- **数据**：固定 8 值 `[1,3,5,7,9,11,13,15]`、层高 `[4,1,2,1,3,1,2,1]`、maxLevel 4、head 高 4；search 向右走 `next.value <= target` 否则下沉，到底层判 `=== target`。
- **可视化**：SVG 网格（col=元素位置、level=层；cell 含值；head 哨兵列）；同层相邻 present 节点连横线；走位路径点亮（path 黄、命中 hot 深绿）；容器定宽定高。
- **新页接线**：路由 name = slug `skip-list`；菜单/首页「跳表」置数据结构分类末（LRU 之后）；图标 1024 viewBox 黑剪影、`<img :src>` 引入。
- **向后兼容硬约束**：仅新增 + 4 处接线 + 2 处 HOOK 计数改（11→12，合理变更）；既有 11 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case 零改动通过（除 HOOK 两条计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 新增「跳表」页（`/docs/skip-list`）：菜单/首页可进入、不 404；正文 + 内嵌 SkipListViz。
- [ ] **互动**：见固定多层跳表（L0 全 8、上层折半、head 哨兵）；查找演楼梯走位（右→下沉），高层快车道跳过中间元素一眼可见；查找命中/不存在判定正确。
- [ ] **正文质量**：讲清「有序链表 + 快车道」「楼梯查找 O(log n)」「插入靠随机层数（抛硬币）」「Redis zset 等用途」，回扣链表。
- [ ] **零回归**：既有 11 结构 + 8 排序 + 播放器 全绿；仅 TC-HOOK-01-2/02-4 计数 11→12（合理）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog B4 出池标完成。

## 开放问题

- 固定结构、不做随机插入：保证可测；随机层数由正文交代。
- 8 元素 4 层的网格宽度：定宽容纳；元素更多会更宽，暂不扩。

## 变更历史

- 2026-06-29：创建。M4 广度 B4（进阶首项）出池。定位＝有序链表 + 多层快车道的概率型结构，楼梯查找 O(log n)。固定 8 值 4 层 + 楼梯走位查找，随机插入正文带过。新页 4 处接线（套路同 B1/B2/B3）+ 改 2 处 HOOK 计数 11→12。编号顺延 032（030 被个人主页外链占用、031 为 LRU）。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
