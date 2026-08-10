# 设计：移动端播放器次级网格、数组自适应画布与 CSP 收口

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
> Related requirement: requirements.md

## 总体方案

保留 C142 的五列主控制网格，把第二行明确设计成两个对称的“两按钮宽”控制组：速度框在第 1-2 列居中，计数在第 4-5 列居中，两者 `width:100%`、`max-width:120px`。数组画布只在手机断点改为 `width:max-content; min-width:100%`，使短内容至少铺满 wrapper、长内容按实际宽度增长。运维侧删除不能产生有效遥测的 CSP Report-Only 行，不改变其余强制安全头。

## 涉及模块与文件

| 模块         | 文件                                          | 处理                                     |
| ------------ | --------------------------------------------- | ---------------------------------------- |
| 播放器       | `src/components/player/TransportControls.vue` | 对称次级控制组、居中文案、等宽数字       |
| 数组互动     | `src/components/structures/ArrayViz.vue`      | 手机画布按内容增长，桌面固定画布不变     |
| L5 回归      | `e2e/responsive.mobile.e2e.ts`                | 新增播放器对齐和数组溢出两条几何用例     |
| 自托管安全头 | `scripts/nginx/algo-security-headers.conf`    | 移除静态 CSP Report-Only，保留五项强制头 |
| 分层文档     | C143 四文档及全局索引                         | 记录行为变化、测试和部署证据             |

## 前端布局设计

### 播放器

- 第一行仍为五个等距 44px 圆形按钮。
- 第二行速度框/计数各绑定一个两列 grid 区域，但自身最大 120px，避免宽屏横向布局被无意义拉长。
- 两组均 `justify-self:center`、`text-align:center`；计数使用 `font-variant-numeric:tabular-nums`，步数变化不造成字宽抖动。
- 第三行 range 继续占满五列，保留 44px 可触控高度。

### 数组画布

- 桌面继续使用 448px 稳定画布。
- 手机 `.lane` 使用 `width:max-content` 获取真实 4-8 格内容宽度，同时以 `min-width:100%` 保证短内容完整填充 wrapper。
- `.lane-wrap` 继续负责 `overflow-x:auto`，只有内容宽于 wrapper 时出现局部滚动；不允许页面级横滚。
- 树/图/堆等绝对坐标画布不套用本规则，避免破坏节点坐标。

## CSP / 运维设计

当前 CSP 是 `Content-Security-Policy-Report-Only`，无 `report-uri`/`report-to`，不会拦截且没有集中遥测。AdSense 官方说明其域名会变化，静态 allowlist 可能随时中断广告，只支持 nonce + `strict-dynamic` 的严格 CSP。静态 SPA 当前不能为每次响应生成并同步注入 nonce，因此本次移除该 header，保留：

- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options`

部署时替换 `/etc/nginx/snippets/algo-security-headers.conf`，先备份、执行 `nginx -t`，成功后仅 reload；失败则恢复备份。

## 兼容与回滚

- CSS 均限定手机断点，回滚只需恢复两个组件。
- Nginx 片段保留带时间戳备份；reload 不停止现有 worker。
- 若线上发现意外，可恢复旧片段并 reload；旧 CSP 仍只是 Report-Only，不影响页面可用性。

## 测试设计

- L5 `TC-PLAYER-143-01`：四种手机/横屏宽度读取倍率、计数、transport 几何和 text-align。
- L5 `TC-VIZ-143-02`：两种手机宽度读取初始数组边界；追加至 8 格后验证局部滚动和末格可达。
- ops `TC-OPS-143-03`：`nginx -t`、线上 header、代表页面和浏览器 console 冒烟。
- 回归：全量 responsive mobile、TransportControls/AlgorithmPlayer/ArrayViz 组件测试、全量 verify/coverage/e2e/双 base build。

## 风险与替代方案

- 将所有固定画布统一缩放会破坏坐标和可读性，因此只调整可由内容自然定宽的数组轨。
- 继续追加 AdSense host 白名单短期可消除当前日志，但会随 Google 域名变化再次失效；不采用。
- 直接启用宽松 `https:` CSP 只会制造“看似有 CSP”的假安全；不采用。

## 实施验证

设计按本文件落地：手机次级控制组保持对称，数组短内容不滚动、满载只在自身 wrapper 内滚动；桌面固定画布与播放器行为未改变。`TC-PLAYER-143-01`、`TC-VIZ-143-02` 及全量 L3/L4、L5 门禁均已通过；自托管安全头完成备份、`nginx -t`、reload 与线上响应头复核。Pages workflow `31361592140`、deployment `5827309207` 均为 success。
