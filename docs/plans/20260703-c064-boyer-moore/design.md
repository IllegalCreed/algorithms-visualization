# 设计：Boyer-Moore 字符串匹配（C-20260703-064，坏字符规则）

> Status: verified
> Stable ID: C-20260703-064
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

**复用 KmpView 字符串匹配轨**（[[C-20260703-062]] 新建、[[C-20260703-063]] 已复用，第 3 消费者）：Boyer-Moore 同为「文本 + 模式对齐滑动」，只是从右往左比、按坏字符表大步跳。仅在 types.ts 加 `BoyerMooreExecPoint` + 给 `KmpTrack` 加 `matchedFrom?`（已匹配**后缀**高亮），KmpView additive：模式格 `.kmp-matched` 支持后缀区间。零新轨，KMP/Rabin-Karp 零回归。

## 轨扩展：KmpView + matchedFrom（additive）

```ts
// KmpTrack 加一字段
matchedFrom?: number | null; // 已匹配后缀起点：pattern[matchedFrom..m) 标绿（BM 从右往左匹配后缀）——KMP/RK 不设

// 新执行点
export type BoyerMooreExecPoint =
  | 'start'    // 模式对齐到文本开头，从模式末尾开始（右→左）
  | 'match'    // P[j]===T[s+j]：字符相等，j 左移，已匹配后缀 +1
  | 'badChar'  // P[j]≠T[s+j]：失配，按坏字符表把模式右移 max(1, j−last[坏字符])
  | 'found'    // j 越过左端 → 整段匹配，命中
  | 'done';    // 文本扫描完
```

KmpView.vue additive：模式格 `.kmp-matched` 判据加 `matchedFrom != null && idx >= matchedFrom`（后缀绿）；既有 `idx < matchedLen`（前缀，KMP/RK）保留。`windowStart` 窗口带 + 空 LPS 隐 π 行（C-063 已加）复用。

## 算法：Boyer-Moore 坏字符规则（固定 T=`abcabxabc`、P=`abc`）

### 从右往左 + 坏字符跳

`last[c]` = 字符 c 在模式中最右出现下标（不在则 −1）。P=`abc` → `last = {a:0, b:1, c:2}`。

对齐窗口起点 s，从 `j=m−1` 往左比 `P[j]` 与 `T[s+j]`：

- 相等：j−−（已匹配后缀 `pattern[j+1..m)` 增长）。
- 失配于 j：坏字符 `bc=T[s+j]`，右移 `shift = max(1, j − last[bc])`（bc 不在模式 → `last=−1` → 跳 `j+1`，常常跳过整段）；`s += shift`。
- `j<0`（全匹配）：命中于 s；`s += 1` 继续。

T=`abcabxabc`（n=9, m=3）→ 命中 **[0, 6]**；含 4 个窗口事件：s=0 命中 → s=1 坏字符 'a'（在模式，右移 2）→ s=3 坏字符 'x'（不在模式，右移 3 跳过整段）→ s=6 命中。约 **12 步**（start 1 + match/found×2〈8〉+ badChar 2 + done 1）。

### 固定数据（`src/algorithms/boyermoore.ts`）

`BM_TEXT='abcabxabc'`、`BM_PATTERN='abc'` + `bmLast()`（`{a:0,b:1,c:2}`）+ `bmMatches()`（`[0,6]`），供 module 断言。

### 细粒度重走（`src/algorithms/boyermoore.module.ts`）

`buildBoyerMooreSteps()`：`start` 对齐窗口 0（从右比）；逐窗口从右往左：相等 `match`、失配 `badChar`（算 shift）、越左端 `found`。每步 `windowStart=offset=s`、`lps=[]`、`matchedFrom` = 已匹配后缀起点；`vars`：`文本/模式/坏字符表/i,j/已找到`；caption 突出坏字符与右移量。

### 四语言源码（`src/algorithms/boyermoore.sources.ts`）

ts/python/go/rust 各一段 Boyer-Moore 坏字符版：建 last 表 + 外层对齐 s、内层从右往左比、失配按 last 右移、命中记录。`lineMap` 映射 `start/match/badChar/found/done`。

## 页面与接线

- `BoyerMoore.vue`：Article 正文（从右往左比、坏字符规则大步跳、不在模式跳过整段、好后缀规则带过、与 KMP/Rabin-Karp 对照、应用 + AlgorithmPlayer）。`array:[]` → BarsView 隐藏。
- 路由 `/docs/boyer-moore` name=`boyer-moore` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「字符串」+「Boyer-Moore」（第 3 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `boyermoore.svg`（模式从右往左 + 大步跳箭头）。
- 改 `TC-HOOK-01-1/02-1`：`data[5]`（字符串）children → `['kmp','rabin-karp','boyer-moore']`。

## 关键决策

1. **复用 KmpView 而非新轨**：BM 与 KMP/RK 同为「文本+模式对齐」，KmpView 加 `matchedFrom`（后缀绿）即可承载右往左匹配；第 3 消费者续证字符串匹配轨复用力。
2. **只做坏字符规则**：BM 完整含坏字符 + 好后缀两规则；好后缀较复杂且与坏字符独立，本页聚焦更直观的坏字符（大步跳的来源），好后缀正文带过。
3. **T=`abcabxabc`**：含两种跳（坏字符在模式内小跳 2、不在模式内大跳 3 跳过整段）+ 2 次命中，坏字符规则的两面都演示到。

## 影响面

- 改：`types.ts`（+`KmpTrack.matchedFrom?`、+`BoyerMooreExecPoint`）、`KmpView.vue`（模式格后缀高亮）、`KmpView.spec.ts`（+TC-VIZ-KMPVIEW-06）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`boyermoore.ts`、`boyermoore.sources.ts`、`boyermoore.module.ts`(+spec)、`BoyerMoore.vue`(+spec)、`e2e/boyer-moore.e2e.ts`、`src/assets/boyermoore.svg`。
- AlgorithmPlayer.vue 零改动；既有轨（除 KmpView additive 扩展）+ 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。复用 KmpView（第 3 消费者，扩展 matchedFrom）+ Boyer-Moore 页设计。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：`matchedFrom` additive 扩展（KMP/RK 不设、零回归），buildBoyerMooreSteps 右往左 + 坏字符跳细粒度重走 12 步；`BoyerMooreExecPoint = start|match|badChar|found|done`，四语言 sources lineMap 对齐。
