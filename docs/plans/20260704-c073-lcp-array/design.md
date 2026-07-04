# 设计：LCP / height 数组（C-20260704-073，Kasai · 扩展 SuffixArrayView）

> Status: verified
> Stable ID: C-20260704-073
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

复用 C-072 的 SuffixArrayView（后缀轨），additive 扩成「LCP 模式」。LCP 用 Kasai 逐原始下标重走，产出 `Step<LcpExecPoint>`（复用 `Step.suffixArray`）。

## T0：类型 + SuffixArrayView（LCP 模式）

`types.ts`：`SuffixArrayTrack` 补 3 个可选字段（SA 构造不设 → 行为不变）：

```ts
lcp?: (number | null)[];   // LCP 列：lcp[i] = LCP(sa[i-1], sa[i])；null=未算
current?: number | null;   // 当前处理行（排序位次 rank[i]）——琥珀高亮
compareRow?: number | null; // 排序前驱行（rank[i]-1）——蓝高亮
```

+`LcpExecPoint = 'init' | 'fill' | 'skip' | 'done'`。

`SuffixArrayView.vue`：`lcp` 存在 → **LCP 模式**：把「关键字」列换成 **LCP 列**（`lcp[row]` 值 / null 空 / 首行 `-`）、隐去 k 徽标、`current` 行 `.sa-current`（琥珀）、`compareRow` 行 `.sa-compare`（蓝）。`lcp` 不存在 → 维持构造模式（关键字列 + k 徽标）不变。

## T1：oracle + module + sources

`lcparray.ts`（复用 `SA_STR="banana"` + C-072 `suffixArray()`）：

```ts
export function kasaiLcp(): number[]; // 按 sa 顺序，[0,1,3,0,0,2]
export function saRank(): number[]; // sa 的逆（rank[起点]=排序位次）
```

`lcparray.module.ts`：`buildLcpSteps(): Step<LcpExecPoint>[]`

- `init`：order=sa、rank、lcp 全 null；展示排好的后缀表。
- Kasai：`h=0`，for `i=0..n-1`（原始下标序）：
  - `rank[i]>0` → `fill`：前驱 `j=sa[rank[i]-1]`，`while s[i+h]==s[j+h] h++`，`lcp[rank[i]]=h`，`current=rank[i]`、`compareRow=rank[i]-1`，caption 说明「h 从上轮 −1 起、只减 1」；随后 `if h>0 h--`。
  - 否则 → `skip`：`current=0`，无前驱，`h=0`。
- `done`：lcp 齐，caption 给「不同子串数 15、最长重复子串 max=3」。约 **8 步**（init 1 + 6 + done 1）。`vars`：原串、当前后缀 i、h、已填 LCP。

`lcparray.sources.ts`：TS/Python/Go/Rust 四语言 Kasai，`lineMap` 覆盖 init/fill/skip/done。

## T2：页面 + 接线

`LcpArray.vue`：`Article` 正文（标题「LCP / height 数组」+ 副标「字符串 · 后缀结构 · Kasai O(n)」）：讲清 LCP 定义、朴素 O(n²)、Kasai 的 h 单调性（去首字符 h 至多减 1）、sa+lcp 的两个一趟应用；`<AlgorithmPlayer :module="lcpArrayModule" />`；结语与 C-072 后缀数组互链（构造 → 应用）。

接线：路由 `/docs/lcp-array`；菜单 + 首页「字符串」children **第 6 项**（紧接 suffix-array）；新 `lcp-array.svg`；改 `TC-HOOK`（字符串 children +lcp-array）。

## 复用与零回归

- SuffixArrayView `lcp`/`current`/`compareRow` additive，C-072 构造页不传 → 构造模式渲染不变，`TC-VIZ-SAVIEW-*` 全绿。
- 无新轨、无新 Step 字段（复用 `Step.suffixArray`）；AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-04：创建（draft → approved）。扩展 SuffixArrayView 为 LCP 模式；Kasai 逐原始下标 8 步，banana lcp=[0,1,3,0,0,2]，接续 C-072。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：SuffixArrayView lcp 存在→LCP 列 + current/compareRow 高亮（构造模式不设即不变）；lcparray.module Kasai 逐原始下标 8 步（5 fill + 1 skip），oracle kasaiLcp()=[0,1,3,0,0,2] 与直接比较对拍；4 语言 sources lineMap 对齐 init/fill/skip/done；复用 Step.suffixArray、AlgorithmPlayer 零改动。
