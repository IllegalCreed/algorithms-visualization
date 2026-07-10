# 渠道全自动能力审计

> Status: active
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Current implementation: 尚未实现；C-20260711-127 正在设计与实施
> Execution source: `docs/marketing/execution-backlog.md`

## 目的

本文件回答一个具体问题：Owner 只给一次 campaign 提示词后，哪些渠道能通过受支持的官方能力完成内容生成、发布、监测、反馈归纳和允许范围内的回复。

结论只依据截至 2026-07-11 可核验的官方文档、当前仓库配置和平台公开规则。账号价值高低不改变接口是否受支持；没有官方发布能力的渠道不会退化为浏览器模拟登录、内部接口、Cookie 复用、验证码绕过或明文密码托管。

## “全自动”的项目定义

完成一次性账号接入后，Owner 可以只发送类似下面的提示词：

> 推广“快速排序可视化”：中英双语，发布到所有已授权自动渠道，2026-07-12 20:00 JST 开始；生成平台原生文案和素材，48 小时与 7 天复盘；常见问题按批准策略回复，Bug 反馈建 GitHub Issue。

系统随后应自动完成：

1. 把提示词规范化为 `CampaignSpec`，读取站内页面、标题、描述、截图和 UTM 规则。
2. 为每个平台生成独立文案与媒体清单，执行链接、长度、标签、语言和平台规则校验。
3. 查询能力注册表；只有已授权且官方能力支持的渠道才能产生站外副作用。
4. 发布后保存渠道 ID、URL、时间、内容摘要和幂等键，不保存主密码、Cookie 或原始访问令牌。
5. 在 1 小时、48 小时和 7 天采集可得指标与评论，生成跨渠道摘要。
6. 仅在官方 API 和平台规则同时允许时自动回复；缺陷类反馈创建可追踪的 GitHub Issue。

发布成功后，Codex 为本次 campaign 建立 1h/48h/7d 一次性跟进任务；到点后触发确定性 collector，再在原任务中归纳结果。这样内容理解继续使用 Owner 已在使用的 Codex，GitHub Actions 只做 schema、发布和采集，不需要在 workflow 里另配一个按量付费的 LLM API key。

提示词本身就是本次 campaign 的发布授权，已接入的 A 级渠道不再逐帖要求人工确认。账号授权过期、平台审核、付款、验证码或资质变化属于一次性/异常接入事件，不能伪装成已自动完成。

## 能力等级

| 等级 | 含义                                                                                    |
| ---- | --------------------------------------------------------------------------------------- |
| A    | 完成一次性官方授权后，可由提示词触发自动发布和监测；回复能力另列                        |
| B    | 官方能力存在，但依赖企业/认证主体、应用审核、社区安装或平台单独批准                     |
| C    | 官方发布必须人工操作，但发布后可通过官方 API 自动监测                                   |
| D    | 未发现面向普通创作者的受支持发布/反馈 API；只保留人工渠道，不进入自动发布或自动监测流程 |

“未发现”表示本次在官方开放平台、开发文档和服务条款中没有找到可依赖的公开能力，不等于平台内部不存在接口。后续若平台发布新的官方文档，应重新审计并提升等级。

## 原计划十渠道结论

