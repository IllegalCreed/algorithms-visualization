# 设计：0-1 背包（DP 大类第 2 页，纯复用 MatrixView 矩阵轨）

> Status: verified
> Stable ID: C-20260703-054
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
视图 src/views/Article/Algorithm/Knapsack.vue（新页，归「动态规划」大类）
   │  <Article> 正文（0-1 背包 / 取舍递推 / DP 表填法 / vs 编辑距离）
   │  <AlgorithmPlayer :module="knapsackModule" />
   ▼
框架扩展（additive，唯一一处）：player/types.ts +KnapsackExecPoint
纯复用（零改动）：MatrixView.vue（C-052/053 建，行列异标签 + emptyText 空白已支持）+ AlgorithmPlayer
   ▼
算法模块 src/algorithms/
   knapsack.module.ts   buildKnapsackSteps + knapsackModule
   knapsack.ts          物品/容量（WEIGHTS/VALUES/CAPACITY/ITEM_LABELS）+ oracle knapsackTrace()→DP 表
   knapsack.sources.ts  4 语言 + lineMap

接线：router（/docs/knapsack）+ 菜单/首页「动态规划」分类 +0-1 背包（新 knapsack.svg）
TC-HOOK：TC-HOOK-01-1/02-1 动态规划分类 1→2、url +knapsack
不改：MatrixView / 编辑距离 / Floyd / 8 轨 / 6 图算法 / 15 排序 / 15 结构
```

## 2. 类型扩展（additive，唯一框架改动）

```ts
export type KnapsackExecPoint =
  | 'init' // 填边界：第 0 行/列 = 0
  | 'cellSkip' // 装不下（重 > 容量）：dp[i][w]=dp[i-1][w]（沿用上一行）
  | 'cellChoose' // 装得下：dp[i][w]=max(不取=上格, 取=左上偏移格+价值)
  | 'done'; // 右下角 = 最大价值
```

MatrixView/MatrixTrack **零改动**（C-053 的 rowLabels/colLabels/emptyText 已够用）。

## 3. 数据与 DP 表（`knapsack.ts`）

```
物品（0-indexed）：A(重2,值3) B(重3,值4) C(重4,值5) D(重5,值6)。容量 CAPACITY=5。
dp[i][w] = 前 i 件物品、容量 w 时的最大价值。DP 表 (m+1)×(W+1) = 5×6。
边界：dp[0][w]=0（无物品）、dp[i][0]=0（无容量）。
递推：weight[i-1] > w → dp[i][w]=dp[i-1][w]（装不下，不取）；
      否则 dp[i][w]=max(dp[i-1][w], dp[i-1][w-weight[i-1]] + value[i-1])（不取 vs 取）。
