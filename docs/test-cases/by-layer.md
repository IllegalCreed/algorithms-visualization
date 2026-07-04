# 测试用例分层视图

> Status: active
> Last reviewed: 2026-06-26
> Owner: IllegalCreed

同一 Case ID 的事实字段（owner plan、自动化路径、状态、最后验证）见 `index.md`。
本文件仅提供分层视角，便于按层级评审覆盖度。

## L3 — 前端单元（Vitest，不 mount）

共 **714** 个用例。运行命令：`pnpm test:unit`

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

| Case ID      | 标题                                                            | 自动化路径                              |
| ------------ | --------------------------------------------------------------- | --------------------------------------- |
| TC-HOOK-01-1 | 三分类，6 顶层分类·字符串含 KMP+Rabin-Karp+Boyer-Moore（C-064） | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-2 | 数据结构分类含 15 项（…/线段树/B+ 树/布隆过滤器 C-036）         | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-3 | 每个条目含 title/desc/icon/url                                  | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-4 | 所有 url 唯一                                                   | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-5 | 每个分类含 desc                                                 | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-02-1 | 三分类，6 顶层分类·字符串含 KMP+Rabin-Karp+Boyer-Moore（C-064） | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-2 | 每项含 title/url 且均非空                                       | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-3 | 所有 url 唯一                                                   | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-4 | 数据结构含 15 项，排序含 15 项（新增鸡尾酒排序 C-045）          | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-03-1 | 组件挂载时注册 scroll 监听器                                    | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-2 | 组件卸载时移除 scroll 监听器                                    | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-3 | scrollY > 0 时 isShowHeaderShadow 变为 true                     | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-4 | scrollY === 0 时 isShowHeaderShadow 变为 false                  | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-04-1 | 组件挂载后 isShowHeaderShadow 变为 true                         | `src/views/Docs/hooks.spec.ts`          |
| TC-HOOK-04-2 | 组件卸载后 isShowHeaderShadow 恢复为 false                      | `src/views/Docs/hooks.spec.ts`          |
| TC-HOOK-05-1 | 返回 4 项 微博/X/GitHub/个人主页，title 文案（C-030 改 3→4）    | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-2 | 每项 title/src/url 非空且 url 为 https（C-009 改写）            | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-3 | 微博/X url 含线上域名+path；GitHub=仓库地址（C-009 改写）       | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-4 | 个人主页项 url 指向 HOME_PAGE_URL（C-030 新增）                 | `src/views/Master/Header/hooks.spec.ts` |

### share（C-009）

| Case ID     | 标题                                              | 自动化路径                              |
| ----------- | ------------------------------------------------- | --------------------------------------- |
| TC-SHARE-01 | buildShareTargetUrl 拼线上域名 + fullPath         | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-02 | buildShareTargetUrl 保留 query/hash               | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-03 | buildWeiboShareUrl 指向微博分享页                 | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-04 | buildXShareUrl 指向 X 分享页                      | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-05 | 链接与中文文案经 URLSearchParams 编码             | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-06 | 常量 GITHUB_REPO_URL / SITE_ORIGIN 校验           | `src/views/Master/Header/share.spec.ts` |
| TC-SHARE-07 | 常量 HOME_PAGE_URL 为个人主页 https 链接（C-030） | `src/views/Master/Header/share.spec.ts` |

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

### 基数排序模块 radix-sort.module（C-039 · M7 排序 S1）

固定 `[42,7,25,63,18,31,56,9]` LSD 2 轮（个位、十位）；复用算法播放器 + CountView 桶轨。

| Case ID             | 标题                                                | 自动化路径                                       |
| ------------------- | --------------------------------------------------- | ------------------------------------------------ |
| TC-RADIX-MOD-01     | 末步 done、有序 = oracle.result                     | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-02     | 不修改入参                                          | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-03     | 位置键恒为 0..7                                     | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-04     | 每步 point 合法且带桶轨 count                       | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-05     | 步数结构 distribute16/collect16/passStart2/done1    | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-06     | 第 1 轮个位分桶计数 [0,1,1,1,0,1,1,1,1,1]           | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-07     | 首个 distribute activeBucket 2 + 读游标 1           | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-08     | 第 1 轮收集 [31,42,63,25,56,7,18,9] + 写游标 3      | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-09     | done 步 sortedUpTo=n、无指针                        | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-10     | 四语言齐备                                          | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-11     | 每语言每 point 行号在源码行数内                     | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-12     | 产出的 point 都能映射行号                           | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-RADIX-MOD-13     | module 元信息（title/initialInput）                 | `src/algorithms/radix-sort.module.spec.ts`       |
| TC-BUCKET-MOD-01    | 末步 done、有序 = oracle.result                     | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-02    | 不修改入参                                          | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-03    | 位置键恒为 0..7                                     | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-04    | 每步 point 合法且带桶轨 bucket                      | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-05    | 步数结构 distribute8/sortBucket5/concat8/done1      | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-06    | 分配末桶 桶0[3,9]/桶1[]/桶2[29,25,21]               | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-07    | 首个 distribute activeBucket 2 + 读游标 1           | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-08    | 桶内排序 桶2 [21,25,29]                             | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-09    | 末 concat 整体有序 + 写游标 3                       | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-10    | done 步 sortedUpTo=n、无指针                        | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-11    | 桶值域 ranges 5 桶宽 10                             | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-12    | 四语言 + 行号在源码行数内                           | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-BUCKET-MOD-13    | module 元信息（title/initialInput）                 | `src/algorithms/bucket-sort.module.spec.ts`      |
| TC-3WQUICK-MOD-01   | 末步 done、有序 = oracle.result                     | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-02   | 不修改入参                                          | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-03   | 位置键恒为 0..7                                     | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-04   | 步合法且带区间栈 stack                              | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-05   | 三路分支守恒 #compare=#less+#greater+#equal         | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-06   | 弹/选/压守恒 #pop=#pivotSelect=#push                | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-07   | 首划分基准 = a[lo] = 5                              | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-08   | 首划分后三段成形 + 中段（值 5）钉死                 | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-09   | 三分支 less/greater/equal 各≥1 次                   | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-10   | done 步 sortedIndices 全量、无指针                  | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-11   | compare 步含 lt/i/gt 三指针                         | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-12   | 四语言 + 行号在源码行数内                           | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-3WQUICK-MOD-13   | module 元信息（title/initialInput）                 | `src/algorithms/three-way-quick.module.spec.ts`  |
| TC-DUALPIVOT-MOD-01 | 末步 done、有序 = oracle.result                     | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-02 | 不修改入参                                          | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-03 | 位置键恒为 0..7                                     | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-04 | 步合法且带区间栈 stack                              | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-05 | 三路分支守恒 #compare=#less+#between+#greater       | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-06 | 弹/选/归/压守恒 #pop=#pivotSelect=#pivotPlace=#push | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-07 | 首趟 p=3/q=7 且扫描步 pivotIndices=[0,7]            | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-08 | 首趟归位快照 [2,1,3,5,6,4,7,9] 且 2/6 钉死          | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-09 | 三分支 less/between/greater 各≥1 次                 | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-10 | 每 pivotSelect p≤q 且存在换端步                     | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-11 | done 步 sortedIndices 全量、无指针                  | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-12 | compare 步含 lt/i/gt 三指针                         | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-13 | 四语言 + 行号在源码行数内                           | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-DUALPIVOT-MOD-14 | module 元信息（title/initialInput）                 | `src/algorithms/dual-pivot-quick.module.spec.ts` |
| TC-TDMERGE-MOD-01   | 末步 done、有序 = oracle.result                     | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-02   | 不修改入参                                          | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-03   | 位置键恒为 0..7                                     | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-04   | 步合法且同时带 aux+stack 双辅助轨                   | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-05   | #split=7 且首 split 栈 [[0,7]]                      | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-06   | merge 块守恒 #mergeStart=#writeBack=7               | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-07   | #compare=#take、take+drain=24                       | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-08   | 首合并快照 merge[0,1] 后 [3,6]                      | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-09   | 递归栈深达 3 且 done 栈空                           | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-10   | 首 mergeStart 栈顶 [0,1]                            | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-11   | done 步 sortedFrom=0、无指针                        | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-12   | compare 步含 i/j 双指针 + comparing                 | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-13   | 四语言 + 行号在源码行数内                           | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-TDMERGE-MOD-14   | module 元信息（title/initialInput）                 | `src/algorithms/top-down-merge.module.spec.ts`   |
| TC-BININS-MOD-01    | 末步 done、有序 = oracle.result                     | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-02    | 不修改入参                                          | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-03    | 位置键恒为 0..7                                     | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-04    | 步点合法（8 执行点）                                | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-05    | 轮结构守恒 #outerLoop=#found=#insert=7              | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-06    | 折半守恒 #probe=#goLeft+#goRight=15                 | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-07    | 搬移总数 #shift=15                                  | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-08    | 零移动轮 key=9 found pos=2 后紧跟 insert            | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-09    | 全移动轮 key=1 found pos=0 后连续 5 shift           | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-10    | probe 步 lo/mid/hi 三指针 + comparing               | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-11    | outerLoop 步 keyIndex=i                             | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-12    | done 步 sortedUpTo=n、无指针                        | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-13    | 四语言 + 行号在源码行数内                           | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-BININS-MOD-14    | module 元信息（title/initialInput）                 | `src/algorithms/binary-insertion.module.spec.ts` |
| TC-COCKTAIL-MOD-01  | 末步 done、有序 = oracle.result                     | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-02  | 不修改入参                                          | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-03  | 位置键恒为 0..7                                     | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-04  | 步点合法（9 执行点带方向）                          | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-05  | 趟结构 #forwardPass=#backwardPass=2                 | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-06  | 比较守恒分向 f12/b10                                | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-07  | 交换总数 #fSwap=7/#bSwap=6                          | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-08  | 乌龟一趟回头（bwd1 六连 bSwap）                     | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-09  | 双端并存 sortedFrom=7 且 sortedUpTo=1               | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-10  | 提前收工（末 4 比较全 bNoSwap→done）                | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-11  | f/b compare 步 comparing+双指针                     | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-12  | done 步 sortedFrom=0、无指针                        | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-13  | 四语言 + 行号在源码行数内                           | `src/algorithms/cocktail.module.spec.ts`         |
| TC-COCKTAIL-MOD-14  | module 元信息（title/initialInput）                 | `src/algorithms/cocktail.module.spec.ts`         |

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

### 并查集逻辑 useUnionFind（C-029 · M4 广度 B2）

| Case ID        | 标题                                   | 自动化路径                                       |
| -------------- | -------------------------------------- | ------------------------------------------------ |
| TC-UF-LOGIC-01 | 初始 parent [0..7]、groupCount 8       | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-02 | union(0,1)：merged、parent[0]=1、组 7  | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-03 | union 同组：merged false、组不减       | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-04 | 链后 find(0)：root 3、path [0,1,2,3]   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-05 | find 纯走位不改 parent                 | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-06 | compress(0)（链后）：parent[0/1/2]=3   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-07 | connected：(0,1)true、(0,2)false       | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-08 | connected 经链：connected(0,3) true    | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-09 | groupCount 随 union 递减（3 次后 5）   | `src/components/structures/useUnionFind.spec.ts` |
| TC-UF-LOGIC-10 | reset 复原 parent [0..7]、groupCount 8 | `src/components/structures/useUnionFind.spec.ts` |

### LRU 缓存逻辑 useLRU（C-031 · M4 广度 B3）

| Case ID         | 标题                                           | 自动化路径                                 |
| --------------- | ---------------------------------------------- | ------------------------------------------ |
| TC-LRU-LOGIC-01 | 初始 keys [3,2,1]、size 3、capacity 4          | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-02 | get(1) 命中：type hit、value 10                | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-03 | get(1) 移最前：keys [1,3,2]                    | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-04 | get(9) 未命中：type miss、不变                 | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-05 | put(4,40) 新键未满：put-new、keys[0]=4、size 4 | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-06 | put(2,99) 更新：put-update、(2,99)、size 3     | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-07 | put 满后淘汰：put(4);put(5) → evicted 1        | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-08 | 淘汰 LRU 末位：07 后 keys [5,4,3,2]            | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-09 | 连续 put 5 新键：size ≤ 4                      | `src/components/structures/useLRU.spec.ts` |
| TC-LRU-LOGIC-10 | reset 复原 keys [3,2,1]、size 3                | `src/components/structures/useLRU.spec.ts` |

### 跳表逻辑 useSkipList（C-032 · M4 广度 B4）

| Case ID          | 标题                                           | 自动化路径                                      |
| ---------------- | ---------------------------------------------- | ----------------------------------------------- |
| TC-SKIP-LOGIC-01 | nodes 9（head+8）、maxLevel 4、元素 [1..15 奇] | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-02 | 元素 heights [4,1,2,1,3,1,2,1]、head 4         | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-03 | 各层元素数 L0 8、L1 4、L2 2、L3 1              | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-04 | search(11) found                               | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-05 | search(11) visitedValues [1,9,11]              | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-06 | search(8) not found、visited [1,5,7]           | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-07 | search(1) found                                | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-08 | search(15) found、visited [1,9,13,15]          | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-09 | search(99) not found                           | `src/components/structures/useSkipList.spec.ts` |
| TC-SKIP-LOGIC-10 | path level 单调不增、move 合法                 | `src/components/structures/useSkipList.spec.ts` |

### 线段树逻辑 useSegTree（C-033 · M4 广度 B5）

固定求和树 `[2,5,1,4,9,3,7,6]`，15 节点（叶 pos 7..14）。

| Case ID         | 标题                                            | 自动化路径                                     |
| --------------- | ----------------------------------------------- | ---------------------------------------------- |
| TC-SEG-LOGIC-01 | 建树 15 节点、root sum 37、root [0,7]           | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-02 | 叶子 pos 7..14 还原原数组、均 isLeaf            | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-03 | 节点管辖区间 [lo,hi]（pos1/2/4/10）             | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-04 | 内部节点聚合和 [12,25,7,5,12,13]                | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-05 | query(2,5) → sum 17、covered [4,5]              | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-06 | query(0,7) → sum 37、covered [0]                | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-07 | query(3,3) → sum 4、covered [10]                | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-08 | query(1,6) → sum 29、covered 4 段               | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-09 | update(2,10) → path [9,4,1,0]、root 46、pos4 14 | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-10 | update(2,10) 后 query(2,5) → 26                 | `src/components/structures/useSegTree.spec.ts` |
| TC-SEG-LOGIC-11 | reset 复原 root 37、query(2,5) 回 17            | `src/components/structures/useSegTree.spec.ts` |

