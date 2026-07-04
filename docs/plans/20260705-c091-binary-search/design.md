# 设计：二分查找（C-20260705-091，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-091
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`[1,3,5,7,9,11,13,15,17,19]`。**17**：`(0,9,4,9<17)→(5,9,7,15<17)→(8,9,8,17=)` 命中下标 8。**4**：`(0,9,4,9>4)→(0,3,1,3<4)→(2,3,2,5>4)→(2,1) 区间清空` → −1。

## 复用（无 T0、零 types 轨字段）

主柱轨 `array`（10 柱恒序，无 FLIP）+ `pointers`：lo=id '0'（红）/mid=id '1'（蓝）/hi=id '2'（黄）+ 既有 `StepEmphasis` 字段语义复用：`groupMembers` = 候选区间下标集（区间外淡出，「扔掉一半」可视化）、`pivotIndex` = mid 探针高亮、`sortedIndices=[idx]` = 命中绿。`BsExecPoint = 'init'|'mid'|'cut'|'found'|'empty'|'done'`（仅 types 加执行点类型）。

## T1：oracle + module + sources

`bsearch.ts`：`BS_ARRAY`、`BS_HIT=17`、`BS_MISS=4`；`linearFind(arr,t)` 线性扫（独立真值）；`bsearchTrace(arr,t)` 返回 `{found,index,probes:[{lo,hi,mid,val,cmp}],finalLo,finalHi}`（与线性对拍）。
`bsearch.module.ts`：`buildBsearchSteps(input)`——试验①（init 全区间 → mid 探针 → cut 收缩 groupMembers → … → found 绿）+ 试验②（init 重置 → … → cut 清空 → empty 结论 −1）+ done（O(log n) + 溢出小坑 + 变体预告）。**16 步**。vars：target、lo/hi/mid、比较、剩余候选数。
`bsearch.sources.ts`：四语言闭区间二分（`while lo<=hi`、`(lo+hi)>>1`、三分支），lineMap init/mid/found/cut/empty/done。

## T2：页面 + 接线（新大类）

`BinarySearch.vue`（Algorithm 目录）；路由 `/docs/binary-search`；菜单/首页**新增第 9 大类「查找」**（desc：在有序或结构化数据里高效定位——每一步扔掉不可能的区域）首项二分查找；新 svg（柱阵 + 三箭头 + 中点高亮）；改 TC-HOOK（`toHaveLength(9)` + `data[8]` title/children 断言，两 spec）。

## 复用与零回归

主柱轨/ArrowTrack/StepEmphasis 零改动（16 排序页 + 既有消费零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：主柱轨 + ArrowTrack + 既有 emphasis 纯复用（groupMembers 淡出/pivotIndex 探针/sortedIndices 命中）；oracle bsearchTrace 与 linearFind 对拍；module 16 步。踩坑：e2e 主柱轨选择器应为 .bars-view（BarsView），页 spec 断 BarsView 组件。
