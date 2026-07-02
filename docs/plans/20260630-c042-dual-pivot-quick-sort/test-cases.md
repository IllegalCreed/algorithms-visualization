# 测试用例：双轴快排 Dual-Pivot Quicksort（C-20260630-042）

> Status: verified
> Stable ID: C-20260630-042
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（dual-pivot-quick.module）/ L4（BarsView pivotIndices + 双轴快排页）/ L5（e2e）
> 命名空间：`TC-VIZ-BARSVIEW-23`（追加）、`TC-DUALPIVOT-MOD-*`、`TC-VIEW-DUALPIVOT-*`、`TC-E2E-DUALPIVOT-*`；**改** `TC-HOOK-02-4`

## L4 —— `BarsView` pivotIndices 扩展（`src/components/BarsView.spec.ts` 追加）

| 用例 ID            | 场景       | 期望                                                              |
| ------------------ | ---------- | ----------------------------------------------------------------- |
| TC-VIZ-BARSVIEW-23 | 双基准染紫 | `pivotIndices=[0,7]` → 第 1、8 根 Bar 均 pivot 态；其余柱不受影响 |

## L3 —— `dual-pivot-quick.module`（`src/algorithms/dual-pivot-quick.module.spec.ts`）

固定 `BASE = [3,5,9,1,6,2,4,7]`；oracle `dualPivotQuickSortTrace`。

| 用例 ID             | 场景                  | 期望                                                                                                    |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| TC-DUALPIVOT-MOD-01 | 末步有序              | 末步 `done`，值序列 = oracle = `[1,2,3,4,5,6,7,9]`                                                      |
| TC-DUALPIVOT-MOD-02 | 不改入参              | `BASE` 不变                                                                                             |
| TC-DUALPIVOT-MOD-03 | 位置键稳定            | 每步 `array` key 集合恒 = `{'0'..'7'}`                                                                  |
| TC-DUALPIVOT-MOD-04 | 步合法 + 带区间栈     | 每步 `point ∈ {pop,pivotSelect,compare,less,between,greater,pivotPlace,push,done}` 且带 `stack`         |
| TC-DUALPIVOT-MOD-05 | 三路分支守恒          | `#compare == #less + #between + #greater`                                                               |
| TC-DUALPIVOT-MOD-06 | 弹/选/归/压守恒       | `#pop == #pivotSelect == #pivotPlace == #push`                                                          |
| TC-DUALPIVOT-MOD-07 | 首趟双基准 + 双紫     | 首 `pivotSelect` vars p=3、q=7；扫描步（compare/less/between/greater）`emphasis.pivotIndices` = `[0,7]` |
| TC-DUALPIVOT-MOD-08 | 首趟归位快照          | 首 `pivotPlace` 步 `array` 值 = `[2,1,3,5,6,4,7,9]` 且 `sortedIndices` 含 2、6                          |
| TC-DUALPIVOT-MOD-09 | 三分支均出现          | `less`、`between`、`greater` 各至少一次                                                                 |
| TC-DUALPIVOT-MOD-10 | 双基准有序 + 换端演示 | 每个 `pivotSelect` 步 vars p ≤ q；且存在 caption 含「交换」的 pivotSelect（首尾反了先换端）             |
| TC-DUALPIVOT-MOD-11 | done 步               | done 步 `sortedIndices` 长度 = n、`pointers===[]`                                                       |
| TC-DUALPIVOT-MOD-12 | 三指针                | 存在 `compare` 步同时含 lt(`'3'`)/i(`'1'`)/gt(`'0'`)                                                    |
| TC-DUALPIVOT-MOD-13 | 四语言 + 行号         | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                           |
| TC-DUALPIVOT-MOD-14 | module 元信息         | `title==='双轴快排'`、`initialInput()` = BASE                                                           |

## L4 —— `DualPivotQuickSort` 视图（`src/views/Article/SortAlgorithm/DualPivotQuickSort.spec.ts`，全模板）

参照 ThreeWayQuickSort.spec：mock `useHighlighter`、`createPinia()`。

| 用例 ID              | 场景               | 期望                                                      |
| -------------------- | ------------------ | --------------------------------------------------------- |
| TC-VIEW-DUALPIVOT-01 | 正文 + 播放器      | 含 `Article`、h1 文本含「双轴快排」；含 `AlgorithmPlayer` |
| TC-VIEW-DUALPIVOT-02 | 区间栈 + 主轨 8 柱 | 渲染 `StackView`；主轨 8 个 `Bar`；`.counter` 含 `1 / `   |

