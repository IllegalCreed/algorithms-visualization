# 设计：部署到自有服务器

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
> Related plans: C-20260618-001
> Related tests: none
> Related requirement: requirements.md

## 1. 双 base 构建（不破坏 GitHub Pages）

`vite.config.ts` 改为函数式 `defineConfig(({ mode }) => ...)`，按 **vite mode** 加载 `.env`（原先按 `NODE_ENV`，默认行为不变）：

| 构建命令                     | mode        | 加载               | base                                         |
| ---------------------------- | ----------- | ------------------ | -------------------------------------------- |
| `pnpm build`                 | production  | `.env.production`  | `/algorithms-visualization/`（GitHub Pages） |
| `vite build --mode selfhost` | selfhost    | `.env.selfhost`    | `/`（自有域名）                              |
| `pnpm dev`                   | development | `.env.development` | `/`                                          |

新增 `.env.selfhost`：`VITE_BASE_URL=/`。

## 2. 部署脚本（`scripts/deploy.sh`）

参考 quiz 的 `deploy_static`：本地 `vite build --mode selfhost` → `tar czf` → `scp` 到 `/tmp` → 远程解压 `dist.new` → 原子切换（`mv dist dist.old; mv dist.new dist`）。

- 服务器：`root@47.120.26.143`
- 远程站点根：`/var/www/algorithms`（nginx root 指向其下 `dist/`）
- 旧版本保留 `dist.old`，可回滚。

## 3. nginx 配置（`/etc/nginx/conf.d/algo.conf`）

参考 `quiz.conf` 前端 block：

```nginx
server {
    server_name algo.illegalscreed.cn;
    root /var/www/algorithms/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }   # SPA fallback
    location ~* ^/assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    gzip on; gzip_types ...;
    listen 80;
}
```

## 4. HTTPS（certbot）

服务器证书均为 Let's Encrypt 单域名/SAN（**非通配符**），故新域名单独签发：

```
certbot --nginx -d algo.illegalscreed.cn --non-interactive --agree-tos --redirect
```

certbot `--nginx` 插件自动：HTTP-01 验证 → 签发 → 在 `algo.conf` 注入 443 SSL block → 加 80→443 重定向 → reload。**前置依赖**：DNS 已解析到服务器。

## 5. 风险与回滚

- 仅新增 `algo.conf` 一个 server block，`nginx -t` 通过后 reload，不影响既有站点。
- 静态部署原子切换，失败可 `mv dist.old dist` 回滚。
- 证书 90 天有效，依赖 certbot 自动续期（收尾确认）。
