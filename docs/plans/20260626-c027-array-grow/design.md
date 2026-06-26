# 设计：数组·扩容（翻倍扩容 + 摊还分析均摊 O(1)，数组页加节）

> Status: verified
> Stable ID: C-20260626-027
> Owner: IllegalCreed
> Created: 2026-06-26
> Last reviewed: 2026-06-26
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览

```
src/views/Article/DataStructure/Array.vue   （现有页，下标搬移正文后加一节）
   │  … <Playground><ArrayViz/></Playground> …           ← C-017 既有静态数组，不动
   │  <h2>动态数组：容量满了怎么办——翻倍扩容</h2> 正文
   │  <Playground><ArrayGrowViz/></Playground>           ← 新增
   ▼
└─ 互动组件（src/components/structures/，新增）
     ArrayGrowViz.vue  ── 用 ── useGrow.ts（定容数组 + 翻倍扩容 + 均摊统计，可单测）
```

`ArrayViz`（C-017，静态数组）与 `ArrayGrowViz`（本次，动态扩容）并列在数组页，互不依赖。骨架、ArrayViz、useArray 零改动。元素类名 `.gcell` 与数组 `.cell` 区隔（同页共存）。

## 2. 扩容逻辑 `useGrow.ts`（定容数组 + 翻倍扩容 + 均摊统计，可单测）

```ts
export const GROW_INIT_CAP = 4;

export interface AppendResult {
  value: number;
  grew: boolean; // 是否触发扩容
  copies: number; // 本次扩容拷贝的元素数（grew 时 = 旧 length，否则 0）
  capacity: number; // 操作后容量
}
export interface UseGrow {
  items: Ref<[string, number][]>; // 已用元素
  capacity: Ref<number>; // 当前容量
  length: ComputedRef<number>;
  appends: Ref<number>; // 累计 append 次数
  totalCopies: Ref<number>; // 累计拷贝次数
  amortized: ComputedRef<number>; // (appends + totalCopies) / appends，append 0 时 0
  append: () => AppendResult;
  reset: () => void;
}
```

- 初始 `capacity=4`、`[1,2,3]`（长度 3，留 1 空位：先演 O(1) 直放、再演满了扩容）；`seq` 起于 3。
- `append()`：
  - `v = ++seq`；若 `length === capacity` → `capacity *= 2`、`copies = 旧 length`、`grew = true`（翻倍 + 拷贝全部旧元素）；否则 `copies = 0`、`grew = false`；
  - `items.push([id, v])`；`appends++`；`totalCopies += copies`；返回 `{value, grew, copies, capacity}`。
- `amortized`：`appends===0 ? 0 : (appends + totalCopies) / appends`——每次 append 成本 = 放入 1 + 扩容拷贝 copies；总功 = `appends + totalCopies`，除以次数 = 每次均摊。翻倍使 `totalCopies ≈ n`、`appends = n`，**均摊 ≈ 常数（≤3）= O(1)**。
- `reset()`：`capacity=4`、`[1,2,3]`、`seq=3`、`appends=0`、`totalCopies=0`。
- **关键不变量**：扩容单次 O(n)，但翻倍让扩容**指数级稀疏**，均摊读数始终有界——这就是「尾部追加均摊 O(1)」的可测证据。

> 注：`items`/`capacity`/计数用 `ref`，`append`/`reset` 同步改它们并同步返回结果；`amortized`/`length` 计算属性；扩容拷贝高亮动画由 ArrayGrowViz 用 setTimeout 驱动（同步数据 + 延时高亮，L4 可断言）。

## 3. 扩容互动组件 `ArrayGrowViz.vue`

### 3.1 结构与布局

```
.array-grow-viz (column, center)
 ├─ .toolbar   追加（append）/ 重置
 ├─ .lane-wrap   居中
 │   └─ .lane「格阵」：v-for 容量个 .gcell
 │        .gcell.filled（已用，浅绿，显值）/ 预留（虚框，空）
 │        .gcell.copying（扩容那次旧元素拷贝高亮，黄）
 ├─ .readout   长度 N / 容量 M（满时高亮提示）
 ├─ .stats     append N 次 · 总拷贝 K · 均摊 X 次/append（≈ O(1)）
 └─ .status    状态解说行
```

### 3.2 交互与动画

- **追加 append**：`r = g.append()`（**同步**改 items/capacity/计数）→ 同步置 status——
  - 未满：`还有空位：直接把 v 放到末尾，O(1)。`
  - 扩容：`容量满了！开一个 2 倍的新数组（容量 r.capacity），把 r.copies 个元素逐个拷过去（O(n)），再放入 v。这次贵，但很少发生。` → `copying=true`（旧 filled 格高亮黄）→ setTimeout 清除。