### B+ 树逻辑 useBTree（C-035 · M4 广度 B6）

固定 2 层 B+ 树：root `[25,45]` → 叶 l0/l1/l2（各 4 key）+ 叶链 l0→l1→l2。

| Case ID           | 标题                                       | 自动化路径                                   |
| ----------------- | ------------------------------------------ | -------------------------------------------- |
| TC-BTREE-LOGIC-01 | 结构 4 节点、root keys [25,45]、非叶、3 子 | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-02 | 叶子 keys + 均 isLeaf                      | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-03 | 叶链 next（l0→l1→l2→null）                 | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-04 | search(30) 命中、下钻路径 [root,l1]        | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-05 | search(33) 未命中、路径仍到 l1             | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-06 | search(5) 落最左叶 l0                      | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-07 | search(60) 落最右叶 l2                     | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-08 | search(100) 大值未命中落 l2                | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-09 | rangeScan(12,38) 跨两叶 [15,20,25,30,35]   | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-10 | rangeScan(48,99) 仅右叶 [50,55,60]         | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-11 | rangeScan(5,60) 全表 12 值 3 叶            | `src/components/structures/useBTree.spec.ts` |
| TC-BTREE-LOGIC-12 | rangeScan(100,200) 空命中、定位到 l2       | `src/components/structures/useBTree.spec.ts` |

### 布隆过滤器逻辑 useBloom（C-036 · M4 广度 B7·收官）

固定 m=16、k=3，哈希 `h1=x%16 / h2=7x%16 / h3=(11x+5)%16`。

| Case ID           | 标题                                                | 自动化路径                                   |
| ----------------- | --------------------------------------------------- | -------------------------------------------- |
| TC-BLOOM-LOGIC-01 | 初始 16 位全 0、size 16、k 3                        | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-02 | hashes(3) = [3,5,6]                                 | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-03 | hashes(7)=[7,1,2]、hashes(11)=[11,13,14]            | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-04 | add(3) 置位 [3,5,6]                                 | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-05 | add 3/7/11 后并集 9 位                              | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-06 | query(7) 真命中（mightExist/added，非误判）         | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-07 | query(5) 一定不存在（bit12=0）                      | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-08 | query(2) 误判（mightExist 但没加过，falsePositive） | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-09 | query(4) 未命中有 0                                 | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-10 | add 幂等（位已 1 再置不增）                         | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-11 | 空表 query(7) 一定不存在                            | `src/components/structures/useBloom.spec.ts` |
| TC-BLOOM-LOGIC-12 | reset 清零、其后 query(7) 不存在                    | `src/components/structures/useBloom.spec.ts` |

### Dijkstra 最短路逻辑 useDijkstra（C-037 · M6 图算法 G1）

固定带权有向图 A–F、9 边、源 A。

| Case ID        | 标题                                     | 自动化路径                                      |
| -------------- | ---------------------------------------- | ----------------------------------------------- |
| TC-DIJKSTRA-01 | 图规模与标签（6 点 A–F、9 边、源 0）     | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-02 | 出边邻接（adj[0]/adj[4]/adj[5]）         | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-03 | 确定顺序 [0,2,1,3,4,5]（A→C→B→D→E→F）    | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-04 | 最终距离 [0,3,1,4,7,9]                   | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-05 | 前驱表 [null,2,0,1,3,4]                  | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-06 | 最短路还原 F = [0,2,1,3,4,5]             | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-07 | 最短路还原 E = [0,2,1,3,4]               | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-08 | steps 长度 7                             | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-09 | 初始步：settled 空、dist[0]=0 余 ∞       | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-10 | 确定 C 后 steps[2]（dist [0,3,1,6,∞,∞]） | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-11 | 松弛更新 D：steps[3] dist[3] 降到 4      | `src/components/structures/useDijkstra.spec.ts` |
| TC-DIJKSTRA-12 | 终步 steps[6]：6 点全确定、[0,3,1,4,7,9] | `src/components/structures/useDijkstra.spec.ts` |

### Dijkstra 播放器模块 dijkstra.module（C-047 · M8②-1，细粒度重走 32 步，复用 useDijkstra 图）

复用 useDijkstra 固定图 + oracle `dijkstraTrace`；产出 `array:[]` + graph 图轨胖步骤（供 AlgorithmPlayer）。

| Case ID            | 标题                                               | 自动化路径                               |
| ------------------ | -------------------------------------------------- | ---------------------------------------- |
| TC-DIJKSTRA-MOD-01 | 末步 nodeBadge 数值 = oracle dist [0,3,1,4,7,9]    | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-02 | 每步执行点合法且携带 graph 轨（array:[]）          | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-03 | 确定 6 点：#selectMin == #settle == 6              | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-04 | 松弛守恒 #relaxEdge == #relaxUpdate + #relaxSkip   | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-05 | init 步 dist[A]=0、其余 ∞                          | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-06 | 确定顺序 settle activeNode = [0,2,1,3,4,5]         | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-07 | 首个 relaxUpdate B=4（出边序 A→B 先）；A→C 后 C=1  | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-08 | done 最短路树 tree 边恰 5（每非源点一条入树边）    | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-09 | done 步 doneNodes 长度 = 6                         | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-10 | 四语言 sources + 每 point 行号在源码行数内         | `src/algorithms/dijkstra.module.spec.ts` |
| TC-DIJKSTRA-MOD-11 | module 元信息 title 含 Dijkstra、initialInput()=[] | `src/algorithms/dijkstra.module.spec.ts` |

### Kruskal 最小生成树逻辑 useKruskal（C-038 · M6 图算法 G6）

固定 6 点 9 边无向带权图（边按权升序），内置并查集判环。

| Case ID       | 标题                                     | 自动化路径                                     |
| ------------- | ---------------------------------------- | ---------------------------------------------- |
| TC-KRUSKAL-01 | 图规模与标签（6 点 A–F、9 边）           | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-02 | 边已按权升序（[1..9]、edges[0]=AC）      | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-03 | MST 边集 [AC,BC,DE,BD,DF]                | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-04 | MST 总权重 18                            | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-05 | steps 长度 10                            | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-06 | 初始步 mst 空、current null、weight 0    | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-07 | 加入 B-C：steps[2]                       | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-08 | 成环跳过 A-B：steps[4]                   | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-09 | 加入 B-D：steps[5] 含 BD、weight 11      | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-10 | 完成步 D-F：steps[7] mst 5 条、weight 18 | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-11 | 成环边集 [AB,CE,EF,CD]                   | `src/components/structures/useKruskal.spec.ts` |
| TC-KRUSKAL-12 | 末步权重稳定：steps[9] mst 5、weight 18  | `src/components/structures/useKruskal.spec.ts` |

### Kruskal 播放器模块 kruskal.module（C-048 · M8②-2，并查集细粒度重走 20 步，复用 useKruskal 图）

复用 useKruskal 固定图（边按权升序）+ oracle `kruskalTrace`；产出 `array:[]` + graph 无向图轨（供 AlgorithmPlayer）。

| Case ID           | 标题                                                  | 自动化路径                              |
| ----------------- | ----------------------------------------------------- | --------------------------------------- |
| TC-KRUSKAL-MOD-01 | 末步 mst 边（edgeClass=mst）= oracle [AC,BC,DE,BD,DF] | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-02 | 每步执行点合法且携带 graph 无向轨（array:[]）         | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-03 | 考虑 9 边：#consider == 9                             | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-04 | 接受/拒绝守恒 #accept==5、#reject==4、和==9           | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-05 | init 步 edgeClass 全空、doneNodes 空                  | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-06 | 首个 accept（AC 权1）后 edgeClass[AC]=mst、权重=1     | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-07 | 首个 reject（AB 权4）后 edgeClass[AB]=rejected        | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-08 | 每个 consider 步当前边 edgeClass=current              | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-09 | done 步 mst 恰 5、rejected 恰 4                       | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-10 | done 步总权 18、doneNodes 含全 6 点                   | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-11 | 四语言 sources + 行号在范围内                         | `src/algorithms/kruskal.module.spec.ts` |
| TC-KRUSKAL-MOD-12 | module 元信息 title 含 Kruskal、initialInput()=[]     | `src/algorithms/kruskal.module.spec.ts` |

### Prim 播放器模块 prim.module（C-049 · M6 图算法 G7，从起点生长 12 步，复用 useKruskal 同图）

从 A 生长选最小横切边；oracle `primTrace`；与 `kruskalTrace` 同 MST 集互验。

| Case ID        | 标题                                                     | 自动化路径                           |
| -------------- | -------------------------------------------------------- | ------------------------------------ |
| TC-PRIM-MOD-01 | 末步 mst 边 = oracle primTrace().mstEdges                | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-02 | 与 Kruskal 同一张图 → 同 MST 集（序可不同）              | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-03 | 每步执行点合法且携带无向图轨（array:[]、directed=false） | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-04 | 生长 5 边：#selectEdge==5、#addVertex==5                 | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-05 | init 步 doneNodes=[0]（仅起点 A）、无 mst 边             | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-06 | 每个 selectEdge 步唯一 1 条 current 且为横切边           | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-07 | 首个 addVertex 并入 C(2)、edgeClass[AC]=mst、权重=1      | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-08 | 生长顺序：新增点序列 = [C,B,D,E,F]                       | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-09 | done 步 mst 恰 5                                         | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-10 | done 步总权 18、doneNodes 含全 6 点                      | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-11 | 四语言 sources + 行号在范围内                            | `src/algorithms/prim.module.spec.ts` |
| TC-PRIM-MOD-12 | module 元信息 title 含 Prim、initialInput()=[]           | `src/algorithms/prim.module.spec.ts` |

### Bellman-Ford 播放器模块 bellman-ford.module（C-050 · M6 图算法 G3，含负权 V−1 轮松弛 34 步）

固定含负权有向图（源 A，B→C=-3、D→E=-2 无负环）；oracle `bellmanFordTrace`；边序逆序演示 V−1=4 轮收敛。

| Case ID           | 标题                                                  | 自动化路径                                   |
| ----------------- | ----------------------------------------------------- | -------------------------------------------- |
| TC-BELLMAN-MOD-01 | 末步 nodeBadge 数值 = oracle dist [0,4,1,3,1]         | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-02 | 每步执行点合法且带有向图轨（array:[]、directed=true） | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-03 | V−1 轮：#roundStart == 4                              | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-04 | 松弛统计 #relaxUpdate==8、#relaxSkip==20、和==28      | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-05 | init 步 dist[A]=0、其余 ∞                             | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-06 | 逐轮 dist：各 roundStart nodeBadge = 进入该轮 dist    | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-07 | 首个 relaxUpdate（B←A）后 nodeBadge[1]=4              | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-08 | dist 单调不增（松弛不变量）                           | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-09 | done 最短路树 tree 恰 4：{0-1,1-2,2-3,3-4}            | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-10 | 含负权边 B→C=-3、D→E=-2；done doneNodes 全 5 点       | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-11 | 四语言 sources + 行号在范围内                         | `src/algorithms/bellman-ford.module.spec.ts` |
| TC-BELLMAN-MOD-12 | module 元信息 title 含 Bellman、initialInput()=[]     | `src/algorithms/bellman-ford.module.spec.ts` |

### 拓扑排序模块 topo.module（C-051 · M6 图算法 G5，Kahn 14 步，非平凡 DAG）

固定非平凡 DAG（6 点 7 边，无环）；oracle `topoTrace`；Kahn 取入度 0 输出、后继减度。

| Case ID        | 标题                                                   | 自动化路径                           |
| -------------- | ------------------------------------------------------ | ------------------------------------ |
| TC-TOPO-MOD-01 | 末步输出序 = oracle order [2,0,4,1,3,5]（C→A→E→B→D→F） | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-02 | 每步执行点合法且带有向图轨（array:[]、directed=true）  | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-03 | 取/输出 6 点 #selectNode==6、#removeNode==6            | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-04 | init 步 nodeBadge = 初始入度 [1,2,0,1,0,3]             | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-05 | 首个 selectNode 取 C（activeNode=2）                   | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-06 | 首个 removeNode 后 doneNodes=[2]、A 入度→0             | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-07 | 输出序是合法拓扑序（每边 u→v，u 先于 v）               | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-08 | 入度徽标单调不增（减度不变量）                         | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-09 | removeNode 新增 doneNodes 序列 = [2,0,4,1,3,5]         | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-10 | done 步 doneNodes 全 6 点、nodeBadge 全 0              | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-11 | 四语言 sources + 行号在范围内                          | `src/algorithms/topo.module.spec.ts` |
| TC-TOPO-MOD-12 | module 元信息 title 含拓扑、initialInput()=[]          | `src/algorithms/topo.module.spec.ts` |

### Floyd-Warshall 模块 floyd.module（C-052 · M6 图算法 G4，三重循环 19 步 + MatrixView 矩阵轨）

固定 4 点 6 边含环有向图；oracle `floydTrace`；只对候选单元（i→k→j 两腿有限）出步。

| Case ID         | 标题                                            | 自动化路径                            |
| --------------- | ----------------------------------------------- | ------------------------------------- |
| TC-FLOYD-MOD-01 | 末步 cells = oracle floydTrace() 终态矩阵       | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-02 | 每步执行点合法且带矩阵轨（array:[]）            | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-03 | 4 个中转点 #pivotStart==4                       | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-04 | 松弛统计 #relaxUpdate==10、#relaxSkip==3        | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-05 | init cells = 邻接（对角 0、A→B=3、A→D=null）    | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-06 | done 矩阵无 ∞（含环→全点对可达）                | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-07 | 关键距离 [1][0]=8、[0][3]=6、[2][1]=9           | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-08 | 第 k 个 pivotStart 步 matrix.pivot===k          | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-09 | 每个单元值单调不增（松弛不变量）                | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-10 | 每个 relax 步 active 非空、sources 长度 2       | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-11 | 四语言 sources + 行号在范围内                   | `src/algorithms/floyd.module.spec.ts` |
| TC-FLOYD-MOD-12 | module 元信息 title 含 Floyd、initialInput()=[] | `src/algorithms/floyd.module.spec.ts` |

### 强连通分量模块 scc.module（C-069 · 图算法第 7 页，Tarjan 一趟 DFS 17 步 + 扩展 GraphView 图轨）

