# 测试用例：播放器控件与可视化轨道窄屏布局

> Status: verified
> Stable ID: C-20260810-142
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-10
> Last reviewed: 2026-08-10
> Progress: 100%
> Blocked by: none
> Next action: 观察真实 WebKit 触控横滚外观（非阻塞）
> Replaces: none
> Replaced by: none
> Related plans: C-20260810-140, C-20260810-139
> Related tests: TC-PLAYER-142-01, TC-VIZ-142-02, TC-VIZ-142-03, TC-BUILD-142-04
> Related requirement: requirements.md

| Case ID          | 标题                                | 层级  | 类型       | 前置条件                   | 步骤                                                                | 期望                                     | 自动化路径                     | 状态     |
| ---------------- | ----------------------------------- | ----- | ---------- | -------------------------- | ------------------------------------------------------------------- | ---------------------------------------- | ------------------------------ | -------- |
| TC-PLAYER-142-01 | 播放器控件保持方形且不被 grid 拉伸  | L5    | regression | `/docs/binary-answer`      | 在 770×404、844×390、390×844 打开页面并读取五个 `.ctl` 与速度框几何 | 控件至少 44×44、宽高差≤1；速度框≤120px   | `e2e/responsive.mobile.e2e.ts` | active   |
| TC-VIZ-142-02    | 空队列完整显示、非空车道可内部滚动  | L5    | regression | `/docs/queue`、390×844     | 断言空态画布/提示边界；enqueue 后滚到车道末端                       | 空画布不裁切；非空轨可横滚；页面无横溢出 | `e2e/responsive.mobile.e2e.ts` | active   |
| TC-VIZ-142-03    | 桶/计数轨单行与内部横滚             | L5    | regression | counting/bucket sort pages | 在 390px 与 320px 检查所有桶 top、scrollWidth 和末端滚动            | 所有桶同一行，组件可横滚，页面无横溢出   | `e2e/responsive.mobile.e2e.ts` | active   |
| TC-BUILD-142-04  | 预渲染静态资源不残留 preview origin | build | regression | production/selfhost build  | 检查所有静态 HTML 的 script、stylesheet、modulepreload 资源地址     | 不含 `127.0.0.1`/`localhost:4173`        | `scripts/verify-seo.mjs`       | verified |

## 执行结果

基线几何断言先红，修复后 targeted 3/3、mobile 9/9、相关结构 E2E 4/4、播放器定向单测 76/76 全绿；全量 Vitest 304/2178、coverage、Desktop 125/125、mobile 9/9、双 base 190 页构建与静态资源门禁均通过。
