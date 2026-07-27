# 需求：marketing-ops 多项目隔离与通用化

> Status: verified
> Stable ID: C-20260727-133
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-27
> Last reviewed: 2026-07-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成；C127 T3-D4-B setup/identity smoke 已完成，继续 T3-D4-C 固定预案
> Replaces: none
> Replaced by: none
> Related plans: C-20260711-127
> Related tests: TC-AUTO-PROJECT-133-\_、TC-AUTO-CONTRACT-133-\_、TC-AUTO-ISOLATION-133-\_、TC-AUTO-TARGET-133-\_、TC-AUTO-GITHUB-133-\_、TC-AUTO-DEV-133-\_、TC-AUTO-MIGRATION-133-\_、TC-AUTO-CLI-133-\_、TC-AUTO-BRIDGE-133-\_、TC-AUTO-PLUGIN-133-\_

## 背景

C127 已把发布凭据和平台执行能力隔离到本机独立 `marketing-ops` 插件，但当前实现仍把 GitHub 仓库、项目域名、DEV 标签与 Algorithm Visualizer 写死在运行时。Owner 希望同一套免费个人账号和同一个本地工具继续服务其他项目，因此必须先建立项目级配置与隔离边界，再继续 Mastodon 等渠道的真实接入。

## Owner 决策

- 原始决策：`marketing-ops` 使用独立私有 GitHub 仓库维护，不把凭据、activation、receipt 或浏览器状态提交到仓库。
- 后续决策（2026-07-27）：Owner 批准将 `IllegalCreed/marketing-ops` 改为公开仓库；仅源码可见性发生变化，凭据、activation、receipt、profile、浏览器状态与其他 runtime state 仍不得提交。
- 平台账号与凭据默认全局复用；每个项目只保存非秘密的目标、品牌和渠道策略。
- 日常仍由 Owner 给自然语言提示词，Codex 调用七个高层 MCP 工具；Owner 不编辑 JSON，也不接触内部 adapter 参数。
- 保持零新增费用、个人主体可用、官方 API 优先和失败关闭边界。

## 功能需求

### R1 本地 Project Profile

- 每个项目以稳定 `projectId` 注册本地 profile，至少包含显示名称、允许的 HTTPS canonical origins、允许渠道，以及可选 GitHub `owner/repository` 和 DEV tags。
- profile 位于仓库外的运行时数据目录，文件权限必须为 `0600`，目录权限必须为 `0700`，写入采用原子替换。
- profile 不得包含 token、password、Cookie、App Password、API key、浏览器路径或任意命令。
- ID、origin、仓库名、渠道和标签均使用严格 schema；额外字段、符号链接、宽松权限和损坏内容失败关闭。

### R2 MCP 契约 v3

- 继续只暴露 C127 的七个高层工具，不新增任意 HTTP、浏览器、文件或命令执行能力。
- 七个工具都必须显式携带 `projectId`，服务端先解析本地 profile，再执行状态、发布、反馈、报告、回复或删除。
- MCP 输入不得直接指定 GitHub repository、DEV canonical origin、平台凭据或本地路径；这些目标只来自本地 profile。

### R3 项目级隔离与幂等

- 幂等键必须包含 `projectId`，同 campaign ID、同内容在不同项目中不得冲突。
- 新 receipt 使用带 `projectId` 的 schema v2；查询、反馈、报告、回复和删除只能访问请求项目自己的 receipt。
- project、campaign、channel、postRef 或 idempotency 任一不匹配均失败关闭，不允许跨项目短路、读取或删除。

### R4 目标与渠道策略

- campaign target URLs、平台包链接和 DEV canonical URL 必须属于 profile 注册的 HTTPS origin。
- GitHub Release 目标仓库只来自 profile；tag 与远端 marker 必须包含可验证的项目归属。
- DEV canonical origins 和 tags 从 profile 派生，不再写死 Algorithm Visualizer 域名或标签。
- profile 未允许、未完成全局授权或运行时健康失败的渠道继续 blocked/disabled。

### R5 兼容迁移

- Algorithm Visualizer 注册为显式 profile：`algorithm-visualizer`。
- 已存在的 GitHub、Bluesky、DEV activation 与 receipt 不得丢失；v1 receipt 以受控兼容规则映射到 Algorithm Visualizer，已发布 DEV 正式文章仍可读取报告。
- GitHub activation 迁移到项目级命名空间时，只在 profile repository 完全匹配时采用旧记录。
- 迁移不得读取、输出或重写平台 secret。

### R6 使用体验

- CLI 提供项目新增、查看和列表命令；新增过程校验字段并写入安全 profile，不要求手工编辑 JSON。
- GitHub setup/status 明确选择项目；全局凭据渠道继续一次 setup、多项目复用。
- README、插件 skill 与 manifest 使用通用描述，并给出 Algorithm Visualizer 作为示例而不是唯一项目。

## 验收标准

1. 两个测试项目使用相同 campaign ID 时产生不同幂等键和独立 receipt。
2. 跨项目 status/report/feedback/delete 请求被明确拒绝，且 adapter 未被调用。
3. 任意站外 URL、任意 repository 注入、凭据字段或宽松 profile 权限在副作用前被拒绝。
4. Algorithm Visualizer 公开 renderer 生成的 payload 固定携带 `projectId=algorithm-visualizer`。
5. 旧 DEV 正式文章 receipt 与已有全局渠道 activation 在迁移后仍可安全读取。
6. 独立插件 `verify`、coverage、MCP stdio smoke、插件 validator 和泄漏扫描通过；主项目仓库相关单测与门禁通过。

## 非目标

- 本期不新增平台 adapter、Web 管理界面、云端凭据服务或多账号路由。
- 本期不启用微博 RPA，不改变 C127 的平台成本与认证决策。
- 本期不把 secret、runtime state 或真实账号标识提交到任一 GitHub 仓库。
- 被暴露的 Mastodon token 不进入 C133 实现或测试；2026-07-27 已通过官方 regenerate 失效，替代 token 随 C127 T3-D4-B 经本机隐藏 PTY 完成 setup。
