# 需求：提示词驱动的全自动内容分发

> Status: in-progress
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 76%
> Blocked by: none
> Next action: 开始 T3-D，先实现微博 Free adapter 的 typed contract、健康 gate 与无写测试，再依次推进 Bluesky、DEV、Mastodon
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_、TC-AUTO-GHCLI-127-\_、TC-AUTO-GHAUTH-127-\_、TC-AUTO-ACTIVATION-127-\_、TC-AUTO-RUNTIME-127-\_、TC-AUTO-GHOBS-127-\_、TC-AUTO-GHISSUE-127-\_、TC-AUTO-GHSTORE-127-\_、TC-AUTO-GHOPS-127-\_、TC-AUTO-GHSMOKE-127-\_

## 背景

原 C123 方案把 C127 定义为“生成草稿、每帖人工审批后发布”。Owner 现明确要求：完成一次性账号授权后，只给 campaign 提示词，系统应自动完成后续生成、发布、监测和复盘。

逐平台官方审计同时证明，各渠道能力并不对称。GitHub、微博、Bluesky、DEV、Mastodon 可通过官方能力进入首批自动化；Reddit 依赖应用审核与社区授权；V2EX、Hacker News、Product Hunt 只能人工发布后自动监测；掘金、知乎、小红书当前没有可依赖的官方创作者发布/反馈 API。

Owner 进一步确认本项目必须零新增费用，且没有企业主体、不会办理企业认证。因此微信公众号、B站和付费 X 即使理论上存在官方能力，也不进入当前实现范围。

因此本期的“全自动”不是用任意技术强行操作所有网站，而是：官方 API 优先；只有逐渠道完成规则评审、Owner 明确启用且能够失败关闭时，独立 MCP 才可使用受控 RPA。其余渠道保持禁用或进入明确的人工发布队列。

## 用户故事

Owner 完成一次性渠道接入后，只需给出主题、语言、时间、目标页面和期望反馈策略。Codex 将其转换为结构化 campaign，生成平台原生内容，再调用独立 `marketing-ops` MCP；MCP 内部选择官方 API 或受控本地 RPA，并在 1 小时、48 小时、7 天汇总指标与反馈。

Owner 不需要逐帖复制文案、手工拼 UTM、逐个查看评论或再次批准 A 级渠道；但账号授权过期、平台审核、付费确认、验证码与资质变更仍需 Owner 处理。

## Owner 硬约束

- C127 不产生新的订阅、API credits、托管或模型调用费用。
- 只接入普通个人能够合规注册和授权的免费能力，不要求营业执照、企业认证或企业服务号。
- 微信公众号、B站、X 在本期固定禁用；不得为了“完成渠道数”加入不可用 adapter 或付费 fallback。
- Reddit 可作为个人后备渠道，但审核成功不是 C127 首期退出条件。
- 首次渠道接入必须由向导逐步完成；日常使用只需自然语言 campaign，不要求 Owner 编辑 JSON、记忆命令或手工拼 UTM。

## 功能需求

### R1 提示词即 campaign 授权

- 提示词必须规范化为可校验的 `CampaignSpec`，至少含主题、目标 URL、语言、渠道集合、发布时间、campaign ID、媒体策略、回复策略和失败策略。
- A/B 级且已授权渠道在该 campaign 范围内不再要求逐帖人工审批。
- dry-run 保留为调试和预览能力，但不是每次正式发布的必经人工闸门。

### R2 能力注册表与失败关闭

- 每个渠道显式记录发布、指标、评论、回复、删除、授权、配额、成本和启用状态。
- 只有“执行模式已评审（官方 API 或受控 RPA）+ 当前授权完成 + 成本为免费 + 个人主体可用”时才能执行对应动作；官方能力等级与实际执行模式分别记录，RPA 不得把 D 级伪装成官方支持。
- Codex 只调用高层 MCP 工具，不接触 token、Cookie、密码、选择器或任意浏览器执行接口。
- 官方接口缺失时，MCP 可对 Owner 自有账号使用本地 Playwright RPA；遇到验证码、设备验证、会话失效或未知页面立即返回结构化错误，不做绕过。

### R3 渠道原生内容

- 同一主题生成中英文及平台原生变体，校验标题、长度、标签、链接、canonical、媒体和语言。
- 所有目标 URL 使用现有 UTM 规则，不把自由文本、账号标识或敏感信息写入 UTM。
- 内容事实从当前仓库与线上页面提取；不能继续传播已过期的页面数、测试数、功能或英文覆盖范围。

### R4 官方 adapter 与幂等发布

- 首批 adapter：GitHub、微博、Bluesky、DEV、Mastodon。
- 条件 adapter：仅 Reddit，且只在个人应用审核和目标社区授权通过后启用。
- 微信公众号、B站、X 在能力注册表中保留审计事实，但 `enabled=false` 且不得实现当前发布 adapter。
- 每次发布产生 receipt，记录平台 post ID、URL、时间、内容摘要、幂等键和 adapter 版本；重试不得重复发帖。
- `publish_campaign` 使用 version 2 契约携带公开 renderer 生成的确定性平台包；私有插件不得复制文案、长度或 UTM renderer。
- 支持平台具备官方能力时实现查询、更新或删除；不伪造不存在的撤回能力。

