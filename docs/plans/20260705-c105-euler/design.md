# 设计：欧拉路径 Hierholzer（C-20260705-105，纯复用 GraphView · M9-3）

> Status: verified
> Stable ID: C-20260705-105
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

5 节点 7 边无向图，边输入序 `[(1,3),(3,4),(4,2),(2,3),(2,1),(1,0),(0,2)]`；度数 [2,3,4,3,2]、奇度 {1,3} → 从 1 出发。

Hierholzer 栈法轨迹（邻接表按边输入序）：walk 1-3、3-4、4-2、2-3 → **3 卡住**（3 条边全用）→ back 弹 3（path=[3]），**栈顶 2 还有余边** → walk 2-1、1-0、0-2 → 2/0/1 依次卡 → 连环 back 清栈（path=[3,2,0,1,2,4,3,1]）→ 反转 = **[1,3,4,2,1,0,2,3]**：7 边各一次、起 1 终 3 = 两奇度点，= 暴力回溯搜路对拍。

## 复用（无 T0）

GraphView 第 10 消费者零改动：`vertices` 五点固定布局（0 右上 / 1 左上 / 2 中心 / 3 左下 / 4 右下）；`edges` key 用 `min-max`；`edgeClass`：正在走 current、已走（消掉）mst；`stackNodes`=栈上节点（虚线环，重复节点合并显示）、`activeNode`=栈顶、`nodeBadge`=**剩余未用边数**（walk 两端各减 1，0 即卡住）；栈/路径精确序列放 vars（`栈: 1→3→4→2`）。`EulerExecPoint = 'init'|'check'|'walk'|'back'|'done'`（仅 types 加执行点）。

## T1：oracle + module + sources

`euler.ts`：`EULER_N/EULER_EDGES`；`eulerTrace()` → `{deg, odd, start, events:[{type:'walk',from,to,eid,stack}|{type:'back',node,stack,path}], path}`（栈法重放）；`bruteEulerPath()` 回溯搜一条合法一笔画（独立真值）；`isValidEulerPath(p)` 验证器（相邻成边 + 7 边各一次）。
`euler.module.ts`：init（七桥一笔画问题）→ check（nodeBadge=度数、奇度 {1,3} 高亮、定理 + 起点）→ walk×4（消边渐绿、徽标递减、栈 vars）→ back（弹 3 进路径 + 「栈顶 2 还有余边」）→ walk×3（子环 2-1-0-2 插入）→ back（连环弹清栈 + 反转）→ done（定理复盘 + O(E) + 应用）。**12 步**。
`euler.sources.ts`：四语言（度数判定 + 栈法主循环），lineMap init/check/walk/back/done。

## T2：页面 + 接线

`EulerPath.vue`（Algorithm 目录，正文含七桥与定理直觉）；路由 `/docs/euler-path`；菜单/首页「图算法」第 12 项（lca 后）；新 svg（一笔画信封）；改 TC-HOOK（图算法 11→12 两 spec）。

## 复用与零回归

GraphView 零改动（9 既有消费者零回归——Dijkstra/Kruskal/Prim/Bellman/Topo/SCC/2-SAT/MaxFlow/AC/Hungarian 不设新字段组合）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致。
