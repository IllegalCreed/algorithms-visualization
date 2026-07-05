# 测试用例：M12 营销启动包（C-20260705-118）

> Status: verified
> Stable ID: C-20260705-118
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L5（扩展既有用例）
> 命名空间：扩展 `TC-E2E-QUALITY-01`

## 用例

| 用例 ID                   | 期望                                                |
| ------------------------- | --------------------------------------------------- |
| TC-E2E-QUALITY-01（扩展） | 追加：head 含 og:image meta；/og-cover.png 请求 200 |

## 自测报告

- 执行：2012/2012 全绿；全量 e2e 107/107（QUALITY-01 扩展 og:image + /og-cover.png 200 断言通过）。
- OG 卡 54K、1200×630，视觉与站内新拟物一致（副标题首版被柱状元素截尾，缩短后重生成）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
