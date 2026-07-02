# 需求：双轴快排 Dual-Pivot Quicksort（新页·全模板，M7 排序 S4）

> Status: verified
> Stable ID: C-20260630-042
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-07-02
> Progress: 100%
> Blocked by: none
> Next action: 已完成（19 Case + 改 1 HOOK，含 CodePanel 横滚缺陷修复，已落 main、双轨部署）
> Replaces: none
> Replaced by: none
> Related plans: 排序候选池 `docs/plans/sorting-backlog.md` S4；roadmap M7（阶段二第 2 项）+ M8（全模板，沿用 C-040/C-041 标准）；C-012（快速排序——区间栈 + StackView）；C-041（三路快排——lt/i/gt 三指针范式，本变更同构复用）
> Related tests: 计划新增 `TC-VIZ-BARSVIEW-23`（pivotIndices 双基准渲染）/ `TC-DUALPIVOT-MOD-*`（dual-pivot-quick.module）/ `TC-VIEW-DUALPIVOT-*`（双轴快排页）/ `TC-E2E-DUALPIVOT-01`；**修改** 排序分类计数 TC-HOOK-02-4（排序 11→12）

> ⚠️ 编号：全局计数到 041（…040 桶排序、041 三路快排）；日期 2026-06-30，本变更顺延为 **C-20260630-042**。
> ⚠️ 会话协调：2026-07-02 另一并行会话曾对本变更写过一份 requirements 草稿（frontmatter 格式、示例与算法不符），Owner 拍板由本会话接管重写——本文件即接管后的正式版，草稿已覆盖。

## 背景

- **M7 排序细分 S4**：阶段二（主流排序工程变体）第 2 项。S3 三路快排 ✓C-041 已展示「单轴三段（== 归中段）」；本项展示另一种三段——**双轴**。
- **定位**：**Yaroslavskiy 双轴快排**是 Java 7 起 `Arrays.sort`（基本类型）实际采用的排序。取**两个基准 p ≤ q**（区间首尾，反了先交换），一趟把中间扫成三段 **< p / [p,q] / > q**，扫完双基准分别归位钉死，三段分治。递归更浅、缓存更友好，实测赢单轴快排。
- **与三路快排对照**（正文重点）：同为「三段 + lt/i/gt 三指针」，语义不同——三路是**一个** pivot、中段全等（治重复）；双轴是**两个**不同 pivot、中段是 [p,q] 区间（治通用数据）。
- **M8 全模板**：沿用 C-040/C-041 标准——Article 介绍正文 + AlgorithmPlayer。

## 三个地基决策

1. **固定输入**：`[3,5,9,1,6,2,4,7]`（8 个）→ `[1,2,3,4,5,6,7,9]`，共 **27 步**。首趟 p=a[0]=3、q=a[7]=7（无需换端）分出 `[2,1] | 3 | [5,6,4] | 7 | [9]`（9 为单素右段直接钉死）；两个子区间 [0,1]、[3,5] 都触发**「首尾反了先交换」**（pivotSelect 步含换端演示）——三分支（less/between/greater）+ 换端全覆盖。
2. **框架改动仅一处 additive**：`StepEmphasis` 追加 `pivotIndices?: number[]`（**双**基准下标都染 pivot 紫——「双轴」的视觉锚点），`BarsView.stateOf` 一行扩展（`pivotIndex === index || pivotIndices?.includes(index)`）+ 新 Case TC-VIZ-BARSVIEW-23。其余全复用：StackView 区间栈（同快排/三路）+ lt 绿/i 蓝/gt 红三指针（同三路）+ groupMembers/sortedIndices。**零新轨**。
3. **全模板页**：`DualPivotQuickSort.vue` = `<Article>` 正文（什么是双轴 / 怎么做 / 对照单轴与三路 / 复杂度与 Java 采用）+ `<AlgorithmPlayer :module="dualPivotQuickSortModule"/>`。

## 要做什么

