# 实现记录：提示词驱动的全自动内容分发

> Status: in-progress
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-28
> Progress: 97%
> Blocked by: none
> Next action: T4 调度、标准报告、FAQ-only 与 Bug Issue 分流已完成；进入 T5 RPA/Reddit/人工桥接评审
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131、C-20260727-133
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_、TC-AUTO-GHCLI-127-\_、TC-AUTO-GHAUTH-127-\_、TC-AUTO-ACTIVATION-127-\_、TC-AUTO-RUNTIME-127-\_、TC-AUTO-GHOBS-127-\_、TC-AUTO-GHISSUE-127-\_、TC-AUTO-GHSTORE-127-\_、TC-AUTO-GHOPS-127-\_、TC-AUTO-GHSMOKE-127-\_、TC-AUTO-WBPROC-127-\_、TC-AUTO-WBCLI-127-\_、TC-AUTO-WBADAPTER-127-\_、TC-AUTO-WBRUNTIME-127-\_、TC-AUTO-WBSMOKE-127-\_、TC-AUTO-BSKYAPI-127-\_、TC-AUTO-BSKYADAPTER-127-\_、TC-AUTO-BSKYACT-127-\_、TC-AUTO-BSKYCHANNEL-127-\_、TC-AUTO-BSKYRUNTIME-127-\_、TC-AUTO-DEVAPI-127-\_、TC-AUTO-DEVADAPTER-127-\_、TC-AUTO-DEVACT-127-\_、TC-AUTO-DEVCHANNEL-127-\_、TC-AUTO-DEVOBS-127-\_、TC-AUTO-DEVRUNTIME-127-\_、TC-AUTO-DEVSMOKE-127-\_、TC-AUTO-MASTOAPI-127-\_、TC-AUTO-MASTOADAPTER-127-\_、TC-AUTO-MASTOACT-127-\_、TC-AUTO-MASTODONCHANNEL-127-\_、TC-AUTO-MASTOOBS-127-\_、TC-AUTO-MASTORUNTIME-127-\_、TC-AUTO-MASTOSMOKE-127-\_
> T4 tests: TC-AUTO-SCHEDULE-127-\_、TC-AUTO-REPORT-127-\_、TC-AUTO-POLICY-127-\_、TC-AUTO-FAQ-127-\_、TC-AUTO-GHREPLY-127-\_、TC-AUTO-BUGROUTE-127-\_
> Related design: design.md

## 执行顺序

`T0 渠道能力与 MCP 方案审计` -> `T1 CampaignSpec/能力注册表/dry-run` -> `T2 MCP contract/凭据边界` -> `T3 首批 API adapters/receipt` -> `T4 collectors/回复/报告` -> `T5 RPA 评审/Reddit 后备/人工桥接` -> `T6 全门禁/真实 smoke/C128 移交`。

> 当前实现说明：C133 已把本文件记录的单项目 MCP v1/v2 演进为 MCP v3 多项目运行时，并建立独立 GitHub 仓库；Owner 后续将源码仓库改为 public，secret/runtime state 仍仅留本机。历史提交和版本号保留当时事实；当前实现与门禁见 `docs/plans/20260727-c133-multi-project-marketing-ops/implementation.md`。

## T0 渠道审计与方案收束

- [x] 从 marketing 清单提取掘金、V2EX、B站、知乎、小红书、微信公众号、Hacker News、Reddit、Product Hunt、GitHub 十个正式渠道。
- [x] 补充审计 Header 已有分享目标微博/X，以及 DEV、Bluesky、Mastodon 三个可替代自动渠道。
- [x] 逐项核验官方发布、指标、评论、回复、授权、准入、成本和规则。
- [x] 建立 A/B/C/D 能力等级；原始依据集中落在 `docs/marketing/channel-automation-audit.md`。
- [x] Owner 的提示词改为 campaign 授权；保留官方 API 优先、secret 隔离和受控 RPA 失败关闭红线。
- [x] 确认独立本地 `marketing-ops` MCP：凭据/浏览器 Profile 服务侧持有，Codex 只调用高层工具。

## T1 基础层

- [x] 先写 `CampaignSpec` schema、规范化、幂等键和非法输入红测。
- [x] 先写十五渠道能力集合、关键禁用项和授权/cost gate 红测。
- [x] 实现渠道 renderer、当前站点事实读取、内容限制校验和 dry-run manifest。
- [x] 复用现有 UTM 纯函数与 CLI，不复制参数规则。

## T2 MCP contract 与凭据边界

- [x] 先写七个高层 MCP 工具的 schema、鉴权、脱敏与任意浏览器执行拒绝红测。
- [x] 实现一次性 `setup` 向导及只读 `status/doctor`，正常 campaign 不要求 Owner 编辑 JSON 或记忆命令。
- [x] 建立 macOS Keychain、每平台持久化 Profile、健康检查与 `REAUTH_REQUIRED` 边界。
- [x] 建立本地队列、stdio、campaign 并发控制和 receipt 存储；T2 不需要常驻 Unix Socket。

## T3 首批 API adapters

### T3-A contract、GitHub mock 与 dispatch

- [x] 将 MCP contract 升到 v2，要求 `publish_campaign` 携带公开 renderer 生成的平台包。
- [x] 建立共享 adapter metadata/capability/input/error/receipt contract 与独立业务核心 coverage 门槛。
- [x] 以注入的 typed fake client 实现 GitHub Release draft、远端 marker 幂等、创建、删除与错误映射。
- [x] 建立 adapter registry、全渠道预检、continue-supported、local receipt 短路与同键异内容冲突检测。
- [x] 建立 MCP runtime handler 注入桥接；默认 server 不注入 live client，继续失败关闭。

### T3-B GitHub CLI、健康检查与显式启用

- [x] 建立固定 `gh` 进程边界：`shell: false`、安全环境白名单、固定超时/输出上限、禁用交互提示，不继承 token 环境变量。
- [x] 建立 typed `gh auth status` / `gh api` client；只允许账号、仓库与 Release get/create/delete 固定操作，Release 正文只经 stdin JSON 传入。
- [x] 建立只读账号与仓库健康检查，区分未安装、需重授权、权限/仓库阻塞和 ready；公开输出不含 scope、Keychain 或本地路径。
- [x] 建立 0600 原子非秘密 activation；健康 ready 不自动启用，只有 `setup github` 成功后才允许注册 adapter。
- [x] 将动态 `channels_status` 与惰性 PublishService 接入默认 STDIO server；每次发布前重新检查 activation 与健康状态。
- [x] 完成真实只读 smoke；未调用 Release POST/DELETE，未创建 activation，adapter 保持 disabled。

