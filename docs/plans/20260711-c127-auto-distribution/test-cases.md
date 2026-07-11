# 测试用例：提示词驱动的全自动内容分发

> Status: in-progress
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 76%
> Blocked by: none
> Next action: 开始 T3-D，先实现微博 Free adapter 的 typed contract、健康 gate 与无写测试，再依次推进 Bluesky、DEV、Mastodon
> Replaces: C-20260710-123 中 TC-DOC-GROWTH-123-03 的“每帖人工审批”历史断言
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_、TC-AUTO-GHCLI-127-\_、TC-AUTO-GHAUTH-127-\_、TC-AUTO-ACTIVATION-127-\_、TC-AUTO-RUNTIME-127-\_、TC-AUTO-GHOBS-127-\_、TC-AUTO-GHISSUE-127-\_、TC-AUTO-GHSTORE-127-\_、TC-AUTO-GHOPS-127-\_、TC-AUTO-GHSMOKE-127-\_
> Related requirement: requirements.md

## T0 文档用例

| Case ID            | 层级 | 检查对象                     | 预期                                                                                                                |
| ------------------ | ---- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| TC-DOC-AUTO-127-01 | docs | 渠道审计                     | 十个正式渠道与微博、X、DEV、Bluesky、Mastodon 五个补充渠道各出现一次，集合无遗漏                                    |
| TC-DOC-AUTO-127-02 | docs | 官方依据                     | 每个渠道都有发布、监测、回复、授权/准入、成本或限制结论，并链接官方资料                                             |
| TC-DOC-AUTO-127-03 | docs | 能力等级与 Owner 约束        | 免费个人首批、Reddit 后备、人工监测、主体禁用和费用禁用集合明确；不把聚合评论数误写成评论正文能力                   |
| TC-DOC-AUTO-127-04 | docs | marketing/roadmap/agent 记忆 | C127 一致为 in-progress/76%、T3-C 真实 smoke 已清理完成且 GitHub ready/enabled；不把仓库 traffic 写成 campaign 归因 |
| TC-DOC-AUTO-127-05 | docs | 凭据与失败策略               | API/RPA 凭据隔离、幂等与失败关闭完整；禁止主密码回传、内部 API、stealth 和验证码绕过                                |
| TC-DOC-AUTO-127-06 | docs | `pnpm format:check`          | 本轮文档符合 Prettier                                                                                               |
| TC-DOC-AUTO-127-07 | docs | `git diff --check`           | diff 无尾随空白或空白错误                                                                                           |
| TC-DOC-AUTO-127-08 | docs | plan 状态                    | T0-T3-C 无写部分已完成，但 activation、真实 smoke、其他 adapter 与完整调度未完成；四文档不得误标 verified           |
| TC-DOC-AUTO-127-09 | docs | MCP 凭据边界                 | Codex 只见高层工具与脱敏结果；凭据/Profile 位于独立本地服务且不存在任意浏览器执行工具                               |

前六个事实 Case（01..05、09）登记到三份全局测试索引；格式、diff 和当前实施状态只保留在本 plan。

## T1 运行时用例

以下 Case 在实现前固定；全部属于无网络、无凭据、无站外副作用的 L3 纯函数/CLI contract 测试：

