# 实现记录：播放器控件与可视化轨道窄屏布局

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
> Related design: design.md

## 改动清单

- 播放器手机五列 grid 的按钮从 `width:100%` 改为固定 44px 并居中；速度选择框固定为 96px（仍保留 44px 高度）。
- Queue/Deque 空态 wrapper 增加 `is-empty`，手机空画布宽度跟随可用容器；非空车道保持既有内部横滚。
- BucketView/CountView 改为单行、局部 `overflow-x:auto`，桶列不可收缩，保留 6px 内边距保护阴影。
- `scripts/prerender.mjs` 将 preview origin 生成的同源 asset/modulepreload 链接归一化为当前 base 的站内路径；`scripts/verify-seo.mjs` 对 loopback 资源地址加失败门禁。
- `responsive.mobile.e2e.ts` 新增 `TC-PLAYER-142-01`、`TC-VIZ-142-02`、`TC-VIZ-142-03`。

## 实际涉及文件

- `src/components/player/TransportControls.vue`
- `src/components/structures/QueueViz.vue`
- `src/components/structures/DequeViz.vue`
- `src/components/BucketView.vue`
- `src/components/CountView.vue`
- `e2e/responsive.mobile.e2e.ts`
- `scripts/prerender.mjs`
- `scripts/verify-seo.mjs`

## 与设计偏差

无。设计中的“桶轨始终一行、超出只在组件内滚动”“空态独立收缩”和“静态资源不携带 preview origin”均按方案落地。

## 踩坑与处理

基线浏览器测量确认五个 `.ctl` 在 770px 窄布局下被 grid 拉成约 136×44，速度框约 281×44；先加入尺寸断言确认红灯，再固定尺寸。计数轨基线在 390px 产生 5+1 两行，空队列固定 472px 画布超出 318px wrapper；对应 fail 断言在修复后全绿。

## 数据处理 / 部署

无数据迁移。代码提交 `de8da04`（布局）与 `3ef748a`（预渲染资源归一化）后，运行 `./scripts/deploy.sh` 原子发布自有域，并由 push 触发 GitHub Pages；不需要 Nginx 配置变化。

## 验证记录

已完成定向验证：

- 基线反向验证：三条新增 L5 几何用例在旧样式下失败。
- `pnpm exec playwright test e2e/responsive.mobile.e2e.ts --project=mobile-chromium --reporter=line`：9/9 通过。
- `pnpm exec playwright test e2e/queue.e2e.ts e2e/counting-sort.e2e.ts e2e/bucket-sort.e2e.ts --project=chromium --reporter=line`：4/4 通过。
- `pnpm test:unit:run src/components/player/TransportControls.spec.ts src/components/player/AlgorithmPlayer.spec.ts`：76/76 通过。
- `pnpm type-check`：通过。
- `pnpm verify`：通过（304 个测试文件 / 2178 个用例；production 190 页 SEO 与 bundle 门禁全绿）。
- `pnpm coverage`：通过（Statements 93.25%、Branches 84.89%、Functions 90.31%、Lines 93.69%）。
- 全量 `pnpm exec playwright test --reporter=line`：134/134 通过（Desktop 125/125、mobile 9/9）。
- `pnpm build:selfhost`：190 页、SEO 与 bundle 门禁通过，静态 HTML 无 loopback 资源地址。
- Pages workflow run `31358485357`：build 与 Deploy 均 success；自有域 `./scripts/deploy.sh` 原子切换成功。

最终线上复核：`https://algo.illegalscreed.cn/docs/queue/`、`/docs/counting-sort/`、`/docs/binary-answer/` 返回 200，播放器控件为 44×44、速度框 96×44；Pages 与自有域均使用最终提交资源。

## 遗留问题

无功能阻塞。窄屏横向滚动条是否显示由浏览器平台决定；真实 WebKit 触控外观仍属后续观察项。
