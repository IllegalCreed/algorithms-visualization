# 测试用例分层视图

> Status: active
> Last reviewed: 2026-06-26
> Owner: IllegalCreed

同一 Case ID 的事实字段（owner plan、自动化路径、状态、最后验证）见 `index.md`。
本文件仅提供分层视角，便于按层级评审覆盖度。

## L3 — 前端单元（Vitest，不 mount）

共 **255** 个用例。运行命令：`pnpm test:unit`

### algorithms

| Case ID    | 标题                             | 自动化路径                           |
| ---------- | -------------------------------- | ------------------------------------ |
| TC-ALGO-01 | 空数组与单元素不产生步骤         | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-02 | 最终数组升序排列                 | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-03 | 每步 compare 是相邻合法下标      | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-04 | 已排序数组无任何 swap            | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-05 | 含重复元素结果正确且稳定地不越界 | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-06 | 不修改入参                       | `src/algorithms/bubble-sort.spec.ts` |

### store

| Case ID     | 标题                                            | 自动化路径                         |
| ----------- | ----------------------------------------------- | ---------------------------------- |
| TC-STORE-01 | 初始 isDarkMode=false、isShowHeaderShadow=false | `src/store/modules/system.spec.ts` |
| TC-STORE-02 | changeDarkMode 切换暗色                         | `src/store/modules/system.spec.ts` |
| TC-STORE-03 | changeHeaderShadowe 设置阴影开关                | `src/store/modules/system.spec.ts` |
| TC-STORE-04 | colors 含 red/blue/yellow/green                 | `src/store/modules/system.spec.ts` |

### bubble-sort module（C-006）

| Case ID          | 标题                                         | 自动化路径                                  |
| ---------------- | -------------------------------------------- | ------------------------------------------- |
| TC-BUBBLE-MOD-01 | 空/单元素也产出至少一个 done 步              | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验）   | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提） | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-04 | 不修改入参                                   | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-05 | 每步 point 合法，swap/noSwap 的 swapped 对应 | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-06 | 四门语言齐备                                 | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-07 | 每门语言每个 ExecPoint 行号落在源码行范围内  | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-08 | 实际出现的 point 都能在每门语言映射到行      | `src/algorithms/bubble-sort.module.spec.ts` |

### selection-sort oracle（C-007）

| Case ID        | 标题                               | 自动化路径                              |
| -------------- | ---------------------------------- | --------------------------------------- |
| TC-SEL-ALGO-01 | 空数组与单元素不产生步骤、结果原样 | `src/algorithms/selection-sort.spec.ts` |
| TC-SEL-ALGO-02 | 最终数组升序排列                   | `src/algorithms/selection-sort.spec.ts` |
| TC-SEL-ALGO-03 | 含重复元素结果正确且不越界         | `src/algorithms/selection-sort.spec.ts` |
| TC-SEL-ALGO-04 | 不修改入参                         | `src/algorithms/selection-sort.spec.ts` |

### selection-sort module（C-007）

| Case ID             | 标题                                           | 自动化路径                                     |
| ------------------- | ---------------------------------------------- | ---------------------------------------------- |
| TC-SELECTION-MOD-01 | 空/单元素也产出至少一个 done 步                | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-02 | 末步数组与 oracle 一致（交叉校验，升序）       | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-04 | 不修改入参                                     | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-05 | 每步 point 合法；swap/noSwap 的 swapped 对应   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-06 | newMin 步 min 指针落在 emphasis.minIndex 上    | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-07 | 每轮结束后 i 位即 [i,n) 最小（选择核心不变量） | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-08 | sortedUpTo 单调不减且末步为 n                  | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-09 | 交换次数 ≤ n-1                                 | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-10 | 四门语言齐备                                   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-11 | 每门语言每个 SelectionExecPoint 行号在范围内   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-12 | 实际出现的 point 都能在每门语言映射到行        | `src/algorithms/selection-sort.module.spec.ts` |

### insertion-sort oracle（C-008）

| Case ID        | 标题                                  | 自动化路径                              |
| -------------- | ------------------------------------- | --------------------------------------- |
| TC-INS-ALGO-01 | 空数组与单元素不产生步骤              | `src/algorithms/insertion-sort.spec.ts` |
| TC-INS-ALGO-02 | 最终数组升序排列                      | `src/algorithms/insertion-sort.spec.ts` |
| TC-INS-ALGO-03 | 含重复元素结果正确且不越界            | `src/algorithms/insertion-sort.spec.ts` |
| TC-INS-ALGO-04 | 不修改入参                            | `src/algorithms/insertion-sort.spec.ts` |
| TC-INS-ALGO-05 | 已升序输入每轮零移位（最佳情况 O(n)） | `src/algorithms/insertion-sort.spec.ts` |

### insertion-sort module（C-008）

| Case ID             | 标题                                              | 自动化路径                                     |
| ------------------- | ------------------------------------------------- | ---------------------------------------------- |
| TC-INSERTION-MOD-01 | 空/单元素也产出至少一个 done 步                   | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-02 | 末步数组与 oracle 一致（交叉校验，升序）          | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）      | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-04 | 不修改入参                                        | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-05 | 每步 point 合法；shift 步必带数值型 keyIndex      | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-06 | 每个 insert 步后 [0,i] 前缀升序（插入核心不变量） | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-07 | 一轮内 keyIndex 单调不增（key 只向左滑）          | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-08 | sortedUpTo 单调不减且末步为 n                     | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-09 | 稳定性：相等元素原始相对顺序保持不变              | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-10 | 四门语言齐备                                      | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-11 | 每门语言每个 InsertionExecPoint 行号在范围内      | `src/algorithms/insertion-sort.module.spec.ts` |
| TC-INSERTION-MOD-12 | 实际出现的 point 都能在每门语言映射到行           | `src/algorithms/insertion-sort.module.spec.ts` |

### shell-sort oracle（C-010）

| Case ID          | 标题                                         | 自动化路径                          |
| ---------------- | -------------------------------------------- | ----------------------------------- |
| TC-SHELL-ALGO-01 | 空数组与单元素不产生 pass                    | `src/algorithms/shell-sort.spec.ts` |
| TC-SHELL-ALGO-02 | 最终 pass 升序排列                           | `src/algorithms/shell-sort.spec.ts` |
| TC-SHELL-ALGO-03 | 含重复元素结果正确且不越界                   | `src/algorithms/shell-sort.spec.ts` |
| TC-SHELL-ALGO-04 | 不修改入参                                   | `src/algorithms/shell-sort.spec.ts` |
| TC-SHELL-ALGO-05 | gap 序列为 ⌊n/2⌋ 减半到 1                    | `src/algorithms/shell-sort.spec.ts` |
| TC-SHELL-ALGO-06 | 已升序输入：最终仍升序、gap 序列不变（幂等） | `src/algorithms/shell-sort.spec.ts` |

### shell-sort module（C-010）

| Case ID         | 标题                                                  | 自动化路径                                 |
| --------------- | ----------------------------------------------------- | ------------------------------------------ |
| TC-SHELL-MOD-01 | 空/单元素也产出至少一个 done 步                       | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验，升序）      | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）          | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-04 | 不修改入参                                            | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-05 | 每步 point 合法；shift 步必带数值型 keyIndex          | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-06 | gapChange 步的 gap 依次为 ⌊n/2⌋ 减半到 1              | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-07 | 各 gap-pass 边界数组与 oracle 快照一致                | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-08 | 每个 groupStart 的 groupMembers = 该 gap 下子序列下标 | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-09 | 一轮内 keyIndex 单调不增（key 只向左跳）              | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-10 | done 步标 sortedFrom=0（全部有序）                    | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-11 | 四门语言齐备                                          | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-12 | 每门语言每个 ShellExecPoint 行号在范围内              | `src/algorithms/shell-sort.module.spec.ts` |
| TC-SHELL-MOD-13 | 实际出现的 point 都能在每门语言映射到行               | `src/algorithms/shell-sort.module.spec.ts` |

### player / usePlayer（C-006）

| Case ID      | 标题                                    | 自动化路径                                |
| ------------ | --------------------------------------- | ----------------------------------------- |
| TC-PLAYER-01 | 初始停第 0 步且未播放                   | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-02 | stepForward 前进且不越过末步            | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-03 | stepBackward 后退且不越过首步           | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-04 | seek 越界夹紧到合法范围                 | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-05 | reset 回第 0 步并停止                   | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-06 | play 按基准间隔逐步推进、到末步自动暂停 | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-07 | pause 停止自动推进                      | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-08 | setSpeed 加速后按新速率推进             | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-09 | current 跟随 index                      | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-10 | progress 从 0 到 1                      | `src/components/player/usePlayer.spec.ts` |

### hooks

