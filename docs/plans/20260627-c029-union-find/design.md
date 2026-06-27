# 设计：并查集 Union-Find（固定 8 元素 + 父指针箭头 + 路径压缩，新页）

> Status: verified
> Stable ID: C-20260627-029
> Owner: IllegalCreed
> Created: 2026-06-27
> Last reviewed: 2026-06-27
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
新页 src/views/Article/DataStructure/UnionFind.vue
   │  正文 + <Playground><UnionFindViz/></Playground> + 路径压缩正文 + callout
   ▼
└─ 互动组件（src/components/structures/，新增）
     UnionFindViz.vue  ── 用 ── useUnionFind.ts（parent[] + find/union/connected/compress，可单测）

4 处接线（同 B1 Trie 套路）：
  router/index.ts       +/docs/union-find  name 'union-find'（懒加载）
  Docs/Menu/hooks.ts    数据结构分类 + {title:'并查集', url:'union-find'}（字典树之后）
  Home/Main/hooks.ts    数据结构分类 + {title:'并查集', desc, icon:UnionFindIcon, url:'union-find'}
  assets/union-find.svg 1024 viewBox 黑剪影图标
改 2 处 HOOK 计数：TC-HOOK-01-2 / TC-HOOK-02-4（数据结构 9→10）
```

## 2. 并查集逻辑 `useUnionFind.ts`（parent[] + find/union/connected/compress）

```ts
export const UF_SIZE = 8; // 元素 0..7

export interface FindResult {
  root: number;
  path: number[]; // x 一路到根（含 x 与 root）
}
export interface UnionResult {
  merged: boolean;
  root: number; // 合并后（或已同组的）根
  child: number; // 被指过去的根；未合并为 -1
}
export interface UseUnionFind {
  parent: Ref<number[]>; // root 满足 parent[i]===i
  groupCount: ComputedRef<number>; // 根的个数 = 组数
  find: (x: number) => FindResult; // 纯走位，不改 parent
  union: (a: number, b: number) => UnionResult; // rootA → rootB
  connected: (a: number, b: number) => boolean;
  compress: (x: number) => FindResult; // 路径压缩：沿途指根（改 parent）
  reset: () => void;
}
```

- 初始 `parent = [0..7]`（各自成根、8 组）。
- `find(x)`：沿 `parent` 走到 `parent[i]===i`，收集 `path`，返回 `{root, path}`。**不改 parent**。
- `union(a,b)`：`rA=find(a).root`、`rB=find(b).root`；同根 → `{merged:false, root:rA, child:-1}`；否则 `parent[rA]=rB`、返回 `{merged:true, root:rB, child:rA}`。
- `connected(a,b)` = `find(a).root === find(b).root`。
- `compress(x)`：`r=find(x).root`、`path=find(x).path`；把 `path` 上每个非根节点 `parent[node]=r`（改 parent）；返回 `{root:r, path}`。
- `groupCount` = `parent.filter((p,i)=>p===i).length`。
- **关键不变量**：连成链 0→1→2→3 后 `find(0).path=[0,1,2,3]`（走 3 步）；`compress(0)` 后 `parent[0]=parent[1]=parent[2]=3`（沿途直接指根，下次 1 步）——这就是路径压缩近乎 O(1) 的可测证据。

> 注：parent 用 `ref`，find 纯、union/compress/reset 同步改它；走位/压缩/合并的高亮由 UnionFindViz 用 setTimeout 驱动（同步数据 + 短延时高亮，L4 可断言）。

## 3. 并查集互动组件 `UnionFindViz.vue`

### 3.1 结构与布局

```
.union-find-viz (column, center)
 ├─ .toolbar   输入 a + 输入 b + 合并 / 查根(a) / 连通?(a,b) / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽高
 │        <svg> 8 个固定节点 .ufnode（circle + 数字 0..7，排一行）
 │              每个非根节点一根指向 parent 的弧线箭头 .uf-edge
 │              .ufnode.path（走位黄）/ .ufnode.root（根深绿）
 ├─ .readout   当前 N 个组（连通分量）
 └─ .status    状态解说行
```

### 3.2 交互与动画

- **合并 union(a,b)**：`r = union(a,b)`（**同步**改 parent）→ 同步置 status（合并/已同组）→ 短高亮新箭头。
- **查根 find(a)**：`fr = find(a)`（纯）→ 若 `a` 即根，status「本身就是根」；否则 `compress(a)`（同步改 parent，箭头改向根）+ status 含「路径压缩」+ 走位点亮 `fr.path`（黄）、根 `.root`（深绿）。
- **连通? connected(a,b)**：同步置 status（连通/不连通）+ 短高亮两条到根的路径。
- **重置**：parent 复位、清高亮、status 复位。
- 所有操作**同步**改 parent + 同步置 status（L4 可断言、无计时器锁、多操作直接生效）；高亮短延时（卸载清理）。

### 3.3 视觉映射

| 元素   | 态      | 颜色 / 处理                  |
| ------ | ------- | ---------------------------- |
| 节点   | idle    | 圆形浅绿 `#8bd3a0` + 深绿字  |
| 走位中 | path    | 黄 `#ffcf5c`                 |
| 根     | root    | 深绿 `#4caf50` + 白字        |
| 父指针 | uf-edge | 灰弧线 + 箭头（指向 parent） |
| 父指针 | 改向    | 压缩时短高亮（绿）           |

