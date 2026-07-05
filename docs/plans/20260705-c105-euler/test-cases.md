# 测试用例：欧拉路径 Hierholzer（C-20260705-105，纯复用 GraphView · M9-3）

> Status: verified
> Stable ID: C-20260705-105
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-EU-MOD-*`、`TC-VIEW-EU-*`、`TC-E2E-EU-01`；改 `TC-HOOK`（纯复用 GraphView，无 VIZ/PLAYER 新用例）

## L3 —— `euler.module`

固定 5 节点 7 边无向图；oracle `bruteEulerPath` 回溯搜路 + `isValidEulerPath` 验证器。

| 用例 ID      | 场景          | 期望                                                                                        |
| ------------ | ------------- | ------------------------------------------------------------------------------------------- |
| TC-EU-MOD-01 | 对拍          | trace.path=[1,3,4,2,1,0,2,3] 过 isValidEulerPath；bruteEulerPath() 也合法且起终=奇度点      |
| TC-EU-MOD-02 | 判定          | deg=[2,3,4,3,2]、odd=[1,3]、start=1                                                         |
| TC-EU-MOD-03 | 事件流        | walk×4 → back(3) → walk×3 → back×7 清栈；首 back 时栈顶 2 有余边                            |
| TC-EU-MOD-04 | 步合法        | point∈{init,check,walk,back,done} 带 graph、array=[]                                        |
| TC-EU-MOD-05 | 步数结构      | 12 步 = init+check+walk×4+back+walk×3+back+done                                             |
| TC-EU-MOD-06 | check 步      | nodeBadge=['2','3','4','3','2']；caption 含奇度与定理语义                                   |
| TC-EU-MOD-07 | walk 步       | 走过边 edgeClass=mst 渐增；两端 badge 递减；第 4 walk 后 3 号 badge='0'                     |
| TC-EU-MOD-08 | back 步①      | caption 含「卡住」与「余边」；activeNode 回到栈顶 2（栈底部另一个 3 仍在栈）；vars 路径含 3 |
| TC-EU-MOD-09 | back 步②      | 末 back 7 边全 mst、stackNodes=[]；caption 含反转                                           |
| TC-EU-MOD-10 | done          | caption 含 O(E) 与一笔画/欧拉语义；路径全序列                                               |
| TC-EU-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 5 执行点                                                             |
| TC-EU-MOD-12 | 元信息        | title 含「欧拉」；initialInput()=[]                                                         |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                             |
| ------------- | ------------------------------------------------ |
| TC-VIEW-EU-01 | Article + AlgorithmPlayer                        |
| TC-VIEW-EU-02 | h1 含「欧拉」+ GraphView + 无 .bars-view         |
| TC-VIEW-EU-03 | 正文含「一笔画」与「奇度」                       |
| TC-HOOK       | 图算法 children 11→12、尾 +euler-path（两 spec） |

## L5 —— e2e

| 用例 ID      | 期望                                                             |
| ------------ | ---------------------------------------------------------------- |
| TC-E2E-EU-01 | h1 含「欧拉」；`.graph-view` 可见；拖末步 caption 含 O(E)；Shiki |

## 回归

GraphView 纯复用零改动（9 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅图算法 +1。

## 自测报告

- 执行：1910/1910 全绿、96.22%/95.84%；e2e euler-path + lca + scc 回归 3/3（首跑全过）。
- 新增 16 Case：EU-MOD 12 + VIEW-EU 3 + E2E-EU 1；改 TC-HOOK 2（图算法 11→12 + 尾 +euler-path）。
- 关键实测：栈法路径 [1,3,4,2,1,0,2,3] 过验证器且 = 暴力回溯搜路（起终=奇度点集，TC-01）；事件流 walk×4→back→walk×3→back×7、首 back 栈顶 2 有余边（TC-03）；check 徽标=度数 + checkPair 奇度对（TC-06）；第 4 walk 后 3 号徽标 '0'（TC-07）。
- 真机：back① 步「卡住！3 的边全用光…栈顶 2 还有余边」+ 4 深绿消边 + 4 虚线栈环 + 徽标 [2,2,2,0,0]；末步一笔画全路径字幕；菜单「欧拉路径」在位。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
