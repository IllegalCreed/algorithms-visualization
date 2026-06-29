# 设计：B 树 / B+ 树（固定 2 层 B+ 树 + 多路下钻查找 + 叶链范围扫描，新页）

> Status: verified
> Stable ID: C-20260629-035
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/BTree.vue
   │  正文 + <Playground><BTreeViz/></Playground> + B树/B+树区别/插入分裂正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     BTreeViz.vue  ── 用 ── useBTree.ts（固定 B+ 树 + 纯 search / rangeScan，可单测）

4 处接线（同 B1–B5 套路）：
  router/index.ts        +/docs/b-tree  name 'b-tree'（懒加载）
  Docs/Menu/hooks.ts     数据结构分类 + {title:'B+ 树', url:'b-tree'}（线段树之后）
  Home/Main/hooks.ts     数据结构分类 + {title:'B+ 树', desc, icon:BTreeIcon, url:'b-tree'}
  assets/b-tree.svg      1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 13→14）
```

## 2. B+ 树逻辑 `useBTree.ts`（固定 2 层 B+ 树 + 纯 search / rangeScan）

```ts
export interface BNode {
  id: string;
  keys: number[];
  isLeaf: boolean;
  childrenIds: string[]; // 内部节点的子指针
  nextId: string | null; // 叶链 next（仅叶子）
}
export interface BSearchResult {
  path: string[]; // 下钻路径节点 id（root→叶）
  found: boolean;
  leafId: string;
  hitKey: number | null;
}
export interface BRangeResult {
  leafPath: string[]; // 范围扫描经过的叶 id
  values: number[]; // 扫到的 [lo,hi] 内的 key
}
export interface UseBTree {
  nodes: BNode[]; // [root, l0, l1, l2]
  byId: (id: string) => BNode;
  search: (target: number) => BSearchResult;
  rangeScan: (lo: number, hi: number) => BRangeResult;
}
```

固定结构（阶-5 B+ 树，2 层）：

```
root  keys [25, 45]   children [l0, l1, l2]
  ├─ l0  [5,10,15,20]   next l1
  ├─ l1  [25,30,35,40]  next l2
  └─ l2  [45,50,55,60]  next null
```

- **下钻选子**：内部节点 `childIndex = keys.filter(k => k <= target).length`（routerKey = 右子树首 key，`>=` 走右）。`target<25→子0`、`25≤t<45→子1`、`t≥45→子2`。
- **`search(target)`**（纯）：从 root 反复下钻到叶，`path` 记录经过节点；`found = leaf.keys.includes(target)`。
  - `search(30)`→ found、path `[root, l1]`、hitKey 30；`search(33)`→ not found、path `[root, l1]`；`search(5)`→ L0 found；`search(60)`→ L2 found；`search(100)`→ L2 not found。
- **`rangeScan(lo,hi)`**（纯，B+ 树灵魂）：先按 lo 下钻定位起点叶，再**沿 next 链向右**——每个叶收集 `lo≤k≤hi` 的 key 入 `values`、叶 id 入 `leafPath`；当某叶**最后一个 key > hi** 即停（后续叶更大）。
  - `rangeScan(12,38)`→ values `[15,20,25,30,35]`、leafPath `[l0,l1]`（L1 末 40>38 停）；`rangeScan(48,99)`→ `[50,55,60]`、`[l2]`；`rangeScan(5,60)`→ 12 个值、`[l0,l1,l2]`；`rangeScan(100,200)`→ `[]`、`[l2]`（定位到 l2 但无命中）。
- `nodes` 为常量（结构不变），search/rangeScan 纯函数；点亮全在 BTreeViz 的 Set 里，逻辑层无状态。

> **关键不变量**：查找只需下钻 O(log n) 层（这里 2 层定位 12 个数，对照 BST 要 4 层）；范围查只「定位一次 + 顺叶链扫一段」，这就是 B+ 树磁盘索引高效的可测证据。

## 3. B+ 树互动组件 `BTreeViz.vue`

### 3.1 结构与布局

```
.b-tree-viz (column, center)
 ├─ .toolbar   输入 a + 输入 b + 查找(a) / 范围查(a,b) / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽高
 │        <svg> <g.children> <line.bt-child × 3>（root→叶 子指针）
 │              <g.links>    <line.bt-link × 2>（叶链 L0→L1→L2，含箭头）
 │              <g.nodes>    .bt-node × 4（root + 3 叶；外框 + 多个 .bt-key 格）
 │                  .bt-node.onpath（下钻路径 / 范围涉及叶，描边高亮）
 │                  .bt-key.hit（查找命中，绿）/ .bt-key.inrange（范围命中，黄）
 │                  .bt-link.flow（范围扫描经过的叶链，点亮）
 └─ .status   状态解说行
