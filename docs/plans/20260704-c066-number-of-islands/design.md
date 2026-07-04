# 设计：岛屿数量（C-20260704-066，Flood Fill · 扩展 MazeView）

> Status: verified
> Stable ID: C-20260704-066
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用迷宫的 **MazeView 网格轨**，以 additive 字段扩成通用「网格搜索轨」（第 2 消费者）。岛屿用「扫描 + Flood Fill」逐格重走，产出 `Step<IslandsExecPoint>` 胖步骤（复用 `Step.maze`，无新 Step 字段）。

## T0：MazeView additive 扩展（迷宫零回归）

`types.ts`：

```ts
export interface MazeTrack {
  rows: number;
  cols: number;
  walls: boolean[][];
  start?: [number, number] | null; // 转可选：岛屿不设 → 不渲染 S
  goal?: [number, number] | null; // 转可选：岛屿不设 → 不渲染 🚩
  current?: [number, number] | null;
  path?: [number, number][];
  visited?: [number, number][];
  solved?: boolean;
  filled?: [number, number][]; // 新增：已确认属于岛屿的陆地（绿，复用 .mz-solution）
  mark?: string; // 新增：当前格图标（缺省 '🐭'）
}

export type IslandsExecPoint = 'scan' | 'found' | 'flood' | 'done';
```

`MazeView.vue`：

- `cells` computed：`start`/`goal` 判定加空值保护（`m.start ? … : false`）；`solution` 并入 `filled`（`(onPath && solved) || filledSet.has(key)`）——绿格复用既有 `.mz-solution` 样式，无新 CSS。
- 模板：当前格图标由硬编码 `🐭` 改为 `{{ maze.mark ?? '🐭' }}`。

迷宫 `maze.module` 始终传 start/goal、不传 filled/mark → 行为不变，`TC-VIZ-MAZEVIEW-01..04` 全绿。

## T1：oracle + module + sources

`islands.ts`（固定 4×4 网格，3 个岛）：

```ts
export const ISLAND_GRID = [
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
];
export const ISLAND_DIRS = [[-1,0],[1,0],[0,-1],[0,1]]; // 上下左右四连通
export function islandCount(): number { … } // → 3
```

岛屿：{(0,0),(0,1),(1,0)}、{(1,3),(2,3)}、{(3,0)} → 3。

`islands.module.ts`：`buildIslandsSteps(): Step<IslandsExecPoint>[]`

- 外层 `for r for c` 行列扫描，`current=[r,c]`、`mark='🔎'`：
  - 水 / 已 filled 的陆地 → `scan`（字幕注明「水，跳过」或「已属岛屿 k」）。
  - 未访问陆地 → 岛屿数 +1，`found`（把该格加入 filled），随后 DFS 邻居：每个新连通陆地格 `flood`（加入 filled）。
- 末 `done`：`current=null`，字幕「扫描完毕：共 3 个岛屿」。
- `walls[r][c] = grid==0`（水为墙/深色）；`filled` 随 found/flood 增长（绿）。约 **20 步**。
- `vars`：网格尺寸、当前格、岛屿计数、已铺陆地数。

`islands.sources.ts`：TS/Python/Go/Rust 四语言标准 `numIslands` + DFS Flood Fill，`lineMap` 覆盖 scan/found/flood/done。

## T2：页面 + 接线

`Islands.vue`：`Article` 正文（标题「岛屿数量」+ 副标「回溯与搜索 · Flood Fill」）：

- 讲清与迷宫的对照：迷宫找**一条路径**（DFS + 回溯，撞死路退回）；岛屿**数连通块**（扫描每个格，遇新陆地就 Flood Fill 铺满一整片，铺完计数 +1）。
- `<AlgorithmPlayer :module="islandsModule" />`。
- 结语点出 Flood Fill 应用（图像连通域、油漆桶）+ BFS 版为进阶。

接线：

- 路由 `/docs/number-of-islands`（name=`number-of-islands`），懒加载。
- 菜单 `Docs/Menu/hooks.ts` + 首页 `Home/Main/hooks.ts`「回溯与搜索」children **第 6 项**（紧接 `maze`）：`['n-queens','subsets','permutations','combination-sum','maze','number-of-islands']`。
- 新图标 `src/assets/islands.svg`（网格 + 陆地块 + 水波）。
- 改 `TC-HOOK`（回溯 children 断言，menu+home 各 1 处）。

## 复用与零回归

- MazeView：`filled`/`mark` additive，`start`/`goal` 转可选加空值保护——迷宫始终传齐、行为不变。
- 无新轨、无新 Step 字段（复用 `Step.maze`）；AlgorithmPlayer 零改动。
- 迷宫/N 皇后/子集/排列/组合总和现有 Case 不受影响。

## 变更历史

- 2026-07-04：创建（draft → approved）。扩展 MazeView 为网格搜索轨（第 2 消费者，additive filled/mark + start/goal 可选）；岛屿扫描 + DFS Flood Fill，与迷宫「找路 vs 数块」对照。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：MazeView `filled`→复用 `.mz-solution`、`mark ?? '🐭'`、start/goal 空值保护；islands.module 扫描 + DFS Flood Fill 20 步、oracle islandCount()=3；4 语言 sources lineMap 对齐 scan/found/flood/done。
