# 测试用例：二分图匹配·匈牙利算法（C-20260705-097，纯复用 GraphView）

> Status: verified
> Stable ID: C-20260705-097
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-HG-MOD-*`、`TC-VIEW-HG-*`、`TC-E2E-HG-01`；改 `TC-HOOK`（纯复用 GraphView，无 VIZ/PLAYER 新用例）

## L3 —— `hungarian.module`

固定 `L1:{R1,R2}、L2:{R1}、L3:{R2,R3}`；oracle `bruteMaxMatching` 枚举。

| 用例 ID      | 场景          | 期望                                                         |
| ------------ | ------------- | ------------------------------------------------------------ |
| TC-HG-MOD-01 | 对拍          | hungarianTrace 匹配数 3 = bruteMaxMatching；matchR=[1,0,2]   |
| TC-HG-MOD-02 | 事件流        | try/match/fail 序列全等（含增广双 match 与死路双 fail）      |
| TC-HG-MOD-03 | 步合法        | point∈{init,try,match,fail,done} 带 graph、array=[]          |
| TC-HG-MOD-04 | 步数结构      | 12 步 point 序列全等（连续 match 合并一步）                  |
| TC-HG-MOD-05 | try 步        | 试探边 current、activeNode=求偶者；冲突 caption 含「让路」   |
| TC-HG-MOD-06 | match 步      | 匹配边全 mst；增广步 L1-R2 与 L2-R1 同时绿                   |
| TC-HG-MOD-07 | fail 步       | 死路链边 rejected；caption 含死路/回退语义                   |
| TC-HG-MOD-08 | badge         | match 后右点 badge 显示配对（如 ←L1）；翻转后更新            |
| TC-HG-MOD-09 | doneNodes     | 终局 6 点全 done；中途数量随匹配增长                         |
| TC-HG-MOD-10 | done caption  | 含 3 与 König 或最大流语义                                   |
| TC-HG-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                              |
| TC-HG-MOD-12 | 元信息        | title 含「匈牙利」；initialInput()=[]；两列布局（左 x<右 x） |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                           |
| ------------- | ---------------------------------------------- |
| TC-VIEW-HG-01 | Article + AlgorithmPlayer                      |
| TC-VIEW-HG-02 | h1 含「匈牙利」+ GraphView + 无 .bars-view     |
| TC-VIEW-HG-03 | 正文含「增广」与「二分图」                     |
| TC-HOOK       | 图算法 children 9→10、尾 +hungarian（两 spec） |

## L5 —— e2e

| 用例 ID      | 期望                                                            |
| ------------ | --------------------------------------------------------------- |
| TC-E2E-HG-01 | h1 含「匈牙利」；`.graph-view` 可见；拖末步 caption 含 3；Shiki |

## 回归

GraphView 纯复用零改动（10 既有消费者零回归，抽 dijkstra/max-flow e2e）；AlgorithmPlayer 零改动；TC-HOOK 仅图算法 +1。

## 自测报告

- 执行：1790/1790 全绿、96.05%/95.72%；e2e hungarian + max-flow + dijkstra 回归 3/3（首跑全过）。
- 新增 16 Case：HG-MOD 12 + VIEW-HG 3 + E2E-HG 1；改 TC-HOOK 2（图算法 9→10 + 尾 +hungarian）。
- 关键实测：匹配 3 = 暴力枚举、matchR=[1,0,2]（TC-01）；事件流 15 项全等（TC-02）；增广步双边同时 mst + badge 翻转 ←L1→←L2（TC-06/08）；fail 步 rejected + 死路 caption（TC-07）。
- 真机：增广步 2 绿边 + 4 done 节点 + caption「一让一定」。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
