# 测试用例：性能与质量审计（C-20260705-117，M11-S5）

> Status: verified
> Stable ID: C-20260705-117
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L5
> 命名空间：`TC-E2E-QUALITY-01`

## 用例

| 用例 ID           | 层级 | 期望                                                                                                                                    |
| ----------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-QUALITY-01 | L5   | 首页：head 含 meta[name=description]；存在 main 地标；网格 img 全带非空 alt；/robots.txt、/sitemap.xml、/llms.txt 均 200 且内容正确开头 |

## 回归

全量单测/e2e；favicon 替换与 main 包裹不影响布局（e2e 全量兜底）。

## 自测报告

- 执行：2012/2012 全绿；全量 e2e 107/107（TC-E2E-QUALITY-01 首跑过）。
- **Lighthouse 复测（部署后同环境同设备）**：A11y 75 → **91**、SEO 75 → **100**、BP 100 保持——image-alt/meta-description/robots/landmark 四项全部转绿；剩 color-contrast（新拟物设计取舍，已落档）与 llms-txt 格式建议（文件已可达 200，格式建议部分采纳）。
- 真机静态四件套：robots.txt/sitemap.xml（95 URL）/llms.txt 自有域 200。

## 变更历史

- 2026-07-05：创建（draft → approved）。
