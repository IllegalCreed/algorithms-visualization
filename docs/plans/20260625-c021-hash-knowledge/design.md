# 设计：哈希表 Hash 知识页（拉链法：散列 key%7 + 桶阵列 + 扫链，复用知识页骨架）

> Status: verified
> Stable ID: C-20260625-021
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Hash.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><HashViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     HashViz.vue  ── 用 ── useHash.ts（reactive 拉链哈希表，可单测）
```

`useStack/useQueue/useArray/useLink/useTree/useHeap/useHash` 七组互动逻辑并列在 `structures/` 下，互不依赖。骨架零改动。

## 2. 哈希逻辑 `useHash.ts`（拉链法，可单测）

```ts
export const HASH_BUCKETS = 7;
export const HASH_MAX = 16; // 演示总容量
export interface InsertResult {
  ok: boolean;
  reason?: 'dup' | 'full';
  bucket: number; // hash(key)
  collision?: boolean; // 入桶前该桶非空
}
export interface SearchResult {
  found: boolean;
  bucket: number;
  steps: number; // 沿链比较次数
}
export interface UseHash {
  buckets: Ref<[string, number][][]>; // 7 个桶，每桶一条 [id, key] 链；index = 桶号
  size: ComputedRef<number>; // 总键数
  canInsert: ComputedRef<boolean>; // size < HASH_MAX
  hash: (key: number) => number; // key % HASH_BUCKETS
  has: (key: number) => boolean; // 键是否在其桶内
  insert: (key: number) => InsertResult; // 算桶 → 查重 → 空放/冲突追加
  search: (key: number) => SearchResult; // 算桶 → 沿链比较
  reset: () => void; // 复位为初始（含一个冲突）
}
export function useHash(): UseHash;
```

- `hash(key) = key % 7`。
- `insert(key)`：`b=hash(key)`；`has(key)` 真 → `{ok:false, reason:'dup', bucket:b}`；`size>=MAX` → `{ok:false, reason:'full', bucket:b}`；否则 `collision = buckets[b].length>0`，`buckets[b].push([id,key])`，返回 `{ok:true, bucket:b, collision}`。
- `search(key)`：`b=hash(key)`；遍历 `buckets[b]`，逐个比较计数 `steps`，命中返回 `{found:true, bucket:b, steps}`，走完返回 `{found:false, bucket:b, steps}`。
- 初始：`reset` 建 7 空桶，依次 `push [15,8,23,4]` → `buckets[1]=[15,8]`（冲突）、`buckets[2]=[23]`、`buckets[4]=[4]`。
- **关键不变量**：键唯一（集合语义）；同桶不同键沿链追加；`hash` 决定桶、链承载冲突。

> 注：桶为二维 `[id,key][][]`，`id` 稳定（驱动入场动画 key）；逻辑纯函数可单测，扫链/命中动画由 HashViz 延时驱动。

## 3. 哈希互动组件 `HashViz.vue`

### 3.1 结构与布局（桶阵列 + 每桶横向链）

```
.hash-viz (column, center)
 ├─ .toolbar   <input val 1–99> + 插入 / 查找 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽 520
 │        .bucket × 7 (data-b=i, :class lit)        ← 7 桶竖排
 │          .bindex「i」徽章（命中桶高亮主题绿）
 │          .barrow「→」
 │          .chain                                   ← 该桶的链（横向）
 │            空：.empty-slot「空」
 │            .entry × m (key=id, :class cmp/hot)    值盒（idle 浅绿 / cmp 黄 / hot 深绿）
 └─ .status      状态解说行（含 hash 算式 / 冲突 / 步数）
