# 实现记录：英文目录全量对齐

> Status: verified
> Stable ID: C-20260711-131
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 继续 C127 T3-B GitHub CLI typed client 与授权健康检查红测
> Replaces: none
> Replaced by: none
> Related plans: C-20260711-126、C-20260711-130、C-20260711-127、C-20260710-124
> Related tests: TC-I18N-CATALOG-131-_、TC-I18N-STRUCT-131-_、TC-I18N-MODULE-131-_、TC-I18N-CONTENT-131-_、TC-SEO-I18N-131-_、TC-I18N-UI-131-_、TC-I18N-BUILD-131-_、TC-E2E-I18N-131-_
> Related design: design.md

## 当前状态

C131 已完成并双轨上线：95 个中文页与 95 个英文页形成 95 组页面对和 190 个可索引入口。英文侧为 Home、2 个工具页、15 个数据结构互动页与 77 个 AlgorithmPlayer 页；C127 当前为 in-progress/62%，T3-A 已完成，下一步进入 T3-B。

## 审计证据

- `useCategoryData()` 为九大类、92 个内容条目。
- `src/views/Article` 中恰有 77 个包含 `AlgorithmPlayer` 的中文页面。
- `src/views/Article/DataStructure` 中恰有 15 个互动知识页，复用 `src/components/structures` 下 20 个 Viz。
- `LOCALIZED_PAGE_PAIRS` 从 30 组扩为 95 组：1 Home、2 工具、15 structure、77 algorithm。
- 已补齐 65 页：15 个互动页 + 50 个播放器页；英文内容路由为 94 条，总量为 95 对、190 页。
- C130 已消除固定 105/125 构建常量，prerender/verifier 可从 catalog 与真实链接动态发现页面，适合继续扩容。

## 执行清单

### T0 文档与红测

- [x] Owner 明确优先完成全部英文翻译，C127 后置。
- [x] 完成 65 页分类、页面形态与复用面审计。
- [x] 登记 C131 到 plan/test 索引并回写 roadmap、marketing、agent 记忆。
- [x] 建立 95/94/92/77/190 目标不变量红测。

### T1-T3 数据结构互动页

- [x] Batch A：Array、Linked List、Stack、Queue、Tree。
- [x] Batch B：Heap、Hash Table、Graph、Trie、Disjoint Set。
- [x] Batch C：LRU、Skip List、Segment Tree、B+ Tree、Bloom Filter。
- [x] 二十个 Viz 默认中文行为与既有 Case 保持全绿，英文控件/状态无 Han。

### T4-T11 AlgorithmPlayer 页

- [x] Batch D/E：排序 11 页。
- [x] Batch F：图算法 7 页。
- [x] Batch G：动态规划 7 页。
- [x] Batch H：回溯与搜索 6 页。
- [x] Batch I：字符串 5 页。
- [x] Batch J：数学与数论 8 页。
- [x] Batch K：计算几何 3 页 + 查找 3 页。
- [x] 77 个 adapter 与中文 AlgorithmPlayer 页面集合全等并完成结构对拍。

### T12 工具与交付

- [x] Home/Menu/Search 94 条，Complexity/Paths 92 条。
- [x] SEO registry、sitemap、llms、manifest 与双 base 190 页全等。
- [x] format/lint/type/Vitest/coverage/Playwright/双 base/视觉检查全绿。
- [x] 回写四文档、plan/test 三索引、roadmap、marketing 与 agent 记忆。
- [x] 精确提交、push、Pages/selfhost 双轨部署与线上抽查。

## 验证记录

- 2026-07-11：95 对 catalog、94 个 loader、92 个 learning page、77 个 adapter 与 190 页 SEO 目标红测建立后转绿。
- 2026-07-11：15 个数据结构页复用 20 个 Viz；50 个播放器 adapter 与中文 module 对拍步骤、point、轨、源码行数和 lineMap。
- 2026-07-11：`pnpm verify` 通过；297 个 Vitest 文件 / 2118 个用例全绿。
- 2026-07-11：`pnpm coverage` 通过：Statements 95.48%、Branches 86.31%、Functions 92.03%、Lines 95.82%。
- 2026-07-11：104 个 Playwright 文件 / 117 个 L5 用例全绿；桌面与 900px 窄视口无横向溢出或 Header 重叠。
- 2026-07-11：production 190 页（41.4s）与 selfhost 190 页（40.2s）本地预渲染/SEO 验证通过；部署脚本复验 selfhost 190 页（41.5s）。
- 2026-07-11：功能提交 `592d27d`；Pages run `29145907250` 与 selfhost 原子发布成功。自有域 `/en/`、`/en/docs/array/`、`/en/docs/fft/` 均为 200，sitemap 为 190 URL。

## 变更历史

- 2026-07-11：创建 approved 计划；完成范围与架构审计，尚未修改功能代码。
- 2026-07-11：T0-T12 实现、全门禁、双 base、双轨发布与线上抽查完成；状态转 verified，下一阶段恢复 C127 T2。
