# 分析与渠道归因执行手册

> Status: superseded
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Plan: C-20260710-125
> Replaced by: C-20260710-129
> Production analytics: withdrawn; no third-party tracker is configured

> **历史记录，禁止继续执行激活清单。** C129 已删除 Umami 配置、transport、事件、隐私入口与专用 L5；当前只保留下面的 UTM 命名规范和 `pnpm marketing:link`。

## C125 历史决策（已撤销）

- 生产候选：Umami Cloud Hobby，优先 EU 区域。
- 前端：provider-neutral 类型化事件层，`none|umami`；配置不完整时失败关闭。
- Cookie：tracker 不使用统计 Cookie，启用 `data-do-not-track=true`。
- 域名：只允许 `algo.illegalscreed.cn` 与 `illegalcreed.github.io`。
- 自托管：2026-07-10 只读审计否决。同机仅 1.8 GiB RAM、available 约 591 MiB、无 swap/Docker/PostgreSQL，已有多组服务。
- 数据最小化：page view 去除自由 query/hash；referrer 只保留 origin；custom event 不重复附加 UTM 属性，依赖 Umami session/UTM 过滤，减少 Cloud 用量。

官方依据：

- [Umami Cloud overview](https://docs.umami.is/docs/cloud)
- [Umami Cloud FAQ](https://docs.umami.is/docs/cloud/faq)
- [Umami Cloud sign up](https://docs.umami.is/docs/cloud/sign-up)
- [Tracker configuration](https://docs.umami.is/docs/tracker-configuration)
- [Tracker functions](https://docs.umami.is/docs/tracker-functions)
- [Anonymous sessions](https://docs.umami.is/docs/sessions)
- [Events API filters](https://docs.umami.is/docs/api/events)
- [Cloud export](https://docs.umami.is/docs/cloud/export-data)
- [Cloud account deletion](https://docs.umami.is/docs/cloud/delete-account)

## 激活清单（历史，禁止执行）

以下动作需要 Owner 的邮箱与 Cloud 控制台，不在仓库或自动化中代办：

- [ ] 注册 Umami Cloud Hobby 并完成邮箱验证码。
- [ ] 选择 EU 数据区域。
- [ ] 创建 website：`算法可视化` / `algo.illegalscreed.cn`。
- [ ] 记录控制台生成的公开 website ID 与 tracker URL；不提供密码或 API key。
- [ ] 确认 replay、heatmap、performance 与 identity 功能保持关闭。
- [ ] 在 Billing/Usage/Data 页面确认 Hobby 的事件额度、实际保留期限与删除能力。
- [ ] 若保留期无法控制在 180 天内，明确接受供应商期限或更换方案，并同步隐私页。

获得 website ID 后的仓库动作：

1. 在 `.env.production` 与 `.env.selfhost` 增加相同的 `VITE_UMAMI_WEBSITE_ID`；website ID 是公开 tracker 配置，不是 secret。
2. 把 `public/privacy.html` 的 pending 状态改成已启用，并填写 EU 与实际保留期。
3. 跑 `pnpm verify`、coverage、全量 Playwright；确认 bundle 不含邮箱、密码、API key。
4. 双轨发布后，用下面的测试 campaign 访问主站并完成 play/input_apply/share。
5. 在 Cloud dashboard 核对 page view、UTM 和至少三类事件后，C125 才能转 verified。

## UTM 规范（仍有效）

| 字段           | 含义          | 允许示例                                      |
| -------------- | ------------- | --------------------------------------------- |
| `utm_source`   | 平台/来源域   | `juejin`、`v2ex`、`bilibili`、`chatgpt.com`   |
| `utm_medium`   | 渠道形态      | `community`、`video`、`social`、`ai-referral` |
| `utm_campaign` | 发布主题/批次 | `launch-2026q3`、`en-pilot-2026q3`            |
| `utm_content`  | 具体素材/位置 | `project-story`、`quick-sort-demo`            |

值统一小写，只允许 ASCII 字母、数字、点、下划线、连字符，最长 64。禁止邮箱、自由中文、空格和路径。

生成命令：

```bash
pnpm marketing:link -- \
  --url 'https://algo.illegalscreed.cn/docs/quick-sort?input=9,5,1' \
  --source v2ex \
  --medium community \
  --campaign launch-2026q3 \
  --content quick-sort-demo
```

测试 campaign：

```text
https://algo.illegalscreed.cn/?utm_source=c125-test&utm_medium=qa&utm_campaign=analytics-validation&utm_content=owner-check
```

`docs/marketing/launch-posts.md` 当前已生成：

| 渠道 | source     | medium      | content           | 目标             |
| ---- | ---------- | ----------- | ----------------- | ---------------- |
| 掘金 | `juejin`   | `community` | `project-story`   | Home             |
| V2EX | `v2ex`     | `community` | `project-intro`   | Home             |
| V2EX | `v2ex`     | `community` | `quick-sort-demo` | Quick Sort input |
| B站  | `bilibili` | `video`     | `s1-quick-sort`   | Quick Sort       |

## 事件字典（历史，已撤销）

| 事件              | 触发                               | 属性                                          | 不发送                         |
| ----------------- | ---------------------------------- | --------------------------------------------- | ------------------------------ |
| `page_view`       | 首次 ready 与 route path/name 变化 | 净化 path/title；UTM 进入受控统计 URL         | `input`、其他 query、hash      |
| `search`          | 选择结果或无结果 Enter             | action、query length、result count、可选 slug | 搜索词                         |
| `play`            | 控件或空格从暂停进入播放           | algorithm、trigger、step index                | caption、代码、输入值          |
| `input_apply`     | 合法输入已应用                     | algorithm、item count                         | 数组内容与 input query         |
| `quiz_complete`   | 本页题目首次全部完成               | algorithm、correct、total                     | 题目、选项、单题答案           |
| `share`           | 微博/X intent 点击                 | channel、净化 path                            | 分享文案、完整 URL query       |
| `language_switch` | C126 站点语言切换成功              | from、to、path                                | 当前未接线，不代表代码语言 tab |

所有 custom event 自动附加 `deployment=pages|selfhost`。Umami 原生事件/会话可按 UTM 过滤，不重复存储六个归因属性。

## 48 小时复盘（历史模板）

| 指标                | 值  | 口径/限制                                             |
| ------------------- | --- | ----------------------------------------------------- |
| Page views          |     | Umami page view；注明 ad blocker/DNT 造成的不可观测量 |
| Visitors / visits   |     | 使用 dashboard 原始口径，不改名为注册用户             |
| Top source/campaign |     | UTM + referrer origin                                 |
| Top landing pages   |     | 净化 path                                             |
| `play`              |     | 事件数与 visitors/visits（若 dashboard 提供）         |
| `input_apply`       |     | 事件数                                                |
| `quiz_complete`     |     | 事件数；不代表学习效果                                |
| `share`             |     | intent 点击，不等于发布成功                           |
| 异常                |     | tracker 错误、机器人峰值、Pages/selfhost 比例         |

有效互动代理：发生 `play`、`input_apply`、`quiz_complete`、`share` 任一事件。若 dashboard 无法按 visitor 去重，只报告事件/visit 代理，不写“用户转化率”。

## 7 天复盘（历史模板）

- 对比各 source/campaign 的 visits、landing page 与核心事件。
- 使用 Umami retention 只描述回访统计，不推断个人学习成果。
- 记录内容页差异、评论反馈、样本量与 DNT/ad blocker 限制。
- 每个渠道给出 `continue`、`adjust` 或 `stop`，附原因与下一次实验。
- 将产品问题拆成独立 bug/内容/功能 plan，不在复盘文档里直接改需求历史。

## 隐私与故障（历史设计）

- 用户可见说明：`public/privacy.html`，首页 Footer 可达。
- tracker 被拦截、Cloud 故障或配置不完整时，客户端清空队列并静默禁用；页面、搜索、播放器和预渲染不依赖统计。
- sessionStorage 只存白名单渠道字段并随标签页会话清除。
- Cloud endpoint 在网络层可见源 IP；Umami 官方说明匿名 session hash 由 IP、User-Agent 与 website ID 派生，并提供地区统计。本项目不把 IP 放入 event data 或自定义身份字段。
- website ID 和 script URL 可公开；邮箱、密码、APP_SECRET、API key 不进入仓库、bundle、日志或 generated artifact。

## 变更历史

- 2026-07-10：创建。记录 Cloud Hobby 激活、UTM、事件、48h/7d 与隐私/故障口径；生产仍等待 website ID 和 retention 确认。
- 2026-07-10：C129 撤销第三方分析与激活路线；本文转为历史记录，仅 UTM 规范继续有效。
