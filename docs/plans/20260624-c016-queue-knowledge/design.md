# 设计：队列 Queue 知识页（横向车道 + 双端指针，复用知识页骨架）

> Status: verified
> Stable ID: C-20260624-016
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

队列页**复用** C-015 立起的知识页三层骨架，只在「互动件」层新增队列专属的逻辑与视图：

```
src/views/Article/DataStructure/Queue.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><QueueViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     QueueViz.vue  ── 用 ── useQueue.ts（reactive 队列逻辑，可单测）
```

`useStack`/`StackViz`（C-015）与 `useQueue`/`QueueViz`（本次）并列在 `structures/` 下，**互不依赖**。骨架（`article/`）零改动——本次正是验证它可复用。

## 2. 队列逻辑 `useQueue.ts`（纯逻辑，可单测）

```ts
export interface UseQueue {
  items: Ref<[string, number][]>; // [稳定id, 值]；index 0 = 队首，末位 = 队尾；id 驱动 TransitionGroup
  front: ComputedRef<number | null>; // 队首值（最旧；空为 null）
  canEnqueue: ComputedRef<boolean>; // size < QUEUE_MAX(6)
  canDequeue: ComputedRef<boolean>; // size > 0
  enqueue(): number | null; // 入队尾（push），返回入队值；满 6 时不入、返回 null
  dequeue(): number | null; // 出队首（shift），返回原队首值；空返回 null
  peek(): number | null; // 返回队首值，不改变
  reset(): void; // 清空、seq 归零
}
export const QUEUE_MAX = 6;
export function useQueue(): UseQueue;
```

- `enqueue` 用 `items.value.push([id, ++seq])`（加到末位=队尾）；`dequeue` 用 `items.value.shift()`（移除 index 0=队首）。
- `front` = `items[0]`（最旧）。**关键不变量**：`enqueue` 只加到队尾，**不改变 `front`**（除非原队列为空）——这是 FIFO 区别于栈 LIFO（`top`=最新）的本质。
- 稳定 id 让 `<TransitionGroup>` 正确做进出场 + FLIP 左移补位。

## 3. 队列互动组件 `QueueViz.vue`

### 3.1 结构与布局（横向 + 双端指针，含两条硬约束）

```
.queue-viz (column, center)
 ├─ .toolbar      enqueue / dequeue / peek / 重置（新拟物按钮；按 canEnqueue/canDequeue 禁用）
 ├─ .lane-wrap    居中
 │   └─ .lane「车道」：固定宽 472px、min-height 96、内凹阴影、flex-row、左对齐
 │        <TransitionGroup>
 │          .qitem (position:relative) × n   ← index 0=队首=最左；末位=队尾=最右
 │            .plate   值盘子（队首深绿 #4caf50 + 白字；其余 idle 浅绿 #8bd3a0）
 │            .markers（盘子下方）
 │              .m-front 「↑队首」  仅 is-front(index 0) 显示
 │              .m-rear  「↑队尾」  仅 is-rear(末位) 显示
 │        空态：.empty-hint「队列为空」（车道宽不变）
 └─ .status       状态解说行
```

**硬约束 1——双指针挂端元素**：`.m-front`/`.m-rear` 是对应端 `.qitem` 的子元素（绝对定位于盘子下方），跟着元素走。`v-for` 中 `index===0` → `is-front`、`index===n-1` → `is-rear`。单元素时两类同时命中 → 队首/队尾两行都显示。**不**手算位置。

**硬约束 2——车道定宽**：`.lane { width:472px }` 固定，空/满一致，杜绝入队第一个时的宽度跳变。

### 3.2 交互与动画

