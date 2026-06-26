# 设计：队列·双端（四向进出 deque + 栈/队列特例，队列页加节）

> Status: verified
> Stable ID: C-20260626-026
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Queue.vue   （现有页，FIFO 对比正文后加一节）
   │  … <Playground><QueueViz/></Playground> …           ← C-016 既有 FIFO 队列，不动
   │  <h2>双端队列 Deque：两端都能进出</h2> 正文
   │  <Playground><DequeViz/></Playground>               ← 新增
   ▼
└─ 互动组件（src/components/structures/，新增）
     DequeViz.vue  ── 用 ── useDeque.ts（双端 push/pop + size/front/back，可单测）
```

`QueueViz`（C-016，FIFO）与 `DequeViz`（本次，双端）并列在队列页，互不依赖。骨架、QueueViz、useQueue 零改动。元素类名 `.dqitem` 与队列 `.qitem` 区隔（同页共存）。

## 2. 双端队列逻辑 `useDeque.ts`（四向 push/pop，可单测）

```ts
export const DEQUE_MAX = 6;

export interface UseDeque {
  items: Ref<[string, number][]>; // [稳定id, 值]；index 0 = 队头 front、末位 = 队尾 back
  size: ComputedRef<number>;
  isEmpty: ComputedRef<boolean>;
  isFull: ComputedRef<boolean>;
  front: ComputedRef<number | null>;
  back: ComputedRef<number | null>;
  pushFront: () => number | null; // 队头入 ++seq；满返回 null
  pushBack: () => number | null; // 队尾入 ++seq；满返回 null
  popFront: () => number | null; // 队头出，返回值；空返回 null
  popBack: () => number | null; // 队尾出，返回值；空返回 null
  reset: () => void;
}
```

- 初始 `[1,2,3]`；`seq` 起于 3（=INITIAL.length），push 用 `++seq`（看落点 front/back，不复用旧值）；稳定 id 驱动 TransitionGroup。
- `pushFront`：`isFull` → null；否则 `items.unshift([id, ++seq])`，返回值。
- `pushBack`：`isFull` → null；否则 `items.push([id, ++seq])`，返回值。
- `popFront`：`isEmpty` → null；否则 `items.shift()[1]`。
- `popBack`：`isEmpty` → null；否则 `items.pop()[1]`。
- `front`/`back`：首/末元素值（空为 null）；`size`/`isEmpty`/`isFull`。
- `reset`：重建 `[1,2,3]`、`seq=3`。
- **关键不变量**：只用 back 端 push/pop = 栈（LIFO）；back 进 front 出 = 队列（FIFO）——deque 是两者的共同推广。

> 注：`items` 用 `ref`，四个操作同步改它并同步返回结果；`front`/`back`/`size` 计算属性；元素进出由 DequeViz 的 TransitionGroup 做（cosmetic），逻辑无计时器、L4 可断言。

## 3. 双端队列互动组件 `DequeViz.vue`

### 3.1 结构与布局

```
.deque-viz (column, center)
 ├─ .toolbar   头部入 / 尾部入 / 头部出 / 尾部出 / 重置
 │             （出队两个在空时 disabled）
 ├─ .lane-wrap   居中
 │   └─ .lane「车道」：定宽定高；空显 empty-hint
 │        TransitionGroup .dqitem × n（横排，front 在左 back 在右）
 │           .plate 值；.is-front/.is-back 端标记跟随
 └─ .status   状态解说行
```

### 3.2 交互与动画

- **头部入 / 尾部入**：`pushFront()`/`pushBack()`（**同步**改 items）→ 同步置 status（`头部入：v 加到队头` / `尾部入：v 加到队尾`，可测）；满则不变。
- **头部出 / 尾部出**：`popFront()`/`popBack()`（同步）→ 同步置 status（`头部出：队头 v 离开` / `尾部出：队尾 v 离开`）；空则按钮 disabled。
- 元素进出 TransitionGroup（中性纵向淡入淡出 + 其余 FLIP 水平补位）；逻辑同步、L4 可断言（mount 时 stub transition-group）。

### 3.3 视觉映射

| 元素   | 态       | 颜色 / 处理                     |
| ------ | -------- | ------------------------------- |
| 元素   | idle     | 浅绿 `#8bd3a0` + 深绿字         |
| 元素   | is-front | 深绿 `#4caf50` + 白字           |
| 头标记 | m-front  | 深绿「↑ 队头」跟随首元素        |
| 尾标记 | m-back   | 高亮绿「↑ 队尾」跟随末元素      |
| 空态   | empty    | 居中 empty-hint「双端队列为空」 |

