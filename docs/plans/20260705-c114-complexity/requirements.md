# 需求：复杂度速查页 + 标签筛选（C-20260705-114，M11-S2）

> Status: verified
> Stable ID: C-20260705-114
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M11-S2。114 个算法的时间/空间复杂度散落在各页正文里——复习与对比需要一张总表；顺带把「按大类筛选」做成通用交互。

## 目标

1. **数据资产** `src/data/complexity.ts`：全部 114 算法 `{url, time, space, note?}`（url 与首页九大类对齐——名称/大类联查不重复维护）。
2. **速查页** `/docs/complexity`：按大类分组的复杂度表（名称可点跳详情页 / 时间 / 空间 / 一句话备注）；顶部**九大类标签**点选过滤 + 关键词输入过滤；条目计数。
3. **入口**：SearchPalette 空态提示下加固定快捷行「⏱ 复杂度速查表」（菜单九大类结构不动，TC-HOOK 零改）。

## 验收标准

- 数据完整性由测试保证：complexity 条目与 useCategoryData 的 url 集合完全一致（不多不少）、time/space 非空。
- 页面标签/关键词过滤即时生效；任意行点击跳对应算法页。
- 全量回归绿。

## 非目标

- 不做最好/最坏/平均三栏细分（note 里点到）；不做排序交互；不做导出。

## 变更历史

- 2026-07-05：创建（draft → approved）。M11-S2：数据资产 + 速查页 + 标签筛选 + 搜索面板入口。
