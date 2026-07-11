# 设计：英文目录扩展到 30 页

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

## 审计发现

十页试点目前有六个同步点：

1. `src/i18n/pilot.ts` 的页面对与 SEO 文案；
2. `src/router/index.ts` 的英文 route records；
3. `src/views/English/homeCatalog.ts` 的图标、分组和顺序；
4. `src/views/English/Complexity.vue` 的 metrics；
5. `src/views/English/Paths.vue` 的路径；
6. `src/i18n/englishAlgorithmModules.ts` 的七个 adapter。

试点规模合理，但把它直接扩成 30 页会产生明显漂移风险。本设计先建立一个 typed locale catalog，导航、SEO 和工具页从 catalog 派生；英文文章正文继续保留为可审查的 SFC，不引入富文本 DSL 或 `v-html`。

## 目标结构

```text
src/i18n/
  catalog.ts                    # 页面对、SEO、分类、图标 key、complexity、path tags
  pilot.ts                      # 迁移期兼容导出，最终移除 pilot 命名
  useSiteLocale.ts
  en/
    shared.ts                   # source/vars/quiz 的安全结构化 helper
    modules/
      quick-sort.ts
      binary-search.ts
      ...                       # 每算法一个 adapter

src/views/English/
  pages.ts                      # route name -> 静态 import loader
  Home.vue
  Complexity.vue
  Paths.vue
  <Algorithm>.vue              # 英文正文，保持高质量人工可审查

docs/i18n/
  english-style-guide.md       # 术语、大小写、复杂度与文风基线
```

## Locale catalog

```ts
interface LocalizedPagePair {
  key: string;
  kind: 'home' | 'tool' | 'algorithm';
  zh: { name: string; path: string };
  en: {
    name: string;
    path: string;
    heading: string;
    title: string;
    description: string;
    category?: EnglishCategory;
    iconKey?: string;
    complexity?: ComplexityInfo;
    pathTags?: string[];
    order?: number;
  };
}
```

- catalog 只保存结构化短文案和导航数据，不塞整篇文章或代码。
- `iconKey` 通过一个 typed icon map 解析，避免 registry import SVG 影响纯逻辑测试。
- algorithm 条目必须有 complexity、category、iconKey 和至少一个 pathTag；tool/Home 不强制。
- 建立 `getPairByRouteName`、`getPagesByCategory`、`getLearningPaths` 等派生函数，不让组件自己筛选魔法字符串。

## 路由生成

`pages.ts` 使用显式静态动态 import，确保 Vite 可分包：

```ts
const englishPageLoaders = {
  'en-quick-sort': () => import('./QuickSort.vue'),
  // ...
} satisfies Record<EnglishContentRouteName, RouteComponentLoader>;
```

router 从 catalog 的 29 个内容条目映射 route record，并从 loader map 取 component。测试锁定 catalog 与 loader map 双向全集相等；因此新增页只需登记 metadata、loader 和 SFC，不再手写 route record。

## Module adapter

- 先把现有七个 adapter 原样拆到 `src/i18n/en/modules/`，以现有 C126 三条 module Case 保证零行为变化。
- 每个新增 adapter 调用原 module `buildSteps()`，只替换 title/hint/caption/vars/quiz/source comments。
- adapter 显式导入真实 module，不从 route slug 推导文件名；七个候选页使用历史 basename（`topo`、`editdist`、`queens`、`rabinkarp`、`sieve`、`closestpair`、`bbound`）。
- 共享 helper 可翻译固定静态标签、复制 lineMap、检查 Han 字符；涉及执行点语义的 caption/quiz 必须留在算法文件内。
- 建立统一 `englishAlgorithmModules` typed map，英文页面从 route key 取对应 module；禁止复制 oracle。

## 页面与工具

- 每个算法保留独立英文 SFC，以保证正文、inline code、strong、Callout 和交叉链接自然可读；不为了减少文件数引入 HTML 字符串渲染。
- 首批内容前先落英文 style guide；算法名、数据结构名、操作动词、复杂度写法、播放器状态词和 CTA 不在各页临时发明译法。
- Home 从 category/order/iconKey 派生；不存在第二份 `groups.names`。
- Complexity 直接读取 catalog complexity；筛选与 UI 逻辑保持现状。
- Paths 使用 pathTags 和一份路径定义生成，测试保证 27 个算法至少出现一次、链接均存在。
- Search 和 Menu 继续消费全部英文内容页，不单独维护 slug。

## SEO 与构建

- `SeoPage` 继续从页面对生成 locale/alternates；总数从 105 改为 125，避免另建 URL 清单。
- prerender 从英文 Home/Menu 的真实链接发现 29 个内容页，加英文 Home 和 95 中文页，共 125。
- verifier 校验 30 英文页可见正文无 Han、所有 alternate 双向、静态链接命中目录入口。
- sitemap 仍只列 canonical；llms 使用 Chinese catalog + English catalog 两节。

## 迁移顺序

1. **T0 迁移红测**：以现有 10/7/2/1、9 个内容 route 和 105 页 SEO 为 oracle，先建立 catalog/loader/派生视图的等价性红测。
2. **T1 无行为重构**：迁移现有十页，拆 module adapters，建立英文 style guide；全部迁移 Case 转绿，产物仍保持 105 页。
3. **T2 四批内容**：每批先把预期推进到 15/110、20/115、25/120、30/125，再补 5 个 adapter/SFC/metadata 使该批转绿。
4. **T3 工具与最终产物**：确认 Home/Menu/Search/Complexity/Paths 全由 catalog 派生，完成 125 页 SEO/build 总门禁。
5. **T4 浏览器与交付**：L5、coverage、视觉、全门禁、双轨上线。

T1 单独验证后再加内容，避免在目录重构和二十页翻译同时失败时难以定位。任何批次都不允许长期保留“等待后续批次才会转绿”的测试。

## 风险与处理

- **翻译量大**：四批各五页，每批 module + prose + links 完整闭环，不创建只有标题的占位页。
- **单体 adapter 再膨胀**：一算法一文件，共享 helper 只处理结构，不吞并语义。
- **目录漂移**：catalog、loader、router、Home/Menu/Search、SEO 用双向集合测试锁定。
- **英文薄内容**：每页至少覆盖概念、可视化读法、复杂度/限制和关联学习入口。
- **第三语言冲动扩面**：C130 明确只扩英文；第三语言另立需求并复用本次结构。

## 变更历史

- 2026-07-11：完成十页扩容审计；选择 typed catalog + 静态 loader map + 分文件 module adapter，不引入富文本 DSL。
