# 实现记录：播放控制增强（C-20260705-111，M10-P2）

> Status: verified
> Stable ID: C-20260705-111
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. L3：TC-CTRL-LOOP spec 红 → usePlayer +loop/toggleLoop 绿。
2. L4：TC-CTRL-UI 红 → TransportControls +3×/循环钮 绿；TC-CTRL-KEY 红 → AlgorithmPlayer 键盘监听 绿。
3. e2e + 门禁（全量回归）+ 真机 + 回写 + 两提交 + 双轨部署。

## 关键实现笔记

- 循环语义两处：scheduleNext 末步分支回卷 index=0 继续调度（isPlaying 保持）；play() 在 atEnd 且 loop 开时先回 0——关循环时两处都是旧路径字面全等。
- 键盘守卫：e.target 的 tagName ∈ {INPUT, TEXTAREA, SELECT} 直接 return——InputBar 打字、倍速下拉操作不被抢；空格 preventDefault 防页面滚动。
- 监听挂 window（onMounted/onUnmounted 成对），每页单播放器无冲突。
- spec 教训：play 按钮无 title 属性——用暂停图标（svg rect）/播放三角（polygon）判定播放态。

## 自测报告

见 [test-cases.md](./test-cases.md)：1984/1984 + e2e 回归 + 真机循环钮/键盘核验。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
