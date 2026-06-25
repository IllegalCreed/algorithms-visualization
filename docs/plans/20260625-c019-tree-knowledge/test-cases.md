# 测试用例：树 Tree 知识页（BST）

> Status: verified
> Stable ID: C-20260625-019
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级            | 文件                                           | 编号区间                | 数量 |
| --------------- | ---------------------------------------------- | ----------------------- | ---- |
| L3 BST 逻辑     | `src/components/structures/useTree.spec.ts`    | `TC-TREE-LOGIC-01..10`  | 10   |
| L4 TreeViz 互动 | `src/components/structures/TreeViz.spec.ts`    | `TC-VIZ-TREEVIZ-01..10` | 10   |
| L4 树页         | `src/views/Article/DataStructure/Tree.spec.ts` | `TC-VIEW-TREE-01..02`   | 2    |
| L5 e2e          | `e2e/tree.e2e.ts`                              | `TC-E2E-TREE-01`        | 1    |

**合计新增 23 个 Case。**

**回归（不新增、必须仍绿）**：8 排序 + 栈 + 队列 + 数组 + 链表（含骨架与各 `use*`/`*Viz`）+ 播放器 + `TreeView`（堆排树轨）全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明骨架/TreeView 零改动、零回归。

## L3 — useTree（`TC-TREE-LOGIC-*`）

| TC               | 描述                                      | 预期                               |
| ---------------- | ----------------------------------------- | ---------------------------------- |
| TC-TREE-LOGIC-01 | 初始平衡树 50/30/70/20/40/60/80、pos 正确 | 7 节点、nodeAt 0/1/2/6=50/30/70/80 |
| TC-TREE-LOGIC-02 | has 命中/未命中                           | 50→T、99→F                         |
| TC-TREE-LOGIC-03 | insert 走位落正确 pos + 返回 path         | 35→ok、pos9、path[0,1,4]、8 节点   |
| TC-TREE-LOGIC-04 | insert 查重返回 dup、不增                 | 50→ok:F、dup、7 节点               |
| TC-TREE-LOGIC-05 | insert 维持 BST：任意插入后 inorder 升序  | inorder 已排序、含 35              |
| TC-TREE-LOGIC-06 | insert 超 4 层返回 depth                  | 90 ok→ 95 depth、path[0,2,6,14]    |
| TC-TREE-LOGIC-07 | search 命中返回 found + path              | 60→found、pos5、path[0,2,5]        |
| TC-TREE-LOGIC-08 | search 未命中返回 false + 走到空位 path   | 55→F、path[0,2,5]                  |
| TC-TREE-LOGIC-09 | inorder 初始 = 升序                       | [20,30,40,50,60,70,80]             |
| TC-TREE-LOGIC-10 | reset 复位 7 节点、清插入                 | 7 节点、inorder 初始升序           |

## L4 — TreeViz 互动（`TC-VIZ-TREEVIZ-*`）

| TC                | 描述                                 | 预期                              |
| ----------------- | ------------------------------------ | --------------------------------- |
| TC-VIZ-TREEVIZ-01 | 初始 7 节点 + 6 边 + 输入框 + 4 按钮 | 7 node、6 edge、input、4 btn      |
| TC-VIZ-TREEVIZ-02 | insert 增节点、含新值                | 8 node、含「35」                  |
| TC-VIZ-TREEVIZ-03 | insert 查重不增、解说已存在          | 7 node、status 含「已经在树里」   |
| TC-VIZ-TREEVIZ-04 | search 找到解说                      | status 含「找到」                 |
| TC-VIZ-TREEVIZ-05 | search 没找到解说                    | status 含「没找到」               |
| TC-VIZ-TREEVIZ-06 | 中序遍历解说含升序序列               | status 含「20 30 40 50 60 70 80」 |
| TC-VIZ-TREEVIZ-07 | 超 4 层解说上限                      | status 含「上限」                 |
| TC-VIZ-TREEVIZ-08 | reset 复位 7 节点                    | 7 node                            |
| TC-VIZ-TREEVIZ-09 | 非法值提示、不增                     | status 含「请输入」、7 node       |
| TC-VIZ-TREEVIZ-10 | 边数 = 节点数 - 1                    | insert 后 7 edge                  |

## L4 — 树页（`TC-VIEW-TREE-*`）

| TC              | 描述                       | 预期                     |
| --------------- | -------------------------- | ------------------------ |
| TC-VIEW-TREE-01 | 挂载渲染 Article + TreeViz | 两组件存在               |
| TC-VIEW-TREE-02 | 含「树」标题与 Playground  | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-TREE-01`）

| TC             | 描述                                                                                                           | 预期       |
| -------------- | -------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-TREE-01 | 导航 / 正文 + Playground / 初始 7 节点 / 输入 35 插入见 8 节点含值 35 / 中序遍历 status 含升序 / 重置回 7 节点 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%。`useTree` 纯逻辑（insert/search/inorder/place 走位）目标行覆盖 ≥90%；TreeViz 交互分支（insert ok/dup/depth、search found/not、inorder、reset、非法值）全覆盖（逐层高亮 setTimeout 视觉分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-25：创建并落地。实际新增 23 个 Case（useTree 10 + TreeViz 10 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 94.15%/91.65%/90.88%/95.09%（stmts/branch/funcs/lines，均过门槛）；TreeViz 行覆盖 98.8%（未覆盖仅查找命中 setTimeout 尾回调）；单测 462 passed（72 文件）+ e2e 15 passed，骨架/TreeView 零改动、8 排序 + 栈 + 队列 + 数组 + 链表零回归。
