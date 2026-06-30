# 需求：桶排序 Bucket Sort（新页·全模板首例，M7 排序 S2 + M8 算法页三件套）

> Status: verified
> Stable ID: C-20260630-040
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Progress: 100%
> Blocked by: none
> Next action: 已完成（22 Case + 改 1 HOOK，已落 main、双轨部署）
> Replaces: none
> Replaced by: none
> Related plans: 排序候选池 `docs/plans/sorting-backlog.md` S2；roadmap M7（排序细分）+ **M8（算法页模板统一）**；C-006（算法播放器框架）；C-014/C-039（计数/基数排序——非比较线性排序、桶轨范式）
> Related tests: 计划新增 `TC-VIZ-BUCKETVIEW-*`（BucketView 新轨）/ `TC-PLAYER-BUCKET-*`（播放器接桶轨）/ `TC-BUCKET-MOD-*`（bucket-sort.module）/ `TC-VIEW-BUCKET-*`（桶排序页：正文 + 播放器）/ `TC-E2E-BUCKET-01`；**修改** 排序分类计数 TC-HOOK-02-4（排序 9→10）

> ⚠️ 编号：全局计数到 039（…038 Kruskal、039 基数排序）；日期 2026-06-30，本变更顺延为 **C-20260630-040**。

## 背景

两条线汇合：

- **M7 排序细分 S2**：桶排序是线性排序三件套（计数 ✓C-014 + 基数 ✓C-039 + **桶**）的最后一件。按值域分桶 → 桶内各自排序 → 合并。
- **M8 算法页模板统一**（2026-06-30 Owner 拍板）：**算法页 = 介绍正文 + 交互可视化 + 多语言代码播放器（三件套，单步同步）**。本变更是「全模板」**首例**——既有排序只有播放器没正文、图算法只有正文没播放器；从桶排序起，新算法直接三件齐全。

**定位**：桶排序不直接比较全体，而是**按值域把元素撒进若干「桶」**，每个桶内部各自排序（这里用插入排序），最后**按桶序拼接**即整体有序。适合数据大致**均匀分布**，平均 O(n+k)。

## 三个地基决策

1. **固定输入 + 固定分桶**（仿所有可视化的固定数据 → 可测）：`[29,25,3,49,9,37,21,43]`（8 个、值域 0–49），分 **5 个桶**（每桶宽 10：桶 b 管 `[b*10, b*10+9]`，`bucketOf(v)=⌊v/10⌋`）。
   - 分配：桶0`[3,9]`、桶1`[]`（空桶，演示）、桶2`[29,25,21]`、桶3`[37]`、桶4`[49,43]`。
   - 桶内排序：桶2`[29,25,21]→[21,25,29]`、桶4`[49,43]→[43,49]`（其余已有序）。
   - 合并：`[3,9]+[]+[21,25,29]+[37]+[43,49]` = `[3,9,21,25,29,37,43,49]` ✓ 有序。
2. **新建 BucketView 桶轨**（M8 基建）：桶里装**实际元素列表 + 桶内排序**，CountView 的「计数萝卜」不够 → 新增 `bucket?: BucketTrack` 到 `Step`、新 `BucketView.vue`、AlgorithmPlayer 加 `v-if="current.bucket"`——与既有 aux/stack/tree/count 一样的**纯加法第 6 条轨**，既有算法不设 bucket → 不渲染 → 零回归。
3. **全模板页**：`BucketSort.vue` = `<Article>` 介绍正文（什么是桶排序 / 分桶+桶内排序+合并 / 复杂度 / 适用均匀分布、对照计数与基数）+ `<AlgorithmPlayer :module="bucketSortModule"/>`（可视化 BucketView 轨 + 多语言代码播放器 + 单步/播放）。

## 要做什么

