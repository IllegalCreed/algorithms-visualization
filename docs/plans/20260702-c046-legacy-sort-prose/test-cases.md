# 测试用例：老排序页全模板化（C-20260702-046，M8③）

> Status: verified
> Stable ID: C-20260702-046
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L4（9 页视图 +1 Case）/ L5（9 e2e 扩断言）
> 命名空间：**新增** `TC-VIEW-{BUBBLE,SELECTION,INSERTION,SHELL,MERGE,QUICK,HEAP,COUNT,RADIX}-03`；**扩断言** 各页 `TC-E2E-*`

## L4 —— 9 页视图各 +1 Case（Article 正文）

每页 mock `useHighlighter` + `createPinia()`；断言 `Article` 存在、h1 含中文名。既有 -01/-02 保留不动。

| 用例 ID              | 文件                                                    | 期望                            |
| -------------------- | ------------------------------------------------------- | ------------------------------- |
| TC-VIEW-BUBBLE-03    | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    | 含 `Article`、h1 含「冒泡排序」 |
| TC-VIEW-SELECTION-03 | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` | 含 `Article`、h1 含「选择排序」 |
| TC-VIEW-INSERTION-03 | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` | 含 `Article`、h1 含「插入排序」 |
| TC-VIEW-SHELL-03     | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     | 含 `Article`、h1 含「希尔排序」 |
| TC-VIEW-MERGE-03     | `src/views/Article/SortAlgorithm/MergeSort.spec.ts`     | 含 `Article`、h1 含「归并排序」 |
| TC-VIEW-QUICK-03     | `src/views/Article/SortAlgorithm/QuickSort.spec.ts`     | 含 `Article`、h1 含「快速排序」 |
| TC-VIEW-HEAP-03      | `src/views/Article/SortAlgorithm/HeapSort.spec.ts`      | 含 `Article`、h1 含「堆排序」   |
| TC-VIEW-COUNT-03     | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`  | 含 `Article`、h1 含「计数排序」 |
| TC-VIEW-RADIX-03     | `src/views/Article/SortAlgorithm/RadixSort.spec.ts`     | 含 `Article`、h1 含「基数排序」 |

## L5 —— 9 e2e 扩断言（真机正文渲染）

各页 e2e 开头加 `await expect(page.locator('.article h1')).toContainText('<中文名>')`；既有断言（`.bar-cell` 数 / 轨道 / `.scrub` 拖末步升序）保持不动。

| e2e Case（扩断言）  | 文件                        | 新增断言                     |
| ------------------- | --------------------------- | ---------------------------- |
| TC-E2E-BUBBLE-\*    | `e2e/bubble-sort.e2e.ts`    | `.article h1` 含「冒泡排序」 |
| TC-E2E-SELECTION-01 | `e2e/selection-sort.e2e.ts` | `.article h1` 含「选择排序」 |
| TC-E2E-INSERTION-01 | `e2e/insertion-sort.e2e.ts` | `.article h1` 含「插入排序」 |
| TC-E2E-SHELL-01     | `e2e/shell-sort.e2e.ts`     | `.article h1` 含「希尔排序」 |
| TC-E2E-MERGE-01     | `e2e/merge-sort.e2e.ts`     | `.article h1` 含「归并排序」 |
| TC-E2E-QUICK-01     | `e2e/quick-sort.e2e.ts`     | `.article h1` 含「快速排序」 |
| TC-E2E-HEAP-01      | `e2e/heap-sort.e2e.ts`      | `.article h1` 含「堆排序」   |
| TC-E2E-COUNT\*      | `e2e/counting-sort.e2e.ts`  | `.article h1` 含「计数排序」 |
| TC-E2E-RADIX-01     | `e2e/radix-sort.e2e.ts`     | `.article h1` 含「基数排序」 |

## 回归

- 9 页既有视图 Case **TC-VIEW-\*-01/02** 零改动全绿（补正文后 AlgorithmPlayer 仍在、Bar 数/轨道/counter 不变）。
- 9 e2e 既有断言（柱数/拖末步升序/轨道可见）零改动全绿。
- 6 个新排序 + 15 结构 + 图算法 + 播放器各轨 + TC-HOOK 全部零改动全绿（本变更不碰算法/框架/路由/菜单）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-07-02 执行）

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **940 passed**（较 C-045 的 931 +9：9 个 TC-VIEW-\*-03）；e2e **40 passed**（9 e2e 各扩 `.article h1` 断言，无新增 e2e Case）；format/lint/type-check exit 0。
- 新增 **9 个 L4 Case** 全绿：TC-VIEW-{BUBBLE,SELECTION,INSERTION,SHELL,MERGE,QUICK,HEAP,COUNT,RADIX}-03；9 页既有 -01/-02 与 9 e2e 既有断言零改动全绿。
- 覆盖率（聚合）：statements **93.57%**、branches **91.86%**、functions **94.18%**、lines **94.4%**——均超门槛（分支较 C-045 的 90.99% 反升，补正文页无新分支、既有分支被更多渲染路径覆盖）。
- 零回归：6 个新排序 + 15 结构 + 图算法 + 播放器各轨 + TC-HOOK 全部零改动全绿（本变更不碰算法/框架/路由/菜单/计数）。
- 真机抽查（dev，reload 后）5 页代表各轨型：**堆排序**（h1「堆排序 Heap Sort」+ Article「什么是/它怎么做」两节 + `code`/`strong` 渲染 + 树轨深紫下沉节点同屏 + 末步升序）、**快速排序**（h1 + 区间栈轨 + 末步升序）、**归并排序**（h1 + Aux temp 轨 + 末步升序）、**计数排序**（h1 + Count 桶轨 + 末步升序）、**冒泡排序**（无轨纯 BarsView + 末步升序）——正文 + 可视化 + 代码播放器三件套同屏，末步均升序。
- 结论：**通过**。全站 15 排序页全部全模板，M8③ 达成。