## L5 —— 双轴快排页 e2e（`e2e/dual-pivot-quick-sort.e2e.ts`）

| 用例 ID             | 场景          | 操作                                                  | 期望                                                                                                          |
| ------------------- | ------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| TC-E2E-DUALPIVOT-01 | 全模板 + 互动 | 访问 `/docs/dual-pivot-quick-sort`；`.scrub` 拖到末步 | 正文 `.article h1` 含「双轴快排」；`.stack-view` 可见；主轨 8 `.bar-cell`；拖末步主轨值 = `[1,2,3,4,5,6,7,9]` |

## L5 —— 缺陷回归：代码面板横向滚动（`e2e/code-panel-hscroll.e2e.ts`）

> 2026-07-02 Owner 真机自检时反馈：「代码显示不全，宽度不够，还不能横向移动」。根因：CodePanel `.code-panel { overflow: hidden }` + `.code` 无横向滚动，`white-space: pre` 长行被裁（C-006 共享组件缺陷，双轴快排源码行最长故暴露）。按缺陷修复铁律先写失败用例（stash 还原旧 CSS 复现 RED 双向验证），再修复。

| 用例 ID             | 场景               | 操作                                        | 期望                                                                                                              |
| ------------------- | ------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| TC-E2E-CODEPANEL-01 | 长行可横滚、不截断 | 访问双轴快排页；压窄 `.code-panel` 至 320px | ① `.code` computed overflow-x = auto；② scrollWidth > clientWidth（长行未被吞）；③ scrollLeft 可置 >0（真的能滚） |

修复：`.code` 加 `overflow-x: auto`；`.code-line` 加 `width: max-content; min-width: 100%`（高亮行背景随滚动铺满整行、短行不缺口）。影响面：全部 12 排序页的代码面板（正向修复）；无 API/结构变化。

## 回归（改排序分类计数）

| 用例 ID      | 文件                                | 改动                                            |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 排序算法 children 11→**12**（新增「双轴快排」） |

## 其它回归

- 既有 11 排序 + 15 结构 + 图算法 + 播放器（各轨）现有 Case **零改动**全绿（除 TC-HOOK-02-4）。
- BarsView 扩展为短路追加：既有 pivotIndex Case（TC-VIZ-BARSVIEW-15/16）零改动通过。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告（2026-07-02 执行）

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：**全绿**。单测 **882 passed**（127 文件，较 C-041 的 865 +17：BarsView 1 + module 14 + 视图 2）；e2e **37 passed**（+2：TC-E2E-DUALPIVOT-01 + 缺陷回归 TC-E2E-CODEPANEL-01）；format/lint/type-check exit 0。
- 新增 **19 Case** 全绿：TC-VIZ-BARSVIEW-23（pivotIndices 双紫）+ TC-DUALPIVOT-MOD-01..14 + TC-VIEW-DUALPIVOT-01/02 + TC-E2E-DUALPIVOT-01 + **TC-E2E-CODEPANEL-01**（Owner 反馈缺陷，stash 双向验证 RED→GREEN）；改 TC-HOOK-02-4（排序 11→12）通过。
- 覆盖率（聚合）：statements **93.41%**、branches **90.64%**、functions **94.12%**、lines **94.32%**——均超门槛。
- 零回归：既有 11 排序 + 15 结构 + 图算法 + 播放器各轨（含 BarsView 既有 22 Case、pivotIndex 15/16 号）全部通过。
- 真机自检（dev /docs/dual-pivot-quick-sort，reload 后）：初始 h1「双轴快排 Dual-Pivot Quicksort」+ 8 柱 + 区间栈 + counter 1/27；step 2 pivotSelect **双紫基准 [0,7]**（.bar.pivot 落在 0/7 两根柱）+ 变量面板 p=3/q=7；末步 27/27 主轨 **[1,2,3,4,5,6,7,9] 升序**「完成，全部有序」。**缺陷复验**：代码面板 overflow-x auto、scrollWidth 499 > clientWidth 443、scrollLeft 可滚到底，行尾完整可见、高亮行背景铺满。
- 结论：**通过**，进入回写与提交。