| Case ID      | 标题                                                         | 自动化路径                              |
| ------------ | ------------------------------------------------------------ | --------------------------------------- |
| TC-HOOK-01-1 | 返回数据结构与排序两个分类                                   | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-2 | 数据结构分类含 9 项（含字典树 C-028）                        | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-3 | 每个条目含 title/desc/icon/url                               | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-4 | 所有 url 唯一                                                | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-5 | 每个分类含 desc                                              | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-02-1 | 返回 2 个分类                                                | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-2 | 每项含 title/url 且均非空                                    | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-3 | 所有 url 唯一                                                | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-4 | 数据结构含 9 项（含字典树 C-028），排序算法含 8 项           | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-03-1 | 组件挂载时注册 scroll 监听器                                 | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-2 | 组件卸载时移除 scroll 监听器                                 | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-3 | scrollY > 0 时 isShowHeaderShadow 变为 true                  | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-4 | scrollY === 0 时 isShowHeaderShadow 变为 false               | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-04-1 | 组件挂载后 isShowHeaderShadow 变为 true                      | `src/views/Docs/hooks.spec.ts`          |
| TC-HOOK-04-2 | 组件卸载后 isShowHeaderShadow 恢复为 false                   | `src/views/Docs/hooks.spec.ts`          |
| TC-HOOK-05-1 | 返回 3 项 微博/X/GitHub，title 为分享/仓库文案（C-009 改写） | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-2 | 每项 title/src/url 非空且 url 为 https（C-009 改写）         | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-3 | 微博/X url 含线上域名+path；GitHub=仓库地址（C-009 改写）    | `src/views/Master/Header/hooks.spec.ts` |

### share（C-009）

| Case ID     | 标题                                      | 自动化路径                              |
| ----------- | ----------------------------------------- | --------------------------------------- |
| TC-SHARE-01 | buildShareTargetUrl 拼线上域名 + fullPath | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-02 | buildShareTargetUrl 保留 query/hash       | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-03 | buildWeiboShareUrl 指向微博分享页         | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-04 | buildXShareUrl 指向 X 分享页              | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-05 | 链接与中文文案经 URLSearchParams 编码     | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-06 | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验   | `src/views/Master/Header/share.spec.ts` |

### merge-sort oracle + module（C-011）

| Case ID          | 标题                                                 | 自动化路径                                 |
| ---------------- | ---------------------------------------------------- | ------------------------------------------ |
| TC-MERGE-ALGO-01 | 空数组与单元素不产生 pass                            | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-02 | 基准数据最终升序                                     | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-03 | 含重复元素结果正确                                   | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-04 | 不修改入参                                           | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-05 | width 序列为 1,2,4,…（<n）                           | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-06 | 已升序输入幂等（最终仍升序）                         | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-07 | 逆序输入最终升序                                     | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-08 | 每趟 width 后每个 2\*width 块内部有序（不变量）      | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-ALGO-09 | 随机用例与 Array.sort 交叉校验                       | `src/algorithms/merge-sort.spec.ts`        |
| TC-MERGE-MOD-01  | 空/单元素也产出至少一个 done 步                      | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-02  | 末步数组与 oracle 最终结果一致（交叉校验，升序）     | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-03  | 每步主轨 array 的 id 集合恒等于初始（FLIP 前提）     | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-04  | 不修改入参                                           | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-05  | 每步 point 合法；compare 步必带 comparing            | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-06  | widthChange 步的 width 依次为 1,2,4,…                | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-07  | 各 width 趟边界数组与 oracle 快照一致（核心不变量）  | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-08  | 每个 mergeStart 的 groupMembers/activeRange=[lo,hi)  | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-09  | 一对合并内 aux.filled 单调增长（temp 只填不删）      | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-10  | writeBack 后主轨 [lo,hi) 段升序                      | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-11  | done 步标 sortedFrom=0、aux 无 filled                | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-12  | take 步 temp 写入位的值 = 所取元素值                 | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-13  | 每步主轨指针 clamp 在 [0,n-1]、aux.pointer 在 [0,n]  | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-14  | 每步 aux.array 长度 = 主轨长度                       | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-15  | 四门语言齐备                                         | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-16  | 每门语言每个 MergeExecPoint 行号落在源码物理行范围内 | `src/algorithms/merge-sort.module.spec.ts` |
| TC-MERGE-MOD-17  | 实际出现的 point 都能在每门语言映射到行              | `src/algorithms/merge-sort.module.spec.ts` |

### quick-sort oracle + module（C-012）

| Case ID          | 标题                                             | 自动化路径                                 |
| ---------------- | ------------------------------------------------ | ------------------------------------------ |
| TC-QUICK-ALGO-01 | 末事件数组严格升序且与内置 sort 一致             | `src/algorithms/quick-sort.spec.ts`        |
| TC-QUICK-ALGO-02 | 不修改入参                                       | `src/algorithms/quick-sort.spec.ts`        |
| TC-QUICK-ALGO-03 | 空/单元素返回空事件序列                          | `src/algorithms/quick-sort.spec.ts`        |
| TC-QUICK-ALGO-04 | BASE 的 pivot 落点序列 = [0,6,1,5,2,4,9,7]       | `src/algorithms/quick-sort.spec.ts`        |
| TC-QUICK-ALGO-05 | 每次 partition 落点钉死最终位置                  | `src/algorithms/quick-sort.spec.ts`        |
| TC-QUICK-ALGO-06 | 含重复/已序/逆序也正确升序                       | `src/algorithms/quick-sort.spec.ts`        |
| TC-QUICK-MOD-01  | 空/单元素只产出 done 步、sortedIndices 全集      | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-02  | 末步数组与 oracle 一致（升序）                   | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-03  | 每步 id 集合恒等于初始（FLIP 前提）              | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-04  | 不修改入参                                       | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-05  | 每步 point 合法；compare 步必带 comparing=[j,hi] | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-06  | pivotPlace 落点序列 = oracle pivotIndex 序列     | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-07  | sortedIndices 单调不减、末步全集                 | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-08  | pivotSelect 步 pivotIndex=hi 且 pivot 值=a[hi]   | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-09  | 栈序：pop 弹出区间=前一步栈顶（先右后左→先取左） | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-10  | done 步 stack 空、sortedIndices 全集             | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-11  | 每步指针 clamp 在 [0,n-1]                        | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-12  | 每步带 stack 快照（StackTrack）                  | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-13  | swap 步小于区不变量：a[lo..i-1] 全 < pivot       | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-14  | 四门语言齐备                                     | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-15  | 每门语言每个 QuickExecPoint 行号在源码行范围内   | `src/algorithms/quick-sort.module.spec.ts` |
| TC-QUICK-MOD-16  | 实际出现的 point 都能在每门语言映射到行          | `src/algorithms/quick-sort.module.spec.ts` |

---

### heap-sort oracle + module（C-013）

| Case ID         | 标题                                        | 自动化路径                                |
| --------------- | ------------------------------------------- | ----------------------------------------- |
| TC-HEAP-ALGO-01 | result 升序且与内置 sort 一致               | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-ALGO-02 | built 是大顶堆                              | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-ALGO-03 | BASE 建堆后 = [10,9,8,6,7,5,4,3,2,1]        | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-ALGO-04 | 不修改入参                                  | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-ALGO-05 | 空 / 单元素 result 原样                     | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-ALGO-06 | 含重复 / 已序 / 逆序均升序                  | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-ALGO-07 | isMaxHeap 能识别非堆                        | `src/algorithms/heap-sort.spec.ts`        |
| TC-HEAP-MOD-01  | 空 / 单元素只产出 done、sortedFrom=0        | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-02  | 末步升序 = oracle result                    | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-03  | 每步 id 集合恒等于初始（FLIP）              | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-04  | 不修改入参                                  | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-05  | 每步 point 合法；compare 带 comparing       | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-06  | 建堆阶段末步 = oracle built 且为大顶堆      | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-07  | extract 步 sortedFrom=heapSize 且单调递减   | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-08  | extract 堆顶取出序列 = [10,9,8,7,6,5,4,3,2] | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-09  | heapify 步 heapNode 为数字                  | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-10  | done 步 sortedFrom=0、tree.heapSize=0       | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-11  | 每步带 tree 快照                            | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-12  | 堆用节点高亮、无指针箭头                    | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-13  | 四门语言齐备                                | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-14  | 每门语言每个 point 行号在源码行范围内       | `src/algorithms/heap-sort.module.spec.ts` |
| TC-HEAP-MOD-15  | 实际出现的 point 都能映射到行               | `src/algorithms/heap-sort.module.spec.ts` |

### counting-sort oracle + module（C-014）