固定 6 点有向图；oracle `tarjanSCCs()`=`[[5],[4,3],[2,1,0]]`、`tarjanDfnLow()`=`{dfn:[0,1,2,3,4,5], low:[0,0,0,3,3,5]}`（3 个 SCC）。

| Case ID       | 标题                                      | 自动化路径                          |
| ------------- | ----------------------------------------- | ----------------------------------- |
| TC-SCC-MOD-01 | 末步 done + 3 个 SCC + nodeGroup 每点有组 | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-02 | 每步执行点合法且带图轨（array 空）        | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-03 | enter 恰 6 次                             | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-04 | 末步 dfn/low = oracle                     | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-05 | scc 恰 3 次                               | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-06 | scc 步是根（low==dfn）                    | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-07 | 同 SCC 同组、三组两两不同                 | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-08 | badge 格式 dfn/low；未访问 null           | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-09 | scc 步弹栈后栈变短                        | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-10 | 有向图 directed=true                      | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-11 | 四语言 sources + 行号在范围内             | `src/algorithms/scc.module.spec.ts` |
| TC-SCC-MOD-12 | module 元信息 title 含 强连通/Tarjan/SCC  | `src/algorithms/scc.module.spec.ts` |

### 编辑距离模块 editdist.module（C-053 · DP 大类首发，二维 DP 逐格 11 步 + MatrixView 复用）

固定 SOURCE="SAT"、TARGET="SUN"；oracle `editDistTrace`；DP 表 4×4，编辑距离=2。

| Case ID        | 标题                                                | 自动化路径                               |
| -------------- | --------------------------------------------------- | ---------------------------------------- |
| TC-EDIT-MOD-01 | 末步 cells = oracle editDistTrace()，右下角=2       | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-02 | 每步执行点合法且带矩阵轨（array:[]）                | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-03 | #cellMatch==1（仅 S==S）、#cellDiff==8              | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-04 | init 边界 第 0 行/列=[0,1,2,3]、内部 null           | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-05 | (1,1) match：cells[1][1]=0、sources 单个左上        | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-06 | 每个 cellDiff 步 sources 长度 3（左上/上/左）       | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-07 | 每步 rowLabels ∅SAT / colLabels ∅SUN / emptyText='' | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-08 | 编辑距离答案 cells[3][3]=2                          | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-09 | 单元写入一次不变（DP 不变量）                       | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-10 | 每个填格步 active 为当前格 (i,j)                    | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-11 | 四语言 sources + 行号在范围内                       | `src/algorithms/editdist.module.spec.ts` |
| TC-EDIT-MOD-12 | module 元信息 title 含编辑距离、initialInput()=[]   | `src/algorithms/editdist.module.spec.ts` |

### 0-1 背包模块 knapsack.module（C-054 · DP2，二维 DP 逐格 22 步 + MatrixView 纯复用）

固定 4 物品 A(2,3)B(3,4)C(4,5)D(5,6)+容量 5；oracle `knapsackTrace`；DP 表 5×6，最优值=7。

| Case ID        | 标题                                                      | 自动化路径                               |
| -------------- | --------------------------------------------------------- | ---------------------------------------- |
| TC-KNAP-MOD-01 | 末步 cells = oracle knapsackTrace()，右下角=7             | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-02 | 每步执行点合法且带矩阵轨（array:[]）                      | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-03 | 取舍统计 #cellSkip==10、#cellChoose==10                   | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-04 | init 第 0 行/列全 0、内部 null                            | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-05 | 首个 cellSkip（A 容量1 重2>1）cells[1][1]=0、sources 上格 | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-06 | 每个 cellChoose 步 sources 长度 2（上格+左上偏移格）      | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-07 | 每步 rowLabels ∅ABCD / colLabels 0-5 / emptyText=''       | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-08 | 最优值 cells[4][5]=7（选 A+B）                            | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-09 | 单元写入一次不变（DP 不变量）                             | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-10 | 每个填格步 active 为当前格 (i,w)                          | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-11 | 四语言 sources + 行号在范围内                             | `src/algorithms/knapsack.module.spec.ts` |
| TC-KNAP-MOD-12 | module 元信息 title 含背包、initialInput()=[]             | `src/algorithms/knapsack.module.spec.ts` |

### 完全背包模块 completeknapsack.module（C-065 · 动态规划第 5 页，可重复取 20 步 + 复用 MatrixView 轨/KnapsackExecPoint）

固定物品 A(重2,值5)/B(重3,值6)/C(重4,值7)、容量 6；oracle `completeKnapsackTrace()`，右下角 15（A×3）。与 0-1 唯一差别：「取」来源在本行 dp[i][w-wt]。

| Case ID      | 标题                                                    | 自动化路径                                       |
| ------------ | ------------------------------------------------------- | ------------------------------------------------ |
| TC-CK-MOD-01 | 末步 done，右下角 = 15                                  | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-02 | 每步执行点合法且带矩阵轨（array 空）                    | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-03 | 终态表深等 oracle                                       | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-04 | init 步第 0 行/列全 0                                   | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-05 | 「取」来源在本行：cellChoose sources 含同行 [i, w-wt]   | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-06 | 「不取」来源在上一行：填格步 sources 含 [i-1, w]        | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-07 | cellChoose 恰 2 源（不取上一行 + 取本行）               | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-08 | active === updatedCell === [i,w]                        | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-09 | 可重复取：第 1 行末格 cells[1][6] = 15（A 取 3 次）     | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-10 | vars 展示物品清单 A(重2,值5)/B/C                        | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-11 | 四语言 sources + 行号在范围内                           | `src/algorithms/completeknapsack.module.spec.ts` |
| TC-CK-MOD-12 | module 元信息 title 含 完全背包/背包、initialInput()=[] | `src/algorithms/completeknapsack.module.spec.ts` |

### N 皇后模块 queens.module（C-055 · 回溯大类首发，逐列回溯 32 步 + BoardView 棋盘轨）

固定 N=4；oracle `queensTrace`；逐列试探-剪枝-回溯求首解 [1,3,0,2]。

| Case ID          | 标题                                          | 自动化路径                             |
| ---------------- | --------------------------------------------- | -------------------------------------- |
| TC-QUEENS-MOD-01 | 末步 solved，queens = oracle [1,3,0,2]        | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-02 | 每步执行点合法且带棋盘轨（array:[]）          | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-03 | 解合法：4 皇后两两不同行/对角                 | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-04 | init 空盘（queens 全 null）                   | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-05 | 首个 place tryCell=[0,0]、queens[0]=0         | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-06 | 每个 tryConflict 步 conflictCells 非空        | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-07 | 存在回溯 #backtrack>=1                        | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-08 | 恰一解 #solved==1、末步满盘 4 皇后            | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-09 | 每步已放皇后数在 [0,4]                        | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-10 | 每个 tryConflict/place 步 tryCell 在盘内      | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-11 | 四语言 sources + 行号在范围内                 | `src/algorithms/queens.module.spec.ts` |
| TC-QUEENS-MOD-12 | module 元信息 title 含皇后、initialInput()=[] | `src/algorithms/queens.module.spec.ts` |

### 子集生成模块 subsets.module（C-056 · 回溯第 2 页，选/不选决策树 DFS 31 步 + DecisionTreeView 轨）

固定元素 `[1,2,3]`；oracle `subsetsAll`；逐元素选/不选二叉决策树 DFS 求全部 2^3 子集。

| Case ID           | 标题                                                     | 自动化路径                              |
| ----------------- | -------------------------------------------------------- | --------------------------------------- |
| TC-SUBSETS-MOD-01 | 末步 done，solutionIds 覆盖全部 8 叶                     | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-02 | 每步执行点合法且带决策树轨（array:[]）                   | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-03 | 决策树 15 节点、14 边、8 叶                              | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-04 | 8 个 record 步按序 = subsetsAll() 幂集                   | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-05 | 首步 start：根空集、pathIds=[根]、solutionIds 空         | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-06 | 恰 8 个 record（= 2^3）                                  | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-07 | 存在回溯，backtrack 步 active 为内部节点                 | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-08 | 每步 pathIds 从根到 active 连贯（相邻父子边）            | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-09 | solutionIds 长度单调不减，末步=8                         | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-10 | 首个 include 步 active=根「选 1」子、边 label 含「选 1」 | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-11 | 四语言 sources + 行号在范围内                            | `src/algorithms/subsets.module.spec.ts` |
| TC-SUBSETS-MOD-12 | module 元信息 title 含子集、initialInput()=[]            | `src/algorithms/subsets.module.spec.ts` |

### 全排列模块 permute.module（C-057 · 回溯第 3 页，多叉排列树 DFS 28 步 + 复用 DecisionTreeView 轨）

固定元素 `[1,2,3]`；oracle `permutationsAll`；每位从剩余未用元素挑一个的多叉决策树 DFS 求全部 3! 排列。

| Case ID           | 标题                                               | 自动化路径                              |
| ----------------- | -------------------------------------------------- | --------------------------------------- |
| TC-PERMUTE-MOD-01 | 末步 done，solutionIds 覆盖全部 6 叶               | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-02 | 每步执行点合法且带决策树轨（array:[]）             | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-03 | 决策树 16 节点、15 边、6 叶                        | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-04 | 6 个 record 步按序 = permutationsAll()             | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-05 | 首步 start：根空排列、pathIds=[根]、solutionIds 空 | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-06 | 恰 6 个 record（= 3!）                             | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-07 | 存在回溯，backtrack 步 active 为内部节点           | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-08 | 每步 pathIds 从根到 active 连贯（相邻父子边）      | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-09 | 每个解是 [1,2,3] 的合法排列（长 3/互异/值域）      | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-10 | 首个 choose 步 active=根首子、边 label 含「选 1」  | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-11 | 四语言 sources + 行号在范围内                      | `src/algorithms/permute.module.spec.ts` |
| TC-PERMUTE-MOD-12 | module 元信息 title 含排列、initialInput()=[]      | `src/algorithms/permute.module.spec.ts` |

### 组合总和模块 combsum.module（C-058 · 回溯第 4 页，决策树剪枝 DFS 24 步 + 扩展 DecisionTreeView prunedIds）

固定候选 `[1,2,3,4]`、目标 `5`；oracle `combSumAll`；start-index 决策树逐个加数，和 > 目标剪枝、= 目标记录。

| Case ID           | 标题                                                   | 自动化路径                              |
| ----------------- | ------------------------------------------------------ | --------------------------------------- |
| TC-COMBSUM-MOD-01 | 末步 done，solutionIds = 全部解叶（2 个）              | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-02 | 每步执行点合法且带决策树轨（array:[]）                 | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-03 | 决策树 14 节点；解 2、剪枝 5                           | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-04 | record 步组合按序 = combSumAll() [[1,4],[2,3]]，和=5   | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-05 | 首步 start：根空组合、pathIds=[根]、solution/pruned 空 | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-06 | 存在剪枝 #prune>=1，末步 prunedIds 覆盖全部剪枝（5）   | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-07 | 每个剪枝节点其组合之和 > 目标 5                        | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-08 | 每个解节点其组合之和 = 目标 5                          | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-09 | 每步 pathIds 从根到 active 连贯（相邻父子边）          | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-10 | 每个剪枝节点在决策树中无出边（不展开）                 | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-11 | 四语言 sources + 行号在范围内                          | `src/algorithms/combsum.module.spec.ts` |
| TC-COMBSUM-MOD-12 | module 元信息 title 含组合、initialInput()=[]          | `src/algorithms/combsum.module.spec.ts` |

### 迷宫寻路模块 maze.module（C-059 · 回溯第 5 页，网格 DFS 回溯 19 步 2 死路 + MazeView 迷宫轨）

固定 5×5 迷宫；oracle `mazeSolve`；DFS 四方向深入、撞死路回溯、visited 防绕圈，求 起点→终点 一条路径。

| Case ID        | 标题                                          | 自动化路径                           |
| -------------- | --------------------------------------------- | ------------------------------------ |
| TC-MAZE-MOD-01 | 末步 done、solved，path = mazeSolve()         | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-02 | 每步执行点合法且带迷宫轨（array:[]）          | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-03 | 解路径有效：首=起点、尾=终点、四连通、不穿墙  | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-04 | 首步 start：current=起点、path=[起点]         | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-05 | 恰一 goal 步，current=终点                    | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-06 | 存在死路 + 回溯（#deadend/#backtrack >=1）    | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-07 | deadend 步 current 四邻皆墙/越界/已访问       | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-08 | 每步 path 相邻格四连通                        | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-09 | visited 数量单调不减，含起点                  | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-10 | 每步 current = path 末元素                    | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-11 | 四语言 sources + 行号在范围内                 | `src/algorithms/maze.module.spec.ts` |
| TC-MAZE-MOD-12 | module 元信息 title 含迷宫、initialInput()=[] | `src/algorithms/maze.module.spec.ts` |

### 岛屿数量模块 islands.module（C-066 · 回溯网格搜索第 2 页，扫描 + DFS Flood Fill 20 步 + 复用 MazeView 轨）

固定 4×4 网格（3 个岛，6 陆地格）；oracle `islandCount()` = 3；水为墙、已数陆地绿（filled）、当前扫描格 🔎。

| Case ID       | 标题                                            | 自动化路径                              |
| ------------- | ----------------------------------------------- | --------------------------------------- |
| TC-ISL-MOD-01 | 末步 done + 岛屿数 3 + filled 覆盖全部陆地（6） | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-02 | 每步执行点合法且带网格轨（array 空）            | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-03 | found 恰 3 次（3 个岛）                         | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-04 | found 命中新陆地（grid=1 且此前不在 filled）    | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-05 | 水为墙：walls[r][c] === (grid===0)              | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-06 | filled 单调不减                                 | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-07 | 末步 filled = 全陆地（6 格、无重复、都是陆地）  | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-08 | flood 步陆地且四连通于同岛已 filled 格          | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-09 | 岛屿无起终点：start/goal 均为 null              | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-10 | 非 done 步当前格图标存在且非 🐭                 | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-11 | 四语言 sources + 行号在范围内                   | `src/algorithms/islands.module.spec.ts` |
| TC-ISL-MOD-12 | module 元信息 title 含岛屿、initialInput()=[]   | `src/algorithms/islands.module.spec.ts` |

