# 测试用例：哈希表 Hash 知识页（拉链法）

> Status: verified
> Stable ID: C-20260625-021
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级            | 文件                                           | 编号区间                | 数量 |
| --------------- | ---------------------------------------------- | ----------------------- | ---- |
| L3 哈希逻辑     | `src/components/structures/useHash.spec.ts`    | `TC-HASH-LOGIC-01..10`  | 10   |
| L4 HashViz 互动 | `src/components/structures/HashViz.spec.ts`    | `TC-VIZ-HASHVIZ-01..10` | 10   |
| L4 哈希页       | `src/views/Article/DataStructure/Hash.spec.ts` | `TC-VIEW-HASH-01..02`   | 2    |
| L5 e2e          | `e2e/hash.e2e.ts`                              | `TC-E2E-HASH-01`        | 1    |

**合计新增 23 个 Case。** 无现存 `HASH` Case（哈希无排序版），命名空间无需避让。

**回归（不新增、必须仍绿）**：8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆（含骨架与各 `use*`/`*Viz`）+ 播放器 全部现有 Case —— 由全门禁 `pnpm test:unit run` 证明零改动、零回归。

## L3 — useHash（`TC-HASH-LOGIC-*`）

| TC               | 描述                                              | 预期                          |
| ---------------- | ------------------------------------------------- | ----------------------------- |
| TC-HASH-LOGIC-01 | 初始：7 桶、桶1=[15,8]、桶2=[23]、桶4=[4]、size 4 | 一致                          |
| TC-HASH-LOGIC-02 | hash = key % 7                                    | 11→4、8→1、7→0                |
| TC-HASH-LOGIC-03 | has 命中/未命中                                   | 15→T、99→F                    |
| TC-HASH-LOGIC-04 | insert 空桶直放（无冲突）                         | bucket 0、collision F、[7]    |
| TC-HASH-LOGIC-05 | insert 冲突追加链尾                               | bucket 4、collision T、[4,11] |
| TC-HASH-LOGIC-06 | insert 查重不插                                   | ok F、dup、[15,8]             |
| TC-HASH-LOGIC-07 | search 命中返回 bucket + steps                    | found、bucket 1、steps 2      |
| TC-HASH-LOGIC-08 | search 没找到（走完链）                           | found F、bucket 1、steps 2    |
| TC-HASH-LOGIC-09 | 满 HASH_MAX：canInsert F、insert full、id 唯一    | size 16、full、Set.size==len  |
| TC-HASH-LOGIC-10 | reset 复位初始                                    | 桶1=[15,8]、size 4            |

## L4 — HashViz 互动（`TC-VIZ-HASHVIZ-*`）

| TC                | 描述                                      | 预期                                |
| ----------------- | ----------------------------------------- | ----------------------------------- |
| TC-VIZ-HASHVIZ-01 | 初始 7 桶 + 桶1 含 2 项 + 输入框 + 3 按钮 | 7 bucket、桶1 2 entry、input、3 btn |
| TC-VIZ-HASHVIZ-02 | insert 空桶直放                           | 桶0 1 项「7」                       |
| TC-VIZ-HASHVIZ-03 | insert 冲突追加链尾                       | 桶4 2 项、末「11」                  |
| TC-VIZ-HASHVIZ-04 | insert 总项数 +1                          | 4 → 5                               |
| TC-VIZ-HASHVIZ-05 | insert 查重不增、解说已存在               | 仍 4 项、status 含「已经在」        |
| TC-VIZ-HASHVIZ-06 | search 命中解说                           | status 含「找到」                   |
| TC-VIZ-HASHVIZ-07 | search 没找到解说                         | status 含「不存在」                 |
| TC-VIZ-HASHVIZ-08 | insert 解说含 hash 算式                   | status 含「% 7」                    |
| TC-VIZ-HASHVIZ-09 | 非法值提示、不增                          | status 含「请输入」、4 项           |
| TC-VIZ-HASHVIZ-10 | reset 复位 4 项                           | 4 项                                |

## L4 — 哈希页（`TC-VIEW-HASH-*`）

| TC              | 描述                          | 预期                     |
| --------------- | ----------------------------- | ------------------------ |
| TC-VIEW-HASH-01 | 挂载渲染 Article + HashViz    | 两组件存在               |
| TC-VIEW-HASH-02 | 含「哈希表」标题与 Playground | 标题文本 + `.playground` |

## L5 — e2e（`TC-E2E-HASH-01`）

| TC             | 描述                                                                                            | 预期       |
| -------------- | ----------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-HASH-01 | 导航 / 正文 + Playground / 初始 7 桶+4 项 / 输入 11 插入见桶4 变 2 项含 11 + 算式 / 重置回 4 项 | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useHash` 纯逻辑（hash/insert/search/has）L3 全覆盖；HashViz 同步分支（insert 空放/冲突/查重/满、search 命中/没找到、非法值）L4 覆盖（扫链 setTimeout 分步分支由 e2e/肉眼复核）。

## 变更历史

- 2026-06-25：创建并落地。实际新增 23 个 Case（useHash 10 + HashViz 10 + view 2 + e2e 1），全绿；已回写三索引。覆盖率 All files 92.33%/89.71%/92.30%/93.20%（stmts/branch/funcs/lines，聚合均过门槛）；HashViz 88.75% 行（未覆盖仅满桶分支 + 扫链 setTimeout 异步尾，e2e 覆盖）；单测 506 passed（78 文件）+ e2e 17 passed，骨架零改动、8 排序 + 栈 + 队列 + 数组 + 链表 + 树 + 堆零回归。
