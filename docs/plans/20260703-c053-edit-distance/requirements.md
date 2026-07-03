# 需求：编辑距离（开「动态规划」新顶层大类，首发算法，复用 MatrixView 矩阵轨）

> Status: verified
> Stable ID: C-20260703-053
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；「动态规划」大类开张，MatrixView 经 DP 二次验证；后续可加 LCS/背包复用）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 算法分类扩充**（阶段一「动态规划」大类首发）；**C-052 Floyd（建 MatrixView 矩阵轨——本页首个 DP 消费者，复用并小扩展）**；C-006 播放器框架
> Related tests: 计划新增 `TC-EDIT-MOD-*`（editdist.module）/ `TC-VIEW-EDIT-01/02/03`（页）/ `TC-E2E-EDIT-01`（e2e）/ `TC-VIZ-MATRIXVIEW-05/06`（MatrixView 非方阵标签 + 空串显示）；**修改** `TC-HOOK-01-1`/`TC-HOOK-02-1`（顶层分类 3→4、新增「动态规划」大类）

> ⚠️ 编号：全局计数到 052；本变更为 **C-20260703-053**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 算法分类扩充**：已建「图算法」大类（6 页四范式）。本变更开**第 4 个顶层大类「动态规划」**，首发**编辑距离（Levenshtein）**——最经典的**二维矩阵 DP**：把「源串前 i 个字符」变成「目标串前 j 个字符」的最少编辑次数（插入/删除/替换）。
- **复用 C-052 建的 MatrixView 矩阵轨**：DP 就是「填表」，MatrixView 正是矩阵表格——本页是 MatrixView 的**首个 DP 消费者**，验证「Floyd 建的矩阵原语能通用于 DP」。DP 表比 Floyd 距离矩阵多两点需求：**行列标签不同**（源串 vs 目标串）+ **未填单元显示空白**（非 ∞）——故 MatrixView 需小扩展（additive）。

## 三个地基决策

1. **开「动态规划」新顶层大类**：`Docs/Menu/hooks.ts` + `Home/Main/hooks.ts` 各加第 4 个顶层分类「动态规划」（首项编辑距离）。顶层分类数 3→4，改 TC-HOOK-01-1/02-1（新增分类断言）。页归 `views/Article/Algorithm/`（同图算法）。
2. **MatrixView 小扩展（additive，向后兼容）**：`MatrixTrack` +`rowLabels?`/`colLabels?`（非方阵行列标签，缺省回落 `labels`）+`emptyText?`（null 单元显示文案，缺省 '∞'）。MatrixView 按 `cells` 维度渲染（行=cells.length、列=cells[0].length），行列头用 rowLabels/colLabels。**Floyd 不设这些字段 → 行为不变，零回归**。补 TC-VIZ-MATRIXVIEW-05/06。
3. **固定两串 + 二维 DP 重走**：源 "SAT" → 目标 "SUN"（4×4 表，编辑距离=2）。init 填边界（第 0 行=[0..n]、第 0 列=[0..m]，内部空白）→ 逐格填（字符相同取左上 cellMatch / 不同取 1+三邻居最小 cellDiff，sources 高亮依赖格）→ done。11 步。

## 要做什么

1. **框架扩展**（`player/types.ts` + `MatrixView.vue`，additive）：MatrixTrack +rowLabels?/colLabels?/emptyText?；+`EditDistExecPoint`。MatrixView 支持非方阵标签 + emptyText。补 TC-VIZ-MATRIXVIEW-05/06。
2. **算法模块**（`src/algorithms/editdist.module.ts` + `editdist.ts`〈两串 + oracle〉 + `editdist.sources.ts` 4 语言）：二维 DP 重走。11 步。
3. **新页面**（`src/views/Article/Algorithm/Edit.vue`）：Article 正文（什么是编辑距离 / DP 表怎么填 / 递推式〈相同取左上、不同 1+min 三邻〉/ 应用〈拼写纠错、diff、DNA 比对〉）+ AlgorithmPlayer。
4. **新大类接线**：路由 `/docs/edit-distance`（name='edit-distance'）；菜单 + 首页各加「动态规划」大类 + 编辑距离项（新 editdist.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1/02-1 顶层分类 3→4、新增「动态规划」分类含 edit-distance。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case）、roadmap（DP 大类首发）。

## 不做什么（边界）

- **不改 Floyd / 图算法 / 15 排序 / 15 结构**（MatrixView 扩展纯 additive）。
- **不做路径回溯（具体编辑操作序列）的完整可视化**（正文点到为止）；不做可调串。
- 固定两串、经典二维 DP，主线呈现。

## 业务规则 / 约束

- **数据**：源 "SAT"、目标 "SUN"，DP 表 4×4，编辑距离=2（A→U、T→N 两次替换）。
- **可视化**：MatrixView（行=∅/S/A/T、列=∅/S/U/N，单元=编辑距离，未填空白，当前格 active 琥珀环，依赖格 sources 黄，填入绿）+ vars（i/j、字符比较、递推式）。
- **向后兼容硬约束**：MatrixTrack 新字段全可选、EditDistExecPoint 追加 → Floyd + 既有 8 轨 + 6 图算法 + 15 排序 + 15 结构零改动通过。仅 TC-HOOK-01-1/02-1 因新增顶层分类而改。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] 编辑距离页 `/docs/edit-distance`：**正文 + 交互可视化（MatrixView DP 表）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——init 填边界行列、逐格填（字符相同取左上、不同 1+三邻居最小，依赖格黄高亮、填入绿）、末步右下角=编辑距离 2。真机步 6 (A,U)=1 三依赖格黄 + 当前格绿；末步 DP 表 [0,1,2,3/1,0,1,2/2,1,1,2/3,2,2,2]、右下角 2。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 177 Shiki token。
- [x] **零回归**：Floyd + 既有 8 轨 + 6 图算法 + 15 排序 + 15 结构全绿；MatrixView 扩展纯 additive（Floyd 行为不变，TC-VIZ-MATRIXVIEW-01..04 + TC-FLOYD-\* 零改动）。单测 1038 绿、e2e 45 绿。
- [x] **新增「动态规划」顶层大类**（菜单 + 首页），TC-HOOK-01-1/02-1 更新（分类 3→4）；新 editdist.svg；三索引 + roadmap 回写。
- [x] MatrixView 复用验证：矩阵原语通用于 DP（行列异标签 ∅SAT/∅SUN + 空白未填格 emptyText=''，真机确认）。

## 开放问题

- 无天然柱数组 → array:[]（BarsView 隐藏）。
- MatrixView null 语义分歧：Floyd=∞（不可达），DP=未填（空白）→ 加 emptyText 可选字段区分。
- 步粒度：init（边界）+ 每内部格一步 + done ≈ 11 步（3×3 内部格）。
- 大类命名「动态规划」；首发编辑距离（后续可加背包/LCS，均复用 MatrixView）。

## 变更历史

- 2026-07-03：创建。开「动态规划」第 4 顶层大类，首发编辑距离。**复用 C-052 MatrixView 矩阵轨**（首个 DP 消费者），小扩展 rowLabels/colLabels/emptyText（additive 向后兼容）。固定两串二维 DP 重走 + 4 语言 sources。新页 + 新大类接线 + TC-HOOK（分类 3→4）。编号 053。按 skip-visual-confirmation 直接进文档+TDD。
