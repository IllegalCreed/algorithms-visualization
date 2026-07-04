# 设计：后缀数组（C-20260704-072，倍增法 · 新建 SuffixArrayView）

> Status: verified
> Stable ID: C-20260704-072
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 15 条播放器轨 SuffixArrayView（后缀轨），additive 可插拔。后缀数组用「倍增：sort → rerank」逐轮重走，产出 `Step<SuffixArrayExecPoint>`。

## T0：类型 + SuffixArrayView + 播放器接线

`types.ts`：

```ts
export interface SuffixArrayTrack {
  s: string; // 原串 "banana"
  k: number; // 当前倍增长度（1 = 已按首字符；下一轮比 2k）
  order: number[]; // 当前 sa（排序后的后缀起点）
  rank: number[]; // 每个起点 i 的当前 rank（0 基）
  phase?: 'sort' | 'rank' | null; // 本步高亮：重排 / 重编号
  done?: boolean;
}

export type SuffixArrayExecPoint = 'init' | 'sort' | 'rank' | 'done';
```

`Step` +`suffixArray?: SuffixArrayTrack`。`SuffixArrayView.vue`：顶部原串字符（带下标）；下方按 `order` 渲染后缀行，每行 = 起点下标徽标 + 后缀文本 + `rank[i]` + 关键字 `(rank[i], rank[i+k])`；`sort` 步高亮关键字列、`rank` 步高亮 rank 列。`AlgorithmPlayer.vue` +import + `<SuffixArrayView v-if="current.suffixArray">`。

## T1：oracle + module + sources

`suffixarray.ts`（固定 `"banana"`）：

```ts
export const SA_STR = 'banana';
export function suffixArray(): number[] { … }     // 倍增 → [5,3,1,0,4,2]
export function saRounds(): { k: number; order: number[]; rank: number[] }[] { … } // 每轮快照
```

`suffixarray.module.ts`：`buildSuffixArraySteps(): Step<SuffixArrayExecPoint>[]`

- `init`：`rank` = 各后缀首字符的 0 基 rank，`order` = 按 rank 排序，`k=1`。
- 循环（当 `max(rank) < n−1`）：
  - `sort`：`order` = 按 `(rank[i], rank[i+k])` 稳定排序（越界补 −1）；`phase='sort'`。
  - `rank`：由相邻关键字是否相等重编 0 基 `rank`；`phase='rank'`；`k *= 2`。
- `done`：`rank` 全不同 → `order` 即最终 `sa`。`"banana"` 两轮（k=1、2）收敛，约 **6 步**。`vars`：原串、当前 k、sa、是否收敛。

`suffixarray.sources.ts`：TS/Python/Go/Rust 四语言倍增后缀数组，`lineMap` 覆盖 init/sort/rank/done。

## T2：页面 + 接线

`SuffixArray.vue`：`Article` 正文（标题「后缀数组」+ 副标「字符串 · 后缀结构 · 倍增 O(n log²n)」）：讲清后缀数组定义、朴素排序为何慢、倍增思想（比较长度翻倍、用 rank 拼关键字），与 Manacher/KMP 同属「复用已算结果」；`<AlgorithmPlayer :module="suffixArrayModule" />`；结语点出应用（最长公共子串、不同子串计数）+ height/LCP 为进阶。

接线：路由 `/docs/suffix-array`；菜单 + 首页「字符串」children **第 5 项**；新 `suffix-array.svg`；改 `TC-HOOK`（字符串 children +suffix-array）。

## 复用与零回归

- 新增 SuffixArrayView 独立轨，其它算法 `Step.suffixArray` 未设即不渲染 → 零回归；AlgorithmPlayer 仅加一行 `v-if`。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建 SuffixArrayView 后缀轨（第 15 轨）；固定 "banana" 倍增两轮，sa=[5,3,1,0,4,2]。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：SuffixArrayView 原串 + 后缀表（起点/后缀/rank/关键字）+ sort/rank 高亮；suffixarray.module 倍增 init+sort/rank×2+done 6 步，oracle suffixArray()=[5,3,1,0,4,2]（与字典序一致）；4 语言 sources lineMap 对齐 init/sort/rank/done；AlgorithmPlayer 加一行 v-if 零回归。
