# 实现记录：最长公共子序列 LCS（C-20260703-060，填表 + 回溯）

> Status: verified
> Stable ID: C-20260703-060
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 MatrixView 扩展 pathCells**：types.ts +`MatrixTrack.pathCells?`、+`LcsExecPoint`；先 MatrixView.spec 追加 TC-VIZ-MATRIXVIEW-07 跑红 → MatrixView.vue 加 `.mx-path` 渲染跑绿。
2. **T1 module + oracle + sources**（L3）：先 lcs.module.spec（TC-LCS-MOD-01..12）跑红 → lcs.{ts,sources.ts,module.ts}（填表 + 回溯 DFS 重走）跑绿。
3. **T2 新页 + 接线**：Lcs.vue（Article + AlgorithmPlayer）；路由 /docs/lcs；菜单 + 首页「动态规划」第 3 项（新 lcs.svg）；改 TC-HOOK-01-1/02-1（动态规划 children +lcs）；Lcs.spec + lcs.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap DP 第 3 页）→ 两提交 → 双轨部署（一并重试 Pages）。

## 关键实现笔记

- **T0 扩展 MatrixView（additive）**：types.ts +`MatrixTrack.pathCells?` + `LcsExecPoint`；`MatrixView.vue` `cellOf` 加 `'mx-path'`（`.mx-path` = 绿环 `box-shadow`，区别于 `.mx-active` 琥珀环、`.mx-updated` 绿填充）。编辑距离/背包/Floyd 不设 `pathCells` → 无 `.mx-path`，既有 `TC-VIZ-MATRIXVIEW-01..06` 全绿；新增 TC-VIZ-MATRIXVIEW-07。**AlgorithmPlayer.vue 零改动**（matrix v-if 既有）。
- **T1 module + oracle + sources**：`lcs.ts`（X=`ABCD`/Y=`ACDF` + `lcsDp` 完整表 + `lcsLength`=3 + `lcsPath` 回溯路径 + `lcsString`='ACD'）+ `lcs.sources.ts`（4 语言 LCS 填表 + 回溯 + lineMap）+ `lcs.module.ts`（两阶段 DFS 重走：填表 init/**match**〈相同左上+1〉/**mismatch**〈不同 max 上左〉/fillDone、回溯 **trace**〈pathCells 累积绿环、匹配收字符〉/done）。**24 步**（init 1 + 填 16 + fillDone 1 + trace 5 + done 1）。
- **T2 新页 + 接线**：Lcs.vue（Article 正文：子序列 vs 子串、二维 DP 相同取左上+1/不同取上左最大、填表求长度 + **回溯恢复解**、diff/DNA 应用、与编辑距离对照 + AlgorithmPlayer）；路由 `/docs/lcs`；菜单 + 首页「动态规划」第 3 项（新 `lcs.svg`：两串 + 公共子序列连线图标）；改 TC-HOOK-01-1/02-1（动态规划 children → `['edit-distance','knapsack','lcs']`）。

### 坑点

- 无坑。MatrixView 剪枝 1 + lcs.module 12 首跑即绿。回溯用与 `lcsPath()`/`lcsString()` 同构逻辑（相同走对角收字符、否则 `up>=left` 走上否则左），`pathCells` 与 oracle 一致；填表 snapshot 保证 match/mismatch 步取值可断言。
- **MatrixView 第 4 消费者·从填表延伸到填表+回溯**：Floyd（方阵）/编辑距离（字符轴 min）/背包（数值轴 max）三验后，LCS 首次用 `pathCells` 演示「回溯恢复解」。矩阵轨复用力再获验证；播放器可插拔轨仍 11 条。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：162 文件 **1163 passed**（+16：MatrixView 回溯路径 1 + lcs.module 12 + Lcs 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.71% / Branch 93.9% / Func 94.64% / Line 95.39%**。既有轨/页零回归（MatrixView additive 扩展）。
- **e2e**：Playwright **52 passed**（+1 TC-E2E-LCS-01）。
- **真机自检**（Playwright 脚本，`/docs/lcs`）：
  - 首步——25 单元、无 `.bars-view`、counter `1 / 24`、Shiki **212 token**、字幕「边界：空串与任何串的 LCS 长度为 0」。
  - 填满步（第 17 步）——右下角 = `3`（LCS 长度）、字幕「填完！右下角 = LCS 长度 = 3；接下来从右下角回溯恢复出 LCS」。
  - 末步——counter `24`、**mx-path=5**（回溯路径 5 格绿环）、字幕「回溯完成：最长公共子序列 LCS = ACD（长度 3）」。
- **零回归**：既有 11 轨 + 6 图算法 + 编辑距离 + 背包 + 回溯 5 页 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 扩展 MatrixView（+pathCells/`.mx-path` 回溯路径 + TC-VIZ-MATRIXVIEW-07）+ T1 lcs.module（填表 + 回溯 24 步，LCS=ACD）+ T2 新页 Lcs.vue + 「动态规划」第 3 项 + 路由/菜单/首页接线 + TC-HOOK（动态规划 children +lcs）。**MatrixView 第 4 消费者·DP 从填表求值延伸到填表+回溯求解。**门禁全绿（单测 1163 / e2e 52 / 覆盖率 94.71%）；真机 24 步、填满 dp=3、回溯恢复 LCS=ACD（路径 5 格绿）。**M6 动态规划第 3 页达成。**
