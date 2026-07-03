# 实现记录：编辑距离（C-20260703-053，DP 大类首发）

> Status: verified
> Stable ID: C-20260703-053
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 MatrixView 扩展 + types**：MatrixTrack +rowLabels?/colLabels?/emptyText?；+EditDistExecPoint；MatrixView 按 cells 维度渲染 + 异标签 + emptyText。先补 TC-VIZ-MATRIXVIEW-05/06 跑红 → 改 MatrixView 跑绿（并确认 TC-VIZ-MATRIXVIEW-01..04 + Floyd 零回归）。
2. **T1 module + oracle + sources**（L3）：先 editdist.module.spec（TC-EDIT-MOD-01..12）跑红 → editdist.{ts,sources.ts,module.ts}（二维 DP 重走）跑绿。
3. **T2 新页 + 新大类接线**：Edit.vue（Article + AlgorithmPlayer）；路由 /docs/edit-distance；菜单 + 首页 +「动态规划」大类 + 编辑距离项（新 editdist.svg）；改 TC-HOOK-01-1/02-1（分类 3→4）；Edit.spec + edit-distance.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap DP 大类首发）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 MatrixView 扩展（additive，向后兼容）**：MatrixTrack +`rowLabels?`/`colLabels?`（非方阵行列异标签，缺省回落 labels）+`emptyText?`（null 单元显示，缺省 '∞'）+ `EditDistExecPoint`。MatrixView.vue 改为**按 cells 维度渲染**（rows=cells.length、cols=cells[0].length，原方阵 labels.length 等价）+ 行头 rowLabels??labels、列头 colLabels??labels、null 显示 emptyText??'∞'。**Floyd 零改动**：不设新字段 → labels 双用 + '∞'，TC-VIZ-MATRIXVIEW-01..04 + TC-FLOYD-\* 全绿。补 TC-VIZ-MATRIXVIEW-05（异标签）/06（emptyText 空白）。
- **T1 module + oracle + sources**：`editdist.ts`（SOURCE='SAT'、TARGET='SUN' + 二维 DP oracle `editDistTrace`）+ `editdist.sources.ts`（4 语言二维 DP）+ `editdist.module.ts`（逐格重走：init 填边界〈第 0 行/列〉、内部格 null；每格 cellMatch〈字符同取左上，sources 单个左上〉/cellDiff〈不同 1+min 三邻，sources=左上/上/左〉；updatedCell 绿）。DP 表 4×4，编辑距离=2，1 match + 8 diff，11 步。rowLabels=['∅','S','A','T']、colLabels=['∅','S','U','N']、emptyText=''。
- **T2 新页 + 开新大类**：Edit.vue（Article 正文：编辑距离/DP 表填法/递推式〈相同取左上、不同 1+min 三邻对应 替/删/插〉/应用〈拼写纠错·diff·DNA〉 + AlgorithmPlayer）；路由 `/docs/edit-distance`；**菜单 + 首页各加第 4 顶层大类「动态规划」**（首项编辑距离，新 `editdist.svg`：DP 表格 + 起点/答案实心 + 波前浅染）；改 TC-HOOK-01-1/02-1（分类 3→4 + 动态规划断言）。

### 坑点

- 无坑。MatrixView 扩展后既有方阵用法（Floyd）等价、TC-VIZ-MATRIXVIEW-01..04 零改动全绿；editdist.module 12 首跑即绿。
- **MatrixView 通用矩阵原语二验成立**：Floyd（方阵 + labels 双用 + null='∞'）+ 编辑距离（(m+1)×(n+1) + 行列异标签 + null=''空白）。null 语义分歧由 emptyText 优雅化解。后续 LCS/背包（都是矩阵 DP 填表）可直接复用。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：145 文件 **1038 passed**（+17：MatrixView 扩展 2 + editdist.module 12 + Edit 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 93.98% / Branch 92.69% / Func 94.27% / Line 94.79%**。Floyd + 既有 8 轨零回归。
- **e2e**：Playwright **45 passed**（+1 TC-E2E-EDIT-01）。
- **真机自检**（Playwright 脚本，`/docs/edit-distance`）：
  - 首步——16 单元、counter `1/11`、**行列异标签（列 ∅SUN / 行 ∅SAT）**、**9 空白未填格（emptyText='' 非 ∞）**、无 `.bars-view`、Shiki **177 token**。
  - 步 6（A vs U）——**当前格 (A,U) 琥珀环变绿 = 1 + 三依赖邻居黄（左上 0/上 1/左 1）**、字幕「A≠U：1+min(0,1,1)=1」。
  - 末步——counter `11/11`、DP 表 **[0,1,2,3/1,0,1,2/2,1,1,2/3,2,2,2]（= oracle）**、**右下角 = 编辑距离 2**。
- **零回归**：Floyd + 既有 8 轨（含 MatrixView 方阵用法）+ 6 图算法 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 MatrixView 扩展（+rowLabels/colLabels/emptyText，按 cells 维度渲染，Floyd 零改动）+ EditDistExecPoint + T1 editdist.module（二维 DP 逐格 11 步）+ T2 新页 Edit.vue + **开「动态规划」第 4 顶层大类** + 路由/菜单/首页接线 + TC-HOOK（分类 3→4）。**复用并二验 MatrixView 矩阵原语**（方阵 Floyd + 异标签 DP）。门禁全绿（单测 1038 / e2e 45 / 覆盖率 93.98%）；真机 DP 表 = oracle、右下角=2 无误。**M6 动态规划大类首发达成。**
