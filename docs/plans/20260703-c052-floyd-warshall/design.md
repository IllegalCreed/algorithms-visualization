# 设计：Floyd-Warshall 多源最短路（新页 + 新 MatrixView 矩阵轨）

> Status: verified
> Stable ID: C-20260703-052
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Floyd.vue（新页）
   │  <Article> 正文（全源最短路 / Floyd 三重循环 / 矩阵 DP / vs 单源）
   │  <AlgorithmPlayer :module="floydModule" />
   ▼
框架扩展（新增第 8 条轨，additive）：
   player/types.ts   +MatrixTrack、+Step.matrix?、+FloydExecPoint
   AlgorithmPlayer.vue  +<MatrixView v-if="current.matrix" :matrix="current.matrix" />
   components/MatrixView.vue（新）  渲染 n×n 距离矩阵
   ▼
算法模块 src/algorithms/
   floyd.module.ts   buildFloydSteps + floydModule
   floyd.ts          图数据（FLOYD_LABELS/FLOYD_EDGES/FLOYD_N）+ oracle floydTrace()→矩阵
   floyd.sources.ts  4 语言 + lineMap

接线：router（/docs/floyd-warshall）+ 菜单 + 首页（新 floyd.svg）
TC-HOOK：TC-HOOK-01-1/02-1 图算法 5→6、url +floyd-warshall
不改：既有 7 轨（BarsView/Aux/Stack/Tree/Count/Bucket/Graph）/ 5 图算法 / 15 排序 / 15 结构
```

## 2. 类型扩展（additive）

```ts
// types.ts 追加
export interface MatrixTrack {
  labels: string[]; // 行/列标签（节点名 A,B,C,D）
  cells: (number | null)[][]; // n×n 距离矩阵；null = ∞（不可达）
  pivot?: number | null; // 当前中转点 k（高亮第 k 行 + 第 k 列）
  active?: [number, number] | null; // 当前考察/更新的单元 (i,j)（琥珀环）
  sources?: [number, number][]; // 参与求和的源单元 [(i,k),(k,j)]（黄高亮）
  updatedCell?: [number, number] | null; // 本步刚更新的单元（绿闪）
}
export type FloydExecPoint =
  | 'init' // 矩阵 = 邻接（对角 0、边权、其余 ∞）
  | 'pivotStart' // 开始以 k 为中转：高亮第 k 行/列
  | 'relaxUpdate' // (i,j)：dist[i][k]+dist[k][j] < dist[i][j] → 更新
  | 'relaxSkip' // (i,j)：经 k 不更短，跳过
  | 'done'; // 三重循环完成，全源最短距离矩阵定
// Step 追加：matrix?: MatrixTrack;  // 纯加法：其它算法不设 → MatrixView 不渲染
```

## 3. MatrixView 新轨（`components/MatrixView.vue`）

- 渲染一张 `(n+1)×(n+1)` 表格：左上角空、首行/首列 = labels、内部 = cells（数字或 '∞'）。
- **pivot 高亮**：第 k 行 + 第 k 列底色浅染（「中转点」视觉）。
- **active 单元**：(i,j) 琥珀环。
- **sources 单元**：(i,k)、(k,j) 黄底（「相加的两项」）。
- **updatedCell**：绿闪（值刚被降低）。
- 复用新拟物 mixin（`.neumorphism-flat` 等）+ `@font-color`/`@font-highlight-color`；`.matrix-view` / `.matrix-cell` / `.mx-pivot` / `.mx-active` / `.mx-source` / `.mx-updated` 类。

## 4. 图数据（`floyd.ts`，4 点 6 边含环）

```
顶点：A(0) B(1) C(2) D(3)。有向带权边：
  A→B(3), A→C(6), B→C(2), B→D(4), C→D(1), D→A(5)   // 含环 → 全点对可达
