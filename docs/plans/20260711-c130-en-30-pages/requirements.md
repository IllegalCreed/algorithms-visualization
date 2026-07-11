# 需求：英文目录扩展到 30 页

> Status: verified
> Stable ID: C-20260711-130
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: C127 T1 建立 CampaignSpec、能力注册表与 dry-run 红测
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-124、C-20260711-126、C-20260711-127
> Related tests: TC-I18N-CATALOG-130-_、TC-I18N-MODULE-130-_、TC-I18N-CONTENT-130-_、TC-SEO-I18N-130-_、TC-I18N-UI-130-_、TC-I18N-BUILD-130-_、TC-E2E-I18N-130-\_

## 背景

C126 已验证 `/en` 十页试点：Home、Complexity、Paths 和 7 个算法页具备英文正文、播放器、搜索、语言切换、canonical/hreflang、sitemap、llms 与预渲染入口。C130 启动时共 95 个中文索引页、10 个英文页，总计 105 页。

试点为控制风险采用了小型硬编码：`pilot.ts`、router 英文路由、`homeCatalog.ts`、Complexity metrics、Paths 和单体 `englishAlgorithmModules.ts` 分别维护十页集合。继续照此复制 20 页会放大同步成本，且单体 adapter 已超过 450 行。

本计划先把试点收束为可扩展的英文内容目录，再新增 20 个代表算法，使英文达到 30 页：Home 1 页、工具 2 页、算法 27 页；中英总索引页达到 125。C130 实施期间 C127 宣传自动化保持 approved/后置，不与本计划并行开工。

## 目标范围

### 保留的十页

Home、Complexity、Paths、Quick Sort、Binary Search、Dijkstra、0/1 Knapsack、KMP、Fenwick Tree、Convex Hull。

### 新增二十页草案

| 分类       | 页面                                              | Slug                                                      |
| ---------- | ------------------------------------------------- | --------------------------------------------------------- |
| 排序       | Bubble Sort、Merge Sort、Heap Sort、Counting Sort | `bubble-sort`、`merge-sort`、`heap-sort`、`counting-sort` |
| 图算法     | Kruskal、Prim、Bellman-Ford、Topological Sort     | `kruskal`、`prim`、`bellman-ford`、`topological-sort`     |
| 动态规划   | Edit Distance、Longest Common Subsequence、LIS    | `edit-distance`、`lcs`、`lis`                             |
| 回溯与搜索 | N-Queens、Subsets、Maze                           | `n-queens`、`subsets`、`maze`                             |
| 字符串     | Rabin-Karp、Manacher                              | `rabin-karp`、`manacher`                                  |
| 数学与数论 | Sieve of Eratosthenes、Euclidean GCD              | `sieve-of-eratosthenes`、`gcd`                            |
| 计算几何   | Closest Pair                                      | `closest-pair`                                            |
| 查找       | Lower/Upper Bound                                 | `binary-bounds`                                           |

二十页均已有中文路由、页面和 `*.module.ts`，不新增算法 oracle 或可视化轨。新增后英文算法覆盖九大类，避免第二批继续偏向少数类别。

不能用 slug 直接拼 module 文件名：`topological-sort -> topo`、`edit-distance -> editdist`、`n-queens -> queens`、`rabin-karp -> rabinkarp`、`sieve-of-eratosthenes -> sieve`、`closest-pair -> closestpair`、`binary-bounds -> bbound`。adapter 必须显式导入真实 module，其余十三页也由类型化 map 锁定，禁止运行时猜文件名。

## 功能需求

### R1 可扩展语言目录

- 将 `PILOT_PAGE_PAIRS` 升级为不含“十页试点”语义的 typed locale catalog。
- 页面 key、中文/英文 route name/path、SEO metadata、分类、图标、复杂度和学习路径标签从同一登记项派生。
- 迁移期间保留兼容导出，避免一次性改坏 Header、Menu、Search、SEO 和现有测试。

### R2 英文路由与导航同源

- 英文 route records 由 typed loader map 与 locale catalog 共同生成，不再手写第二份 29 条内容路由。
- 英文 Home、Docs Menu、SearchPalette 从 catalog 派生 29 个内容入口；Home 仍为独立第 30 页。
- 已翻译页语言切换进入对应页面，未翻译中文页继续明确回退 `/en/`。

