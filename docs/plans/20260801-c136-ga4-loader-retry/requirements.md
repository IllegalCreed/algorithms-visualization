# 需求：GA4 标签加载失败后的安全重试

> Status: verified
> Stable ID: C-20260801-136
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-01
> Last reviewed: 2026-08-02
> Progress: 100%
> Blocked by: none（Owner 启用 Clash TUN 后 Google tag/collect 传输已恢复）
> Next action: 无代码动作；四站已部署并验证 `g/collect`，等待 GA4 普通报告完成处理
> Replaces: none
> Replaced by: none
> Related plans: C-20260730-135
> Related tests: TC-ANL-GA4-136-01..04, TC-ANL-HYDRATION-136-01

## 背景与复现

C135 上线后，Owner 发现个人站、算法站与 Type Pal 的新 GA4 property 均长期没有数据。生产诊断确认三个站的 Measurement ID、basic consent、`config` 与手动 `page_view` 均已接线；但 Google 标签或采集端在独立无头 Chromium/终端路径失败。原控制器在 `gtag.js` 请求失败后仍保留 script，并把整个页面生命周期标记为已初始化，后续再次同意或页面活动不会重新加载标签。

后续对照审计确认 Quiz 使用独立 GA4 property，且同一 Codex 已登录浏览器可正常读取 Google Analytics：Quiz 在最近 7 天有 1 个 `page_view`，三个新 property 均显示未收到数据。Quiz、个人站和算法站虽同源于一台 ECS，但 GA4 请求由访客浏览器直连 Google，ECS 出口测试不能代表访客出口；因此独立诊断路径失败不能外推为“Google 对所有访问者长期不可达”，也不能作为三个新 property 无数据的唯一根因。

在获得 Owner 授权后，Codex 内置浏览器分别对个人站、算法站、Type Pal 和 Quiz 执行了 consent 对照；四站均插入了正确的 `gtag.js` 节点，但同一内置浏览器的四个 Realtime 均为 0。随后连接 Owner 实际 Chrome 代理会话复测，四站仍均插入正确标签、Realtime 仍为 0；Owner 提供的 Network/Console 证据显示个人站 `gtag.js` 请求以 `net::ERR_CONNECTION_CLOSED` 失败，且未出现 `g/collect`。因此已确认当前代理链路放行 GA 管理后台，但关闭 Google tag/collect 采集链路。

复现步骤：

1. 在 production 配置与合法 Measurement ID 下明确同意；
2. 让 `gtag.js` 请求触发 `error`；
3. 再次触发 granted consent；
4. 实际结果：仍是原失败 script，没有第二次加载机会；预期：移除失败节点并安全重试。

## 要做什么

- Google script 触发 `error` 时只移除失败节点，不影响页面与 consent 状态。
- 下一次 granted consent 或可用页面活动能够重新插入 script。
- `js`、`config` 与已经排队的当前页不因重试重复入队。
- 内建 `gtag` 使用 Google 官方示例的 `arguments` 命令形态。
- 算法站、个人站和 Type Pal 使用同一韧性语义，各自在所属仓库保留回归用例。

## 2026-08-01 四站跟进范围

- Quiz 纳入同一 Google-only 韧性修复：内建 `gtag` 使用官方 `arguments` 命令形态；Google script 失败后移除节点，后续 granted 活动允许重试。
- 个人站的 consent 组件在 `mounted` 后读取 `localStorage`，SSR 与客户端首次渲染保持同一空树，消除 hydration mismatch。
- 四站的 Measurement ID、basic consent 与仅 `page_view` 边界保持不变。
- 本跟进不修改 Baidu 统计、行为事件、隐私范围或任何站外真实写入；Baidu 控制台/`hm.js` 报错不作为本轮验收项。

## 不做什么

- 不绕过 basic consent，不在 unset/denied 时加载或发送。
- 不恢复搜索、输入、播放、测验、分享或游戏语义事件。
- 不读取 Google 账号 token、Cookie、Keychain 或浏览器凭据。
- 不把自托管 Google script 当成采集端可达性的解决方案。
- 不在本变更中迁移 CDN、部署非官方反向代理或新统计服务。
- 不制造真实 production `page_view` 作为自动化测试。

## 业务规则与异常