### T3-C GitHub collector、Issue、运行时与安全撤回

- [x] 增加固定 Release detail/reactions、仓库 traffic、Issue list/create/comments 与 Git tag ref get/delete typed CLI；继续禁止任意 endpoint/query/args。
- [x] 实现 GitHub collector：Release reactions 与 asset downloads 可归属，traffic 固定标记最近 14 天仓库级且不可归因 campaign。
- [x] 实现 Issue marker 幂等 create 与只读 comments；自动回复能力继续 false，T4 才接 Bug feedback 分流。
- [x] 实现 receipt campaign/postRef 查询、0600 deleted 原子更新，以及 MCP status/feedback/report/known delete；activation 或 fresh health 失效时失败关闭。
- [x] 审计并修复 Release 删除后遗留 Git tag：发布前拒绝不明归属 tag，删除前对拍 marker，Release 与 adapter-owned tag 均清理后才标记 receipt deleted。
- [x] 冻结 `marketing-ops-t3c-smoke-127` 零副作用预案；只读确认目标 Release/tag 均不存在，activation 仍缺失。
- [x] 获得 matching campaign 明确授权后执行唯一 create/read/delete/tag-cleanup 真实 smoke。

### T3-D 其余首批 API adapters

- [x] T3-D1-A：冻结微博官方 CLI 版本、Free/个人 gate、固定进程边界与 production 无写命令面。
- [x] T3-D1-A：以 red-green tests 实现 `doctor` 健康、只读 statuses 目录、脱敏 runtime 状态与注入式纯文字 adapter contract；live publish 继续不注册。
- [x] T3-D1-B：Owner 完成官方 OAuth 与个人认证；复核 Free 为 7 天只读、零写额度，因此不领取试用、不冻结 publish action、不创建 activation。
- [x] T3-D1-B：plugin `263fd3f` 经 red-green 禁止将 Free ready 误报为可发布；production adapter 继续 disabled。
- [ ] T3-D1-C：当前零费用约束下禁用；只在官方提供免费写能力或 T5 独立 RPA 评审通过后重开。
- [x] T3-D2-A：Bluesky 固定官方 SDK、英文文本 adapter、App Password 隐藏向导、Keychain/activation 与惰性 runtime。
- [x] T3-D2-B1：Owner 完成一次性 setup；status/doctor 对拍为 ready/enabled。
- [x] T3-D2-B2：plugin `5d9aef1` 补齐仅限已知 receipt + URL + 当前 DID 的安全删除，并冻结零副作用 smoke 输入。
- [x] T3-D2-B3：matching campaign 明确授权后完成低风险 publish/read/delete smoke 与公开 URL 清理复查。
- [x] T3-D3-A：DEV/Forem 固定 API、英文 article adapter、Keychain/0600 activation、惰性 runtime 与 metrics/comments collector，保持 `reply=false`、`delete=false`。
- [x] T3-D3-B：Owner 创建专用 DEV API key，并在隐藏 TTY 完成一次性只读身份 setup；不在聊天或仓库录入 secret。
- [x] T3-D3-C：Owner 对 durable campaign 单独明确授权后执行 publish/read/幂等/反馈与报告 smoke；文章长期保留，不执行伪删除。
- [x] T3-D4-A：Mastodon statuses/notifications adapter。
- [x] T3-D4-B：旧 token 经官方 regenerate 失效；替代 token 只走本机隐藏 PTY，setup/identity/status/doctor 均通过。
- [x] T3-D4-C1：冻结零副作用 campaign 预案，锁定英文正文、UTM、幂等键、单渠道 package 与清理顺序。
- [x] T3-D4-C2：matching 授权后完成 publish/read/幂等/反馈/报告/delete 与远端清理复查。
- [ ] 每个 adapter 完成成功、认证失败、限流、未知结果、幂等和日志脱敏 contract tests。

- [ ] 每个 adapter 只通过 `marketing-ops` 读取所需 secret；公开仓库和 GitHub Actions 不持有渠道凭据。
- [ ] 设置最小平台权限、campaign concurrency、超时、重试和预算 guard。
- [ ] receipt 记录 ID/URL/hash/幂等键/adapter version，不记录 token、Cookie 或 storage state。
- [ ] dry-run 与正式 publish 路径有可自动验证的副作用边界。

#### T3-D1-A 实施证据

- 初始 red：5 个测试文件失败，4 个目标模块缺失，`local-runtime` 仍返回静态微博状态；补充边界审计又以 3 个失败断言锁定付费方案拒绝、action 排序与正文/链接校验。
- 本地插件提交 `3858b56`：固定 `weibo` 进程、安全环境与有界输出；production 只接受 `doctor` 和 available `statuses` 目录；健康输出仅含 alias/gate/reason，adapter 始终未注册。
- 注入式 `weibo-text@0.1.0` fake adapter 完成单中文正文、完整最近发布查询、幂等复用、严格 receipt、401/403/429/5xx/未知结果与 unsupported capability 对拍；未调用任何微博写接口。
- 最终 plugin 25 个测试文件 / 111 个用例通过；coverage 为 statements 97.76%、branches 93.85%、functions 99.23%、lines 98.35%；`pnpm verify` 与 STDIO smoke 通过。
- 官方 `@weibo-ai/weibo-cli@0.8.3` help 与源码参数对拍通过；隔离空白环境的 `doctor --output json` 仅返回 login/developerVerification/subscription 均 false。未登录、未读 commands catalog、未创建 activation、未发帖。

#### T3-D1-B 接入进度

