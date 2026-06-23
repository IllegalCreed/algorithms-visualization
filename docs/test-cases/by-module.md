# 测试用例模块视图

> Status: active
> Last reviewed: 2026-06-23
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

| Case ID              | 标题                                                                 | 层级 | 自动化路径                                      |
| -------------------- | -------------------------------------------------------------------- | ---- | ----------------------------------------------- |
| TC-VIZ-ARROW-01      | 语义色映射柔和色描在雪佛龙上                                         | L4   | `src/components/Arrow.spec.ts`                  |
| TC-VIZ-ARROW-02      | 非预设色按原值透传                                                   | L4   | `src/components/Arrow.spec.ts`                  |
| TC-VIZ-ARROWTRACK-01 | 每个 Pointer 渲染一个 Arrow 并按 index 定位                          | L4   | `src/components/ArrowTrack.spec.ts`             |
| TC-VIZ-ARROWTRACK-02 | slotWidth 自定义时按其定位（C-006）                                  | L4   | `src/components/ArrowTrack.spec.ts`             |
| TC-VIZ-BLOCK-01      | 渲染数值                                                             | L4   | `src/components/Block.spec.ts`                  |
| TC-VIZ-BLOCK-02      | 背景透明度随 percent                                                 | L4   | `src/components/Block.spec.ts`                  |
| TC-VIZ-BLOCK-03      | percent<0.5 文字色 black，否则 white                                 | L4   | `src/components/Block.spec.ts`                  |
| TC-VIZ-LIST-01       | 渲染与数据等量的 Block                                               | L4   | `src/components/List.spec.ts`                   |
| TC-VIZ-LIST-02       | 最小值 percent=0、最大值 percent=1                                   | L4   | `src/components/List.spec.ts`                   |
| TC-VIZ-BAR-01        | 渲染数值（C-006）                                                    | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BAR-02        | 高度随 percent 增大（C-006）                                         | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BAR-03        | state 决定柱体 class（C-006）                                        | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-01   | 渲染与数据等量的 Bar（C-006）                                        | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-02   | 最大值柱最高、最小值柱最低（C-006）                                  | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-03   | comparing 下标进入 comparing 态（C-006）                             | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-04   | sortedFrom 之后进入 sorted 态（C-006）                               | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-05   | slotWidth 透传给 ArrowTrack（C-006）                                 | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-04        | state=min 时柱体加 min class（C-007）                                | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-06   | minIndex 指向的 Bar 进入 min 态（C-007）                             | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-07   | sortedUpTo 左侧进入 sorted 态（C-007）                               | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-08   | 比较帧 minIndex 取 min（C-007）                                      | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-05        | state=key 时柱体加 key class（C-008）                                | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-09   | keyIndex 指向的 Bar 进入 key 态（C-008）                             | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-10   | key 优先级压过 sorted（C-008）                                       | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-11   | 比较帧 keyIndex 取 key（C-008）                                      | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-06        | state=dimmed 时柱体加 dimmed class（C-010）                          | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-12   | 组内柱保持 idle、组外柱 dimmed（C-010）                              | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-13   | dimmed 最低档：组外 key/comparing 取本态（C-010）                    | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-14   | 空 groupMembers 不淡化任何柱（C-010）                                | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BAR-07        | state='empty' 时柱体加 empty class（C-011）                          | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-AUXVIEW-01    | 渲染与 aux.array 等长的槽（C-011）                                   | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-02    | filled 的槽为 sorted、其余为 empty（C-011）                          | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-03    | pointer 定位 k 箭头到对应槽（C-011）                                 | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-04    | 无 pointer 时不渲染箭头（C-011）                                     | L4   | `src/components/AuxView.spec.ts`                |
| TC-VIZ-AUXVIEW-05    | filled 槽高度用主轨 min/max 同尺度（C-011）                          | L4   | `src/components/AuxView.spec.ts`                |
| TC-PLAYER-AUX-01     | module 无 aux 时不渲染 AuxView（C-011）                              | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-AUX-02     | 当前步带 aux 时渲染 AuxView（C-011）                                 | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-VIZ-BAR-08        | state=pivot 时柱体加 pivot class（C-012）                            | L4   | `src/components/Bar.spec.ts`                    |
| TC-VIZ-BARSVIEW-15   | pivotIndex 指向的 Bar 进入 pivot 态（C-012）                         | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-16   | pivot 优先级最高：压过 comparing/groupMembers/sortedIndices（C-012） | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-BARSVIEW-17   | sortedIndices 内的离散下标进入 sorted 态（C-012）                    | L4   | `src/components/BarsView.spec.ts`               |
| TC-VIZ-STACKVIEW-01  | 渲染与 frames 等量的区间条（C-012）                                  | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-02  | 区间条 left/width 对齐主轨下标坐标系（C-012）                        | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-03  | 栈顶帧高亮（.top）（C-012）                                          | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-04  | popped 区间单独标记（.popped）（C-012）                              | L4   | `src/components/StackView.spec.ts`              |
| TC-VIZ-STACKVIEW-05  | 空栈渲染占位、无区间条（C-012）                                      | L4   | `src/components/StackView.spec.ts`              |
| TC-PLAYER-STACK-01   | module 无 stack 时不渲染 StackView（向后兼容）（C-012）              | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-STACK-02   | 当前步带 stack 时渲染 StackView（C-012）                             | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-STACK-03   | 带 aux 不带 stack 只渲染 AuxView（两轨互不干扰）（C-012）            | L4   | `src/components/player/AlgorithmPlayer.spec.ts` |

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

