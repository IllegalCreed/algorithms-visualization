# 营销与增长执行清单

> Status: active
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Current plan: C-20260710-129 撤销第三方分析接入（verified）
> Next plan: C-126 `/en` 多语言十页试点
> Strategy: `docs/marketing/roadmap.md`
> Launch materials: `docs/marketing/launch-posts.md`

## 定位

本文件是 1.0 封版后营销、国际化与增长工程的**当前执行事实源**。它回答三件事：现在已经有什么、下一步按什么顺序做、每一阶段怎样才算完成。

- `roadmap.md` 只保存策略、渠道与长期判断。
- `launch-posts.md` 保存可复用的发布文案和素材清单。
- 本文件保存 C124-C129 的顺序、状态、依赖、退出条件和 Owner 外部行动。
- 每个进入实施的阶段仍需新建四文档 plan，不直接把本清单当实现说明。

## 当前基线审计

| 能力             | 状态   | 仓库事实                                                                                  | 结论                                                                                 |
| ---------------- | ------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 全局元数据       | 已有   | `index.html` 有中文 root fallback title/description/canonical/OG/Twitter/JSON-LD          | 无脚本或初始化前仍有首页语义；运行时由 route head 覆盖                               |
| 分享卡           | 已有   | `public/og-cover.png`，C-118 已产出国内首发文案                                           | 发布素材可用，仍需用渠道数据验证效果                                                 |
| robots           | 已有   | `public/robots.txt` 分开允许 OAI-SearchBot、禁止 GPTBot，并保留通用 Allow 与 sitemap      | 搜索发现与训练抓取已按保守策略分开；后续改策略需单独评审                             |
| sitemap          | 已有   | C124 构建从真实首页 catalog 发现并生成 95 个尾斜杠 canonical URL                          | 不再维护 `public/sitemap.xml` 手工清单；build 漏页或集合不一致会失败                 |
| llms.txt         | 已有   | C124 构建生成三个功能入口与 92 个内容页的标题、描述和 canonical                           | 作为实验性机器导航保留，不是搜索排名或 AI 引用保证                                   |
| 路由级 SEO       | 已有   | 95 页唯一 title/description/canonical/OG/Twitter/robots/JSON-LD；docs/about 使用 noindex  | C124 已完成双轨上线核验                                                              |
| 首屏机器可读内容 | 已有   | Playwright 构建后预渲染 95 页；JSDOM 与本地 HTTP 逐页验证 article 正文、head、base 与内链 | canonical/sitemap/静态内链统一指向尾斜杠目录入口；仍不把技术地基描述为收录或排名保证 |
| 分析与归因       | 已撤销 | C129 已删除 tracker、会话归因、交互事件、隐私页与 analytics L5；保留 UTM 纯函数和 CLI     | 当前零第三方统计成本；稳定流量出现后再单独立项评审测量方案                           |
| 站点多语言       | 缺失   | UI 与文章主体为中文；播放器仅代码语言切换                                                 | C126 先做 `/en` 十页试点，不把代码语言标签误写成站点国际化                           |
| 内容生产自动化   | 缺失   | 只有人工发布草稿，无生成器、审批流、渠道 API 或定时 workflow                              | C127 先做草稿生成和人工审批，再评估官方 API                                          |
| 发布复盘         | 缺失   | 尚无 48 小时/7 天发布数据                                                                 | C128 先用渠道原生指标、UTM、实际发布 URL、评论与投入时间形成下一轮决策               |

## 固定执行顺序

`C124 SEO/GEO` -> `C125 分析尝试（superseded）` -> `C129 撤销 tracker/保留 UTM` -> `C126 英文试点` -> `C127 内容与分发自动化` -> `C128 发布与复盘`

顺序约束：

1. C124 先让页面具备可靠的可发现性与可引用语义。
2. C125 完成方案评审但未激活生产统计；C129 在流量/收入验证前撤销第三方成本，只保留 UTM。
3. C126 先用十页验证英文信息架构与翻译质量，再决定是否扩到 92 个条目。
4. C127 只在内容结构和 UTM 规则稳定后自动生成，不自动放大错误内容。
5. C128 国内发布可先使用渠道原生指标和人工复盘；海外发布依赖 C126，自动化批次再依赖 C127。

## 阶段看板

