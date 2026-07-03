# 实现记录：最长递增子序列 LIS（C-20260703-061，一维 DP）

> Status: verified
> Stable ID: C-20260703-061
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T1 module + oracle + sources**（L3，复用 MatrixView 零改动）：types.ts +`LisExecPoint`（无新轨）；先 lis.module.spec（TC-LIS-MOD-01..12）跑红 → lis.{ts,sources.ts,module.ts}（一维 DP 两行表重走）跑绿。
2. **T2 新页 + 接线**：Lis.vue（Article + AlgorithmPlayer）；路由 /docs/lis；菜单 + 首页「动态规划」第 4 项（新 lis.svg）；改 TC-HOOK-01-1/02-1（动态规划 children +lis）；Lis.spec + lis.e2e。
3. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap DP 第 4 页）→ 两提交 → 双轨部署（主站；Pages 待冷却）。

## 关键实现笔记

- **零新轨·复用 MatrixView 两行表**：types.ts 仅 +`LisExecPoint`（无新轨、无 Step 新字段、MatrixView.vue / AlgorithmPlayer.vue 零改动）。把一维 dp 数组画成 `2×n` 矩阵（行 0=输入值静态、行 1=dp 逐格填），复用 `active`（当前 dp[i] 琥珀）/`sources`（回看 [0,i]/[0,j]/[1,j] 黄）/`updatedCell`（绿闪）/`pathCells`（C-060 加，绿环高亮 LIS）。第 5 消费者。
- **T1 module + oracle + sources**：`lis.ts`（`LIS_INPUT=[1,3,2,4,3,5]` + `lisDp` 含 pred + `lisLength`=4 + `lisIndices`=`[0,1,3,5]` + `lisValues`=`[1,3,4,5]`）+ `lis.sources.ts`（4 语言 O(n²) DP + pred 回溯 + lineMap）+ `lis.module.ts`（逐格重走：init〈dp 全 1〉/scan〈回看不更新〉/extend〈dp[i]=dp[j]+1 绿闪〉/fillDone〈max dp = 长度〉/result〈pred 回溯 pathCells 高亮 LIS〉）。**18 步**（init 1 + 15 对 scan/extend + fillDone 1 + result 1）。
- **T2 新页 + 接线**：Lis.vue（Article 正文：递增子序列、一维 DP dp[i] 回看前面所有 dp[j]、max(dp)=答案 + 回溯恢复、与 LCS/二维 DP 对照、O(n log n) 带过 + AlgorithmPlayer）；路由 `/docs/lis`；菜单 + 首页「动态规划」第 4 项（新 `lis.svg`：递增柱 + LIS 上升折线）；改 TC-HOOK-01-1/02-1（动态规划 children +lis）。

### 坑点

- 无坑。lis.module 12 首跑即绿。dp 行初值全 1、extend 时增大并记 pred；scan 步不设 updatedCell（MOD-06）；result 的 pathCells 用 pred 回溯得 `[0,1,3,5]` 与 `lisIndices()` 一致。
- **DP 四页形态齐**：编辑距离/背包/LCS（二维表）+ LIS（一维数组）。MatrixView 五验（Floyd 方阵 / 编辑距离字符轴 / 背包数值轴 / LCS 回溯路径 / LIS 两行表），矩阵轨通用力再获验证；播放器可插拔轨仍 11 条。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：164 文件 **1178 passed**（+15：lis.module 12 + Lis 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.78% / Branch 94.05% / Func 94.66% / Line 95.44%**。MatrixView / AlgorithmPlayer 零改动。
- **e2e**：Playwright **53 passed**（+1 TC-E2E-LIS-01）。
- **真机自检**（Playwright 脚本，`/docs/lis`）：
  - 首步——12 单元（2×6）、无 `.bars-view`、counter `1 / 18`、Shiki **165 token**、字幕「每个元素自身是长度 1 的递增子序列：dp 全部初始化为 1」。
  - 填满步（第 16 步）——字幕「dp 填完，最大 dp = 4 = LIS 长度（在 a[5]=5 结尾）」。
  - 末步——counter `18`、**mx-path=4**（LIS 4 格绿环）、字幕「回溯 pred 恢复：最长递增子序列 LIS = 1→3→4→5（长度 4）」。
- **零回归**：既有 11 轨 + 6 图算法 + 编辑距离 + 背包 + LCS + 回溯 5 页 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。types +LisExecPoint（零新轨）+ lis.module（一维 DP 两行表 18 步，LIS=1→3→4→5）+ 新页 Lis.vue + 「动态规划」第 4 项 + 路由/菜单/首页接线 + TC-HOOK（动态规划 children +lis）。**MatrixView 第 5 消费者·DP 补一维数组形态（四页形态齐）。**门禁全绿（单测 1178 / e2e 53 / 覆盖率 94.78%）；真机 18 步、填满 dp=4、回溯恢复 LIS 4 格绿。**M6 动态规划第 4 页达成。**
