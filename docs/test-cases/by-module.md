# 测试用例模块视图

> Status: active
> Last reviewed: 2026-06-26
> Owner: IllegalCreed

同一 Case ID 的事实字段（owner plan、层级、自动化路径、状态、最后验证）见 `index.md`。
本文件仅提供模块视角，便于按功能域评审覆盖度。

---

## algorithms（算法纯逻辑）

| Case ID             | 标题                                                      | 层级 | 自动化路径                                     |
| ------------------- | --------------------------------------------------------- | ---- | ---------------------------------------------- |
| TC-ALGO-01          | 空数组与单元素不产生步骤                                  | L3   | `src/algorithms/bubble-sort.spec.ts`           |
| TC-ALGO-02          | 最终数组升序排列                                          | L3   | `src/algorithms/bubble-sort.spec.ts`           |
| TC-ALGO-03          | 每步 compare 是相邻合法下标                               | L3   | `src/algorithms/bubble-sort.spec.ts`           |
| TC-ALGO-04          | 已排序数组无任何 swap                                     | L3   | `src/algorithms/bubble-sort.spec.ts`           |
| TC-ALGO-05          | 含重复元素结果正确且稳定地不越界                          | L3   | `src/algorithms/bubble-sort.spec.ts`           |
| TC-ALGO-06          | 不修改入参                                                | L3   | `src/algorithms/bubble-sort.spec.ts`           |
| TC-BUBBLE-MOD-01    | 空/单元素也产出至少一个 done 步（C-006）                  | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-02    | 末步数组与 oracle 最终结果一致（C-006）                   | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-03    | 每步 array 的 id 集合恒等于初始（C-006）                  | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-04    | 不修改入参（C-006）                                       | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-05    | 每步 point 合法，swap/noSwap 的 swapped 对应（C-006）     | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-06    | 四门语言齐备（C-006）                                     | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-07    | 每门语言每个 ExecPoint 行号落在源码行范围内（C-006）      | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-BUBBLE-MOD-08    | 实际出现的 point 都能在每门语言映射到行（C-006）          | L3   | `src/algorithms/bubble-sort.module.spec.ts`    |
| TC-SEL-ALGO-01      | 空数组与单元素不产生步骤（C-007）                         | L3   | `src/algorithms/selection-sort.spec.ts`        |
| TC-SEL-ALGO-02      | 最终数组升序排列（C-007）                                 | L3   | `src/algorithms/selection-sort.spec.ts`        |
| TC-SEL-ALGO-03      | 含重复元素结果正确（C-007）                               | L3   | `src/algorithms/selection-sort.spec.ts`        |
| TC-SEL-ALGO-04      | 不修改入参（C-007）                                       | L3   | `src/algorithms/selection-sort.spec.ts`        |
| TC-SELECTION-MOD-01 | 空/单元素也产出 done 步（C-007）                          | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-02 | 末步与 oracle 一致（C-007）                               | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-03 | id 集合恒等于初始（C-007）                                | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-04 | 不修改入参（C-007）                                       | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-05 | swap/noSwap 的 swapped 对应（C-007）                      | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-06 | newMin 步 min 指针落在 minIndex（C-007）                  | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-07 | 每轮 i 位即 [i,n) 最小（C-007）                           | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-08 | sortedUpTo 单调、末步为 n（C-007）                        | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-09 | 交换次数 ≤ n-1（C-007）                                   | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-10 | 四门语言齐备（C-007）                                     | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-11 | 每门语言行号在范围内（C-007）                             | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-12 | 实际 point 都能映射到行（C-007）                          | L3   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-INS-ALGO-01      | 空数组与单元素不产生步骤（C-008）                         | L3   | `src/algorithms/insertion-sort.spec.ts`        |
| TC-INS-ALGO-02      | 最终数组升序排列（C-008）                                 | L3   | `src/algorithms/insertion-sort.spec.ts`        |
| TC-INS-ALGO-03      | 含重复元素结果正确（C-008）                               | L3   | `src/algorithms/insertion-sort.spec.ts`        |
| TC-INS-ALGO-04      | 不修改入参（C-008）                                       | L3   | `src/algorithms/insertion-sort.spec.ts`        |
| TC-INS-ALGO-05      | 已升序输入每轮零移位（C-008）                             | L3   | `src/algorithms/insertion-sort.spec.ts`        |
| TC-INSERTION-MOD-01 | 空/单元素也产出 done 步（C-008）                          | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-02 | 末步与 oracle 一致（C-008）                               | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-03 | id 集合恒等于初始（C-008）                                | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-04 | 不修改入参（C-008）                                       | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-05 | shift 步必带数值型 keyIndex（C-008）                      | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-06 | insert 后 [0,i] 前缀升序（C-008）                         | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-07 | 一轮内 keyIndex 单调不增（C-008）                         | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-08 | sortedUpTo 单调、末步为 n（C-008）                        | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-09 | 稳定性：相等元素相对顺序不变（C-008）                     | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-10 | 四门语言齐备（C-008）                                     | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-11 | 每门语言行号在范围内（C-008）                             | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-12 | 实际 point 都能映射到行（C-008）                          | L3   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-SHELL-ALGO-01    | 空数组与单元素不产生 pass（C-010）                        | L3   | `src/algorithms/shell-sort.spec.ts`            |
| TC-SHELL-ALGO-02    | 最终 pass 升序排列（C-010）                               | L3   | `src/algorithms/shell-sort.spec.ts`            |
| TC-SHELL-ALGO-03    | 含重复元素结果正确且不越界（C-010）                       | L3   | `src/algorithms/shell-sort.spec.ts`            |
| TC-SHELL-ALGO-04    | 不修改入参（C-010）                                       | L3   | `src/algorithms/shell-sort.spec.ts`            |
| TC-SHELL-ALGO-05    | gap 序列为 ⌊n/2⌋ 减半到 1（C-010）                        | L3   | `src/algorithms/shell-sort.spec.ts`            |
| TC-SHELL-ALGO-06    | 已升序输入：最终仍升序、gap 序列不变（C-010）             | L3   | `src/algorithms/shell-sort.spec.ts`            |
| TC-SHELL-MOD-01     | 空/单元素也产出至少一个 done 步（C-010）                  | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-02     | 末步数组与 oracle 一致（C-010）                           | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-03     | id 集合恒等于初始（C-010）                                | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-04     | 不修改入参（C-010）                                       | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-05     | shift 步必带数值型 keyIndex（C-010）                      | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-06     | gapChange 步 gap 依次 ⌊n/2⌋ 减半到 1（C-010）             | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-07     | 各 gap-pass 边界数组与 oracle 快照一致（C-010）           | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-08     | groupStart 的 groupMembers = 子序列下标（C-010）          | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-09     | 一轮内 keyIndex 单调不增（C-010）                         | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-10     | done 步标 sortedFrom=0（C-010）                           | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-11     | 四门语言齐备（C-010）                                     | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-12     | 每门语言行号在范围内（C-010）                             | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-SHELL-MOD-13     | 实际 point 都能映射到行（C-010）                          | L3   | `src/algorithms/shell-sort.module.spec.ts`     |
| TC-MERGE-ALGO-01    | 空数组与单元素不产生 pass（C-011）                        | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-02    | 基准数据最终升序（C-011）                                 | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-03    | 含重复元素结果正确（C-011）                               | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-04    | 不修改入参（C-011）                                       | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-05    | width 序列为 1,2,4,…（<n）（C-011）                       | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-06    | 已升序输入幂等（最终仍升序）（C-011）                     | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-07    | 逆序输入最终升序（C-011）                                 | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-08    | 每趟 width 后每个 2\*width 块内部有序（C-011）            | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-ALGO-09    | 随机用例与 Array.sort 交叉校验（C-011）                   | L3   | `src/algorithms/merge-sort.spec.ts`            |
| TC-MERGE-MOD-01     | 空/单元素也产出至少一个 done 步（C-011）                  | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-02     | 末步数组与 oracle 一致（C-011）                           | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-03     | 主轨 id 集合恒等于初始（C-011）                           | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-04     | 不修改入参（C-011）                                       | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-05     | compare 步必带 comparing（C-011）                         | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-06     | widthChange 步 width 依次 1,2,4,…（C-011）                | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-07     | 各 width 趟边界数组与 oracle 快照一致（C-011）            | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-08     | mergeStart 的 groupMembers/activeRange=[lo,hi)（C-011）   | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-09     | 一对合并内 aux.filled 单调增长（C-011）                   | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-10     | writeBack 后主轨 [lo,hi) 段升序（C-011）                  | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-11     | done 步标 sortedFrom=0、aux 无 filled（C-011）            | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-12     | take 步 temp 写入位的值 = 所取元素值（C-011）             | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-13     | 主轨指针 clamp [0,n-1]、aux.pointer [0,n]（C-011）        | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-14     | 每步 aux.array 长度 = 主轨长度（C-011）                   | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-15     | 四门语言齐备（C-011）                                     | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-16     | 每门语言 MergeExecPoint 行号在范围内（C-011）             | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-MERGE-MOD-17     | 实际 point 都能映射到行（C-011）                          | L3   | `src/algorithms/merge-sort.module.spec.ts`     |
| TC-QUICK-ALGO-01    | 末事件数组严格升序且与内置 sort 一致（C-012）             | L3   | `src/algorithms/quick-sort.spec.ts`            |
| TC-QUICK-ALGO-02    | 不修改入参（C-012）                                       | L3   | `src/algorithms/quick-sort.spec.ts`            |
| TC-QUICK-ALGO-03    | 空/单元素返回空事件序列（C-012）                          | L3   | `src/algorithms/quick-sort.spec.ts`            |
| TC-QUICK-ALGO-04    | BASE 的 pivot 落点序列 = [0,6,1,5,2,4,9,7]（C-012）       | L3   | `src/algorithms/quick-sort.spec.ts`            |
| TC-QUICK-ALGO-05    | 每次 partition 落点钉死最终位置（C-012）                  | L3   | `src/algorithms/quick-sort.spec.ts`            |
| TC-QUICK-ALGO-06    | 含重复/已序/逆序也正确升序（C-012）                       | L3   | `src/algorithms/quick-sort.spec.ts`            |
| TC-QUICK-MOD-01     | 空/单元素只产出 done 步、sortedIndices 全集（C-012）      | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-02     | 末步数组与 oracle 一致（升序）（C-012）                   | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-03     | 每步 id 集合恒等于初始（FLIP 前提）（C-012）              | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-04     | 不修改入参（C-012）                                       | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-05     | 每步 point 合法；compare 步必带 comparing=[j,hi]（C-012） | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-06     | pivotPlace 落点序列 = oracle pivotIndex 序列（C-012）     | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-07     | sortedIndices 单调不减、末步全集（C-012）                 | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-08     | pivotSelect 步 pivotIndex=hi 且 pivot 值=a[hi]（C-012）   | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-09     | 栈序：pop 弹出区间=前一步栈顶（先右后左→先取左）（C-012） | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-10     | done 步 stack 空、sortedIndices 全集（C-012）             | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-11     | 每步指针 clamp 在 [0,n-1]（C-012）                        | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-12     | 每步带 stack 快照（StackTrack）（C-012）                  | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-13     | swap 步小于区不变量：a[lo..i-1] 全 < pivot（C-012）       | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-14     | 四门语言齐备（C-012）                                     | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-15     | 每门语言每个 QuickExecPoint 行号在源码行范围内（C-012）   | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-QUICK-MOD-16     | 实际出现的 point 都能在每门语言映射到行（C-012）          | L3   | `src/algorithms/quick-sort.module.spec.ts`     |
| TC-HEAP-ALGO-01     | result 升序且与内置 sort 一致（C-013）                    | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-ALGO-02     | built 是大顶堆（C-013）                                   | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-ALGO-03     | BASE 建堆后 = [10,9,8,6,7,5,4,3,2,1]（C-013）             | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-ALGO-04     | 不修改入参（C-013）                                       | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-ALGO-05     | 空 / 单元素 result 原样（C-013）                          | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-ALGO-06     | 含重复 / 已序 / 逆序均升序（C-013）                       | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-ALGO-07     | isMaxHeap 能识别非堆（C-013）                             | L3   | `src/algorithms/heap-sort.spec.ts`             |
| TC-HEAP-MOD-01      | 空 / 单元素只产出 done、sortedFrom=0（C-013）             | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-02      | 末步升序 = oracle result（C-013）                         | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-03      | 每步 id 集合恒等于初始（FLIP）（C-013）                   | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-04      | 不修改入参（C-013）                                       | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-05      | 每步 point 合法；compare 带 comparing（C-013）            | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-06      | 建堆阶段末步 = oracle built 且为大顶堆（C-013）           | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-07      | extract 步 sortedFrom=heapSize 且单调递减（C-013）        | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-08      | extract 堆顶取出序列 = [10,9,8,7,6,5,4,3,2]（C-013）      | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-09      | heapify 步 heapNode 为数字（C-013）                       | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-10      | done 步 sortedFrom=0、tree.heapSize=0（C-013）            | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-11      | 每步带 tree 快照（C-013）                                 | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-12      | 堆用节点高亮、无指针箭头（C-013）                         | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-13      | 四门语言齐备（C-013）                                     | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-14      | 每门语言每个 point 行号在源码行范围内（C-013）            | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-HEAP-MOD-15      | 实际出现的 point 都能映射到行（C-013）                    | L3   | `src/algorithms/heap-sort.module.spec.ts`      |
| TC-COUNT-ALGO-01    | result 升序且与内置 sort 一致（C-014）                    | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-ALGO-02    | counts/min/max 正确（含空桶=0）（C-014）                  | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-ALGO-03    | sum(counts) = n（C-014）                                  | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-ALGO-04    | 由 counts 展开可重建 result（C-014）                      | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-ALGO-05    | 不修改入参（C-014）                                       | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-ALGO-06    | 空 / 单元素（C-014）                                      | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-ALGO-07    | 重复 / 已序 / 逆序 / 全等值均升序（C-014）                | L3   | `src/algorithms/counting-sort.spec.ts`         |
| TC-COUNT-MOD-01     | 空只产 done；单元素末步 done 升序（C-014）                | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-02     | 末步升序 = oracle result（C-014）                         | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-03     | 每步 id 集合恒等于初始（FLIP）（C-014）                   | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-04     | 不修改入参（C-014）                                       | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-05     | 每步 point 合法、带 count 快照（C-014）                   | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-06     | 计数阶段末步桶快照 = oracle counts（C-014）               | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-07     | count 步 activeBucket = a[i]-min（C-014）                 | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-08     | 回写 sortedUpTo 单调不减、done = n（C-014）               | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-09     | 每条 writeBack 当前桶余量递减（C-014）                    | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-10     | 空桶有 bucketStart 但其后无 writeBack（C-014）            | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-11     | done 步 sortedUpTo=n、桶全0、无游标（C-014）              | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-12     | count 蓝读游标 / 回写绿写游标（C-014）                    | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-13     | writeBack dimFrom=写入位+1、活跃格不提前绿（C-014）       | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-14     | 四门语言齐备（C-014）                                     | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-15     | 每门语言每个 point 行号在范围内（C-014）                  | L3   | `src/algorithms/counting-sort.module.spec.ts`  |
| TC-COUNT-MOD-16     | 实际出现的 point 都能映射到行（C-014）                    | L3   | `src/algorithms/counting-sort.module.spec.ts`  |

