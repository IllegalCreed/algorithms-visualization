# 项目路线图

> Status: active
> Last reviewed: 2026-07-11
> Owner: IllegalCreed

## 当前阶段

项目已完成 M0-M12 主线，处于 **1.0 封版后的增长执行与维护期**。C124 SEO/GEO、C126 `/en` 试点、C130 英文 30 页扩容和 C131 英文全量对齐均已完成双轨发布，C125 第三方分析尝试已由 C129 撤销。当前工程主线为 C127 宣传自动化 T3。

当前不继续铺中文算法页或第三语言。中英文已各有 95 个索引页，共 190 个静态入口；C127 T3-C 已完成 Owner 授权的 GitHub Release create/read/delete/tag-cleanup 真实 smoke 并达到 76%，下一步按微博 Free、Bluesky、DEV、Mastodon 推进 T3-D，第三方统计继续暂缓。

事实优先级保持不变：当前源码与本地测试结果 > 最新 plan / `docs/plans/completion-backlog.md` > `AGENTS.md` / `CLAUDE.md` > `docs/overview.md` > 本路线图。

## 当前事实

| 项目     | 当前事实                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 产品范围 | 纯前端算法可视化 SPA，Vue 3 + TypeScript + Vite + Pinia + Less，部署到 GitHub Pages 与自有域名                                                 |
| 内容规模 | 首页九大类、92 个学习条目；中英文 Docs 侧栏十组、94 个入口；`src/algorithms` 下 77 个 `*.module.ts`；互动页、播放器页和功能页并存              |
| 主力架构 | `AlgorithmPlayer` + `src/algorithms/<name>.{ts,module.ts,sources.ts}`，可插拔轨负责数组、图、矩阵、树、迷宫、字符串、数论、几何等可视化        |
| 文档状态 | `docs/` 分层文档体系已建立；M9-M12 完结清单已收束；本文件只记录维护期方向，历史计划明细看 `docs/plans/index.md`                                |
| 测试基线 | 2026-07-11 本地现状：299 个 Vitest 文件 / 2131 条 L3/L4 用例通过；`pnpm coverage` 与 104 文件 / 118 条 Playwright e2e 通过                     |
| 部署基线 | 双轨部署：GitHub Pages 自动部署 `/algorithms-visualization/`，自有域名 `https://algo.illegalscreed.cn` 由 `./scripts/deploy.sh` 手动自托管发布 |
| 增长基线 | 95 中文 + 95 英文及 95 组 hreflang 已双轨上线；C127 GitHub adapter ready/enabled，真实 smoke 已读取并清理 Release、receipt 与 owned tag        |

## 维护队列

| 优先级 | 方向                 | 状态     | 下一步                                                                                                                     |
| ------ | -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| P0     | 保持门禁与线上可用   | ongoing  | C-122 已提供 `pnpm verify` 本地复现 Pages build job；发版必须完成 GitHub Pages 与自有域名双轨验证                          |
| P0     | SEO/GEO 技术地基     | verified | C131 已将 route head、JSON-LD、95 组 hreflang、预渲染和双 base 产物门禁扩到 190 页并完成双轨抽查                           |
| P1     | 多语言内容扩容       | verified | C131 已补齐 15 个互动页和 50 个播放器页，完成 95 组页面对、77 adapter 与 190 页双轨产物                                    |
| P1     | 低风险维护修复       | ongoing  | 优先处理不改变算法语义的小问题：可访问性、导航语义、搜索召回、文档事实、测试防回归                                         |
| P1     | 宣传自动化           | ongoing  | C127 T3-C 真实 smoke 完成并达到 76%；下一步 T3-D，先做微博 Free typed adapter 与无写 contract，再推进 Bluesky/DEV/Mastodon |
| P2     | CI / 测试自动化增强  | partial  | C-121 已把 Vitest 单元/组件测试与项目范围格式检查纳入 Pages build job；Playwright e2e 与 coverage 仍保留为本地/发版前门禁  |
| P2     | 免费索引与需求信号   | pending  | 190 页 sitemap 已稳定，可按 C124 清单提交 Search Console/Bing Webmaster Tools；不引入 tracker                              |
| P2     | 性能与无障碍继续打磨 | idea     | 可跟踪 Lighthouse、键盘、色彩与 Shiki；当前全站显式最小宽度 600px，若支持 390px 需独立响应式计划，不混入 C131              |
| P3     | 新算法或新交互       | parked   | 1.0 封版后不主动铺新页；除非营销反馈、用户需求或 completion backlog 重新评审出明确价值，再按四文档 + TDD 流程推进          |

