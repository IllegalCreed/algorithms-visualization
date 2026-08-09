# 测试用例：算法播放器可视化与代码同屏布局

> Status: in-progress
> Stable ID: C-20260809-137
> Type: feature
> Owner: IllegalCreed
> Created: 2026-08-09
> Last reviewed: 2026-08-09
> Progress: 10%
> Blocked by: none
> Next action: 先红后绿执行 TC-PLAYER-LAYOUT-137
> Replaces: none
> Replaced by: none
> Related plans: C-20260619-006, C-20260705-116
> Related tests: TC-PLAYER-LAYOUT-137-01..05

| Case ID                 | 标题                          | 层级 | 类型       | 前置条件                               | 期望                                    | 自动化路径                                      | 状态    |
| ----------------------- | ----------------------------- | ---- | ---------- | -------------------------------------- | --------------------------------------- | ----------------------------------------------- | ------- |
| TC-PLAYER-LAYOUT-137-01 | 播放器舞台分离视觉区与检查区  | L4   | regression | 挂载 bubble-sort module                | 轨道与 code/vars 分属两个明确区域       | `src/components/player/AlgorithmPlayer.spec.ts` | pending |
| TC-PLAYER-LAYOUT-137-02 | 可视化与代码仍共享当前步骤    | L4   | regression | 播放器停在第 0 步并推进一步            | 字幕、active line、变量随同一控制步更新 | `src/components/player/AlgorithmPlayer.spec.ts` | pending |
| TC-PLAYER-LAYOUT-137-03 | 长代码在检查区内滚动到当前行  | L4   | regression | CodePanel 有多行代码和远端 active line | 只滚动 `.code` 容器，页面不被强制滚动   | `src/components/player/CodePanel.spec.ts`       | pending |
| TC-PLAYER-LAYOUT-137-04 | Dijkstra 桌面视口实现真正同屏 | L5   | browser    | `/docs/dijkstra`，视口 1440px          | graph 与 code 同时可见且无横向溢出      | `e2e/dijkstra.e2e.ts`                           | pending |
| TC-PLAYER-LAYOUT-137-05 | 900px 视口退回单列且可操作    | L5   | browser    | `/docs/dijkstra`，视口 900px           | 不横溢出，视觉区和检查区纵向排列        | `e2e/dijkstra.e2e.ts`                           | pending |

## 反向验证

- 去掉 `.player-stage`/`.visual-pane`/`.inspector-pane` 层级断言时，TC-PLAYER-LAYOUT-137-01 必须失败。
- 将窄屏断点错误设为过低时，TC-PLAYER-LAYOUT-137-05 必须失败或检测到横向溢出。

## 执行结果

待补。
