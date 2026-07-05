# 设计：性能与质量审计（C-20260705-117，M11-S5）

> Status: verified
> Stable ID: C-20260705-117
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 改动清单

- index.html：meta description（92 算法/四语言/自定义输入/测验一句话）+ favicon.svg 引用。
- public/favicon.svg（V logo）、robots.txt、sitemap.xml（脚本从 Home hooks 抓 slug 生成：/ + complexity + paths + 92 算法 = 95 URL）、llms.txt（站点摘要 + 入口 + 大类）。
- Item.vue / IconLink.vue：img :alt（条目/链接标题）。
- Master.vue：`<main>` 包 RouterView。

## 取舍记录

- color-contrast：新拟物灰底灰字是全站设计语言，改则伤视觉一致性——接受扣分。
- AlgorithmPlayer 200K chunk：20 View 异步化可再拆，但改播放器核心回归面大、gzip 后收益 ~几十 K——列候选不做。

## 测试

e2e site-quality 1 例（meta description 存在 / main 地标 / 首页 img 全带 alt / robots+sitemap+llms 可达 200）；既有全量回归。修复后重跑 Lighthouse 记录对比。

## 变更历史

- 2026-07-05：创建（draft → approved）。
