# 设计：Rabin-Karp 字符串匹配（C-20260703-063，滚动哈希）

> Status: verified
> Stable ID: C-20260703-063
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

**复用 KmpView 字符串匹配轨**（[[C-20260703-062]] 新建，第 2 消费者）：Rabin-Karp 同样是「文本 + 模式对齐滑动」，只是不用 LPS、改用哈希。仅在 types.ts 加 `RabinKarpExecPoint` + 给 `KmpTrack` 加 `windowStart?`（窗口高亮），KmpView additive 加 `.kmp-window` + 空 LPS 时隐藏 π 行。零新轨，KMP 零回归。

## 轨扩展：KmpView + windowStart（additive）

```ts
// KmpTrack 加一字段
windowStart?: number | null; // 当前窗口在文本的起点（高亮 [windowStart, windowStart+m)）——Rabin-Karp 设，KMP 不设

// 新执行点
export type RabinKarpExecPoint =
  | 'start'    // 算出模式哈希，窗口停在开头
  | 'skip'     // 窗口哈希 ≠ 模式哈希 → 滑到下一个窗口（不逐字符比）
  | 'hashHit'  // 窗口哈希 = 模式哈希 → 需要逐字符验证
  | 'verify'   // 逐字符验证窗口 = 模式
  | 'found'    // 验证通过 → 命中
  | 'done';    // 文本扫描完
```

KmpView.vue additive 改动：文本格加 `.kmp-window`（`windowStart ≤ idx < windowStart+m` 时浅染窗口带）；π(LPS) 行加 `v-if="kmp.lps.length"`（Rabin-Karp `lps=[]` → 隐藏）。既有类/KMP 不变。

## 算法：Rabin-Karp（固定 T=`abcabcab`、P=`cab`）

### 滚动哈希与验证

字符值 `a=1,b=2,c=3`（`charCode-96`），基 `B=10`、模 `M=997`。哈希 `hash(s)=(…(s0·B+s1)·B+…+s_{m-1}) mod M`。

- 模式哈希 `hash("cab")=312`。
- 窗口哈希滚动更新：`h' = ((h − s_i·B^{m-1})·B + s_{i+m}) mod M`（O(1)）。
- 窗口哈希 ≠ 模式哈希 → 直接跳过；= → 逐字符**验证**（防冲突误报）；全等 → 命中。

T=`abcabcab`（n=8, m=3）6 个窗口哈希 = `[123,231,312,123,231,312]`；下标 2、5 哈希命中且验证通过 → **命中于 2、5**。约 **12 步**（start 1 + skip 4 + hashHit/verify/found ×2〈6 步〉+ done 1）。

### 固定数据（`src/algorithms/rabinkarp.ts`）

`RK_TEXT='abcabcab'`、`RK_PATTERN='cab'`、`RK_BASE=10`、`RK_MOD=997` + `rkHash(s)` + `rkWindowHashes()`（`[123,231,312,123,231,312]`）+ `rkMatches()`（`[2,5]`），供 module 断言。

### 细粒度重走（`src/algorithms/rabinkarp.module.ts`）

`buildRabinKarpSteps()`：`start` 算模式哈希；逐窗口：哈希不等 `skip`、相等 `hashHit`→`verify`→`found`（验证通过）；`done`。每步 `windowStart=i`、`offset=i`、`lps=[]`；`vars`：`文本/模式/模式哈希/窗口哈希/已找到`；caption 突出哈希对比。

### 四语言源码（`src/algorithms/rabinkarp.sources.ts`）

ts/python/go/rust 各一段 Rabin-Karp：算模式哈希 + 初始窗口哈希；滑动 O(1) 更新；哈希相等逐字符验证；命中记录。`lineMap` 映射 `start/skip/hashHit/verify/found/done`。

## 页面与接线

- `RabinKarp.vue`：Article 正文（字符串匹配、哈希把子串压成数、滚动哈希 O(1) 更新、哈希相等需验证防冲突、与 KMP 对照、应用〈多模式/重复子串/文件指纹〉 + AlgorithmPlayer）。`array:[]` → BarsView 隐藏。
- 路由 `/docs/rabin-karp` name=`rabin-karp` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「字符串」+「Rabin-Karp」（第 2 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `rabinkarp.svg`（哈希/井号 + 滑窗图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[5]`（字符串）children → `['kmp','rabin-karp']`。

## 关键决策

1. **复用 KmpView 而非新轨**：Rabin-Karp 与 KMP 同为「文本+模式对齐滑动」，KmpView 加 `windowStart` + 隐 π 行即可承载；第 2 消费者验证字符串匹配轨复用力（如 DecisionTreeView 服务子集/排列/组合总和）。
2. **哈希在变量/字幕，窗口在图**：滚动哈希核心是「比一个数 + 窗口滑动」，窗口高亮上图最直观，哈希数值放变量面板 + 字幕对比。
3. **小模数清晰数值**：B=10/M=997 使哈希为可读三位数；碰撞与双哈希在正文讲（非目标）。本例无偶发碰撞，验证步展示在真命中处。

## 影响面

- 改：`types.ts`（+`KmpTrack.windowStart?`、+`RabinKarpExecPoint`）、`KmpView.vue`（+`.kmp-window` + 空 LPS 隐 π 行）、`KmpView.spec.ts`（+TC-VIZ-KMPVIEW-05）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`rabinkarp.ts`、`rabinkarp.sources.ts`、`rabinkarp.module.ts`(+spec)、`RabinKarp.vue`(+spec)、`e2e/rabin-karp.e2e.ts`、`src/assets/rabinkarp.svg`。
- AlgorithmPlayer.vue 零改动；既有轨（除 KmpView additive 扩展）+ 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。复用 KmpView（第 2 消费者，扩展 windowStart）+ Rabin-Karp 页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（KmpView +windowStart 窗口带 + 空 LPS 隐 π 行、rabinkarp.module 滚动哈希 12 步、`array:[]` 隐 BarsView、KMP 零改动）；真机首步 8/3/0 格 + 窗口 3 格、哈希命中 [2,5] 验证。