---

## store（全局状态）

| Case ID     | 标题                                            | 层级 | 自动化路径                         |
| ----------- | ----------------------------------------------- | ---- | ---------------------------------- |
| TC-STORE-01 | 初始 isDarkMode=false、isShowHeaderShadow=false | L3   | `src/store/modules/system.spec.ts` |
| TC-STORE-02 | changeDarkMode 切换暗色                         | L3   | `src/store/modules/system.spec.ts` |
| TC-STORE-03 | changeHeaderShadowe 设置阴影开关                | L3   | `src/store/modules/system.spec.ts` |
| TC-STORE-04 | colors 含 red/blue/yellow/green                 | L3   | `src/store/modules/system.spec.ts` |

---

## viz-engine（可视化引擎基础组件）

| Case ID              | 标题                                                                    | 层级 | 自动化路径                                      |
| -------------------- | ----------------------------------------------------------------------- | ---- | ----------------------------------------------- |
| TC-VIZ-ARROW-01      | 语义色映射柔和色描在雪佛龙上                                            | L4   | `src/components/Arrow.spec.ts`                  |
| TC-VIZ-ARROW-02      | 非预设色按原值透传                                                      | L4   | `src/components/Arrow.spec.ts`                  |
| TC-VIZ-ARROWTRACK-01 | 每个 Pointer 渲染一个 Arrow 并按 index 定位                             | L4   | `src/components/ArrowTrack.spec.ts`             |
| TC-VIZ-ARROWTRACK-02 | slotWidth 自定义时按其定位（C-006）                                     | L4   | `src/components/ArrowTrack.spec.ts`             |
| TC-VIZ-BLOCK-01      | 渲染数值                                                                | L4   | `src/components/Block.spec.ts`                  |
| TC-VIZ-BLOCK-02      | 背景透明度随 percent                                                    | L4   | `src/components/Block.spec.ts`                  |
| TC-VIZ-BLOCK-03      | percent<0.5 文字色 black，否则 white                                    | L4   | `src/components/Block.spec.ts`                  |
| TC-VIZ-LIST-01       | 渲染与数据等量的 Block                                                  | L4   | `src/components/List.spec.ts`                   |
| TC-VIZ-LIST-02       | 最小值 percent=0、最大值 percent=1                                      | L4   | `src/components/List.spec.ts`                   |
| TC-VIZ-BAR-01        | 渲染数值（C-006）                                                       | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BAR-02        | 高度随 percent 增大（C-006）                                            | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BAR-03        | state 决定柱体 class（C-006）                                           | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-01   | 渲染与数据等量的 Bar（C-006）                                           | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-02   | 最大值柱最高、最小值柱最低（C-006）                                     | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-03   | comparing 下标进入 comparing 态（C-006）                                | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-04   | sortedFrom 之后进入 sorted 态（C-006）                                  | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-05   | slotWidth 透传给 ArrowTrack（C-006）                                    | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-04        | state=min 时柱体加 min class（C-007）                                   | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-06   | minIndex 指向的 Bar 进入 min 态（C-007）                                | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-07   | sortedUpTo 左侧进入 sorted 态（C-007）                                  | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-08   | 比较帧 minIndex 取 min（C-007）                                         | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-05        | state=key 时柱体加 key class（C-008）                                   | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-09   | keyIndex 指向的 Bar 进入 key 态（C-008）                                | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-10   | key 优先级压过 sorted（C-008）                                          | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-11   | 比较帧 keyIndex 取 key（C-008）                                         | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-06        | state=dimmed 时柱体加 dimmed class（C-010）                             | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-12   | 组内柱保持 idle、组外柱 dimmed（C-010）                                 | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-13   | dimmed 最低档：组外 key/comparing 取本态（C-010）                       | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-14   | 空 groupMembers 不淡化任何柱（C-010）                                   | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-07        | state='empty' 时柱体加 empty class（C-011）                             | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-AUXVIEW-01    | 渲染与 aux.array 等长的槽（C-011）                                      | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-02    | filled 的槽为 sorted、其余为 empty（C-011）                             | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-03    | pointer 定位 k 箭头到对应槽（C-011）                                    | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-04    | 无 pointer 时不渲染箭头（C-011）                                        | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-05    | filled 槽高度用主轨 min/max 同尺度（C-011）                             | L4   | `src/components/AuxView.spec.ts`                |
| TC-PLAYER-AUX-01     | module 无 aux 时不渲染 AuxView（C-011）                                 | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-AUX-02     | 当前步带 aux 时渲染 AuxView（C-011）                                    | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-VIZ-BAR-08        | state=pivot 时柱体加 pivot class（C-012）                               | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-15   | pivotIndex 指向的 Bar 进入 pivot 态（C-012）                            | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-16   | pivot 优先级最高：压过 comparing/groupMembers/sortedIndices（C-012）    | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-17   | sortedIndices 内的离散下标进入 sorted 态（C-012）                       | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-STACKVIEW-01  | 渲染与 frames 等量的栈帧（C-012）                                       | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-02  | 栈顶在最上、内容为 a[lo..hi]（C-012）                                   | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-03  | 栈顶帧高亮（.top）（C-012）                                             | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-04  | 固定等宽居中（无 inline left/width）（C-012）                           | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-05  | 空栈渲染占位、无栈帧（C-012）                                           | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-06  | 稳定 key 入栈渲染（setProps 增帧后旧帧保留）（C-012）                   | L4   | `src/components/StackView.spec.ts`              |
| TC-PLAYER-STACK-01   | module 无 stack 时不渲染 StackView（向后兼容）（C-012）                 | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-STACK-02   | 当前步带 stack 时渲染 StackView（C-012）                                | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-STACK-03   | 带 aux 不带 stack 只渲染 AuxView（两轨互不干扰）（C-012）               | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-STACK-04   | 同时带 aux + stack 双辅助轨并存都渲染（C-043 自顶向下归并）             | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-VIZ-BAR-09        | state=heapNode 时柱体加 heapNode class（C-013）                         | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-18   | heapNode 指向的 Bar 进入 heapNode 态（C-013）                           | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-19   | heapNode 让位 sorted：已就位后缀优先（C-013）                           | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-20   | heapNode 压过 comparing（C-013）                                        | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-TREEVIEW-01   | 渲染节点数 = array.length（C-013）                                      | L4   | `src/components/TreeView.spec.ts`               |
| TC-VIZ-TREEVIEW-02   | 完全二叉树布局坐标（C-013）                                             | L4   | `src/components/TreeView.spec.ts`               |
| TC-VIZ-TREEVIEW-03   | 父子边数 = n-1（C-013）                                                 | L4   | `src/components/TreeView.spec.ts`               |
| TC-VIZ-TREEVIEW-04   | heapNode 节点带 heapNode 类（C-013）                                    | L4   | `src/components/TreeView.spec.ts`               |
| TC-VIZ-TREEVIEW-05   | heapSize 区分就位（k≥heapSize 为 sorted）（C-013）                      | L4   | `src/components/TreeView.spec.ts`               |
| TC-VIZ-TREEVIEW-06   | comparing 黄 / swapped 橙节点态（C-013）                                | L4   | `src/components/TreeView.spec.ts`               |
| TC-PLAYER-TREE-01    | 当前步带 tree 时渲染 TreeView（C-013）                                  | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-TREE-02    | module 无 tree 时不渲染 TreeView（向后兼容）（C-013）                   | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-TREE-03    | 带 aux 不带 tree 不渲染 TreeView（多轨互不干扰）（C-013）               | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-VIZ-BARSVIEW-21   | dimFrom 连续后缀淡化（index≥dimFrom → dimmed）（C-014）                 | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-22   | dimFrom 与 sortedUpTo 共存：前缀绿/活跃 idle/后缀淡（C-014）            | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-23   | pivotIndices 双基准都进入 pivot 态（C-042 双轴快排）                    | L4   | `src/components/BarsView.spec.ts`               |
| TC-E2E-CODEPANEL-01  | 缺陷回归：代码面板长行可横滚、不截断（C-042 Owner 反馈，overflow-x）    | L5   | `e2e/code-panel-hscroll.e2e.ts`                 |
| TC-VIZ-COUNTVIEW-01  | 渲染桶数 = buckets.length（C-014）                                      | L4   | `src/components/CountView.spec.ts`              |
| TC-VIZ-COUNTVIEW-02  | 每桶单元格数 = buckets[b]（C-014）                                      | L4   | `src/components/CountView.spec.ts`              |
| TC-VIZ-COUNTVIEW-03  | 桶底值标签 = b + min（C-014）                                           | L4   | `src/components/CountView.spec.ts`              |
| TC-VIZ-COUNTVIEW-04  | activeBucket 桶带 .active（C-014）                                      | L4   | `src/components/CountView.spec.ts`              |
| TC-VIZ-COUNTVIEW-05  | 空桶渲染 0 格、仍显值与计数 0（C-014）                                  | L4   | `src/components/CountView.spec.ts`              |
| TC-VIZ-COUNTVIEW-06  | 桶顶计数数字 = buckets[b]（C-014）                                      | L4   | `src/components/CountView.spec.ts`              |
| TC-PLAYER-COUNT-01   | 当前步带 count 时渲染 CountView（C-014）                                | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-COUNT-02   | module 无 count 时不渲染 CountView（向后兼容）（C-014）                 | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-COUNT-03   | 带 tree 不带 count 不渲染 CountView（多轨互不干扰）（C-014）            | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-VIZ-BUCKETVIEW-01 | 渲染 5 桶 + 值域标签（C-040 新桶轨）                                    | L4   | `src/components/BucketView.spec.ts`             |
| TC-VIZ-BUCKETVIEW-02 | 桶内每元素一格、文本为值（C-040）                                       | L4   | `src/components/BucketView.spec.ts`             |
| TC-VIZ-BUCKETVIEW-03 | activeBucket 桶带 .active（C-040）                                      | L4   | `src/components/BucketView.spec.ts`             |
| TC-VIZ-BUCKETVIEW-04 | 空桶渲染 0 格、仍显值域标签（C-040）                                    | L4   | `src/components/BucketView.spec.ts`             |
| TC-PLAYER-BUCKET-01  | 当前步带 bucket 时渲染 BucketView（C-040）                              | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-BUCKET-02  | module 无 bucket 不渲染 BucketView（向后兼容）（C-040）                 | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-VIZ-GRAPHVIEW-01  | 6 .graph-node + 9 .graph-edge + 权重文本（C-047 新第 7 轨，通用带权图） | L4   | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-02  | doneNodes→.done、activeNode→.active（C-047）                            | L4   | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-03  | edgeClass→对应边 .relaxed / .tree（C-047）                              | L4   | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-04  | nodeBadge→.node-badge 显示 dist（含 ∞）（C-047）                        | L4   | `src/components/GraphView.spec.ts`              |
| TC-VIZ-MATRIXVIEW-01 | 渲染 4×4 数据单元 + 行列标签 A/B/C/D（C-052）                           | L4   | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-02 | null 单元显示「∞」（初始 6 个）（C-052）                                | L4   | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-03 | pivot=1 → 第 1 行/列 .mx-pivot（7 个）（C-052）                         | L4   | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-04 | active .mx-active；sources 两单元 .mx-source（C-052）                   | L4   | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-05 | 行列异标签 rowLabels/colLabels 各自渲染（DP 表）（C-053）               | L4   | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-06 | emptyText='' → null 单元显示空白（非 ∞）（C-053）                       | L4   | `src/components/MatrixView.spec.ts`             |
| TC-PLAYER-GRAPH-01   | 当前步带 graph 时渲染 GraphView（C-047）                                | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-GRAPH-02   | array:[] 不渲染 BarsView；排序 array 非空仍渲染（零回归）（C-047）      | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MATRIX-01  | step 带 matrix → 渲染 MatrixView（C-052）                               | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MATRIX-02  | 排序 step 无 matrix→不渲染；matrix step 空数组→不渲 BarsView（C-052）   | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |

---

## player（播放器，C-006）

