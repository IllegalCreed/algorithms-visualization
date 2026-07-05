# 测试用例：LCA 倍增（C-20260705-104，纯复用 MatrixView · M9-2）

> Status: verified
> Stable ID: C-20260705-104
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-LCA-MOD-*`、`TC-VIEW-LCA-*`、`TC-E2E-LCA-01`；改 `TC-HOOK`（纯复用 MatrixView，无 VIZ/PLAYER 新用例）

## L3 —— `lca.module`

固定 8 节点树（父数组 [-1,0,0,1,1,2,3,6]）；oracle `bruteLca` 爬父链。

| 用例 ID       | 场景          | 期望                                                                    |
| ------------- | ------------- | ----------------------------------------------------------------------- |
| TC-LCA-MOD-01 | 对拍          | LCA(7,4)=1、LCA(6,5)=0，均 = bruteLca；全对随机抽 5 对再对拍            |
| TC-LCA-MOD-02 | 倍增表        | depth/up⁰/up¹/up² 与设计全等（up²[7]=0 等）                             |
| TC-LCA-MOD-03 | 查询轨迹      | (7,4)：align up¹ 7→3 + 三判全 same；(6,5)：align up⁰ 6→3 + k=0 双跳     |
| TC-LCA-MOD-04 | 步合法        | point∈{init,build,align,jump,answer,done} 带 matrix、array=[]           |
| TC-LCA-MOD-05 | 步数结构      | 11 步 = init + build×3 + (align+jump+answer)×2 + done                   |
| TC-LCA-MOD-06 | init 表       | 8×4 全 null；rowLabels 0..7；colLabels [depth,up⁰,up¹,up²]              |
| TC-LCA-MOD-07 | build 步      | 三步逐列填齐；up¹ 步 sources 示例递推格（7 行引 up⁰[7]/up⁰[6]）         |
| TC-LCA-MOD-08 | align 步      | sources=[[7,2]]（up¹ 格）/[[6,1]]（up⁰ 格）；caption 含深度差二进制     |
| TC-LCA-MOD-09 | jump 步       | ①caption 含「不跳」与越过语义；②sources=[[3,1],[5,1]] 且 caption 含双跳 |
| TC-LCA-MOD-10 | answer/done   | answer sources=[[u,1]] 值 1/0；done 含 O(log n) 与树上距离公式          |
| TC-LCA-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 6 执行点                                         |
| TC-LCA-MOD-12 | 元信息        | title 含「LCA」或「公共祖先」；initialInput()=[]                        |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                      |
| -------------- | ----------------------------------------- |
| TC-VIEW-LCA-01 | Article + AlgorithmPlayer                 |
| TC-VIEW-LCA-02 | h1 含「LCA」+ MatrixView + 无 .bars-view  |
| TC-VIEW-LCA-03 | 正文含「倍增」与「祖先」                  |
| TC-HOOK        | 图算法 children 10→11、尾 +lca（两 spec） |

## L5 —— e2e

| 用例 ID       | 期望                                                                 |
| ------------- | -------------------------------------------------------------------- |
| TC-E2E-LCA-01 | h1 含「LCA」；`.matrix-view` 可见；拖末步 caption 含 O(log n)；Shiki |

## 回归

MatrixView 纯复用零改动（15 既有消费者零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅图算法 +1。

## 自测报告

- 执行：1895/1895 全绿、96.21%/95.91%；e2e lca + hungarian + reroot-dp 回归 3/3（首跑全过）。
- 新增 16 Case：LCA-MOD 12 + VIEW-LCA 3 + E2E-LCA 1；改 TC-HOOK 2（图算法 10→11 + 尾 +lca）。
- 关键实测：64 全对 = 暴力爬父链（TC-01，超设计的抽 5 对）；倍增表三层全等（TC-02）；(7,4) 对齐后全 same、(6,5) k=0 双跳 (3,5)→(1,2)（TC-03）；build up¹ 步 sources=[[7,1],[6,1]]、align sources=跳表格、jump② sources=[[3,1],[5,1]]（TC-07/08/09）。
- 真机：build2「up¹[7] = up⁰[up⁰[7]] = up⁰[6] = 3」黄格 6/3 + updated 格；jump②「k=0：up⁰[3]=1 ≠ up⁰[5]=2 → 双跳」黄格 1/2；根 0 与浅层 up 格留空正确；菜单「LCA 倍增」条目在位。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
