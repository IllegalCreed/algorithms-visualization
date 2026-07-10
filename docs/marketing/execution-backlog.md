# 营销与增长执行清单

> Status: active
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Current plan: C-20260710-123
> Next plan: C-124 SEO/GEO 技术地基重建
> Strategy: `docs/marketing/roadmap.md`
> Launch materials: `docs/marketing/launch-posts.md`

## 定位

本文件是 1.0 封版后营销、国际化与增长工程的**当前执行事实源**。它回答三件事：现在已经有什么、下一步按什么顺序做、每一阶段怎样才算完成。

- `roadmap.md` 只保存策略、渠道与长期判断。
- `launch-posts.md` 保存可复用的发布文案和素材清单。
- 本文件保存 C124-C128 的顺序、状态、依赖、退出条件和 Owner 外部行动。
- 每个进入实施的阶段仍需新建四文档 plan，不直接把本清单当实现说明。

## 当前基线审计

| 能力             | 状态   | 仓库事实                                                           | 结论                                                                                                     |
| ---------------- | ------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 全局元数据       | 已有   | `index.html` 有默认 title、description、Open Graph 与 Twitter Card | 只能作为全站 fallback，不能替代路由级元数据                                                              |
| 分享卡           | 已有   | `public/og-cover.png`，C-118 已产出国内首发文案                    | 发布素材可用，仍需用渠道数据验证效果                                                                     |
| robots           | 部分   | `public/robots.txt` 当前为通用 `Allow: /` + sitemap                | 默认未阻止爬虫，但没有把搜索抓取与模型训练策略分开记录                                                   |
| sitemap          | 部分   | `public/sitemap.xml` 静态列出 95 个 URL                            | 当前 URL 集可用，但与 router/catalog 分离，新增路由可能漏同步                                            |
| llms.txt         | 部分   | `public/llms.txt` 有站点简介与主要入口                             | `llms.txt` 只是实验性补充，不是搜索排名或 AI 引用保证；当前也未覆盖全部页面                              |
| 路由级 SEO       | 缺失   | 无 route meta、canonical、hreflang、JSON-LD                        | C124 重建，不沿用 C-034 草案直接开工                                                                     |
| 首屏机器可读内容 | 未验证 | 当前为客户端 Vue SPA，无预渲染/SSR/SSG 产物                        | Google 可渲染 JavaScript，但渲染可能延迟，且不能假定所有爬虫都会执行 JavaScript；C124 先做产物与爬虫验证 |
| 分析与归因       | 缺失   | 无统计 SDK、事件模型、UTM 规范或增长看板                           | C125 在正式投放前完成                                                                                    |
| 站点多语言       | 缺失   | UI 与文章主体为中文；播放器仅代码语言切换                          | C126 先做 `/en` 十页试点，不把代码语言标签误写成站点国际化                                               |
| 内容生产自动化   | 缺失   | 只有人工发布草稿，无生成器、审批流、渠道 API 或定时 workflow       | C127 先做草稿生成和人工审批，再评估官方 API                                                              |
| 发布复盘         | 缺失   | 尚无可归因的 48 小时/7 天发布数据                                  | C128 执行并形成下一轮投入决策                                                                            |

## 固定执行顺序

`C124 SEO/GEO` -> `C125 分析归因` -> `C126 英文试点` -> `C127 内容与分发自动化` -> `C128 发布与复盘`

顺序约束：

1. C124 先让页面具备可靠的可发现性与可引用语义。
2. C125 在扩大宣传前建立归因，否则渠道投入无法比较。
3. C126 先用十页验证英文信息架构与翻译质量，再决定是否扩到 92 个条目。
4. C127 只在内容结构和 UTM 规则稳定后自动生成，不自动放大错误内容。
5. C128 国内发布至少依赖 C125；海外发布同时依赖 C125 与 C126。

## 阶段看板

