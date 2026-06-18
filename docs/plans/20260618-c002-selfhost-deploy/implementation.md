# 实现记录：部署到自有服务器

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
> Related design: design.md

## 改动清单

**本地（仓库）**

- `vite.config.ts`：改为 `defineConfig(({ mode }) => ...)`，`loadEnv(mode)` 替代 `loadEnv(NODE_ENV)`，支持 `--mode selfhost`。
- `.env.selfhost`（新）：`VITE_BASE_URL=/`。
- `scripts/deploy.sh`（新）：selfhost 构建 → tar → scp → 远程原子切换。

**服务器（47.120.26.143）**

- `/var/www/algorithms/dist`：静态产物（原子切换，旧版在 `dist.old`）。
- `/etc/nginx/conf.d/algo.conf`：SPA server（80 + certbot 注入的 443 + 80→443 重定向）。
- `/etc/letsencrypt/live/algo.illegalscreed.cn/`：Let's Encrypt 证书。

## 实际涉及文件

`vite.config.ts`、`.env.selfhost`、`scripts/deploy.sh`；服务器 `algo.conf` + 证书目录。

## 与设计偏差

无重大偏差。

## 踩坑与处理

| 现象                                  | 根因                                                          | 处理                                                          |
| ------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `--mode selfhost` 不生效              | `vite.config` 原按 `NODE_ENV` 加载 env，build 恒为 production | 改为按 vite `mode` 加载；默认 production/development 行为不变 |
| `pnpm build --mode selfhost` 参数错位 | `build` 脚本经 `run-p ... {@}` 透传，`--mode` 落到 `cp` 后面  | `deploy.sh` 直接 `pnpm exec vite build --mode selfhost`       |
| 新域名无现成证书                      | 服务器证书均非通配符                                          | certbot `--nginx` 单独签发（DNS 已生效）                      |

## 数据处理

不适用（纯静态站）。

## 验证记录

详见 `test-cases.md` V1–V8，全部 ✅：双 base 构建、HTTPS 200、HTTP→HTTPS 301、资源可达、SPA 深链接 fallback、浏览器渲染 0 console error、证书有效期至 2026-09-16。

## 遗留问题

- **certbot 自动续期**：已确认服务器 root crontab 含 `0 2 * * * certbot renew --quiet --post-hook "nginx -s reload"`，algo 证书纳入自动续期，无需额外配置。**遗留项关闭。**
