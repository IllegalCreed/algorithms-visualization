# 实现记录：Dijkstra 最短路（C-20260629-037）

> Status: verified
> Stable ID: C-20260629-037
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **useDijkstra.ts**（L3）：先 `useDijkstra.spec.ts`（TC-DIJKSTRA-01..12）跑红 → 实现固定带权有向图 + `run`/`steps`/`pathTo` 跑绿。
2. **DijkstraViz.vue**（L4）：先 `DijkstraViz.spec.ts`（TC-VIZ-DIJKSTRAVIZ-01..08）跑红 → 实现 SVG 带权图 + 距离表 + 单步松弛跑绿。
3. **Dijkstra.vue + 新分类接线**（L4）：先 `Dijkstra.spec.ts`（TC-VIEW-DIJKSTRA-01/02）跑红 → 建页（新 `Article/Algorithm/` 目录）+ 新增「图算法」顶层分类（Menu + 首页）+ 路由 + 图标 + 改 TC-HOOK-01-1 两处 2→3 跑绿。
4. **e2e**（L5）：`e2e/dijkstra.e2e.ts`（TC-E2E-DIJKSTRA-01）。
5. 全门禁 → 回写四文档/三索引/roadmap(M6 doing)/algorithms-backlog(G1 出池) → 两提交 → 双轨部署。

## 关键实现笔记

- **useDijkstra**：固定 LABELS A–F + POS 坐标 + 9 条 DEdge（带权有向）+ SOURCE=0。`adj` = 每点的出边过滤。`run()` 标准 Dijkstra——线性取「未确定中 dist 最小」（6 点无需堆）、松弛出边记 prev、**每确定一个点 push 一个 steps 快照**（含 justSettled/settled/dist 拷贝/relaxed），steps[0] 为初始；返回 order/dist/prev/steps。`pathTo(v)` 复跑 run 取 prev 沿链 unshift。逻辑层无状态（结构常量），可单测。
- **DijkstraViz**：`run()` 预计算 steps，`stepIndex` ref 在 [0,lastIndex] 推进（同步），所有高亮由 `steps[stepIndex]` 推导——settledSet / justSettled / relaxedKeys（`from-to`）/ updSet（relaxed 的目标点）；末步 showTree → treeKeys（prev 边）点亮最短路树。边视图按方向单位向量缩短到圆边露箭头（`Math.sqrt` 求长度，允许）+ 权重放中点法向偏移。距离表 6 格显 ∞/数字。**同步置态 + CSS 过渡**，L4 直接断言 .dvert.settled / .dedge.relaxed/tree / 距离表文本 / status。
- **新增「图算法」顶层分类**：useCategoryData（Menu）+ Home hooks 各追加第 3 个分类组；**改 TC-HOOK-01-1 两处**（Home `data` 长度 2→3 + data[2]『图算法』；Menu 同）。新建 `views/Article/Algorithm/` 目录放 Dijkstra.vue（与 DataStructure/SortAlgorithm 并列）。
- **零回归**：不碰 C-022 的 useGraph/GraphViz（无向无权），新建自包含 useDijkstra/DijkstraViz。
- **坑**：① Home hooks 在「计数排序」后插图算法分类时，原文计数排序后本就有注释掉的桶/基数排序块 + 闭合括号，首次 Edit 误把注释块和闭合重复了 → 读文件定位后删掉残留 201-214 行修复（提醒：在「最后一个元素 + 尾随注释 + 闭合」处插入要把锚点取到闭合括号、避免重复）。② 按钮「下一步/重置」互不为子串；status「最短」唯一。③ 距离表 ∞ 用 `'∞'` 字符，L4 断言 distText 含 '∞' / '9' 等。

## 自测报告

见 [test-cases.md](./test-cases.md#自测报告2026-06-29)。全门禁绿（format/lint/type-check/单测 792 + 覆盖率 93.11%/e2e 31），真机截图自检通过（初始带权图 + 走到底最短路树 + 距离表 [0,3,1,4,7,9]）。

## 变更历史

- 2026-06-29：创建（draft）→ TDD（L3 useDijkstra 12 → L4 DijkstraViz 8 → L4 Dijkstra 视图 2 + 新增图算法顶层分类 + 4 处接线 + 改 TC-HOOK-01-1 两处 → L5 e2e 1）→ 全门禁绿 → 真机自检 → verified。**图算法大类开张（M6 阶段一 G1）。**
