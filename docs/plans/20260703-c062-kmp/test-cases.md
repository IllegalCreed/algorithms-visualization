# 测试用例：KMP 字符串匹配（C-20260703-062，KmpView 新轨）

> Status: verified
> Stable ID: C-20260703-062
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（kmp.module）/ L4（KmpView 新轨 + 播放器接轨 + Kmp 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-KMPVIEW-*`、`TC-PLAYER-KMP-*`、`TC-KMP-MOD-*`、`TC-VIEW-KMP-*`、`TC-E2E-KMP-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `KmpView` 新字符串匹配轨（`src/components/KmpView.spec.ts`）

mock KmpTrack 渲染断言。

| 用例 ID           | 场景             | 期望                                                                         |
| ----------------- | ---------------- | ---------------------------------------------------------------------------- |
| TC-VIZ-KMPVIEW-01 | 文本/模式/LPS 行 | T=9 → 9 `.kmp-text-cell`；P=5 → 5 `.kmp-pat-cell`；LPS 5 → 5 `.kmp-lps-cell` |
| TC-VIZ-KMPVIEW-02 | 比较高亮         | compareText=4/comparePat=4 → 各 1 `.kmp-compare`                             |
| TC-VIZ-KMPVIEW-03 | 已匹配前缀       | matchedLen=2 → 2 `.kmp-matched`（模式前缀）                                  |
| TC-VIZ-KMPVIEW-04 | 命中标记         | found=[2] → T 下标 2 起 P.length 格带 `.kmp-found`                           |

## L4 —— 播放器接字符串匹配轨（`src/components/player/AlgorithmPlayer.spec.ts`）

| 用例 ID          | 场景          | 期望                                              |
| ---------------- | ------------- | ------------------------------------------------- |
| TC-PLAYER-KMP-01 | kmp → 渲染    | step 带 kmp → 渲染 `KmpView`                      |
| TC-PLAYER-KMP-02 | 无 kmp 不渲染 | 既有排序 step（无 kmp）→ 不渲染 KmpView（零回归） |

## L3 —— `kmp.module`（`src/algorithms/kmp.module.spec.ts`）

固定 T=`abababcab`、P=`ababc`；oracle `kmpLps`/`kmpMatches`。

| 用例 ID       | 场景              | 期望                                                                          |
| ------------- | ----------------- | ----------------------------------------------------------------------------- |
| TC-KMP-MOD-01 | 末步 done + 命中  | 末步 `done`；`kmp.found` = `kmpMatches()` = `[2]`                             |
| TC-KMP-MOD-02 | 步合法 + 带匹配轨 | 每步 `point ∈ {start,match,jump,advance,found,done}` 且带 `kmp`、`array===[]` |
| TC-KMP-MOD-03 | LPS 预置正确      | 每步 `kmp.lps` = `kmpLps()` = `[0,0,1,2,0]`                                   |
| TC-KMP-MOD-04 | 存在关键跳转      | `#jump >= 1`；每个 `jump` 步 `lpsActive` 非空且新 j = `lps[旧 j-1]`           |
| TC-KMP-MOD-05 | 命中位置正确      | 恰一 `found` 步；该步命中起点 = 2、`found` 含 2                               |
| TC-KMP-MOD-06 | match 字符相等    | 每个 `match` 步 `T[compareText]===P[comparePat]`                              |
| TC-KMP-MOD-07 | 文本指针不回退    | 逐步 `compareText`（i）单调不减（KMP 不回退文本）                             |
| TC-KMP-MOD-08 | offset = i-j      | 每步 `offset` = compareText − comparePat（对齐一致，≥0）                      |
| TC-KMP-MOD-09 | matchedLen = j    | 每步 `matchedLen` = comparePat（已匹配前缀长 = j）                            |
| TC-KMP-MOD-10 | 命中区间不越界    | 每个 `found` 起点 s 满足 `T.substr(s, m) === P`                               |
| TC-KMP-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                 |
| TC-KMP-MOD-12 | module 元信息     | `title` 含「KMP」或「字符串」；`initialInput()` = `[]`                        |

