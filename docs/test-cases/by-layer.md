# 测试用例分层视图

> Status: active
> Last reviewed: 2026-06-18
> Owner: IllegalCreed

同一 Case ID 的事实字段（owner plan、自动化路径、状态、最后验证）见 `index.md`。
本文件仅提供分层视角，便于按层级评审覆盖度。

## L3 — 前端单元（Vitest，不 mount）

共 **72** 个用例。运行命令：`pnpm test:unit`

### algorithms

| Case ID    | 标题                             | 自动化路径                           |
| ---------- | -------------------------------- | ------------------------------------ |
| TC-ALGO-01 | 空数组与单元素不产生步骤         | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-02 | 最终数组升序排列                 | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-03 | 每步 compare 是相邻合法下标      | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-04 | 已排序数组无任何 swap            | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-05 | 含重复元素结果正确且稳定地不越界 | `src/algorithms/bubble-sort.spec.ts` |
| TC-ALGO-06 | 不修改入参                       | `src/algorithms/bubble-sort.spec.ts` |

### store

| Case ID     | 标题                                            | 自动化路径                         |
| ----------- | ----------------------------------------------- | ---------------------------------- |
| TC-STORE-01 | 初始 isDarkMode=false、isShowHeaderShadow=false | `src/store/modules/system.spec.ts` |
| TC-STORE-02 | changeDarkMode 切换暗色                         | `src/store/modules/system.spec.ts` |
| TC-STORE-03 | changeHeaderShadowe 设置阴影开关                | `src/store/modules/system.spec.ts` |
| TC-STORE-04 | colors 含 red/blue/yellow/green                 | `src/store/modules/system.spec.ts` |

### bubble-sort module（C-006）

| Case ID          | 标题                                         | 自动化路径                                  |
| ---------------- | -------------------------------------------- | ------------------------------------------- |
| TC-BUBBLE-MOD-01 | 空/单元素也产出至少一个 done 步              | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-02 | 末步数组与 oracle 最终结果一致（交叉校验）   | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提） | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-04 | 不修改入参                                   | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-05 | 每步 point 合法，swap/noSwap 的 swapped 对应 | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-06 | 四门语言齐备                                 | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-07 | 每门语言每个 ExecPoint 行号落在源码行范围内  | `src/algorithms/bubble-sort.module.spec.ts` |
| TC-BUBBLE-MOD-08 | 实际出现的 point 都能在每门语言映射到行      | `src/algorithms/bubble-sort.module.spec.ts` |

### selection-sort oracle（C-007）

| Case ID        | 标题                               | 自动化路径                              |
| -------------- | ---------------------------------- | --------------------------------------- |
| TC-SEL-ALGO-01 | 空数组与单元素不产生步骤、结果原样 | `src/algorithms/selection-sort.spec.ts` |
| TC-SEL-ALGO-02 | 最终数组升序排列                   | `src/algorithms/selection-sort.spec.ts` |
| TC-SEL-ALGO-03 | 含重复元素结果正确且不越界         | `src/algorithms/selection-sort.spec.ts` |
| TC-SEL-ALGO-04 | 不修改入参                         | `src/algorithms/selection-sort.spec.ts` |

### selection-sort module（C-007）

| Case ID             | 标题                                           | 自动化路径                                     |
| ------------------- | ---------------------------------------------- | ---------------------------------------------- |
| TC-SELECTION-MOD-01 | 空/单元素也产出至少一个 done 步                | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-02 | 末步数组与 oracle 一致（交叉校验，升序）       | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-03 | 每步 array 的 id 集合恒等于初始（FLIP 前提）   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-04 | 不修改入参                                     | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-05 | 每步 point 合法；swap/noSwap 的 swapped 对应   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-06 | newMin 步 min 指针落在 emphasis.minIndex 上    | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-07 | 每轮结束后 i 位即 [i,n) 最小（选择核心不变量） | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-08 | sortedUpTo 单调不减且末步为 n                  | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-09 | 交换次数 ≤ n-1                                 | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-10 | 四门语言齐备                                   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-11 | 每门语言每个 SelectionExecPoint 行号在范围内   | `src/algorithms/selection-sort.module.spec.ts` |
| TC-SELECTION-MOD-12 | 实际出现的 point 都能在每门语言映射到行        | `src/algorithms/selection-sort.module.spec.ts` |

### player / usePlayer（C-006）

