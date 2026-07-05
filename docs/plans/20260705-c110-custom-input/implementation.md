# 实现记录：播放器自定义输入（C-20260705-110，M10-P1）

> Status: verified
> Stable ID: C-20260705-110
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. L3：parseInputArray spec 红 → player/inputSpec.ts 绿。
2. T0：InputBar spec 红 → InputBar.vue 绿；PLAYER-INPUT spec 红 → types +inputSpec? / usePlayer 兼容 Ref / AlgorithmPlayer 接线 绿。
3. T1：TC-MOD-INPUTSPEC-01 红 → 12 排序模块 +inputSpec 绿。
4. e2e + 门禁 + 真机 + 回写 + 两提交 + 双轨部署。

## 关键实现笔记

- usePlayer 兼容层：`Step[] | Ref<Step[]>` + `isRef ? : shallowRef` 归一——静态数组签名行为全等，usePlayer.spec 零改动通过；AlgorithmPlayer 持 shallowRef(steps)，applyInput 换 .value + reset()。
- URL 读写用 URLSearchParams + history.replaceState（保留 history.state）——不碰 vue-router、与 spa-github-pages 404 编码互不影响；jsdom 可测（replaceState 设 query 再 mount）。
- InputBar 的 modelText watch 同步外部输入（恢复默认后回显默认值并清错误）。
- less 混入带必选参数：`.neumorphism-concave(2px, 8px)` / `.neumorphism-btn(2px, 8px)`——vitest 不编译 less，写完即查 neumorphism.less 签名防 build 爆。
- 12 模块批量插桩：python 正则在 `sources: xxx,` 后插 `inputSpec: SORT_INPUT_SPEC`，聚合 spec 一例断言 12 模块 + 默认输入自过校验（防「输入条初值即报错」）。

## 自测报告

见 [test-cases.md](./test-cases.md)：1977/1977 + e2e 101/101 全量回归 + 真机 URL 直开核验。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
