# 测试用例：部署到自有服务器

> Status: verified
> Stable ID: C-20260618-002
> Type: ops
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: none
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-001
> Related tests: none
> Related requirement: requirements.md

## 说明

部署/基建（`ops`）变更，不产出业务自动化用例，**不登记全局 `docs/test-cases/`**。以下为上线验证清单，均已实测。

## 验证清单

| 编号 | 验证项              | 方法                                         | 期望                                        | 结果 |
| ---- | ------------------- | -------------------------------------------- | ------------------------------------------- | ---- |
| V1   | selfhost base       | `vite build --mode selfhost` 后查 index.html | 资源 `/assets/...`                          | ✅   |
| V2   | GitHub Pages 未破坏 | `pnpm build` 后查 index.html                 | 资源 `/algorithms-visualization/assets/...` | ✅   |
| V3   | HTTPS 首页          | `curl -sI https://algo.illegalscreed.cn`     | HTTP/2 200                                  | ✅   |
| V4   | HTTP 重定向         | `curl -sI http://algo.illegalscreed.cn`      | 301 → https                                 | ✅   |
| V5   | 资源可达            | `curl -sI https://algo.../assets/*.js`       | 200                                         | ✅   |
| V6   | SPA 深链接 fallback | 直接访问 `/docs/bubble-sort`                 | 不 404，正常渲染                            | ✅   |
| V7   | 运行时渲染          | Playwright 截图 + console                    | 动画正常、0 console error                   | ✅   |
| V8   | 证书                | certbot 输出                                 | 签发成功，有效期至 2026-09-16               | ✅   |

## 备注

- 部署模式（tar→scp→原子切换）与 nginx SPA 配置参考同服务器 quiz 项目。
- 线上跑的是 `selfhost` 构建（base=/），代码来自 C-20260618-001 工具链分支。