- 2026-07-11 深夜以 pnpm 将固定 `@weibo-ai/weibo-cli@0.8.3` 安装到已在 PATH 的 `~/.local/bin`；浏览器 OAuth 在官方 token exchange 返回 400 后失败关闭，改用官方 device flow 成功登录。未接收或导出密码、Cookie、token。
- 登录后真实 `doctor` 返回 `subscription: null`；先以 TC-AUTO-WBCLI-127-03 红测复现通用 TEMPORARY_FAILURE，再将该字段收紧为“对象或 null”，插件提交 `088229d`。最终 25 文件 / 111 用例、coverage（97.76/93.85/99.23/98.35）与 verify 全绿。
- Owner 官方页面已显示个人认证通过；CLI `/cli/whoami` 仍返回 `developerVerification=false` / identity `unverified`，其 `checkedAt` 为 2026-07-11，按平台传播延迟处理，不重新导出或检查 token。
- 2026-07-14 官方套餐目录返回 Free `price=0`、`days=7`、仅本人数据、每小时 5 次读取与 0 次写入。因为它无法支持发布且会消耗短期试用，未领取 Free、未读 commands catalog、未创建微博 activation。
- 先以失败用例复现 runtime 仍提示“冻结 Free publish command”，再修正为“Free 只读，发布保持 disabled”；plugin 提交 `263fd3f`，25 文件 / 111 用例、coverage（97.76/93.85/99.23/98.35）、verify 与 STDIO smoke 全绿。
- 公开仓库先以 channel/dry-run/renderer 失败断言复现微博仍在自动集合，再将其移入 manual bridge；7 个 marketing 测试文件 / 30 个用例通过。最终 `pnpm verify` 通过 299 个测试文件 / 2131 个用例，并完成 190 页预渲染与 SEO 校验。
- T3-D1 官方 API 发布线在 Owner 零费用约束下失败关闭，production adapter 仍 disabled，零微博写入；当前转入 T3-D2 Bluesky。

#### T3-D2-A 工程证据

- 公开 renderer 先以失败断言复现 Bluesky 同时生成中英两个变体，再收紧为单个英文正文；私有 adapter 不复制文案或 UTM，只接受该确定性 package。
- 本地插件提交 `2107843` 固定官方 `@atproto/api@0.20.28`：登录健康只返回公开 handle/DID；本人最近正文查询用于幂等；RichText 生成链接 facet；创建结果严格对拍 AT URI、CID、时间与公开 URL。
- setup 只在交互式 TTY 接收公开 handle 与不回显的专用 App Password。secret 只写 macOS Keychain；0600 activation 只保存公开 handle/DID。activation、Keychain handle 与实时身份不一致、损坏或异常时全部失败关闭。
- runtime 只为本次请求包含的 Bluesky package 惰性注册 adapter；T3-D2-A 完成时默认 CLI 实测为 `not-configured / setup-required`，当时尚未接入账号且零网络写入；当前状态已由下方 T3-D2-B setup 证据更新。
- plugin 29 个测试文件 / 140 个用例、coverage（97.53/93.31/99.35/98.25）、`pnpm verify` 与 STDIO smoke 全绿；Bluesky activation/channel 安全模块四项覆盖率均为 100%。

#### T3-D2-B setup、安全删除与真实 smoke 证据

- 本机隐藏向导完成 Bluesky setup；`node dist/cli.js status` 为 `Bluesky ready enabled`，`doctor` 为 `Bluesky API: ready` / `Bluesky adapter: enabled`。输出不含 handle、DID、App Password 或 session。
- 删除能力先以 5 个 red failure 锁定 SDK、adapter 与 local runtime 缺口，再实现到 plugin 29 文件 / 144 用例全绿；plugin `5d9aef1`、`pnpm verify`、STDIO 七工具 smoke 与 coverage（97.57/93.45/99.35/98.28）通过，`bluesky-post.ts` 四项覆盖率为 100%。
- 公开 smoke spec 与 preflight runtime 已固定；授权前 `pnpm marketing:dry-run` 输出唯一 `EXECUTION_NOT_APPROVED`、无 render issue、`sideEffects=[]`，当时本地 `marketing-ops-t3d2-smoke-127` receipt 数为 0，未调用 publish/delete 写接口。
- Owner 随后明确授权同一固定 campaign。MCP 发布返回唯一 `bluesky-text@0.2.0` published receipt；AT Protocol 直接读取正文与公开 renderer 完全一致；相同 publish 请求复放返回同一 postId/publishedAt，campaign receipt 仍只有一条。
- `delete_post` 返回 deleted，receipt 转 deleted；相同删除请求复放返回 already-deleted，`com.atproto.repo.getRecord` 返回 HTTP 400，确认远端 record 不存在。完整公开 URL 因含账号 DID 只保存在私有 receipt，不进入公开仓库。
- 公开仓库 `pnpm verify` 通过 299 个测试文件 / 2131 个用例与 190 页 production 预渲染/SEO 校验；`pnpm coverage` 与 118 条 Playwright 回归全绿。

#### T3-D3-A DEV 工程与零副作用证据

- 官方 Forem v1 审计确认 API key 身份读取、文章创建/读取、本人文章列表及评论树可用；未找到真正的作者删除文章端点。adapter 因此只声明 publish/status/metrics/feedback，固定 `reply=false`、`delete=false`。
- 初始 red 为 5 个测试文件因 DEV activation/API/adapter/channel/observability 模块缺失失败；随后补齐 runtime 测试和公开 durable campaign dry-run。本地插件最终 35 个测试文件 / 178 个用例全绿。
- `pnpm verify` 完成 format、type-check、178 tests、build、Swift Keychain helper 与七工具 STDIO smoke；coverage 为 statements 97.88%、branches 94.35%、functions 99.46%、lines 98.58%，DEV activation/channel/observability/article adapter 四项均满足 100% 独立门槛，DEV API 为 98.11/95.38/100/100。
- 真实只读 CLI 复查为 `DEV Community not-configured setup-required`，doctor 为 `DEV API: not-configured` / `DEV adapter: disabled`；没有创建 activation、没有录入 API key、没有访问私有 DEV 账号数据或调用写接口。
- 公开 `c127-dev-smoke.json` 固定 Quick Sort 英文长文候选；正文覆盖 Lomuto 分区语义、可尝试输入与复杂度观察点。dry-run 无 render issue、`sideEffects=[]`，只返回 `EXECUTION_NOT_APPROVED`、`ADAPTER_UNAVAILABLE`、`AUTH_REQUIRED` 三项 blocker。幂等键为 `campaign-v1/marketing-ops-t3d3-smoke-127/f3b723fbff257e8e8d5b291bf996b44bb5fc2cc00f67bb941fdc276f7459366b`。
- 公开仓库最终全门禁通过：`pnpm verify` 完成 299 个 Vitest 文件 / 2132 个用例及 190 页 production 预渲染/SEO 校验；coverage 为 statements 95.48%、branches 86.31%、functions 92.03%、lines 95.82%；Playwright 104 个文件 / 118 个用例全绿。

#### T3-D3-B DEV 一次性 setup 证据

