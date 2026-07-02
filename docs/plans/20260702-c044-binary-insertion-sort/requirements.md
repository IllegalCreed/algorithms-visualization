# 需求：二分插入排序 Binary Insertion Sort（新页·全模板，M7 排序 S6）

> Status: verified
> Stable ID: C-20260702-044
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Progress: 100%
> Blocked by: none
> Next action: 已完成（17 Case + 改 1 HOOK，已落 main、双轨部署）
> Replaces: none
> Replaced by: none
> Related plans: 排序候选池 `docs/plans/sorting-backlog.md` S6；roadmap M7（阶段二第 4 项）+ M8（全模板）；C-008（插入排序——本页与之对照「边比边移 vs 先定位再搬移」；shift 滑动范式镜像）
> Related tests: 计划新增 `TC-BININS-MOD-*` / `TC-VIEW-BININS-*` / `TC-E2E-BININS-01`；**修改** TC-HOOK-02-4（排序 13→14）

> ⚠️ 编号：全局计数到 043；本变更为 **C-20260702-044**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M7 排序细分 S6**：阶段二第 4 项。插入排序（C-008）每轮「从右往左边比边移」，比较 O(n)；**二分插入**在已排序前缀 `[0,i)` 上**折半查找**插入点——比较降到 O(log n)（移动仍 O(n)，总复杂度不变但比较次数显著减少，是「二分思想嫁接经典排序」的直观范例）。
- **可视化重点**：**折半区间收缩**——lo/mid/hi 三箭头夹逼，probe 一次、区间砍半，直到 lo==hi 定位；然后 key 滑动落位（同 C-008 的 FLIP 滑动）。
- **M8 全模板**：Article 正文 + AlgorithmPlayer。

## 三个地基决策

1. **固定输入** `[5,2,9,4,7,1,8,3]`（8 数）→ `[1,2,3,4,5,7,8,9]`，共 **67 步**。折半路径全覆盖：goLeft 9 次 / goRight 6 次、**零移动轮**（i=2 key=9 定位即原位、无 shift）、**全移动轮**（i=5 key=1 定位 0、shift×5）。
2. **零新轨纯 BarsView**：lo 绿(id'3')/mid 蓝(id'1')/hi 红(id'0') 三箭头演示区间夹逼收缩；keyIndex 玫红（同 C-008）+ sortedUpTo 绿前缀 + probe 步 comparing 黄。shift 沿 C-008 相邻交换滑动（key 元组 FLIP）。执行点 `BinaryInsertionExecPoint = outerLoop | probe | goLeft | goRight | found | shift | insert | done`（additive；`key ≥ a[mid]` 走右半，**保稳定**）。
3. **全模板页**：`BinaryInsertionSort.vue` = Article 正文（折半定位怎么走 / 对照普通插入 / 复杂度：比较少了搬移没少）+ `<AlgorithmPlayer :module="binaryInsertionSortModule"/>`。

## 要做什么

1. **类型**（`player/types.ts`，additive）：+`BinaryInsertionExecPoint`。
2. **算法模块**（`src/algorithms/binary-insertion.module.ts` + `binary-insertion.ts` oracle + `binary-insertion.sources.ts` 4 语言）。
3. **页**（`src/views/Article/SortAlgorithm/BinaryInsertionSort.vue`）：全模板。
4. **新图标**（`src/assets/binary-insertion.svg`）：两侧柱夹中央下插箭头。
5. **4 处接线**：路由 `/docs/binary-insertion-sort`；菜单 + 首页排序 children 追加「二分插入排序」（**置「插入排序」之后**，插入族相邻）；图标。
6. **测试与文档**：L3/L4/L5；改 TC-HOOK-02-4（排序 13→14）；回写三索引、sorting-backlog（S6 出池）、roadmap。

## 不做什么（边界）

- **不做希尔式分组二分 / 链表版 / 成块 memmove 优化**：标准二分插入主线。
- **不改 C-008 插入排序页/模块**：仅正文对照。
- **不新增轨/不改播放器**：纯 BarsView。

## 业务规则 / 约束

- **数据**：固定 `[5,2,9,4,7,1,8,3]`；折半 `[lo,hi)` 半开、`mid=(lo+hi)>>1`、`key<a[mid]`→hi=mid、否则 lo=mid+1（≥ 保稳定）；shift 相邻交换滑动；最终 `[1,2,3,4,5,7,8,9]`。
- **向后兼容硬约束**：仅追加类型 + 新模块/视图/图标/接线 + 改排序 TC-HOOK 计数（13→14）；既有 13 排序 + 15 结构 + 图算法 + 播放器现有 Case 零改动通过（除排序计数）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 菜单/首页「经典排序算法」下出现**第 14 项「二分插入排序」**（置「插入排序」后），可进入、不 404。
- [ ] 新页 `/docs/binary-insertion-sort`：**正文 + 可视化（三箭头夹逼折半）+ 多语言代码播放器**三件齐全。
- [ ] **互动**：单步看到——取 key、lo/mid/hi 夹逼收缩、found 定位、key 滑动落位；零移动轮与全移动轮对比；末态 `[1,2,3,4,5,7,8,9]`。
- [ ] **正文质量**：讲清「折半定位 + 整段搬移」「比较 O(log n)/移动仍 O(n)」「≥ 走右保稳定」「对照普通插入」。
- [ ] **零回归**：既有 13 排序 + 15 结构 + 图算法 + 播放器全绿；仅 TC-HOOK-02-4 计数 13→14。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + sorting-backlog 回写。

## 开放问题

- 搜索区间视觉：sortedUpTo 绿前缀与 groupMembers dim 冲突（sorted 优先），故区间收缩靠**三箭头移动 + comparing 黄 + caption**表达，不用 groupMembers。
- 源码语义是「赋值搬移 a[k]=a[k-1]」，模块用**元组相邻交换**实现同一重排（C-008 先例：源码语义 vs FLIP 动画）。

## 变更历史

- 2026-07-02：创建。M7 排序 S6。固定 [5,2,9,4,7,1,8,3] 折半定位 67 步。零新轨纯 BarsView（lo/mid/hi 三箭头夹逼）+ BinaryInsertionExecPoint。M8 全模板 + 新图标 + 接线（置插入后）+ 改 TC-HOOK 计数 13→14。编号 044。按 skip-visual-confirmation 直接进文档+TDD。
