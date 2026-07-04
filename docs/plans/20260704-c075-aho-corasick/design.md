# 设计：AC 自动机 Aho-Corasick（C-20260704-075，Trie + fail · 复用 GraphView）

> Status: verified
> Stable ID: C-20260704-075
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

AC 自动机本质是一张图（Trie 状态节点 + trie 边 + fail 边），**复用 GraphView，不新建轨**。产出 `Step<AcExecPoint>`（复用 `Step.graph`）。构造分「建 Trie」+「BFS 建 fail」，之后在文本上匹配。

## 固定实例（Python 已核验）

- 模式 `{he, she, hers}`、文本 `"ushers"`。
- 8 状态：`0=ε(root)`、`1=h`、`2=he`✓、`3=s`、`4=sh`、`5=she`✓、`6=her`、`7=hers`✓（✓=模式终点）。
- trie 边（7 条）：`root→h`、`root→s`、`h→e(=he)`、`he→r(=her)`、`her→s(=hers)`、`s→h(=sh)`、`sh→e(=she)`。
- fail：`fail=[0,0,0,0,1,2,0,3]`——非平凡（非 →root）仅 3 条：**`sh→h`、`she→he`、`hers→s`**。
- 输出链（合并 fail 链）：`he→{he}`、`she→{she,he}`、`hers→{hers}`。
- 匹配 `"ushers"`：`u`→root；`s`→s；`h`→sh；`e`→**she（命中 she[1,3] + 沿输出链 he[2,3]）**；`r`→**she 无 r 转移，沿 fail 跳到 he，he→r=her**；`s`→**hers（命中 hers[2,5]）**。三处重叠命中。

## T0：类型 + GraphView（.fail 边样式）

`types.ts`：

```ts
export type AcExecPoint =
  | 'insert' // 建 Trie：插入一个模式（节点 + trie 边浮现）
  | 'fail' // BFS 建 fail：算一个状态的 fail 指针
  | 'match' // 匹配：文本走一个字符（含 fail 跳）
  | 'hit' // 匹配：到达模式终点，报告命中（含输出链重叠）
  | 'done'; // 匹配结束，汇总所有命中
```

`GraphView.vue`：**仅加一条 CSS** `.graph-edge.fail { stroke: 紫; stroke-dasharray: 6 4; }`（fail 边虚线紫）。`edgeClass` 已是 `Record<string,string>` 通用字典，trie 边不设类（默认灰实线）/ 当前边用现成 `current`（琥珀）/ fail 边用新 `fail`。**GraphTrack 零改动、AlgorithmPlayer 零改动**。

## T1：oracle + module + sources

`ahocorasick.ts`（自包含固定实例）：

```ts
export const AC_PATTERNS = ['he', 'she', 'hers'];
export const AC_TEXT = 'ushers';
export interface AcState { id; char; parent; depth; goto; out; fail; label } // label=路径串
export function buildAc(): { states: AcState[]; bfsOrder: number[] }; // Trie + BFS fail
export function acMatch(): { pat: string; start: number; end: number }[]; // 3 处命中
export const AC_VERTS = [...]; // 8 状态固定坐标（h 链左 / s 链右）
```

`ahocorasick.module.ts`：`buildAcSteps(): Step<AcExecPoint>[]`

- `insert`×3：逐模式插入，累加 trie 节点 + trie 边（edgeClass 高亮新增），终态 `nodeBadge` 标模式名。
- `fail`×7：按 BFS 序（`[1,3,2,4,6,5,7]`）逐状态算 fail；→root 的只字幕说明（不加边），非平凡的加 `fail` 类虚线边 + activeNode 高亮 + caption 解释「沿父 fail 找边字符转移」。
- `match`×6：文本 `ushers` 逐字符；activeNode = 当前状态，遇无转移沿 fail 跳（fail 边点亮 current）；命中步用 `hit` 点，报告模式 + 位置（输出链重叠时高亮 fail 边到 he）。
- `done`：汇总命中 `she[1,3]、he[2,3]、hers[2,5]`。

约 **17 步**。`vars`：模式集、文本 + 当前位、当前状态、已命中数。

`ahocorasick.sources.ts`：TS/Python/Go/Rust 四语言 AC（建 Trie + BFS fail + 匹配），`lineMap` 覆盖 insert/fail/match/hit/done。

## T2：页面 + 接线

`AhoCorasick.vue`：`Article` 正文（标题「AC 自动机（Aho-Corasick）」+ 副标「字符串 · 多模式匹配 · Trie + fail · O(n+m+z)」）：讲清多模式匹配、Trie、fail 指针 = π 的多模式版、BFS 构造、匹配不回退 + 输出链；`<AlgorithmPlayer :module="ahoCorasickModule" />`；结语与 KMP 互链（单串 π → Trie fail）。

接线：路由 `/docs/aho-corasick`；菜单 + 首页「字符串」children **第 7 项**（紧接 lcp-array）；新 `aho-corasick.svg`；改 `TC-HOOK`（字符串 children +aho-corasick）；KMP 页尾加双向 router-link。

## 复用与零回归

- GraphView 仅加 `.fail` CSS 边样式（`edgeClass` 通用字典），8 个图算法不设 `fail` 类 → 渲染不变，`TC-VIZ-GRAPHVIEW-*` 全绿。
- 无新轨、无新 Step 字段、GraphTrack 零改动（复用 `Step.graph` + `edgeClass`/`nodeBadge`/`activeNode`）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。AC 自动机 Trie + fail，复用 GraphView（additive .fail 边样式）；固定 {he,she,hers}+"ushers"，8 状态 / 3 非平凡 fail 边 / 三处重叠命中，承接 KMP。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：GraphView 仅加 .fail 虚线紫 CSS（edgeClass 通用字典，GraphTrack 零改动）；ahocorasick oracle 构 Trie + BFS fail（fail=[0,0,0,0,1,2,0,3]）+ 匹配，module insert×3+fail×7+match/hit×6+done 17 步与 oracle acMatch() 对拍；4 语言 sources lineMap 对齐 insert/fail/match/hit/done；复用 Step.graph、AlgorithmPlayer 零改动。
