# 需求：LRU 缓存（新页，M4 广度第三项 B3）

> Status: verified
> Stable ID: C-20260629-031
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Progress: 100%
> Blocked by: none
> Next action: 已完成（21 Case + 改 2 HOOK，全门禁通过，已落 main）；**M4 广度 B3 ✓**，下一项 B4+ 进阶（跳表/线段树/B树/布隆）
> Replaces: none
> Replaced by: none
> Related plans: M4 候选池 `docs/plans/backlog.md` B3；C-20260626-028（B1 Trie）、C-20260627-029（B2 并查集，同为「广度新页 + 4 处接线」范式）；回扣 C-20260625-021（哈希表）、C-20260625-018/C-20260626-025（链表/双向链表）
> Related tests: 计划新增 `TC-LRU-LOGIC-*`（useLRU 纯逻辑）/ `TC-VIZ-LRUVIZ-*`（LruViz 互动）/ `TC-VIEW-LRU-01/02`（LRU 页）/ `TC-E2E-LRU-01`（LRU 页 e2e）；**修改** `TC-HOOK-01-2`、`TC-HOOK-02-4`（数据结构数 10→11，因新增结构）

## 背景

M4 广度第三项 B3。继 B1 字典树、B2 并查集后新增 **LRU 缓存（Least Recently Used）** 独立页。它是 backlog 点名「经典组合结构、面试常考；呼应前面两结构联动」的兑现。

**定位**：LRU 缓存是个**定容**的键值缓存，满了就淘汰**最久没被用过**的那一项。它最经典的实现是**哈希表 + 双向链表的组合**——哈希表负责 `O(1)` 按 key 定位节点，双向链表负责 `O(1)` 把节点挪到「最近使用」一端、并从「最久没用」一端淘汰。于是 `get`/`put` 都是 `O(1)`。这正好把前面学过的**哈希表**（靠算 O(1)）和**双向链表**（改指针 O(1)、可两端操作）联动起来，是一道很好的「组合结构」收尾题。

**新页 vs 加节**：广度项需 **4 处接线**——路由 + 侧边菜单 + 首页网格 + 图标（套路同 B1/B2，已跑通两次），外加 `Article/DataStructure/Lru.vue`。

## 三个地基决策

1. **按「最近使用」排成一行**（聚焦淘汰策略，而非画两个数据结构）：缓存项排成一排，**最左 = 最近用（MRU）**、**最右 = 最久没用（LRU，下一个被淘汰）**。哈希表的「O(1) 定位」用正文讲清，可视化专注最直观的**recency 顺序 + 淘汰**。
2. **get / put 的几种结局**：`get(key)` 命中 → 取到值并把该项**跳到最前**（变最近用）；未命中 → 提示没有。`put(key,value)` 新键 → 放最前；**满了 → 淘汰最右（LRU）**再放；已有键 → 更新值并移最前。
3. **淘汰演给读者看**：缓存填满后再 put 一个新键，最右那项**离场**（被淘汰），新键从最前进入——「最久没用的先走」一眼可见。

## 与现有结构页的关系（一句话）

`LruViz` 复用「横向车道 + 端标记 + TransitionGroup 进出/重排」画法（承袭 Queue/Deque），但语义是「按最近使用排序 + 满了淘汰最久没用」——把哈希表 + 双向链表两种结构组合起来用。正文显式回扣哈希页与链表双向那节。

## 要做什么

1. **LRU 逻辑**（`src/components/structures/useLRU.ts`）
   - `entries: [id,key,value][]`（index 0 = MRU 最近用、末位 = LRU 最久没用）；`capacity`；`get(key)` 命中移最前/未命中；`put(key,value)` 新增（满则淘汰末位）/更新移最前；返回结果含 `type` 与可能的 `evicted`；`size`；`reset`。可单测（不 mount）。
2. **LRU 互动组件**（`src/components/structures/LruViz.vue`）
   - 复用 `useLRU`，渲染 key/value 输入 + get/put/重置 工具栏 + 横向缓存车道（`.lru-cell` 显 key:value + MRU/LRU 端标记 + TransitionGroup）+ 容量读数 + 状态解说（命中/未命中/新增/更新/淘汰）。
