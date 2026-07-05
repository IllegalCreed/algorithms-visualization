# 需求：树状数组 Fenwick/BIT（C-20260705-102，数据结构第 16 页 · 纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-102
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

数据结构大类补最后一块常青拼图：**树状数组（Fenwick / Binary Indexed Tree）**——前缀和数组改一次 O(n)、普通数组查一次 O(n)，BIT 两头都 **O(log n)**。魔法只有一行：`lowbit(i) = i & -i`。`tree[i]` 管辖「以 i 结尾、长 lowbit(i)」的区段和：**query 沿 `i -= lowbit(i)` 往前跳**拼出前缀和；**update 沿 `i += lowbit(i)` 往后跳**通知所有管到它的区段。

## 目标

数据结构第 16 页「树状数组」，接入播放器，**纯复用主柱轨（零新 View、零轨字段）**：

1. **柱轨叙事**：8 根柱 = `tree[1..8]`（update 时柱子**真实长高**——数组轨值变化天然动画）；蓝指针 = 当前跳的 i；`groupMembers` = 本次操作已访问的 lowbit 链（累积高亮）；`pivotIndex` = 当前跳。
2. 固定 `a=[3,2,5,1,4,2,3,1]`（Python 已核验）：`tree=[3,5,5,11,4,6,3,21]`；**query(6)** 跳 `6→4` 得 **17**（=暴力前缀）；**update(3,+2)** 跳 `3→4→8`（tree 变 7/13/23，柱子长高）；**再 query(6)** 跳 `6→4` 得 **19** 验证生效。**9 步** = init + query×2 + update×3 + 复查×2 + done。
3. 正文：三种方案对比表（数组/前缀和/BIT）→ lowbit 与管辖区间直觉 → 两操作跳法 → 应用（逆序对、动态排名、滑动统计）；链接线段树（BIT 是它的轻量特化）。

## 验收标准

- `/docs/fenwick` 新页：正文 + 播放器同屏，四语言随步高亮；lowbit 链跳跃 + 柱子长高；done 给 O(log n) 对比。
- 菜单 + 首页「数据结构」第 16 项，新图标；改 TC-HOOK（数据结构 15→16，两 spec `toHaveLength`）。
- 全门禁 + 真机自检；主柱轨/ArrowTrack/emphasis 纯复用零改动。

## 非目标

- 不做区间更新（差分 BIT）/二维 BIT（正文点到）；不做建树过程动画（init 直接给建好的 tree）。
- 不改 AlgorithmPlayer / BarsView / ArrowTrack / StepEmphasis（纯复用，无 T0）。

## 变更历史

- 2026-07-05：创建（draft → approved）。树状数组 lowbit 链，纯复用主柱轨；query 17 → update → 19，9 步。
- 2026-07-05：交付验收（approved → verified）。16 Case 全绿 + 改 2 HOOK（数据结构 15→16）；真机管辖者通知 + 柱子长高 + 复查 19 验证；主柱轨零回归（e2e 3/3）。
