# 需求：学习路径页（C-20260705-115，M11-S3）

> Status: verified
> Stable ID: C-20260705-115
> Owner: IllegalCreed
> Created: 2026-07-05
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

M11-S3（backlog：「每大类推荐阅读顺序 + 前置/后继关系——把散落各页的『下一站』叙事页面化」）。各页正文里的「承接 X / 为 Y 铺路」是隐形知识图，新读者看不见全貌。

## 目标

1. **数据资产** `src/data/paths.ts`：四条推荐路径（新手入门 / 面试高频 / 图论专线 / 进阶专题），每条 `{id, title, desc, steps: url[]}`；url 有效性 L3 锁死。
2. **路径页** `/docs/paths`：每条路径一张卡——标题 + 一句话定位 + 有序步骤链（编号 → 名称链接 → 大类徽标），步骤链可横向流式换行。
3. **入口**：SearchPalette 空态第二快捷行「🗺 学习路径」。

## 验收标准

- 四条路径渲染完整、每步可点直达；步骤 url 与九大类集合校验通过；全量回归绿。

## 非目标

- 不做进度打卡/收藏（后续视需求）；不做图状前置关系可视化（列表式足够）。

## 变更历史

- 2026-07-05：创建（draft → approved）。
