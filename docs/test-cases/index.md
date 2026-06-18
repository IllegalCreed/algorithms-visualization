# 全局测试用例索引

> Status: active
> Last reviewed: 2026-06-18
> Owner: IllegalCreed

## 使用说明

本文件保存全部自动化测试用例的事实字段（Case ID、owner plan、自动化路径、状态、最后验证）。
分层视图见 `by-layer.md`，模块视图见 `by-module.md`。

本项目测试分层裁剪为 L3（前端单元）/ L4（前端组件）/ L5（端到端），不含 L1/L2（无后端）。

## All Cases

| Case ID              | 标题                                            | 所属功能 / 模块           | Owner Plan     | 层级 | 自动化路径                                           | 状态   | 最后验证   |
| -------------------- | ----------------------------------------------- | ------------------------- | -------------- | ---- | ---------------------------------------------------- | ------ | ---------- |
| TC-ALGO-01           | 空数组与单元素不产生步骤                        | algorithms / bubble-sort  | C-20260618-003 | L3   | `src/algorithms/bubble-sort.spec.ts`                 | active | 2026-06-18 |
| TC-ALGO-02           | 最终数组升序排列                                | algorithms / bubble-sort  | C-20260618-003 | L3   | `src/algorithms/bubble-sort.spec.ts`                 | active | 2026-06-18 |
| TC-ALGO-03           | 每步 compare 是相邻合法下标                     | algorithms / bubble-sort  | C-20260618-003 | L3   | `src/algorithms/bubble-sort.spec.ts`                 | active | 2026-06-18 |
| TC-ALGO-04           | 已排序数组无任何 swap                           | algorithms / bubble-sort  | C-20260618-003 | L3   | `src/algorithms/bubble-sort.spec.ts`                 | active | 2026-06-18 |
| TC-ALGO-05           | 含重复元素结果正确且稳定地不越界                | algorithms / bubble-sort  | C-20260618-003 | L3   | `src/algorithms/bubble-sort.spec.ts`                 | active | 2026-06-18 |
| TC-ALGO-06           | 不修改入参                                      | algorithms / bubble-sort  | C-20260618-003 | L3   | `src/algorithms/bubble-sort.spec.ts`                 | active | 2026-06-18 |
| TC-STORE-01          | 初始 isDarkMode=false、isShowHeaderShadow=false | store / system            | C-20260618-003 | L3   | `src/store/modules/system.spec.ts`                   | active | 2026-06-18 |
| TC-STORE-02          | changeDarkMode 切换暗色                         | store / system            | C-20260618-003 | L3   | `src/store/modules/system.spec.ts`                   | active | 2026-06-18 |
| TC-STORE-03          | changeHeaderShadowe 设置阴影开关                | store / system            | C-20260618-003 | L3   | `src/store/modules/system.spec.ts`                   | active | 2026-06-18 |
| TC-STORE-04          | colors 含 red/blue/yellow/green                 | store / system            | C-20260618-003 | L3   | `src/store/modules/system.spec.ts`                   | active | 2026-06-18 |
| TC-HOOK-01-1         | 返回数据结构与排序两个分类                      | home / hooks              | C-20260618-003 | L3   | `src/views/Home/Main/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-01-2         | 数据结构分类含 8 项                             | home / hooks              | C-20260618-003 | L3   | `src/views/Home/Main/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-01-3         | 每个条目含 title/desc/icon/url                  | home / hooks              | C-20260618-003 | L3   | `src/views/Home/Main/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-01-4         | 所有 url 唯一                                   | home / hooks              | C-20260618-003 | L3   | `src/views/Home/Main/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-01-5         | 每个分类含 desc                                 | home / hooks              | C-20260618-003 | L3   | `src/views/Home/Main/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-02-1         | 返回 2 个分类                                   | docs / menu-hooks         | C-20260618-003 | L3   | `src/views/Docs/Menu/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-02-2         | 每项含 title/url 且均非空                       | docs / menu-hooks         | C-20260618-003 | L3   | `src/views/Docs/Menu/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-02-3         | 所有 url 唯一                                   | docs / menu-hooks         | C-20260618-003 | L3   | `src/views/Docs/Menu/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-02-4         | 数据结构含 8 项，排序算法含 10 项               | docs / menu-hooks         | C-20260618-003 | L3   | `src/views/Docs/Menu/hooks.spec.ts`                  | active | 2026-06-18 |
| TC-HOOK-03-1         | 组件挂载时注册 scroll 监听器                    | home / scroll-hook        | C-20260618-003 | L3   | `src/views/Home/hooks.spec.ts`                       | active | 2026-06-18 |
| TC-HOOK-03-2         | 组件卸载时移除 scroll 监听器                    | home / scroll-hook        | C-20260618-003 | L3   | `src/views/Home/hooks.spec.ts`                       | active | 2026-06-18 |
| TC-HOOK-03-3         | scrollY > 0 时 isShowHeaderShadow 变为 true     | home / scroll-hook        | C-20260618-003 | L3   | `src/views/Home/hooks.spec.ts`                       | active | 2026-06-18 |
| TC-HOOK-03-4         | scrollY === 0 时 isShowHeaderShadow 变为 false  | home / scroll-hook        | C-20260618-003 | L3   | `src/views/Home/hooks.spec.ts`                       | active | 2026-06-18 |
| TC-HOOK-04-1         | 组件挂载后 isShowHeaderShadow 变为 true         | docs / shadow-hook        | C-20260618-003 | L3   | `src/views/Docs/hooks.spec.ts`                       | active | 2026-06-18 |
| TC-HOOK-04-2         | 组件卸载后 isShowHeaderShadow 恢复为 false      | docs / shadow-hook        | C-20260618-003 | L3   | `src/views/Docs/hooks.spec.ts`                       | active | 2026-06-18 |
| TC-HOOK-05-1         | 返回 3 个社交链接（github/twitter/微博）        | master / icon-hook        | C-20260618-003 | L3   | `src/views/Master/Header/hooks.spec.ts`              | active | 2026-06-18 |
| TC-HOOK-05-2         | 每项含 title/src/url 且均非空                   | master / icon-hook        | C-20260618-003 | L3   | `src/views/Master/Header/hooks.spec.ts`              | active | 2026-06-18 |
| TC-HOOK-05-3         | 所有 url 为合法的 https 地址                    | master / icon-hook        | C-20260618-003 | L3   | `src/views/Master/Header/hooks.spec.ts`              | active | 2026-06-18 |
| TC-VIZ-ARROW-01      | 按 color 着色 svg                               | viz-engine / Arrow        | C-20260618-003 | L4   | `src/components/Arrow.spec.ts`                       | active | 2026-06-18 |
| TC-VIZ-ARROWTRACK-01 | 每个 Pointer 渲染一个 Arrow 并按 index 定位     | viz-engine / ArrowTrack   | C-20260618-003 | L4   | `src/components/ArrowTrack.spec.ts`                  | active | 2026-06-18 |
| TC-VIZ-BLOCK-01      | 渲染数值                                        | viz-engine / Block        | C-20260618-003 | L4   | `src/components/Block.spec.ts`                       | active | 2026-06-18 |
| TC-VIZ-BLOCK-02      | 背景透明度随 percent                            | viz-engine / Block        | C-20260618-003 | L4   | `src/components/Block.spec.ts`                       | active | 2026-06-18 |
| TC-VIZ-BLOCK-03      | percent<0.5 文字色 black，否则 white            | viz-engine / Block        | C-20260618-003 | L4   | `src/components/Block.spec.ts`                       | active | 2026-06-18 |
| TC-VIZ-LIST-01       | 渲染与数据等量的 Block                          | viz-engine / List         | C-20260618-003 | L4   | `src/components/List.spec.ts`                        | active | 2026-06-18 |
| TC-VIZ-LIST-02       | 最小值 percent=0、最大值 percent=1              | viz-engine / List         | C-20260618-003 | L4   | `src/components/List.spec.ts`                        | active | 2026-06-18 |
| TC-VIEW-BUBBLE-01    | 挂载渲染 List + 比较表达式                      | article-sort / BubbleSort | C-20260618-003 | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts` | active | 2026-06-18 |
| TC-VIEW-BUBBLE-02    | 初始渲染 10 个方块                              | article-sort / BubbleSort | C-20260618-003 | L4   | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts` | active | 2026-06-18 |
| TC-VIEW-FOOTER-01    | 渲染 MIT Licensed 文案                          | home / Footer             | C-20260618-003 | L4   | `src/views/Home/Footer/Footer.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-FOOTER-02    | 渲染 Copyright 文案                             | home / Footer             | C-20260618-003 | L4   | `src/views/Home/Footer/Footer.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-FOOTER-03    | 渲染 Zhang Xu 署名                              | home / Footer             | C-20260618-003 | L4   | `src/views/Home/Footer/Footer.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-FOOTER-04    | 渲染 footer 根元素                              | home / Footer             | C-20260618-003 | L4   | `src/views/Home/Footer/Footer.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-CATEGORY-01  | 渲染分类标题                                    | home / Category           | C-20260618-003 | L4   | `src/views/Home/Main/Category/Category.spec.ts`      | active | 2026-06-18 |
| TC-VIEW-CATEGORY-02  | 渲染分类描述                                    | home / Category           | C-20260618-003 | L4   | `src/views/Home/Main/Category/Category.spec.ts`      | active | 2026-06-18 |
| TC-VIEW-CATEGORY-03  | 渲染 children 数量对应的 Item                   | home / Category           | C-20260618-003 | L4   | `src/views/Home/Main/Category/Category.spec.ts`      | active | 2026-06-18 |
| TC-VIEW-CATEGORY-04  | 渲染第一个 Item 标题「数组」                    | home / Category           | C-20260618-003 | L4   | `src/views/Home/Main/Category/Category.spec.ts`      | active | 2026-06-18 |
| TC-VIEW-CATEGORY-05  | 渲染第二个 Item 标题「链表」                    | home / Category           | C-20260618-003 | L4   | `src/views/Home/Main/Category/Category.spec.ts`      | active | 2026-06-18 |
| TC-VIEW-CATEGORY-06  | children 为空时无 Item 渲染                     | home / Category           | C-20260618-003 | L4   | `src/views/Home/Main/Category/Category.spec.ts`      | active | 2026-06-18 |
| TC-VIEW-HOME-ITEM-01 | 渲染 item 标题                                  | home / Category/Item      | C-20260618-003 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts`     | active | 2026-06-18 |
| TC-VIEW-HOME-ITEM-02 | 渲染 item 描述                                  | home / Category/Item      | C-20260618-003 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts`     | active | 2026-06-18 |
| TC-VIEW-HOME-ITEM-03 | 渲染 img 标签（icon）                           | home / Category/Item      | C-20260618-003 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts`     | active | 2026-06-18 |
| TC-VIEW-HOME-ITEM-04 | img src 属性对应 icon 字段                      | home / Category/Item      | C-20260618-003 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts`     | active | 2026-06-18 |
| TC-VIEW-HOME-ITEM-05 | 点击元素调用 router.push，跳转到对应 url name   | home / Category/Item      | C-20260618-003 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts`     | active | 2026-06-18 |
| TC-VIEW-HOME-ITEM-06 | 不同 url 跳转到对应路由名                       | home / Category/Item      | C-20260618-003 | L4   | `src/views/Home/Main/Category/Item/Item.spec.ts`     | active | 2026-06-18 |
| TC-VIEW-SPLASH-01    | 渲染主标题「可视化的」                          | home / Splash             | C-20260618-003 | L4   | `src/views/Home/Splash/Splash.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-SPLASH-02    | 渲染副标题「数据结构与算法」                    | home / Splash             | C-20260618-003 | L4   | `src/views/Home/Splash/Splash.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-SPLASH-03    | 渲染技术栈描述文案                              | home / Splash             | C-20260618-003 | L4   | `src/views/Home/Splash/Splash.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-SPLASH-04    | 渲染「开始学习」按钮                            | home / Splash             | C-20260618-003 | L4   | `src/views/Home/Splash/Splash.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-SPLASH-05    | 点击「开始学习」跳转到 docs/array 页            | home / Splash             | C-20260618-003 | L4   | `src/views/Home/Splash/Splash.spec.ts`               | active | 2026-06-18 |
| TC-VIEW-DOCS-ITEM-01 | 渲染 item span 文本                             | docs / Menu/Item          | C-20260618-003 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts`       | active | 2026-06-18 |
| TC-VIEW-DOCS-ITEM-02 | 渲染 .item.btn class                            | docs / Menu/Item          | C-20260618-003 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts`       | active | 2026-06-18 |
| TC-VIEW-DOCS-ITEM-03 | 点击调用 router.push 跳转到对应 url             | docs / Menu/Item          | C-20260618-003 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts`       | active | 2026-06-18 |
| TC-VIEW-DOCS-ITEM-04 | url 匹配时 item 有 item-pressed class           | docs / Menu/Item          | C-20260618-003 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts`       | active | 2026-06-18 |
| TC-VIEW-DOCS-ITEM-05 | url 不匹配时 item 无 item-pressed class         | docs / Menu/Item          | C-20260618-003 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts`       | active | 2026-06-18 |
| TC-VIEW-DOCS-ITEM-06 | 不同 url 跳转对应路由                           | docs / Menu/Item          | C-20260618-003 | L4   | `src/views/Docs/Menu/Header/Item/Item.spec.ts`       | active | 2026-06-18 |
| TC-VIEW-MENU-01      | 挂载成功，渲染 #menu 根元素                     | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-02      | 渲染「数据结构」分类标题                        | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-03      | 渲染「经典排序算法」分类标题                    | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-04      | 渲染所有数据结构子项（如「数组」「链表」）      | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-05      | 渲染排序算法子项「冒泡排序」                    | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-06      | useMenuSelect 初始路由 array 使对应 Item 高亮   | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-07      | 点击子菜单项触发路由跳转                        | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-MENU-08      | onBeforeRouteUpdate 回调触发后高亮随路由更新    | docs / Menu               | C-20260618-003 | L4   | `src/views/Docs/Menu/Menu.spec.ts`                   | active | 2026-06-18 |
| TC-VIEW-HEADER-01    | 渲染 #header 根元素                             | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-HEADER-02    | 渲染 logo #logo 元素                            | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-HEADER-03    | 渲染「V」logo 字符                              | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-HEADER-04    | 渲染 h1 标题「算法可视化」                      | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-HEADER-05    | 点击 logo 跳转到 home 路由                      | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-HEADER-06    | 渲染 3 个 icon-link（github/twitter/weibo）     | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-HEADER-07    | 初始无 header shadow class                      | master / Header           | C-20260618-003 | L4   | `src/views/Master/Header/Header.spec.ts`             | active | 2026-06-18 |
| TC-VIEW-ICONLINK-01  | 渲染 .icon-link 根元素                          | master / IconLink         | C-20260618-003 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts`  | active | 2026-06-18 |
| TC-VIEW-ICONLINK-02  | 渲染 img 标签                                   | master / IconLink         | C-20260618-003 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts`  | active | 2026-06-18 |
| TC-VIEW-ICONLINK-03  | img src 属性正确                                | master / IconLink         | C-20260618-003 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts`  | active | 2026-06-18 |
| TC-VIEW-ICONLINK-04  | title 属性渲染到元素上                          | master / IconLink         | C-20260618-003 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts`  | active | 2026-06-18 |
| TC-VIEW-ICONLINK-05  | 点击调用 window.open 打开对应 url               | master / IconLink         | C-20260618-003 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts`  | active | 2026-06-18 |
| TC-VIEW-ICONLINK-06  | 不同 url 也能正确打开                           | master / IconLink         | C-20260618-003 | L4   | `src/views/Master/Header/IconLink/IconLink.spec.ts`  | active | 2026-06-18 |
| TC-E2E-HOME-01       | 首页加载并能进入 docs                           | home / e2e                | C-20260618-003 | L5   | `e2e/home-navigation.e2e.ts`                         | active | 2026-06-18 |
| TC-E2E-MENU-01       | docs 菜单点击切换路由                           | docs / e2e                | C-20260618-003 | L5   | `e2e/docs-menu.e2e.ts`                               | active | 2026-06-18 |
| TC-E2E-BUBBLE-01     | 冒泡排序动画最终升序                            | article-sort / e2e        | C-20260618-003 | L5   | `e2e/bubble-sort.e2e.ts`                             | active | 2026-06-18 |
