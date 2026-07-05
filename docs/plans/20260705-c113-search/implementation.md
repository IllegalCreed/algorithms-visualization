# 实现记录：全站搜索 Cmd+K（C-20260705-113，M11-S1）

> Status: verified
> Stable ID: C-20260705-113
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
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

## 自测报告

见 [test-cases.md](./test-cases.md)：2000/2000 + e2e 104/104 + 真机面板核验。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