## L4 —— `Kmp` 视图（`src/views/Article/Algorithm/Kmp.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                          |
| -------------- | ------------- | --------------------------------------------- |
| TC-VIEW-KMP-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`            |
| TC-VIEW-KMP-02 | 匹配轨        | h1 含「KMP」；渲染 `KmpView`；无 `.bars-view` |
| TC-VIEW-KMP-03 | 全模板同屏    | Article 含「字符串」+ KmpView 同屏            |

## L4 —— TC-HOOK（新增第 6 顶层大类「字符串」）

| 用例 ID      | 改动                                               |
| ------------ | -------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data` 6 分类，第 6 = 「字符串」含 `['kmp']` |
| TC-HOOK-02-1 | Menu：`data` 6 分类，第 6 = 「字符串」含 `['kmp']` |

## L5 —— KMP 页 e2e（`e2e/kmp.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                | 期望                                                                                                                                             |
| ------------- | ------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-KMP-01 | 全模板 + 互动 | 访问 `/docs/kmp`；`.scrub` 拖到末步 | 正文 `.article h1` 含「KMP」；`.kmp-view` 可见；9 `.kmp-text-cell` + 5 `.kmp-pat-cell`；无 `.bars-view`；拖末步 ≥1 `.kmp-found`；真机 Shiki 着色 |

## 回归

- 既有 11 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree/Maze）+ 6 图算法 + 4 DP + 回溯 5 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **既有 11 轨组件零改动**；AlgorithmPlayer 仅 additive 加 `<KmpView v-if>` + import。
- TC-HOOK 其余（数据结构 15、排序 15、图算法 6、动态规划 4、回溯 5）不变；仅 -01-1/-02-1 顶层分类 5→6、新增「字符串」。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 167 文件 1199 passed** / **e2e 54 passed**。
  - 新增 Case 全绿：KmpView 4（VIZ-KMPVIEW-01..04）、播放器接匹配轨 2（PLAYER-KMP-01/02）、kmp.module 12（KMP-MOD-01..12，含 match 字符相等 MOD-06、文本指针不回退 MOD-07、offset=i-j MOD-08、jump lpsActive=comparePat-1 MOD-04）、Kmp 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（顶层分类 5→6 + 「字符串」含 kmp）。
  - **一次通过**：KmpView 4 + kmp.module 12 首跑即绿（KMP 匹配循环与 oracle 一致，命中下标 2）；无坑。
- 覆盖率：**Stmt 94.76% / Branch 93.97% / Func 94.68% / Line 95.4%**（聚合，超门槛 70/60）。既有 11 轨零改动。
- 真机自检（Playwright 脚本 `/docs/kmp`）：首步 文本 9 格 + 模式 5 格 + LPS 5 格 + 无 `.bars-view` + `1 / 12` + Shiki 212 token；跳转步（第 5 步）字幕「T[4]='a' ≠ P[4]='c'：失配 → j 跳到 lps[3]=2（复用已匹配前缀，文本 i 不回退）」；末步 `12` + **kmp-found=5**（命中区间高亮）+ 字幕「文本扫描完毕：共命中 1 处（下标 2）」。
- 结论：**通过**。三件套齐全；**开第 6 顶层大类「字符串」·新建 KmpView 第 12 轨**；失配跳转不回退文本、LPS 复用前缀清晰；既有 11 轨 + 全部算法页零回归；为 Rabin-Karp/BM/AC 自动机铺路。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。21 Case 全绿（KmpView 4 + 接轨 2 + module 12 + 视图 3 + e2e 1，改 TC-HOOK 2 分类 5→6）；真机 12 步、跳转 j 4→2 文本不回退、命中下标 2。
