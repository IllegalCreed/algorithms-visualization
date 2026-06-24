# 设计：数组 Array 知识页（贴合格 + 固定下标行 + 槽位指针，复用知识页骨架）

> Status: verified
> Stable ID: C-20260624-017
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

数组页**复用** C-015 立起的知识页三层骨架，只在「互动件」层新增数组专属的逻辑与视图：

```
src/views/Article/DataStructure/Array.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><ArrayViz/></Playground> …
   ▼
┌─ 排版骨架（复用 C-015，零改动）：Article / Callout / Playground
└─ 互动组件（src/components/structures/，新增）
     ArrayViz.vue  ── 用 ── useArray.ts（reactive 数组逻辑 + 选中态，可单测）
```

`useStack`/`StackViz`（C-015）、`useQueue`/`QueueViz`（C-016）、`useArray`/`ArrayViz`（本次）三组并列在 `structures/` 下，**互不依赖**。骨架（`article/`）零改动。

## 2. 数组逻辑 `useArray.ts`（纯逻辑 + 选中态，可单测）

```ts
export const ARRAY_MAX = 8;
export interface UseArray {
  items: Ref<[string, number][]>; // [稳定id, 值]；index = 位置；id 驱动 TransitionGroup
  selected: Ref<number | null>; // 当前选中下标（null = 未选）
  hasSelection: ComputedRef<boolean>; // selected != null（访问/删除可用）
  canInsert: ComputedRef<boolean>; // hasSelection && size < ARRAY_MAX
  canAppend: ComputedRef<boolean>; // size < ARRAY_MAX
  select(i: number): void; // 点选下标；再点同一格则取消（toggle）
  valueAt(i: number): number | null; // 按下标读值（O(1)）；越界返回 null
  insert(): number | null; // 在 selected 处插入 ++seq、i 起右移；保持选中落在新元素；!canInsert 返回 null
  remove(): number | null; // 删除 selected、后续左移；清空选中；无选中返回 null
  append(): number | null; // 尾部追加 ++seq；满返回 null
  reset(): void; // 复位为 [1,2,3,4]、seq=4、清空选中
}
export function useArray(): UseArray;
```

- 初始：`items = [1,2,3,4]`（带稳定 id），`seq = 4`（下一个插入/追加值 = `++seq` = 5）。
- `insert` 用 `items.value.splice(selected, 0, [id, ++seq])`（在 i 处插入、i 起整体右移一格），插完 `selected` 仍 = 该下标（现在指向新元素）。
- `remove` 用 `items.value.splice(selected, 1)`（删 i、后续左移一格），删完 `selected = null`。
- `append` 用 `items.value.push([id, ++seq])`（尾插、谁也不动）。
- `valueAt(i)` = `items[i]?.[1] ?? null`（纯读，对应「随机访问」）。
- `select(i)`：`selected = selected === i ? null : i`（toggle）。
- **关键不变量**：`insert`/`remove` 之外，下标只是数组位置；插入后**值与下标不再相等**（如 `[1,2,5,3,4]`），这是数组区别于「下标即序号」直觉的本质认知点。
- 稳定 id 让 `<TransitionGroup>` 正确做进出场 + FLIP 搬移。

## 3. 数组互动组件 `ArrayViz.vue`

### 3.1 结构与布局（贴合格 + 固定下标行 + 槽位指针，含两条硬约束）

```
.array-viz (column, center)
 ├─ .toolbar   访问 a[i] / 在 i 处插入 / 删除 a[i] / 尾部追加 / 重置
 │             （新拟物按钮；按 hasSelection/canInsert/canAppend 禁用 + 动态显当前 i）
 ├─ .lane-wrap   居中
 │   └─ .lane「车道」：固定宽 448px、内凹阴影、position:relative
 │        .stack (column)
 │          <TransitionGroup class="cells">      ← 值行：贴合格、左对齐、FLIP 搬移
 │            .cell (relative) × n   ← index i=位置；点选 → is-selected
 │               值（选中深绿白字 / idle 浅绿深绿字）
 │          .indices (row)                        ← 下标行：固定、不随值走
 │            .slot × n   ← .ptr「↑」(仅 i===selected 显示) + .num「i」
 │        空态：.empty-hint「数组为空」（车道宽不变）
 └─ .status      状态解说行
```

