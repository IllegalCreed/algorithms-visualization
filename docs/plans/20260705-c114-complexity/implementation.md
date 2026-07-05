# 实现记录：复杂度速查页（C-20260705-114，M11-S2）

> Status: verified
> Stable ID: C-20260705-114
> Owner: IllegalCreed
> Created: 2026-07-05
> Last reviewed: 2026-07-05
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD）

1. L3：DATA spec 红 → src/data/complexity.ts（114 条）绿。
2. L4：PAGE spec 红 → Complexity.vue + 路由 绿；SEARCH-07 红 → 面板入口 绿。
3. e2e + 门禁 + 真机 + 回写 + 两提交 + 双轨部署。

## 关键实现笔记

- 数据资产 92 条（非 114——那是页面总数）；键=slug，名称/大类由 useCategoryData 联查（单一来源），L3 spec 双向集合全等锁死——后续新增算法忘补复杂度会直接红。
- 复杂度口径：time 主写常用/最坏（期望/摊还/平均 前缀标注），space 为辅助空间；细分（最好/最坏）进 note。
- 页面纯组合式（无播放器）；标签单选 + 关键词过滤叠加；路由放 docs children 首位。
- 入口走 SearchPalette 空态快捷行——九大类菜单/首页零改动（TC-HOOK 不动）。

## 自测报告

见 [test-cases.md](./test-cases.md)：2007/2007 + e2e 105/105 + 真机核验。

## 变更历史

- 2026-07-05：创建（draft）。
- 2026-07-05：交付验收（draft → verified）。
