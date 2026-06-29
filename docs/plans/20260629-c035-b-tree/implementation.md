# 实现记录：B 树 / B+ 树（C-20260629-035）

> Status: verified
> Stable ID: C-20260629-035
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **useBTree.ts**（L3）：先 `useBTree.spec.ts`（TC-BTREE-LOGIC-01..12）跑红 → 实现固定 B+ 树 + `search` / `rangeScan` 跑绿。
2. **BTreeViz.vue**（L4）：先 `BTreeViz.spec.ts`（TC-VIZ-BTREEVIZ-01..09）跑红 → 实现 SVG 多 key 节点 + 下钻/范围点亮跑绿。
3. **BTree.vue + 4 处接线**（L4）：先 `BTree.spec.ts`（TC-VIEW-BTREE-01/02）跑红 → 建页 + 路由/菜单/首页/图标 + 改 HOOK 计数 13→14 跑绿。
4. **e2e**（L5）：`e2e/b-tree.e2e.ts`（TC-E2E-BTREE-01）。
5. 全门禁 → 回写四文档/三索引/roadmap/backlog → 两提交 → 双轨部署。

## 关键实现笔记

- **固定结构**：`buildTree()` 返回 `[root, l0, l1, l2]`；root `keys[25,45] children[l0,l1,l2]`，3 叶各 4 key + `nextId` 叶链。`byId` 用 `nodes.find`。逻辑层无状态（结构常量），search/rangeScan 纯函数 → 可单测、不反流。
- **下钻选子**：内部节点 `childIndex = keys.filter(k => k <= target).length`（routerKey = 右子树首 key，`>=` 走右）。`descend(target)` 返回 `{path, leaf}` 供 search/rangeScan 复用。
- **search**：descend → `found = leaf.keys.includes(target)`；返回 `{path, found, leafId, hitKey}`。
- **rangeScan（B+ 树灵魂）**：descend(lo) 定位起点叶 → 沿 `nextId` 链向右，每叶收 `lo≤k≤hi`、记 leafPath；某叶**末 key > hi** 即 break（后续叶更大）。空命中也返回定位到的起点叶（如 rangeScan(100,200) → leafPath [l2]、values []）。
- **点亮 class**：BTreeViz 4 个 `Set` —— `onpath`（节点 id，下钻路径 / 范围涉及叶，外框描边绿）、`hit`（`${leafId}:${key}`，查找命中绿）、`inrange`（范围命中黄）、`flow`（`lnk-${fromLeafId}`，范围扫过的叶链橙实线）。range 的黄格在组件里按 leafPath × [lo,hi] 重算 cell id（逻辑层只回 values 扁平数组）。
- **同步置态 + CSS 过渡**：search/rangeScan 同步返回 + 同步写 status/Set，高亮渐显交给 CSS `transition: fill/stroke 0.25s`，L4 可直接断言 `.bt-key.hit=1`/`.inrange=5`/`.bt-node.onpath=2`。
- **布局**：layout 表给每节点定 (x,y)；key 格 `i*KW` 横排（KW34/KH30）；root 居中上方、3 叶底排；root→叶 3 条 `.bt-child`；相邻叶 2 条 `.bt-link`（虚线 + marker 箭头，flow 时橙实线）。key id 带 nodeId（值 25/45 在 root 与叶重复）。
- **坑预防**：按钮「查找/范围查/重置」互不为子串（btn includes 用「查找」「范围」「重置」）；命中文案用「找到了」、未命中用「不存在」（避免「没找到」含「找到」子串坑）；范围文案含「扫到」。无新坑。

## 自测报告

见 [test-cases.md](./test-cases.md#自测报告2026-06-29)。全门禁绿（format/lint/type-check/单测 747 + 覆盖率 92.91%/e2e 29），真机截图自检通过（查找下钻命中 + 范围叶链横扫 5 格）。

## 变更历史

- 2026-06-29：创建（draft）→ TDD（L3 useBTree 12 → L4 BTreeViz 9 → L4 BTree 视图 2 + 4 处接线 + 改 2 HOOK → L5 e2e 1）→ 全门禁绿 → 真机自检 → verified。
