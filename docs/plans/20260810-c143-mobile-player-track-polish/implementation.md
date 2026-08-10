# 实现记录：移动端播放器、数组画布与 CSP 控制台噪声

> Status: verified
> Stable ID: C-20260810-143
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察真实 Safari/触控外观（非阻塞）；严格 CSP 另立项
> Replaces: none
> Replaced by: none
> Related plans: C-20260810-140, C-20260810-142
> Related tests: TC-PLAYER-143-01, TC-VIZ-143-02, TC-OPS-143-03
> Related design: design.md

## 改动清单

- 播放器速度框由固定 96px 改为两列区域内最大 120px；计数区域同步最大 120px，两者居中且左右重心对称。
- 计数启用 tabular numerals，速度选择文字改为居中且保留原生 select、ARIA 名称和 44px 高度。
- 数组手机画布从固定 448px 改为 `max-content + min-width:100%`，初始完整显示、满载才横滚。
- Nginx 管理片段移除无上报端点的静态 CSP Report-Only，保留五项强制安全头。
- 新增两条 L5 几何回归，并更新 C140 既有数组断言以接受新的“短内容不滚动”口径。

## 实际涉及文件

- `src/components/player/TransportControls.vue`
- `src/components/structures/ArrayViz.vue`
- `e2e/responsive.mobile.e2e.ts`
- `scripts/nginx/algo-security-headers.conf`
- `docs/plans/20260810-c143-mobile-player-track-polish/*`
- `docs/plans/index.md`
- `docs/test-cases/{index,by-layer,by-module}.md`
- `docs/roadmap.md`

## 与设计偏差

暂无。最终门禁、提交、部署和线上证据待本轮完成后回填。

## 踩坑与处理

- 390px 基线速度框为 96px、计数区域约 128.8px，新增对齐用例先红（宽差 32.8125px）；修复后四种视口全绿。
- 320px 基线数组 wrapper 为 248px、内部 lane 固定 448px，新增自适应用例先红；修复后初始 lane 为 248px，满载按内容增长并可滚到末格。
- 既有 C140 测试曾把“初始数组必须横滚”当作固定画布验收；C143 改变了该体验口径，因此保留用例并更新为“短内容完整、满载横滚”，没有删除历史 Case。
- 控制台 CSP 文本明确标为 Report-Only；Chrome Built-in AI 提示来自浏览器内容脚本，不是应用 bundle。

## 数据处理 / 部署

无数据迁移。前端仍走 Pages + 自有域双轨；自有域额外替换 Nginx snippet、`nginx -t` 后 reload。部署前创建远端配置备份，任何语法或线上 header 异常都可原位恢复。

## 验证记录

已完成：

- `TC-PLAYER-143-01` 基线红灯：速度/计数宽差 32.8125px；修复后 targeted 1/1 通过。
- `TC-VIZ-143-02` 基线红灯：320px wrapper 248px、lane 448px；修复后 targeted 1/1 通过。

全量验证与发布已完成：`pnpm verify`（304/2178、190 页）、`pnpm coverage`（93.25/84.89/90.31/93.69）、全量 Playwright（136/136；桌面 125、移动 11）、`pnpm audit --prod`（0 已知漏洞）和 selfhost 190 页构建均通过。自有域与 Pages 首页、`/docs/array/` 均返回 200；Nginx 备份 `/root/algo-nginx-c143-20260810142215`，`nginx -t`/reload 成功，root 与 assets 均保留五项强制安全头且不再返回 CSP Report-Only。两个域的真实 Chromium 线上复核确认播放器两组均 120px、inset 差 0.02px，数组初始 318px/318px、满载可滚到末格，页面无横溢出。代码提交 `1a6fb1b`，Pages workflow `31361592140`、deployment `5827309207` 均 success。

## 遗留问题

严格 CSP 需逐响应 nonce，明确留作独立安全能力；不阻塞本次移除无效 Report-Only 噪声。
