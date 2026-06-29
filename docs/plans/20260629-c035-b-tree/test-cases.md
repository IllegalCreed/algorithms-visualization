# 测试用例：B 树 / B+ 树（C-20260629-035）

> Status: verified
> Stable ID: C-20260629-035
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（useBTree 纯逻辑）/ L4（BTreeViz 互动 + BTree 视图）/ L5（B+ 树页 e2e）
> 命名空间：`TC-BTREE-LOGIC-*`、`TC-VIZ-BTREEVIZ-*`、`TC-VIEW-BTREE-*`、`TC-E2E-BTREE-*`；**改** `TC-HOOK-01-2` / `TC-HOOK-02-4`

## L3 —— `useBTree` 纯逻辑（`src/components/structures/useBTree.spec.ts`）

固定 2 层 B+ 树：root `[25,45]` → 叶 l0 `[5,10,15,20]` / l1 `[25,30,35,40]` / l2 `[45,50,55,60]`，叶链 l0→l1→l2。

| 用例 ID           | 场景              | 输入 / 操作          | 期望                                                                                  |
| ----------------- | ----------------- | -------------------- | ------------------------------------------------------------------------------------- |
| TC-BTREE-LOGIC-01 | 结构规模与根      | 初始                 | `nodes.length===4`；root `keys==[25,45]`、`isLeaf===false`、`childrenIds==[l0,l1,l2]` |
| TC-BTREE-LOGIC-02 | 叶子 keys         | 初始                 | l0 `[5,10,15,20]`、l1 `[25,30,35,40]`、l2 `[45,50,55,60]`，均 isLeaf                  |
| TC-BTREE-LOGIC-03 | 叶链 next         | 初始                 | l0.next===l1、l1.next===l2、l2.next===null                                            |
| TC-BTREE-LOGIC-04 | 查找命中·下钻路径 | `search(30)`         | found；path `['bt-root','bt-l1']`；leafId `bt-l1`、hitKey 30                          |
| TC-BTREE-LOGIC-05 | 查找未命中        | `search(33)`         | not found；path `['bt-root','bt-l1']`；hitKey null                                    |
| TC-BTREE-LOGIC-06 | 查找落最左叶      | `search(5)`          | found；leafId `bt-l0`                                                                 |
| TC-BTREE-LOGIC-07 | 查找落最右叶      | `search(60)`         | found；leafId `bt-l2`                                                                 |
| TC-BTREE-LOGIC-08 | 大值未命中落右叶  | `search(100)`        | not found；leafId `bt-l2`                                                             |
| TC-BTREE-LOGIC-09 | 范围查·跨两叶     | `rangeScan(12,38)`   | values `[15,20,25,30,35]`；leafPath `['bt-l0','bt-l1']`                               |
| TC-BTREE-LOGIC-10 | 范围查·仅右叶     | `rangeScan(48,99)`   | values `[50,55,60]`；leafPath `['bt-l2']`                                             |
| TC-BTREE-LOGIC-11 | 范围查·全表       | `rangeScan(5,60)`    | values.length 12；leafPath 3 个叶                                                     |
| TC-BTREE-LOGIC-12 | 范围查·空命中     | `rangeScan(100,200)` | values `[]`；leafPath `['bt-l2']`（定位到叶但无命中）                                 |

## L4 —— `BTreeViz` 互动（`src/components/structures/BTreeViz.spec.ts`）

挂载组件断言。helper：`search`（填 a 点查找）、`range`（填 a,b 点范围查）。