| Case ID           | 标题                                    | 层级 | 自动化路径                                        |
| ----------------- | --------------------------------------- | ---- | ------------------------------------------------- |
| TC-PLAYER-01      | 初始停第 0 步且未播放                   | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-02      | stepForward 前进且不越过末步            | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-03      | stepBackward 后退且不越过首步           | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-04      | seek 越界夹紧到合法范围                 | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-05      | reset 回第 0 步并停止                   | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-06      | play 按基准间隔逐步推进、到末步自动暂停 | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-07      | pause 停止自动推进                      | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-08      | setSpeed 加速后按新速率推进             | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-09      | current 跟随 index                      | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-PLAYER-10      | progress 从 0 到 1                      | L3   | `src/components/player/usePlayer.spec.ts`         |
| TC-CODEPANEL-01   | 渲染默认语言(TS)所有行                  | L4   | `src/components/player/CodePanel.spec.ts`         |
| TC-CODEPANEL-02   | 当前执行行随 point 经 lineMap 高亮      | L4   | `src/components/player/CodePanel.spec.ts`         |
| TC-CODEPANEL-03   | 切语言 Tab 后按该语言 lineMap 高亮      | L4   | `src/components/player/CodePanel.spec.ts`         |
| TC-VARPANEL-01    | 渲染每个变量的名与值                    | L4   | `src/components/player/VariablePanel.spec.ts`     |
| TC-VARPANEL-02    | 与上一步比较，变化的行加 changed        | L4   | `src/components/player/VariablePanel.spec.ts`     |
| TC-VARPANEL-03    | 无 prev 时都不高亮                      | L4   | `src/components/player/VariablePanel.spec.ts`     |
| TC-TRANSPORT-01   | 未播放点主按钮 emit play                | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-02   | 播放中点主按钮 emit pause               | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-03   | atStart 时上一步禁用                    | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-04   | atEnd 时下一步禁用                      | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-05   | 下一步 emit stepForward                 | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-06   | 重置 emit reset                         | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-07   | 计数器显示 index+1 / total              | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-08   | 拖动进度条 emit seek(值)                | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-09   | 改速 emit setSpeed(值)                  | L4   | `src/components/player/TransportControls.spec.ts` |
| TC-PLAYER-VIEW-01 | 渲染柱状图+代码+变量+控制               | L4   | `src/components/player/AlgorithmPlayer.spec.ts`   |
| TC-PLAYER-VIEW-02 | 默认第 0 步，点下一步到第 2 步          | L4   | `src/components/player/AlgorithmPlayer.spec.ts`   |

---

## home（首页）

| Case ID              | 标题                                                    | 层级 | 自动化路径                                       |
| -------------------- | ------------------------------------------------------- | ---- | ------------------------------------------------ |
| TC-HOOK-01-1         | 三分类，4 顶层分类·动态规划含编辑距离+0-1 背包（C-054） | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-2         | 数据结构分类含 15 项（…/B+ 树/布隆 C-036）              | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-3         | 每个条目含 title/desc/icon/url                          | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-4         | 所有 url 唯一                                           | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-5         | 每个分类含 desc                                         | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-03-1         | 组件挂载时注册 scroll 监听器                            | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-HOOK-03-2         | 组件卸载时移除 scroll 监听器                            | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-HOOK-03-3         | scrollY > 0 时 isShowHeaderShadow 变为 true             | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-HOOK-03-4         | scrollY === 0 时 isShowHeaderShadow 变为 false          | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-VIEW-FOOTER-01    | 渲染 MIT Licensed 文案                                  | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-02    | 渲染 Copyright 文案                                     | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-03    | 渲染 Zhang Xu 署名                                      | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-04    | 渲染 footer 根元素                                      | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-CATEGORY-01  | 渲染分类标题                                            | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-02  | 渲染分类描述                                            | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-03  | 渲染 children 数量对应的 Item                           | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-04  | 渲染第一个 Item 标题「数组」                            | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-05  | 渲染第二个 Item 标题「链表」                            | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-06  | children 为空时无 Item 渲染                             | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-HOME-ITEM-01 | 渲染 item 标题                                          | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-02 | 渲染 item 描述                                          | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-03 | 渲染 img 标签（icon）                                   | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-04 | img src 属性对应 icon 字段                              | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-05 | 点击元素调用 router.push，跳转到对应 url name           | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-06 | 不同 url 跳转到对应路由名                               | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-SPLASH-01    | 渲染主标题「可视化的」                                  | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-02    | 渲染副标题「数据结构与算法」                            | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-03    | 渲染技术栈描述文案                                      | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-04    | 渲染「开始学习」按钮                                    | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-05    | 点击「开始学习」跳转到 docs/array 页                    | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-E2E-HOME-01       | 首页加载并能进入 docs                                   | L5   | `e2e/home-navigation.e2e.ts`                     |

---

## docs（文档页侧边菜单）

| Case ID              | 标题                                                    | 层级 | 自动化路径                                     |
| -------------------- | ------------------------------------------------------- | ---- | ---------------------------------------------- |
| TC-HOOK-02-1         | 三分类，4 顶层分类·动态规划含编辑距离+0-1 背包（C-054） | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-02-2         | 每项含 title/url 且均非空                               | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-02-3         | 所有 url 唯一                                           | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-02-4         | 数据结构 15 项，排序 15 项（新增鸡尾酒排序 C-045）      | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-04-1         | 组件挂载后 isShowHeaderShadow 变为 true                 | L3   | `src/views/Docs/hooks.spec.ts`                 |
| TC-HOOK-04-2         | 组件卸载后 isShowHeaderShadow 恢复为 false              | L3   | `src/views/Docs/hooks.spec.ts`                 |
| TC-VIEW-DOCS-ITEM-01 | 渲染 item span 文本                                     | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-02 | 渲染 .item.btn class                                    | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-03 | 点击调用 router.push 跳转到对应 url                     | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-04 | url 匹配时 item 有 item-pressed class                   | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-05 | url 不匹配时 item 无 item-pressed class                 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-06 | 不同 url 跳转对应路由                                   | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-MENU-01      | 挂载成功，渲染 #menu 根元素                             | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-02      | 渲染「数据结构」分类标题                                | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-03      | 渲染「经典排序算法」分类标题                            | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-04      | 渲染所有数据结构子项（如「数组」「链表」）              | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-05      | 渲染排序算法子项「冒泡排序」                            | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-06      | useMenuSelect 初始路由 array 使对应 Item 高亮           | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-07      | 点击子菜单项触发路由跳转                                | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-08      | onBeforeRouteUpdate 回调触发后高亮随路由更新            | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-E2E-MENU-01       | docs 菜单点击切换路由                                   | L5   | `e2e/docs-menu.e2e.ts`                         |

---

## article-sort（排序动画文章）