| 渠道         | 等级 | 自动发布                                     | 自动监测                                   | 自动回复                               | 当前决策                                                                                                   |
| ------------ | ---- | -------------------------------------------- | ------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 掘金         | D    | 不支持：未找到公开创作者发布 API             | 不支持：未找到公开评论/数据 API            | 不支持                                 | 保留人工草稿；禁止复用网页 Cookie、内部 `content_api` 或主密码                                             |
| V2EX         | C    | 不支持：API 2.0 无创建主题/回复端点          | 支持：主题、回复、通知可读                 | 不支持；规则也禁止把 AI 回复冒充本人   | 人工发帖后自动监测；不自动回帖                                                                             |
| B站          | B    | 支持视频/文章，但需开放平台与 UP 授权        | 支持稿件状态和播放、点赞、评论数等聚合数据 | 未找到评论正文读取/回复的受支持接口    | 仅在主体资质、应用和 UP 授权全部通过后启用；当前不能视为完整反馈闭环                                       |
| 知乎         | D    | 不支持：未找到公开创作者发布 API             | 不支持：未找到公开创作者反馈 API           | 不支持                                 | 保留人工渠道；服务条款明确限制未经授权的自动程序访问                                                       |
| 小红书       | D    | 不支持无人值守发布；官方分享平台已暂停接入   | 不支持：未找到普通笔记反馈 API             | 不支持                                 | 保留人工渠道；广告/营销开放平台不等于普通创作者笔记发布 API                                                |
| 微信公众号   | B    | 支持草稿和发布接口，但账号类型与认证有门槛   | 支持阅读/分享数据及留言管理                | 支持留言回复                           | 符合资格的认证服务号/企业账号可形成完整闭环；2025-07 起个人主体、未认证企业等账号已被回收相关接口权限      |
| Hacker News  | C    | 不支持：官方 Firebase API 只读               | 支持：帖子、分数和评论树可读               | 不支持                                 | 人工提交 Show HN 后自动监测；遵守“不主要把 HN 当推广渠道”的社区规则                                        |
| Reddit       | B    | 支持，但需应用审核及目标 subreddit 授权/安装 | 支持：获批应用可读取帖子、评论和指标       | 条件支持                               | 只有应用审核、社区授权和目标版规均通过才启用；未获批时不使用旧脚本、浏览器会话或抓取替代                   |
| Product Hunt | C    | 普通 API schema 无创建产品 mutation          | 支持：公开产品、评论和投票可读             | 不支持；官方规则禁止 AI 生成评论       | 人工在官方 UI 创建/排期产品，随后自动监测；除非 Product Hunt 书面批准写权限且官方 schema 提供对应 mutation |
| GitHub       | A    | 支持 Release、Issue、Discussion 等官方能力   | 支持 Issue/评论/反应及最近 14 天仓库流量   | 支持 Issue/Discussion 范围内的受控回复 | 首批直接启用；当前仓库 Discussions 未开启，v1 使用 Release + Issue，开启 Discussions 后再增加对应 adapter  |

## 补充与替代渠道

| 渠道          | 等级           | 自动化能力                                                                        | 成本/门槛                                      | 当前决策                                                           |
| ------------- | -------------- | --------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| 微博          | A              | 官方 Agent CLI 支持文字、图片、视频、长文发布，以及评论、转发、搜索和趋势工作流   | 一次设备 OAuth；Free 为每小时 5 次调用         | 国内自动渠道优先级最高；低频首发先使用 Free                        |
| Bluesky       | A              | 官方 AT Protocol 支持发帖、串文、图片、链接、回复和公开数据读取                   | 账号 + App Password；遵守反垃圾规则            | 海外自动渠道优先级最高                                             |
| DEV Community | A（发布/监测） | Forem API 支持 Markdown 文章发布、canonical、标签、阅读/反应/评论数据和评论树读取 | 账号 + API key；官方限制 30 秒 10 次请求       | 用于英文技术长文同步；评论回复保留人工，避免假设不存在的写评论端点 |
| Mastodon      | A              | 官方 API 支持发布、排期、幂等、编辑、删除、回复、上下文和通知                     | 选择实例 + OAuth token；同时受实例规则约束     | 作为可选的开放社交渠道；启用前固定实例及其规则                     |
| X             | A（付费可选）  | X API v2 支持发帖、回复和指标读取                                                 | 预付 credits；带 URL 发帖当前为每次 0.200 美元 | 技术可行但不纳入零新增成本 v1；Owner 明确预算后再启用              |

由此，零新增订阅成本的第一自动渠道组合是 **GitHub + 微博 Free + Bluesky + DEV + Mastodon**。DEV 的发布和反馈采集可自动，回复保持人工；其余四个渠道可以在规则允许范围内形成更完整闭环。

## 官方依据

### 掘金、V2EX、B站

