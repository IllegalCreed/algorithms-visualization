# 测试用例：算法播放器四面板网格与可视化防重叠

> Status: verified
> Stable ID: C-20260809-139
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 100%
> Blocked by: none
> Next action: 无；四个 Case 已先红后绿并纳入全量门禁
> Replaces: none
> Replaced by: none
> Related plans: C-20260809-137, C-20260809-138
> Related tests: TC-PLAYER-GRID-139-01..04

| Case ID               | 标题                             | 层级 | 类型       | 前置条件                           | 期望                                         | 自动化路径                                                             | 状态   |
| --------------------- | -------------------------------- | ---- | ---------- | ---------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- | ------ |
| TC-PLAYER-GRID-139-01 | 字幕与视觉轨拆为独立说明面板     | L4   | regression | 挂载共享 AlgorithmPlayer           | visual/code/explanation/vars 四区域存在      | `src/components/player/AlgorithmPlayer.spec.ts`                        | active |
| TC-PLAYER-GRID-139-02 | 柱轨与箭头按父宽等比例共享槽位   | L4   | regression | 三柱 BarsView 与 slotCount 指针轨  | 轨宽不超过 100%，箭头按百分比槽定位          | `src/components/BarsView.spec.ts`、`src/components/ArrowTrack.spec.ts` | active |
| TC-PLAYER-GRID-139-03 | 二分答案桌面柱轨不侵入代码面板   | L5   | regression | `/docs/binary-answer`、1440px 视口 | 11 柱均可见且 bars.right <= code.left        | `e2e/binary-answer.e2e.ts`                                             | active |
| TC-PLAYER-GRID-139-04 | 四面板窄屏按阅读顺序单列且不横溢 | L5   | responsive | `/docs/binary-answer`、900px 视口  | visual→explanation→code→vars，页面不横向溢出 | `e2e/binary-answer.e2e.ts`                                             | active |

## 反向验证

- 旧实现没有 `.explanation-pane`，TC-PLAYER-GRID-139-01 必须失败。
- 旧 11 柱轨右边界越过代码面板约 26px，TC-PLAYER-GRID-139-03 必须失败。

## 执行结果

- 红灯已确认：旧实现缺少 `.explanation-pane`，且 1440px 11 柱轨越过代码面板约 26px。
- 绿灯已确认：C139-01..02 的 L4 用例、C139-03..04 的 L5 用例全部通过；全量 303/2163 Vitest、125/125 Playwright 通过。
- 生产门禁：production/selfhost 各 190 页预渲染与 SEO 校验通过。
- 线上复查：自有域与 GitHub Pages 均为 HTTP 200；1440px 实测柱轨与代码面板间距 28px、双行对齐，900px 四面板顺序正确，两视口横向溢出均为 0。
