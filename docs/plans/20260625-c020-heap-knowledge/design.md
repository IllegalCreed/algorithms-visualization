# 设计：堆 Heap 知识页（大顶堆：数组+树双视图 + 上浮/下沉，复用知识页骨架）

> Status: verified
> Stable ID: C-20260625-020
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Heap.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><HeapViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     HeapViz.vue  ── 用 ── useHeap.ts（reactive 大顶堆 + 步进式 sift，可单测）
                  └─ 复用 TreeView.vue 的 pos 定位公式（照搬 depth/xPct 数学画树轨）
```

`useStack/useQueue/useArray/useLink/useTree/useHeap` 六组互动逻辑并列在 `structures/` 下，互不依赖。骨架、`components/TreeView.vue`、堆排序零改动。

## 2. 堆逻辑 `useHeap.ts`（大顶堆 + 步进式 sift，可单测）

```ts
export const HEAP_MAX = 15;
export interface UseHeap {
  items: Ref<[string, number][]>; // [稳定id, 值]；index = 完全二叉树 pos；大顶堆
  canInsert: ComputedRef<boolean>; // size < HEAP_MAX
  canExtract: ComputedRef<boolean>; // size > 0
  peek(): number | null; // 堆顶值（根）
  insert(value: number): number | null; // 末尾追加（不 sift），返回新下标；满返回 null
  siftUpStep(i: number): number; // 一步上浮：items[i] > parent 则交换、返回 parent 下标；否则 -1
  extractRoot(): number | null; // 取走根（最大）、末位补根，返回最大值；根待下沉；空返回 null
  siftDownStep(i: number): number; // 一步下沉：与较大孩子比，小则交换、返回该孩子下标；否则 -1
  reset(): void; // 复位为初始大顶堆
}
export function useHeap(): UseHeap;
```

- 索引：`parent(i)=⌊(i-1)/2⌋`、`left=2i+1`、`right=2i+2`。
- `insert`：`items.push([id,value])` 加到末尾（树的下一个叶子），**不 sift**，返回 `size-1`。
- `siftUpStep(i)`：`i>0 && items[i] > items[parent]` → 交换、返回 `parent`；否则 `-1`。
- `extractRoot`：空→null；`max=items[0]`；`last=items.pop()`；若仍有元素 `items[0]=last`；返回 `max`（根待 `siftDownStep` 归位）。
- `siftDownStep(i)`：在存在的孩子里取较大者 `big`；`items[big] > items[i]` → 交换、返回 `big`；否则 `-1`。
- **组件完整操作**：插入 = `i=insert(v); while((n=siftUpStep(i))>=0) i=n;`（每步间加延时→真实上浮）；弹出 = `max=extractRoot(); i=0; while((n=siftDownStep(i))>=0) i=n;`。
- **关键不变量**：每次「插入+完整上浮」「弹出+完整下沉」后，`items` 仍是合法大顶堆（∀i：父 ≥ 子），`peek()` 恒为当前最大值。允许重复值。

> 注：步进式单步（siftUpStep/siftDownStep）既可纯单测（L3 自行循环验证不变量），又供组件延时驱动真实分步动画；逻辑与动画职责分离。

## 3. 堆互动组件 `HeapViz.vue`

### 3.1 结构与布局（数组 + 树双视图联动）

```
.heap-viz (column, center)
 ├─ .toolbar   <input val 1–99> + 插入 / 弹出堆顶 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「画布」：固定宽，position:relative
 │        .row-label「数组」
 │        <TransitionGroup class="arr">   ← 数组轨：格按下标排，交换时 FLIP 移动
 │          .cell × n (key=id, data-i=pos)  值（idle 浅绿 / cmp 黄 / hot 深绿）+ 下方下标
 │        .row-label「树（同一个堆）」
 │        .tree (relative)                 ← 树轨：复用 TreeView pos 定位
 │          <svg class="edges">  每个 pos>0 节点到 parent 的 <line>
 │          .node × n (key=id, data-i=pos) 绝对定位 left:xPct% top:depth*H；圆形；CSS 过渡 left/top
 │        空态：.empty-hint「堆为空」
 └─ .status      状态解说行
