# 需求：三路快排 3-way Quicksort（新页·全模板，M7 排序 S3 阶段二首项）

> Status: verified
> Stable ID: C-20260630-041
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Progress: 100%
> Blocked by: none
> Next action: 已完成（16 Case + 改 1 HOOK，已落 main、双轨部署）
> Replaces: none
> Replaced by: none
> Related plans: 排序候选池 `docs/plans/sorting-backlog.md` S3；roadmap M7（排序细分，阶段二首项）+ M8（算法页全模板，沿用 C-040 立的标准）；C-006（算法播放器框架）；C-012（快速排序——Lomuto + 区间栈 + StackView 轨，本变更复用范式）
> Related tests: 计划新增 `TC-3WQUICK-MOD-*`（three-way-quick.module）/ `TC-VIEW-3WQUICK-*`（三路快排页：正文 + 播放器）/ `TC-E2E-3WQUICK-01`；**修改** 排序分类计数 TC-HOOK-02-4（排序 10→11）

> ⚠️ 编号：全局计数到 040（…039 基数、040 桶排序）；日期 2026-06-30，本变更顺延为 **C-20260630-041**。

## 背景

- **M7 排序细分 S3**：阶段一（线性排序补齐：基数 ✓C-039 + 桶 ✓C-040）已收官，进**阶段二（主流排序的工程变体）首项 三路快排**。
- **定位**：普通快排（Lomuto/Hoare）遇到**大量重复元素**会退化——相等元素被反复划分、递归很深。**三路快排**用**荷兰国旗（Dutch National Flag）划分**，一趟把区间分成 `< pivot` / `== pivot` / `> pivot` **三段**，等于 pivot 的元素**一次性归位、不再参与递归**——重复元素越多越快（极端全相等时 O(n)）。
- **M8 全模板**：沿用 C-040 立的标准——算法页 = 介绍正文 + 交互可视化 + 多语言代码播放器。三路快排作为新算法页，直接走全模板。

## 三个地基决策

1. **固定输入（专为展示三路优势：大量重复）**：`[5,3,8,3,5,8,3,5]`（8 个，仅 3 个不同值：3×3、5×3、8×2）→ 排序后 `[3,3,3,5,5,5,8,8]`。**首次划分一趟**（pivot=a[0]=5）就把 8 个数分成 `[3,3,3] | [5,5,5] | [8,8]` 三段、中间 5 那段**直接钉死**——直观体现「相等元素一次归位」。
2. **复用快排范式、不新建轨**：复用 AlgorithmPlayer + BarsView（主轨）+ **StackView**（显式区间栈，同 C-012 快排）+ **三指针 lt/gt/i**（荷兰国旗三段边界）。执行点 `ThreeWayExecPoint`（pop/pivotSelect/compare/less/greater/equal/push/done）加到 `player/types.ts`（additive 类型，不改任何既有轨/算法）。
3. **全模板页**：`ThreeWayQuickSort.vue` = `<Article>` 介绍正文（什么是三路快排 / 荷兰国旗三段划分 / 对照普通快排重复元素退化 / 复杂度）+ `<AlgorithmPlayer :module="threeWayQuickSortModule"/>`。

## 要做什么

1. **三路快排算法模块**（`src/algorithms/three-way-quick.module.ts` + `three-way-quick.ts` oracle + `three-way-quick.sources.ts` 4 语言）：显式区间栈 + 荷兰国旗划分，产出步骤序列（pop / pivotSelect / compare / less / greater / equal / push / done），每步带 stack 区间栈快照 + lt/gt/i 三指针。
2. **三路快排页**（`src/views/Article/SortAlgorithm/ThreeWayQuickSort.vue`）：Article 介绍正文 + AlgorithmPlayer（全模板）。
3. **新图标**（`src/assets/three-way-quick.svg`）：三段柱剪影（区别于快排的闪电），1024 viewBox 黑剪影。
4. **新页 4 处接线**：路由 `/docs/three-way-quick-sort` name `three-way-quick-sort`；菜单 + 首页排序分类 children 各追加「三路快排」（**置「快速排序」之后**，变体相邻便于对照）；图标 three-way-quick.svg。
5. **测试与文档**：补 L3（module）/L4（视图）/L5（e2e）；**改 TC-HOOK-02-4**（排序 10→11）；回写 `index.md`、`sorting-backlog.md`（S3 出池）、三 `test-cases`、`roadmap`（M7 阶段二首项）。