| Case ID                | 层级 | 检查对象           | 预期                                                                                  |
| ---------------------- | ---- | ------------------ | ------------------------------------------------------------------------------------- |
| TC-AUTO-SPEC-127-01    | L3   | 合法 spec 规范化   | token、渠道、locale、media 和 URL 规范化；排期同时保留原值、UTC 与 offset             |
| TC-AUTO-SPEC-127-02    | L3   | 严格 schema        | 额外字段、password/token/Cookie/script/selector 等危险字段失败关闭                    |
| TC-AUTO-SPEC-127-03    | L3   | 非法基础字段       | 非 HTTPS/站外 URL、未知渠道/locale、无时区排期、非法 token 均拒绝                     |
| TC-AUTO-SPEC-127-04    | L3   | 双语内容合同       | `content.variants` 与 locales 一一对应；规范化不修改输入                              |
| TC-AUTO-IDEMP-127-01   | L3   | 语义等价 spec      | 非语义数组顺序、大小写和空白差异生成同一 SHA-256 幂等键                               |
| TC-AUTO-IDEMP-127-02   | L3   | 真实内容变化       | 文案、目标 URL 或排期变化生成不同幂等键                                               |
| TC-AUTO-CHANNEL-127-01 | L3   | 渠道总表           | 十个正式渠道与五个补充渠道共 15 个，ID 唯一且均有依据                                 |
| TC-AUTO-CHANNEL-127-02 | L3   | 首批自动集合       | GitHub、微博、Bluesky、DEV、Mastodon 均为免费、个人可用、API 路径且 policy enabled    |
| TC-AUTO-CHANNEL-127-03 | L3   | 条件/人工/禁用集合 | Reddit 条件后备；V2EX/HN/Product Hunt 为 manual；主体、付费与 D 级渠道按审计禁用      |
| TC-AUTO-CHANNEL-127-04 | L3   | capability gate    | capability、执行审批、adapter、授权、配额、成本、个人主体任一不满足均失败关闭         |
| TC-AUTO-CHANNEL-127-05 | L3   | `all-authorized`   | 只展开当前请求动作通过全部 runtime gate 的渠道                                        |
| TC-AUTO-FACTS-127-01   | L3   | 站点事实快照       | 与 SEO registry、locale catalog、Home catalog 对拍 95/95/190、95 对、77 算法、92 条目 |
| TC-AUTO-FACTS-127-02   | L3   | 事实声明边界       | 拒绝旧 10/105 页声明和易漂移测试数量；允许当前受支持的页面/条目声明                   |
| TC-AUTO-RENDER-127-01  | L3   | 渠道原生候选       | 按渠道和 locale 生成独立标题/正文、媒体计划及复用现有 UTM 纯函数的唯一链接            |
| TC-AUTO-RENDER-127-02  | L3   | 渲染约束           | 不支持的 locale/media、超长文案和不安全事实声明返回结构化校验错误                     |
| TC-AUTO-RENDER-127-03  | L3   | 人工与禁用渠道     | V2EX/HN/Product Hunt 生成 manual package；disabled 渠道不生成可执行内容               |
| TC-AUTO-DRYRUN-127-01  | L3   | 确定性 manifest    | 同一 spec/runtime 重复运行字节语义一致，`sideEffects=[]`                              |
| TC-AUTO-DRYRUN-127-02  | L3   | 混合渠道决策       | manifest 分离 selected、blocked、manual，并保留每个失败原因                           |
| TC-AUTO-DRYRUN-127-03  | L3   | 脱敏与边界         | manifest/schema/CLI 参数不接收或输出 secret、Cookie、Profile、selector 或任意脚本     |

## T2 MCP、凭据与本地运行时用例

T2 先固定以下 20 个 Case；公开仓库锁定 contract，独立 personal plugin 负责运行时实现。全部使用 fake Keychain/Profile/adapter，不录入真实凭据、不访问平台、不产生站外副作用。

