# 项目路线图

> Status: active
> Last reviewed: 2026-07-10
> Owner: IllegalCreed

## 当前阶段

项目已完成 M0-M12 主线，处于 **1.0 封版后的增长执行与维护期**。C-20260710-124 SEO/GEO 技术地基已完成双轨发布，C125 第三方分析尝试已由 C129 撤销；当前下一阶段为 C126 `/en` 多语言十页试点。

当前目标不是继续铺新算法页，而是保持现有 1.0 体验稳定，并按 `docs/marketing/execution-backlog.md` 推进 C126 `/en` 十页试点、C127 内容与半自动分发、C128 发布与复盘。第三方统计暂缓，出现稳定流量后再单独立项评审零成本或可负担方案。

事实优先级保持不变：当前源码与本地测试结果 > 最新 plan / `docs/plans/completion-backlog.md` > `AGENTS.md` / `CLAUDE.md` > `docs/overview.md` > 本路线图。

## 当前事实

| 项目     | 当前事实                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 产品范围 | 纯前端算法可视化 SPA，Vue 3 + TypeScript + Vite + Pinia + Less，部署到 GitHub Pages 与自有域名                                                 |
| 内容规模 | 首页/菜单九大类、92 个条目；`src/algorithms` 下 77 个 `*.module.ts`；数据结构互动页、算法播放器页和功能页并存                                  |
| 主力架构 | `AlgorithmPlayer` + `src/algorithms/<name>.{ts,module.ts,sources.ts}`，可插拔轨负责数组、图、矩阵、树、迷宫、字符串、数论、几何等可视化        |
| 文档状态 | `docs/` 分层文档体系已建立；M9-M12 完结清单已收束；本文件只记录维护期方向，历史计划明细看 `docs/plans/index.md`                                |
| 测试基线 | 2026-07-10 本地现状：282 个 Vitest 文件 / 2041 条 L3/L4 用例通过；`pnpm coverage` 与 110 条 Playwright e2e 通过                                |
| 部署基线 | 双轨部署：GitHub Pages 自动部署 `/algorithms-visualization/`，自有域名 `https://algo.illegalscreed.cn` 由 `./scripts/deploy.sh` 手动自托管发布 |
| 增长基线 | C124 已落地 95 页 SEO/GEO 地基；C129 已撤销第三方 tracker、归因和事件，只保留 UTM 工具；站点多语言和分发自动化尚未实现                         |

## 维护队列

| 优先级 | 方向                 | 状态     | 下一步                                                                                                                    |
| ------ | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| P0     | 保持门禁与线上可用   | ongoing  | C-122 已提供 `pnpm verify` 本地复现 Pages build job；发版必须完成 GitHub Pages 与自有域名双轨验证                         |
| P0     | SEO/GEO 技术地基     | verified | C124 已完成：95 页 route head + JSON-LD + 构建后预渲染 + 双 base/HTTP 产物门禁与双轨上线核验                              |
| P1     | 增长执行             | planned  | C129 已完成零成本回滚；下一步建立 C126 四文档并推进 `/en` 十页试点，不再等待第三方分析账号                                |
| P1     | 低风险维护修复       | ongoing  | 优先处理不改变算法语义的小问题：可访问性、导航语义、搜索召回、文档事实、测试防回归                                        |
| P2     | CI / 测试自动化增强  | partial  | C-121 已把 Vitest 单元/组件测试与项目范围格式检查纳入 Pages build job；Playwright e2e 与 coverage 仍保留为本地/发版前门禁 |
| P2     | 目录数据源收束       | idea     | Home/Menu/Router 已有一致性测试；若后续继续扩容，可考虑抽单一 catalog，避免三处重复维护                                   |
| P2     | 性能与无障碍继续打磨 | idea     | 可继续跟踪 Lighthouse、键盘导航、色彩对比、Shiki chunk 体感；不把新拟物色彩取舍误判为必须立即改动                         |
| P3     | 新算法或新交互       | parked   | 1.0 封版后不主动铺新页；除非营销反馈、用户需求或 completion backlog 重新评审出明确价值，再按四文档 + TDD 流程推进         |

## 近期决策记录

| 日期       | 记录                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-10 | C-20260710-123：完成增长资产全面审计，C-034 标记 deprecated；建立 C124-C128 顺序、退出条件、Owner 输入和自动发布红线                     |
| 2026-07-10 | C-20260710-124：正式接管 C-034，选择现有 catalog 驱动 route head、Playwright post-build prerender 与 JSDOM 产物门禁，进入 TDD            |
| 2026-07-10 | C-20260710-124：本地实现与门禁完成；审计修正无尾斜杠 canonical 命中首页 fallback 的问题，改为尾斜杠静态入口并增加 95 URL HTTP 验证       |
| 2026-07-10 | C-20260710-124：功能提交 `c98dcaa`，Pages run `29065426100` 与 selfhost 双轨上线核验通过，状态转 verified；下一阶段 C125                 |
| 2026-07-10 | C-20260710-125：四文档建立并进入 TDD；选择 provider-neutral 前端事件层，先评审 Umami 自托管，并在远端变更前做只读资源/隔离审计           |
| 2026-07-10 | C-20260710-125：T1-T3 定向全绿；服务器仅 1.8 GiB RAM 且已有多服务，否决同机 Umami/PostgreSQL，生产候选转 Umami Cloud Hobby               |
| 2026-07-10 | C-20260710-129：Owner 决定收入/流量验证前不承担第三方分析成本；撤销 C125 tracker、事件、隐私页和 analytics L5，仅保留 UTM 生成能力       |
| 2026-07-09 | C-20260709-120：路线图从 2026-06-29 的历史长表刷新为维护期工作台，避免把 C-034 等旧状态继续当作当前待办                                  |
| 2026-07-09 | C-20260709-121：Pages build job 增加 `pnpm test:unit:run`，`format:check` 从 src-only 扩展到项目文档、e2e、public、workflow 与根配置     |
| 2026-07-09 | C-20260709-122：新增 `pnpm verify` 本地一键门禁，串起格式、lint、类型、全量 Vitest 与 build-only                                         |
| 2026-07-09 | C-20260709-119：完成维护期搜索召回、基础可访问性、导航语义与 slug/router 对齐测试；全量门禁、coverage、e2e 已通过                        |
| 2026-07-05 | C-20260705-118：M12 营销启动包完成，OG 分享卡与发布物料落档；M9-M12 全部收束，项目进入 1.0 封版后的营销执行与维护期                      |
| 2026-07-05 | C-20260705-117 / C-118 已纠偏 C-034：robots/sitemap/llms 已补齐，prerender、routing meta、JSON-LD 当时未实现；C124 后 C034 已 superseded |

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
