# 测试用例：交互式算法播放器

> Status: verified
> Stable ID: C-20260619-006
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-19
> Last reviewed: 2026-06-19
> Progress: 100%
> Blocked by: none
> Next action: 已完成
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-003
> Related tests: `docs/test-cases/index.md`
> Related requirement: requirements.md

## 说明

本变更**产出**一批 L3/L4/L5 用例。下表是计划清单（status=planned）；每个 Task 落地后把对应 Case 登记进 `docs/test-cases/{index,by-layer,by-module}.md` 并置 active。两处保持一致。

测试分层裁剪为 L3（前端单元）/ L4（前端组件）/ L5（端到端）。

## 汇总统计（计划）

| 层级 | 测试文件 | Case 数 | 运行命令         |
| ---- | -------- | ------- | ---------------- |
| L3   | 2        | 18      | `pnpm test:unit` |
| L4   | 8        | 28      | `pnpm test:unit` |
| L5   | 1        | 1       | `pnpm test:e2e`  |
| 合计 | 11       | 47      | —                |

> L4 的 28 含「改写」的 `TC-VIEW-BUBBLE-01/02`（同 ID、新含义）与新增的 `TC-VIZ-ARROWTRACK-02`。

## 汇总统计（实测，2026-06-19）

| 层级 | 测试文件 | Case 数 | 通过数 | 运行命令         |
| ---- | -------- | ------- | ------ | ---------------- |
| L3   | 2        | 18      | 18     | `pnpm test:unit` |
| L4   | 8        | 28      | 28     | `pnpm test:unit` |
| L5   | 1        | 1       | 1      | `pnpm test:e2e`  |
| 合计 | 11       | 47      | 47     | —                |

全部通过。TC-E2E-PLAYER-01 取代 TC-E2E-BUBBLE-01（已标 superseded）。

## 全量 Case 清单

### L3 — `usePlayer` 传输状态机（`src/components/player/usePlayer.spec.ts`）

| Case ID      | 标题                                    |
| ------------ | --------------------------------------- |
| TC-PLAYER-01 | 初始停第 0 步且未播放                   |
| TC-PLAYER-02 | stepForward 前进且不越过末步            |
| TC-PLAYER-03 | stepBackward 后退且不越过首步           |
| TC-PLAYER-04 | seek 越界夹紧到合法范围                 |
| TC-PLAYER-05 | reset 回第 0 步并停止                   |
| TC-PLAYER-06 | play 按基准间隔逐步推进、到末步自动暂停 |
| TC-PLAYER-07 | pause 停止自动推进                      |
| TC-PLAYER-08 | setSpeed 加速后按新速率推进             |
| TC-PLAYER-09 | current 跟随 index                      |
| TC-PLAYER-10 | progress 从 0 到 1                      |

### L3 — 冒泡算法模块（`src/algorithms/bubble-sort.module.spec.ts`）

| Case ID          | 标题                                         |
| ---------------- | -------------------------------------------- |
| TC-BUBBLE-MOD-01 | 空/单元素也产出至少一个 done 步              |
| TC-BUBBLE-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验）   |
| TC-BUBBLE-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提） |
| TC-BUBBLE-MOD-04 | 不修改入参                                   |
| TC-BUBBLE-MOD-05 | 每步 point 合法，swap/noSwap 的 swapped 对应 |
| TC-BUBBLE-MOD-06 | 四门语言齐备                                 |
| TC-BUBBLE-MOD-07 | 每门语言每个 ExecPoint 行号落在源码行范围内  |
| TC-BUBBLE-MOD-08 | 实际出现的 point 都能在每门语言映射到行      |

### L4 — 可视化（`src/components/`）