- Owner 在自己的交互式终端运行隐藏向导；API key 未进入聊天、argv、环境变量、公开仓库或日志。setup 只调用 `/users/me` 完成身份校验，并写入 Keychain 与仅含公开 username/userId 的 0600 activation。
- setup 后只读 `node dist/cli.js status` 返回 `DEV Community ready enabled`；`doctor` 返回 `DEV API: ready` / `DEV adapter: enabled`。输出不含 username、userId、API key 或 Keychain 内容。
- 公开 preflight 将 `adapterReady` / `authorized` 更新为 true，保留 `executionApproved=false`；固定 campaign dry-run 唯一 blocker 为 `EXECUTION_NOT_APPROVED`，无 render issue 且 `sideEffects=[]`。尚无 DEV receipt/文章，未调用 publish。

#### T3-D3-C DEV durable campaign 证据

- Owner 精确授权 `marketing-ops-t3d3-smoke-127` 后，公开 renderer 生成唯一 DEV English article package；MCP 首次 `publish_campaign` 返回 receipt `4146005`、adapter `dev-article@0.1.0`、status `published` 且 failures 为空。
- matching 授权只在本次 MCP payload 内注入；仓库 preflight 继续保留 `executionApproved=false`，不形成 DEV 永久写授权。后续 campaign 仍须单独授权。
- DEV 公开 API 回读文章 `4146005`，ID、标题、完整 `body_markdown`、canonical 与公开 URL 五项均与 renderer/adapter 预期精确一致；正文为 2188 bytes，content hash 为 `377e6a6753a7949af4b07c2078b75b6ae425991b4cc7ccea2007baea950b7d5e`。
- 完全相同的授权 payload 复放返回同一 receipt，failures 为空；`get_publish_status` 仍只有一条 receipt。即时 feedback 为 0、无分页；`1h` report available，comments/public reactions/positive reactions 均为 0，page views 明确 unavailable。
- 公开 URL 为 `https://dev.to/illegal/see-quick-sort-partitioning-one-step-at-a-time-f9i`，HTTP 200。未调用 reply/delete；DEV 没有真实删除端点，文章按授权长期公开。

## T4 监测、回复与复盘

- [x] T4-A：先以 `TC-AUTO-SCHEDULE-127-*` 红测固定 latest-primary-receipt 锚点、1h/48h/7d UTC 到期时间、稳定 task key、publish/status 同源恢复与提前读取不采集。
- [x] T4-B：先以 `TC-AUTO-REPORT-127-*` 红测固定跨渠道 schema、全 receipt 覆盖、标准 metric、单渠道失败隔离、GitHub 14 天 traffic 不可归因与 artifact 排除。
- [x] T4-C：先以 `TC-AUTO-FAQ-127-*` 红测固定 campaign policy 0600 持久化、FAQ 白名单、敏感/争议/模糊升级、固定模板和未支持渠道失败关闭。
- [x] T4-D：先以 `TC-AUTO-GHREPLY-127-*` 红测增加 GitHub Issue comment 固定 typed CLI、远端 marker 幂等、stdin 正文、结果对拍与日志脱敏。
- [x] T4-E：先以 `TC-AUTO-BUGROUTE-127-*` 红测从真实已知 feedback 分流 GitHub Issue；只保存通用说明/来源，不复制正文，marker + receipt 双重幂等。
- [x] T4-F：publish/status 返回三个 `codex-one-time-task` 计划；实际 campaign 成功后由 Codex 创建一次性 automation，到点调用只读 report 并回写原任务。本轮无新 campaign，不创建空 automation。
- [x] T4-G：生成包含观测限制、不可归因项、失败渠道、投入时间 unavailable 和下一步判断的报告；DEV/V2EX/HN/Product Hunt 与未接线 reply 继续失败关闭。

### T4 完成事实（2026-07-28）

- 审计确认 GitHub、DEV、Mastodon 已有 typed collector；Bluesky 当前无 collector，DEV 与 Mastodon 无 reply transport；既有 GitHub Issue adapter 已具备远端 marker 幂等，但运行时尚未分流，GitHub CLI 尚无 comment create。
- 第一轮红灯由 5 个缺失模块触发；实现 schedule/report/policy/classifier/Issue reply 后 49 文件/239 用例转绿。第二轮运行时红灯固定 publish/status 计划、到期 gate 与 Bug artifact；完成接线后继续补齐 FAQ、CLI、失败分支和安全覆盖。
- `publish_campaign` 与 `get_publish_status` 现在从 project-scoped receipt 计算相同 1h/48h/7d 一次性任务描述；`get_campaign_report` 到期前不调用 collector，到期后按主发布 receipt 返回标准 entry，artifact 不移动锚点。
- campaign reply policy 只保存 `mode/createBugIssues`，采用 0700 目录、0600 文件与原子 hard-link；旧 campaign、策略冲突、损坏或宽权限文件全部失败关闭。
- `reply_feedback` 保持 MCP v3 七工具之一，新增闭合 action。FAQ 只在 GitHub Issue 使用 canonical 固定模板；Bug Issue 只含 project/campaign/channel、feedback ID SHA-256、公开 source URL 和通用待复核说明。
- 插件提交 `1ccfb9e` 已推送；安装版 `0.1.0+codex.20260728143703` enabled，实际安装缓存的自包含 server 已完成 MCP v3 七工具和只读脱敏 status 握手。
- 插件最终 51 个测试文件/252 个用例、verify 与 coverage（97.28/93.43/99.81/97.82）全绿；`campaign-policy-store.ts`、`github-issue-reply.ts` 与 `local-runtime.ts` 均执行 100% line/branch/function/statement 门槛，Gitleaks 无泄漏。
- 本轮只调用了 `channels_status` 和本地 fake/隔离测试；未真实发布、回复、删除或创建 GitHub Issue，也未读取任何 secret。

## T5 RPA 评审、Reddit 后备与人工桥接

- [ ] 只有逐渠道规则评审通过且 Owner 显式启用时才实现 RPA adapter；挑战页、未知 DOM 和重复风险全部失败关闭。
- [ ] Reddit adapter 仅在个人应用审核与目标社区授权完成后启用，不阻塞首期。
- [ ] V2EX、Hacker News、Product Hunt 生成人工发布包，接收真实 URL 后自动采集。
- [ ] 掘金、知乎、小红书保持禁用并输出官方能力缺失原因。
- [ ] 微信公众号、B站因无企业主体禁用；X 因零新增费用禁用。

## T6 交付

- [ ] 每个启用渠道至少一次低风险真实 smoke，记录公开 URL 与可用撤回结果。
- [ ] `pnpm format`、`pnpm verify`、coverage 与需要的 L5 全绿。
- [ ] 四文档、plan/test 三索引、marketing、roadmap 与 agent 记忆转 verified。
- [ ] 精确提交、push；代码变更若影响站点再双轨部署，纯 contract/docs 不盲目部署 SPA。
- [ ] C128 以真实 campaign 开始 48h/7d 发布复盘。

