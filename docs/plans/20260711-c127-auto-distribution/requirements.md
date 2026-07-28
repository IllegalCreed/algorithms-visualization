# 需求：提示词驱动的全自动内容分发

> Status: verified
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-28
> Progress: 100%
> Blocked by: none
> Next action: 已完成；下一步建立 `content-studio` 自动内容生产仓库，再进入 C128 真实发布复盘
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131、C-20260727-133
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_、TC-AUTO-GHCLI-127-\_、TC-AUTO-GHAUTH-127-\_、TC-AUTO-ACTIVATION-127-\_、TC-AUTO-RUNTIME-127-\_、TC-AUTO-GHOBS-127-\_、TC-AUTO-GHISSUE-127-\_、TC-AUTO-GHSTORE-127-\_、TC-AUTO-GHOPS-127-\_、TC-AUTO-GHSMOKE-127-\_、TC-AUTO-WBPROC-127-\_、TC-AUTO-WBCLI-127-\_、TC-AUTO-WBADAPTER-127-\_、TC-AUTO-WBRUNTIME-127-\_、TC-AUTO-WBSMOKE-127-\_、TC-AUTO-BSKYAPI-127-\_、TC-AUTO-BSKYADAPTER-127-\_、TC-AUTO-BSKYACT-127-\_、TC-AUTO-BSKYCHANNEL-127-\_、TC-AUTO-BSKYRUNTIME-127-\_、TC-AUTO-DEVAPI-127-\_、TC-AUTO-DEVADAPTER-127-\_、TC-AUTO-DEVACT-127-\_、TC-AUTO-DEVCHANNEL-127-\_、TC-AUTO-DEVOBS-127-\_、TC-AUTO-DEVRUNTIME-127-\_、TC-AUTO-DEVSMOKE-127-\_、TC-AUTO-MASTOAPI-127-\_、TC-AUTO-MASTOADAPTER-127-\_、TC-AUTO-MASTOACT-127-\_、TC-AUTO-MASTODONCHANNEL-127-\_、TC-AUTO-MASTOOBS-127-\_、TC-AUTO-MASTORUNTIME-127-\_、TC-AUTO-MASTOSMOKE-127-\_
> T4 tests: TC-AUTO-SCHEDULE-127-\_、TC-AUTO-REPORT-127-\_、TC-AUTO-POLICY-127-\_、TC-AUTO-FAQ-127-\_、TC-AUTO-GHREPLY-127-\_、TC-AUTO-BUGROUTE-127-\_
> T5 tests: TC-AUTO-ASSISTED-127-01..10

## 背景

原 C123 方案把 C127 定义为“生成草稿、每帖人工审批后发布”。Owner 现明确要求：完成一次性账号授权后，只给 campaign 提示词，系统应自动完成后续生成、发布、监测和复盘。

逐平台官方审计同时证明，各渠道能力并不对称。GitHub、Bluesky、DEV、Mastodon 可通过零费用官方能力进入首批自动化；微博官方写能力要求付费套餐，Free 只读，因此在 Owner 约束下移出 API 首批。Reddit 依赖应用审核与社区授权；V2EX、Hacker News、Product Hunt 只能人工发布后自动监测；掘金、知乎、小红书当前没有可依赖的官方创作者发布/反馈 API。

2026-07-27：C133 已将本计划早期的单项目 MCP v1/v2 运行时假设升级为 Project Profile 驱动的 MCP v3。历史段落保留当时事实；当前契约、隔离键、receipt 与 adapter 版本以 `docs/plans/20260727-c133-multi-project-marketing-ops/` 为准。

Owner 进一步确认本项目必须零新增费用，且没有企业主体、不会办理企业认证。因此微信公众号不进入当前实现范围；B站和付费 X 的 API 自动写不进入范围，但可以生成内容包并由 Owner 在官方 UI 免费发布。

