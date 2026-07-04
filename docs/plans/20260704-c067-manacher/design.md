# 设计：Manacher 最长回文子串（C-20260704-067，新建 ManacherView 回文轨）

> Status: verified
> Stable ID: C-20260704-067
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 13 条播放器轨 **ManacherView**（回文轨），additive 可插拔（其它算法不设 `Step.manacher` 即不渲染，零回归）。Manacher 用「转换串 + 半径数组 + 中心/镜像/边界」逐步重走，产出 `Step<ManacherExecPoint>` 胖步骤。

## T0：类型 + ManacherView + 播放器接线

`types.ts`：

```ts
export interface ManacherTrack {
  s: string; // 转换串（# 分隔，如 #b#a#b#a#d#）
  p: (number | null)[]; // 半径数组，未算为 null（显示空）
  center?: number | null; // 当前中心 i（琥珀环）
  mirror?: number | null; // 镜像点 2C-i（蓝环）
  boxL?: number | null; // 当前最右回文左边界 L（浅蓝带 [L..R]）
  boxR?: number | null; // 当前最右回文右边界 R
  best?: [number, number] | null; // 目前最长回文在转换串上的区间 [l,r]（绿）
  status?: 'mirror' | 'expand' | 'done' | null;
}

export type ManacherExecPoint =
  | 'init' // 预处理：插 # 得转换串，p 全空
  | 'mirror' // 中心 i 在最右回文内 → p[i]=min(R-i, p[2C-i]) 复用对称性，再尝试扩展
  | 'expand' // 中心 i 超出 R → 从 p=0 纯中心扩展
  | 'done'; // 全部算完，max(p) 对应最长回文
```

`Step` +`manacher?: ManacherTrack`。`ManacherView.vue`：两行（字符行 + 半径行），复用 KmpView 的新拟物字符格风格；类名 `mn-view`/`mn-cell`/`mn-s-cell`/`mn-p-cell` + 高亮 `mn-center`（琥珀环）/`mn-mirror`（蓝环）/`mn-box`（浅蓝带）/`mn-best`（绿底）。`AlgorithmPlayer.vue` +`import ManacherView` + `<ManacherView v-if="current.manacher" :manacher="current.manacher" />`。

## T1：oracle + module + sources

`manacher.ts`（固定 `"babad"`）：

```ts
export const MANACHER_RAW = 'babad';
export function manacherTransform(): string { … } // '#b#a#b#a#d#'
export function manacherRadii(): number[] { … }   // [0,1,0,3,0,3,0,1,0,1,0]
export function longestPalindrome(): string { … } // 'bab'
```

转换串 `#b#a#b#a#d#`（长 11，仅 `#` 分隔、扩展时做边界判断，不加 `^`/`$` 哨兵以求显示干净）。

`manacher.module.ts`：`buildManacherSteps(): Step<ManacherExecPoint>[]`

- `init`：`center=null`，展示转换串 + 空 p。
- 维护 `C`、`R = C + p[C]`（最右回文右边界）。对每个中心 `i = 0..len-1`：
  - `i < R` → `mirror`：`p[i] = min(R - i, p[2C - i])`（`mirror=2C-i` 蓝、`boxL/boxR` 浅蓝带），再 `while s[i-p-1]===s[i+p+1] p++`；若 `i+p > R` 更新 `C=i,R=i+p`。
  - 否则 → `expand`：`p[i]=0` 起纯扩展；若 `i+p > R` 更新 `C=i,R=i+p`。
  - 每步 `best` = 目前 `p` 最大的中心对应区间 `[i-p[i], i+p[i]]`（绿）。
- `done`：`center=null`，`best` = 最终最长回文区间；caption 给出 "bab" 长 3。
- 约 **13 步**（init 1 + 11 中心 + done 1）。`vars`：原串、转换串、当前中心/半径、C/R、当前最长。

`manacher.sources.ts`：TS/Python/Go/Rust 四语言标准 Manacher，`lineMap` 覆盖 init/mirror/expand/done。

## T2：页面 + 接线

`Manacher.vue`：`Article` 正文（标题「Manacher 最长回文子串」+ 副标「字符串 · 回文 · O(n)」）：

- 讲清朴素中心扩展 O(n²) 的痛点 → 插 `#` 统一奇偶 → 维护最右回文 [C,R]，用镜像对称性 `min(R-i, p[2C-i])` 免费复用、只扩展超出部分 → O(n)。
- `<AlgorithmPlayer :module="manacherModule" />`。
- 结语点出与三种匹配的对照（匹配是「文本找模式」，Manacher 是「单串回文结构」），进阶指向回文树。

接线：路由 `/docs/manacher`（name=`manacher`）；菜单 + 首页「字符串」children **第 4 项**（紧接 `boyer-moore`）：`['kmp','rabin-karp','boyer-moore','manacher']`；新图标 `manacher.svg`（对称/回文意象）；改 `TC-HOOK`（字符串 children，menu+home 各 1 处）。

## 复用与零回归

- 新增 ManacherView 为独立轨，其它算法 `Step.manacher` 未设即不渲染 → KMP/RK/BM/所有既有算法零回归；AlgorithmPlayer 仅加一行 `v-if`。
- 字符格样式借鉴 KmpView，但 ManacherView 是独立组件（语义：回文分析，非模式匹配）。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建 ManacherView 回文轨（第 13 轨）；固定 "babad"，转换串 + 半径数组 + 镜像复用，最长回文 "bab"。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：ManacherView 两行 + mn-center/mirror/box/best 高亮；manacher.module 维护 C/R、mirror 步 boxL=2C−R/boxR=R 供推导镜像、best 运行最大；oracle manacherRadii()=[0,1,0,3,0,3,0,1,0,1,0]；4 语言 sources lineMap 对齐 init/mirror/expand/done；AlgorithmPlayer 加一行 v-if 零回归。
