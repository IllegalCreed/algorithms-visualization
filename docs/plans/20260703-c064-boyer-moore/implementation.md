# 实现记录：Boyer-Moore 字符串匹配（C-20260703-064，坏字符规则）

> Status: verified
> Stable ID: C-20260703-064
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 KmpView 扩展 matchedFrom**：types.ts +`KmpTrack.matchedFrom?`、+`BoyerMooreExecPoint`；先 KmpView.spec 追加 TC-VIZ-KMPVIEW-06 跑红 → KmpView.vue 模式格后缀高亮跑绿。
2. **T1 module + oracle + sources**（L3）：先 boyermoore.module.spec（TC-BM-MOD-01..12）跑红 → boyermoore.{ts,sources.ts,module.ts}（右往左 + 坏字符跳重走）跑绿。
3. **T2 新页 + 接线**：BoyerMoore.vue（Article + AlgorithmPlayer）；路由 /docs/boyer-moore；菜单 + 首页「字符串」第 3 项（新 boyermoore.svg）；改 TC-HOOK-01-1/02-1（字符串 children +boyer-moore）；BoyerMoore.spec + boyer-moore.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 字符串第 3 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **复用 KmpView 第 3 消费者（additive）**：仅新增 `KmpTrack.matchedFrom?`（已匹配后缀起点：`pattern[matchedFrom..m)` 标绿）。KMP/RK 不设 → `matched()` 只看既有前缀 `matchedLen`，零回归；`patCells` 判定改为 `idx < matchedLen || (matchedFrom != null && idx >= matchedFrom)`。窗口带沿用 C-063 `windowStart`、空 `lps` 隐 π 行——BM 三特性全部落在既有轨上，`KmpView.vue` 仅一处 computed 微调，`AlgorithmPlayer.vue` 零改动。
- **oracle 与 module 分离**：`boyermoore.ts` 存固定 `BM_TEXT='abcabxabc'`/`BM_PATTERN='abc'` + `bmLast()`（坏字符表 `{a:0,b:1,c:2}`）+ `bmMatches()`（→ `[0,6]`）作真值；`boyermoore.module.ts` 的 `buildBoyerMooreSteps()` 独立重走并逐帧 emit，spec 双向对拍（末步 `found === bmMatches()`）。
- **右往左 + 坏字符跳细粒度重走**：外层 `while s<=n-m`，内层 `j=m-1` 递减比较，逐字符 emit `match`（`matchedFrom=j`，后缀绿渐长）；`j<0` emit `found`（`matchedFrom=0`，整段绿）后 `s+=1`；失配 emit `badChar`（`matchedFrom=j+1`），坏字符 `bc=t[s+j]`、`shift=max(1, j-(last[bc]??-1))`，字幕分「在模式里小跳」/「不在模式里跳过整段」两态。共 12 步：start·match×3·found·badChar('a' 跳 2)·badChar('x' 跳 3)·match×3·found·done。
- **四语言 sources**：TS/Python/Go/Rust，`lineMap` 对齐 `start/match/badChar/found/done` 五执行点；Go/Rust 显式处理坏字符缺省 `-1`。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓（0 warning）/ `type-check`（vue-tsc）✓ / `test:unit run --coverage` **1231/1231 全绿**、聚合 statements 94.86% · branches 94.13% · functions 94.65% · lines 95.48%（远超 70/60/70/70 门槛）；`boyermoore.module.ts` 100%/95%/100%/100%（未覆盖仅「未找到」分支，本用例恒命中，合理），`boyermoore.ts`/`.sources.ts` 满覆盖（v8 text 隐藏）。
- **e2e（真机 Playwright/Chromium）**：`boyer-moore` + 回归 `rabin-karp` + `kmp` **3/3 通过**——文本 9 格、无 π 行、第 0 步窗口带 3 格、Shiki 着色、拖末步命中高亮 + 「命中」字幕。
- **真机视觉自检（2 图眼验）**：第 4/12 步——模式三格全绿（`matchedFrom=0` 后缀「abc」）+ 绿「✓ 匹配」+ 窗口带罩首 3 格 + 比较指针左移到 P[0]；第 7/12 步——模式最右格 c 高亮对比文本 x（**证实从右往左比**）+ 红「✗ 失配」+ 字幕「坏字符 'x' 不在模式中，右移 3 格（跳过整段）」（**大跳**）。命中 [0,6] 与 oracle 一致。
- **回归**：KMP/Rabin-Karp 页与 `TC-VIZ-KMPVIEW-01..05`/`TC-PLAYER-KMP-*` 不变全绿；仅 `TC-HOOK-01-1/02-1` 字符串 children 追加 `boyer-moore`。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；17 Case 全绿 + 双轨部署。
