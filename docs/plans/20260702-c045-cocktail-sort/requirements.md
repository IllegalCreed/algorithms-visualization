# 需求：鸡尾酒排序 Cocktail Shaker Sort（新页·全模板，M7 排序 S7·阶段二收官）

> Status: verified
> Stable ID: C-20260702-045
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Progress: 100%
> Blocked by: none
> Next action: 已完成（17 Case + 改 1 HOOK，已落 main、双轨部署）；**阶段二收官**
> Replaces: none
> Replaced by: none
> Related plans: 排序候选池 `docs/plans/sorting-backlog.md` S7（**阶段二收官项**）；roadmap M7 + M8（全模板）；C-003/C-006（冒泡排序——本页与之对照「单向 vs 双向」；compare/swap 粒度镜像）
> Related tests: 计划新增 `TC-COCKTAIL-MOD-*` / `TC-VIEW-COCKTAIL-*` / `TC-E2E-COCKTAIL-01`；**修改** TC-HOOK-02-4（排序 14→15）

> ⚠️ 编号：全局计数到 044；本变更为 **C-20260702-045**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M7 排序细分 S7**：阶段二（主流排序工程变体）**收官项**。冒泡排序的经典双向变体。
- **定位**：单向冒泡每趟只把最大值送到右端，尾部的小元素（**乌龟 turtle**）一趟只能左挪一格——`[..., 1]` 里的 1 要 n-1 趟才能回家。**鸡尾酒排序**来回扫：forward 趟冒最大到右端、backward 趟沉最小到左端，活动区 `[left, right]` **两端向中间收缩**；任一趟零交换即提前收工。乌龟一趟直达。
- **M8 全模板**：Article 正文 + AlgorithmPlayer。

## 三个地基决策

1. **固定输入** `[4,2,6,3,8,5,7,1]`（尾部乌龟 1）→ `[1,2,3,4,5,6,7,8]`，共 **49 步**（4 趟 + done）：fwd1（7 比较 5 交换，8 到位）→ **bwd1 六连 swap 一趟把乌龟 1 送回头**（对照冒泡要 6 趟）→ fwd2（2 交换）→ bwd2 **全 noSwap 提前收工**。
2. **执行点带方向**：`CocktailExecPoint = forwardPass | fCompare | fSwap | fNoSwap | backwardPass | bCompare | bSwap | bNoSwap | done`（9 个）——两个方向的比较/交换分别映射到源码的两个循环，代码高亮随方向切换（比冒泡的方向无关 compare 更精确）。
3. **首个双端就位收缩可视化，零框架改动**：右端 `sortedFrom`（fwd 趟后收缩）+ 左端 `sortedUpTo`（bwd 趟后收缩）两个既有 emphasis 并用（BarsView sortedRight/sortedLeft 原生支持）——左右两端渐绿夹住中间乱序区。纯 BarsView + 相邻双游标（j 红 id'0' / j±1 蓝 id'1'，同冒泡）。

## 要做什么

1. **类型**（`player/types.ts`，additive）：+`CocktailExecPoint`。
2. **算法模块**（`src/algorithms/cocktail.module.ts` + `cocktail.ts` oracle + `cocktail.sources.ts` 4 语言）。
3. **页**（`src/views/Article/SortAlgorithm/CocktailSort.vue`）：全模板（正文讲乌龟问题 / 双向来回 / 提前收工 / 对照冒泡）。
4. **新图标**（`src/assets/cocktail.svg`）：鸡尾酒杯剪影。
5. **4 处接线**：路由 `/docs/cocktail-sort`；菜单 + 首页排序 children 追加「鸡尾酒排序」（**置「冒泡排序」之后**，交换族相邻）；图标。
6. **测试与文档**：L3/L4/L5；改 TC-HOOK-02-4（排序 14→15）；回写三索引、sorting-backlog（S7 出池 + **阶段二收官**）、roadmap。

## 不做什么（边界）

- **不做梳排序 Comb / 奇偶排序 Odd-even 等其它冒泡族变体**（趣味类不在池）。
- **不改冒泡排序页/模块**：仅正文对照。
- **不新增轨/不改播放器/BarsView**：纯复用。

## 业务规则 / 约束

- **数据**：固定 `[4,2,6,3,8,5,7,1]`；forward `j∈[left,right)` 比 a[j]>a[j+1]、backward `j∈(left,right]` 比 a[j-1]>a[j]；趟后 right--/left++；零交换 break；最终 `[1,2,3,4,5,6,7,8]`。
- **向后兼容硬约束**：仅追加类型 + 新模块/视图/图标/接线 + 改排序 TC-HOOK 计数（14→15）；既有 14 排序 + 15 结构 + 图算法 + 播放器现有 Case 零改动通过（除排序计数）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 菜单/首页「经典排序算法」下出现**第 15 项「鸡尾酒排序」**（置「冒泡排序」后），可进入、不 404。
- [ ] 新页 `/docs/cocktail-sort`：**正文 + 可视化（双端渐绿收缩）+ 多语言代码播放器**三件齐全。
- [ ] **互动**：单步看到——forward 冒最大右端渐绿、backward 沉最小左端渐绿、乌龟 1 一趟从尾直达头、末 backward 全不交换提前收工；末态 `[1,2,3,4,5,6,7,8]`。
- [ ] **正文质量**：讲清「乌龟问题」「双向来回 + 两端收缩」「提前收工」「对照冒泡：同为 O(n²)，趟数省一半量级」。
- [ ] **零回归**：既有 14 排序 + 15 结构 + 图算法 + 播放器全绿；仅 TC-HOOK-02-4 计数 14→15。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap（**阶段二收官**）+ sorting-backlog 回写。

## 开放问题

- backward 趟指针沿用相邻双游标（j-1 红 / j 蓝），方向靠趟标记步 + caption 表达（箭头本身无方向属性）。
- 提前收工发生在 backward 趟后（本输入）；forward 趟后收工路径本输入不触发，属源码分支（`if (!swapped) break` 两处都展示，lineMap 覆盖）。

## 变更历史

- 2026-07-02：创建。M7 排序 S7（**阶段二收官项**）。固定 [4,2,6,3,8,5,7,1]（尾部乌龟）双向冒泡 49 步。执行点带方向 9 个；首个双端就位收缩（sortedFrom+sortedUpTo 并用）零框架改动。M8 全模板 + 新图标 + 接线（置冒泡后）+ 改 TC-HOOK 计数 14→15。编号 045。按 skip-visual-confirmation 直接进文档+TDD。
