# 实现记录：全站搜索 Cmd+K（C-20260705-113，M11-S1）

> Status: verified
> Stable ID: C-20260705-113
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-11
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. L4：SEARCH spec 红 → store +isSearchOpen + SearchPalette.vue 绿。
2. Header 按钮 + Master 挂载 + HEADER-04。
3. e2e + 门禁 + 真机 + 回写 + 两提交 + 双轨部署。

## 关键实现笔记

- 数据源纠偏：Home hooks 实际导出 useCategoryData(): Category[]（普通数组非 ref）——组件顶层拍平一次为 SearchEntry[]。
- Teleport to body + v-if 由 store.isSearchOpen 驱动；spec 里 stubs Teleport 直挂。
- 全局 Cmd/Ctrl+K 挂 window（组件常驻 Master 生命周期同页壳），再按一次切换关闭；面板 input 聚焦天然被 C-111 播放器守卫覆盖零冲突。
- 遮罩 @click.self 关闭（避免点结果项冒泡误关）。
- 连带发现并修复：docs/plans/index.md 出现主表整块重复 + 三表行漏插——根因是 prettier 会重排表格列宽使含空格的 startswith 锚点失效；全量去重 + 按 C-ID 计数校验（103-113 恰各 3 行）。**教训：锚点只用「| C-ID |」不含列宽空格。**

## 2026-07-11 布局维护

- `Header.vue` 将既有搜索按钮从 `.blank` 后移到 `h1` 后，右外边距改为左外边距 24px；语言切换与四个外链仍由 `.blank` 推到右侧。
- `TC-VIEW-HEADER-09` 锁定 `h1 -> search -> blank` 的直接兄弟顺序；既有 HEADER-08 继续证明点击打开面板。
- Playwright 实测 1600px 中文与 900px 英文 Header；900px 下搜索后仍有 27px 弹性空白，控件无重叠、页面无横向溢出。
- 维护复验：Vitest 291 文件 / 2093 用例、coverage、Playwright 115/115 与 125 页 `pnpm verify` 全部通过。

## 自测报告

见 [test-cases.md](./test-cases.md)：2000/2000 + e2e 104/104 + 真机面板核验。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
- 2026-07-11：提交 `8d07b8b` 按 Owner 截图反馈前移搜索入口；功能语义不变，全量 L3/L4、coverage、L5 与 verify 通过。
