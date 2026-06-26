# 设计：链表·双向（反向遍历 + 无需找前驱的 O(1) 删除，链表页加节）

> Status: verified
> Stable ID: C-20260626-025
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Link.vue   （现有页，查找逐跳正文后加一节）
   │  … <Playground><LinkViz/></Playground> …            ← C-018 既有单链表，不动
   │  <h2>双向链表：再加一根 prev 指针</h2> 正文
   │  <Playground><DlinkViz/></Playground>               ← 新增
   ▼
└─ 互动组件（src/components/structures/，新增）
     DlinkViz.vue  ── 用 ── useDlink.ts（双向链 + forward/backward + O(1) removeAt，可单测）
```

`LinkViz`（C-018，单链表）与 `DlinkViz`（本次，双向链表）并列在链表页，互不依赖。骨架、LinkViz、useLink 零改动。节点类名 `.dnode` 与单链表 `.node` 区隔（同页共存、各自作用域）。

## 2. 双向链表逻辑 `useDlink.ts`（双向链 + 双序 + O(1) 删除，可单测）

```ts
export const DLINK_MAX = 6;

export interface DlinkRewire {
  left: number | 'head'; // 被删节点的前驱锚（删头则 'head'）—— 它的 next 改向
  right: number | 'tail'; // 被删节点的后继锚（删尾则 'tail'）—— 它的 prev 改向
}
export interface UseDlink {
  items: Ref<[string, number][]>; // [稳定id, 值]；顺序 = head→tail
  selected: Ref<number | null>;
  hasSelection: ComputedRef<boolean>;
  forward: ComputedRef<number[]>; // 正向值序 head→tail（沿 next）
  backward: ComputedRef<number[]>; // 反向值序 tail→head（沿 prev）
  select: (i: number) => void; // 点选 toggle
  removeAt: () => { value: number; rewire: DlinkRewire } | null; // 删 selected，O(1) 接线
  reset: () => void;
}
```

- 初始 `[10,20,30,40]`（4 节点）；稳定 id 驱动 TransitionGroup。
- `forward` = `items` 值序；`backward` = `items` 反转值序（演示「沿 prev 从 tail 往回」）。
- `select(i)`：`selected = selected===i ? null : i`（toggle）。
- `removeAt()`：删 `selected` 节点——
  - `rewire.left = i-1>=0 ? i-1 : 'head'`、`rewire.right = i+1<len ? i+1 : 'tail'`（删除**前**的相邻锚，供组件高亮重新桥接的两侧）；
  - `items.splice(i,1)`；`selected=null`；返回 `{value, rewire}`。
  - **关键不变量**：双链表节点自带 `prev`，删它只需 `prev.next=next; next.prev=prev` 两步指针改写、**O(1)**，无需像单链表那样从 head 走 O(n) 找前驱。
- `reset()`：重建 `[10,20,30,40]`、清选中。

> 注：`items` 用 `ref`，`removeAt`/`reset` 同步改它；`forward`/`backward` 计算属性；反向遍历/接线点亮动画由 DlinkViz 用 setTimeout 驱动（同步数据 + 延时高亮，L4 可断言）。

## 3. 双向链表互动组件 `DlinkViz.vue`

### 3.1 结构与布局

```
.dlink-viz (column, center)
 ├─ .toolbar   ← 反向遍历 / 删除选中 / 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「车道」：定宽定高
 │        ∅  ⇄  [head·tail 锚] .dnode × 4（⇄ 双箭头相邻）  ∅
 │           .conn(→ next / ← prev，rewired 脉冲)
 │           .dnode.is-sel / .dnode.lit（反向点亮）
 ├─ （head / tail 锚点标在首/尾节点）
 └─ .status   状态解说行
```

### 3.2 交互与动画

- **点选节点**：`select(i)`；status 提示选中值；`.dnode.is-sel` 高亮。
- **反向遍历**：同步置 status = `反向遍历（沿 prev 从 tail 往回）：40 → 30 → 20 → 10。单链表只有 next，做不到。`（含完整反向序，可测）→ 按 `backward` 顺序逐个 `.lit` 点亮（setTimeout，间隔 ~480ms）。
- **删除选中**：`r = removeAt()`（**同步**改 items）→ 同步置 status = `删除 a[i]=v：节点自带 prev → 直接 prev.next=next、next.prev=prev，O(1)，不用从 head 找前驱。` → 闪烁重新桥接的连接（`rewire.left` 一侧 `.conn.rewired` 脉冲）；被删节点 TransitionGroup 离场。无选中则提示先点一个。
- 分步 `setTimeout`（卸载清理）；`reset` 复原。结果同步、L4 可断言。

### 3.3 视觉映射

| 元素       | 态      | 颜色 / 处理                            |
| ---------- | ------- | -------------------------------------- |
| 节点       | idle    | 浅绿 `#8bd3a0` + 深绿字                |
| 节点       | is-sel  | 深绿 `#4caf50` + 白字 + 绿环（不位移） |
| 反向点亮   | lit     | 白底 + 深绿环 + 抬起                   |
| 连接 → / ← | conn    | 浅绿双箭头                             |
| 接线改写   | rewired | 深绿脉冲 0.7s                          |
| head/tail  | pill    | 高亮绿胶囊                             |
| 两端 null  | nullbox | 灰虚框 ∅                               |

