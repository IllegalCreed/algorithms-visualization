# 实现记录：提示词驱动的全自动内容分发

> Status: in-progress
> Stable ID: C-20260711-127
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 62%
> Blocked by: none
> Next action: T3-B GitHub CLI typed client、授权健康检查与 mock transport 红测
> Replaces: C-20260710-123 中“每帖人工审批”的 C127 历史约束
> Replaced by: none
> Related plans: C-20260710-123、C-20260710-129、C-20260711-126、C-20260711-130、C-20260711-131
> Related tests: TC-DOC-AUTO-127-\_、TC-AUTO-SPEC-127-\_、TC-AUTO-IDEMP-127-\_、TC-AUTO-CHANNEL-127-\_、TC-AUTO-FACTS-127-\_、TC-AUTO-RENDER-127-\_、TC-AUTO-DRYRUN-127-\_、TC-AUTO-MCP-127-\_、TC-AUTO-SETUP-127-\_、TC-AUTO-SECRET-127-\_、TC-AUTO-PROFILE-127-\_、TC-AUTO-QUEUE-127-\_、TC-AUTO-RECEIPT-127-\_、TC-AUTO-TRANSPORT-127-\_、TC-AUTO-UX-127-\_、TC-AUTO-ADAPTER-127-\_、TC-AUTO-GITHUB-127-\_、TC-AUTO-DISPATCH-127-\_
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

- [ ] GitHub Release/Issue adapter 与 traffic/feedback collector。
- [ ] 微博官方 Agent CLI adapter。
- [ ] Bluesky AT Protocol adapter。
- [ ] DEV/Forem article 与 metrics/comments adapter，保持 `reply=false`。
- [ ] Mastodon statuses/notifications adapter。
- [ ] 每个 adapter 完成成功、认证失败、限流、未知结果、幂等和日志脱敏 contract tests。

- [ ] 每个 adapter 只通过 `marketing-ops` 读取所需 secret；公开仓库和 GitHub Actions 不持有渠道凭据。
- [ ] 设置最小平台权限、campaign concurrency、超时、重试和预算 guard。
- [ ] receipt 记录 ID/URL/hash/幂等键/adapter version，不记录 token、Cookie 或 storage state。
- [ ] dry-run 与正式 publish 路径有可自动验证的副作用边界。

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

T0 调研和方案设计、T1 公开基础层、T2 MCP 安全运行时骨架与 T3-A adapter contract/GitHub mock 已完成。`scripts/marketing/` 现包含版本化 schema/严格 validator、规范化与 SHA-256 幂等键、15 渠道能力注册表和 runtime gate、站点事实快照及对拍、渠道 renderer、示例 campaign、`pnpm marketing:dry-run`、MCP v2 contract 与 `buildPublishCampaignPayload()`。v2 的 `publish_campaign.packages` 直接承接公开 renderer 结果，Owner 不编辑 JSON，私有插件也不复制平台文案或 UTM 逻辑。

独立 personal plugin 已在本机 `/Users/zhangxu/plugins/marketing-ops` 建立；T2 骨架由本地提交 `a53f411` 固定，T3-A 由本地提交 `ba6d4c3` 固定。它通过 stdio 暴露精确七个高层 MCP 工具，提供一次性 `setup`、只读 `status/doctor`、macOS Keychain helper、每渠道独立 Profile、campaign 锁、0600 原子 receipt 存储与输出脱敏；凭据只经子进程 stdin/隐藏输入进入 Keychain，不进入 argv、env、JSON、日志或 MCP 输出。

personal plugin 的 T3-A 新增共享 adapter contract、GitHub Release adapter、PublishService 与 runtime handler。GitHub adapter 只接受 typed client 的 `findReleaseByTag/createRelease/deleteRelease`，以稳定 tag、公开 hash marker、本地 receipt 和同键异内容冲突检测形成幂等闭环；平台确认值与持久化返回值都会对拍 campaign/channel/key/hash，竞争写入不能混入异内容 receipt。媒体只有类型而没有受验证资产引用时失败关闭。`all-or-none` 要求显式渠道与完整 package，仅承诺写入前预检零副作用，不伪造跨平台事务回滚。

当前仍没有 live GitHub CLI client、真实平台授权、已保存本轮凭据、enabled adapter、collector 或站外发布动作，不能表述为“全自动系统已经可用”。默认 server 不注入 PublishService/live client，五渠道仍全部失败关闭。T3-B 才实现 GitHub CLI typed client 与授权健康检查；首次接入时仍由 Codex 带 Owner 走一次向导。

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

## 变更历史

- 2026-07-11：完成 T0；确认五个免费个人首批、Reddit 后备、三个人工监测、三个 D 级禁用、微信/B站主体禁用和 X 费用禁用。
- 2026-07-11：独立 `marketing-ops` MCP/RPA 边界设计批准；停止 T1 开工，宣传自动化后置到多语言与内容主线之后。
- 2026-07-11：C130 双轨发布完成；C127 恢复为当前工程主线，下一步执行 T1 的 schema、能力 gate、幂等与 dry-run 红测。
- 2026-07-11：T1 完成并通过全门禁；C127 为 in-progress/40%，下一步 T2 MCP contract 与凭据边界，真实发布仍未开始。
- 2026-07-11：Owner 将全量英文翻译置于 C127 T2 前；保留 40% 进度与 T1 代码，等待 C131 verified 后继续。
- 2026-07-11：C131 全量英文对齐和双轨发布完成；C127 恢复为当前主线，下一步 T2 MCP contract。
- 2026-07-11：T2 完成公开七工具 contract 与独立 `marketing-ops` personal plugin 安全骨架；20 个精确 Case、coverage、stdio smoke 和 plugin validator 通过，C127 转 in-progress/55%，下一步 T3 adapter contract 与 GitHub mock。
- 2026-07-11：T3-A 完成 MCP v2 renderer package 桥接、共享 adapter contract、GitHub Release typed fake client 与失败关闭 dispatch；20 个 Case 通过，C127 转 in-progress/62%，下一步 T3-B live GitHub CLI 边界。