| Case ID              | 标题                            | 文件                 |
| -------------------- | ------------------------------- | -------------------- |
| TC-VIZ-BAR-01        | 渲染数值                        | `Bar.spec.ts`        |
| TC-VIZ-BAR-02        | 高度随 percent 增大             | `Bar.spec.ts`        |
| TC-VIZ-BAR-03        | state 决定柱体 class            | `Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-01   | 渲染与数据等量的 Bar            | `BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-02   | 最大值柱最高、最小值柱最低      | `BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-03   | comparing 下标进入 comparing 态 | `BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-04   | sortedFrom 之后进入 sorted 态   | `BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-05   | slotWidth 透传给 ArrowTrack     | `BarsView.spec.ts`   |
| TC-VIZ-ARROWTRACK-02 | slotWidth 自定义时按其定位      | `ArrowTrack.spec.ts` |

### L4 — 播放器外壳（`src/components/player/`）

| Case ID           | 标题                               | 文件                        |
| ----------------- | ---------------------------------- | --------------------------- |
| TC-CODEPANEL-01   | 渲染默认语言(TS)所有行             | `CodePanel.spec.ts`         |
| TC-CODEPANEL-02   | 当前执行行随 point 经 lineMap 高亮 | `CodePanel.spec.ts`         |
| TC-CODEPANEL-03   | 切语言 Tab 后按该语言 lineMap 高亮 | `CodePanel.spec.ts`         |
| TC-VARPANEL-01    | 渲染每个变量的名与值               | `VariablePanel.spec.ts`     |
| TC-VARPANEL-02    | 与上一步比较，变化的行加 changed   | `VariablePanel.spec.ts`     |
| TC-VARPANEL-03    | 无 prev 时都不高亮                 | `VariablePanel.spec.ts`     |
| TC-TRANSPORT-01   | 未播放点主按钮 emit play           | `TransportControls.spec.ts` |
| TC-TRANSPORT-02   | 播放中点主按钮 emit pause          | `TransportControls.spec.ts` |
| TC-TRANSPORT-03   | atStart 时上一步禁用               | `TransportControls.spec.ts` |
| TC-TRANSPORT-04   | atEnd 时下一步禁用                 | `TransportControls.spec.ts` |
| TC-TRANSPORT-05   | 下一步 emit stepForward            | `TransportControls.spec.ts` |
| TC-TRANSPORT-06   | 重置 emit reset                    | `TransportControls.spec.ts` |
| TC-TRANSPORT-07   | 计数器显示 index+1 / total         | `TransportControls.spec.ts` |
| TC-TRANSPORT-08   | 拖动进度条 emit seek(值)           | `TransportControls.spec.ts` |
| TC-TRANSPORT-09   | 改速 emit setSpeed(值)             | `TransportControls.spec.ts` |
| TC-PLAYER-VIEW-01 | 渲染柱状图+代码+变量+控制          | `AlgorithmPlayer.spec.ts`   |
| TC-PLAYER-VIEW-02 | 默认第 0 步，点下一步到第 2 步     | `AlgorithmPlayer.spec.ts`   |

### L4 — 冒泡视图（改写，同 ID 新含义）

| Case ID           | 标题                                            | 文件                 |
| ----------------- | ----------------------------------------------- | -------------------- |
| TC-VIEW-BUBBLE-01 | （C-006 改写）挂载渲染 AlgorithmPlayer          | `BubbleSort.spec.ts` |
| TC-VIEW-BUBBLE-02 | （C-006 改写）初始渲染 10 根柱子且默认停第 0 步 | `BubbleSort.spec.ts` |

### L5 — 端到端（`e2e/bubble-sort.e2e.ts`）

| Case ID          | 标题                                    | 替代关系                                               |
| ---------------- | --------------------------------------- | ------------------------------------------------------ |
| TC-E2E-PLAYER-01 | 冒泡播放器：默认暂停/单步/跳末升序/重置 | 取代 `TC-E2E-BUBBLE-01`（自动动画升序，标 superseded） |

## 全量 Case 列表（落地后）

落地后见 `docs/test-cases/index.md`（主索引）、`by-layer.md`（分层）、`by-module.md`（模块；新增 `player` 组）。