## 当前实际变更

T0 调研和方案设计、T1 公开基础层、T2 MCP 安全运行时骨架、T3-A adapter contract/GitHub mock、T3-B GitHub CLI/显式启用 gate、T3-C GitHub 闭环、T3-D2 Bluesky 闭环与 T3-D3-C DEV 正式文章闭环已完成。`scripts/marketing/` 现包含版本化 schema/严格 validator、规范化与 SHA-256 幂等键、15 渠道能力注册表和 runtime gate、站点事实快照及对拍、渠道 renderer、示例 campaign、`pnpm marketing:dry-run`、MCP v3 contract 与 `buildPublishCampaignPayload()`。v3 的七工具均要求 `projectId`，`publish_campaign.packages` 继续直接承接公开 renderer 结果；Owner 不编辑 JSON，本地插件也不复制平台文案或 UTM 逻辑。

独立 personal plugin 已在本机 `/Users/zhangxu/plugins/marketing-ops` 建立并安装/enabled，远端为公开仓库 `IllegalCreed/marketing-ops`；T2 骨架由本地提交 `a53f411` 固定，T3-A 由本地提交 `ba6d4c3` 固定。它通过 stdio 暴露精确七个高层 MCP 工具，提供一次性 `setup`、只读 `status/doctor`、macOS Keychain helper、每渠道独立 Profile、campaign 锁、0600 原子 receipt 存储与输出脱敏；凭据只经子进程 stdin/隐藏输入进入 Keychain，不进入 argv、env、JSON、日志或 MCP 输出。

C133 新增严格的本地 Project Profile、项目 URL/渠道策略、`campaign-v3/<projectId>/...` 幂等键、receipt v2 与跨项目 operation 拒绝；`algorithm-visualizer` profile 已通过交互 CLI 注册。GitHub repository/tag/activation 改为项目级，DEV origin/tags 改由 profile 注入；当前 GitHub Release、GitHub Issue、DEV adapter 分别为 `1.3.0`、`1.1.0`、`0.2.0`。v1 receipt 只受控映射到 Algorithm Visualizer，旧 GitHub activation 仅仓库完全匹配时迁移。

personal plugin 的 T3-A 新增共享 adapter contract、GitHub Release adapter、PublishService 与 runtime handler。GitHub adapter 只接受 typed client 的 `findReleaseByTag/createRelease/deleteRelease`，以稳定 tag、公开 hash marker、本地 receipt 和同键异内容冲突检测形成幂等闭环；平台确认值与持久化返回值都会对拍 campaign/channel/key/hash，竞争写入不能混入异内容 receipt。媒体只有类型而没有受验证资产引用时失败关闭。`all-or-none` 要求显式渠道与完整 package，仅承诺写入前预检零副作用，不伪造跨平台事务回滚。

personal plugin 的 T3-B 新增固定 `gh` 进程 runner、typed `gh auth status` / `gh api` client、只读授权/仓库健康、0600 非秘密 activation、GitHub channel controller 与默认本地 runtime。命令面不接受任意 endpoint/args/shell/token，正文只走 stdin；提交后超时、超限、畸形或无状态失败统一要求按稳定 tag 查询后再试。GitHub health 与 adapter activation 分离，每次发布注册前重新检查两者。

personal plugin 的 T3-C 新增 Release detail/reactions、14 天仓库 traffic、Issue create/comments、opaque feedback cursor、collector、receipt campaign/postRef 索引与 MCP status/feedback/report/delete。仓库 traffic 报告显式不可归因；反馈始终 untrusted；receipt 文件增加私有普通文件、大小、重复引用与原子竞争保护。审计发现 GitHub 删除 Release 不会替代 Git ref 清理，因此 adapter 升至 `github-release@1.2.0`：发布前拒绝已有不明 tag，撤回前对拍 receipt/marker，随后删除 Release 与本工具拥有的 tag。

本机现有 GitHub CLI 账号 `IllegalCreed` 与目标仓库权限为 ready；Owner 已明确授权固定 campaign 并完成 `setup github`，非秘密 activation 保持 enabled。唯一真实 smoke 创建 Release `352517542`，读取 status、零条反馈与明确不可归因的仓库级报告后，经 MCP 删除 Release 和 owned tag；receipt 为 deleted，Release/tag 独立复查均不存在。全过程未读取聊天凭据，未创建评论、回复或 Issue。

Bluesky 已完成隐藏 setup、身份对拍、安全删除和固定真实 smoke，临时记录已清理。DEV 已完成工程 adapter、collector、公开 durable campaign preflight/setup 与固定正式文章 smoke；receipt `4146005` published，文章长期公开，但当前 key 为 reauth-required。Mastodon 真实闭环已完成并清理。T4 已补齐 1h/48h/7d 确定性计划、标准报告和反馈安全分流；计划输出不代表已经创建 Codex 自动任务，T5/T6 未完成前仍不能表述为“全自动系统已经可用”。

## 验证记录