- **enqueue**：`useQueue.enqueue()` → `items` 末位加 `[newId, seq]`。`<TransitionGroup>` 让新元素从右滑入（`enterRight`）。`status`=「enqueue：N 从队尾入队」。
- **dequeue**：`useQueue.dequeue()` → 删 index 0。原队首从左滑出（`leaveLeft`），其余元素 **FLIP 左移补位**（`<TransitionGroup>` 自动）。`status`=「dequeue：队首 N 出队」。
- **peek**：不改 `items`；队首盘子缩放强调。`status`=「peek：队首是 N（只看，不拿走）」。
- **重置**：清空。`status`=「已重置」。
- 动画 `<TransitionGroup name="queue">` + scoped keyframes（enter 从右、leave 向左、move FLIP），与 `List.vue`/`StackViz` 同范式；纯用户事件驱动，无 async。

### 3.3 视觉映射

| 元素      | 态                 | 颜色                  |
| --------- | ------------------ | --------------------- |
| 队首盘子  | is-front (index 0) | 深绿 `#4caf50` + 白字 |
| 其余盘子  | idle               | 浅绿 `#8bd3a0`        |
| 「↑队首」 | 仅 is-front 显示   | 深绿 `#4caf50`        |
| 「↑队尾」 | 仅 is-rear 显示    | 主题绿 `#42b883`      |
| 车道      | 容器               | 新拟物内凹            |

## 4. 队列页 `Queue.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>队列 Queue</h1>
  <h2>什么是队列</h2>
  <p>两端各管一件事：队尾只进、队首只出…enqueue/dequeue/peek…先进先出 FIFO</p>
  <Playground><QueueViz/></Playground>           ← 读者亲手试
  <p>连入 1/2/3 再连出：最先出来的是 1。与栈对比：栈先吐 3、队列先吐 1。均 O(1)</p>
  <h2>队列在哪里用</h2>
  <p>按到达顺序处理…</p>
  <Callout>消息队列/任务调度 · BFS · 打印/缓冲区</Callout>
  <p>下一篇讲树——有层次的非线性结构。</p>
</Article>
```

关键术语 `<strong>` 绿色高亮，`enqueue`/`dequeue`/`peek`/`O(1)` 用 `<code>` 芯片。

## 5. 组件清单与改动面

| 文件                                        | 类型         | 改动                                                        |
| ------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `src/components/structures/useQueue.ts`     | **新增**     | 队列纯逻辑 composable                                       |
| `src/components/structures/QueueViz.vue`    | **新增**     | 队列互动组件（横向 + 双指针）                               |
| `src/views/Article/DataStructure/Queue.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><QueueViz/></Playground>` |

**零改动**：`article/` 骨架 / `structures/useStack*` / 路由 / 菜单 / 首页 / 图标 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useQueue`/`QueueViz` 是 `structures/` 下全新文件，除队列页外无人 import → 对栈、骨架、排序、播放器零影响。
- `article/` 骨架原样复用、零改动 → C-015 的 `TC-VIZ-ARTICLE/CALLOUT/PLAYGROUND-*` 逐字不变（由全门禁回归证明）。
- `Queue.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-QUEUE-*` 覆盖。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useQueue`（`TC-QUEUE-LOGIC-*`）：enqueue 追加新 id+递增值且 front 不变（非空时）、dequeue 删首返回原队首、peek 不改、reset 清空、canEnqueue 满 6 为假、canDequeue 空为假、id 唯一、front 计算正确。
- **L4 互动**：`TC-VIZ-QUEUEVIZ-*`：初始空态（队列为空 + dequeue/peek 禁用）、enqueue 增元素、dequeue 减元素（移队首）、队首 is-front 落在 index 0、队尾 is-rear 落在末位、队首/队尾 marker 节点存在、满 6 禁 enqueue、reset 清空、状态解说。
- **L4 视图**：`TC-VIEW-QUEUE-*`：队列页挂载渲染 `Article` + `QueueViz`、含「队列」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-QUEUE-*`：导航 `/docs/queue`、enqueue 三次见三元素、队首深绿 + 双指针、dequeue 移队首（1 出、2 成队首）、空态、重置。
