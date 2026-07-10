# 需求：分析、事件与渠道归因

> Status: superseded
> Stable ID: C-20260710-125
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Progress: 90%
> Blocked by: none
> Next action: 已由 C129 撤销第三方 tracker；保留 UTM，增长主线进入 C126
> Replaces: none
> Replaced by: C-20260710-129
> Related plans: C-20260710-123、C-20260710-124、C-20260705-118
> Related tests: TC-ATTR-UTM-125-_、TC-ANL-CLIENT-125-_、TC-ANL-PRIVACY-125-_、TC-ANL-ROUTE-125-_、TC-ANL-EVENTS-125-_、TC-MARKETING-LINKS-125-_、TC-E2E-ANL-125-\_、TC-OPS-ANL-125-\_

## 背景

> 历史状态说明：C125 未曾激活生产统计。C129 已删除第三方运行时、会话归因、事件和隐私入口；本文不再是可执行需求。

C124 已让 95 个可索引页面具备稳定的静态入口、route head、JSON-LD、sitemap 与 llms.txt，但项目仍无法回答“流量从哪里来、用户是否真正使用学习交互、不同发布渠道是否值得继续投入”。`docs/marketing/launch-posts.md` 中的链接也尚无统一归因参数。

本变更建立 C126 多语言与 C127/C128 分发复盘所依赖的测量地基。前端使用供应商无关的类型化适配层，远端实例不可用或配置不完整时必须失败关闭，不阻塞页面功能。服务器只读审计后，因 1.8 GiB 内存、无 swap、无 Docker/PostgreSQL 且已有多组服务，本期否决同机自托管，转用 Umami Cloud Hobby 作为生产候选。

## 目标

1. 完成 GA4、Plausible、Umami 的隐私、成本、托管、事件与运维评审，并记录选择依据。
2. 建立类型化事件契约，覆盖 `page_view`、`search`、`play`、`input_apply`、`quiz_complete`、`share`、`language_switch`。
3. 固化 `utm_source`、`utm_medium`、`utm_campaign`、`utm_content` 命名和校验规则，让发布链接从同一纯函数生成。
4. 在单个浏览器会话内记录首触与当前触来源，单独识别 `chatgpt.com`，不记录完整 referrer URL。
5. 在现有搜索、播放器和分享入口接入至少五类核心交互，且不发送搜索词、算法输入值、题目文本或其他自由文本。
6. 建立 48 小时与 7 天观察模板，能按来源、campaign、落地页和学习行为比较渠道效果。
7. 完成 Umami Cloud EU 区域的生产统计实例、双轨站点配置、测试事件与看板核验；统计失败不得影响 SPA、预渲染或部署。

## 不做什么

- 不在本期实现 `/en` 或站点语言切换 UI；`language_switch` 只建立契约，接线属于 C126。
- 不实现 C127 的渠道草稿生成、官方 API 发布、定时任务或凭据管理。
- 不收集姓名、邮箱、自定义 User ID、设备指纹、完整 referrer、搜索词原文、算法输入值或测验题目/选项；不把 IP 原文写入事件或自定义身份字段。
- 不用统计结果识别单个访问者，也不启用广告、跨站追踪、Google Signals 或再营销。
- 不把一次测试访问、短期流量变化或 dashboard 数字描述为增长结论。
- 不让统计脚本、实例故障或广告拦截器导致页面报错、构建失败或交互不可用。

## 功能需求

### R1 供应商与配置

- 前端配置支持 `none` 与 `umami`；缺少 provider、script URL 或 website ID 时保持禁用。
- Umami tracker 使用手动 page view，避免 SPA 自动追踪与路由监听重复计数。
- tracker 未加载完成前最多缓存 50 个事件；加载失败后静默停止发送，不抛到业务 UI。
- website ID 与 tracker URL 可公开进入构建配置；管理员密码、数据库口令和 API token 不进入仓库、前端 bundle、日志或生成物。

### R2 UTM 与会话归因

- 只接受四个字段：`utm_source`、`utm_medium`、`utm_campaign`、`utm_content`。
- 值统一小写，只允许 ASCII 字母、数字、点、下划线与连字符，长度不超过 64；不合法值丢弃而非透传。
- campaign 链接生成器保留目标页既有的非 UTM query/hash，并以规范顺序写入四个 UTM 字段。
- 首触与当前触仅写入 `sessionStorage`；数据结构有版本号，可解析失败时自愈。
- 无 UTM 时仅从外部 referrer 提取合法 hostname；站内 referrer 不覆盖来源；首次无来源记为 `direct / none`。
- `utm_source=chatgpt.com` 或 referrer hostname 为 `chatgpt.com` 时均可按该来源聚合。

### R3 事件契约

