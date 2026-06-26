# 测试用例：字典树 Trie（固定词集 + 查找三结局 + 前缀自动补全）

> Status: verified
> Stable ID: C-20260626-028
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 概览

| 层级            | 文件                                           | 编号区间                | 数量 |
| --------------- | ---------------------------------------------- | ----------------------- | ---- |
| L3 字典树逻辑   | `src/components/structures/useTrie.spec.ts`    | `TC-TRIE-LOGIC-01..10`  | 10   |
| L4 TrieViz 互动 | `src/components/structures/TrieViz.spec.ts`    | `TC-VIZ-TRIEVIZ-01..08` | 8    |
| L4 字典树页     | `src/views/Article/DataStructure/Trie.spec.ts` | `TC-VIEW-TRIE-01/02`    | 2    |
| L5 e2e          | `e2e/trie.e2e.ts`                              | `TC-E2E-TRIE-01`        | 1    |

**合计新增 21 个 Case。** 无现存 `TRIE` Case，命名空间干净（新结构、新前缀）。

**修改（计数变化，非回归）**：`TC-HOOK-01-2`（Home 数据结构 8→9）、`TC-HOOK-02-4`（Menu 数据结构 8→9）——新增结构的合理行为变化。

**回归（不新增、必须仍绿）**：既有 8 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case（除上述 2 处 HOOK 计数）—— 由全门禁证明零改动、零回归。

## L3 — useTrie（`TC-TRIE-LOGIC-*`）

| TC               | 描述                                                   | 预期                               |
| ---------------- | ------------------------------------------------------ | ---------------------------------- |
| TC-TRIE-LOGIC-01 | nodes 11、edges 10、words 6（排序）                    | [car,card,cat,cup,do,dog]          |
| TC-TRIE-LOGIC-02 | root：char ''、isEnd false、parent -1                  | 一致                               |
| TC-TRIE-LOGIC-03 | 节点带坐标 + id 唯一 + 非 root char 单字符             | x 数、Set.size==len、char.length 1 |
| TC-TRIE-LOGIC-04 | 共享前缀：search(car).path 与 search(cat).path 前 3 同 | 均 [0,1,2] 开头                    |
| TC-TRIE-LOGIC-05 | search('card')：found、reason 'found'                  | found true                         |
| TC-TRIE-LOGIC-06 | search('ca')：prefix-only（不是词）                    | found false、reason 'prefix-only'  |
| TC-TRIE-LOGIC-07 | search('cab')：no-edge（不存在）                       | found false、reason 'no-edge'      |
| TC-TRIE-LOGIC-08 | startsWith('ca').words = [car,card,cat]                | 一致                               |
| TC-TRIE-LOGIC-09 | startsWith('do')：words [do,dog]、subtree 2 节点       | 一致                               |
| TC-TRIE-LOGIC-10 | startsWith('xyz')：prefixNode -1、words []             | 一致                               |

## L4 — TrieViz 互动（`TC-VIZ-TRIEVIZ-*`）

| TC                | 描述                                                | 预期       |
| ----------------- | --------------------------------------------------- | ---------- |
| TC-VIZ-TRIEVIZ-01 | 11 tnode + 10 edge + 输入框 + 查找/前缀/重置 3 按钮 | 各断言通过 |
| TC-VIZ-TRIEVIZ-02 | 节点字符含 c/a/t/r/d/u/p/o/g                        | 文本包含   |
| TC-VIZ-TRIEVIZ-03 | 查找 card：status 含「是一个词」                    | status 含  |
| TC-VIZ-TRIEVIZ-04 | 查找 ca：status 含「前缀」                          | status 含  |
| TC-VIZ-TRIEVIZ-05 | 查找 cab：status 含「不存在」                       | status 含  |
| TC-VIZ-TRIEVIZ-06 | 前缀 ca：status 含「car」（补全列表）               | status 含  |
| TC-VIZ-TRIEVIZ-07 | 前缀 ca：子树点亮 .tnode.lit = 4（节点 a,r,d,t）    | 4 个 lit   |
| TC-VIZ-TRIEVIZ-08 | 重置：清高亮（.tnode.lit/.hot 为 0）                | 0          |

## L4 — 字典树页（`TC-VIEW-TRIE-*`）

| TC              | 描述                          | 预期   |
| --------------- | ----------------------------- | ------ |
| TC-VIEW-TRIE-01 | 挂载渲染 Article + TrieViz    | 均存在 |
| TC-VIEW-TRIE-02 | 含「字典树」标题与 Playground | 含     |

## L5 — e2e（`TC-E2E-TRIE-01`）

| TC             | 描述                                                                                             | 预期       |
| -------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| TC-E2E-TRIE-01 | `/docs/trie` 限定 `.trie-viz`：11 节点 / 查找 card status 含「词」/ 前缀 ca status 含 car / 重置 | 各断言通过 |

## 修改（计数）

| TC           | 文件                                | 改动         |
| ------------ | ----------------------------------- | ------------ |
| TC-HOOK-01-2 | `src/views/Home/Main/hooks.spec.ts` | 数据结构 8→9 |
| TC-HOOK-02-4 | `src/views/Docs/Menu/hooks.spec.ts` | 数据结构 8→9 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`useTrie` 纯逻辑（建树 + 布局 + search 三结局 + startsWith found/no-edge + 词回溯）L3 全覆盖；TrieViz 同步分支（onSearch 三态、onPrefix found/no-edge、onReset）L4 覆盖（走位点亮 setTimeout 由 e2e/肉眼复核）。

## 变更历史

- 2026-06-26：创建并落地。M4 广度 B1（首个广度新结构）。实际新增 21 个 Case（useTrie 10 + TrieViz 8 + view 2 + e2e 1）+ 改 2 处 HOOK 计数（数据结构 8→9），全绿；已回写三索引。覆盖率 All files 92.54%/89.43%/93.46%/93.73%（聚合均过门槛）；useTrie 纯逻辑 L3 全覆盖、TrieViz 86.56% 行（空输入守卫 + 走位 setTimeout 由 e2e 复核）。单测 641 passed（94 文件）+ e2e 24 passed。新页 4 处接线（路由/菜单/首页/trie.svg）均接通：真机另验——字典树前缀 ca 走位 + 子树 {a,r,d,t} 点亮 + 单词结尾环（car/card/cat/cup/do/dog）+ 自动补全解说；首页字典树卡片 + 新图标渲染正常。既有 8 结构 + 8 排序 + 播放器 + 骨架零回归。命名空间 `TRIE`/`TRIEVIZ` 干净。