## 4. 队列页加节 `Queue.vue` 正文大纲（FIFO 对比正文后插入）

```
…（现有 QueueViz 段 + FIFO 对比正文，不动）…
<h2>双端队列 Deque：两端都能进出</h2>
<p>普通队列死守 FIFO——只能尾进头出。双端队列（deque）放宽限制：队头、队尾两端都能进、都能出，四个操作 pushFront/pushBack/popFront/popBack。</p>
<p>它是栈和队列的共同推广：只用一端进出就是栈（LIFO），一端进、另一端出就是队列（FIFO）。试试四个方向。</p>
<Playground><DequeViz/></Playground>
<p>deque 的经典用途是滑动窗口最值（单调队列，两端维护候选）；定长 deque 还能做最近 N 条历史/撤销。另一种带优先级的队列——优先队列，本质是堆（见堆那篇），总让最小/大的先出。</p>
…（现有「队列在哪里用」段，不动）…
```

## 5. 组件清单与改动面

| 文件                                        | 类型       | 改动                                                          |
| ------------------------------------------- | ---------- | ------------------------------------------------------------- |
| `src/components/structures/useDeque.ts`     | **新增**   | 双端 push/pop + size/front/back + isFull/isEmpty              |
| `src/components/structures/DequeViz.vue`    | **新增**   | 横向车道 + 头/尾标记 + 四向进出互动                           |
| `src/views/Article/DataStructure/Queue.vue` | 改（加节） | FIFO 对比正文后插入「双端队列」节 + `<Playground><DequeViz/>` |
| `e2e/queue.e2e.ts`                          | 改（消歧） | TC-E2E-QUEUE-01 第 10 行 `.playground` → `.first()`（两件）   |

**零改动**：`article/` 骨架 / `QueueViz`/`useQueue` / 其余 `structures/*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useDeque`/`DequeViz` 是全新文件，除队列页外无人 import → 对 QueueViz 与其余零影响。
- `Queue.vue` 仅**追加**一节：现有 `TC-VIEW-QUEUE-01`（Article+QueueViz 存在）、`TC-VIEW-QUEUE-02`（「队列」标题 + `.playground` 存在，`find` 取首个）**不受影响**——新节用 `.deque-viz` 作用域隔离、元素类 `.dqitem` 与 `.qitem` 区隔。
- 新增 `TC-VIEW-QUEUE-03`（队列页含 DequeViz）、`TC-E2E-QUEUE-02`（双端节 e2e，限定 `.deque-viz`）。
- 唯一回归点：`TC-E2E-QUEUE-01` 第 10 行 `page.locator('.playground').toBeVisible()` 在两个 Playground 下命中 2 个（严格模式）→ 改 `.first()`，断言意图不变（与 C-023/024/025 加第二件同款机械消歧）。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useDeque`（`TC-DEQUE-LOGIC-*`）：初始 [1,2,3]/front/back；pushBack/pushFront 落点；popFront/popBack 返回值；空判定/满判定；空 pop / 满 push 返 null；reset；栈=尾进尾出/队列=尾进头出 概念。
- **L4 互动** `TC-VIZ-DEQUEVIZ-*`：初始 3 dqitem + 5 按钮 + 头/尾标记；元素值；尾部入/头部入（4 dqitem + status 含尾/头 + 落点值）；头部出/尾部出（3 dqitem + status 含头/尾 + 端值）；出空后出队禁用 + empty-hint；重置回 3。
- **L4 视图** `TC-VIEW-QUEUE-03`：队列页含 `DequeViz`（findComponent）。
- **L5 e2e** `TC-E2E-QUEUE-02`：`/docs/queue` 限定 `.deque-viz`：初始 3 dqitem、头部入→4、尾部出→3、重置回 3。