| 阶段                      | 状态       | 目标                                               | 退出条件                                                           | 主要依赖                       |
| ------------------------- | ---------- | -------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| C123 增长执行审计与编排   | verified   | 统一事实、顺序、边界与历史状态                     | 当前基线、C124-C128、Owner 输入和测试索引全部落档                  | C117、C118、C119-C122          |
| C124 SEO/GEO 技术地基重建 | verified   | 让每个可索引页面具备唯一语义和可验证的机器可读产物 | 双域产物检查通过；路由/meta/sitemap 同步守护；搜索平台提交清单就绪 | C123                           |
| C125 分析、事件与渠道归因 | superseded | 历史方案：第三方 page view、事件与会话归因         | 未激活生产统计；由 C129 撤销                                       | C124                           |
| C129 撤销第三方分析接入   | verified   | 删除 tracker 与事件，保留零成本 UTM 工具           | 运行时/产物零 tracker；UTM CLI、全门禁和双 base 通过               | C125；当前 plan C-20260710-129 |
| C126 `/en` 多语言十页试点 | planned    | 验证英文 UI、文章、搜索与国际 SEO 全链路           | 十页双语内容、切换、canonical/hreflang/sitemap、桌面/移动测试通过  | C124、C129                     |
| C127 内容生成与半自动分发 | planned    | 从单一内容清单生成渠道草稿、素材和 UTM 链接        | dry-run 产物可审阅；人工批准后才允许官方 API 发布                  | C126；渠道账号/API 能力        |
| C128 发布、监测与迭代     | planned    | 完成国内/海外冷启动并用可得证据决定下一轮          | 每批次有 48h/7d 报告、渠道判断、观测限制与明确后续动作             | 海外批次依赖 C126/C127         |

## C124 SEO/GEO 技术地基重建

### 必做范围

- 修正 `<html lang>`，建立可测试的路由级 title、description、canonical、Open Graph 数据源。
- 结构化数据只描述页面真实可见内容，优先 JSON-LD；不把结构化数据写成排名承诺。
- 已用真实 production/selfhost 产物验证 Playwright 构建后预渲染，当前规模采用该方案；若未来页数或构建时间显著增长，再重新评审 SSG/SSR。
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

### 发布后搜索平台提交清单

- [ ] 在 Google Search Console 验证 `algo.illegalscreed.cn` 对应站点资产，并提交 `https://algo.illegalscreed.cn/sitemap.xml`。
- [ ] 用 URL 检查抽查首页、`/docs/quick-sort/`、`/docs/dijkstra/`，记录抓取到的 canonical、渲染与索引状态；不把“已请求”写成“已收录”。
- [ ] 在 Bing Webmaster Tools 验证或导入站点，提交同一 sitemap，并记录首次发现/抓取基线。
- [ ] 检查线上 `robots.txt` 对 OAI-SearchBot/GPTBot/通用 crawler 的最终策略与仓库一致。
- [ ] 首次提交后在 48 小时和 7 天记录覆盖变化；IndexNow 暂不启用，出现高频 URL 更新需求时再立项。

## C125 / C129 分析路线结论

### 当前生效决策

- C125 曾完成 GA4/Plausible/Umami 评审和未激活的 provider-neutral 前端实现；生产环境从未配置 website ID，也未发送统计数据。
- Owner 确认项目尚未验证流量与收入，不接受先承担第三方订阅或额外数据库运维成本。C129 因此删除 Umami 配置、transport、会话归因、事件、隐私页和 analytics L5。
- 当前只保留 `src/analytics/utm.ts`、`scripts/generate-campaign-link.ts`、`pnpm marketing:link` 与发布草稿中的 UTM 链接。
- C125 四文档与 `analytics-playbook.md` 作为历史记录保留，当前实现与测试入口以 `docs/plans/20260710-c129-analytics-rollback/` 为准。

### 当前边界

- 不加载任何第三方 tracker，不在前端建立 page view watcher，不发送搜索、播放、输入、测验或分享事件。
- UTM 值继续使用小写 ASCII、最长 64 的统一规则；不得放入邮箱、自由文本或用户输入。
- 冷启动复盘明确区分站内不可观测行为与渠道可见指标，不把 UTM 本身误写成已完成归因。
- 只有出现稳定流量、明确指标问题和可接受预算后，才新建独立 plan 评审 Nginx 最小日志、第三方服务或其他方案。

### C129 退出条件

- production/selfhost 运行时和产物不含 tracker/provider/website ID。
- launch-posts 链接、UTM 纯函数与 CLI 继续可用。
- 282/2041 Vitest、110/110 Playwright、coverage 和双 base 95 页门禁通过。

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

1. 国内批次：掘金、V2EX、B站；用 UTM、渠道原生指标、实际评论与投入时间复盘，不等待第三方属性 ID。
2. 海外批次：Hacker News、Reddit、Product Hunt，在 C126 英文试点完成后开始；自动化发布还需 C127。
3. 每个批次在 48 小时与 7 天复盘，不同渠道不使用同一文案和同一发布时间假设。

### 退出条件

- 每个发布记录实际 URL、版本、时间、UTM、素材、48h/7d 指标与评论反馈。
- 明确保留 1-2 个高投入产出渠道，暂停低效渠道，并将反馈转成独立 bug/内容/产品 plan。
- 广告与重度变现继续作为流量验证后的决策，不在冷启动阶段牺牲学习体验。

