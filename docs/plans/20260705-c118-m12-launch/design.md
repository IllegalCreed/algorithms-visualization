# 设计：M12 营销启动包（C-20260705-118）

> Status: verified
> Stable ID: C-20260705-118
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## OG 卡生成

HTML 卡片（新拟物同款视觉：V logo + 站名 + 副标 + 五徽标 + 柱状元素 + 域名）经 Playwright 1200×630 截图 → public/og-cover.png（54K）。index.html 追加 og:type/title/description/url/image + twitter:card/image。SPA 单入口全站一张卡；per-page OG 依赖 prerender（列 M12 执行期技术项）。

## 发布物料

launch-posts.md 按营销 roadmap 六节软文模板：掘金（痛点→产品→技术实现→情感点）/ V2EX（干货清单体）/ B站三支脚本（钩子→高潮→导流）；发布节奏（双帖同日→视频→数据对比押注）；Owner 站外行动清单。

## 测试

TC-E2E-QUALITY-01 扩展断言 og:image meta + /og-cover.png 200（并入既有质量 e2e）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
