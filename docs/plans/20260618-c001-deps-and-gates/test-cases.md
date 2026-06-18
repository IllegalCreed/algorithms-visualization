# 测试用例：工具链现代化

> Status: implemented
> Stable ID: C-20260618-001
> Type: ops
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 90%
> Blocked by: none
> Next action: 首次提交时验证 pre-commit（V6）
> Replaces: none
> Replaced by: none
> Related plans: none
> Related tests: none
> Related requirement: requirements.md

## 说明

本变更为工具链/基建（`ops`），不产出业务自动化测试用例，因此**不向 `docs/test-cases/` 全局索引登记 Case ID**。
验证以工具链级冒烟为主。L3/L4/L5 业务测试缺位，归里程碑 M1。

## 验证清单（手工 / 命令）

| 编号 | 验证项     | 命令 / 操作                      | 期望                          | 结果                                         |
| ---- | ---------- | -------------------------------- | ----------------------------- | -------------------------------------------- |
| V1   | 依赖安装   | `pnpm install --frozen-lockfile` | 干净通过，仅 `pnpm-lock.yaml` | ✅ 通过（prepare 跑 husky）                  |
| V2   | 类型检查   | `pnpm type-check`                | 通过，无类型错误              | ✅ 通过                                      |
| V3   | 构建       | `pnpm build-only`                | 通过，产物输出 `dist/`        | ✅ vite 8，built in ~270ms                   |
| V4   | Lint       | `pnpm lint:check`                | 无错误                        | ✅ 0 错误                                    |
| V5   | 格式检查   | `pnpm format:check`              | 通过                          | ✅ All matched files use Prettier code style |
| V6   | pre-commit | 提交时触发 lint-staged           | 自动 lint+format 暂存文件     | ⏳ husky+lint-staged 已配置，首次提交生效    |
| V7   | 首页冒烟   | dev server 打开首页              | 渲染正常、可导航              | ✅ Header/Splash 正常，0 console error       |
| V8   | 动画冒烟   | 访问 `/docs/bubble-sort`         | 冒泡动画正常播放              | ✅ 方块+双指针+表达式正常，动画运行          |
| V9   | 菜单冒烟   | docs 侧边菜单                    | 路由切换与渲染正常            | ✅ 菜单渲染、路由到 bubble-sort 正常         |

## 备注

- V1–V5 即 CI 门禁链路，已按 `.github/workflows/deploy.yml` 顺序在本地完整验证通过。
- V7–V9 运行时冒烟用 Vite dev server（端口 5174）+ Playwright，两页均 0 console error。
- 运行时冒烟覆盖了 pinia 3（配色驱动指针）、vue-router 5（菜单/路由）、Vue TransitionGroup（交换动画）等大版本升级的运行时行为。
