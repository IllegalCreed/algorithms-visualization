# 测试：AdSense 主域审核与算法站接入

> Status: verified
> Stable ID: C-20260727-134
> Type: ops
> Owner: IllegalCreed
> Created: 2026-07-27
> Last reviewed: 2026-07-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成；持续观察 AdSense 后台异步抓取与审核结果
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-129
> Related tests: TC-ADS-ROOT-134-_, TC-ADS-ALGO-134-_, TC-ADS-BUILD-134-_, TC-ADS-LIVE-134-_

## Case 清单

| Case ID             | 层     | 状态   | 验证目标                                       | 执行入口                               |
| ------------------- | ------ | ------ | ---------------------------------------------- | -------------------------------------- |
| TC-ADS-ROOT-134-01  | script | active | 主域 ads.txt 精确、robots 指向 sitemap         | personal `pnpm adsense:check`          |
| TC-ADS-ROOT-134-02  | script | active | 主域只有 account meta，不加载广告脚本          | personal `pnpm adsense:check`          |
| TC-ADS-ROOT-134-03  | script | active | 中英文真实首页、六个信任页与正确项目 URL       | personal `pnpm adsense:check`          |
| TC-ADS-ROOT-134-04  | script | active | 四个 VitePress 示例页与导航均已清理            | personal `pnpm adsense:check`          |
| TC-ADS-ALGO-134-01  | L3     | active | publisher 常量和算法站 ads.txt 精确一致        | `src/monetization/adsense.spec.ts`     |
| TC-ADS-ALGO-134-02  | L3     | active | Vite 插件仅 build 注入 meta/script             | `src/monetization/adsense.spec.ts`     |
| TC-ADS-ALGO-134-03  | L3     | active | 预渲染本地 fulfill Google script               | `src/monetization/adsense.spec.ts`     |
| TC-ADS-ALGO-134-04  | L4     | active | Footer 中英文隐私链接地址、文本和 rel 正确     | `src/views/Home/Footer/Footer.spec.ts` |
| TC-ADS-BUILD-134-01 | build  | active | production 190 页 SEO 门禁与 AdSense head 通过 | `pnpm build-only`                      |
| TC-ADS-BUILD-134-02 | build  | active | selfhost 190 页 SEO 门禁与 AdSense head 通过   | `pnpm build:selfhost`                  |
| TC-ADS-BUILD-134-03 | smoke  | active | development 首页不含 adsbygoogle loader        | 本地 curl                              |
| TC-ADS-LIVE-134-01  | L5     | active | 主域 ads.txt/robots/sitemap/信任页均 200       | 线上 curl                              |
| TC-ADS-LIVE-134-02  | L5     | active | 算法站 ads.txt 为纯文本且代表页含一次 loader   | 线上 curl                              |
| TC-ADS-LIVE-134-03  | L5     | active | 两站首页/中英文代表页无 4xx 与错误跳转         | 线上 curl                              |

## 红灯记录

个人站 readiness 首跑按预期报告两站授权入口相关缺失；算法站定向首跑为
`adsense.spec.ts` 3 项失败、`Footer.spec.ts` 1 项失败。实现后上述 Case
全部转绿。

## 绿灯记录

- personal `pnpm adsense:check` 与 `pnpm docs:build` 通过。
- 算法站 `pnpm verify`、`pnpm build:selfhost`、`pnpm coverage` 与
  `pnpm exec playwright test` 通过；基线为 300 文件 / 2136 Vitest、104
  文件 / 118 Playwright、190 页双 base。
- development smoke 通过，未发现 account meta 或 AdSense loader。
- 两个自托管域名 14 项线上断言全绿：代表 URL 均为 200、静态文件内容和
  content-type 精确、生产 HTML 注入次数及双语隐私链接正确。
- 个人站 Pages run `30247775040` 与算法站 Pages run `30247774849` 成功；
  两个 Pages CDN 的代表 HTML、信任页和 ads.txt 复查通过。

## 回归范围

- C129 的“无第三方 analytics tracker/事件”继续通过。
- 190 页 catalog、双语 SEO、SPA fallback 和双 base 构建数量不变。
- 个人站原有中文学习文档和内容审计不被重写。
