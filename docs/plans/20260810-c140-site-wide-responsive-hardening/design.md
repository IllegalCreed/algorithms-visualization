# 设计：全站响应式、可访问性与工程性能加固

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

## 总体方案

沿用 Vue 3 Composition API 与共享 `Master → Docs → Article → AlgorithmPlayer` 层级。新增手机断点，不修改既有桌面断点语义：

- `≤899px`：手机/窄平板壳、抽屉目录、播放器检查区 tab、两行控制条；body 负责主滚动。
- `900–1179px`：窄桌面单列播放器，保留可读宽度。
- `≥1180px`：保持现有两列播放器与右侧 sticky 检查区。

## 前端设计

### 全局壳

- `Header` 在手机显示 Logo、搜索、菜单按钮；语言与外链移入右侧 Sheet。
- `Docs` 的 `#left` 桌面为持久侧栏，手机为 Teleport 到 body 的 off-canvas dialog；添加 backdrop、关闭、Escape 和焦点恢复。
- `#right` 手机取消独立 `overflow-y`，使用页面滚动；路由变更由共享 hook 重置滚动和页面标题焦点。
- Home、English Home、Splash、Category 使用 `clamp()`、`minmax()` 和可换行布局，移除页面级 `min-width:600px`。

### 播放器

- 桌面保留 `visual + explanation` 左列、`code + variables` 右列的既有 grid。
- 手机把 `visual` 与 caption 保持首屏顺序，代码/变量通过 segmented tabs 切换，避免四块面板同时占满长页面；桌面仍是两行两列。
- 桌面检查区的代码与变量是两个独立 `region`；跨 899px 断点时将焦点迁移到对应可见 region/tab，避免隐藏 tabpanel 丢焦点。
- `TransportControls` 在手机拆成主按钮行和独占进度行，控制目标≥44px，使用 safe-area 与 `touch-action: manipulation`。
- 全局键盘监听只在播放器非交互区域响应；按钮、链接、输入、可编辑内容和组合控件均退出。

### 可访问性

- 搜索与目录 Sheet 使用 `role=dialog`、`aria-modal`、焦点循环、Escape、触发点恢复和背景滚动锁。
- 结构节点改为 button 或补完整 keyboard equivalent、`aria-pressed`。
- 输入补 label/`aria-describedby`；共享 status 使用 `role=status`、`aria-live=polite`。
- 代码语言使用 tab 语义；面板补 heading/`aria-labelledby`；变量优先使用 `dl`。
- 全局补 `:focus-visible`、`prefers-reduced-motion`、`forced-colors`、`color-scheme`/`theme-color`。

### 路由与静态入口

- 为 `/docs` 与 `/en/docs` 增加默认 child redirect（不产生空壳目录）。
- 在 Router 或 Docs hook 中统一重置嵌套滚动；路由完成后把焦点移到新文章 heading。
- 保持现有 190 页尾斜杠静态入口与 SEO registry。

## 性能设计

- 27 个英文旧页直接导入各自 `src/i18n/en/modules/<slug>`，保留 full parity registry 供 catalog 使用。
- Home 路由改异步 loader，避免 96 个图标进入所有页面的主入口；图片明确尺寸，非首屏 lazy。
- Less 全局注入只保留变量/无输出 mixin；输出 utility 与 header shadow 在入口样式单次引入。
- Shiki 继续按语言代码分块；缓存改为有界 Map，避免长时间 SPA 浏览无限增长。
- 新增初始 JS、模块预加载数和 CSS 重复规则预算脚本/测试。

### 实际交互边界

- 所有 Teleport modal（搜索、首页 Sheet、Docs 抽屉）共享 body scroll lock 与 `#app[inert]` 引用计数，并对 Tab、Escape 和程序化 focus 做守卫。
- 代码高亮只调整 `.code` 自身 `scrollTop`，不再调用会滚动整篇文章的 `scrollIntoView`。
- 结构可视化的固定画布在 `≤899px` 由统一 `.lane-wrap`/`.array-wrap` 提供从左端开始的局部横向滚动，320px 下首尾均可达，页面本身不横溢。

## 安全与部署设计

- 自有 Nginx 增加 HSTS、X-Content-Type-Options、Referrer-Policy、Permissions-Policy；CSP 先 report-only，再根据 GA/AdSense 白名单收紧。
- deploy 脚本对关键 header、`/docs` 默认入口和两域目标页做 curl 断言。
- 依赖升级分小批执行：Vue/Vite/Less/PostCSS/Nanoid 先锁定兼容版本，再跑完整门禁。

## 测试设计

- L3：响应式断点 helper、focus trap、路由滚动 helper、bounded cache、模块映射。
- L4：Header/Docs drawer/Search dialog/Transport/Code tabs/结构 status 与输入 accessible name。
- L5：Desktop Chrome 保留；新增 Pixel 5 Chromium 390×844/844×390 及 320px 结构轨回归；WebKit/真实触控 smoke 留作后续增量。
- 强制测试 reduced motion、forced colors、键盘 Tab/Space/Escape、焦点恢复、页面无横向溢出。

## 风险与替代方案

- 抽屉化会改变目录 DOM 顺序：保留桌面侧栏测试，并让移动端使用同一 Menu 数据与 active 状态。
- Less 拆分可能影响全局 utility：先做 CSS 快照和完整 E2E，若选择器发生意外丢失立即回滚该子项。
- `/docs` 默认入口可选择 redirect 到数组页或新增工具 landing；优先 redirect，避免新增 SEO 页面。

## 已知设计取舍

- 需求早期曾考虑手机用 accordion；最终采用代码/变量 segmented tabs，保留 DOM 复用并减少长页面高度。
- GitHub Pages 无法由仓库注入 HTTP 安全响应头；Nginx 片段已在用户授权后安装到自托管服务器，Pages 仍受平台限制。
