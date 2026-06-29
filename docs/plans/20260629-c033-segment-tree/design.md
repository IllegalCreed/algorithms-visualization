# 设计：线段树 Segment Tree（固定求和树 + 区间查询拆整段 + 单点更新路径，新页）

> Status: verified
> Stable ID: C-20260629-033
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/SegmentTree.vue
   │  正文 + <Playground><SegTreeViz/></Playground> + 区间查询/单点更新/树状数组正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     SegTreeViz.vue  ── 用 ── useSegTree.ts（固定数组建求和树 + 纯 query / update，可单测）

4 处接线（同 B1–B4 套路）：
  router/index.ts        +/docs/segment-tree  name 'segment-tree'（懒加载）
  Docs/Menu/hooks.ts     数据结构分类 + {title:'线段树', url:'segment-tree'}（跳表之后）
  Home/Main/hooks.ts     数据结构分类 + {title:'线段树', desc, icon:SegmentTreeIcon, url:'segment-tree'}
  assets/segment-tree.svg 1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 12→13）
```

## 2. 线段树逻辑 `useSegTree.ts`（固定数组建求和树 + 纯 query / update）

```ts
export const SEG_ARRAY = [2, 5, 1, 4, 9, 3, 7, 6]; // 8 元素

export interface SegNode {
  id: string;
  pos: number; // 0 下标堆式：children 2p+1 / 2p+2、parent (p-1)>>1
  lo: number;
  hi: number;
  sum: number;
  depth: number;
  isLeaf: boolean;
}
export interface UseSegTree {
  nodes: Ref<SegNode[]>; // 15 节点（8 叶 pos 7..14 + 7 内部）
  size: number; // 元素数 8
  query: (l: number, r: number) => { sum: number; covered: number[] }; // covered = 取用的整段 pos
  update: (i: number, val: number) => { path: number[] }; // 叶→根路径
  reset: () => void;
}
```

- **建树**（递归 pos）：`build(pos, lo, hi, depth)`——`lo===hi` 为叶 `sum=arr[lo]`；否则 `mid=(lo+hi)>>1`，建左 `2p+1 [lo,mid]`、右 `2p+2 [mid+1,hi]`，`sum=左+右`。n=8 是 2 的幂 → 恰好 15 节点（pos 0..14、叶 pos 7..14）。root `[0,7]` 和 37。
- **`query(l,r)`**（递归拆整段，纯）：节点区间与 [l,r] **不相交** → 0；**完全落入** → 记 pos 到 `covered`、返回 sum；**部分相交** → 递归左右孩子求和。`covered` = 拼出 [l,r] 的「canonical 整段」集（O(log n) 个）。
  - `query(2,5)`→ sum 17、covered `[4,5]`（[2,3]+[4,5]，2 节点覆盖 4 元素）；`query(0,7)`→ 37、`[0]`；`query(3,3)`→ 4、`[10]`；`query(1,6)`→ 29、4 节点。
- **`update(i,val)`**（同步改 sum）：从 root 按 mid 下沉到叶 `[i,i]`（收集 root→leaf 路径），叶 `sum=val`，再沿**叶→根**重算每个祖先 `sum=左+右`；返回 `{path}`（叶→根）。
  - `update(2,10)`→ path `[9,4,1,0]`、root 和 37+9=**46**。其后 `query(2,5)`=**26**。
- `reset`：重建（root 回 37）。
- **关键不变量**：区间查询只取用 O(log n) 个整段（covered 远少于区间长度）、单点更新只动叶→根一条路径——这就是线段树 O(log n) 的可测证据。

> 注：`nodes` 用 `ref`，query 纯、update/reset 同步改它；点亮动画由 SegTreeViz 用 setTimeout 驱动（同步数据 + 延时高亮，L4 可断言）。

## 3. 线段树互动组件 `SegTreeViz.vue`

### 3.1 结构与布局

```
.seg-tree-viz (column, center)
 ├─ .toolbar   输入 a + 输入 b + 区间和(a,b) / 更新(a→b) / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽高
 │        <svg> <g.edges> <line.seg-edge × 14>（parent→child）
 │              <g.verts> <g.seg-node × 15>（circle + sum；复用 pos 定位）
 │                  .seg-node.covered（查询取用整段，绿）/ .seg-node.onpath（更新路径，黄）
 └─ .status   状态解说行（区间和 + 碰到 N 个节点 / 更新路径）
```

- 坐标（复用 TreeView pos 数学）：`depth=⌊log2(pos+1)⌋`、`x=((pos-(2^d-1)+0.5)/2^d)*440+10`、`y=22+depth*58`。
- 边：pos 1..14 连到 parent `(pos-1)>>1`，共 14 条。

### 3.2 交互与动画

- **区间和(a,b)**：`r = query(a,b)`（同步）→ 同步置 status（`[a,b] 的和 = r.sum，只取用了 ${r.covered.length} 个整段（≈log n），没逐个累加`）→ 点亮 `r.covered`（`.covered` 绿）。
- **更新(a→b)**：`r = update(a,b)`（同步改 sum）→ 同步置 status（`把第 a 个改成 b，沿叶→根更新了 ${r.path.length} 个节点，root 和 = ${root.sum}`）→ 点亮 `r.path`（`.onpath` 黄）。
- **重置**：清点亮、sum 复原、status 复位。busy 防重入、重置始终可点（中断）。
- `query`/`update` 同步（L4 同步断言 status / 节点 sum / 点亮）。

### 3.3 视觉映射

| 元素     | 态      | 颜色 / 处理                 |
| -------- | ------- | --------------------------- |
| 节点     | idle    | 圆形浅绿 `#8bd3a0` + 深绿和 |
| 查询整段 | covered | 绿 `#4caf50` + 白字         |
| 更新路径 | onpath  | 黄 `#ffcf5c`                |
| 边       | edge    | 半透明灰线（SVG）           |