## 4. 链表页加节 `Link.vue` 正文大纲（查找逐跳正文后插入）

```
…（现有 LinkViz 段 + 查找逐跳正文，不动）…
<h2>双向链表：再加一根 prev 指针</h2>
<p>单链表每个节点只有 next，只能从 head 往后走。给每个节点再加一根指向前一个节点的 prev，就成了双向链表。</p>
<p>prev 换来两件单链表做不到的事：① 反向遍历——能从 tail 沿 prev 往回走；② 给定任意节点 O(1) 删除——单链表只拿到一个节点要从 head 走 O(n) 找前驱才能删，双链表节点自带 prev，直接 prev.next=next、next.prev=prev。试试反向遍历、点节点删除。</p>
<Playground><DlinkViz/></Playground>
<p>代价是每个节点多存一根指针、增删要多维护一根。把尾节点的 next 接回头、头的 prev 接到尾，就成了循环链表（环状，适合轮询调度）。</p>
…（现有「链表在哪里用」段，不动）…
```

## 5. 组件清单与改动面

| 文件                                       | 类型       | 改动                                                         |
| ------------------------------------------ | ---------- | ------------------------------------------------------------ |
| `src/components/structures/useDlink.ts`    | **新增**   | 双向链 + forward/backward + O(1) removeAt                    |
| `src/components/structures/DlinkViz.vue`   | **新增**   | 双向链节点 + 反向遍历 + O(1) 删除接线互动                    |
| `src/views/Article/DataStructure/Link.vue` | 改（加节） | 查找逐跳正文后插入「双向链表」节 + `<Playground><DlinkViz/>` |
| `e2e/link.e2e.ts`                          | 改（消歧） | TC-E2E-LINK-01 第 10 行 `.playground` → `.first()`（两件）   |

**零改动**：`article/` 骨架 / `LinkViz`/`useLink` / 其余 `structures/*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useDlink`/`DlinkViz` 是全新文件，除链表页外无人 import → 对 LinkViz 与其余零影响。
- `Link.vue` 仅**追加**一节：现有 `TC-VIEW-LINK-01`（Article+LinkViz 存在）、`TC-VIEW-LINK-02`（「链表」标题 + `.playground` 存在，`find` 取首个）**不受影响**——新节用 `.dlink-viz` 作用域隔离、节点类 `.dnode` 与 `.node` 区隔。
- 新增 `TC-VIEW-LINK-03`（链表页含 DlinkViz）、`TC-E2E-LINK-02`（双向节 e2e，限定 `.dlink-viz`）。
- 唯一回归点：`TC-E2E-LINK-01` 第 10 行 `page.locator('.playground').toBeVisible()` 在两个 Playground 下命中 2 个（严格模式）→ 改 `.first()`，断言意图不变（与 C-023/C-024 加第二件同款机械消歧）。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useDlink`（`TC-DLINK-LOGIC-*`）：初始 [10,20,30,40]；forward/backward；select toggle/hasSelection；removeAt 中部/头/尾 的 items 与 rewire；removeAt 无选中 null；backward 随删除更新；reset。
- **L4 互动** `TC-VIZ-DLINKVIZ-*`：初始 4 dnode + 双箭头 + 3 按钮 + head/tail；节点值；点选 is-sel；反向遍历 status 含「反向」「40 → 30」；删除选中 dnode→3 且 status 含「O(1)」「prev」；删头首节点变 20；重置回 4。
- **L4 视图** `TC-VIEW-LINK-03`：链表页含 `DlinkViz`（findComponent）。
- **L5 e2e** `TC-E2E-LINK-02`：`/docs/link` 限定 `.dlink-viz`：初始 4 dnode、反向遍历 status 含「反向」、点节点删除 dnode→3、重置回 4。
