# 设计：N 皇后（回溯大类首发 + 新建 BoardView 棋盘轨）

> Status: verified
> Stable ID: C-20260703-055
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Queens.vue（新页，归「回溯与搜索」新大类）
   │  <Article> 正文（N 皇后 / 回溯试探-剪枝 / 应用）
   │  <AlgorithmPlayer :module="queensModule" />
   ▼
框架扩展（新增第 9 条轨，additive）：
   player/types.ts   +BoardTrack、+Step.board?、+NQueensExecPoint
   AlgorithmPlayer.vue  +<BoardView v-if="current.board" :board="current.board" />
   components/BoardView.vue（新）  渲染 N×N 交错棋盘 + 皇后 + 冲突
   ▼
算法模块 src/algorithms/
   queens.module.ts   buildQueensSteps + queensModule
   queens.ts          N + oracle queensTrace()→首解
   queens.sources.ts  4 语言 + lineMap

新大类接线：router（/docs/n-queens）+ 菜单 +「回溯与搜索」+ 首页 +「回溯与搜索」（新 queens.svg）
TC-HOOK：TC-HOOK-01-1/02-1 顶层分类 4→5、新增「回溯与搜索」含 n-queens
不改：既有 8 轨 / 6 图算法 / 2 DP / 15 排序 / 15 结构
```

## 2. 类型扩展（additive）

```ts
export interface BoardTrack {
  n: number; // 棋盘大小
  queens: (number | null)[]; // queens[col] = 该列皇后所在行；null=未放
  tryCell?: [number, number] | null; // 当前尝试格 [row, col]（琥珀环）
  conflictCells?: [number, number][]; // 与 tryCell 冲突的已放皇后 [row, col]（红）
}
export type NQueensExecPoint =
  | 'init' // 空棋盘
  | 'tryConflict' // 试探 (row,col) 但与已放皇后冲突（红显冲突）
  | 'place' // 试探 (row,col) 不冲突 → 放下皇后
  | 'backtrack' // 本列无处可放 → 退回上一列、挪走那里的皇后
  | 'solved'; // N 个皇后全放好，得到一个解
