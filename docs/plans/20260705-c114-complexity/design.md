# 设计：复杂度速查页（C-20260705-114，M11-S2）

> Status: verified
> Stable ID: C-20260705-114
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 数据

`src/data/complexity.ts`：`export const COMPLEXITY: Record<string, { time: string; space: string; note?: string }>`（键 = url slug）。页面用 `useCategoryData()` 遍历九大类，逐项联查 COMPLEXITY——**名称/大类/顺序单一来源**，复杂度表只管三个字段；两边一致性由 L3 测试锁死。

## 页面 Complexity.vue

- 顶部：标签条（「全部」+ 九大类，点选单选过滤）+ 关键词输入（匹配名称/复杂度文本）+ 计数「N 个算法」。
- 主体：按大类分组 `<h2>` + 表（算法〔router-link〕/ 时间 / 空间 / 备注）；过滤后空组隐藏。
- 路由 `/docs/complexity`（Docs 壳内，懒加载）；不进九大类菜单（TC-HOOK 零改）。

## 入口

SearchPalette 空态提示行下：固定快捷行「⏱ 复杂度速查表」→ `/docs/complexity` + 关闭面板。

## 测试

L3 DATA 2（url 集合与九大类全等 / time·space 非空且 O( 开头惯例）+ L4 PAGE 4（渲染分组计数 / 标签过滤 / 关键词过滤 / 行链接）+ SEARCH 入口 1 + e2e 1 = 8 Case。

## 变更历史

- 2026-07-05：创建（draft → approved）。
