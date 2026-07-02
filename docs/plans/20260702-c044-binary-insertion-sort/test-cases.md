# 测试用例：二分插入排序 Binary Insertion Sort（C-20260702-044）

> Status: verified
> Stable ID: C-20260702-044
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（binary-insertion.module）/ L4（页）/ L5（e2e）
> 命名空间：`TC-BININS-MOD-*`、`TC-VIEW-BININS-*`、`TC-E2E-BININS-*`；**改** `TC-HOOK-02-4`

## L3 —— `binary-insertion.module`（`src/algorithms/binary-insertion.module.spec.ts`）

固定 `BASE = [5,2,9,4,7,1,8,3]`；oracle `binaryInsertionSortTrace`。

| 用例 ID          | 场景          | 期望                                                                      |
| ---------------- | ------------- | ------------------------------------------------------------------------- |
| TC-BININS-MOD-01 | 末步有序      | 末步 `done`，值序列 = oracle = `[1,2,3,4,5,7,8,9]`                        |
| TC-BININS-MOD-02 | 不改入参      | `BASE` 不变                                                               |
| TC-BININS-MOD-03 | 位置键稳定    | 每步 `array` key 集合恒 = `{'0'..'7'}`                                    |
| TC-BININS-MOD-04 | 步合法        | 每步 `point ∈ {outerLoop,probe,goLeft,goRight,found,shift,insert,done}`   |
| TC-BININS-MOD-05 | 轮结构守恒    | `#outerLoop == #found == #insert == 7`                                    |
| TC-BININS-MOD-06 | 折半守恒      | `#probe == #goLeft + #goRight`（每次探测恰收缩一次）且 #probe = 15        |
| TC-BININS-MOD-07 | 搬移总数      | `#shift = 15`                                                             |
| TC-BININS-MOD-08 | 零移动轮      | key=9 轮（i=2）：`found` 步 vars pos=2，其后**紧跟** `insert`（无 shift） |
| TC-BININS-MOD-09 | 全移动轮      | key=1 轮（i=5）：`found` 步 vars pos=0，其后 5 个 `shift`                 |
| TC-BININS-MOD-10 | 折半三指针    | `probe` 步含 lo(`'3'`)/mid(`'1'`)/hi(`'0'`) 三指针且带 `comparing`        |
| TC-BININS-MOD-11 | key 玫红      | `outerLoop` 步 `emphasis.keyIndex === i`（vars i 对应）                   |
| TC-BININS-MOD-12 | done 步       | `emphasis.sortedUpTo === n`、`pointers === []`                            |
| TC-BININS-MOD-13 | 四语言 + 行号 | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内             |
| TC-BININS-MOD-14 | module 元信息 | `title==='二分插入排序'`、`initialInput()` = BASE                         |

## L4 —— `BinaryInsertionSort` 视图（全模板）

参照 TopDownMergeSort.spec：mock `useHighlighter`、`createPinia()`。

| 用例 ID           | 场景          | 期望                                                          |
| ----------------- | ------------- | ------------------------------------------------------------- |
| TC-VIEW-BININS-01 | 正文 + 播放器 | 含 `Article`、h1 文本含「二分插入排序」；含 `AlgorithmPlayer` |
| TC-VIEW-BININS-02 | 主轨 8 柱     | 主轨 8 个 `Bar`；`.counter` 含 `1 / `                         |

## L5 —— e2e（`e2e/binary-insertion-sort.e2e.ts`）

| 用例 ID          | 场景          | 操作                                                  | 期望                                                                                          |
| ---------------- | ------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| TC-E2E-BININS-01 | 全模板 + 互动 | 访问 `/docs/binary-insertion-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「二分插入排序」；主轨 8 `.bar-cell`；拖末步主轨值 = `[1,2,3,4,5,7,8,9]` |

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                                |
| ------------ | ----------------------------------- | --------------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 13→**14**（新增「二分插入排序」） |

## 其它回归

- 既有 13 排序 + 15 结构 + 图算法 + 播放器（各轨）现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- 纯 BarsView 复用，零轨/播放器改动。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-07-02 执行）

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **915 passed**（较 C-043 的 899 +16：module 14 + 视图 2）；e2e **39 passed**（+1 TC-E2E-BININS-01）；format/lint/type-check exit 0。
- 新增 **17 Case** 全绿：TC-BININS-MOD-01..14 + TC-VIEW-BININS-01/02 + TC-E2E-BININS-01；改 TC-HOOK-02-4（排序 13→14）通过。
- 覆盖率（聚合）：statements **93.53%**、branches **90.94%**、functions **94.1%**、lines **94.37%**——均超门槛。
- 零回归：既有 13 排序 + 15 结构 + 图算法 + 播放器各轨 Case 全部通过（纯 BarsView 复用、零轨/播放器改动）。
- 真机自检（dev /docs/binary-insertion-sort，reload 后）：初始 h1「二分插入排序 Binary Insertion Sort」+ 8 柱 + counter **1/67**（与手算一致）；step 15 probe 步——绿前缀 [2,5,9] + 玫红 key(4) + mid 蓝/hi 红箭头 + caption「探测 mid=0：key=4 ≥ a[0]=2」（comparing 黄在已排序前缀内被 sorted 态覆盖属既有优先级，箭头+caption 足够表意，数据层由 MOD-10 断言）；末步 67/67 主轨 **[1,2,3,4,5,7,8,9] 升序**「完成，全部有序」。
- 结论：**通过**，进入回写与提交。
