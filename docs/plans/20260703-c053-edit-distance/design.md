# 设计：编辑距离（DP 大类首发，复用 MatrixView 矩阵轨）

> Status: verified
> Stable ID: C-20260703-053
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Edit.vue（新页，归「动态规划」新大类）
   │  <Article> 正文（编辑距离 / DP 表填法 / 递推式 / 应用）
   │  <AlgorithmPlayer :module="editDistModule" />
   ▼
框架扩展（additive）：
   player/types.ts   MatrixTrack +rowLabels?/colLabels?/emptyText?；+EditDistExecPoint
   MatrixView.vue    按 cells 维度渲染 + 行列异标签 + emptyText（Floyd 不设 → 不变）
   ▼
算法模块 src/algorithms/
   editdist.module.ts   buildEditDistSteps + editDistModule
   editdist.ts          两串（SOURCE/TARGET）+ oracle editDistTrace()→DP 表
   editdist.sources.ts  4 语言 + lineMap

新大类接线：router（/docs/edit-distance）+ 菜单 +「动态规划」分类 + 首页 +「动态规划」分类（新 editdist.svg）
TC-HOOK：TC-HOOK-01-1/02-1 顶层分类 3→4、新增「动态规划」含 edit-distance
不改：Floyd / 8 轨 / 6 图算法 / 15 排序 / 15 结构
```

## 2. 类型扩展（additive）

```ts
// MatrixTrack 追加（Floyd 不设 → 回落原行为）
rowLabels?: string[]; // 行标签（缺省用 labels）——DP 表源串
colLabels?: string[]; // 列标签（缺省用 labels）——DP 表目标串
emptyText?: string;   // null 单元显示（缺省 '∞'）——DP 未填格设 '' 空白
// 新执行点
export type EditDistExecPoint =
  | 'init'       // 填边界：第 0 行 [0..n]、第 0 列 [0..m]
  | 'cellMatch'  // 字符相同：dp[i][j]=dp[i-1][j-1]（取左上）
  | 'cellDiff'   // 字符不同：dp[i][j]=1+min(左上,上,左)
  | 'done';      // 右下角 = 编辑距离
