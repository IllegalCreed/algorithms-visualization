# 设计：三分查找（C-20260705-095，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-095
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`[1,4,7,9,12,10,6,3,2]`（严格单峰）。`third=⌊(hi−lo)/3⌋、m1=lo+third、m2=hi−third`：四探 `(0,8,2,6：a[2]=7>a[6]=6 → hi=5)/(0,5,1,4：4<12 → lo=2)/(2,5,3,4：9<12 → lo=4)/(4,5,4,5：12>10 → hi=4)` → lo==hi=**4**（峰 12，argmax 对拍）。

## 复用（无 T0、零轨字段）

主柱轨 + **四指针**：lo '0' 红 / m1 '1' 蓝 / m2 '2' 黄 / hi '3' 绿（store colors 四色首次全用）；emphasis：`comparing=[m1,m2]`（双探针对决高亮——排序页的比较对语义天然契合）、`groupMembers` 候选、peak 步 `sortedIndices`。`TerExecPoint = 'init'|'probe'|'peak'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`ternary.ts`：`TER_ARRAY`；`brutePeak()` argmax（独立真值）；`terTrace()` 返回 `{probes:[{lo,hi,m1,m2,v1,v2,dropRight}],result}`（严格单峰断言辅助 `isUnimodal`）。
`ternary.module.ts`：init（山形登场 + 二分为何失灵）→ probe×4（caption 双探针对决 `a[m1] vs a[m2]` + 丢哪侧 1/3）→ peak（lo==hi 峰顶绿）→ done（复杂度 log₍₃⁄₂₎ n + 坡度二分变体 + 实数三分/凸函数）。**7 步**。vars：[lo,hi]、m1/m2、对决、候选数。
`ternary.sources.ts`：四语言 ternaryPeak（third/m1/m2/比较两分支），lineMap init/probe/peak/done。

## T2：页面 + 接线

`TernarySearch.vue`（Algorithm 目录）；路由 `/docs/ternary-search`；菜单/首页「查找」第 5 项；新 svg（山形 + 双探针）；改 TC-HOOK。

## 复用与零回归

主柱轨/ArrowTrack/StepEmphasis 零改动；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：四指针四色全用、comparing=[m1,m2] 对决高亮；oracle terTrace 与 brutePeak argmax 对拍 + isUnimodal 断言；module 7 步。