## Owner 外部输入与阻塞

| 输入                                        | 最晚需要阶段 | 说明                                                               |
| ------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| 分析工具选择与属性 ID                       | deferred     | C129 已撤销；稳定流量出现并重新立项前不注册、不付费、不提供属性 ID |
| Google Search Console / Bing Webmaster 权限 | C124 发布后  | 完成域名验证、sitemap 提交与覆盖报告查看                           |
| GPTBot 训练策略                             | 已完成       | 当前为 Disallow；OAI-SearchBot 保持 Allow                          |
| 英文术语与品牌口吻确认                      | C126         | 十页样本上线前人工审校                                             |
| 渠道账号、API access 与 secrets             | C127         | 各平台逐项核实，不假定都有自动发布 API                             |
| 赞赏码/爱发电图片                           | C128 前可选  | 早期信号实验，不阻塞 SEO、多语言或发布                             |
| 隐私与平台合规确认                          | C127-C128    | 邮件、自动发布、未来统计和广告均需单独确认                         |

## 官方依据与适用边界

| 主题              | 官方资料                                                                                                                                                              | 本项目采用的边界                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| JavaScript SEO    | [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)                                          | Google 可渲染 JavaScript，但渲染可能排队；不能由此推断所有爬虫都能可靠读取 SPA                   |
| 多语言与 hreflang | [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)                                                     | alternate 必须自引用、双向、完整 URL；项目优先选一种维护面最小的声明方式                         |
| 结构化数据        | [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)                                                   | 使用 JSON-LD 描述可见内容，测试语法；不承诺富结果或排名                                          |
| OpenAI 搜索爬虫   | [OpenAI publishers and developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)                                                    | OAI-SearchBot 管搜索可见性，GPTBot 训练选择独立；ChatGPT 推荐流量可观察 `utm_source=chatgpt.com` |
| GA4 Cookie/同意   | [GA4 Cookie usage](https://support.google.com/analytics/answer/11397207)、[Consent types](https://support.google.com/analytics/answer/12334711)                       | 默认 web tag 使用第一方 Cookie；本期不引入 GA4 consent 与广告能力                                |
| Plausible 分析    | [Plausible data policy](https://plausible.io/data-policy)、[custom events](https://plausible.io/docs/custom-props/for-custom-events)                                  | 历史评审备选；当前不接入，未来采用前重新核价与核实能力                                           |
| Umami 分析        | [Cloud FAQ](https://docs.umami.is/docs/cloud/faq)、[tracker functions](https://docs.umami.is/docs/tracker-functions)、[sessions](https://docs.umami.is/docs/sessions) | C125 历史评审对象；C129 已撤销接入，不再等待账号或 retention                                     |
| GitHub 定时工作流 | [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)                                                  | `schedule` 使用 UTC 且运行默认分支最新提交；C127 先人工触发再定时                                |
| URL 更新通知      | [Bing IndexNow](https://www.bing.com/webmasters/help/indexnow-0z209wby)                                                                                               | 仅作变更通知加速，保留 sitemap 和正常抓取路径                                                    |
| llms.txt          | [llms.txt proposal](https://llmstxt.org/)                                                                                                                             | 视为实验性机器说明文件，不当作标准或收录保证                                                     |

## 变更历史

- 2026-07-10：C-123 创建。完成增长资产审计，锁定 C124-C128 顺序、退出条件、Owner 输入、自动发布红线与官方依据。
- 2026-07-10：C-124 四文档建立并进入 TDD；C-034 转 superseded，当前实现入口切到 C-124。
- 2026-07-10：C-124 本地实现与全门禁完成，95 页 route head/JSON-LD/预渲染/sitemap/llms/双 base 已验证；待双轨上线与搜索平台人工提交。
- 2026-07-10：C-124 以功能提交 `c98dcaa` 完成 Pages/selfhost 双轨上线与静态深链核验，状态转 verified；工程主线切到 C125。
- 2026-07-10：C-125 四文档建立并进入 TDD；先评审 Umami 自托管，前端采用 provider-neutral、无自由文本、配置缺失时失败关闭的边界；随后只读审计否决同机部署。
- 2026-07-10：C-125 T1-T3 完成；服务器资源审计否决同机自托管，改选 Umami Cloud Hobby，待 Owner 完成邮箱验证、EU 区域、website ID 与 retention 确认。
- 2026-07-10：C-125 本地工程与全门禁完成：285/2060 Vitest、112/112 Playwright、coverage、双 base 95 页及产物凭据扫描通过；生产统计仍禁用。
- 2026-07-10：C-129 按 Owner 决策撤销第三方分析，保留 UTM；282/2041 Vitest、110/110 Playwright、coverage、双 base 95 页与产物扫描通过，下一阶段 C126。