## 4. 线段树页 `SegmentTree.vue` 正文大纲

```
<h1>线段树 Segment Tree</h1><p class="sub">数据结构 · 每个节点管一段区间</p>
<h2>什么是线段树</h2>
<p>要反复求「数组某一段的和（或最值）」，逐个累加是 O(n)。线段树把数组建成一棵二叉树：每个节点管一段区间，存这段的聚合（这里是和）。根管整个数组，往下对半分，叶子是单个元素。</p>
<p>这里给 8 个数 [2,5,1,4,9,3,7,6] 建求和线段树（15 个节点）。点「区间和」看它怎么把一段拆成几个「现成的整段」相加；点「更新」看改一个数只影响一条叶→根的路径。</p>
<Playground><SegTreeViz/></Playground>
<p>区间查询的诀窍：把目标区间拆成 O(log n) 个「正好被某节点完整覆盖」的整段，直接取它们存好的和——不必逐个累加。单点更新也只动叶子到根的一条路径，O(log n)。区间更新还能配「懒标记」批量延迟下推。更省空间的同类结构是树状数组（Fenwick），用一维数组 + lowbit 做前缀和，更紧凑但没这么直观。</p>
<h2>线段树在哪里用</h2>
<Callout>区间和 / 区间最值 / 区间统计；算法竞赛重器；可扩展到区间修改（懒标记）；数据库/时序的区间聚合。</Callout>
<p>它把「树 + 数组聚合」用到极致——也是这趟进阶里很硬核的一站。</p>
```

## 5. 组件清单与改动面

| 文件                                              | 类型       | 改动                                               |
| ------------------------------------------------- | ---------- | -------------------------------------------------- |
| `src/components/structures/useSegTree.ts`         | **新增**   | 固定数组建求和树 + 纯 query / update               |
| `src/components/structures/SegTreeViz.vue`        | **新增**   | SVG 二叉树 + 区间查询/更新点亮互动                 |
| `src/views/Article/DataStructure/SegmentTree.vue` | **新增**   | 线段树知识页                                       |
| `src/router/index.ts`                             | 改（接线） | +`/docs/segment-tree` name `segment-tree`          |
| `src/views/Docs/Menu/hooks.ts`                    | 改（接线） | 数据结构 +「线段树」`url:'segment-tree'`（跳表后） |
| `src/views/Home/Main/hooks.ts`                    | 改（接线） | 数据结构 +「线段树」+ SegmentTreeIcon              |
| `src/assets/segment-tree.svg`                     | **新增**   | 1024 viewBox 黑剪影图标                            |
| `src/views/Home/Main/hooks.spec.ts`               | 改（计数） | TC-HOOK-01-2 数据结构 12→13                        |
| `src/views/Docs/Menu/hooks.spec.ts`               | 改（计数） | TC-HOOK-02-4 数据结构 12→13                        |

**零改动**：既有 12 结构页 / 8 排序 / 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 4 处接线为**追加**（既有条目顺序不变、url 唯一）。
- 改动仅 2 处 HOOK 计数（数据结构 12→13）——新增结构的合理行为变化，非回归；其余既有 Case 零改动通过。
- 新页路由 name `segment-tree` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-SEG-LOGIC-*` / `TC-VIZ-SEGVIZ-*` / `TC-VIEW-SEG-01/02` / `TC-E2E-SEG-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useSegTree`：nodes 15/root 37/叶值；range [lo,hi]；内部 sum；query(2,5)=17 covered [4,5]、query(0,7)=37 [0]、query(3,3)=4 [10]、query(1,6)=29 4 段；update(2,10) path [9,4,1,0] root 46、其后 query(2,5)=26；reset 回 37。
- **L4 互动** `TC-VIZ-SEGVIZ-*`：15 seg-node + 14 edge + a/b 输入 + 3 按钮；节点显 sum（含 37）；区间和 2,5 status 含 17 + covered 点亮；区间和 0,7 含 37；更新 2→10 status 含「更新」+ 节点出现 46；单点 3,3 含 4；重置清高亮 + 复原 37。
- **L4 视图** `TC-VIEW-SEG-01/02`：含 Article+SegTreeViz；「线段树」标题 + Playground。
- **L5 e2e** `TC-E2E-SEG-01`：`/docs/segment-tree` 限定 `.seg-tree-viz`：15 节点、区间和 2,5 含 17、更新 2→10 含更新、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 13 项。