| Case ID          | 标题                                            | 自动化路径                                    |
| ---------------- | ----------------------------------------------- | --------------------------------------------- |
| TC-COUNT-ALGO-01 | result 升序且与内置 sort 一致                   | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-ALGO-02 | counts/min/max 正确（含空桶=0）                 | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-ALGO-03 | sum(counts) = n                                 | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-ALGO-04 | 由 counts 按值域展开可重建 result               | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-ALGO-05 | 不修改入参                                      | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-ALGO-06 | 空 / 单元素                                     | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-ALGO-07 | 重复 / 已序 / 逆序 / 全等值均升序               | `src/algorithms/counting-sort.spec.ts`        |
| TC-COUNT-MOD-01  | 空只产 done(sortedUpTo=0)；单元素末步 done 升序 | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-02  | 末步升序 = oracle result                        | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-03  | 每步 id 集合恒等于初始（FLIP）                  | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-04  | 不修改入参                                      | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-05  | 每步 point 合法、带 count 快照                  | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-06  | 计数阶段末步桶快照 = oracle counts              | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-07  | count 步 activeBucket = a[i]-min                | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-08  | 回写 sortedUpTo 单调不减、done = n              | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-09  | 每条 writeBack 当前桶余量较上一次递减           | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-10  | 空桶（值5）有 bucketStart 但其后无 writeBack    | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-11  | done 步 sortedUpTo=n、所有桶=0、无游标          | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-12  | count 蓝读游标 / bucketStart·writeBack 绿写游标 | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-13  | writeBack 步 dimFrom=写入位+1、活跃格不提前转绿 | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-14  | 四门语言齐备                                    | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-15  | 每门语言每个 point 行号在源码行范围内           | `src/algorithms/counting-sort.module.spec.ts` |
| TC-COUNT-MOD-16  | 实际出现的 point 都能映射到行                   | `src/algorithms/counting-sort.module.spec.ts` |

### 栈逻辑 useStack（C-015）

| Case ID           | 标题                                          | 自动化路径                                   |
| ----------------- | --------------------------------------------- | -------------------------------------------- |
| TC-STACK-LOGIC-01 | 初始空：items 空/top null/canPop F/canPush T  | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-02 | push 追加递增序号、返回值、top 更新           | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-03 | pop 删尾返回原栈顶；空 pop 返回 null          | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-04 | peek 返回栈顶不改 items                       | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-05 | reset 清空且 seq 归零                         | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-06 | canPush 满 STACK_MAX 为 false、push 返回 null | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-07 | 每个元素 id 唯一                              | `src/components/structures/useStack.spec.ts` |
| TC-STACK-LOGIC-08 | canPop 随空/非空切换                          | `src/components/structures/useStack.spec.ts` |

### 队列逻辑 useQueue（C-016）

| Case ID           | 标题                                                  | 自动化路径                                   |
| ----------------- | ----------------------------------------------------- | -------------------------------------------- |
| TC-QUEUE-LOGIC-01 | 初始空：items 空/front null/canDequeue F/canEnqueue T | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-02 | enqueue 追加递增序号、返回值；front 不变（非空）      | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-03 | dequeue 删队首返回原队首；空 dequeue 返回 null        | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-04 | peek 返回队首不改 items                               | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-05 | reset 清空且 seq 归零                                 | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-06 | canEnqueue 满 QUEUE_MAX 为 false、enqueue 返回 null   | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-07 | 每个元素 id 唯一                                      | `src/components/structures/useQueue.spec.ts` |
| TC-QUEUE-LOGIC-08 | canDequeue 随空/非空切换                              | `src/components/structures/useQueue.spec.ts` |

### 数组逻辑 useArray（C-017）

| Case ID           | 标题                                                   | 自动化路径                                   |
| ----------------- | ------------------------------------------------------ | -------------------------------------------- |
| TC-ARRAY-LOGIC-01 | 初始 [1,2,3,4]、无选中、can 标志                       | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-02 | valueAt 按下标读、越界 null                            | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-03 | select toggle：选中/再点取消/换选                      | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-04 | insert 未选返回 null 且不变                            | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-05 | insert 在 i 插递增值、右移、保持选中、下标≠值、id 唯一 | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-06 | remove 删 i、后续左移、清空选中                        | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-07 | remove 未选返回 null                                   | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-08 | append 尾插递增、不动选中                              | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-09 | 满 ARRAY_MAX：canAppend/canInsert F、返回 null         | `src/components/structures/useArray.spec.ts` |
| TC-ARRAY-LOGIC-10 | reset 复位 [1,2,3,4]、清选中、下次 append=5            | `src/components/structures/useArray.spec.ts` |

### 链表逻辑 useLink（C-018）

| Case ID          | 标题                                                  | 自动化路径                                  |
| ---------------- | ----------------------------------------------------- | ------------------------------------------- |
| TC-LINK-LOGIC-01 | 初始 [1,2,3]、无选中、can 标志                        | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-02 | valueAt 按位置读、越界 null                           | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-03 | select toggle：选中/再点取消/换选                     | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-04 | insertAfter 未选返回 null 且不变                      | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-05 | insertAfter 在选中后插递增、选中落 i+1、链序、id 唯一 | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-06 | remove 删选中、清空选中                               | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-07 | remove 未选返回 null                                  | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-08 | prepend 头插递增、落表头、选中随之 +1                 | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-09 | 满 LINK_MAX：canPrepend/canInsert F、返回 null        | `src/components/structures/useLink.spec.ts` |
| TC-LINK-LOGIC-10 | reset 复位 [1,2,3]、清选中、下次 prepend=4            | `src/components/structures/useLink.spec.ts` |

### BST 逻辑 useTree（C-019）

| Case ID          | 标题                                      | 自动化路径                                  |
| ---------------- | ----------------------------------------- | ------------------------------------------- |
| TC-TREE-LOGIC-01 | 初始平衡树 50/30/70/20/40/60/80、pos 正确 | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-02 | has 命中/未命中                           | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-03 | insert 走位落正确 pos + 返回 path         | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-04 | insert 查重返回 dup、不增                 | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-05 | insert 维持 BST：任意插入后 inorder 升序  | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-06 | insert 超 4 层返回 depth                  | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-07 | search 命中返回 found + path              | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-08 | search 未命中返回 false + 走到空位 path   | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-09 | inorder 初始 = 升序                       | `src/components/structures/useTree.spec.ts` |
| TC-TREE-LOGIC-10 | reset 复位 7 节点、清插入                 | `src/components/structures/useTree.spec.ts` |

### 大顶堆逻辑 useHeap（C-020）

| Case ID            | 标题                                             | 自动化路径                                  |
| ------------------ | ------------------------------------------------ | ------------------------------------------- |
| TC-HEAPDS-LOGIC-01 | 初始大顶堆 [90,70,80,40,60,30,50]、peek 90、边界 | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-02 | insert 末尾追加（不 sift）、返回新下标           | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-03 | siftUpStep 单步上浮                              | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-04 | 完整插入后仍是大顶堆、root 为最大                | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-05 | extractRoot 取根（最大）、末位补根               | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-06 | 完整弹出后仍是大顶堆、返回最大、新堆顶           | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-07 | siftDownStep 单步下沉                            | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-08 | 不变量：连续插入/弹出后仍大顶堆、peek=max        | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-09 | 边界：满 15 / 空 / id 唯一                       | `src/components/structures/useHeap.spec.ts` |
| TC-HEAPDS-LOGIC-10 | reset 复位初始堆                                 | `src/components/structures/useHeap.spec.ts` |

### 哈希逻辑 useHash（C-021）

| Case ID          | 标题                                              | 自动化路径                                  |
| ---------------- | ------------------------------------------------- | ------------------------------------------- |
| TC-HASH-LOGIC-01 | 初始：7 桶、桶1=[15,8]、桶2=[23]、桶4=[4]、size 4 | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-02 | hash = key % 7                                    | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-03 | has 命中/未命中                                   | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-04 | insert 空桶直放（无冲突）                         | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-05 | insert 冲突追加链尾                               | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-06 | insert 查重不插                                   | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-07 | search 命中返回 bucket + steps                    | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-08 | search 没找到（走完链）                           | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-09 | 满 HASH_MAX / id 唯一                             | `src/components/structures/useHash.spec.ts` |
| TC-HASH-LOGIC-10 | reset 复位初始                                    | `src/components/structures/useHash.spec.ts` |

### 图逻辑 useGraph（C-022）

| Case ID           | 标题                           | 自动化路径                                   |
| ----------------- | ------------------------------ | -------------------------------------------- |
| TC-GRAPH-LOGIC-01 | 图结构：6 顶点、7 边、adj      | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-02 | labelOf + 顶点坐标             | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-03 | bfs(0) 顺序 A B C D E F        | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-04 | dfs(0) 顺序 A B D E F C        | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-05 | bfs 与 dfs 顺序不同            | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-06 | bfs 访问全部 6、不重不漏       | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-07 | dfs 访问全部 6、不重不漏       | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-08 | bfs 首步 frontier = 队列 [1,2] | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-09 | dfs 首步 frontier = 栈 [2,1]   | `src/components/structures/useGraph.spec.ts` |
| TC-GRAPH-LOGIC-10 | 换起点 bfs(3) 也访问全部       | `src/components/structures/useGraph.spec.ts` |

### 平衡逻辑 useBalance（C-023 · M4 深度 D1）

