# 需求：自顶向下归并 Top-Down Merge Sort（新页·全模板，M7 排序 S5·更名）

> Status: verified
> Stable ID: C-20260702-043
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Progress: 100%
> Blocked by: none
> Next action: 已完成（18 Case + 改 1 HOOK，已落 main、双轨部署）
> Replaces: none
> Replaced by: none
> Related plans: 排序候选池 `docs/plans/sorting-backlog.md` S5（**2026-07-02 事实修正更名**）；roadmap M7（阶段二第 3 项）+ M8（全模板）；C-011（归并排序——实为自底向上迭代版，本页与之对照「同一算法两种写法」；merge 粒度完全镜像）；C-012（StackView 区间栈，本页复用作递归调用栈）
> Related tests: 计划新增 `TC-PLAYER-STACK-04`（aux+stack 双轨并存）/ `TC-TDMERGE-MOD-*`（top-down-merge.module）/ `TC-VIEW-TDMERGE-*` / `TC-E2E-TDMERGE-01`；**修改** TC-HOOK-02-4（排序 12→13）

> ⚠️ 编号：全局计数到 042；日期 2026-07-02，本变更为 **C-20260702-043**。
> ⚠️ S5 事实修正：backlog 创建时把归并「已有/缺失」写反——C-011 实为**自底向上迭代版**（merge-sort.module.ts 注释与实现均为 width 1→2→4→8 倍增）。忠于原意「同一算法两种写法对照」，S5 由「自底向上归并」更名「**自顶向下归并（递归版）**」，backlog 已留痕。

## 背景

- **M7 排序细分 S5**：阶段二第 3 项。归并排序的两种经典写法——**递归分治（自顶向下）**与**迭代倍增（自底向上）**。站内已有后者（C-011），本页补前者，两页互链对照：**同一个 merge、两种驱动方式**。
- **定位**：自顶向下归并是「分治」思想最标准的教学载体——`sort(lo,hi)` 对半下钻到单元素，回程逐层合并。递归树天然可视：**用 StackView 展示递归调用栈**（压栈=下钻、弹栈=区间完成），配 AuxView temp 轨看每次合并。
- **M8 全模板**：Article 正文 + AlgorithmPlayer。

## 三个地基决策

1. **固定输入** `[6,3,8,1,9,2,7,4]`（8 数、完美二叉递归树、无重复）→ `[1,2,3,4,6,7,8,9]`，共 **63 步**（split 7 + 七个 merge 块 55 + done 1）。递归序：split[0,7]→[0,3]→[0,1]→merge[0,1]→split[2,3]→merge[2,3]→merge[0,3]→split[4,7]→[4,5]→merge[4,5]→split[6,7]→merge[6,7]→merge[4,7]→merge[0,7]→done。
2. **零新轨、首个 aux+stack 双辅助轨并存模块**：AuxView（temp，合并粒度完全镜像 C-011：mergeStart→compare→takeLeft/takeRight→drainLeft/drainRight→writeBack，i 红 id'0'/j 蓝 id'1'）+ StackView（**递归调用栈**：帧 {lo,hi} 闭区间，栈顶=当前活动区间，复用 .top 高亮）。AlgorithmPlayer 各轨独立 v-if 天然支持并存——补 Case **TC-PLAYER-STACK-04**（同时带 aux+stack 都渲染、互不干扰）。
3. **全模板页**：`TopDownMergeSort.vue` = Article 正文（递归分治怎么走 / 与自底向上对照 / 复杂度）+ `<AlgorithmPlayer :module="topDownMergeSortModule"/>`。

## 要做什么