```

**初始邻接矩阵**（对角 0，边权，其余 ∞）：

| i\j | A   | B   | C   | D   |
| --- | --- | --- | --- | --- |
| A   | 0   | 3   | 6   | ∞   |
| B   | ∞   | 0   | 2   | 4   |
| C   | ∞   | ∞   | 0   | 1   |
| D   | 5   | ∞   | ∞   | 0   |

**逐 k 松弛后（只列有更新的）**：

- k=A：D→A→B=8（DB）、D→A→C=11（DC）。
- k=B：A→B→C=5（AC，6→5）、A→B→D=7（AD，∞→7）、D→B→C=10（DC，11→10）。
- k=C：A→C→D=6（AD，7→6）、B→C→D=3（BD，4→3）。
- k=D：B→D→A=8（BA，∞→8）、C→D→A=6（CA，∞→6）、C→D→B=9（CB，∞→9）；AB/AC/BC 经 D 不更短→跳过。

**终态全源最短距离矩阵**：

| i\j | A   | B   | C   | D   |
| --- | --- | --- | --- | --- |
| A   | 0   | 3   | 5   | 6   |
| B   | 8   | 0   | 2   | 3   |
| C   | 6   | 9   | 0   | 1   |
| D   | 5   | 8   | 10  | 0   |

（验证：B→A = B→C→D→A = 2+1+5 = 8；A→D = A→B→C→D = 3+2+1 = 6。）

## 5. 算法模块 `floyd.module.ts`

- init：cells = 邻接矩阵；无 pivot/active。
- for k=0..n-1：
  - `pivotStart`：pivot=k（高亮第 k 行/列）；caption「以 k 为中转，看谁经 k 更短」。
  - for i、for j（**候选** i≠k、j≠k、i≠j、且 cells[i][k]!=null、cells[k][j]!=null）：active=(i,j)、sources=[(i,k),(k,j)]；若 `cells[i][k]+cells[k][j] < cells[i][j]（∞视为+∞）` → 更新 cells[i][j]，emit `relaxUpdate`（updatedCell=(i,j)）；否则 emit `relaxSkip`。
- done：矩阵定格；caption「全源最短距离矩阵已定」。
- **每步**：`array:[]`、`vars`（k/i/j、当前比较式、已更新数）、`matrix`、`point`、`caption`。
- 步数：init 1 + 4×pivotStart + 13 候选（10 更新 + 3 跳过）+ done 1 = **19 步**。#pivotStart=4、#relaxUpdate=10、#relaxSkip=3。

## 6. oracle + sources

```ts
// floyd.ts
export const FLOYD_LABELS = ['A','B','C','D']; export const FLOYD_EDGES = [...]; export const FLOYD_N = 4;
export function floydTrace(): (number|null)[][] { ... 三重循环 ... }  // 终态矩阵
```

sources 4 语言：标准 Floyd 三重循环（INF 常量 + `dist[i][j]=min(...)`）。TS lineMap `{ init, pivotStart, relaxUpdate, relaxSkip, done }`；python/go/rust 逐行核对。

## 7. 接线与改动面

| 文件                                            | 类型     | 改动                                           |
| ----------------------------------------------- | -------- | ---------------------------------------------- |
| `src/components/player/types.ts`                | 改       | +MatrixTrack、+Step.matrix?、+FloydExecPoint   |
| `src/components/player/AlgorithmPlayer.vue`     | 改       | +import + `<MatrixView v-if="current.matrix">` |
| `src/components/player/AlgorithmPlayer.spec.ts` | 改       | +TC-PLAYER-MATRIX-\*                           |
| `src/components/MatrixView.vue`                 | **新增** | 矩阵轨渲染                                     |
| `src/components/MatrixView.spec.ts`             | **新增** | TC-VIZ-MATRIXVIEW-\*                           |
| `src/algorithms/floyd.module.ts`                | **新增** | buildFloydSteps + module                       |
| `src/algorithms/floyd.ts`                       | **新增** | 图数据 + oracle                                |
| `src/algorithms/floyd.sources.ts`               | **新增** | 4 语言 + lineMap                               |
| `src/algorithms/floyd.module.spec.ts`           | **新增** | TC-FLOYD-MOD-\*                                |
| `src/views/Article/Algorithm/Floyd.vue`         | **新增** | 新页                                           |
| `src/views/Article/Algorithm/Floyd.spec.ts`     | **新增** | TC-VIEW-FLOYD-01/02/03                         |
| `e2e/floyd-warshall.e2e.ts`                     | **新增** | TC-E2E-FLOYD-01                                |
| `src/assets/floyd.svg`                          | **新增** | 首页图标                                       |
| `src/router/index.ts`                           | 改       | +路由 /docs/floyd-warshall                     |
| `src/views/Docs/Menu/hooks.ts` + spec           | 改       | 图算法 +Floyd；TC-HOOK-02-1 5→6                |
| `src/views/Home/Main/hooks.ts` + spec           | 改       | 首页 +Floyd（+FloydIcon）；TC-HOOK-01-1 5→6    |

**零改动**：既有 7 轨组件（BarsView/AuxView/StackView/TreeView/CountView/BucketView/GraphView）+ 5 图算法 + usePlayer + 15 排序 + 15 结构。

## 8. 向后兼容论证

- `MatrixTrack`/`Step.matrix?`/`FloydExecPoint` 追加；`<MatrixView v-if="current.matrix">` 可插拔——其它算法不设 matrix → MatrixView 不渲染，零回归（同 GraphView/BucketView 等 7 轨的既有模式）。
- AlgorithmPlayer 仅 additive 加一行 v-if + import；既有轨渲染逻辑不动。
- 新页 + 菜单/首页加项 → 仅影响 TC-HOOK-01-1/02-1（图算法 6 项）；其余 TC-HOOK 不变。

## 9. 测试策略（详见 test-cases.md）

- **L4 MatrixView**：mock MatrixTrack 渲染断言——n+1 行列头、单元值/∞、pivot 行列高亮、active/sources/updated 类。
- **L4 播放器接矩阵轨**：TC-PLAYER-MATRIX-01（matrix → MatrixView 渲染）、-02（无 matrix → 不渲染；array:[] 不渲 BarsView）。
- **L3 floyd.module**：末步 cells = oracle floydTrace() = 终态矩阵；每步带 matrix + array:[]；#pivotStart=4；#relaxUpdate=10、#relaxSkip=3；init cells = 邻接（含 null）；末步无 null（全可达）；某单元验证（如 cells[1][0]=8=B→A）；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-FLOYD-01 Article+Player；-02 h1「Floyd」+MatrixView+16 单元+无 .bars-view；-03 全模板同屏（Article 含「最短」+ MatrixView）。
- **L4 TC-HOOK**：01-1/02-1 图算法 6 项、url 末位 'floyd-warshall'。
- **L5 e2e**：TC-E2E-FLOYD-01 /docs/floyd-warshall → .matrix-view + 单元；拖末步某单元值 + caption；Shiki。
- **复用/回归**：既有 7 轨 + 5 图算法 Case 零改动全绿。
