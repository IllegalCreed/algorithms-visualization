# 需求：二分边界 lower/upper bound（C-20260705-092，查找第 2 页 · 纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-092
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

C-091 基础二分只答「在不在」；重复元素时更常问的是**边界**：第一个 ≥ t 在哪（lower bound）、第一个 > t 在哪（upper bound）——两者夹出等值区间 `[lb, ub)`，个数 = ub − lb。这也是「二分找边界」模板（`while lo < hi` 半开区间、答案落在 lo==hi 相遇点）的正名之战：它不再需要 found/-1 三分支，收敛后 lo 即答案。

## 目标

查找第 2 页「二分边界」，接入播放器，**纯复用主柱轨 + ArrowTrack + 既有 emphasis（同 C-091，零新 View、零轨字段）**：

1. **柱轨叙事**：含重复数组 `[1,2,2,2,3,5,5,7,8,9]`、target=2；`groupMembers`=半开候选区间 `[lo,hi)`；`pivotIndex`=mid 探针；settle 步 `sortedIndices`=[相遇点]；range 步三个 2 全绿。hi=n（哨兵位 10）时黄箭头不显示、vars 表明。
2. 固定双阶段（Python 已核验）：**lower_bound** 四探 `(0,10,5)/(0,5,2)/(0,2,1)/(0,1,0)` → **1**；**upper_bound** 四探 `(0,10,5)/(0,5,2)/(3,5,4)/(3,4,3)` → **4**；等值区间 `[1,4)`、count=3。**14 步** = (init + probe×4 + settle)×2 + range + done。
3. 正文：闭区间三分支 vs 半开两分支模板对比 → 不变量（lo 左边全 <t / hi 起全 ≥t）→ 等值区间与计数 → 「不存在」时 lb==ub 的优雅退化；预告旋转数组/二分答案。

## 验收标准

- `/docs/binary-bounds` 新页：正文 + 播放器同屏，四语言随步高亮；两阶段探针收敛 + 等值区间全绿；done 给 count=3。
- 菜单 + 首页「查找」第 2 项，新图标；改 TC-HOOK（查找 children +binary-bounds）。
- 全门禁 + 真机自检；主柱轨/ArrowTrack/emphasis 纯复用零改动。

## 非目标

- 不做旋转数组/二分答案（后续页）；不做 STL equal_range 接口讲解（正文点到）。
- 不改 AlgorithmPlayer / BarsView / ArrowTrack / StepEmphasis（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。二分边界半开区间模板，纯复用主柱轨；lb=1/ub=4/count=3，14 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机 range 步三个 2 全绿 + 相遇点定格；C-091 页 e2e 回归过。
