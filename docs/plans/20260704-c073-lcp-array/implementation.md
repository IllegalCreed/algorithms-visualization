# 实现记录：LCP / height 数组（C-20260704-073，Kasai · 扩展 SuffixArrayView）

> Status: verified
> Stable ID: C-20260704-073
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 SuffixArrayView LCP 模式**（L4）：types.ts `SuffixArrayTrack` +`lcp?`/`current?`/`compareRow?`、+`LcpExecPoint`；先 SuffixArrayView.spec 追加 TC-VIZ-SAVIEW-LCP-01..03 跑红 → SuffixArrayView.vue（lcp 存在时 LCP 列 + current/compareRow 高亮，否则维持构造模式）跑绿。C-072 SAVIEW 用例保持绿。
2. **T1 module + oracle + sources**（L3）：先 lcparray.module.spec（TC-LCP-MOD-01..12）跑红 → lcparray.{ts,sources.ts,module.ts}（Kasai 逐原始下标）跑绿。
3. **T2 新页 + 接线**：LcpArray.vue；路由 /docs/lcp-array；菜单 + 首页「字符串」第 6 项（新 lcp-array.svg）；改 TC-HOOK（字符串 children +lcp-array）；LcpArray.spec + lcp-array.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 字符串第 6 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **SuffixArrayView additive 扩「LCP 模式」（零回归）**：+`lcp?`/`current?`/`compareRow?`；`lcp` 存在时把「关键字」列换成 **LCP 列**（`lcp[row]` / row0 显 '-' / null 空）、隐 k 徽标、`current` 行 `.sa-current`（琥珀环）、`compareRow` 行 `.sa-compare`（蓝环）；`lcp` 不存在维持 C-072 构造模式（关键字列 + k 徽标）不变。复用 `Step.suffixArray`，AlgorithmPlayer 零改动。
- **Kasai 逐原始下标重走**：复用 C-072 `suffixArray()` 得 sa/rank，`lcp[0]=0` 边界，`h=0`；for 原始下标 `i=0..n-1`：`rank[i]>0` → `fill`（前驱 `sa[rank[i]-1]`、`while s[i+h]==s[j+h] h++`、填 `lcp[rank[i]]`、current=rank[i]/compareRow=rank[i]-1），随后 `h--`（h≥1 时）；否则 `skip`（rank 0 无前驱、h=0）。banana → 8 步（init+5 fill+1 skip+done），LCP 列**非顺序填**（current 序 [3,2,5,1,4,0]）体现 Kasai 按原始下标跳。oracle `kasaiLcp()` 与直接逐对比较对拍。
- **应用**：done 给 `max(lcp)=3`（最长重复子串 "ana"）、`n(n+1)/2−Σlcp=21−6=15`（本质不同子串数）。
- **四语言 sources**：TS/Python/Go/Rust Kasai，lineMap 对齐 init/fill/skip/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1389/1389 全绿**、聚合 statements 95.33% · branches 94.91%；`lcparray.*` 覆盖良好。
- **e2e（真机 Playwright/Chromium）**：`lcp-array` + 回归 `suffix-array` **2/2 通过**——6 后缀行 + LCP 列、无柱数组、Shiki、拖末步字幕含 3。
- **真机视觉自检（1 图眼验）**：第 3/8 步（fill i=1）——当前行下标 1（"anana"）琥珀、前驱行下标 3（"ana"）蓝、LCP 列 [-, , 3, 0, , ]（row2=3 刚填、row3=0 早填，非顺序）、字幕「h 从 0 扩到 3 → lcp[2]=3」；末步 8/8——LCP 列 [-,1,3,0,0,2]、字幕「max(lcp)=3；不同子串数=21−6=15」。
- **回归**：SuffixArrayView 仅 additive；C-072 后缀数组构造页不传 lcp → 构造模式渲染不变（TC-VIZ-SAVIEW-01..03/TC-SA-MOD-\* 全绿）；仅 TC-HOOK（字符串 children）追加 lcp-array。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；19 Case + 改 2 HOOK 全绿、双轨部署。
