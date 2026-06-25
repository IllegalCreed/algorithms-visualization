# 设计：树·平衡深化（退化↔平衡对照 + 查找走位，树页加节）

> Status: verified
> Stable ID: C-20260625-023
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Tree.vue   （现有页，中序段后加一节）
   │  … <Playground><TreeViz/></Playground> …            ← C-019 既有，不动
   │  <h2>为什么会失衡 · 平衡的思想</h2> 正文
   │  <Playground><BalanceViz/></Playground>             ← 新增
   ▼
└─ 互动组件（src/components/structures/，新增）
     BalanceViz.vue  ── 用 ── useBalance.ts（两套固定布局 + 纯 search，可单测）
```

`TreeViz`（C-019，读者自建 BST）与 `BalanceViz`（本次，退化↔平衡对照）并列在树页，互不依赖。骨架、TreeViz、useTree 零改动。

## 2. 平衡逻辑 `useBalance.ts`（两套固定布局 + 纯 search，可单测）

```ts
export interface BNode {
  id: string;
  value: number;
  x: number;
  y: number;
}
export interface BalanceLayout {
  nodes: BNode[];
  edges: [number, number][]; // 节点下标对
  height: number; // 层数
  worst: number; // 最坏查找比较次数
}
export interface SearchResult {
  path: number[]; // 走过的节点下标
  steps: number;
}
export interface UseBalance {
  chain: BalanceLayout; // 退化：值 1–7 右斜链
  balanced: BalanceLayout; // 平衡：值 4/2/6/1/3/5/7 完全二叉树
  search: (target: number, mode: 'chain' | 'balanced') => SearchResult;
}
export function useBalance(): UseBalance;
```

- `chain`：值 `[1..7]`，下标 i = 值-1，坐标右斜（`x=70+i*46, y=30+i*40`）；边 `[i,i+1]`；**每节点右孩子=下一个**（BST 退化），`height=7`、`worst=7`。
- `balanced`：值 `[4,2,6,1,3,5,7]` 按完全二叉树 pos 0..6（坐标用 `xPct/depth` 公式，同 TreeView）；边 `pos→⌊(pos-1)/2⌋`；`height=3`、`worst=3`。
- `search(target, mode)`：在对应布局上走 BST 路径——
  - chain：从下标 0 起，`value===target` 命中；`target<value` 则左（无）即止；否则右移（下一下标）。值升序 → search(k)=k 步（1–7）。
  - balanced：从 pos 0 起，`target<value` 走左 `2p+1`、`>` 走右 `2p+2`，命中即返回。任意值 ≤3 步。
  - 返回 `path`（节点下标序）+ `steps`。
- **关键不变量**：同样 7 个值，chain 高度 7 / search(7)=7（O(n)）vs balanced 高度 3 / search(7)=3（O(log n)）——失衡的代价可测。

> 注：两布局固定不变（无 reactive 状态），useBalance 返回静态数据 + 纯 search；切换/走位动画由 BalanceViz 用 setTimeout 驱动。

## 3. 平衡互动组件 `BalanceViz.vue`

### 3.1 结构与布局

```
.bal-viz (column, center)
 ├─ .toolbar   顺序插入（退化） / 平衡的树 / 查找 7   （前两个 toggle，on 高亮）
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽
 │        <svg> <g.edges> <line.edge × 6>     ← 当前 mode 的边
 │              <g.verts> <g.node × 7>         ← 圆形节点（circle + value）
 │                  .node.path / .node.hot
 ├─ .readout   高度 N 层 · 最坏查找 N 次（退化 .bad 橙 / 平衡 .good 绿）
 └─ .status    状态解说行