### R4A 独立 MCP 与 RPA 边界

- `marketing-ops` 是独立本地程序/个人插件，不放入公开 SPA 仓库；通过本地 stdio 或 Unix Socket 暴露 MCP。
- MCP 只提供 `channels_status`、`publish_campaign`、`get_publish_status`、`list_feedback`、`reply_feedback`、`delete_post`、`get_campaign_report` 等高层工具，不提供通用 `browser_eval` 或任意脚本执行。
- 官方 adapter 优先；仅缺少官方写能力且 Owner 明确启用的平台才使用 RPA adapter。
- RPA 使用 Owner 手工完成一次登录后的专用持久化浏览器 Profile；不把登录表单、密码、Cookie 或 storage state 返回给 Codex。
- 文章和评论中的文本均为不可信数据，不能自行触发发布、回复、删除或其他 MCP 写操作。
- 提供本地 `setup`、`status`、`doctor` 向导：OAuth/设备授权打开官方页面，API key/App Password 只经不回显输入写入 Keychain；禁止通过命令参数、环境变量、JSON 或聊天录入 secret。

### R5 人工发布桥接

- V2EX、Hacker News、Product Hunt 生成最终稿和发布说明，但不自动操作官方 UI。
- Owner 返回真实发布 URL/ID 后，系统自动接管官方可支持的监测与复盘。
- 掘金、知乎、小红书只生成可选人工草稿，不进入自动监测承诺。

### R6 监测、回复与复盘

- 自动执行 1 小时健康检查、48 小时首轮复盘和 7 天最终复盘。
- 发布成功后自动建立三个一次性 Codex 跟进任务；到点调用 collector 并把摘要送回原任务，不要求 Owner 再次提示。
- 统一指标 schema，区分平台可见数值、不可观测项和推断；没有站内 tracker 时不得声称完成站内转化归因。
- 只在官方 API 与平台规则同时允许时按白名单策略自动回复；争议、投诉、隐私、法律、安全和付款问题升级给 Owner。
- 可操作的缺陷反馈去重后创建 GitHub Issue，并附来源 URL 和不含敏感信息的摘要。

### R7 凭据和数据最小化

- API secret 进入 macOS Keychain/受控密钥管理，网页登录会话只存在专用浏览器 Profile；公开仓库、MCP 输出、日志和 artifact 均不得包含凭据。
- API 路径只接受 OAuth、refresh token、App Password、API key 或平台发放的应用凭据，不保存主密码。RPA 登录态只由专用 Profile 持久化，不导出 Cookie、storage state 或浏览器 session 给 Codex、日志、artifact 或公开仓库。
- 仓库只保存公开 post ID/URL、聚合指标和清洗后的报告；原始 token 与跨平台原始评论不提交。

## 非目标

- 不在 C127 接入第三方站内 tracker、付费分析订阅或独立数据库。
- 不购买平台 API credits，不办理企业认证，不建设只有企业主体才能启用的 adapter。
- 不承诺所有十五个审计渠道都能自动发布；平台规则、逐渠道评审、验证挑战和运行时安全 gate 都是硬边界。
- 不在 Codex 或公开仓库中运行任意浏览器脚本；本地 MCP 的 RPA 不使用 stealth、验证码代答、逆向签名或内部 API。
- 不在没有真实 campaign 证据前扩展其余 85 个英文页面或投放广告。

## 验收口径

- [x] 十个原计划渠道和五个补充/替代渠道均有发布、监测、回复、授权、成本和官方依据结论。
- [x] 免费个人首批、Reddit 后备、人工桥接和硬禁用渠道边界已在 marketing、plan、roadmap 与 agent 记忆中一致落档。
- [x] `CampaignSpec`、能力注册表、renderer、UTM、schema 与 dry-run 有 L3 测试并通过。
- [x] MCP 契约证明 Codex 无法读取凭据或调用任意浏览器代码；RPA challenge 必须失败关闭。
- [x] GitHub 首次接入已通过 `setup` 向导完成，`status/doctor` 只显示账号别名、健康状态和下一步；真实 smoke 由 Owner 自然语言授权触发，未要求其操作 CLI 或 JSON。
- [ ] 首批 adapter 在 mock/sandbox 下验证成功、幂等、失败、限流、撤回和脱敏行为。
- [ ] 至少一个非 GitHub 官方渠道完成真实授权和低风险端到端发布/采集演练。
- [ ] 1h/48h/7d collector 与报告、回复白名单、Bug Issue 分流可验证。
- [ ] 一次性跟进能在原任务交付 1h/48h/7d 结果；任务中断时仍有脱敏 artifact/Issue 可恢复。
- [ ] 全门禁通过，文档回写 verified；随后进入 C128 实际发布复盘。

## 开放输入

- GitHub 已完成一次性 setup 并保持 enabled；T3-D 接入具体 adapter 时，Owner 只需在首次向导中确认微博、Bluesky、DEV、Mastodon 是否有账号；不要在聊天发送密码或 token。Codex 届时逐步引导，日常 campaign 不要求再次操作向导。
- Reddit 可后续报告应用审核与目标社区授权状态，不阻塞首期。
- 微信公众号、B站、X 已由 Owner 明确排除，不再等待账号、企业资质或预算输入。

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
