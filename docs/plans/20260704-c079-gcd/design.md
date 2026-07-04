# 设计：欧几里得算法 GCD（C-20260704-079，新建 GcdView 矩形铺砖轨）

> Status: verified
> Stable ID: C-20260704-079
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 17 条 **GcdView 矩形铺砖轨**，产出 `Step<GcdExecPoint>`（新 `Step.gcd?` 字段）。欧几里得辗转相除逐除法步重走，几何上从矩形长边切下正方形，最小正方形边长 = gcd。

## 固定实例（Python 已核验）

- `gcd(30, 18)`：除法步 `30=1·18+12`、`18=1·12+6`、`12=2·6+0`，gcd=6。
- 铺砖（矩形 30 宽 × 18 高，坐标左上原点、y 向下）：
  - 方块 (0,0,18)（step0）、(18,0,12)（step1）、(18,12,6) 与 (24,12,6)（step2）。
  - 4 个正方形，总面积 18²+12²+6²+6²=540=30×18，**恰好铺满**；尺寸 {18,12,6}，最小 6 = gcd。

## T0：类型 + GcdView

`types.ts`：

```ts
export interface GcdSquare {
  x: number;
  y: number;
  size: number;
  step: number;
}
export interface GcdTrack {
  a: number; // 原矩形宽（30）
  b: number; // 原矩形高（18）
  squares: GcdSquare[]; // 已切下的正方形（累加）
  current?: number[]; // 本步新切方块在 squares 中的下标（琥珀）
  remaining?: { x: number; y: number; w: number; h: number } | null; // 剩余子矩形（虚线框）
}
export type GcdExecPoint = 'init' | 'cut' | 'done';
```

`Step` 加 `gcd?: GcdTrack`。`AlgorithmPlayer` 加一行 `<GcdView v-if="current.gcd" :gcd="current.gcd" />`。

`GcdView.vue`：viewBox 460×300；把 `a×b` 按 `scale=min((460-M)/a,(300-M)/b)` 缩放居中。渲染原矩形外框 + 每个 `squares[i]` 缩放后的正方形（按 `step` 取调色板色、中心标 `size`）；`current` 下标的方块加琥珀描边；`remaining` 画虚线框。

## T1：oracle + module + sources

`gcd.ts`（固定 30,18）：

```ts
export const GCD_A = 30, GCD_B = 18;
export function gcd(a: number, b: number): number;         // 递归/迭代
export function gcdSteps(): { a: number; b: number; q: number; r: number }[]; // 除法步
export function gcdTiling(): { squares: GcdSquare[]; steps: [...] };  // 铺砖方块 + 每步剩余
```

`gcd.module.ts`：`buildGcdSteps(): Step<GcdExecPoint>[]`

- `init`：矩形 30×18，squares 空，remaining=全矩形；caption 讲规则。
- `cut`×3：逐除法步切 `q=⌊a/b⌋` 个 `b×b` 方块（累加 squares、current=本步下标）、remaining=(a%b)×b 子矩形；caption `a÷b=q 余 r：切 q 个 b×b，剩 r×b`。
- `done`：铺满、remaining=null；caption `gcd(30,18)=6（最小正方形边长）`。

约 **5 步**。`vars`：a、b、递推链 `gcd(30,18)=…=gcd(6,0)=6`、gcd。

`gcd.sources.ts`：TS/Python/Go/Rust 四语言辗转相除（含迭代/递归），`lineMap` 覆盖 init/cut/done。

## T2：页面 + 接线

`Gcd.vue`：`Article` 正文（标题「欧几里得算法（最大公约数）」+ 副标「数学与数论 · 辗转相除 · O(log min(a,b))」）：讲清取模递推、几何铺砖、最小正方形 = gcd、互质情形、复杂度（Fibonacci 最坏）；`<AlgorithmPlayer :module="gcdModule" />`。

接线：路由 `/docs/gcd`；菜单 + 首页「数学与数论」children **第 3 项**（紧接 linear-sieve）；新 `gcd.svg`；改 `TC-HOOK`（数论 children +gcd）。

## 复用与零回归

- 新 `Step.gcd?` additive，其它算法不设 → GcdView 不渲染，全绿。
- AlgorithmPlayer 仅加一行 `v-if`；无既有轨改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建第 17 条 GcdView 矩形铺砖轨 + 欧几里得 GCD；固定 gcd(30,18)=6，几何铺砖 4 方块恰好铺满。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：GcdView 等比缩放居中渲染矩形 + 方块（按步着色标边长）+ current 琥珀描边 + remaining 虚线框；gcd oracle gcd()/gcdSteps()/gcdTiling() 与铺砖对拍（18²+12²+6²+6²=540=30×18）；module init+cut×3+done 5 步；4 语言 sources lineMap 对齐 init/cut/done；新 Step.gcd?、AlgorithmPlayer 加一行 v-if。
