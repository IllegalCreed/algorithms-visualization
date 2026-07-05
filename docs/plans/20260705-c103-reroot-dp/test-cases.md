# 测试用例：换根 DP 树中距离之和（C-20260705-103，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-103
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-RR-MOD-*`、`TC-VIEW-RR-*`、`TC-E2E-RR-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例）

## L3 —— `reroot.module`

固定 5 节点完全二叉树；oracle `bruteDist` 逐点 BFS。

| 用例 ID      | 场景          | 期望                                                               |
| ------------ | ------------- | ------------------------------------------------------------------ |
| TC-RR-MOD-01 | 对拍          | ans=[6,5,9,8,8]=bruteDist()                                        |
| TC-RR-MOD-02 | 第一趟        | postOrder=[3,4,1,2,0]；size=[5,3,1,1,1]、down=[6,2,0,0,0]          |
| TC-RR-MOD-03 | 换根序        | reroots (v,parent,ansV)：(1,0,5)/(3,1,8)/(4,1,8)/(2,0,9)（DFS 序） |
| TC-RR-MOD-04 | 步合法        | point∈{init,down,root,reroot,done} 带 matrix、array=[]             |
| TC-RR-MOD-05 | 步数结构      | 12 步 = init + down×5 + root + reroot×4 + done                     |
| TC-RR-MOD-06 | init 表       | 5×3 全 null；rowLabels 树位置；colLabels [size,down,ans]           |
| TC-RR-MOD-07 | down 步       | 双格填 (size,down)；内部节点 sources=孩子 size/down 四格           |
| TC-RR-MOD-08 | root 步       | ans[0]=6；sources=[[0,1]]；caption 含第一趟收官语义                |
| TC-RR-MOD-09 | reroot 步     | sources=[[父,2],[自,0]]；caption 含「近 size[v]」公式代入          |
| TC-RR-MOD-10 | done caption  | 含 O(n) 与二次扫描/换根语义                                        |
| TC-RR-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                                    |
| TC-RR-MOD-12 | 元信息        | title 含「换根」；initialInput()=[]                                |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                        |
| ------------- | ------------------------------------------- |
| TC-VIEW-RR-01 | Article + AlgorithmPlayer                   |
| TC-VIEW-RR-02 | h1 含「换根」+ MatrixView + 无 .bars-view   |
| TC-VIEW-RR-03 | 正文含「二次扫描」与「size」                |
| TC-HOOK       | DP children 10→11、尾 +reroot-dp（两 spec） |

## L5 —— e2e

| 用例 ID      | 期望                                                              |
| ------------ | ----------------------------------------------------------------- |
| TC-E2E-RR-01 | h1 含「换根」；`.matrix-view` 可见；拖末步 caption 含 O(n)；Shiki |

## 回归

MatrixView 纯复用零改动（14 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅 DP +1。

## 自测报告

- 执行：1880/1880 全绿、96.19%/95.86%；e2e reroot-dp + tree-dp + digit-dp 回归 3/3（首跑全过）。
- 新增 16 Case：RR-MOD 12 + VIEW-RR 3 + E2E-RR 1；改 TC-HOOK 2（DP 10→11 + 尾 +reroot-dp）。
- 关键实测：ans=[6,5,9,8,8]=逐点 BFS（TC-01）；后序 size/down 全等（TC-02）；换根 DFS 序与公式结果（TC-03）；down 步孩子四格/root 步 down 格/reroot 步父 ans+自 size sources（TC-07/08/09）。
- 真机：reroot 步「3 个点近了 1 步、2 个点远了 1 步：ans[1] = 6 − 3 + 2 = 5」+ 2 黄格。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
