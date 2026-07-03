# 实现记录：Rabin-Karp 字符串匹配（C-20260703-063，滚动哈希）

> Status: verified
> Stable ID: C-20260703-063
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 KmpView 扩展 windowStart**：types.ts +`KmpTrack.windowStart?`、+`RabinKarpExecPoint`；先 KmpView.spec 追加 TC-VIZ-KMPVIEW-05 跑红 → KmpView.vue 加 `.kmp-window` + 空 LPS 隐 π 行跑绿。
2. **T1 module + oracle + sources**（L3）：先 rabinkarp.module.spec（TC-RK-MOD-01..12）跑红 → rabinkarp.{ts,sources.ts,module.ts}（滚动哈希 + 验证重走）跑绿。
3. **T2 新页 + 接线**：RabinKarp.vue（Article + AlgorithmPlayer）；路由 /docs/rabin-karp；菜单 + 首页「字符串」第 2 项（新 rabinkarp.svg）；改 TC-HOOK-01-1/02-1（字符串 children +rabin-karp）；RabinKarp.spec + rabin-karp.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 字符串第 2 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 复用 KmpView + windowStart 扩展**：types.ts +`KmpTrack.windowStart?` + `RabinKarpExecPoint`；`KmpView.vue` additive 加 `.kmp-window`（`windowStart ≤ idx < windowStart+m` 浅蓝窗口带）+ π(LPS) 行 `v-if="kmp.lps.length"`（Rabin-Karp `lps=[]` → 隐藏）。KMP（有 LPS、不设 windowStart）零回归；新增 TC-VIZ-KMPVIEW-05。**AlgorithmPlayer.vue 零改动**（kmp v-if 既有）。字符串匹配轨第 2 消费者。
- **T1 module + oracle + sources**：`rabinkarp.ts`（T=`abcabcab`/P=`cab` + `rkHash`〈多项式 B=10/M=997〉 + `rkWindowHashes`=`[123,231,312,123,231,312]` + `rkMatches`=`[2,5]`）+ `rabinkarp.sources.ts`（4 语言滚动哈希 + 验证 + lineMap）+ `rabinkarp.module.ts`（逐窗口重走：start 算模式哈希、skip〈哈希≠〉、hashHit〈哈希=〉→verify→found；`windowStart=offset=i`、`lps=[]`）。**12 步**（start 1 + skip 4 + hashHit/verify/found×2〈6〉+ done 1）。
- **T2 新页 + 接线**：RabinKarp.vue（Article 正文：哈希把子串压成数、滚动 O(1) 更新、哈希冲突需验证、与 KMP 对照、多模式/重复子串/指纹应用 + AlgorithmPlayer）；路由 `/docs/rabin-karp`；菜单 + 首页「字符串」第 2 项（新 `rabinkarp.svg`：# + 滑窗）；改 TC-HOOK-01-1/02-1（字符串 children → `['kmp','rabin-karp']`）。

### 坑点

- 无坑。KmpView 窗口 1 + rabinkarp.module 12 首跑即绿。本例（T=abcabcab/P=cab）哈希命中的窗口（下标 2、5）均为真匹配、无偶发冲突，故 hashHit 后直接 verify+found；冲突/双哈希在正文讲（非目标）。窗口哈希由 `rkWindowHashes()[windowStart]` 断言（MOD-07/08）。
- **字符串匹配轨复用验证成功**：KmpView 服务 KMP（π 行 + 逐字符跳转）+ Rabin-Karp（窗口带 + 哈希，π 行隐藏）两算法；播放器可插拔轨仍 12 条。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：169 文件 **1215 passed**（+16：KmpView 窗口 1 + rabinkarp.module 12 + RabinKarp 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.81% / Branch 94.05% / Func 94.67% / Line 95.43%**。既有轨/页零回归（KmpView additive 扩展）。
- **e2e**：Playwright **55 passed**（+1 TC-E2E-RK-01）。
- **真机自检**（Playwright 脚本，`/docs/rabin-karp`）：
  - 首步——文本 8 格、模式 3 格、**LPS 0 格（π 行已隐）**、**窗口 3 格高亮**、无 `.bars-view`、counter `1 / 12`、Shiki **248 token**。
  - 哈希命中步（第 3 步）——字幕「窗口 [2,5) 哈希 312 = 模式哈希 312：可能匹配，需逐字符验证（防哈希冲突）」。
  - 末步——counter `12`、**kmp-found=6**（2 命中×3 字符高亮）、字幕「文本扫描完毕：共命中 2 处（下标 2, 5）」。
- **零回归**：既有 12 轨 + 6 图算法 + 4 DP + 回溯 5 页 + KMP + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 复用 KmpView + windowStart 扩展（+TC-VIZ-KMPVIEW-05）+ T1 rabinkarp.module（滚动哈希 12 步）+ T2 新页 RabinKarp.vue + 「字符串」第 2 项 + 路由/菜单/首页接线 + TC-HOOK（字符串 children +rabin-karp）。**字符串匹配轨第 2 消费者·滚动哈希 vs KMP 前缀函数对照。**门禁全绿（单测 1215 / e2e 55 / 覆盖率 94.81%）；真机 12 步、无 π 行、窗口滑动、命中 [2,5]。**M6 字符串第 2 页达成。**
