# 测试用例：性能与质量审计（C-20260705-117，M11-S5）

> Status: approved
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

（交付后回填）

## 变更历史

- 2026-07-05：创建（draft → approved）。