| Case ID                  | 层级        | 检查对象            | 预期                                                                                         |
| ------------------------ | ----------- | ------------------- | -------------------------------------------------------------------------------------------- |
| TC-AUTO-MCP-127-01       | L3/contract | 工具集合            | 只暴露七个批准的高层工具，名称、版本和 server instructions 稳定                              |
| TC-AUTO-MCP-127-02       | L3/contract | 工具输入 schema     | 全部 `additionalProperties=false`，不含 selector/script/command/path/secret 等任意执行面     |
| TC-AUTO-MCP-127-03       | L3/contract | 写工具授权          | publish/reply/delete 明确标记写入/破坏性，并要求 campaign 授权与幂等键                       |
| TC-AUTO-MCP-127-04       | L3/contract | 敌意嵌套输入        | 任意层级的 password/token/Cookie/Profile/selector/script/command/path 字段在 dispatch 前拒绝 |
| TC-AUTO-MCP-127-05       | L3/contract | 输出脱敏            | 任意层级 secret-like key、Bearer/Cookie 值被移除或遮罩，公开 ID/URL/聚合值保留               |
| TC-AUTO-MCP-127-06       | L3/contract | 不可信反馈          | 评论/网页文本只作为数据返回，不能自行触发 publish/reply/delete 或改变授权                    |
| TC-AUTO-SETUP-127-01     | L3          | 渠道接入目录        | 五个首批渠道只使用 gh/OAuth/设备授权/App Password/API key；不接受主密码                      |
| TC-AUTO-SETUP-127-02     | L3/CLI      | secret 录入         | secret 只经隐藏 TTY 或官方授权流程进入 Keychain，不接受 argv/env/JSON/chat                   |
| TC-AUTO-SETUP-127-03     | L3/CLI      | status/doctor       | 只返回脱敏账号别名、健康状态和下一步，不返回 secret、Keychain key 或 Profile 路径            |
| TC-AUTO-SECRET-127-01    | L3          | Keychain adapter    | 只提供按 opaque ref 的 put/get/delete；写入值走 stdin，不出现在 argv/env/stdout/stderr       |
| TC-AUTO-SECRET-127-02    | L3          | secret 异常         | 缺失、拒绝或失效统一转为 `REAUTH_REQUIRED`，错误中不含原始 secret                            |
| TC-AUTO-PROFILE-127-01   | L3          | Profile 隔离        | 每渠道独立、目录权限 0700、位于公开仓库外；MCP 状态不返回真实路径                            |
| TC-AUTO-PROFILE-127-02   | L3          | challenge 失败关闭  | 验证码、设备确认、未知 DOM 返回结构化错误；不存在 stealth、绕过或自动解验证码路径            |
| TC-AUTO-QUEUE-127-01     | L3          | campaign 并发       | 同 campaign 串行，不同 campaign 可并行                                                       |
| TC-AUTO-QUEUE-127-02     | L3          | lock 释放           | 成功、异常与取消均释放锁，后续任务不死锁                                                     |
| TC-AUTO-RECEIPT-127-01   | L3          | receipt/idempotency | 只保存公开 ID/URL/hash/version/status；相同幂等键返回既有 receipt                            |
| TC-AUTO-RECEIPT-127-02   | L3          | 本地持久化          | 原子写入、文件 0600；损坏或 schema 不符失败关闭                                              |
| TC-AUTO-TRANSPORT-127-01 | contract    | 本地 transport      | personal plugin 仅声明 STDIO 命令，不监听公网端口、不转发渠道 secret 环境变量                |
| TC-AUTO-TRANSPORT-127-02 | MCP smoke   | 初始化与工具发现    | 本地 client 可初始化并发现精确七工具，instructions 首段包含写入与凭据边界                    |
| TC-AUTO-UX-127-01        | L3/CLI      | 低摩擦使用          | `setup/status/doctor` 帮助清晰；接入后日常 campaign 无需编辑 JSON、拼 UTM 或操作 CLI         |

## T3-A 发布桥接、adapter contract 与 GitHub mock 用例

T3 先固定以下 20 个 Case。公开仓库把 T1 renderer 的确定性平台包加入 MCP v2；personal plugin 以同版本严格校验，所有 adapter 共用一套错误、能力、幂等与 receipt 合同。GitHub 只使用注入的 typed fake client，不调用真实 `gh`、GitHub API 或站外写接口。