## 近期决策记录

| 日期       | 记录                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-11 | C127 T3-C 授权 smoke：Release `352517542` 完成 create/read/report/delete；receipt deleted，Release/tag 双侧复查不存在，GitHub 保持 enabled  |
| 2026-07-11 | C132 补齐中文 Docs 侧栏“学习工具”两项；首页仍为 9 类/92 项，双语侧栏为 10 组/94 项；2131 Vitest、118 L5、190 页构建与 720/900/1440 视觉全绿 |
| 2026-07-11 | C127 T3-C：plugin `60feaff`；GitHub collector、MCP 查询撤回与 Release/tag 清理完成；目标均不存在、零写入                                    |
| 2026-07-11 | C127 T3-B：plugin `98a9dfc`；固定 GitHub CLI、只读健康、0600 activation 与惰性 runtime 完成；health ready 但 adapter disabled、零写入       |
| 2026-07-11 | C127 T3-A：main `98f8deb` / plugin `ba6d4c3`；MCP v2、GitHub typed fake 与 dispatch 完成；仍无 live client/真实写入                         |
| 2026-07-11 | C-20260711-127：T2 完成七工具 contract 与本地 `marketing-ops` personal plugin 安全骨架；20 Case、coverage、stdio smoke 和 validator 通过    |
| 2026-07-11 | C-20260711-131：功能提交 `592d27d`、Pages run `29145907250` 与 selfhost 双轨上线；95 中文 + 95 英文、190 URL、297/2118 Vitest、117 L5 全绿  |
| 2026-07-11 | Owner 决定在 C127 前完成全部英文翻译；建立 C131，目标 15 个互动页 + 50 个播放器页、95 组页面对与 190 个静态入口                             |
| 2026-07-11 | 提交 `8d07b8b` 按 Owner 宽屏截图反馈将 Header 搜索入口前移到标题后；新增 DOM 顺序回归，1600px/900px 无重叠，功能与快捷键不变                |
| 2026-07-11 | C-20260711-127：T1 提交 `41324d9` 完成 schema/15 渠道 gate/幂等/事实/renderer/dry-run；291/2092 Vitest、coverage、115 L5 与 verify 全绿     |
| 2026-07-11 | C-20260711-130：功能提交 `5dca6c4`、Pages run `29136875578` 与 selfhost 双轨上线/125 URL 抽查通过；状态转 verified，下一阶段 C127 T1        |
| 2026-07-11 | C-20260711-130：typed catalog、29 个内容路由、27 个 adapter、30 页英文目录与 125 页双 base 产物完成；286/2073 Vitest、104/115 L5 全绿       |
| 2026-07-11 | C-20260711-130：审计十页英文试点的六个硬编码同步点，提出 typed locale catalog + 二十算法页、总计 125 页的 draft                             |
| 2026-07-11 | Owner 批准 C130；状态转 implementing，按 10/105 无行为迁移后四批扩容进入 TDD                                                                |
| 2026-07-11 | C127 独立 `marketing-ops` MCP/RPA 隔离设计批准并后置；凭据/Profile 服务侧持有，Codex 只调用高层工具                                         |
| 2026-07-11 | C127 Owner 约束：零新增费用、无企业主体；首期五个免费个人渠道，Reddit 后备，微信/B站/X 禁用                                                 |
| 2026-07-11 | C-20260711-127：完成 15 渠道官方能力审计；提示词作为 campaign 授权，首批自动渠道为 GitHub、微博、Bluesky、DEV、Mastodon，代码尚未实现       |
| 2026-07-11 | C-20260711-126：`/en` 十页试点、105 页 registry/预渲染、双向 hreflang 与英文共享 UI 完成；284/2055 Vitest、104/114 L5、双轨上线均通过       |
| 2026-07-10 | C-20260710-123：完成增长资产全面审计，C-034 标记 deprecated；建立 C124-C128 顺序、退出条件、Owner 输入和自动发布红线                        |
| 2026-07-10 | C-20260710-124：正式接管 C-034，选择现有 catalog 驱动 route head、Playwright post-build prerender 与 JSDOM 产物门禁，进入 TDD               |
| 2026-07-10 | C-20260710-124：本地实现与门禁完成；审计修正无尾斜杠 canonical 命中首页 fallback 的问题，改为尾斜杠静态入口并增加 95 URL HTTP 验证          |
| 2026-07-10 | C-20260710-124：功能提交 `c98dcaa`，Pages run `29065426100` 与 selfhost 双轨上线核验通过，状态转 verified；下一阶段 C125                    |
| 2026-07-10 | C-20260710-125：四文档建立并进入 TDD；选择 provider-neutral 前端事件层，先评审 Umami 自托管，并在远端变更前做只读资源/隔离审计              |
| 2026-07-10 | C-20260710-125：T1-T3 定向全绿；服务器仅 1.8 GiB RAM 且已有多服务，否决同机 Umami/PostgreSQL，生产候选转 Umami Cloud Hobby                  |
| 2026-07-10 | C-20260710-129：Owner 决定收入/流量验证前不承担第三方分析成本；撤销 C125 tracker、事件、隐私页和 analytics L5，仅保留 UTM 生成能力          |
| 2026-07-09 | C-20260709-120：路线图从 2026-06-29 的历史长表刷新为维护期工作台，避免把 C-034 等旧状态继续当作当前待办                                     |
| 2026-07-09 | C-20260709-121：Pages build job 增加 `pnpm test:unit:run`，`format:check` 从 src-only 扩展到项目文档、e2e、public、workflow 与根配置        |
| 2026-07-09 | C-20260709-122：新增 `pnpm verify` 本地一键门禁，串起格式、lint、类型、全量 Vitest 与 build-only                                            |
| 2026-07-09 | C-20260709-119：完成维护期搜索召回、基础可访问性、导航语义与 slug/router 对齐测试；全量门禁、coverage、e2e 已通过                           |
| 2026-07-05 | C-20260705-118：M12 营销启动包完成，OG 分享卡与发布物料落档；M9-M12 全部收束，项目进入 1.0 封版后的营销执行与维护期                         |
| 2026-07-05 | C-20260705-117 / C-118 已纠偏 C-034：robots/sitemap/llms 已补齐，prerender、routing meta、JSON-LD 当时未实现；C124 后 C034 已 superseded    |

