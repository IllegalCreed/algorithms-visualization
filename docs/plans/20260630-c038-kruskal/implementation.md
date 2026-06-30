# 实现记录：Kruskal 最小生成树（C-20260630-038）

> Status: verified
> Stable ID: C-20260630-038
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **useKruskal.ts**（L3）：先 `useKruskal.spec.ts`（TC-KRUSKAL-01..12）跑红 → 实现固定无向带权图 + 内置并查集 + `run/steps` 跑绿。
2. **KruskalViz.vue**（L4）：先 `KruskalViz.spec.ts`（TC-VIZ-KRUSKALVIZ-01..08）跑红 → 实现 SVG 图 + 边排序列表 + 单步判环跑绿。
3. **Kruskal.vue + 接线**（L4）：先 `Kruskal.spec.ts`（TC-VIEW-KRUSKAL-01/02）跑红 → 建页（Algorithm 目录）+ 图算法分类追加 Kruskal（Menu + 首页）+ 路由 + 图标 + 改 TC-HOOK-01-1 两处跑绿。
4. **e2e**（L5）：`e2e/kruskal.e2e.ts`（TC-E2E-KRUSKAL-01）。
5. 全门禁 → 回写四文档/三索引/roadmap(M6)/algorithms-backlog(G6 出池) → 两提交 → 双轨部署。

## 关键实现笔记

- **useKruskal**：固定 6 点 + 9 条无向带权边（已按权升序，id = 端点 label 对如 'AC'）。`run()` 内置并查集（parent 数组 + `find` 循环找根 + union 把一根指向另一根）；逐条边判 `find(u)≠find(v)`：是则加入 MST + union + 累计权重，否则记 rejected。**每条边产出一个 step 快照**（mst/rejected 拷贝 + current + accepted + weight），step0 为初始；返回 steps（10）+ mstEdges + totalWeight。逻辑层无状态、可单测。
- **KruskalViz**：`run()` 预计算 steps，`stepIndex` 在 [0,9] 推进（同步）；高亮由 `steps[stepIndex]` 推导——`klass(id)` 返回 `{mst, cycle, current}`（图的 `.kedge` 与右侧边排序列表 `.ke-row` 共用同一 klass，同步高亮）。current=本步考虑边（橙）、mst=已加入（绿加粗）、cycle=已成环跳过（红虚线/列表删除线）。status 末尾恒带「已选 N 条，权重和 W」→ 走到底含 18。同步置态，L4 直接断言计数。
- **接线（图算法分类追加第 2 项，不新建分类）**：router +kruskal；Docs/Menu + Home hooks 的「图算法」分类 children 追加 Kruskal；**改 TC-HOOK-01-1 两处**（图算法 children 1→2、断言 url 序列 ['dijkstra','kruskal']）。复用 C-037 的 Article/Algorithm 目录。
- **零回归**：不碰 C-037 useDijkstra/DijkstraViz、C-029 useUnionFind（Kruskal 自带轻量并查集，不依赖它）。
- **坑**：① Kruskal.vue 的 `<Callout>` 闭合一度误写成 `</p>`（标签不匹配会让 vue-tsc/build 失败）→ 改回 `</Callout>`，写完即查标签配对。② 按钮「下一步/重置」、状态「加入/成环/18」互不为子串，无坑。③ 边权 text 加 `paint-order:stroke` + 浅描边，避免压在边线上看不清。

## 自测报告

见 [test-cases.md](./test-cases.md#自测报告2026-06-30)。全门禁绿（format/lint/type-check/单测 814 + 覆盖率 93.26%/e2e 32），真机截图自检通过（走到底 MST 5 条绿 + 成环 4 条橙虚线 + 权重 18）。

## 变更历史

- 2026-06-30：创建（draft）→ TDD（L3 useKruskal 12 → L4 KruskalViz 8 → L4 Kruskal 视图 2 + 图算法分类追加 + 4 处接线 + 改 TC-HOOK-01-1 两处 → L5 e2e 1）→ 全门禁绿 → 真机自检 → verified。图算法分类含 Dijkstra + Kruskal 两个算法。
