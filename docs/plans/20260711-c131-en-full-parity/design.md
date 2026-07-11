# 设计：英文目录全量对齐

> Status: verified
> Stable ID: C-20260711-131
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Progress: 100%
> Blocked by: none
> Next action: 继续 C127 T3-B GitHub CLI typed client 与授权健康检查红测
> Replaces: none
> Replaced by: none
> Related plans: C-20260711-126、C-20260711-130、C-20260711-127、C-20260710-124
> Related tests: TC-I18N-CATALOG-131-_、TC-I18N-STRUCT-131-_、TC-I18N-MODULE-131-_、TC-I18N-CONTENT-131-_、TC-SEO-I18N-131-_、TC-I18N-UI-131-_、TC-I18N-BUILD-131-_、TC-E2E-I18N-131-_
> Related requirement: requirements.md

## 总体方案

C131 延续 C130 的 typed locale catalog、静态 loader map、独立英文 SFC 和逐算法 module adapter，不建立第二套路由或运行时翻译层。新增的结构性工作只有一项：让十五个数据结构知识页复用的二十个互动组件具备 additive 英文 copy。

```text
中文 95 页 ─┐
             ├─ LOCALIZED_PAGE_PAIRS（95 对）
英文 95 页 ─┘       ├─ router / Home / Menu / Search
                    ├─ Complexity / Paths
                    └─ SEO / prerender / sitemap / llms / manifest

AlgorithmPlayer 页：中文 module -> 英文展示 adapter -> 英文 SFC
数据结构页：共享状态机/Viz -> locale copy -> 中文或英文 SFC
```

## Catalog 类型

- `LocalizedPageKind` 增加 `structure`，避免把数据结构伪装成算法。
- 把 complexity、pathTags、pathOrder 抽到统一 learning-page metadata；`structure` 与 `algorithm` 都能进入 Complexity/Paths。
- 保留 `getEnglishAlgorithmPages()` 表示真实 77 个算法；新增 `getEnglishLearningPages()` 表示 15 数据结构 + 77 算法。
- Home 计数使用 92 个 learning pages，Search 的工具快捷文案不再写“27 algorithms”。
- `EnglishIconKey` 与 `homeCatalog` 图标 map 扩到 94 个内容条目，并用 `satisfies Record<...>` 保持编译期全量检查。

## 数据结构互动本地化

二十个 Viz 使用可选 prop：

```ts
const props = withDefaults(defineProps<{ locale?: SiteLocale }>(), {
  locale: 'zh-CN',
});
```

- 中文页面不传 prop，现有文本、测试与行为保持不变。
- 英文页面显式传 `locale="en"`；组件通过 typed copy object 选择按钮、提示与状态模板。
- 状态机仍在现有 composable；若 composable 自身生成中文状态，只增加可选 copy/locale 参数，不复制算法分支。
- 不在底层组件调用 `useRoute()`，避免展示组件与 Router 耦合，也让 L4 mount 保持简单。
- 每个批次同时验证默认中文快照、英文无 Han、关键交互结果与状态等价。

## AlgorithmPlayer 本地化

- 50 个新增 adapter 继续放在 `src/i18n/en/modules/<slug>.ts`，显式导入真实 module basename。
- 共享 helper 只处理结构化固定标签；每个执行点的 caption、quiz 和变量语义留在对应 adapter。
- 英文 adapter map 与 77 个 AlgorithmPlayer 中文 route 集合全等；任何新增/遗漏都由双向集合测试失败。
- 英文 SFC 继续保持独立、可审查的 Vue 模板，不引入 HTML 字符串或 `v-html`。

## 分批顺序

### T0 全量不变量

先把目标断言推进到 95 对、94 route、92 learning pages、77 adapters 与 190 SEO pages，确认现状按预期变红。

### T1-T3 数据结构三批

| 批次 | 页面                                                | 复用 Viz 数 |
| ---- | --------------------------------------------------- | ----------- |
| A    | Array、Linked List、Stack、Queue、Tree              | 9           |
| B    | Heap、Hash Table、Graph、Trie、Disjoint Set         | 6           |
| C    | LRU、Skip List、Segment Tree、B+ Tree、Bloom Filter | 5           |

每批同时完成 catalog、icon、loader、英文 SFC、Viz copy、Complexity/Paths 数据和定向测试；不得留下只有 route/metadata 的占位页。

### T4-T11 AlgorithmPlayer 八批

| 批次 | 分类与页数                |
| ---- | ------------------------- |
| D    | 排序前 6 页               |
| E    | 排序后 5 页               |
| F    | 图算法 7 页               |
| G    | 动态规划 7 页             |
| H    | 回溯与搜索 6 页           |
| I    | 字符串 5 页               |
| J    | 数学与数论 8 页           |
| K    | 计算几何 3 页 + 查找 3 页 |

每批先让该批 catalog/module/content 预期变红，再补 metadata、adapter、SFC 和链接到全绿。

### T12 工具、产物与交付

- Home/Menu/Search 94 条；Complexity/Paths 92 条。
- 190 页 registry、双 base、sitemap、llms、manifest 与 95 组 alternate。
- 全门禁、coverage、全量 L5、桌面/900px 视觉检查、两提交和双轨部署。

## 质量与风险

- **批量翻译漂移**：每批 5-8 页闭环；不一次性生成 65 个未验证占位。
- **互动页中文残留**：英文页面和 Viz 都做 DOM Han 扫描；状态需在实际交互后再次扫描。
- **module 字幕错配**：adapter 与原 module 同输入对拍步骤数、point、轨与最终状态。
- **构建时间增长**：prerender 保持动态发现与 worker 池；记录 190 页 production/selfhost 时长，超出可接受范围再单独优化。
- **英文内容过薄**：每页强制概念、可视化读法、复杂度/限制和站内链接四部分。
- **中文回归**：所有 locale 接口默认 `zh-CN`，既有中文 L3/L4/L5 全量回归不删不改。

## 变更历史

- 2026-07-11：基于 C130 架构与 92 条中文目录完成全量审计；选择 15 互动页先行、50 播放器页随后、最终 190 页交付的分批方案。
- 2026-07-11：设计按计划落地；typed catalog、共享 Viz locale、逐算法 adapter、静态 loader 与 190 页产物均完成验证，没有引入运行时翻译或第二套状态机。
- 2026-07-11：C132 修复中文菜单未接入两个 tool route 的后续缺陷；英文 catalog 派生设计保持不变，中文手写菜单补首组并由新回归守护。
