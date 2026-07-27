# 实现：AdSense 主域审核与算法站接入

> Status: verified
> Stable ID: C-20260727-134
> Type: ops
> Owner: IllegalCreed
> Created: 2026-07-27
> Last reviewed: 2026-07-27
> Progress: 100%
> Blocked by: none
> Next action: 已完成；当前工程主线为 C127 T4
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-129
> Related tests: TC-ADS-ROOT-134-_, TC-ADS-ALGO-134-_, TC-ADS-BUILD-134-_, TC-ADS-LIVE-134-_

## 任务状态

| 阶段              | 状态      | 说明                                                               |
| ----------------- | --------- | ------------------------------------------------------------------ |
| T0 线上与仓库审计 | completed | 已确认主域默认模板、两站 ads.txt 缺失/soft 404、现有部署路径       |
| T1 失败用例       | completed | 个人站 readiness 与算法站 AdSense/Footer 用例均先红                |
| T2 个人站实现     | completed | account meta、静态文件、真实首页、六个信任页和导航已完成           |
| T3 算法站实现     | completed | production head、预渲染 stub、ads.txt、双语 Footer 已完成          |
| T4 本地门禁       | completed | 两仓库定向测试、全量门禁、coverage、双 base、L5 与视觉检查通过     |
| T5 提交与发布     | completed | 两仓库已精确提交推送；两个自托管站点均已发布                       |
| T6 线上复查       | completed | 14 项自托管断言与两站 Pages 代表产物通过；两个 Pages workflow 成功 |

## 当前事实

- 个人站仓库：`/Users/zhangxu/workspace/IllegalCreedWebsite`
- 算法站仓库：`/Users/zhangxu/workspace/algorithms-visualization`
- 自托管服务器：`47.120.26.143`
- 个人站 Nginx root：`/var/www/illegal-site`
- 算法站 Nginx root：`/var/www/algorithms/dist`
- AdSense client：`ca-pub-4047630223754404`
- ads.txt publisher：`pub-4047630223754404`

## 验证记录

### 红灯

- 个人站首次执行 `pnpm adsense:check` 按预期报告 ads.txt、真实首页、信任页与示例清理缺失。
- 算法站首次定向运行中，`adsense.spec.ts` 3 项和 `Footer.spec.ts` 1 项按预期失败。

### 个人站

- `pnpm adsense:check` 通过。
- `pnpm docs:build` 通过，构建 2611 个 Markdown 页面；产物复查确认 account meta
  一次、无 AdSense loader、ads.txt 精确、robots/sitemap 与信任页完整。
- 390x844 与桌面 Playwright 视觉检查通过，无横向溢出；仅观察到既有 GA
  请求在本地被网络关闭，与本次 AdSense 接入无关。
- 提交 `5f6c4f1` 已推送 `IllegalCreed/IllegalCreed.github.io`；自托管已同步到
  `/var/www/illegal-site/`。
- GitHub Pages run `30247775040` 成功；Pages CDN 首页、信任页、ads.txt、
  robots.txt 与 sitemap.xml 复查通过。

### 算法站

- `pnpm verify` 通过：300 个 Vitest 文件 / 2136 个用例、production 190 页门禁全绿。
- `pnpm build:selfhost` 通过：selfhost 190 页门禁全绿。
- `pnpm coverage` 通过：Statements 95.49%、Branches 86.32%、Functions
  92.03%、Lines 95.82%。
- `pnpm exec playwright test` 通过：104 个文件 / 118 个 L5 用例全绿。
- development smoke 确认首页不含 account meta 或 AdSense loader。
- 提交 `1a50864` 已推送；GitHub Pages run `30247774849` 成功；`./scripts/deploy.sh`
  已完成自托管原子发布。
- Pages CDN 首页、快速排序页与 ads.txt 复查通过，meta/loader 均只有一次。

### 线上

- `https://illegalscreed.cn/` 只有一次 account meta 且不加载广告脚本。
- 主域首页、六个信任页、ads.txt、robots.txt、sitemap.xml 均返回 200；
  ads.txt 为精确 `text/plain`，sitemap 不再包含示例页。
- `https://algo.illegalscreed.cn/`、`/en/`、`/docs/quick-sort/` 与 `/ads.txt`
  均返回 200；代表 HTML 各含一次 account meta 和 loader，ads.txt 为精确
  `text/plain`，中英文隐私链接分别正确。

## 偏差与遗留

- Google 后台付款资料、CMP、Auto ads 开关和重新请求审核不属于仓库副作用，发布后由 Owner 在 AdSense UI 完成。
- Google 的 ads.txt 抓取与站点审核存在异步延迟，线上 200 只能证明技术入口就绪，不能证明后台立即更新。
- C134 不恢复 C129 撤销的行为分析；AdSense loader 是独立、显式批准的广告能力。
