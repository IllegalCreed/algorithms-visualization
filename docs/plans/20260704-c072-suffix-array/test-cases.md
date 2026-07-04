# 测试用例：后缀数组（C-20260704-072，倍增法 · 新建 SuffixArrayView）

> Status: verified
> Stable ID: C-20260704-072
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（suffixarray.module）/ L4（SuffixArrayView + 播放器接线 + SuffixArray 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-SAVIEW-*`、`TC-PLAYER-SA-*`、`TC-SA-MOD-*`、`TC-VIEW-SA-*`、`TC-E2E-SA-01`；**改** `TC-HOOK`（字符串 children）

## L4 —— `SuffixArrayView` 后缀轨（`src/components/SuffixArrayView.spec.ts`，新增）

| 用例 ID          | 场景       | 期望                                                                        |
| ---------------- | ---------- | --------------------------------------------------------------------------- |
| TC-VIZ-SAVIEW-01 | 后缀行渲染 | `s="banana"`,`order=[5,3,1,0,4,2]` → 6 `.sa-row`，首行后缀文本以 `a` 开头   |
| TC-VIZ-SAVIEW-02 | 起点下标   | 每行 `.sa-index` 文本 = 对应 `order[row]`（起点下标）                       |
| TC-VIZ-SAVIEW-03 | 阶段高亮   | `phase='sort'` → 有 `.sa-key-active`；`phase='rank'` → 有 `.sa-rank-active` |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID         | 场景                | 期望                                            |
| --------------- | ------------------- | ----------------------------------------------- |
| TC-PLAYER-SA-01 | step 带 suffixArray | 当前步含 `suffixArray` → 渲染 `SuffixArrayView` |
| TC-PLAYER-SA-02 | 零回归              | 排序 step 无 `suffixArray` → 不渲染             |

## L3 —— `suffixarray.module`（`src/algorithms/suffixarray.module.spec.ts`）

固定 `"banana"`；oracle `suffixArray()`=`[5,3,1,0,4,2]`。

| 用例 ID      | 场景              | 期望                                                                              |
| ------------ | ----------------- | --------------------------------------------------------------------------------- |
| TC-SA-MOD-01 | 末步 done + sa    | 末步 `done`、`suffixArray.done`；末步 `order` = `suffixArray()` = `[5,3,1,0,4,2]` |
| TC-SA-MOD-02 | 步合法 + 带后缀轨 | 每步 `point ∈ {init,sort,rank,done}` 且带 `suffixArray`、`array===[]`             |
| TC-SA-MOD-03 | 原串不变          | 每步 `suffixArray.s` === `"banana"`                                               |
| TC-SA-MOD-04 | 终态字典序        | 末步 `order` 对应后缀按字典序升序（相邻后缀前者 ≤ 后者）                          |
| TC-SA-MOD-05 | order 恒为排列    | 每步 `order` 是 `0..n-1` 的一个排列（无重复、齐全）                               |
| TC-SA-MOD-06 | rank 值域合法     | 每步 `rank` 每个值 ∈ `[0, n-1]`；末步 `rank` 为 `0..n-1` 全不同                   |
| TC-SA-MOD-07 | 倍增 k 翻倍       | `rank` 步之间 `k` 依次为 1,2,…（每轮 ×2）                                         |
| TC-SA-MOD-08 | sort 阶段标记     | 每个 `sort` 步 `phase==='sort'`；每个 `rank` 步 `phase==='rank'`                  |
| TC-SA-MOD-09 | 收敛即止          | 一旦 `rank` 全不同即停（末步 `k` ≤ n）                                            |
| TC-SA-MOD-10 | vars 展示         | 某步 vars 文本含原串 `banana` 与当前 sa                                           |
| TC-SA-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                     |
| TC-SA-MOD-12 | module 元信息     | `title` 含「后缀数组」；`initialInput()` = `[]`                                   |

## L4 —— `SuffixArray` 视图（`src/views/Article/Algorithm/SuffixArray.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                       |
| ------------- | ------------- | ---------------------------------------------------------- |
| TC-VIEW-SA-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                         |
| TC-VIEW-SA-02 | 后缀轨        | h1 含「后缀数组」；渲染 `SuffixArrayView`；无 `.bars-view` |
| TC-VIEW-SA-03 | 全模板同屏    | 正文含「倍增」+ SuffixArrayView 同屏                       |

## L4 —— TC-HOOK（字符串第 5 项）

| 用例 ID | 改动                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[5]`（字符串）children url = `['kmp','rabin-karp','boyer-moore','manacher','suffix-array']` |

## L5 —— 后缀数组页 e2e（`e2e/suffix-array.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                         | 期望                                                                                                                                                            |
| ------------ | ------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-SA-01 | 全模板 + 互动 | 访问 `/docs/suffix-array`；`.scrub` 拖到末步 | 正文 `.article h1` 含「后缀数组」；`.suffix-array-view` 可见；6 `.sa-row`；无 `.bars-view`；拖末步首行后缀以 `a` 开头 + caption 含 `sa`/`定型`；真机 Shiki 着色 |

## 回归

- 既有 14 轨 + 7 图算法 + 6 DP + 回溯 8 页 + 字符串 4 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **SuffixArrayView 为新增独立轨**：其它算法不设 `Step.suffixArray` → 不渲染，`TC-PLAYER-*` 既有断言与所有算法零回归；AlgorithmPlayer 仅加一行 `v-if`。
- TC-HOOK 其余不变；仅字符串 children 追加 `suffix-array`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1371 用例全绿**；`pnpm exec playwright test suffix-array manacher` → **2/2 绿**。
- **本单新增 21 Case 全绿**：`TC-VIZ-SAVIEW-01..03`（L4）3 + `TC-PLAYER-SA-01/02`（L4）2 + `TC-SA-MOD-01..12`（L3）12 + `TC-VIEW-SA-01..03`（L4）3 + `TC-E2E-SA-01`（L5）1；**改** `TC-HOOK`（字符串 children +suffix-array）menu+home 各 1。
- **关键断言实测**：末步 done + sa=suffixArray()=[5,3,1,0,4,2]（TC-SA-MOD-01）；终态字典序（TC-04）；order 恒为排列（TC-05）；末步 rank 全不同（TC-06）；rank 步 k 依次 1,2（TC-07）；sort/rank phase（TC-08）。
- **真机自检**：后缀表字典序、rank 全不同、关键字 ∞，与设计一致。
- **覆盖**：statements 95.32% / branches 94.85%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；21 Case + 改 2 HOOK 全绿。