| Case ID         | 标题                                         | 自动化路径                                     |
| --------------- | -------------------------------------------- | ---------------------------------------------- |
| TC-BAL-LOGIC-01 | chain 结构：7 节点 1-7、6 边、高度 7、最坏 7 | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-02 | balanced 结构：4/2/6/1/3/5/7、6 边、高度 3   | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-03 | 节点带坐标 + id 唯一                         | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-04 | search(7, chain) 走 7 步                     | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-05 | search(7, balanced) 走 3 步                  | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-06 | chain search 步数 = 值                       | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-07 | balanced：根 1 步、叶 3 步                   | `src/components/structures/useBalance.spec.ts` |
| TC-BAL-LOGIC-08 | 同值两 mode 步数不同                         | `src/components/structures/useBalance.spec.ts` |

### 开放寻址逻辑 useProbe（C-024 · M4 深度 D2）

| Case ID           | 标题                                          | 自动化路径                                   |
| ----------------- | --------------------------------------------- | -------------------------------------------- |
| TC-PROBE-LOGIC-01 | 初始扁平表 [null,15,8,23,4,null,null]、size 4 | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-02 | 装载因子 4/7、isFull=false                    | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-03 | hash(key)=key%7                               | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-04 | insert 非冲突：5→格5                          | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-05 | insert 冲突：9→探 2,3,4 落 5                  | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-06 | insert 查重：15 已在 → dup                    | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-07 | search 命中：15→1 步、8→2 步                  | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-08 | search 未命中：99 探到空槽止、steps 5         | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-09 | 填满后 isFull、load=1，insert→full 不死循环   | `src/components/structures/useProbe.spec.ts` |
| TC-PROBE-LOGIC-10 | reset 复原；has(8)=true、has(99)=false        | `src/components/structures/useProbe.spec.ts` |

### 双向链表逻辑 useDlink（C-025 · M4 深度 D3）

| Case ID           | 标题                                           | 自动化路径                                   |
| ----------------- | ---------------------------------------------- | -------------------------------------------- |
| TC-DLINK-LOGIC-01 | 初始 items 值 [10,20,30,40]、长度 4            | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-02 | forward = [10,20,30,40]（沿 next）             | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-03 | backward = [40,30,20,10]（沿 prev）            | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-04 | select toggle + hasSelection                   | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-05 | removeAt 中部（选1）：→[10,30,40]、rewire{0,2} | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-06 | removeAt 头：→[20,30,40]、rewire.left=head     | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-07 | removeAt 尾：→[10,20,30]、rewire.right=tail    | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-08 | removeAt 无选中 → null、items 不变             | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-09 | 删除后 backward 更新（删1后 [40,30,10]）       | `src/components/structures/useDlink.spec.ts` |
| TC-DLINK-LOGIC-10 | reset 复原 [10,20,30,40]、清选中               | `src/components/structures/useDlink.spec.ts` |

### 双端队列逻辑 useDeque（C-026 · M4 深度 D4）

| Case ID           | 标题                                        | 自动化路径                                   |
| ----------------- | ------------------------------------------- | -------------------------------------------- |
| TC-DEQUE-LOGIC-01 | 初始 [1,2,3]、size 3、front 1、back 3       | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-02 | pushBack → 4 落尾：[1,2,3,4]、back 4        | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-03 | pushFront → 4 落头：[4,1,2,3]、front 4      | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-04 | popFront → 1、[2,3]                         | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-05 | popBack → 3、[1,2]                          | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-06 | popFront×3 → isEmpty、front/back null       | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-07 | 满（push 到 6）后 pushBack/pushFront → null | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-08 | 空时 popFront/popBack → null                | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-09 | reset 复原 [1,2,3]                          | `src/components/structures/useDeque.spec.ts` |
| TC-DEQUE-LOGIC-10 | 栈=尾进尾出(LIFO)、队列=尾进头出(FIFO)      | `src/components/structures/useDeque.spec.ts` |

### 动态数组扩容逻辑 useGrow（C-027 · M4 深度 D5·收官）

| Case ID          | 标题                                             | 自动化路径                                  |
| ---------------- | ------------------------------------------------ | ------------------------------------------- |
| TC-GROW-LOGIC-01 | 初始 cap 4、len 3、items [1,2,3]、计数 0         | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-02 | append 未满：grew false、copies 0、cap 4         | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-03 | append 到满再 append：grew true、copies 4、cap 8 | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-04 | 连续翻倍 4→8→16（append 6 次）                   | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-05 | appends 计数随每次 +1                            | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-06 | totalCopies 累计 = 4+8                           | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-07 | amortized = (appends+totalCopies)/appends        | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-08 | amortized 有界：20 次后 ≤ 3（O(1)）              | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-09 | value = ++seq 递增                               | `src/components/structures/useGrow.spec.ts` |
| TC-GROW-LOGIC-10 | reset 复原 cap 4 len 3、计数归零                 | `src/components/structures/useGrow.spec.ts` |

### 字典树逻辑 useTrie（C-028 · M4 广度 B1）

| Case ID          | 标题                                              | 自动化路径                                  |
| ---------------- | ------------------------------------------------- | ------------------------------------------- |
| TC-TRIE-LOGIC-01 | nodes 11、edges 10、words 6（排序）               | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-02 | root：char ''、isEnd false、parent -1             | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-03 | 节点带坐标 + id 唯一 + 非 root char 单字符        | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-04 | 共享前缀：search(car)/search(cat) 前 3 同 [0,1,2] | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-05 | search('card')：found                             | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-06 | search('ca')：prefix-only（不是词）               | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-07 | search('cab')：no-edge（不存在）                  | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-08 | startsWith('ca') = [car,card,cat]                 | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-09 | startsWith('do') = [do,dog]、subtree 2            | `src/components/structures/useTrie.spec.ts` |
| TC-TRIE-LOGIC-10 | startsWith('xyz')：prefixNode -1、words []        | `src/components/structures/useTrie.spec.ts` |

---

## L4 — 前端组件（Vitest + @vue/test-utils，mount）

共 **211** 个用例。运行命令：`pnpm test:unit`

### viz-engine（可视化引擎基础组件）

| Case ID              | 标题                                                 | 自动化路径                          |
| -------------------- | ---------------------------------------------------- | ----------------------------------- |
| TC-VIZ-ARROW-01      | 语义色映射柔和色描在雪佛龙上                         | `src/components/Arrow.spec.ts`      |
| TC-VIZ-ARROW-02      | 非预设色按原值透传                                   | `src/components/Arrow.spec.ts`      |
| TC-VIZ-ARROWTRACK-01 | 每个 Pointer 渲染一个 Arrow 并按 index 定位          | `src/components/ArrowTrack.spec.ts` |
| TC-VIZ-ARROWTRACK-02 | slotWidth 自定义时按其定位（C-006）                  | `src/components/ArrowTrack.spec.ts` |
| TC-VIZ-BLOCK-01      | 渲染数值                                             | `src/components/Block.spec.ts`      |
| TC-VIZ-BLOCK-02      | 背景透明度随 percent                                 | `src/components/Block.spec.ts`      |
| TC-VIZ-BLOCK-03      | percent<0.5 文字色 black，否则 white                 | `src/components/Block.spec.ts`      |
| TC-VIZ-LIST-01       | 渲染与数据等量的 Block                               | `src/components/List.spec.ts`       |
| TC-VIZ-LIST-02       | 最小值 percent=0、最大值 percent=1                   | `src/components/List.spec.ts`       |
| TC-VIZ-BAR-01        | 渲染数值（C-006）                                    | `src/components/Bar.spec.ts`        |
| TC-VIZ-BAR-02        | 高度随 percent 增大（C-006）                         | `src/components/Bar.spec.ts`        |
| TC-VIZ-BAR-03        | state 决定柱体 class（C-006）                        | `src/components/Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-01   | 渲染与数据等量的 Bar（C-006）                        | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-02   | 最大值柱最高、最小值柱最低（C-006）                  | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-03   | comparing 下标进入 comparing 态（C-006）             | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-04   | sortedFrom 之后进入 sorted 态（C-006）               | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-05   | slotWidth 透传给 ArrowTrack（C-006）                 | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BAR-04        | state=min 时柱体加 min class（C-007）                | `src/components/Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-06   | minIndex 指向的 Bar 进入 min 态（C-007）             | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-07   | sortedUpTo 左侧的 Bar 进入 sorted 态（C-007）        | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-08   | 比较帧 minIndex 取 min、另一根取 comparing（C-007）  | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BAR-05        | state=key 时柱体加 key class（C-008）                | `src/components/Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-09   | keyIndex 指向的 Bar 进入 key 态（C-008）             | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-10   | key 优先级压过 sorted，滑入已排序区仍取 key（C-008） | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-11   | 比较帧 keyIndex 取 key、另一根取 comparing（C-008）  | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BAR-06        | state=dimmed 时柱体加 dimmed class（C-010）          | `src/components/Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-12   | groupMembers 内的柱保持 idle、外的柱 dimmed（C-010） | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-13   | dimmed 最低档：组外 key/comparing 仍取本态（C-010）  | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-14   | 空 groupMembers 不淡化任何柱（C-010）                | `src/components/BarsView.spec.ts`   |

### player（播放器外壳，C-006）

