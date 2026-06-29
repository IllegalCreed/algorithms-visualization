# 设计：LRU 缓存（按最近使用排序 + 满了淘汰最久没用，新页）

> Status: verified
> Stable ID: C-20260629-031
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/Lru.vue
   │  正文 + <Playground><LruViz/></Playground> + 哈希+双链表正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     LruViz.vue  ── 用 ── useLRU.ts（entries[] MRU→LRU + get/put + 淘汰，可单测）

4 处接线（同 B1/B2 套路）：
  router/index.ts    +/docs/lru  name 'lru'（懒加载）
  Docs/Menu/hooks.ts 数据结构分类 + {title:'LRU 缓存', url:'lru'}（并查集之后）
  Home/Main/hooks.ts 数据结构分类 + {title:'LRU 缓存', desc, icon:LruIcon, url:'lru'}
  assets/lru.svg     1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 10→11）
```

## 2. LRU 逻辑 `useLRU.ts`（entries[] MRU→LRU + get/put + 淘汰）

```ts
export const LRU_CAP = 4;

export interface LruResult {
  type: 'hit' | 'miss' | 'put-new' | 'put-update';
  key: number;
  value: number | null;
  evicted: number | null; // 被淘汰的 key（put-new 溢出时），否则 null
}
export interface UseLRU {
  entries: Ref<[string, number, number][]>; // [稳定id, key, value]；index 0 = MRU、末位 = LRU
  capacity: number;
  size: ComputedRef<number>;
  get: (key: number) => LruResult;
  put: (key: number, value: number) => LruResult;
  reset: () => void;
}
```

- 初始 keys MRU→LRU `[3,2,1]`（值 30/20/10）；稳定 id 驱动 TransitionGroup。
- `get(key)`：`findIndex` 命中 → splice 出再 `unshift`（移到最前 MRU），`{type:'hit', value}`；未命中 → `{type:'miss', value:null}`。
- `put(key,value)`：
  - 已有键 → splice 出、以**同 id 新 value** unshift 到最前，`{type:'put-update'}`。
  - 新键 → unshift 到最前；若 `length > capacity` → `pop()` 淘汰末位（LRU），`evicted` = 被淘汰 key；`{type:'put-new', evicted}`。
- `size` = entries 长度；`reset` 重建 `[3,2,1]`。
- **关键不变量**：`get`/`put` 命中后该项跳到最前（最近用）；缓存满再 put 新键 → 末位（最久没用）被淘汰。这就是 LRU 的核心：最近用的留下、最久没用的先走。

> 注：entries 用 `ref`，get/put/reset 同步改它并同步返回结果；重排/进出动画由 LruViz 的 TransitionGroup 做（cosmetic），逻辑无计时器、L4 可断言。

## 3. LRU 互动组件 `LruViz.vue`

### 3.1 结构与布局

```
.lru-viz (column, center)
 ├─ .toolbar   key 输入 + value 输入 + get / put / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「车道」：定宽定高；空显 empty-hint
 │        TransitionGroup .lru-cell × n（横排，0=MRU 左、末=LRU 右）
 │           .lru-key（键，大）+ .lru-val（值，小）；.is-mru / .is-lru 端标记
 ├─ .readout   容量 size/CAP（满时高亮）
 └─ .status    状态解说行（命中/未命中/新增/更新/淘汰）
```

### 3.2 交互与动画

- **get(key)**：`r = get(key)`（**同步**改 entries）→ 同步置 status——命中：`找到了，值 v，移到最前`；未命中：`没有 key，未命中`。
- **put(key,value)**：`r = put(key,value)`（同步）→ 同步置 status——新键：`新键放最前`（满则 `淘汰最久没用的 evicted`）；已有键：`更新为 v 并移最前`。
- **重置**：entries 复位、status 复位。
- 元素重排/进出由 TransitionGroup（中性纵向进出 + FLIP 水平重排）；逻辑同步、L4 可断言（mount 时 stub transition-group）。

### 3.3 视觉映射

| 元素     | 态     | 颜色 / 处理                     |
| -------- | ------ | ------------------------------- |
| 缓存项   | idle   | 浅绿 `#8bd3a0`，键深绿/值灰     |
| 最近用   | is-mru | 「↑ 最近用」标记（绿）          |
| 最久没用 | is-lru | 「↑ 最久没用·待淘汰」标记（橙） |
| 容量读数 | 满     | 橙 `#ff8a65`（size==CAP）       |
| 空态     | empty  | 居中 empty-hint「缓存为空」     |

