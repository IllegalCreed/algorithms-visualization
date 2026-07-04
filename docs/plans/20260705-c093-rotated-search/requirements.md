# 需求：旋转数组搜索（C-20260705-093，查找第 3 页 · 纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-093
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

有序数组被「旋转」过（`[1..17] → [13,15,17,1,3,5,7,9,11]`，断崖在中间）——乍看没序了，二分还能用吗？能：**mid 把数组切成两半，至少有一半是完好有序的**。判断哪半有序（`a[lo] ≤ a[mid]` ⟹ 左半有序），再看目标在不在那个有序半的范围里——在就进去，不在就去另一半。每步依旧扔一半，O(log n) 保住。

## 目标

查找第 3 页「旋转数组搜索」，接入播放器，**纯复用主柱轨（同 C-091/092，零新 View、零轨字段）**：

1. **柱轨叙事**：旋转数组 `[13,15,17,1,3,5,7,9,11]` 自带断崖造型；`groupMembers`=闭区间候选、`pivotIndex`=mid、found 步 `sortedIndices`；caption 每探说明「哪半有序 → 目标在不在」。
2. 固定双试验（Python 已核验）：**t=5**：右半有序且在内 → lo=5；左半有序且在内 → hi=5；命中 **idx 5**（3 步）。**t=15**：右半有序但不在内 → 排除右半 hi=3；命中 **idx 1**（2 步）。**8 步** = init+probe×2+found + init+probe+found + done。
3. 正文：断崖与「至少一半有序」引理 → 判半三分支 → 与基础二分对比（多一层判断、复杂度不变）→ 重复元素退化 O(n) 的坑；预告二分答案。

## 验收标准

- `/docs/rotated-search` 新页：正文 + 播放器同屏，四语言随步高亮；断崖柱轨 + 判半叙事；done 给 O(log n)。
- 菜单 + 首页「查找」第 3 项，新图标；改 TC-HOOK（查找 children +rotated-search）。
- 全门禁 + 真机自检；主柱轨/ArrowTrack/emphasis 纯复用零改动。

## 非目标

- 不做含重复元素的旋转数组（正文点到退化）；不做找旋转点（最小值）独立动画。
- 不改 AlgorithmPlayer / BarsView / ArrowTrack / StepEmphasis（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。旋转数组搜索判半二分，纯复用主柱轨；双试验 8 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机断崖柱轨 + 判半 caption + 区间淡出；查找 2 页 e2e 回归过。
