# 测试用例：复杂度速查页（C-20260705-114，M11-S2）

> Status: verified
> Stable ID: C-20260705-114
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3 / L4 / L5
> 命名空间：`TC-DATA-CPLX-*`、`TC-VIEW-CPLX-*`、`TC-VIZ-SEARCH-07`、`TC-E2E-CPLX-01`

## L3

| 用例 ID         | 期望                                                     |
| --------------- | -------------------------------------------------------- |
| TC-DATA-CPLX-01 | COMPLEXITY 键集合 = useCategoryData 全部 url（不多不少） |
| TC-DATA-CPLX-02 | 每条 time/space 非空且以 O( 或 期望/摊还 开头            |

## L4

| 用例 ID          | 期望                                                |
| ---------------- | --------------------------------------------------- |
| TC-VIEW-CPLX-01  | 渲染九大类分组 + 总计数 114                         |
| TC-VIEW-CPLX-02  | 点大类标签 → 只显该组 + 计数变化；再点「全部」还原  |
| TC-VIEW-CPLX-03  | 关键词过滤（如 log）→ 条目缩减、空组隐藏            |
| TC-VIEW-CPLX-04  | 行内名称为 router-link 指向 /docs/{url}             |
| TC-VIZ-SEARCH-07 | 搜索面板空态含「复杂度速查表」快捷行，点击跳转+关闭 |

## L5

| 用例 ID        | 期望                                                           |
| -------------- | -------------------------------------------------------------- |
| TC-E2E-CPLX-01 | 直开 /docs/complexity → 分组表可见；点标签过滤；点某行跳详情页 |

## 回归

菜单/首页九大类零改动（TC-HOOK 不动）；SearchPalette 既有 6 例原样。

## 自测报告

- 执行：2007/2007 全绿、96.27%/95.66%；全量 e2e 105/105。
- 新增 8 Case：DATA-CPLX 2（92 条与九大类 url 全等 + 书写惯例）+ VIEW-CPLX 4 + VIZ-SEARCH-07 + E2E-CPLX-01。
- 修正：条目数为 92（九大类网格全集；「114 页」含首页/文档壳等非算法页）；e2e h1 选择器歧义（Header 也有 h1）→ .article h1。
- 真机：标签条 + 过滤框 + 92 计数 + 分组表（绿链/等宽复杂度/备注）全部正常。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。8 Case 全绿。