| Case ID                                                                    | 标题                                                                                                                                                   | 层级 | 自动化路径                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------- |
| TC-VIEW-BUBBLE-01                                                          | （C-006 改写）挂载渲染 AlgorithmPlayer                                                                                                                 | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`          |
| TC-VIEW-BUBBLE-02                                                          | （C-006 改写）初始渲染 10 根柱子且默认停第 0 步                                                                                                        | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`          |
| TC-E2E-BUBBLE-01                                                           | ~~冒泡排序动画最终升序~~ (superseded by TC-E2E-PLAYER-01)                                                                                              | L5   | `e2e/bubble-sort.e2e.ts`                                      |
| TC-E2E-PLAYER-01                                                           | 冒泡播放器：默认暂停/单步/跳末升序/重置（C-006）                                                                                                       | L5   | `e2e/bubble-sort.e2e.ts`                                      |
| TC-VIEW-SELECTION-01                                                       | 挂载渲染 AlgorithmPlayer（C-007）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts`       |
| TC-VIEW-SELECTION-02                                                       | 初始渲染 10 柱默认停第 0 步（C-007）                                                                                                                   | L4   | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts`       |
| TC-E2E-SELECTION-01                                                        | 选择排序播放器 e2e（C-007）                                                                                                                            | L5   | `e2e/selection-sort.e2e.ts`                                   |
| TC-VIEW-INSERTION-01                                                       | 挂载渲染 AlgorithmPlayer（C-008）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts`       |
| TC-VIEW-INSERTION-02                                                       | 初始渲染 10 柱默认停第 0 步（C-008）                                                                                                                   | L4   | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts`       |
| TC-E2E-INSERTION-01                                                        | 插入排序播放器 e2e（C-008）                                                                                                                            | L5   | `e2e/insertion-sort.e2e.ts`                                   |
| TC-VIEW-SHELL-01                                                           | 挂载渲染 AlgorithmPlayer（C-010）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`           |
| TC-VIEW-SHELL-02                                                           | 初始渲染 10 柱默认停第 0 步（C-010）                                                                                                                   | L4   | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`           |
| TC-E2E-SHELL-01                                                            | 希尔排序播放器 e2e（C-010）                                                                                                                            | L5   | `e2e/shell-sort.e2e.ts`                                       |
| TC-VIEW-MERGE-01                                                           | 挂载渲染 AlgorithmPlayer（C-011）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/MergeSort.spec.ts`           |
| TC-VIEW-MERGE-02                                                           | 初始渲染主轨 10 柱 + 辅助轨默认停第 0 步（C-011）                                                                                                      | L4   | `src/views/Article/SortAlgorithm/MergeSort.spec.ts`           |
| TC-E2E-MERGE-01                                                            | 归并播放器 e2e（C-011）                                                                                                                                | L5   | `e2e/merge-sort.e2e.ts`                                       |
| TC-VIEW-QUICK-01                                                           | 挂载渲染 AlgorithmPlayer（C-012）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/QuickSort.spec.ts`           |
| TC-VIEW-QUICK-02                                                           | 初始渲染主轨 10 柱 + 区间栈轨且默认停第 0 步（C-012）                                                                                                  | L4   | `src/views/Article/SortAlgorithm/QuickSort.spec.ts`           |
| TC-E2E-QUICK-01                                                            | 快排播放器：默认暂停/区间栈轨/pivot品红/跳末升序全绿/重置（C-012）                                                                                     | L5   | `e2e/quick-sort.e2e.ts`                                       |
| TC-VIEW-HEAP-01                                                            | 挂载渲染 AlgorithmPlayer（C-013）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/HeapSort.spec.ts`            |
| TC-VIEW-HEAP-02                                                            | 初始渲染二叉树轨 + 主轨 10 柱且默认停第 0 步（C-013）                                                                                                  | L4   | `src/views/Article/SortAlgorithm/HeapSort.spec.ts`            |
| TC-E2E-HEAP-01                                                             | 堆排序播放器 e2e：默认暂停/树轨/heapNode/跳末升序/重置（C-013）                                                                                        | L5   | `e2e/heap-sort.e2e.ts`                                        |
| TC-VIEW-COUNT-01                                                           | 挂载渲染 AlgorithmPlayer（C-014）                                                                                                                      | L4   | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`        |
| TC-VIEW-COUNT-02                                                           | 初始渲染计数桶轨 + 主轨 10 柱且默认停第 0 步（C-014）                                                                                                  | L4   | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`        |
| TC-E2E-COUNT-01                                                            | 计数排序播放器：默认暂停/桶轨/计数填桶/空桶/跳末升序/重置（C-014）                                                                                     | L5   | `e2e/counting-sort.e2e.ts`                                    |
| TC-RADIX-MOD-01..13                                                        | 基数排序模块 13：末步有序/不改入参/位置键/步数结构/分桶计数/收集结果/四语言/行号（C-039）                                                              | L3   | `src/algorithms/radix-sort.module.spec.ts`                    |
| TC-VIEW-RADIX-01/02                                                        | 基数排序页：挂载 AlgorithmPlayer + 桶轨 + 主轨 8 柱（C-039）                                                                                           | L4   | `src/views/Article/SortAlgorithm/RadixSort.spec.ts`           |
| TC-VIEW-{BUBBLE,SELECTION,INSERTION,SHELL,MERGE,QUICK,HEAP,COUNT,RADIX}-03 | **M8③ 老排序补正文**：9 个裸播放器排序页各 +1 Case——含 Article、h1 含中文标题（C-046，升全模板）                                                       | L4   | `src/views/Article/SortAlgorithm/*.spec.ts`                   |
| TC-E2E-RADIX-01                                                            | 基数排序播放器：8 柱 / 10 桶 / 拖末步升序（C-039）                                                                                                     | L5   | `e2e/radix-sort.e2e.ts`                                       |
| TC-BUCKET-MOD-01..13                                                       | 桶排序模块 13：末步有序/不改入参/位置键/步数结构/分配末桶/桶内排序/合并写游标/值域/四语言行号（C-040）                                                 | L3   | `src/algorithms/bucket-sort.module.spec.ts`                   |
| TC-VIEW-BUCKET-01/02                                                       | 桶排序页全模板：Article(h1 桶排序) + AlgorithmPlayer + BucketView 桶轨 + 主轨 8 柱（C-040）                                                            | L4   | `src/views/Article/SortAlgorithm/BucketSort.spec.ts`          |
| TC-E2E-BUCKET-01                                                           | 桶排序全模板：正文 + 桶轨 5 桶 + 主轨 8 柱 / 拖末步升序（C-040）                                                                                       | L5   | `e2e/bucket-sort.e2e.ts`                                      |
| TC-3WQUICK-MOD-01..13                                                      | 三路快排模块 13：末步有序/不改入参/位置键/带区间栈/三路分支守恒/弹选压守恒/首基准/首划分三段钉死/三分支出现/done全量/三指针/四语言行号（C-041）        | L3   | `src/algorithms/three-way-quick.module.spec.ts`               |
| TC-VIEW-3WQUICK-01/02                                                      | 三路快排页全模板：Article(h1 三路快排) + AlgorithmPlayer + StackView 区间栈 + 主轨 8 柱（C-041）                                                       | L4   | `src/views/Article/SortAlgorithm/ThreeWayQuickSort.spec.ts`   |
| TC-E2E-3WQUICK-01                                                          | 三路快排全模板：正文 + 区间栈 + 主轨 8 柱 / 拖末步升序（C-041）                                                                                        | L5   | `e2e/three-way-quick-sort.e2e.ts`                             |
| TC-DUALPIVOT-MOD-01..14                                                    | 双轴快排模块 14：末步有序/不改入参/位置键/带区间栈/三路分支守恒/弹选归压守恒/首趟双紫/归位快照/换端演示/done全量/三指针/四语言行号（C-042）            | L3   | `src/algorithms/dual-pivot-quick.module.spec.ts`              |
| TC-VIEW-DUALPIVOT-01/02                                                    | 双轴快排页全模板：Article(h1 双轴快排) + AlgorithmPlayer + StackView 区间栈 + 主轨 8 柱（C-042）                                                       | L4   | `src/views/Article/SortAlgorithm/DualPivotQuickSort.spec.ts`  |
| TC-E2E-DUALPIVOT-01                                                        | 双轴快排全模板：正文 + 区间栈 + 主轨 8 柱 / 拖末步升序（C-042）                                                                                        | L5   | `e2e/dual-pivot-quick-sort.e2e.ts`                            |
| TC-TDMERGE-MOD-01..14                                                      | 自顶向下归并模块 14：末步有序/不改入参/位置键/双轨齐/split 结构/merge 守恒/比较写入守恒/首合并快照/栈深 3/栈顶活动区间/done/双指针/四语言行号（C-043） | L3   | `src/algorithms/top-down-merge.module.spec.ts`                |
| TC-VIEW-TDMERGE-01/02                                                      | 自顶向下归并页全模板：Article(h1) + AlgorithmPlayer + AuxView 与 StackView 双辅助轨 + 主轨 8 柱（C-043）                                               | L4   | `src/views/Article/SortAlgorithm/TopDownMergeSort.spec.ts`    |
| TC-E2E-TDMERGE-01                                                          | 自顶向下归并全模板：正文 + 递归栈/temp 双辅助轨 + 拖末步升序（C-043）                                                                                  | L5   | `e2e/top-down-merge-sort.e2e.ts`                              |
| TC-BININS-MOD-01..14                                                       | 二分插入排序模块 14：末步有序/不改入参/位置键/步点合法/轮守恒/折半守恒/搬移总数/零移动轮/全移动轮/probe 三指针/keyIndex/done/四语言行号（C-044）       | L3   | `src/algorithms/binary-insertion.module.spec.ts`              |
| TC-VIEW-BININS-01/02                                                       | 二分插入排序页全模板：Article(h1) + AlgorithmPlayer + 主轨 8 柱（C-044）                                                                               | L4   | `src/views/Article/SortAlgorithm/BinaryInsertionSort.spec.ts` |
| TC-E2E-BININS-01                                                           | 二分插入排序全模板：正文 + 主轨 8 柱 / 拖末步升序（C-044）                                                                                             | L5   | `e2e/binary-insertion-sort.e2e.ts`                            |
| TC-COCKTAIL-MOD-01..14                                                     | 鸡尾酒排序模块 14：末步有序/不改入参/位置键/步点带方向/趟结构/比较守恒分向/交换总数/乌龟一趟回头/双端并存/提前收工/双指针/done/四语言行号（C-045）     | L3   | `src/algorithms/cocktail.module.spec.ts`                      |
| TC-VIEW-COCKTAIL-01/02                                                     | 鸡尾酒排序页全模板：Article(h1) + AlgorithmPlayer + 主轨 8 柱（C-045）                                                                                 | L4   | `src/views/Article/SortAlgorithm/CocktailSort.spec.ts`        |
| TC-E2E-COCKTAIL-01                                                         | 鸡尾酒排序全模板：正文 + 主轨 8 柱 / 拖末步升序（C-045）                                                                                               | L5   | `e2e/cocktail-sort.e2e.ts`                                    |

---

## master（全局框架 Header）

| Case ID             | 标题                                                         | 层级 | 自动化路径                                          |
| ------------------- | ------------------------------------------------------------ | ---- | --------------------------------------------------- |
| TC-HOOK-05-1        | 返回 4 项 微博/X/GitHub/个人主页，title 文案（C-030 改 3→4） | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-HOOK-05-2        | 每项 title/src/url 非空且 url 为 https（C-009 改写）         | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-HOOK-05-3        | 微博/X url 含线上域名+path；GitHub=仓库地址（C-009 改写）    | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-HOOK-05-4        | 个人主页项 url 指向 HOME_PAGE_URL（C-030 新增）              | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-SHARE-01         | buildShareTargetUrl 拼线上域名 + fullPath（C-009）           | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-02         | buildShareTargetUrl 保留 query/hash（C-009）                 | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-03         | buildWeiboShareUrl 指向微博分享页（C-009）                   | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-04         | buildXShareUrl 指向 X 分享页（C-009）                        | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-05         | 链接与中文文案经 URLSearchParams 编码（C-009）               | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-06         | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验（C-009）             | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-07         | 常量 HOME_PAGE_URL 为个人主页 https 链接（C-030）            | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-VIEW-HEADER-01   | 渲染 #header 根元素                                          | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-02   | 渲染 logo #logo 元素                                         | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-03   | 渲染「V」logo 字符                                           | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-04   | 渲染 h1 标题「算法可视化」                                   | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-05   | 点击 logo 跳转到 home 路由                                   | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-06   | 渲染 4 个 icon-link（微博/X/GitHub/个人主页，C-030 改 3→4）  | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-07   | 初始无 header shadow class                                   | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-ICONLINK-01 | 渲染 .icon-link 根元素                                       | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-02 | 渲染 img 标签                                                | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-03 | img src 属性正确                                             | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-04 | title 属性渲染到元素上                                       | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-05 | 点击调用 window.open 打开对应 url                            | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-06 | 不同 url 也能正确打开                                        | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |

## article（知识页排版骨架，C-015）

| Case ID              | 标题                       | 层级 | 自动化路径                                  |
| -------------------- | -------------------------- | ---- | ------------------------------------------- |
| TC-VIZ-ARTICLE-01    | 渲染 .article 容器         | L4   | `src/components/article/Article.spec.ts`    |
| TC-VIZ-ARTICLE-02    | slot 内容透传              | L4   | `src/components/article/Article.spec.ts`    |
| TC-VIZ-CALLOUT-01    | 渲染 .callout 且 slot 出现 | L4   | `src/components/article/Callout.spec.ts`    |
| TC-VIZ-PLAYGROUND-01 | 默认角标「亲手试试」+ slot | L4   | `src/components/article/Playground.spec.ts` |
| TC-VIZ-PLAYGROUND-02 | 自定义 title 角标          | L4   | `src/components/article/Playground.spec.ts` |

## structures（数据结构互动组件，C-015/016/017/018/019/020/021/022/023/024/025/026/027/028/029/031/032/033/035/036）

| Case ID            | 标题                                             | 层级 | 自动化路径                                       |
| ------------------ | ------------------------------------------------ | ---- | ------------------------------------------------ |
| TC-STACK-LOGIC-01  | 初始空：items 空/top null/canPop F/canPush T     | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-02  | push 追加递增序号、返回值、top 更新              | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-03  | pop 删尾返回原栈顶；空 pop 返回 null             | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-04  | peek 返回栈顶不改 items                          | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-05  | reset 清空且 seq 归零                            | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-06  | canPush 满 STACK_MAX 为 false、push 返回 null    | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-07  | 每个元素 id 唯一                                 | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-STACK-LOGIC-08  | canPop 随空/非空切换                             | L3   | `src/components/structures/useStack.spec.ts`     |
| TC-VIZ-STACKVIZ-01 | 初始空：栈为空 + pop/peek 禁用                   | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-02 | push 增盘子、值为递增序号                        | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-03 | 栈顶 is-top 落在最后压入元素                     | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-04 | 每 item 含「← 栈顶」节点                         | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-05 | pop 减盘子并解说                                 | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-06 | push 到 8 后 push 禁用                           | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-07 | 重置清空                                         | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-VIZ-STACKVIZ-08 | peek 解说栈顶不取走                              | L4   | `src/components/structures/StackViz.spec.ts`     |
| TC-QUEUE-LOGIC-01  | 初始空：front null/canDequeue F/canEnqueue T     | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-02  | enqueue 追加递增序号；front 不变（非空）         | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-03  | dequeue 删队首返回原队首；空 null                | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-04  | peek 返回队首不改 items                          | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-05  | reset 清空且 seq 归零                            | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-06  | canEnqueue 满 QUEUE_MAX false、enqueue null      | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-07  | 每个元素 id 唯一                                 | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-QUEUE-LOGIC-08  | canDequeue 随空/非空切换                         | L3   | `src/components/structures/useQueue.spec.ts`     |
| TC-VIZ-QUEUEVIZ-01 | 初始空：队列为空 + dequeue/peek 禁用             | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-02 | enqueue 增元素、值为递增序号                     | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-03 | 队首 is-front 落 index0、队尾 is-rear 落末位     | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-04 | 每 qitem 含队首/队尾 marker 节点                 | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-05 | dequeue 移队首并解说（新队首=2）                 | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-06 | enqueue 到 6 后 enqueue 禁用                     | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-07 | 重置清空                                         | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-VIZ-QUEUEVIZ-08 | peek 解说队首不取走                              | L4   | `src/components/structures/QueueViz.spec.ts`     |
| TC-ARRAY-LOGIC-01  | 初始 [1,2,3,4]、无选中、can 标志                 | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-02  | valueAt 按下标读、越界 null                      | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-03  | select toggle：选中/再点取消/换选                | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-04  | insert 未选返回 null 且不变                      | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-05  | insert 在 i 插递增值、右移、保持选中、下标≠值    | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-06  | remove 删 i、后续左移、清空选中                  | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-07  | remove 未选返回 null                             | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-08  | append 尾插递增、不动选中                        | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-09  | 满 ARRAY_MAX：canAppend/canInsert F、null        | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-ARRAY-LOGIC-10  | reset 复位 [1,2,3,4]、清选中、下次 append=5      | L3   | `src/components/structures/useArray.spec.ts`     |
| TC-VIZ-ARRAYVIZ-01 | 初始 4 格 + 下标 0..3 + 无选中禁三键             | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-02 | 点格选中：cell/slot is-selected + 启用三键       | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-03 | insert 增元素、新值落 i、下标≠值                 | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-04 | remove 减元素                                    | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-05 | append 尾增（无需选中）                          | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-06 | 下标行数量 = items 数、文本 0..n-1               | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-07 | 满 8 禁插入/追加                                 | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-08 | access 解说含 O(1)                               | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-09 | reset 复位 4 格、清选中                          | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-VIZ-ARRAYVIZ-10 | 删空显示 empty-hint + 禁三键                     | L4   | `src/components/structures/ArrayViz.spec.ts`     |
| TC-LINK-LOGIC-01   | 初始 [1,2,3]、无选中、can 标志                   | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-02   | valueAt 按位置读、越界 null                      | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-03   | select toggle：选中/再点取消/换选                | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-04   | insertAfter 未选返回 null 且不变                 | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-05   | insertAfter 在选中后插递增、选中落 i+1、链序     | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-06   | remove 删选中、清空选中                          | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-07   | remove 未选返回 null                             | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-08   | prepend 头插递增、落表头、选中随之 +1            | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-09   | 满 LINK_MAX：canPrepend/canInsert F、null        | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-LINK-LOGIC-10   | reset 复位 [1,2,3]、清选中、下次 prepend=4       | L3   | `src/components/structures/useLink.spec.ts`      |
| TC-VIZ-LINKVIZ-01  | 初始 3 节点 + head + null + 无选中禁三键         | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-02  | 点节点选中：is-sel + 启用查找/插入/删除          | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-03  | insertAfter 增节点、新值落选中后                 | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-04  | remove 减节点                                    | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-05  | prepend 头插落表头                               | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-06  | 每节点带 next 箭头 + 有 head/null                | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-07  | 满 6 禁插入/头插                                 | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-08  | find 同步解说含 O(n)                             | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-09  | reset 复位 3 节点、清选中                        | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-VIZ-LINKVIZ-10  | 删空显示 empty-hint + 禁三键                     | L4   | `src/components/structures/LinkViz.spec.ts`      |
| TC-TREE-LOGIC-01   | 初始平衡树 50/30/70/20/40/60/80、pos 正确        | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-02   | has 命中/未命中                                  | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-03   | insert 走位落正确 pos + 返回 path                | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-04   | insert 查重返回 dup、不增                        | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-05   | insert 维持 BST：任意插入后 inorder 升序         | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-06   | insert 超 4 层返回 depth                         | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-07   | search 命中返回 found + path                     | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-08   | search 未命中返回 false + 走到空位 path          | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-09   | inorder 初始 = 升序                              | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-TREE-LOGIC-10   | reset 复位 7 节点、清插入                        | L3   | `src/components/structures/useTree.spec.ts`      |
| TC-VIZ-TREEVIZ-01  | 初始 7 节点 + 6 边 + 输入框 + 4 按钮             | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-02  | insert 增节点、含新值                            | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-03  | insert 查重不增、解说已存在                      | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-04  | search 找到解说                                  | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-05  | search 没找到解说                                | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-06  | 中序遍历解说含升序序列                           | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-07  | 超 4 层解说上限                                  | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-08  | reset 复位 7 节点                                | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-09  | 非法值提示、不增                                 | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-VIZ-TREEVIZ-10  | 边数 = 节点数 - 1                                | L4   | `src/components/structures/TreeViz.spec.ts`      |
| TC-HEAPDS-LOGIC-01 | 初始大顶堆 [90,70,80,40,60,30,50]、peek 90       | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-02 | insert 末尾追加（不 sift）、返回新下标           | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-03 | siftUpStep 单步上浮                              | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-04 | 完整插入后仍是大顶堆、root 为最大                | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-05 | extractRoot 取根（最大）、末位补根               | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-06 | 完整弹出后仍是大顶堆、返回最大、新堆顶           | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-07 | siftDownStep 单步下沉                            | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-08 | 不变量：连续插入/弹出后仍大顶堆、peek=max        | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-09 | 边界：满 15 / 空 / id 唯一                       | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-HEAPDS-LOGIC-10 | reset 复位初始堆                                 | L3   | `src/components/structures/useHeap.spec.ts`      |
| TC-VIZ-HEAPVIZ-01  | 初始 7 格 + 7 节点 + 6 边 + 输入框 + 3 按钮      | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-02  | insert 双视图各 +1                               | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-03  | insert 出现新值 95                               | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-04  | extract 双视图各 -1                              | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-05  | extract 解说弹出 + 最大值 90                     | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-06  | 双视图同步：格数 == 节点数                       | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-07  | 边数 = 节点数 - 1                                | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-08  | 非法值提示、不增                                 | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-09  | reset 复位 7 格                                  | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-VIZ-HEAPVIZ-10  | insert 解说含「上浮」                            | L4   | `src/components/structures/HeapViz.spec.ts`      |
| TC-HASH-LOGIC-01   | 初始：7 桶、桶1=[15,8]/桶2=[23]/桶4=[4]、size 4  | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-02   | hash = key % 7                                   | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-03   | has 命中/未命中                                  | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-04   | insert 空桶直放（无冲突）                        | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-05   | insert 冲突追加链尾                              | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-06   | insert 查重不插                                  | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-07   | search 命中返回 bucket + steps                   | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-08   | search 没找到（走完链）                          | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-09   | 满 HASH_MAX / id 唯一                            | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-HASH-LOGIC-10   | reset 复位初始                                   | L3   | `src/components/structures/useHash.spec.ts`      |
| TC-VIZ-HASHVIZ-01  | 初始 7 桶 + 桶1 含 2 项 + 输入框 + 3 按钮        | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-02  | insert 空桶直放                                  | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-03  | insert 冲突追加链尾                              | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-04  | insert 总项数 +1                                 | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-05  | insert 查重不增、解说已存在                      | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-06  | search 命中解说                                  | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-07  | search 没找到解说                                | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-08  | insert 解说含 hash 算式                          | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-09  | 非法值提示、不增                                 | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-VIZ-HASHVIZ-10  | reset 复位 4 项                                  | L4   | `src/components/structures/HashViz.spec.ts`      |
| TC-GRAPH-LOGIC-01  | 图结构：6 顶点、7 边、adj                        | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-02  | labelOf + 顶点坐标                               | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-03  | bfs(0) 顺序 A B C D E F                          | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-04  | dfs(0) 顺序 A B D E F C                          | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-05  | bfs 与 dfs 顺序不同                              | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-06  | bfs 访问全部 6、不重不漏                         | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-07  | dfs 访问全部 6、不重不漏                         | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-08  | bfs 首步 frontier = 队列 [1,2]                   | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-09  | dfs 首步 frontier = 栈 [2,1]                     | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-GRAPH-LOGIC-10  | 换起点 bfs(3) 也访问全部                         | L3   | `src/components/structures/useGraph.spec.ts`     |
| TC-VIZ-GRAPHVIZ-01 | 初始 6 顶点 + 7 边 + 3 按钮 + 默认起点高亮       | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-02 | 顶点标签 A–F                                     | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-03 | 点顶点换起点（唯一 is-start）                    | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-04 | BFS status 含「队列」+ 顺序                      | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-05 | DFS status 含「栈」+ 顺序                        | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-06 | BFS helper-label 含「队列」                      | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-07 | DFS helper-label 含「栈」                        | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-08 | 重置复位（无 current、status 含起点）            | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-09 | 换起点后 BFS 从该点出发                          | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-VIZ-GRAPHVIZ-10 | BFS 与 DFS 顺序不同                              | L4   | `src/components/structures/GraphViz.spec.ts`     |
| TC-BAL-LOGIC-01    | chain 结构：7 节点 1-7、6 边、高度 7、最坏 7     | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-02    | balanced 结构：4/2/6/1/3/5/7、6 边、高度 3       | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-03    | 节点带坐标 + id 唯一                             | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-04    | search(7, chain) 走 7 步                         | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-05    | search(7, balanced) 走 3 步                      | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-06    | chain search 步数 = 值                           | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-07    | balanced：根 1 步、叶 3 步                       | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-BAL-LOGIC-08    | 同值两 mode 步数不同                             | L3   | `src/components/structures/useBalance.spec.ts`   |
| TC-VIZ-BALVIZ-01   | 初始退化：7 节点+6 边+3 按钮+退化 on+读数        | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-02   | 切平衡：readout 3 层/3 次、平衡 on               | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-03   | 退化节点值 1–7                                   | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-04   | 查找 7（退化）status 含「7 步」                  | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-05   | 查找 7（平衡）status 含「3 步」                  | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-06   | 切回退化：readout 回 7 层                        | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-07   | 退化 vs 平衡 readout 不同                        | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-VIZ-BALVIZ-08   | 边数两 mode 均 6                                 | L4   | `src/components/structures/BalanceViz.spec.ts`   |
| TC-PROBE-LOGIC-01  | 初始扁平表 [null,15,8,23,4,null,null]、size 4    | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-02  | 装载因子 4/7、isFull=false                       | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-03  | hash(key)=key%7                                  | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-04  | insert 非冲突：5→格5                             | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-05  | insert 冲突：9→探 2,3,4 落 5                     | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-06  | insert 查重：15 已在 → dup                       | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-07  | search 命中：15→1 步、8→2 步                     | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-08  | search 未命中：99 探到空槽止、steps 5            | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-09  | 填满后 isFull、load=1，insert→full 不死循环      | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-PROBE-LOGIC-10  | reset 复原；has(8)=true、has(99)=false           | L3   | `src/components/structures/useProbe.spec.ts`     |
| TC-VIZ-PROBEVIZ-01 | 初始 7 格+4 filled+3 按钮+readout 4/7            | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-02 | 初始 filled 格含 15/8/23/4                       | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-03 | 插入 5（非冲突）filled→5、status 含「落座」      | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-04 | 插入 9（冲突）filled→5、status 含「探测」        | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-05 | 查找 8（命中）status 含「命中」                  | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-06 | 查找 99（未命中）status 含「不在表中」           | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-07 | 填满后插入 status 含「扩容」、readout 7/7        | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-08 | 重置 filled 回 4、readout 4/7                    | L4   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-DLINK-LOGIC-01  | 初始 items 值 [10,20,30,40]、长度 4              | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-02  | forward = [10,20,30,40]（沿 next）               | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-03  | backward = [40,30,20,10]（沿 prev）              | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-04  | select toggle + hasSelection                     | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-05  | removeAt 中部（选1）：→[10,30,40]、rewire{0,2}   | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-06  | removeAt 头：→[20,30,40]、rewire.left=head       | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-07  | removeAt 尾：→[10,20,30]、rewire.right=tail      | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-08  | removeAt 无选中 → null、items 不变               | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-09  | 删除后 backward 更新（删1后 [40,30,10]）         | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-DLINK-LOGIC-10  | reset 复原 [10,20,30,40]、清选中                 | L3   | `src/components/structures/useDlink.spec.ts`     |
| TC-VIZ-DLINKVIZ-01 | 初始 4 dnode + 双箭头(→/←) + 3 按钮 + head/tail  | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-02 | dnode 值 10/20/30/40                             | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-03 | 点 dnode[1] 选中 is-sel                          | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-04 | 反向遍历：status 含「反向」且「40 → 30」         | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-05 | 删除选中（选1）：dnode→3、status 含 O(1)/prev    | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-06 | 删头删除：首 dnode 变 20、dnode→3                | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-07 | 未选中时删除按钮禁用、dnode 仍 4                 | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-VIZ-DLINKVIZ-08 | 重置回 4 dnode                                   | L4   | `src/components/structures/DlinkViz.spec.ts`     |
| TC-DEQUE-LOGIC-01  | 初始 [1,2,3]、size 3、front 1、back 3            | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-02  | pushBack → 4 落尾：[1,2,3,4]、back 4             | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-03  | pushFront → 4 落头：[4,1,2,3]、front 4           | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-04  | popFront → 1、[2,3]                              | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-05  | popBack → 3、[1,2]                               | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-06  | popFront×3 → isEmpty、front/back null            | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-07  | 满（push 到 6）后 pushBack/pushFront → null      | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-08  | 空时 popFront/popBack → null                     | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-09  | reset 复原 [1,2,3]                               | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-DEQUE-LOGIC-10  | 栈=尾进尾出(LIFO)、队列=尾进头出(FIFO)           | L3   | `src/components/structures/useDeque.spec.ts`     |
| TC-VIZ-DEQUEVIZ-01 | 初始 3 dqitem + 5 按钮 + 头/尾标记               | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-02 | dqitem 值 1/2/3                                  | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-03 | 尾部入：4 dqitem、status 含「尾」                | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-04 | 头部入：4 dqitem、首位=新值、status 含「头」     | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-05 | 头部出：剩 2 dqitem、首位变 2、status 含「头」   | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-06 | 尾部出：剩 2 dqitem、末位变 2、status 含「尾」   | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-07 | 头部出×3 → 空：出队禁用 + empty-hint             | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-VIZ-DEQUEVIZ-08 | 重置回 3 dqitem                                  | L4   | `src/components/structures/DequeViz.spec.ts`     |
| TC-GROW-LOGIC-01   | 初始 cap 4、len 3、items [1,2,3]、计数 0         | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-02   | append 未满：grew false、copies 0、cap 4         | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-03   | append 到满再 append：grew true、copies 4、cap 8 | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-04   | 连续翻倍 4→8→16（append 6 次）                   | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-05   | appends 计数随每次 +1                            | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-06   | totalCopies 累计 = 4+8                           | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-07   | amortized = (appends+totalCopies)/appends        | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-08   | amortized 有界：20 次后 ≤ 3（O(1)）              | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-09   | value = ++seq 递增                               | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-GROW-LOGIC-10   | reset 复原 cap 4 len 3、计数归零                 | L3   | `src/components/structures/useGrow.spec.ts`      |
| TC-VIZ-GROWVIZ-01  | 初始 4 gcell + 3 filled + 追加/重置 + readout    | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-02  | filled 格值 1/2/3                                | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-03  | append 未满：4 filled、status 含 O(1)            | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-04  | append×2 触发扩容：8 gcell、status 含「扩容」    | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-05  | 扩容那次 status 含 O(n)                          | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-06  | stats 含均摊统计（append 次数）                  | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-07  | 连续 append 6 次：容量翻倍到 16（16 gcell）      | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-08  | 重置回 3 filled、4 gcell                         | L4   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-TRIE-LOGIC-01   | nodes 11、edges 10、words 6（排序）              | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-02   | root：char ''、isEnd false、parent -1            | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-03   | 节点带坐标 + id 唯一 + 非 root char 单字符       | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-04   | 共享前缀：search(car)/search(cat) 前 3 同        | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-05   | search('card')：found                            | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-06   | search('ca')：prefix-only（不是词）              | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-07   | search('cab')：no-edge（不存在）                 | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-08   | startsWith('ca') = [car,card,cat]                | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-09   | startsWith('do') = [do,dog]、subtree 2           | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-TRIE-LOGIC-10   | startsWith('xyz')：prefixNode -1、words []       | L3   | `src/components/structures/useTrie.spec.ts`      |
| TC-VIZ-TRIEVIZ-01  | 11 tnode + 10 edge + 输入框 + 3 按钮             | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-02  | 节点字符含 c/a/t/r/d/u/p/o/g                     | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-03  | 查找 card：status 含「是一个词」                 | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-04  | 查找 ca：status 含「前缀」                       | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-05  | 查找 cab：status 含「不存在」                    | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-06  | 前缀 ca：status 含「car」（补全）                | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-07  | 前缀 ca：子树点亮 .tnode.lit = 4                 | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-VIZ-TRIEVIZ-08  | 重置：清高亮                                     | L4   | `src/components/structures/TrieViz.spec.ts`      |
| TC-UF-LOGIC-01     | 初始 parent [0..7]、groupCount 8                 | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-02     | union(0,1)：merged、parent[0]=1、组 7            | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-03     | union 同组：merged false、组不减                 | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-04     | 链后 find(0)：root 3、path [0,1,2,3]             | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-05     | find 纯走位不改 parent                           | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-06     | compress(0)（链后）：parent[0/1/2]=3             | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-07     | connected：(0,1)true、(0,2)false                 | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-08     | connected 经链：connected(0,3) true              | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-09     | groupCount 随 union 递减（3 次后 5）             | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-10     | reset 复原 parent [0..7]、groupCount 8           | L3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-VIZ-UFVIZ-01    | 8 ufnode + 两输入 + 4 按钮 + readout 含 8        | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-02    | 节点标 0..7                                      | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-03    | 合并 0,1：readout 含 7、uf-edge 1                | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-04    | 合并链：uf-edge 3、readout 含 5                  | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-05    | 链后查根 0：status 含「压缩」                    | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-06    | 连通?（同组）：status 含「同根」                 | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-07    | 连通?（异组）：status 含「根不同」               | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-VIZ-UFVIZ-08    | 重置：8 ufnode、0 uf-edge、readout 含 8          | L4   | `src/components/structures/UnionFindViz.spec.ts` |
| TC-LRU-LOGIC-01    | 初始 keys [3,2,1]、size 3、capacity 4            | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-02    | get(1) 命中：type hit、value 10                  | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-03    | get(1) 移最前：keys [1,3,2]                      | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-04    | get(9) 未命中：type miss、不变                   | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-05    | put(4,40) 新键未满：put-new、keys[0]=4、size 4   | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-06    | put(2,99) 更新：put-update、(2,99)、size 3       | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-07    | put 满后淘汰：put(4);put(5) → evicted 1          | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-08    | 淘汰 LRU 末位：07 后 keys [5,4,3,2]              | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-09    | 连续 put 5 新键：size ≤ 4                        | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-LRU-LOGIC-10    | reset 复原 keys [3,2,1]、size 3                  | L3   | `src/components/structures/useLRU.spec.ts`       |
| TC-VIZ-LRUVIZ-01   | 3 lru-cell + 两输入 + 3 按钮 + MRU/LRU 标记      | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-02   | cell 键含 3/2/1                                  | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-03   | get(1) 命中：status 含「找到」、首键 1           | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-04   | get(9) 未命中：status 含「没有」                 | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-05   | put(4,40) 新键：4 cell、首键 4                   | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-06   | put 满后淘汰：status 含「淘汰」、cell 仍 4       | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-07   | put(2,99) 更新：status 含「更新」                | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-VIZ-LRUVIZ-08   | 重置：3 lru-cell                                 | L4   | `src/components/structures/LruViz.spec.ts`       |
| TC-SKIP-LOGIC-01   | nodes 9（head+8）、maxLevel 4、元素 [1..15 奇]   | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-02   | 元素 heights [4,1,2,1,3,1,2,1]、head 4           | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-03   | 各层元素数 L0 8、L1 4、L2 2、L3 1                | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-04   | search(11) found                                 | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-05   | search(11) visitedValues [1,9,11]                | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-06   | search(8) not found、visited [1,5,7]             | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-07   | search(1) found                                  | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-08   | search(15) found、visited [1,9,13,15]            | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-09   | search(99) not found                             | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-SKIP-LOGIC-10   | path level 单调不增、move 合法                   | L3   | `src/components/structures/useSkipList.spec.ts`  |
| TC-VIZ-SKIPVIZ-01  | 网格 19 skip-cell + 输入 + 查找/重置 + head      | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-02  | 元素值 1..15 出现                                | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-03  | 查找 11：status 含「跳过」「找到了」             | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-04  | 查找 8：status 含「没找到」                      | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-05  | 查找 11：路径点亮 skip-cell.lit > 0              | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-06  | 查找 15：status 含「找到了」                     | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-07  | 查找 99：status 含「没找到」                     | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-VIZ-SKIPVIZ-08  | 重置：清高亮（lit/hot 为 0）                     | L4   | `src/components/structures/SkipListViz.spec.ts`  |
| TC-SEG-LOGIC-01    | 建树 15 节点、root sum 37、root [0,7]            | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-02    | 叶子 pos 7..14 还原原数组、均 isLeaf             | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-03    | 节点管辖区间 [lo,hi]（pos1/2/4/10）              | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-04    | 内部节点聚合和 [12,25,7,5,12,13]                 | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-05    | query(2,5) → sum 17、covered [4,5]               | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-06    | query(0,7) → sum 37、covered [0]                 | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-07    | query(3,3) → sum 4、covered [10]                 | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-08    | query(1,6) → sum 29、covered 4 段                | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-09    | update(2,10) → path [9,4,1,0]、root 46、pos4 14  | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-10    | update(2,10) 后 query(2,5) → 26                  | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-SEG-LOGIC-11    | reset 复原 root 37、query(2,5) 回 17             | L3   | `src/components/structures/useSegTree.spec.ts`   |
| TC-VIZ-SEGVIZ-01   | 15 seg-node + 14 seg-edge + a/b 输入 + 三按钮    | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-02   | 节点显聚合和（root 37、叶 9）                    | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-03   | 区间和 2,5：status 含 17、covered 2 个           | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-04   | 区间和 0,7：status 含 37、covered 1 个           | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-05   | 区间和 3,3：status 含 4                          | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-06   | 更新 2→10：status 含「更新」、节点出现 46        | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-07   | 更新 2→10：路径点亮 onpath 4 个                  | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-VIZ-SEGVIZ-08   | 重置：清高亮 + 复原 37                           | L4   | `src/components/structures/SegTreeViz.spec.ts`   |
| TC-BTREE-LOGIC-01  | 结构 4 节点、root [25,45]、非叶、3 子            | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-02  | 叶子 keys + 均 isLeaf                            | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-03  | 叶链 next（l0→l1→l2→null）                       | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-04  | search(30) 命中、路径 [root,l1]                  | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-05  | search(33) 未命中、路径到 l1                     | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-06  | search(5) 落最左叶 l0                            | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-07  | search(60) 落最右叶 l2                           | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-08  | search(100) 未命中落 l2                          | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-09  | rangeScan(12,38) 跨两叶 [15,20,25,30,35]         | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-10  | rangeScan(48,99) 仅右叶 [50,55,60]               | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-11  | rangeScan(5,60) 全表 12 值 3 叶                  | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-BTREE-LOGIC-12  | rangeScan(100,200) 空命中、定位 l2               | L3   | `src/components/structures/useBTree.spec.ts`     |
| TC-VIZ-BTREEVIZ-01 | 4 bt-node+14 bt-key+2 bt-link+a/b+三按钮         | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-02 | key 格显数字（5/25/60）                          | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-03 | 查找 30：status「找到了」、hit 1                 | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-04 | 查找 30：下钻路径 onpath 2                       | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-05 | 查找 33：status「不存在」、hit 0                 | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-06 | 查找 5：落最左叶、status「找到了」               | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-07 | 范围查 12,38：status「扫到」、inrange 5          | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-08 | 范围查 48,99：inrange 3                          | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-VIZ-BTREEVIZ-09 | 重置：清高亮（hit/onpath 0）                     | L4   | `src/components/structures/BTreeViz.spec.ts`     |
| TC-BLOOM-LOGIC-01  | 初始 16 位全 0、size 16、k 3                     | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-02  | hashes(3)=[3,5,6]                                | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-03  | hashes(7)=[7,1,2]、hashes(11)=[11,13,14]         | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-04  | add(3) 置位 [3,5,6]                              | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-05  | add 3/7/11 后并集 9 位                           | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-06  | query(7) 真命中（非误判）                        | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-07  | query(5) 一定不存在（bit12=0）                   | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-08  | query(2) 误判（falsePositive）                   | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-09  | query(4) 未命中有 0                              | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-10  | add 幂等                                         | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-11  | 空表 query(7) 一定不存在                         | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-BLOOM-LOGIC-12  | reset 清零、其后 query(7) 不存在                 | L3   | `src/components/structures/useBloom.spec.ts`     |
| TC-VIZ-BLOOMVIZ-01 | 16 bit-cell + a 输入 + 加入/查询/重置 按钮       | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-02 | 初始 set 0                                       | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-03 | 加入 3：set 3 + status「加入」                   | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-04 | 加入 3/7/11：set 9                               | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-05 | 查询 7：「可能存在」且不含「误判」               | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-06 | 查询 5：「一定不存在」                           | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-07 | 查询 2：「误判」                                 | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-08 | 查询 7：探测位 probe 3                           | L4   | `src/components/structures/BloomViz.spec.ts`     |
| TC-VIZ-BLOOMVIZ-09 | 重置：清空 set/probe                             | L4   | `src/components/structures/BloomViz.spec.ts`     |

## article-ds（数据结构文章页，C-015/016/017/018/019/020/021/022/023/024/025/026/027/028/029/031/032/033/035/036）

| Case ID           | 标题                                                            | 层级 | 自动化路径                                            |
| ----------------- | --------------------------------------------------------------- | ---- | ----------------------------------------------------- |
| TC-VIEW-STACK-01  | 挂载渲染 Article + StackViz                                     | L4   | `src/views/Article/DataStructure/Stack.spec.ts`       |
| TC-VIEW-STACK-02  | 含「栈」标题与 Playground                                       | L4   | `src/views/Article/DataStructure/Stack.spec.ts`       |
| TC-E2E-STACK-01   | 栈知识页：正文+互动栈/push/栈顶跟随/pop/重置空态                | L5   | `e2e/stack.e2e.ts`                                    |
| TC-VIEW-QUEUE-01  | 挂载渲染 Article + QueueViz                                     | L4   | `src/views/Article/DataStructure/Queue.spec.ts`       |
| TC-VIEW-QUEUE-02  | 含「队列」标题与 Playground                                     | L4   | `src/views/Article/DataStructure/Queue.spec.ts`       |
| TC-E2E-QUEUE-01   | 队列知识页：正文+互动队列/enqueue/双指针/dequeue/重置           | L5   | `e2e/queue.e2e.ts`                                    |
| TC-VIEW-ARRAY-01  | 挂载渲染 Article + ArrayViz                                     | L4   | `src/views/Article/DataStructure/Array.spec.ts`       |
| TC-VIEW-ARRAY-02  | 含「数组」标题与 Playground                                     | L4   | `src/views/Article/DataStructure/Array.spec.ts`       |
| TC-E2E-ARRAY-01   | 数组知识页：正文+互动数组/点选下标/插入右移/尾部追加/重置       | L5   | `e2e/array.e2e.ts`                                    |
| TC-VIEW-LINK-01   | 挂载渲染 Article + LinkViz                                      | L4   | `src/views/Article/DataStructure/Link.spec.ts`        |
| TC-VIEW-LINK-02   | 含「链表」标题与 Playground                                     | L4   | `src/views/Article/DataStructure/Link.spec.ts`        |
| TC-E2E-LINK-01    | 链表知识页：正文+互动链表/点节点选中/选中后插入/头插/重置       | L5   | `e2e/link.e2e.ts`                                     |
| TC-VIEW-TREE-01   | 挂载渲染 Article + TreeViz                                      | L4   | `src/views/Article/DataStructure/Tree.spec.ts`        |
| TC-VIEW-TREE-02   | 含「树」标题与 Playground                                       | L4   | `src/views/Article/DataStructure/Tree.spec.ts`        |
| TC-E2E-TREE-01    | 树知识页：正文+互动 BST/输入插入走位/中序=升序/重置             | L5   | `e2e/tree.e2e.ts`                                     |
| TC-VIEW-HEAPDS-01 | 挂载渲染 Article + HeapViz                                      | L4   | `src/views/Article/DataStructure/Heap.spec.ts`        |
| TC-VIEW-HEAPDS-02 | 含「堆」标题与 Playground                                       | L4   | `src/views/Article/DataStructure/Heap.spec.ts`        |
| TC-E2E-HEAPDS-01  | 堆知识页：正文+互动堆/数组+树双视图/插入上浮/重置               | L5   | `e2e/heap.e2e.ts`                                     |
| TC-VIEW-HASH-01   | 挂载渲染 Article + HashViz                                      | L4   | `src/views/Article/DataStructure/Hash.spec.ts`        |
| TC-VIEW-HASH-02   | 含「哈希表」标题与 Playground                                   | L4   | `src/views/Article/DataStructure/Hash.spec.ts`        |
| TC-E2E-HASH-01    | 哈希表知识页：正文+互动哈希/散列直达/冲突追加/重置              | L5   | `e2e/hash.e2e.ts`                                     |
| TC-VIEW-GRAPH-01  | 挂载渲染 Article + GraphViz                                     | L4   | `src/views/Article/DataStructure/Graph.spec.ts`       |
| TC-VIEW-GRAPH-02  | 含「图」标题与 Playground                                       | L4   | `src/views/Article/DataStructure/Graph.spec.ts`       |
| TC-E2E-GRAPH-01   | 图知识页：正文+互动图/BFS 队列遍历/重置                         | L5   | `e2e/graph.e2e.ts`                                    |
| TC-VIEW-TREE-03   | 树页含 BalanceViz（平衡节，C-023）                              | L4   | `src/views/Article/DataStructure/Tree.spec.ts`        |
| TC-E2E-TREE-02    | 树页·平衡节：退化↔平衡对照 + 查找走位（C-023）                  | L5   | `e2e/tree.e2e.ts`                                     |
| TC-VIEW-HASH-03   | 哈希页含 HashProbeViz（开放寻址节，C-024）                      | L4   | `src/views/Article/DataStructure/Hash.spec.ts`        |
| TC-E2E-HASH-02    | 哈希页·开放寻址节：扁平表/线性探测插入/未命中/重置（C-024）     | L5   | `e2e/hash.e2e.ts`                                     |
| TC-VIEW-LINK-03   | 链表页含 DlinkViz（双向链表节，C-025）                          | L4   | `src/views/Article/DataStructure/Link.spec.ts`        |
| TC-E2E-LINK-02    | 链表页·双向节：4 节点/反向遍历/点节点 O(1) 删除/重置（C-025）   | L5   | `e2e/link.e2e.ts`                                     |
| TC-VIEW-QUEUE-03  | 队列页含 DequeViz（双端队列节，C-026）                          | L4   | `src/views/Article/DataStructure/Queue.spec.ts`       |
| TC-E2E-QUEUE-02   | 队列页·双端节：3 元素/头部入/尾部出/重置（C-026）               | L5   | `e2e/queue.e2e.ts`                                    |
| TC-VIEW-ARRAY-03  | 数组页含 ArrayGrowViz（扩容节，C-027）                          | L4   | `src/views/Article/DataStructure/Array.spec.ts`       |
| TC-E2E-ARRAY-02   | 数组页·扩容节：容量满了翻倍扩容 + 均摊 O(1)（C-027）            | L5   | `e2e/array.e2e.ts`                                    |
| TC-VIEW-TRIE-01   | 挂载渲染 Article + TrieViz（C-028）                             | L4   | `src/views/Article/DataStructure/Trie.spec.ts`        |
| TC-VIEW-TRIE-02   | 含「字典树」标题与 Playground（C-028）                          | L4   | `src/views/Article/DataStructure/Trie.spec.ts`        |
| TC-E2E-TRIE-01    | 字典树页：11 节点/查找三结局/前缀补全/重置（C-028）             | L5   | `e2e/trie.e2e.ts`                                     |
| TC-VIEW-UF-01     | 挂载渲染 Article + UnionFindViz（C-029）                        | L4   | `src/views/Article/DataStructure/UnionFind.spec.ts`   |
| TC-VIEW-UF-02     | 含「并查集」标题与 Playground（C-029）                          | L4   | `src/views/Article/DataStructure/UnionFind.spec.ts`   |
| TC-E2E-UF-01      | 并查集页：8 节点/合并/连通判定/重置（C-029）                    | L5   | `e2e/union-find.e2e.ts`                               |
| TC-VIEW-LRU-01    | 挂载渲染 Article + LruViz（C-031）                              | L4   | `src/views/Article/DataStructure/Lru.spec.ts`         |
| TC-VIEW-LRU-02    | 含「LRU」标题与 Playground（C-031）                             | L4   | `src/views/Article/DataStructure/Lru.spec.ts`         |
| TC-E2E-LRU-01     | LRU 页：3 cell/get 跳最前/put 满淘汰/重置（C-031）              | L5   | `e2e/lru.e2e.ts`                                      |
| TC-VIEW-SKIP-01   | 挂载渲染 Article + SkipListViz（C-032）                         | L4   | `src/views/Article/DataStructure/SkipList.spec.ts`    |
| TC-VIEW-SKIP-02   | 含「跳表」标题与 Playground（C-032）                            | L4   | `src/views/Article/DataStructure/SkipList.spec.ts`    |
| TC-E2E-SKIP-01    | 跳表页：cell/查找命中/未命中/重置（C-032）                      | L5   | `e2e/skip-list.e2e.ts`                                |
| TC-VIEW-SEG-01    | 挂载渲染 Article + SegTreeViz + Playground（C-033）             | L4   | `src/views/Article/DataStructure/SegmentTree.spec.ts` |
| TC-VIEW-SEG-02    | 含「线段树」标题与互动容器（15 节点）（C-033）                  | L4   | `src/views/Article/DataStructure/SegmentTree.spec.ts` |
| TC-E2E-SEG-01     | 线段树页：15 节点/区间和「17」/更新「更新」/重置（C-033）       | L5   | `e2e/segment-tree.e2e.ts`                             |
| TC-VIEW-BTREE-01  | 挂载渲染 Article + BTreeViz + Playground（C-035）               | L4   | `src/views/Article/DataStructure/BTree.spec.ts`       |
| TC-VIEW-BTREE-02  | 含「B 树」标题与互动容器（4 节点）（C-035）                     | L4   | `src/views/Article/DataStructure/BTree.spec.ts`       |
| TC-E2E-BTREE-01   | B+ 树页：4 节点/查找「找到了」/范围「扫到」/重置（C-035）       | L5   | `e2e/b-tree.e2e.ts`                                   |
| TC-VIEW-BLOOM-01  | 挂载渲染 Article + BloomViz + Playground（C-036）               | L4   | `src/views/Article/DataStructure/BloomFilter.spec.ts` |
| TC-VIEW-BLOOM-02  | 含「布隆过滤器」标题与互动容器（16 位）（C-036）                | L4   | `src/views/Article/DataStructure/BloomFilter.spec.ts` |
| TC-E2E-BLOOM-01   | 布隆页：16 格/加 3·7·11/查「可能存在」/查「误判」/重置（C-036） | L5   | `e2e/bloom-filter.e2e.ts`                             |

## article-algo（图算法 C-037~052 + 动态规划 C-053/054；Dijkstra 于 C-047、Kruskal 于 C-048 返工进播放器）

> M6 阶段一 G1 · 新增第 3 个顶层分类「图算法」。useDijkstra/useKruskal 物理在 `components/structures/`，页在 `views/Article/Algorithm/`。
> **C-047（M8②-1）**：Dijkstra 页返工进 AlgorithmPlayer——新增 `dijkstra.module`（细粒度重走 32 步，复用 useDijkstra 图 + oracle）走 GraphView 图轨（见 viz-engine 段 `TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*`）；`DijkstraViz.vue`/spec 删除，8 个 `TC-VIZ-DIJKSTRAVIZ-*` **superseded**；`TC-VIEW-DIJKSTRA-01/02` 改写 + 新增 -03；`TC-E2E-DIJKSTRA-01` 改写。useDijkstra 保留复用。
> **C-048（M8②-2 · 收官 M8）**：Kruskal 页同法返工——新增 `kruskal.module`（并查集细粒度重走 20 步，复用 useKruskal 图 + oracle）走 **GraphView 无向图轨（零改动复用 C-047）**；`KruskalViz.vue`/spec 删除，8 个 `TC-VIZ-KRUSKALVIZ-*` **superseded**；`TC-VIEW-KRUSKAL-01/02` 改写 + 新增 -03；`TC-E2E-KRUSKAL-01` 改写。useKruskal 保留复用。**至此 M8 全收官。**
> **C-049（M6 图算法 G7 · 新页）**：Prim 最小生成树新页——`prim.module`（从起点 A 生长选最小横切边 12 步，**复用 useKruskal 同一张图** + oracle）走 **GraphView 无向图轨（零改动复用，第 3 消费者）**；与 Kruskal 配对「同图两策略」，MST 同集不同序（权 18）。新页 + 路由/菜单/首页接线 + 新 `prim.svg` + 改 `TC-HOOK-01-1/02-1`（图算法 2→3）。`TC-PRIM-MOD-*` + `TC-VIEW-PRIM-*` + `TC-E2E-PRIM-01`。
> **C-050（M6 图算法 G3 · 新页）**：Bellman-Ford 最短路新页——`bellman-ford.module`（新建含负权固定有向图 5 点 7 边 B→C=-3/D→E=-2 无负环，V−1=4 轮盲扫松弛 34 步 + oracle）走 **GraphView 有向图轨（零改动复用，第 4 消费者）**；与 Dijkstra 配对「正权贪心 vs 负权松弛」，dist=[0,4,1,3,1]、边序逆序演示 V−1 轮。新页 + 路由/菜单/首页接线 + 新 `bellman.svg` + 改 `TC-HOOK-01-1/02-1`（图算法 3→4）。`TC-BELLMAN-MOD-*` + `TC-VIEW-BELLMAN-*` + `TC-E2E-BELLMAN-01`。
> **C-051（M6 图算法 G5 · 新页 · 三大范式收官）**：拓扑排序新页——`topo.module`（新建非平凡 DAG 6 点 7 边，Kahn 取入度 0 输出 + 后继减度 14 步 + oracle，拓扑序 C→A→E→B→D→F）走 **GraphView 有向图轨（第 5 消费者：nodeBadge=入度、doneNodes=输出序）**；GraphView.vue 零改动，仅 `GraphTrack.edges.w` 放宽为可选以支持无权图（向后兼容）。新页 + 路由/菜单/首页接线 + 新 `topo.svg` + 改 `TC-HOOK-01-1/02-1`（图算法 4→5）。`TC-TOPO-MOD-*` + `TC-VIEW-TOPO-*` + `TC-E2E-TOPO-01`。
> **C-052（M6 图算法 G4 · 新页 · 新 MatrixView 轨）**：Floyd-Warshall 全源最短路新页——**新建第 8 条 MatrixView 矩阵轨**（通用 n×n 原语：cells + 中转 k 行列高亮 + active/sources 单元 + 更新绿，见 viz-engine 段 `TC-VIZ-MATRIXVIEW-*`/`TC-PLAYER-MATRIX-*`；为 DP 大类铺路）。`floyd.module`（固定 4 点 6 边含环有向图，三重循环重走 19 步 + oracle，终态全源矩阵 [0,3,5,6/8,0,2,3/6,9,0,1/5,8,10,0]）。既有 7 轨零改动、AlgorithmPlayer 仅 additive 加 v-if。新页 + 路由/菜单/首页接线 + 新 `floyd.svg` + 改 `TC-HOOK-01-1/02-1`（图算法 5→6）。`TC-FLOYD-MOD-*` + `TC-VIEW-FLOYD-*` + `TC-E2E-FLOYD-01`。
> **C-053（M6 动态规划大类首发 · 新页）**：编辑距离（Levenshtein）——开第 4 顶层大类「动态规划」，最经典二维矩阵 DP。**复用 C-052 MatrixView 矩阵轨**（首个 DP 消费者），小扩展 +rowLabels/colLabels（行列异标签，见 viz-engine 段 `TC-VIZ-MATRIXVIEW-05/06`）+emptyText（未填格空白），additive、Floyd 零改动。`editdist.module`（SAT→SUN 4×4 DP 表逐格填 11 步 + oracle，编辑距离=2）。新页 + 路由 + 菜单/首页 +「动态规划」大类 + 新 `editdist.svg` + 改 `TC-HOOK-01-1/02-1`（分类 3→4）。`TC-EDIT-MOD-*` + `TC-VIEW-EDIT-*` + `TC-E2E-EDIT-01`。
> **C-054（M6 动态规划 DP2 · 新页）**：0-1 背包——动态规划大类第 2 页，优化/取舍类（max 递推），与编辑距离配对「优化 DP vs 序列对齐 DP」。**纯复用 MatrixView 矩阵轨零改动**（行=物品/列=容量，行列异标签+空白 C-053 已支持，第 3 消费者验证数值轴 DP）。`knapsack.module`（固定 4 物品+容量 5，5×6 DP 表逐格填 22 步 + oracle，最优值=7 选 A+B）。新页 + 路由 + 菜单/首页「动态规划」+0-1 背包 + 新 `knapsack.svg` + 改 `TC-HOOK-01-1/02-1`（动态规划 1→2）。`TC-KNAP-MOD-*` + `TC-VIEW-KNAP-*` + `TC-E2E-KNAP-01`。

| Case ID               | 标题                                                                                               | 层级 | 自动化路径                                      |
| --------------------- | -------------------------------------------------------------------------------------------------- | ---- | ----------------------------------------------- |
| TC-DIJKSTRA-01        | 图规模与标签（6 点 A–F、9 边、源 0）                                                               | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-02        | 出边邻接                                                                                           | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-03        | 确定顺序 [0,2,1,3,4,5]                                                                             | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-04        | 最终距离 [0,3,1,4,7,9]                                                                             | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-05        | 前驱表 [null,2,0,1,3,4]                                                                            | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-06        | 最短路还原 F = [0,2,1,3,4,5]                                                                       | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-07        | 最短路还原 E = [0,2,1,3,4]                                                                         | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-08        | steps 长度 7                                                                                       | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-09        | 初始步 settled 空、dist[0]=0 余 ∞                                                                  | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-10        | 确定 C 后 steps[2]                                                                                 | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-11        | 松弛更新 D：steps[3] dist[3]→4                                                                     | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-12        | 终步 6 点全确定                                                                                    | L3   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-MOD-01    | 末步 nodeBadge = oracle dist [0,3,1,4,7,9]（C-047）                                                | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-02    | 每步执行点合法且带 graph 轨（array:[]）（C-047）                                                   | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-03    | 确定 6 点 #selectMin==#settle==6（C-047）                                                          | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-04    | 松弛守恒 #relaxEdge==#relaxUpdate+#relaxSkip（C-047）                                              | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-05    | init 步 dist[A]=0 其余 ∞（C-047）                                                                  | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-06    | 确定顺序 settle activeNode=[0,2,1,3,4,5]（C-047）                                                  | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-07    | 首个 relaxUpdate B=4（出边序）；A→C 后 C=1（C-047）                                                | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-08    | done 最短路树 tree 边恰 5（C-047）                                                                 | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-09    | done 步 doneNodes 长度 6（C-047）                                                                  | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-10    | 四语言 sources + 行号在范围内（C-047）                                                             | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-DIJKSTRA-MOD-11    | module 元信息 title 含 Dijkstra、initialInput()=[]（C-047）                                        | L3   | `src/algorithms/dijkstra.module.spec.ts`        |
| TC-VIZ-DIJKSTRAVIZ-01 | ~~6 dvert + 9 dedge + 距离表 6 格 + 下一步/重置~~ (superseded C-047)                               | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-02 | ~~初始距离表 0 + ∞、settled 0~~ (superseded C-047)                                                 | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-03 | ~~下一步×1：确定 A、settled 1、现 4 与 1~~ (superseded C-047)                                      | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-04 | ~~下一步×2：B 由 4 松弛到 3~~ (superseded C-047)                                                   | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-05 | ~~下一步×1：松弛边点亮 ≥1~~ (superseded C-047)                                                     | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-06 | ~~走到底：settled 6、现 9、status「最短」~~ (superseded C-047)                                     | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-07 | ~~走到底：最短路树点亮 ≥1~~ (superseded C-047)                                                     | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIZ-DIJKSTRAVIZ-08 | ~~重置：清空 settled、距离表回 ∞~~ (superseded C-047)                                              | L4   | `src/components/structures/DijkstraViz.spec.ts` |
| TC-VIEW-DIJKSTRA-01   | 挂载渲染 Article + AlgorithmPlayer（C-047 返工，不再含 DijkstraViz）                               | L4   | `src/views/Article/Algorithm/Dijkstra.spec.ts`  |
| TC-VIEW-DIJKSTRA-02   | h1 含「Dijkstra」+ GraphView + 6 .graph-node + 无 .bars-view（C-047）                              | L4   | `src/views/Article/Algorithm/Dijkstra.spec.ts`  |
| TC-VIEW-DIJKSTRA-03   | 全模板同屏：Article 含「最短」+ ≥9 .graph-edge（C-047）                                            | L4   | `src/views/Article/Algorithm/Dijkstra.spec.ts`  |
| TC-E2E-DIJKSTRA-01    | Dijkstra 全模板：图轨 6 点 9 边 / 拖末步 6 绿点 + 5 绿树边 / Shiki（C-047 改写）                   | L5   | `e2e/dijkstra.e2e.ts`                           |
| TC-KRUSKAL-01         | 图规模与标签（6 点 9 边）                                                                          | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-02         | 边已按权升序（[1..9]、AC 首）                                                                      | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-03         | MST 边集 [AC,BC,DE,BD,DF]                                                                          | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-04         | MST 总权重 18                                                                                      | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-05         | steps 长度 10                                                                                      | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-06         | 初始步 mst 空、weight 0                                                                            | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-07         | 加入 B-C：steps[2]                                                                                 | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-08         | 成环跳过 A-B：steps[4]                                                                             | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-09         | 加入 B-D：steps[5] 含 BD、weight 11                                                                | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-10         | 完成步 D-F：steps[7] mst 5、weight 18                                                              | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-11         | 成环边集 [AB,CE,EF,CD]                                                                             | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-12         | 末步权重稳定 mst 5、weight 18                                                                      | L3   | `src/components/structures/useKruskal.spec.ts`  |
| TC-KRUSKAL-MOD-01     | 末步 mst 边（edgeClass=mst）= oracle [AC,BC,DE,BD,DF]（C-048）                                     | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-02     | 每步执行点合法且带 graph 无向轨（array:[]）（C-048）                                               | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-03     | 考虑 9 边 #consider==9（C-048）                                                                    | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-04     | 接受/拒绝守恒 #accept==5、#reject==4（C-048）                                                      | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-05     | init 步 edgeClass 全空、doneNodes 空（C-048）                                                      | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-06     | 首个 accept（AC 权1）后 edgeClass[AC]=mst、权重=1（C-048）                                         | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-07     | 首个 reject（AB 权4）后 edgeClass[AB]=rejected（C-048）                                            | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-08     | 每个 consider 步当前边 edgeClass=current（C-048）                                                  | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-09     | done 步 mst 恰 5、rejected 恰 4（C-048）                                                           | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-10     | done 步总权 18、doneNodes 含全 6 点（C-048）                                                       | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-11     | 四语言 sources + 行号在范围内（C-048）                                                             | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-KRUSKAL-MOD-12     | module 元信息 title 含 Kruskal、initialInput()=[]（C-048）                                         | L3   | `src/algorithms/kruskal.module.spec.ts`         |
| TC-VIZ-KRUSKALVIZ-01  | ~~6 kvert + 9 kedge + 边列表 9 行 + 下一步/重置~~ (superseded C-048)                               | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-02  | ~~初始无 MST~~ (superseded C-048)                                                                  | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-03  | ~~下一步×1：加入、status「加入」~~ (superseded C-048)                                              | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-04  | ~~下一步×4：成环跳过、cycle ≥1、mst 3~~ (superseded C-048)                                         | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-05  | ~~下一步×4：当前考虑边高亮 ≥1~~ (superseded C-048)                                                 | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-06  | ~~走到底：mst 5、status「18」~~ (superseded C-048)                                                 | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-07  | ~~走到底：成环 4 条~~ (superseded C-048)                                                           | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIZ-KRUSKALVIZ-08  | ~~重置：mst 清空~~ (superseded C-048)                                                              | L4   | `src/components/structures/KruskalViz.spec.ts`  |
| TC-VIEW-KRUSKAL-01    | 挂载渲染 Article + AlgorithmPlayer（C-048 返工，不再含 KruskalViz）                                | L4   | `src/views/Article/Algorithm/Kruskal.spec.ts`   |
| TC-VIEW-KRUSKAL-02    | h1 含「Kruskal」+ GraphView + 6 .graph-node + 无 .bars-view（C-048）                               | L4   | `src/views/Article/Algorithm/Kruskal.spec.ts`   |
| TC-VIEW-KRUSKAL-03    | 全模板同屏：Article 含「最小生成树」+ ≥9 .graph-edge（C-048）                                      | L4   | `src/views/Article/Algorithm/Kruskal.spec.ts`   |
| TC-E2E-KRUSKAL-01     | Kruskal 全模板：图轨 6 点 9 边 / 拖末步 5 mst + 4 rejected 边 / Shiki（C-048 改写）                | L5   | `e2e/kruskal.e2e.ts`                            |
| TC-PRIM-MOD-01        | 末步 mst 边 = oracle primTrace().mstEdges（C-049）                                                 | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-02        | 与 Kruskal 同一张图 → 同 MST 集（序可不同）（C-049）                                               | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-03        | 每步执行点合法且带无向图轨（array:[]、directed=false）（C-049）                                    | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-04        | 生长 5 边 #selectEdge==5、#addVertex==5（C-049）                                                   | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-05        | init 步 doneNodes=[0]、无 mst 边（C-049）                                                          | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-06        | 每个 selectEdge 步唯一 1 条 current 且横切（C-049）                                                | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-07        | 首个 addVertex 并入 C(2)、edgeClass[AC]=mst、权重=1（C-049）                                       | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-08        | 生长顺序：新增点序列 = [C,B,D,E,F]（C-049）                                                        | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-09        | done 步 mst 恰 5（C-049）                                                                          | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-10        | done 步总权 18、doneNodes 含全 6 点（C-049）                                                       | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-11        | 四语言 sources + 行号在范围内（C-049）                                                             | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-PRIM-MOD-12        | module 元信息 title 含 Prim、initialInput()=[]（C-049）                                            | L3   | `src/algorithms/prim.module.spec.ts`            |
| TC-VIEW-PRIM-01       | 挂载渲染 Article + AlgorithmPlayer（C-049）                                                        | L4   | `src/views/Article/Algorithm/Prim.spec.ts`      |
| TC-VIEW-PRIM-02       | h1 含「Prim」+ GraphView + 6 .graph-node + 无 .bars-view（C-049）                                  | L4   | `src/views/Article/Algorithm/Prim.spec.ts`      |
| TC-VIEW-PRIM-03       | 全模板同屏：Article 含「最小生成树」+ ≥9 .graph-edge（C-049）                                      | L4   | `src/views/Article/Algorithm/Prim.spec.ts`      |
| TC-E2E-PRIM-01        | Prim 全模板：图轨 6 点 9 边 / 拖末步 5 mst + 6 点全绿 + 字幕 18 / Shiki（C-049 新增）              | L5   | `e2e/prim.e2e.ts`                               |
| TC-BELLMAN-MOD-01     | 末步 nodeBadge 数值 = oracle dist [0,4,1,3,1]（C-050）                                             | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-02     | 每步执行点合法且带有向图轨（array:[]、directed=true）（C-050）                                     | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-03     | V−1 轮 #roundStart==4（C-050）                                                                     | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-04     | 松弛统计 #relaxUpdate==8、#relaxSkip==20（C-050）                                                  | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-05     | init 步 dist[A]=0、其余 ∞（C-050）                                                                 | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-06     | 逐轮 dist：各 roundStart nodeBadge = 进入该轮 dist（C-050）                                        | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-07     | 首个 relaxUpdate（B←A）后 nodeBadge[1]=4（C-050）                                                  | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-08     | dist 单调不增（松弛不变量）（C-050）                                                               | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-09     | done 最短路树 tree 恰 4：{0-1,1-2,2-3,3-4}（C-050）                                                | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-10     | 含负权边 B→C=-3、D→E=-2；done doneNodes 全 5 点（C-050）                                           | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-11     | 四语言 sources + 行号在范围内（C-050）                                                             | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-BELLMAN-MOD-12     | module 元信息 title 含 Bellman、initialInput()=[]（C-050）                                         | L3   | `src/algorithms/bellman-ford.module.spec.ts`    |
| TC-VIEW-BELLMAN-01    | 挂载渲染 Article + AlgorithmPlayer（C-050）                                                        | L4   | `src/views/Article/Algorithm/Bellman.spec.ts`   |
| TC-VIEW-BELLMAN-02    | h1 含「Bellman」+ GraphView + 5 .graph-node + 无 .bars-view（C-050）                               | L4   | `src/views/Article/Algorithm/Bellman.spec.ts`   |
| TC-VIEW-BELLMAN-03    | 全模板同屏：Article 含「最短」+ ≥7 .graph-edge（C-050）                                            | L4   | `src/views/Article/Algorithm/Bellman.spec.ts`   |
| TC-E2E-BELLMAN-01     | Bellman-Ford 全模板：图轨 5 点 7 边（含负权）/ 拖末步 4 tree 绿边 + 5 点全绿 / Shiki（C-050 新增） | L5   | `e2e/bellman-ford.e2e.ts`                       |
| TC-TOPO-MOD-01        | 末步输出序 = oracle order [2,0,4,1,3,5]（C-051）                                                   | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-02        | 每步执行点合法且带有向图轨（array:[]、directed=true）（C-051）                                     | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-03        | 取/输出 6 点 #selectNode==6、#removeNode==6（C-051）                                               | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-04        | init 步 nodeBadge = 初始入度 [1,2,0,1,0,3]（C-051）                                                | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-05        | 首个 selectNode 取 C（activeNode=2）（C-051）                                                      | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-06        | 首个 removeNode 后 doneNodes=[2]、A 入度→0（C-051）                                                | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-07        | 输出序是合法拓扑序（每边 u→v，u 先于 v）（C-051）                                                  | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-08        | 入度徽标单调不增（减度不变量）（C-051）                                                            | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-09        | removeNode 新增 doneNodes 序列 = [2,0,4,1,3,5]（C-051）                                            | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-10        | done 步 doneNodes 全 6 点、nodeBadge 全 0（C-051）                                                 | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-11        | 四语言 sources + 行号在范围内（C-051）                                                             | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-TOPO-MOD-12        | module 元信息 title 含拓扑、initialInput()=[]（C-051）                                             | L3   | `src/algorithms/topo.module.spec.ts`            |
| TC-VIEW-TOPO-01       | 挂载渲染 Article + AlgorithmPlayer（C-051）                                                        | L4   | `src/views/Article/Algorithm/Topo.spec.ts`      |
| TC-VIEW-TOPO-02       | h1 含「拓扑」+ GraphView + 6 .graph-node + 无 .bars-view（C-051）                                  | L4   | `src/views/Article/Algorithm/Topo.spec.ts`      |
| TC-VIEW-TOPO-03       | 全模板同屏：Article 含「拓扑」+ ≥7 .graph-edge（C-051）                                            | L4   | `src/views/Article/Algorithm/Topo.spec.ts`      |
| TC-E2E-TOPO-01        | 拓扑排序全模板：图轨 6 点 7 边 DAG / 拖末步 6 点全绿 + 字幕拓扑序 / Shiki（C-051 新增）            | L5   | `e2e/topological-sort.e2e.ts`                   |
| TC-FLOYD-MOD-01       | 末步 cells = oracle floydTrace() 终态矩阵（C-052）                                                 | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-02       | 每步执行点合法且带矩阵轨（array:[]）（C-052）                                                      | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-03       | 4 个中转点 #pivotStart==4（C-052）                                                                 | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-04       | 松弛统计 #relaxUpdate==10、#relaxSkip==3（C-052）                                                  | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-05       | init cells = 邻接（对角 0、A→B=3、A→D=null）（C-052）                                              | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-06       | done 矩阵无 ∞（含环→全点对可达）（C-052）                                                          | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-07       | 关键距离 [1][0]=8、[0][3]=6、[2][1]=9（C-052）                                                     | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-08       | 第 k 个 pivotStart 步 matrix.pivot===k（C-052）                                                    | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-09       | 每个单元值单调不增（松弛不变量）（C-052）                                                          | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-10       | 每个 relax 步 active 非空、sources 长度 2（C-052）                                                 | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-11       | 四语言 sources + 行号在范围内（C-052）                                                             | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-FLOYD-MOD-12       | module 元信息 title 含 Floyd、initialInput()=[]（C-052）                                           | L3   | `src/algorithms/floyd.module.spec.ts`           |
| TC-VIEW-FLOYD-01      | 挂载渲染 Article + AlgorithmPlayer（C-052）                                                        | L4   | `src/views/Article/Algorithm/Floyd.spec.ts`     |
| TC-VIEW-FLOYD-02      | h1 含「Floyd」+ MatrixView + 16 .matrix-cell + 无 .bars-view（C-052）                              | L4   | `src/views/Article/Algorithm/Floyd.spec.ts`     |
| TC-VIEW-FLOYD-03      | 全模板同屏：Article 含「最短」+ MatrixView（C-052）                                                | L4   | `src/views/Article/Algorithm/Floyd.spec.ts`     |
| TC-E2E-FLOYD-01       | Floyd 全模板：矩阵轨 4×4 / 拖末步全源矩阵无 ∞ / Shiki（C-052 新增）                                | L5   | `e2e/floyd-warshall.e2e.ts`                     |
| TC-EDIT-MOD-01        | 末步 cells = oracle editDistTrace()，右下角=2（C-053）                                             | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-02        | 每步执行点合法且带矩阵轨（array:[]）（C-053）                                                      | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-03        | #cellMatch==1（仅 S==S）、#cellDiff==8（C-053）                                                    | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-04        | init 边界 第 0 行/列=[0,1,2,3]、内部 null（C-053）                                                 | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-05        | (1,1) match：cells[1][1]=0、sources 单个左上（C-053）                                              | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-06        | 每个 cellDiff 步 sources 长度 3（左上/上/左）（C-053）                                             | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-07        | 每步 rowLabels ∅SAT / colLabels ∅SUN / emptyText=''（C-053）                                       | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-08        | 编辑距离答案 cells[3][3]=2（C-053）                                                                | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-09        | 单元写入一次不变（DP 不变量）（C-053）                                                             | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-10        | 每个填格步 active 为当前格 (i,j)（C-053）                                                          | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-11        | 四语言 sources + 行号在范围内（C-053）                                                             | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-EDIT-MOD-12        | module 元信息 title 含编辑距离、initialInput()=[]（C-053）                                         | L3   | `src/algorithms/editdist.module.spec.ts`        |
| TC-VIEW-EDIT-01       | 挂载渲染 Article + AlgorithmPlayer（C-053）                                                        | L4   | `src/views/Article/Algorithm/Edit.spec.ts`      |
| TC-VIEW-EDIT-02       | h1 含「编辑距离」+ MatrixView + 16 .matrix-cell + 无 .bars-view（C-053）                           | L4   | `src/views/Article/Algorithm/Edit.spec.ts`      |
| TC-VIEW-EDIT-03       | 全模板同屏：Article 含「编辑距离」+ MatrixView（C-053）                                            | L4   | `src/views/Article/Algorithm/Edit.spec.ts`      |
| TC-E2E-EDIT-01        | 编辑距离全模板：DP 表 4×4 / 拖末步右下角=2 / Shiki（C-053 新增）                                   | L5   | `e2e/edit-distance.e2e.ts`                      |
| TC-KNAP-MOD-01        | 末步 cells = oracle knapsackTrace()，右下角=7（C-054）                                             | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-02        | 每步执行点合法且带矩阵轨（array:[]）（C-054）                                                      | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-03        | 取舍统计 #cellSkip==10、#cellChoose==10（C-054）                                                   | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-04        | init 第 0 行/列全 0、内部 null（C-054）                                                            | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-05        | 首个 cellSkip（A 容量1 重2>1）cells[1][1]=0、sources 上格（C-054）                                 | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-06        | 每个 cellChoose 步 sources 长度 2（上格+左上偏移格）（C-054）                                      | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-07        | 每步 rowLabels ∅ABCD / colLabels 0-5 / emptyText=''（C-054）                                       | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-08        | 最优值 cells[4][5]=7（选 A+B）（C-054）                                                            | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-09        | 单元写入一次不变（DP 不变量）（C-054）                                                             | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-10        | 每个填格步 active 为当前格 (i,w)（C-054）                                                          | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-11        | 四语言 sources + 行号在范围内（C-054）                                                             | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-KNAP-MOD-12        | module 元信息 title 含背包、initialInput()=[]（C-054）                                             | L3   | `src/algorithms/knapsack.module.spec.ts`        |
| TC-VIEW-KNAP-01       | 挂载渲染 Article + AlgorithmPlayer（C-054）                                                        | L4   | `src/views/Article/Algorithm/Knapsack.spec.ts`  |
| TC-VIEW-KNAP-02       | h1 含「背包」+ MatrixView + 30 .matrix-cell + 无 .bars-view（C-054）                               | L4   | `src/views/Article/Algorithm/Knapsack.spec.ts`  |
| TC-VIEW-KNAP-03       | 全模板同屏：Article 含「背包」+ MatrixView（C-054）                                                | L4   | `src/views/Article/Algorithm/Knapsack.spec.ts`  |
| TC-E2E-KNAP-01        | 0-1 背包全模板：DP 表 5×6 / 拖末步右下角=7 / Shiki（C-054 新增）                                   | L5   | `e2e/knapsack.e2e.ts`                           |