```

### 3.2 交互与动画

- **插入 insert**：校验值（1–99，满 16 提示）→ `r=useHash.insert(v)`（**同步**入桶，新 entry `enter` 入场）→ 命中桶 `.lit` 高亮 → `status` 解说 `hash(v)=v%7=b` + 空放 / 冲突追加。查重则 `status` 解说已存在、不插。
- **查找 search**：`r=useHash.search(v)`（同步返回 found/bucket/steps）→ 命中桶 `.lit` → **分步扫链**：沿链逐个加 `.cmp`（黄），命中加 `.hot`（深绿）。`status` 解说算桶 + 比较次数 + 找到/不存在。
- **重置 reset**：复位初始；**可中断**进行中的扫链动画（清计时器 + 解锁 busy）。
- 分步用 `setTimeout`/`await`（卸载清理、`busy` 防重入）；数据同步、L4 可同步断言（沿用 HeapViz 经验）。

### 3.3 视觉映射

| 元素       | 态         | 颜色 / 处理                  |
| ---------- | ---------- | ---------------------------- |
| 桶下标徽章 | idle / lit | 灰 / 主题绿 `#42b883` + 白字 |
| 链上值盒   | idle       | 浅绿 `#8bd3a0` + 深绿字      |
| 扫链中     | cmp        | 黄 `#ffcf5c`                 |
| 命中       | hot        | 深绿 `#4caf50` + 白字 + 放大 |
| 新键       | enter      | 滑入入场                     |
| 空桶       | empty-slot | 灰「空」                     |

## 4. 哈希页 `Hash.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>哈希表 Hash</h1>
  <p class="sub">数据结构 · 用散列函数把键直接算成下标</p>
  <h2>什么是哈希表</h2>
  <p>靠算：散列函数算出桶下标、直达，平均 O(1)，不比较不遍历…</p>
  <p>hash(key)=key%7；冲突=两键同桶；拉链法每桶挂一条链、追加链尾…</p>
  <Playground><HashViz/></Playground>
  <p>散列均匀 + 链短 → O(1)；都挤一个桶 → 退化 O(n)；好散列函数 + 合适桶数关键。</p>
  <h2>哈希表在哪里用</h2>
  <Callout>dict/map/object · Set 去重 · 缓存/索引</Callout>
  <p>只剩最后一种、最一般的结构——图。</p>
</Article>
```

关键术语 `<strong>` 高亮，`O(1)`/`hash(key)=key%7` 类用 `<code>`。

## 5. 组件清单与改动面

| 文件                                       | 类型         | 改动                                                       |
| ------------------------------------------ | ------------ | ---------------------------------------------------------- |
| `src/components/structures/useHash.ts`     | **新增**     | 拉链哈希纯逻辑（hash/insert/search/has + 桶二维结构）      |
| `src/components/structures/HashViz.vue`    | **新增**     | 哈希互动组件（7 桶阵列 + 拉链 + 散列直达/扫链）            |
| `src/views/Article/DataStructure/Hash.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><HashViz/></Playground>` |

**零改动**：`article/` 骨架 / `structures/use{Stack,Queue,Array,Link,Tree,Heap}*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useHash`/`HashViz` 是全新文件，除哈希页外无人 import → 对其余结构与排序零影响。
- `article/` 骨架原样复用、零改动 → C-015 骨架 Case 逐字不变。
- `Hash.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-HASH-*`。
- 无现存 `HASH` Case ID（哈希无排序版），命名空间无需避让。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useHash`（`TC-HASH-LOGIC-*`）：初始桶布局 + size；`hash` 计算；`has`；`insert` 空桶直放 / 冲突追加链尾 / 查重 dup / 满 full；`search` 命中（bucket+steps）/ 没找到；`reset` + id 唯一。
- **L4 互动** `TC-VIZ-HASHVIZ-*`：初始 7 桶 + 桶1 含 2 项（冲突）+ 输入框 + 3 按钮；insert 空桶/冲突各正确入桶 + 总项 +1；查重不增 + 解说；search 命中/没找到解说；insert 解说含 hash 算式（`% 7`）；非法值提示；reset 复位。
- **L4 视图** `TC-VIEW-HASH-*`：哈希页挂载渲染 `Article` + `HashViz`、含「哈希表」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-HASH-*`：导航 `/docs/hash`、见正文 + Playground；限定 `.hash-viz`：初始 7 桶 + 4 项、输入 11 插入见桶4 变 2 项含 11、重置回 4 项。
