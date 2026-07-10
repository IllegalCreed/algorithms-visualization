# 设计：维护期搜索与可访问性收束（C-20260709-119）

> Status: verified
> Stable ID: C-20260709-119
> Owner: IllegalCreed
> Created: 2026-07-09
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 搜索索引

SearchPalette 继续复用 `useCategoryData()` 作为 92 个条目的单一内容来源，在组件顶层拍平为 `SearchEntry[]`。每个 entry 额外生成 `tokens`：

- 中文标题、描述、slug、分类名；
- slug 派生的空格英文名、紧凑英文名、首字母缩写；
- 中文标题与分类名的拼音首字母；
- 少量高频别名表（如 Fenwick/BIT、quick-sort/qsort）。

过滤逻辑统一为 `entry.tokens.some(token => token.includes(query))`，保持上限 10 条。

拼音映射与 token 构造收敛到纯工具 `src/components/searchIndex.ts`。测试遍历首页全部条目与分类，要求每个汉字和 ASCII 字母/数字都能生成首字母；另对“调”“长”等多音字锁定标题语境中的实际读音。

## 可访问性语义

- SearchPalette：面板为 `role="dialog"` + `aria-modal`，输入框有 `aria-label`，结果项从可点击 `li` 改为按钮，空态用 `role="status"`。
- TransportControls：图标按钮补 `aria-label`，循环按钮补 `aria-pressed`，倍速 select 与 scrub range 补可访问名称，焦点态有可见 outline。
- InputBar：`label for` 关联输入框，错误提示用 `role="alert"` 与 `aria-describedby`。
- 导航：首页卡片、Splash CTA、Header logo、Docs 侧栏条目改为 `RouterLink`；外链图标改为真实 `<a target="_blank" rel="noopener noreferrer">`。

## 防回归

- 新增 `src/router/index.spec.ts`：Home/Menu slug 集合完全一致，且每个 slug 都有同名 `/docs/{slug}` 路由。
- `List.vue` 全等数据时 percent 返回 0.5，避免 `NaN` 进入 Block 样式。

## 取舍

本批次不抽 catalog 单一数据源。当前三份目录仍有重复，但路由覆盖测试能先把维护风险压下来；后续若继续扩容，再做 catalog 化重构。

## 变更历史

- 2026-07-09：创建（implemented）。
- 2026-07-09：本地门禁通过（implemented → verified）。
- 2026-07-10：收口审计补齐完整拼音映射与多音字防回归测试。
