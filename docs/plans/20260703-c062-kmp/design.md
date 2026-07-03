# 设计：KMP 字符串匹配（C-20260703-062，KmpView 新轨）

> Status: verified
> Stable ID: C-20260703-062
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

沿用 AlgorithmPlayer 可插拔轨范式：新增算法 = 新 `Step.xxx?` + 新 `XxxView.vue` + AlgorithmPlayer 加一行 `v-if` + 一个「细粒度重走」module。字符串匹配的「两串对齐 + 滑动」语义与既有 11 轨都不同，**新建第 12 条 KmpView 字符串匹配轨**，既有轨零改动。同时**开第 6 个顶层大类「字符串」**。

## 新轨：KmpView（第 12 轨，字符串匹配原语）

### 类型（`src/components/player/types.ts`，纯加法）

```ts
export interface KmpTrack {
  text: string; // 文本 T
  pattern: string; // 模式 P
  lps: number[]; // 部分匹配表（预置展示）
  offset: number; // 模式串行相对文本行的左偏移（对齐起点 = i - j）
  matchedLen: number; // pattern[0..matchedLen) 已匹配前缀（绿）
  compareText?: number | null; // 当前比较的文本下标（琥珀）
  comparePat?: number | null; // 当前比较的模式下标（琥珀）
  lpsActive?: number | null; // 跳转时用到的 lps 下标（高亮）
  status?: 'match' | 'mismatch' | 'found' | null; // 当前比较结果
  found: number[]; // 已命中的匹配起点（文本下标）
}

export type KmpExecPoint =
  | 'start' // 开始，i=0 j=0 对齐开头
  | 'match' // T[i]===P[j]：双指针前进，已匹配前缀 +1
  | 'jump' // 失配且 j>0：j 跳到 lps[j-1]，模式串右滑（文本指针不回退）
  | 'advance' // 失配且 j=0：文本指针 +1，模式串右移一格
  | 'found' // j 到模式末尾：命中，记录起点，j 跳到 lps[j-1] 继续
  | 'done'; // 文本扫描完
```

### 组件（`src/components/KmpView.vue`）

三行字符格（借鉴 BoardView/MazeView 的格子渲染）：

- **文本行**：T 每字符一格；`compareText` 琥珀环、`found` 命中区间浅绿底、已确定不匹配处默认。
- **模式串行**：P 每字符一格，整体左移 `offset` 格对齐到文本；`comparePat` 琥珀环、`[0..matchedLen)` 绿（已匹配前缀）。
- **LPS 行**：模式的部分匹配表数值，每格对齐模式字符；`lpsActive` 高亮（跳转时用到的格）。
- 结果徽标：`status` = match（绿✓）/ mismatch（红✗）/ found（🎯）。

## 算法：KMP 匹配（固定 T=`abababcab`、P=`ababc`）

### 匹配与跳转

`lps[k]` = P[0..k] 的最长「既是真前缀又是真后缀」的长度。P=`ababc` → LPS=`[0,0,1,2,0]`（预置）。匹配：i 扫文本、j 扫模式：

- `T[i]===P[j]`：i++、j++（`match`）。`j===m` → 命中于 `i-m`（`found`），随后 `j=lps[j-1]` 继续。
- `T[i]!==P[j]`：`j>0` → `j=lps[j-1]`（`jump`，**i 不动**，模式串右滑）；`j===0` → i++（`advance`）。

T=`abababcab`、P=`ababc` 追踪：连续匹配到 `abab`（j=4）后 T[4]=a≠P[4]=c 失配 → `jump` j=lps[3]=2（复用 `ab`）→ 继续匹配到 `ababc` → **命中于下标 2** → 继续扫到文本末尾。约 **13 步**（含 1 次关键 jump + 1 次 found）。

### 固定数据（`src/algorithms/kmp.ts`）

`KMP_TEXT='abababcab'`、`KMP_PATTERN='ababc'` + `kmpLps()`（=`[0,0,1,2,0]`）+ `kmpMatches()`（命中起点数组 `[2]`），供 module 断言。

### 细粒度重走（`src/algorithms/kmp.module.ts`）

`buildKmpSteps()` 复跑 KMP 匹配循环，emit 字符串匹配轨胖步骤：每次比较后按结果 emit `match`/`jump`/`advance`/`found`；`offset=i-j`、`matchedLen=j`；末尾 emit `done`。`vars`：`文本/模式/i/j/已找到`。

### 四语言源码（`src/algorithms/kmp.sources.ts`）

ts/python/go/rust 各一段 KMP：预置/构建 LPS（正文讲，代码含构建）+ 匹配循环（失配 `j=lps[j-1]`、命中记录）。`lineMap` 映射 `start/match/jump/advance/found/done`。

## 页面与接线（开新大类）

- `Kmp.vue`：Article 正文（字符串匹配、朴素 O(nm) vs KMP O(n+m)、部分匹配表 LPS 含义与构建、失配跳转不回退文本、编辑器查找/DNA 应用 + AlgorithmPlayer）。`array:[]` → BarsView 隐藏。
- 路由 `/docs/kmp` name=`kmp` 懒加载。
- **菜单 + 首页各加第 6 顶层大类「字符串」**（首项 KMP 字符串匹配，新 `kmp.svg`：文本+模式对齐/放大镜图标）。
- 改 `TC-HOOK-01-1/02-1`：顶层分类 `toHaveLength(6)`，`data[5]` = 「字符串」含 `['kmp']`。

## 关键决策

1. **新建 KmpView 而非复用**：两串对齐 + 模式滑动是独有语义，与 Bars/Matrix/Board/Maze 都不同；新 additive 第 12 轨保既有轨零改动，为后续串匹配（Rabin-Karp/BM）铺路。
2. **聚焦匹配阶段、LPS 预置**：KMP 的「阿哈」是匹配时的失配跳转；LPS 构建同样精巧但与匹配是两套指针语义，一页动画两阶段过载。本页 LPS 预置展示 + 正文讲构建，聚焦跳转；构建动画留后续。
3. **开第 6 大类**：字符串是主流算法家族，值得独立顶层分类，与既有五类并列。
4. **固定 T/P**：`abababcab`/`ababc` 含一次清晰的 LPS 跳转（j 4→2 复用 `ab`）+ 一次命中，步数 ~13 精炼。

## 影响面

- 改：`types.ts`（+KmpTrack/Step.kmp?/KmpExecPoint）、`AlgorithmPlayer.vue`（+import +`<KmpView v-if>`）、`AlgorithmPlayer.spec.ts`（+2 用例）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`KmpView.vue`(+spec)、`kmp.ts`、`kmp.sources.ts`、`kmp.module.ts`(+spec)、`Kmp.vue`(+spec)、`e2e/kmp.e2e.ts`、`src/assets/kmp.svg`。
- 既有 11 轨 + 全部算法页零改动；TC-HOOK 顶层分类 5→6。

## 变更历史

- 2026-07-03：创建（draft → approved）。第 12 条 KmpView 字符串匹配轨 + KMP 页 + 开「字符串」第 6 大类设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（KmpView 三行字符格 + offset 滑动、kmp.module 匹配循环 12 步、`array:[]` 隐 BarsView、既有 11 轨零改动、开第 6 大类）；真机首步 9/5/5 格、跳转 j 4→2、末步命中下标 2 验证。