### 单词搜索模块 wordsearch.module（C-068 · 回溯网格搜索第 3 页，DFS 逐字母试探 + 回溯 11 步 + 复用 MazeView 字母网格轨）

固定 3×4 字母盘 + 词 `"ADEE"`；oracle `wordExists()`=true、`wordPath()`=`[[2,0],[2,1],[2,2],[2,3]]`（底行 A→D→E→E，含 1 次真回退）。

| Case ID      | 标题                                              | 自动化路径                                 |
| ------------ | ------------------------------------------------- | ------------------------------------------ |
| TC-WS-MOD-01 | 末步 found + solved + path = wordPath()           | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-02 | 每步执行点合法且带网格轨（array 空）              | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-03 | 每格显字母 letters === WORD_BOARD                 | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-04 | 含真回溯（backtrack ≥ 1）                         | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-05 | 两次起点尝试，起点字母 = A                        | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-06 | match 步字母 = 期望字母                           | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-07 | mismatch 步字母不对（或已在路径）                 | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-08 | 末步路径拼成 ADEE 且四连通                        | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-09 | 每步路径无重复格（同格不复用）                    | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-10 | found 步 solved = true                            | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-11 | 四语言 sources + 行号在范围内                     | `src/algorithms/wordsearch.module.spec.ts` |
| TC-WS-MOD-12 | module 元信息 title 含单词搜索、initialInput()=[] | `src/algorithms/wordsearch.module.spec.ts` |

### 最长公共子序列模块 lcs.module（C-060 · DP 第 3 页，填表 + 回溯 24 步 + 扩展 MatrixView pathCells）

固定 X=`ABCD`、Y=`ACDF`；oracle `lcsLength`/`lcsString`/`lcsPath`；二维 DP 填表求长度 + 回溯恢复 LCS=ACD。

| Case ID       | 标题                                                    | 自动化路径                          |
| ------------- | ------------------------------------------------------- | ----------------------------------- |
| TC-LCS-MOD-01 | fillDone 右下角 = lcsLength() = 3                       | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-02 | 每步执行点合法且带矩阵轨（array:[]）                    | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-03 | DP 表 5×5，标签含 ∅ + 字符                              | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-04 | init 步第 0 行、第 0 列全 0                             | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-05 | match 步取左上 +1（X[i-1]=Y[j-1]）                      | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-06 | mismatch 步取上/左较大（X[i-1]≠Y[j-1]）                 | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-07 | 末步 done，含 lcsString() = ACD                         | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-08 | trace/done 步 pathCells = lcsPath()、首含 (m,n)         | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-09 | trace 步 pathCells 数量单调不减                         | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-10 | 存在填表 + 回溯（match/mismatch/trace >=1）             | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-11 | 四语言 sources + 行号在范围内                           | `src/algorithms/lcs.module.spec.ts` |
| TC-LCS-MOD-12 | module 元信息 title 含公共子序列/LCS、initialInput()=[] | `src/algorithms/lcs.module.spec.ts` |

### 最长递增子序列模块 lis.module（C-061 · DP 第 4 页，一维 DP 两行表 18 步 + 复用 MatrixView 零改动）

固定输入 `[1,3,2,4,3,5]`；oracle `lisLength`/`lisIndices`/`lisValues`；一维 dp 回看前面取 max+1，回溯恢复 LIS=1→3→4→5。

| Case ID       | 标题                                                    | 自动化路径                          |
| ------------- | ------------------------------------------------------- | ----------------------------------- |
| TC-LIS-MOD-01 | fillDone dp 行最大值 = lisLength() = 4                  | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-02 | 每步执行点合法且带矩阵轨（array:[]）                    | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-03 | 两行表 2 行×n 列，rowLabels 含「值」「dp」              | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-04 | init 步 dp 行全 1                                       | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-05 | extend 步 active=[1,i]、dp[i]=dp[j]+1                   | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-06 | scan 步不更新（updatedCell 空）                         | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-07 | 末步 result，含 lisValues 连接 1→3→4→5                  | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-08 | result 步 pathCells = LIS 位置 [0,1,3,5]（值行）        | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-09 | 末步 dp 行 = lisDp().dp = [1,2,2,3,3,4]                 | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-10 | 存在 scan + extend                                      | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-11 | 四语言 sources + 行号在范围内                           | `src/algorithms/lis.module.spec.ts` |
| TC-LIS-MOD-12 | module 元信息 title 含递增子序列/LIS、initialInput()=[] | `src/algorithms/lis.module.spec.ts` |

### KMP 字符串匹配模块 kmp.module（C-062 · 字符串大类首发，匹配循环 12 步 + KmpView 轨）

固定 T=`abababcab`、P=`ababc`；oracle `kmpLps`/`kmpMatches`；失配用 π 跳转、文本 i 不回退，命中下标 2。

| Case ID       | 标题                                                  | 自动化路径                          |
| ------------- | ----------------------------------------------------- | ----------------------------------- |
| TC-KMP-MOD-01 | 末步 done，found = kmpMatches() = [2]                 | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-02 | 每步执行点合法且带匹配轨（array:[]）                  | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-03 | 每步 lps = kmpLps() = [0,0,1,2,0]                     | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-04 | 存在关键跳转 #jump>=1、jump 步 lpsActive=comparePat-1 | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-05 | 恰一 found，命中起点 = 2                              | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-06 | match 步字符相等 T[compareText]===P[comparePat]       | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-07 | 文本指针不回退：compareText 单调不减                  | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-08 | offset = compareText - comparePat（≥0）               | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-09 | matchedLen = comparePat                               | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-10 | 命中区间不越界：T.substr(s,m)===P                     | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-11 | 四语言 sources + 行号在范围内                         | `src/algorithms/kmp.module.spec.ts` |
| TC-KMP-MOD-12 | module 元信息 title 含 KMP/字符串、initialInput()=[]  | `src/algorithms/kmp.module.spec.ts` |

### Rabin-Karp 模块 rabinkarp.module（C-063 · 字符串第 2 页，滚动哈希 12 步 + 复用 KmpView 轨）

固定 T=`abcabcab`、P=`cab`，B=10/M=997；oracle `rkHash`/`rkWindowHashes`/`rkMatches`；窗口哈希对比，命中 [2,5]。

| Case ID      | 标题                                                      | 自动化路径                                |
| ------------ | --------------------------------------------------------- | ----------------------------------------- |
| TC-RK-MOD-01 | 末步 done，found = rkMatches() = [2,5]                    | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-02 | 每步执行点合法且带匹配轨（array:[]）                      | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-03 | 无 π 行：每步 lps = []                                    | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-04 | 窗口对齐：windowStart = offset                            | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-05 | vars/caption 含模式哈希 312                               | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-06 | 存在跳过 + 恰 2 命中                                      | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-07 | skip 步该窗口哈希 ≠ 模式哈希                              | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-08 | hashHit 步该窗口哈希 = 模式哈希                           | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-09 | found 步命中起点 ∈ {2,5}，末步 found=[2,5]                | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-10 | 命中区间不越界：T.substr(s,m)===P                         | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-11 | 四语言 sources + 行号在范围内                             | `src/algorithms/rabinkarp.module.spec.ts` |
| TC-RK-MOD-12 | module 元信息 title 含 Rabin-Karp/哈希、initialInput()=[] | `src/algorithms/rabinkarp.module.spec.ts` |

### Boyer-Moore 模块 boyermoore.module（C-064 · 字符串第 3 页，坏字符规则右往左 12 步 + 复用 KmpView 轨）

固定 T=`abcabxabc`、P=`abc`，坏字符表 `{a:0,b:1,c:2}`；oracle `bmLast`/`bmMatches`；从模式末尾从右往左比 + 坏字符大步跳，命中 [0,6]。

| Case ID      | 标题                                                         | 自动化路径                                 |
| ------------ | ------------------------------------------------------------ | ------------------------------------------ |
| TC-BM-MOD-01 | 末步 done，found = bmMatches() = [0,6]                       | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-02 | 每步执行点合法且带匹配轨（array:[]）                         | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-03 | 无 π 行：每步 lps = []                                       | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-04 | 窗口对齐：windowStart = offset                               | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-05 | vars 含坏字符表 a:0/b:1/c:2                                  | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-06 | 存在两种跳（#badChar≥2）+ 恰 2 命中                          | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-07 | match 步字符相等且 matchedFrom = comparePat                  | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-08 | badChar 步字符不等                                           | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-09 | 存在坏字符不在模式的大步跳（如 x）                           | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-10 | 命中区间不越界：T.substr(s,m)===P                            | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-11 | 四语言 sources + 行号在范围内                                | `src/algorithms/boyermoore.module.spec.ts` |
| TC-BM-MOD-12 | module 元信息 title 含 Boyer-Moore/坏字符、initialInput()=[] | `src/algorithms/boyermoore.module.spec.ts` |

### Manacher 模块 manacher.module（C-067 · 字符串第 4 页，预处理 + 镜像复用 + 中心扩展 13 步 + 新建 ManacherView 回文轨）

固定 `"babad"`；oracle `manacherTransform()`=`#b#a#b#a#d#`、`manacherRadii()`=`[0,1,0,3,0,3,0,1,0,1,0]`、`longestPalindrome()`=`bab`。

| Case ID       | 标题                                                    | 自动化路径                               |
| ------------- | ------------------------------------------------------- | ---------------------------------------- |
| TC-MAN-MOD-01 | 末步 done + 最长回文 bab（best 区间对应转换串 bab）     | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-02 | 每步执行点合法且带回文轨（array 空）                    | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-03 | 转换串正确 #b#a#b#a#d#                                  | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-04 | 末步半径 = oracle [0,1,0,3,0,3,0,1,0,1,0]               | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-05 | init 步 p 全空（null）                                  | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-06 | 中心逐一递增 0..10                                      | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-07 | mirror 步 mirror=2C−i 且 center<boxR                    | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-08 | expand 步 mirror 为 null                                | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-09 | 每中心步 p[center] 由 null 变 oracle 值                 | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-10 | 最长回文长度单调不减                                    | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-11 | 四语言 sources + 行号在范围内                           | `src/algorithms/manacher.module.spec.ts` |
| TC-MAN-MOD-12 | module 元信息 title 含 Manacher/回文、initialInput()=[] | `src/algorithms/manacher.module.spec.ts` |

---

## L4 — 前端组件（Vitest + @vue/test-utils，mount）

共 **425** 个用例（不含 8+8 个已 superseded 的 `TC-VIZ-DIJKSTRAVIZ-*` / `TC-VIZ-KRUSKALVIZ-*`）。运行命令：`pnpm test:unit`

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

| Case ID              | 标题                                             | 自动化路径                                              |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| TC-VIEW-BUBBLE-01    | （C-006 改写）挂载渲染 AlgorithmPlayer           | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-BUBBLE-02    | （C-006 改写）初始渲染 10 根柱子且默认停第 0 步  | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-BUBBLE-03    | 全模板：介绍正文 Article（h1 冒泡排序）（C-046） | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-SELECTION-01 | 挂载渲染 AlgorithmPlayer（C-007）                | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-SELECTION-02 | 初始渲染 10 根柱子且默认停第 0 步（C-007）       | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-SELECTION-03 | 全模板：介绍正文 Article（h1 选择排序）（C-046） | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-INSERTION-01 | 挂载渲染 AlgorithmPlayer（C-008）                | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-VIEW-INSERTION-02 | 初始渲染 10 根柱子且默认停第 0 步（C-008）       | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-VIEW-INSERTION-03 | 全模板：介绍正文 Article（h1 插入排序）（C-046） | `src/views/Article/SortAlgorithm/InsertionSort.spec.ts` |
| TC-VIEW-SHELL-01     | 挂载渲染 AlgorithmPlayer（C-010）                | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |
| TC-VIEW-SHELL-02     | 初始渲染 10 根柱子且默认停第 0 步（C-010）       | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |
| TC-VIEW-SHELL-03     | 全模板：介绍正文 Article（h1 希尔排序）（C-046） | `src/views/Article/SortAlgorithm/ShellSort.spec.ts`     |

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

| Case ID             | 标题                                                        | 自动化路径                                          |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| TC-VIEW-HEADER-01   | 渲染 #header 根元素                                         | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-02   | 渲染 logo #logo 元素                                        | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-03   | 渲染「V」logo 字符                                          | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-04   | 渲染 h1 标题「算法可视化」                                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-05   | 点击 logo 跳转到 home 路由                                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-06   | 渲染 4 个 icon-link（微博/X/GitHub/个人主页，C-030 改 3→4） | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-07   | 初始无 header shadow class                                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-ICONLINK-01 | 渲染 .icon-link 根元素                                      | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-02 | 渲染 img 标签                                               | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-03 | img src 属性正确                                            | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-04 | title 属性渲染到元素上                                      | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-05 | 点击调用 window.open 打开对应 url                           | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-06 | 不同 url 也能正确打开                                       | `src/views/Master/Header/IconLink/IconLink.spec.ts` |

### 归并双轨可视化 + 视图（C-011）

| Case ID           | 标题                                             | 自动化路径                                          |
| ----------------- | ------------------------------------------------ | --------------------------------------------------- |
| TC-VIZ-BAR-07     | state='empty' 时柱体加 empty class 且不显示数值  | `src/components/Bar.spec.ts`                        |
| TC-VIZ-AUXVIEW-01 | 渲染与 aux.array 等长的槽                        | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-02 | filled 的槽为 sorted、其余为 empty               | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-03 | pointer 定位 k 箭头到对应槽                      | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-04 | 无 pointer 时不渲染箭头                          | `src/components/AuxView.spec.ts`                    |
| TC-VIZ-AUXVIEW-05 | filled 槽高度用主轨 min/max 同尺度               | `src/components/AuxView.spec.ts`                    |
| TC-PLAYER-AUX-01  | module 无 aux 时不渲染 AuxView（向后兼容）       | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-PLAYER-AUX-02  | 当前步带 aux 时渲染 AuxView                      | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-VIEW-MERGE-01  | 挂载渲染 AlgorithmPlayer                         | `src/views/Article/SortAlgorithm/MergeSort.spec.ts` |
| TC-VIEW-MERGE-02  | 初始渲染主轨 10 柱 + 辅助轨且默认停第 0 步       | `src/views/Article/SortAlgorithm/MergeSort.spec.ts` |
| TC-VIEW-MERGE-03  | 全模板：介绍正文 Article（h1 归并排序）（C-046） | `src/views/Article/SortAlgorithm/MergeSort.spec.ts` |

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
| TC-PLAYER-STACK-04  | 同时带 aux + stack 双辅助轨并存都渲染                       | `src/components/player/AlgorithmPlayer.spec.ts`     |
| TC-VIEW-QUICK-01    | 挂载渲染 AlgorithmPlayer                                    | `src/views/Article/SortAlgorithm/QuickSort.spec.ts` |
| TC-VIEW-QUICK-02    | 初始渲染主轨 10 柱 + 区间栈轨且默认停第 0 步                | `src/views/Article/SortAlgorithm/QuickSort.spec.ts` |
| TC-VIEW-QUICK-03    | 全模板：介绍正文 Article（h1 快速排序）（C-046）            | `src/views/Article/SortAlgorithm/QuickSort.spec.ts` |

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
| TC-VIEW-HEAP-03    | 全模板：介绍正文 Article（h1 堆排序）（C-046）   | `src/views/Article/SortAlgorithm/HeapSort.spec.ts` |

