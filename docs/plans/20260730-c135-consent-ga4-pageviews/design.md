# 设计：同意后启用 GA4 最小页面浏览统计

> Status: verified
> Stable ID: C-20260730-135
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-30
> Last reviewed: 2026-07-30
> Progress: 100%
> Blocked by: none
> Next action: 保持 basic consent 与零自定义事件边界
> Replaces: C-20260710-129
> Replaced by: none
> Related plans: C-20260710-125、C-20260710-129、C-20260727-134
> Related tests: TC-ANL-GA4-135-\_
> Related requirement: requirements.md

## 总体方案

将能力拆成三层：

1. `consent.ts` 只负责三态同意值、localStorage 和同意变更事件，任何异常返回 `unset`。
2. `googleAnalytics.ts` 负责 fail-closed gate、Google script 单例、URL 清洗、标准 `page_view` 和撤回停发。
3. `AnalyticsConsent.vue` 负责中英文 UI；`main.ts` 只把 Vue Router 的当前页和 `afterEach` 订阅适配给分析控制器。

GA4 后台已关闭 Enhanced Measurement，因此代码和后台共同保证本期只有标准页面浏览。

## 涉及模块与文件

### 新增

- `src/analytics/consent.ts`
- `src/analytics/consent.spec.ts`
- `src/analytics/googleAnalytics.ts`
- `src/analytics/googleAnalytics.spec.ts`
- `src/components/AnalyticsConsent.vue`
- `src/components/AnalyticsConsent.spec.ts`

### 修改

- `src/main.ts`：注册 production-only 路由适配。
- `src/App.vue`：全局渲染同意 UI。
- `.env.production`、`.env.selfhost`：配置公开 Measurement ID。
- C129 四文档、计划/测试索引、overview/roadmap/marketing 文档。
- 个人站中英文隐私政策。

### 不动

- SearchPalette、AlgorithmPlayer、测验、分享等交互组件。
- `src/analytics/utm.ts` 与 `marketing:link`。
- AdSense loader 与广告后台配置。

## 数据与隐私设计

- localStorage key 仅保存 `granted` 或 `denied`，不含时间、用户 ID 或指纹。
- `page_location` 使用当前 origin + pathname + 合法四字段 UTM；`page_path` 只有 pathname。
- 不把任意 query/hash、搜索词、算法输入或 referrer 放进事件参数。
- GA4 仍可能按 Google 的服务边界处理浏览器/设备特征、大致位置与 Cookie；隐私政策明确说明。

## 状态机

```text
unset ──接受──> granted ──拒绝──> denied
  └────拒绝──> denied ──接受──> granted
```

- `unset` / `denied`：无 script、无 event。
- `granted`：初始化一次并发送当前页；后续仅 pathname 变化发送。
- 从 `granted` 到 `denied`：设置 `ga-disable-*` 并停止发送。

## 兼容与回滚

- 旧 consent key 不存在时默认关闭，不影响现有访客。
- GA 不可达时只有第三方脚本失败，核心 SPA 不依赖其 load/error。
- 回滚可删除 App/main 接线和两环境 ID；UTM 与 AdSense 不受影响。
- C129 保留为历史记录并标注 `Replaced by C-20260730-135`，不静默改写撤销原因。

## 测试设计

### L3

- TC-ANL-GA4-135-01：非生产、缺失/非法 ID 均零副作用。
- TC-ANL-GA4-135-02：unset/denied 不加载、不发送。
- TC-ANL-GA4-135-03：granted 只加载一次，首次页只发送一次。
- TC-ANL-GA4-135-04：URL 只保留 pathname 与合法 UTM，丢弃 input/query/hash。
- TC-ANL-GA4-135-05：SPA pathname 变化计页，同路径 query/hash 变化去重，撤回后停发。
- TC-ANL-GA4-135-06：存储异常与非法 consent 值失败关闭。

### L4

- TC-ANL-GA4-135-07：首次显示中英文说明，接受/拒绝写入状态。
- TC-ANL-GA4-135-08：已选择后显示隐私设置入口，可重新打开并修改。

### L5

- TC-E2E-ANL-135-01：开发态真浏览器无 Google 请求，同意 UI 不阻塞导航。
- 生产脚本请求由 L3 注入测试和双 base 构建产物检查覆盖，不对 Google 真实 endpoint 跑自动化。

## 风险与替代方案

- 直接把标签写入 `index.html` 会在同意前加载，已拒绝。
- Consent Mode advanced 会在拒绝前发送无 Cookie ping，本期不采用；使用 basic consent，未同意不加载。
- 复用同一 GA4 property 会混合不同产品报表；后台已采用独立 property。
