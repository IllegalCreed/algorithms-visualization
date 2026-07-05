# 设计：树状数组 Fenwick/BIT（C-20260705-102，纯复用主柱轨）

> Status: verified
> Stable ID: C-20260705-102
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

`a=[3,2,5,1,4,2,3,1]` → `tree[1..8]=[3,5,5,11,4,6,3,21]`（tree[i] 管辖长 lowbit(i)）。**query(6)**：`6(110₂)→tree[6]=6→i-=2→4(100₂)→tree[4]=11→累计 17→i=0 停`（=暴力前缀 17）。**update(3,+2)**：`3→tree[3]=7→i+=1→4→tree[4]=13→i+=4→8→tree[8]=23→越界停`。**复查 query(6)**：`6→4` 得 **19**（=17+2）。

## 复用（无 T0、零轨字段）

主柱轨 8 柱 = tree（array 值随 update 真实变化、柱子长高）；pointers 蓝 '1' = 当前 i（柱下标 i−1）；`groupMembers` = 本操作已访问链（累积）、`pivotIndex` = 当前跳。`FenwickExecPoint = 'init'|'query'|'update'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`fenwick.ts`：`BIT_A`；`buildTree()`；`queryTrace(i)` → `{hops:[{i,val,acc}],sum}`；`updateTrace(i,d)` → `{hops:[{i,after}],tree}`；`lowbit`；暴力前缀和对拍（含更新后）。
`fenwick.module.ts`：init（tree 登场 + 管辖区间读法）→ query(6) 两跳（caption lowbit 二进制拆解 + 累计）→ update(3,+2) 三跳（柱子长高 + 通知语义）→ 复查两跳（19 验证）→ done（三方案对比 + 应用 + 链线段树）。**9 步**。vars：操作、i 二进制、lowbit、累计/树值。
`fenwick.sources.ts`：四语言 BIT（lowbit/query/update），lineMap init/query/update/done。

## T2：页面 + 接线

`Fenwick.vue`（**DataStructure 语境但文件放 Algorithm 目录，与近期新页一致**）；路由 `/docs/fenwick`；菜单/首页「数据结构」第 16 项（bloom-filter 后）；新 svg（柱阵 + lowbit 跳跃弧线）；改 TC-HOOK（两 spec `data[0] toHaveLength 15→16`）；线段树页双向链接（如有锚点则加）。

## 复用与零回归

主柱轨/ArrowTrack/StepEmphasis 零改动；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：8 柱 tree 快照（update 真实变化）、groupMembers 累积链、pivotIndex 当前跳；oracle query/updateTrace 与暴力前缀对拍；module 9 步。
