# 设计：二分答案（C-20260705-094，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-094
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

piles=[3,6,7,11]、h=8、答案空间 [1, 11]。每档耗时 `{1:27, 2:15, 3:10, 4:8, 5:8, 6:6, …}`——k≥4 可行（单调 ✗✗✗✓✓…）。四探：`(1,11,6→6h ✓ hi=6)/(1,6,3→10h ✗ lo=4)/(4,6,5→8h ✓ hi=5)/(4,5,4→8h ✓ hi=4)` → lo==hi=**4**（暴力线性首个可行 = 4 对拍）。

## 复用（无 T0、零轨字段）

主柱轨的**语义反转**：柱子 = 候选答案 1..11（不再是被查数组）——概念跃迁直接画出来。pointers lo/mid/hi（速度 v 对应柱下标 v−1）；`groupMembers`=[lo..hi] 候选答案、`pivotIndex`=试探答案、settle `sortedIndices`=[答案下标]。`BaExecPoint = 'init'|'probe'|'settle'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`banswer.ts`：`BA_PILES=[3,6,7,11]`、`BA_H=8`；`hoursAt(k)` Σceil；`bruteMinSpeed()` 线性首个可行（独立真值）；`baTrace()` 返回 `{probes:[{lo,hi,mid,hours,ok}],result}`。
`banswer.module.ts`：init（答案空间登场 + 三要素）→ probe×4（caption 现场算 `⌈3/k⌉+⌈6/k⌉+⌈7/k⌉+⌈11/k⌉` 对比 8，可行「还能更小」收 hi / 不可行「只能加速」抬 lo）→ settle（lo==hi=4 绿 + 最小可行）→ done（三要素总结 + 应用家族 + 查找大类收官）。**7 步**。vars：piles、h、[lo,hi]、mid、本次耗时。
`banswer.sources.ts`：四语言 minEatingSpeed（lower_bound on predicate + canFinish 注释），lineMap init/probe/settle/done。

## T2：页面 + 接线

`BinaryAnswer.vue`（Algorithm 目录）；路由 `/docs/binary-answer`；菜单/首页「查找」第 4 项；新 svg（香蕉堆 + 速度标尺）；改 TC-HOOK；C-091/C-093 页尾「答案空间」改实链。

## 复用与零回归

主柱轨/ArrowTrack/StepEmphasis 零改动；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：柱子语义反转（=候选答案 1..11）、速度→柱下标映射 idx=v−1；oracle baTrace 与 bruteMinSpeed 对拍 + 单调谓词恰一次翻转 spec；module 7 步。
