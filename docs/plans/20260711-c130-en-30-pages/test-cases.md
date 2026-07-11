# 测试用例：英文目录扩展到 30 页

> Status: draft
> Stable ID: C-20260711-130
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 10%
> Blocked by: Owner 确认 30 页目标与二十页清单
> Next action: 批准范围后先写 registry/route/SEO 红测
> Replaces: none
> Replaced by: none
> Related plans: C-20260710-124、C-20260711-126、C-20260711-127
> Related tests: TC-I18N-CATALOG-130-_、TC-I18N-MODULE-130-_、TC-I18N-CONTENT-130-_、TC-SEO-I18N-130-_、TC-I18N-UI-130-_、TC-I18N-BUILD-130-_、TC-E2E-I18N-130-\_
> Related requirement: requirements.md

## 用例草案

当前 Case 均为 draft，不登记到全局 active 测试索引；计划批准并写出红测时再逐条登记。

| 层级  | Case ID 区间               | 数量 | 目标                                                                |
| ----- | -------------------------- | ---- | ------------------------------------------------------------------- |
| L3    | TC-I18N-CATALOG-130-01..04 | 4    | 30/27/2/1、唯一性、loader/router 全集、分类/complexity/path 完整性  |
| L3    | TC-I18N-MODULE-130-01..04  | 4    | 27 adapter 结构不变、无 Han、lineMap 不变、共享 helper 不修改原步骤 |
| docs  | TC-I18N-CONTENT-130-01..03 | 3    | 二十页正文完整、术语一致、交叉链接存在                              |
| L3/L4 | TC-SEO-I18N-130-01..04     | 4    | 125 页 registry、30 组 alternate、未翻译页无假映射、导航清理        |
| L4    | TC-I18N-UI-130-01..04      | 4    | Home/Menu/Search 29 页、Complexity 27 行、Paths 全覆盖、语言切换    |
| build | TC-I18N-BUILD-130-01..04   | 4    | 125 页发现、正文语言、sitemap/llms/manifest、production/selfhost    |
| L5    | TC-E2E-I18N-130-01..04     | 4    | 九大类深链、搜索/菜单、播放器、125 页 SEO 与窄视口                  |
| 合计  |                            | 27   |                                                                     |

## 关键断言

### Catalog 与路由

- 30 组页面恰好为 Home 1、工具 2、算法 27；中文/英文 name/path 唯一。
- `englishPageLoaders`、router 英文内容 routes、Home/Menu/Search 与 29 个非 Home catalog 条目双向相等。
- 27 个算法均有 category、iconKey、complexity 和 pathTags；九大类均至少一个英文算法。

### Module 与内容

- 对每个算法同输入生成中英步骤，步骤数、point、视觉轨、最终状态和输入规格语义一致。
- 英文 title/hint/caption/vars/quiz/source comments 不含 Han；每步有非空 caption，lineMap 与代码行数有效。
- 每个英文 SFC 包含概念、可视化读法、复杂度/限制和至少一个有效内部学习链接；核心术语与 style guide 一致。

### SEO 与构建

- registry 总数 125：`zh-CN` 95、`en` 30；30 组 alternate 双向、自含、带 x-default。
- 65 个未翻译中文内容页不输出英文 alternate；从英文切换只回退 `/en/`。
- production/selfhost 各生成 125 个目录入口，英文 `#app` 可见正文通过语言门禁。
- sitemap 与 125 canonical 相等，llms 同时覆盖中文全量和 English 30-page catalog。

### L5

- 每个新增分类至少抽一页直接深链，正文、菜单高亮、搜索、播放器、head 和语言切换正确。
- Home、Complexity、Paths 在桌面与 900px 窄视口无横向溢出、遮挡或空内容。

## TDD 顺序

1. T0 以现有 10/105 集合为 oracle，让 catalog/loader/派生视图的迁移 Case 先红；不得先改目标常量掩盖结构重复。
2. T1 迁移十页后，新旧 Case 全绿且构建仍为 105 页，再开始新增内容。
3. T2 每批五页先把预期推进到 15/110、20/115、25/120、30/125 并变红，再实现该批 adapter、SFC 和 metadata 到全绿。
4. T3 运行最终 125 页 build/L5；任何未完成内容不得进入 sitemap，也不得把红测留给后续批次。

## 变更历史

- 2026-07-11：创建 27 个 draft Case；待 requirements approved 后登记全局索引并进入 TDD。
