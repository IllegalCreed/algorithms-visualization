# 设计：树 Tree 知识页（BST：二维布局 + 走位插入/查找 + 中序=升序，复用知识页骨架）

> Status: verified
> Stable ID: C-20260625-019
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Tree.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><TreeViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     TreeViz.vue  ── 用 ── useTree.ts（reactive BST 逻辑，可单测）
                  └─ 复用 TreeView.vue 的定位公式（不 import、照搬 depth/xPct 数学）
```

`useStack`/`useQueue`/`useArray`/`useLink`/`useTree` 五组互动逻辑并列在 `structures/` 下，互不依赖。骨架与 `components/TreeView.vue`（堆排树轨）零改动。

## 2. 树逻辑 `useTree.ts`（纯 BST 逻辑，可单测）

```ts
export const TREE_MAX_POS = 14; // 限 4 层（完全二叉树 pos 0..14）
export interface TreeNode {
  id: string;
  value: number;
  pos: number; // 完全二叉树位序号：根=0，左=2·pos+1，右=2·pos+2
}
export interface InsertResult {
  ok: boolean;
  reason?: 'dup' | 'depth';
  pos?: number; // 落子位置（ok 时）
  path: number[]; // 比较经过的节点 pos（供组件逐层高亮）
}
export interface SearchResult {
  found: boolean;
  pos?: number;
  path: number[];
}
export interface UseTree {
  nodes: Ref<TreeNode[]>;
  has(value: number): boolean;
  nodeAt(pos: number): TreeNode | undefined;
  insert(value: number): InsertResult; // 走位落子；查重 / 超深度返回 ok:false
  search(value: number): SearchResult; // 走位查找；返回命中 + 路径
  inorder(): number[]; // 左→根→右 = 升序值序列
  reset(): void; // 复位为初始平衡树、清状态
}
export function useTree(): UseTree;
```

- 初始：按 BST 插入顺序建 `[50,30,70,20,40,60,80]` → pos 0..6（平衡 3 层）。
- `insert`：`pos=0`，循环 `while nodeAt(pos)` 比较 `value < nodeAt(pos).value ? 左 : 右`，记录 path；遇空位落子；落子前若 `pos > TREE_MAX_POS` 返回 `reason:'depth'`；`has(value)` 真返回 `reason:'dup'`。
- `search`：同样走位，命中返回 `found:true`，走到空位 `found:false`，均带 path。
- `inorder`：递归 `walk(pos)=walk(左);push(value);walk(右)`，BST 性质保证升序。
- **关键不变量**：BST「左 < 节点 < 右」由 insert 的比较走位天然维持 → 任意插入序列 `inorder()` 恒升序（核心可测性质）。

> 注：底层用 `pos` 完全二叉树编号（与 TreeView 同范式）表达 BST 结构 + 二维位置，逻辑可纯单测；树的「形状/坐标」由 TreeViz 按 pos 计算渲染。二者职责分离。

## 3. 树互动组件 `TreeViz.vue`

### 3.1 结构与布局（二维 + SVG 边，复用 TreeView 定位）

```
.tree-viz (column, center)
 ├─ .toolbar   <input val 1–99> + 插入 / 查找 / 中序遍历 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定 520×300、内凹阴影、position:relative
 │        .stage (absolute, 内边距内)
 │          <svg class="edges">  ← 每个 pos>0 节点到 parent ⌊(pos-1)/2⌋ 的 <line>
 │          .node × n  ← 绝对定位 left:xPct% top:depth*H；圆形；点亮态切换
 │        空态：.empty-hint「树为空」
 └─ .status      状态解说行
