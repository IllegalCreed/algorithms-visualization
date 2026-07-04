# 设计：旋转数组搜索（C-20260705-093，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-093
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`[13,15,17,1,3,5,7,9,11]`（断崖在 idx 2/3 之间）。**t=5**：`(0,8,4)` a[4]=3、右半 (3,11] 有序且 5 在内 → lo=5；`(5,8,6)` a[6]=7、左半 [5,7) 有序且 5 在内 → hi=5；`(5,5,5)` **HIT idx 5**。**t=15**：`(0,8,4)` 右半有序但 15 ∉ (3,11] → 排除右半 hi=3；`(0,3,1)` a[1]=15 **HIT idx 1**。线性扫对拍 5→5、15→1。

## 复用（无 T0、零轨字段）

同 C-091/092：闭区间 groupMembers、pivotIndex=mid、found 步 sortedIndices=[idx]；断崖造型由数据天然呈现。`RsExecPoint = 'init'|'probe'|'found'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`rotsearch.ts`：`ROT_ARRAY`、`RS_T1=5`、`RS_T2=15`；`linearIndex`（独立真值）；`rotTrace(t)` 返回 `{probes:[{lo,hi,mid,val,sortedHalf:'left'|'right',inSorted}],hit:{lo,hi,mid},index}`。
`rotsearch.module.ts`：两试验 init（断崖介绍/换目标）→ probe（判半 + 去留 caption，groupMembers 收缩）→ found（绿 + 命中）→ done（引理总结 + 重复退化坑 + O(log n)）。**8 步**。vars：target、[lo,hi]、mid、有序半。
`rotsearch.sources.ts`：四语言判半三分支，lineMap init/probe/found/done。

## T2：页面 + 接线

`RotatedSearch.vue`（Algorithm 目录）；路由 `/docs/rotated-search`；菜单/首页「查找」第 3 项；新 svg（断崖柱阵 + 放大镜）；改 TC-HOOK；C-091 页尾「旋转有序数组」改实链。

## 复用与零回归

主柱轨/ArrowTrack/StepEmphasis 零改动；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：判半三分支闭区间；oracle rotTrace（sortedHalf/inSorted 全记录）与 linearIndex 对拍；module 8 步。