| Case ID              | 标题                                           | 层级 | 自动化路径                                       |
| -------------------- | ---------------------------------------------- | ---- | ------------------------------------------------ |
| TC-HOOK-01-1         | 返回数据结构与排序两个分类                     | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-2         | 数据结构分类含 8 项                            | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-3         | 每个条目含 title/desc/icon/url                 | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-4         | 所有 url 唯一                                  | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-01-5         | 每个分类含 desc                                | L3   | `src/views/Home/Main/hooks.spec.ts`              |
| TC-HOOK-03-1         | 组件挂载时注册 scroll 监听器                   | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-HOOK-03-2         | 组件卸载时移除 scroll 监听器                   | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-HOOK-03-3         | scrollY > 0 时 isShowHeaderShadow 变为 true    | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-HOOK-03-4         | scrollY === 0 时 isShowHeaderShadow 变为 false | L3   | `src/views/Home/hooks.spec.ts`                   |
| TC-VIEW-FOOTER-01    | 渲染 MIT Licensed 文案                         | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-02    | 渲染 Copyright 文案                            | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-03    | 渲染 Zhang Xu 署名                             | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-04    | 渲染 footer 根元素                             | L4   | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-CATEGORY-01  | 渲染分类标题                                   | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-02  | 渲染分类描述                                   | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-03  | 渲染 children 数量对应的 Item                  | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-04  | 渲染第一个 Item 标题「数组」                   | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-05  | 渲染第二个 Item 标题「链表」                   | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-06  | children 为空时无 Item 渲染                    | L4   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-HOME-ITEM-01 | 渲染 item 标题                                 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-02 | 渲染 item 描述                                 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-03 | 渲染 img 标签（icon）                          | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-04 | img src 属性对应 icon 字段                     | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-05 | 点击元素调用 router.push，跳转到对应 url name  | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-06 | 不同 url 跳转到对应路由名                      | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-SPLASH-01    | 渲染主标题「可视化的」                         | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-02    | 渲染副标题「数据结构与算法」                   | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-03    | 渲染技术栈描述文案                             | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-04    | 渲染「开始学习」按钮                           | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-05    | 点击「开始学习」跳转到 docs/array 页           | L4   | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-E2E-HOME-01       | 首页加载并能进入 docs                          | L5   | `e2e/home-navigation.e2e.ts`                     |

---

## docs（文档页侧边菜单）

| Case ID              | 标题                                          | 层级 | 自动化路径                                     |
| -------------------- | --------------------------------------------- | ---- | ---------------------------------------------- |
| TC-HOOK-02-1         | 返回 2 个分类                                 | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-02-2         | 每项含 title/url 且均非空                     | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-02-3         | 所有 url 唯一                                 | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-02-4         | 数据结构含 8 项，排序算法含 10 项             | L3   | `src/views/Docs/Menu/hooks.spec.ts`            |
| TC-HOOK-04-1         | 组件挂载后 isShowHeaderShadow 变为 true       | L3   | `src/views/Docs/hooks.spec.ts`                 |
| TC-HOOK-04-2         | 组件卸载后 isShowHeaderShadow 恢复为 false    | L3   | `src/views/Docs/hooks.spec.ts`                 |
| TC-VIEW-DOCS-ITEM-01 | 渲染 item span 文本                           | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-02 | 渲染 .item.btn class                          | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-03 | 点击调用 router.push 跳转到对应 url           | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-04 | url 匹配时 item 有 item-pressed class         | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-05 | url 不匹配时 item 无 item-pressed class       | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-06 | 不同 url 跳转对应路由                         | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-MENU-01      | 挂载成功，渲染 #menu 根元素                   | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-02      | 渲染「数据结构」分类标题                      | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-03      | 渲染「经典排序算法」分类标题                  | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-04      | 渲染所有数据结构子项（如「数组」「链表」）    | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-05      | 渲染排序算法子项「冒泡排序」                  | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-06      | useMenuSelect 初始路由 array 使对应 Item 高亮 | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-07      | 点击子菜单项触发路由跳转                      | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-08      | onBeforeRouteUpdate 回调触发后高亮随路由更新  | L4   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-E2E-MENU-01       | docs 菜单点击切换路由                         | L5   | `e2e/docs-menu.e2e.ts`                         |

---

## article-sort（排序动画文章）

