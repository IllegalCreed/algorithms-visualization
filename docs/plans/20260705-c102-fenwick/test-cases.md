# 测试用例：树状数组 Fenwick/BIT（C-20260705-102，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-102
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-BIT-MOD-*`、`TC-VIEW-BIT-*`、`TC-E2E-BIT-01`；改 `TC-HOOK`（纯复用主柱轨，无 VIZ/PLAYER 新用例）

## L3 —— `fenwick.module`

固定 `a=[3,2,5,1,4,2,3,1]`；oracle 暴力前缀和（含更新后重算）。

| 用例 ID       | 场景          | 期望                                                                |
| ------------- | ------------- | ------------------------------------------------------------------- |
| TC-BIT-MOD-01 | 建树对拍      | tree=[3,5,5,11,4,6,3,21]；每个 tree[i]=对应管辖区段暴力和           |
| TC-BIT-MOD-02 | query 对拍    | queryTrace(6)=17=暴力前缀；跳链 [6,4]                               |
| TC-BIT-MOD-03 | update 轨迹   | updateTrace(3,+2) 跳链 [3,4,8]，after 7/13/23                       |
| TC-BIT-MOD-04 | 复查对拍      | 更新后 queryTrace(6)=19=暴力（17+2）                                |
| TC-BIT-MOD-05 | 步合法        | point∈{init,query,update,done}；8 柱 = tree 快照                    |
| TC-BIT-MOD-06 | 步数结构      | 9 步 = init + query×2 + update×3 + query×2 + done                   |
| TC-BIT-MOD-07 | query 步      | pivotIndex 依次 5,3（柱下标）；groupMembers 累积；caption 含 lowbit |
| TC-BIT-MOD-08 | update 步     | 柱值真实变化（tree[4] 11→13）；caption 含通知/管辖语义              |
| TC-BIT-MOD-09 | 复查步        | 第二次 query 累计 19；caption 含验证语义                            |
| TC-BIT-MOD-10 | done caption  | 含 O(log n) 与前缀和/普通数组对比                                   |
| TC-BIT-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 4 执行点                                     |
| TC-BIT-MOD-12 | 元信息        | title 含「树状数组」；initialInput()=tree 初值                      |

## L4 —— 视图 + TC-HOOK

| 用例 ID        | 期望                                            |
| -------------- | ----------------------------------------------- |
| TC-VIEW-BIT-01 | Article + AlgorithmPlayer                       |
| TC-VIEW-BIT-02 | h1 含「树状数组」+ BarsView 主柱轨              |
| TC-VIEW-BIT-03 | 正文含「lowbit」与「管辖」                      |
| TC-HOOK        | 数据结构 children 15→16、尾 +fenwick（两 spec） |

## L5 —— e2e

| 用例 ID       | 期望                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| TC-E2E-BIT-01 | h1 含「树状数组」；`.bars-view` 可见；拖末步 caption 含 O(log n)；Shiki |

## 回归

主柱轨/ArrowTrack/StepEmphasis 零改动（排序/查找页零回归）；AlgorithmPlayer 零改动；TC-HOOK 仅数据结构 +1。

## 自测报告

- 执行：1865/1865 全绿、96.16%/95.84%；e2e fenwick + segment-tree + binary-search 回归 3/3（首跑全过）。
- 新增 16 Case：BIT-MOD 12 + VIEW-BIT 3 + E2E-BIT 1；改 TC-HOOK 2（数据结构 15→16 + children[15]=fenwick）。
- 关键实测：tree=[3,5,5,11,4,6,3,21] 逐段管辖对拍（TC-01）；query(6) 链 [6,4]=17（TC-02）；update 链 [3,4,8] after 7/13/23（TC-03）；复查 19（TC-04）；链累积与柱值变化（TC-07/08）。
- 真机：update 步「第 2 个管辖者 tree[4] += 2 → 13（柱子长高）」；复查步「累计 19——验证通过 ✓」。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
