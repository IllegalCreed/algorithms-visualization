# 测试用例：分析、事件与渠道归因

> Status: superseded
> Stable ID: C-20260710-125
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md
> Replaced by: C-20260710-129

> 除仍由 `src/analytics/utm.spec.ts` 承载的 UTM/marketing-link Case 外，本文件中的 client、route、interaction、privacy、L5 与 ops Case 均已被 C129 撤销边界替代。

## 用例总览

| 层级  | Case ID 区间                    | 数量 | 自动化/验证位置                                    |
| ----- | ------------------------------- | ---- | -------------------------------------------------- |
| L3    | `TC-ATTR-UTM-125-01..06`        | 6    | `src/analytics/utm.spec.ts`、`attribution.spec.ts` |
| L3    | `TC-ANL-CLIENT-125-01..05`      | 5    | `src/analytics/client.spec.ts`                     |
| L3/L4 | `TC-ANL-PRIVACY-125-01..02`     | 2    | Footer spec、`src/analytics/privacy.spec.ts`       |
| L4    | `TC-ANL-ROUTE-125-01..03`       | 3    | `src/analytics/useRouteAnalytics.spec.ts`          |
| L4    | `TC-ANL-EVENTS-125-01..06`      | 6    | SearchPalette/AlgorithmPlayer/IconLink specs       |
| L3    | `TC-MARKETING-LINKS-125-01..02` | 2    | `src/analytics/utm.spec.ts`                        |
| L5    | `TC-E2E-ANL-125-01..02`         | 2    | `e2e/analytics.e2e.ts`                             |
| ops   | `TC-OPS-ANL-125-01..04`         | 4    | 服务器/线上/看板/保留策略核验                      |
| docs  | `TC-DOC-ANL-125-01`             | 1    | plan/index/marketing/roadmap 一致性                |
| 合计  |                                 | 31   |                                                    |

## L3 UTM 与归因

| Case ID                   | 场景                              | 预期                                                      |
| ------------------------- | --------------------------------- | --------------------------------------------------------- |
| TC-ATTR-UTM-125-01        | 四字段合法 token                  | 小写规范化并保留 source/medium/campaign/content           |
| TC-ATTR-UTM-125-02        | 空白、自由文本、邮箱/路径、超长值 | 值被拒绝，不进入 URL、storage 或事件                      |
| TC-ATTR-UTM-125-03        | 首次 campaign，后续新 campaign    | first 固定，current 更新；结构 version=1                  |
| TC-ATTR-UTM-125-04        | external/internal/direct referrer | 只保留外部 hostname；站内不覆盖；direct/none 回退         |
| TC-ATTR-UTM-125-05        | ChatGPT UTM/referrer              | 两种入口均聚合为 source=`chatgpt.com`                     |
| TC-ATTR-UTM-125-06        | storage 禁用、抛错或 JSON 损坏    | 自愈/内存回退，不抛业务异常                               |
| TC-MARKETING-LINKS-125-01 | 目标 URL 已有 query/hash          | 保留原参数/hash并按统一顺序写 UTM                         |
| TC-MARKETING-LINKS-125-02 | launch-post 目标集合              | 每个目标都能生成 HTTPS、合法且可反解析的 attributable URL |

## L3 Client

| Case ID              | 场景                      | 预期                                                       |
| -------------------- | ------------------------- | ---------------------------------------------------------- |
| TC-ANL-CLIENT-125-01 | provider none/配置缺失    | 不插 script、不写 attribution、不发请求                    |
| TC-ANL-CLIENT-125-02 | 完整 Umami 配置           | script defer、website ID、auto-track=false，且只插入一次   |
| TC-ANL-CLIENT-125-03 | load 前连续事件           | FIFO 最多 50 条，load 后按顺序 flush                       |
| TC-ANL-CLIENT-125-04 | script error/track 抛错   | 静默失败并保持页面可用                                     |
| TC-ANL-CLIENT-125-05 | payload 含未知 key/非法值 | 只发送事件白名单与安全标量；path 无 query/hash；无自由文本 |

## L4 Route

| Case ID             | 场景                         | 预期                                                     |
| ------------------- | ---------------------------- | -------------------------------------------------------- |
| TC-ANL-ROUTE-125-01 | 首次 ready 进入内容页        | 一次 page_view，path/page_name/page_type/deployment 正确 |
| TC-ANL-ROUTE-125-02 | SPA 从 A 导航到 B            | B 再发送一次，先后顺序正确                               |
| TC-ANL-ROUTE-125-03 | 仅 query/hash 或相同路由重放 | 不重复 page_view；`?input=` 不进入 payload               |

## L3/L4 隐私入口与告知