| Case ID                 | 层级             | 检查对象           | 预期                                                                                       |
| ----------------------- | ---------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| TC-AUTO-MCP-127-07      | L3/contract      | 平台包桥接         | `buildPublishCampaignPayload()` 直接复用 T1 renderer packages，MCP contract version 升为 2 |
| TC-AUTO-MCP-127-08      | L3/contract      | package 严格校验   | schema 全闭合；渠道唯一且匹配 spec；all-or-none 渠道与 package 完整对应；其余字段均受限    |
| TC-AUTO-ADAPTER-127-01  | adapter contract | 元数据与能力       | adapter ID、version、capabilities 稳定；声明为 false 的操作不可调用                        |
| TC-AUTO-ADAPTER-127-02  | adapter contract | 发布输入           | channel/format/content hash/幂等键严格校验；未解析媒体失败关闭                             |
| TC-AUTO-ADAPTER-127-03  | adapter contract | 成功 receipt       | 只返回公开 ID/URL/hash/version/status，不含 token、header、CLI 参数或内部对象              |
| TC-AUTO-ADAPTER-127-04  | adapter contract | 幂等重放           | 相同幂等键返回既有 receipt，不执行第二次 create                                            |
| TC-AUTO-ADAPTER-127-05  | adapter contract | 认证失败           | 401/缺授权统一映射 `REAUTH_REQUIRED`，消息和序列化结果不泄漏 secret                        |
| TC-AUTO-ADAPTER-127-06  | adapter contract | 权限与限流         | 403 映射权限拒绝；429 保留上限内 retry-after，不在 adapter 内无限重试                      |
| TC-AUTO-ADAPTER-127-07  | adapter contract | 临时失败           | 5xx/提交前超时映射可重试临时错误，保留结构化 stage                                         |
| TC-AUTO-ADAPTER-127-08  | adapter contract | 未知结果           | 提交后断线映射 `UNKNOWN_RESULT`；重试前必须按稳定外部键查询，不盲目再次写入                |
| TC-AUTO-GITHUB-127-01   | adapter contract | Release 渲染       | 由已渲染双语 package 确定性生成 tag/title/body 和公开幂等 marker                           |
| TC-AUTO-GITHUB-127-02   | adapter contract | 已存在同内容       | 同 tag 且 marker/hash 一致时复用已有 Release                                               |
| TC-AUTO-GITHUB-127-03   | adapter contract | 已存在异内容       | 同 tag 但 marker/hash 不一致时 `IDEMPOTENCY_CONFLICT` 失败关闭                             |
| TC-AUTO-GITHUB-127-04   | adapter contract | 创建成功           | typed client 的 create 结果映射为 published receipt；不经过 shell 字符串拼接               |
| TC-AUTO-GITHUB-127-05   | adapter contract | 媒体边界           | 仅有媒体类型而无受验证资产引用时拒绝发布，不声称媒体已上传                                 |
| TC-AUTO-GITHUB-127-06   | adapter contract | 删除能力           | 只删除由 receipt 指向的已知 Release；重复删除返回幂等结果                                  |
| TC-AUTO-GITHUB-127-07   | adapter contract | 未实现能力         | Issue/traffic/feedback 尚未接线时 capability=false，调用返回 `UNSUPPORTED_OPERATION`       |
| TC-AUTO-DISPATCH-127-01 | L3               | adapter registry   | 只分发到注册、启用且健康的精确渠道；未知、禁用或不匹配 package 失败关闭                    |
| TC-AUTO-DISPATCH-127-02 | L3               | all-or-none 预检   | 任一渠道预检失败时不调用任何 create；continue-supported 只执行通过预检的渠道               |
| TC-AUTO-DISPATCH-127-03 | L3               | receipt 持久化顺序 | 平台成功后才保存；已有 receipt 前置短路；落盘返回值再次对拍以阻断竞争异内容                |

## T3-B GitHub CLI、授权健康与显式启用用例

T3-B 固定以下 16 个 Case。production client 只能把 typed GitHub 操作映射为固定 `gh auth status` 与 `gh api` 参数；正文经 stdin JSON 传递。健康检查先确认 active auth，再只读 `/user` 与目标仓库元数据；健康 ready 不等于启用，只有一次性 `setup github` 写入本地非秘密 activation 后 runtime 才可注册 adapter。本阶段只做真实只读 smoke，不创建或删除 Release。

| Case ID                   | 层级             | 检查对象          | 预期                                                                                                   |
| ------------------------- | ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| TC-AUTO-GHCLI-127-01      | adapter contract | 固定操作面        | 仅允许 auth status、viewer/repository/release get-create-delete；无 shell、任意 endpoint 或 token 命令 |
| TC-AUTO-GHCLI-127-02      | adapter contract | stdin 发布正文    | Release title/body 只进入 `--input -` JSON，不进入 argv、env、日志或错误                               |
| TC-AUTO-GHCLI-127-03      | adapter contract | 响应严格解析      | viewer、repository 与 Release 只接收闭合字段；畸形/超限 JSON 失败关闭                                  |
| TC-AUTO-GHCLI-127-04      | adapter contract | 404 幂等语义      | tag GET 404 返回 null；DELETE 404 返回 already-deleted；其他错误不伪装不存在                           |
| TC-AUTO-GHCLI-127-05      | adapter contract | CLI/API 错误映射  | 401/403/429/5xx/超时保留安全错误类别与 stage，stderr/token 原文不外泄                                  |
| TC-AUTO-GHCLI-127-06      | L3/runtime       | 进程资源边界      | 固定超时/输出上限；禁用交互提示；ENOENT、超限、超时均结构化失败                                        |
| TC-AUTO-GHCLI-127-07      | read-only smoke  | 本机 GitHub CLI   | 只读 viewer/仓库权限与不存在 tag 查询通过；不调用 POST/PATCH/PUT/DELETE                                |
| TC-AUTO-GHAUTH-127-01     | L3               | ready 健康        | viewer alias 有效、仓库匹配且 push/maintain/admin 任一为真时返回 ready                                 |
| TC-AUTO-GHAUTH-127-02     | L3               | CLI 未安装        | gh ENOENT 返回 not-configured 和一次性 setup 下一步                                                    |
| TC-AUTO-GHAUTH-127-03     | L3               | 授权失效          | 401/未登录返回 reauth-required，不显示 token、scope 或 keyring 细节                                    |
| TC-AUTO-GHAUTH-127-04     | L3               | 权限/仓库阻塞     | 无写权限、仓库名不符、archived 或 disabled 均返回 blocked                                              |
| TC-AUTO-GHAUTH-127-05     | L3               | 公开状态脱敏      | status/doctor/MCP 只含 alias、health、adapterReady、nextAction                                         |
| TC-AUTO-ACTIVATION-127-01 | L3/storage       | 默认关闭          | activation 不存在时即使授权 ready 也不注册 adapter                                                     |
| TC-AUTO-ACTIVATION-127-02 | L3/storage       | 显式启用          | setup 仅在 health ready 时为固定仓库写入 0600 原子非秘密 activation                                    |
| TC-AUTO-ACTIVATION-127-03 | L3/storage       | 损坏与错配        | schema 损坏、仓库错配或未来版本失败关闭；不接受 argv/env/JSON 自定义启用                               |
| TC-AUTO-RUNTIME-127-01    | MCP/runtime      | 惰性 runtime 接线 | channels_status 动态返回健康；publish 仅在 activation+fresh health ready 时注入 adapter                |