```

- 坐标：3 叶底部一排（各 4 key 宽 136），root 居中上方（2 key 宽 68）；root 底 → 3 叶顶 3 条子指针；相邻叶之间 2 条叶链箭头。svg ~540×240。
- key 格：节点内按 `i*keyW` 横排 rect + 数字；外框包住整节点。key 格 id = `${nodeId}:${key}`（值在不同节点会重复，故带 nodeId）。

### 3.2 交互与动画

- **查找(a)**：`r = search(a)`（同步）→ 同步置 status + 点亮：`onpath = new Set(r.path)`（路径节点描边）、`hit = r.found ? new Set([\`${r.leafId}:${a}\`]) : ∅`（命中格绿）；清 range 高亮。
  - found：`查找 ${a}：从根下钻 ${r.path.length} 层就到叶子，找到了 ${a}。`；not found：`查找 ${a}：下钻到对应叶子，${a} 不存在。`
- **范围查(a,b)**：`r = rangeScan(a,b)`（同步）→ `onpath = new Set(r.leafPath)`（涉及叶描边）、`inrange = ` 叶链上 `a≤k≤b` 的格（黄）、`flow = ` leafPath 相邻对的叶链（点亮）；清 search 高亮。
  - `范围查 [${a}, ${b}]：定位起点叶后顺着叶链扫到 ${r.values.length} 个值${...}。`（含「扫到」）
- **重置**：清所有高亮、status 复位。
- search/rangeScan 同步（L4 同步断言 status / 高亮计数）。

### 3.3 视觉映射

| 元素     | 态      | 颜色 / 处理                  |
| -------- | ------- | ---------------------------- |
| key 格   | idle    | 浅绿 `#8bd3a0` + 深绿字      |
| 下钻路径 | onpath  | 节点外框描边深绿 `#2e7d32`   |
| 查找命中 | hit     | 绿 `#4caf50` + 白字          |
| 范围命中 | inrange | 黄 `#ffcf5c`                 |
| 叶链     | flow    | 范围扫描点亮（橙 `#f0a000`） |

## 4. B+ 树页 `BTree.vue` 正文大纲

```
<h1>B 树与 B+ 树</h1><p class="sub">数据结构 · 数据库与文件系统的索引</p>
<h2>什么是 B 树</h2>
<p>二叉查找树一个节点只存 1 个值、2 个孩子，数据一多就长得又瘦又高，查一次要走很多层。B 树反其道：一个节点存「一排有序 key + 一排孩子指针」，又矮又宽。所有叶子在同一层，几层就能在海量数据里定位——这正适合磁盘：一次 IO 读一个节点（装几十上百 key），层数越少 IO 越少。</p>
<h2>B+ 树：数据全在叶子 + 叶链</h2>
<p>B+ 树是 B 树的改良：内部节点只存「路标」做路由、不存数据，所有数据都落在叶子；叶子之间还用链表串起来。这样区间查询特别快——定位到起点叶子后，顺着叶链一路扫过去即可。MySQL InnoDB 主键索引、很多文件系统的目录索引，用的都是 B+ 树。</p>
<p>下面是一棵装了 12 个数的 B+ 树（2 层）。填 a 点「查找」看它从根下钻几层就命中；填 a、b 点「范围查」看它定位起点叶后顺着叶链横扫一段。</p>
<Playground><BTreeViz/></Playground>
<p>查找：从根开始，在节点的有序 key 里比较，决定走哪个孩子指针，几层就到叶子——O(log n)，但因为「多路」底数大，层数比二叉树少得多。范围查询：B+ 树定位一次再顺叶链扫，省去回树。插入太满时节点会「分裂」、删空会「合并」来保持平衡（这里固定结构，分裂/合并只作了解）。</p>
<h2>B 树 / B+ 树在哪里用</h2>
<Callout>数据库索引（MySQL InnoDB = B+ 树）；文件系统目录 / inode 索引；任何「海量有序数据 + 按 key 查 + 范围扫」的磁盘场景。</Callout>
<p>它把「多路 + 平衡 + 磁盘友好」做到了极致——这趟结构之旅工程味最浓的一站。</p>
```

## 5. 组件清单与改动面

| 文件                                        | 类型       | 改动                                          |
| ------------------------------------------- | ---------- | --------------------------------------------- |
| `src/components/structures/useBTree.ts`     | **新增**   | 固定 B+ 树 + 纯 search / rangeScan            |
| `src/components/structures/BTreeViz.vue`    | **新增**   | SVG 多 key 节点 + 下钻/范围点亮互动           |
| `src/views/Article/DataStructure/BTree.vue` | **新增**   | B+ 树知识页                                   |
| `src/router/index.ts`                       | 改（接线） | +`/docs/b-tree` name `b-tree`                 |
| `src/views/Docs/Menu/hooks.ts`              | 改（接线） | 数据结构 +「B+ 树」`url:'b-tree'`（线段树后） |
| `src/views/Home/Main/hooks.ts`              | 改（接线） | 数据结构 +「B+ 树」+ BTreeIcon                |
| `src/assets/b-tree.svg`                     | **新增**   | 1024 viewBox 黑剪影图标                       |
| `src/views/Home/Main/hooks.spec.ts`         | 改（计数） | TC-HOOK-01-2 数据结构 13→14                   |
| `src/views/Docs/Menu/hooks.spec.ts`         | 改（计数） | TC-HOOK-02-4 数据结构 13→14                   |

**零改动**：既有 13 结构页 / 8 排序 / 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 4 处接线为**追加**（既有条目顺序不变、url 唯一）。
- 改动仅 2 处 HOOK 计数（数据结构 13→14）——新增结构的合理行为变化，非回归；其余既有 Case 零改动通过。
- 新页路由 name `b-tree` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-BTREE-LOGIC-*` / `TC-VIZ-BTREEVIZ-*` / `TC-VIEW-BTREE-01/02` / `TC-E2E-BTREE-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useBTree`：4 节点结构 + routerKeys + 叶 keys + 叶链 next；search(30) found path[root,l1]、search(33) not found、search(5)/60 落叶、search(100) not found；rangeScan(12,38)=[15,20,25,30,35] leafPath[l0,l1]、rangeScan(48,99)=[50,55,60] [l2]、rangeScan(5,60) 12 值 3 叶、rangeScan(100,200)=[] [l2]。
- **L4 互动** `TC-VIZ-BTREEVIZ-*`：4 bt-node + 14 bt-key + 2 bt-link + a/b 输入 + 3 按钮；key 显数字（含 5、60）；查找 30 status 含「找到了」+ hit 1；查找 33 含「不存在」；查找 5 找到；范围 12,38 含「扫到」+ inrange 5；范围 48,99 inrange 3；查找 30 路径 onpath 2；重置清高亮。
- **L4 视图** `TC-VIEW-BTREE-01/02`：含 Article+BTreeViz；「B 树」标题 + Playground。
- **L5 e2e** `TC-E2E-BTREE-01`：`/docs/b-tree` 限定 `.b-tree-viz`：4 节点、查找 30 含「找到了」、范围 12,38 含「扫到」、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 14 项。
