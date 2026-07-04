# 测试用例：A\* 寻路（C-20260705-096，纯复用 MazeView）

> Status: verified
> Stable ID: C-20260705-096
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-AS-MOD-*`、`TC-VIEW-AS-*`、`TC-E2E-AS-01`；改 `TC-HOOK`（纯复用 MazeView，无 VIZ/PLAYER 新用例，同 C-066/068 网格线先例）

## L3 —— `astar.module`

固定 4×6、墙 (1,2),(2,2)、S=(1,0)、G=(2,5)；oracle `bfsInfo`。

| 用例 ID      | 场景          | 期望                                                           |
| ------------ | ------------- | -------------------------------------------------------------- |
| TC-AS-MOD-01 | 最优对拍      | A\* 路径长 8 = bfsInfo().shortest；路径首尾 = S/G 且相邻步合法 |
| TC-AS-MOD-02 | 省的对拍      | 扩展 10 格 < bfsInfo().reachable=22                            |
| TC-AS-MOD-03 | 扩展序        | 10 次弹出序全等（(1,0)f6…(2,5)f8），tie-break (f,h,r,c)        |
| TC-AS-MOD-04 | 步合法        | point∈{init,expand,goal,trace,done} 带 maze、array=[]          |
| TC-AS-MOD-05 | 步数结构      | 13 步 = init + expand×9 + goal + trace + done                  |
| TC-AS-MOD-06 | expand 步     | current=弹出格；visited 累积 1..9；letters[current]=f 值       |
| TC-AS-MOD-07 | letters 累积  | 开出的邻居格 letters=其 f；未触达格 ''；墙格 ''                |
| TC-AS-MOD-08 | goal 步       | current=G、caption 含终点语义                                  |
| TC-AS-MOD-09 | trace 步      | path=8 步最优路径 + solved=true                                |
| TC-AS-MOD-10 | done caption  | 含 10 与 22（对比 BFS）与可采纳/曼哈顿语义                     |
| TC-AS-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                                |
| TC-AS-MOD-12 | 元信息        | title 含「A\*」；initialInput()=[]；mark='🧭'                  |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                              |
| ------------- | ------------------------------------------------- |
| TC-VIEW-AS-01 | Article + AlgorithmPlayer                         |
| TC-VIEW-AS-02 | h1 含「A\*」+ MazeView + 无 .bars-view            |
| TC-VIEW-AS-03 | 正文含「启发」与「f = g + h」                     |
| TC-HOOK       | 回溯 children = [...,'sudoku','astar']（两 spec） |

## L5 —— e2e

| 用例 ID      | 期望                                                               |
| ------------ | ------------------------------------------------------------------ |
| TC-E2E-AS-01 | h1 含「A\*」；`.maze-view` 可见；拖末步 caption 含 10 与 22；Shiki |

## 回归

MazeView 纯复用零改动（迷宫/岛屿/单词搜索零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅回溯 +1。

## 自测报告

- 执行：1775/1775 全绿、96.01%/95.69%；e2e astar + maze + islands + word-search 回归 4/4（首跑全过）。
- 新增 16 Case：AS-MOD 12 + VIEW-AS 3 + E2E-AS 1；改 TC-HOOK 2（回溯 children +astar）。
- 关键实测：路径 8 步 = BFS 最短且逐步相邻（TC-01）；扩展 10 < 可达 22（TC-02）；扩展序 10 项全等（TC-03）；letters f 值累积、墙与未触达为空（TC-07）；trace 8 步 + solved（TC-09）。
- 真机：expand 步 f 值 12 格点亮 + closed 7 蓝 + 当前格琥珀圈、caption「f=6 队伍撞墙 → f=8 绕行」叙事；末步 9 格路径绿 + 10 vs 22。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
