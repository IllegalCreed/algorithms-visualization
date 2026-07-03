# 实现记录：Prim 最小生成树（C-20260703-049，M6 图算法 G7）

> Status: verified
> Stable ID: C-20260703-049
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 类型扩展**：types.ts +PrimExecPoint（唯一框架改动，纯追加）。GraphView/AlgorithmPlayer/Step 零改动。
2. **T1 module + oracle + sources**（L3）：先 prim.module.spec（TC-PRIM-MOD-01..12）跑红 → prim.{ts,sources.ts,module.ts}（复用 useKruskal 图、从 A 生长）跑绿。含「与 kruskalTrace MST 集互验」。
3. **T2 新页 + 接线**：Prim.vue（Article + AlgorithmPlayer）；路由 /docs/prim；菜单 + 首页 +Prim（新 prim.svg）；改 TC-HOOK-01-1/02-1（图算法 2→3）；Prim.spec（TC-VIEW-PRIM-\*）；prim.e2e（TC-E2E-PRIM-01）。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + TC-HOOK 文案、roadmap M6 G7）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 唯一框架改动**：types.ts +`PrimExecPoint`（init/selectEdge/addVertex/done 4 点），与 Dijkstra/Kruskal ExecPoint 并列。**GraphView.vue / AlgorithmPlayer.vue / Step / GraphTrack 零改动**——GraphView 第 3 消费者（有向 Dijkstra + 无向 Kruskal + 无向 Prim）。
- **T1 module 复用 useKruskal 同图 + 从 A 生长**：`prim.ts`（oracle 自算 Prim：扫最小横切边；与 kruskalTrace 同 MST 集互验）+ `prim.sources.ts`（4 语言朴素 Prim：inTree 布尔 + 扫边）+ `prim.module.ts`（复用 useKruskal 6 点 9 边无向图，从 A 生长 **12 步**）。MST={AC,BC,BD,DE,DF} 权 18、序 AC→BC→BD→DE→DF——**与 Kruskal 同集不同序**（Kruskal 序 AC→BC→DE→BD→DF）。
  - **edgeClass helper**：`treeEdges.forEach(id=>cls[id]='mst'); if(currentId) cls[currentId]='current'`（同 Kruskal 累积法）；selectEdge 步高亮当前横切边 current，addVertex 步不传 current（边已归 mst）。
  - **doneNodes**：init=[起点]，addVertex 时并入横切边树外端点，末步全 6 点。
- **T2 新页 + 接线**：Prim.vue（Article 正文含「Prim vs Kruskal 同图两策略」对照 + AlgorithmPlayer）；路由 `/docs/prim`；菜单图算法 +Prim；首页网格 +Prim（新 `prim.svg`：空心环起点 + 实线生长树 + 虚线候选边）；改 TC-HOOK-01-1/02-1（图算法 2→3、url +prim）。Prim.spec（TC-VIEW-PRIM-\*）+ prim.e2e（TC-E2E-PRIM-01）。

### 坑点

- 无坑。prim.module.spec 12 首跑即绿（lineMap 逐行核对，selectEdge/addVertex 语义清晰）。GraphView/AlgorithmPlayer/useKruskal 零改动，既有 Case 零回归。
- **GraphView 通用轨三验成立**：有向 Dijkstra（nodeBadge dist + relaxed/tree）、无向 Kruskal（current/mst/rejected）、无向 Prim（current/mst）——三消费者零改动佐证 C-047 通用设计。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：136 文件 **970 passed**（+15：prim.module 12 + Prim 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 93.63% / Branch 92.07% / Func 94.17% / Line 94.51%**。GraphView/AlgorithmPlayer/useKruskal 零改动。
- **e2e**：Playwright **41 passed**（+1 TC-E2E-PRIM-01）。
- **真机自检**（Playwright 脚本，`/docs/prim`）：
  - 首步——6 节点 9 边、**无箭头（无向 ✓）**、counter `1/12`、doneNodes=1（仅起点 A）、字幕「从起点 A 开始…」、无 `.bars-view`、Shiki **157 token**、权重 1–9 齐全。
  - 末步（scrub→max=11）——counter `12/12`、**5 `.graph-edge.mst`（绿实边 AC/BC/BD/DE/DF）**、**6 点全 `.done`（绿）**、字幕「选够 5 条边（V−1）：最小生成树完成，总权 18」。截图确认与 Kruskal 同图同 MST。
- **零回归**：既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + 播放器各轨 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 types +PrimExecPoint + T1 prim.module（12 步从 A 生长）+ T2 新页 Prim.vue + 路由/菜单/首页接线 + TC-HOOK（图算法 2→3）。**零框架改动复用 C-047 GraphView 无向轨（第 3 消费者）+ 复用 useKruskal 同图与 Kruskal 配对**。门禁全绿（单测 970 / e2e 41 / 覆盖率 93.63%）；真机首末步核对 MST 权 18、与 Kruskal 同集不同序无误。M6 图算法 G7 达成。