// Step 追加：board?: BoardTrack;  // 纯加法：其它算法不设 → BoardView 不渲染
```

## 3. BoardView 新轨（`components/BoardView.vue`）

- 渲染 `n×n` 交错棋盘（`(row+col)%2` 深/浅格）。已放皇后：`queens[col]!=null` → 在 `(queens[col], col)` 显 ♛。
- **tryCell**：`(row,col)` 琥珀环（当前尝试）。
- **conflictCells**：冲突的已放皇后格红底 + tryCell 也标红（冲突时）。
- 复用新拟物 mixin + `@font-*`；`.board-view` / `.board-cell`(+`.dark`) / `.board-queen` / `.bc-try` / `.bc-conflict` 类。

## 4. 算法与首解（`queens.ts`，N=4）

逐列放皇后，每列试行 0→N-1；`safe(row,col)` = 与所有已放皇后（列 < col）不同行、不同对角线（`|row-queens[c]| != |col-c|`）。求**第一个解**：

```
queens = [1, 3, 0, 2]   // 列 0→行 1、列 1→行 3、列 2→行 0、列 3→行 2
```

**回溯过程要点**（→ 步骤）：col0 放 (0,0) → col1 试 (0,1)(1,1) 冲突、(2,1) 放 → col2 (0..3,2) 全冲突 → 回溯挪 col1 到 (3,1) → col2 放 (1,2) → col3 全冲突 → 回溯…最终经数次回溯，col0 挪到 (1,0) 一路放到 [1,3,0,2] 成解。

## 5. 算法模块 `queens.module.ts`

- init：空盘（queens 全 null）。
- 递归 solve(col)：for row 0..N-1：
  - 算冲突（同行/同对角的已放皇后）。有冲突 → emit `tryConflict`（tryCell=(row,col)、conflictCells=冲突皇后）。
  - 无冲突 → queens[col]=row，emit `place`（tryCell=(row,col)）；递归 solve(col+1)：成功则向上传播（最终 solved）。
  - 递归失败 → queens[col]=null（继续试下一行）。
  - col 内所有行试完仍无解 → emit `backtrack`（退回，调用者会挪上一列皇后）。
  - col==N → emit `solved`（满盘）。
- 每步：`array:[]`、`vars`（列/尝试行、已放皇后、状态）、`board`、`point`、`caption`。
- 步数：init 1 + 试探（tryConflict + place）+ backtrack + solved ≈ **32 步**（实测为准）。终态 queens=[1,3,0,2]。

## 6. oracle + sources

```ts
// queens.ts
export const QUEENS_N = 4;
export function queensTrace(): number[] { ... 回溯求第一个解 ... }  // [1,3,0,2]
```

sources 4 语言：标准 N 皇后回溯（safe 检查 + 递归 + 回溯）。TS lineMap `{ init, tryConflict, place, backtrack, solved }`；python/go/rust 逐行核对。

## 7. 接线与改动面

| 文件                                            | 类型     | 改动                                                      |
| ----------------------------------------------- | -------- | --------------------------------------------------------- |
| `src/components/player/types.ts`                | 改       | +BoardTrack、+Step.board?、+NQueensExecPoint              |
| `src/components/player/AlgorithmPlayer.vue`     | 改       | +import + `<BoardView v-if="current.board">`              |
| `src/components/player/AlgorithmPlayer.spec.ts` | 改       | +TC-PLAYER-BOARD-\*                                       |
| `src/components/BoardView.vue` + spec           | **新增** | 棋盘轨渲染 + TC-VIZ-BOARDVIEW-\*                          |
| `src/algorithms/queens.{module,,sources}.ts`    | **新增** | module + N/oracle + 4 语言                                |
| `src/algorithms/queens.module.spec.ts`          | **新增** | TC-QUEENS-MOD-\*                                          |
| `src/views/Article/Algorithm/Queens.vue` + spec | **新增** | 新页 + TC-VIEW-QUEENS-\*                                  |
| `e2e/n-queens.e2e.ts`                           | **新增** | TC-E2E-QUEENS-01                                          |
| `src/assets/queens.svg`                         | **新增** | 首页图标                                                  |
| `src/router/index.ts`                           | 改       | +路由 /docs/n-queens                                      |
| `src/views/Docs/Menu/hooks.ts` + spec           | 改       | +「回溯与搜索」分类；TC-HOOK-02-1 分类 4→5                |
| `src/views/Home/Main/hooks.ts` + spec           | 改       | +「回溯与搜索」分类（+QueensIcon）；TC-HOOK-01-1 分类 4→5 |

**零改动**：既有 8 轨组件 + 6 图算法 + 2 DP + usePlayer + 15 排序 + 15 结构。

## 8. 向后兼容论证

- `BoardTrack`/`Step.board?`/`NQueensExecPoint` 追加；`<BoardView v-if="current.board">` 可插拔——其它算法不设 board → 不渲染，零回归（同 GraphView/MatrixView 等既有轨模式）。
- 新增顶层分类 → 仅 TC-HOOK-01-1/02-1（分类 4→5 + 回溯断言）；其余 TC-HOOK 不变。

## 9. 测试策略（详见 test-cases.md）

- **L4 BoardView**：mock BoardTrack 渲染——n×n 格、♛ 位置、tryCell/.bc-try、conflictCells/.bc-conflict。
- **L4 播放器接棋盘轨**：TC-PLAYER-BOARD-01（board → BoardView 渲染）、-02（无 board → 不渲染）。
- **L3 queens.module**：末步 solved、queens=[1,3,0,2]（= oracle）；每步带 board + array:[]；解合法（两两不同行/对角）；init 空盘；首个 place=(0,0)；tryConflict 步 conflictCells 非空；backtrack 步减少皇后；#solved==1；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-QUEENS-01 Article+Player；-02 h1「皇后」+BoardView+16 格+无 .bars-view；-03 全模板同屏。
- **L4 TC-HOOK**：01-1/02-1 顶层 5 分类、「回溯与搜索」含 n-queens。
- **L5 e2e**：TC-E2E-QUEENS-01 /docs/n-queens → .board-view + 格；拖末步 4 ♛ + caption；Shiki。
- **复用/回归**：既有 8 轨 + 6 图算法 + 2 DP Case 零改动全绿。
