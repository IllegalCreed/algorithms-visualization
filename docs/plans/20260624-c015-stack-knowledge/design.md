# 设计：知识页通用骨架 + 栈 Stack 参考实现

> Status: verified
> Stable ID: C-20260624-015
> Owner: IllegalCreed
> Created: 2026-06-24
> Last reviewed: 2026-06-24
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

知识页是与「算法播放器」并列的**第二条内容线**。它不复用播放器，但沿用同一套新拟物视觉与「reactive + `<TransitionGroup>`」动画范式。三层：

```
src/views/Article/DataStructure/Stack.vue   （页面：手写正文 + 内嵌互动组件）
   │  <Article> … <Playground><StackViz/></Playground> …
   ▼
┌─ 排版骨架（presentational，所有知识页复用，src/components/article/）
│    Article.vue   限宽 + scoped 排版（slot）
│    Callout.vue   提示框（slot）
│    Playground.vue「亲手试试」外框（slot）
│
└─ 互动组件（src/components/structures/）
     StackViz.vue  ── 用 ── useStack.ts（reactive 栈逻辑，可单测）
```

**关键边界**：`article/` 与 `structures/` 是全新、自洽的一套，**不 import 也不被现有任何组件 import**（除新栈页）。播放器（`AlgorithmPlayer`/`usePlayer`/…）与 8 个排序**零改动**。

## 2. 排版骨架组件契约

### 2.1 `Article.vue`

- props：无；`<slot>` 透传页面正文。
- 渲染：`<article class="article"><slot/></article>`，限定 `max-width`（约 720px）居中、设阅读行高。
- scoped 样式给后代 `h1/h2/h3/p/ul/li/code/strong` 统一排版：`h2` 带绿色左边框；`code` 新拟物内凹芯片；`strong` 主题绿。作者在页面里直接写这些标签即获得风格。

### 2.2 `Callout.vue`

- props：无（或 `type?` 预留，本次仅默认态）；`<slot>` 放提示内容（可含 `<b>` 小标题）。
- 渲染：新拟物浮起卡片，承载「应用清单」「注意点」一类旁注。

### 2.3 `Playground.vue`

- props：`title?: string`（角标文案，默认「亲手试试」）；`<slot>` 放互动组件。
- 渲染：新拟物浮起卡片，左上角标签 + 内部居中容纳互动组件。把「这是一块可玩的区域」在视觉上框出来。

## 3. 栈逻辑 `useStack.ts`（纯逻辑，可单测）

```ts
export interface UseStack {
  items: Ref<[string, number][]>; // [稳定id, 值]；数组尾 = 栈顶；id 驱动 TransitionGroup
  top: ComputedRef<number | null>; // 栈顶值（空为 null）
  canPush: ComputedRef<boolean>; // size < MAX(8)
  canPop: ComputedRef<boolean>; // size > 0
  push(): number | null; // 压入递增序号，返回压入值；满 8 时不压入、返回 null
  pop(): number | null; // 弹出并返回栈顶值（空返回 null）
  peek(): number | null; // 返回栈顶值，不改变
  reset(): void; // 清空、seq 归零
}
export const STACK_MAX = 8;
export function useStack(): UseStack;
```

- `items` 用 `[id, value]`：每次 `push` 生成新的稳定 id（递增计数）、值为递增序号 seq；`pop` 删尾。稳定 id 让 `<TransitionGroup>` 正确做进出场（压入新元素进场、弹出旧元素出场，不误判为「同一个变了」）。
- 不变量：`canPush ⇔ size<8`；`canPop ⇔ size>0`；`peek` 不改 `items`；`pop` 后 `size` 减一且返回的是原栈顶；id 全程唯一。

## 4. 栈互动组件 `StackViz.vue`

### 4.1 结构与布局（含原型定下的两条硬约束）

```
.stack-viz (column, center)
 ├─ .toolbar      push / pop / peek / 重置（新拟物按钮；按 canPush/canPop 禁用）
 ├─ .stack-area   居中
 │   └─ .stack-col「坑」：固定宽 134px、min-height 280、内凹阴影、column-reverse、底部锚定
 │        <TransitionGroup>
 │          .item (position:relative) × n   ← 尾=栈顶=视觉最上
 │            .plate  值盘子（栈顶深绿 #4caf50 + 白字；其余 idle 浅绿 #8bd3a0）
 │            .arrow  「← 栈顶」绝对定位 left:100%（贴盘子右侧、漂坑外），仅栈顶 .item 显示
 │        空态：.empty-hint「栈为空」（坑宽不变）
 └─ .status       状态解说行（push/pop/peek 文案）
```

**硬约束 1——栈顶指针挂顶行**：`.arrow` 是栈顶 `.item` 的子元素、`position:absolute; left:100%`，永远贴在真正栈顶盘子右侧。**不**用独立的固定高度容器 + 手算 `translateY`（原型证明会算错位）。`v-for` 中 `index === items.length-1` 判定栈顶，给 `.item` 加 `is-top` 类驱动深绿盘 + 显 arrow。

**硬约束 2——坑定宽**：`.stack-col { width:134px }` 固定，空栈/满栈一致，杜绝 push 第一个时的宽度跳变（原型 bug 修复）。`overflow:visible` 让 arrow 漂出坑外。

