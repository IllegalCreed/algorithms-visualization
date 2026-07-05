# 测试用例：播放控制增强（C-20260705-111，M10-P2）

> Status: verified
> Stable ID: C-20260705-111
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-CTRL-LOOP-*`、`TC-CTRL-UI-*`、`TC-CTRL-KEY-*`、`TC-E2E-CTRL-01`

## L3 —— usePlayer 循环

| 用例 ID         | 场景                                                  | 期望                                     |
| --------------- | ----------------------------------------------------- | ---------------------------------------- |
| TC-CTRL-LOOP-01 | 开循环播放到末步                                      | 自动回第 0 步续播（isPlaying 保持 true） |
| TC-CTRL-LOOP-02 | 关循环（默认）到末步停；开循环后 atEnd 点 play 从头播 | 旧行为全等 + 循环重播                    |

## L4 —— TransportControls / AlgorithmPlayer 键盘

| 用例 ID        | 期望                                                       |
| -------------- | ---------------------------------------------------------- |
| TC-CTRL-UI-01  | 倍速下拉含 3×；选择后 emit setSpeed(3)                     |
| TC-CTRL-UI-02  | 循环按钮：点击 emit toggleLoop；props.loop=true 时带激活类 |
| TC-CTRL-KEY-01 | → 下一步、← 上一步（counter 变化）                         |
| TC-CTRL-KEY-02 | 空格切换播放/暂停                                          |
| TC-CTRL-KEY-03 | 焦点在 input（InputBar 文本框）时按键不响应播放器          |

## L5 —— e2e

| 用例 ID        | 期望                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- |
| TC-E2E-CTRL-01 | 快排页：按 → 两次 counter=3；空格播放再空格暂停；开循环 + 3× 拖到末步自动回卷（counter 变小） |

## 回归

loop 默认关 + 快捷键纯新增——既有 usePlayer.spec / TransportControls.spec / 全量 e2e 原样通过。

## 自测报告

- 执行：1984/1984 全绿、96.31%/95.92%；全量 e2e 101/101 回归（改动前跑）+ 新 TC-E2E-CTRL-01 首跑过。
- 新增 8 Case：CTRL-LOOP 2（fake timers 回卷续播/旧行为全等+atEnd 循环重播）+ CTRL-UI 2（3× 档/循环钮激活）+ CTRL-KEY 3（→←/空格 preventDefault/输入框守卫）+ E2E-CTRL 1。
- 真机：倍速四档含 3×、循环钮点击 ctl-active 激活；e2e 真键盘验证 →/←/空格 + 输入框聚焦不抢 + 末步循环回卷。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。8 Case 全绿。