## 4. 并查集页 `UnionFind.vue` 正文大纲

```
<h1>并查集 Union-Find</h1><p class="sub">数据结构 · 极快地维护「谁和谁同组」</p>
<h2>什么是并查集</h2>
<p>前面的结构大多在存「数据序列」；并查集换了个差事——把一堆元素分成若干不相交的组，专门极快回答两件事：find(x) 这个元素属于哪个组（返回组的代表元「根」）、union(a,b) 把两个组合并。</p>
<p>实现很巧：每个元素记一个 parent，顺着 parent 一直走到「自己指自己」的就是根。同根=同组。合并就是把一个根指到另一个根。这里有 8 个元素，一开始各自成组。点合并/查根/连通试试。</p>
<Playground><UnionFindViz/></Playground>
<p>朴素 find 可能走很长一条链。路径压缩是点睛之笔：find 找到根后，把沿途每个节点直接指向根，下次再 find 几乎一步到位——并查集近乎 O(1) 就靠它（外加按秩合并）。</p>
<h2>并查集在哪里用</h2>
<Callout>连通性判断（朋友圈/网络节点是否连通）；Kruskal 最小生成树（判断加边是否成环）；岛屿/连通分量计数；账号合并、等价类。</Callout>
<p>它不存序列、只管「同不同组」，是一种用途专一、实现精巧的结构。</p>
```

## 5. 组件清单与改动面

| 文件                                            | 类型       | 改动                                               |
| ----------------------------------------------- | ---------- | -------------------------------------------------- |
| `src/components/structures/useUnionFind.ts`     | **新增**   | parent[] + find/union/connected/compress           |
| `src/components/structures/UnionFindViz.vue`    | **新增**   | 8 固定节点 + 父指针箭头 + 合并/查根/连通 互动      |
| `src/views/Article/DataStructure/UnionFind.vue` | **新增**   | 并查集知识页                                       |
| `src/router/index.ts`                           | 改（接线） | +`/docs/union-find` name `union-find`              |
| `src/views/Docs/Menu/hooks.ts`                  | 改（接线） | 数据结构 +「并查集」`url:'union-find'`（字典树后） |
| `src/views/Home/Main/hooks.ts`                  | 改（接线） | 数据结构 +「并查集」+ UnionFindIcon                |
| `src/assets/union-find.svg`                     | **新增**   | 1024 viewBox 黑剪影图标                            |
| `src/views/Home/Main/hooks.spec.ts`             | 改（计数） | TC-HOOK-01-2 数据结构 9→10                         |
| `src/views/Docs/Menu/hooks.spec.ts`             | 改（计数） | TC-HOOK-02-4 数据结构 9→10                         |

**零改动**：既有 9 结构页 / 8 排序 / 骨架 / 其余 `structures/*` / 播放器 / store。

## 6. 向后兼容论证

- 全新文件 + 4 处接线为**追加**（既有条目顺序不变、url 唯一）。
- 改动仅 2 处 HOOK 计数（数据结构 9→10）——新增结构的合理行为变化，非回归；其余既有 Case（9 结构 + 8 排序 + 播放器 + 骨架）零改动通过。
- 新页路由 name `union-find` = 菜单 url；SPA 404 通用、无需改 404.html。
- 新增 `TC-UF-LOGIC-*` / `TC-VIZ-UFVIZ-*` / `TC-VIEW-UF-01/02` / `TC-E2E-UF-01`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useUnionFind`：初始 parent/groupCount 8；union 合并/同组不合并/groupCount 递减；find 纯走位（链 root+path、不改 parent）；compress 沿途指根；connected 同组/异组；reset。
- **L4 互动** `TC-VIZ-UFVIZ-*`：8 ufnode + 两输入 + 4 按钮 + readout 8；节点 0..7；合并→组数减 + uf-edge 增；链后查根 status 含「压缩」；连通?同组/异组 status；重置回 8 组 0 边。
- **L4 视图** `TC-VIEW-UF-01/02`：含 Article+UnionFindViz；「并查集」标题 + Playground。
- **L5 e2e** `TC-E2E-UF-01`：`/docs/union-find` 限定 `.union-find-viz`：8 节点、合并后组数变、连通? 判定、重置。
- **改** `TC-HOOK-01-2`/`TC-HOOK-02-4`：数据结构 10 项。