### 计数桶轨 + 视图（C-014）

| Case ID              | 标题                                                | 自动化路径                                                    |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| TC-VIZ-BARSVIEW-21   | dimFrom 连续后缀淡化（index≥dimFrom → dimmed）      | `src/components/BarsView.spec.ts`                             |
| TC-VIZ-BARSVIEW-22   | dimFrom 与 sortedUpTo 共存：前缀绿/活跃 idle/后缀淡 | `src/components/BarsView.spec.ts`                             |
| TC-VIZ-BARSVIEW-23   | pivotIndices 双基准都进入 pivot 态（双轴快排）      | `src/components/BarsView.spec.ts`                             |
| TC-VIZ-COUNTVIEW-01  | 渲染桶数 = buckets.length                           | `src/components/CountView.spec.ts`                            |
| TC-VIZ-COUNTVIEW-02  | 每桶单元格数 = buckets[b]                           | `src/components/CountView.spec.ts`                            |
| TC-VIZ-COUNTVIEW-03  | 桶底值标签 = b + min                                | `src/components/CountView.spec.ts`                            |
| TC-VIZ-COUNTVIEW-04  | activeBucket 桶带 .active                           | `src/components/CountView.spec.ts`                            |
| TC-VIZ-COUNTVIEW-05  | 空桶渲染 0 格、仍显值与计数 0                       | `src/components/CountView.spec.ts`                            |
| TC-VIZ-COUNTVIEW-06  | 桶顶计数数字 = buckets[b]                           | `src/components/CountView.spec.ts`                            |
| TC-PLAYER-COUNT-01   | 当前步带 count 时渲染 CountView                     | `src/components/player/AlgorithmPlayer.spec.ts`               |
| TC-PLAYER-COUNT-02   | module 无 count 时不渲染 CountView（向后兼容）      | `src/components/player/AlgorithmPlayer.spec.ts`               |
| TC-PLAYER-COUNT-03   | 带 tree 不带 count 不渲染 CountView（多轨互不干扰） | `src/components/player/AlgorithmPlayer.spec.ts`               |
| TC-VIEW-COUNT-01     | 挂载渲染 AlgorithmPlayer                            | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`        |
| TC-VIEW-COUNT-02     | 初始渲染计数桶轨 + 主轨 10 柱且默认停第 0 步        | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`        |
| TC-VIEW-COUNT-03     | 全模板：介绍正文 Article（h1 计数排序）（C-046）    | `src/views/Article/SortAlgorithm/CountingSort.spec.ts`        |
| TC-VIEW-RADIX-01     | 挂载渲染 AlgorithmPlayer（C-039 基数排序）          | `src/views/Article/SortAlgorithm/RadixSort.spec.ts`           |
| TC-VIEW-RADIX-02     | 渲染计数桶轨 + 主轨 8 柱且默认停第 0 步             | `src/views/Article/SortAlgorithm/RadixSort.spec.ts`           |
| TC-VIEW-RADIX-03     | 全模板：介绍正文 Article（h1 基数排序）（C-046）    | `src/views/Article/SortAlgorithm/RadixSort.spec.ts`           |
| TC-VIZ-BUCKETVIEW-01 | 渲染 5 桶 + 值域标签                                | `src/components/BucketView.spec.ts`                           |
| TC-VIZ-BUCKETVIEW-02 | 桶内每元素一格、文本为值                            | `src/components/BucketView.spec.ts`                           |
| TC-VIZ-BUCKETVIEW-03 | activeBucket 桶带 .active                           | `src/components/BucketView.spec.ts`                           |
| TC-VIZ-BUCKETVIEW-04 | 空桶渲染 0 格、仍显值域标签                         | `src/components/BucketView.spec.ts`                           |
| TC-PLAYER-BUCKET-01  | 当前步带 bucket 时渲染 BucketView                   | `src/components/player/AlgorithmPlayer.spec.ts`               |
| TC-PLAYER-BUCKET-02  | module 无 bucket 不渲染 BucketView（向后兼容）      | `src/components/player/AlgorithmPlayer.spec.ts`               |
| TC-VIEW-BUCKET-01    | 全模板：Article(h1 桶排序) + 播放器                 | `src/views/Article/SortAlgorithm/BucketSort.spec.ts`          |
| TC-VIEW-BUCKET-02    | 渲染 BucketView 桶轨 + 主轨 8 柱                    | `src/views/Article/SortAlgorithm/BucketSort.spec.ts`          |
| TC-VIEW-3WQUICK-01   | 全模板：Article(h1 三路快排) + 播放器               | `src/views/Article/SortAlgorithm/ThreeWayQuickSort.spec.ts`   |
| TC-VIEW-3WQUICK-02   | 区间栈 StackView + 主轨 8 柱                        | `src/views/Article/SortAlgorithm/ThreeWayQuickSort.spec.ts`   |
| TC-VIEW-DUALPIVOT-01 | 全模板：Article(h1 双轴快排) + 播放器               | `src/views/Article/SortAlgorithm/DualPivotQuickSort.spec.ts`  |
| TC-VIEW-DUALPIVOT-02 | 区间栈 StackView + 主轨 8 柱                        | `src/views/Article/SortAlgorithm/DualPivotQuickSort.spec.ts`  |
| TC-VIEW-TDMERGE-01   | 全模板：Article(h1 自顶向下归并) + 播放器           | `src/views/Article/SortAlgorithm/TopDownMergeSort.spec.ts`    |
| TC-VIEW-TDMERGE-02   | AuxView 与 StackView 双辅助轨 + 主轨 8 柱           | `src/views/Article/SortAlgorithm/TopDownMergeSort.spec.ts`    |
| TC-VIEW-BININS-01    | 全模板：Article(h1 二分插入排序) + 播放器           | `src/views/Article/SortAlgorithm/BinaryInsertionSort.spec.ts` |
| TC-VIEW-BININS-02    | 主轨 8 柱且默认停第 0 步                            | `src/views/Article/SortAlgorithm/BinaryInsertionSort.spec.ts` |
| TC-VIEW-COCKTAIL-01  | 全模板：Article(h1 鸡尾酒排序) + 播放器             | `src/views/Article/SortAlgorithm/CocktailSort.spec.ts`        |
| TC-VIEW-COCKTAIL-02  | 主轨 8 柱且默认停第 0 步                            | `src/views/Article/SortAlgorithm/CocktailSort.spec.ts`        |

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

### 并查集互动 UnionFindViz + 并查集页（C-029 · M4 广度 B2，新页）

| Case ID         | 标题                                      | 自动化路径                                          |
| --------------- | ----------------------------------------- | --------------------------------------------------- |
| TC-VIZ-UFVIZ-01 | 8 ufnode + 两输入 + 4 按钮 + readout 含 8 | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-02 | 节点标 0..7                               | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-03 | 合并 0,1：readout 含 7、uf-edge 1         | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-04 | 合并链：uf-edge 3、readout 含 5           | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-05 | 链后查根 0：status 含「压缩」             | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-06 | 连通?（同组）：status 含「同根」          | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-07 | 连通?（异组）：status 含「根不同」        | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIZ-UFVIZ-08 | 重置：8 ufnode、0 uf-edge、readout 含 8   | `src/components/structures/UnionFindViz.spec.ts`    |
| TC-VIEW-UF-01   | 挂载渲染 Article + UnionFindViz           | `src/views/Article/DataStructure/UnionFind.spec.ts` |
| TC-VIEW-UF-02   | 含「并查集」标题与 Playground             | `src/views/Article/DataStructure/UnionFind.spec.ts` |

### LRU 缓存互动 LruViz + LRU 页（C-031 · M4 广度 B3，新页）

| Case ID          | 标题                                              | 自动化路径                                    |
| ---------------- | ------------------------------------------------- | --------------------------------------------- |
| TC-VIZ-LRUVIZ-01 | 3 lru-cell + 两输入 + get/put/重置 + MRU/LRU 标记 | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-02 | cell 键含 3/2/1                                   | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-03 | get(1) 命中：status 含「找到」、首键 1            | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-04 | get(9) 未命中：status 含「没有」                  | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-05 | put(4,40) 新键：4 cell、首键 4                    | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-06 | put 满后淘汰：status 含「淘汰」、cell 仍 4        | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-07 | put(2,99) 更新：status 含「更新」                 | `src/components/structures/LruViz.spec.ts`    |
| TC-VIZ-LRUVIZ-08 | 重置：3 lru-cell                                  | `src/components/structures/LruViz.spec.ts`    |
| TC-VIEW-LRU-01   | 挂载渲染 Article + LruViz                         | `src/views/Article/DataStructure/Lru.spec.ts` |
| TC-VIEW-LRU-02   | 含「LRU」标题与 Playground                        | `src/views/Article/DataStructure/Lru.spec.ts` |

### 跳表互动 SkipListViz + 跳表页（C-032 · M4 广度 B4，新页）

| Case ID           | 标题                                        | 自动化路径                                         |
| ----------------- | ------------------------------------------- | -------------------------------------------------- |
| TC-VIZ-SKIPVIZ-01 | 网格 19 skip-cell + 输入 + 查找/重置 + head | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-02 | 元素值 1..15 出现                           | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-03 | 查找 11：status 含「跳过」「找到了」        | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-04 | 查找 8：status 含「没找到」                 | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-05 | 查找 11：路径点亮 skip-cell.lit > 0         | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-06 | 查找 15：status 含「找到了」                | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-07 | 查找 99：status 含「没找到」                | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIZ-SKIPVIZ-08 | 重置：清高亮（lit/hot 为 0）                | `src/components/structures/SkipListViz.spec.ts`    |
| TC-VIEW-SKIP-01   | 挂载渲染 Article + SkipListViz              | `src/views/Article/DataStructure/SkipList.spec.ts` |
| TC-VIEW-SKIP-02   | 含「跳表」标题与 Playground                 | `src/views/Article/DataStructure/SkipList.spec.ts` |

### 线段树互动 SegTreeViz + 线段树页（C-033 · M4 广度 B5，新页）

| Case ID          | 标题                                          | 自动化路径                                            |
| ---------------- | --------------------------------------------- | ----------------------------------------------------- |
| TC-VIZ-SEGVIZ-01 | 15 seg-node + 14 seg-edge + a/b 输入 + 三按钮 | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-02 | 节点显聚合和（root 37、叶 9）                 | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-03 | 区间和 2,5：status 含 17、covered 2 个        | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-04 | 区间和 0,7：status 含 37、covered 1 个        | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-05 | 区间和 3,3：status 含 4                       | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-06 | 更新 2→10：status 含「更新」、节点出现 46     | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-07 | 更新 2→10：路径点亮 onpath 4 个               | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIZ-SEGVIZ-08 | 重置：清高亮 + 复原 37                        | `src/components/structures/SegTreeViz.spec.ts`        |
| TC-VIEW-SEG-01   | 挂载渲染 Article + SegTreeViz + Playground    | `src/views/Article/DataStructure/SegmentTree.spec.ts` |
| TC-VIEW-SEG-02   | 含「线段树」标题与互动容器（15 节点）         | `src/views/Article/DataStructure/SegmentTree.spec.ts` |

### B+ 树互动 BTreeViz + B+ 树页（C-035 · M4 广度 B6，新页）

| Case ID            | 标题                                             | 自动化路径                                      |
| ------------------ | ------------------------------------------------ | ----------------------------------------------- |
| TC-VIZ-BTREEVIZ-01 | 4 bt-node + 14 bt-key + 2 bt-link + a/b + 三按钮 | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-02 | key 格显数字（5/25/60）                          | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-03 | 查找 30：status 含「找到了」、hit 1              | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-04 | 查找 30：下钻路径 onpath 2（root+叶）            | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-05 | 查找 33：status 含「不存在」、hit 0              | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-06 | 查找 5：落最左叶、status 含「找到了」            | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-07 | 范围查 12,38：status 含「扫到」、inrange 5       | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-08 | 范围查 48,99：inrange 3                          | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIZ-BTREEVIZ-09 | 重置：清高亮（hit/onpath 0）                     | `src/components/structures/BTreeViz.spec.ts`    |
| TC-VIEW-BTREE-01   | 挂载渲染 Article + BTreeViz + Playground         | `src/views/Article/DataStructure/BTree.spec.ts` |
| TC-VIEW-BTREE-02   | 含「B 树」标题与互动容器（4 节点）               | `src/views/Article/DataStructure/BTree.spec.ts` |

### 布隆过滤器互动 BloomViz + 布隆页（C-036 · M4 广度 B7·收官，新页）

| Case ID            | 标题                                       | 自动化路径                                            |
| ------------------ | ------------------------------------------ | ----------------------------------------------------- |
| TC-VIZ-BLOOMVIZ-01 | 16 bit-cell + a 输入 + 加入/查询/重置 按钮 | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-02 | 初始 set 0                                 | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-03 | 加入 3：set 3 + status 含「加入」          | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-04 | 加入 3/7/11：set 9                         | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-05 | 查询 7：含「可能存在」且不含「误判」       | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-06 | 查询 5：含「一定不存在」                   | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-07 | 查询 2：含「误判」                         | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-08 | 查询 7：探测位 probe 3                     | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIZ-BLOOMVIZ-09 | 重置：清空 set/probe                       | `src/components/structures/BloomViz.spec.ts`          |
| TC-VIEW-BLOOM-01   | 挂载渲染 Article + BloomViz + Playground   | `src/views/Article/DataStructure/BloomFilter.spec.ts` |
| TC-VIEW-BLOOM-02   | 含「布隆过滤器」标题与互动容器（16 位）    | `src/views/Article/DataStructure/BloomFilter.spec.ts` |

