# 设计：单词搜索（C-20260704-068，DFS 回溯匹配 · 扩展 MazeView）

> Status: verified
> Stable ID: C-20260704-068
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用迷宫/岛屿的 **MazeView 网格轨**，additive 加 `letters` 让每格显示字母（第 3 消费者）。单词搜索用「DFS 逐字母试探 + 回溯」逐步重走，产出 `Step<WordSearchExecPoint>` 胖步骤（复用 `Step.maze`，无新 Step 字段）。

## T0：MazeView additive 扩展（迷宫/岛屿零回归）

`types.ts`：`MazeTrack` +`letters?: string[][]`（每格字母；不设则不显示）。+`WordSearchExecPoint`。

`MazeView.vue`：`cells` computed 每格加 `letter: m.letters ? m.letters[r][c] : ''`；模板在格内**优先**渲染字母（`v-if="cell.letter"`），否则维持既有 🐭/🚩/S 逻辑。当前格的琥珀环、path 琥珀、solution 绿等既有高亮不变——单词搜索的字母叠加在这些底色/描边之上。迷宫/岛屿不传 `letters` → 渲染不变，`TC-VIZ-MAZEVIEW-01..05` 全绿。

## T1：oracle + module + sources

`wordsearch.ts`（固定盘 + 词）：

```ts
export const WORD_BOARD = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];
export const WORD_TARGET = 'ADEE';
export const WORD_DIRS = [[-1,0],[1,0],[0,-1],[0,1]]; // 上下左右
export function wordExists(): boolean { … }          // → true
export function wordPath(): [number, number][] { … }  // → [[2,0],[2,1],[2,2],[2,3]]
```

`wordsearch.module.ts`：`buildWordSearchSteps(): Step<WordSearchExecPoint>[]`

- 外层按行列找首字母 `board[r][c]===word[0]` 作起点，DFS：
  - `start`：`current=[r,c]`、`path=[[r,c]]`。
  - 对四方向邻格 `(nr,nc)`（在界内、不在 path）：
    - `board[nr][nc]===word[k+1]` → `match`：`current=[nr,nc]`、`path` 追加，递归下一字母。
    - 否则 → `mismatch`：`current=[nr,nc]`（探查格琥珀环），`path` 不变，换下一方向。
  - `k===len-1` → `found`：`solved=true`、`path` 整条绿。
  - 一个格四方向试完仍未成功 → `backtrack`：`path.pop()`、`current` 回到新栈顶（或 null）。
- `walls` 全 false、无 start/goal；`letters=WORD_BOARD`。约 **12 步**（含 1 次真回退 + 1 次换起点）。`vars`：网格、目标词、已匹配前缀、当前格、路径。

demo `"ADEE"` 轨迹：`start(0,0)` → `mismatch(1,0)S` / `mismatch(0,1)B` → `backtrack(0,0)`（撤销）→ `start(2,0)` → `mismatch(1,0)S` → `match(2,1)D` → `mismatch(1,1)F` → `match(2,2)E` → `mismatch(1,2)C` → `match(2,3)E` → `found`。路径 `[(2,0),(2,1),(2,2),(2,3)]`。

`wordsearch.sources.ts`：TS/Python/Go/Rust 四语言标准回溯 `exist`，`lineMap` 覆盖 start/match/mismatch/backtrack/found。

## T2：页面 + 接线

`WordSearch.vue`：`Article` 正文（标题「单词搜索」+ 副标「回溯与搜索 · 网格 DFS」）：

- 讲清与迷宫/岛屿的对照：迷宫**找一条路**、岛屿**数连通块**、单词搜索**沿匹配字母找路径**且**同格不复用**；核心是回溯「试探—失败—**撤销**—回退」，同格不复用靠进入时标记、回退时**撤销标记**。
- `<AlgorithmPlayer :module="wordSearchModule" />`。
- 结语点出与决策树/棋盘回溯同源（状态空间不同，骨架相同），进阶指向单词搜索 II（Trie）。

接线：路由 `/docs/word-search`（name=`word-search`）；菜单 + 首页「回溯与搜索」children **第 7 项**（紧接 `number-of-islands`）：`[...,'maze','number-of-islands','word-search']`；新图标 `word-search.svg`（网格 + 字母路径）；改 `TC-HOOK`（回溯 children，menu+home 各 1 处）。

## 复用与零回归

- MazeView：`letters` additive，迷宫/岛屿不传即不显示 → 行为不变。
- 无新轨、无新 Step 字段（复用 `Step.maze`）；AlgorithmPlayer 零改动。
- 迷宫/岛屿/N 皇后/子集/排列/组合总和现有 Case 不受影响。

## 变更历史

- 2026-07-04：创建（draft → approved）。扩展 MazeView 带字母网格轨（第 3 消费者，additive letters）；单词搜索 DFS 逐字母试探 + 回溯，demo "ADEE" 含 1 次真回退，与迷宫/岛屿配齐网格搜索三形态。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：MazeView cells 加 letter + 模板优先渲染字母；wordsearch.module DFS 逐字母试探 11 步含 1 真回退，oracle wordExists()=true/wordPath()=[[2,0],[2,1],[2,2],[2,3]]；4 语言 sources lineMap 对齐 start/match/mismatch/backtrack/found。
