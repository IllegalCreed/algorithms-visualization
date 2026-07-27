# 测试用例：marketing-ops 多项目隔离与通用化

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
> Related requirement: requirements.md

## T1 Project Profile

| Case ID                | 层级 | 检查对象             | 预期                                                                |
| ---------------------- | ---- | -------------------- | ------------------------------------------------------------------- |
| TC-AUTO-PROJECT-133-01 | L3   | profile 保存/读/列出 | 合法 profile 规范化后原子写入 0600 文件，列表只返回公开配置         |
| TC-AUTO-PROJECT-133-02 | L3   | profile 严格 schema  | 非法 ID/origin/repository/channel/tag、额外字段与凭据字段全部拒绝   |
| TC-AUTO-PROJECT-133-03 | L3   | 文件系统安全         | 宽松权限、symlink、目录穿越、损坏 JSON 与 ID/文件名错配全部失败关闭 |

## T2 契约与隔离

| Case ID                  | 层级        | 检查对象            | 预期                                                                       |
| ------------------------ | ----------- | ------------------- | -------------------------------------------------------------------------- |
| TC-AUTO-CONTRACT-133-01  | L3/contract | MCP v3              | 精确七工具均要求 projectId，保持 additionalProperties=false 和危险字段拒绝 |
| TC-AUTO-ISOLATION-133-01 | L3          | 幂等与 receipt      | 两项目相同 campaign/内容产生不同键和独立 v2 receipt                        |
| TC-AUTO-ISOLATION-133-02 | L3/MCP      | operation 查询/写入 | 跨项目 status/report/feedback/reply/delete 在调用 adapter 前失败关闭       |
| TC-AUTO-TARGET-133-01    | L3          | URL 与渠道策略      | 站外 target/package/canonical 或 profile 未允许渠道在副作用前被拒绝        |

## T3 Adapter 与兼容

| Case ID                  | 层级   | 检查对象           | 预期                                                                        |
| ------------------------ | ------ | ------------------ | --------------------------------------------------------------------------- |
| TC-AUTO-GITHUB-133-01    | L3/MCP | GitHub project ctx | repository、tag、activation 只来自请求项目 profile，不能由 MCP 输入覆盖     |
| TC-AUTO-DEV-133-01       | L3/MCP | DEV project ctx    | canonical origins 与 tags 由 profile 注入，账号凭据保持全局复用             |
| TC-AUTO-MIGRATION-133-01 | L3     | 旧 runtime state   | Algorithm Visualizer v1 receipt 可读；旧 GitHub activation 仅仓库匹配时迁移 |

## T4 CLI、Bridge 与插件

| Case ID               | 层级        | 检查对象         | 预期                                                                     |
| --------------------- | ----------- | ---------------- | ------------------------------------------------------------------------ |
| TC-AUTO-CLI-133-01    | L3/CLI      | project 命令     | add/list/show 不要求编辑 JSON、不接收 secret，GitHub setup/status 选项目 |
| TC-AUTO-BRIDGE-133-01 | L3/contract | 公开项目 payload | Algorithm Visualizer payload 固定 projectId，公开/私有 contract v3 对齐  |
| TC-AUTO-PLUGIN-133-01 | build       | 插件交付         | 通用 README/skill/manifest、cachebuster、validator、stdio 与泄漏扫描通过 |

## 测试层说明

- 新增 13 个精确 Case，主要覆盖本地插件 L3/MCP 与公开 bridge L3。
- 本变更不改变 Vue 页面、路由或交互，因此不新增 L4/L5；公开仓库完整 `pnpm verify` 负责现有 UI 回归。
- profile/path/policy/receipt migration 属安全边界，行与分支覆盖率目标均为 100%。
- 所有测试使用临时目录、fake adapter 和非秘密 fixture，不访问真实平台，不产生站外副作用。
- 2026-07-27 最后验证：本地插件 44 文件 / 223 用例与 coverage/stdio/validator/Gitleaks 全绿；公开 bridge 定向 2 文件 / 12 用例、主项目仓库全量 299 文件 / 2132 用例及 190 页构建/SEO 门禁全绿。