因此本期的“全自动”不是用任意技术强行操作所有网站，而是：内容生产全自动；发布优先使用免费官方 API，其余已登记渠道进入明确的 Owner 辅助发布队列。C127 不实现浏览器 RPA；未来如需逐渠道引入，必须另行完成规则评审、Owner 明确启用与失败关闭测试。

2026-07-28 Owner 进一步明确：内容生成必须自动，平台发布可以半自动，并新增简书、Facebook、YouTube、抖音及既有掘金、知乎、B站、X 的后续分发诉求。T5 因此把“禁用 API 自动写”和“禁止生成内容”解耦：未获准 API/RPA 写入的平台仍可生成最终渠道包，但登录、验证码/2FA、复核与官方 UI 最终发布由 Owner 控制。

## 用户故事

Owner 给出主题、语言、时间、目标页面和期望反馈策略后，Codex 将其转换为结构化 campaign，生成平台原生内容，再调用独立 `marketing-ops` MCP。已接入且获得 matching campaign 授权的免费官方 adapter 可以自动发布；其余已登记渠道由 MCP 生成交接单，Owner 在官方 UI 最终发布并回填公开 URL。两条路径都可接续 1 小时、48 小时、7 天报告。

Owner 不需要逐帖复制文案、手工拼 UTM 或逐个查看评论。内容生成不授予站外写权限；自动发布必须由 Owner 对匹配 campaign 明确授权，辅助发布还由 Owner 控制登录、验证码/2FA、复核与最终发布。账号授权过期、平台审核、付费确认与资质变更同样必须失败关闭。

## Owner 硬约束

- C127 不产生新的订阅、API credits、托管或模型调用费用。
- 只接入普通个人能够合规注册和授权的免费能力，不要求营业执照、企业认证或企业服务号。
- 微信公众号、B站、X 的 API 自动写在本期固定禁用；不得为了“完成渠道数”加入不可用 adapter 或付费 fallback。B站与 X 只允许 owner-assisted 官方 UI 交接。
- Reddit 可作为个人后备渠道，但审核成功不是 C127 首期退出条件。
- 首次渠道接入必须由向导逐步完成；日常使用只需自然语言 campaign，不要求 Owner 编辑 JSON、记忆命令或手工拼 UTM。

## 功能需求

### R1 自然语言 campaign 与显式执行授权

- 提示词必须规范化为可校验的 `CampaignSpec`，至少含主题、目标 URL、语言、渠道集合、发布时间、campaign ID、媒体策略、回复策略和失败策略。
- 普通内容生成提示词只生成 campaign 和内容包；只有 Owner 对匹配 campaign 明确授权的指令才允许自动渠道执行站外写入。
- owner-assisted 渠道即使已有 campaign 授权，也必须由 Owner 在官方 UI 控制登录、挑战、复核和最终发布；confirm 只登记公开引用。
- dry-run 保留为调试和预览能力；没有 matching 执行授权时必须保持零副作用。

### R2 能力注册表与失败关闭

- 每个渠道显式记录发布、指标、评论、回复、删除、授权、配额、成本和启用状态。
- 只有“执行模式已评审（官方 API 或受控 RPA）+ 当前授权完成 + 成本为免费 + 个人主体可用”时才能执行对应动作；官方能力等级与实际执行模式分别记录，RPA 不得把 D 级伪装成官方支持。
- Codex 只调用高层 MCP 工具，不接触 token、Cookie、密码、选择器或任意浏览器执行接口。
- C127 不实现通用浏览器 RPA，也不接受浏览器 Profile、selector、脚本、文件路径、Cookie 或 token。未来逐渠道引入时必须另立安全评审；遇到验证码、设备验证、会话失效或未知页面立即失败关闭，不做绕过。

### R3 渠道原生内容

- 同一主题生成中英文及平台原生变体，校验标题、长度、标签、链接、canonical、媒体和语言。
- 所有目标 URL 使用现有 UTM 规则，不把自由文本、账号标识或敏感信息写入 UTM。
- 内容事实从当前仓库与线上页面提取；不能继续传播已过期的页面数、测试数、功能或英文覆盖范围。

