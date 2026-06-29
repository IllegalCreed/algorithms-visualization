# 设计：布隆过滤器 Bloom Filter（固定位数组 + 多哈希加入/查询 + 误判演示，新页）

> Status: verified
> Stable ID: C-20260629-036
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/BloomFilter.vue
   │  正文 + <Playground><BloomViz/></Playground> + 误判/省空间/不能删正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     BloomViz.vue  ── 用 ── useBloom.ts（固定 m/k + 纯哈希 + add/query，可单测）

4 处接线（同 B1–B6 套路）：
  router/index.ts        +/docs/bloom-filter  name 'bloom-filter'（懒加载）
  Docs/Menu/hooks.ts     数据结构分类 + {title:'布隆过滤器', url:'bloom-filter'}（B+ 树之后）
  Home/Main/hooks.ts     数据结构分类 + {title:'布隆过滤器', desc, icon:BloomIcon, url:'bloom-filter'}
  assets/bloom-filter.svg 1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 14→15）
```

## 2. 布隆逻辑 `useBloom.ts`（固定 m=16 / k=3 + 纯哈希 + add/query）

```ts
export const BLOOM_SIZE = 16; // m 位
export const BLOOM_K = 3; // k 个哈希

export interface BloomQuery {
  positions: number[]; // k 个哈希位
  mightExist: boolean; // k 位全 1
  actuallyAdded: boolean; // 真实加入过（教学标注，不参与布隆判断）
  falsePositive: boolean; // mightExist && !actuallyAdded —— 误判
}
export interface UseBloom {
  bits: Ref<boolean[]>; // 16 位
  size: number; // 16
  k: number; // 3
  hashes: (x: number) => number[]; // [h1,h2,h3]
  add: (x: number) => { positions: number[] };
  query: (x: number) => BloomQuery;
  reset: () => void;
}
```

- **三个确定性哈希**：`h1(x)=x%16`、`h2(x)=(7x)%16`、`h3(x)=(11x+5)%16`。
  - `hashes(3)=[3,5,6]`、`hashes(7)=[7,1,2]`、`hashes(11)=[11,13,14]`、`hashes(5)=[5,3,12]`、`hashes(2)=[2,14,11]`、`hashes(4)=[4,12,1]`。
- **`add(x)`**：把 `hashes(x)` 三位置 1；额外把 x 记入 `added` 集合（仅教学标注）；返回 `{positions}`。幂等（位已 1 再置仍 1）。
- **`query(x)`**：`mightExist = positions.every(p => bits[p])`；`falsePositive = mightExist && !added.has(x)`。
- **`reset`**：bits 全 false、added 清空。
- **关键演示数据**（加入 3、7、11 后，置 1 位 = `{1,2,3,5,6,7,11,13,14}`）：
  - `query(7)` → `[7,1,2]` 全 1 → **可能存在**（真命中，falsePositive=false）。
  - `query(5)` → `[5,3,12]`，bit12=0 → **一定不存在**。
  - `query(2)` → `[2,14,11]` 全 1 → **可能存在**，但 2 从没加过 → **falsePositive=true（误判！）**。
  - `query(4)` → `[4,12,1]`，bit4=0 → 一定不存在。

> **关键不变量**：查询「有任一位为 0」必然「一定不存在」（绝不漏判）；查询「全 1」只能说「可能存在」（可能误判）。`added` 集合仅为可视化点破误判，**不参与**布隆的存在性判断——这正是布隆「不存原值、极省空间」的本质。

## 3. 布隆互动组件 `BloomViz.vue`

### 3.1 结构与布局

```
.bloom-viz (column, center)
 ├─ .toolbar   输入 a + 加入(a) / 查询(a) / 重置 + 「k=3 个哈希」提示
 ├─ .array-wrap   居中
 │   └─ .bit-array（flex 一排）：.bit-cell × 16（固定宽高）
 │        每格：.val（0/1）+ .idx（下方位号 0..15）
 │        .bit-cell.set（位=1，绿）/ .bit-cell.probe（本次哈希探测位，橙描边）
 └─ .status   状态解说行（命中 / 一定不存在 / 误判）
```

### 3.2 交互与动画

- **加入(a)**：`r = add(a)`（同步置 bits）→ `probe = new Set(r.positions)`（探测位橙描边）→ status：`加入 ${a}：哈希到位 ${r.positions.join('、')}，把这几位都置 1。`
- **查询(a)**：`r = query(a)`（同步）→ `probe = new Set(r.positions)` →
  - 误判：`查询 ${a}：位 ${...} 都是 1 → 可能存在；但其实从没加入过，这就是误判（假阳性）！`（含「误判」）
  - 真命中：`查询 ${a}：位 ${...} 都是 1 → 可能存在。`（含「可能存在」，不含「误判」）
  - 不存在：`查询 ${a}：位 ${...} 中有 0 → 一定不存在。`（含「一定不存在」）
- **重置**：bits 清零、probe 清空、status 复位。
- add/query 同步（L4 同步断言 status / `.bit-cell.set` 计数 / probe）。

### 3.3 视觉映射

| 元素   | 态     | 颜色 / 处理            |
| ------ | ------ | ---------------------- |
| 位格   | 0      | 浅灰 `#d8e0db` + 「0」 |
| 位格   | set(1) | 绿 `#4caf50` + 白「1」 |
| 探测位 | probe  | 橙描边 `#f0a000`       |
| 误判   | —      | status 标橙红强调      |

