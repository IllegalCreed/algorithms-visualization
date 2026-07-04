# 测试用例：LCP / height 数组（C-20260704-073，Kasai · 扩展 SuffixArrayView）

> Status: verified
> Stable ID: C-20260704-073
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（lcparray.module）/ L4（SuffixArrayView LCP 模式 + LcpArray 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-SAVIEW-LCP-*`、`TC-LCP-MOD-*`、`TC-VIEW-LCP-*`、`TC-E2E-LCP-01`；**改** `TC-HOOK`（字符串 children）

## L4 —— SuffixArrayView LCP 模式（`src/components/SuffixArrayView.spec.ts`，追加）

| 用例 ID              | 场景           | 期望                                                                |
| -------------------- | -------------- | ------------------------------------------------------------------- |
| TC-VIZ-SAVIEW-LCP-01 | LCP 列         | 传 `lcp=[null,1,3,0,0,2]` → 渲染 `.sa-lcp` 列，非 null 行显示对应值 |
| TC-VIZ-SAVIEW-LCP-02 | 当前/前驱行    | `current=2`,`compareRow=1` → 1 `.sa-current`、1 `.sa-compare`       |
| TC-VIZ-SAVIEW-LCP-03 | 模式不影响构造 | 不传 `lcp`（构造模式）→ 仍渲染关键字列 `.sa-key`、无 `.sa-lcp`      |

## L3 —— `lcparray.module`（`src/algorithms/lcparray.module.spec.ts`）

固定 `"banana"`（sa=[5,3,1,0,4,2]）；oracle `kasaiLcp()`=`[0,1,3,0,0,2]`。

| 用例 ID       | 场景              | 期望                                                                        |
| ------------- | ----------------- | --------------------------------------------------------------------------- |
| TC-LCP-MOD-01 | 末步 done + lcp   | 末步 `done`；末步 `suffixArray.lcp` = `kasaiLcp()` = `[0,1,3,0,0,2]`        |
| TC-LCP-MOD-02 | 步合法 + 带后缀轨 | 每步 `point ∈ {init,fill,skip,done}` 且带 `suffixArray`、`array===[]`       |
| TC-LCP-MOD-03 | order = sa 恒定   | 每步 `suffixArray.order` === `suffixArray()`（LCP 阶段不重排后缀）          |
| TC-LCP-MOD-04 | LCP 直接验证      | 末步 `lcp[i]` = 直接比较 `sa[i-1]` 与 `sa[i]` 前缀的长度（i≥1）；`lcp[0]`=0 |
| TC-LCP-MOD-05 | fill 步高亮成对   | 每个 `fill` 步 `current` 与 `compareRow`（=current-1）都非空，且 current≥1  |
| TC-LCP-MOD-06 | skip 步 rank 0    | `skip` 步 `current`===0（rank 0 的后缀，无排序前驱）                        |
| TC-LCP-MOD-07 | fill 恰 n-1 次    | `fill` 步数 === 5（n-1，除 rank 0 外每行一次）；`skip` 恰 1                 |
| TC-LCP-MOD-08 | Kasai 按原始下标  | fill/skip 步依次对应原始下标 i=0..5（vars/caption 可辨），LCP 列非顺序填充  |
| TC-LCP-MOD-09 | lcp 逐格填充      | 相邻两步已填 lcp 的非空格数单调不减                                         |
| TC-LCP-MOD-10 | 应用值            | done 步 caption 含最长重复子串长 `3`（max lcp）与不同子串数 `15`            |
| TC-LCP-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内               |
| TC-LCP-MOD-12 | module 元信息     | `title` 含「LCP」或「height」；`initialInput()` = `[]`                      |

## L4 —— `LcpArray` 视图（`src/views/Article/Algorithm/LcpArray.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                                  |
| -------------- | ------------- | ----------------------------------------------------- |
| TC-VIEW-LCP-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                    |
| TC-VIEW-LCP-02 | 后缀轨        | h1 含「LCP」；渲染 `SuffixArrayView`；无 `.bars-view` |
| TC-VIEW-LCP-03 | 全模板同屏    | 正文含「Kasai」+ SuffixArrayView 同屏                 |

## L4 —— TC-HOOK（字符串第 6 项）

| 用例 ID | 改动                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[5]`（字符串）children url = `['kmp','rabin-karp','boyer-moore','manacher','suffix-array','lcp-array']` |

## L5 —— LCP 页 e2e（`e2e/lcp-array.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                      | 期望                                                                                                                                                           |
| ------------- | ------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-LCP-01 | 全模板 + 互动 | 访问 `/docs/lcp-array`；`.scrub` 拖到末步 | 正文 `.article h1` 含「LCP」；`.suffix-array-view` 可见；6 `.sa-row`；有 `.sa-lcp` 列；无 `.bars-view`；拖末步 caption 含 `3`（最长重复子串）；真机 Shiki 着色 |

## 回归

- 既有 15 轨 + 7 图算法 + 6 DP + 回溯 8 页 + 字符串 5 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **SuffixArrayView 仅 additive 扩展**：C-072 后缀数组构造页不传 `lcp` → 构造模式渲染不变，`TC-VIZ-SAVIEW-01..03`/`TC-SA-MOD-*` 全绿；AlgorithmPlayer 零改动。
- TC-HOOK 其余不变；仅字符串 children 追加 `lcp-array`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1389 用例全绿**；`pnpm exec playwright test lcp-array suffix-array` → **2/2 绿**。
- **本单新增 19 Case 全绿**：`TC-VIZ-SAVIEW-LCP-01..03`（L4，SuffixArrayView LCP 模式）3 + `TC-LCP-MOD-01..12`（L3）12 + `TC-VIEW-LCP-01..03`（L4）3 + `TC-E2E-LCP-01`（L5）1；**改** `TC-HOOK`（字符串 children +lcp-array）menu+home 各 1。
- **关键断言实测**：末步 lcp=kasaiLcp()=[0,1,3,0,0,2]（TC-LCP-MOD-01）；与直接比较一致（TC-04）；order=sa 恒定（TC-03）；fill current/compareRow 成对（TC-05）；fill 5 次 skip 1 次（TC-07）；LCP 列非顺序填（TC-08）；应用 3/15（TC-10）。
- **真机自检**：LCP 列 [-,1,3,0,0,2]、Kasai 跳填、当前/前驱高亮，与设计一致。
- **覆盖**：statements 95.33% / branches 94.91%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；19 Case + 改 2 HOOK 全绿。