- 官方资料核验日期：2026-07-11。
- 当前仓库：`main` 与 `origin/main` 同步，调研开始时工作区 clean。
- 十个正式渠道与五个补充/替代渠道集合检查通过；C123 的逐帖审批 Case 已标记 superseded。
- 本地 Markdown 相对链接检查通过；账号与密码原文扫描无结果。
- `pnpm format:check` 与 `git diff --check` 通过。
- TDD red：5 个新测试文件均因目标模块不存在而失败；green：5 文件 / 19 个 T1 Case 通过。
- `pnpm marketing:dry-run -- --help` 与示例 campaign 运行通过；输出五渠道候选、唯一 UTM、完整 gate 原因和空副作用列表。
- T1 功能提交：`41324d9`（`feat: 建立 C127 宣传 dry-run 基础层`）。
- `pnpm verify` 通过；production base 预渲染并验证 125 页。
- 全量 Vitest 291 文件 / 2092 用例通过；coverage statements 95.24%、branches 87.02%、functions 91.46%、lines 95.54%。
- Playwright 104 文件 / 115 用例通过；T1 不修改 SPA 页面或线上产物，因此不需要手动 selfhost 部署。
- T2 公开 contract TDD red：测试因 `mcp-contract.ts` 不存在失败；green：1 文件 / 6 个 MCP contract Case 通过，`scripts/marketing/*.spec.ts` 合计 6 文件 / 25 用例通过。
- T2 公开 contract 功能提交：`5ab4e5e`（`feat: 固定 C127 宣发 MCP 公开契约`）。
- personal plugin TDD red：8 个测试套件因运行时模块不存在失败；green：8 文件 / 20 用例通过，coverage statements 92.4%、branches 82.14%、functions 98.27%、lines 95.85%，`src/security/**/*.ts` 为 100%。
- personal plugin `pnpm verify`、实际 stdio client smoke 与 plugin validator 通过；`setup/status/doctor` 实际 CLI 检查通过。全局 `codex plugin marketplace list` 因用户全局 Codex npm 包缺少 vendor binary 无法执行，不影响本地插件代码、stdio server 或 desktop personal marketplace，且未擅自修复用户全局安装。
- T2 未录入真实凭据、未连接账号、未调用平台网络写接口，也未产生站外副作用。
- 主仓库 `pnpm verify` 通过：299 个 Vitest 文件 / 2129 个用例全绿，production base 预渲染并验证 190 页。
- 主仓库 `pnpm coverage` 通过：statements 95.48%、branches 86.31%、functions 92.03%、lines 95.82%。T2 不修改 SPA 行为，沿用同日 104 文件 / 117 条 L5 基线，不重复执行浏览器回归。
- T3-A 公开 contract red：1 文件 / 8 Case 中 version、packages 与 package schema 共 3 项失败；green：MCP v2 与 payload bridge 定向 2 文件 / 11 用例通过，营销定向 7 文件 / 30 用例、主仓库全量 299 文件 / 2129 用例与 type-check/build/190 页 SEO 门禁通过。
- T3-A 公开仓库功能提交：`98f8deb`（`feat: 桥接 C127 MCP v2 发布载荷`）。
- T3-A plugin red：3 个目标模块缺失套件，MCP v2/transport 共 4 项失败；green：12 文件 / 43 用例通过，type-check、build、Swift helper 与实际 STDIO v2 smoke 通过。
- T3-A 最终审计 red：receipt 竞争返回值未复核、`UNKNOWN_RESULT` 查询标记丢失共 2 项失败；green：落盘结果二次对拍并保留 stage/retry-after/lookupRequired 后定向 1 文件 / 3 用例通过。
- T3-A plugin coverage：statements 95.02%、branches 87.91%、functions 98.92%、lines 96.78%；`src/adapters/**` 为 98.98/92.95/100/98.96，`publish-service.ts` 为 100/96.77/100/100；新增 adapter 90/85/100/90 与 publish service 95/90/100/95 独立门槛，security 继续 100%。
- T3-A personal plugin 本地提交：`ba6d4c3`（`feat: 建立 T3-A GitHub adapter 合同`）；cachebuster 为 `0.1.0+codex.20260711101852`，plugin validator 通过。`codex plugin add marketing-ops@personal` 仍因用户全局 Codex npm 包缺少 vendor binary 报 `ENOENT`，未修改全局安装。
- T3-A 全部使用 typed fake client 与内存 receipt；未调用 `gh`、GitHub API 或其他平台网络接口，未读取 Keychain，未产生站外副作用。
- T3-B 初始 red：`gh-process`、`github-cli`、`github-channel`、`local-runtime` 四套件因目标模块不存在失败；实现后四文件 / 18 个精确断言通过。隔离空配置又复现未登录 `gh api` 退出码 4 且无 HTTP 401，新增固定 `gh auth status --active` 前置红测先失败 2 项，修复后通过。
- T3-B plugin `pnpm verify` 通过：format、type-check、16 文件 / 61 用例、build、Swift helper 与实际 STDIO smoke 全绿；STDIO 额外验证动态 GitHub 状态已脱敏。
- T3-B plugin coverage 通过：statements 96.35%、branches 90.88%、functions 98.63%、lines 97.77%；`src/adapters/**` 为 99.52/96.29/100/99.51，`github-cli.ts` 为 100/98.9/100/100，activation/local runtime 继续满足独立 100% 门槛。
- T3-B 真实只读 smoke 通过：固定 auth status、viewer、`IllegalCreed/algorithms-visualization` 权限与不存在 tag GET；输出 `tagFound=false`。`status` 为 `ready / setup-required`，`doctor` 为 adapter disabled，activation 文件不存在；未调用 POST/PATCH/PUT/DELETE。
- T3-B personal plugin 本地提交：`98a9dfc`（`feat: 接入 T3-B GitHub CLI 运行时`）；cachebuster 为 `0.1.0+codex.20260711110938`，plugin validator 通过。`codex plugin add marketing-ops@personal` 仍因用户全局 Codex npm 包缺少 vendor binary 报 `ENOENT`，未修改全局安装。
- T3-C 初始 red：5 个目标测试文件中 2 个模块缺失、7 项行为失败；实现第一轮后定向 8 文件 / 33 用例转绿。覆盖率审计继续发现 receipt 并发硬链接窗口，新增回归先失败、修复后同键并发稳定且持久硬链接继续拒绝。
- T3-C tag-cleanup 审计 red：官方文档确认新 Release 可创建 Git tag，而删除 Release 是独立端点；新增固定 tag ref get/delete 与所有权 Case 后 2 文件 5 项失败，完成 adapter 防护后 4 文件 / 28 用例转绿。
- T3-C plugin coverage 通过：21 文件 / 93 用例；statements 98.27%、branches 95.23%、functions 99.54%、lines 98.85%。`src/adapters/**` 为 99.14/97.27/100/99.1；observability、receipt-store 与 local-runtime 均满足独立高门槛。
- T3-C 扩展只读 smoke 通过：账号/仓库 health ready，traffic 与 Issue list 可读；当前无 Issue 因而未读取评论正文。固定 smoke Release 与 `refs/tags/marketing/marketing-ops-t3c-smoke-127` 均不存在；activation 仍缺失，未调用任何外部写接口。
- T3-C Owner 授权真实 smoke 通过：`channels_status` 为 GitHub ready/enabled，公开 renderer 生成唯一 GitHub 双语 package 与 `c127-t3c-smoke` UTM；`publish_campaign` 创建 Release `352517542`，receipt 为 published、adapter 为 `github-release@1.2.0`。
- T3-C 读取与清理通过：status complete，反馈 0 条且无分页，1h report available 并标记 `repository-14d` / `not-attributable-to-campaign`；`delete_post` 返回 deleted，receipt 转 deleted。`gh release view` 为 not found，Git ref API 为 404，复跑只读 smoke 得到 `releaseFound=false`、`tagRefFound=false`。
- T3-C smoke 收尾门禁通过：personal plugin 修正 `.codex-plugin/plugin.json` 的 Prettier 格式后，`pnpm verify` 完成 format、type-check、21 文件 / 93 用例、build 与 STDIO smoke；主仓库 `pnpm verify` 完成 format、lint、type-check、299 文件 / 2131 用例及 190 页 production 预渲染/SEO 验证。
- T3-C personal plugin 本地提交：`60feaff`（`feat: 完成 T3-C GitHub 观测与安全撤回`）；cachebuster 为 `0.1.0+codex.20260711122325`，plugin/skill validator 通过。`codex plugin add marketing-ops@personal` 仍因用户全局 Codex npm 包缺少 vendor binary 报 `ENOENT`，未修改全局安装；该私有插件仓库没有 remote，故无 push 目标。
- T3-C 公开仓库 `pnpm verify` 通过：format、lint、type-check、299 文件 / 2129 个 Vitest 用例与 production 190 页预渲染/SEO 门禁全绿；本轮只改维护文档，不重复 coverage/L5/selfhost，也不手动部署未变化的 SPA 产物。
- T3-D3-A 本地插件 red/green 与全门禁通过：35 个测试文件 / 178 个用例；coverage 97.88/94.35/99.46/98.58；build、Swift Keychain helper 与 STDIO smoke 全绿。只读 status/doctor 明确 DEV not-configured/disabled。
- T3-D3-A 公开定向测试与全门禁通过；固定 campaign dry-run 输出三项预期 blocker、零 render issue 与 `sideEffects=[]`，主仓库 verify 为 299/2132、coverage 为 95.48/86.31/92.03/95.82、Playwright 为 104/118。尚未执行 setup、账号读取或任何 DEV 写操作。
- T3-D3-B 只读 setup 验收通过：status/doctor 为 DEV ready/enabled；公开 preflight 更新后 dry-run 唯一 blocker 为 `EXECUTION_NOT_APPROVED`，无 render issue、`sideEffects=[]`。当前无 receipt/文章，零 DEV 写入。
- T3-D3-C Owner 授权 smoke 通过：publish receipt `4146005`，公开 API 完整正文/API 元数据对拍一致，相同 payload 复放复用同一 receipt；feedback 0，`1h` report available 且 reactions/comments 均为 0。公开 URL 200，未 reply/delete。
- T3-D4-B 真实 setup 首次返回 `INVALID_INPUT: Mastodon activation identity is invalid`；公开身份接口实际返回本地 `acct=illegals0001`。`TC-AUTO-MASTOAPI-127-02A` 先红，修复后健康输出补全为 `illegals0001@mastodon.social`。
- 同次失败发现 controller 先写 Keychain、后验证 activation，`TC-AUTO-MASTODONCHANNEL-127-03A` 先红；修复后先落非秘密 activation，再写 secret。隐藏 prompt 还会在完成后保持 stdin 活跃，真实假 token PTY 复现后增加输入流恢复，失败与成功路径均可立即退出。
- 旧 token 经官方 regenerate 失效，替代 token 未进入聊天、argv、env、JSON、日志或 Git，只经本机 PTY 进入 Keychain。activation 文件为 `0600`、目录为 `0700`；status/doctor 均显示 Mastodon ready/enabled，未执行平台写入、未创建 receipt。
- plugin `bb62731` 已推送公开 `main`；44 个测试文件 / 225 个用例、coverage 97.23/93.91/99.78/97.82、verify、MCP stdio v3、plugin/skill validator、安装态 `0.1.0+codex.20260727045503` 与 Gitleaks 全绿。
- T3-D4-C1 公开 red/green：`publish-payload.spec.ts` 先因固定 Mastodon campaign 文件缺失失败，补入 spec/preflight 后 1 文件 / 5 用例转绿；幂等键固定为 `campaign-v1/marketing-ops-t3d4-smoke-127/d31992711a03d2ae0b0fd77dd08d88f8fc5d8a1a0f0cad1914860fb286eb510a`。
- 固定 dry-run 仅返回 `EXECUTION_NOT_APPROVED`，`renderIssues=[]`、`selectedChannels=[]`、`sideEffects=[]`；单通道只读身份复查为 Mastodon `ready/enabled`，未调用平台写接口、未创建 receipt。
- 主仓库 `pnpm verify` 通过 format、lint、type-check、300 个测试文件 / 2137 个用例与 190 页 production 预渲染/SEO 门禁；独立工具仓库 `pnpm format:check` 通过。
- 同轮事实复查发现 DEV 现有 API key 返回 `reauth-required`；2026-07-15 的正式文章与历史 smoke 证据不受影响，但后续 DEV campaign 前需重新执行隐藏 setup。
- T3-D4-C2 首次真实提交创建了唯一远端状态，但 Mastodon 把空行渲染为相邻 `<p>`，客户端还原为单换行后触发 after-submit `UNKNOWN_RESULT / lookupRequired`，因此未错误落 receipt，也未盲重试。
- `TC-AUTO-MASTOAPI-127-04` 扩展段落回归先红后绿；`htmlToText()` 保留相邻段落的双换行。修复后同一 renderer package 与 caller idempotency key 先查询并认领既有状态，公开账号状态数在认领和同 payload 复放后始终为 1。
- 持久 receipt、公开正文精确对拍、feedback 与 `1h` report 均成功；公开 post-lifetime favourites/reblogs/replies 均为 0。`delete_post` 返回 deleted，receipt 为 deleted。普通 GET 曾命中旧 CDN cache；加入唯一查询参数后的官方 status API 为 404，账号状态列表为空。
- plugin `pnpm verify` 与 `pnpm coverage` 全绿：44 个测试文件 / 225 个用例，coverage 97.23/93.91/99.78/97.82。凭据未进入聊天、命令参数、输出或仓库。
- T4 plugin `pnpm verify`、`pnpm coverage`、安装缓存 STDIO 和 Gitleaks 全绿：51 个测试文件 / 252 个用例，coverage 97.28/93.43/99.81/97.82；安装版 `0.1.0+codex.20260728143703` enabled。
- T4 主仓库 `pnpm verify`、`pnpm coverage` 与 `pnpm exec playwright test` 全绿：300 个 Vitest 文件 / 2138 个用例、coverage 95.49/86.32/92.03/95.82、104 个 Playwright 文件 / 118 个用例，以及 190 页 production 预渲染/SEO 门禁通过。

