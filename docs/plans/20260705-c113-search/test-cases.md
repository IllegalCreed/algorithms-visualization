# 测试用例：全站搜索 Cmd+K（C-20260705-113，M11-S1）

> Status: verified
> Stable ID: C-20260705-113
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-11
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L4 / L5
> 命名空间：`TC-VIZ-SEARCH-*`、`TC-VIEW-HEADER-08..09`、`TC-E2E-SEARCH-01`

## L4

| 用例 ID           | 期望                                                               |
| ----------------- | ------------------------------------------------------------------ |
| TC-VIZ-SEARCH-01  | store.isSearchOpen=true → 渲染面板 + 输入框；关 → 无面板           |
| TC-VIZ-SEARCH-02  | 输入「快速排序」→ 结果含 quick-sort 条目（title+大类）；上限 10 条 |
| TC-VIZ-SEARCH-03  | ↓↓↑ 移动 active 项 + Enter → router.push(/docs/…) + 关闭           |
| TC-VIZ-SEARCH-04  | Esc → 关闭；点遮罩 → 关闭                                          |
| TC-VIZ-SEARCH-05  | 空查询 → 提示行（无结果列表）                                      |
| TC-VIZ-SEARCH-06  | 无匹配 → 空态文案                                                  |
| TC-VIEW-HEADER-08 | Header 搜索按钮存在，点击 → store.isSearchOpen=true                |
| TC-VIEW-HEADER-09 | Header 直接子元素中搜索紧跟 h1，并位于 `.blank` 前                 |

## L5

| 用例 ID          | 期望                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| TC-E2E-SEARCH-01 | 任意页 Ctrl+K 呼出 → 输入「快速」→ Enter → URL 变 /docs/quick-sort；Esc 可关 |

## 回归

播放器快捷键零冲突（面板 input 聚焦被 C-111 守卫覆盖）；Header 语言切换、外链、搜索点击行为不变。搜索入口前移后，900px 英文 Header 仍须无横向溢出或控件重叠。

## 自测报告

- 执行：2000/2000 全绿（整数关口）、96.26%/95.70%；全量 e2e 104/104。
- 新增 8 Case：VIZ-SEARCH 6（显隐/过滤上限/键盘导航跳转/Esc+遮罩关/空态/无结果）+ VIEW-HEADER-08（按钮开面板）+ E2E-SEARCH-01（Ctrl+K→键入→Enter 直达 + Header 按钮 + Esc）。
- e2e 教训三连：goto 后立即按键时序不稳 → 先等 .article h1 就绪再 Ctrl+K。
- 真机：Header 🔍⌘K 按钮、遮罩面板、「排序」过滤 9 条结果（title+大类徽标+desc 截断）、首项高亮——全部正常。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。8 Case 全绿。
- 2026-07-11：新增 `TC-VIEW-HEADER-09`；先红为搜索位于 `.blank` 后，再移动模板转绿。定向 L4 10/10、定向 L5 2/2；全量 Vitest 291 文件 / 2093 用例、coverage、Playwright 115/115 与 125 页 `pnpm verify` 通过。
