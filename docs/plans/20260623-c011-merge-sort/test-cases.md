# 测试用例：归并排序动画

> Status: draft
> Stable ID: C-20260623-011
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-23
> Last reviewed: 2026-06-23
> Progress: 0%
> Blocked by: none
> Next action: 随 Task 落地登记进全局测试索引并置 active
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006、C-20260620-007、C-20260621-008、C-20260622-010
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**一批 L3/L4/L5 用例（下表 status=planned）。每个 Task 落地后把对应 Case 登记进 `docs/test-cases/{index,by-layer,by-module}.md` 并置 active，三处保持一致。

测试分层裁剪为 L3（前端单元）/ L4（前端组件）/ L5（端到端）。

**向后兼容回归（非新增、但必须验证）**：`types.ts` 加 `MergeExecPoint`/`AuxTrack`/`Step.aux?`、`Bar` 加 `empty` 态、`AlgorithmPlayer` 加 `v-if` 渲染 `AuxView` 后，冒泡 / 选择 / 插入 / 希尔四侧全量 Case（`TC-BUBBLE-*`、`TC-SELECTION-*`、`TC-INSERTION-*`、`TC-INS-ALGO-*`、`TC-SHELL-*`、`TC-VIZ-BAR-*`、`TC-VIZ-BARSVIEW-*`、`TC-CODEPANEL-*`、各 `TC-VIEW-*`、各 `TC-E2E-*`）必须保持绿，**且四者页面不渲染 `AuxView`**——这是「纯加法 + 一处外壳条件渲染、零回归」的硬验收，列入 Task 1 / Task 3 关卡。

## 汇总统计（计划）

| 层级 | 测试文件 | 新增 Case 数 | 运行命令         |
| ---- | -------- | ------------ | ---------------- |
| L3   | 2        | 26           | `pnpm test:unit` |
| L4   | 4        | 10           | `pnpm test:unit` |
| L5   | 1        | 1            | `pnpm test:e2e`  |
| 合计 | 7        | 37           | —                |

> L4 的 4 个文件中，`Bar.spec.ts`、`AlgorithmPlayer.spec.ts` 是**向现有文件追加** Case；`AuxView.spec.ts`、`MergeSort.spec.ts` 为新建。

## 汇总统计（实测，落地后回填）

| 层级 | 测试文件 | 新增 Case 数 | 通过数 | 运行命令         |
| ---- | -------- | ------------ | ------ | ---------------- |
| L3   | —        | —            | —      | `pnpm test:unit` |
| L4   | —        | —            | —      | `pnpm test:unit` |
| L5   | —        | —            | —      | `pnpm test:e2e`  |
| 合计 | —        | —            | —      | —                |

## 全量 Case 清单（计划）

### L3 — 归并排序 oracle（`src/algorithms/merge-sort.spec.ts`，新建）

| Case ID          | 标题                                            |
| ---------------- | ----------------------------------------------- |
| TC-MERGE-ALGO-01 | 空数组与单元素不产生 pass                       |
| TC-MERGE-ALGO-02 | 基准数据最终升序                                |
| TC-MERGE-ALGO-03 | 含重复元素结果正确                              |
| TC-MERGE-ALGO-04 | 不修改入参                                      |
| TC-MERGE-ALGO-05 | width 序列为 1,2,4,…（<n）                      |
| TC-MERGE-ALGO-06 | 已升序输入幂等（最终仍升序）                    |
| TC-MERGE-ALGO-07 | 逆序输入最终升序                                |
| TC-MERGE-ALGO-08 | 每趟 width 后每个 2\*width 块内部有序（不变量） |
| TC-MERGE-ALGO-09 | 随机用例与 Array.sort 交叉校验                  |

### L3 — 归并排序模块（`src/algorithms/merge-sort.module.spec.ts`，新建）

| Case ID         | 标题                                                 |
| --------------- | ---------------------------------------------------- |
| TC-MERGE-MOD-01 | 空/单元素也产出至少一个 done 步                      |
| TC-MERGE-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验，升序）     |
| TC-MERGE-MOD-03 | 每步主轨 array 的 id 集合恒等于初始（FLIP 前提）     |
| TC-MERGE-MOD-04 | 不修改入参                                           |
| TC-MERGE-MOD-05 | 每步 point 合法；compare 步必带 comparing            |
| TC-MERGE-MOD-06 | widthChange 步的 width 依次为 1,2,4,…                |
| TC-MERGE-MOD-07 | 各 width 趟边界数组与 oracle 快照一致（核心不变量）  |
| TC-MERGE-MOD-08 | 每个 mergeStart 的 groupMembers/activeRange=[lo,hi)  |
| TC-MERGE-MOD-09 | 一对合并内 aux.filled 单调增长（temp 只填不删）      |
| TC-MERGE-MOD-10 | writeBack 后主轨 [lo,hi) 段升序                      |
| TC-MERGE-MOD-11 | done 步标 sortedFrom=0、aux 无 filled                |
| TC-MERGE-MOD-12 | take 步 temp 写入位的值 = 所取元素值                 |
| TC-MERGE-MOD-13 | 每步主轨指针 clamp 在 [0,n-1]、aux.pointer 在 [0,n]  |
| TC-MERGE-MOD-14 | 每步 aux.array 长度 = 主轨长度                       |
| TC-MERGE-MOD-15 | 四门语言齐备                                         |
| TC-MERGE-MOD-16 | 每门语言每个 MergeExecPoint 行号落在源码物理行范围内 |
| TC-MERGE-MOD-17 | 实际出现的 point 都能在每门语言映射到行              |