**硬约束 1——`↑i` 指针挂槽位（位置而非值）**：下标行 `.indices` 是独立于 `<TransitionGroup>` 的普通 `v-for(0..n-1)`，**不参与 FLIP**。`↑` 指针是第 `i` 个 `.slot` 的子元素，靠 flex 对齐自动定位在第 i 列下方，**不手算坐标**。插入/删除时值在 `.cells` 里 FLIP 滑动、下标行瞬时重排，于是肉眼看到「值滑过固定的槽位格」——正是数组「值搬移、地址不动」的本质。

**硬约束 2——车道定宽**：`.lane { width:448px }` 固定，空/满一致，杜绝加第一个元素时的宽度跳变。

**值行与下标行对齐**：`.cells` 与 `.indices` 同为 flex-row、同 `gap:2px`、同 `.cell/.slot` 宽 50px、同左对齐 → 第 i 个值与第 i 个下标天然列对齐（flex 排版，无像素计算）。

### 3.2 交互与动画

- **点选**：点 `.cell` → `useArray.select(i)`。选中格变深绿、对应 `.slot` 显 `↑`。再点同格取消。`status` 提示当前选中。
- **访问 access**：`valueAt(selected)` → 选中格播放一次性 `flash`（放大 + 高亮，不改布局、与 FLIP 无冲突）。`status`=「access：按下标直达 a[i]=N，O(1)」。
- **插入 insert**：`useArray.insert()` → `items` 在 i 处加 `[newId,seq]`。`<TransitionGroup>` 让新元素从右滑入（enter）、下标 i 起的旧元素 **FLIP 右移腾位**。选中落在新元素。`status`=「insert：在下标 i 放入 N，i 起 k 个元素右移腾位，O(n)」。
- **删除 remove**：`useArray.remove()` → 删 index i。目标元素离场（leave，position:absolute）、后续元素 **FLIP 左移补位**。清空选中。`status`=「delete：移除 a[i]=N，后面 k 个元素左移补位，O(n)」。
- **尾部追加 append**：`useArray.append()` → 末位加元素，从右滑入，其余不动。`status`=「尾部追加：末尾放入 N，无需搬移，O(1)」。
- **重置 reset**：复位 `[1,2,3,4]`、清选中。`status`=「已重置 …」。
- 动画 `<TransitionGroup name="array">` + scoped keyframes（enter 从右、leave 缩淡、move FLIP），与 `List.vue`/`QueueViz` 同范式；纯用户事件驱动，无 async。

### 3.3 视觉映射

| 元素     | 态                   | 颜色 / 处理                                  |
| -------- | -------------------- | -------------------------------------------- |
| 选中格   | is-selected          | 深绿 `#4caf50` + 白字 + 阴影环（**不位移**） |
| 其余格   | idle                 | 浅绿 `#8bd3a0` + 深绿字 `#1f5e3a`            |
| 访问瞬间 | flash（一次性）      | 放大 + 高亮脉冲                              |
| `↑` 指针 | 仅 i===selected 槽位 | 深绿 `#4caf50`                               |
| 下标数字 | idle / 选中          | 灰 `#999` / 深绿 `#4caf50`                   |
| 车道     | 容器                 | 新拟物内凹                                   |

> 注：选中态**不用 transform 位移**（原型的 `translateY` 上浮会与 FLIP 的 move-transform 冲突，搬移时选中格抖动）；改用配色 + 阴影环 + 指针表达选中。`flash` 用 transform 但只在 access 时一次性触发、不引起布局搬移，无冲突。

