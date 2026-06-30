# 测试用例：桶排序 Bucket Sort（C-20260630-040）

> Status: verified
> Stable ID: C-20260630-040
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（bucket-sort.module）/ L4（BucketView 轨 + 播放器接轨 + 桶排序页）/ L5（e2e）
> 命名空间：`TC-VIZ-BUCKETVIEW-*`、`TC-PLAYER-BUCKET-*`、`TC-BUCKET-MOD-*`、`TC-VIEW-BUCKET-*`、`TC-E2E-BUCKET-*`；**改** `TC-HOOK-02-4`

## L4 —— `BucketView` 新桶轨（`src/components/BucketView.spec.ts`）

mock track 渲染断言。

| 用例 ID              | 场景       | 期望                                                             |
| -------------------- | ---------- | ---------------------------------------------------------------- |
| TC-VIZ-BUCKETVIEW-01 | 渲染 N 桶  | 给定 5 桶 track → 5 个 `.bucket-col`；含值域标签 `.bucket-range` |
| TC-VIZ-BUCKETVIEW-02 | 桶内显值   | 桶 `[21,25,29]` → 该桶 3 个 `.bucket-cell`，文本含 21/25/29      |
| TC-VIZ-BUCKETVIEW-03 | 活跃桶高亮 | `activeBucket=2` → 第 3 个 `.bucket-col` 带 `.active`            |
| TC-VIZ-BUCKETVIEW-04 | 空桶       | 空桶 `[]` → 该 `.bucket-col` 内 0 个 `.bucket-cell`              |

## L4 —— `AlgorithmPlayer` 接桶轨（`src/components/player/AlgorithmPlayer.spec.ts` 追加）

| 用例 ID             | 场景               | 期望                                                     |
| ------------------- | ------------------ | -------------------------------------------------------- |
| TC-PLAYER-BUCKET-01 | 当前步带 bucket    | 渲染 `BucketView`                                        |
| TC-PLAYER-BUCKET-02 | 无 bucket 向后兼容 | module 无 bucket → 不渲染 `BucketView`（既有算法零回归） |

## L3 —— `bucket-sort.module`（`src/algorithms/bucket-sort.module.spec.ts`）

固定 `BASE = [29,25,3,49,9,37,21,43]`，5 桶宽 10；oracle `bucketSortTrace`。

| 用例 ID          | 场景                       | 期望                                                                             |
| ---------------- | -------------------------- | -------------------------------------------------------------------------------- |
| TC-BUCKET-MOD-01 | 末步有序                   | 末步 `done`，值序列 = `bucketSortTrace(BASE).result` = `[3,9,21,25,29,37,43,49]` |
| TC-BUCKET-MOD-02 | 不改入参                   | `BASE` 不变                                                                      |
| TC-BUCKET-MOD-03 | 位置键稳定                 | 每步 `array` key 集合恒 = `{'0'..'7'}`                                           |
| TC-BUCKET-MOD-04 | 步合法 + 带桶轨            | 每步 `point ∈ {distribute,sortBucket,concat,done}` 且带 `bucket`                 |
| TC-BUCKET-MOD-05 | 步数结构                   | distribute 8、sortBucket 5、concat 8、done 1（共 22）                            |
| TC-BUCKET-MOD-06 | 分配后桶状态               | 末个 distribute 步：桶2 `[29,25,21]`、桶1 `[]`、桶0 `[3,9]`                      |
| TC-BUCKET-MOD-07 | distribute 读游标 + 活跃桶 | 首个 distribute（29→桶2）`bucket.activeBucket===2`、`pointers` 含读游标 `'1'`    |
| TC-BUCKET-MOD-08 | 桶内排序                   | sortBucket 桶2 步 `bucket.buckets[2]` = `[21,25,29]`                             |
| TC-BUCKET-MOD-09 | 合并 + 写游标              | 末个 concat 步 `array` 值 = `[3,9,21,25,29,37,43,49]`；concat 步含写游标 `'3'`   |
| TC-BUCKET-MOD-10 | done 步                    | done 步 `emphasis.sortedUpTo===n`、`pointers===[]`                               |
| TC-BUCKET-MOD-11 | 桶值域                     | `bucket.ranges` = `[[0,9],[10,19],[20,29],[30,39],[40,49]]`                      |
| TC-BUCKET-MOD-12 | 四语言 + 行号              | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                    |
| TC-BUCKET-MOD-13 | module 元信息              | `title==='桶排序'`、`initialInput()` = BASE                                      |