## T3-C GitHub Issue、collector、运行时与 smoke 用例

T3-C 固定以下 22 个 Case。Release reactions 是无正文反馈；Issue comments 才是文本反馈。traffic 只允许作为最近 14 天仓库级观测背景，报告必须显式声明不可归因到 campaign/Release。Issue 创建和 Release 删除均要求已知本地 receipt/marker、fresh health 与当前 Owner 授权；真实 smoke 前先冻结目标、内容、tag、预查和撤回步骤，未获对应 campaign 授权时不写外部平台。

| Case ID                | 层级             | 检查对象          | 预期                                                                                                             |
| ---------------------- | ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| TC-AUTO-GHOBS-127-01   | adapter contract | 固定只读操作面    | 只允许 release detail/reactions 与 traffic views/clones/referrers/paths；固定受支持 API version                  |
| TC-AUTO-GHOBS-127-02   | adapter contract | Release 状态      | 严格解析 ID/tag/URL/发布时间/assets download count；额外或畸形字段失败关闭                                       |
| TC-AUTO-GHOBS-127-03   | adapter contract | Release reactions | 严格解析固定六种 reaction、公开 alias、时间和至多 100 条分页；cursor 只允许有界页码                              |
| TC-AUTO-GHOBS-127-04   | adapter contract | 仓库 traffic      | 严格解析 14 天 views/clones、至多十项 referrers/paths；负数、超限、非法时间或额外字段拒绝                        |
| TC-AUTO-GHOBS-127-05   | adapter contract | 读错误映射        | 401 为 REAUTH_REQUIRED；traffic 403 为不可观测而非伪造零；429/5xx/超时结构化且不泄漏 stderr                      |
| TC-AUTO-GHOBS-127-06   | L3               | 归因边界          | report 固定 `repository-14d` scope 与 `not-attributable-to-campaign`，不得声称 Release 带来流量                  |
| TC-AUTO-GHISSUE-127-01 | adapter contract | 固定 Issue 操作面 | 只允许 bounded list、create 与 comments list；不接受任意 search query、endpoint、label 或 assignee               |
| TC-AUTO-GHISSUE-127-02 | adapter contract | Issue stdin 正文  | title/body 只经 `--input -` JSON；正文、marker 与来源 URL 不进入 argv/env/错误                                   |
| TC-AUTO-GHISSUE-127-03 | adapter contract | 远端幂等          | 稳定 marker 分页查找；同 marker/hash 复用，异 hash 冲突；有界窗口未穷尽时禁止 create                             |
| TC-AUTO-GHISSUE-127-04 | adapter contract | Issue 写结果      | 创建结果必须回显 marker 与仓库 URL；提交后未知结果要求 lookup，不能盲重试                                        |
| TC-AUTO-GHISSUE-127-05 | adapter contract | Issue comments    | 文本按分页返回公开 alias/body/time/source URL，标记 untrusted；畸形或超限失败关闭                                |
| TC-AUTO-GHISSUE-127-06 | adapter contract | 回复边界          | T3-C 只读 comments；自动回复能力保持 false，写评论继续返回 UNSUPPORTED_OPERATION                                 |
| TC-AUTO-GHSTORE-127-01 | L3/storage       | receipt 查询      | 按 campaign 列出并按 postRef 找到精确已知 receipt；未知、跨 campaign 或 URL 不符失败关闭                         |
| TC-AUTO-GHSTORE-127-02 | L3/storage       | 删除状态          | deleted 状态 0600 原子更新；损坏、重复/冲突 receipt 或非普通文件失败关闭                                         |
| TC-AUTO-GHOPS-127-01   | MCP/runtime      | 发布状态          | get_publish_status 返回本地真实 receipts；无记录为 not-found，不伪造远端成功                                     |
| TC-AUTO-GHOPS-127-02   | MCP/runtime      | 反馈读取          | list_feedback 对 Release 返回 reactions、对已知 Issue 返回 comments，并使用有界 opaque cursor                    |
| TC-AUTO-GHOPS-127-03   | MCP/runtime      | campaign report   | 聚合 Release 状态/reactions/assets 与仓库 traffic，并携带固定观测限制                                            |
| TC-AUTO-GHOPS-127-04   | MCP/runtime      | 已知撤回          | delete_post 仅删除 campaign 已知 receipt；对拍 marker 后清理 Release 与 owned tag，二者完成才持久化 deleted      |
| TC-AUTO-GHOPS-127-05   | MCP/runtime      | 运行时健康        | feedback/report/delete 每次均要求 activation + fresh health；失效时全部失败关闭                                  |
| TC-AUTO-GHOPS-127-06   | MCP smoke        | STDIO 脱敏        | 七工具不变；status/feedback/report/delete 结构化输出不含 CLI stderr、scope、路径或 secret                        |
| TC-AUTO-GHSMOKE-127-01 | smoke plan       | 零副作用预案      | 冻结固定仓库、campaign、tag、双语正文、预查、create/get/read/delete/tag-cleanup/复查顺序；未授权不执行           |
| TC-AUTO-GHSMOKE-127-02 | real smoke       | 低风险完整闭环    | 明确授权后创建唯一测试 Release，读取/采集后删除 Release 与 owned tag；二者复查不存在，证据只保留公开 ID/URL/状态 |