### R4 官方 adapter 与幂等发布

- 首批零费用 API adapter：GitHub、Bluesky、DEV、Mastodon。微博是原候选，2026-07-14 因 Free 零写额度移入后续独立 RPA 评审。
- 条件 adapter：仅 Reddit，且只在个人应用审核和目标社区授权通过后启用。
- 微信公众号、B站、X 在能力注册表中保留审计事实，但 `enabled=false` 且不得实现当前 API 发布 adapter；B站/X 可以生成 owner-assisted package。
- 每次发布产生 receipt，记录平台 post ID、URL、时间、内容摘要、幂等键和 adapter 版本；重试不得重复发帖。
- `publish_campaign` 使用 MCP v3 七工具契约携带公开 renderer 生成的确定性平台包；本地插件不得复制文案、长度或 UTM renderer。
- 支持平台具备官方能力时实现查询、更新或删除；不伪造不存在的撤回能力。
- 微博采用官方 `@weibo-ai/weibo-cli`；CLI 的平台 action 目录由登录账号和套餐动态返回，不得猜测 `statuses` 写 action。T3-D1-A 只实现固定进程边界、`doctor` 健康、只读 statuses 目录和注入式 fake adapter。Owner 的 OAuth 与个人认证已完成，但官方 Free 为 7 天只读试用、写额度为 0；不领取短期试用、不冻结 publish action、不启用 production adapter。
- Bluesky 固定使用官方 `@atproto/api@0.20.28`；公开 renderer 只生成一个英文正文变体。一次性 setup 只在交互式 TTY 接收公开 handle 与专用 App Password，secret 写入 macOS Keychain，本地 activation 只保存公开 handle/DID；每次注册 adapter 前重新对拍三者与实时身份。2026-07-14 setup 已完成，status/doctor 为 ready/enabled；Owner 授权的固定 smoke 已完成发布、读取、幂等复放与删除，receipt 为 deleted、远端 record 不存在，当前无临时帖子残留。
- DEV 固定使用 Forem API v1 与 `api-key` 请求头；只允许单篇英文、无媒体、带项目 canonical 的 Markdown 文章。API key 仅经隐藏 TTY 写入 macOS Keychain，0600 activation 只保存公开 username/user ID；本人文章完整分页查询、确定性 marker 与本地 receipt 共同保证幂等。指标仅采集稳定文章响应中的 reactions/comments，评论正文一律标为 untrusted；当前官方作者接口没有真实删除文章能力，因此 `reply=false`、`delete=false`，不得把改回草稿描述为删除。2026-07-15 一次性 setup、只读身份对拍与 Owner 授权的正式文章闭环已完成，status/doctor 为 ready/enabled，receipt `4146005` published，文章长期公开。
- Mastodon 固定使用实例 HTTPS 根与 v1 accounts/statuses/notifications 端点；access token 仅经隐藏 TTY 写入 Keychain，0600 activation 只保存实例、完整公开句柄和 account ID。2026-07-27 已通过官方 regenerate 让旧 token 失效并完成替代 token setup，status/doctor 为 ready/enabled；matching 授权的 T3-D4-C 临时发布、读取、幂等、反馈、报告与删除闭环已完成并清理。

### R4A 独立 MCP 与 RPA 边界

- `marketing-ops` 是独立本地程序/个人插件，不放入公开 SPA 仓库；通过本地 stdio 或 Unix Socket 暴露 MCP。
- MCP 只提供 `channels_status`、`publish_campaign`、`get_publish_status`、`list_feedback`、`reply_feedback`、`delete_post`、`get_campaign_report` 等高层工具，不提供通用 `browser_eval` 或任意脚本执行。
- 官方 adapter 优先；仅缺少官方写能力且 Owner 明确启用的平台才使用 RPA adapter。
- RPA 使用 Owner 手工完成一次登录后的专用持久化浏览器 Profile；不把登录表单、密码、Cookie 或 storage state 返回给 Codex。
- 文章和评论中的文本均为不可信数据，不能自行触发发布、回复、删除或其他 MCP 写操作。
- 提供本地 `setup`、`status`、`doctor` 向导：OAuth/设备授权打开官方页面，API key/App Password 只经不回显输入写入 Keychain；禁止通过命令参数、环境变量、JSON 或聊天录入 secret。

