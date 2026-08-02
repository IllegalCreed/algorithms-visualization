# 实现记录：GA4 标签加载失败后的安全重试

> Status: verified
> Stable ID: C-20260801-136
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-01
> Last reviewed: 2026-08-02
> Progress: 100%
> Blocked by: none
> Next action: 无代码动作；等待 GA4 普通报告完成处理，Realtime 继续作为即时健康信号
> Replaces: none
> Replaced by: none
> Related plans: C-20260730-135
> Related tests: TC-ANL-GA4-136-01..04, TC-ANL-HYDRATION-136-01

## 最终改动清单

- 将 `dataLayer` 类型扩展为官方 `IArguments` 命令形态。
- 内建 `gtag` 改用普通函数，将 `arguments` 入队。
- 将命令初始化与 script 插入解耦；失败节点由 `onerror` 移除，后续 granted 活动可重试。
- 重试不重复 `js`、`config` 或相同 pathname 的 `page_view`。
- 同步修正个人站与 Type Pal 第一阶段的同构控制器和定向测试。
- Quiz Google-only 控制器加入失败节点清理/重试与官方 `arguments` 队列回归；个人站同意 UI 延后到 mounted 后读取存储。

## 红绿证据

- 红灯：四站 loader/SSR 回归均在对应旧实现上复现失败，表现为“失败 script 未替换”“队列项仍为 Array”或首屏 hydration 不一致。
- 绿灯：算法站 9/9、个人站 8/8、Type Pal 第一阶段 8/8、Quiz 2/2 相关定向断言通过。

## 生产诊断证据

