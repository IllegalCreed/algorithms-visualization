# 设计：交互式算法播放器

> Status: draft
> Stable ID: C-20260619-006
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-19
> Last reviewed: 2026-06-19
> Progress: 0%
> Blocked by: none
> Next action: 用户审 spec → writing-plans
> Replaces: none
> Replaced by: none
> Related plans: C-20260618-003
> Related tests: 见 §8「对现有测试的影响」
> Related requirement: requirements.md

## 总体方案

**通用外壳 + 算法插件**，二者唯一的契约是一个**预计算的"胖步骤"轨迹**（`Step[]`）。算法一次性把整个执行过程展开成步骤数组，每个 `Step` 自带"渲染所需的一切"（数组快照、指针、变量快照、当前执行点）。外壳（播放器）只做一件事：**按当前下标 `index` 把 `steps[index]` 渲染出来**。

由此，用户要的所有交互都退化为"移动下标"：

| 交互            | 实现                             |
| --------------- | -------------------------------- |
| 播放            | 定时 `index++`，到末步自动暂停   |
| 暂停            | 清掉定时器                       |
| 单步前进 / 后退 | `index++` / `index--`            |
| 拖动进度条      | `index = 任意值`                 |
| 重置            | `index = 0`                      |
| 看变量 / 高亮行 | 都从 `steps[index]` 读，天然同步 |

没有异步 `delay`、没有竞态，单步与后退"免费"获得。这是相对现状（`async doSort()` + `await delay` 命令式）的关键转变。

布局：**可视化整宽在上，代码面板（左）+ 变量面板（右）在下，传输控制条贴底**。

## 1. 核心数据契约

新增 `src/components/player/types.ts`：

```ts
export type Lang = 'ts' | 'python' | 'go' | 'rust';

// 执行点：源码里语义上的一个位置，用于跨语言定位"当前高亮行"
export type ExecPoint =
  | 'outerLoop' // 外层循环头
  | 'innerLoop' // 内层循环头
  | 'compare' // 比较 a[j] 与 a[j+1]
  | 'swap' // 发生交换
  | 'noSwap' // 条件不成立、不交换
  | 'done'; // 排序完成

export interface VarRow {
  name: string; // "j" / "a[j]" / "swapped" ...
  value: string | number | boolean;
}

// 复用 src/types/types.ts 的 Pointer：{ id: string; index: number }
import type { Pointer } from '@/types/types';

export interface Step {
  array: [string, number][]; // 当前数组快照；[0]=稳定 key（驱动柱子 FLIP），[1]=值
  pointers: Pointer[]; // 指针箭头（冒泡里是 i、j）
  emphasis: {
    comparing?: [number, number]; // 正在比较的两个下标
    swapped?: boolean; // 本步是否交换
    sortedFrom?: number; // 已排序边界：该下标起已就位
  };
  vars: VarRow[]; // 变量面板按顺序渲染
  point: ExecPoint; // 当前执行点 → 经 lineMap 查每语言行号
  caption?: string; // 解说，如 "10 > 9，交换"
}

export interface LangSource {
  lang: Lang;
  label: string; // Tab 文案，如 "TypeScript"
  code: string; // 该语言完整源码（静态字符串）
  lineMap: Record<ExecPoint, number>; // 执行点 → 1-based 行号
}

export interface AlgorithmModule {
  title: string;
  initialInput(): number[];
  buildSteps(input: number[]): Step[];
  sources: LangSource[];
}
```

> **扩展心智**：加一门语言 = 写一份 `code` + 填一张 `lineMap`；加一个算法 = 实现一个 `AlgorithmModule`。外壳不动。

## 2. 目录与组件结构