### Dijkstra 页 C-037 → C-047 返工进播放器（M8②-1）

> C-047：Dijkstra 页正文保留、自建 `DijkstraViz` 换成 `AlgorithmPlayer`（GraphView 图轨）。以下 8 个 `TC-VIZ-DIJKSTRAVIZ-*` 随 `DijkstraViz.vue`/spec 删除 **superseded**（功能由 GraphView + 播放器承接）；`TC-VIEW-DIJKSTRA-01/02` 改写为播放器断言、新增 -03。

| Case ID                   | 标题                                                                   | 自动化路径                                     |
| ------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| ~~TC-VIZ-DIJKSTRAVIZ-01~~ | ~~6 dvert + 9 dedge + 距离表 6 格 + 下一步/重置~~ (superseded C-047)   | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-02~~ | ~~初始距离表 0 + ∞、settled 0~~ (superseded C-047)                     | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-03~~ | ~~下一步×1：确定 A、settled 1、dist 现 4 与 1~~ (superseded C-047)     | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-04~~ | ~~下一步×2：B 由 4 松弛到 3~~ (superseded C-047)                       | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-05~~ | ~~下一步×1：松弛边点亮 ≥1~~ (superseded C-047)                         | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-06~~ | ~~走到底：settled 6、dist 现 9、status 含「最短」~~ (superseded C-047) | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-07~~ | ~~走到底：最短路树点亮 ≥1~~ (superseded C-047)                         | ~~`DijkstraViz.spec.ts`~~                      |
| ~~TC-VIZ-DIJKSTRAVIZ-08~~ | ~~重置：清空 settled、距离表回 ∞~~ (superseded C-047)                  | ~~`DijkstraViz.spec.ts`~~                      |
| TC-VIEW-DIJKSTRA-01       | 挂载渲染 Article + AlgorithmPlayer（不再含 DijkstraViz）               | `src/views/Article/Algorithm/Dijkstra.spec.ts` |
| TC-VIEW-DIJKSTRA-02       | h1 含「Dijkstra」+ GraphView + 6 .graph-node + 无 .bars-view           | `src/views/Article/Algorithm/Dijkstra.spec.ts` |
| TC-VIEW-DIJKSTRA-03       | 全模板同屏：Article 含「最短」+ ≥9 .graph-edge                         | `src/views/Article/Algorithm/Dijkstra.spec.ts` |

### GraphView 图轨 + 播放器接图轨（C-047 · M8②-1，新第 7 轨，通用带权图，供 Kruskal C-048 复用）

| Case ID                 | 标题                                                                            | 自动化路径                                      |
| ----------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| TC-VIZ-GRAPHVIEW-01     | 6 .graph-node + 9 .graph-edge + 权重文本可见                                    | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-02     | doneNodes→.done、activeNode→.active                                             | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-03     | edgeClass→对应边 .relaxed / .tree                                               | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-04     | nodeBadge→.node-badge 显示 dist（含 ∞）                                         | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-SCC-01 | nodeGroup 分组着色（同组同色、异组异色）（C-069）                               | `src/components/GraphView.spec.ts`              |
| TC-VIZ-GRAPHVIEW-SCC-02 | stackNodes → 1 个 .on-stack（虚线环）（C-069）                                  | `src/components/GraphView.spec.ts`              |
| TC-VIZ-MATRIXVIEW-01    | 渲染 4×4 数据单元 + 行列标签 A/B/C/D                                            | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-02    | null 单元显示「∞」（初始 6 个）                                                 | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-03    | pivot=1 → 第 1 行/列单元带 .mx-pivot（7 个）                                    | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-04    | active 单元 .mx-active；sources 两单元 .mx-source                               | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-05    | 行列异标签 rowLabels/colLabels 各自渲染（DP 表）                                | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-06    | emptyText='' → null 单元显示空白（非 ∞）                                        | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-MATRIXVIEW-07    | pathCells=[[1,1],[2,2]] → 2 个 .mx-path；不设 0（C-060 扩展）                   | `src/components/MatrixView.spec.ts`             |
| TC-VIZ-BOARDVIEW-01     | n=4 → 16 .board-cell；queens=[1,3,0,2] → 4 皇后 ♛                               | `src/components/BoardView.spec.ts`              |
| TC-VIZ-BOARDVIEW-02     | 交错着色：深格 8 个                                                             | `src/components/BoardView.spec.ts`              |
| TC-VIZ-BOARDVIEW-03     | tryCell=[2,1] → 对应格带 .bc-try                                                | `src/components/BoardView.spec.ts`              |
| TC-VIZ-BOARDVIEW-04     | conflictCells=[[0,0]] → 对应格带 .bc-conflict                                   | `src/components/BoardView.spec.ts`              |
| TC-VIZ-DTREEVIEW-01     | 3 节点 2 边 → 3 .dtree-node、2 .dtree-edge                                      | `src/components/DecisionTreeView.spec.ts`       |
| TC-VIZ-DTREEVIEW-02     | activeId=1 → 恰 1 个 .active 节点                                               | `src/components/DecisionTreeView.spec.ts`       |
| TC-VIZ-DTREEVIEW-03     | solutionIds=[2] → 恰 1 个 .solution 节点                                        | `src/components/DecisionTreeView.spec.ts`       |
| TC-VIZ-DTREEVIEW-04     | 决策边标签「选 1」+ 叶标签「{1}」渲染为文字                                     | `src/components/DecisionTreeView.spec.ts`       |
| TC-VIZ-DTREEVIEW-05     | prunedIds=[2] → 恰 1 个 .pruned 节点；不设 0 个（C-058 扩展）                   | `src/components/DecisionTreeView.spec.ts`       |
| TC-VIZ-MAZEVIEW-01      | 5×5 → 25 格；2 墙 → 2 .mz-wall                                                  | `src/components/MazeView.spec.ts`               |
| TC-VIZ-MAZEVIEW-02      | 起点/终点各 1（.mz-start/.mz-goal）                                             | `src/components/MazeView.spec.ts`               |
| TC-VIZ-MAZEVIEW-03      | current → 1 .mz-current；path=3 → 3 .mz-path                                    | `src/components/MazeView.spec.ts`               |
| TC-VIZ-MAZEVIEW-04      | visited → .mz-visited；solved → path 带 .mz-solution                            | `src/components/MazeView.spec.ts`               |
| TC-VIZ-MAZEVIEW-05      | filled 标绿 + mark 覆盖图标 + 无起终点（C-066 网格搜索扩展）                    | `src/components/MazeView.spec.ts`               |
| TC-VIZ-MAZEVIEW-06      | letters=[['A','B'],['C','D']] → 4 格 .mz-letter，文本 A/B/C/D（C-068 字母扩展） | `src/components/MazeView.spec.ts`               |
| TC-VIZ-KMPVIEW-01       | 文本 9 格、模式 5 格、LPS 5 格                                                  | `src/components/KmpView.spec.ts`                |
| TC-VIZ-KMPVIEW-02       | compareText/comparePat=4 → 2 个 .kmp-compare                                    | `src/components/KmpView.spec.ts`                |
| TC-VIZ-KMPVIEW-03       | matchedLen=2 → 2 个 .kmp-matched（模式前缀）                                    | `src/components/KmpView.spec.ts`                |
| TC-VIZ-KMPVIEW-04       | found=[2] → 文本下标 2 起 5 格带 .kmp-found                                     | `src/components/KmpView.spec.ts`                |
| TC-VIZ-KMPVIEW-05       | windowStart=2（P 长 3）→ 3 格 .kmp-window；lps=[] → 无 π 行（C-063 扩展）       | `src/components/KmpView.spec.ts`                |
| TC-VIZ-KMPVIEW-06       | matchedFrom=1（matchedLen=0）→ 2 格 .kmp-matched（后缀标绿，C-064 扩展）        | `src/components/KmpView.spec.ts`                |
| TC-VIZ-MANACHERVIEW-01  | s 长 11 → 11 .mn-s-cell + 11 .mn-p-cell；p 含 null 显示空（C-067）              | `src/components/ManacherView.spec.ts`           |
| TC-VIZ-MANACHERVIEW-02  | center=3 → 1 .mn-center；mirror=1 → 1 .mn-mirror（C-067）                       | `src/components/ManacherView.spec.ts`           |
| TC-VIZ-MANACHERVIEW-03  | boxL=0,boxR=6 → 7 格 .mn-box（C-067）                                           | `src/components/ManacherView.spec.ts`           |
| TC-VIZ-MANACHERVIEW-04  | best=[0,6] → 7 格 .mn-best（C-067）                                             | `src/components/ManacherView.spec.ts`           |
| TC-PLAYER-GRAPH-01      | 当前步带 graph → 渲染 GraphView                                                 | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-GRAPH-02      | array:[]→无 BarsView；bubble array 非空→仍渲染（零回归）                        | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MATRIX-01     | step 带 matrix → 渲染 MatrixView                                                | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MATRIX-02     | 排序 step 无 matrix→不渲染；matrix step array:[]→不渲 BarsView                  | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-BOARD-01      | step 带 board → 渲染 BoardView                                                  | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-BOARD-02      | 排序 step 无 board→不渲染 BoardView（零回归）                                   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-DTREE-01      | step 带 decisionTree → 渲染 DecisionTreeView                                    | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-DTREE-02      | 排序 step 无 decisionTree→不渲染（零回归）                                      | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MAZE-01       | step 带 maze → 渲染 MazeView                                                    | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MAZE-02       | 排序 step 无 maze→不渲染 MazeView（零回归）                                     | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-KMP-01        | step 带 kmp → 渲染 KmpView                                                      | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-KMP-02        | 排序 step 无 kmp→不渲染 KmpView（零回归）                                       | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MANACHER-01   | step 带 manacher → 渲染 ManacherView（C-067）                                   | `src/components/player/AlgorithmPlayer.spec.ts` |
| TC-PLAYER-MANACHER-02   | 排序 step 无 manacher→不渲染 ManacherView（零回归）（C-067）                    | `src/components/player/AlgorithmPlayer.spec.ts` |

### Kruskal 页 C-038 → C-048 返工进播放器（M8②-2 · 收官 M8）

> C-048：Kruskal 页正文保留、自建 `KruskalViz` 换成 `AlgorithmPlayer`（GraphView 无向图轨，零改动复用 C-047）。以下 8 个 `TC-VIZ-KRUSKALVIZ-*` 随 `KruskalViz.vue`/spec 删除 **superseded**；`TC-VIEW-KRUSKAL-01/02` 改写为播放器断言、新增 -03。

| Case ID                  | 标题                                                                 | 自动化路径                                    |
| ------------------------ | -------------------------------------------------------------------- | --------------------------------------------- |
| ~~TC-VIZ-KRUSKALVIZ-01~~ | ~~6 kvert + 9 kedge + 边列表 9 行 + 下一步/重置~~ (superseded C-048) | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-02~~ | ~~初始无 MST~~ (superseded C-048)                                    | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-03~~ | ~~下一步×1：首条加入、status 含「加入」~~ (superseded C-048)         | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-04~~ | ~~下一步×4：成环跳过、cycle ≥1、mst 仍 3~~ (superseded C-048)        | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-05~~ | ~~下一步×4：当前考虑边高亮 ≥1~~ (superseded C-048)                   | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-06~~ | ~~走到底：mst 5、status 含 18~~ (superseded C-048)                   | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-07~~ | ~~走到底：成环 4 条~~ (superseded C-048)                             | ~~`KruskalViz.spec.ts`~~                      |
| ~~TC-VIZ-KRUSKALVIZ-08~~ | ~~重置：mst 清空~~ (superseded C-048)                                | ~~`KruskalViz.spec.ts`~~                      |
| TC-VIEW-KRUSKAL-01       | 挂载渲染 Article + AlgorithmPlayer（不再含 KruskalViz）              | `src/views/Article/Algorithm/Kruskal.spec.ts` |
| TC-VIEW-KRUSKAL-02       | h1 含「Kruskal」+ GraphView + 6 .graph-node + 无 .bars-view          | `src/views/Article/Algorithm/Kruskal.spec.ts` |
| TC-VIEW-KRUSKAL-03       | 全模板同屏：Article 含「最小生成树」+ ≥9 .graph-edge                 | `src/views/Article/Algorithm/Kruskal.spec.ts` |

### Prim 页 C-049（M6 图算法 G7，新页，全模板 + GraphView 无向轨）

| Case ID         | 标题                                                     | 自动化路径                                 |
| --------------- | -------------------------------------------------------- | ------------------------------------------ |
| TC-VIEW-PRIM-01 | 挂载渲染 Article + AlgorithmPlayer                       | `src/views/Article/Algorithm/Prim.spec.ts` |
| TC-VIEW-PRIM-02 | h1 含「Prim」+ GraphView + 6 .graph-node + 无 .bars-view | `src/views/Article/Algorithm/Prim.spec.ts` |
| TC-VIEW-PRIM-03 | 全模板同屏：Article 含「最小生成树」+ ≥9 .graph-edge     | `src/views/Article/Algorithm/Prim.spec.ts` |

### Bellman-Ford 页 C-050（M6 图算法 G3，新页，全模板 + GraphView 有向轨含负权）

| Case ID            | 标题                                                        | 自动化路径                                    |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------- |
| TC-VIEW-BELLMAN-01 | 挂载渲染 Article + AlgorithmPlayer                          | `src/views/Article/Algorithm/Bellman.spec.ts` |
| TC-VIEW-BELLMAN-02 | h1 含「Bellman」+ GraphView + 5 .graph-node + 无 .bars-view | `src/views/Article/Algorithm/Bellman.spec.ts` |
| TC-VIEW-BELLMAN-03 | 全模板同屏：Article 含「最短」+ ≥7 .graph-edge              | `src/views/Article/Algorithm/Bellman.spec.ts` |

### 拓扑排序页 C-051（M6 图算法 G5，新页，全模板 + GraphView 有向无权轨）

| Case ID         | 标题                                                     | 自动化路径                                 |
| --------------- | -------------------------------------------------------- | ------------------------------------------ |
| TC-VIEW-TOPO-01 | 挂载渲染 Article + AlgorithmPlayer                       | `src/views/Article/Algorithm/Topo.spec.ts` |
| TC-VIEW-TOPO-02 | h1 含「拓扑」+ GraphView + 6 .graph-node + 无 .bars-view | `src/views/Article/Algorithm/Topo.spec.ts` |
| TC-VIEW-TOPO-03 | 全模板同屏：Article 含「拓扑」+ ≥7 .graph-edge           | `src/views/Article/Algorithm/Topo.spec.ts` |

