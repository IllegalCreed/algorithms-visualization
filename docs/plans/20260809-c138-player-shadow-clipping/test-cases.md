# 测试用例：修复算法播放器右侧面板阴影裁剪

> Status: verified
> Stable ID: C-20260809-138
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；两个新增回归 Case 与全量回归均已通过
> Replaces: none
> Replaced by: none
> Related plans: C-20260809-137
> Related tests: TC-PLAYER-SHADOW-138-01..02

| Case ID                 | 标题                       | 层级 | 类型       | 前置条件                      | 期望                                                   | 自动化路径            | 状态   |
| ----------------------- | -------------------------- | ---- | ---------- | ----------------------------- | ------------------------------------------------------ | --------------------- | ------ |
| TC-PLAYER-SHADOW-138-01 | 桌面检查区不裁剪卡片外阴影 | L5   | regression | `/docs/dijkstra`、1440px 视口 | inspector 两轴 overflow 为 visible，卡片四周有绘制余量 | `e2e/dijkstra.e2e.ts` | active |
| TC-PLAYER-SHADOW-138-02 | 窄屏仍单列且无横向溢出     | L5   | regression | `/docs/dijkstra`、900px 视口  | 可视化/检查区纵向排列，document scrollWidth ≤ viewport | `e2e/dijkstra.e2e.ts` | active |

## 反向验证

将 `.inspector-pane` 恢复为 `overflow-y: auto` 后，TC-PLAYER-SHADOW-138-01 的计算样式断言必须失败；修复后再运行通过。

## 执行结果

C138 两个 Case 通过：桌面 `overflow-x/y = visible`、窄屏同样不裁剪且 `document.scrollWidth ≤ 900`。C137 的 L4 结构/同步/代码滚动及 L5 双栏/单列回归继续保留；全量 Playwright 123/123 通过。
