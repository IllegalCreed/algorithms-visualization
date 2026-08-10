# 实现记录：全站响应式、可访问性与工程性能加固

> Status: verified
> Stable ID: C-20260810-140
> Type: refactor
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察 CSP Report-Only 与真实 Safari/触控表现；必要时单独收紧 CSP
> Replaces: none
> Replaced by: none
> Related plans: C-20260705-111, C-20260705-113, C-20260709-119, C-20260709-121, C-20260709-122, C-20260711-131, C-20260809-137, C-20260809-138, C-20260809-139
> Related tests: TC-RESPONSIVE-140-01..09

## 改动清单

实现已落地，并已完成最后一轮双 base 构建、桌面/移动端浏览器回归、覆盖率、格式、类型、lint 和依赖审计；本地状态 verified/100%。

### 初始基线（2026-08-10）

- `pnpm verify`：303 个测试文件、2163 个用例通过；190 页 build/prerender/SEO 通过。
- `pnpm coverage`：Statements 95.51%、Branches 86.38%、Functions 92.11%、Lines 95.86%。
- `pnpm exec playwright test`：125 个 Desktop Chrome 用例通过。
- `pnpm exec playwright test --project=mobile-chromium`：5 个 Pixel 5 Chromium 用例通过。
- 390×844 生产实测确认固定 600px 壳导致正文/播放器不可用。
- `pnpm audit`：全树 13 high + 5 moderate；`pnpm audit --prod`：5 high + 1 moderate，均为传递依赖构建链路径。

### 已完成的实现

- **响应式壳**：Header、中文/英文 Home、Docs、Article 在 390×844、844×390 等视口移除 600px 硬阻塞；Docs 手机使用 body 主滚动，目录为 Teleport dialog，抽屉内保留目录、语言和四个外链。
- **播放器**：共享 `AlgorithmPlayer` 保持桌面两行两列；手机单列并提供代码/变量 segmented tabs；Transport、语言 tab 和输入目标至少 44px；代码高亮只滚动代码容器。
- **焦点与语义**：Search/Docs/Header modal 共享 body lock 与 `#app[inert]` 引用计数，补 Escape/Tab/focusin、同页/尾斜杠/首次跨路由标题焦点；Code/变量/可视化/说明区域有本地化名称，变量使用 `dl`，结构组件补 live/input/keyboard 语义，动态播报去重。
- **路由与产物**：`/docs` 与 `/en/docs` redirect 到 complexity，catch-all 回 Home，Router scrollBehavior 重置；27 个英文页改为直接 adapter import；全局 utility CSS 单次输出；Shiki cache 限制 128 项；新增 bundle/SEO 门禁。
- **工程安全**：Vue/Vite/Less/Shiki/Playwright/Vitest 等依赖在兼容范围内升级，当前 `pnpm audit` 与 `pnpm audit --prod` 均为 0；CI 增加 audit、coverage 和 desktop/mobile Playwright。
- **窄屏结构轨**：统一移动端 `.lane-wrap`/`.array-wrap` 的局部横向滚动与首端对齐，320px 下 13 个结构路由首尾均可达，页面本身无横向溢出。
- **断点语义**：检查区 tab 仅在 ≤899px 渲染；桌面使用带本地化名称的双 `region`，跨断点时把焦点交给对应可见 panel/tab。

### 实际涉及文件

- 共享壳：`src/store/modules/system.ts`、`src/hooks/mobileMenu.ts`、`src/views/Master/Header/*`、`src/views/Docs/{Docs.vue,hooks.ts,Menu/*}`、`src/views/Home/*`、`src/views/English/Home.vue`、`src/components/article/Article.vue`。
- 播放器与语义：`src/components/player/{AlgorithmPlayer,CodePanel,TransportControls,VariablePanel,SearchPalette}.vue` 及对应 specs；`src/components/structures/*Viz.vue` 与 `accessibility.spec.ts`。
- 路由/构建：`src/router/*`、`src/seo/site.ts`、27 个 `src/views/English/*.vue` adapter import、`scripts/{prerender,verify-seo,verify-bundle}.mjs`、`vite.config.ts`、`vitest.config.ts`、`.github/workflows/deploy.yml`、`scripts/nginx/algo-security-headers.conf`。

