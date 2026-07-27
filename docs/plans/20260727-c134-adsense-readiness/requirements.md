# 需求：AdSense 主域审核与算法站接入

> Status: verified
> Stable ID: C-20260727-134
> Type: ops
> Owner: IllegalCreed
> Created: 2026-07-27
> Last reviewed: 2026-07-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成；当前工程主线为 C127 T4
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-129
> Related tests: TC-ADS-ROOT-134-_, TC-ADS-ALGO-134-_, TC-ADS-BUILD-134-_, TC-ADS-LIVE-134-_

## 背景

AdSense 已将 `illegalscreed.cn` 作为站点资产，但审核状态为 `Low value content`，`ads.txt` 为 `Not found`。实际希望展示广告的应用位于 `algo.illegalscreed.cn`；AdSense 不把普通二级域名单独登记为另一站点，因此审核和授权入口必须以主域为准。

线上审计发现：

- `illegalscreed.cn/` 仍是 VitePress 默认英文示例首页，含 Lorem ipsum 和示例链接；
- 主域没有 `ads.txt`、`robots.txt` 和 sitemap；
- `algo.illegalscreed.cn/ads.txt` 被 SPA fallback 返回首页 HTML，属于 soft 404；
- 两个站点均未包含 AdSense 所有权验证信息或广告加载代码。

## Owner 决策

- 继续使用现有主域和服务器，不购买新域名、统计服务或广告工具。
- 主域继续作为个人网站，不展示广告；它负责站点所有权验证、根级 `ads.txt`、真实个人内容和信任页面。
- 算法站是实际广告载体，使用 Owner 提供的 `ca-pub-4047630223754404` 生产代码。
- Owner 已授权修改、提交、推送和部署两个仓库；不代填付款资料，不承诺审核结果或收入。

## 功能需求

### R1 主域审核入口

- `https://illegalscreed.cn/ads.txt` 必须返回纯文本：
  `google.com, pub-4047630223754404, DIRECT, f08c47fec0942fa0`
- VitePress 全站 head 必须包含 `google-adsense-account` meta，用于主域所有权验证。
- 主域不得加载 AdSense JavaScript，避免个人主页出现广告。
- 根英文首页必须替换默认模板，展示真实的开发学习路线和已有项目。
- 删除四个 VitePress 示例页，补中英文 About、Contact、Privacy 页面。
- 生成有效 `robots.txt` 和 `sitemap.xml`，并从导航可达信任页面。

### R2 算法站广告接入

- production 与 selfhost 构建的每个 HTML 入口必须包含 Owner 提供的异步 AdSense loader 和 account meta。
- development/test server 不加载第三方广告脚本。
- 构建期 Playwright 对 AdSense 脚本请求使用本地空响应，保留 HTML 标签但不让 190 页预渲染依赖 Google 网络。
- `public/ads.txt` 镜像主域授权记录，修复算法子域 soft 404。
- 中文/英文首页 Footer 均可到达主域隐私政策。

### R3 隐私与同意

- 隐私政策必须如实说明个人站已有 GA4、算法站拟加载 AdSense、Cookie/标识符、服务器日志和退出入口。
- 不声称已收集目前并未收集的自定义用户数据，也不恢复 C129 撤销的站内行为追踪。
- 面向 EEA、英国和瑞士的个性化广告同意由 Owner 在 AdSense 后台启用 Google 提供的认证 CMP；代码仓库不保存付款、身份或 AdSense 登录凭据。

### R4 发布与回滚

- 两仓库只提交本变更明确相关文件。
- 算法站继续执行 GitHub Pages + 自托管双轨发布；个人站执行其 Pages workflow + 自托管部署脚本。
- 回滚时可移除算法站生产 head 注入；`ads.txt`、隐私页和真实个人内容应保留。

## 验收标准

1. 两个仓库的定向测试、格式检查和生产构建通过。
2. 主域首页无 VitePress 示例文案，六个中英文信任页面可访问。
3. 主域 `ads.txt`、`robots.txt`、`sitemap.xml` 返回 200，且 `ads.txt` 是精确纯文本。
4. 算法站 `ads.txt` 返回 200 纯文本；任一中英文预渲染页包含一次 account meta 和一次 AdSense loader。
5. 本地 development 首页不包含 AdSense loader。
6. 两仓库提交推送，自托管线上代表 URL 与静态文件复查通过。

## 非目标

- 不创建手工广告单元或猜测 `data-ad-slot`。
- 不代填 AdSense 付款和税务资料。
- 不绕过 Google 审核，不保证通过时间、广告填充或收益。
- 不在本次恢复 Umami、GA4 站内事件或其他分析 SDK。
