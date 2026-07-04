# 设计：二分边界 lower/upper bound（C-20260705-092，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-092
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`[1,2,2,2,3,5,5,7,8,9]`、t=2。**lower_bound**（`a[mid]<t → lo=mid+1，否则 hi=mid`）：`(0,10,5,5,≥)/(0,5,2,2,≥)/(0,2,1,2,≥)/(0,1,0,1,<)` → lo=hi=**1**。**upper_bound**（`a[mid]<=t → lo=mid+1`）：`(0,10,5,5,>)/(0,5,2,2,≤)/(3,5,4,3,>)/(3,4,3,2,≤)` → **4**。等值区间 `[1,4)` 三个 2，count=3（与线性扫暴力对拍）。

## 复用（无 T0、零轨字段）

同 C-091：主柱轨 + pointers（lo '0' 红/mid '1' 蓝/hi '2' 黄，hi=n 哨兵位时省略黄箭头）+ emphasis（`groupMembers`=[lo,hi) 下标集、`pivotIndex`=探针、settle/range 用 `sortedIndices`）。`BbExecPoint = 'init'|'probe'|'settle'|'range'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`bbound.ts`：`BB_ARRAY`、`BB_T=2`；`bruteLb/bruteUb` 线性扫（独立真值）；`boundTrace(kind)` 返回 `{probes:[{lo,hi,mid,val,goRight}],result}`。
`bbound.module.ts`：两阶段 runPhase（init 半开区间说明 → probe×4（caption 比较 + 移动 + 不变量）→ settle（lo==hi 相遇点绿 + 「第一个 ≥/>」结论）→ range（[1,4) 三个 2 全绿 + count）→ done（模板对比 + 不存在退化 + O(log n)）。**14 步**。vars：t、[lo,hi)、mid、阶段。
`bbound.sources.ts`：四语言 lowerBound（半开两分支）+ 注释点出 upperBound 差异，lineMap init/probe/settle/range/done。

## T2：页面 + 接线

`BinaryBounds.vue`（Algorithm 目录）；路由 `/docs/binary-bounds`；菜单/首页「查找」第 2 项；新 svg（重复段三柱绿 + 两界箭头）；改 TC-HOOK（查找 children +binary-bounds）；C-091 页尾变体预告改实链。

## 复用与零回归

主柱轨/ArrowTrack/StepEmphasis 零改动；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：半开区间 [lo,hi) groupMembers、hi=n 哨兵位省略黄箭头、settle/range sortedIndices；oracle boundTrace 与 bruteLb/bruteUb 对拍；module 14 步。