| Case ID              | 标题                                                               | 层级 | 自动化路径                                              |
| -------------------- | ------------------------------------------------------------------ | ---- | ------------------------------------------------------- |
| TC-VIEW-BUBBLE-01    | （C-006 改写）挂载渲染 AlgorithmPlayer                             | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-BUBBLE-02    | （C-006 改写）初始渲染 10 根柱子且默认停第 0 步                    | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-E2E-BUBBLE-01     | ~~冒泡排序动画最终升序~~ (superseded by TC-E2E-PLAYER-01)          | L5   | `e2e/bubble-sort.e2e.ts`                                |
| TC-E2E-PLAYER-01     | 冒泡播放器：默认暂停/单步/跳末升序/重置（C-006）                   | L5   | `e2e/bubble-sort.e2e.ts`                                |
| TC-VIEW-SELECTION-01 | 挂载渲染 AlgorithmPlayer（C-007）                                  | L4   | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-SELECTION-02 | 初始渲染 10 柱默认停第 0 步（C-007）                               | L4   | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-E2E-SELECTION-01  | 选择排序播放器 e2e（C-007）                                        | L5   | `e2e/selection-sort.e2e.ts`                             |
| TC-VIEW-INSERTION-01 | 挂载渲染 AlgorithmPlayer（C-008）                                  | L4   | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-VIEW-INSERTION-02 | 初始渲染 10 柱默认停第 0 步（C-008）                               | L4   | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-E2E-INSERTION-01  | 插入排序播放器 e2e（C-008）                                        | L5   | `e2e/insertion-sort.e2e.ts`                             |
| TC-VIEW-SHELL-01     | 挂载渲染 AlgorithmPlayer（C-010）                                  | L4   | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |
| TC-VIEW-SHELL-02     | 初始渲染 10 柱默认停第 0 步（C-010）                               | L4   | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |
| TC-E2E-SHELL-01      | 希尔排序播放器 e2e（C-010）                                        | L5   | `e2e/shell-sort.e2e.ts`                                 |
| TC-VIEW-MERGE-01     | 挂载渲染 AlgorithmPlayer（C-011）                                  | L4   | `src/views/Article/SortAlgorithm/MergeSort.spec.ts`     |
| TC-VIEW-MERGE-02     | 初始渲染主轨 10 柱 + 辅助轨默认停第 0 步（C-011）                  | L4   | `src/views/Article/SortAlgorithm/MergeSort.spec.ts`     |
| TC-E2E-MERGE-01      | 归并播放器 e2e（C-011）                                            | L5   | `e2e/merge-sort.e2e.ts`                                 |
| TC-VIEW-QUICK-01     | 挂载渲染 AlgorithmPlayer（C-012）                                  | L4   | `src/views/Article/SortAlgorithm/QuickSort.spec.ts`     |
| TC-VIEW-QUICK-02     | 初始渲染主轨 10 柱 + 区间栈轨且默认停第 0 步（C-012）              | L4   | `src/views/Article/SortAlgorithm/QuickSort.spec.ts`     |
| TC-E2E-QUICK-01      | 快排播放器：默认暂停/区间栈轨/pivot品红/跳末升序全绿/重置（C-012） | L5   | `e2e/quick-sort.e2e.ts`                                 |

---

## master（全局框架 Header）

| Case ID             | 标题                                                         | 层级 | 自动化路径                                          |
| ------------------- | ------------------------------------------------------------ | ---- | --------------------------------------------------- |
| TC-HOOK-05-1        | 返回 3 项 微博/X/GitHub，title 为分享/仓库文案（C-009 改写） | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-HOOK-05-2        | 每项 title/src/url 非空且 url 为 https（C-009 改写）         | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-HOOK-05-3        | 微博/X url 含线上域名+path；GitHub=仓库地址（C-009 改写）    | L3   | `src/views/Master/Header/hooks.spec.ts`             |
| TC-SHARE-01         | buildShareTargetUrl 拼线上域名 + fullPath（C-009）           | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-02         | buildShareTargetUrl 保留 query/hash（C-009）                 | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-03         | buildWeiboShareUrl 指向微博分享页（C-009）                   | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-04         | buildXShareUrl 指向 X 分享页（C-009）                        | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-05         | 链接与中文文案经 URLSearchParams 编码（C-009）               | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-SHARE-06         | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验（C-009）             | L3   | `src/views/Master/Header/share.spec.ts`             |
| TC-VIEW-HEADER-01   | 渲染 #header 根元素                                          | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-02   | 渲染 logo #logo 元素                                         | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-03   | 渲染「V」logo 字符                                           | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-04   | 渲染 h1 标题「算法可视化」                                   | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-05   | 点击 logo 跳转到 home 路由                                   | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-06   | 渲染 3 个 icon-link（github/twitter/weibo）                  | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-07   | 初始无 header shadow class                                   | L4   | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-ICONLINK-01 | 渲染 .icon-link 根元素                                       | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-02 | 渲染 img 标签                                                | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-03 | img src 属性正确                                             | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-04 | title 属性渲染到元素上                                       | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-05 | 点击调用 window.open 打开对应 url                            | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-06 | 不同 url 也能正确打开                                        | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
