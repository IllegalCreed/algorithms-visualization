# 设计：埃拉托斯特尼筛（C-20260704-077，新建 SieveView 数字网格轨）

> Status: verified
> Stable ID: C-20260704-077
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 16 条 **SieveView 数字网格轨**（数论大类可视化基础），产出 `Step<SieveExecPoint>`（新 `Step.sieve?` 字段）。埃氏筛逐素数重走，每格按状态着色。

## 复用判断

- MatrixView：语义是 DP 填表（active/sources/pathCells/updatedCell 数值），与筛法「每格一个数 + 素/合/当前/划中」状态模型不匹配。
- MazeView：语义是网格搜索（wall/visited/path/start/goal），套筛法状态别扭。
- → 按「复用不了再新建」，新建干净的 SieveView（数字网格 + 筛法专用状态），与 BoardView 一样用 CSS-grid。

## T0：类型 + SieveView

`types.ts`：

```ts
export type SieveCellState = 'special' | 'unknown' | 'prime' | 'composite'; // special=1
export interface SieveTrack {
  n: number; // 上界 N（网格 1..n）
  cols: number; // 列数（布局）
  states: SieveCellState[]; // states[v] = 数 v 的状态（index 1..n；0 占位）
  current?: number | null; // 当前处理的素数 p（琥珀环）
  marking?: number[]; // 本步正在划掉的倍数（红）
}
export type SieveExecPoint = 'init' | 'prime' | 'mark' | 'rest' | 'done';
```

`Step` 加 `sieve?: SieveTrack`。`AlgorithmPlayer` 加一行 `<SieveView v-if="current.sieve" :sieve="current.sieve" />`。

`SieveView.vue`：CSS-grid（`grid-template-columns: repeat(cols, 46px)`），每格显数字 `v`、按 `states[v]` 着色：`special` 淡灰、`unknown` 中性、`prime` 绿、`composite` 灰划掉（strike + dim）；`current===v` 琥珀环、`marking.includes(v)` 红。1..n 逐格铺。

## T1：oracle + module + sources

`sieve.ts`（固定 N=30）：

```ts
export const SIEVE_N = 30;
export const SIEVE_COLS = 6;
export function sievePrimes(): number[]; // [2,3,5,7,11,13,17,19,23,29]
export function isPrimeTrial(x: number): boolean; // 试除法对拍
```

`sieve.module.ts`：`buildSieveSteps(): Step<SieveExecPoint>[]`

- `init`：states 全 unknown，1=special；caption 说明规则。
- 对每个 `p`（从 2，`p²≤N`）若 `states[p]===unknown`：`prime`（states[p]=prime、current=p）+ `mark`（划掉 `p²,p²+p,…≤N` 中仍 unknown 的 → composite，marking=这些倍数）。
- `rest`：`p²>N` → 剩余 unknown 全设 prime，caption 说明「筛到 √N 即停」。
- `done`：素数清单 = `sievePrimes()`，caption 给数量 + 列表。

约 **9 步**。`vars`：N、当前 p、已确认素数数、复杂度。

`sieve.sources.ts`：TS/Python/Go/Rust 四语言埃氏筛（布尔数组 + 从 p² 起标记），`lineMap` 覆盖 init/prime/mark/rest/done。

## T2：页面 + 新大类接线

`SieveOfEratosthenes.vue`：`Article` 正文（标题「埃拉托斯特尼筛」+ 副标「数学与数论 · 素数筛 · O(N log log N)」）：讲清筛法过程、从 p² 起、筛到 √N 即停、复杂度；`<AlgorithmPlayer :module="sieveModule" />`。

**新大类接线**：

- 菜单 `useMenuCategory`：新增第 7 项 `{ title: '数学与数论', children: [{ title: '埃氏筛', url: 'sieve-of-eratosthenes' }] }`。
- 首页 `useHomeCategory`：新增第 7 项（新 `sieve.svg` 图标 + 描述）。
- 路由 `/docs/sieve-of-eratosthenes`。
- 改 `TC-HOOK`：分类数 6→7、新增 `data[6].title==='数学与数论'` 断言、分类计数。

## 复用与零回归

- 新 `Step.sieve?` additive，6 大类既有算法不设 → SieveView 不渲染，全绿。
- AlgorithmPlayer 仅加一行 `v-if`（其它轨 v-if 不受影响）。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建第 16 条 SieveView 数字网格轨 + 埃氏筛，开辟数学与数论大类；固定 N=30，10 个素数。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：新 SieveView（CSS-grid 数字网格 + special/unknown/prime/composite 状态 + current/marking 高亮）；sieve oracle sievePrimes() 与试除法对拍、module init+prime×3+mark×3+rest+done 9 步（从 p² 起标、p²>N rest 一次性确认）；4 语言 sources lineMap 对齐 init/prime/mark/rest/done；新 Step.sieve? additive、AlgorithmPlayer 加一行 v-if；新增第 7 大类「数学与数论」。
