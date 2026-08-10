# 测试用例：全站响应式、可访问性与工程性能加固

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

## 用例计划

| Case ID              | 标题                                                           | 层级     | 类型          | 自动化路径                                                       | 状态     |
| -------------------- | -------------------------------------------------------------- | -------- | ------------- | ---------------------------------------------------------------- | -------- |
| TC-RESPONSIVE-140-01 | 中英文首页手机布局、菜单 Sheet 与无横向溢出                    | L5       | regression    | `e2e/responsive.mobile.e2e.ts`                                   | verified |
| TC-RESPONSIVE-140-02 | Docs 抽屉、目录/语言/外链、结构画布横滚与完整正文宽度          | L4/L5    | interaction   | `src/views/Docs/hooks.ts`, `e2e/responsive.mobile.e2e.ts`        | verified |
| TC-RESPONSIVE-140-03 | 手机播放器单列、检查区代码/变量 tab、双向断点与 44px 控件      | L4/L5    | regression    | `AlgorithmPlayer.spec.ts`, `e2e/responsive.mobile.e2e.ts`        | verified |
| TC-RESPONSIVE-140-04 | 文档路由切换/首次进入重置滚动并聚焦新标题                      | L4/L5    | regression    | `src/views/Docs/Docs.vue`, `e2e/responsive.mobile.e2e.ts`        | verified |
| TC-RESPONSIVE-140-05 | 播放器交互目标与修饰键不触发全局 Space/方向键快捷键            | L4/L5    | bugfix        | `AlgorithmPlayer.spec.ts`, `e2e/playback-controls.e2e.ts`        | verified |
| TC-RESPONSIVE-140-06 | 搜索 dialog 互斥、Tab/Escape、同页 query/hash 与跨路由焦点守卫 | L4/L5    | accessibility | `SearchPalette.spec.ts`, `e2e/search-palette.e2e.ts`, mobile e2e | verified |
| TC-RESPONSIVE-140-07 | 结构输入、live region 与非原生点击目标键盘等价操作             | L3/L4    | accessibility | `src/components/structures/accessibility.spec.ts`                | verified |
| TC-RESPONSIVE-140-08 | 英文直接拆包、模块预加载、入口 gzip 与 CSS 单次输出预算        | build    | performance   | `scripts/verify-bundle.mjs`                                      | verified |
| TC-RESPONSIVE-140-09 | `/docs`、`/en/docs` 默认 child、catch-all 与目录式静态入口     | L3/build | regression    | `src/router/index.spec.ts`, `scripts/verify-seo.mjs`, prerender  | verified |

## 回归测试

- 保留 C137/C138/C139 的桌面双栏、窄屏单列、阴影和代码横滚用例。
- 保留全部算法页面 L5 用例；任何轨道、oracle、输入、测验或 SEO 变化都视为回归失败。
- 新增 reduced-motion、forced-colors、accessible-name 与 live status 检查；真实浏览器门禁覆盖桌面/Pixel 5 Chromium。

## 反向验证

- 在实现前确认 TC-RESPONSIVE-140-05 在原代码中失败（按钮 Space 会触发播放）。
- 在实现前确认 TC-RESPONSIVE-140-06 在原代码中失败（Tab 逃出 dialog、关闭后焦点丢失）。
- 在实现前确认 TC-RESPONSIVE-140-04 在原代码中失败（`#right.scrollTop` 保留）。

## 执行结果（2026-08-10）

- L3/L4：304 个 Test Files、2178 个 Tests 全部通过；覆盖率为 Statements 93.25%、Branches 84.89%、Functions 90.31%、Lines 93.69%。
- L5：Desktop Chromium 125/125、Pixel 5 mobile Chromium 5/5 全部通过；另以 320px 验证 13 个结构路由固定画布左右可达且页面无横溢。
- Build/SEO：production 与 selfhost 各预渲染并验证 190 页；`verify-bundle` 分别报告英文 modulepreload 10、JS gzip 200430/200425 bytes、入口 gzip 80706/80707 bytes。
- Quality：`format:check`、`lint:check`、`type-check`、`pnpm audit` 全部通过；提交 `fcd3873`、Pages deployment `5825382051`、自有域原子部署和 Nginx 安全头线上检查均成功。

## 测试层适用性

- L1/L2：纯 Vue 前端项目不适用，记录原因。
- L3/L4：适用于 composable、store 和共享组件交互。
- L5：适用于真实 viewport、touch、路由、静态入口与跨组件流程。
- Build：适用于 190 页预渲染、模块预加载和 CSS/JS 预算。