### 安全响应头发布说明

- `scripts/nginx/algo-security-headers.conf` 是仓库管理的自托管片段。HSTS、nosniff、Referrer-Policy、Permissions-Policy 与 frame 保护为强制模式；AdSense/GA4 相关 CSP 先使用 Report-Only，必须经浏览器冒烟后再转强制。
- GitHub Pages 不支持由本仓库配置自定义响应头，因此 Pages 镜像无法从应用代码补上这些 header。自有域在明确授权的发版中安装该片段，并需在已有 `assets` location 内再次 include（该 location 自己声明了 `add_header`，会中断 nginx 的父级继承）。

## 与设计偏差

1. 设计稿曾要求手机代码/变量使用 accordion；实际采用 segmented tabs，原因是保留两个面板状态和代码高亮缓存，同时减少长页面高度，已由 `TC-RESPONSIVE-140-03` 覆盖。
2. 设计稿原先把手机断点写成 `<600px`，实现统一按 `max-width:899px` 处理手机/平板窄屏，900px 起恢复窄桌面单列；目的是覆盖真实 844×390 横屏。
3. 安全响应头片段已安装到自托管 Nginx 的 HTTPS server 和 `assets` location；`nginx -t`、reload 与线上 header 检查均通过。GitHub Pages 受平台限制无法由仓库注入同等 header。

## 踩坑与处理

### 已处理的审计问题

- 首次高亮与后续 step 不再把整篇文章滚到代码；Search Enter 取消默认按钮激活，避免跨路由后弹窗重开。
- modal 之间互斥并共享引用计数，resize 跨断点会主动释放抽屉和滚动锁；首次进入 Docs、目录导航和搜索同页结果均聚焦文章标题。
- 320px 结构轨先以失败 E2E 复现固定画布左裁，再统一增加局部横滚；移动导航 44px、同页 query/hash 和双向 inspector 断点焦点也均按先红后绿收口。

## 验证记录

最终门禁命令及实测数字：

- `pnpm format:check`、`pnpm lint:check`、`pnpm type-check`、`pnpm test:unit:run`、`pnpm coverage`、`pnpm audit`：全部通过；304/2178，Statements 93.25%、Branches 84.89%、Functions 90.31%、Lines 93.69%。
- `pnpm exec playwright test --project=chromium`：125/125；`--project=mobile-chromium`：5/5。
- `pnpm build-only`：production 190 页，SEO 190 页，英文预加载 10，JS gzip 200430 bytes，入口 gzip 80706 bytes。
- `pnpm build:selfhost`：selfhost 190 页，SEO 190 页，英文预加载 10，JS gzip 200425 bytes，入口 gzip 80707 bytes。

## 遗留问题

- 已完成提交 `fcd3873`、GitHub Pages 发布（run `31349979371`，deployment `5825382051`）和自有域 `scripts/deploy.sh` 原子部署；首页指纹与本地 selfhost 构建一致，`/docs`、`/en/docs` 及中英文内容入口均返回 200。
- Nginx 安全头已安装到 `/etc/nginx/snippets/algo-security-headers.conf`；配置备份为 `/etc/nginx/conf.d/algo.conf.pre-c140-20260810103459`。HSTS、nosniff、Referrer、Permissions、SAMEORIGIN 与 CSP Report-Only 已在线返回。
- WebKit/真实触控除 Pixel 5 Chromium 外未纳入当前门禁；后续可作为 P2 增量。
- 桌面 inspector 按语义使用两个独立 region，不显示手机切换 tab；移动外链容器的空白点击会关闭抽屉，均为 P3 设计取舍。