3. **LRU 页**（`src/views/Article/DataStructure/Lru.vue`）
   - 「什么是 LRU 缓存（定容、淘汰最久没用）/ Playground(LruViz) / 哈希+双链表如何 O(1) 正文 / 在哪里用（页面缓存、数据库缓冲池、CPU cache、浏览器）」+ 回扣哈希/双向链表。
4. **新页 4 处接线**：路由 `/docs/lru` name `lru`；菜单 + 首页网格各加「LRU 缓存」（数据结构分类，并查集之后）；`assets/lru.svg` 图标。
5. **测试与文档**：补 L3/L4/L5；**改** TC-HOOK-01-2 / TC-HOOK-02-4（10→11）；回写 `docs/plans/index.md`、`docs/plans/backlog.md`（B3 出池/完成）、`docs/test-cases/{index,by-layer,by-module}.md`、`docs/roadmap.md`。

## 不做什么（边界）

- **不做真实哈希桶 + 双链表双视图同屏 / LFU 等其它淘汰策略 / 真实 TTL 过期**：本页聚焦「LRU 的最近使用排序 + 淘汰」一条主线；哈希+双链表如何 O(1) 用正文讲清，不画两个结构。
- **不改既有 10 结构页 / 排序 / 骨架 / 播放器**：仅新增 useLRU/LruViz/Lru.vue + 4 处接线 + 改 2 处 HOOK 计数。
- **不做其余广度项**（B4+ 进阶）：各自后续。

## 业务规则 / 约束

- **互动模型**：读者驱动；`get`/`put` **同步**改 entries 并同步返回结果、同步置 status（L4 可断言、无计时器锁）；重排/进出由 TransitionGroup（cosmetic）。
- **数据**：固定容量 `LRU_CAP=4`；初始 keys MRU→LRU = `[3,2,1]`（值 30/20/10）；entries 用稳定 id 驱动 TransitionGroup；淘汰取末位（LRU）。
- **可视化**：`.lru-cell`（显 key:value）；最左 MRU 标记、最右 LRU 标记「下一个淘汰」；横向车道**定宽定高、空与满同尺寸**（不跳版）；端标记**贴元素跟随**。
- **新页接线**：路由 name = slug `lru`；菜单/首页「LRU 缓存」置数据结构分类末（并查集之后）；图标 1024 viewBox 黑剪影、`<img :src>` 引入。
- **向后兼容硬约束**：仅新增 + 4 处接线 + 2 处 HOOK 计数改（10→11，合理变更）；既有 10 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case 零改动通过（除 HOOK 两条计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 新增「LRU 缓存」页（`/docs/lru`）：菜单/首页可进入、不 404；正文 + 内嵌 LruViz。
- [ ] **互动**：见缓存按最近使用排序（MRU 左 / LRU 右）；get 命中跳最前、未命中提示；put 新键进最前、满了淘汰最右、已有键更新移最前；淘汰一眼可见。
- [ ] **正文质量**：讲清「LRU 定容、淘汰最久没用」「哈希 O(1) 定位 + 双链表 O(1) 调序 → get/put 都 O(1)」「页面/数据库/CPU 缓存等用途」，回扣哈希与双向链表。
- [ ] **零回归**：既有 10 结构 + 8 排序 + 播放器 全绿；仅 TC-HOOK-01-2/02-4 计数 10→11（合理）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + backlog 回写；backlog B3 出池标完成。

## 开放问题

- 只画一行 recency 顺序、不画哈希桶：聚焦淘汰策略；哈希+双链表的 O(1) 由正文交代（回扣两页）。
- 容量 4：够演淘汰又不过宽。

## 变更历史

- 2026-06-29：创建。M4 广度 B3 出池。定位＝哈希表 + 双向链表组合的定容缓存，淘汰最久没用。按最近使用排一行 + get/put + 淘汰演示，回扣哈希/双向链表两页。新页 4 处接线（套路同 B1/B2）+ 改 2 处 HOOK 计数 10→11。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
