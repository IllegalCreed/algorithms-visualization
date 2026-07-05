# 需求：全站搜索 Cmd+K（C-20260705-113，M11-S1）

> Status: verified
> Stable ID: C-20260705-113
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M11 站点体验首项。114 页靠侧边菜单逐类翻找效率低；命令面板（Cmd+K）是现代文档站标配——任何页面一键呼出、键入即filter、回车即达。

## 目标

1. **SearchPalette 组件**（全局挂 Master）：遮罩 + 面板；输入即过滤（title/desc/url 模糊匹配，数据源复用首页 `useMain()` 的 9 大类 114 项）；结果显示 title + 所属大类 + desc 截断，上限 10 条；↑↓ 选择、Enter 跳转、Esc/点遮罩关闭；打开自动聚焦。
2. **入口**：全局 Cmd+K / Ctrl+K（preventDefault）；Header 新搜索按钮（🔍 + ⌘K 徽标）。
3. **store**：systemStore +`isSearchOpen`/`openSearch`/`closeSearch`（沿用既有开关惯例）。

## 验收标准

- 任意页 Cmd+K 呼出，输入「快排」→ 快速排序条目，Enter 跳 `/docs/quick-sort`；Esc 关闭；空查询显示提示、无结果显示空态。
- 播放器键盘快捷键与搜索无冲突（面板打开时 ←/→/空格不影响播放器——面板内输入框聚焦即被既有守卫覆盖）。

## 非目标

- 不做拼音/首字母匹配、不做搜索历史/热门推荐（S2 标签体系后再评估）；不做正文全文检索。

## 变更历史

- 2026-07-05：创建（draft → approved）。M11-S1：SearchPalette + Cmd+K + Header 入口。
