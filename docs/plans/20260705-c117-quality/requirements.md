# 需求：性能与质量审计 + 低垂修复批（C-20260705-117，M11-S5）

> Status: verified
> Stable ID: C-20260705-117
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M11-S5 性能。先审计后动手：构建产物 + Lighthouse（生产站）基线，只修低垂果实、记录取舍。

## 审计基线（2026-07-05）

- **产物**：109 个 JS chunk（路由级分割充分）；主包 292K（gzip ~85K）、AlgorithmPlayer 共享 chunk 200K、Shiki 按语言分包（ts 180K/py 72K/go 48K/rust 16K 懒加载）；assets 总 2.0M。**结论：结构健康，无立即优化项**；「20 条 View 异步化再拆 AlgorithmPlayer chunk」列为候选（收益中等、回归面大，不做）。
- **Lighthouse（desktop，自有域）**：Best Practices **100** / Accessibility 75 / SEO 75 / Agentic 67。失败项：image-alt、meta-description、robots.txt 无效（实为 404 回退 HTML——**public 里从来没有 robots**）、无 main landmark、color-contrast（新拟物低对比设计语言，**记录为设计取舍不修**）、llms.txt 缺失。

## 目标（低垂修复批）

1. `index.html`：+meta description；favicon 从 vite.svg 换站点 V logo（public/favicon.svg）。
2. `public/`：+robots.txt（引 sitemap）、+sitemap.xml（95 URL 全站生成）、+llms.txt（站点说明——AI 浏览友好）。
3. 首页网格与 Header 图标 `<img>` +alt；Master 的 RouterView 包 `<main>` 地标。
4. color-contrast 记录取舍；AlgorithmPlayer chunk 拆分列候选池。

## 验收标准

修复后 Lighthouse A11y/SEO 显著提升（image-alt/meta/robots/landmark 四项转绿）；全量回归绿。

## 变更历史

- 2026-07-05：创建（draft → approved）。
