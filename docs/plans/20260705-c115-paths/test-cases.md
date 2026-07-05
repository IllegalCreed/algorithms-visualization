# 测试用例：学习路径页（C-20260705-115，M11-S3）

> Status: verified
> Stable ID: C-20260705-115
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-DATA-PATHS-01`、`TC-VIEW-PATHS-*`、`TC-VIZ-SEARCH-08`、`TC-E2E-PATHS-01`

## 用例

| 用例 ID          | 层级 | 期望                                                         |
| ---------------- | ---- | ------------------------------------------------------------ |
| TC-DATA-PATHS-01 | L3   | 四条路径；steps url 全部 ∈ 九大类集合；各 ≥8 步且条内无重复  |
| TC-VIEW-PATHS-01 | L4   | 渲染 4 张路径卡 + h1                                         |
| TC-VIEW-PATHS-02 | L4   | 步骤为 router-link 指向 /docs/{url}，编号有序                |
| TC-VIEW-PATHS-03 | L4   | 步骤 title 属性含大类名（悬停提示）                          |
| TC-VIZ-SEARCH-08 | L4   | 面板空态含「学习路径」快捷行，点击跳转+关闭                  |
| TC-E2E-PATHS-01  | L5   | 直开 /docs/paths → 4 卡可见；点新手入门第 1 步跳 /docs/array |

## 回归

九大类菜单/首页零改动；SearchPalette 既有 7 例原样。

## 自测报告

- 执行：2012/2012 全绿；全量 e2e 106/106（新 TC-E2E-PATHS-01 首跑过）。
- 新增 6 Case：DATA-PATHS 1（四条路径 46 站 url 全有效无条内重复）+ VIEW-PATHS 3 + SEARCH-08 + E2E-PATHS-01。
- 真机级验证由 e2e Chromium 覆盖（四卡渲染 + 第 1 步直达 /docs/array）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。6 Case 全绿。
