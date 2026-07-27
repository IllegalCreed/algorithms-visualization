# 设计：AdSense 主域审核与算法站接入

> Status: verified
> Stable ID: C-20260727-134
> Type: ops
> Owner: IllegalCreed
> Created: 2026-07-27
> Last reviewed: 2026-07-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成；工程主线返回 C127 T3-D4-C
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-129
> Related tests: TC-ADS-ROOT-134-_, TC-ADS-ALGO-134-_, TC-ADS-BUILD-134-_, TC-ADS-LIVE-134-_

## 域名职责

```text
illegalscreed.cn (AdSense Sites 中登记的主域)
├── account meta：证明所有权
├── /ads.txt：声明 Google 为授权销售方
├── 真实个人主页、About、Contact、Privacy
└── 不加载广告脚本

algo.illegalscreed.cn (实际广告内容)
├── production/selfhost HTML：account meta + adsbygoogle loader
├── /ads.txt：同一 publisher 记录的镜像
├── Footer：链接主域隐私政策
└── development/test：不加载广告脚本
```

主域和二级域不是两个独立 AdSense Sites 记录。主域负责审核入口并不会要求个人主页显示广告；算法站脚本在主域资产获批并启用 Auto ads 后承担实际广告加载。

## 个人站设计

- 使用 VitePress `head` 注入静态 account meta，使用 `sitemap.hostname` 生成 sitemap。
- `src/public/ads.txt` 和 `src/public/robots.txt` 直接复制为根级静态资源。
- 根英文首页改为真实项目导航；中文首页修正算法站链接并补可索引正文。
- 中英文 About、Contact、Privacy 采用 Markdown 内容页，由导航和侧栏直接访问。
- 删除默认 example 页面，同时移除内容审计脚本里的历史排除项。
- 新增无依赖 Node 检查脚本，验证授权记录、导航、内容、信任页和示例清理。

## 算法站设计

### 生产专用 head 注入

在 `vite.config.ts` 增加 `adsenseHeadPlugin`：

- 读取单一常量模块中的 client ID、script URL；
- `configResolved` 保存 `config.command === "build"`；
- 仅 build 的 `transformIndexHtml` 返回 account meta 和异步 script；
- dev server 返回空标签集，因此 L5 和本地开发不请求第三方广告服务。

### 可重复预渲染

`scripts/prerender.mjs` 在创建 browser context 后，为
`https://pagead2.googlesyndication.com/**` 注册 route，并返回空 JavaScript。这样：

- 原始 script 标签仍会进入 `page.content()`；
- `requestfailed`/HTTP 4xx 门禁不受外部网络波动影响；
- 生产静态产物仍保留真实 URL，线上浏览器正常请求 Google。

### 公开静态资源和隐私入口

- `public/ads.txt` 解决 Nginx SPA fallback 的 HTML soft 404。
- Home Footer 按 locale 分别链接 `https://illegalscreed.cn/zh/privacy` 与
  `https://illegalscreed.cn/privacy`，不创建算法站第二份隐私政策。
- C129 仍约束“无站内分析 tracker”；AdSense 属本计划显式批准的广告加载，不复用 analytics 模块。

## 风险控制

| 风险                           | 控制                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| publisher ID 被误当 secret     | 仅提交公开 publisher/client ID，不提交登录、付款或 token         |
| Google 网络导致构建失败        | 只在 build 注入，并在预渲染 context 本地 fulfill                 |
| 主域误展示广告                 | 主域仅 account meta，不加载 `adsbygoogle.js`                     |
| `ads.txt` 被 SPA fallback 吞掉 | 两站都部署真实静态文件并在线核对 content-type/body               |
| 隐私声明与事实不符             | 区分个人站 GA4、算法站 AdSense、算法站无自定义行为追踪           |
| Auto ads 影响学习体验          | 首次只接 loader；展示位置、密度和排除区域由 AdSense 后台后续控制 |