## 变更历史

- 2026-07-11：完成 T0；确认五个免费个人首批、Reddit 后备、三个人工监测、三个 D 级禁用、微信/B站主体禁用和 X 费用禁用。
- 2026-07-11：独立 `marketing-ops` MCP/RPA 边界设计批准；停止 T1 开工，宣传自动化后置到多语言与内容主线之后。
- 2026-07-11：C130 双轨发布完成；C127 恢复为当前工程主线，下一步执行 T1 的 schema、能力 gate、幂等与 dry-run 红测。
- 2026-07-11：T1 完成并通过全门禁；C127 为 in-progress/40%，下一步 T2 MCP contract 与凭据边界，真实发布仍未开始。
- 2026-07-11：Owner 将全量英文翻译置于 C127 T2 前；保留 40% 进度与 T1 代码，等待 C131 verified 后继续。
- 2026-07-11：C131 全量英文对齐和双轨发布完成；C127 恢复为当前主线，下一步 T2 MCP contract。
- 2026-07-11：T2 完成公开七工具 contract 与独立 `marketing-ops` personal plugin 安全骨架；20 个精确 Case、coverage、stdio smoke 和 plugin validator 通过，C127 转 in-progress/55%，下一步 T3 adapter contract 与 GitHub mock。
- 2026-07-11：T3-A 完成 MCP v2 renderer package 桥接、共享 adapter contract、GitHub Release typed fake client 与失败关闭 dispatch；20 个 Case 通过，C127 转 in-progress/62%，下一步 T3-B live GitHub CLI 边界。
- 2026-07-11：T3-B 完成固定 GitHub CLI、只读健康、0600 activation 与惰性 runtime；16 个 Case、plugin 16/61、coverage、STDIO 与只读 smoke 通过，C127 转 in-progress/68%。本机 health ready 但 adapter disabled、零真实写入，下一步 T3-C。
- 2026-07-11：T3-C 无写 contract 完成 Release/Issue/traffic collector、receipt 查询与 MCP status/feedback/report/delete，并补齐 Release/tag 所有权安全清理；plugin 21/93、coverage、verify 与扩展只读 smoke 通过。C127 转 in-progress/74%，等待固定 smoke campaign 明确授权。
- 2026-07-11：Owner 明确授权 `marketing-ops-t3c-smoke-127` 后完成唯一 GitHub create/read/delete/tag-cleanup 真实 smoke；Release `352517542`、receipt 与 owned tag 清理一致，T3-C 完成。C127 转 in-progress/76%，下一步 T3-D。
- 2026-07-12：微博官方 CLI 固定版本安装与 device OAuth 完成；真实 `subscription: null` 红绿修复提交 `088229d`。Owner 个人开发者认证进入官方审核，C127 保持 79%，production adapter disabled、零微博写入。
- 2026-07-14：微博个人认证已通过；官方 Free 复核为 0 元/7 天、5 读/小时、0 写/小时，未领取试用、未读 catalog、零写入。plugin `263fd3f` 禁止将 Free 误报为可发布；C127 保持 79%，下一步 T3-D2 Bluesky。
- 2026-07-14：Bluesky T3-D2-A 以 plugin `2107843` 完成固定官方 SDK、英文文本 adapter、Keychain/activation、隐藏 setup 与惰性 runtime；29/140、coverage、verify 全绿。账号未接入、零写入，C127 转 85%。
- 2026-07-14：Bluesky setup 与安全删除完成：status/doctor ready/enabled，plugin `5d9aef1` 为 29/144 全绿；Owner 授权的固定 smoke 完成 publish/read/同回执复放/delete/重复 delete，receipt deleted、远端 record 不存在。C127 转 87%，下一步 T3-D3 DEV。
- 2026-07-15：DEV T3-D3-A 完成固定 Forem v1 API、英文 article adapter、Keychain/0600 activation、惰性 runtime、metrics/comments collector 与 durable campaign dry-run；plugin 35/178、coverage、verify、STDIO 全绿。DEV 仍未配置且零写入，C127 转 90%，下一步为 Owner 一次性 setup。
- 2026-07-15：DEV T3-D3-B 隐藏 setup 与只读 status/doctor 验收完成，DEV ready/enabled；公开 preflight 仅余 `EXECUTION_NOT_APPROVED`。API key 不进入证据，尚无 receipt/文章，下一步 T3-D3-C matching 授权。
- 2026-07-15：Owner 精确授权后完成 DEV T3-D3-C；文章 `4146005` publish、完整正文/API 元数据对拍、同 receipt 幂等复放、feedback 与 `1h` report 全部通过。receipt published，文章长期公开，下一步 T3-D4-A Mastodon。
- 2026-07-16：T3-D4-A Mastodon statuses/notifications adapter 工程完成并通过本地 verify；下一步 setup/identity smoke。
- 2026-07-27：C133 完成 MCP v3 多项目通用化与独立远端；Owner 后续将 `marketing-ops` 源码仓库改为 public，secret/runtime state 仍仅留本机。plugin 44/223、coverage、stdio、validator、Gitleaks 及主项目仓库 299/2132、190 页门禁全绿。
- 2026-07-27：T3-D4-B 完成官方 token regenerate、隐藏 setup 与只读身份对拍；plugin `bb62731` 修复本地 acct 补全、Keychain 顺序和隐藏 CLI 退出，44/225、coverage、verify、validator、安装态及 Gitleaks 全绿。Mastodon ready/enabled，C127 保持 92%，下一步 T3-D4-C 固定预案。
- 2026-07-27：T3-D4-C1 零副作用预案已冻结；固定 campaign、renderer 正文、UTM、幂等键、授权 blocker 与 publish/read/幂等/反馈/报告/delete/远端复查顺序，C127 保持 92%，等待 matching 授权。
- 2026-07-27：T3-D4-C2 matching 授权闭环完成；plugin `44a7e9a` 修复段落还原后同 payload 安全认领唯一状态并完成读取、幂等、反馈、`1h` 报告、删除与远端不存在复查。安装审计随后发现 Codex 缓存不保留 pnpm 依赖符号链接，plugin `7cc60a5` 将 MCP server 打包为自包含 bundle；无 `node_modules` 隔离 STDIO 与最终安装缓存七工具握手均通过。C127 转 94%，下一步 T4。
- 2026-07-28：T4 先红后绿完成三窗口计划、跨渠道标准报告、FAQ-only GitHub Issue 回复边界与 Bug Issue 安全分流；plugin 51 文件 / 252 用例与 coverage 全绿，三个高风险模块执行 100% 门槛。全部写路径使用 fake client 验证，未执行真实回复或建 Issue。C127 转 97%，下一步 T5。