## 4. 数组页 `Array.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>数组 Array</h1>
  <p class="sub">数据结构 · 连续内存里的带下标序列</p>
  <h2>什么是数组</h2>
  <p>连续内存 + 从 0 起的下标；按下标随机访问 O(1)…</p>
  <p>代价：中间插入要右移腾位、删除要左移补位，都是 O(n)。点格子选下标再操作。</p>
  <Playground><ArrayViz/></Playground>           ← 读者亲手试
  <p>访问瞬时；插入看右移、删除看左移、尾部追加 O(1)；插几次后下标≠值。</p>
  <h2>数组在哪里用</h2>
  <Callout>查表/缓冲区 · 矩阵/像素 · 其它结构的底座</Callout>
  <p>下一篇讲链表——用指针串元素，增删只改指针不搬移，与数组互为镜像。</p>
</Article>
```

关键术语 `<strong>` 绿色高亮，`O(1)`/`O(n)`/`enqueue` 类用 `<code>` 芯片。

## 5. 组件清单与改动面

| 文件                                        | 类型         | 改动                                                        |
| ------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `src/components/structures/useArray.ts`     | **新增**     | 数组纯逻辑 composable（含选中态）                           |
| `src/components/structures/ArrayViz.vue`    | **新增**     | 数组互动组件（贴合格 + 固定下标行 + 槽位指针）              |
| `src/views/Article/DataStructure/Array.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><ArrayViz/></Playground>` |
| `src/views/Article/DataStructure/Queue.vue` | 改（一句）   | 结尾引子改为承接数组/链表（不影响 queue 测试断言）          |

**零改动**：`article/` 骨架 / `structures/useStack*` / `structures/useQueue*` / 路由 / 菜单 / 首页 / 图标 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useArray`/`ArrayViz` 是 `structures/` 下全新文件，除数组页外无人 import → 对栈、队列、骨架、排序、播放器零影响。
- `article/` 骨架原样复用、零改动 → C-015 的 `TC-VIZ-ARTICLE/CALLOUT/PLAYGROUND-*` 逐字不变（由全门禁回归证明）。
- `Array.vue` 由空壳变为有内容：此前无指向它的测试；新增 `TC-VIEW-ARRAY-*` 覆盖。
- `Queue.vue` 仅改结尾一句**正文措辞**：现有 `TC-VIEW-QUEUE-*` 只断言「队列」标题与 `Playground` 存在、`TC-E2E-QUEUE-*` 只断言 enqueue/dequeue 行为，**均不断言被改的那句**（实现期先 grep 确认）→ 零回归。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useArray`（`TC-ARRAY-LOGIC-*`）：初始 `[1,2,3,4]`/seq；`valueAt` 按下标读 + 越界 null；`select` toggle；`insert` 在 i 处插入递增值且 i 起右移、保持选中落新元素、下标≠值；`remove` 删 i 后续左移、清空选中；`append` 尾插不动选中；`hasSelection`/`canInsert`(满)/`canAppend`(满) 切换；id 唯一；`reset` 复位。
- **L4 互动** `TC-VIZ-ARRAYVIZ-*`：初始 4 格 + 下标 0..3 + 无选中禁访问/插入/删除；点格选中（is-selected + ↑ 槽位指针 + 启用）；insert 增元素且新值落 i、下标行增到 n；remove 减元素移 i；append 尾增；下标行渲染 0..n-1；满 8 禁插入/追加；access 触发 flash/解说；reset 复位。
- **L4 视图** `TC-VIEW-ARRAY-*`：数组页挂载渲染 `Article` + `ArrayViz`、含「数组」标题、含 `Playground`。
- **L5 e2e** `TC-E2E-ARRAY-*`：导航 `/docs/array`、见正文 + Playground；限定 `.array-viz`：初始 4 格、点下标 2 选中（深绿 + ↑）、insert 见 5 格且下标 2=「5」/下标 3=「3」、append 见 6 格、reset 回 4 格。
