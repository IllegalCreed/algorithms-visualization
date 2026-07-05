# 设计：树形 DP 打家劫舍 III（C-20260705-100，纯复用 MatrixView）

> Status: verified
> Stable ID: C-20260705-100
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

层序 `[4,1,5,3,6]`（idx0 根、孩子 2i+1/2i+2）：树形

```
      4(0)
     /    \
   1(1)   5(2)
   /  \
 3(3) 6(4)
```

后序 `3→4→1→2→0`。叶子：(选3,不选0)/(6,0)/(5,0)；节点 1：选=1+0+0=1、不选=max(3,0)+max(6,0)=9；根 0：选=4+9+0=13、不选=max(1,9)+max(5,0)=14。**答案 max(13,14)=14 = 暴力枚举全部不相邻子集**。

## 复用（无 T0）

MatrixView 第 13 消费者零改动：5 行（行序 = 节点 idx）× 2 列 `['选','不选']`；`rowLabels=['根 4','L 1','R 5','LL 3','LR 6']`；填表后序跳行（updatedCell 行序 3,4,1,1,2,0,0）；sel 步 `sources`=孩子「不选」格、not 步 `sources`=孩子四格。`TreeDpExecPoint = 'init'|'leaf'|'sel'|'not'|'best'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`treedp.ts`：`TD_VALS=[4,1,5,3,6]`；`treeDpFills()` 返回 `{order, fills:[{i,val,kids,sel,notv}]}`（后序）；`bruteRob()` 枚举全部不相邻子集（独立真值）。
`treedp.module.ts`：init（树 ASCII caption + 表空 + 后序预告）→ 叶子一步双格（leaf）→ 内部节点 sel（公式 + 孩子不选格黄）/ not（max 枚举 + 四格黄）→ best（根行取 max=14，sources 根两格）→ done（三要素 + 舞会/树上背包点到）。**10 步**。vars：当前节点、树位置、(选,不选)。
`treedp.sources.ts`：四语言后序递归 rob（dfs 返回 [sel, not] 两态），lineMap init/leaf/sel/not/best/done。

## T2：页面 + 接线

`TreeDp.vue`（Algorithm 目录，正文含树 ASCII 图）；路由 `/docs/tree-dp`；菜单/首页「动态规划」第 9 项（tsp 后）；新 svg（树 + 节点选/不选双色）；改 TC-HOOK（DP 8→9 两 spec）。

## 复用与零回归

MatrixView 零改动（12 既有消费者零回归）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：后序跳行填表、sel/not 双步双 sources；oracle treeDpFills 与 bruteRob 不相邻子集枚举对拍；module 10 步。
