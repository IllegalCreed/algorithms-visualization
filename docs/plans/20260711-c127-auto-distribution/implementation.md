# 实现记录：提示词驱动的全自动内容分发

> Status: in-progress
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-12
> Progress: 79%
> Blocked by: 微博官方个人开发者认证审核（T3-D1-B）
> Next action: 审核通过后复查脱敏 doctor，领取零费用 Free/试用并只读冻结实际 statuses action；未经 matching campaign 授权不发帖
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_、TC-AUTO-GHCLI-127-\_、TC-AUTO-GHAUTH-127-\_、TC-AUTO-ACTIVATION-127-\_、TC-AUTO-RUNTIME-127-\_、TC-AUTO-GHOBS-127-\_、TC-AUTO-GHISSUE-127-\_、TC-AUTO-GHSTORE-127-\_、TC-AUTO-GHOPS-127-\_、TC-AUTO-GHSMOKE-127-\_、TC-AUTO-WBPROC-127-\_、TC-AUTO-WBCLI-127-\_、TC-AUTO-WBADAPTER-127-\_、TC-AUTO-WBRUNTIME-127-\_、TC-AUTO-WBSMOKE-127-\_
> Related design: design.md

## 执行顺序

`T0 渠道能力与 MCP 方案审计` -> `T1 CampaignSpec/能力注册表/dry-run` -> `T2 MCP contract/凭据边界` -> `T3 首批 API adapters/receipt` -> `T4 collectors/回复/报告` -> `T5 RPA 评审/Reddit 后备/人工桥接` -> `T6 全门禁/真实 smoke/C128 移交`。

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
- [ ] T3-D1-B：Owner 完成官方 OAuth、个人开发者认证与 Free/试用 gate 后，只读冻结实际可用 publish/read action，接入 production adapter 与显式 activation。
- [ ] T3-D1-C：经 matching campaign 授权完成微博低风险 publish/read/feedback/可用时 delete smoke；不具备的能力保持 false。
- [ ] Bluesky AT Protocol adapter。
- [ ] DEV/Forem article 与 metrics/comments adapter，保持 `reply=false`。
- [ ] Mastodon statuses/notifications adapter。
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
- Owner 已提交个人开发者认证，官方页面显示“认证中”；CLI 当前只返回 `developerVerification=false` / identity `unverified`。等待官方审核，不轮询敏感资料、不绕过 gate、不购买套餐。
- 尚未读取登录账号的 commands catalog，未冻结 publish/read action，未创建微博 activation，production adapter 仍 disabled，零微博写入。

## T4 监测、回复与复盘

- [ ] 实现 1h/48h/7d collector 和跨渠道指标 schema。
- [ ] 发布成功后创建三个一次性 Codex 跟进任务，到点采集并回写原任务；验证中断恢复路径。
- [ ] 实现 FAQ-only 回复白名单和人工升级分类；硬禁用 V2EX/HN/Product Hunt/DEV 自动回复。
- [ ] 缺陷反馈去重后创建 GitHub Issue。
- [ ] 生成包含观测限制、投入时间和下一步判断的报告。

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

T0 调研和方案设计、T1 公开基础层、T2 MCP 安全运行时骨架、T3-A adapter contract/GitHub mock、T3-B GitHub CLI/显式启用 gate 与 T3-C 无写 contract 已完成。`scripts/marketing/` 现包含版本化 schema/严格 validator、规范化与 SHA-256 幂等键、15 渠道能力注册表和 runtime gate、站点事实快照及对拍、渠道 renderer、示例 campaign、`pnpm marketing:dry-run`、MCP v2 contract 与 `buildPublishCampaignPayload()`。v2 的 `publish_campaign.packages` 直接承接公开 renderer 结果，Owner 不编辑 JSON，私有插件也不复制平台文案或 UTM 逻辑。

独立 personal plugin 已在本机 `/Users/zhangxu/plugins/marketing-ops` 建立；T2 骨架由本地提交 `a53f411` 固定，T3-A 由本地提交 `ba6d4c3` 固定。它通过 stdio 暴露精确七个高层 MCP 工具，提供一次性 `setup`、只读 `status/doctor`、macOS Keychain helper、每渠道独立 Profile、campaign 锁、0600 原子 receipt 存储与输出脱敏；凭据只经子进程 stdin/隐藏输入进入 Keychain，不进入 argv、env、JSON、日志或 MCP 输出。

personal plugin 的 T3-A 新增共享 adapter contract、GitHub Release adapter、PublishService 与 runtime handler。GitHub adapter 只接受 typed client 的 `findReleaseByTag/createRelease/deleteRelease`，以稳定 tag、公开 hash marker、本地 receipt 和同键异内容冲突检测形成幂等闭环；平台确认值与持久化返回值都会对拍 campaign/channel/key/hash，竞争写入不能混入异内容 receipt。媒体只有类型而没有受验证资产引用时失败关闭。`all-or-none` 要求显式渠道与完整 package，仅承诺写入前预检零副作用，不伪造跨平台事务回滚。

personal plugin 的 T3-B 新增固定 `gh` 进程 runner、typed `gh auth status` / `gh api` client、只读授权/仓库健康、0600 非秘密 activation、GitHub channel controller 与默认本地 runtime。命令面不接受任意 endpoint/args/shell/token，正文只走 stdin；提交后超时、超限、畸形或无状态失败统一要求按稳定 tag 查询后再试。GitHub health 与 adapter activation 分离，每次发布注册前重新检查两者。

personal plugin 的 T3-C 新增 Release detail/reactions、14 天仓库 traffic、Issue create/comments、opaque feedback cursor、collector、receipt campaign/postRef 索引与 MCP status/feedback/report/delete。仓库 traffic 报告显式不可归因；反馈始终 untrusted；receipt 文件增加私有普通文件、大小、重复引用与原子竞争保护。审计发现 GitHub 删除 Release 不会替代 Git ref 清理，因此 adapter 升至 `github-release@1.2.0`：发布前拒绝已有不明 tag，撤回前对拍 receipt/marker，随后删除 Release 与本工具拥有的 tag。

本机现有 GitHub CLI 账号 `IllegalCreed` 与目标仓库权限为 ready；Owner 已明确授权固定 campaign 并完成 `setup github`，非秘密 activation 保持 enabled。唯一真实 smoke 创建 Release `352517542`，读取 status、零条反馈与明确不可归因的仓库级报告后，经 MCP 删除 Release 和 owned tag；receipt 为 deleted，Release/tag 独立复查均不存在。全过程未读取聊天凭据，未创建评论、回复或 Issue。其他渠道和完整 1h/48h/7d 调度仍未完成，不能表述为“全自动系统已经可用”。

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