### L4 — 可视化扩展（`src/components/`）

| Case ID           | 标题                                            | 文件                              |
| ----------------- | ----------------------------------------------- | --------------------------------- |
| TC-VIZ-BAR-07     | state='empty' 时柱体加 empty class 且不显示数值 | `Bar.spec.ts`（追加）             |
| TC-VIZ-AUXVIEW-01 | 渲染与 aux.array 等长的槽                       | `AuxView.spec.ts`（新建）         |
| TC-VIZ-AUXVIEW-02 | filled 的槽为 sorted、其余为 empty              | `AuxView.spec.ts`                 |
| TC-VIZ-AUXVIEW-03 | pointer 定位 k 箭头到对应槽                     | `AuxView.spec.ts`                 |
| TC-VIZ-AUXVIEW-04 | 无 pointer 时不渲染箭头                         | `AuxView.spec.ts`                 |
| TC-VIZ-AUXVIEW-05 | filled 槽高度用主轨 min/max 同尺度              | `AuxView.spec.ts`                 |
| TC-PLAYER-AUX-01  | module 无 aux 时不渲染 AuxView（向后兼容）      | `AlgorithmPlayer.spec.ts`（追加） |
| TC-PLAYER-AUX-02  | 当前步带 aux 时渲染 AuxView                     | `AlgorithmPlayer.spec.ts`         |

### L4 — 归并视图（`src/views/Article/SortAlgorithm/MergeSort.spec.ts`，新建）

| Case ID          | 标题                                       |
| ---------------- | ------------------------------------------ |
| TC-VIEW-MERGE-01 | 挂载渲染 AlgorithmPlayer                   |
| TC-VIEW-MERGE-02 | 初始渲染主轨 10 柱 + 辅助轨且默认停第 0 步 |

### L5 — 端到端（`e2e/merge-sort.e2e.ts`，新建）

| Case ID         | 标题                                                       |
| --------------- | ---------------------------------------------------------- |
| TC-E2E-MERGE-01 | 归并播放器：默认暂停 / 合并聚焦+temp填充 / 跳末升序 / 重置 |

## 不变量覆盖映射（归并特有，便于审阅）

| 不变量 / 风险                           | 兜底 Case                          |
| --------------------------------------- | ---------------------------------- |
| 最终结果正确（升序）                    | TC-MERGE-ALGO-02、TC-MERGE-MOD-02  |
| width 序列 = 1,2,4,…                    | TC-MERGE-ALGO-05、TC-MERGE-MOD-06  |
| 各趟 width 块内有序（自底向上核心）     | TC-MERGE-ALGO-08、TC-MERGE-MOD-07  |
| writeBack 后段升序（拷回正确）          | TC-MERGE-MOD-10                    |
| 合并段成员/范围标注正确                 | TC-MERGE-MOD-08                    |
| temp 填充单调（只填不删）               | TC-MERGE-MOD-09                    |
| temp 写入值正确（取较小者）             | TC-MERGE-MOD-12                    |
| FLIP 前提（主轨 id 集合恒定）           | TC-MERGE-MOD-03                    |
| 双轨对齐（aux 长度=主轨）               | TC-MERGE-MOD-14、TC-VIEW-MERGE-02  |
| empty 空槽态                            | TC-VIZ-BAR-07、TC-VIZ-AUXVIEW-02   |
| k 写入指针定位                          | TC-VIZ-AUXVIEW-03                  |
| 两轨同尺度 percent                      | TC-VIZ-AUXVIEW-05                  |
| 外壳条件渲染（最大外壳风险）            | TC-PLAYER-AUX-01、TC-PLAYER-AUX-02 |
| 行映射不漂移                            | TC-MERGE-MOD-16、TC-MERGE-MOD-17   |
| 指针 clamp（不越界）                    | TC-MERGE-MOD-13                    |
| 向后兼容（前四算法零回归 + 不渲染 aux） | Task 1 / Task 3 全量回归关卡       |
| 端到端真机（双轨/聚焦/升序）            | TC-E2E-MERGE-01                    |

## 全量 Case 列表（落地后）

落地后登记进 `docs/test-cases/index.md`（主索引）、`by-layer.md`（分层）、`by-module.md`（模块；新增 Case 归入 `algorithms` / `viz-engine` / `article-sort` 现有组）。
