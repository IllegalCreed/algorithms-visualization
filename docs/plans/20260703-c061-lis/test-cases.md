# 测试用例：最长递增子序列 LIS（C-20260703-061，一维 DP）

> Status: verified
> Stable ID: C-20260703-061
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（lis.module）/ L4（Lis 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-LIS-MOD-*`、`TC-VIEW-LIS-*`、`TC-E2E-LIS-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`
> 复用：MatrixView 零改动（其 `TC-VIZ-MATRIXVIEW-*` 已覆盖，本变更不新增 viz-engine 用例）

## L3 —— `lis.module`（`src/algorithms/lis.module.spec.ts`）

固定输入 `[1,3,2,4,3,5]`；oracle `lisLength`/`lisIndices`/`lisValues`。

| 用例 ID       | 场景               | 期望                                                                          |
| ------------- | ------------------ | ----------------------------------------------------------------------------- |
| TC-LIS-MOD-01 | fillDone = 长度    | `fillDone` 步 dp 行最大值 = `lisLength()` = 4                                 |
| TC-LIS-MOD-02 | 步合法 + 带矩阵轨  | 每步 `point ∈ {init,scan,extend,fillDone,result}` 且带 `matrix`、`array===[]` |
| TC-LIS-MOD-03 | 两行表维度         | 矩阵 2 行 × n 列（值行 + dp 行）；rowLabels 含「值」「dp」                    |
| TC-LIS-MOD-04 | init dp 全 1       | `init` 步 dp 行（行 1）全 = 1                                                 |
| TC-LIS-MOD-05 | extend 取 dp[j]+1  | 每个 `extend` 步 active=[1,i]，更新后 dp[i] = 该步某 dp[j]+1 且比更新前大     |
| TC-LIS-MOD-06 | scan 不更新        | 每个 `scan` 步 dp[i] 与前一步相比不变（未 extend）                            |
| TC-LIS-MOD-07 | result = LIS       | 末步 `result`；caption/vars 含 `lisValues()` 连接 `1→3→4→5`                   |
| TC-LIS-MOD-08 | result 高亮 LIS    | `result` 步 `pathCells` 对应 `lisIndices()` = `[0,1,3,5]`（值行）             |
| TC-LIS-MOD-09 | dp 最终 = oracle   | 末步 dp 行 = `lisDp().dp` = `[1,2,2,3,3,4]`                                   |
| TC-LIS-MOD-10 | 存在 scan + extend | `#scan >= 1` 且 `#extend >= 1`                                                |
| TC-LIS-MOD-11 | 四语言 + 行号      | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                 |
| TC-LIS-MOD-12 | module 元信息      | `title` 含「递增子序列」或「LIS」；`initialInput()` = `[]`                    |

## L4 —— `Lis` 视图（`src/views/Article/Algorithm/Lis.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                                    |
| -------------- | ------------- | ------------------------------------------------------- |
| TC-VIEW-LIS-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                      |
| TC-VIEW-LIS-02 | 矩阵轨        | h1 含「递增子序列」；渲染 `MatrixView`；无 `.bars-view` |
| TC-VIEW-LIS-03 | 全模板同屏    | Article 含「递增子序列」+ MatrixView 同屏               |

## L4 —— TC-HOOK（动态规划第 4 项）

| 用例 ID      | 改动                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| TC-HOOK-01-1 | Home：`data[3]`「动态规划」children url = `['edit-distance','knapsack','lcs','lis']` |
| TC-HOOK-02-1 | Menu：同上                                                                           |

## L5 —— LIS 页 e2e（`e2e/lis.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                | 期望                                                                                                                                                                   |
| ------------- | ------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-LIS-01 | 全模板 + 互动 | 访问 `/docs/lis`；`.scrub` 拖到末步 | 正文 `.article h1` 含「递增子序列」；`.matrix-view` 可见；12 `.matrix-cell`；无 `.bars-view`；拖末步 ≥4 `.mx-path`（LIS 高亮）+ caption 含「1→3→4→5」；真机 Shiki 着色 |

## 回归

- 既有 11 轨 + 6 图算法 + 编辑距离 + 背包 + LCS + 回溯 5 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **MatrixView.vue / AlgorithmPlayer.vue 零改动**（本变更纯复用矩阵轨两行表）。
- TC-HOOK 其余不变；仅 -01-1/-02-1 动态规划 children 追加 `lis`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 164 文件 1178 passed** / **e2e 53 passed**。
  - 新增 Case 全绿：lis.module 12（LIS-MOD-01..12，含 extend 取 dp[j]+1 MOD-05、scan 不更新 MOD-06、result pathCells=lisIndices MOD-08、末步 dp=oracle MOD-09）、Lis 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（动态规划 children +lis）。
  - **一次通过**：lis.module 12 首跑即绿（一维 DP 与 oracle 一致，LIS=1→3→4→5）；无坑。
  - **MatrixView 零改动复用**：本变更不新增 viz-engine 用例，其 `TC-VIZ-MATRIXVIEW-*` 不变全绿。
- 覆盖率：**Stmt 94.78% / Branch 94.05% / Func 94.66% / Line 95.44%**（聚合，超门槛 70/60）。MatrixView / AlgorithmPlayer 零改动。
- 真机自检（Playwright 脚本 `/docs/lis`）：首步 12 单元（2×6）+ 无 `.bars-view` + `1 / 18` + Shiki 165 token + 字幕「每个元素自身是长度 1 的递增子序列：dp 全部初始化为 1」；填满步（第 16 步）字幕「dp 填完，最大 dp = 4 = LIS 长度（在 a[5]=5 结尾）」；末步 `18` + **mx-path=4**（LIS 4 格绿环）+ 字幕「回溯 pred 恢复：最长递增子序列 LIS = 1→3→4→5（长度 4）」。
- 结论：**通过**。三件套齐全；**MatrixView 第 5 消费者·DP 补一维数组形态**（两行表复用，零新轨零改动）；一维 dp 回看前面 + 恢复解清晰；编辑距离/背包/LCS 零回归。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。16 Case 全绿（module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 18 步、填满 dp=4、回溯恢复 LIS 4 格绿。