1. 命令队列初始化和外部 script 存在是两个独立状态。
2. script 失败可以重载；命令队列只初始化一次。
3. 重试沿用 pathname 去重，不重复排队同一页面。
4. 任意统计异常继续失败关闭，核心页面、路由与游戏不受影响。
5. 任一访客网络中的 Google 端点不可达时，重试能力不等于统计可用；不得把单条诊断网络的失败外推为全局不可达。
6. 四站均为 fail-closed consent：全新浏览器未明确允许时不加载统计，必须把 consent 状态与网络可达性分开验证。

## 验收口径

- 四个仓库的缺陷用例先红后绿。
- 算法站 `TC-ANL-GA4-136-01..02` 纳入全局测试索引。
- 相关包类型检查、单测和构建门禁通过。
- 线上可用性仍以浏览器中 `google-analytics.com/g/collect` 成功响应和 GA Realtime 为准。

## 开放问题

- GA 域名规则已写入「苏菲家宽」：`googletagmanager.com` 与 `google-analytics.com`；Owner 启用 Clash TUN 后，这两类端点的浏览器与系统直连测试均可完成 TLS。算法站截图中的 AdSense `pagead2.googlesyndication.com` 属 C134 独立广告能力，当前规则未覆盖该域名，不能用 GA4 的成功与否替代广告端点验证。
- 若受控对照确认目标访客网络持续无法连接 Google，再评估“官方 Google tag gateway/CDN 调整”或“第一方统计、GA4 作为补充”；不由本缺陷修复提前下结论。

## 变更历史

- 2026-08-01：完成三站只读生产诊断；确认 ID 与队列接线正确，同时复现 script 失败后不可重试。
- 2026-08-01：三仓库分别新增两条红灯并完成最小实现；各仓库代码门禁通过，代码变更已验证，尚未提交或部署。
- 2026-08-01：补审 Quiz 生产实现与全新浏览器状态；确认四站均需独立 consent、Quiz 另有 GA4/Baidu 双统计，并收紧“端点不可达”为当前诊断路径事实，生产共同根因仍待同浏览器对照。
- 2026-08-01：授权对照在 Codex 内置浏览器四站均插入正确标签但 Realtime 均为 0；因该浏览器未连接 Owner Chrome 代理会话，结果标记为环境无效，不作为线上根因证据。
- 2026-08-01：Owner 提供实际 Chrome Network/Console 证据；个人站 `https://www.googletagmanager.com/gtag/js?id=G-CHX5JE8W8H` 返回 `net::ERR_CONNECTION_CLOSED`，且未进入 `g/collect`，共同根因定案为代理关闭 Google tag/collect 采集链路。
- 2026-08-01：经 Owner 确认启用 Clash 系统代理、ZeroOmega `PROXY 127.0.0.1:7897` 并将「苏菲家宽」切换至香港家宽hy2；7897 代理下百度 HTTP 200，但 Google tag TLS `SSL_ERROR_SYSCALL`，后续转为测试其他 Google 出口节点。
- 2026-08-01：经 Owner 确认将「苏菲家宽」切换至韩国节点自动选择；复核顶层选择器已生效。7897 下百度 HTTP 200，但 `www.googletagmanager.com/gtag/js` 与 `www.google-analytics.com/g/collect` 仍为 TLS `SSL_ERROR_SYSCALL`，韩国线路同样未恢复 GA4 采集。
- 2026-08-01：Owner 更新代理订阅后，新的「苏菲家宽」策略组已加载，当前自动组落在中国香港节点（约 140ms）；7897 下百度与 `www.google.com` 为 HTTP 200，但 `analytics.google.com`、Google tag 与 `g/collect` 仍为 TLS `SSL_ERROR_SYSCALL`，新订阅尚未恢复 GA4 采集。
- 2026-08-01：Owner 启用 Clash TUN 后，Quiz Chrome Network 显示 Google tag 与百度 `hm.js` 均 HTTP 200；同机不显式指定 HTTP 代理的只读测试中，百度首页与 `hm.baidu.com/hm.js` 为 200，Google tag 为 200，`google-analytics.com/g/collect` 为 204。网络传输层已恢复，四站 Realtime 与 C136 代码发布仍待验证。
- 2026-08-02：算法站、个人站、Quiz、Type Pal 第一阶段均完成 C136 production bundle 部署；Quiz 仅更新前端、Type Pal 仅更新第一阶段游戏壳，均未改后端或第二阶段编辑器。受控 Chromium 四站 `gtag.js` 200 / `g/collect` 204，Owner GA4 Realtime 已观察到四站活跃用户；顶部初始化 banner 延迟不再作为失败判据。
