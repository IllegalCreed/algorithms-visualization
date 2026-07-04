# 实现记录：后缀数组（C-20260704-072，倍增法 · 新建 SuffixArrayView）

> Status: verified
> Stable ID: C-20260704-072
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 + 类型 + 接线**（L4）：types.ts +`SuffixArrayTrack`/`SuffixArrayExecPoint`/`Step.suffixArray?`；先 SuffixArrayView.spec + AlgorithmPlayer.spec 追加跑红 → 新建 SuffixArrayView.vue（原串 + 后缀表 + sort/rank 高亮）+ AlgorithmPlayer 接线跑绿。
2. **T1 module + oracle + sources**（L3）：先 suffixarray.module.spec（TC-SA-MOD-01..12）跑红 → suffixarray.{ts,sources.ts,module.ts}（倍增 sort→rerank）跑绿。
3. **T2 新页 + 接线**：SuffixArray.vue；路由 /docs/suffix-array；菜单 + 首页「字符串」第 5 项（新 suffix-array.svg）；改 TC-HOOK（字符串 children +suffix-array）；SuffixArray.spec + suffix-array.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 字符串第 5 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 15 条 SuffixArrayView 后缀轨（additive 可插拔）**：顶部原串字符 + 下标；下方后缀表（CSS grid 行）——起点下标 / 后缀文本 / `rank` / 关键字 `(rank[i], rank[i+k])`（越界记 ∞）；`sort` 步高亮关键字列（`.sa-key-active` 黄）、`rank` 步高亮 rank 列（`.sa-rank-active` 绿）。AlgorithmPlayer +import + 一行 `<SuffixArrayView v-if="current.suffixArray">`，其它算法不设即不渲染、零回归。
- **倍增逐轮重走**：`charRanks()` 定 0 基首字符 rank（a=0,b=1,n=2），`init` 先按首字符排；循环每轮 `sort`（按 `(rank[i], rank[i+k])` 稳定重排）+ `rank`（相邻关键字是否相等重编 0 基 rank），`k` 翻倍，`rank[order[n-1]]===n-1`（全不同）即收敛。banana 两轮（k=1、2）收敛 → init+sort/rank×2+done = 6 步。oracle `suffixArray()` 独立倍增 + 与字典序排序对拍。
- **四语言 sources**：TS/Python/Go/Rust 倍增后缀数组，lineMap 对齐 init/sort/rank/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1371/1371 全绿**、聚合 statements 95.32% · branches 94.85%；`suffixarray.*`/`SuffixArrayView.vue` 覆盖良好。
- **e2e（真机 Playwright/Chromium）**：`suffix-array` + 回归 `manacher` **2/2 通过**——6 后缀行、无柱数组、Shiki、拖末步首行后缀以 a 开头 + 字幕含 sa。
- **真机视觉自检（1 图眼验）**：末步 6/6——后缀表按字典序 a(5)/ana(3)/anana(1)/banana(0)/na(4)/nana(2)、rank 0-5 全不同、关键字列含 ∞、字幕「sa 定型 = [5,3,1,0,4,2]」；k=2 徽标。
- **回归**：SuffixArrayView 为新增独立轨；KMP/RK/BM/Manacher 及所有既有算法零回归；仅 TC-HOOK（字符串 children）追加 suffix-array；播放器可插拔轨 14→15。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；21 Case + 改 2 HOOK 全绿、双轨部署。
