# 实现记录：KMP 字符串匹配（C-20260703-062，KmpView 新轨）

> Status: verified
> Stable ID: C-20260703-062
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 KmpView**：types.ts +KmpTrack/Step.kmp?/KmpExecPoint；AlgorithmPlayer +`<KmpView v-if>`；先 KmpView.spec（TC-VIZ-KMPVIEW-01..04）+ AlgorithmPlayer.spec（TC-PLAYER-KMP-01/02）跑红 → KmpView.vue 跑绿。
2. **T1 module + oracle + sources**（L3）：先 kmp.module.spec（TC-KMP-MOD-01..12）跑红 → kmp.{ts,sources.ts,module.ts}（匹配循环重走 + 预置 LPS）跑绿。
3. **T2 新页 + 开新大类**：Kmp.vue（Article + AlgorithmPlayer）；路由 /docs/kmp；菜单 + 首页各加第 6 顶层大类「字符串」（新 kmp.svg）；改 TC-HOOK-01-1/02-1（顶层分类 5→6）；Kmp.spec + kmp.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 字符串大类首发）→ 两提交 → 双轨部署（主站；Pages 待解卡）。

## 关键实现笔记

- **T0 新建第 12 条 KmpView 字符串匹配轨**：types.ts +`KmpTrack`（text/pattern/lps/offset/matchedLen/compareText/comparePat/lpsActive/status/found）+ `Step.kmp?` + `KmpExecPoint`；AlgorithmPlayer +import + `<KmpView v-if="current.kmp">`（同既有 11 轨可插拔，既有轨零改动）。`KmpView.vue` 三行字符格（借鉴 BoardView/MazeView）：文本行 + 模式串行（`margin-left = offset*PITCH` 滑动对齐）+ LPS(π) 行；`.kmp-compare`（琥珀）/`.kmp-matched`（已匹配前缀绿）/`.kmp-found`（命中区间浅绿）/`.kmp-lps-active`（跳转用到的 π 格琥珀）+ 状态徽标。TC-VIZ-KMPVIEW 4 + TC-PLAYER-KMP 2。
- **T1 module + oracle + sources**：`kmp.ts`（T=`abababcab`/P=`ababc` + `kmpLps`=`[0,0,1,2,0]` + `kmpMatches`=`[2]`）+ `kmp.sources.ts`（4 语言 LPS 构建 + 匹配循环 + lineMap）+ `kmp.module.ts`（匹配循环重走，每次比较后 emit match/jump/advance/found；`offset=i-j`、`matchedLen=j`；预置 LPS）。**12 步**（start 1 + match 8 + jump 1 + found 1 + done 1）。
- **T2 新页 + 开新大类**：Kmp.vue（Article 正文：朴素 O(nm) vs KMP O(n+m)、部分匹配表 π 含义、失配跳转不回退文本、Rabin-Karp/BM/AC 自动机串讲 + AlgorithmPlayer）；路由 `/docs/kmp`；**菜单 + 首页各加第 6 顶层大类「字符串」**（首项 KMP，新 `kmp.svg`：文本+模式对齐图标）；改 TC-HOOK-01-1/02-1（顶层分类 5→6 + `data[5]='字符串'` 含 `['kmp']`）。

### 坑点

- 无坑。KmpView 4 + kmp.module 12 首跑即绿。步模型统一为「每步显示当前比较 (i,j)」：`compareText=i`/`comparePat=j`/`matchedLen=j`/`offset=i-j`，jump 步 `lpsActive=j-1`——满足 MOD 断言（文本指针不回退 MOD-07、offset=i-j MOD-08、matchedLen=j MOD-09、jump lpsActive=comparePat-1 MOD-04）。
- **播放器可插拔轨达 12 条**：Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree/Maze/**Kmp**。**开第 6 顶层大类「字符串」**，为后续 Rabin-Karp/Boyer-Moore/AC 自动机/Manacher 铺路。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：167 文件 **1199 passed**（+21：KmpView 4 + 播放器接匹配轨 2 + kmp.module 12 + Kmp 视图 3；TC-HOOK 2 处改分类 5→6）；覆盖率 **Stmt 94.76% / Branch 93.97% / Func 94.68% / Line 95.4%**。既有 11 轨零改动。
- **e2e**：Playwright **54 passed**（+1 TC-E2E-KMP-01）。
- **真机自检**（Playwright 脚本，`/docs/kmp`）：
  - 首步——文本 9 格、模式 5 格、LPS 5 格、无 `.bars-view`、counter `1 / 12`、Shiki **212 token**。
  - 跳转步（第 5 步）——字幕「T[4]='a' ≠ P[4]='c'：失配 → j 跳到 lps[3]=2（复用已匹配前缀，文本 i 不回退）」。
  - 末步——counter `12`、**kmp-found=5**（命中区间高亮）、字幕「文本扫描完毕：共命中 1 处（下标 2）」。
- **零回归**：既有 11 轨 + 6 图算法 + 4 DP + 回溯 5 页 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 新建第 12 条 KmpView 字符串匹配轨（types +KmpTrack/Step.kmp?/KmpExecPoint + AlgorithmPlayer +v-if；KmpView.vue 三行字符格 + 6 Case）+ T1 kmp.module（匹配循环 12 步）+ T2 新页 Kmp.vue + **开「字符串」第 6 顶层大类** + 路由/菜单/首页接线 + TC-HOOK（分类 5→6）。**新建第 12 轨·开字符串大类·为 Rabin-Karp/BM/AC 自动机铺路。**门禁全绿（单测 1199 / e2e 54 / 覆盖率 94.76%）；真机 12 步、LPS 跳转 j 4→2 文本不回退、命中下标 2。**M6 字符串大类首发达成。**
