# 需求：三分查找（C-20260705-095，查找第 5 页 · 纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-095
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

查找大类深入加餐：**单峰数组**（先升后降的「山」）找峰顶——二分失灵（只看 a[mid] 不知道自己在上坡还是下坡），**三分查找**用**两个探针**制造方向感：取三分点 m1、m2，比较 `a[m1]` 与 `a[m2]`——谁小，峰就不在谁的外侧，**丢掉那 1/3**。每轮区间变 2/3，O(log n)（底 3/2）。

## 目标

查找第 5 页「三分查找」，接入播放器，**纯复用主柱轨（同 C-091~094，零新 View、零轨字段）**：

1. **山形柱轨**：单峰数组 `[1,4,7,9,12,10,6,3,2]` 天然山形；**四指针** lo（红 '0'）/m1（蓝 '1'）/m2（黄 '2'）/hi（绿 '3'）；`comparing=[m1,m2]` 双探针对决高亮；`groupMembers` 候选区间；peak 步 `sortedIndices`=[峰顶]。
2. 固定实例（Python 已核验）：四探 `(0,8,m1=2,m2=6：7>6 丢右)/(0,5,1,4：4<12 丢左)/(2,5,3,4：9<12 丢左)/(4,5,4,5：12>10 丢右)` → **峰顶 idx 4（12）**（argmax 对拍）。**7 步** = init + probe×4 + peak + done。
3. 正文：单峰与二分的失灵 → 双探针方向感与「丢 1/3」定理 → 复杂度 log₍₃⁄₂₎ n → 坡度二分变体（比 a[mid] 与 a[mid+1]）→ 实数三分与凸函数极值；查找大类五页全景收官。

## 验收标准

- `/docs/ternary-search` 新页：正文 + 播放器同屏，四语言随步高亮；双探针对决 + 峰顶变绿；done 给复杂度与变体。
- 菜单 + 首页「查找」第 5 项，新图标；改 TC-HOOK（查找 children +ternary-search）。
- 全门禁 + 真机自检；主柱轨/ArrowTrack/emphasis 纯复用零改动。

## 非目标

- 不做实数域三分/黄金分割搜索（正文点到）；不做严格性证明动画。
- 不改 AlgorithmPlayer / BarsView / ArrowTrack / StepEmphasis（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。三分查找单峰山形，纯复用主柱轨；四探 → 峰 12，7 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK；真机四指针 + 双柱对决高亮（comparing=2）+ caption 丢 1/3 叙事；查找前 4 页 e2e 回归过。
