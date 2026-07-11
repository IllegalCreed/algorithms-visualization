# 需求：英文目录全量对齐

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

## 背景

C130 已把英文试点扩到 30 页：Home 1 页、工具 2 页、AlgorithmPlayer 内容页 27 页；与 95 个中文索引页共同形成 125 个静态入口。Owner 现调整增长顺序：在恢复 C127 宣传自动化前，先完成现有站点的全部英文翻译。

本计划把“全部翻译”定义为：**现有 95 个中文可索引页面全部具备一一对应的英文页面**。目标不是新增第三语言，而是让当前中文产品范围完整对齐英语目录。

## 只读审计

当前尚缺 65 个英文页面，分布如下：

| 分类         | 待补页数 | 页面形态                     |
| ------------ | -------- | ---------------------------- |
| 数据结构     | 15       | 互动知识页，共复用 20 个 Viz |
| 经典排序算法 | 11       | AlgorithmPlayer              |
| 图算法       | 7        | AlgorithmPlayer              |
| 动态规划     | 7        | AlgorithmPlayer              |
| 回溯与搜索   | 6        | AlgorithmPlayer              |
| 字符串       | 5        | AlgorithmPlayer              |
| 数学与数论   | 8        | AlgorithmPlayer              |
| 计算几何     | 3        | AlgorithmPlayer              |
| 查找         | 3        | AlgorithmPlayer              |
| **合计**     | **65**   | **15 互动页 + 50 播放器页**  |

现有中文目录为 92 个内容条目，其中 15 个数据结构互动页、77 个 AlgorithmPlayer 页；这与源码扫描结果一致。C131 完成后页面结构应为：Home 1 + 工具 2 + 数据结构 15 + 算法 77 = 95 组中英页面对。

## 功能需求

### R1 全量页面对

- `LOCALIZED_PAGE_PAIRS` 从 30 组扩到 95 组，中文 95 页全部有英文对应页。
- 英文 Home 展示全部 92 个学习条目；英文内容路由为 94 条，外加独立 Home。
- route name/path、分类、图标、SEO metadata、复杂度与学习路径数据继续由 typed catalog 单一登记。
- 中文 URL、页面内容和交互行为保持不变。

### R2 数据结构互动页

- 新增 Array、Linked List、Stack、Queue、Tree、Heap、Hash Table、Graph、Trie、Disjoint Set、LRU Cache、Skip List、Segment Tree、B+ Tree、Bloom Filter 十五个英文页面。
- 二十个既有互动 Viz 通过 additive `locale`/copy 接口复用；默认仍为中文，英文页显式传 `locale="en"`。
- 英文控制按钮、输入提示、空态、状态说明、SVG 标签与错误信息不得残留中文。
- 不复制互动状态机，不为英文另写一套数据结构逻辑。

### R3 AlgorithmPlayer 页

- 为剩余 50 个中文 AlgorithmPlayer 页面各新增英文 SFC 与独立 module adapter。
- adapter 只翻译 title、hint、caption、vars、quiz 和 source comments，不改变输入、步骤数、执行点、轨快照、oracle 结果或 lineMap。
- 每个英文页面保留概念/不变量、可视化读法、复杂度/限制和有效英文站内链接，不允许标题占位页。

### R4 工具与导航

- 英文 Home、Menu、Search 覆盖全部 94 个非 Home 页面。
- Complexity 展示全部 92 个学习条目，并使用准确的操作/算法复杂度摘要。
- Paths 覆盖全部 92 个学习条目至少一次；路径顺序由 catalog 标签派生，不维护孤立页面清单。
- 中英切换在全部 95 组页面上双向进入对应页，不再存在中文内容页回退英文 Home 的情况。

### R5 SEO/GEO 与静态产物

- SEO registry 从 125 页扩到 190 页：`zh-CN` 95、`en` 95。
- 95 组页面全部输出双向、自含的 `zh-CN` / `en` / `x-default` alternate。
- production/selfhost 均生成 190 个目录入口；sitemap、llms、manifest 和静态内链与 registry 集合全等。
- 英文可见正文、播放器展示、互动控件和生成 head 通过 Han 字符门禁。

## 非目标

- 不新增日语、韩语或其他第三语言。
- 不新增算法、可视化轨、oracle 或中文正文功能。
- 不引入运行时机器翻译、外部翻译 API、CMS、后端、tracker 或付费服务。
- 不在 C131 接入账号、MCP、渠道 adapter 或执行真实宣传；C127 保持 40%，待 C131 verified 后恢复。
- 不承诺搜索收录、排名、AI 引用或海外流量结果。

## 验收口径

- [x] typed catalog 恰好为 95 组：1 Home、2 工具、15 数据结构、77 算法。
- [x] 94 个英文内容 loader、router、Home、Menu 与 Search 集合双向全等。
- [x] 15 个英文互动页功能与中文一致，二十个 Viz 默认中文零回归且英文展示无 Han。
- [x] 77 个中英 module adapter 对拍保持步骤、执行点、轨、输入与 lineMap 一致，英文展示无 Han。
- [x] 65 个新增英文 SFC 通过内容结构、术语、链接和薄内容门禁。
- [x] Complexity 与 Paths 覆盖全部 92 个学习条目。
- [x] registry、sitemap、llms、manifest 和双 base 均为 190 页，95 组 hreflang 完整。
- [x] L3/L4/L5、coverage、双 base、桌面与 900px 窄视口检查通过。
- [x] GitHub Pages 与 selfhost 双轨部署及代表 URL/全量静态入口抽查完成。

## 变更历史

- 2026-07-11：Owner 决定在 C127 前完成全部英文翻译；批准将 95 个中文索引页全部对齐英文，C127 后置。
- 2026-07-11：完成源码审计，确认增量为 65 页（15 个互动页、50 个播放器页），目标为 95 对页面、190 个索引入口。
- 2026-07-11：65 个英文页面、77 个 adapter、190 页双 base 产物、全门禁与双轨发布全部验证通过；状态转 verified，工程主线恢复 C127 T2。
- 2026-07-11：后续 C132 发现 C131 的英文菜单含工具组、中文菜单却漏接两项；C132 已补齐中文侧栏并新增完整十组/94 项对齐回归，不改 C131 页面与产物范围。