| Case ID           | 标题                               | 自动化路径                                        |
| ----------------- | ---------------------------------- | ------------------------------------------------- |
| TC-CODEPANEL-01   | 渲染默认语言(TS)所有行             | `src/components/player/CodePanel.spec.ts`         |
| TC-CODEPANEL-02   | 当前执行行随 point 经 lineMap 高亮 | `src/components/player/CodePanel.spec.ts`         |
| TC-CODEPANEL-03   | 切语言 Tab 后按该语言 lineMap 高亮 | `src/components/player/CodePanel.spec.ts`         |
| TC-VARPANEL-01    | 渲染每个变量的名与值               | `src/components/player/VariablePanel.spec.ts`     |
| TC-VARPANEL-02    | 与上一步比较，变化的行加 changed   | `src/components/player/VariablePanel.spec.ts`     |
| TC-VARPANEL-03    | 无 prev 时都不高亮                 | `src/components/player/VariablePanel.spec.ts`     |
| TC-TRANSPORT-01   | 未播放点主按钮 emit play           | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-02   | 播放中点主按钮 emit pause          | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-03   | atStart 时上一步禁用               | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-04   | atEnd 时下一步禁用                 | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-05   | 下一步 emit stepForward            | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-06   | 重置 emit reset                    | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-07   | 计数器显示 index+1 / total         | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-08   | 拖动进度条 emit seek(值)           | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-09   | 改速 emit setSpeed(值)             | `src/components/player/TransportControls.spec.ts` |
| TC-PLAYER-VIEW-01 | 渲染柱状图+代码+变量+控制          | `src/components/player/AlgorithmPlayer.spec.ts`   |
| TC-PLAYER-VIEW-02 | 默认第 0 步，点下一步到第 2 步     | `src/components/player/AlgorithmPlayer.spec.ts`   |

### article-sort（文章/动画视图）

| Case ID              | 标题                                            | 自动化路径                                              |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| TC-VIEW-BUBBLE-01    | （C-006 改写）挂载渲染 AlgorithmPlayer          | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-BUBBLE-02    | （C-006 改写）初始渲染 10 根柱子且默认停第 0 步 | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-SELECTION-01 | 挂载渲染 AlgorithmPlayer（C-007）               | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-SELECTION-02 | 初始渲染 10 根柱子且默认停第 0 步（C-007）      | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-INSERTION-01 | 挂载渲染 AlgorithmPlayer（C-008）               | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-VIEW-INSERTION-02 | 初始渲染 10 根柱子且默认停第 0 步（C-008）      | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-VIEW-SHELL-01     | 挂载渲染 AlgorithmPlayer（C-010）               | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |
| TC-VIEW-SHELL-02     | 初始渲染 10 根柱子且默认停第 0 步（C-010）      | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |

### home（首页视图）

| Case ID              | 标题                                          | 自动化路径                                       |
| -------------------- | --------------------------------------------- | ------------------------------------------------ |
| TC-VIEW-FOOTER-01    | 渲染 MIT Licensed 文案                        | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-02    | 渲染 Copyright 文案                           | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-03    | 渲染 Zhang Xu 署名                            | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-04    | 渲染 footer 根元素                            | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-CATEGORY-01  | 渲染分类标题                                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-02  | 渲染分类描述                                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-03  | 渲染 children 数量对应的 Item                 | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-04  | 渲染第一个 Item 标题「数组」                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-05  | 渲染第二个 Item 标题「链表」                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-06  | children 为空时无 Item 渲染                   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-HOME-ITEM-01 | 渲染 item 标题                                | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-02 | 渲染 item 描述                                | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-03 | 渲染 img 标签（icon）                         | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-04 | img src 属性对应 icon 字段                    | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-05 | 点击元素调用 router.push，跳转到对应 url name | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-06 | 不同 url 跳转到对应路由名                     | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-SPLASH-01    | 渲染主标题「可视化的」                        | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-02    | 渲染副标题「数据结构与算法」                  | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-03    | 渲染技术栈描述文案                            | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-04    | 渲染「开始学习」按钮                          | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-05    | 点击「开始学习」跳转到 docs/array 页          | `src/views/Home/Splash/Splash.spec.ts`           |

### docs（文档侧边菜单）

| Case ID              | 标题                                          | 自动化路径                                     |
| -------------------- | --------------------------------------------- | ---------------------------------------------- |
| TC-VIEW-DOCS-ITEM-01 | 渲染 item span 文本                           | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-02 | 渲染 .item.btn class                          | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-03 | 点击调用 router.push 跳转到对应 url           | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-04 | url 匹配时 item 有 item-pressed class         | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-05 | url 不匹配时 item 无 item-pressed class       | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-06 | 不同 url 跳转对应路由                         | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-MENU-01      | 挂载成功，渲染 #menu 根元素                   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-02      | 渲染「数据结构」分类标题                      | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-03      | 渲染「经典排序算法」分类标题                  | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-04      | 渲染所有数据结构子项（如「数组」「链表」）    | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-05      | 渲染排序算法子项「冒泡排序」                  | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-06      | useMenuSelect 初始路由 array 使对应 Item 高亮 | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-07      | 点击子菜单项触发路由跳转                      | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-08      | onBeforeRouteUpdate 回调触发后高亮随路由更新  | `src/views/Docs/Menu/Menu.spec.ts`             |

### master（全局框架 Header）

| Case ID             | 标题                                        | 自动化路径                                          |
| ------------------- | ------------------------------------------- | --------------------------------------------------- |
| TC-VIEW-HEADER-01   | 渲染 #header 根元素                         | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-02   | 渲染 logo #logo 元素                        | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-03   | 渲染「V」logo 字符                          | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-04   | 渲染 h1 标题「算法可视化」                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-05   | 点击 logo 跳转到 home 路由                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-06   | 渲染 3 个 icon-link（github/twitter/weibo） | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-07   | 初始无 header shadow class                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-ICONLINK-01 | 渲染 .icon-link 根元素                      | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-02 | 渲染 img 标签                               | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-03 | img src 属性正确                            | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-04 | title 属性渲染到元素上                      | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-05 | 点击调用 window.open 打开对应 url           | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-06 | 不同 url 也能正确打开                       | `src/views/Master/Header/IconLink/IconLink.spec.ts` |

### 归并双轨可视化 + 视图（C-011）

| Case ID           | 标题                                            | 自动化路径                                          |
| ----------------- | ----------------------------------------------- | --------------------------------------------------- |
| TC-VIZ-BAR-07     | state='empty' 时柱体加 empty class 且不显示数值 | `src/components/Bar.spec.ts`                        |
| TC-VIZ-AUXVIEW-01 | 渲染与 aux.array 等长的槽                       | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-02 | filled 的槽为 sorted、其余为 empty              | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-03 | pointer 定位 k 箭头到对应槽                     | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-04 | 无 pointer 时不渲染箭头                         | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-05 | filled 槽高度用主轨 min/max 同尺度              | `src/components/AuxView.spec.ts`                    |
| TC-PLAYER-AUX-01  | module 无 aux 时不渲染 AuxView（向后兼容）      | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-PLAYER-AUX-02  | 当前步带 aux 时渲染 AuxView                     | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-VIEW-MERGE-01  | 挂载渲染 AlgorithmPlayer                        | `src/views/Article/SortAlgorithm/MergeSort.spec.ts` |
| TC-VIEW-MERGE-02  | 初始渲染主轨 10 柱 + 辅助轨且默认停第 0 步      | `src/views/Article/SortAlgorithm/MergeSort.spec.ts` |

### 快排区间栈轨 + 视图（C-012）

| Case ID             | 标题                                                        | 自动化路径                                          |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| TC-VIZ-BAR-08       | state=pivot 时柱体加 pivot class                            | `src/components/Bar.spec.ts`                        |
| TC-VIZ-BARSVIEW-15  | pivotIndex 指向的 Bar 进入 pivot 态                         | `src/components/BarsView.spec.ts`                   |
| TC-VIZ-BARSVIEW-16  | pivot 优先级最高：压过 comparing/groupMembers/sortedIndices | `src/components/BarsView.spec.ts`                   |
| TC-VIZ-BARSVIEW-17  | sortedIndices 内的离散下标进入 sorted 态                    | `src/components/BarsView.spec.ts`                   |
| TC-VIZ-STACKVIEW-01 | 渲染与 frames 等量的栈帧                                    | `src/components/StackView.spec.ts`                  |
| TC-VIZ-STACKVIEW-02 | 栈顶在最上、内容为 a[lo..hi]                                | `src/components/StackView.spec.ts`                  |
| TC-VIZ-STACKVIEW-03 | 栈顶帧高亮（.top）                                          | `src/components/StackView.spec.ts`                  |
| TC-VIZ-STACKVIEW-04 | 固定等宽居中（无 inline left/width）                        | `src/components/StackView.spec.ts`                  |
| TC-VIZ-STACKVIEW-05 | 空栈渲染占位、无栈帧                                        | `src/components/StackView.spec.ts`                  |
| TC-VIZ-STACKVIEW-06 | 稳定 key 入栈渲染（setProps 增帧后旧帧保留）                | `src/components/StackView.spec.ts`                  |
| TC-PLAYER-STACK-01  | module 无 stack 时不渲染 StackView（向后兼容）              | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-PLAYER-STACK-02  | 当前步带 stack 时渲染 StackView                             | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-PLAYER-STACK-03  | 带 aux 不带 stack 只渲染 AuxView（两轨互不干扰）            | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-VIEW-QUICK-01    | 挂载渲染 AlgorithmPlayer                                    | `src/views/Article/SortAlgorithm/QuickSort.spec.ts` |
| TC-VIEW-QUICK-02    | 初始渲染主轨 10 柱 + 区间栈轨且默认停第 0 步                | `src/views/Article/SortAlgorithm/QuickSort.spec.ts` |

