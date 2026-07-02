# 测试用例：自顶向下归并 Top-Down Merge Sort（C-20260702-043）

> Status: verified
> Stable ID: C-20260702-043
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（top-down-merge.module）/ L4（播放器双轨并存 + 页）/ L5（e2e）
> 命名空间：`TC-PLAYER-STACK-04`（追加）、`TC-TDMERGE-MOD-*`、`TC-VIEW-TDMERGE-*`、`TC-E2E-TDMERGE-*`；**改** `TC-HOOK-02-4`

## L4 —— `AlgorithmPlayer` 双辅助轨并存（`AlgorithmPlayer.spec.ts` 追加）

| 用例 ID            | 场景               | 期望                                                    |
| ------------------ | ------------------ | ------------------------------------------------------- |
| TC-PLAYER-STACK-04 | 同时带 aux + stack | AuxView 与 StackView **都**渲染（双辅助轨并存互不干扰） |

## L3 —— `top-down-merge.module`（`src/algorithms/top-down-merge.module.spec.ts`）

固定 `BASE = [6,3,8,1,9,2,7,4]`；oracle `topDownMergeSortTrace`。

| 用例 ID           | 场景                | 期望                                                                       |
| ----------------- | ------------------- | -------------------------------------------------------------------------- |
| TC-TDMERGE-MOD-01 | 末步有序            | 末步 `done`，值序列 = oracle = `[1,2,3,4,6,7,8,9]`                         |
| TC-TDMERGE-MOD-02 | 不改入参            | `BASE` 不变                                                                |
| TC-TDMERGE-MOD-03 | 位置键稳定          | 每步 `array` key 集合恒 = `{'0'..'7'}`                                     |
| TC-TDMERGE-MOD-04 | 步合法 + **双轨齐** | 每步 `point` 合法且**同时带 `aux` 与 `stack`**                             |
| TC-TDMERGE-MOD-05 | split 结构          | `#split = 7`；首个 `split` 栈 frames = `[{lo:0,hi:7}]`                     |
| TC-TDMERGE-MOD-06 | merge 块守恒        | `#mergeStart == #writeBack == 7`                                           |
| TC-TDMERGE-MOD-07 | 比较/写入守恒       | `#compare == #takeLeft + #takeRight`；take+drain 总数 = 24（每块写满段长） |
| TC-TDMERGE-MOD-08 | 首个合并快照        | 首个 `writeBack` 步（merge [0,1]）后 `array` 前两位 = `[3,6]`              |
| TC-TDMERGE-MOD-09 | 递归栈深            | 存在步 `stack.frames.length === 3`（链 [0,7]/[0,3]/[0,1]）；`done` 步栈空  |
| TC-TDMERGE-MOD-10 | 栈顶=活动区间       | 首个 `mergeStart` 步栈顶 frame = `{lo:0,hi:1}`                             |
| TC-TDMERGE-MOD-11 | done 步             | `emphasis.sortedFrom === 0`、`pointers === []`                             |
| TC-TDMERGE-MOD-12 | 双指针              | 存在 `compare` 步同时含 i(`'0'`)/j(`'1'`) 且带 `comparing`                 |
| TC-TDMERGE-MOD-13 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内              |
| TC-TDMERGE-MOD-14 | module 元信息       | `title==='自顶向下归并'`、`initialInput()` = BASE                          |

## L4 —— `TopDownMergeSort` 视图（全模板）

参照 DualPivotQuickSort.spec：mock `useHighlighter`、`createPinia()`。

| 用例 ID            | 场景                 | 期望                                                                     |
| ------------------ | -------------------- | ------------------------------------------------------------------------ |
| TC-VIEW-TDMERGE-01 | 正文 + 播放器        | 含 `Article`、h1 文本含「自顶向下归并」；含 `AlgorithmPlayer`            |
| TC-VIEW-TDMERGE-02 | 双辅助轨 + 主轨 8 柱 | 渲染 `AuxView` **与** `StackView`；主轨 8 个 `Bar`；`.counter` 含 `1 / ` |

## L5 —— e2e（`e2e/top-down-merge-sort.e2e.ts`）

| 用例 ID           | 场景          | 操作                                                | 期望                                                                                                                                     |
| ----------------- | ------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-TDMERGE-01 | 全模板 + 互动 | 访问 `/docs/top-down-merge-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「自顶向下归并」；`.aux-view` 与 `.stack-view` **同屏可见**；主轨 8 `.bar-cell`；拖末步主轨值 = `[1,2,3,4,6,7,8,9]` |

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                                |
| ------------ | ----------------------------------- | --------------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 12→**13**（新增「自顶向下归并」） |

## 其它回归

- 既有 12 排序 + 15 结构 + 图算法 + 播放器（各轨）现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- AuxView/StackView/AuxTrack/StackTrack 零改动纯复用；双轨并存为播放器既有 v-if 结构的自然能力。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-07-02 执行）

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **899 passed**（较 C-042 的 882 +17：STACK-04 1 + module 14 + 视图 2）；e2e **38 passed**（+1 TC-E2E-TDMERGE-01）；format/lint/type-check exit 0。
- 新增 **18 Case** 全绿：TC-PLAYER-STACK-04（aux+stack 双轨并存）+ TC-TDMERGE-MOD-01..14 + TC-VIEW-TDMERGE-01/02 + TC-E2E-TDMERGE-01；改 TC-HOOK-02-4（排序 12→13）通过。
- 覆盖率（聚合）：statements **93.51%**、branches **90.8%**、functions **94.13%**、lines **94.38%**——均超门槛。
- 零回归：既有 12 排序 + 15 结构 + 图算法 + 播放器各轨 Case 全部通过（AuxView/StackView 零改动纯复用）。
- 真机自检（dev /docs/top-down-merge-sort，reload 后）：初始 h1「自顶向下归并 Top-Down Merge Sort」+ 双辅助轨（.aux-view + .stack-view）+ 16 bar-cell（主轨 8 + temp 8）+ counter **1/63**（与手算一致）；step 3 递归栈三层 **a[0..1]（栈顶高亮）/a[0..3]/a[0..7]** + 变量面板 深度=3 + 代码 split 行高亮；末步 63/63 主轨 **[1,2,3,4,6,7,8,9] 升序**「完成，全部有序」（done 步栈空由 MOD-09 保证）。
- 结论：**通过**，进入回写与提交。