## 不做什么（边界）

- **不做可调 pivot 策略 / 随机 pivot / Hoare 双指针 / 递归版（用显式栈）/ 大数据**：固定 8 个整数、pivot=a[lo]、显式区间栈主线。
- **不改算法播放器框架的既有轨 / 既有 10 排序 / 数据结构 / 图算法**：仅新增 ThreeWayExecPoint 类型（additive）+ three-way-quick 模块 + 视图 + 图标 + 4 处接线 + 改排序 TC-HOOK 计数。复用既有 StackView/BarsView，零改动。
- **不返工普通快排（C-012）**：仅在正文里对照，不改其代码/测试。

## 业务规则 / 约束

- **互动模型**：复用算法播放器（单步/播放 + 代码行高亮 + 变量面板 + StackView 区间栈）；算法模块纯函数产出确定步骤（L3 可断言）；正文为静态讲解。
- **数据**：固定 `[5,3,8,3,5,8,3,5]`；pivot=a[lo]；荷兰国旗 lt/i/gt 划分；最终 `[3,3,3,5,5,5,8,8]`。
- **可视化**：主轨 BarsView（三指针 lt 绿/i 蓝/gt 红 + groupMembers 当前区间高亮 + sortedIndices 已钉死段）+ StackView 区间栈轨；容器定宽。
- **新页接线**：路由 name = slug `three-way-quick-sort`；菜单/首页「三路快排」置「快速排序」之后；新图标 three-way-quick.svg。
- **向后兼容硬约束**：仅新增 + ThreeWayExecPoint 类型（additive）+ 4 处接线 + 改排序 TC-HOOK 计数（10→11）；既有 10 排序 + 15 结构 + 图算法 + 播放器（各轨）全部现有 Case 零改动通过（除排序计数）。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 菜单/首页「经典排序算法」下出现**第 11 项「三路快排」**（置「快速排序」后），可进入、不 404。
- [ ] 新增「三路快排」页（`/docs/three-way-quick-sort`）：**介绍正文 + 交互可视化（三指针 + 区间栈）+ 多语言代码播放器**三件齐全（全模板）。
- [ ] **互动**：单步看到——首次划分 pivot=5，扫描中 `<5` 入左段、`>5` 换右段、`==5` 留中段；一趟后 `[3,3,3 | 5,5,5 | 8,8]`、中段 5 钉死；递归处理左右段；末态有序 `[3,3,3,5,5,5,8,8]`。
- [ ] **正文质量**：讲清「荷兰国旗三段划分」「相等元素一次归位」「对照普通快排重复元素退化」「平均 O(n log n)、重复多时趋近 O(n)」。
- [ ] **零回归**：既有 10 排序 + 15 结构 + 图算法 + 播放器各轨全绿；仅排序 TC-HOOK-02-4 计数 10→11。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap（M7 阶段二首项）+ sorting-backlog（S3 出池）回写。

## 开放问题

- 三指针配色：lt 绿（小于区右界=写位）/ i 蓝（扫描）/ gt 红（大于区左界），复用 store colors[3/1/0]；pivot 为值非下标，靠 vars + caption 展示（不占 pivotIndex）。
- 扫描步粒度：每个 i 发 compare（决策）+ 一个分支步（less/greater/equal），同快排「compare + swap/noSwap」节奏；全相等子区间会多几步 compare→equal，但正好演示相等段。

## 变更历史

- 2026-06-30：创建。M7 排序 S3（阶段二·主流排序工程变体首项）。沿用 C-040 立的 M8 全模板。固定 8 数大量重复 `[5,3,8,3,5,8,3,5]`，荷兰国旗 lt/i/gt 三段划分，pivot=a[lo]，显式区间栈。复用快排 StackView 轨 + BarsView，新增 ThreeWayExecPoint（additive）。新页 4 处接线 + 新图标 + 改排序 TC-HOOK 计数 10→11。编号顺延 041。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