---

### 堆排序二叉树轨 + 视图（C-013）

| Case ID            | 标题                                             | 自动化路径                                         |
| ------------------ | ------------------------------------------------ | -------------------------------------------------- |
| TC-VIZ-BAR-09      | state=heapNode 时柱体加 heapNode class           | `src/components/Bar.spec.ts`                       |
| TC-VIZ-BARSVIEW-18 | heapNode 指向的 Bar 进入 heapNode 态             | `src/components/BarsView.spec.ts`                  |
| TC-VIZ-BARSVIEW-19 | heapNode 让位 sorted：已就位后缀优先             | `src/components/BarsView.spec.ts`                  |
| TC-VIZ-BARSVIEW-20 | heapNode 压过 comparing                          | `src/components/BarsView.spec.ts`                  |
| TC-VIZ-TREEVIEW-01 | 渲染节点数 = array.length                        | `src/components/TreeView.spec.ts`                  |
| TC-VIZ-TREEVIEW-02 | 完全二叉树布局坐标                               | `src/components/TreeView.spec.ts`                  |
| TC-VIZ-TREEVIEW-03 | 父子边数 = n-1                                   | `src/components/TreeView.spec.ts`                  |
| TC-VIZ-TREEVIEW-04 | heapNode 节点带 heapNode 类                      | `src/components/TreeView.spec.ts`                  |
| TC-VIZ-TREEVIEW-05 | heapSize 区分就位（k≥heapSize 为 sorted）        | `src/components/TreeView.spec.ts`                  |
| TC-VIZ-TREEVIEW-06 | comparing 黄 / swapped 橙节点态                  | `src/components/TreeView.spec.ts`                  |
| TC-PLAYER-TREE-01  | 当前步带 tree 时渲染 TreeView                    | `src/components/player/AlgorithmPlayer.spec.ts`    |
| TC-PLAYER-TREE-02  | module 无 tree 时不渲染 TreeView（向后兼容）     | `src/components/player/AlgorithmPlayer.spec.ts`    |
| TC-PLAYER-TREE-03  | 带 aux 不带 tree 不渲染 TreeView（多轨互不干扰） | `src/components/player/AlgorithmPlayer.spec.ts`    |
| TC-VIEW-HEAP-01    | 挂载渲染 AlgorithmPlayer                         | `src/views/Article/SortAlgorithm/HeapSort.spec.ts` |
| TC-VIEW-HEAP-02    | 初始渲染二叉树轨 + 主轨 10 柱且默认停第 0 步     | `src/views/Article/SortAlgorithm/HeapSort.spec.ts` |

### 计数桶轨 + 视图（C-014）

| Case ID             | 标题                                                | 自动化路径                                             |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| TC-VIZ-BARSVIEW-21  | dimFrom 连续后缀淡化（index≥dimFrom → dimmed）      | `src/components/BarsView.spec.ts`                      |
| TC-VIZ-BARSVIEW-22  | dimFrom 与 sortedUpTo 共存：前缀绿/活跃 idle/后缀淡 | `src/components/BarsView.spec.ts`                      |
| TC-VIZ-COUNTVIEW-01 | 渲染桶数 = buckets.length                           | `src/components/CountView.spec.ts`                     |
| TC-VIZ-COUNTVIEW-02 | 每桶单元格数 = buckets[b]                           | `src/components/CountView.spec.ts`                     |
| TC-VIZ-COUNTVIEW-03 | 桶底值标签 = b + min                                | `src/components/CountView.spec.ts`                     |
| TC-VIZ-COUNTVIEW-04 | activeBucket 桶带 .active                           | `src/components/CountView.spec.ts`                     |
| TC-VIZ-COUNTVIEW-05 | 空桶渲染 0 格、仍显值与计数 0                       | `src/components/CountView.spec.ts`                     |
| TC-VIZ-COUNTVIEW-06 | 桶顶计数数字 = buckets[b]                           | `src/components/CountView.spec.ts`                     |
| TC-PLAYER-COUNT-01  | 当前步带 count 时渲染 CountView                     | `src/components/player/AlgorithmPlayer.spec.ts`        |
| TC-PLAYER-COUNT-02  | module 无 count 时不渲染 CountView（向后兼容）      | `src/components/player/AlgorithmPlayer.spec.ts`        |
| TC-PLAYER-COUNT-03  | 带 tree 不带 count 不渲染 CountView（多轨互不干扰） | `src/components/player/AlgorithmPlayer.spec.ts`        |
| TC-VIEW-COUNT-01    | 挂载渲染 AlgorithmPlayer                            | `src/views/Article/SortAlgorithm/CountingSort.spec.ts` |
| TC-VIEW-COUNT-02    | 初始渲染计数桶轨 + 主轨 10 柱且默认停第 0 步        | `src/views/Article/SortAlgorithm/CountingSort.spec.ts` |

### 知识页骨架 + 栈互动 + 栈页（C-015）

| Case ID              | 标题                           | 自动化路径                                      |
| -------------------- | ------------------------------ | ----------------------------------------------- |
| TC-VIZ-ARTICLE-01    | 渲染 .article 容器             | `src/components/article/Article.spec.ts`        |
| TC-VIZ-ARTICLE-02    | slot 内容透传                  | `src/components/article/Article.spec.ts`        |
| TC-VIZ-CALLOUT-01    | 渲染 .callout 且 slot 出现     | `src/components/article/Callout.spec.ts`        |
| TC-VIZ-PLAYGROUND-01 | 默认角标「亲手试试」+ slot     | `src/components/article/Playground.spec.ts`     |
| TC-VIZ-PLAYGROUND-02 | 自定义 title 角标              | `src/components/article/Playground.spec.ts`     |
| TC-VIZ-STACKVIZ-01   | 初始空：栈为空 + pop/peek 禁用 | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-02   | push 增盘子、值为递增序号      | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-03   | 栈顶 is-top 落在最后压入元素   | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-04   | 每 item 含「← 栈顶」节点       | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-05   | pop 减盘子并解说               | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-06   | push 到 8 后 push 禁用         | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-07   | 重置清空                       | `src/components/structures/StackViz.spec.ts`    |
| TC-VIZ-STACKVIZ-08   | peek 解说栈顶不取走            | `src/components/structures/StackViz.spec.ts`    |
| TC-VIEW-STACK-01     | 挂载渲染 Article + StackViz    | `src/views/Article/DataStructure/Stack.spec.ts` |
| TC-VIEW-STACK-02     | 含「栈」标题与 Playground      | `src/views/Article/DataStructure/Stack.spec.ts` |

### 队列互动 QueueViz + 队列页（C-016）

| Case ID            | 标题                                         | 自动化路径                                      |
| ------------------ | -------------------------------------------- | ----------------------------------------------- |
| TC-VIZ-QUEUEVIZ-01 | 初始空：队列为空 + dequeue/peek 禁用         | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-02 | enqueue 增元素、值为递增序号                 | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-03 | 队首 is-front 落 index0、队尾 is-rear 落末位 | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-04 | 每 qitem 含队首/队尾 marker 节点             | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-05 | dequeue 移队首并解说（新队首=2）             | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-06 | enqueue 到 6 后 enqueue 禁用                 | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-07 | 重置清空                                     | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIZ-QUEUEVIZ-08 | peek 解说队首不取走                          | `src/components/structures/QueueViz.spec.ts`    |
| TC-VIEW-QUEUE-01   | 挂载渲染 Article + QueueViz                  | `src/views/Article/DataStructure/Queue.spec.ts` |
| TC-VIEW-QUEUE-02   | 含「队列」标题与 Playground                  | `src/views/Article/DataStructure/Queue.spec.ts` |

### 数组互动 ArrayViz + 数组页（C-017）

| Case ID            | 标题                                           | 自动化路径                                      |
| ------------------ | ---------------------------------------------- | ----------------------------------------------- |
| TC-VIZ-ARRAYVIZ-01 | 初始 4 格 + 下标 0..3 + 无选中禁访问/插入/删除 | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-02 | 点格选中：cell/slot is-selected + 启用三键     | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-03 | insert 增元素、新值落 i、下标≠值               | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-04 | remove 减元素                                  | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-05 | append 尾增（无需选中）                        | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-06 | 下标行数量 = items 数、文本 0..n-1             | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-07 | 满 8 禁插入/追加                               | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-08 | access 解说含 O(1)                             | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-09 | reset 复位 4 格、清选中                        | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIZ-ARRAYVIZ-10 | 删空显示 empty-hint + 禁三键                   | `src/components/structures/ArrayViz.spec.ts`    |
| TC-VIEW-ARRAY-01   | 挂载渲染 Article + ArrayViz                    | `src/views/Article/DataStructure/Array.spec.ts` |
| TC-VIEW-ARRAY-02   | 含「数组」标题与 Playground                    | `src/views/Article/DataStructure/Array.spec.ts` |