```

## 3. MatrixView 扩展（additive，向后兼容）

- 维度由 `cells` 推导：rows=cells.length、cols=cells[0].length（原假设方阵 labels.length，Floyd 仍成立）。
- 行头 = `rowLabels ?? labels`；列头 = `colLabels ?? labels`。
- null 单元显示 = `emptyText ?? '∞'`。
- pivot 高亮对 DP 无意义（不设 pivot）；active/sources/updatedCell 复用（DP：active=当前格、sources=依赖格〈左上/上/左〉、updatedCell=刚填格）。
- **Floyd 零改动**：不设 rowLabels/colLabels/emptyText → labels 双用 + '∞'，行为不变。TC-VIZ-GRAPHVIEW... 呃 TC-VIZ-MATRIXVIEW-01..04 仍绿；补 -05（异标签）/-06（emptyText 空白）。

## 4. 数据与 DP 表（`editdist.ts`）

```
源 SOURCE = "SAT"（行），目标 TARGET = "SUN"（列）。DP 表 (m+1)×(n+1) = 4×4。
dp[i][j] = SAT[:i] → SUN[:j] 的最少编辑次数。
边界：dp[0][j]=j（插 j 次）、dp[i][0]=i（删 i 次）。
递推：SAT[i-1]==SUN[j-1] → dp[i][j]=dp[i-1][j-1]；否则 dp[i][j]=1+min(dp[i-1][j-1],dp[i-1][j],dp[i][j-1])。
```

**终态 DP 表**（行 ∅SAT × 列 ∅SUN）：

| .   | ∅   | S   | U   | N   |
| --- | --- | --- | --- | --- |
| ∅   | 0   | 1   | 2   | 3   |
| S   | 1   | 0   | 1   | 2   |
| A   | 2   | 1   | 1   | 2   |
| T   | 3   | 2   | 2   | 2   |

编辑距离 = dp[3][3] = **2**（S 保留、A→U 替换、T→N 替换）。仅 (1,1) 是 match（S==S），其余 8 内部格 diff。

## 5. 算法模块 `editdist.module.ts`

- init：dp[0][*]=[0,1,2,3]、dp[\*][0]=[0,1,2,3]，内部格 null（空白）；rowLabels=['∅','S','A','T']、colLabels=['∅','S','U','N']、emptyText=''。
- for i=1..m、for j=1..n：active=(i,j)；若 SOURCE[i-1]==TARGET[j-1] → dp[i][j]=dp[i-1][j-1]，emit `cellMatch`（sources=[(i-1,j-1)]）；否则 dp[i][j]=1+min(三邻)，emit `cellDiff`（sources=[(i-1,j-1),(i-1,j),(i,j-1)]）。updatedCell=(i,j)。
- done：caption 含编辑距离 2。
- 每步：`array:[]`、`vars`（i/j、SOURCE[i-1] vs TARGET[j-1]、递推式、当前值）、`matrix`、`point`、`caption`。
- 步数：init 1 + 9 内部格 + done 1 = **11 步**。#cellMatch=1、#cellDiff=8。

## 6. oracle + sources

```ts
// editdist.ts
export const SOURCE='SAT', TARGET='SUN';
export function editDistTrace(): number[][] { ... 二维 DP ... }  // 终态表，右下角=2
```

sources 4 语言：标准编辑距离 DP（(m+1)×(n+1) 表 + 双层循环）。TS lineMap `{ init, cellMatch, cellDiff, done }`；python/go/rust 逐行核对。

## 7. 接线与改动面

| 文件                                           | 类型     | 改动                                                              |
| ---------------------------------------------- | -------- | ----------------------------------------------------------------- |
| `src/components/player/types.ts`               | 改       | MatrixTrack +rowLabels?/colLabels?/emptyText?；+EditDistExecPoint |
| `src/components/MatrixView.vue`                | 改       | 按 cells 维度渲染 + 行列异标签 + emptyText                        |
| `src/components/MatrixView.spec.ts`            | 改       | +TC-VIZ-MATRIXVIEW-05/06                                          |
| `src/algorithms/editdist.{module,,sources}.ts` | **新增** | module + 两串/oracle + 4 语言                                     |
| `src/algorithms/editdist.module.spec.ts`       | **新增** | TC-EDIT-MOD-\*                                                    |
| `src/views/Article/Algorithm/Edit.vue` + spec  | **新增** | 新页 + TC-VIEW-EDIT-\*                                            |
| `e2e/edit-distance.e2e.ts`                     | **新增** | TC-E2E-EDIT-01                                                    |
| `src/assets/editdist.svg`                      | **新增** | 首页图标                                                          |
| `src/router/index.ts`                          | 改       | +路由 /docs/edit-distance                                         |
| `src/views/Docs/Menu/hooks.ts` + spec          | 改       | +「动态规划」分类；TC-HOOK-02-1 分类 3→4                          |
| `src/views/Home/Main/hooks.ts` + spec          | 改       | +「动态规划」分类（+EditIcon）；TC-HOOK-01-1 分类 3→4             |

**零改动**：Floyd（floyd.module 不设新 MatrixTrack 字段）+ 既有 8 轨其余 + 6 图算法 + 15 排序 + 15 结构。

## 8. 向后兼容论证

- MatrixTrack 新字段全可选、EditDistExecPoint 追加；MatrixView 按 cells 维度渲染对方阵（Floyd）等价。
- Floyd 不设 rowLabels/colLabels/emptyText → 行列头用 labels、null 显示 '∞'——**TC-FLOYD-\* / TC-VIZ-MATRIXVIEW-01..04 零改动全绿**。
- 新增顶层分类 → 仅 TC-HOOK-01-1/02-1（分类 3→4 + 动态规划断言）；TC-HOOK 其余（数据结构 15、排序 15、图算法 6）不变。

## 9. 测试策略（详见 test-cases.md）

- **L4 MatrixView 扩展**：TC-VIZ-MATRIXVIEW-05（rowLabels/colLabels 异标签渲染）、-06（emptyText '' → null 单元空白）。
- **L3 editdist.module**：末步 cells = oracle editDistTrace()（右下角 2）；每步带 matrix + array:[]；#cellMatch=1、#cellDiff=8；init 边界行列 + 内部 null；(1,1) match sources 单个左上；cellDiff sources 长度 3；rowLabels/colLabels 正确；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-EDIT-01 Article+Player；-02 h1「编辑距离」+MatrixView+16 单元+无 .bars-view；-03 全模板同屏。
- **L4 TC-HOOK**：01-1/02-1 顶层 4 分类、「动态规划」含 edit-distance。
- **L5 e2e**：TC-E2E-EDIT-01 /docs/edit-distance → .matrix-view + 单元；拖末步右下角=2 + caption；Shiki。
- **复用/回归**：Floyd + 8 轨 + 6 图算法 Case 零改动全绿。
