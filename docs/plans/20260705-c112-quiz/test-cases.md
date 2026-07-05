# 测试用例：测验模式（C-20260705-112，M10-P3）

> Status: verified
> Stable ID: C-20260705-112
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L4 / L5
> 命名空间：`TC-VIZ-QUIZCARD-*`、`TC-PLAYER-QUIZ-*`、`TC-MOD-QUIZ-01`、`TC-E2E-QUIZ-01`

## L4

| 用例 ID            | 期望                                                        |
| ------------------ | ----------------------------------------------------------- |
| TC-VIZ-QUIZCARD-01 | 渲染题目 + 全部选项按钮；未答无结果态                       |
| TC-VIZ-QUIZCARD-02 | 点正确项 → ✓ 态 + emit answered(true) + 显示继续按钮        |
| TC-VIZ-QUIZCARD-03 | 点错误项 → ✗ 态 + 正确项高亮 + emit answered(false)         |
| TC-VIZ-QUIZCARD-04 | 答后点继续 → emit resume                                    |
| TC-PLAYER-QUIZ-01  | module 无 quiz → 全程无题卡（112 页回归）                   |
| TC-PLAYER-QUIZ-02  | 自动播放到 quiz 步 → 暂停 + 出卡；题卡期间按 → 不换步       |
| TC-PLAYER-QUIZ-03  | 答对 + 继续 → 续播；同一步回拖不再出题                      |
| TC-PLAYER-QUIZ-04  | 到末步显示成绩 n/m（有题页）；无题页无成绩行                |
| TC-MOD-QUIZ-01     | bsearch/quick-sort 各 ≥2 quiz 步，answer 下标合法且题面非空 |

## L5

| 用例 ID        | 期望                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| TC-E2E-QUIZ-01 | 二分页空格播放 → 被题卡拦（暂停）→ 点正确项 ✓ → 继续播放 → 拖末步见成绩行 |

## 回归

无 quiz 模块零渲染（TC-PLAYER-QUIZ-01）+ 全量 e2e；键盘守卫仅题卡可见时生效（C-111 快捷键用例原样过）。

## 自测报告

- 执行：1993/1993 全绿、96.33%/95.89%；全量 e2e 103/103。
- 新增 10 Case：QUIZCARD 4 + PLAYER-QUIZ 4（fake timers 拦停/续播/回拖不重问/成绩行）+ MOD-QUIZ 1 + E2E-QUIZ 1。
- 连带修正：playback-controls e2e 从 quick-sort 页换 heap-sort 页——快排插桩后第 2 步出题卡、键盘守卫正确拦下 →（正确行为改变了该测试前提，非 flaky）。
- 真机：二分页探针步题卡浮现（题面 + 三选项新拟物按钮），答对✓续播、末步成绩 1/2；e2e 覆盖拦停→答对→续播→成绩全链路 + 固定页零题卡回归。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。10 Case 全绿。
