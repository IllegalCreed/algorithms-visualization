# 设计：全站搜索 Cmd+K（C-20260705-113，M11-S1）

> Status: verified
> Stable ID: C-20260705-113
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 结构

- **systemStore**：`isSearchOpen = ref(false)` + `openSearch/closeSearch`。
- **SearchPalette.vue**（src/components/）：
  - 数据：`useMain()` 拍平为 `{title, desc, url, category}[]`（一次性 computed）。
  - 过滤：`q` 非空 → `title/desc/url` includes（url 匹配转小写），slice(0, 10)；空 q → 提示行。
  - 键盘（面板内 input keydown）：↑↓ 循环移动 activeIdx、Enter 跳 `/docs/${url}` + close、Esc close。
  - 全局 Cmd+K/Ctrl+K：组件挂 window keydown（e.metaKey||e.ctrlKey && e.key==='k' → preventDefault + open + nextTick focus）。
  - 遮罩点击 close；open 时 watch 聚焦 input、清 q。
  - 样式：fixed 居中面板（新拟物）+ 半透明遮罩；结果项 hover/active 高亮。
- **Header**：blank 后插搜索按钮（放大镜 SVG + `⌘K` 小徽标），点击 `openSearch()`。
- **Master.vue**：`<SearchPalette />` 常驻。

## 与播放器快捷键的关系

SearchPalette 打开时焦点在其 input——AlgorithmPlayer 的 onKeydown 已有 INPUT 守卫，天然无冲突（无需新逻辑）。

## 测试

L4 SEARCH 6（打开聚焦/过滤/键盘导航跳转/Esc 关/空态/无结果）+ HEADER 1（按钮开面板）+ e2e 1（Cmd+K → 输入 → Enter 跳转）= 8 Case。

## 变更历史

- 2026-07-05：创建（draft → approved）。
