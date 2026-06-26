# Plans Index

> Status: active
> Last reviewed: 2026-06-26
> Owner: IllegalCreed

## All Changes

| Change ID      | Type                | 标题                | 简介                                                                                                                                                                                                                                                                                                                                                                        | 状态     | 完成度 | 阻塞项 | 下一步                                              | 模块 / 里程碑                  | Owner        | Plan                                  | 最近更新   | 替代关系      |
| -------------- | ------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------ | --------------------------------------------------- | ------------------------------ | ------------ | ------------------------------------- | ---------- | ------------- |
| C-20260618-001 | ops                 | 工具链现代化        | 全量升级依赖到最新、迁移到 pnpm、接入 ESLint+Prettier 门禁与 CI                                                                                                                                                                                                                                                                                                             | verified | 100%   | 无     | 已合并 main，CI 门禁实跑通过                        | infra / M0                     | IllegalCreed | `20260618-c001-deps-and-gates/`       | 2026-06-18 | -             |
| C-20260618-002 | ops                 | 自有服务器部署      | 部署到 algo.illegalscreed.cn（双 base 构建 + nginx + Let's Encrypt HTTPS）                                                                                                                                                                                                                                                                                                  | verified | 100%   | 无     | 已上线                                              | infra / M0                     | IllegalCreed | `20260618-c002-selfhost-deploy/`      | 2026-06-18 | -             |
| C-20260618-003 | test-infrastructure | M1 测试体系         | 全量 L3/L4 + L5 测试、Vitest 覆盖率、Playwright、全局测试索引、BubbleSort 算法抽离                                                                                                                                                                                                                                                                                          | verified | 100%   | 无     | 已完成                                              | infra / M1                     | IllegalCreed | `20260618-c003-test-suite/`           | 2026-06-18 | -             |
| C-20260618-004 | ops                 | GitHub Actions 升级 | deploy.yml action 升级到最新主版本，消除 Node 20 deprecation                                                                                                                                                                                                                                                                                                                | verified | 100%   | 无     | 已完成                                              | infra                          | IllegalCreed | `20260618-c004-ci-actions-upgrade/`   | 2026-06-18 | -             |
| C-20260618-005 | bugfix              | 修复 M1 发现的 bug  | Splash 路由跳 array + Docs 菜单删 bucket/radix 对齐 Home                                                                                                                                                                                                                                                                                                                    | verified | 100%   | 无     | 已完成                                              | home / docs-shell              | IllegalCreed | `20260618-c005-fix-m1-bugs/`          | 2026-06-18 | 由 C-003 发现 |
| C-20260619-006 | feature             | 交互式算法播放器    | 重做冒泡为可交互播放器（多语言代码视图+行高亮+单步/暂停+变量面板+柱状条动画），建可复用框架                                                                                                                                                                                                                                                                                 | verified | 100%   | 无     | 已完成                                              | viz-engine / M2                | IllegalCreed | `20260619-c006-interactive-player/`   | 2026-06-19 | -             |
| C-20260620-007 | feature             | 选择排序动画        | 用算法播放器框架接入选择排序（minIdx 双重编码 + 三指针 + 左侧已排序 + 执行点泛型化），M3 首个算法                                                                                                                                                                                                                                                                           | verified | 100%   | 无     | 已完成                                              | viz-engine / article-sort / M3 | IllegalCreed | `20260620-c007-selection-sort/`       | 2026-06-20 | -             |
| C-20260621-008 | feature             | 插入排序动画        | 用算法播放器框架接入插入排序（移位插入：取 key + 右移腾位 + 插入；key 玫红原位滑动；纯加法扩展），M3 第二个算法                                                                                                                                                                                                                                                             | verified | 100%   | 无     | 已完成（24 Case 全绿，已落 main）                   | viz-engine / article-sort / M3 | IllegalCreed | `20260621-c008-insertion-sort/`       | 2026-06-22 | -             |
| C-20260622-009 | feature             | 头部分享/仓库按钮   | 头部三按钮各司其职：GitHub 开本仓库；微博/X 分享当前页（线上域名+当前 path+文案）；抽 share.ts 纯函数 + useIconLink 响应式                                                                                                                                                                                                                                                  | verified | 100%   | 无     | 已完成（35 文件 184 测试全绿，已落 main）           | home / docs-shell              | IllegalCreed | `20260622-c009-header-share-buttons/` | 2026-06-22 | -             |
| C-20260622-010 | feature             | 希尔排序动画        | 用算法播放器框架接入希尔排序（gap 分组插入：步长 ⌊n/2⌋ 减半、逐组插入；复用插入排序移位插桩、泛化为 gap 步长；新增 groupMembers/dimmed 聚焦当前组淡化其余），M3 第三个算法                                                                                                                                                                                                  | verified | 100%   | 无     | 已完成（26 Case 全绿，已落 main）                   | viz-engine / article-sort / M3 | IllegalCreed | `20260622-c010-shell-sort/`           | 2026-06-22 | -             |
| C-20260623-011 | feature             | 归并排序动画        | 用算法播放器框架接入归并排序（自底向上：width 倍增、相邻段合并；首扩外壳为双轨——新增 AuxView 辅助数组轨表达 temp 填充/拷回；主轨复用希尔 groupMembers/dimmed 聚焦当前合并段），M3 第四个、首个非原地/双数组算法                                                                                                                                                             | verified | 100%   | 无     | 已完成（37 Case 全绿，已落 main）                   | viz-engine / article-sort / M3 | IllegalCreed | `20260623-c011-merge-sort/`           | 2026-06-23 | -             |
| C-20260623-012 | feature             | 快速排序动画        | 用算法播放器框架接入快速排序（Lomuto 末位 pivot + 显式区间栈迭代；首个原地分治排序；继归并双轨后新增第二条「区间栈」轨 StackView 表达待处理子问题栈；主轨复用 groupMembers/dimmed 聚焦当前区间 [lo,hi]，新增 pivot 品红态 + sortedIndices 离散已就位），M3 第五个                                                                                                           | verified | 100%   | 无     | 已完成（37 Case 全绿，已落 main）                   | viz-engine / article-sort / M3 | IllegalCreed | `20260623-c012-quick-sort/`           | 2026-06-23 | -             |
| C-20260623-013 | feature             | 堆排序动画          | 用算法播放器框架接入堆排序（Floyd 大顶堆 + 单一 siftDown；首个非线性「树」可视化——新增第三条轨 TreeView 完全二叉树、与数组轨同步高亮；新增 heapNode 深紫态，已就位连续后缀复用 sortedFrom），M3 第六个                                                                                                                                                                      | verified | 100%   | 无     | 已完成（38 Case 全绿，已落 main）                   | viz-engine / article-sort / M3 | IllegalCreed | `20260623-c013-heap-sort/`            | 2026-06-23 | -             |
| C-20260624-014 | feature             | 计数排序动画        | 用算法播放器框架接入计数排序（简单计数「萝卜一个坑」：计数 + 走桶原地回写；首个**非比较**排序；继堆排树轨后新增**第四条轨** CountView 计数桶——首条**按值索引**；主轨复用 sortedUpTo 连续前缀 + 新增 dimFrom 尾部淡化，**零新增 Bar 态**），M3 排序系列收官                                                                                                                  | verified | 100%   | 无     | 已完成（37 Case 全绿，已落 main）                   | viz-engine / article-sort / M3 | IllegalCreed | `20260624-c014-counting-sort/`        | 2026-06-24 | -             |
| C-20260624-015 | feature             | 知识页骨架 + 栈     | 开 M3 **数据结构动画**（新页种「可探索讲解」：正文穿插读者驱动的互动小组件，区别于排序的回放）。立**通用排版骨架** Article/Callout/Playground + **栈互动组件** StackViz（useStack 纯逻辑 + TransitionGroup 进出场 + 栈顶指针挂顶行 + 坑定宽），填充 Stack.vue 空壳。**不复用播放器、零改动排序**；队列等 7 结构后续复用骨架                                                 | verified | 100%   | 无     | 已完成（24 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260624-c015-stack-knowledge/`      | 2026-06-24 | -             |
| C-20260624-016 | feature             | 队列动画            | 复用知识页骨架做**队列**（栈的 FIFO 镜像，验证骨架可复用性）。新增 useQueue（enqueue 队尾 / dequeue 队首 / front）+ QueueViz（**横向车道** + **队首/队尾双指针**挂端跟随 + TransitionGroup 入右滑/出左滑/FLIP 左移），填充 Queue.vue 空壳。**骨架零改动**；M3 数据结构第二个                                                                                                | verified | 100%   | 无     | 已完成（19 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260624-c016-queue-knowledge/`      | 2026-06-24 | -             |
| C-20260624-017 | feature             | 数组动画            | 复用知识页骨架做**数组**（首个「下标 + 搬移」线性结构）。新增 useArray（valueAt 随机访问 / insert 中部插右移 / remove 中部删左移 / append 尾插 / 选中态）+ ArrayViz（**贴合格 + 固定下标行** + **↑i 槽位指针**挂位置而非值 + TransitionGroup 插右滑/删离场/FLIP 搬移），填充 Array.vue 空壳，微调 Queue.vue 结尾引子。**骨架零改动**；M3 数据结构第三个                     | verified | 100%   | 无     | 已完成（23 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260624-c017-array-knowledge/`      | 2026-06-24 | -             |
| C-20260625-018 | feature             | 链表动画            | 复用知识页骨架做**链表**（数组的镜像：访问 O(n)/增删 O(1)）。新增 useLink（valueAt 逐跳 / insertAfter 选中后插 / remove 删选中 / prepend 头插 / 选中态）+ LinkViz（**节点 + next 箭头 + head + null**，首个「节点+连线」原语 + 查找逐跳 O(n) + 改指针高亮 O(1) + TransitionGroup 滑入/离场/FLIP），填充 Link.vue 空壳。**骨架零改动**；M3 数据结构第四个                    | verified | 100%   | 无     | 已完成（23 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260625-c018-link-knowledge/`       | 2026-06-25 | -             |
| C-20260625-019 | feature             | 树动画（BST）       | 复用知识页骨架做**树**（**首个非线性结构**，二叉搜索树）。新增 useTree（pos 完全二叉树编号 / insert 走位落子返回 path / search 走位 / inorder=升序 / 限 4 层）+ TreeViz（**二维 SVG 边 + 圆形节点**，复用 TreeView 定位数学 + 走位逐层高亮 O(log n) + 中序点亮=升序 + 输入框选值），填充 Tree.vue 空壳。**骨架/TreeView 零改动**；M3 数据结构第五个                         | verified | 100%   | 无     | 已完成（23 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260625-c019-tree-knowledge/`       | 2026-06-25 | -             |
| C-20260625-020 | feature             | 堆动画（大顶堆）    | 复用知识页骨架做**堆**（承接树，**数组+树双视图**讲「用数组装树」）。新增 useHeap（pos=数组下标 / 步进式 siftUpStep·siftDownStep / insert 末尾追加 / extractRoot 取根移末 / 限 15）+ HeapViz（**数组轨 + 树轨同 id 联动** + 上浮/下沉真实分步动画 O(log n) + 输入框选值），填充 Heap.vue 空壳。**骨架/TreeView/堆排序零改动**；Case 命名空间 HEAPDS 避让；M3 数据结构第六个 | verified | 100%   | 无     | 已完成（23 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260625-c020-heap-knowledge/`       | 2026-06-25 | -             |
| C-20260625-021 | feature             | 哈希表动画          | 复用知识页骨架做**哈希表**（**靠算找元素**：散列 key%7 → 桶下标直达 O(1)）。新增 useHash（buckets 二维 / hash / insert 空放·冲突追加链尾 / search 扫链 / has / 限 16）+ HashViz（**7 桶阵列 + 每桶拉链** + 散列命中桶高亮 + 冲突追加 + 扫链动画 + 输入框选值），填充 Hash.vue 空壳。**骨架零改动**；M3 数据结构第七个                                                       | verified | 100%   | 无     | 已完成（23 Case 全绿，已落 main）                   | viz-engine / article-ds / M3   | IllegalCreed | `20260625-c021-hash-knowledge/`       | 2026-06-25 | -             |
| C-20260625-022 | feature             | 图动画（收官）      | 复用知识页骨架做**图**（**M3 数据结构收官**，最一般结构：顶点+边任意连接）。新增 useGraph（固定无向图 6 顶点 7 边 + 纯 bfs/dfs 返回步序）+ GraphViz（**SVG 二维图** + 点顶点换起点 + **BFS 队列/DFS 栈遍历点亮** + 辅助面板，收官回扣栈/队列），填充 Graph.vue 空壳。**骨架零改动**；数据结构 8/8                                                                           | verified | 100%   | 无     | 已完成（23 Case 全绿，已落 main）；**M3 收官**      | viz-engine / article-ds / M3   | IllegalCreed | `20260625-c022-graph-knowledge/`      | 2026-06-25 | -             |
| C-20260625-023 | feature             | 树·平衡深化         | **M4 深度 D1**：树页**加一节**「为什么会失衡 · 平衡的思想」（还 C-019 callout 欠的债）。新增 useBalance（退化链/平衡树两套固定布局 + 纯 search 返回步数）+ BalanceViz（**退化↔平衡对照** + 高度/最坏查找读数 + 查找 7 走位 7 步 vs 3 步），树页中序段后加节。**不动菜单/路由/TreeViz**；M4 深度首项                                                                         | verified | 100%   | 无     | 已完成（18 Case 全绿，已落 main）；**M4 深度 D1 ✓** | viz-engine / article-ds / M4   | IllegalCreed | `20260625-c023-tree-balance/`         | 2026-06-25 | -             |
| C-20260626-024 | feature             | 哈希·开放寻址       | **M4 深度 D2**：哈希页**加一节**「另一种解冲突：开放寻址」（补 C-021 当年所砍）。新增 useProbe（7 格扁平表 + 线性探测 insert/search 返回探测路径 + 装载因子）+ HashProbeViz（**扁平表对照拉链** + 同键 [15,8,23,4] 成簇 + 探测走位 + 装载因子读数），哈希页拉链段后加节。**不动菜单/路由/HashViz**；M4 深度第二项                                                           | verified | 100%   | 无     | 已完成（20 Case 全绿，已落 main）；**M4 深度 D2 ✓** | viz-engine / article-ds / M4   | IllegalCreed | `20260626-c024-hash-open-addressing/` | 2026-06-26 | -             |
| C-20260626-025 | feature             | 链表·双向           | **M4 深度 D3**：链表页**加一节**「双向链表：再加一根 prev 指针」（补 C-018 当年所砍）。新增 useDlink（双向链 + forward/backward 双序 + O(1) removeAt 返回接线信息）+ DlinkViz（**→/← 双箭头 + head/tail + 两端 null** + 反向遍历沿 prev 点亮 + 无需找前驱的 O(1) 删除接线），链表页查找逐跳段后加节。**不动菜单/路由/LinkViz**；M4 深度第三项                               | verified | 100%   | 无     | 已完成（20 Case 全绿，已落 main）；**M4 深度 D3 ✓** | viz-engine / article-ds / M4   | IllegalCreed | `20260626-c025-link-doubly/`          | 2026-06-26 | -             |

