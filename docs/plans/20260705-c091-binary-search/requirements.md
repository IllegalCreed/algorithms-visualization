# 需求：二分查找（C-20260705-091，新大类「查找」首发 · 纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-091
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

八大类之后开第 9 大类「**查找**」：在有序/结构化数据里高效定位目标。首发**二分查找**——每次和中点比、扔掉一半，O(log n)；它也是后续变体（边界 lower/upper bound、旋转数组、二分答案）的地基。

可视化上这是**回归初心**的一页：算法播放器的**主柱轨 + 箭头轨**（全站第一条轨）当主角，lo/mid/hi 三支箭头驱动，`emphasis.groupMembers` 淡出候选区间外的柱子——「扔掉一半」直接看得见。

## 目标

新页「二分查找」，接入播放器，**纯复用主柱轨 + ArrowTrack + 既有 emphasis 字段（零新 View、零 types 轨字段）**：

1. **柱轨叙事**：有序数组 `[1,3,5,7,9,11,13,15,17,19]`；指针 lo（红 '0'）/mid（蓝 '1'）/hi（黄 '2'）；`groupMembers` = 当前候选区间（区间外淡出）；mid 探针 `pivotIndex` 高亮；命中 `sortedIndices` 变绿。
2. 固定双试验（Python 已核验）：**target=17** 三探命中（mid=4→7→8，下标 8）；**target=4** 四探未命中（mid=4→1→2，区间 [2,1] 清空 → −1）。**16 步** = init + (mid+cut)×2 + mid + found ＋ init + (mid+cut)×3 + empty ＋ done。
3. 正文：前提有序 → 每步扔一半 O(log n)（10 亿 30 次）→ 循环不变量与闭区间写法 → `(lo+hi)` 溢出小坑 → 变体预告（边界/旋转数组/二分答案，本大类后续页）。

## 验收标准

- `/docs/binary-search` 新页：正文 + 播放器同屏，四语言随步高亮；柱轨区间淡出 + 三箭头 + 命中变绿；done 给 O(log n) 语义。
- 菜单 + 首页**新增第 9 大类「查找」**（首项 binary-search），新图标；改 TC-HOOK（两处 `toHaveLength(8→9)` + data[8] 断言）。
- 全门禁 + 真机自检；主柱轨/ArrowTrack/emphasis 纯复用零改动（16 个排序页零回归）。

## 非目标

- 不做边界变体/旋转数组/二分答案（本大类后续页）；不做交互式自定义目标值。
- 不改 AlgorithmPlayer / List / Block / ArrowTrack / StepEmphasis（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。二分查找开辟查找大类，纯复用主柱轨；双试验 16 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（大类 8→9）；真机 cut 步 8 柱淡出「扔掉一半」、found 步命中柱深绿；排序 2 页 e2e 回归全过。