1. **类型**（`player/types.ts`，additive）：+`TopDownMergeExecPoint`（split / mergeStart / compare / takeLeft / takeRight / drainLeft / drainRight / writeBack / done——merge 七件套与 MergeExecPoint 同名，split 替代 widthChange）。
2. **播放器双轨并存 Case**（`AlgorithmPlayer.spec.ts` 追加 TC-PLAYER-STACK-04）：当前步同时带 aux+stack → AuxView 与 StackView 都渲染。
3. **算法模块**（`src/algorithms/top-down-merge.module.ts` + `top-down-merge.ts` oracle + `top-down-merge.sources.ts` 4 语言）：真递归生成步骤，callStack 手动维护做栈快照。
4. **页**（`src/views/Article/SortAlgorithm/TopDownMergeSort.vue`）：全模板。
5. **新图标**（`src/assets/top-down-merge.svg`）：上下宽条夹两短条（分→合）。
6. **4 处接线**：路由 `/docs/top-down-merge-sort`；菜单 + 首页排序 children 追加「自顶向下归并」（**置「归并排序」之后**，归并族相邻）；图标。
7. **测试与文档**：L3/L4/L5；改 TC-HOOK-02-4（排序 12→13）；回写三索引、sorting-backlog（S5 出池）、roadmap。

## 不做什么（边界）

- **不做原地归并 / 链表归并 / 多路归并 / TimSort 式 run 优化**：标准两路递归归并主线（TimSort 归 S8）。
- **不改 C-011 归并排序页/模块**：仅正文互链对照；MergeExecPoint/AuxView/StackView 零改动。
- **不新增轨**：AuxView + StackView 纯复用。

## 业务规则 / 约束

- **数据**：固定 `[6,3,8,1,9,2,7,4]`；闭区间递归 `sort(lo,hi)`、`mid=(lo+hi)>>1`；temp 合并；最终 `[1,2,3,4,6,7,8,9]`。
- **可视化**：主轨 BarsView（groupMembers 当前区间 + comparing + writeBack FLIP 重排）+ AuxView temp + StackView 递归栈；容器定宽。
- **向后兼容硬约束**：仅追加类型 + 新模块/视图/图标/接线 + 改排序 TC-HOOK 计数（12→13）+ 播放器追加 1 个双轨 Case；既有 12 排序 + 15 结构 + 图算法 + 播放器各轨现有 Case 零改动通过（除排序计数）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：`push` Pages + 手动 `./scripts/deploy.sh` 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 菜单/首页「经典排序算法」下出现**第 13 项「自顶向下归并」**（置「归并排序」后），可进入、不 404。
- [ ] 新页 `/docs/top-down-merge-sort`：**正文 + 可视化（递归栈 + temp 双辅助轨）+ 多语言代码播放器**三件齐全。
- [ ] **互动**：单步看到——递归栈逐层压到 [0,7]/[0,3]/[0,1] 三层深、回程逐段合并（temp 轨填充→拷回 FLIP）、栈随完成收缩、末态 `[1,2,3,4,6,7,8,9]`。
- [ ] **正文质量**：讲清「对半下钻 + 回程合并」「递归树/调用栈」「与自底向上（C-011）同一 merge 两种驱动」「O(n log n) / O(n) 额外空间 / 稳定」。
- [ ] **零回归**：既有 12 排序 + 15 结构 + 图算法 + 播放器各轨全绿；仅排序 TC-HOOK-02-4 计数 12→13。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + sorting-backlog 回写。

## 开放问题

- 栈帧显示为闭区间 [lo,hi]（StackView 既有语义 a[lo..hi]）；split 步在压栈后发出（栈显示当前递归路径）；writeBack 后帧弹出（无单独 pop 步，栈快照在下一步自然收缩）。
- 步数 63 为手算值；测试以结构不变量为主（#split=7、#mergeStart=#writeBack=7、#compare=#take、写 temp 总数=24、栈深达 3、done 栈空）。

## 变更历史

- 2026-07-02：创建。M7 排序 S5（**由「自底向上」事实修正更名「自顶向下归并」**——C-011 实为迭代版）。固定 [6,3,8,1,9,2,7,4] 递归分治 63 步。零新轨：AuxView temp（镜像 C-011 merge 粒度）+ StackView 递归调用栈，**首个双辅助轨并存模块**（补 TC-PLAYER-STACK-04）。M8 全模板 + 新图标 + 接线（置归并后）+ 改 TC-HOOK 计数 12→13。编号 043。按 skip-visual-confirmation 直接进文档+TDD。