## 4. LRU 页 `Lru.vue` 正文大纲

```
<h1>LRU 缓存 Least Recently Used</h1><p class="sub">数据结构 · 哈希表 + 双向链表的经典组合</p>
<h2>什么是 LRU 缓存</h2>
<p>缓存空间有限，满了就得淘汰一项。LRU（最近最少使用）的策略是：淘汰最久没被用过的那一项——刚用过的最该留着。</p>
<p>这里容量 4，缓存项按「最近使用」从左到右排：最左是刚用的（MRU），最右是最久没用的（LRU，下一个被淘汰）。get/put 都会把碰到的项挪到最前。试试 get 一个已有的键、put 一个新键、put 到满了。</p>
<Playground><LruViz/></Playground>
<p>怎么做到 get/put 都 O(1)？答案正是前面两种结构的组合：哈希表负责按 key O(1) 找到节点（见哈希那篇），双向链表负责 O(1) 把节点挪到最前、从最后淘汰（见链表的双向那节）。哈希定位 + 双链表调序，缺一不可。</p>
<h2>LRU 在哪里用</h2>
<Callout>操作系统页面置换；数据库缓冲池 / Redis 淘汰策略；CPU cache；浏览器 / CDN 缓存；各类 LRU cache 库。</Callout>
<p>它是「组合已有结构解决新问题」的典范——也为这趟数据结构之旅收个尾。</p>
```

## 5. 组件清单与改动面

| 文件                                      | 类型       | 改动                                          |
| ----------------------------------------- | ---------- | --------------------------------------------- |
| `src/components/structures/useLRU.ts`     | **新增**   | entries[] MRU→LRU + get/put + 淘汰            |
| `src/components/structures/LruViz.vue`    | **新增**   | 横向缓存车道 + MRU/LRU 标记 + get/put 互动    |
| `src/views/Article/DataStructure/Lru.vue` | **新增**   | LRU 知识页                                    |
| `src/router/index.ts`                     | 改（接线） | +`/docs/lru` name `lru`                       |
| `src/views/Docs/Menu/hooks.ts`            | 改（接线） | 数据结构 +「LRU 缓存」`url:'lru'`（并查集后） |
| `src/views/Home/Main/hooks.ts`            | 改（接线） | 数据结构 +「LRU 缓存」+ LruIcon               |
| `src/assets/lru.svg`                      | **新增**   | 1024 viewBox 黑剪影图标                       |
| `src/views/Home/Main/hooks.spec.ts`       | 改（计数） | TC-HOOK-01-2 数据结构 10→11                   |
| `src/views/Docs/Menu/hooks.spec.ts`       | 改（计数） | TC-HOOK-02-4 数据结构 10→11                   |

**零改动**：既有 10 结构页 / 8 排序 / 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 4 处接线为**追加**（既有条目顺序不变、url 唯一）。
- 改动仅 2 处 HOOK 计数（数据结构 10→11）——新增结构的合理行为变化，非回归；其余既有 Case 零改动通过。
- 新页路由 name `lru` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-LRU-LOGIC-*` / `TC-VIZ-LRUVIZ-*` / `TC-VIEW-LRU-01/02` / `TC-E2E-LRU-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useLRU`：初始 [3,2,1]/size 3；get 命中(移最前)/未命中；put 新键/更新/满后淘汰末位；size ≤ cap；reset。
- **L4 互动** `TC-VIZ-LRUVIZ-*`：初始 3 lru-cell + 两输入 + 3 按钮 + MRU/LRU 标记；键文本；get 命中（跳最前）/未命中 status；put 新键/淘汰/更新 status；重置。
- **L4 视图** `TC-VIEW-LRU-01/02`：含 Article+LruViz；「LRU」标题 + Playground。
- **L5 e2e** `TC-E2E-LRU-01`：`/docs/lru` 限定 `.lru-viz`：3 cell、get 命中跳最前、put 满后淘汰、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 11 项。