### R5 人工发布桥接

- owner-assisted 集合固定为掘金、V2EX、B站、知乎、Hacker News、Product Hunt、微博、X、简书、Facebook、YouTube、抖音；renderer 自动生成最终标题、正文、UTM 链接和媒体计划，但不操作官方 UI。
- `publish_campaign.execution` 默认 `automatic`；`assisted-prepare` 只返回本地交接，不调用自动 adapter、不创建 publication receipt。
- Owner 在官方 UI 中控制登录、验证码/2FA、复核和最终发布；系统不接收 Cookie、Profile、selector、浏览器脚本、密码或本地文件路径。
- `assisted-confirm` 必须复用相同 project/campaign/package/caller 幂等键，并接收与渠道 host/path 规则匹配的公开 URL；post ID 由 URL 提取，不能由 caller 任意覆盖。
- 确认后保存 `assisted-owner-confirmed@1.0.0` project receipt；它只表示 Owner 确认，不宣称 MCP 创建或远端验证了帖子。没有 collector 的报告保持 `collector-not-implemented`。
- 现有媒体合同只有 `image|gif|video` 类型，没有可验证 artifact reference；因此 owner-assisted package 只允许 `media=[]`，非空媒体默认失败关闭，待 content-studio 提供资产合同后再扩展。
- 小红书、微信公众号没有进入本轮 owner-assisted 集合；Reddit 继续是审核后 API 后备，不阻塞 C127。

### R6 监测、回复与复盘

- 自动执行 1 小时健康检查、48 小时首轮复盘和 7 天最终复盘。
- 发布成功后自动建立三个一次性 Codex 跟进任务；到点调用 collector 并把摘要送回原任务，不要求 Owner 再次提示。
- 三个窗口以同一 campaign 最后一条成功主发布 receipt 的 `publishedAt` 为锚点，分别按 1、48、168 小时计算；任务键和到期时间必须确定且可由持久 receipt 重建，不能因进程重启、重复 publish/status 查询或渠道返回顺序变化而漂移。
- 插件只返回可供 Codex 创建一次性 automation 的脱敏计划，不监听公网端口、不把渠道凭据交给 GitHub Actions；到点前读取报告只能返回 `scheduled`，不能提前采集后伪装成对应窗口结果。
- 统一指标 schema，区分平台可见数值、不可观测项和推断；没有站内 tracker 时不得声称完成站内转化归因。
- 报告必须逐条覆盖主发布 receipt：可采集渠道返回标准化 metric；无 collector、授权失效、平台失败和已删除记录分别标记 `unavailable` / `failed`，不得省略渠道或把不可观测项写成 0。GitHub 最近 14 天仓库 traffic 只能作为不可归因背景。
- 只在原 campaign 保存的 `replies.mode=faq-only`、当前匹配授权、已知 published receipt、可重新读取的真实 feedback、白名单分类和渠道 reply adapter 全部通过时自动回复。首期只实现 GitHub Issue 评论的 typed reply；DEV、V2EX、Hacker News、Product Hunt 以及未接线渠道继续失败关闭。
- FAQ 白名单只覆盖简短致谢和项目文档/使用入口；争议、投诉、隐私、法律、安全、付款、账号、凭据、模糊分类和无法精确对拍的回复正文一律升级 Owner。
- 只有原 campaign 的 `createBugIssues=true`、feedback 同时命中明确缺陷与复现信号、无敏感/升级信号且 GitHub 目标健康时，才把反馈分流为 GitHub Issue。Issue 不复制原评论正文，只保存稳定 feedback ID 的 SHA-256、来源 URL、渠道、campaign 和通用待复核说明；远端 marker、本地 receipt 与 caller idempotency key 共同去重。