| 事件              | 最小字段                                                       | 隐私边界                             |
| ----------------- | -------------------------------------------------------------- | ------------------------------------ |
| `page_view`       | `path`、`page_name`、`page_type`                               | path 去 query/hash                   |
| `search`          | `action`、`query_length`、`result_count`、可选 `selected_slug` | 不发送 query 原文                    |
| `play`            | `algorithm`、`trigger`、`step_index`                           | algorithm 为稳定 slug/module title   |
| `input_apply`     | `algorithm`、`item_count`                                      | 不发送输入数组或 URL 的 `input` 参数 |
| `quiz_complete`   | `algorithm`、`correct`、`total`                                | 不发送题目、选项或单题作答内容       |
| `share`           | `channel`、`path`                                              | 只统计微博/X，不统计普通外链         |
| `language_switch` | `from`、`to`、`path`                                           | C126 接线，不代表代码标签切换        |

首触与当前触只保存在本次浏览会话中。发送事件时，客户端把当前触映射为净化统计 URL 上的标准 UTM 参数，并把 referral 缩减为 hostname origin；首触不上传为 custom property。自定义事件仅附加业务白名单字段与 `deployment`，属性名与字符串长度受运行时白名单约束。

### R4 页面与交互接入

- 首次路由 ready 后发送一次 `page_view`，后续只在 route path/name 变化时发送；query/hash 变化不重复计页。
- 搜索选择结果与无结果 Enter 分别记录 `select` / `no_result`。
- 播放按钮与空格快捷键共用一个埋点包装函数，暂停、单步和拖动不计为 `play`。
- 合法输入成功应用后记录 item count；校验失败和恢复默认不记录。
- 本页全部测验首次完成时记录一次汇总成绩；回拖或重复渲染不得重复发送。
- 仅微博和 X 分享按钮记录 `share`；GitHub 与个人主页普通外链不计入分享转化。

### R5 看板与复盘

- 生产看板至少可观察访问量、来源、campaign、落地页及上述自定义事件。
- 48 小时模板记录访问、有效互动用户/事件、来源、落地页、核心事件与异常。
- 7 天模板增加回访代理、渠道对比、内容页对比和继续/调整/停止结论。
- “有效互动”采用可复算代理：发生 `play`、`input_apply`、`quiz_complete` 或 `share` 任一事件；不得包装为学习成效。

### R6 隐私与保留

- 采用无 Cookie、无用户 ID 的默认配置，不展示统计 Cookie 同意横幅；若未来启用 Cookie、广告或识别能力，必须另立 plan 重新评审同意机制。
- 浏览器仅用 sessionStorage 保存白名单渠道字段，关闭会话后自然清除。
- 网络请求会向 Cloud endpoint 暴露源 IP；按 Umami 官方说明，IP、User-Agent 与 website ID 用于派生匿名会话并提供地区统计，不把 IP 作为本项目事件属性或自定义标识。隐私页必须区分网络处理与数据字段，不能声称 IP 从未传输。
- Cloud website 必须保持 session replay、heatmap、performance 与自定义身份识别关闭；未来启用任一能力需另立 plan。
- Umami Cloud 账号优先选择 EU 区域；Hobby 档的实际保留期和删除能力必须在账号内确认并留档。项目目标为不超过 180 天；若 Hobby 档无法执行，需由 Owner 明确接受供应商默认期限或更换方案，不能静默宣称已满足。
- 隐私说明明确列出用途、字段、Umami Cloud 托管区域、已确认的实际保留期、导出/删除与退出方式。

## 验收标准

- [ ] 供应商评审、Cloud Hobby 选择、Cookie/同意结论和账号内实际数据保留策略均有官方依据与当前事实记录。
- [x] UTM/归因、事件客户端和路由接入的 L3/L4 测试先红后绿。
- [x] 搜索、播放、输入、测验、分享至少五类交互在组件测试中验证；不发送自由文本。
- [x] `pnpm verify`、coverage 与全量 Playwright e2e 全绿，production/selfhost 产物不泄漏凭据。
- [ ] 生产环境可观察测试 page view、UTM campaign 与至少三个核心交互事件。
- [x] launch-posts 中所有目标链接可通过同一生成规则得到可归因版本。
- [x] 四文档、plans/test 三索引、roadmap、marketing backlog 与 agent 记忆回写。
- [ ] feat + docs 精确提交、推送，并完成 GitHub Pages/selfhost 双轨部署与线上核验。

## 变更历史

- 2026-07-10：创建并批准。前端保持供应商无关和配置缺失时失败关闭；进入 UTM/归因 TDD。
- 2026-07-10：T1 完成。UTM/campaign link/首触与当前触归因 9 个 L3 用例及 type-check 全绿，进入 client/route TDD。
- 2026-07-10：T2 完成。client 队列/失败关闭/payload 白名单与 route page view 共 9 个用例及 type-check 全绿，进入交互事件 TDD。
- 2026-07-10：T3 六类交互事件定向 84/84 与 type-check 全绿。服务器只读审计否决同机自托管，生产候选改为 Umami Cloud Hobby；账号、EU 区域与实际保留期待 Owner 外部动作确认。
- 2026-07-10：本地交付门禁完成：285 个 Vitest 文件 / 2060 条用例、112 条 Playwright、coverage、production/selfhost 各 95 页与凭据扫描通过；统计仍因 Cloud 外部输入保持禁用。
- 2026-07-10：Owner 撤销第三方分析路线；C129 保留 UTM 并删除其余接入，本需求转 superseded。