### R3 高质量英文内容

- 每页翻译标题、副标题、正文、callout、链接、播放器字幕、变量、题卡、输入提示和四语言源码注释。
- 在首批内容前建立英文术语与文风基线，统一算法名、操作动词、复杂度表达、播放器状态词和中英交叉链接措辞；批次评审以此为准。
- 不使用运行时机器翻译，不引入外部翻译 API；内容在仓库内可审查、可测试、可版本控制。
- 英文正文保留算法限制、复杂度、适用场景与不变量，不做只有标题/按钮的薄翻译。

### R4 Module adapter 拆分

- 将单体 `englishAlgorithmModules.ts` 拆为共享 helper + 每算法 adapter，避免 27 个算法集中在单文件。
- adapter 只本地化展示字段，不修改步骤数、执行点、输入、轨快照、最终状态和 source lineMap。
- 共性 helper 只处理可靠的结构化操作，不用脆弱的全文猜测替换算法语义。

### R5 工具页自动扩展

- Complexity 从 catalog 的 typed complexity 数据生成 27 行，不手写另一份算法集合。
- Paths 从 typed path/tag 数据生成覆盖 27 个算法的学习路径，并保证每个英文算法至少出现一次。
- Home 分类、图标、描述和顺序从 catalog 派生；不存在登记页缺图标或孤儿路由。

### R6 SEO/GEO 与构建产物

- 95 个中文页保持原 URL；30 个英文页各自 self-canonical，共 30 组有效语言映射。
- 每组输出双向、自含的 `zh-CN` / `en` / `x-default` alternate；未翻译中文页不声明英文 alternate。
- registry、预渲染 manifest、sitemap、llms、静态内链和产物 verifier 从 105 页扩到 125 页。
- 英文静态正文继续通过 Han 字符门禁；允许算法专名中的非英文字符必须显式白名单并说明。

## 非目标

- 不在本期一次性翻译全部 95 个中文索引页。
- 不新增日语、韩语或其他第三语言；先证明英文目录可以稳定扩容。
- 不引入 CMS、服务端、运行时翻译、第三方翻译 API、tracker 或付费服务。
- 不修改算法真值、步骤结构、中文正文、中文路由或现有输入行为。
- 不把页面数量增长描述为收录、排名、AI 引用或海外需求已经得到验证。

## 验收口径

- [x] locale catalog 恰好包含 30 组页面，其中 27 算法、2 工具、1 Home；route name/path 全局唯一。
- [x] 二十个新增英文页正文和播放器展示无中文残留，结构与中文 module 一致。
- [x] 英文术语与文风基线落档，二十页的核心术语、复杂度表达和交叉链接通过内容 QA。
- [x] Home/Menu/Search/Complexity/Paths 全部从 catalog 派生且覆盖 29 个英文内容页。
- [x] SEO registry 共 125 页；30 组 alternate 双向、自含，65 个未翻译中文内容页无假英文映射。
- [x] production/selfhost 生成并验证 125 个静态入口、sitemap、llms 与 manifest。
- [x] L3/L4/L5、coverage、双 base、桌面与 900px 窄视口检查通过。
- [x] GitHub Pages 与 selfhost 两轨部署及代表 URL 线上核验完成。

## 开放问题

- 30 页 / 新增二十页范围已由 Owner 批准；若批次中出现真实结构阻塞，只允许同类替换并回写原因，不静默缩减总数。
- 若某个 adapter 的英文字幕成本显著高于预期，可以在不改变总数的前提下用同类已存在 module 替换，但必须回写本表和原因。
- 第三语言只在英文 30 页上线后，根据免费 Search Console/Bing 数据与维护成本另立计划，不在 C130 预选。

## 变更历史

- 2026-07-11：基于 C126 十页真实实现完成扩容审计，提出“先收束目录，再新增二十页”的 30 页草案。
- 2026-07-11：Owner 批准 C130；状态转 implementing，按 10/105 无行为迁移后四批扩容进入 TDD。
- 2026-07-11：typed catalog、二十页增量、27 个 adapter、125 页构建与全量验证完成；状态转 implemented，等待双轨发布。
- 2026-07-11：功能提交 `5dca6c4`、Pages run `29136875578` 与 selfhost 发布/线上抽查通过；状态转 verified。