### T3-C 固定 smoke 输入与顺序

- repository：`IllegalCreed/algorithms-visualization`
- campaign：`marketing-ops-t3c-smoke-127`
- tag/ref：`marketing/marketing-ops-t3c-smoke-127` / `refs/tags/marketing/marketing-ops-t3c-smoke-127`
- target/UTM：`https://algo.illegalscreed.cn/` / `utm_campaign=c127-t3c-smoke`
- 中文：标题“C127 GitHub 自动化临时验证”，说明仅验证发布、读取、反馈采集和撤回并立即删除，CTA“打开算法可视化”
- English：标题“Temporary C127 GitHub automation check”，说明仅验证 publish/read/feedback/delete and will be removed，CTA“Open Algorithm Visualizer”
- 固定 gate：`media=[]`、`replies.mode=off`；Owner 必须在当前任务明确授权上述 campaign 的 create/read/delete/tag-cleanup。
- 固定顺序：health -> Release/tag-ref 均不存在 -> setup activation -> renderer/package -> publish receipt -> status/feedback/report -> delete -> receipt deleted -> Release/tag-ref 均不存在。任何未知结果停止并先查询，不盲重试。

### T3-C 真实 smoke 证据

- Owner 在当前任务明确授权 campaign `marketing-ops-t3c-smoke-127` 的 create/read/delete/tag-cleanup。
- Release ID `352517542`、URL `https://github.com/IllegalCreed/algorithms-visualization/releases/tag/marketing/marketing-ops-t3c-smoke-127`；published receipt 与 `github-release@1.2.0` 对拍通过。
- status complete；反馈 0 条、无分页；1h report available，scope/attribution 为 `repository-14d` / `not-attributable-to-campaign`。未保留反馈正文或仓库流量明细。
- `delete_post` 返回 deleted，receipt 为 deleted；Release 查询 not found，tag ref 查询 404，复跑只读 smoke 同时返回 `releaseFound=false` 与 `tagRefFound=false`。

## T3-D-T5 运行时用例框架

| 层级             | 范围                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| L3               | 其他渠道、指标归一化、回复分类与 T1 新增分支                                 |
| adapter contract | 其他官方 HTTP/CLI 的成功、401、403、429、5xx、超时、未知结果、删除和日志脱敏 |
| smoke            | 每个启用渠道的低风险真实发布、读取和可用时撤回；证据只保留公开 URL/ID        |
| C128             | 1h/48h/7d collector、跨渠道报告、FAQ-only 回复、Bug Issue 分流               |

