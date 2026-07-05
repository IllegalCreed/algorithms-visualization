# 设计：播放控制增强（C-20260705-111，M10-P2）

> Status: verified
> Stable ID: C-20260705-111
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## usePlayer（additive）

`const loop = ref(false)` + `toggleLoop()`；`scheduleNext` 末步分支：loop 开 → `index=0` 继续调度（不停播）；`play()` 在 atEnd 且 loop 开时先回 0 再播。默认 false——全部既有行为字面全等（usePlayer.spec 零改动通过）。

## TransportControls

`SPEEDS = [0.5, 1, 2, 3]`；新 props `loop: boolean` + emit `toggleLoop`；「循环」按钮（🔁 SVG 环形箭头，激活态 `.ctl-active` 绿色高亮）放在倍速下拉旁。

## AlgorithmPlayer 键盘

`onMounted` 挂 window keydown、`onUnmounted` 摘除：

```ts
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement;
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return; // 输入态守卫
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    stepForward();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    stepBackward();
  } else if (e.key === ' ') {
    e.preventDefault();
    isPlaying ? pause() : play();
  }
}
```

## 测试

L3 usePlayer 循环 2 例（fake timers：开循环播完回 0 续播 / 关循环末步停 + atEnd play 回 0）；L4 TransportControls 2 例（3× 档 + 循环钮切换高亮与 emit）；L4 AlgorithmPlayer 键盘 3 例（→/←/空格、输入框聚焦不响应）；L5 e2e 1 例（键盘操控 + 循环全链路）。共 8 Case。

## 零回归论证

loop 默认关、快捷键为纯新增交互路径、SPEEDS 追加不改既有档位——点击路径与旧版字面全等；全量 e2e 回归兜底。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致。
