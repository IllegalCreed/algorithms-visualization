# 需求：二分答案（C-20260705-094，查找第 4 页 · 纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-094
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

二分的终极形态：**数组没了也能二分**。求「最小可行速度」类问题（珂珂吃香蕉：4 堆香蕉 [3,6,7,11]、8 小时内吃完的最小时速）——把**候选答案排成一排**（速度 1..11），可行性关于答案**单调**（速度越快越可行：✗✗✗✓✓…✓），问题就变成 C-092 的「第一个满足单调谓词的位置」，直接套 lower_bound 模板。

## 目标

查找第 4 页「二分答案」，接入播放器，**纯复用主柱轨（同 C-091/092/093，零新 View、零轨字段）**：

1. **答案空间柱轨**（概念跃迁的可视化）：11 根柱 = 候选速度 1..11 爬坡排布；`groupMembers`=候选答案区间、`pivotIndex`=试探的答案、settle 步 `sortedIndices`=[答案]。probe caption 现场算可行性：`Σ ceil(pile/k)` 对比 h=8。
2. 固定实例（Python 已核验）：piles=[3,6,7,11]、h=8；四探 `k=6（6h ✓→hi=6）/k=3（10h ✗→lo=4）/k=5（8h ✓→hi=5）/k=4（8h ✓→hi=4）` → **答案 4**（线性扫对拍）。**7 步** = init + probe×4 + settle + done。
3. 正文：从「找值」到「找答案」三要素（答案空间有界 / 谓词单调 / 可行性可验）→ 实例 → 应用清单（分割数组最大值最小化、运载能力、木材切割、最小化最大值家族）→ 查找大类四页收官地图。

## 验收标准

- `/docs/binary-answer` 新页：正文 + 播放器同屏，四语言随步高亮；答案空间柱 + 可行性叙事；settle 答案 4 变绿。
- 菜单 + 首页「查找」第 4 项，新图标；改 TC-HOOK（查找 children +binary-answer）。
- 全门禁 + 真机自检；主柱轨/ArrowTrack/emphasis 纯复用零改动。

## 非目标

- 不做浮点二分/三分（可续作）；不做多实例切换。
- 不改 AlgorithmPlayer / BarsView / ArrowTrack / StepEmphasis（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。二分答案答案空间柱轨，纯复用主柱轨；珂珂吃香蕉 → 4，7 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机 probe 现场算账 caption + 候选淡出 + settle 答案 4 变绿；查找前 3 页 e2e 回归过。
