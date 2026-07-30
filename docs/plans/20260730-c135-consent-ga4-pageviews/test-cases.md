# 测试用例：同意后启用 GA4 最小页面浏览统计

> Status: verified
> Stable ID: C-20260730-135
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-30
> Last reviewed: 2026-07-30
> Progress: 100%
> Blocked by: none
> Next action: 按 48h / 7d 窗口观察聚合页面浏览
> Replaces: C-20260710-129
> Replaced by: none
> Related plans: C-20260710-125、C-20260710-129、C-20260727-134
> Related tests: TC-ANL-GA4-135-01..10、TC-DOC-ANL-135-01、TC-E2E-ANL-135-01
> Related requirement: requirements.md

| Case ID           | 标题                           | 层级 | 类型      | 前置条件                            | 步骤                                  | 期望                                                       | 自动化路径                                | 状态   |
| ----------------- | ------------------------------ | ---- | --------- | ----------------------------------- | ------------------------------------- | ---------------------------------------------------------- | ----------------------------------------- | ------ |
| TC-ANL-GA4-135-01 | 非生产或非法配置零副作用       | L3   | unit      | production=false 或 ID 非法         | 初始化控制器                          | 无 script、无 dataLayer、无监听发送                        | `src/analytics/googleAnalytics.spec.ts`   | active |
| TC-ANL-GA4-135-02 | 未选择和拒绝均不加载           | L3   | unit      | consent=unset/denied                | 初始化并模拟导航                      | 无 script、无 page_view                                    | `src/analytics/googleAnalytics.spec.ts`   | active |
| TC-ANL-GA4-135-03 | 同意后单例加载并发送首次页     | L3   | unit      | production=true、合法 ID            | 同意并重复触发                        | script/config 各一次、首次 page_view 一次                  | `src/analytics/googleAnalytics.spec.ts`   | active |
| TC-ANL-GA4-135-04 | 页面 URL 清洗                  | L3   | privacy   | URL 含 UTM、input、其他 query、hash | 发送页面浏览                          | 只保留 pathname 与合法四字段 UTM                           | `src/analytics/googleAnalytics.spec.ts`   | active |
| TC-ANL-GA4-135-05 | SPA 去重与撤回停发             | L3   | unit      | 已同意                              | 导航、同路径 query 变化、撤回、再导航 | pathname 变化计一次；query/hash 不重复；撤回后零新增       | `src/analytics/googleAnalytics.spec.ts`   | active |
| TC-ANL-GA4-135-06 | 存储异常失败关闭               | L3   | privacy   | storage 抛错/损坏                   | 读写 consent                          | 返回 unset，不抛出，不加载                                 | `src/analytics/consent.spec.ts`           | active |
| TC-ANL-GA4-135-07 | 中英文首次同意 UI              | L4   | component | consent=unset                       | 分别进入中英文路由并点击接受/拒绝     | 文案正确，选择写入并关闭面板                               | `src/components/AnalyticsConsent.spec.ts` | active |
| TC-ANL-GA4-135-08 | 可重新打开隐私设置             | L4   | component | 已有选择                            | 点击隐私设置并修改                    | 面板重新打开，新选择生效                                   | `src/components/AnalyticsConsent.spec.ts` | active |
| TC-ANL-GA4-135-09 | 环境 ID、开发禁用与首路由就绪  | L3   | unit      | 三份 Vite env 与 main 接线          | 读取配置及启动顺序                    | 双生产环境同一合法 ID；开发无 ID；mount/route ready 后启动 | `src/analytics/boundary.spec.ts`          | active |
| TC-ANL-GA4-135-10 | 核心交互零自定义分析事件       | L3   | privacy   | 搜索/播放器/Footer/分享源码         | 扫描分析导入与调用                    | 不导入 GA client，不调用 gtag/page_view                    | `src/analytics/boundary.spec.ts`          | active |
| TC-DOC-ANL-135-01 | C129 与 C135 替代关系          | docs | contract  | C129 requirements                   | 读取元信息                            | Status=superseded 且 Replaced by=C135                      | `src/analytics/boundary.spec.ts`          | active |
| TC-E2E-ANL-135-01 | 开发态无 Google 请求且导航可用 | L5   | e2e       | dev server                          | 拒绝/接受提示并导航                   | 无 Google 请求，核心导航正常                               | `e2e/analytics-consent.e2e.ts`            | active |

## 副作用分支清单

- 插入第三方 script：仅 TC-ANL-GA4-135-03 允许，其他 gate case 均断言不存在。
- 发送 `page_view`：TC-ANL-GA4-135-03..05 覆盖首次、路由、去重与停发。
- 写 localStorage：TC-ANL-GA4-135-06..08 覆盖成功、异常与修改。
- 注册路由/consent listener：TC-ANL-GA4-135-01..05 覆盖禁用、启用和销毁。

## 反向验证

- 将默认 consent 临时视作 granted 时，TC-ANL-GA4-135-02 必须失败。
- 将 URL 原 query 原样发送时，TC-ANL-GA4-135-04 必须失败。
- 删除 pathname 去重时，TC-ANL-GA4-135-05 必须失败。
- 将 analytics 移回 router ready 前启动时，TC-ANL-GA4-135-09 必须失败。

## 执行结果

- L3/L4：303 文件 / 2156 用例全绿；C135 定向 4 文件 / 18 用例全绿。
- Coverage：全仓 95.51% / 86.37% / 92.10% / 95.85%；`src/analytics` 行与函数 100%。
- L5：105 文件 / 119 用例全绿；C135 定向复跑 1/1。
- 双 base：production 与 selfhost 均完成 190 页预渲染和 SEO 校验。
- 自有域：算法站与个人站首页/隐私页均为 200；真浏览器同意前 script=0、Google 网络资源=0，核心页面可用。
