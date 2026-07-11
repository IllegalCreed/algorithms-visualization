# 测试用例：提示词驱动的全自动内容分发

> Status: in-progress
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 62%
> Blocked by: none
> Next action: 展开 T3-B GitHub CLI typed client、授权健康检查与 mock transport Case
> Replaces: C-20260710-123 中 TC-DOC-GROWTH-123-03 的“每帖人工审批”历史断言
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_
> Related requirement: requirements.md

## T0 文档用例

| Case ID            | 层级 | 检查对象                     | 预期                                                                                              |
| ------------------ | ---- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| TC-DOC-AUTO-127-01 | docs | 渠道审计                     | 十个正式渠道与微博、X、DEV、Bluesky、Mastodon 五个补充渠道各出现一次，集合无遗漏                  |
| TC-DOC-AUTO-127-02 | docs | 官方依据                     | 每个渠道都有发布、监测、回复、授权/准入、成本或限制结论，并链接官方资料                           |
| TC-DOC-AUTO-127-03 | docs | 能力等级与 Owner 约束        | 免费个人首批、Reddit 后备、人工监测、主体禁用和费用禁用集合明确；不把聚合评论数误写成评论正文能力 |
| TC-DOC-AUTO-127-04 | docs | marketing/roadmap/agent 记忆 | C127 一致为 in-progress/62%、T1/T2/T3-A 完成且下一步为 T3-B；不把 mock adapter 写成已授权实发     |
| TC-DOC-AUTO-127-05 | docs | 凭据与失败策略               | API/RPA 凭据隔离、幂等与失败关闭完整；禁止主密码回传、内部 API、stealth 和验证码绕过              |
| TC-DOC-AUTO-127-06 | docs | `pnpm format:check`          | 本轮文档符合 Prettier                                                                             |
| TC-DOC-AUTO-127-07 | docs | `git diff --check`           | diff 无尾随空白或空白错误                                                                         |
| TC-DOC-AUTO-127-08 | docs | plan 状态                    | T0 调研已完成，但 MCP/adapter/secret/真实发布均保持未完成；四文档不得误标 verified                |
| TC-DOC-AUTO-127-09 | docs | MCP 凭据边界                 | Codex 只见高层工具与脱敏结果；凭据/Profile 位于独立本地服务且不存在任意浏览器执行工具             |

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

## T3-B-T5 运行时用例框架

| 层级             | 范围                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| L3               | 指标归一化、回复分类与 T1 新增分支                                                 |
| adapter contract | 官方 HTTP/CLI 的成功、401、403、429、5xx、超时、未知结果、重复请求、删除和日志脱敏 |
| smoke            | 每个启用渠道的低风险真实发布、读取和可用时撤回；证据只保留公开 URL/ID              |
| C128             | 1h/48h/7d collector、跨渠道报告、FAQ-only 回复、Bug Issue 分流                     |

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

| Case                           | 结果    | 日期       | 说明                                       |
| ------------------------------ | ------- | ---------- | ------------------------------------------ |
| TC-DOC-AUTO-127-01..05、08..09 | passed  | 2026-07-11 | 渠道、约束、MCP 隔离、记忆与状态一致       |
| TC-DOC-AUTO-127-06..07         | passed  | 2026-07-11 | format:check 与 diff check 通过            |
| TC-AUTO-SPEC/IDEMP-127-\_      | passed  | 2026-07-11 | schema、规范化、排期与幂等通过             |
| TC-AUTO-CHANNEL-127-\_         | passed  | 2026-07-11 | 15 渠道集合与全部 gate 分支通过            |
| TC-AUTO-FACTS/RENDER-127-\_    | passed  | 2026-07-11 | 当前事实、平台候选与限制校验通过           |
| TC-AUTO-DRYRUN-127-\_          | passed  | 2026-07-11 | 确定性、零副作用与脱敏边界通过             |
| TC-AUTO-MCP-127-01..06         | passed  | 2026-07-11 | 公开七工具 contract、授权、拒绝与脱敏通过  |
| TC-AUTO-SETUP/SECRET-127-\_    | passed  | 2026-07-11 | 向导目录、隐藏录入与 Keychain 边界通过     |
| TC-AUTO-PROFILE/QUEUE-127-\_   | passed  | 2026-07-11 | Profile 隔离、失败关闭与并发释放通过       |
| TC-AUTO-RECEIPT-127-01..02     | passed  | 2026-07-11 | 幂等、原子 0600 持久化与损坏拒绝通过       |
| TC-AUTO-TRANSPORT-127-01..02   | passed  | 2026-07-11 | stdio-only 配置与真实 client smoke 通过    |
| TC-AUTO-UX-127-01              | passed  | 2026-07-11 | 一次设置、日常自然语言的 CLI 边界通过      |
| TC-AUTO-MCP-127-07..08         | passed  | 2026-07-11 | MCP v2 renderer package 桥接与严格校验通过 |
| TC-AUTO-ADAPTER-127-01..08     | passed  | 2026-07-11 | 共享能力、错误、幂等与 receipt 合同通过    |
| TC-AUTO-GITHUB-127-01..07      | passed  | 2026-07-11 | typed fake Release 创建/复用/删除边界通过  |
| TC-AUTO-DISPATCH-127-01..03    | passed  | 2026-07-11 | registry、预检、短路与持久化顺序通过       |
| T3-B-T5 运行时 Case            | planned | -          | 其余渠道、collector 与真实 smoke 后续展开  |

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
