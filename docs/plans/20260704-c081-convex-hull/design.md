# 设计：凸包（C-20260704-081，新建 HullView 点平面轨）

> Status: verified
> Stable ID: C-20260704-081
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 19 条 **HullView 点平面轨**（计算几何大类可视化基础），产出 `Step<HullExecPoint>`（新 `Step.hull?` 字段）。Andrew 单调链逐点重走，散点 + 凸壳折线 + 弹栈高亮。

## 固定实例（Python 已核验）

- 7 点（排序后）：`idx0=(0,3), idx1=(2,0), idx2=(2,5), idx3=(3,3), idx4=(4,0), idx5=(4,5), idx6=(6,3)`。
- 下凸壳（0→6）：栈终态 `[0,1,4,6]`=(0,3)(2,0)(4,0)(6,3)，3 次弹栈。
- 上凸壳（6→0）：栈终态 `[6,5,2,0]`=(6,3)(4,5)(2,5)(0,3)，3 次弹栈。
- 完整凸包 = 下[:-1]+上[:-1] = `[0,1,4,6,5,2]`=(0,3)(2,0)(4,0)(6,3)(4,5)(2,5)，6 点；内部点 `(3,3)` 排除。

## T0：类型 + HullView

`types.ts`：

```ts
export interface Pt {
  x: number;
  y: number;
}
export interface HullTrack {
  points: Pt[]; // 全部点（已排序，数学坐标）
  edges: [number, number][]; // 当前凸壳链的边（点下标对）
  stack: number[]; // 当前链（栈）下标
  current?: number | null; // 当前处理的点下标（琥珀）
  popped?: number[]; // 本步被弹出的点下标（红）
  phase: 'lower' | 'upper' | 'done';
  finalHull?: number[]; // 完整凸包下标（done）
}
export type HullExecPoint = 'init' | 'lower' | 'upper' | 'done';
```

`Step` 加 `hull?: HullTrack`。`AlgorithmPlayer` 加一行 `<HullView v-if="current.hull" :hull="current.hull" />`。

`HullView.vue`：viewBox 460×300；把点坐标缩放居中、**y 上翻**（数学 y 向上）；渲染散点（小圆点，`current` 琥珀、`popped` 红）+ `edges` 折线 + `done` 时凸包多边形（半透明填充）。

## T1：oracle + module + sources

`convexhull.ts`（固定 7 点）：

```ts
export const CH_POINTS: Pt[]; // 排序后 7 点
export function cross(o, a, b): number; // 叉积
export function convexHull(): number[]; // 凸包点下标（逆时针）→ [0,1,4,6,5,2]
```

`convexhull.module.ts`：`buildHullSteps(): Step<HullExecPoint>[]`

- `init`：全部点，edges=[]，stack=[]，phase=lower。
- `lower`×7：逐点扫描（0→6）；`while stack≥2 且 cross(倒二,倒一,p)≤0` 弹栈（popped 收集）；压入 p（current=p、edges=当前链边）；caption 说明转向与弹栈。
- `upper`×7：逐点扫描（6→0）；保留下凸壳边，同法构上凸壳。
- `done`：edges=闭合凸包多边形，finalHull=[0,1,4,6,5,2]；caption 给凸包点数 + 内部点排除。

约 **16 步**。`vars`：点数、当前栈、当前叉积转向、凸包点数。

`convexhull.sources.ts`：TS/Python/Go/Rust 四语言 Andrew 单调链，`lineMap` 覆盖 init/lower/upper/done。

## T2：页面 + 新大类接线

`ConvexHull.vue`：`Article` 正文（标题「凸包（Convex Hull）」+ 副标「计算几何 · Andrew 单调链 · O(n log n)」）：讲清凸包定义、叉积转向、下 + 上凸壳、复杂度；`<AlgorithmPlayer :module="convexHullModule" />`。

**新大类接线**：

- 菜单 `useMenuCategory`：新增第 8 项 `{ title: '计算几何', children: [{ title: '凸包', url: 'convex-hull' }] }`。
- 首页 `useHomeCategory`：新增第 8 项（新 `convex-hull.svg` + 描述）。
- 路由 `/docs/convex-hull`。
- 改 `TC-HOOK`：分类数 7→8、新增 `data[7].title==='计算几何'` 断言、分类计数。

## 复用与零回归

- 新 `Step.hull?` additive，7 大类既有算法不设 → HullView 不渲染，全绿。
- AlgorithmPlayer 仅加一行 `v-if`。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建第 19 条 HullView 点平面轨 + 凸包 Andrew 单调链，开辟计算几何大类；固定 7 点，凸包 6 点、1 内部点。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：HullView 等比缩放居中 + y 上翻渲染散点 + 凸壳折线 + current 琥珀 + popped 红 + done 凸包多边形；convexhull oracle cross()/convexHull()=[0,1,4,6,5,2] 与单调链对拍、module init+lower×7+upper×7+done 16 步；4 语言 sources lineMap 对齐 init/lower/upper/done；新 Step.hull?、AlgorithmPlayer 加一行 v-if。