- [掘金用户协议](https://juejin.cn/terms)要求账号持有人保管密码，并限制未经授权的第三方工具和自动化访问；本次未在掘金官方站点找到公开的创作者发布、评论或数据 API。
- [V2EX API 2.0](https://www.v2ex.com/help/api)提供 PAT、主题/回复/通知读取和有限管理端点，但没有创建主题或回复端点；当前文档给出的限制为每 IP 每小时 600 次。
- [V2EX Assertive](https://www.v2ex.com/help/assertive)明确要求不要把 AI 生成回复当成自己的回复，[Spam 说明](https://www.v2ex.com/help/spam)也反对重复导流式推广。
- [哔哩哔哩开放平台](https://openhome.bilibili.com/doc)列出账号授权、视频/文章发布与稿件数据能力；[开发者服务协议](https://openhome.bilibili.com/agreement/developer-service)覆盖批量发布和 UP 授权。
- [开放平台管理协议](https://openhome.bilibili.com/agreement/management-protocol)当前准入材料要求中国大陆合法登记主体、营业执照和盖章承诺书；最终资格以开放平台控制台审核为准。[隐私政策](https://openhome.bilibili.com/agreement/privacy-policy)列出播放、点赞、评论数、投币、收藏、弹幕和分享等稿件数据。本次未找到评论正文列表或回复的官方开放接口。

### 知乎、小红书、微信公众号

- [知乎协议](https://www.zhihu.com/term/zhihu-terms)限制未经授权的插件、第三方工具和自动程序访问、收集或处理知乎内容；本次未找到面向普通创作者的官方发布或反馈 API。
- [小红书分享平台](https://agora.xiaohongshu.com/doc)描述的是拉起客户端发布 UI 的分享 SDK，当前页面标注“暂停接入”；[创作服务平台](https://creator.xiaohongshu.com/login?source=official)仍是人工发布入口。广告营销 API 不能当作普通笔记发布 API。
- [微信公众号草稿接口](https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html)与[发布接口](https://developers.weixin.qq.com/doc/offiaccount/Publish/Publish.html)支持草稿、提交发布、状态查询、列表和删除。发布文档同时说明自 2025-07 起，个人主体、未认证企业及不具备认证资格的账号被回收相关接口权限。
- [公众号留言管理](https://developers.weixin.qq.com/doc/service/guide/product/comments.html)支持开关留言、列表、精选、删除和回复；[图文分析接口](https://developers.weixin.qq.com/doc/offiaccount/Analytics/Graphic_Analysis_Data_Interface.html)提供阅读、分享等数据，具体能力仍以账号权限为准。

### Hacker News、Reddit、Product Hunt、GitHub

- [Hacker News 官方 API](https://github.com/HackerNews/API)提供公开只读数据，没有写端点；[发帖指南](https://news.ycombinator.com/newsguidelines.html)要求不要主要把 HN 用作推广。
- [Reddit Developer Platform 用户操作](https://developers.reddit.com/docs/capabilities/server/userActions)支持以用户身份提交帖子和评论；[应用发布与安装](https://developers.reddit.com/docs/get-started/publish)要求应用版本审核，并由目标 subreddit 管理员控制安装。[Reddit 数据访问说明](https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data)与[开发者条款](https://redditinc.com/policies/developer-terms)继续约束审批、数据使用和反垃圾行为。
- [Product Hunt API](https://api.producthunt.com/v2/docs)默认只读，部分写权限需要单独批准；[官方 GraphQL schema](https://github.com/producthunt/producthunt-api/blob/master/schema.graphql)当前没有创建产品或评论 mutation。[发布](https://help.producthunt.com/en/articles/479557-how-to-post-a-product)和[排期](https://help.producthunt.com/en/articles/2724119-how-to-schedule-a-post)通过官方 UI 完成，[评论规则](https://help.producthunt.com/en/articles/10030102-commenting-guidelines)禁止 AI 生成评论。
- GitHub 官方 REST API 支持 [Releases](https://docs.github.com/en/rest/releases/releases)、[Issues](https://docs.github.com/en/rest/issues)、[Issue comments](https://docs.github.com/en/rest/issues/comments)、[Reactions](https://docs.github.com/en/rest/reactions)和[最近 14 天 Traffic](https://docs.github.com/en/rest/metrics/traffic)；GraphQL 提供 [Discussions](https://docs.github.com/en/graphql/reference/discussions)。公共仓库使用标准 GitHub-hosted runner 不产生 Actions 分钟费用，具体仍受 [Actions 用量与计费](https://docs.github.com/en/actions/concepts/billing-and-usage)政策约束。

### 微博、Bluesky、DEV、Mastodon、X

- [微博开放平台 Agent CLI](https://open.weibo.com/cli)提供官方 AI/命令行工作流、设备 OAuth、内容发布与互动管理；Free 当前为每小时 5 次调用，付费档从每月 29 元起。CI 只保存 OAuth refresh token，不保存微博主密码。
- [Bluesky 入门](https://docs.bsky.app/docs/get-started)与[发帖指南](https://docs.bsky.app/blog/create-post)展示 App Password、session 与 `createRecord` 流程；[速率限制](https://docs.bsky.app/docs/advanced-guides/rate-limits)当前给出每小时 5,000 write points、每天 35,000 points，普通低频 campaign 远低于此值。
- [Forem API](https://developers.forem.com/api/)支持 API key；[Articles API](https://developers.forem.com/api/v1#tag/articles/operation/createArticle)支持 Markdown 发布、canonical、标签与封面，文章/评论读取可用于指标和反馈采集。本次未在官方 API 找到创建评论端点。
- [Mastodon statuses API](https://docs.joinmastodon.org/methods/statuses/)支持 OAuth 发布、排期、`Idempotency-Key`、编辑、删除、回复和上下文读取；实例可以设置更严格的本地规则。
- [X 创建帖子](https://docs.x.com/x-api/posts/create-post)使用 X API v2；[当前定价](https://docs.x.com/x-api/getting-started/pricing)为预付 credits 的按量计费，含 URL 的 content create 当前为每次 0.200 美元，[指标文档](https://docs.x.com/x-api/fundamentals/metrics)说明可得指标范围。

## 目标架构

```mermaid
flowchart LR
  P["Owner campaign 提示词"] --> S["CampaignSpec"]
  S --> C["站内事实与素材生成"]
  C --> V["平台规则、UTM 与内容校验"]
  V --> G{"能力注册表与授权状态"}
  G -->|A/B 且已授权| A["官方 adapter 发布"]
  G -->|C| M["人工发布队列"]
  G -->|D/未授权| F["失败关闭并报告原因"]
  A --> R["Receipt：ID、URL、幂等键"]
  M --> R
  R --> K["1h / 48h / 7d collector"]
  K --> N["标准化指标与反馈摘要"]
  N --> O["报告、受控回复、Bug Issue"]
```

### 组件边界

- **Codex 任务**：理解提示词、读取仓库事实、生成 `CampaignSpec` 和内容、触发工作流，并创建 1h/48h/7d 一次性跟进任务。
- **确定性发布器**：GitHub Actions 中执行 schema 校验、能力 gate、官方 API adapter、幂等发布和 receipt 记录；不在 workflow 中重新猜测用户意图。
- **采集器**：由跟进任务按 campaign ID 调用，只读取平台官方可得数据，保留公开 ID/URL/聚合指标；原始令牌和跨平台原始评论不提交进仓库。
- **反馈交付**：Codex 在原任务中归纳 1h 健康状态、48h 初报和 7d 总结；工作流同时可保存脱敏 artifact/Issue，避免一次任务中断后结果完全丢失。
- **能力注册表**：每个渠道记录 `publish`、`metrics`、`comments`、`reply`、`delete`、`auth`、`cost`、`status` 和官方依据。平台能力变化时先改注册表与测试，再启用 adapter。
- **失败策略**：缺 secret、授权过期、配额不足、schema 变化或平台拒绝时立即停止该渠道，其他渠道按 campaign 的 `failureMode` 决定继续或整体回滚；绝不自动改走网页模拟。

## 凭据与一次性接入

| 渠道       | Owner 只需完成的一次性动作                      | 自动化保存的凭据                     | 不接受                       |
| ---------- | ----------------------------------------------- | ------------------------------------ | ---------------------------- |
| GitHub     | 确认 Releases/Issues 范围；可选开启 Discussions | workflow `GITHUB_TOKEN`              | Personal password            |
| 微博       | 运行官方 CLI 设备 OAuth 并授权                  | refresh token secret                 | 微博主密码、Cookie           |
| Bluesky    | 创建专用 App Password                           | handle + App Password secret         | 账号主密码                   |
| DEV        | 创建 API key                                    | API key secret                       | 网页 session                 |
| Mastodon   | 选择实例、确认实例规则并创建应用/token          | instance URL + OAuth token secret    | 主密码                       |
| 微信公众号 | 确认账号主体/认证/API 权限，配置 IP 白名单      | AppID + AppSecret secrets            | 后台登录密码                 |
| B站        | 完成开放平台主体、应用审核与 UP 授权            | official client/OAuth secrets        | UP 主密码、Cookie            |
| Reddit     | 完成应用审核并获得目标 subreddit 安装/授权      | approved app/OAuth secrets           | 浏览器 session、未批准旧脚本 |
| X          | 确认预算并创建开发者应用                        | OAuth secrets + credits budget guard | 主密码、无限预算             |

所有 secret 进入 GitHub Environment Secrets 或等价密钥管理，日志必须脱敏。聊天中曾经暴露过的主密码不作为接入材料，应先轮换；未来只提供“账号是否存在、官方授权是否完成”的状态，不在聊天中发送 secret。

## 内容与回复边界

- 不把同一文案机械复制到所有平台；每个平台有独立标题、长度、标签、链接位置、媒体和互动问题。
- 默认启用频率上限、重复度检查、campaign 冷却时间和幂等键，避免重试变成重复发帖。
- V2EX 与 Product Hunt 禁止 AI 自动回复；Hacker News 无官方写 API；DEV 在找到官方写评论端点前保持人工回复。
- 微博、Bluesky、Mastodon、GitHub、符合授权条件的微信/Reddit，只能在预先批准的 FAQ、致谢、补充链接和 Bug 分流范围自动回复。争议、投诉、法律、安全、隐私与付款问题升级给 Owner。
- B站开放平台当前只确认稿件和聚合指标能力，未形成评论正文/回复闭环，不把评论数误写成用户反馈内容。

## 实施顺序

1. **T1 基础层**：`CampaignSpec`、能力注册表、渠道内容 renderer、UTM、schema、dry-run 和幂等 receipt。
2. **T2 首批 adapter**：GitHub、微博、Bluesky、DEV、Mastodon；secret 缺失时自动跳过并输出接入清单。
3. **T3 反馈层**：1h/48h/7d collectors、Codex 一次性跟进、标准化报告、受控回复和 GitHub Issue 分流。
4. **T4 条件渠道**：Owner 取得资质后接入微信公众号、B站、Reddit。
5. **T5 人工桥接**：V2EX、Hacker News、Product Hunt 生成最终可发布内容，Owner 返回 URL 后自动接管监测。
6. **长期禁用**：掘金、知乎、小红书维持 D 级；仅在新的官方能力通过复审后改变。

## 复审触发条件

- 平台官方 API、价格、账号准入、速率限制或 AI 内容规则变化。
- adapter 连续出现授权失败、schema 不兼容或平台警告。
- Owner 新增账号、企业主体、公众号认证、Reddit 社区授权或 X 预算。
- 需要启用新渠道或自动回复新类别。

## 变更历史

- 2026-07-11：完成原计划十渠道及五个补充/替代渠道的官方能力审计；将 C127 从统一“半自动”改为按能力等级失败关闭的提示词驱动方案。