| 阶段                      | 状态     | 目标                                               | 退出条件                                                           | 主要依赖                       |
| ------------------------- | -------- | -------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| C123 增长执行审计与编排   | verified | 统一事实、顺序、边界与历史状态                     | 当前基线、C124-C128、Owner 输入和测试索引全部落档                  | C117、C118、C119-C122          |
| C124 SEO/GEO 技术地基重建 | next     | 让每个可索引页面具备唯一语义和可验证的机器可读产物 | 双域产物检查通过；路由/meta/sitemap 同步守护；搜索平台提交清单就绪 | C123                           |
| C125 分析、事件与渠道归因 | planned  | 每次访问与关键学习行为可按来源比较                 | 生产环境 page view、UTM、核心事件和 48h/7d 看板可验证              | C124；Owner 提供统计方案/属性  |
| C126 `/en` 多语言十页试点 | planned  | 验证英文 UI、文章、搜索与国际 SEO 全链路           | 十页双语内容、切换、canonical/hreflang/sitemap、桌面/移动测试通过  | C124、C125                     |
| C127 内容生成与半自动分发 | planned  | 从单一内容清单生成渠道草稿、素材和 UTM 链接        | dry-run 产物可审阅；人工批准后才允许官方 API 发布                  | C125、C126；渠道账号/API 能力  |
| C128 发布、监测与迭代     | planned  | 完成国内/海外冷启动并用数据决定下一轮              | 每批次有 48h/7d 报告、渠道 ROI 判断与明确后续动作                  | C125；海外批次还依赖 C126/C127 |

## C124 SEO/GEO 技术地基重建

### 必做范围

- 修正 `<html lang>`，建立可测试的路由级 title、description、canonical、Open Graph 数据源。
- 结构化数据只描述页面真实可见内容，优先 JSON-LD；不把结构化数据写成排名承诺。
- 对当前 SPA 做真实产物与爬虫可读性实验，再决定预渲染、SSG 或其他构建方案。Playwright 构建后预渲染是候选，不是未经验证的既定答案。
- 让 sitemap 从路由/catalog 事实生成或受一致性测试保护；`llms.txt` 同源生成并明确实验属性。
- 记录 `OAI-SearchBot` 的搜索可见性策略；将 `GPTBot` 的训练策略作为独立 Owner 决策，避免混为一谈。
- 添加构建产物测试：代表性路由返回正确 title、canonical、正文与结构化数据，GitHub Pages 子路径和自有域根路径都能工作。
- 形成 Google Search Console、Bing Webmaster 提交清单；IndexNow 只作为变更 URL 的可选加速，不替代 sitemap。

### 不做

- 不在 C124 引入站点多语言。
- 不把 `llms.txt`、robots、JSON-LD 或预渲染描述为收录、排名、富结果或 AI 引用保证。
- 不复制 router、首页、菜单第四份手工 URL 表而不加同步守护。

### 退出条件

- C124 四文档 verified，自动化用例覆盖元数据完整性、URL 同步、产物可读性与双 base。
- 代表性深链在两个部署目标均返回 200，产物中的 canonical 统一指向主站。
- Owner 可按清单完成 Search Console/Bing 验证与 sitemap 提交。

## C125 分析、事件与渠道归因

### 必做范围

- 在 GA4、Plausible、Umami 或等价方案中做一次隐私、成本、托管与事件能力评审，由 Owner 选择并提供属性 ID。
- 固化 UTM 命名：`utm_source`、`utm_medium`、`utm_campaign`、`utm_content`，所有发布草稿从同一规则生成。
- 最小事件集：`page_view`、`search`、`play`、`input_apply`、`quiz_complete`、`share`、`language_switch`。
- 建立 48 小时与 7 天看板：访问、有效互动、来源、落地页、回访和转化代理指标。
- 单独识别 ChatGPT 搜索推荐流量中的 `utm_source=chatgpt.com`，同时保留普通 referrer 观察。

### 退出条件

- 生产环境能看到测试访问、UTM campaign 和至少三个核心交互事件。
- 隐私说明、Cookie/同意需求与数据保留策略有明确结论。
- launch-posts 中的每个链接可生成可归因版本。

## C126 `/en` 多语言十页试点

### 路由与样本

- 中文继续使用根路径，英文使用 `/en`，避免一次性迁移现有 92 个中文 URL。
- 试点十页：Home、Complexity、Paths、Quick Sort、Binary Search、Dijkstra、0/1 Knapsack、KMP、Fenwick Tree、Convex Hull。

### 必做范围

- 翻译导航、搜索、播放器 UI、页面正文、字幕与 SEO 文案；只翻按钮或标题不算完成。
- 语言切换可发现、可键盘操作、可保留选择，并在无对应翻译时采用明确回退。
- 搜索索引、canonical、hreflang、sitemap、结构化数据与 `llms.txt` 支持语言版本。
- 每个语言页自引用并双向列出可用 alternates，使用完整 URL；按需要提供 `x-default`。

### 退出条件

- 十页在桌面与移动端完成内容、布局、搜索、切换与深链测试。
- 中文与英文页面不存在错误 canonical、单向 hreflang 或混合语言主体。
- 根据质量、索引与使用数据决定扩展、修订或停止，不预先承诺 92 页全量翻译。