### 链表互动 LinkViz + 链表页（C-018）

| Case ID           | 标题                                     | 自动化路径                                     |
| ----------------- | ---------------------------------------- | ---------------------------------------------- |
| TC-VIZ-LINKVIZ-01 | 初始 3 节点 + head + null + 无选中禁三键 | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-02 | 点节点选中：is-sel + 启用查找/插入/删除  | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-03 | insertAfter 增节点、新值落选中后         | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-04 | remove 减节点                            | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-05 | prepend 头插落表头                       | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-06 | 每节点带 next 箭头 + 有 head/null        | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-07 | 满 6 禁插入/头插                         | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-08 | find 同步解说含 O(n)                     | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-09 | reset 复位 3 节点、清选中                | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIZ-LINKVIZ-10 | 删空显示 empty-hint + 禁三键             | `src/components/structures/LinkViz.spec.ts`    |
| TC-VIEW-LINK-01   | 挂载渲染 Article + LinkViz               | `src/views/Article/DataStructure/Link.spec.ts` |
| TC-VIEW-LINK-02   | 含「链表」标题与 Playground              | `src/views/Article/DataStructure/Link.spec.ts` |

### BST 互动 TreeViz + 树页（C-019）

| Case ID           | 标题                                 | 自动化路径                                     |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| TC-VIZ-TREEVIZ-01 | 初始 7 节点 + 6 边 + 输入框 + 4 按钮 | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-02 | insert 增节点、含新值                | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-03 | insert 查重不增、解说已存在          | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-04 | search 找到解说                      | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-05 | search 没找到解说                    | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-06 | 中序遍历解说含升序序列               | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-07 | 超 4 层解说上限                      | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-08 | reset 复位 7 节点                    | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-09 | 非法值提示、不增                     | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIZ-TREEVIZ-10 | 边数 = 节点数 - 1                    | `src/components/structures/TreeViz.spec.ts`    |
| TC-VIEW-TREE-01   | 挂载渲染 Article + TreeViz           | `src/views/Article/DataStructure/Tree.spec.ts` |
| TC-VIEW-TREE-02   | 含「树」标题与 Playground            | `src/views/Article/DataStructure/Tree.spec.ts` |

### 大顶堆互动 HeapViz + 堆页（C-020）

| Case ID           | 标题                                        | 自动化路径                                     |
| ----------------- | ------------------------------------------- | ---------------------------------------------- |
| TC-VIZ-HEAPVIZ-01 | 初始 7 格 + 7 节点 + 6 边 + 输入框 + 3 按钮 | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-02 | insert 双视图各 +1                          | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-03 | insert 出现新值 95                          | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-04 | extract 双视图各 -1                         | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-05 | extract 解说弹出 + 最大值 90                | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-06 | 双视图同步：格数 == 节点数                  | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-07 | 边数 = 节点数 - 1                           | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-08 | 非法值提示、不增                            | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-09 | reset 复位 7 格                             | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIZ-HEAPVIZ-10 | insert 解说含「上浮」                       | `src/components/structures/HeapViz.spec.ts`    |
| TC-VIEW-HEAPDS-01 | 挂载渲染 Article + HeapViz                  | `src/views/Article/DataStructure/Heap.spec.ts` |
| TC-VIEW-HEAPDS-02 | 含「堆」标题与 Playground                   | `src/views/Article/DataStructure/Heap.spec.ts` |

### 哈希互动 HashViz + 哈希页（C-021）

| Case ID           | 标题                                      | 自动化路径                                     |
| ----------------- | ----------------------------------------- | ---------------------------------------------- |
| TC-VIZ-HASHVIZ-01 | 初始 7 桶 + 桶1 含 2 项 + 输入框 + 3 按钮 | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-02 | insert 空桶直放                           | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-03 | insert 冲突追加链尾                       | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-04 | insert 总项数 +1                          | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-05 | insert 查重不增、解说已存在               | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-06 | search 命中解说                           | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-07 | search 没找到解说                         | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-08 | insert 解说含 hash 算式                   | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-09 | 非法值提示、不增                          | `src/components/structures/HashViz.spec.ts`    |
| TC-VIZ-HASHVIZ-10 | reset 复位 4 项                           | `src/components/structures/HashViz.spec.ts`    |
| TC-VIEW-HASH-01   | 挂载渲染 Article + HashViz                | `src/views/Article/DataStructure/Hash.spec.ts` |
| TC-VIEW-HASH-02   | 含「哈希表」标题与 Playground             | `src/views/Article/DataStructure/Hash.spec.ts` |

### 图互动 GraphViz + 图页（C-022）

| Case ID            | 标题                                       | 自动化路径                                      |
| ------------------ | ------------------------------------------ | ----------------------------------------------- |
| TC-VIZ-GRAPHVIZ-01 | 初始 6 顶点 + 7 边 + 3 按钮 + 默认起点高亮 | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-02 | 顶点标签 A–F                               | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-03 | 点顶点换起点（唯一 is-start）              | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-04 | BFS status 含「队列」+ A B C D E F         | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-05 | DFS status 含「栈」+ A B D E F C           | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-06 | BFS helper-label 含「队列」                | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-07 | DFS helper-label 含「栈」                  | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-08 | 重置复位（无 current、status 含起点）      | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-09 | 换起点后 BFS 从该点出发                    | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIZ-GRAPHVIZ-10 | BFS 与 DFS 顺序不同                        | `src/components/structures/GraphViz.spec.ts`    |
| TC-VIEW-GRAPH-01   | 挂载渲染 Article + GraphViz                | `src/views/Article/DataStructure/Graph.spec.ts` |
| TC-VIEW-GRAPH-02   | 含「图」标题与 Playground                  | `src/views/Article/DataStructure/Graph.spec.ts` |

### 平衡互动 BalanceViz + 树页平衡节（C-023 · M4 深度 D1）

| Case ID          | 标题                                                   | 自动化路径                                     |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------- |
| TC-VIZ-BALVIZ-01 | 初始退化：7 节点+6 边+3 按钮+退化 on+readout 7 层/7 次 | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-02 | 切平衡：readout 3 层/3 次、节点 7、平衡 on             | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-03 | 退化节点值 1–7                                         | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-04 | 查找 7（退化）status 含「7 步」                        | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-05 | 查找 7（平衡）status 含「3 步」                        | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-06 | 切回退化：readout 回 7 层                              | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-07 | 退化 vs 平衡 readout 不同                              | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIZ-BALVIZ-08 | 边数两 mode 均 6                                       | `src/components/structures/BalanceViz.spec.ts` |
| TC-VIEW-TREE-03  | 树页含 BalanceViz（平衡节）                            | `src/views/Article/DataStructure/Tree.spec.ts` |

### 开放寻址互动 HashProbeViz + 哈希页开放寻址节（C-024 · M4 深度 D2）

| Case ID            | 标题                                        | 自动化路径                                       |
| ------------------ | ------------------------------------------- | ------------------------------------------------ |
| TC-VIZ-PROBEVIZ-01 | 初始 7 格+4 filled+3 按钮+readout 4/7       | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-02 | 初始 filled 格含 15/8/23/4                  | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-03 | 插入 5（非冲突）filled→5、status 含「落座」 | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-04 | 插入 9（冲突）filled→5、status 含「探测」   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-05 | 查找 8（命中）status 含「命中」             | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-06 | 查找 99（未命中）status 含「不在表中」      | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-07 | 填满后插入 status 含「扩容」、readout 7/7   | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIZ-PROBEVIZ-08 | 重置 filled 回 4、readout 4/7               | `src/components/structures/HashProbeViz.spec.ts` |
| TC-VIEW-HASH-03    | 哈希页含 HashProbeViz（开放寻址节）         | `src/views/Article/DataStructure/Hash.spec.ts`   |

### 双向链表互动 DlinkViz + 链表页双向节（C-025 · M4 深度 D3）

| Case ID            | 标题                                              | 自动化路径                                     |
| ------------------ | ------------------------------------------------- | ---------------------------------------------- |
| TC-VIZ-DLINKVIZ-01 | 初始 4 dnode + 双箭头(→/←) + 3 按钮 + head + tail | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-02 | dnode 值 10/20/30/40                              | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-03 | 点 dnode[1] 选中 is-sel                           | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-04 | 反向遍历：status 含「反向」且「40 → 30」          | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-05 | 删除选中（选1）：dnode→3、status 含 O(1)/prev     | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-06 | 删头删除：首 dnode 变 20、dnode→3                 | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-07 | 未选中时删除按钮禁用、dnode 仍 4                  | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIZ-DLINKVIZ-08 | 重置回 4 dnode                                    | `src/components/structures/DlinkViz.spec.ts`   |
| TC-VIEW-LINK-03    | 链表页含 DlinkViz（双向链表节）                   | `src/views/Article/DataStructure/Link.spec.ts` |