### Floyd-Warshall 页 C-052（M6 图算法 G4，新页，全模板 + MatrixView 矩阵轨）

| Case ID          | 标题                                                         | 自动化路径                                  |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------- |
| TC-VIEW-FLOYD-01 | 挂载渲染 Article + AlgorithmPlayer                           | `src/views/Article/Algorithm/Floyd.spec.ts` |
| TC-VIEW-FLOYD-02 | h1 含「Floyd」+ MatrixView + 16 .matrix-cell + 无 .bars-view | `src/views/Article/Algorithm/Floyd.spec.ts` |
| TC-VIEW-FLOYD-03 | 全模板同屏：Article 含「最短」+ MatrixView                   | `src/views/Article/Algorithm/Floyd.spec.ts` |

### 强连通分量页 C-069（图算法第 7 页，新页，全模板 + 扩展 GraphView 图轨）

| Case ID        | 标题                                       | 自动化路径                                |
| -------------- | ------------------------------------------ | ----------------------------------------- |
| TC-VIEW-SCC-01 | 挂载渲染 Article + AlgorithmPlayer         | `src/views/Article/Algorithm/Scc.spec.ts` |
| TC-VIEW-SCC-02 | h1 含「强连通」+ GraphView + 无 .bars-view | `src/views/Article/Algorithm/Scc.spec.ts` |
| TC-VIEW-SCC-03 | 全模板同屏：正文含「Tarjan」+ GraphView    | `src/views/Article/Algorithm/Scc.spec.ts` |

### 编辑距离页 C-053（DP 大类首发，新页，全模板 + MatrixView DP 表）

| Case ID         | 标题                                                            | 自动化路径                                 |
| --------------- | --------------------------------------------------------------- | ------------------------------------------ |
| TC-VIEW-EDIT-01 | 挂载渲染 Article + AlgorithmPlayer                              | `src/views/Article/Algorithm/Edit.spec.ts` |
| TC-VIEW-EDIT-02 | h1 含「编辑距离」+ MatrixView + 16 .matrix-cell + 无 .bars-view | `src/views/Article/Algorithm/Edit.spec.ts` |
| TC-VIEW-EDIT-03 | 全模板同屏：Article 含「编辑距离」+ MatrixView                  | `src/views/Article/Algorithm/Edit.spec.ts` |

### 0-1 背包页 C-054（DP2，新页，全模板 + MatrixView DP 表）

| Case ID         | 标题                                                        | 自动化路径                                     |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| TC-VIEW-KNAP-01 | 挂载渲染 Article + AlgorithmPlayer                          | `src/views/Article/Algorithm/Knapsack.spec.ts` |
| TC-VIEW-KNAP-02 | h1 含「背包」+ MatrixView + 30 .matrix-cell + 无 .bars-view | `src/views/Article/Algorithm/Knapsack.spec.ts` |
| TC-VIEW-KNAP-03 | 全模板同屏：Article 含「背包」+ MatrixView                  | `src/views/Article/Algorithm/Knapsack.spec.ts` |

### 完全背包页 C-065（动态规划第 5 页，新页，全模板 + 复用 MatrixView 轨）

| Case ID       | 标题                                               | 自动化路径                                             |
| ------------- | -------------------------------------------------- | ------------------------------------------------------ |
| TC-VIEW-CK-01 | 挂载渲染 Article + AlgorithmPlayer                 | `src/views/Article/Algorithm/CompleteKnapsack.spec.ts` |
| TC-VIEW-CK-02 | h1 含「完全背包」+ MatrixView（28 单元）+ 无柱数组 | `src/views/Article/Algorithm/CompleteKnapsack.spec.ts` |
| TC-VIEW-CK-03 | 全模板同屏：正文含「本行」+ MatrixView             | `src/views/Article/Algorithm/CompleteKnapsack.spec.ts` |

### N 皇后页 C-055（回溯大类首发，新页，全模板 + BoardView 棋盘）

| Case ID           | 标题                                                      | 自动化路径                                   |
| ----------------- | --------------------------------------------------------- | -------------------------------------------- |
| TC-VIEW-QUEENS-01 | 挂载渲染 Article + AlgorithmPlayer                        | `src/views/Article/Algorithm/Queens.spec.ts` |
| TC-VIEW-QUEENS-02 | h1 含「皇后」+ BoardView + 16 .board-cell + 无 .bars-view | `src/views/Article/Algorithm/Queens.spec.ts` |
| TC-VIEW-QUEENS-03 | 全模板同屏：Article 含「皇后」+ BoardView                 | `src/views/Article/Algorithm/Queens.spec.ts` |

### 子集生成页 C-056（回溯第 2 页，新页，全模板 + DecisionTreeView 决策树）

| Case ID            | 标题                                             | 自动化路径                                    |
| ------------------ | ------------------------------------------------ | --------------------------------------------- |
| TC-VIEW-SUBSETS-01 | 挂载渲染 Article + AlgorithmPlayer               | `src/views/Article/Algorithm/Subsets.spec.ts` |
| TC-VIEW-SUBSETS-02 | h1 含「子集」+ DecisionTreeView + 无 .bars-view  | `src/views/Article/Algorithm/Subsets.spec.ts` |
| TC-VIEW-SUBSETS-03 | 全模板同屏：Article 含「子集」+ DecisionTreeView | `src/views/Article/Algorithm/Subsets.spec.ts` |

### 全排列页 C-057（回溯第 3 页，新页，全模板 + 复用 DecisionTreeView 决策树）

| Case ID            | 标题                                             | 自动化路径                                    |
| ------------------ | ------------------------------------------------ | --------------------------------------------- |
| TC-VIEW-PERMUTE-01 | 挂载渲染 Article + AlgorithmPlayer               | `src/views/Article/Algorithm/Permute.spec.ts` |
| TC-VIEW-PERMUTE-02 | h1 含「排列」+ DecisionTreeView + 无 .bars-view  | `src/views/Article/Algorithm/Permute.spec.ts` |
| TC-VIEW-PERMUTE-03 | 全模板同屏：Article 含「排列」+ DecisionTreeView | `src/views/Article/Algorithm/Permute.spec.ts` |

### 组合总和页 C-058（回溯第 4 页，新页，全模板 + 决策树剪枝）

| Case ID            | 标题                                             | 自动化路径                                    |
| ------------------ | ------------------------------------------------ | --------------------------------------------- |
| TC-VIEW-COMBSUM-01 | 挂载渲染 Article + AlgorithmPlayer               | `src/views/Article/Algorithm/Combsum.spec.ts` |
| TC-VIEW-COMBSUM-02 | h1 含「组合」+ DecisionTreeView + 无 .bars-view  | `src/views/Article/Algorithm/Combsum.spec.ts` |
| TC-VIEW-COMBSUM-03 | 全模板同屏：Article 含「组合」+ DecisionTreeView | `src/views/Article/Algorithm/Combsum.spec.ts` |

### 迷宫寻路页 C-059（回溯第 5 页，新页，全模板 + MazeView 迷宫）

| Case ID         | 标题                                            | 自动化路径                                 |
| --------------- | ----------------------------------------------- | ------------------------------------------ |
| TC-VIEW-MAZE-01 | 挂载渲染 Article + AlgorithmPlayer              | `src/views/Article/Algorithm/Maze.spec.ts` |
| TC-VIEW-MAZE-02 | h1 含「迷宫」+ MazeView + 25 格 + 无 .bars-view | `src/views/Article/Algorithm/Maze.spec.ts` |
| TC-VIEW-MAZE-03 | 全模板同屏：Article 含「迷宫」+ MazeView        | `src/views/Article/Algorithm/Maze.spec.ts` |

### 岛屿数量页 C-066（回溯网格搜索第 2 页，新页，全模板 + 复用 MazeView 轨）

| Case ID        | 标题                                            | 自动化路径                                    |
| -------------- | ----------------------------------------------- | --------------------------------------------- |
| TC-VIEW-ISL-01 | 挂载渲染 Article + AlgorithmPlayer              | `src/views/Article/Algorithm/Islands.spec.ts` |
| TC-VIEW-ISL-02 | h1 含「岛屿」+ MazeView（16 格）+ 无 .bars-view | `src/views/Article/Algorithm/Islands.spec.ts` |
| TC-VIEW-ISL-03 | 全模板同屏：正文含「连通」+ MazeView            | `src/views/Article/Algorithm/Islands.spec.ts` |

### 单词搜索页 C-068（回溯网格搜索第 3 页，新页，全模板 + 复用 MazeView 字母网格轨）

| Case ID       | 标题                                        | 自动化路径                                       |
| ------------- | ------------------------------------------- | ------------------------------------------------ |
| TC-VIEW-WS-01 | 挂载渲染 Article + AlgorithmPlayer          | `src/views/Article/Algorithm/WordSearch.spec.ts` |
| TC-VIEW-WS-02 | h1 含「单词搜索」+ MazeView + 无 .bars-view | `src/views/Article/Algorithm/WordSearch.spec.ts` |
| TC-VIEW-WS-03 | 全模板同屏：正文含「回溯」+ MazeView        | `src/views/Article/Algorithm/WordSearch.spec.ts` |

### 最长公共子序列页 C-060（DP 第 3 页，新页，全模板 + 填表 + 回溯）

| Case ID        | 标题                                         | 自动化路径                                |
| -------------- | -------------------------------------------- | ----------------------------------------- |
| TC-VIEW-LCS-01 | 挂载渲染 Article + AlgorithmPlayer           | `src/views/Article/Algorithm/Lcs.spec.ts` |
| TC-VIEW-LCS-02 | h1 含「子序列」+ MatrixView + 无 .bars-view  | `src/views/Article/Algorithm/Lcs.spec.ts` |
| TC-VIEW-LCS-03 | 全模板同屏：Article 含「子序列」+ MatrixView | `src/views/Article/Algorithm/Lcs.spec.ts` |

### 最长递增子序列页 C-061（DP 第 4 页，新页，全模板 + 一维 DP 两行表）

| Case ID        | 标题                                             | 自动化路径                                |
| -------------- | ------------------------------------------------ | ----------------------------------------- |
| TC-VIEW-LIS-01 | 挂载渲染 Article + AlgorithmPlayer               | `src/views/Article/Algorithm/Lis.spec.ts` |
| TC-VIEW-LIS-02 | h1 含「递增子序列」+ MatrixView + 无 .bars-view  | `src/views/Article/Algorithm/Lis.spec.ts` |
| TC-VIEW-LIS-03 | 全模板同屏：Article 含「递增子序列」+ MatrixView | `src/views/Article/Algorithm/Lis.spec.ts` |

### KMP 字符串匹配页 C-062（字符串大类首发，新页，全模板 + 字符串匹配轨）

| Case ID        | 标题                                      | 自动化路径                                |
| -------------- | ----------------------------------------- | ----------------------------------------- |
| TC-VIEW-KMP-01 | 挂载渲染 Article + AlgorithmPlayer        | `src/views/Article/Algorithm/Kmp.spec.ts` |
| TC-VIEW-KMP-02 | h1 含「KMP」+ KmpView + 无 .bars-view     | `src/views/Article/Algorithm/Kmp.spec.ts` |
| TC-VIEW-KMP-03 | 全模板同屏：Article 含「字符串」+ KmpView | `src/views/Article/Algorithm/Kmp.spec.ts` |

### Rabin-Karp 页 C-063（字符串第 2 页，新页，全模板 + 复用 KmpView 轨·无 π 行）

| Case ID       | 标题                                                   | 自动化路径                                      |
| ------------- | ------------------------------------------------------ | ----------------------------------------------- |
| TC-VIEW-RK-01 | 挂载渲染 Article + AlgorithmPlayer                     | `src/views/Article/Algorithm/RabinKarp.spec.ts` |
| TC-VIEW-RK-02 | h1 含「Rabin-Karp」+ KmpView + 无 .bars-view + 无 π 行 | `src/views/Article/Algorithm/RabinKarp.spec.ts` |
| TC-VIEW-RK-03 | 全模板同屏：Article 含「哈希」+ KmpView                | `src/views/Article/Algorithm/RabinKarp.spec.ts` |

### Boyer-Moore 页 C-064（字符串第 3 页，新页，全模板 + 复用 KmpView 轨·无 π 行）

| Case ID       | 标题                                                    | 自动化路径                                       |
| ------------- | ------------------------------------------------------- | ------------------------------------------------ |
| TC-VIEW-BM-01 | 挂载渲染 Article + AlgorithmPlayer                      | `src/views/Article/Algorithm/BoyerMoore.spec.ts` |
| TC-VIEW-BM-02 | h1 含「Boyer-Moore」+ KmpView + 无 .bars-view + 无 π 行 | `src/views/Article/Algorithm/BoyerMoore.spec.ts` |
| TC-VIEW-BM-03 | 全模板同屏：Article 含「坏字符」+ KmpView               | `src/views/Article/Algorithm/BoyerMoore.spec.ts` |

### Manacher 页 C-067（字符串第 4 页，新页，全模板 + 新建 ManacherView 回文轨）

| Case ID        | 标题                                            | 自动化路径                                     |
| -------------- | ----------------------------------------------- | ---------------------------------------------- |
| TC-VIEW-MAN-01 | 挂载渲染 Article + AlgorithmPlayer              | `src/views/Article/Algorithm/Manacher.spec.ts` |
| TC-VIEW-MAN-02 | h1 含「Manacher」+ ManacherView + 无 .bars-view | `src/views/Article/Algorithm/Manacher.spec.ts` |
| TC-VIEW-MAN-03 | 全模板同屏：正文含「回文」+ ManacherView        | `src/views/Article/Algorithm/Manacher.spec.ts` |

---

## L5 — 端到端（Playwright）

共 **61** 个用例（TC-E2E-BUBBLE-01 已 superseded）。运行命令：`pnpm test:e2e`