## C127 内容生成与半自动分发

### 必做范围

- 建立渠道中立的内容清单：主题、目标页面、语言、标题、摘要、截图/视频、UTM campaign、发布日期与状态。
- 用模板生成掘金、V2EX、B站、Hacker News、Reddit、Product Hunt 等渠道草稿，但逐个平台重新审计格式和官方 API 能力。
- 第一阶段只提供本地 dry-run 与 `workflow_dispatch`，生成可审阅 artifact；人工批准后才进入发布步骤。
- 凭据只进入 GitHub Actions secrets 或等价密钥管理，不写入仓库、日志或生成物。
- 仅使用平台官方 API 或官方发布工具；不以无头浏览器模拟登录、绕过验证码或抓取用户凭据。
- 定时 `schedule` 必须在至少一次人工触发全链路成功、失败可恢复、Owner 明确批准后开启。

### 退出条件

- 同一 campaign 可重复生成中英文渠道草稿、媒体清单和唯一 UTM 链接。
- dry-run 不产生站外副作用，审批与拒绝路径都可验证。
- 每个启用渠道有速率限制、失败重试、撤回方式、密钥 Owner 与合规记录。

## C128 发布、监测与迭代

### 批次

1. 国内批次：掘金、V2EX、B站，至少在 C125 验证后开始。
2. 海外批次：Hacker News、Reddit、Product Hunt，在 C126 英文试点和 C125 归因完成后开始。
3. 每个批次在 48 小时与 7 天复盘，不同渠道不使用同一文案和同一发布时间假设。

### 退出条件

- 每个发布记录实际 URL、版本、时间、UTM、素材、48h/7d 指标与评论反馈。
- 明确保留 1-2 个高投入产出渠道，暂停低效渠道，并将反馈转成独立 bug/内容/产品 plan。
- 广告与重度变现继续作为流量验证后的决策，不在冷启动阶段牺牲学习体验。

## Owner 外部输入与阻塞

| 输入                                        | 最晚需要阶段 | 说明                                      |
| ------------------------------------------- | ------------ | ----------------------------------------- |
| 分析工具选择与属性 ID                       | C125 开始前  | 需同时确认隐私、Cookie/同意与数据保留策略 |
| Google Search Console / Bing Webmaster 权限 | C124 发布后  | 完成域名验证、sitemap 提交与覆盖报告查看  |
| GPTBot 训练策略                             | C124         | 与 OAI-SearchBot 搜索可见性分开决定       |
| 英文术语与品牌口吻确认                      | C126         | 十页样本上线前人工审校                    |
| 渠道账号、API access 与 secrets             | C127         | 各平台逐项核实，不假定都有自动发布 API    |
| 赞赏码/爱发电图片                           | C128 前可选  | 早期信号实验，不阻塞 SEO、分析或发布      |
| 隐私与平台合规确认                          | C125-C128    | 统计、邮件、自动发布和广告均需单独确认    |

## 官方依据与适用边界

| 主题              | 官方资料                                                                                                                     | 本项目采用的边界                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| JavaScript SEO    | [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Google 可渲染 JavaScript，但渲染可能排队；不能由此推断所有爬虫都能可靠读取 SPA                   |
| 多语言与 hreflang | [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)            | alternate 必须自引用、双向、完整 URL；项目优先选一种维护面最小的声明方式                         |
| 结构化数据        | [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)          | 使用 JSON-LD 描述可见内容，测试语法；不承诺富结果或排名                                          |
| OpenAI 搜索爬虫   | [OpenAI publishers and developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)           | OAI-SearchBot 管搜索可见性，GPTBot 训练选择独立；ChatGPT 推荐流量可观察 `utm_source=chatgpt.com` |
| GitHub 定时工作流 | [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)         | `schedule` 使用 UTC 且运行默认分支最新提交；C127 先人工触发再定时                                |
| URL 更新通知      | [Bing IndexNow](https://www.bing.com/webmasters/help/indexnow-0z209wby)                                                      | 仅作变更通知加速，保留 sitemap 和正常抓取路径                                                    |
| llms.txt          | [llms.txt proposal](https://llmstxt.org/)                                                                                    | 视为实验性机器说明文件，不当作标准或收录保证                                                     |

## 变更历史

- 2026-07-10：C-123 创建。完成增长资产审计，锁定 C124-C128 顺序、退出条件、Owner 输入、自动发布红线与官方依据。