```
src/components/player/            ← 新增：通用播放器外壳
  AlgorithmPlayer.vue             外壳：布局 + 装配，输入一个 AlgorithmModule
  TransportControls.vue           播放/暂停/单步/重置/速度/进度条
  CodePanel.vue                   语言 Tab + Shiki 只读高亮 + 当前行高亮
  VariablePanel.vue               渲染 currentStep.vars，变化高亮
  usePlayer.ts                    传输状态机（唯一真相源）
  useHighlighter.ts               Shiki 细粒度封装 + 源码高亮缓存
  types.ts                        上面的契约

src/components/
  BarsView.vue                    新增：柱状条可视化（高度=值 + 顶部数值 + 高亮）
  Bar.vue                         新增：单根柱子
  ArrowTrack.vue / Arrow.vue      复用；ArrowTrack 把固定 60px 间距参数化（默认 60）
  List.vue / Block.vue            保留不动（通用原语，BubbleSort 不再用）

src/algorithms/
  bubble-sort.ts                  保持不动（仍作正确性 oracle）
  bubble-sort.module.ts           新增：冒泡的 AlgorithmModule（buildSteps 插桩重走 + sources）
  bubble-sort.sources.ts          新增：TS/Python/Go/Rust 四份源码 + lineMap

src/views/Article/SortAlgorithm/
  BubbleSort.vue                  瘦身：引入 bubbleSortModule → <AlgorithmPlayer>
```

各单元单一职责、通过 props/事件通信，可独立测试。

## 3. 传输状态机 `usePlayer`

```ts
export interface UsePlayerOptions {
  baseDelayMs?: number; // 1× 时每步间隔，默认 800
  initialSpeed?: number; // 默认 1
}

export function usePlayer(steps: Step[], opts?: UsePlayerOptions) {
  // state
  const index = ref(0); // 当前步，初始 0
  const isPlaying = ref(false); // 初始 false → 默认暂停
  const speed = ref(opts?.initialSpeed ?? 1);
  // derived
  const total = computed(() => steps.length);
  const current = computed(() => steps[index.value]);
  const atStart = computed(() => index.value <= 0);
  const atEnd = computed(() => index.value >= steps.length - 1);
  // actions
  function play() {
    /* 起定时器：每 baseDelayMs/speed 推进一步；atEnd 自动 pause */
  }
  function pause() {
    /* 清定时器 */
  }
  function toggle() {}
  function stepForward() {
    pause();
    if (!atEnd.value) index.value++;
  }
  function stepBackward() {
    pause();
    if (!atStart.value) index.value--;
  }
  function seek(i: number) {
    pause();
    index.value = clamp(i, 0, total - 1);
  }
  function reset() {
    pause();
    index.value = 0;
  }
  function setSpeed(s: number) {
    /* 改 speed；若在播放则按新速率重起定时器 */
  }
  onUnmounted(pause); // 清理
  return {
    index,
    isPlaying,
    speed,
    total,
    current,
    atStart,
    atEnd,
    play,
    pause,
    toggle,
    stepForward,
    stepBackward,
    seek,
    reset,
    setSpeed,
  };
}
```

定时器用 `setTimeout` 递归（每次按 `baseDelayMs/speed` 排下一步），便于改速 / 暂停时精确控制；播放到 `atEnd` 自动 `pause()`。

## 4. 代码视图与高亮（Shiki）

`useHighlighter.ts`：

- 用 `createHighlighterCore`（`shiki/core`）+ `createJavaScriptRegexEngine`（`shiki/engine/javascript`），**只**按需引入 `ts/python/go/rust` 四门语法 + 两套主题（明 / 暗，如 `github-light` / `github-dark`）。
- 暴露 `highlightToLines(code, lang)`：用 `codeToTokens` 得到**逐行 token 结构**，缓存（按 `lang` + 主题 memo，静态源码只算一次）。
- 初始化是异步：未就绪时 `CodePanel` 先渲染无高亮的等宽 `<pre>` 占位，就绪后替换。

`CodePanel.vue`：

