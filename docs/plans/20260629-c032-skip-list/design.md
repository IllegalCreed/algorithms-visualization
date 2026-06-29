# 设计：跳表 Skip List（固定多层结构 + 楼梯式查找，新页）

> Status: verified
> Stable ID: C-20260629-032
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/SkipList.vue
   │  正文 + <Playground><SkipListViz/></Playground> + 楼梯查找/随机层数正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     SkipListViz.vue  ── 用 ── useSkipList.ts（固定 nodes/heights + 纯 search 楼梯路径，可单测）

4 处接线（同 B1/B2/B3 套路）：
  router/index.ts      +/docs/skip-list  name 'skip-list'（懒加载）
  Docs/Menu/hooks.ts   数据结构分类 + {title:'跳表', url:'skip-list'}（LRU 之后）
  Home/Main/hooks.ts   数据结构分类 + {title:'跳表', desc, icon:SkipListIcon, url:'skip-list'}
  assets/skip-list.svg 1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 11→12）
```

## 2. 跳表逻辑 `useSkipList.ts`（固定 nodes/heights + 纯 search 楼梯路径）

```ts
export const SKIP_VALUES = [1, 3, 5, 7, 9, 11, 13, 15];
export const SKIP_HEIGHTS = [4, 1, 2, 1, 3, 1, 2, 1];
export const SKIP_MAX_LEVEL = 4;

export interface SkipNode {
  id: string;
  value: number; // head 为 -Infinity
  height: number;
  col: number; // 0 = head、1..8 = 元素（按值升序）
  isHead: boolean;
}
export interface SkipStep {
  node: number; // nodes 下标
  level: number;
  move: 'start' | 'right' | 'down';
}
export interface SkipSearchResult {
  found: boolean;
  path: SkipStep[]; // 楼梯步序
  visitedValues: number[]; // 落在过的元素值（去重、不含 head）
}
export interface UseSkipList {
  nodes: SkipNode[]; // [head, ...8 元素]
  maxLevel: number;
  present: (nodeIdx: number, level: number) => boolean; // level < height
  levelNodes: (level: number) => number[]; // 该层 present 的节点下标（含 head），左→右
  search: (target: number) => SkipSearchResult;
}
```

- `nodes[0]` = head（value `-Infinity`、height 4、col 0、isHead）；`nodes[1..8]` = 元素（value/height = SKIP_VALUES/SKIP_HEIGHTS[i-1]、col i）。
- `present(n, lv)` = `lv < nodes[n].height`；各层 present 元素数：**L0 8、L1 4（1,5,9,13）、L2 2（1,9）、L3 1（1）**。
- `nextAtLevel(cur, lv)` = `cur` 右侧（col 更大）第一个 `present(., lv)` 的节点；无则 -1。
- `search(target)`：`cur=head`、`level=maxLevel-1`；循环——在当前层 `while next!=-1 && nodes[next].value <= target` 右移；到 `level 0` 停、否则下沉一层；`found = !head && cur.value === target`。`path` 记每步 {node,level,move}，`visitedValues` 为去重元素值。
  - `search(11)` → found、`visitedValues [1,9,11]`（快车道跳过 3,5,7）。
  - `search(8)` → 落 7、not found、`visitedValues [1,5,7]`。
  - `search(1)`/`search(15)` → found；`search(99)` → not found（落 15）。
- **关键不变量**：高层快车道让 search 跳过大段元素（`visitedValues` 远少于全部 8 个）——这就是 O(log n) 的可测证据；path level 单调不增（楼梯只向右/下沉）。

> 注：跳表固定（无 reactive），useSkipList 返回静态数据 + 纯 search；楼梯点亮动画由 SkipListViz 用 setTimeout 驱动（同步数据 + 延时高亮，L4 可断言）。

## 3. 跳表互动组件 `SkipListViz.vue`

### 3.1 结构与布局

```
.skip-list-viz (column, center)
 ├─ .toolbar   输入 + 查找 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「网格」：固定宽高
 │        <svg> <g.links> 每层相邻 present 节点的横线 <line.skip-link>
 │              <g.cells> 每个 (节点,层) 一个 .skip-cell（rect + 值；head 标 H）
 │                  .skip-cell.lit（走位黄）/ .skip-cell.hot（命中深绿）
 │        col = 元素位置（head 在最左）、level 0 在最下、level 高在上
 └─ .status   状态解说行（走过序列 + 命中/不存在 + 跳过提示）
