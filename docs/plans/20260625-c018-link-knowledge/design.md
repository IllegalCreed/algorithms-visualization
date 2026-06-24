# 设计：链表 Linked List 知识页（节点 + next 箭头 + head + null，复用知识页骨架）

> Status: verified
> Stable ID: C-20260625-018
> Owner: IllegalCreed
> Created: 2026-06-25
> Last reviewed: 2026-06-25
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

链表页**复用** C-015 立起的知识页三层骨架，只在「互动件」层新增链表专属逻辑与视图：

```
src/views/Article/DataStructure/Link.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><LinkViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     LinkViz.vue  ── 用 ── useLink.ts（reactive 链表逻辑 + 选中态，可单测）
```

`useStack`/`useQueue`/`useArray`/`useLink` 四组互动逻辑并列在 `structures/` 下，**互不依赖**。骨架（`article/`）零改动。

## 2. 链表逻辑 `useLink.ts`（纯逻辑 + 选中态，可单测）

```ts
export const LINK_MAX = 6;
export interface UseLink {
  items: Ref<[string, number][]>; // [稳定id, 值]；顺序 = 从 head 起的链序，index 0 = head
  selected: Ref<number | null>; // 当前选中节点下标（null = 未选）
  hasSelection: ComputedRef<boolean>; // selected != null（查找/删除可用）
  canInsert: ComputedRef<boolean>; // hasSelection && size < LINK_MAX
  canPrepend: ComputedRef<boolean>; // size < LINK_MAX
  select(i: number): void; // 点选节点；再点同一个取消（toggle）
  valueAt(i: number): number | null; // 按位置读值（演示为逐跳，概念 O(n)）；越界 null
  insertAfter(): number | null; // 在 selected 后插入 ++seq；选中落新节点(selected+1)；!canInsert→null
  remove(): number | null; // 删除 selected（前驱 next 跳过）；清空选中；无选中→null
  prepend(): number | null; // 头插 ++seq（unshift）；满→null；selected 非空则 +1
  reset(): void; // 复位为 [1,2,3]、seq=3、清空选中
}
export function useLink(): UseLink;
```

- 初始：`items = [1,2,3]`（带稳定 id），`seq = 3`（下一个值 = `++seq` = 4）。
- `insertAfter` 用 `items.value.splice(selected+1, 0, [id, ++seq])`（在选中后插入），插完 `selected = selected+1`（落新节点）。
- `remove` 用 `items.value.splice(selected, 1)`（删选中），删完 `selected = null`。
- `prepend` 用 `items.value.unshift([id, ++seq])`（头插），`selected` 非空则 `+1`（整体右移一位）。
- `valueAt(i)` = `items[i]?.[1] ?? null`（按位置读；可视化演示为逐跳走指针）。
- `select(i)`：`selected = selected === i ? null : i`（toggle）。
- **关键不变量**：链表用数组顺序表达「链序」，但**语义**是 next 串联——增删只改局部（splice/unshift 对应改 1–2 根指针），**不搬移其余节点的内容**；访问按位置需逐跳。稳定 id 让 `<TransitionGroup>` 正确做进出场 + FLIP。

> 注：底层用 `[string,number][]` 顺序数组表达链序（与 stack/queue/array 同范式、可单测），链表的「指针」语义由 `LinkViz` 的箭头可视化 + 状态解说承载；二者职责分离。

## 3. 链表互动组件 `LinkViz.vue`

### 3.1 结构与布局（节点 + next 箭头 + head + null，含两条硬约束）

```
.link-viz (column, center)
 ├─ .toolbar   查找选中 / 在其后插入 / 删除选中 / 头插 / 重置
 │             （新拟物按钮；按 hasSelection/canInsert/canPrepend 禁用 + 动态显当前 i）
 ├─ .lane-wrap   居中
 │   └─ .lane「车道」：固定宽 560px、内凹阴影、position:relative、overflow:hidden
 │        .row (flex-row, 左对齐)
 │          .head「head」胶囊 + .arrow→        ← head 指向首节点
 │          <TransitionGroup>
 │            .node (relative) × n   ← index i；点选 → is-sel
 │               .box 值（选中深绿白字 / idle 浅绿深绿字）+ .arrow→（该节点的 next）
 │          .nullbox「∅」                       ← 末节点 next 指向 null
 │        空态：.empty-hint「链表为空」（车道宽不变）
 └─ .status      状态解说行
```

**硬约束 1——指针挂节点（不手算坐标）**：每个 `.node` 自带 `.arrow`（其 `next`），靠 flex 相邻关系指向右侧下一个节点；`head` 胶囊 + 箭头是 `.row` 首个 flex 项，指向首节点。增删后节点 FLIP 重排，箭头随节点走、自动重连——**不手算任何坐标**。

**硬约束 2——车道定宽**：`.lane { width:560px }` 固定，空/满一致，杜绝加第一个节点时跳变。

### 3.2 交互与动画

