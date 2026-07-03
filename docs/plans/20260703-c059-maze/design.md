# 设计：迷宫寻路（C-20260703-059，MazeView 新轨）

> Status: verified
> Stable ID: C-20260703-059
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

沿用 AlgorithmPlayer 可插拔轨范式：新增算法 = 新 `Step.xxx?` 字段 + 新 `XxxView.vue` + AlgorithmPlayer 加一行 `v-if` + 一个「细粒度重走」module。迷宫的逐格状态（墙/通路/路径/已访问）与既有 10 轨（尤其 Board 的按列皇后）语义不同，**新建第 11 条 MazeView 迷宫轨**（借鉴 BoardView 的 CSS grid 布局），既有轨零改动。

## 新轨：MazeView（第 11 轨，网格搜索通用原语）

### 类型（`src/components/player/types.ts`，纯加法）

```ts
export interface MazeTrack {
  rows: number;
  cols: number;
  walls: boolean[][]; // walls[r][c] = 是否墙
  start: [number, number];
  goal: [number, number];
  current?: [number, number] | null; // 老鼠当前格（🐭 + 琥珀环）
  path?: [number, number][]; // 当前 DFS 栈路径 start..current（琥珀 trail）
  visited?: [number, number][]; // 已进入过的格（浅蓝；含已放弃的死路）
  solved?: boolean; // path 即解路径 → 整条标绿
}

export type MazeExecPoint =
  | 'start' // 位于起点
  | 'move' // 沿某方向前进一格（入栈）
  | 'deadend' // 当前格四周无未访问通路 → 死路
  | 'backtrack' // 退回上一格（出栈）
  | 'goal' // 到达终点
  | 'done'; // 结束（解路径标绿）

// Step 加一字段
maze?: MazeTrack; // 纯加法：迷宫轨；其它算法不设 → MazeView 不渲染
```

### 组件（`src/components/MazeView.vue`）

CSS grid `rows×cols`（借鉴 BoardView）。每格按状态着色（用 `r,c` Set 判成员）：

- **墙** `.mz-wall`（暗实块）；**通路** 浅底。
- **已访问** `.mz-visited`（浅蓝，含放弃的死路）；**当前路径** `.mz-path`（琥珀 trail）；`solved` 时路径 `.mz-solution`（绿）。
- **当前格** `.mz-current`（琥珀环 + 🐭）；**终点** `.mz-goal`（🚩）；**起点** `.mz-start`（起点标记）。
- 优先级：墙 > 当前格 > 解/路径 > 已访问 > 通路；起点/终点标记叠加。

## 算法：迷宫寻路（固定 5×5）

### 迷宫与遍历

固定 5×5（`0` 通路 / `1` 墙）：

```
S . . . .
. # . # .
# . . . #
. . # # .
. . . . G
```

S=(0,0)、G=(4,4)。DFS 四方向固定顺序 **下、右、上、左**，标记 visited 防重入。撞墙/越界/已访问则换方向；一格四方向皆不可走即**死路**，出栈回溯到上一格换方向；到达 G 即找到路径。

解路径（DFS 序）：`(0,0)(0,1)(0,2)(1,2)(2,2)(2,1)(3,1)(4,1)(4,2)(4,3)(4,4)`；途中 **2 处死路** `(1,0)`、`(2,3)` 被探入后回溯。

### 细粒度重走（`src/algorithms/maze.ts` + `maze.module.ts`）

`maze.ts`：固定 `MAZE_GRID`/`MAZE_START`/`MAZE_GOAL` + `mazeSolve()` oracle（纯 DFS 返回解路径）。

`maze.module.ts` `buildMazeSteps()` 复跑同构 DFS，emit 迷宫轨胖步骤：入格 emit `start`（起点）/`move`（前进），到 G emit `goal`；一格无未访问通路 emit `deadend`；出栈 emit `backtrack`（current=上一格）。找到 G 后递归带 `true` 上卷、不再回溯，`path` 保持为解路径；末尾 emit `done`（`solved=true`）。约 **19 步**（start 1 + move 12〈含 2 死路格 + 10 路径格〉+ deadend 2 + backtrack 2 + goal 1 + done 1）。`vars`：`起点/终点/当前格/路径长/已访问数`。

### 四语言源码（`src/algorithms/maze.sources.ts`）

ts/python/go/rust 各一段经典迷宫 DFS 回溯（`dfs(r,c)`：越界/墙/visited 返回 false；标记 visited + path.push；到终点 return true；四方向递归；皆失败 path.pop 回溯 return false）。`lineMap` 映射 `start/move/deadend/backtrack/goal/done`。

## 页面与接线

- `Maze.vue`：Article 正文（走迷宫找路、DFS 深入 + 撞死路回退、visited 防转圈、与棋盘/决策树并列的网格搜索视角、BFS 找最短带过、应用）+ `<AlgorithmPlayer :module="mazeModule"/>`。`array:[]` → BarsView 隐藏。
- 路由 `/docs/maze` name=`maze` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「回溯与搜索」+「迷宫寻路」（第 5 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `maze.svg`（迷宫 + 路径图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[4].children` → `['n-queens','subsets','permutations','combination-sum','maze']`。

## 关键决策

1. **新建 MazeView 而非复用 BoardView**：BoardView 是皇后专用（按列存皇后位），迷宫是逐格状态（墙/路径/访问）；语义不同，另起 additive 第 11 轨保 BoardView 零改动，也为后续网格搜索题（岛屿数量/单词搜索/BFS）铺路。
2. **DFS（非 BFS）**：本大类是「回溯与搜索」，DFS 的「深入-回退」正是回溯；BFS 最短路留作正文提及/后续。
3. **固定 5×5 + 2 死路**：网格够小清晰、又有明确回溯，步数 ~19 与既有回溯页同量级。

## 影响面

- 改：`types.ts`（+MazeTrack/Step.maze?/MazeExecPoint）、`AlgorithmPlayer.vue`（+import +`<MazeView v-if>`）、`AlgorithmPlayer.spec.ts`（+2 用例）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`MazeView.vue`(+spec)、`maze.ts`、`maze.sources.ts`、`maze.module.ts`(+spec)、`Maze.vue`(+spec)、`e2e/maze.e2e.ts`、`src/assets/maze.svg`。
- 既有 10 轨 + 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。第 11 条 MazeView 迷宫轨 + 迷宫寻路页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（MazeView 借鉴 BoardView CSS grid、maze.module DFS 回溯 19 步、`array:[]` 隐 BarsView、既有 10 轨零改动）；真机首步 25 格 6 墙、首个死路 (1,0)、末步解路径 11 格绿验证。实际步数 19（与设计估计一致）。