## 4. 布隆页 `BloomFilter.vue` 正文大纲

```
<h1>布隆过滤器 Bloom Filter</h1><p class="sub">数据结构 · 概率型「在不在」判断</p>
<h2>什么是布隆过滤器</h2>
<p>要判断「这个元素在不在一个海量集合里」，用哈希表存全部元素又费内存。布隆过滤器换个思路：只用一个位数组 + 几个哈希函数，不存原始元素，空间省到极致。代价是——它会「误判」。</p>
<p>加入元素：用 k 个哈希算出 k 个位置，把这些位都置 1。查询元素：算出同样 k 个位置，只要有一位是 0，就一定不在；如果全是 1，那「可能在」（也可能是别的元素把这些位凑成了 1——误判）。</p>
<p>这里是 m=16 位、k=3 个哈希的布隆过滤器。先「加入」几个数（比如 3、7、11），再「查询」：试试查 7（加过，命中）、查 5（有 0，一定不存在）、再查 2（没加过，但 3 个位恰好都被占了——误判！）。</p>
<Playground><BloomViz/></Playground>
<p>布隆过滤器的铁律：<b>说"不在"就一定不在（绝不漏判），说"在"只是可能（会误判）</b>。位数组越大、元素越少，误判率越低。标准布隆不支持删除（清一位可能影响别的元素），要删得用「计数布隆」。</p>
<h2>布隆过滤器在哪里用</h2>
<Callout>缓存穿透防护（先问布隆，"一定不存在"就不查数据库）；爬虫 URL 去重；海量黑名单/白名单预筛；大数据 join 前过滤。</Callout>
<p>它用「一点误判」换来「极省空间」——这趟结构之旅最后一站，也是工程里最实用的近似数据结构之一。</p>
```

## 5. 组件清单与改动面

| 文件                                              | 类型       | 改动                                      |
| ------------------------------------------------- | ---------- | ----------------------------------------- |
| `src/components/structures/useBloom.ts`           | **新增**   | 固定 m/k + 纯哈希 + add/query/reset       |
| `src/components/structures/BloomViz.vue`          | **新增**   | 16 位数组 + 探测点亮 + 误判演示互动       |
| `src/views/Article/DataStructure/BloomFilter.vue` | **新增**   | 布隆过滤器知识页                          |
| `src/router/index.ts`                             | 改（接线） | +`/docs/bloom-filter` name `bloom-filter` |
| `src/views/Docs/Menu/hooks.ts`                    | 改（接线） | 数据结构 +「布隆过滤器」（B+ 树后）       |
| `src/views/Home/Main/hooks.ts`                    | 改（接线） | 数据结构 +「布隆过滤器」+ BloomIcon       |
| `src/assets/bloom-filter.svg`                     | **新增**   | 1024 viewBox 黑剪影图标                   |
| `src/views/Home/Main/hooks.spec.ts`               | 改（计数） | TC-HOOK-01-2 数据结构 14→15               |
| `src/views/Docs/Menu/hooks.spec.ts`               | 改（计数） | TC-HOOK-02-4 数据结构 14→15               |

**零改动**：既有 14 结构页 / 8 排序 / 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 4 处接线为**追加**（既有条目顺序不变、url 唯一）。
- 改动仅 2 处 HOOK 计数（数据结构 14→15）——新增结构的合理行为变化，非回归；其余既有 Case 零改动通过。
- 新页路由 name `bloom-filter` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-BLOOM-LOGIC-*` / `TC-VIZ-BLOOMVIZ-*` / `TC-VIEW-BLOOM-01/02` / `TC-E2E-BLOOM-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useBloom`：初始 16 位全 0 / size 16 / k 3；hashes(3/7/11/5/2/4)；add(3) 置 [3,5,6]；add 3,7,11 → 9 位为 1；query(7) 命中、query(5) 一定不存在、query(2) 误判（falsePositive）、query(4) 一定不存在；add 幂等；reset 清零。
- **L4 互动** `TC-VIZ-BLOOMVIZ-*`：16 bit-cell + a 输入 + 加入/查询/重置；初始 set 0；加入 3 → set 3 + status 含「加入」；加入 3,7,11 → set 9；查询 7 含「可能存在」；查询 5 含「一定不存在」；查询 2 含「误判」；重置 set 0。
- **L4 视图** `TC-VIEW-BLOOM-01/02`：含 Article+BloomViz；「布隆过滤器」标题 + Playground。
- **L5 e2e** `TC-E2E-BLOOM-01`：`/docs/bloom-filter` 限定 `.bloom-viz`：16 格、加入 3/7/11、查询 7「可能存在」、查询 2「误判」、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 15 项。
