# 设计：播放器控件与可视化轨道窄屏布局

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

## 总体方案

把“可比较的横向序列”和“空态容器”分开处理：播放器按钮采用固定尺寸，结构车道只让外层 wrapper 滚动，桶/计数视图自身成为单行横向滚动容器。这样不会让 `#right` 或页面产生新的横向滚动，也不需要修改算法模块。

## 涉及模块与文件

| 模块       | 文件                                                     | 处理                                                          |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| 播放器     | `src/components/player/TransportControls.vue`            | 手机 grid 中固定 `.ctl` 44px、速度框 96px，并居中             |
| FIFO/Deque | `src/components/structures/QueueViz.vue`、`DequeViz.vue` | 空态添加 `is-empty` 状态类，手机将空画布收缩到 wrapper 宽度   |
| 桶轨       | `src/components/BucketView.vue`、`CountView.vue`         | `nowrap`、`overflow-x:auto`、列 `flex:0 0 auto`，保留安全居中 |
| 静态产物   | `scripts/prerender.mjs`、`scripts/verify-seo.mjs`        | 归一化 preview 资源 URL，并拒绝 loopback 资源地址             |
| L5 回归    | `e2e/responsive.mobile.e2e.ts`                           | 新增三条几何/滚动验收用例                                     |

## 布局口径

- 桌面上桶轨仍在可用空间内居中；窄屏内容超出时 `safe center` 回退到起始边，用户可通过触摸横向拖动。
- 空队列只在 `@mobile-max-width` 下覆盖固定宽度；非空车道继续由既有全局 `.lane-wrap` 规则承接。
- 所有新增滚动容器使用 `overscroll-behavior-inline: contain`，阻止横向手势串到页面。

## 兼容与回滚

CSS 修改均为局部、无数据迁移。回滚时恢复六个组件与单个 E2E 文件即可；若某浏览器不支持 `safe center`，仍会按 flex 默认起始方向显示，功能不受影响。

## 测试设计

- L4：复用 `TransportControls.spec.ts` 与 `AlgorithmPlayer.spec.ts`，验证事件、ARIA 和播放器状态不变。
- L5：在 770×404、844×390、390×844、320×800 断言控件几何、空态边界、单行桶列、内部横滚和页面无横溢出。
- 回归：运行既有 `queue.e2e.ts`、`counting-sort.e2e.ts`、`bucket-sort.e2e.ts`。

## 风险与替代方案

若将桶列压缩或缩放，虽然可避免滚动，但会使数值与高亮难以比较；因此选择保持原尺寸并局部横滚。若把固定空队列画布也横滚，空提示会偏离视口中心，因此单独收缩空态。