- **点选**：点 `.node .box` → `useLink.select(i)`。选中节点变深绿。再点同节点取消。`status` 提示当前选中。
- **查找 find**：`status` **同步**置为「find(i)：从 head 走了 i+1 步才到，不能跳，O(n)」（可测）；同时启动**逐跳游标动画**——游标从 head 起依次给 `.node` 加 `.visiting`（白底深绿环、抬起），间隔 ~480ms，到选中节点止，再清除（纯视觉、setTimeout，期间锁工具栏 busy）。
- **在其后插入 insertAfter**：`useLink.insertAfter()` → 在 selected+1 处插入新节点。`<TransitionGroup>` 让新节点滑入、其余 FLIP；**高亮被改写的 2 根 next 箭头**（原节点的 + 新节点的，加 `.rewired` 脉冲）。选中落新节点。`status`=「在 a[i] 后插入 N：只改 2 根 next，其余不动，O(1)」。
- **删除 remove**：`useLink.remove()` → 删 selected。目标节点离场、其余 FLIP；**高亮前驱的 next 箭头**（跳过它）。清空选中。`status`=「删除 a[i]=N：前一个节点 next 跳过它，改 1 根，O(1)」。
- **头插 prepend**：`useLink.prepend()` → unshift。新节点滑入表头；高亮 head + 新节点 next。`status`=「头插 N：新节点 next 指原头、head 指新节点，O(1)」。
- **重置 reset**：复位 `[1,2,3]`、清选中。
- 动画 `<TransitionGroup name="link">` + scoped keyframes（enter 滑入、leave 缩淡、move FLIP）+ 箭头 `.rewired` pulse；与 `ArrayViz` 同范式；增删/头插纯用户事件驱动（无 async），仅查找的逐跳游标用 setTimeout（纯视觉、组件卸载清理）。

### 3.3 视觉映射

| 元素      | 态               | 颜色 / 处理                                  |
| --------- | ---------------- | -------------------------------------------- |
| 选中节点  | is-sel           | 深绿 `#4caf50` + 白字 + 阴影环（**不位移**） |
| 其余节点  | idle             | 浅绿 `#8bd3a0` + 深绿字 `#1f5e3a`            |
| 查找游标  | visiting（逐跳） | 白底 + 深绿环 + 抬起                         |
| next 箭头 | idle / rewired   | 浅绿 `#7bbf94` / 深绿脉冲 `#4caf50`          |
| head 胶囊 | 常驻             | 主题绿 `#42b883` + 白字                      |
| null 框   | 常驻             | 灰虚线 `∅`                                   |
| 车道      | 容器             | 新拟物内凹                                   |

> 注：选中态**不用 transform 位移**（沿用 C-017 教训，避免与 FLIP move-transform 冲突）；`visiting`/`rewired` 用 transform 但只在查找/增删瞬时触发、不与持续选中态叠加。

## 4. 链表页 `Link.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>链表 Linked List</h1>
  <p class="sub">数据结构 · 用指针把节点串起来的序列</p>
  <h2>什么是链表</h2>
  <p>节点散落、next 串联、head 指首、∅ 收尾；按位置访问要从 head 逐跳 O(n)…</p>
  <p>但增删只改几根指针、不搬移，O(1)。正好和数组互为镜像。点节点选中再操作。</p>
  <Playground><LinkViz/></Playground>           ← 读者亲手试
  <p>查找看走几步 O(n)；插入/删除只改 1–2 根 next 高亮 O(1)；和数组对照。</p>
  <h2>链表在哪里用</h2>
  <Callout>频繁增删 · 栈/队列链式实现 · 树图的基石</Callout>
  <p>下一篇讲树——节点不再排一条线，而是长出层次分明的分叉。</p>
</Article>
```

关键术语 `<strong>` 绿色高亮，`O(1)`/`O(n)`/`next`/`head` 类用 `<code>` 芯片。

## 5. 组件清单与改动面

| 文件                                       | 类型         | 改动                                                       |
| ------------------------------------------ | ------------ | ---------------------------------------------------------- |
| `src/components/structures/useLink.ts`     | **新增**     | 链表纯逻辑 composable（含选中态）                          |
| `src/components/structures/LinkViz.vue`    | **新增**     | 链表互动组件（节点 + next 箭头 + head + null）             |
| `src/views/Article/DataStructure/Link.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><LinkViz/></Playground>` |

**零改动**：`article/` 骨架 / `structures/useStack*`/`useQueue*`/`useArray*` / 路由 / 菜单 / 首页 / 图标 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useLink`/`LinkViz` 是 `structures/` 下全新文件，除链表页外无人 import → 对栈、队列、数组、骨架、排序、播放器零影响。
- `article/` 骨架原样复用、零改动 → C-015 的骨架 Case 逐字不变（由全门禁回归证明）。
- `Link.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-LINK-*` 覆盖。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useLink`（`TC-LINK-LOGIC-*`）：初始 `[1,2,3]`/seq；`valueAt` 读 + 越界 null；`select` toggle；`insertAfter` 在 i 后插递增值、选中落新节点(i+1)、链序正确；`remove` 删 i 清选中；`prepend` 头插、selected 随之 +1；`hasSelection`/`canInsert`(满)/`canPrepend`(满) 切换；id 唯一；`reset` 复位。
- **L4 互动** `TC-VIZ-LINKVIZ-*`：初始 3 节点 + head + null + 无选中禁查找/插入/删除；点节点选中（is-sel + 启用）；insertAfter 增节点且新值落 i+1；remove 减节点；prepend 头插落表头；节点带 .arrow + 有 .nullbox/.head；满 6 禁插入/头插；find 同步解说含 O(n)；reset 复位；删空显 empty-hint。
- **L4 视图** `TC-VIEW-LINK-*`：链表页挂载渲染 `Article` + `LinkViz`、含「链表」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-LINK-*`：导航 `/docs/link`、见正文 + Playground；限定 `.link-viz`：初始 3 节点 + head + null、点节点选中（is-sel）、insertAfter 见 4 节点且新值落选中后、prepend 见 5 节点落表头、reset 回 3 节点。
