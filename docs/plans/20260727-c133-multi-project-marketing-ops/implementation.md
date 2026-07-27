# 实现记录：marketing-ops 多项目隔离与通用化

> Status: verified
> Stable ID: C-20260727-133
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-27
> Last reviewed: 2026-07-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成；返回 C127，先撤销暴露的 Mastodon token，再用隐藏输入完成 setup/identity smoke
> Replaces: none
> Replaced by: none
> Related plans: C-20260711-127
> Related tests: TC-AUTO-PROJECT-133-\_、TC-AUTO-CONTRACT-133-\_、TC-AUTO-ISOLATION-133-\_、TC-AUTO-TARGET-133-\_、TC-AUTO-GITHUB-133-\_、TC-AUTO-DEV-133-\_、TC-AUTO-MIGRATION-133-\_、TC-AUTO-CLI-133-\_、TC-AUTO-BRIDGE-133-\_、TC-AUTO-PLUGIN-133-\_
> Related design: design.md

## 执行顺序

`T0 文档与边界` -> `T1 red tests` -> `T2 profile/policy` -> `T3 contract/runtime/receipt` -> `T4 adapter 与旧数据迁移` -> `T5 公开 bridge` -> `T6 插件包装、全门禁与回写`。

## T0 文档与边界

- [x] 确认私有 `IllegalCreed/marketing-ops` 仓库已创建并保持 private。
- [x] 确认凭据、activation、receipt、profile 与 state 均被 git ignore。
- [x] 用 Gitleaks 扫描现有 git 历史，无已提交 secret。
- [x] Owner 明确要求同一工具服务多个项目，并保持统一个人账号、零新增费用。
- [x] 固定 profile、契约 v3、项目级幂等/receipt、目标策略与兼容迁移设计。

## T1 失败用例

- [x] ProjectProfileStore 合法、非法、权限、symlink 与损坏文件用例先红。
- [x] 七工具 `projectId`、无任意目标字段与 contract v3 用例先红。
- [x] 同 campaign 跨项目隔离、跨项目读取/删除拒绝用例先红。
- [x] URL/repository/DEV canonical/tags profile policy 用例先红。
- [x] v1 receipt 与旧 GitHub activation 兼容迁移用例先红。
- [x] project CLI 与公开 payload bridge 用例先红。

## T2 Profile 与 Policy

- [x] 实现严格 `ProjectProfile` schema、0600 原子存储与列表/读取。
- [x] 实现 project URL、channel、repository 与 DEV tags 策略。
- [x] 注册 `algorithm-visualizer` 本地 profile，不写入凭据或账号标识。

## T3 Contract、Runtime 与 Receipt

- [x] 契约升级 v3，七工具都要求 `projectId`。
- [x] adapter publish input、运行时 handler 与 operation controller 贯穿 project context。
- [x] 幂等键升级 `campaign-v3/<projectId>/...`。
- [x] receipt 升级 v2，并对所有查询、报告、反馈、回复、删除实施项目归属检查。

## T4 Adapter 与迁移

- [x] GitHub repository、tag、activation 与 controller 改为 project-scoped。
- [x] DEV canonical origins 与 tags 改由 profile 注入。
- [x] 验证 Bluesky、DEV、Mastodon 全局凭据可跨项目复用而回执隔离。
- [x] 安全兼容 Algorithm Visualizer 的 v1 receipt 与旧 GitHub activation。

## T5 公开仓库桥接

- [x] 公开 MCP contract 镜像升级 v3。
- [x] Algorithm Visualizer renderer payload 固定写入 `projectId=algorithm-visualizer`。
- [x] 更新 C127 受影响记录、营销执行事实与测试索引。

## T6 验证与交付

- [x] 私有插件 format、type-check、unit、coverage、build、verify 与 stdio smoke 全绿。
- [x] 插件 cachebuster、validator、安装态和 Gitleaks 全绿。
- [x] 公开仓库相关单测与 `pnpm verify` 全绿。
- [x] 填写本文件自测报告，四文档转 verified。
- [x] 两个仓库分别精确暂存、提交并推送；不提交 runtime state。

## 实现偏差

- CLI 的项目级状态命令实际为 `status --project <id>` / `doctor --project <id>`，不是早期草案中的 `status github --project <id>`，已同步设计文档。
- 私有插件没有独立 ESLint 脚本；交付门禁按仓库现有 `format:check`、`type-check`、Vitest、build 与 stdio smoke 执行。
- 公开全量 Vitest 在并行负载下使既有 `TC-I18N-MODULE-131-D01` 与 `TC-I18N-CONTENT-131-02` 超过默认 5 秒；前者的 10 秒试调在高负载复跑时仍不足，而定向复跑结果均正确。这两条分别遍历 50 个 adapter、逐个 mount 50 个页面，最终只把两条重用例的局部预算调整为 30 秒，不涉及运行时逻辑，也不放宽其他测试。

## 自测报告

### 私有 `marketing-ops`

- `pnpm verify`：format、type-check、44 个测试文件 / 223 个用例、build 与真实 MCP stdio v3 七工具 smoke 全绿。
- `pnpm coverage`：statements 97.23%、branches 93.90%、functions 99.78%、lines 97.82%；project profile、project policy、receipt、activation、local runtime 与 DEV 安全边界达到各自门槛。
- `pnpm test:github-readonly`：GitHub 账号/目标仓库、traffic 与 Issue 只读检查通过，固定临时 Release/tag 均不存在。
- 官方 plugin validator、skill quick validator 与已安装插件 smoke 通过；cachebuster 为 `0.1.0+codex.20260727032639`。
- Gitleaks 对工作树与既有 17 个提交历史扫描均无泄漏；私有仓库保持 private。
- 通过交互 CLI 注册 `algorithm-visualizer` profile；运行时目录为 `0700`、profile 与项目级 GitHub activation 为 `0600`。平台 secret、receipt、activation 与 profile 均未进入 git。

### 公开仓库

- bridge 红测先出现 contract v2 / 缺少 `projectId` 的 4 项预期失败；实现后定向 2 个文件 / 12 个用例全绿。
- `pnpm verify`：format、lint、type-check、299 个测试文件 / 2132 个用例、production build、190 页预渲染与 SEO 校验全绿。
- C133 不改变页面、路由或交互，因此不新增或重跑 L5；Mastodon 也未发生 setup、读取或发布副作用。

### 交付提交

- 私有 `marketing-ops`：`62e6c73`（多项目运行时）与 `b7c49a5`（通用插件入口）已推送 `main`。
- 公开仓库：`1f0b0d7`（MCP v3 bridge）与 `d1e15a3`（两条 C131 重测试局部预算）已提交；C133 文档随本次文档提交推送。

### 未完成项

- C133 已完成。聊天中暴露的 Mastodon token 从未被实现、命令、测试或日志使用；C127 T3-D4-B 必须等待 Owner 先在 Mastodon 撤销该 token，再通过本机隐藏 TTY 输入替代 token。
