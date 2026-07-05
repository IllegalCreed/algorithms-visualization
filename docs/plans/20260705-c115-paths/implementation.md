# 实现记录：学习路径页（C-20260705-115，M11-S3）

> Status: verified
> Stable ID: C-20260705-115
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. L3 红 → src/data/paths.ts 绿；2. L4 红 → Paths.vue + 路由 + 面板入口 绿；3. e2e + 门禁 + 真机 + 回写 + 两提交 + 双轨部署。

## 关键实现笔记

- 四条路径 46 站：新手 12 / 面试 14 / 图论 10 / 进阶 10；名称/大类经 useCategoryData 查找表联查（同 C-114 模式）。
- SearchPalette 空态快捷行抽象为 goTo(path)——速查/路径两行共用。
- 页面纯数据渲染无播放器；样式复用新拟物卡 + 流式步骤链（编号圆片 + 箭头）。

## 自测报告

见 [test-cases.md](./test-cases.md)：2012/2012 + e2e 106/106。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