## By Type

### ops

| Change ID      | 标题                | 状态     | 完成度 | 阻塞项 | 下一步      | Plan                                |
| -------------- | ------------------- | -------- | ------ | ------ | ----------- | ----------------------------------- |
| C-20260618-001 | 工具链现代化        | verified | 100%   | 无     | 已合并 main | `20260618-c001-deps-and-gates/`     |
| C-20260618-002 | 自有服务器部署      | verified | 100%   | 无     | 已上线      | `20260618-c002-selfhost-deploy/`    |
| C-20260618-004 | GitHub Actions 升级 | verified | 100%   | 无     | 已完成      | `20260618-c004-ci-actions-upgrade/` |

### test-infrastructure

| Change ID      | 标题        | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                        |
| -------------- | ----------- | -------- | ------ | ------ | ------ | --------------------------- |
| C-20260618-003 | M1 测试体系 | verified | 100%   | 无     | 已完成 | `20260618-c003-test-suite/` |

### bugfix

| Change ID      | 标题               | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                         |
| -------------- | ------------------ | -------- | ------ | ------ | ------ | ---------------------------- |
| C-20260618-005 | 修复 M1 发现的 bug | verified | 100%   | 无     | 已完成 | `20260618-c005-fix-m1-bugs/` |

### feature