## 验证方法

```bash
rg -n "掘金|V2EX|B站|知乎|小红书|微信公众号|Hacker News|Reddit|Product Hunt|GitHub" docs/marketing/channel-automation-audit.md
rg -n "微博|X|DEV|Bluesky|Mastodon" docs/marketing/channel-automation-audit.md
rg -n "主密码|Cookie|内部 API|浏览器模拟|验证码|失败关闭|幂等" docs/marketing/channel-automation-audit.md docs/plans/20260711-c127-auto-distribution
rg -n "C127|提示词|approved|marketing-ops|MCP" AGENTS.md CLAUDE.md docs/overview.md docs/roadmap.md docs/marketing docs/plans/20260711-c127-auto-distribution
pnpm format:check
pnpm test:unit run scripts/marketing/*.spec.ts
pnpm marketing:dry-run -- --spec scripts/marketing/example-campaign.json
pnpm verify
pnpm coverage
pnpm exec playwright test
git diff --check
```

## 当前结果

| Case                           | 结果    | 日期       | 说明                                                           |
| ------------------------------ | ------- | ---------- | -------------------------------------------------------------- |
| TC-DOC-AUTO-127-01..05、08..09 | passed  | 2026-07-11 | 渠道、约束、MCP 隔离、记忆与状态一致                           |
| TC-DOC-AUTO-127-06..07         | passed  | 2026-07-11 | format:check 与 diff check 通过                                |
| TC-AUTO-SPEC/IDEMP-127-\_      | passed  | 2026-07-11 | schema、规范化、排期与幂等通过                                 |
| TC-AUTO-CHANNEL-127-\_         | passed  | 2026-07-11 | 15 渠道集合与全部 gate 分支通过                                |
| TC-AUTO-FACTS/RENDER-127-\_    | passed  | 2026-07-11 | 当前事实、平台候选与限制校验通过                               |
| TC-AUTO-DRYRUN-127-\_          | passed  | 2026-07-11 | 确定性、零副作用与脱敏边界通过                                 |
| TC-AUTO-MCP-127-01..06         | passed  | 2026-07-11 | 公开七工具 contract、授权、拒绝与脱敏通过                      |
| TC-AUTO-SETUP/SECRET-127-\_    | passed  | 2026-07-11 | 向导目录、隐藏录入与 Keychain 边界通过                         |
| TC-AUTO-PROFILE/QUEUE-127-\_   | passed  | 2026-07-11 | Profile 隔离、失败关闭与并发释放通过                           |
| TC-AUTO-RECEIPT-127-01..02     | passed  | 2026-07-11 | 幂等、原子 0600 持久化与损坏拒绝通过                           |
| TC-AUTO-TRANSPORT-127-01..02   | passed  | 2026-07-11 | stdio-only 配置与真实 client smoke 通过                        |
| TC-AUTO-UX-127-01              | passed  | 2026-07-11 | 一次设置、日常自然语言的 CLI 边界通过                          |
| TC-AUTO-MCP-127-07..08         | passed  | 2026-07-11 | MCP v2 renderer package 桥接与严格校验通过                     |
| TC-AUTO-ADAPTER-127-01..08     | passed  | 2026-07-11 | 共享能力、错误、幂等与 receipt 合同通过                        |
| TC-AUTO-GITHUB-127-01..07      | passed  | 2026-07-11 | typed fake Release 创建/复用/删除边界通过                      |
| TC-AUTO-DISPATCH-127-01..03    | passed  | 2026-07-11 | registry、预检、短路与持久化顺序通过                           |
| TC-AUTO-GHCLI/GHAUTH-127-\_    | passed  | 2026-07-11 | 固定 CLI、stdin、错误、只读授权/仓库健康与 smoke 通过          |
| TC-AUTO-ACTIVATION/RUNTIME-127 | passed  | 2026-07-11 | 0600 显式启用、损坏失败关闭与惰性 runtime 通过                 |
| TC-AUTO-GHOBS/GHISSUE-127-\_   | passed  | 2026-07-11 | strict Release/traffic/Issue、分页、错误与归因边界通过         |
| TC-AUTO-GHSTORE/GHOPS-127-\_   | passed  | 2026-07-11 | receipt 安全查询/状态与 MCP status/feedback/report/delete 通过 |
| TC-AUTO-GHSMOKE-127-01         | passed  | 2026-07-11 | 固定预案、Release/tag 所有权清理与真实只读预查通过             |
| TC-AUTO-GHSMOKE-127-02         | passed  | 2026-07-11 | Owner 授权的 create/read/delete/tag-cleanup 闭环及双侧复查通过 |
| T3-D-T5 运行时 Case            | planned | -          | 其余渠道、collector 与真实 smoke 后续展开                      |

