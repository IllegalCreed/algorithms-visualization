# 测试用例：双调排序（C-20260705-085，新建 NetworkView）

> Status: verified
> Stable ID: C-20260705-085
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-VIZ-NETVIEW-*`、`TC-PLAYER-NET-*`、`TC-BN-MOD-*`、`TC-VIEW-BN-*`、`TC-E2E-BN-01`；改 `TC-HOOK`

## L4 —— NetworkView 组件（新增）

| 用例 ID           | 场景       | 期望                                                                      |
| ----------------- | ---------- | ------------------------------------------------------------------------- |
| TC-VIZ-NETVIEW-01 | 网络渲染   | 8 wire → 8 `.net-wire` + 8 `.net-val`（含值）；24 比较器 → 24 `.net-comp` |
| TC-VIZ-NETVIEW-02 | 列态分色   | currentCol=2 → 列 2 比较器 `.net-active`、列 0/1 `.net-done`              |
| TC-VIZ-NETVIEW-03 | 无状态默认 | currentCol=null 且未 done → 无 active/done                                |

## L4 —— 播放器接线（追加）

| 用例 ID          | 期望                                    |
| ---------------- | --------------------------------------- |
| TC-PLAYER-NET-01 | step 含 network → 渲染 NetworkView      |
| TC-PLAYER-NET-02 | 排序 step 无 network → 不渲染（零回归） |

## L3 —— `bitonic.module`

固定 `[5,2,7,1,8,3,6,4]`；oracle `runNetwork` 末快照 = sorted。

| 用例 ID      | 场景             | 期望                                                                |
| ------------ | ---------------- | ------------------------------------------------------------------- |
| TC-BN-MOD-01 | 末步 done + 有序 | 末步 wires=[1..8]=sorted(输入)                                      |
| TC-BN-MOD-02 | 步合法           | point∈{init,column,done} 带 network、array=[]                       |
| TC-BN-MOD-03 | 网络结构         | 6 列 24 比较器；每列 4 个                                           |
| TC-BN-MOD-04 | 列 0 方向交替    | 列 0 = (0,1,↑)(2,3,↓)(4,5,↑)(6,7,↓)                                 |
| TC-BN-MOD-05 | 合并段全升       | 列 3-5 全 asc；列 3 距离 4、列 4 距离 2、列 5 距离 1                |
| TC-BN-MOD-06 | column 6 步      | column 步恰 6；currentCol 依次 0..5                                 |
| TC-BN-MOD-07 | 双调成形         | 列 2 后 wires=[1,2,5,7,8,6,4,3]（升到 8 再降）且 caption 提「双调」 |
| TC-BN-MOD-08 | 逐列快照对拍     | 各 column 步 wires = runNetwork 对应快照                            |
| TC-BN-MOD-09 | 200 随机对拍     | networkSortsAll(200)=true（网络对任意输入排序）                     |
| TC-BN-MOD-10 | done caption     | 含「6」列/深度与并行语义                                            |
| TC-BN-MOD-11 | 四语言 + 行号    | 四语言、行号在内、覆盖 3 执行点                                     |
| TC-BN-MOD-12 | 元信息           | title 含「双调」；initialInput()=BS_INPUT                           |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                       |
| ------------- | ------------------------------------------ |
| TC-VIEW-BN-01 | Article + AlgorithmPlayer                  |
| TC-VIEW-BN-02 | h1 含「双调」+ NetworkView + 无 .bars-view |
| TC-VIEW-BN-03 | 正文含「排序网络」+ NetworkView 同屏       |
| TC-HOOK       | 排序 children 15→16，末项 'bitonic-sort'   |

## L5 —— e2e

| 用例 ID      | 期望                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| TC-E2E-BN-01 | h1 含「双调」；8 `.net-wire` 24 `.net-comp`；拖末步 wire 值升序 + caption 含 6；Shiki |

## 回归

新 `Step.network?` additive；既有 15 排序等不设 → NetworkView 不渲染；TC-HOOK 仅排序 children +1。

## 自测报告

- 执行：1608/1608 全绿、95.83%/95.38%；e2e bitonic-sort + bubble-sort + segment-intersection 3/3（首跑全过）。
- 新增 21 Case：NETVIEW 3 + PLAYER-NET 2 + BN-MOD 12 + VIEW-BN 3 + E2E-BN 1；改 TC-HOOK 2（排序 15→16）。
- 关键实测：6 列 24 比较器每列 4（TC-03）；列 0 ↑↓↑↓、列 3-5 全 ↑ 距离 4/2/1（TC-04/05）；列 2 后完美双调（TC-07）；逐列快照对拍（TC-08）；200 随机对拍（TC-09）。
- 真机：三态分色网络、列 2 双调成形、末步 1..8 有序。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。21 Case 全绿。