| Case ID             | 标题                                                                                                                       | 自动化路径                         | 状态       |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------- |
| TC-E2E-HOME-01      | 首页加载并能进入 docs                                                                                                      | `e2e/home-navigation.e2e.ts`       | active     |
| TC-E2E-MENU-01      | docs 菜单点击切换路由                                                                                                      | `e2e/docs-menu.e2e.ts`             | active     |
| TC-E2E-BUBBLE-01    | ~~冒泡排序动画最终升序~~                                                                                                   | `e2e/bubble-sort.e2e.ts`           | superseded |
| TC-E2E-PLAYER-01    | 冒泡播放器：默认暂停/单步/跳末升序/重置                                                                                    | `e2e/bubble-sort.e2e.ts`           | active     |
| TC-E2E-SELECTION-01 | 选择排序播放器：默认暂停/单步/跳末升序/重置                                                                                | `e2e/selection-sort.e2e.ts`        | active     |
| TC-E2E-INSERTION-01 | 插入排序播放器：默认暂停/单步/跳末升序/重置                                                                                | `e2e/insertion-sort.e2e.ts`        | active     |
| TC-E2E-SHELL-01     | 希尔排序播放器：默认暂停/单步聚焦分组/跳末升序/重置                                                                        | `e2e/shell-sort.e2e.ts`            | active     |
| TC-E2E-MERGE-01     | 归并播放器：默认暂停 / 合并聚焦+temp填充 / 跳末升序 / 重置                                                                 | `e2e/merge-sort.e2e.ts`            | active     |
| TC-E2E-QUICK-01     | 快排播放器：默认暂停/区间栈轨/pivot品红/跳末升序全绿/重置                                                                  | `e2e/quick-sort.e2e.ts`            | active     |
| TC-E2E-HEAP-01      | 堆排序播放器 e2e：默认暂停/树轨/heapNode/跳末升序/重置                                                                     | `e2e/heap-sort.e2e.ts`             | active     |
| TC-E2E-COUNT-01     | 计数排序播放器：默认暂停/桶轨/计数填桶/空桶/跳末升序/重置                                                                  | `e2e/counting-sort.e2e.ts`         | active     |
| TC-E2E-RADIX-01     | 基数排序播放器：主轨 8 柱 / 桶轨 10 桶 / 拖到末步升序                                                                      | `e2e/radix-sort.e2e.ts`            | active     |
| TC-E2E-BUCKET-01    | 桶排序全模板：正文 + 桶轨 5 桶 + 主轨 8 柱 / 拖到末步升序                                                                  | `e2e/bucket-sort.e2e.ts`           | active     |
| TC-E2E-3WQUICK-01   | 三路快排全模板：正文 + 区间栈 + 主轨 8 柱 / 拖到末步升序                                                                   | `e2e/three-way-quick-sort.e2e.ts`  | active     |
| TC-E2E-DUALPIVOT-01 | 双轴快排全模板：正文 + 区间栈 + 主轨 8 柱 / 拖到末步升序                                                                   | `e2e/dual-pivot-quick-sort.e2e.ts` | active     |
| TC-E2E-CODEPANEL-01 | 缺陷回归：代码面板长行可横滚、不截断（overflow-x + 行宽）                                                                  | `e2e/code-panel-hscroll.e2e.ts`    | active     |
| TC-E2E-TDMERGE-01   | 自顶向下归并全模板：正文 + 递归栈/temp 双辅助轨 + 拖末步升序                                                               | `e2e/top-down-merge-sort.e2e.ts`   | active     |
| TC-E2E-BININS-01    | 二分插入排序全模板：正文 + 主轨 8 柱 / 拖到末步升序                                                                        | `e2e/binary-insertion-sort.e2e.ts` | active     |
| TC-E2E-COCKTAIL-01  | 鸡尾酒排序全模板：正文 + 主轨 8 柱 / 拖到末步升序                                                                          | `e2e/cocktail-sort.e2e.ts`         | active     |
| TC-E2E-STACK-01     | 栈知识页：正文+互动栈/push/栈顶跟随/pop/重置空态                                                                           | `e2e/stack.e2e.ts`                 | active     |
| TC-E2E-QUEUE-01     | 队列知识页：正文+互动队列/enqueue/双指针/dequeue移队首/重置                                                                | `e2e/queue.e2e.ts`                 | active     |
| TC-E2E-ARRAY-01     | 数组知识页：正文+互动数组/点选下标/插入右移/尾部追加/重置                                                                  | `e2e/array.e2e.ts`                 | active     |
| TC-E2E-LINK-01      | 链表知识页：正文+互动链表/点节点选中/选中后插入/头插/重置                                                                  | `e2e/link.e2e.ts`                  | active     |
| TC-E2E-TREE-01      | 树知识页：正文+互动 BST/输入插入走位/中序=升序/重置                                                                        | `e2e/tree.e2e.ts`                  | active     |
| TC-E2E-HEAPDS-01    | 堆知识页：正文+互动堆/数组+树双视图/输入插入上浮/重置                                                                      | `e2e/heap.e2e.ts`                  | active     |
| TC-E2E-HASH-01      | 哈希表知识页：正文+互动哈希/散列直达/冲突追加/重置                                                                         | `e2e/hash.e2e.ts`                  | active     |
| TC-E2E-GRAPH-01     | 图知识页：正文+互动图/BFS 队列遍历/重置                                                                                    | `e2e/graph.e2e.ts`                 | active     |
| TC-E2E-TREE-02      | 树页·平衡节：退化↔平衡对照 + 查找走位                                                                                      | `e2e/tree.e2e.ts`                  | active     |
| TC-E2E-HASH-02      | 哈希页·开放寻址节：扁平表 7 格/线性探测插入/未命中/重置                                                                    | `e2e/hash.e2e.ts`                  | active     |
| TC-E2E-LINK-02      | 链表页·双向节：4 节点/反向遍历/点节点 O(1) 删除/重置                                                                       | `e2e/link.e2e.ts`                  | active     |
| TC-E2E-QUEUE-02     | 队列页·双端节：3 元素/头部入/尾部出/重置（两端进出）                                                                       | `e2e/queue.e2e.ts`                 | active     |
| TC-E2E-ARRAY-02     | 数组页·扩容节：容量满了翻倍扩容 + 均摊 O(1)                                                                                | `e2e/array.e2e.ts`                 | active     |
| TC-E2E-TRIE-01      | 字典树页：11 节点 / 查找 card「词」/ 前缀 ca「car」/ 重置                                                                  | `e2e/trie.e2e.ts`                  | active     |
| TC-E2E-UF-01        | 并查集页：8 节点 / 合并后组数变 / 连通?判定 / 重置                                                                         | `e2e/union-find.e2e.ts`            | active     |
| TC-E2E-LRU-01       | LRU 页：3 cell / get 命中跳最前 / put 满淘汰 / 重置                                                                        | `e2e/lru.e2e.ts`                   | active     |
| TC-E2E-SKIP-01      | 跳表页：cell 渲染 / 查找 11「找到」/ 查找 8「没找到」/ 重置                                                                | `e2e/skip-list.e2e.ts`             | active     |
| TC-E2E-SEG-01       | 线段树页：15 节点 / 区间和 2,5「17」/ 更新 2→10「更新」/ 重置                                                              | `e2e/segment-tree.e2e.ts`          | active     |
| TC-E2E-BTREE-01     | B+ 树页：4 节点 / 查找 30「找到了」/ 范围 12,38「扫到」/ 重置                                                              | `e2e/b-tree.e2e.ts`                | active     |
| TC-E2E-BLOOM-01     | 布隆页：16 格 / 加 3·7·11 / 查 7「可能存在」/ 查 2「误判」/ 重置                                                           | `e2e/bloom-filter.e2e.ts`          | active     |
| TC-E2E-DIJKSTRA-01  | Dijkstra 全模板：正文 + 图轨 6 点 9 边 / `.scrub` 拖末步 6 绿点 + 5 绿树边 / Shiki（C-047 改写）                           | `e2e/dijkstra.e2e.ts`              | active     |
| TC-E2E-KRUSKAL-01   | Kruskal 全模板：正文 + 图轨 6 点 9 边 / `.scrub` 拖末步 5 `.mst` 绿边 + 4 `.rejected` 虚线 + 字幕 18 / Shiki（C-048 改写） | `e2e/kruskal.e2e.ts`               | active     |
| TC-E2E-PRIM-01      | Prim 全模板：正文 + 图轨 6 点 9 边 / `.scrub` 拖末步 5 `.mst` 绿边 + 6 点全绿 + 字幕 18 / Shiki（C-049 新增）              | `e2e/prim.e2e.ts`                  | active     |
| TC-E2E-BELLMAN-01   | Bellman-Ford 全模板：正文 + 图轨 5 点 7 边（含负权）/ `.scrub` 拖末步 4 `.tree` 绿边 + 5 点全绿 / Shiki（C-050 新增）      | `e2e/bellman-ford.e2e.ts`          | active     |
| TC-E2E-TOPO-01      | 拓扑排序全模板：正文 + 图轨 6 点 7 边 DAG / `.scrub` 拖末步 6 点全绿 + 字幕拓扑序 / Shiki（C-051 新增）                    | `e2e/topological-sort.e2e.ts`      | active     |
| TC-E2E-FLOYD-01     | Floyd 全模板：正文 + 矩阵轨 4×4 / `.scrub` 拖末步全源矩阵无 ∞ / Shiki（C-052 新增）                                        | `e2e/floyd-warshall.e2e.ts`        | active     |
| TC-E2E-EDIT-01      | 编辑距离全模板：正文 + DP 表 4×4 / `.scrub` 拖末步右下角=2 / Shiki（C-053 新增）                                           | `e2e/edit-distance.e2e.ts`         | active     |
| TC-E2E-KNAP-01      | 0-1 背包全模板：正文 + DP 表 5×6 / `.scrub` 拖末步右下角=7 / Shiki（C-054 新增）                                           | `e2e/knapsack.e2e.ts`              | active     |
| TC-E2E-QUEENS-01    | N 皇后全模板：正文 + 棋盘 4×4 / `.scrub` 拖末步 4 皇后 / Shiki（C-055 新增）                                               | `e2e/n-queens.e2e.ts`              | active     |
| TC-E2E-SUBSETS-01   | 子集生成全模板：正文 + 决策树 15 节点 / `.scrub` 拖末步 8 解叶 / Shiki（C-056 新增）                                       | `e2e/subsets.e2e.ts`               | active     |
| TC-E2E-PERMUTE-01   | 全排列全模板：正文 + 多叉决策树 16 节点 / `.scrub` 拖末步 6 排列叶 / Shiki（C-057 新增）                                   | `e2e/permutations.e2e.ts`          | active     |
| TC-E2E-COMBSUM-01   | 组合总和全模板：正文 + 决策树剪枝 / `.scrub` 拖末步 5 剪枝支 + 2 解 / Shiki（C-058 新增）                                  | `e2e/combination-sum.e2e.ts`       | active     |
| TC-E2E-MAZE-01      | 迷宫寻路全模板：正文 + 网格 DFS 回溯 / `.scrub` 拖末步 解路径绿 / Shiki（C-059 新增）                                      | `e2e/maze.e2e.ts`                  | active     |
| TC-E2E-LCS-01       | LCS 全模板：正文 + DP 填表 + 回溯 / `.scrub` 拖末步 路径绿环 + caption 含 ACD / Shiki（C-060 新增）                        | `e2e/lcs.e2e.ts`                   | active     |
| TC-E2E-LIS-01       | LIS 全模板：正文 + 一维 DP 两行表 / `.scrub` 拖末步 LIS 绿环 + caption 含 1→3→4→5 / Shiki（C-061 新增）                    | `e2e/lis.e2e.ts`                   | active     |
| TC-E2E-KMP-01       | KMP 全模板：正文 + 文本/模式/LPS 三行 / `.scrub` 拖末步 命中区间高亮 + caption 含「命中」/ Shiki（C-062 新增）             | `e2e/kmp.e2e.ts`                   | active     |
| TC-E2E-RK-01        | Rabin-Karp 全模板：正文 + 滚动哈希窗口 / `.scrub` 拖末步 命中区间高亮 + caption 含「命中」/ Shiki（C-063 新增）            | `e2e/rabin-karp.e2e.ts`            | active     |
| TC-E2E-BM-01        | Boyer-Moore 全模板：正文 + 对齐窗口带 3 格 / `.scrub` 拖末步 命中区间高亮 + caption 含「命中」/ Shiki（C-064 新增）        | `e2e/boyer-moore.e2e.ts`           | active     |
| TC-E2E-CK-01        | 完全背包全模板：正文 + DP 表 4×7 / `.scrub` 拖末步 右下角=15 + caption 含 15 / Shiki（C-065 新增）                         | `e2e/complete-knapsack.e2e.ts`     | active     |
| TC-E2E-ISL-01       | 岛屿数量全模板：正文 + 4×4 网格 / `.scrub` 拖末步 6 绿陆地 + caption 含 3 个岛 / Shiki（C-066 新增）                       | `e2e/number-of-islands.e2e.ts`     | active     |
| TC-E2E-MAN-01       | Manacher 全模板：正文 + 转换串/半径两行 / `.scrub` 拖末步 7 .mn-best（bab）+ caption 含 bab / Shiki（C-067 新增）          | `e2e/manacher.e2e.ts`              | active     |
| TC-E2E-WS-01        | 单词搜索全模板：正文 + 3×4 字母网格 / `.scrub` 拖末步 4 .mz-solution（ADEE 路径绿）+ caption 含 ADEE / Shiki（C-068 新增） | `e2e/word-search.e2e.ts`           | active     |
| TC-E2E-SCC-01       | 强连通分量全模板：正文 + 有向图 6 点 / `.scrub` 拖末步 caption 含 3 个 SCC + 栈空（0 .on-stack）/ Shiki（C-069 新增）      | `e2e/scc.e2e.ts`                   | active     |

---

## 覆盖率（L3+L4，2026-06-25）

| 指标   | 实际值 | 阈值 | 状态 |
| ------ | ------ | ---- | ---- |
| Stmts  | 92.47% | 70%  | 达标 |
| Branch | 89.86% | 60%  | 达标 |
| Funcs  | 92.80% | 70%  | 达标 |
| Lines  | 93.53% | 70%  | 达标 |

> 注：`HeapViz.vue` 单文件偏低（行 ~68% / 分支 ~56%）——未覆盖为 setTimeout 驱动的上浮/下沉**分步动画循环体**（`useHeap` 堆逻辑本身 L3 100% 覆盖、分步动画由 `TC-E2E-HEAPDS-01` 真机覆盖）；聚合门槛达标。