```

**终态 DP 表**（行 ∅ABCD × 列容量 0-5）：

| 物品\容量 | 0   | 1   | 2   | 3   | 4   | 5   |
| --------- | --- | --- | --- | --- | --- | --- |
| ∅         | 0   | 0   | 0   | 0   | 0   | 0   |
| A(2,3)    | 0   | 0   | 3   | 3   | 3   | 3   |
| B(3,4)    | 0   | 0   | 3   | 4   | 4   | 7   |
| C(4,5)    | 0   | 0   | 3   | 4   | 5   | 7   |
| D(5,6)    | 0   | 0   | 3   | 4   | 5   | 7   |

最优值 = dp[4][5] = **7**（选 A+B：重 2+3=5、值 3+4=7）。#cellSkip=10、#cellChoose=10（各内部格按 weight≤w 分）。

## 4. 算法模块 `knapsack.module.ts`

- init：dp[0][*]=0、dp[\*][0]=0，内部格 null；rowLabels=['∅','A','B','C','D']、colLabels=['0'..'5']、emptyText=''。
- for i=1..m、for w=1..W：active=(i,w)；
  - weight[i-1] > w → dp[i][w]=dp[i-1][w]，emit `cellSkip`（sources=[(i-1,w)]〈上格〉）。
  - 否则 skip=dp[i-1][w]、take=dp[i-1]w-weight[i-1]]+value[i-1]；dp[i][w]=max(skip,take)，emit `cellChoose`（sources=[(i-1,w),(i-1,w-weight[i-1])]〈上格 + 左上偏移格〉）。updatedCell=(i,w)。
- done：caption 含最优值 7。
- 每步：`array:[]`、`vars`（当前物品〈重,值〉/容量、不取值/取值、取 max）、`matrix`、`point`、`caption`。
- 步数：init 1 + 20 内部格 + done 1 = **22 步**。

## 5. oracle + sources

```ts
// knapsack.ts
export const WEIGHTS=[2,3,4,5], VALUES=[3,4,5,6], CAPACITY=5, ITEM_LABELS=['A','B','C','D'];
export function knapsackTrace(): number[][] { ... 二维 DP ... }  // 终态表，右下角=7
```

sources 4 语言：标准 0-1 背包二维 DP（双层循环 + 取舍 max）。TS lineMap `{ init, cellSkip, cellChoose, done }`；python/go/rust 逐行核对。

## 6. 接线与改动面

| 文件                                              | 类型     | 改动                                                       |
| ------------------------------------------------- | -------- | ---------------------------------------------------------- |
| `src/components/player/types.ts`                  | 改       | +KnapsackExecPoint（唯一框架改动）                         |
| `src/algorithms/knapsack.{module,,sources}.ts`    | **新增** | module + 物品/oracle + 4 语言                              |
| `src/algorithms/knapsack.module.spec.ts`          | **新增** | TC-KNAP-MOD-\*                                             |
| `src/views/Article/Algorithm/Knapsack.vue` + spec | **新增** | 新页 + TC-VIEW-KNAP-\*                                     |
| `e2e/knapsack.e2e.ts`                             | **新增** | TC-E2E-KNAP-01                                             |
| `src/assets/knapsack.svg`                         | **新增** | 首页图标                                                   |
| `src/router/index.ts`                             | 改       | +路由 /docs/knapsack                                       |
| `src/views/Docs/Menu/hooks.ts` + spec             | 改       | 动态规划 +0-1 背包；TC-HOOK-02-1 分类 1→2                  |
| `src/views/Home/Main/hooks.ts` + spec             | 改       | 动态规划 +0-1 背包（+KnapsackIcon）；TC-HOOK-01-1 分类 1→2 |

**零改动**：MatrixView.vue（+spec）/ MatrixTrack / 编辑距离 / Floyd / 既有 8 轨 / 6 图算法 / 15 排序 / 15 结构。

## 7. 向后兼容论证

- `KnapsackExecPoint` 追加；MatrixView/MatrixTrack 零改动（复用 rowLabels/colLabels/emptyText）。
- 动态规划分类加项 → 仅 TC-HOOK-01-1/02-1（动态规划 children 1→2）；顶层分类数仍 4，其余 TC-HOOK 不变。
- MatrixView 第 3 消费者（Floyd 方阵 + 编辑距离字符串轴 + 0-1 背包数值轴）——零改动佐证矩阵原语通用。

## 8. 测试策略（详见 test-cases.md）

- **L3 knapsack.module**：末步 cells = oracle knapsackTrace()（右下角 7）；每步带 matrix + array:[]；#cellSkip=10、#cellChoose=10；init 边界 0 + 内部 null；cellSkip sources 单个上格；cellChoose sources 长度 2；rowLabels/colLabels/emptyText 正确；写一次不变量；4 语言行号；元信息。
- **L4 视图**：TC-VIEW-KNAP-01 Article+Player；-02 h1「背包」+MatrixView+30 单元+无 .bars-view；-03 全模板同屏。
- **L4 TC-HOOK**：01-1/02-1 动态规划 2 项、url 含 knapsack。
- **L5 e2e**：TC-E2E-KNAP-01 /docs/knapsack → .matrix-view + 30 单元；拖末步右下角=7 + caption；Shiki。
- **复用/回归**：MatrixView + 编辑距离 + Floyd + 8 轨 Case 零改动全绿。
