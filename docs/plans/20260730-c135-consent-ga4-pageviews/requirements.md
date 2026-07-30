# 需求：同意后启用 GA4 最小页面浏览统计

> Status: verified
> Stable ID: C-20260730-135
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-30
> Last reviewed: 2026-07-30
> Progress: 100%
> Blocked by: none
> Next action: 按 48h / 7d 窗口观察聚合页面浏览；任何自定义事件另开 plan
> Replaces: C-20260710-129
> Replaced by: none
> Related plans: C-20260710-125、C-20260710-129、C-20260727-134
> Related tests: TC-ANL-GA4-135-\_

## 背景

Owner 已在同一 Google Analytics 账号下为个人站、算法可视化站和 Type Pal 分别建立独立 GA4 属性，要求把算法站接入自己的属性。2026-07-10 的 C129 因 Umami 成本与可用性撤销第三方 tracker；本次选择无需新增付费基础设施的 GA4，并以更窄的“用户同意后仅页面浏览”边界替代 C129 的零 tracker 结论。

## 用户故事

- 作为站点 Owner，我希望看到算法站的独立访问趋势，不与其他产品混合。
- 作为访客，我希望在明确同意前不加载 Google Analytics，并能拒绝或随后修改选择。
- 作为算法学习者，我的搜索词、算法输入、播放、测验和分享行为不应作为自定义事件发送。

## 要做什么

- production 与 selfhost 构建使用算法站专属 GA4 Measurement ID。
- 首次访问展示中英文同意提示；未选择或拒绝时不加载 `gtag.js`。
- 同意后加载一次 Google tag，并为首次页面和后续 SPA 路由发送标准 `page_view`。
- 页面 URL 只保留 pathname 与通过既有规则校验的四个 UTM 字段；丢弃其他 query 与 hash。
- 提供可重新打开的隐私设置入口；撤回同意后停止后续发送。
- 更新个人站托管的中英文隐私政策，准确说明个人站与算法站的实际边界。

## 不做什么

- 不恢复 C125 的搜索、播放、输入、测验、分享或其他自定义事件。
- 不发送搜索词、算法数组、题目答案、自由文本、完整 referrer 或任意 query/hash。
- 不在开发、测试或预渲染阶段发送真实统计。
- 不接入 Google Tag Manager，不新增付费 CMP、后端、数据库或日志采集端。
- 不把 Measurement ID 当作秘密，也不读取或提交任何 Google 账号凭据。
- 不声称 GA4 能识别具体个人、保证归因准确或替代法律意见。

## 业务规则

1. 默认状态是 `unset`，与 `denied` 一样失败关闭。
2. 只有 `granted` 且为 production build、Measurement ID 合法时才可加载或发送。
3. Google script 在一个页面生命周期内最多插入一次。
4. 同一路径的 query/hash 变化不重复计页；真正的 SPA pathname 变化计一次。
5. 允许的 campaign 参数仅为合法 `utm_source`、`utm_medium`、`utm_campaign`、`utm_content`。
6. Analytics 故障不得阻塞页面、路由、播放器或其他核心能力。

## 边界与异常

- localStorage 不可用、值损坏、事件 detail 非法：按 `unset` 处理，不加载统计。
- Measurement ID 缺失或格式非法：不加载、不发送。
- Google script 被网络或内容拦截器阻止：页面继续工作。
- 用户先同意后拒绝：设置 GA disable 标记，当前页面不再发送后续路由事件。
- 用户先拒绝后同意：清除 disable 标记，加载一次脚本并发送当前页面。

## 验收口径

- 对默认、拒绝、同意、撤回、非法配置、SPA 导航和 URL 清洗均有自动化用例。
- 开发环境无 Google Analytics 网络副作用。
- 构建产物只包含公开 Measurement ID，不包含 token、Cookie 或账号凭据。
- `pnpm verify`、`pnpm coverage`、全量 Playwright 与双 base 构建通过。
- C129 与全局索引标注已由 C135 替代，隐私政策和项目当前事实同步。

## 开放问题

- 无。本次 Owner 请求即为范围批准。

## 变更历史

- 2026-07-30：Owner 要求将个人站、算法站和 Type Pal 分别接入分析；算法仓库建立 C135。
- 2026-07-30：Owner 批准提交与发布；算法站和个人站自有域完成上线验证。