```

定位公式（照搬 `TreeView.vue`）：`depth=⌊log2(pos+1)⌋`；`xPct=((pos-(2^depth-1)+0.5)/2^depth)*100`；`top=depth*LEVEL_HEIGHT`；边连两端节点中心。**坐标从 `nodes` 的 pos 计算，插入后随 `nodes` 变化重算**（响应式 computed），不写死像素 → 不错位。

### 3.2 交互与动画

- **插入 insert**：`useTree.insert(v)`（**同步**落子、返回 path/结果）→ 同步置 status（含比较次数 + O(log n) / 已存在 / 超深度 / 非法）；再播**逐层高亮**——沿 path 给节点加 `.path`（黄、放大）间隔 ~500ms，末了新节点 `enter` 缩放入场。值非法（非 1–99）只置提示、不插。
- **查找 search**：`useTree.search(v)`（同步）→ 同步置 status（找到第 k 次 / 没找到走到空位）；沿 path 高亮，命中节点 `.found`（深绿）。
- **中序遍历 inorder**：`useTree.inorder()`（同步返回升序数组）→ 同步置 status 为完整升序序列 +「正好升序」；再按序给节点点亮 `.found`（纯视觉）。
- **重置 reset**：`useTree.reset()` 复位。
- 所有数据变更同步、动画为叠加的 CSS 类（setTimeout 推进、组件卸载清理）；**无 busy 阻塞**（数据已同步，重复点击仅重启高亮）→ L4 可同步断言。

### 3.3 视觉映射

| 元素      | 态           | 颜色 / 处理                  |
| --------- | ------------ | ---------------------------- |
| 节点      | idle         | 圆形浅绿 `#8bd3a0` + 深绿字  |
| 走位路径  | path（逐层） | 黄 `#ffcf5c` + 放大          |
| 命中/中序 | found        | 深绿 `#4caf50` + 白字 + 放大 |
| 新节点    | enter        | 缩放入场                     |
| 父子边    | edge         | 半透明灰线（SVG）            |
| 画布      | 容器         | 新拟物内凹、定宽定高         |

> 注：path/found 用 transform 放大属瞬时强调、不引起布局重排（树是绝对定位，无 FLIP），无 C-017 冲突问题。

## 4. 树页 `Tree.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>树 Tree</h1>
  <p class="sub">数据结构 · 有层次的非线性结构（二叉搜索树）</p>
  <h2>什么是树</h2>
  <p>线性 → 非线性；根/子；倒过来的树…</p>
  <p>BST：左小右大；输入数试插入/查找，看从根逐层比较走位…</p>
  <Playground><TreeViz/></Playground>
  <p>插入 35 的走位；每层排除一半 O(log n)；中序遍历 = 升序（BST 招牌）。</p>
  <h2>树在哪里用</h2>
  <Callout>数据库索引（BST/红黑/B 树）· 堆 · 文件系统/DOM/表达式树</Callout>
  <p>下一篇讲堆——用数组装的完全二叉树。</p>
</Article>
```

关键术语 `<strong>` 绿色高亮，`O(log n)`/`BST` 类用 `<code>` 芯片。

## 5. 组件清单与改动面

| 文件                                       | 类型         | 改动                                                       |
| ------------------------------------------ | ------------ | ---------------------------------------------------------- |
| `src/components/structures/useTree.ts`     | **新增**     | BST 纯逻辑 composable（insert/search/inorder + pos 编号）  |
| `src/components/structures/TreeViz.vue`    | **新增**     | 树互动组件（二维 SVG + 圆形节点，借 TreeView 定位）        |
| `src/views/Article/DataStructure/Tree.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><TreeViz/></Playground>` |

**零改动**：`article/` 骨架 / `components/TreeView.vue` / `structures/use{Stack,Queue,Array,Link}*` / 路由 / 菜单 / 首页 / 图标 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useTree`/`TreeViz` 是全新文件，除树页外无人 import；**仅照搬** `TreeView.vue` 的定位公式（不 import、不改它）→ 对堆排树轨与其 `TC-VIZ-TREEVIEW-*` 零影响。
- `article/` 骨架原样复用、零改动 → C-015 骨架 Case 逐字不变。
- `Tree.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-TREE-*` 覆盖。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useTree`（`TC-TREE-LOGIC-*`）：初始平衡树/pos；`has`；`insert` 走位落正确 pos + 返回 path、查重、超深度；`search` 命中/未命中 + path；`inorder` 升序（核心不变量）；`reset` 复位。
- **L4 互动** `TC-VIZ-TREEVIZ-*`：初始 7 节点 + 6 边 + 输入框 + 4 按钮；insert 增节点（含新值）；查重 status；search 找到/没找到 status；中序 status 含升序；超深度 status；reset 复位；非法值提示；边数 = 节点数-1。
- **L4 视图** `TC-VIEW-TREE-*`：树页挂载渲染 `Article` + `TreeViz`、含「树」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-TREE-*`：导航 `/docs/tree`、见正文 + Playground；限定 `.tree-viz`：初始 7 节点、输入 35 插入见 8 节点且含值 35、中序遍历 status 含升序、重置回 7 节点。