```

**双视图联动**：数组格 `.cell` 与树节点 `.node` 用**同一份 `items`**、**同 id**。交换两个 pos 时，数组轨靠 `<TransitionGroup>` move(FLIP) 滑动、树轨靠 `.node` 的 `left/top` 过渡移动——**同一元素在两个视图同步动**。树定位公式照搬 `TreeView.vue`（pos = 数组下标，完全二叉树无空洞）。

### 3.2 交互与动画（真实分步）

- **插入 insert**：校验值（1–99，满 15 提示）→ `i=useHeap.insert(v)`（末尾追加，新节点 enter 入场）→ **分步上浮**：循环 `siftUpStep`，每步高亮交换对 `.cmp`（黄）、延时后交换（两视图 FLIP/过渡同步移动）→ 末了到位节点 `.hot`。`status` 解说上浮次数 + O(log n)。
- **弹出堆顶 extractRoot**：根标 `.hot` →（延时）`extractRoot()`（取最大、末位补根）→ **分步下沉**：循环 `siftDownStep`，每步高亮交换对、延时交换。`status` 解说弹出值 + 新堆顶。空堆禁用。
- **重置 reset**：复位初始堆。
- 分步用 `setTimeout`/`await`（组件卸载清理、`busy` 防重入）；数据每步同步、两视图同 id 同步移动。

### 3.3 视觉映射

| 元素        | 态          | 颜色 / 处理             |
| ----------- | ----------- | ----------------------- |
| 格 / 节点   | idle        | 浅绿 `#8bd3a0` + 深绿字 |
| 交换对      | cmp（逐步） | 黄 `#ffcf5c` + 抬升层级 |
| 到位 / 堆顶 | hot         | 深绿 `#4caf50` + 白字   |
| 新元素      | enter       | 缩放入场                |
| 父子边      | edge        | 半透明灰线（SVG）       |
| 数组下标    | idx         | 灰小字                  |

## 4. 堆页 `Heap.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>堆 Heap</h1>
  <p class="sub">数据结构 · 用数组装的完全二叉树（大顶堆）</p>
  <h2>什么是堆</h2>
  <p>完全二叉树 + 父≥子 → 堆顶最大；只管父子不比左右…</p>
  <p>用数组装：i 的左 2i+1 / 右 2i+2 / 父 ⌊(i-1)/2⌋；上下双视图是同一个堆…</p>
  <Playground><HeapViz/></Playground>
  <p>插入放末尾再上浮；弹出堆顶取最大、末位补根再下沉；都 O(log n)。</p>
  <h2>堆在哪里用</h2>
  <Callout>优先队列（任务调度/Dijkstra）· 堆排序 · Top-K/中位数</Callout>
  <p>剩两种更「跳跃」的结构——哈希表和图。</p>
</Article>
```

关键术语 `<strong>` 高亮，`O(log n)`/`2i+1` 类用 `<code>`。

## 5. 组件清单与改动面

| 文件                                       | 类型         | 改动                                                        |
| ------------------------------------------ | ------------ | ----------------------------------------------------------- |
| `src/components/structures/useHeap.ts`     | **新增**     | 大顶堆纯逻辑（步进式 sift + insert/extractRoot + pos 编号） |
| `src/components/structures/HeapViz.vue`    | **新增**     | 堆互动组件（数组+树双视图，借 TreeView 定位 + 分步动画）    |
| `src/views/Article/DataStructure/Heap.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><HeapViz/></Playground>`  |

**零改动**：`article/` 骨架 / `components/TreeView.vue` / 堆排序（`HeapSort.vue` 等）/ `structures/use{Stack,Queue,Array,Link,Tree}*` / 路由 / 菜单 / 首页 / 播放器 / store。

## 6. 向后兼容论证

- `useHeap`/`HeapViz` 是全新文件，除堆页外无人 import；**仅照搬** `TreeView.vue` 定位公式 → 对堆排序与其 `TC-HEAP-*` 零影响；**Case ID 用 `HEAPDS` 命名空间**避让 `TC-HEAP-ALGO/MOD/E2E/VIEW-*`。
- `article/` 骨架原样复用、零改动。
- `Heap.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-HEAPDS-*`。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useHeap`（`TC-HEAPDS-LOGIC-*`）：初始大顶堆/peek；`insert` 末尾追加（不 sift）；`siftUpStep` 单步；完整插入后合法堆 + root 最大；`extractRoot` 取根移末；`siftDownStep` 单步；完整弹出后合法堆；不变量（连续操作后仍大顶堆、peek=max）；满/空边界；reset + id 唯一。
- **L4 互动** `TC-VIZ-HEAPVIZ-*`：初始 7 格 + 7 节点 + 6 边 + 输入框 + 3 按钮；insert 双视图各 +1 + 含新值；extract 双视图各 -1 + status 含弹出/最大值；双视图同步（格数=节点数）；边数=节点数-1；非法值提示；reset 复位；insert status 含「上浮」。
- **L4 视图** `TC-VIEW-HEAPDS-*`：堆页挂载渲染 `Article` + `HeapViz`、含「堆」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-HEAPDS-*`：导航 `/docs/heap`、见正文 + Playground；限定 `.heap-viz`：初始 7 格 + 7 节点、输入 95 插入见 8 格 + 8 节点且含值 95、重置回 7。