| Change ID      | 标题              | 状态     | 完成度 | 阻塞项 | 下一步 | Plan                                  |
| -------------- | ----------------- | -------- | ------ | ------ | ------ | ------------------------------------- |
| C-20260619-006 | 交互式算法播放器  | verified | 100%   | 无     | 已完成 | `20260619-c006-interactive-player/`   |
| C-20260620-007 | 选择排序动画      | verified | 100%   | 无     | 已完成 | `20260620-c007-selection-sort/`       |
| C-20260621-008 | 插入排序动画      | verified | 100%   | 无     | 已完成 | `20260621-c008-insertion-sort/`       |
| C-20260622-009 | 头部分享/仓库按钮 | verified | 100%   | 无     | 已完成 | `20260622-c009-header-share-buttons/` |
| C-20260622-010 | 希尔排序动画      | verified | 100%   | 无     | 已完成 | `20260622-c010-shell-sort/`           |
| C-20260623-011 | 归并排序动画      | verified | 100%   | 无     | 已完成 | `20260623-c011-merge-sort/`           |
| C-20260623-012 | 快速排序动画      | verified | 100%   | 无     | 已完成 | `20260623-c012-quick-sort/`           |
| C-20260623-013 | 堆排序动画        | verified | 100%   | 无     | 已完成 | `20260623-c013-heap-sort/`            |
| C-20260624-014 | 计数排序动画      | verified | 100%   | 无     | 已完成 | `20260624-c014-counting-sort/`        |
| C-20260624-015 | 知识页骨架 + 栈   | verified | 100%   | 无     | 已完成 | `20260624-c015-stack-knowledge/`      |
| C-20260624-016 | 队列动画          | verified | 100%   | 无     | 已完成 | `20260624-c016-queue-knowledge/`      |
| C-20260624-017 | 数组动画          | verified | 100%   | 无     | 已完成 | `20260624-c017-array-knowledge/`      |
| C-20260625-018 | 链表动画          | verified | 100%   | 无     | 已完成 | `20260625-c018-link-knowledge/`       |
| C-20260625-019 | 树动画（BST）     | verified | 100%   | 无     | 已完成 | `20260625-c019-tree-knowledge/`       |
| C-20260625-020 | 堆动画（大顶堆）  | verified | 100%   | 无     | 已完成 | `20260625-c020-heap-knowledge/`       |
| C-20260625-021 | 哈希表动画        | verified | 100%   | 无     | 已完成 | `20260625-c021-hash-knowledge/`       |
| C-20260625-022 | 图动画（收官）    | verified | 100%   | 无     | 已完成 | `20260625-c022-graph-knowledge/`      |
| C-20260625-023 | 树·平衡深化       | verified | 100%   | 无     | 已完成 | `20260625-c023-tree-balance/`         |
| C-20260626-024 | 哈希·开放寻址     | verified | 100%   | 无     | 已完成 | `20260626-c024-hash-open-addressing/` |
| C-20260626-025 | 链表·双向         | verified | 100%   | 无     | 已完成 | `20260626-c025-link-doubly/`          |