- **重置**：`clearTimeout` + `copying=false` + `g.reset()` + status。
- 结果同步、L4 可断言；拷贝高亮延时（卸载清理）。

### 3.3 视觉映射

| 元素     | 态      | 颜色 / 处理                      |
| -------- | ------- | -------------------------------- |
| 格       | filled  | 浅绿 `#8bd3a0` + 深绿字          |
| 格       | 预留    | 虚框、空、淡灰                   |
| 格       | copying | 黄 `#ffcf5c`（扩容拷贝瞬时）     |
| 容量读数 | 满      | 橙 `#ff8a65`（length==capacity） |
| 均摊读数 | —       | 高亮绿 + 「≈ O(1)」              |

## 4. 数组页加节 `Array.vue` 正文大纲（下标搬移正文后插入）

```
…（现有 ArrayViz 段 + 下标搬移正文，不动）…
<h2>动态数组：容量满了怎么办——翻倍扩容</h2>
<p>前面的数组容量是固定的。可现实里我们常说的「数组」（JS Array、C++ vector、Java ArrayList、Python list）能一直 append，靠的是动态扩容。</p>
<p>当容量正好装满、还要再放，它会开一个 2 倍大的新数组，把旧元素逐个拷过去（O(n)），再放新元素。拷贝很贵，但只在「装满」那一刻发生。试试一直追加。</p>
<Playground><ArrayGrowViz/></Playground>
<p>关键在「翻倍」：容量 4→8→16→…，扩容越来越稀疏。把每次扩容的拷贝成本摊到其后的多次 append 上，每次 append 均摊只有常数次操作——这就是「尾部追加均摊 O(1)」的摊还分析。右边的均摊读数你会发现它始终有界。</p>
…（现有「数组在哪里用」段，不动）…
```

## 5. 组件清单与改动面

| 文件                                         | 类型       | 改动                                                         |
| -------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `src/components/structures/useGrow.ts`       | **新增**   | 定容数组 + 翻倍扩容 append + 均摊统计                        |
| `src/components/structures/ArrayGrowViz.vue` | **新增**   | 定容格阵 + 翻倍扩容 + 拷贝高亮 + 均摊读数互动                |
| `src/views/Article/DataStructure/Array.vue`  | 改（加节） | 下标搬移正文后插入「扩容」节 + `<Playground><ArrayGrowViz/>` |
| `e2e/array.e2e.ts`                           | 改（消歧） | TC-E2E-ARRAY-01 第 10 行 `.playground` → `.first()`（两件）  |

**零改动**：`article/` 骨架 / `ArrayViz`/`useArray` / 其余 `structures/*` / 路由 / 菜单 / 首页 / 播放器 / 8 排序 / store。

## 6. 向后兼容论证

- `useGrow`/`ArrayGrowViz` 是全新文件，除数组页外无人 import → 对 ArrayViz 与其余零影响。
- `Array.vue` 仅**追加**一节：现有 `TC-VIEW-ARRAY-01`（Article+ArrayViz 存在）、`TC-VIEW-ARRAY-02`（「数组」标题 + `.playground` 存在，`find` 取首个）**不受影响**——新节用 `.array-grow-viz` 作用域隔离、格类 `.gcell` 与 `.cell` 区隔。
- 新增 `TC-VIEW-ARRAY-03`（数组页含 ArrayGrowViz）、`TC-E2E-ARRAY-02`（扩容节 e2e，限定 `.array-grow-viz`）。
- 唯一回归点：`TC-E2E-ARRAY-01` 第 10 行 `page.locator('.playground').toBeVisible()` 在两个 Playground 下命中 2 个（严格模式）→ 改 `.first()`，断言意图不变（与 C-023/024/025/026 加第二件同款机械消歧）。

## 7. 测试策略（详见 test-cases.md）

- **L3** `useGrow`（`TC-GROW-LOGIC-*`）：初始 cap 4/len 3；append 未满不扩容；append 满翻倍 + copies=旧len；连续翻倍 4→8→16；appends/totalCopies 累计；amortized 公式 + 有界（20 次 append ≤ 3）；value ++seq；reset。
- **L4 互动** `TC-VIZ-GROWVIZ-*`：初始 4 gcell + 3 filled + 2 按钮 + readout 含 3/4；filled 值；append 未满（4 filled、status 含 O(1)）；append×2 触发扩容（8 gcell、status 含扩容/拷贝）；扩容 status 含 O(n)；stats 含均摊；连点容量翻倍；重置回 3 filled/4 gcell。
- **L4 视图** `TC-VIEW-ARRAY-03`：数组页含 `ArrayGrowViz`（findComponent）。
- **L5 e2e** `TC-E2E-ARRAY-02`：`/docs/array` 限定 `.array-grow-viz`：初始 4 gcell/3 filled、追加到扩容（gcell→8）、status 含扩容、重置回 4 gcell。
