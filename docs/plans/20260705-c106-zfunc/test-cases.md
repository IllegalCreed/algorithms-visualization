# 测试用例：Z 函数（C-20260705-106，复用 ManacherView additive 标签 · M9-4）

> Status: verified
> Stable ID: C-20260705-106
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-Z-MOD-*`、`TC-VIZ-MANACHERVIEW-05/06`（additive）、`TC-VIEW-Z-*`、`TC-E2E-Z-01`；改 `TC-HOOK`

## T0 —— ManacherView additive（L4）

| 用例 ID                | 场景                   | 期望                                                              |
| ---------------------- | ---------------------- | ----------------------------------------------------------------- |
| TC-VIZ-MANACHERVIEW-05 | labels/statusLabels 设 | labels=['S','z'] 渲染行标签 S/z；statusLabels.expand 覆盖状态文案 |
| TC-VIZ-MANACHERVIEW-06 | 不设回退               | 缺省渲染 S/p 与原三条文案（Manacher 页零回归）                    |

## L3 —— `zfunc.module`

固定 s=aabaaab；oracle `zBrute` 朴素逐位。

| 用例 ID     | 场景           | 期望                                                                               |
| ----------- | -------------- | ---------------------------------------------------------------------------------- |
| TC-Z-MOD-01 | 对拍           | zTrace().z=[7,1,0,2,3,1,0]=zBrute()                                                |
| TC-Z-MOD-02 | 事件流         | i=1..3 brute；i=4 mirror-capped ext=2 boxUpd；i=5 mirror-copy 抄 1 ext=0；i=6 抄 0 |
| TC-Z-MOD-03 | 步合法         | point∈{init,brute,mirror,extend,done} 带 manacher、array=[]                        |
| TC-Z-MOD-04 | 步数结构       | 9 步 = init+brute×3+mirror+extend+mirror×2+done                                    |
| TC-Z-MOD-05 | init 步        | p=[7,null×6]；labels=['S','z']；caption 含 LCP 语义                                |
| TC-Z-MOD-06 | brute 步       | i=3 步：center=3、mirror 空、z 填至 [7,1,0,2]、box=[3,4]（r−1）                    |
| TC-Z-MOD-07 | mirror 步      | i=4：center=4、mirror=1、caption 含「达界」或「不止」语义；p[4]=1（先抄）          |
| TC-Z-MOD-08 | extend 步      | i=4：p[4]=3、box=[4,6]、caption 含「+2」或扩展语义、status='expand'                |
| TC-Z-MOD-09 | mirror-copy 步 | i=5：p[5]=1、caption 含「零比较」或「直接抄」；best=[5,5]                          |
| TC-Z-MOD-10 | done           | caption 含 O(n) 与 P#T（或 拼接）应用                                              |
| TC-Z-MOD-11 | 四语言 + 行号  | 四语言、行号在内、覆盖 5 执行点                                                    |
| TC-Z-MOD-12 | 元信息         | title 含「Z 函数」；initialInput()=[]                                              |

## L4 —— 视图 + TC-HOOK

| 用例 ID      | 期望                                           |
| ------------ | ---------------------------------------------- |
| TC-VIEW-Z-01 | Article + AlgorithmPlayer                      |
| TC-VIEW-Z-02 | h1 含「Z 函数」+ ManacherView + 无 .bars-view  |
| TC-VIEW-Z-03 | 正文含「LCP」（或 公共前缀）与「Z-box」        |
| TC-HOOK      | 字符串 children 7→8、尾 +z-function（两 spec） |

## L5 —— e2e

| 用例 ID     | 期望                                                            |
| ----------- | --------------------------------------------------------------- |
| TC-E2E-Z-01 | h1 含「Z 函数」；`.mn-view` 可见；拖末步 caption 含 O(n)；Shiki |

## 回归

Manacher 页零回归（不设 labels/statusLabels 全回退，TC-VIZ-MANACHERVIEW-01..04 原样通过）；AlgorithmPlayer 零改动；TC-HOOK 仅字符串 +1。

## 自测报告

- 执行：1927/1927 全绿、96.25%/95.90%；e2e z-function + manacher + kmp 回归 3/3（首跑全过）。
- 新增 18 Case：Z-MOD 12 + VIZ-MANACHERVIEW 2（additive）+ VIEW-Z 3 + E2E-Z 1；改 TC-HOOK 2（字符串 7→8 + 尾 +z-function）。
- 关键实测：z=[7,1,0,2,3,1,0]=朴素逐位（TC-01）；事件流 brute×3 / i=4 mirror-capped 抄 1 扩 2 boxUpd / i=5,6 mirror-copy（TC-02）；mirror 步先抄 1 + 旧 box 带 + 达界语义、extend 步扩到 3 + box 刷新 [4,6]（TC-07/08）。
- 真机：mirror 步标签 S/z + 🪞 镜像复用 + z 行 [7,1,0,2,1]；extend 步「→ 右扩比较」覆盖文案 + 双环 + 绿匹配段 + z[4]=3；Manacher 页 e2e 原样通过（additive 零回归实证）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。18 Case 全绿。