## By Module

### infra

| Change ID      | Type                | 标题                | 状态     | 完成度 | Plan                                |
| -------------- | ------------------- | ------------------- | -------- | ------ | ----------------------------------- |
| C-20260618-001 | ops                 | 工具链现代化        | verified | 100%   | `20260618-c001-deps-and-gates/`     |
| C-20260618-002 | ops                 | 自有服务器部署      | verified | 100%   | `20260618-c002-selfhost-deploy/`    |
| C-20260618-003 | test-infrastructure | M1 测试体系         | verified | 100%   | `20260618-c003-test-suite/`         |
| C-20260618-004 | ops                 | GitHub Actions 升级 | verified | 100%   | `20260618-c004-ci-actions-upgrade/` |

### home / docs-shell

| Change ID      | Type    | 标题                                           | 状态     | 完成度 | Plan                                  |
| -------------- | ------- | ---------------------------------------------- | -------- | ------ | ------------------------------------- |
| C-20260618-005 | bugfix  | 修复 M1 发现的 bug（Splash 路由 + Docs 菜单）  | verified | 100%   | `20260618-c005-fix-m1-bugs/`          |
| C-20260622-009 | feature | 头部分享/仓库按钮（微博/X 分享 + GitHub 仓库） | verified | 100%   | `20260622-c009-header-share-buttons/` |