### R7 凭据和数据最小化

- API secret 进入 macOS Keychain/受控密钥管理，网页登录会话只存在专用浏览器 Profile；公开仓库、MCP 输出、日志和 artifact 均不得包含凭据。
- API 路径只接受 OAuth、refresh token、App Password、API key 或平台发放的应用凭据，不保存主密码。RPA 登录态只由专用 Profile 持久化，不导出 Cookie、storage state 或浏览器 session 给 Codex、日志、artifact 或公开仓库。
- 仓库只保存公开 post ID/URL、聚合指标和清洗后的报告；原始 token 与跨平台原始评论不提交。

## 非目标

- 不在 C127 接入第三方站内 tracker、付费分析订阅或独立数据库。
- 不购买平台 API credits，不办理企业认证，不建设只有企业主体才能启用的 adapter。
- 不承诺全部十九个登记渠道都能自动发布；平台规则、逐渠道评审、验证挑战和运行时安全 gate 都是硬边界。
- 不在 Codex 或公开仓库中运行任意浏览器脚本；本地 MCP 的 RPA 不使用 stealth、验证码代答、逆向签名或内部 API。
- 不在没有真实 campaign 证据前扩展其余 85 个英文页面或投放广告。

## 验收口径

- [x] 原 15 渠道与简书、Facebook、YouTube、抖音共 19 个渠道均有发布、监测、回复、授权、成本和官方依据结论。
- [x] 免费个人首批、Reddit 后备、人工桥接和硬禁用渠道边界已在 marketing、plan、roadmap 与 agent 记忆中一致落档。
- [x] `CampaignSpec`、能力注册表、renderer、UTM、schema 与 dry-run 有 L3 测试并通过。
- [x] MCP 契约证明 Codex 无法读取凭据或调用任意浏览器代码；RPA challenge 必须失败关闭。
- [x] GitHub 首次接入已通过 `setup` 向导完成，`status/doctor` 只显示账号别名、健康状态和下一步；真实 smoke 由 Owner 自然语言授权触发，未要求其操作 CLI 或 JSON。
- [x] DEV 一次性隐藏 setup 已完成；Keychain/0600 activation/实时身份对拍为 ready/enabled，公开 preflight 仅保留 matching campaign 执行授权 gate。
- [x] 首批 adapter 在 mock/sandbox 下验证成功、幂等、失败、限流、撤回和脱敏行为。
- [x] 至少一个非 GitHub 官方渠道完成真实授权和低风险端到端发布/采集演练（Bluesky 已完成并清理）。
- [x] 1h/48h/7d collector 与报告、回复白名单、Bug Issue 分流可验证。
- [x] 一次性跟进计划能由 publish/status 确定性恢复；任务中断时仍可从 project-scoped receipt 与脱敏 artifact 恢复。
- [x] 19 渠道登记、12 个 owner-assisted renderer package、prepare/confirm、URL/ID gate、receipt 幂等和报告 unavailable 边界均有 TDD 测试。
- [x] 全门禁通过，文档回写 verified；随后先建立 `content-studio` 自动内容生产仓库，再进入 C128 实际发布复盘。

## 开放输入

- GitHub、Bluesky、DEV 与 Mastodon 均曾完成一次性 setup 和真实闭环。2026-07-28 最终只读 `channels_status` 的当前状态为 GitHub ready；Bluesky、DEV、Mastodon `reauth-required`；微博 blocked。后续任何自动写入都需先重新隐藏 setup，并仍要求新 campaign 的 matching Owner 授权。
- DEV 固定 `marketing-ops-t3d3-smoke-127` 已完成 publish、正文读取、幂等复放、feedback 与 report；receipt `4146005` published，文章长期公开。2026-07-27 只读复查显示现有 API key 为 `reauth-required`，后续 DEV 写入前需重新隐藏 setup，并仍需对新 campaign 单独 matching 授权。
- 微博 setup 只能调用官方浏览器/设备 OAuth；`marketing-ops` 不接受 `--token`、`auth token --export`、微博主密码、Cookie 或 token 环境变量。当前不领取 Free 短期只读试用，不为通过 gate 购买套餐。
- Reddit 可后续报告应用审核与目标社区授权状态，不阻塞首期。
- 微信公众号继续排除；B站/X 的 API adapter 继续排除，但 owner-assisted 官方 UI 发布不等待企业资质或付费 API。