| Case ID               | 场景                 | 预期                                                 |
| --------------------- | -------------------- | ---------------------------------------------------- |
| TC-ANL-PRIVACY-125-01 | 首页 Footer 隐私入口 | 链接可访问、文案明确且移动端不被现有最小宽度裁切     |
| TC-ANL-PRIVACY-125-02 | 静态隐私与统计说明页 | 说明白名单、禁采项、供应商待确认状态、DNT 与禁用方式 |

## L4 交互事件

| Case ID              | 场景                       | 预期                                                |
| -------------------- | -------------------------- | --------------------------------------------------- |
| TC-ANL-EVENTS-125-01 | 搜索选择结果               | search select 含长度/结果数/slug，不含 query        |
| TC-ANL-EVENTS-125-02 | 搜索无结果后 Enter         | search no_result 发送一次，不含 query               |
| TC-ANL-EVENTS-125-03 | 播放按钮与空格             | 每次从暂停进入播放发送 play；pause/step/seek 不发送 |
| TC-ANL-EVENTS-125-04 | 合法/非法/恢复输入         | 仅合法 apply 发送 item_count，不含数组              |
| TC-ANL-EVENTS-125-05 | 全部测验首次完成/回拖      | 只发送一次 quiz_complete 汇总，不含题目或单题内容   |
| TC-ANL-EVENTS-125-06 | 微博/X/GitHub/个人主页点击 | 前两者分别 share；普通外链不发送                    |

## L5 与运维

| Case ID           | 场景                         | 预期                                                                 |
| ----------------- | ---------------------------- | -------------------------------------------------------------------- |
| TC-E2E-ANL-125-01 | 带 UTM 深链首访及 SPA 导航   | tracker 收到归因 page view，页面功能/SEO canonical 不受影响          |
| TC-E2E-ANL-125-02 | 搜索、播放、输入、分享交互   | mock endpoint 收到白名单事件且无 query/input 自由文本                |
| TC-OPS-ANL-125-01 | 服务器资源与隔离审计         | 若容量不足则否决同机部署且不改服务器；本次审计已命中该分支           |
| TC-OPS-ANL-125-02 | 生产测试 campaign            | dashboard 可见 page view、UTM 与至少三类核心事件                     |
| TC-OPS-ANL-125-03 | tracker/Umami 不可用         | 自有域与 Pages 仍可加载、搜索、播放，console 无未处理异常            |
| TC-OPS-ANL-125-04 | Cloud 保留、区域与凭据检查   | EU/实际期限留档；secret 不在 git/bundle/log，website ID 仅作公开配置 |
| TC-DOC-ANL-125-01 | C123/C124/C125 与路线图/索引 | C125 为当前 in-progress 入口，C126/C127 仍依赖其完成                 |

## TDD 记录

| 阶段            | 红测                                      | 绿测                            | 结果    |
| --------------- | ----------------------------------------- | ------------------------------- | ------- |
| T1 UTM/归因     | `./utm` / `./attribution` 不存在          | 2 files / 9 tests + type-check  | passed  |
| T2 client/route | `./client` / `./useRouteAnalytics` 不存在 | 2 files / 9 tests + type-check  | passed  |
| T3 交互事件     | 新增 6 条均因 0 次调用失败                | 4 files / 84 tests + type-check | passed  |
| T4 privacy/L5   | 首屏误报 `/`、Footer 移动端链接被裁切     | 2 privacy + 2 L5                | passed  |
| T5 full gates   | 全量 Vitest/coverage/L5/双 base           | 285/2060、112/112、95+95        | passed  |
| T6 production   | 服务器同机部署候选                        | 只读审计否决；Cloud 待外部输入  | partial |

## 变更历史

- 2026-07-10：创建 29 个 Case，进入 T1 红测；隐私入口实现后补录 2 个 Case，总计 31 个。
- 2026-07-10：T1 9 个用例通过；覆盖 UTM、launch-post links、首触/当前触、referrer/ChatGPT 与 storage 回退。
- 2026-07-10：T2 9 个用例通过；覆盖 none/Umami 配置、script/queue/failure/payload 与首次/SPA/query 去重 page view。
- 2026-07-10：T3 六个新增事件用例先红后绿，相关 84/84；普通外链、自由文本、暂停/单步/恢复默认保持无事件。
- 2026-07-10：TC-OPS-ANL-125-01 通过“资源不足则否决”分支：远端保持零改动，生产候选转 Umami Cloud Hobby。
- 2026-07-10：T4 定向通过 2 个隐私用例与 2 个 Chromium L5；修正 router ready 前误报 `/` 和移动端 Footer 裁切。
- 2026-07-10：T5 全门禁通过；client 补配置 façade、Pages base、malformed URL 与队列标题覆盖，生产统计继续失败关闭。
- 2026-07-10：C129 删除第三方分析实现及对应自动化；保留 UTM Case，其他 Case 在全局索引转 superseded。
