# 设计：撤销第三方分析接入

> Status: verified
> Stable ID: C-20260710-129
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 边界

### 保留

- `src/analytics/utm.ts` 与对应 L3 测试。
- `scripts/generate-campaign-link.ts`、`pnpm marketing:link`。
- `docs/marketing/launch-posts.md` 已生成的 UTM 链接。

### 删除

- Umami provider/config/script/website ID 契约。
- `client`、`attribution`、`useRouteAnalytics` 与事件 payload 类型。
- App/SearchPalette/AlgorithmPlayer/IconLink 的统计接线。
- analytics 专用 Playwright project/e2e、隐私页和 Footer 入口。

## 未来方向

若宣传产生稳定流量，另立计划评审 Nginx 专用 `204` endpoint + 白名单 JSON access log + 48h/7d 聚合脚本。该方向不得在本次撤销中偷偷落地，也不得记录 IP、完整 referrer 或用户自由文本。

## 风险与回滚

- 撤销后无法看到播放等交互转化；当前阶段接受这一限制。
- UTM 仍会出现在落地 URL，可由现有主站访问日志做最小来源核查。
- 本变更本身是对未激活能力的回滚，不涉及数据迁移或第三方账号清理。

## 变更历史

- 2026-07-10：批准“保留 UTM、删除第三方 tracker”的最小回滚设计。
- 2026-07-10：实现与完整门禁验证通过；最终产物不含第三方 tracker、website ID 或统计隐私入口。