1. **BucketView 桶轨**（`src/components/BucketView.vue` + `BucketTrack` 类型 + `BucketExecPoint`，加到 `player/types.ts`，additive）：渲染 N 个桶（值域标签 + 桶内元素数值格子 + 活跃桶高亮）。
2. **AlgorithmPlayer 接桶轨**（`src/components/player/AlgorithmPlayer.vue`）：加 `<BucketView v-if="current.bucket" :bucket="current.bucket" />`（additive）。
3. **桶排序算法模块**（`src/algorithms/bucket-sort.module.ts` + `bucket-sort.ts` oracle + `bucket-sort.sources.ts` 4 语言）：产出步骤序列（distribute / sortBucket / concat / done）。
4. **桶排序页**（`src/views/Article/SortAlgorithm/BucketSort.vue`）：Article 介绍正文 + AlgorithmPlayer（全模板）。
5. **新页 4 处接线**：路由 `/docs/bucket-sort` name `bucket-sort`；菜单 + 首页排序分类 children 各追加「桶排序」（基数排序之后）；`assets/bucket.svg` 图标（已存在）。
6. **测试与文档**：补 L3（module + BucketView 轨）/L4（视图 + 播放器桶轨）/L5（e2e）；**改 TC-HOOK-02-4**（排序 9→10）；回写 `index.md`、`sorting-backlog.md`（S2 出池/收官）、三 `test-cases`、`roadmap`（M7 + M8）。

## 不做什么（边界）

- **不做可调桶数 / 负数 / 浮点 / 桶内用别的排序 / 大数据**：固定 8 个整数、5 桶、桶内插入排序主线。
- **不改算法播放器框架的既有轨 / 既有 9 排序 / 数据结构 / 图算法**：仅新增 BucketView 轨（additive）+ bucket-sort + BucketSort.vue + 4 处接线 + 改排序 TC-HOOK 计数。既有播放器 Case（含 count/aux/stack/tree 轨）零回归。
- **本变更不返工图算法 / 不给其余 8 排序加正文**：那是 M8 的后续变更（GraphView 轨 + Dijkstra/Kruskal 重构、排序批量补正文）。本变更只立「全模板」首例。

## 业务规则 / 约束

- **互动模型**：复用算法播放器（单步/播放 + 代码行高亮 + 变量面板）；算法模块纯函数产出确定步骤（L3 可断言）；正文为静态讲解。
- **数据**：固定 `[29,25,3,49,9,37,21,43]`；5 桶宽 10；分配 → 桶内插入排序 → 合并；最终 `[3,9,21,25,29,37,43,49]`。
- **可视化**：新 BucketView 桶轨（值域标签 + 桶内元素 + 活跃桶高亮）+ 主轨 BarsView（合并阶段填充有序结果）；容器定宽。
- **新页接线**：路由 name = slug `bucket-sort`；菜单/首页「桶排序」置「基数排序」之后；图标 `bucket.svg`（已存在）。
- **向后兼容硬约束**：仅新增 + BucketView additive 轨 + 4 处接线 + 改排序 TC-HOOK 计数（9→10）；既有 9 排序 + 15 结构 + 图算法 + 播放器（各轨）全部现有 Case 零改动通过（除排序计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 菜单/首页「经典排序算法」下出现**第 10 项「桶排序」**，可进入、不 404。
- [ ] 新增「桶排序」页（`/docs/bucket-sort`）：**介绍正文 + 交互可视化（BucketView 桶轨）+ 多语言代码播放器**三件齐全（全模板首例）。
- [ ] **互动**：单步看到——8 个数分到 5 桶（桶 1 空）、桶内排序（桶 2 `[29,25,21]→[21,25,29]`）、合并回主轨；末态有序 `[3,9,21,25,29,37,43,49]`。
- [ ] **正文质量**：讲清「分桶 + 桶内排序 + 合并」「适合均匀分布」「平均 O(n+k)、最坏退化」「对照计数/基数」。
- [ ] **零回归**：既有 9 排序 + 15 结构 + 图算法 + 播放器各轨全绿；仅排序 TC-HOOK-02-4 计数 9→10。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap（M7/M8）+ sorting-backlog 回写；S2 出池标完成、线性三件套收官。

## 开放问题

- BucketView 桶内元素布局（竖排格子 + 值域标签）；活跃桶高亮（分配入桶 / 桶内排序 / 合并取出）。
- 桶内排序步骤粒度：本变更每桶一步（显示排序前→后），不逐次插入比较（保持步数可控）；更细粒度后续可选。

## 变更历史

- 2026-06-30：创建。M7 排序 S2（线性三件套收官）+ M8 算法页模板统一首例。Owner 拍板「算法页 = 正文 + 可视化 + 代码播放器」。固定 8 数 5 桶（宽 10）分配 → 桶内插入排序 → 合并。新建 BucketView 第 6 条 additive 轨（桶装元素列表）；桶排序页 = Article 正文 + AlgorithmPlayer。新页 4 处接线 + 改排序 TC-HOOK 计数 9→10。编号顺延 040。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
