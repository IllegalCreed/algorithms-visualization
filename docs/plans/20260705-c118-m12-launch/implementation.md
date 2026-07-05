# 实现记录：M12 营销启动包（C-20260705-118）

> Status: verified
> Stable ID: C-20260705-118
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现

OG 卡（HTML→Playwright 截图）→ meta → 物料 → e2e 扩展 → 收官回写。

## 关键实现笔记

- OG 图生成链路：HTML 卡片临时放 public → dev server 渲染 → Playwright 1200×630 截图 → public/og-cover.png → 删临时（file:// 协议被 MCP 拦，走 http 绕行）。
- 地基纠偏是本变更最重要的产出之一：backlog「地基已有 C-034」与代码现实不符——prerender/routing-meta/JSON-LD 未落地；已在 requirements 落档并把 prerender 列 M12 执行期技术项。
- launch-posts.md 三渠道物料 + Owner 站外行动清单（统计/赞赏/搜索提交/录屏）——站内外分界清晰交接。

## 自测报告

见 [test-cases.md](./test-cases.md)。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。完结清单收官。