## 变更历史

- 2026-07-11：创建。完成全渠道官方能力审计，Owner 的新授权将“每帖人工审批”改为“提示词即 campaign 授权”；官方能力与凭据安全红线保持不变。
- 2026-07-11：Owner 确认零新增费用且无企业主体；微信/B站/X 移出实施范围，Reddit 降为非阻塞后备。
- 2026-07-11：Owner 选择“独立本地程序持有凭据、Codex 仅通过 MCP 调用”的隔离架构；C127 设计批准并后置到多语言/内容工作之后。
- 2026-07-11：C130 完成双轨发布，C127 成为当前下一阶段；状态保持 approved/25%，从 T1 基础层恢复。
- 2026-07-11：T1 完成 19 个 L3 Case、版本化 CampaignSpec、15 渠道注册表、幂等键、站点事实、renderer 与零副作用 dry-run；C127 转 in-progress/40%，下一步 T2。
- 2026-07-11：Owner 将全部英文翻译提升到宣传自动化之前；C127 保持 in-progress/40% 和既有 T1 成果，等待 C131 verified 后恢复 T2。
- 2026-07-11：C131 已完成 95 对页面与双轨发布；顺序阻塞解除，C127 恢复为当前主线，下一步 T2。
- 2026-07-11：T2 完成七工具 MCP 公开契约与独立本地 `marketing-ops` personal plugin 安全骨架；Keychain/Profile、队列、receipt、stdio 和低摩擦 CLI 共 20 个 Case 通过。当前仍未接入真实 adapter、账号或凭据，下一步 T3。
- 2026-07-11：T3-A 完成 MCP v2 平台包桥接、共享 adapter contract、GitHub Release typed fake client 与失败关闭 dispatch；20 个 Case 通过。默认 server 仍无 live client、账号授权或站外写入，C127 转 62%，下一步 T3-B。
- 2026-07-11：T3-B 完成固定 GitHub CLI、只读账号/仓库健康、0600 非秘密 activation 与惰性 runtime；16 个 Case、只读 smoke 与插件门禁通过。当前 health ready，但 adapter disabled、站外写入为零；C127 转 68%，下一步 T3-C。
- 2026-07-11：T3-C contract 完成 Release reactions、Issue comments、14 天仓库 traffic、receipt 查询/删除状态与 MCP status/feedback/report/delete；删除 Release 同时安全清理本工具创建的 Git tag。21 文件 / 93 用例、coverage、verify、STDIO 与扩展只读 smoke 通过；目标 Release/tag 均不存在，activation 仍缺失、零真实写入。C127 转 74%，等待固定 smoke campaign 的明确授权。
- 2026-07-11：Owner 明确授权固定 campaign 后完成唯一 GitHub create/read/delete/tag-cleanup 真实 smoke。Release `352517542` 的状态、零条反馈与不可归因仓库报告读取成功，随后 Release/tag 均删除并复查不存在，receipt 为 deleted；C127 转 76%，下一步 T3-D。
- 2026-07-14：微博认证通过后复核官方套餐；Free 为 0 元/7 天、5 读/小时、0 写/小时。未领取试用、未读 catalog、零写入；plugin `263fd3f` 禁止误报发布能力，当前转 Bluesky T3-D2。
- 2026-07-14：Bluesky T3-D2-A 以 plugin `2107843` 完成固定官方 SDK、英文文本 adapter、Keychain/0600 activation、一次性隐藏输入向导与惰性 runtime；29 文件 / 140 用例、coverage、verify 全绿。账号未接入、零 Bluesky 写入，C127 转 85%。
- 2026-07-14：Bluesky 一次性 setup 完成，status/doctor 为 ready/enabled；plugin `5d9aef1` 将 adapter 升至 `bluesky-text@0.2.0`，补齐已知 receipt + URL + 当前 DID 三重对拍删除。29 文件 / 144 用例、coverage、verify 全绿。Owner 随后授权固定 smoke；publish/read/同回执复放/delete/重复 delete 全部通过，receipt deleted、远端 record 不存在，C127 转 87%，下一步 T3-D3 DEV。
- 2026-07-15：T3-D3-A 完成 Forem v1 固定 API、`dev-article@0.1.0`、Keychain/0600 activation、惰性 runtime、文章指标/评论采集与 durable smoke preflight。plugin 35 文件 / 178 用例、coverage、verify、STDIO 全绿；公开 dry-run 仅返回执行/adapter/授权三项 blocker 且 `sideEffects=[]`。DEV 仍未 setup、零写入，C127 转 90%。
- 2026-07-15：T3-D3-B 隐藏 setup 与只读身份对拍完成；status/doctor 为 ready/enabled，API key 只在本机 Keychain。公开 preflight 现仅返回 `EXECUTION_NOT_APPROVED` 且 `sideEffects=[]`；尚无 receipt/文章，等待 T3-D3-C matching 授权。
- 2026-07-15：Owner matching 授权后完成 T3-D3-C；DEV 文章 `4146005` 的完整正文/API 元数据对拍、同 receipt 幂等复放、零反馈与 `1h` report 均通过。receipt published，文章长期公开，下一步 Mastodon。
- 2026-07-16：T3-D4-A Mastodon statuses/notifications adapter 工程完成并通过本地 verify；下一步 setup/identity smoke。
- 2026-07-27：C133 完成独立仓库、Project Profile、MCP v3 与跨项目隔离；Owner 后续将 `IllegalCreed/marketing-ops` 源码仓库改为 public，secret/runtime state 仍仅留本机。
- 2026-07-27：T3-D4-B 完成 Mastodon token regenerate、隐藏 setup 与只读身份对拍；status/doctor ready/enabled，下一步 T3-D4-C 固定预案与 matching 授权。
- 2026-07-27：T3-D4-C1 固定 campaign、英文正文、UTM、幂等键与清理顺序；dry-run 唯一 blocker 为 `EXECUTION_NOT_APPROVED`，等待 matching 授权。
- 2026-07-27：T3-D4-C2 matching 授权闭环完成；提交后段落还原缺陷先触发 `UNKNOWN_RESULT`，修复回归后同 payload 认领唯一远端状态，正文、幂等、反馈、`1h` 报告、删除、deleted receipt 与无缓存远端不存在均通过。
- 2026-07-28：T4 完成确定性 1h/48h/7d 跟进计划、跨渠道标准报告、FAQ-only 固定模板与 Bug Issue 安全分流。所有反馈写动作继续要求 matching Owner 授权、已知 published receipt 与平台 fresh reread；工程测试没有执行真实回复或建 Issue，C127 转 97%，下一步 T5。
- 2026-07-28：Owner 要求内容全自动、发布可半自动，并补充简书/Facebook/YouTube/抖音。T5 以 10 个精确 Case 先红后绿完成 19 渠道登记、12 渠道 owner-assisted package、七工具内 prepare/confirm、平台 URL/ID gate、project receipt 与三窗口接续；没有浏览器/RPA 或真实站外写入，C127 转 99%，进入 T6。
- 2026-07-28：T6 完成。plugin `60152d3` / 安装版 `0.1.0+codex.20260728231229` 与主仓库功能提交 `ef8c18c` 已固定；多渠道部分 receipt 缺陷追加 red/green 后，plugin 53 文件 / 263 用例、verify、coverage、Gitleaks、安装态和只读 status 全绿。主仓库 300 文件 / 2141 用例、coverage、118 L5 与 production/selfhost 各 190 页门禁全绿；C127 转 verified/100%，无真实渠道写入。