```

### 3.2 交互与动画

- **切换 mode**：点「退化/平衡」→ `mode = 'chain'/'balanced'`（非 busy 时）；清查找高亮；`readout` 随 `cur.height/worst` 更新；按钮 `.on` 高亮当前。
- **查找 7**：`r = useBalance.search(7, mode)`（同步）→ **同步**置 status（含步数 + O(n)/O(log n)，可测）→ 逐步点亮 `path`（前序 `.path` 黄、末位 `.hot` 深绿），间隔 ~560ms。
- 分步 `setTimeout`（卸载清理、`busy` 防重入）；步数结果同步、L4 可断言。

### 3.3 视觉映射

| 元素      | 态   | 颜色 / 处理                 |
| --------- | ---- | --------------------------- |
| 节点      | idle | 圆形浅绿 `#8bd3a0` + 深绿字 |
| 走位中    | path | 黄 `#ffcf5c`                |
| 命中      | hot  | 深绿 `#4caf50` + 白环       |
| 读数·退化 | bad  | 橙 `#ff8a65`                |
| 读数·平衡 | good | 绿 `#4caf50`                |
| 边        | edge | 半透明灰线（SVG）           |

## 4. 树页加节 `Tree.vue` 正文大纲（中序段后插入）

```
…（现有 TreeViz 段 + 中序遍历段，不动）…
<h2>为什么会失衡 · 平衡的思想</h2>
<p>BST 快有前提：树得长得开。按顺序插 1–7 全挂右边 → 退化成链、高度 n、查找 O(n)，和链表一样慢。</p>
<p>平衡树（AVL/红黑）一发现某支太深就旋转压扁，保持 ~O(log n)。下面同 7 个值切换看差多少。</p>
<Playground><BalanceViz/></Playground>
<p>退化链查 7 走 7 步、平衡树 3 步；值越多差距越夸张。真实有序 map/set、数据库索引底层都用自平衡树（红黑树、B 树）。</p>
…（现有「树在哪里用」段，不动）…
```

## 5. 组件清单与改动面

| 文件                                       | 类型       | 改动                                                 |
| ------------------------------------------ | ---------- | ---------------------------------------------------- |
| `src/components/structures/useBalance.ts`  | **新增**   | 两套固定布局 + 纯 search                             |
| `src/components/structures/BalanceViz.vue` | **新增**   | 退化↔平衡对照 + 查找走位互动                         |
| `src/views/Article/DataStructure/Tree.vue` | 改（加节） | 中序段后插入「平衡」节 + `<Playground><BalanceViz/>` |

**零改动**：`article/` 骨架 / `TreeViz`/`useTree` / 其余 `structures/*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useBalance`/`BalanceViz` 是全新文件，除树页外无人 import → 对 TreeViz 与其余零影响。
- `Tree.vue` 仅**追加**一节（h2 + 正文 + 第二个 Playground）：现有 `TC-VIEW-TREE-01`（Article+TreeViz 存在）、`TC-VIEW-TREE-02`（「树」标题 + `.playground` 存在，`find` 取首个）、`TC-E2E-TREE-01`（限定 `.tree-viz`）**均不受影响**——新节用 `.bal-viz` 作用域隔离。
- 新增 `TC-VIEW-TREE-03`（树页含 BalanceViz）、`TC-E2E-TREE-02`（平衡节 e2e，限定 `.bal-viz`）。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useBalance`（`TC-BAL-LOGIC-*`）：chain/balanced 结构（7 节点/6 边/height/worst/values）；`search(7,chain)`=7 步、`search(7,balanced)`=3 步；多值步数；两 mode 同值步数不同；id 唯一。
- **L4 互动** `TC-VIZ-BALVIZ-*`：初始退化（7 节点+6 边+3 按钮+退化 on+readout 含 7 层/7 次）；切平衡（readout 含 3 层/3 次）；节点值；查找 7 chain/balanced status 含步数；切回；readout 不同。
- **L4 视图** `TC-VIEW-TREE-03`：树页含 `BalanceViz`（findComponent）。
- **L5 e2e** `TC-E2E-TREE-02`：`/docs/tree` 限定 `.bal-viz`：初始 7 节点、切平衡 readout 变、查找 7 status 含步数。
