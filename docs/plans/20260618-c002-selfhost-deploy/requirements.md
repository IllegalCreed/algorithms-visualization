# 需求：部署到自有服务器（algo.illegalscreed.cn）

> Status: verified
> Stable ID: C-20260618-002
> Type: ops
> Owner: IllegalCreed
> Created: 2026-06-18
> Last reviewed: 2026-06-18
> Progress: 100%
> Blocked by: none
> Next action: 确认 certbot 自动续期
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-001（提供 pnpm/vite 构建链）
> Related tests: none

## 背景

项目此前仅通过 GitHub Pages 部署在 `/algorithms-visualization/` 子路径。需要在自有服务器（`47.120.26.143`，主域名 `illegalscreed.cn`）上用独立二级域名上线，便于访问与后续迭代。部署模式参考同服务器上的 `quiz` 项目（`/Users/zhangxu/illegal/quiz-monorepo/scripts/deploy.sh`）。

## 要做什么

1. **二级域名**：`algo.illegalscreed.cn`（DNS A 记录由用户在阿里云配置 → `47.120.26.143`）。
2. **双 base 构建**：新增 `selfhost` 模式用 `base=/`（自有域名根路径），保留 `production` 的 `/algorithms-visualization/`（GitHub Pages）。
3. **部署脚本**：`scripts/deploy.sh`，本地构建 → tar → scp → 远程原子切换（参考 quiz）。
4. **nginx 配置**：`/etc/nginx/conf.d/algo.conf`，静态 SPA（`try_files` fallback）+ 资源缓存 + gzip。
5. **HTTPS**：Let's Encrypt 证书（certbot），HTTP→HTTPS 重定向。

## 不做什么（边界）

- **不动 GitHub Pages**：`.env.production` 与 `deploy.yml` 保持不变，Pages 子路径继续可用。
- **不改 UI / 功能 / 动画**。
- **不配置 DNS**：A 记录由用户在阿里云操作。
- **不引入后端**：纯静态站。

## 业务规则 / 约束

- `selfhost` 构建资源路径必须是 `/assets/...`（根路径），`production` 仍是 `/algorithms-visualization/assets/...`。
- 证书非通配符，新域名需 certbot 单独签发，依赖 DNS 先解析到服务器。
- 部署原子切换，旧版本保留为远程 `dist.old`。

## 验收口径

- [x] `https://algo.illegalscreed.cn` 返回 200，页面与冒泡动画正常、0 console error。
- [x] `http://` 自动 301 跳 `https://`。
- [x] 深链接（如 `/docs/bubble-sort`）直接访问不 404（nginx SPA fallback）。
- [x] JS/CSS 资源 200 可达（base=/ 正确）。
- [x] `production` 构建仍为 GitHub Pages 子路径（未破坏）。

## 开放问题

- certbot 自动续期是否已启用（systemd timer / cron）—— 收尾确认。

## 变更历史

- 2026-06-18：创建并完成。域名 `algo.illegalscreed.cn`、保留 GitHub Pages（用户决策）。
