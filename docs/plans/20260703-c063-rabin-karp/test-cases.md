# 测试用例：Rabin-Karp 字符串匹配（C-20260703-063，滚动哈希）

> Status: verified
> Stable ID: C-20260703-063
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（rabinkarp.module）/ L4（KmpView 扩展 + RabinKarp 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-KMPVIEW-05`、`TC-RK-MOD-*`、`TC-VIEW-RK-*`、`TC-E2E-RK-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `KmpView` 窗口扩展（`src/components/KmpView.spec.ts`，追加）

| 用例 ID           | 场景        | 期望                                                                            |
| ----------------- | ----------- | ------------------------------------------------------------------------------- |
| TC-VIZ-KMPVIEW-05 | 窗口 + 隐 π | windowStart=2 → 文本下标 2 起 3 格带 `.kmp-window`；lps=[] → 无 `.kmp-lps-cell` |

## L3 —— `rabinkarp.module`（`src/algorithms/rabinkarp.module.spec.ts`）

固定 T=`abcabcab`、P=`cab`，B=10/M=997；oracle `rkHash`/`rkWindowHashes`/`rkMatches`。

| 用例 ID      | 场景              | 期望                                                                           |
| ------------ | ----------------- | ------------------------------------------------------------------------------ |
| TC-RK-MOD-01 | 末步 done + 命中  | 末步 `done`；`kmp.found` = `rkMatches()` = `[2,5]`                             |
| TC-RK-MOD-02 | 步合法 + 带匹配轨 | 每步 `point ∈ {start,skip,hashHit,verify,found,done}` 且带 `kmp`、`array===[]` |
| TC-RK-MOD-03 | 无 π 行（lps 空） | 每步 `kmp.lps` = `[]`                                                          |
| TC-RK-MOD-04 | 窗口对齐          | 每步 `kmp.windowStart` = `kmp.offset`（模式对齐窗口起点）                      |
| TC-RK-MOD-05 | 模式哈希 = 312    | vars/caption 含模式哈希 `rkHash('cab')` = 312                                  |
| TC-RK-MOD-06 | 存在跳过 + 命中   | `#skip >= 1` 且 `#found == 2`                                                  |
| TC-RK-MOD-07 | skip 哈希不等     | 每个 `skip` 步该窗口哈希 ≠ 模式哈希（由窗口下标 `rkWindowHashes`[i] 断言）     |
| TC-RK-MOD-08 | hashHit 哈希相等  | 每个 `hashHit` 步该窗口哈希 = 模式哈希                                         |
| TC-RK-MOD-09 | 命中位置正确      | `found` 步命中起点 ∈ {2,5}；末步 found = `[2,5]`                               |
| TC-RK-MOD-10 | 命中区间不越界    | 每个命中 s 满足 `T.substr(s,m) === P`                                          |
| TC-RK-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                  |
| TC-RK-MOD-12 | module 元信息     | `title` 含「Rabin-Karp」或「哈希」；`initialInput()` = `[]`                    |

## L4 —— `RabinKarp` 视图（`src/views/Article/Algorithm/RabinKarp.spec.ts`，新增）

| 用例 ID       | 场景          | 期望                                                                                |
| ------------- | ------------- | ----------------------------------------------------------------------------------- |
| TC-VIEW-RK-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                                                  |
| TC-VIEW-RK-02 | 匹配轨        | h1 含「Rabin-Karp」；渲染 `KmpView`；无 `.bars-view`；无 `.kmp-lps-cell`（无 π 行） |
| TC-VIEW-RK-03 | 全模板同屏    | Article 含「哈希」+ KmpView 同屏                                                    |

## L4 —— TC-HOOK（字符串第 2 项）

| 用例 ID      | 改动                                                           |
| ------------ | -------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data[5]`（字符串）children url = `['kmp','rabin-karp']` |
| TC-HOOK-02-1 | Menu：同上                                                     |

## L5 —— Rabin-Karp 页 e2e（`e2e/rabin-karp.e2e.ts`，新增）

| 用例 ID      | 场景          | 操作                                       | 期望                                                                                                                                                               |
| ------------ | ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-RK-01 | 全模板 + 互动 | 访问 `/docs/rabin-karp`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Rabin-Karp」；`.kmp-view` 可见；8 `.kmp-text-cell`；无 `.kmp-lps-cell`（无 π 行）；无 `.bars-view`；拖末步 ≥1 `.kmp-found`；真机 Shiki 着色 |

## 回归

- 既有 12 轨（…/Kmp）+ 6 图算法 + 4 DP + 回溯 5 页 + KMP + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **KmpView 仅 additive 扩展 `windowStart` + 空 LPS 隐 π 行**：KMP 有 LPS + 不设 windowStart → π 行照常、无窗口带，其 `TC-VIZ-KMPVIEW-01..04`/`TC-PLAYER-KMP-*` 不变全绿；AlgorithmPlayer.vue 零改动。
- TC-HOOK 其余不变；仅 -01-1/-02-1 字符串 children 追加 `rabin-karp`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 169 文件 1215 passed** / **e2e 55 passed**。
  - 新增 Case 全绿：KmpView 窗口 1（TC-VIZ-KMPVIEW-05）、rabinkarp.module 12（RK-MOD-01..12，含 windowStart=offset MOD-04、skip 哈希≠ MOD-07、hashHit 哈希= MOD-08、命中位置 MOD-09）、RabinKarp 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（字符串 children +rabin-karp）。
  - **一次通过**：KmpView 窗口 1 + rabinkarp.module 12 首跑即绿（滚动哈希与 oracle 一致，命中 [2,5]）；无坑。
- 覆盖率：**Stmt 94.81% / Branch 94.05% / Func 94.67% / Line 95.43%**（聚合，超门槛 70/60）。既有轨/页零回归（KmpView additive 扩展）。
- 真机自检（Playwright 脚本 `/docs/rabin-karp`）：首步 文本 8 格 + 模式 3 格 + **LPS 0 格（π 行已隐）** + **窗口 3 格高亮** + 无 `.bars-view` + `1 / 12` + Shiki 248 token；哈希命中步（第 3 步）字幕「窗口 [2,5) 哈希 312 = 模式哈希 312：可能匹配，需逐字符验证（防哈希冲突）」；末步 `12` + **kmp-found=6** + 字幕「文本扫描完毕：共命中 2 处（下标 2, 5）」。
- 结论：**通过**。三件套齐全；**字符串匹配轨第 2 消费者**（复用 KmpView + windowStart，滚动哈希 vs KMP 前缀函数对照）；窗口滑动 + 哈希对比 + 命中验证清晰；KMP + 既有轨零回归。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。17 Case 全绿（KmpView 窗口 1 + module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 12 步、无 π 行、窗口滑动、命中 [2,5]。