1. **pivotIndices 扩展**（`player/types.ts` + `BarsView.vue`，additive）：双基准两个下标都渲染 pivot 态；+`DualPivotExecPoint`（pop/pivotSelect/compare/less/between/greater/pivotPlace/push/done，9 执行点——比三路多 **pivotPlace**：双基准归位是独立一步）。
2. **算法模块**（`src/algorithms/dual-pivot-quick.module.ts` + `dual-pivot-quick.ts` oracle + `dual-pivot-quick.sources.ts` 4 语言）：显式区间栈 + 双轴三段划分，每步带 stack + 三指针 + pivotIndices。
3. **双轴快排页**（`src/views/Article/SortAlgorithm/DualPivotQuickSort.vue`）：全模板。
4. **新图标**（`src/assets/dual-pivot-quick.svg`）：双高柱夹短柱剪影（两根「轴」）。
5. **新页 4 处接线**：路由 `/docs/dual-pivot-quick-sort` name `dual-pivot-quick-sort`；菜单 + 首页排序 children 追加「双轴快排」（**置「三路快排」之后**，快排族相邻）；图标。
6. **测试与文档**：L3/L4/L5；**改 TC-HOOK-02-4**（排序 11→12）；回写三索引、sorting-backlog（S4 出池）、roadmap。

## 不做什么（边界）

- **不做 Java 真实实现的全部工程细节**（五点取样选轴、小段转插入、等值检测）：固定 8 数、双基准取首尾主线；工程细节正文带过。
- **不改既有 6 轨 / 播放器 / 既有 11 排序 / 数据结构 / 图算法**：仅 types.ts + BarsView 各一处 additive + 新模块/视图/图标/接线 + 改排序 TC-HOOK 计数。
- **不返工快排（C-012）/三路快排（C-041）**：仅正文对照。

## 业务规则 / 约束

- **互动模型**：复用算法播放器；模块纯函数产出确定步骤；正文静态讲解。
- **数据**：固定 `[3,5,9,1,6,2,4,7]`；p=a[lo]、q=a[hi]（反了先交换）；lt/i/gt 三段扫描；双基准归位；最终 `[1,2,3,4,5,6,7,9]`。
- **可视化**：主轨 BarsView（**pivotIndices 双紫基准** + lt 绿/i 蓝/gt 红三指针 + groupMembers 当前区间 + sortedIndices 已钉死）+ StackView 区间栈；容器定宽。
- **向后兼容硬约束**：pivotIndices 为可选追加字段，既有算法不设 → BarsView 行为不变；既有 11 排序 + 15 结构 + 图算法 + 播放器各轨现有 Case 零改动通过（除排序计数）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 菜单/首页「经典排序算法」下出现**第 12 项「双轴快排」**（置「三路快排」后），可进入、不 404。
- [ ] 新页 `/docs/dual-pivot-quick-sort`：**正文 + 可视化（双紫基准 + 三指针 + 区间栈）+ 多语言代码播放器**三件齐全。
- [ ] **互动**：单步看到——双基准 p=3/q=7 染紫、三指针扫描分三段、双基准归位钉死、子区间「首尾反了先交换」、末态 `[1,2,3,4,5,6,7,9]`。
- [ ] **正文质量**：讲清「双基准三段划分」「与三路快排同构不同义」「Java Arrays.sort 实际采用」「平均 O(n log n)、递归更浅」。
- [ ] **零回归**：既有 11 排序 + 15 结构 + 图算法 + 播放器各轨全绿；仅排序 TC-HOOK-02-4 计数 11→12。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + sorting-backlog 回写。

## 开放问题

- pivotIndices 只在 pivotSelect + 扫描步（compare/less/between/greater）设置（基准在两端）；pivotPlace 后基准进 sortedIndices、不再染紫。
- 步数 27 为手算值；测试以**结构不变量**为主（`#compare=#less+#between+#greater`、`#pop=#pivotSelect=#pivotPlace=#push`、每 pivotSelect p≤q），快照断言仅首趟。

## 变更历史

- 2026-06-30：创建。M7 排序 S4（阶段二第 2 项）。Yaroslavskiy 双轴快排（Java Arrays.sort）。固定 [3,5,9,1,6,2,4,7]，双基准 p≤q + lt/i/gt 三段 + 双基准归位。框架 additive：emphasis.pivotIndices 双紫基准（BarsView 一行）+ DualPivotExecPoint。复用 StackView/三指针，零新轨。全模板 + 新图标 + 接线（置三路快排后）+ 改 TC-HOOK 计数 11→12。编号顺延 042。按 skip-visual-confirmation 直接进文档+TDD。
- 2026-07-02：**会话接管**。另一并行会话同日开写本变更（仅 1 份 frontmatter 格式 requirements 草稿，示例与算法不符、未动代码/索引），Owner 拍板本会话接管，草稿覆盖为本正式版。
