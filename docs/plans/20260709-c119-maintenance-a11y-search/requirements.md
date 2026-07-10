# 需求：维护期搜索与可访问性收束（C-20260709-119）

> Status: verified
> Stable ID: C-20260709-119
> Owner: IllegalCreed
> Created: 2026-07-09
> Design: ./design.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 背景

1.0 封版后进入营销执行与维护期。2026-07-09 全面审计发现低风险高收益项集中在三处：搜索文档事实与实现不一致、播放器/导航的可访问性语义不足、首页/菜单/路由三份目录缺少直接对齐测试。

## 目标

1. SearchPalette 支持当前文档声明的标题、英文名、别名、拼音首字母静态索引。
2. 播放器控制条、输入条、搜索面板、首页/侧栏/头部导航具备基础可访问性语义。
3. 外链使用真实 `<a>` 并带 `noopener noreferrer`。
4. 增加首页/菜单 slug 与 router 路由表的一致性测试。
5. 修复 legacy `List.vue` 在全等数值下 percent 为 `NaN` 的边界问题。

## 非目标

- 不新增算法页，不改 oracle/module/sources 核心算法逻辑。
- 不做 Home/Menu/Router 的 catalog 大重构，只补防回归测试。
- 不处理 Lighthouse color-contrast 设计取舍。

## 验收标准

- 新增/调整 L3/L4 用例通过，覆盖搜索索引、语义化控件、路由对齐和 List 等值边界。
- `pnpm verify`、`pnpm coverage`、`pnpm test:e2e` 通过。

## 变更历史

- 2026-07-09：创建（implemented）。按审计建议推进维护期低垂修复批。
- 2026-07-09：本地门禁通过（implemented → verified）。
- 2026-07-10：收口审计发现拼音字典缺字与多音字错误，补齐后增加全目录防回归测试。