```

- 坐标：`colX(col)=28+col*54`、`levelY(level)=18+(maxLevel-1-level)*46`；cell 居中于 (colX,levelY)。
- 横线：每层把 present 节点按 col 升序相邻相连。

### 3.2 交互与动画

- **查找**：`r = search(input)`（同步）→ **同步**置 status（`走过 ${visitedValues.join(' → ')}，${found?'找到了！':'没找到（不存在）'}；靠上层快车道跳过了中间元素。`，可测）→ 按 `r.path` 逐格点亮（`.lit` 黄），命中末格 `.hot` 深绿。busy 防重入、卸载清理。
- **重置**：清点亮、status 复位。
- `search` 同步返回（L4 同步断言 status）；点亮延时。

### 3.3 视觉映射

| 元素     | 态   | 颜色 / 处理             |
| -------- | ---- | ----------------------- |
| 单元格   | idle | 浅绿 `#8bd3a0` + 深绿值 |
| head     | head | 灰「H」哨兵             |
| 走位中   | lit  | 黄 `#ffcf5c`            |
| 命中     | hot  | 深绿 `#4caf50` + 白字   |
| 同层连线 | link | 半透明灰线（SVG）       |

## 4. 跳表页 `SkipList.vue` 正文大纲

```
<h1>跳表 Skip List</h1><p class="sub">数据结构 · 给有序链表加几层「快车道」</p>
<h2>什么是跳表</h2>
<p>有序链表查一个值得从头一个个走，O(n)。跳表的点子：在上面再架几层「快车道」——底层是全部元素，每往上一层只保留一部分做索引，像高速公路的出入口。</p>
<p>查找从最高层快车道往右大步走，一旦下一个就超过目标，就下沉一层接着走，到底层看命中没。这里固定放了 8 个值、4 层（L0 全有，往上折半）。查一个值，看它怎么走楼梯、怎么跳过中间一串。</p>
<Playground><SkipListViz/></Playground>
<p>因为高层一步能跨过好几个元素，平均查找只要 O(log n)，比有序链表快得多，又比平衡树好实现。插入时新元素该升到几层？靠「抛硬币」随机决定（一半概率再升一层）——所以跳表是概率型结构，期望层数 O(log n)。</p>
<h2>跳表在哪里用</h2>
<Callout>Redis 有序集合 zset 的底层；需要有序 + 范围查询又想好实现的场景；并发跳表（无锁/细粒度锁好做）。</Callout>
<p>它是「多层链表」——链表家族里用空间换时间的漂亮一招。</p>
```

## 5. 组件清单与改动面

| 文件                                           | 类型       | 改动                                          |
| ---------------------------------------------- | ---------- | --------------------------------------------- |
| `src/components/structures/useSkipList.ts`     | **新增**   | 固定 nodes/heights + 纯 search 楼梯路径       |
| `src/components/structures/SkipListViz.vue`    | **新增**   | SVG 网格 + 同层连线 + 楼梯查找点亮互动        |
| `src/views/Article/DataStructure/SkipList.vue` | **新增**   | 跳表知识页                                    |
| `src/router/index.ts`                          | 改（接线） | +`/docs/skip-list` name `skip-list`           |
| `src/views/Docs/Menu/hooks.ts`                 | 改（接线） | 数据结构 +「跳表」`url:'skip-list'`（LRU 后） |
| `src/views/Home/Main/hooks.ts`                 | 改（接线） | 数据结构 +「跳表」+ SkipListIcon              |
| `src/assets/skip-list.svg`                     | **新增**   | 1024 viewBox 黑剪影图标                       |
| `src/views/Home/Main/hooks.spec.ts`            | 改（计数） | TC-HOOK-01-2 数据结构 11→12                   |
| `src/views/Docs/Menu/hooks.spec.ts`            | 改（计数） | TC-HOOK-02-4 数据结构 11→12                   |

**零改动**：既有 11 结构页 / 8 排序 / 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 4 处接线为**追加**（既有条目顺序不变、url 唯一）。
- 改动仅 2 处 HOOK 计数（数据结构 11→12）——新增结构的合理行为变化，非回归；其余既有 Case 零改动通过。
- 新页路由 name `skip-list` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-SKIP-LOGIC-*` / `TC-VIZ-SKIPVIZ-*` / `TC-VIEW-SKIP-01/02` / `TC-E2E-SKIP-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useSkipList`：nodes 9（head+8）/maxLevel 4；heights；各层元素数 8/4/2/1；search(11) found + visitedValues [1,9,11]；search(8) not found [1,5,7]；search(1)/(15) found；search(99) not found；path level 单调不增。
- **L4 互动** `TC-VIZ-SKIPVIZ-*`：网格 cell 数 19 + 输入 + 查找/重置 + head；元素值 1..15；查找 11 status 含「跳过」「找到」；查找 8 含「没找到」；查找 11 点亮路径（lit>0）；查找 15；重置清高亮。
- **L4 视图** `TC-VIEW-SKIP-01/02`：含 Article+SkipListViz；「跳表」标题 + Playground。
- **L5 e2e** `TC-E2E-SKIP-01`：`/docs/skip-list` 限定 `.skip-list-viz`：cell 渲染、查找 11 status 含跳过/找到、查找 8 不存在、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 12 项。
