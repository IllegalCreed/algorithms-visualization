# 测试用例：树形 DP 打家劫舍 III（C-20260705-100，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-100
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-TD-MOD-*`、`TC-VIEW-TD-*`、`TC-E2E-TD-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例）

## L3 —— `treedp.module`

固定层序 `[4,1,5,3,6]`；oracle `bruteRob` 枚举不相邻子集。

| 用例 ID      | 场景          | 期望                                                       |
| ------------ | ------------- | ---------------------------------------------------------- |
| TC-TD-MOD-01 | 对拍          | max(根两态)=14=bruteRob()；根 (13,14)                      |
| TC-TD-MOD-02 | 后序 fills    | order=[3,4,1,2,0]；五节点 (sel,not) 全等                   |
| TC-TD-MOD-03 | 步合法        | point∈{init,leaf,sel,not,best,done} 带 matrix、array=[]    |
| TC-TD-MOD-04 | 步数结构      | 10 步 = init + leaf×3 + (sel+not)×2 + best + done          |
| TC-TD-MOD-05 | init 表       | 5×2 全 null；rowLabels 树位置；colLabels [选,不选]         |
| TC-TD-MOD-06 | leaf 步       | 一步双格 (v,0)；updatedCell 行 3/4/2 跳跃                  |
| TC-TD-MOD-07 | sel sources   | 节点 1 sel 引 [[3,1],[4,1]]；根 sel 引 [[1,1],[2,1]]       |
| TC-TD-MOD-08 | not sources   | 节点 1 not 引孩子四格；根 not 引 [[1,0],[1,1],[2,0],[2,1]] |
| TC-TD-MOD-09 | best 步       | sources=[[0,0],[0,1]]；caption 含 max 与 14                |
| TC-TD-MOD-10 | done caption  | 含 14 与后序/子树语义                                      |
| TC-TD-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 6 执行点                            |
| TC-TD-MOD-12 | 元信息        | title 含「树形」；initialInput()=TD_VALS                   |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                      |
| ------------- | ----------------------------------------- |
| TC-VIEW-TD-01 | Article + AlgorithmPlayer                 |
| TC-VIEW-TD-02 | h1 含「树形」+ MatrixView + 无 .bars-view |
| TC-VIEW-TD-03 | 正文含「后序」与「子树」                  |
| TC-HOOK       | DP children 8→9、尾 +tree-dp（两 spec）   |

## L5 —— e2e

| 用例 ID      | 期望                                                            |
| ------------ | --------------------------------------------------------------- |
| TC-E2E-TD-01 | h1 含「树形」；`.matrix-view` 可见；拖末步 caption 含 14；Shiki |

## 回归

MatrixView 纯复用零改动（12 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅 DP +1。

## 自测报告

- 执行：1835/1835 全绿、96.13%/95.83%；e2e tree-dp + tsp + lis 回归 4/4（首跑全过）。
- 新增 16 Case：TD-MOD 12 + VIEW-TD 3 + E2E-TD 1；改 TC-HOOK 2（DP 8→9 + 尾 +tree-dp）。
- 关键实测：max(13,14)=14=bruteRob（TC-01）；后序 [3,4,1,2,0] 与五节点两态全等（TC-02）；sel/not sources 分别为孩子不选格/四格（TC-07/08）；leaf 跳行 3/4/2（TC-06）。
- 真机：not 步「max(1, 9) + max(5, 0) = 14」caption + 孩子四格黄。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