## L4 —— `BucketSort` 视图（`src/views/Article/SortAlgorithm/BucketSort.spec.ts`，全模板）

参照 CountingSort.spec：mock `useHighlighter`、`createPinia()`。

| 用例 ID           | 场景             | 期望                                                     |
| ----------------- | ---------------- | -------------------------------------------------------- |
| TC-VIEW-BUCKET-01 | 正文 + 播放器    | 含 `Article`、h1 文本含「桶排序」；含 `AlgorithmPlayer`  |
| TC-VIEW-BUCKET-02 | 桶轨 + 主轨 8 柱 | 渲染 `BucketView`；主轨 8 个 `Bar`；`.counter` 含 `1 / ` |

## L5 —— 桶排序页 e2e（`e2e/bucket-sort.e2e.ts`）

| 用例 ID          | 场景          | 操作                                        | 期望                                                                                                                    |
| ---------------- | ------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-BUCKET-01 | 全模板 + 互动 | 访问 `/docs/bucket-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「桶排序」；桶轨 `.bucket-view` 可见；主轨 8 `.bar-cell`；拖末步主轨值 = `[3,9,21,25,29,37,43,49]` |

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                         |
| ------------ | ----------------------------------- | -------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 9→**10**（新增「桶排序」） |

## 其它回归

- 既有 9 排序 + 15 结构 + 图算法 + 播放器（含 count/aux/stack/tree 各轨 Case）：现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- BucketView 为新增轨，AlgorithmPlayer 加 `v-if="current.bucket"` 不影响既有轨（TC-PLAYER-\* 全绿）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-06-30 执行）

- 执行命令：`pnpm format` + `pnpm format:check`、`pnpm lint:check`、`pnpm type-check`、`pnpm test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **850 passed**（123 文件，较 C-039 的 829 +21；本变更新增 22 Case，原 1 个 TC-HOOK-02-4 由「排序 9」改为「排序 10」故净增 21）；e2e **34 passed**（+1 TC-E2E-BUCKET-01）；format/lint/type-check exit 0。
- 新增 22 Case 全绿：BucketView 4（TC-VIZ-BUCKETVIEW-01..04）+ AlgorithmPlayer 2（TC-PLAYER-BUCKET-01/02）+ bucket-sort.module 13（TC-BUCKET-MOD-01..13）+ BucketSort 视图 2（TC-VIEW-BUCKET-01/02）+ e2e 1（TC-E2E-BUCKET-01）；改 TC-HOOK-02-4（排序 9→10）通过。
- 覆盖率（聚合）：statements **94.05%**、branches **91.49%**、functions **94.37%**、lines **94.93%**——均超门槛（业务一般 ≥70% / 分支 ≥60%）。
- 零回归：既有 5 轨（Bars/Aux/Stack/Tree/Count）+ 9 排序 + 15 结构 + 图算法 + 播放器各轨 Case 全部通过（AlgorithmPlayer 新增 BUCKET-02 验证 bubble 不渲染 BucketView）。
- 真机自检（dev /docs/bucket-sort，reload 后）：初始态正文 h1「桶排序」+ 主轨 8 柱乱序 + 桶轨 5 桶 + 蓝读游标 + 代码第 3 行高亮 + 变量 n=8/阶段=分配（counter 1/22）；拖到末步 counter 22/22 主轨 **[3,9,21,25,29,37,43,49] 升序全绿**、caption「分配 → 桶内排序 → 合并完毕，全部有序」。
- 结论：**通过**，进入回写与提交。
