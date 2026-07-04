# 设计：快速幂（C-20260704-080，新建 PowerView 幂块轨）

> Status: verified
> Stable ID: C-20260704-080
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 18 条 **PowerView 幂块轨**（一行幂块卡片 + 结果），产出 `Step<PowerExecPoint>`（新 `Step.power?` 字段）。快速幂逐位重走，底数反复平方、位选累乘。

## 固定实例（Python 已核验）

- `a=3, n=13`（`13 = 1101₂`，位 low→high = 1,0,1,1）。
- 幂块 `a^(2ᵏ)`：`3¹=3`(k0)、`3²=9`(k1)、`3⁴=81`(k2)、`3⁸=6561`(k3)。
- 位为 1 选中：k0(3¹)、k2(3⁴)、k3(3⁸)；指数和 `1+4+8=13`。
- 结果 = `3 × 81 × 6561 = 1594323 = 3¹³`（与 `pow(3,13)` 对拍）。

## T0：类型 + PowerView

`types.ts`：

```ts
export interface PowerBlock {
  k: number; // 位下标
  exp: number; // 2^k
  value: number; // a^(2^k)
  bit: number; // n 的第 k 位（0/1）
  selected: boolean; // bit===1 → 乘入结果
}
export interface PowerTrack {
  a: number;
  n: number;
  binary: string; // n 的二进制串（高位在左），如 "1101"
  blocks: PowerBlock[]; // 已出现的幂块（累加）
  current?: number | null; // 当前处理的块下标（琥珀）
  result: number; // 当前累乘结果
  done?: boolean;
}
export type PowerExecPoint = 'init' | 'mul' | 'skip' | 'done';
```

`Step` 加 `power?: PowerTrack`。`AlgorithmPlayer` 加一行 `<PowerView v-if="current.power" :power="current.power" />`。

`PowerView.vue`：顶部显示 `n = 13 = 1101₂`；一行幂块卡片（`v-for` blocks），每卡三行「aᵉˣᵖ / 值 / 位=bit」；`selected` 卡绿、非选灰、`current` 卡琥珀环；底部 `结果 = <选中值连乘> = <result>`。

## T1：oracle + module + sources

`fastpower.ts`（固定 3,13）：

```ts
export const FP_A = 3,
  FP_N = 13;
export function fastPow(a: number, n: number): number; // 快速幂
export function powBlocks(): PowerBlock[]; // 4 个幂块 + 选中
```

`fastpower.module.ts`：`buildFastPowSteps(): Step<PowerExecPoint>[]`

- `init`：n=13、binary="1101"、blocks=[]、result=1；caption 讲规则。
- 逐位 k=0..3：底数平方出块 `a^(2ᵏ)`，累加 blocks、current=k；位=1 → `mul`（selected、result×=块值、caption 说明乘入）；位=0 → `skip`（caption 说明跳过）。
- `done`：result=1594323；caption 给 `3¹³ = 3¹·3⁴·3⁸ = 1594323`。

约 **6 步**。`vars`：a、n、二进制、选中指数和、result、复杂度 O(log n)。

`fastpower.sources.ts`：TS/Python/Go/Rust 四语言快速幂（迭代 while n>0），`lineMap` 覆盖 init/mul/skip/done。

## T2：页面 + 接线

`FastPower.vue`：`Article` 正文（标题「快速幂（二进制取幂）」+ 副标「数学与数论 · 二进制拆分 · O(log n)」）：讲清指数二进制拆分、反复平方、位选累乘、复杂度、模幂应用（RSA）；`<AlgorithmPlayer :module="fastPowModule" />`；与欧几里得/模逆元线索互链。

接线：路由 `/docs/fast-power`；菜单 + 首页「数学与数论」children **第 4 项**（紧接 gcd）；新 `fast-power.svg`；改 `TC-HOOK`（数论 children +fast-power）。

## 复用与零回归

- 新 `Step.power?` additive，其它算法不设 → PowerView 不渲染，全绿。
- AlgorithmPlayer 仅加一行 `v-if`；无既有轨改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建第 18 条 PowerView 幂块轨 + 快速幂；固定 3^13=1594323，二进制 1+4+8。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：PowerView 顶部 n 二进制 + 一行幂块卡片（指数/值/位，选中绿/跳过灰/当前琥珀）+ 结果连乘；fastpower oracle fastPow()/powBlocks() 与 3^13 对拍、module init+mul×3/skip×1+done 6 步；4 语言 sources lineMap 对齐 init/mul/skip/done；新 Step.power?、AlgorithmPlayer 加一行 v-if。
