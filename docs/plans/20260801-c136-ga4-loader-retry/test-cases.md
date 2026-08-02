# 测试用例：GA4 标签加载失败后的安全重试

> Status: verified
> Stable ID: C-20260801-136
> Type: bugfix
> Owner: IllegalCreed
> Created: 2026-08-01
> Last reviewed: 2026-08-01
> Progress: 100%
> Blocked by: none for automated tests
> Next action: 无代码动作；四站已部署并完成同浏览器 Network/Realtime 对照，继续等待普通报告处理
> Replaces: none
> Replaced by: none
> Related plans: C-20260730-135
> Related tests: TC-ANL-GA4-136-01..04, TC-ANL-HYDRATION-136-01

| Case ID                 | 标题                           | 层级 | 类型       | 前置条件                | 步骤                           | 期望                                            | 自动化路径                                       | 状态   |
| ----------------------- | ------------------------------ | ---- | ---------- | ----------------------- | ------------------------------ | ----------------------------------------------- | ------------------------------------------------ | ------ |
| TC-ANL-GA4-136-01       | 标签失败后安全重试且当前页去重 | L3   | regression | granted、合法 ID        | 触发 script error 后再次 grant | 失败节点被替换、script 单例、page_view 仍为一次 | `src/analytics/googleAnalytics.spec.ts`          | active |
| TC-ANL-GA4-136-02       | 官方 gtag arguments 命令形态   | L3   | contract   | 使用内建 gtag           | 初始化并读取 dataLayer         | 队列项非 Array，可还原正确 config 命令          | `src/analytics/googleAnalytics.spec.ts`          | active |
| TC-ANL-GA4-136-03       | Quiz 标签失败后安全重试        | L3   | regression | Quiz granted、合法 ID   | 触发 script error 后再次 grant | 失败节点替换、当前页 `page_view` 仍一次         | `quiz/apps/quiz-app/.../googleAnalytics.spec.ts` | active |
| TC-ANL-GA4-136-04       | Quiz 官方 gtag arguments 形态  | L3   | contract   | 使用内建 gtag           | 初始化并读取 dataLayer         | 队列项非 Array，可还原正确 config 命令          | `quiz/apps/quiz-app/.../googleAnalytics.spec.ts` | active |
| TC-ANL-HYDRATION-136-01 | 个人站同意 UI 首屏树一致       | L4   | regression | SSR + 已存 localStorage | 构建并加载同意组件             | mounted 前为空树，不产生 hydration mismatch     | `personal/.vitepress/theme/privacy.spec.ts`      | active |

## 反向验证

- 删除 `script.onerror`：TC-ANL-GA4-136-01 失败，重试仍命中旧节点。
- 恢复 rest array 入队：TC-ANL-GA4-136-02 失败。

## 执行结果

- 红灯：算法站、个人站、Type Pal 和 Quiz 的 loader/SSR 回归断言均在对应旧实现上复现失败。
- 绿灯：算法站 303 文件 / 2158 用例、个人站 8 用例、Type Pal 第一阶段 123 文件 / 2305 用例、Quiz 22 文件 / 160 用例均通过相关门禁。
- 算法站：303 文件 / 2158 用例、coverage、119 条 Playwright、production/selfhost 各 190 页全绿。
- 个人站：2 文件 / 8 用例、`pnpm adsense:check` 与完整 VitePress 构建（2038.87 秒）全绿。
- Type Pal：123 文件 / 2305 用例、typecheck、build 与本次文件 Biome 检查全绿。
- Quiz：22 文件 / 160 用例、type-check、production build 与 analytics ESLint 全绿。