- 三站同意前均无 Google script；同意后分别插入正确 Measurement ID，并排队 `js`、`config`、`event page_view`。
- 独立无头 Chromium 中，`gtag.js` 统一失败为 `ERR_CONNECTION_CLOSED`，没有 `g/collect`；终端对标签/采集域名同样失败，但 `analytics.google.com`、`accounts.google.com` 与 `google.com` 可达。
- 当前本机 DNS 返回 `198.18.0.0/15` fake-IP，但无对应代理出口；TLS 建连失败。
- 阿里云生产服务器可获取 `gtag.js`（HTTP 200），但连接 `www.google-analytics.com` 与 `region1.google-analytics.com` 均超时。
- 对照审计确认 Quiz 线上包包含独立 GA4 ID、Baidu site ID 与两个 loader；全新浏览器访问 Quiz 时 consent 为 unset、Google/Baidu 请求均为 0，与三个新站默认行为一致。
- 同一 Codex 已登录浏览器可正常访问 GA 管理后台；只读核对显示 Quiz 最近 7 天有 1 个 `page_view`/5 个事件，算法站、个人站与 Type Pal 均为 0，并显示过去 48 小时未收到数据。
- 三个新 property 的数据流 URL、后台 Measurement ID、本地 production 配置与线上包完全一致，已排除数据流目标或公开 ID 写错。
- Owner 授权的 Codex 内置浏览器对四站均执行了 consent 对照；个人站、算法站、Type Pal 和 Quiz 都插入了正确的 `gtag.js` 节点，但四个 property 的 Realtime 均为 0。由于 Chrome/extension 均不可用，不能把这次内置浏览器结果当成 Owner 实际代理 Chrome 的网络结论。
- 随后 Chrome 扩展已连接；在 Owner 实际 Chrome 代理会话中，四站均插入正确的公开 Measurement ID 标签，但四个 property 的 Realtime 仍为 0。Owner 提供的 Network/Console 截图进一步确认个人站的 `https://www.googletagmanager.com/gtag/js?id=G-CHX5JE8W8H` 以 `net::ERR_CONNECTION_CLOSED` 失败；请求尚未进入 `g/collect`。这定案为当前代理/网络层关闭 Google tag 连接，而非 property 或前端 ID 错误。
- Quiz、个人站与算法站虽然同源于一台 ECS，GA4 请求实际从访客浏览器发出；服务器出口超时只影响未来可能的 server-side/proxy 方案，不能解释现有客户端记录差异。
- Owner 已在 GA4 中看到 Quiz 记录，说明至少某个历史或其他访客网络曾成功送达；不与当前 Chrome 的 `ERR_CONNECTION_CLOSED` 矛盾。结论为：Measurement ID 不是根因；代码韧性缺陷已修，当前三个新 property 无数据的共同生产根因为代理未放行 Google tag/collect 域名。
- Owner 确认并保存「苏菲家宽」前置规则：`googletagmanager.com` 与 `google-analytics.com` 均路由到该策略组。随后真实 Chrome 刷新个人站时不再出现 `gtag.js` 的 `ERR_CONNECTION_CLOSED`，但 GA Realtime 仍为 0；Chrome 工具栏 ZeroOmega 显示 `Direct (not using any proxy)`，Clash「系统代理」仍关闭，当前需继续确认浏览器是否实际经过 Clash/TUN。
- 经 Owner 确认启用 Clash 系统代理并将 ZeroOmega 切换为 `PROXY 127.0.0.1:7897`；再把「苏菲家宽」切换至绿色 `香港家宽hy2`（约 180ms）。通过本机 7897 只读验证，百度返回 HTTP 200，但 `www.googletagmanager.com/gtag/js` 仍为 TLS `SSL_ERROR_SYSCALL`；说明该节点的 Google 出口不可用，不能把国内可达等同于 Google 采集端可达。
- Owner 更新代理订阅后，新的「苏菲家宽」策略组已加载，当前自动组落在中国香港节点（约 140ms）。复测 7897：百度与 `www.google.com` 返回 HTTP 200，但 `analytics.google.com`、`www.googletagmanager.com/gtag/js` 和 `www.google-analytics.com/g/collect` 仍在 TLS 阶段 `SSL_ERROR_SYSCALL`；新订阅尚未恢复 GA4 采集。
- Owner 启用 Clash TUN 后，Quiz Chrome Network 显示 Google tag 与百度 `hm.js` 均 HTTP 200；同机不显式指定 HTTP 代理的只读测试中，百度首页与 `hm.baidu.com/hm.js` 为 200，Google tag 为 200，`google-analytics.com/g/collect` 为 204。网络传输层已恢复，四站 Realtime 与 C136 代码发布仍待验证。
- 2026-08-01 Owner 将 ZeroOmega 切换为 `Direct`，同时保留 Clash TUN。当前 Owner Chrome 复核显示：算法站、Quiz 均在明确允许分析后插入唯一且正确的 `gtag.js`，控制台无当前错误；终端不显式指定代理的 GTM 请求返回 200、GA4 collect 返回 204，说明浏览器外部的 Google 采集链路已恢复。GA4 只读首页当前仍显示算法站与个人站 `Active users 0`、`Event count 0`，因此不能把传输层 200/204 等同于 Realtime 已收到数据。
- 同一复核确认个人站线上包仍报 `Hydration completed but contains mismatches.`；本仓库与个人站仓库的 mounted/ready 修复已在本地门禁通过，但尚未提交、推送或部署。Type Pal 第一阶段生产包包含同意门控的动态 GA4 loader；未同意时 HTML 不出现 Google script，属于预期 fail-closed 行为，不是缺少配置。
- 2026-08-01 复核算法站截图：`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` 返回 `ERR_CONNECTION_CLOSED`。这是 C134 AdSense loader 的独立广告请求；当前只保存了 GA 两条域名规则，且显式 ZeroOmega 代理仍在使用，故不能归因于算法站 Vue/SSR 或 GA4 控制器。
- Owner 随后补齐 AdSense 代理路径；使用当前 `127.0.0.1:7897` 代理启动全新 Chromium 访问算法站，AdSense 无 request failure、控制台无错误，说明 AdSense publisher/loader 配置本身正确，之前的报错是代理出口未覆盖 `googlesyndication.com`。不需要修改广告代码。
- Owner 随后明确授权将「苏菲家宽」切换至「🇰🇷 韩国节点自动选择」；复核顶层选择器已显示韩国组。通过同一 7897 只读验证，百度仍返回 HTTP 200，但 `www.googletagmanager.com/gtag/js` 与 `www.google-analytics.com/g/collect` 仍为 TLS `SSL_ERROR_SYSCALL`；说明当前韩国组也未提供可用的 Google 采集出口。
- 2026-08-02 在 Owner 实际 Chrome 中重新核验：直接打开 `https://www.googletagmanager.com/gtag/js?id=G-TDFH8FKQCG` 与 AdSense loader 均被浏览器以 `net::ERR_BLOCKED_BY_CLIENT` 拦截；算法站页面虽残留 `data-ga4-measurement-id="G-TDFH8FKQCG"` 的 script 节点，但 `gtag` 与 `dataLayer` 均未建立，因此没有 `g/collect`，GA4 显示 0 是预期结果。终端/无扩展 Chromium 的 HTTP 200/204 只证明代理出口可达，不能证明 Owner Chrome 已允许资源。
- 2026-08-02 最终修复与发布：算法站、个人站、Quiz、Type Pal 第一阶段均已切换到官方 `dataLayer.push(arguments)` 队列并部署到各自自有域。Quiz 仅部署前端 app（未重启题库后端），Type Pal 仅部署第一阶段游戏壳（未触碰第二阶段 `reforge`/`editor`）。
- 2026-08-02 受控 Chromium 终验：四站明确 `granted` 后，`gtag.js` 均 HTTP 200、`g/collect` 均 HTTP 204，事件为标准 `page_view`，无 page error。Owner 现场 GA4 已观察到个人站、算法站、Quiz 与 Type Pal 的 Realtime 活跃用户；顶部初始化 banner 与 Realtime 卡片刷新路径不同，不再作为链路失败判据。