| Case ID      | 标题                                    | 自动化路径                                |
| ------------ | --------------------------------------- | ----------------------------------------- |
| TC-PLAYER-01 | 初始停第 0 步且未播放                   | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-02 | stepForward 前进且不越过末步            | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-03 | stepBackward 后退且不越过首步           | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-04 | seek 越界夹紧到合法范围                 | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-05 | reset 回第 0 步并停止                   | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-06 | play 按基准间隔逐步推进、到末步自动暂停 | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-07 | pause 停止自动推进                      | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-08 | setSpeed 加速后按新速率推进             | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-09 | current 跟随 index                      | `src/components/player/usePlayer.spec.ts` |
| TC-PLAYER-10 | progress 从 0 到 1                      | `src/components/player/usePlayer.spec.ts` |

### hooks

| Case ID      | 标题                                           | 自动化路径                              |
| ------------ | ---------------------------------------------- | --------------------------------------- |
| TC-HOOK-01-1 | 返回数据结构与排序两个分类                     | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-2 | 数据结构分类含 8 项                            | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-3 | 每个条目含 title/desc/icon/url                 | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-4 | 所有 url 唯一                                  | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-01-5 | 每个分类含 desc                                | `src/views/Home/Main/hooks.spec.ts`     |
| TC-HOOK-02-1 | 返回 2 个分类                                  | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-2 | 每项含 title/url 且均非空                      | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-3 | 所有 url 唯一                                  | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-02-4 | 数据结构含 8 项，排序算法含 10 项              | `src/views/Docs/Menu/hooks.spec.ts`     |
| TC-HOOK-03-1 | 组件挂载时注册 scroll 监听器                   | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-2 | 组件卸载时移除 scroll 监听器                   | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-3 | scrollY > 0 时 isShowHeaderShadow 变为 true    | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-03-4 | scrollY === 0 时 isShowHeaderShadow 变为 false | `src/views/Home/hooks.spec.ts`          |
| TC-HOOK-04-1 | 组件挂载后 isShowHeaderShadow 变为 true        | `src/views/Docs/hooks.spec.ts`          |
| TC-HOOK-04-2 | 组件卸载后 isShowHeaderShadow 恢复为 false     | `src/views/Docs/hooks.spec.ts`          |
| TC-HOOK-05-1 | 返回 3 个社交链接（github/twitter/微博）       | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-2 | 每项含 title/src/url 且均非空                  | `src/views/Master/Header/hooks.spec.ts` |
| TC-HOOK-05-3 | 所有 url 为合法的 https 地址                   | `src/views/Master/Header/hooks.spec.ts` |

---

## L4 — 前端组件（Vitest + @vue/test-utils，mount）

共 **80** 个用例。运行命令：`pnpm test:unit`

### viz-engine（可视化引擎基础组件）