### 4.2 交互与动画

- **push**：`useStack.push()` → `items` 尾部加 `[newId, seq]`。`<TransitionGroup>` 在 `column-reverse` 下让新元素从顶部进场（`pushin`：自上而下落入 + 轻微回弹）。`status`=「push：把 N 压到栈顶」。
- **pop**：`useStack.pop()` → 删尾。`<TransitionGroup>` 让原栈顶出场（`popout`：上移淡出）。`status`=「pop：弹出栈顶 N」。空时按钮禁用。
- **peek**：不改 `items`；栈顶盘子做一次缩放强调（Web Animations 或 CSS）。`status`=「peek：栈顶是 N（只看，不取走）」。
- **重置**：`useStack.reset()` 清空。`status`=「已重置」。
- 动画用 `<TransitionGroup name="stack">` + scoped keyframes（`.stack-enter-active/.stack-leave-active` 或自定义），与 `List.vue` 的 `<TransitionGroup>` 范式一致；**无 async 循环、无 delay()**——纯用户事件驱动。

### 4.3 视觉映射

| 元素       | 态             | 颜色                  |
| ---------- | -------------- | --------------------- |
| 栈顶盘子   | is-top         | 深绿 `#4caf50` + 白字 |
| 其余盘子   | idle           | 浅绿 `#8bd3a0`        |
| 「← 栈顶」 | 仅 is-top 显示 | 主题绿 `#42b883`      |
| 坑         | 容器           | 新拟物内凹（像凹槽）  |

## 5. 栈页 `Stack.vue` 正文大纲（以原型文案为基础）

```
<Article>
  <h1>栈 Stack</h1>
  <h2>什么是栈</h2>
  <p>只能在一端（栈顶）操作的线性表… push/pop/peek… 后进先出 LIFO</p>
  <Playground><StackViz/></Playground>           ← 读者亲手试
  <p>试试连压 1/2/3 再连弹两次：最先出来的是 3… push/pop 都 O(1)</p>
  <h2>栈在哪里用</h2>
  <p>函数调用栈：调用 push 栈帧、返回 pop…</p>
  <Callout>撤销操作 / 括号匹配 / 浏览器后退</Callout>
  <p>下一篇讲队列——和栈相反，先进先出 FIFO。</p>
</Article>
```

关键术语 `<strong>` 绿色高亮，`push`/`pop`/`peek`/`O(1)` 用 `<code>` 芯片。

## 6. 组件清单与改动面

| 文件                                        | 类型         | 改动                                                        |
| ------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `src/components/article/Article.vue`        | **新增**     | 限宽 + scoped 排版骨架                                      |
| `src/components/article/Callout.vue`        | **新增**     | 提示框                                                      |
| `src/components/article/Playground.vue`     | **新增**     | 「亲手试试」互动外框                                        |
| `src/components/structures/useStack.ts`     | **新增**     | 栈纯逻辑 composable                                         |
| `src/components/structures/StackViz.vue`    | **新增**     | 栈互动组件                                                  |
| `src/views/Article/DataStructure/Stack.vue` | 改（填空壳） | `<Article>` + 正文 + `<Playground><StackViz/></Playground>` |

**零改动**：路由 / 菜单 / 首页 / 图标 / 播放器 / 8 个排序 / 既有 viz 组件 / store。

## 7. 向后兼容论证

- `article/`、`structures/` 是全新目录、自洽组件；除新栈页外无人 import → 对现有任何页面/组件零影响。
- 不碰 `src/components/player/`、`src/components/{Bar,BarsView,List,Block,Arrow,...}.vue`、`src/algorithms/*`、`src/router`、`src/store` → 8 个排序与播放器全部现有 Case 逐字不变（由全门禁回归证明）。
- `Stack.vue` 由空壳变为有内容：此前无任何指向它的测试（空壳无测试）；新增 `TC-VIEW-STACK-*` 覆盖。

## 8. 测试策略（详见 test-cases.md）

- **L3** `useStack`（`TC-STACK-LOGIC-*`）：push 追加新 id+递增值、pop 删尾返回原栈顶、peek 不改栈返回栈顶、reset 清空、canPush 满 8 为假、canPop 空为假、id 唯一、top 计算正确。
- **L4 骨架**：`TC-VIZ-ARTICLE-*`（slot 渲染 + 容器类）、`TC-VIZ-CALLOUT-*`（slot 渲染）、`TC-VIZ-PLAYGROUND-*`（默认/自定义 title + slot）。
- **L4 互动**：`TC-VIZ-STACKVIZ-*`：初始空态（栈为空 + pop/peek 禁用）、push 增盘子、pop 减盘子、栈顶 is-top 标记落在尾元素、「← 栈顶」仅栈顶显示、满 8 禁 push、reset 清空、状态解说文案。
- **L4 视图**：`TC-VIEW-STACK-*`：栈页挂载渲染 `Article` + `StackViz`、含「栈」标题与正文、含 `Playground`。
- **L5 e2e** `TC-E2E-STACK-*`：导航 `/docs/stack`、push 三次见三盘、栈顶深绿 +「栈顶」指针在顶、pop 减少、空态、重置、视觉截图。
