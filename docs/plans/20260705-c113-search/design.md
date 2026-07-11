# 设计：全站搜索 Cmd+K（C-20260705-113，M11-S1）

> Status: verified
> Stable ID: C-20260705-113
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-11
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

## 2026-07-11 Header 布局调整

Owner 根据宽屏实机截图要求把搜索入口放到站点标题之后。当前直接子元素顺序为 `logo -> h1 -> search -> blank -> language -> external links`；搜索按钮使用 `margin-left: 24px`，弹性空白继续隔开站内主导航与右侧语言/外链动作。

本节只替代上方 2026-07-05 设计中的“blank 后插搜索按钮”这一布局细节，不改变 SearchPalette、快捷键、store、语言切换或外链行为。

## 与播放器快捷键的关系

SearchPalette 打开时焦点在其 input——AlgorithmPlayer 的 onKeydown 已有 INPUT 守卫，天然无冲突（无需新逻辑）。

## 测试

L4 SEARCH 6（打开聚焦/过滤/键盘导航跳转/Esc 关/空态/无结果）+ HEADER 1（按钮开面板）+ e2e 1（Cmd+K → 输入 → Enter 跳转）= 8 Case。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-11：Owner 要求搜索入口前移到标题之后；新增 `TC-VIEW-HEADER-09` 锁定 DOM 顺序，并保留 900px 无重叠门禁。