| 用例 ID            | 场景              | 操作               | 期望                                                                                 |
| ------------------ | ----------------- | ------------------ | ------------------------------------------------------------------------------------ |
| TC-VIZ-BTREEVIZ-01 | 初始结构渲染      | mount              | 4 个 `.bt-node`、14 个 `.bt-key`、2 条 `.bt-link`、a/b 两输入、查找/范围查/重置 按钮 |
| TC-VIZ-BTREEVIZ-02 | key 格显数字      | mount              | key 文本含 `5`、`25`、`60`                                                           |
| TC-VIZ-BTREEVIZ-03 | 查找命中·解说+格  | a=30 → 查找        | status 含「找到了」；`.bt-key.hit` 数量 1                                            |
| TC-VIZ-BTREEVIZ-04 | 查找命中·下钻路径 | a=30 → 查找        | `.bt-node.onpath` 数量 2（root + 叶）                                                |
| TC-VIZ-BTREEVIZ-05 | 查找未命中        | a=33 → 查找        | status 含「不存在」；`.bt-key.hit` 数量 0                                            |
| TC-VIZ-BTREEVIZ-06 | 查找落最左叶      | a=5 → 查找         | status 含「找到了」                                                                  |
| TC-VIZ-BTREEVIZ-07 | 范围查·跨两叶     | a=12,b=38 → 范围查 | status 含「扫到」；`.bt-key.inrange` 数量 5                                          |
| TC-VIZ-BTREEVIZ-08 | 范围查·仅右叶     | a=48,b=99 → 范围查 | `.bt-key.inrange` 数量 3                                                             |
| TC-VIZ-BTREEVIZ-09 | 重置清高亮        | 先查找 30，再重置  | `.bt-key.hit`、`.bt-node.onpath` 均为 0                                              |

## L4 —— `BTree` 视图（`src/views/Article/DataStructure/BTree.spec.ts`）

| 用例 ID          | 场景         | 期望                                                   |
| ---------------- | ------------ | ------------------------------------------------------ |
| TC-VIEW-BTREE-01 | 页面骨架渲染 | 含 `Article`；含「B 树」标题文案；含 `Playground`      |
| TC-VIEW-BTREE-02 | 内嵌互动组件 | 渲染 `BTreeViz`（存在 `.b-tree-viz`、4 个 `.bt-node`） |

## L5 —— B+ 树页 e2e（`e2e/b-tree.e2e.ts`）

限定容器 `.b-tree-viz`，避免与正文文字串扰。

| 用例 ID         | 场景            | 操作                                             | 期望                                                                                  |
| --------------- | --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------- |
| TC-E2E-BTREE-01 | 页面可达 + 互动 | 访问 `/docs/b-tree`；查找 30；范围查 12,38；重置 | 4 个 `.bt-node`；查找后 status 含「找到了」；范围后 status 含「扫到」；重置后高亮清空 |

## 回归（改计数）

| 用例 ID      | 文件                                | 改动                                          |
| ------------ | ----------------------------------- | --------------------------------------------- |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构分类条目数 13→**14**（新增「B+ 树」） |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构分类条目数 13→**14**（新增「B+ 树」） |

## 其它回归

- 既有 13 结构页 + 8 排序 + 播放器 + 骨架：现有 Case **零改动**全绿（除上面两条计数）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位（参考既有 ~90%）。

## 自测报告（2026-06-29）

- 执行命令：`pnpm format` → `pnpm format:check` / `pnpm lint:check` / `pnpm type-check` / `pnpm test:unit run --coverage` / `pnpm exec playwright test`
- 新增用例：L3 12（TC-BTREE-LOGIC-01..12）+ L4 互动 9（TC-VIZ-BTREEVIZ-01..09）+ L4 视图 2（TC-VIEW-BTREE-01/02）+ L5 1（TC-E2E-BTREE-01）= **24 新**；改 2 计数（TC-HOOK-01-2 / TC-HOOK-02-4）。
- 结果：**全绿**。单测 `747 passed`（109 文件）；e2e `29 passed`（含 TC-E2E-BTREE-01）。
- 覆盖率（聚合）：Statements 92.91% / Branches 90.3% / Functions 93.9% / Lines 93.91%——均高于门槛（≥70% / ≥60%）。BTreeViz.vue 94.8%/89.65%/100%/94.2%；useBTree 纯逻辑由 12 条 L3 全量覆盖；BTree.vue 静态模板挂载渲染。
- 真机自检（Playwright 截图，localhost:5173 `/docs/b-tree`）：初始 root [25,45] + 3 叶 [5,10,15,20]/[25,30,35,40]/[45,50,55,60] + 子指针 + 叶链虚线箭头正确；查找 30 → root + 中间叶描边（下钻路径）+ 30 格深绿命中 + 状态「下钻 2 层…找到了 30」；范围查 [12,38] → 15,20,25,30,35 共 5 格黄高亮、L0→L1 叶链点亮橙实线、状态「扫到 5 个值：15, 20, 25, 30, 35」。
- 结论：达成验收口径，**verified**。
