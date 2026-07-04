# 设计：线性筛 / 欧拉筛（C-20260704-078，复用 SieveView + spf 角标）

> Status: verified
> Stable ID: C-20260704-078
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用 C-077 的 SieveView 数字网格轨，additive 扩 `spf` 角标（每合数标注划它的最小质因子）。线性筛外层遍历所有数、按最小质因子只划一次，产出 `Step<LinearSieveExecPoint>`（复用 `Step.sieve`）。

## 固定实例（Python 已核验）

- `N=30`（与埃氏筛同网格）。素数 `[2,3,5,7,11,13,17,19,23,29]`（10 个）。
- 外层 `i=2..30`，对素数表里的 `p`：划 `i×p`、`spf[i×p]=p`，`i%p==0` 即停。有划的 `i` 为 `2..15`（`i×2≤30`）。
- 每个合数只被划一次、spf = 其最小质因子。示例：`spf[12]=2`（i=6,p=2）、`spf[15]=3`（i=5,p=3）、`spf[9]=3`（i=3,p=3）。

## T0：类型 + SieveView（spf 角标）

`types.ts`：`SieveTrack` 补 1 个可选字段（埃氏筛不设 → 行为不变）：

```ts
spf?: (number | null)[]; // spf[v] = 划掉合数 v 的最小质因子（C-078 线性筛）；null=未划/无
```

`LinearSieveExecPoint = 'init' | 'mark' | 'rest' | 'done'`。

`SieveView.vue`：additive——`composite` 格若 `spf[v]!=null` 渲染一个**右下角小角标**显示 `spf[v]`。埃氏筛不传 `spf` → 无角标（零回归）。

## T1：oracle + module + sources

`linearsieve.ts`（固定 N=30）：

```ts
export const LS_N = 30;
export const LS_COLS = 6;
export function linearSieve(): { primes: number[]; spf: number[] }; // spf[v]=最小质因子
export function smallestPrimeFactor(x: number): number; // 试除对拍
```

`linearsieve.module.ts`：`buildLinearSieveSteps(): Step<LinearSieveExecPoint>[]`

- `init`：states 全 unknown、1 special；spf 全 null。
- 外层 `i=2..10` 逐 i 一步（`mark` 点，current=i）：`i` 未划设 prime；对素数 p 划 `i×p`（composite + spf[i×p]=p、marking=本步倍数）；caption 说明 `i×p` 与 `i%p==0 break`。
- `i=11..15` 合并一步（`mark`）：各划 `i×2`（22,24,26,28,30，spf=2）。
- `rest`：`i=16..30` 不再划（`i×2>30`），剩余未划 `17,19,23,29` 是素数。
- `done`：素数清单 + 「每合数只划一次、角标=最小质因子」。

约 **13 步**。`vars`：N、当前 i、已确认素数、复杂度 O(N)。

`linearsieve.sources.ts`：TS/Python/Go/Rust 四语言线性筛，`lineMap` 覆盖 init/mark/rest/done。

## T2：页面 + 接线

`LinearSieve.vue`：`Article` 正文（标题「线性筛（欧拉筛）」+ 副标「数学与数论 · 素数筛 · 每合数划一次 · O(N)」）：讲清外层遍历所有数、`i%p==0 break` 保证只划一次、与埃氏筛对比、严格 O(N)；`<AlgorithmPlayer :module="linearSieveModule" />`；与埃氏筛互链。

接线：路由 `/docs/linear-sieve`；菜单 + 首页「数学与数论」children **第 2 项**（紧接 sieve-of-eratosthenes）；新 `linear-sieve.svg`；改 `TC-HOOK`（数论 children +linear-sieve）；埃氏筛页尾「线性筛」加双向 router-link。

## 复用与零回归

- SieveView `spf` additive，C-077 埃氏筛不传 → 无角标、渲染不变，`TC-VIZ-SIEVEVIEW-*` 全绿。
- 无新轨、复用 `Step.sieve`；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。线性筛/欧拉筛，复用 SieveView（additive spf 角标）；固定 N=30、10 素数、每合数只被最小质因子划一次，承接 C-077。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：SieveView additive spf 右下角标（埃氏筛不设即无角标）；linearsieve oracle linearSieve() primes/spf 与试除对拍、module init+mark×(i=2..10 逐+i=11..15 合并)+rest+done 13 步（外层遍历所有数、i%p==0 break 每合数只划一次）；4 语言 sources lineMap 对齐 init/mark/rest/done；复用 Step.sieve、AlgorithmPlayer 零改动。
