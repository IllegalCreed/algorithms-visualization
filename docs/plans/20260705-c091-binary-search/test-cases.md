# 测试用例：二分查找（C-20260705-091，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-091
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-BS-MOD-*`、`TC-VIEW-BS-*`、`TC-E2E-BS-01`；改 `TC-HOOK`（纯复用主柱轨，无 VIZ/PLAYER 新用例）

## L3 —— `bsearch.module`

固定 `[1,3,5,7,9,11,13,15,17,19]`；oracle `linearFind` 线性扫。

| 用例 ID      | 场景          | 期望                                                       |
| ------------ | ------------- | ---------------------------------------------------------- |
| TC-BS-MOD-01 | 命中对拍      | trace(17).index=8=linearFind；探测 (0,9,4)/(5,9,7)/(8,9,8) |
| TC-BS-MOD-02 | 未命中对拍    | trace(4)=−1=linearFind；末态 lo=2>hi=1（区间清空）         |
| TC-BS-MOD-03 | 步合法        | point∈{init,mid,cut,found,empty,done}；array 10 柱升序恒序 |
| TC-BS-MOD-04 | 步数结构      | 16 步 point 序列全等（含两次 init）                        |
| TC-BS-MOD-05 | init 步       | lo=0（id '0'）、hi=9（id '2'）；groupMembers=0..9          |
| TC-BS-MOD-06 | mid 步        | pivotIndex=mid、mid 指针（id '1'）依次 4,7,8 / 4,1,2       |
| TC-BS-MOD-07 | cut 收缩      | groupMembers 依次 [5..9],[8..9] / [0..3],[2..3],[]（清空） |
| TC-BS-MOD-08 | found 步      | sortedIndices=[8]；caption 含命中与下标 8                  |
| TC-BS-MOD-09 | empty 步      | caption 含 −1 与不存在/清空语义                            |
| TC-BS-MOD-10 | done caption  | 含 O(log n)                                                |
| TC-BS-MOD-11 | 四语言 + 行号 | 四语言、行号在内、覆盖 6 执行点                            |
| TC-BS-MOD-12 | 元信息        | title 含「二分查找」；initialInput()=BS_ARRAY（升序）      |

## L4 —— 视图 + TC-HOOK

| 用例 ID       | 期望                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| TC-VIEW-BS-01 | Article + AlgorithmPlayer                                                    |
| TC-VIEW-BS-02 | h1 含「二分查找」+ 主柱轨（.bars-view 或 List 存在）                         |
| TC-VIEW-BS-03 | 正文含「有序」与「O(log n)」                                                 |
| TC-HOOK       | 两 spec：`toHaveLength(9)`；data[8].title='查找'、children=['binary-search'] |

## L5 —— e2e

| 用例 ID      | 期望                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| TC-E2E-BS-01 | h1 含「二分查找」；主柱轨可见（本页有柱！）；拖末步 caption 含 O(log n)；Shiki |

## 回归

主柱轨/ArrowTrack/StepEmphasis 零改动（16 排序页零回归，抽 2 页 e2e 回归）；AlgorithmPlayer 零改动；TC-HOOK 大类 8→9。

## 自测报告

- 执行：1700/1700 全绿、95.95%/95.51%；e2e binary-search + bubble + quick-sort 回归 3/3。
- 新增 16 Case：BS-MOD 12 + VIEW-BS 3 + E2E-BS 1；改 TC-HOOK 2（两 spec 大类 8→9 + data[8] 查找断言）。
- 关键实测：17 → idx8 = 线性扫、三探 (0,9,4)/(5,9,7)/(8,9,8)（TC-01）；4 → −1、区间清空 lo=2>hi=1（TC-02）；16 步 point 序列全等（TC-04）；cut groupMembers 收缩至 []（TC-07）。
- 真机：cut 步 8 柱淡出（dimmed=8）+「一步扔掉 3 个候选」caption；found 步命中柱深绿 + 蓝/黄箭头；末步 O(log n)。
- 踩坑：e2e 首跑选择器 .list 不存在 → 修正为 .bars-view（主柱轨真实类名）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿。
