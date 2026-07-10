# 项目路线图

> Status: active
> Last reviewed: 2026-07-09
> Owner: IllegalCreed

## 当前阶段

项目已完成 M0-M12 主线，处于 **1.0 封版后的营销执行与维护期**。

当前目标不是继续铺新算法页，而是保持现有 1.0 体验稳定、支持发布传播、处理低风险维护项，并在确有必要时通过新 plan 小步进入功能迭代。

事实优先级保持不变：当前源码与本地测试结果 > 最新 plan / `docs/plans/completion-backlog.md` > `AGENTS.md` / `CLAUDE.md` > `docs/overview.md` > 本路线图。

## 当前事实

| 项目     | 当前事实                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 产品范围 | 纯前端算法可视化 SPA，Vue 3 + TypeScript + Vite + Pinia + Less，部署到 GitHub Pages 与自有域名                                                 |
| 内容规模 | 首页/菜单九大类、92 个条目；`src/algorithms` 下 77 个 `*.module.ts`；数据结构互动页、算法播放器页和功能页并存                                  |
| 主力架构 | `AlgorithmPlayer` + `src/algorithms/<name>.{ts,module.ts,sources.ts}`，可插拔轨负责数组、图、矩阵、树、迷宫、字符串、数论、几何等可视化        |
| 文档状态 | `docs/` 分层文档体系已建立；M9-M12 完结清单已收束；本文件只记录维护期方向，历史计划明细看 `docs/plans/index.md`                                |
| 测试基线 | 2026-07-10 本地现状：278 个 Vitest 文件 / 2023 条 L3/L4 用例通过；`pnpm coverage` 与 107 条 Playwright e2e 通过                                |
| 部署基线 | 双轨部署：GitHub Pages 自动部署 `/algorithms-visualization/`，自有域名 `https://algo.illegalscreed.cn` 由 `./scripts/deploy.sh` 手动自托管发布 |

## 维护队列

| 优先级 | 方向                 | 状态    | 下一步                                                                                                                    |
| ------ | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| P0     | 保持门禁与线上可用   | ongoing | C-122 已提供 `pnpm verify` 本地复现 Pages build job；发版必须完成 GitHub Pages 与自有域名双轨验证                         |
| P1     | 营销执行             | ready   | Owner 按 `docs/marketing/launch-posts.md` 发布掘金、V2EX、B 站脚本；技术侧只在发布反馈形成明确缺陷或小改需求时介入        |
| P1     | 低风险维护修复       | ongoing | 优先处理不改变算法语义的小问题：可访问性、导航语义、搜索召回、文档事实、测试防回归                                        |
| P2     | CI / 测试自动化增强  | partial | C-121 已把 Vitest 单元/组件测试与项目范围格式检查纳入 Pages build job；Playwright e2e 与 coverage 仍保留为本地/发版前门禁 |
| P2     | 目录数据源收束       | idea    | Home/Menu/Router 已有一致性测试；若后续继续扩容，可考虑抽单一 catalog，避免三处重复维护                                   |
| P2     | 性能与无障碍继续打磨 | idea    | 可继续跟踪 Lighthouse、键盘导航、色彩对比、Shiki chunk 体感；不把新拟物色彩取舍误判为必须立即改动                         |
| P3     | 新算法或新交互       | parked  | 1.0 封版后不主动铺新页；除非营销反馈、用户需求或 completion backlog 重新评审出明确价值，再按四文档 + TDD 流程推进         |

## 近期决策记录

| 日期       | 记录                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-07-09 | C-20260709-120：路线图从 2026-06-29 的历史长表刷新为维护期工作台，避免把 C-034 等旧状态继续当作当前待办                              |
| 2026-07-09 | C-20260709-121：Pages build job 增加 `pnpm test:unit:run`，`format:check` 从 src-only 扩展到项目文档、e2e、public、workflow 与根配置 |
| 2026-07-09 | C-20260709-122：新增 `pnpm verify` 本地一键门禁，串起格式、lint、类型、全量 Vitest 与 build-only                                     |
| 2026-07-09 | C-20260709-119：完成维护期搜索召回、基础可访问性、导航语义与 slug/router 对齐测试；全量门禁、coverage、e2e 已通过                    |
| 2026-07-05 | C-20260705-118：M12 营销启动包完成，OG 分享卡与发布物料落档；M9-M12 全部收束，项目进入 1.0 封版后的营销执行与维护期                  |
| 2026-07-05 | C-20260705-117 / C-118 已纠偏 C-034：robots/sitemap/llms 已补齐，prerender、routing meta、JSON-LD 不作为已实现事实写入当前路线图     |

## 线上地址

- 自有域名：https://algo.illegalscreed.cn （用户主用，自托管手动部署）
- GitHub Pages：`/algorithms-visualization/` 子路径（push 到 `main` 后 workflow 部署）

## 入口

| 文档                               | 用途                                           |
| ---------------------------------- | ---------------------------------------------- |
| `AGENTS.md`                        | Codex 项目记忆入口，含命令、架构、部署与工作流 |
| `CLAUDE.md`                        | Claude 侧项目记忆入口                          |
| `docs/overview.md`                 | 项目当前事实概览                               |
| `docs/documentation-adapter.md`    | 通用文档/测试规范在本纯前端项目中的适配说明    |
| `docs/plans/index.md`              | 所有变更计划历史索引                           |
| `docs/plans/completion-backlog.md` | M9-M12 完结清单与封版结论                      |
| `docs/test-cases/index.md`         | 全局测试用例索引                               |
| `docs/marketing/launch-posts.md`   | 1.0 发布传播文案与 Owner 行动清单              |

## 维护规则

- 本文件只写当前阶段、维护方向、风险和入口；具体需求、设计、实现、测试继续放各 plan 四文档。
- 历史计划不再复制进本文件；需要查完成度、替代关系和自测报告时看 `docs/plans/index.md` 与对应 plan 目录。
- 遇到文档事实冲突时，小步修正文档；不把过期描述继续当真。
- 未经 Owner 明确要求，不 commit、push、部署；不要 `git add -A`，只暂存本次明确相关文件。
