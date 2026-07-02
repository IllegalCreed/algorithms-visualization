# 测试用例：鸡尾酒排序 Cocktail Shaker Sort（C-20260702-045）

> Status: verified
> Stable ID: C-20260702-045
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（cocktail.module）/ L4（页）/ L5（e2e）
> 命名空间：`TC-COCKTAIL-MOD-*`、`TC-VIEW-COCKTAIL-*`、`TC-E2E-COCKTAIL-*`；**改** `TC-HOOK-02-4`

## L3 —— `cocktail.module`（`src/algorithms/cocktail.module.spec.ts`）

固定 `BASE = [4,2,6,3,8,5,7,1]`；oracle `cocktailSortTrace`。

| 用例 ID            | 场景             | 期望                                                                                          |
| ------------------ | ---------------- | --------------------------------------------------------------------------------------------- |
| TC-COCKTAIL-MOD-01 | 末步有序         | 末步 `done`，值序列 = oracle = `[1,2,3,4,5,6,7,8]`                                            |
| TC-COCKTAIL-MOD-02 | 不改入参         | `BASE` 不变                                                                                   |
| TC-COCKTAIL-MOD-03 | 位置键稳定       | 每步 `array` key 集合恒 = `{'0'..'7'}`                                                        |
| TC-COCKTAIL-MOD-04 | 步合法           | 每步 `point ∈ {forwardPass,fCompare,fSwap,fNoSwap,backwardPass,bCompare,bSwap,bNoSwap,done}`  |
| TC-COCKTAIL-MOD-05 | 趟结构           | `#forwardPass = 2`、`#backwardPass = 2`                                                       |
| TC-COCKTAIL-MOD-06 | 比较守恒（分向） | `#fCompare=12`、`#bCompare=10`；`#fCompare==#fSwap+#fNoSwap`、`#bCompare==#bSwap+#bNoSwap`    |
| TC-COCKTAIL-MOD-07 | 交换总数         | `#fSwap=7`、`#bSwap=6`（合计 13）                                                             |
| TC-COCKTAIL-MOD-08 | 乌龟一趟回头     | 首个 `backwardPass` 后的 12 步为 6×(bCompare+bSwap) 连发（无 bNoSwap）；该趟后值 1 位于下标 0 |
| TC-COCKTAIL-MOD-09 | 双端并存         | 存在步 `emphasis.sortedFrom === 7` **且** `emphasis.sortedUpTo === 1`（fwd2 趟内）            |
| TC-COCKTAIL-MOD-10 | 提前收工         | 末 4 个比较步全为 `bNoSwap` 分支（bwd2 零交换），其后**直接** `done`                          |
| TC-COCKTAIL-MOD-11 | compare 步       | f/b compare 步均带 `comparing` 与双指针（'0','1'）                                            |
| TC-COCKTAIL-MOD-12 | done 步          | `emphasis.sortedFrom === 0`、`pointers === []`                                                |
| TC-COCKTAIL-MOD-13 | 四语言 + 行号    | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                 |
| TC-COCKTAIL-MOD-14 | module 元信息    | `title==='鸡尾酒排序'`、`initialInput()` = BASE                                               |

## L4 —— `CocktailSort` 视图（全模板）

参照 BinaryInsertionSort.spec：mock `useHighlighter`、`createPinia()`。

| 用例 ID             | 场景          | 期望                                                        |
| ------------------- | ------------- | ----------------------------------------------------------- |
| TC-VIEW-COCKTAIL-01 | 正文 + 播放器 | 含 `Article`、h1 文本含「鸡尾酒排序」；含 `AlgorithmPlayer` |
| TC-VIEW-COCKTAIL-02 | 主轨 8 柱     | 主轨 8 个 `Bar`；`.counter` 含 `1 / `                       |

## L5 —— e2e（`e2e/cocktail-sort.e2e.ts`）

| 用例 ID            | 场景          | 操作                                          | 期望                                                                                        |
| ------------------ | ------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| TC-E2E-COCKTAIL-01 | 全模板 + 互动 | 访问 `/docs/cocktail-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「鸡尾酒排序」；主轨 8 `.bar-cell`；拖末步主轨值 = `[1,2,3,4,5,6,7,8]` |

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                              |
| ------------ | ----------------------------------- | ------------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 14→**15**（新增「鸡尾酒排序」） |

## 其它回归

- 既有 14 排序 + 15 结构 + 图算法 + 播放器（各轨）现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- 纯 BarsView 复用（sortedFrom/sortedUpTo 双端并用为既有能力组合），零轨/播放器改动。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-07-02 执行）

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **931 passed**（较 C-044 的 915 +16：module 14 + 视图 2）；e2e **40 passed**（+1 TC-E2E-COCKTAIL-01）；format/lint/type-check exit 0。
- 新增 **17 Case** 全绿：TC-COCKTAIL-MOD-01..14 + TC-VIEW-COCKTAIL-01/02 + TC-E2E-COCKTAIL-01；改 TC-HOOK-02-4（排序 14→15）通过。TDD 过程 RED 一次：TS lineMap backward 段数错 2 行（MOD-13 抓出）→ 修正 backwardPass:13/bCompare:15/bSwap:16/bNoSwap:14/done:23 → 绿。
- 覆盖率（聚合）：statements **93.54%**、branches **90.99%**、functions **94.07%**、lines **94.37%**——均超门槛。
- 零回归：既有 14 排序 + 15 结构 + 图算法 + 播放器各轨 Case 全部通过（纯 BarsView 复用、零轨/播放器改动）。
- 真机自检（dev /docs/cocktail-sort，reload 后）：初始 h1「鸡尾酒排序 Cocktail Shaker Sort」+ 8 柱 + counter **1/49**（与手算一致）；step 31（fwd2 趟内）**双端就位并存**——柱态 `[sorted, comparing, comparing, idle×4, sorted]`：左端 1 绿（sortedUpTo=1）+ 右端 8 绿（sortedFrom=7）夹住中间乱序区 + 黄色比较对 + 红/蓝双箭头 + 变量面板 left=1/right=6；末步 49/49 主轨 **[1,2,3,4,5,6,7,8] 升序**「完成，全部有序」。
- 结论：**通过**，进入回写与提交（**阶段二收官**）。
