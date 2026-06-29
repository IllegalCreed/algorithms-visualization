# 测试用例：LRU 缓存（最近使用排序 + 淘汰最久没用）

> Status: verified
> Stable ID: C-20260629-031
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级           | 文件                                          | 编号区间               | 数量 |
| -------------- | --------------------------------------------- | ---------------------- | ---- |
| L3 LRU 逻辑    | `src/components/structures/useLRU.spec.ts`    | `TC-LRU-LOGIC-01..10`  | 10   |
| L4 LruViz 互动 | `src/components/structures/LruViz.spec.ts`    | `TC-VIZ-LRUVIZ-01..08` | 8    |
| L4 LRU 页      | `src/views/Article/DataStructure/Lru.spec.ts` | `TC-VIEW-LRU-01/02`    | 2    |
| L5 e2e         | `e2e/lru.e2e.ts`                              | `TC-E2E-LRU-01`        | 1    |

**合计新增 21 个 Case。** 无现存 `LRU` Case，命名空间干净（新结构、新前缀）。

**修改（计数变化，非回归）**：`TC-HOOK-01-2`（Home 数据结构 10→11）、`TC-HOOK-02-4`（Menu 数据结构 10→11）。

**回归（不新增、必须仍绿）**：既有 10 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case（除上述 2 处 HOOK 计数）—— 由全门禁证明零改动、零回归。

## L3 — useLRU（`TC-LRU-LOGIC-*`）

| TC              | 描述                                                   | 预期                         |
| --------------- | ------------------------------------------------------ | ---------------------------- |
| TC-LRU-LOGIC-01 | 初始 keys [3,2,1]、size 3、capacity 4                  | 一致                         |
| TC-LRU-LOGIC-02 | get(1) 命中：type hit、value 10                        | 一致                         |
| TC-LRU-LOGIC-03 | get(1) 移最前：keys [1,3,2]                            | 一致                         |
| TC-LRU-LOGIC-04 | get(9) 未命中：type miss、entries 不变                 | miss、keys [3,2,1]           |
| TC-LRU-LOGIC-05 | put(4,40) 新键未满：put-new、keys[0]=4、size 4、无淘汰 | evicted null                 |
| TC-LRU-LOGIC-06 | put(2,99) 更新已有：put-update、keys[0]=(2,99)、size 3 | value 99                     |
| TC-LRU-LOGIC-07 | put 满后淘汰：put(4,40);put(5,50) → evicted 1          | evicted 1、keys[0]=5、size 4 |
| TC-LRU-LOGIC-08 | 淘汰的是 LRU 末位：07 后 keys [5,4,3,2]（无 1）        | 一致                         |
| TC-LRU-LOGIC-09 | 连续 put 5 新键：size ≤ capacity 4                     | size 4                       |
| TC-LRU-LOGIC-10 | reset 复原 keys [3,2,1]、size 3                        | 一致                         |

## L4 — LruViz 互动（`TC-VIZ-LRUVIZ-*`）

| TC               | 描述                                                           | 预期              |
| ---------------- | -------------------------------------------------------------- | ----------------- |
| TC-VIZ-LRUVIZ-01 | 初始 3 lru-cell + key/value 输入 + get/put/重置 + MRU/LRU 标记 | 各断言通过        |
| TC-VIZ-LRUVIZ-02 | cell 键含 3/2/1                                                | 文本包含          |
| TC-VIZ-LRUVIZ-03 | get(1) 命中：status 含「找到」、首个 cell 键 1                 | status 含、首键 1 |
| TC-VIZ-LRUVIZ-04 | get(9) 未命中：status 含「没有」                               | status 含         |
| TC-VIZ-LRUVIZ-05 | put(4,40) 新键：4 lru-cell、首个 cell 键 4                     | 4 cell、首键 4    |
| TC-VIZ-LRUVIZ-06 | put 满后淘汰：填满再 put → status 含「淘汰」、cell 仍 4        | 4 cell、status 含 |
| TC-VIZ-LRUVIZ-07 | put(2,99) 更新：status 含「更新」                              | status 含         |
| TC-VIZ-LRUVIZ-08 | 重置：3 lru-cell                                               | 3 cell            |

## L4 — LRU 页（`TC-VIEW-LRU-*`）

| TC             | 描述                       | 预期   |
| -------------- | -------------------------- | ------ |
| TC-VIEW-LRU-01 | 挂载渲染 Article + LruViz  | 均存在 |
| TC-VIEW-LRU-02 | 含「LRU」标题与 Playground | 含     |

## L5 — e2e（`TC-E2E-LRU-01`）

| TC            | 描述                                                                                       | 预期       |
| ------------- | ------------------------------------------------------------------------------------------ | ---------- |
| TC-E2E-LRU-01 | `/docs/lru` 限定 `.lru-viz`：3 cell / get 命中跳最前 / put 满后淘汰 status / 重置回 3 cell | 各断言通过 |

## 修改（计数）

| TC           | 文件                                | 改动           |
| ------------ | ----------------------------------- | -------------- |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构 10→11 |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构 10→11 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useLRU` 纯逻辑（get 命中/未命中、put 新键/更新/淘汰、size、reset）L3 全覆盖；LruViz 同步分支（onGet hit/miss、onPut new/update/evict、onReset）L4 覆盖（TransitionGroup 动画由 e2e/肉眼复核）。

## 变更历史

- 2026-06-29：创建并落地。M4 广度 B3。实际新增 21 个 Case（useLRU 10 + LruViz 8 + view 2 + e2e 1）+ 改 2 处 HOOK 计数（数据结构 10→11），全绿；已回写三索引。覆盖率 All files 92.7%/89.74%/93.52%/93.85%（聚合均过门槛）；useLRU 纯逻辑 L3 全覆盖、LruViz 100% 行。单测 683 passed（100 文件）+ e2e 26 passed。新页 4 处接线（路由/菜单/首页/lru.svg）均接通；真机另验——put(4,40) 填满后 put(5,50) 淘汰最久没用的 1、5 从最前进入、容量 4/4 满、MRU/LRU 端标记就位。既有 10 结构 + 8 排序 + 播放器 + 骨架零回归。命名空间 `LRU`/`LRUVIZ` 干净。