## 与设计偏差

- 无。

## 数据、部署与回滚

- 无数据库、schema 或 consent storage 迁移。
- 个人站、算法站、Quiz、Type Pal 第一阶段本轮修复均已完成构建并部署到各自自有域；Quiz 未部署后端，Type Pal 未触碰第二阶段。代码仓库仍保留用户原有未提交改动，未执行提交/推送。
- 回滚为纯前端控制器与测试回滚，不影响站点业务数据。

## 验证记录

- 定向 Vitest：算法站 9/9、个人站 5/5、Type Pal 8/8 全绿。
- 算法站 `pnpm verify`：format、lint、type-check、303 文件 / 2158 用例与 production 190 页全绿。
- 算法站 `pnpm coverage`：303 文件 / 2158 用例全绿，95.51% / 86.37% / 92.10% / 95.85%。
- 算法站 `pnpm exec playwright test`：119/119 全绿；`pnpm build:selfhost`：selfhost 190 页全绿。
- 个人站 `pnpm test:unit`：2 文件 / 7 用例全绿；`pnpm docs:build`：完整页面渲染与 sitemap 全绿，耗时 1917.88 秒。
- Type Pal `pnpm --filter @type-pal/game check`：123 文件 / 2305 用例与 typecheck 全绿；production build 全绿；本次文件 Biome 检查全绿。
- 个人站 `pnpm test:unit`：2 文件 / 8 用例全绿；`pnpm docs:build`：完整页面渲染与 sitemap 全绿，耗时 2156.35 秒；`pnpm run deploy` 已完成自托管同步。

## 遗留问题

- 统计边界仍是 basic consent 后的标准 `page_view`；搜索、输入、播放、测验、分享和游戏语义事件继续不发送。
- GA4 Home 顶部初始化 banner 可能晚于 Realtime 卡片消退；以 Realtime 活跃用户和 Network 的 204 作为即时判据，普通报告按 Google 的处理窗口等待即可。
- Type Pal 仍明确只代表线上第一阶段引擎；第二阶段 `reforge`、`editor`、migration 与现有脏改动不在本轮。