## 线上地址

- 自有域名：https://algo.illegalscreed.cn （用户主用，自托管手动部署）
- GitHub Pages：`/algorithms-visualization/` 子路径（push 到 `main` 后 workflow 部署）

## 入口

| 文档                                  | 用途                                           |
| ------------------------------------- | ---------------------------------------------- |
| `AGENTS.md`                           | Codex 项目记忆入口，含命令、架构、部署与工作流 |
| `CLAUDE.md`                           | Claude 侧项目记忆入口                          |
| `docs/overview.md`                    | 项目当前事实概览                               |
| `docs/documentation-adapter.md`       | 通用文档/测试规范在本纯前端项目中的适配说明    |
| `docs/plans/index.md`                 | 所有变更计划历史索引                           |
| `docs/plans/completion-backlog.md`    | M9-M12 完结清单与封版结论                      |
| `docs/test-cases/index.md`            | 全局测试用例索引                               |
| `docs/marketing/roadmap.md`           | 增长策略、渠道与指标原则                       |
| `docs/marketing/execution-backlog.md` | 当前增长状态、C124-C128 顺序与退出条件         |
| `docs/marketing/launch-posts.md`      | 1.0 发布传播文案与素材草稿                     |

## 维护规则

- 本文件只写当前阶段、维护方向、风险和入口；具体需求、设计、实现、测试继续放各 plan 四文档。
- 历史计划不再复制进本文件；需要查完成度、替代关系和自测报告时看 `docs/plans/index.md` 与对应 plan 目录。
- 遇到文档事实冲突时，小步修正文档；不把过期描述继续当真。
- 未经 Owner 明确要求，不 commit、push、部署；不要 `git add -A`，只暂存本次明确相关文件。