| Case ID              | 标题                                                | 自动化路径                          |
| -------------------- | --------------------------------------------------- | ----------------------------------- |
| TC-VIZ-ARROW-01      | 语义色映射柔和色描在雪佛龙上                        | `src/components/Arrow.spec.ts`      |
| TC-VIZ-ARROW-02      | 非预设色按原值透传                                  | `src/components/Arrow.spec.ts`      |
| TC-VIZ-ARROWTRACK-01 | 每个 Pointer 渲染一个 Arrow 并按 index 定位         | `src/components/ArrowTrack.spec.ts` |
| TC-VIZ-ARROWTRACK-02 | slotWidth 自定义时按其定位（C-006）                 | `src/components/ArrowTrack.spec.ts` |
| TC-VIZ-BLOCK-01      | 渲染数值                                            | `src/components/Block.spec.ts`      |
| TC-VIZ-BLOCK-02      | 背景透明度随 percent                                | `src/components/Block.spec.ts`      |
| TC-VIZ-BLOCK-03      | percent<0.5 文字色 black，否则 white                | `src/components/Block.spec.ts`      |
| TC-VIZ-LIST-01       | 渲染与数据等量的 Block                              | `src/components/List.spec.ts`       |
| TC-VIZ-LIST-02       | 最小值 percent=0、最大值 percent=1                  | `src/components/List.spec.ts`       |
| TC-VIZ-BAR-01        | 渲染数值（C-006）                                   | `src/components/Bar.spec.ts`        |
| TC-VIZ-BAR-02        | 高度随 percent 增大（C-006）                        | `src/components/Bar.spec.ts`        |
| TC-VIZ-BAR-03        | state 决定柱体 class（C-006）                       | `src/components/Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-01   | 渲染与数据等量的 Bar（C-006）                       | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-02   | 最大值柱最高、最小值柱最低（C-006）                 | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-03   | comparing 下标进入 comparing 态（C-006）            | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-04   | sortedFrom 之后进入 sorted 态（C-006）              | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-05   | slotWidth 透传给 ArrowTrack（C-006）                | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BAR-04        | state=min 时柱体加 min class（C-007）               | `src/components/Bar.spec.ts`        |
| TC-VIZ-BARSVIEW-06   | minIndex 指向的 Bar 进入 min 态（C-007）            | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-07   | sortedUpTo 左侧的 Bar 进入 sorted 态（C-007）       | `src/components/BarsView.spec.ts`   |
| TC-VIZ-BARSVIEW-08   | 比较帧 minIndex 取 min、另一根取 comparing（C-007） | `src/components/BarsView.spec.ts`   |

### player（播放器外壳，C-006）

| Case ID           | 标题                               | 自动化路径                                        |
| ----------------- | ---------------------------------- | ------------------------------------------------- |
| TC-CODEPANEL-01   | 渲染默认语言(TS)所有行             | `src/components/player/CodePanel.spec.ts`         |
| TC-CODEPANEL-02   | 当前执行行随 point 经 lineMap 高亮 | `src/components/player/CodePanel.spec.ts`         |
| TC-CODEPANEL-03   | 切语言 Tab 后按该语言 lineMap 高亮 | `src/components/player/CodePanel.spec.ts`         |
| TC-VARPANEL-01    | 渲染每个变量的名与值               | `src/components/player/VariablePanel.spec.ts`     |
| TC-VARPANEL-02    | 与上一步比较，变化的行加 changed   | `src/components/player/VariablePanel.spec.ts`     |
| TC-VARPANEL-03    | 无 prev 时都不高亮                 | `src/components/player/VariablePanel.spec.ts`     |
| TC-TRANSPORT-01   | 未播放点主按钮 emit play           | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-02   | 播放中点主按钮 emit pause          | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-03   | atStart 时上一步禁用               | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-04   | atEnd 时下一步禁用                 | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-05   | 下一步 emit stepForward            | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-06   | 重置 emit reset                    | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-07   | 计数器显示 index+1 / total         | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-08   | 拖动进度条 emit seek(值)           | `src/components/player/TransportControls.spec.ts` |
| TC-TRANSPORT-09   | 改速 emit setSpeed(值)             | `src/components/player/TransportControls.spec.ts` |
| TC-PLAYER-VIEW-01 | 渲染柱状图+代码+变量+控制          | `src/components/player/AlgorithmPlayer.spec.ts`   |
| TC-PLAYER-VIEW-02 | 默认第 0 步，点下一步到第 2 步     | `src/components/player/AlgorithmPlayer.spec.ts`   |

### article-sort（文章/动画视图）

| Case ID              | 标题                                            | 自动化路径                                              |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| TC-VIEW-BUBBLE-01    | （C-006 改写）挂载渲染 AlgorithmPlayer          | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-BUBBLE-02    | （C-006 改写）初始渲染 10 根柱子且默认停第 0 步 | `src/views/Article/SortAlgorithm/BubbleSort.spec.ts`    |
| TC-VIEW-SELECTION-01 | 挂载渲染 AlgorithmPlayer（C-007）               | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |
| TC-VIEW-SELECTION-02 | 初始渲染 10 根柱子且默认停第 0 步（C-007）      | `src/views/Article/SortAlgorithm/SelectionSort.spec.ts` |

### home（首页视图）

| Case ID              | 标题                                          | 自动化路径                                       |
| -------------------- | --------------------------------------------- | ------------------------------------------------ |
| TC-VIEW-FOOTER-01    | 渲染 MIT Licensed 文案                        | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-02    | 渲染 Copyright 文案                           | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-03    | 渲染 Zhang Xu 署名                            | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-FOOTER-04    | 渲染 footer 根元素                            | `src/views/Home/Footer/Footer.spec.ts`           |
| TC-VIEW-CATEGORY-01  | 渲染分类标题                                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-02  | 渲染分类描述                                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-03  | 渲染 children 数量对应的 Item                 | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-04  | 渲染第一个 Item 标题「数组」                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-05  | 渲染第二个 Item 标题「链表」                  | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-CATEGORY-06  | children 为空时无 Item 渲染                   | `src/views/Home/Main/Category/Category.spec.ts`  |
| TC-VIEW-HOME-ITEM-01 | 渲染 item 标题                                | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-02 | 渲染 item 描述                                | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-03 | 渲染 img 标签（icon）                         | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-04 | img src 属性对应 icon 字段                    | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-05 | 点击元素调用 router.push，跳转到对应 url name | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-HOME-ITEM-06 | 不同 url 跳转到对应路由名                     | `src/views/Home/Main/Category/Item/Item.spec.ts` |
| TC-VIEW-SPLASH-01    | 渲染主标题「可视化的」                        | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-02    | 渲染副标题「数据结构与算法」                  | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-03    | 渲染技术栈描述文案                            | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-04    | 渲染「开始学习」按钮                          | `src/views/Home/Splash/Splash.spec.ts`           |
| TC-VIEW-SPLASH-05    | 点击「开始学习」跳转到 docs/array 页          | `src/views/Home/Splash/Splash.spec.ts`           |

### docs（文档侧边菜单）

| Case ID              | 标题                                          | 自动化路径                                     |
| -------------------- | --------------------------------------------- | ---------------------------------------------- |
| TC-VIEW-DOCS-ITEM-01 | 渲染 item span 文本                           | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-02 | 渲染 .item.btn class                          | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-03 | 点击调用 router.push 跳转到对应 url           | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-04 | url 匹配时 item 有 item-pressed class         | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-05 | url 不匹配时 item 无 item-pressed class       | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-DOCS-ITEM-06 | 不同 url 跳转对应路由                         | `src/views/Docs/Menu/Header/Item/Item.spec.ts` |
| TC-VIEW-MENU-01      | 挂载成功，渲染 #menu 根元素                   | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-02      | 渲染「数据结构」分类标题                      | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-03      | 渲染「经典排序算法」分类标题                  | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-04      | 渲染所有数据结构子项（如「数组」「链表」）    | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-05      | 渲染排序算法子项「冒泡排序」                  | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-06      | useMenuSelect 初始路由 array 使对应 Item 高亮 | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-07      | 点击子菜单项触发路由跳转                      | `src/views/Docs/Menu/Menu.spec.ts`             |
| TC-VIEW-MENU-08      | onBeforeRouteUpdate 回调触发后高亮随路由更新  | `src/views/Docs/Menu/Menu.spec.ts`             |

### master（全局框架 Header）

| Case ID             | 标题                                        | 自动化路径                                          |
| ------------------- | ------------------------------------------- | --------------------------------------------------- |
| TC-VIEW-HEADER-01   | 渲染 #header 根元素                         | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-02   | 渲染 logo #logo 元素                        | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-03   | 渲染「V」logo 字符                          | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-04   | 渲染 h1 标题「算法可视化」                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-05   | 点击 logo 跳转到 home 路由                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-06   | 渲染 3 个 icon-link（github/twitter/weibo） | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-HEADER-07   | 初始无 header shadow class                  | `src/views/Master/Header/Header.spec.ts`            |
| TC-VIEW-ICONLINK-01 | 渲染 .icon-link 根元素                      | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-02 | 渲染 img 标签                               | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-03 | img src 属性正确                            | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-04 | title 属性渲染到元素上                      | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-05 | 点击调用 window.open 打开对应 url           | `src/views/Master/Header/IconLink/IconLink.spec.ts` |
| TC-VIEW-ICONLINK-06 | 不同 url 也能正确打开                       | `src/views/Master/Header/IconLink/IconLink.spec.ts` |

---

## L5 — 端到端（Playwright）

共 **4** 个用例（TC-E2E-BUBBLE-01 已 superseded）。运行命令：`pnpm test:e2e`

| Case ID             | 标题                                        | 自动化路径                   | 状态       |
| ------------------- | ------------------------------------------- | ---------------------------- | ---------- |
| TC-E2E-HOME-01      | 首页加载并能进入 docs                       | `e2e/home-navigation.e2e.ts` | active     |
| TC-E2E-MENU-01      | docs 菜单点击切换路由                       | `e2e/docs-menu.e2e.ts`       | active     |
| TC-E2E-BUBBLE-01    | ~~冒泡排序动画最终升序~~                    | `e2e/bubble-sort.e2e.ts`     | superseded |
| TC-E2E-PLAYER-01    | 冒泡播放器：默认暂停/单步/跳末升序/重置     | `e2e/bubble-sort.e2e.ts`     | active     |
| TC-E2E-SELECTION-01 | 选择排序播放器：默认暂停/单步/跳末升序/重置 | `e2e/selection-sort.e2e.ts`  | active     |

---

## 覆盖率（L3+L4，2026-06-20）

| 指标   | 实际值 | 阈值 | 状态 |
| ------ | ------ | ---- | ---- |
| Stmts  | 84.95% | 70%  | 达标 |
| Branch | 86.61% | 60%  | 达标 |
| Funcs  | 84.95% | 70%  | 达标 |
| Lines  | 84.98% | 70%  | 达标 |
