# 设计：2-SAT（C-20260704-074，蕴含图 + Tarjan SCC · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-074
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用 C-069 的 GraphView（图轨），**不新建轨**。2-SAT 把子句归约成蕴含图（`2n` 文字节点 + 蕴含边），跑 Tarjan 求 SCC，按 `x/¬x` 是否同组判定、按 comp 逆拓扑序赋值。产出 `Step<TwoSatExecPoint>`（复用 `Step.graph`）。

## 固定实例（Python 已核验）

- 变量 `A,B,C`（n=3）→ 文字节点：`A`=0, `¬A`=1, `B`=2, `¬B`=3, `C`=4, `¬C`=5。
- 子句：`(A∨B) ∧ (A∨¬B) ∧ (A∨C) ∧ (¬A∨¬B)`。
- 蕴含边（`(a∨b)` ⟹ `¬a→b`, `¬b→a`）共 8 条：
  `¬A→B(1→2)`, `¬B→A(3→0)`, `¬A→¬B(1→3)`, `B→A(2→0)`, `¬A→C(1→4)`, `¬C→A(5→0)`, `A→¬B(0→3)`, `B→¬A(2→1)`。
- Tarjan：`dfn=[0,2,3,1,4,5]`、`low=[0,2,2,0,4,5]`、`comp=[0,2,2,0,1,3]`；SCC 发现序 `[{¬B,A},{C},{B,¬A},{¬C}]`。
- 判定：每对 `x/¬x` 都不同组 → **可满足**。赋值 `x 真 ⟺ comp[x]<comp[¬x]`：A(0<2)=真、B(2<0 否)=假、C(1<3)=真 → **A=真 / B=假 / C=真**（四子句全满足）。

## T0：类型 + GraphView（checkPair）

`types.ts`：

```ts
export type TwoSatExecPoint =
  | 'init' // 列出子句 + 2n 文字节点，蕴含图空
  | 'clause' // 处理一条子句 (a∨b)：加两条蕴含边 ¬a→b, ¬b→a（高亮）
  | 'scc' // Tarjan 弹出一个 SCC（复用第 7 页），着色 nodeGroup
  | 'check' // 检查变量 x：x 与 ¬x 是否同 SCC（同→无解；本例都不同）
  | 'assign' // 赋值 x = comp[x] < comp[¬x]，node badge 显示真/假
  | 'done'; // 全部赋值完成，输出可满足解
```

`GraphTrack` 补 1 个可选字段（其它图算法不设 → 行为不变）：

```ts
checkPair?: [number, number] | null; // 判定阶段高亮的一对文字节点 x/¬x（蓝环）
```

`GraphView.vue`：节点若 `id ∈ checkPair` → 加 `.checking` 类（蓝色实线环，区别于 active 琥珀实线 / on-stack 琥珀虚线）。additive，不设 `checkPair` 时无影响。

## T1：oracle + module + sources

`twosat.ts`（自包含固定实例）：

```ts
export const TS_VARS = ['A', 'B', 'C'];
export const TS_CLAUSES: [Lit, Lit][];   // Lit = { v: number; pos: boolean }
export const TS_VERTS = [...];            // 6 文字节点固定坐标（3 列 × 2 行）
export function twoSatImplications(): [number, number][]; // 8 条蕴含边
export function twoSatTarjan(): { dfn; low; comp; sccs };  // 复用第 7 页 Tarjan 逻辑
export function twoSatSolve(): { sat: boolean; assign: boolean[] }; // A=T,B=F,C=T
```

`twosat.module.ts`：`buildTwoSatSteps(): Step<TwoSatExecPoint>[]`

- `init`：6 文字节点（3 列 A/B/C × 2 行 正/负），无边；vars 列子句。
- `clause`×4：逐条子句加两条蕴含边，`edgeClass` 高亮新增边，caption 说明 `(a∨b) ⟹ ¬a→b, ¬b→a`。
- `scc`×4：复用 Tarjan（compress，仅弹栈成组），逐个 SCC 上色 `nodeGroup`、`stackNodes` 显示当前栈；caption 点明「{A,¬B} 同组＝A 与 ¬B 被相互蕴含逼到相等」。
- `check`×3：逐变量 `checkPair=[x,¬x]`，caption 确认二者 comp 不同 → 可满足。
- `assign`×3：逐变量 `nodeBadge` 在正文字上标「真/假」，caption 给 `comp[x]<comp[¬x]` 的判据。
- `done`：badge 齐，caption 给可满足解 `A=真, B=假, C=真`，并注「四子句全满足」。

约 **16 步**。`vars`：子句列表、当前操作、已定 SCC 数、赋值进度。

`twosat.sources.ts`：TS/Python/Go/Rust 四语言 2-SAT（建蕴含图 + Tarjan + 判定 + 赋值），`lineMap` 覆盖 init/clause/scc/check/assign/done。

## T2：页面 + 接线

`TwoSat.vue`：`Article` 正文（标题「2-SAT（布尔可满足性）」+ 副标「图算法 · 有向图连通性 · Tarjan 应用 O(V+E)」）：讲清 2-SAT 定义、子句→蕴含（`¬a→b`/`¬b→a`）、SCC 判定（`x`/`¬x` 同组即无解）、逆拓扑序赋值；`<AlgorithmPlayer :module="twoSatModule" />`；结语与 C-069 强连通分量互链（SCC → 2-SAT）。

接线：路由 `/docs/two-sat`；菜单 + 首页「图算法」children **第 8 项**（紧接 strongly-connected-components）；新 `two-sat.svg`；改 `TC-HOOK`（图算法 children +two-sat）。

## 复用与零回归

- GraphView `checkPair` additive，其它 7 图算法（Dijkstra/Kruskal/Prim/Bellman-Ford/拓扑/Floyd/SCC）不设 → 渲染不变，`TC-VIZ-GRAPHVIEW-*` 全绿。
- 无新轨、无新 Step 字段（复用 `Step.graph`）；AlgorithmPlayer 零改动。
- Tarjan 逻辑与 C-069 一致（同一套 dfn/low/comp/栈），仅作用在蕴含图上。

## 变更历史

- 2026-07-04：创建（draft → approved）。2-SAT 蕴含图 + Tarjan SCC 判定，复用 GraphView（additive checkPair）；固定 A,B,C / 4 子句 / 4 SCC / 可满足解 A=真,B=假,C=真，承接 C-069。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：GraphView checkPair additive（其它图算法不设即不变）；twosat oracle 建蕴含图（8 边）+ Tarjan（comp=[0,2,2,0,1,3]）+ 判定/赋值，module init+clause×4+scc×4+check×3+assign×3+done 16 步与 oracle 对拍；4 语言 sources lineMap 对齐 init/clause/scc/check/assign/done；复用 Step.graph、AlgorithmPlayer 零改动。