### viz-engine / article-sort

| Change ID      | Type    | 标题             | 状态     | 完成度 | Plan                                |
| -------------- | ------- | ---------------- | -------- | ------ | ----------------------------------- |
| C-20260619-006 | feature | 交互式算法播放器 | verified | 100%   | `20260619-c006-interactive-player/` |
| C-20260620-007 | feature | 选择排序动画     | verified | 100%   | `20260620-c007-selection-sort/`     |
| C-20260621-008 | feature | 插入排序动画     | verified | 100%   | `20260621-c008-insertion-sort/`     |
| C-20260622-010 | feature | 希尔排序动画     | verified | 100%   | `20260622-c010-shell-sort/`         |
| C-20260623-011 | feature | 归并排序动画     | verified | 100%   | `20260623-c011-merge-sort/`         |
| C-20260623-012 | feature | 快速排序动画     | verified | 100%   | `20260623-c012-quick-sort/`         |
| C-20260623-013 | feature | 堆排序动画       | verified | 100%   | `20260623-c013-heap-sort/`          |
| C-20260624-014 | feature | 计数排序动画     | verified | 100%   | `20260624-c014-counting-sort/`      |

### viz-engine / article-ds

| Change ID      | Type    | 标题             | 状态     | 完成度 | Plan                                  |
| -------------- | ------- | ---------------- | -------- | ------ | ------------------------------------- |
| C-20260624-015 | feature | 知识页骨架 + 栈  | verified | 100%   | `20260624-c015-stack-knowledge/`      |
| C-20260624-016 | feature | 队列动画         | verified | 100%   | `20260624-c016-queue-knowledge/`      |
| C-20260624-017 | feature | 数组动画         | verified | 100%   | `20260624-c017-array-knowledge/`      |
| C-20260625-018 | feature | 链表动画         | verified | 100%   | `20260625-c018-link-knowledge/`       |
| C-20260625-019 | feature | 树动画（BST）    | verified | 100%   | `20260625-c019-tree-knowledge/`       |
| C-20260625-020 | feature | 堆动画（大顶堆） | verified | 100%   | `20260625-c020-heap-knowledge/`       |
| C-20260625-021 | feature | 哈希表动画       | verified | 100%   | `20260625-c021-hash-knowledge/`       |
| C-20260625-022 | feature | 图动画（收官）   | verified | 100%   | `20260625-c022-graph-knowledge/`      |
| C-20260625-023 | feature | 树·平衡深化      | verified | 100%   | `20260625-c023-tree-balance/`         |
| C-20260626-024 | feature | 哈希·开放寻址    | verified | 100%   | `20260626-c024-hash-open-addressing/` |
| C-20260626-025 | feature | 链表·双向        | verified | 100%   | `20260626-c025-link-doubly/`          |