## 变更历史

- 2026-07-11：创建 T0 八个 docs-only Case，并预留 T1-T5 运行时测试类别。
- 2026-07-11：T0 八个 docs-only Case 全部通过；当时 C127 保持 implementing，运行时 Case 尚未开始。
- 2026-07-11：增加 MCP 隔离 Case；C127 转 approved/25% 并后置，运行时 Case 尚未开始。
- 2026-07-11：C130 verified 后 C127 恢复为当前下一阶段；运行时 Case 仍须从 T1 先红后绿建立。
- 2026-07-11：C127 转 in-progress/30%；固定 T1 的 19 个 L3 Case，并收紧双语内容、站点事实和凭据边界。
- 2026-07-11：Owner 将 C131 全量英文对齐置于 T2 前；既有 T1 Case 保持 active，T2-T5 planned Case 暂不展开。
- 2026-07-11：T1 先记录 5 文件 import failure，再实现到 19 Case 全绿；291/2092 Vitest、coverage、115 L5、verify 与 125 页 production build 均通过。
- 2026-07-11：C131 verified；T2-T5 planned Case 恢复可执行，下一步从 T2 MCP contract 红测开始。
- 2026-07-11：按 Owner“首次接入有人带、日常只给提示词”的要求展开 T2 二十个精确 Case；新增 setup/status/doctor 易用性与 secret 不经 argv/env/JSON 的硬边界。
- 2026-07-11：T2 二十个 Case 全部通过；公开仓库固定七工具 contract，独立 personal plugin 完成 Keychain/Profile、队列、receipt、stdio 与低摩擦 CLI。真实 adapter、账号、凭据和站外写入均未开始，下一步 T3。
- 2026-07-11：T3-A 展开二十个精确 Case；先补 MCP v2 平台包桥接，再以 typed fake client 建立共享 adapter contract、GitHub Release mock 与失败关闭 dispatch，全程禁止真实站外写入。
- 2026-07-11：T3-A 先记录公开 contract 3 项失败与 plugin 3 个缺失模块套件/4 项契约失败，再实现到 20 Case 全绿；plugin 12 文件/43 用例、coverage、verify 与 STDIO v2 smoke 通过，默认 server 仍零 live client、零账号授权、零站外写入。
- 2026-07-11：T3-B 展开十六个精确 Case；固定 typed `gh api`、stdin 正文、只读健康、显式 activation 与惰性 runtime，真实写入 smoke 继续后置。
- 2026-07-11：T3-B 初始四套件因目标模块缺失失败；随后 18 个定向断言转绿。空配置复现未登录 CLI 无 HTTP 401 后，再以 2 项 red/green 补入固定 `gh auth status --active` 前置检查；最终 plugin 16 文件 / 61 用例、coverage、verify、STDIO 与只读 smoke 全绿。activation 仍不存在、adapter disabled、零真实写入，C127 转 68%，下一步 T3-C。
- 2026-07-11：T3-C 展开二十二个精确 Case；官方能力固定为 Release reactions、Issue comments 与不可归因的 14 天仓库 traffic。真实 smoke 拆为零副作用预案和获授权后的 create/read/delete 证据，避免把“继续开发”误当成某条外部内容的发布授权。
- 2026-07-11：T3-C 初始 5 文件 red（2 个缺失模块、7 失败/2 通过）后实现到 21 文件 / 93 用例全绿；coverage 与 verify 通过。审计进一步发现 Release 删除不会替代 Git ref 清理，以 2 文件 5 项 red/green 补入 tag 所有权 gate 与 cleanup。扩展只读 smoke 确认 traffic/Issues 可读、目标 Release/tag 均不存在；activation 仍缺失、零真实写入，C127 转 74%。
- 2026-07-11：Owner 明确授权后执行 TC-AUTO-GHSMOKE-127-02；临时 Release `352517542` 完成发布、读取、零反馈采集、不可归因报告与删除，receipt、Release 和 tag ref 复查一致。C127 转 76%，下一步 T3-D。