### 双端队列互动 DequeViz + 队列页双端节（C-026 · M4 深度 D4）

| Case ID            | 标题                                           | 自动化路径                                      |
| ------------------ | ---------------------------------------------- | ----------------------------------------------- |
| TC-VIZ-DEQUEVIZ-01 | 初始 3 dqitem + 5 按钮 + 头/尾标记             | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-02 | dqitem 值 1/2/3                                | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-03 | 尾部入：4 dqitem、status 含「尾」              | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-04 | 头部入：4 dqitem、首位=新值、status 含「头」   | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-05 | 头部出：剩 2 dqitem、首位变 2、status 含「头」 | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-06 | 尾部出：剩 2 dqitem、末位变 2、status 含「尾」 | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-07 | 头部出×3 → 空：出队禁用 + empty-hint           | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIZ-DEQUEVIZ-08 | 重置回 3 dqitem                                | `src/components/structures/DequeViz.spec.ts`    |
| TC-VIEW-QUEUE-03   | 队列页含 DequeViz（双端队列节）                | `src/views/Article/DataStructure/Queue.spec.ts` |

### 动态数组扩容互动 ArrayGrowViz + 数组页扩容节（C-027 · M4 深度 D5·收官）

| Case ID           | 标题                                          | 自动化路径                                       |
| ----------------- | --------------------------------------------- | ------------------------------------------------ |
| TC-VIZ-GROWVIZ-01 | 初始 4 gcell + 3 filled + 追加/重置 + readout | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-02 | filled 格值 1/2/3                             | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-03 | append 未满：4 filled、status 含 O(1)         | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-04 | append×2 触发扩容：8 gcell、status 含「扩容」 | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-05 | 扩容那次 status 含 O(n)                       | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-06 | stats 含均摊统计（append 次数）               | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-07 | 连续 append 6 次：容量翻倍到 16（16 gcell）   | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIZ-GROWVIZ-08 | 重置回 3 filled、4 gcell                      | `src/components/structures/ArrayGrowViz.spec.ts` |
| TC-VIEW-ARRAY-03  | 数组页含 ArrayGrowViz（扩容节）               | `src/views/Article/DataStructure/Array.spec.ts`  |

### 字典树互动 TrieViz + 字典树页（C-028 · M4 广度 B1，新页）

| Case ID           | 标题                                 | 自动化路径                                     |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| TC-VIZ-TRIEVIZ-01 | 11 tnode + 10 edge + 输入框 + 3 按钮 | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-02 | 节点字符含 c/a/t/r/d/u/p/o/g         | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-03 | 查找 card：status 含「是一个词」     | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-04 | 查找 ca：status 含「前缀」           | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-05 | 查找 cab：status 含「不存在」        | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-06 | 前缀 ca：status 含「car」（补全）    | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-07 | 前缀 ca：子树点亮 .tnode.lit = 4     | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIZ-TRIEVIZ-08 | 重置：清高亮                         | `src/components/structures/TrieViz.spec.ts`    |
| TC-VIEW-TRIE-01   | 挂载渲染 Article + TrieViz           | `src/views/Article/DataStructure/Trie.spec.ts` |
| TC-VIEW-TRIE-02   | 含「字典树」标题与 Playground        | `src/views/Article/DataStructure/Trie.spec.ts` |

---

## L5 — 端到端（Playwright）

共 **24** 个用例（TC-E2E-BUBBLE-01 已 superseded）。运行命令：`pnpm test:e2e`

| Case ID             | 标题                                                        | 自动化路径                   | 状态       |
| ------------------- | ----------------------------------------------------------- | ---------------------------- | ---------- |
| TC-E2E-HOME-01      | 首页加载并能进入 docs                                       | `e2e/home-navigation.e2e.ts` | active     |
| TC-E2E-MENU-01      | docs 菜单点击切换路由                                       | `e2e/docs-menu.e2e.ts`       | active     |
| TC-E2E-BUBBLE-01    | ~~冒泡排序动画最终升序~~                                    | `e2e/bubble-sort.e2e.ts`     | superseded |
| TC-E2E-PLAYER-01    | 冒泡播放器：默认暂停/单步/跳末升序/重置                     | `e2e/bubble-sort.e2e.ts`     | active     |
| TC-E2E-SELECTION-01 | 选择排序播放器：默认暂停/单步/跳末升序/重置                 | `e2e/selection-sort.e2e.ts`  | active     |
| TC-E2E-INSERTION-01 | 插入排序播放器：默认暂停/单步/跳末升序/重置                 | `e2e/insertion-sort.e2e.ts`  | active     |
| TC-E2E-SHELL-01     | 希尔排序播放器：默认暂停/单步聚焦分组/跳末升序/重置         | `e2e/shell-sort.e2e.ts`      | active     |
| TC-E2E-MERGE-01     | 归并播放器：默认暂停 / 合并聚焦+temp填充 / 跳末升序 / 重置  | `e2e/merge-sort.e2e.ts`      | active     |
| TC-E2E-QUICK-01     | 快排播放器：默认暂停/区间栈轨/pivot品红/跳末升序全绿/重置   | `e2e/quick-sort.e2e.ts`      | active     |
| TC-E2E-HEAP-01      | 堆排序播放器 e2e：默认暂停/树轨/heapNode/跳末升序/重置      | `e2e/heap-sort.e2e.ts`       | active     |
| TC-E2E-COUNT-01     | 计数排序播放器：默认暂停/桶轨/计数填桶/空桶/跳末升序/重置   | `e2e/counting-sort.e2e.ts`   | active     |
| TC-E2E-STACK-01     | 栈知识页：正文+互动栈/push/栈顶跟随/pop/重置空态            | `e2e/stack.e2e.ts`           | active     |
| TC-E2E-QUEUE-01     | 队列知识页：正文+互动队列/enqueue/双指针/dequeue移队首/重置 | `e2e/queue.e2e.ts`           | active     |
| TC-E2E-ARRAY-01     | 数组知识页：正文+互动数组/点选下标/插入右移/尾部追加/重置   | `e2e/array.e2e.ts`           | active     |
| TC-E2E-LINK-01      | 链表知识页：正文+互动链表/点节点选中/选中后插入/头插/重置   | `e2e/link.e2e.ts`            | active     |
| TC-E2E-TREE-01      | 树知识页：正文+互动 BST/输入插入走位/中序=升序/重置         | `e2e/tree.e2e.ts`            | active     |
| TC-E2E-HEAPDS-01    | 堆知识页：正文+互动堆/数组+树双视图/输入插入上浮/重置       | `e2e/heap.e2e.ts`            | active     |
| TC-E2E-HASH-01      | 哈希表知识页：正文+互动哈希/散列直达/冲突追加/重置          | `e2e/hash.e2e.ts`            | active     |
| TC-E2E-GRAPH-01     | 图知识页：正文+互动图/BFS 队列遍历/重置                     | `e2e/graph.e2e.ts`           | active     |
| TC-E2E-TREE-02      | 树页·平衡节：退化↔平衡对照 + 查找走位                       | `e2e/tree.e2e.ts`            | active     |
| TC-E2E-HASH-02      | 哈希页·开放寻址节：扁平表 7 格/线性探测插入/未命中/重置     | `e2e/hash.e2e.ts`            | active     |
| TC-E2E-LINK-02      | 链表页·双向节：4 节点/反向遍历/点节点 O(1) 删除/重置        | `e2e/link.e2e.ts`            | active     |
| TC-E2E-QUEUE-02     | 队列页·双端节：3 元素/头部入/尾部出/重置（两端进出）        | `e2e/queue.e2e.ts`           | active     |
| TC-E2E-ARRAY-02     | 数组页·扩容节：容量满了翻倍扩容 + 均摊 O(1)                 | `e2e/array.e2e.ts`           | active     |
| TC-E2E-TRIE-01      | 字典树页：11 节点 / 查找 card「词」/ 前缀 ca「car」/ 重置   | `e2e/trie.e2e.ts`            | active     |

---

## 覆盖率（L3+L4，2026-06-25）

| 指标   | 实际值 | 阈值 | 状态 |
| ------ | ------ | ---- | ---- |
| Stmts  | 92.47% | 70%  | 达标 |
| Branch | 89.86% | 60%  | 达标 |
| Funcs  | 92.80% | 70%  | 达标 |
| Lines  | 93.53% | 70%  | 达标 |

> 注：`HeapViz.vue` 单文件偏低（行 ~68% / 分支 ~56%）——未覆盖为 setTimeout 驱动的上浮/下沉**分步动画循环体**（`useHeap` 堆逻辑本身 L3 100% 覆盖、分步动画由 `TC-E2E-HEAPDS-01` 真机覆盖）；聚合门槛达标。