- 顶部语言 Tab（`AlgorithmModule.sources` 驱动）。
- 主体把"逐行 token"渲染成一行一个 `.code-line`（带行号）。
- **当前行高亮**：`activeLine = sources[lang].lineMap[player.current.point]`，给该 `.code-line` 加反应式 `.is-active` class（底色）。源码较长时 `scrollIntoView` 把当前行滚入可视区（冒泡很短，通常无需）。
- 主题随 `useSystemStore().isDarkMode` 切换（持有明 / 暗两套已缓存结果，切 class 即可）。

> 选 Shiki 而非 highlight.js 的理由见 requirements 与 brainstorming 记录：静态源码 → 零运行时成本；`codeToTokens` 逐行结构让"当前行高亮"比 highlight.js 的扁平 HTML 更干净；VS Code 同款主题可联动 `isDarkMode`。代价：异步初始化 + 细粒度 bundle 装配；JS 正则引擎对极个别 Oniguruma 特性不支持（四门主流语言无碍，必要时 `forgiving: true` 或预编译语法包 `@shikijs/langs-precompiled`）。

## 5. 变量面板 `VariablePanel`

- 输入 `current.vars: VarRow[]`，按顺序渲染 `name : value` 行。
- 与"上一步" `steps[index-1].vars` 逐项比对，值变化的行加高亮 class（短暂或持续）。
- 冒泡的变量集：`pass`（轮次）、`i`、`j`、`a[j]`、`a[j+1]`、`比较结果`、`swapped`、`交换计数`、`已排序边界`。

## 6. 冒泡排序可视化 `BarsView`

- props：`array: [string,number][]`、`pointers: Pointer[]`、`emphasis`。
- 柱高按值归一化（复用现有 min→max 归一思路，最小值给一个非零基准高度避免"看不见"）。
- 每根 `Bar` 顶部标数值；柱体配色随状态：默认 / `comparing`（强调）/ `swapped`（瞬时高亮）/ `sortedFrom` 之后（已就位色）。新拟物风沿用 `common.less` 的 `.neumorphism-*` 混入。
- `<TransitionGroup>` + 稳定 key（`array[i][0]`）→ 交换走 FLIP 平滑动画（沿用现 `List` 的成功范式）。
- 指针复用 `ArrowTrack`/`Arrow`，箭头 x 与柱中心对齐：`ArrowTrack` 增加可选 `slotWidth` prop（默认 60，保持 `TC-VIZ-ARROWTRACK-01` 绿），`BarsView` 与之共用同一槽宽。

## 7. 冒泡算法模块

- `bubble-sort.ts`：**保持不动**——`bubbleSortSteps` 继续作为已测的"正确性 oracle"，TC-ALGO-\* 完全不受影响。
- `bubble-sort.module.ts`：`buildSteps(input)` **自带插桩地重走一遍冒泡**，不复用 `bubbleSortSteps` 的"一次比较一步"粒度。这样才能把"进外层循环 / 进内层循环 / 比较 / 交换 or 不交换 / 完成"拆成**各自独立**的 fat step，从而做到**逐行高亮**（这是"看运行到哪行"的关键，1:1 复用做不到）。每个 fat step 富化：
  - `point` ← 插桩位置直接给（`outerLoop`/`innerLoop`/`compare`/`swap`/`noSwap`/`done`），天然保证落在四语言 `lineMap` 有定义的执行点上；
  - `pointers` ← 当前 i / j 两下标（id 用 `'0'`/`'1'`，对应 store `colors[0]`/`colors[1]`）；
  - `emphasis` ← `comparing`=当前比较对、`swapped`=本步是否交换、`sortedFrom`=已排序边界；
  - `vars` ← `pass / i / j / a[j] / a[j+1] / 比较结果 / swapped / 交换计数 / 边界`；
  - `caption` ← 如 `"10 > 9，交换"`。
