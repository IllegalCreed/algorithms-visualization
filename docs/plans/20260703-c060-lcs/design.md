# 设计：最长公共子序列 LCS（C-20260703-060，填表 + 回溯）

> Status: verified
> Stable ID: C-20260703-060
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

**复用并小幅扩展** [[C-20260703-052]] 新建、[[C-20260703-053]]/[[C-20260703-054]] 已三验的 **MatrixView 矩阵轨**：加一个 `pathCells`（回溯路径）+ View 的 `.mx-path` 样式，即可表达「回溯路径」。这是矩阵轨的第 4 个消费者，从「填表求最优值」延伸到「填表 + 回溯求最优解」。既有 DP/Floyd 页零回归。

## 轨扩展：MatrixView + pathCells（additive）

```ts
// MatrixTrack 加一字段
pathCells?: [number, number][]; // 回溯路径格（绿环）——LCS 等需恢复解的 DP 设，编辑距离/背包/Floyd 不设 → 无 .mx-path

// 新执行点
export type LcsExecPoint =
  | 'init'      // 填边界：第 0 行 / 第 0 列 = 0（空串无公共子序列）
  | 'match'     // X[i-1]===Y[j-1]：dp[i][j]=dp[i-1][j-1]+1（取左上对角 + 1）
  | 'mismatch'  // 不同：dp[i][j]=max(dp[i-1][j], dp[i][j-1])（取上/左较大）
  | 'fillDone'  // 表填满：右下角 = LCS 长度
  | 'trace'     // 回溯：从右下角沿路径回走一步（匹配则收字符、走对角；否则走上/左）
  | 'done';     // 回溯完：恢复出 LCS 字符串
```

MatrixView.vue additive 改动：`cellOf` 加 `'mx-path': (m.pathCells ?? []).some(...)`；`.mx-path` = 绿环（`box-shadow` 0 0 0 3px 绿），区别于 `.mx-active` 琥珀环、`.mx-updated` 绿填充。既有类不变。

## 算法：LCS（固定 X=`ABCD`、Y=`ACDF`）

### 递推与回溯

`dp[i][j]` = X 前 i 个字符与 Y 前 j 个字符的 LCS 长度。边界 `dp[0][*]=dp[*][0]=0`。

- `X[i-1]===Y[j-1]`：`dp[i][j] = dp[i-1][j-1] + 1`（这个公共字符接在对角 LCS 后）。
- 否则：`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`（丢弃 X 或 Y 的当前字符取较优）。

X=`ABCD`、Y=`ACDF` → `dp[4][4] = 3`，LCS = `ACD`。DP 表（行 ∅ABCD、列 ∅ACDF）：

```
    ∅ A C D F
  ∅ 0 0 0 0 0
  A 0 1 1 1 1
  B 0 1 1 1 1
  C 0 1 2 2 2
  D 0 1 2 3 3
```

**回溯**：从 `(4,4)` 起，`X[i-1]===Y[j-1]` → 收该字符、走对角 `(i-1,j-1)`；否则往 `dp` 较大的上/左走。路径 `(4,4)(4,3)(3,2)(2,1)(1,1)`，匹配格 `(4,3)=D (3,2)=C (1,1)=A` → 逆序拼出 `ACD`。

### 固定数据（`src/algorithms/lcs.ts`）

`LCS_X='ABCD'`、`LCS_Y='ACDF'` + `lcsDp()`（返回完整 dp 表）+ `lcsLength()`（=3）+ `lcsString()`（='ACD'）+ `lcsPath()`（回溯路径格序列），供 module 断言。

### 细粒度重走（`src/algorithms/lcs.module.ts`）

`buildLcsSteps()`：

1. `init`：一步填第 0 行/列 = 0，字幕「空串与任何串的 LCS 长度为 0」。
2. 双重循环逐格：相同 → `match`（active=(i,j)、sources=[(i-1,j-1)]、updated=(i,j)，字幕「X=Y：左上 +1」）；不同 → `mismatch`（sources=[(i-1,j),(i,j-1)]，字幕「取上/左较大」）。
3. `fillDone`：active=(m,n)，字幕「右下角 = LCS 长度 = 3」。
4. 回溯：从 (m,n) 起逐格 `trace`（`pathCells` 累积绿环、active=当前格；匹配格字幕「匹配 X → 收进 LCS」）。
5. `done`：pathCells=完整路径，字幕「LCS = ACD（长度 3）」。

步数 ≈ 24（init 1 + 填 16 + fillDone 1 + trace 5 + done 1）。`vars`：`串 X/串 Y/当前格/取值/已恢复`。

### 四语言源码（`src/algorithms/lcs.sources.ts`）

ts/python/go/rust 各一段 LCS：二维 DP 填表（相同 `dp[i-1][j-1]+1`、不同 `max`）+ 回溯（`while i>0 && j>0`：相同收字符走对角、否则往大的上/左走）。`lineMap` 映射 `init/match/mismatch/fillDone/trace/done`。

## 页面与接线

- `Lcs.vue`：Article 正文（LCS/子序列 vs 子串、二维 DP 相同取左上 +1/不同取上左最大、填表求长度 + **回溯恢复解**、diff/生物信息应用、与编辑距离对照 + AlgorithmPlayer）。`array:[]` → BarsView 隐藏。
- 路由 `/docs/lcs` name=`lcs` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「动态规划」+「最长公共子序列」（第 3 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `lcs.svg`（两串 + 对角连线/公共子序列图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[3].children` → `['edit-distance','knapsack','lcs']`。

## 关键决策

1. **扩展 pathCells 而非新轨**：回溯路径是「恢复解」的通用表达，加 `pathCells` + `.mx-path` 即覆盖，未来需恢复解的 DP（编辑距离的操作序列、背包的选中物品）皆可复用；MatrixView additive 扩展，既有消费者零回归。
2. **LCS 而非又一个纯填表 DP**：LCS 的价值在**回溯恢复解**，区别于编辑距离/背包只求数值；填表 + 回溯两阶段完整。
3. **固定 X=`ABCD`/Y=`ACDF`**：5×5 表清晰、LCS=`ACD`（两串各为真子序列、非包含关系），回溯路径含匹配与移动两类，教学完整。

## 影响面

- 改：`types.ts`（+`MatrixTrack.pathCells?`、+`LcsExecPoint`）、`MatrixView.vue`（+`.mx-path` 渲染）、`MatrixView.spec.ts`（+TC-VIZ-MATRIXVIEW-07）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`lcs.ts`、`lcs.sources.ts`、`lcs.module.ts`(+spec)、`Lcs.vue`(+spec)、`e2e/lcs.e2e.ts`、`src/assets/lcs.svg`。
- AlgorithmPlayer.vue 零改动；既有轨（除 MatrixView additive 扩展）+ 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。扩展 MatrixView（pathCells）+ LCS 页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（MatrixView +pathCells/`.mx-path` 绿环、lcs.module 填表+回溯 24 步、`array:[]` 隐 BarsView、既有 MatrixView 消费者零回归）；真机首步 25 单元、填满 dp=3、末步回溯 5 格恢复 ACD 验证。