- **防漂移**：buildSteps 与 oracle 是同一标准冒泡的两份实现；L3 用 `bubbleSortSteps(input).at(-1)` 的最终数组**交叉校验** buildSteps 末步，把正确性锚回已测 oracle。
- 步骤粒度（外层 / 内层 / 比较 / 交换 各成一步）是 buildSteps 的内部决策；总步数随之变多属预期（换来逐行可读）。
- `bubble-sort.sources.ts`：四份等价源码 + 各自 `lineMap`。

`BubbleSort.vue` 瘦身为：

```vue
<script setup lang="ts">
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
</script>
<template>
  <AlgorithmPlayer :module="bubbleSortModule" />
</template>
```

## 8. 对现有测试的影响

| 现有 Case                                   | 影响                            | 处理                                                                                                                                     |
| ------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| TC-ALGO-01..06（L3，`bubble-sort.spec.ts`） | `bubble-sort.ts` 保持不动       | **完全不受影响**（仍作 buildSteps 的正确性 oracle）                                                                                      |
| TC-VIZ-ARROWTRACK-01（L4）                  | 断言 `translateX(120px)`=2×60   | `slotWidth` 默认 60 → 保持绿                                                                                                             |
| TC-VIZ-LIST/BLOCK-\*（L4）                  | List/Block 保留不动             | 不受影响                                                                                                                                 |
| **TC-VIEW-BUBBLE-01/02（L4）**              | 断言渲染 `List` + `.expression` | **必然失效**：BubbleSort 改渲染 `AlgorithmPlayer` + 柱状条。标 `superseded`，改写为断言"渲染 AlgorithmPlayer / 柱子数=10 / 代码面板存在" |
| **TC-E2E-BUBBLE-01（L5）**                  | 等自动动画跑完再断言升序        | **必然失效**：默认暂停。改写为"点播放（或快进到末步）→ 断言升序"                                                                         |

新增 Case（详单留 writing-plans / `test-cases.md`）：

- L3：`usePlayer` 状态机（边界：首步不能后退 / 末步不能前进 / `seek` 越界夹紧 / `reset` / 播放到末步自动暂停）；`buildSteps` 富化正确 + **每个出现的 `ExecPoint` 在四语言 `lineMap` 都有合法行号**；变量快照正确。
- L4：`CodePanel`（给定 step 高亮正确行、Tab 切换）；`VariablePanel`（渲染 vars、变化高亮）；`TransportControls`（按钮派发事件、禁用态）；`BarsView`（柱高 / 数值 / 状态色）。
- L5：进冒泡页默认停在第 0 步 → 单步 → 断言高亮行 + 变量随步变 → 暂停 / 继续 → 重置回 0 → 播放到末断言升序。

## 9. 推进顺序（建议）

① 契约 `types.ts` + `usePlayer`（纯逻辑，先 L3）→ ② `useHighlighter` + `CodePanel` → ③ `BarsView`/`Bar` + `ArrowTrack` 参数化 → ④ `VariablePanel` + `TransportControls` → ⑤ `AlgorithmPlayer` 装配 → ⑥ 冒泡模块 `bubble-sort.module/sources` + `BubbleSort.vue` 接入 → ⑦ 改写受影响测试 + 补新测试 + 索引回写。每步以 `type-check` + 对应测试绿为关卡。

## 10. 风险与回滚

- **Shiki bundle / 异步初始化**：细粒度 + JS 引擎 + 随算法页懒加载控体积；未就绪有 `<pre>` 占位，不阻塞首屏。真踩到体积问题可换预编译语法包。
- **多语言 `lineMap` 与源码漂移**：源码一改、行号即错。用 L3 校验"每个 `ExecPoint` 行号合法"兜底；`lineMap` 与 `code` 同文件相邻，改时一起改。
- **可视化重做影响范围**：改动隔离在新增组件 + `BubbleSort.vue`；`List/Block` 不动可独立回滚；受影响的两个 Case 有明确改写口径。
- **框架过度设计**：本变更只接冒泡一个算法验证，不为树 / 图预设抽象（YAGNI）；`AlgorithmModule` 仅覆盖"线性数组 + 指针"类，后续按需扩展。
