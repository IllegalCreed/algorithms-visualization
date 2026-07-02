# 设计：双轴快排 Dual-Pivot Quicksort（全模板 = 正文 + 双紫基准 BarsView + 区间栈 + 代码播放器）

> Status: verified
> Stable ID: C-20260630-042
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（复用三路快排范式 + 一处 additive 框架扩展）

```
新页 src/views/Article/SortAlgorithm/DualPivotQuickSort.vue
   │  <Article> 介绍正文（什么是双轴 / 双基准三段扫描 / 对照单轴与三路 / 复杂度与 Java 采用）</Article>
   │  <AlgorithmPlayer :module="dualPivotQuickSortModule" />
   ▼
算法模块 src/algorithms/
   dual-pivot-quick.module.ts   buildDualPivotQuickSortSteps + dualPivotQuickSortModule
   dual-pivot-quick.ts          oracle dualPivotQuickSortTrace(input)→{result}
   dual-pivot-quick.sources.ts  4 语言 + lineMap

框架扩展（additive，一处）：
   src/components/player/types.ts   +DualPivotExecPoint +StepEmphasis.pivotIndices?: number[]
   src/components/BarsView.vue      stateOf 一行：pivotIndex === index || pivotIndices?.includes(index) → 'pivot'

复用既有轨（零改动）：StackView（区间栈）、三指针 lt 绿(id'3')/i 蓝(id'1')/gt 红(id'0')、groupMembers/sortedIndices

4 处接线（排序分类追加第 12 项，置三路快排后）：
   router +/docs/dual-pivot-quick-sort name 'dual-pivot-quick-sort'
   Menu/Home 排序 children 在「三路快排」后插入「双轴快排」
   src/assets/dual-pivot-quick.svg（新建：双高柱夹短柱）
改 TC-HOOK-02-4：排序 11→12
```

## 2. 类型与框架扩展（additive）

```ts
// types.ts 追加
export type DualPivotExecPoint =
  | 'pop'         // 弹出区间
  | 'pivotSelect' // 双基准 p=a[lo], q=a[hi]（a[lo]>a[hi] 先交换两端保证 p≤q）
  | 'compare'     // a[i] 与 p/q 比对（三路决策）
  | 'less'        // a[i] < p：swap(lt,i)，lt++，i++
  | 'between'     // p ≤ a[i] ≤ q：i++（留中段）
  | 'greater'     // a[i] > q：swap(i,gt)，gt--（i 不动）
  | 'pivotPlace'  // 双基准归位：p→a[lt]、q→a[gt]，两位置钉死
  | 'push'        // 压入子区间（左/中/右，多元素才入栈）
  | 'done';

// StepEmphasis 追加
pivotIndices?: number[]; // 双轴快排：两个基准下标 → 都渲染 pivot 态（与 pivotIndex 并存，additive）
```

`BarsView.stateOf` 首行由 `if (e.pivotIndex === index)` 扩为 `if (e.pivotIndex === index || e.pivotIndices?.includes(index))`——既有算法不设 pivotIndices → 行为不变（TC-VIZ-BARSVIEW-23 断言双紫；既有 15/16 号 Case 零改动）。

## 3. 算法模块 `dual-pivot-quick.module.ts`

```ts
const ID_LT = '3'; // 绿：< p 段右边界 lt
const ID_I = '1'; // 蓝：扫描游标 i
const ID_GT = '0'; // 红：> q 段左边界 gt
export const dualPivotQuickSortModule: AlgorithmModule<DualPivotExecPoint> = {
  title: '双轴快排',
  initialInput: () => [3, 5, 9, 1, 6, 2, 4, 7],
  buildSteps: buildDualPivotQuickSortSteps,
  sources: dualPivotQuickSortSources,
};
```

- **work**：`[String(i),v]` 稳定键，交换整个元组 → FLIP 动画（同快排/三路）。
- **显式区间栈**（同快排 C-012「先右后左」扩展为「先右、再中、后左 → pop 先取左」），只压多元素子区间；单元素直接钉死（placed）。
- **每个 pop 的区间 [lo,hi]**：
  1. `pivotSelect`：若 `a[lo]>a[hi]` 先交换两端（caption 说明）；`p=a[lo], q=a[hi]`（恒 p≤q）；`lt=i=lo+1, gt=hi-1`；**pivotIndices=[lo,hi] 双紫**。
  2. 扫描 `while(i<=gt)`：`compare`（宣布 a[i] 与 p/q 关系）→ 三分支：
     - `a[i]<p` → `less`：swap(work[lt],work[i])，lt++，i++
     - `a[i]>q` → `greater`：swap(work[i],work[gt])，gt--（i 不动，换入值待查）
     - 其余 → `between`：i++（留中段）
       扫描步全程 pivotIndices=[lo,hi]。
  3. `pivotPlace`：`lt--, gt++`；swap(work[lo],work[lt])、swap(work[hi],work[gt])——p 钉死于 lt、q 钉死于 gt（入 placed→sortedIndices；pivotIndices 清除）。
  4. `push`：左 [lo,lt-1] / 中 [lt+1,gt-1] / 右 [gt+1,hi]，多元素压栈（先右、再中、后左），单元素直接 placed。
- 末 `done`：sortedIndices 全量、无指针。

### 手算（固定 `[3,5,9,1,6,2,4,7]`）

**趟 1 [0,7]**：a[0]=3 < a[7]=7 无需换端，p=3、q=7；lt=i=1、gt=6：

| i   | a[i] | 关系   | 动作                       | 数组                    | lt,gt |
| --- | ---- | ------ | -------------------------- | ----------------------- | ----- |
| 1   | 5    | ∈[3,7] | between：i→2               | 3,5,9,1,6,2,4,7         | 1,6   |
| 2   | 9    | >7     | greater：swap(2,6)，gt→5   | 3,5,**4**,1,6,2,**9**,7 | 1,5   |
| 2   | 4    | ∈[3,7] | between：i→3               | 同上                    | 1,5   |
| 3   | 1    | <3     | less：swap(1,3)，lt→2，i→4 | 3,**1**,4,**5**,6,2,9,7 | 2,5   |
| 4   | 6    | ∈[3,7] | between：i→5               | 同上                    | 2,5   |
| 5   | 2    | <3     | less：swap(2,5)，lt→3，i→6 | 3,1,**2**,5,6,**4**,9,7 | 3,5   |

i=6 > gt=5 停。lt--→2、gt++→6；**pivotPlace**：swap(0,2)+swap(7,6) → `[2,1,3,5,6,4,7,9]`，**3 钉死于 2、7 钉死于 6**。段：左 [0,1]=[2,1]、中 [3,5]=[5,6,4]、右 [7,7]=[9]（单素→直接钉死）。push 压 [3,5]、[0,1]（pop 先取左）。

**趟 2 [0,1]**：a[0]=2 > a[1]=1 → **先交换两端** `[1,2,…]`，p=1、q=2；lt=1、gt=0 → 扫描零步；pivotPlace 双自交换（原位）→ **0、1 钉死**。无子区间。

**趟 3 [3,5]**：a[3]=5 > a[5]=4 → **先交换两端** `[…,4,6,5,…]`，p=4、q=5；lt=i=4、gt=4：i=4 a[4]=6>5 → greater（自交换）gt→3；i>gt 停。pivotPlace：4 钉死于 3、swap(5,4) → 5 钉死于 4 → `[1,2,3,4,5,6,7,9]`。右 [5,5]=[6] 单素钉死。无子区间。

栈空 → done，`[1,2,3,4,5,6,7,9]` ✓。**步数 27**（趟1 16 + 趟2 4 + 趟3 6 + done 1）。placed 覆盖 0..7 全量 ✓。三分支：less×2、between×3、greater×2 ✓；换端出现于趟 2/趟 3 ✓。

## 4. oracle + sources

```ts
export interface DualPivotQuickTrace {
  result: number[];
}
export function dualPivotQuickSortTrace(input: number[]): DualPivotQuickTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
```

sources（4 语言，栈式）TS 骨架 lineMap：`{ pop:4, pivotSelect:6, compare:9, less:10, between:16, greater:13, pivotPlace:20, push:22, done:26 }`；python/go/rust 各自源码逐行核对（源码压栈顺序同模块：右→中→左）。

## 5. 视图 `DualPivotQuickSort.vue`（全模板）

Article 正文（h1「双轴快排 Dual-Pivot Quicksort」+ sub + 「单轴到双轴」「怎么做（三指针 + 双基准归位）」+ 播放器 + 「复杂度与为什么 Java 用它」+ Callout 单轴/三路/双轴三家对照）+ `<AlgorithmPlayer>`（置正文中段，同 C-040/041）。

## 6. 组件清单与改动面

| 文件                                                     | 类型          | 改动                                            |
| -------------------------------------------------------- | ------------- | ----------------------------------------------- |
| `src/components/player/types.ts`                         | 改（追加）    | +DualPivotExecPoint +StepEmphasis.pivotIndices? |
| `src/components/BarsView.vue`                            | 改（一行）    | stateOf pivot 判断加 pivotIndices               |
| `src/components/BarsView.spec.ts`                        | 改（加 Case） | +TC-VIZ-BARSVIEW-23（双基准都染紫）             |
| `src/algorithms/dual-pivot-quick.module.ts`              | **新增**      | buildDualPivotQuickSortSteps + module           |
| `src/algorithms/dual-pivot-quick.ts`                     | **新增**      | oracle                                          |
| `src/algorithms/dual-pivot-quick.sources.ts`             | **新增**      | 4 语言 + lineMap                                |
| `src/views/Article/SortAlgorithm/DualPivotQuickSort.vue` | **新增**      | 全模板                                          |
| `src/assets/dual-pivot-quick.svg`                        | **新增**      | 双高柱夹短柱图标                                |
| `src/router/index.ts`                                    | 改（接线）    | +`/docs/dual-pivot-quick-sort`                  |
| `src/views/Docs/Menu/hooks.ts`                           | 改（接线）    | 「三路快排」后插「双轴快排」                    |
| `src/views/Home/Main/hooks.ts`                           | 改（接线）    | 同上 + import DualPivotQuickIcon                |
| `src/views/Docs/Menu/hooks.spec.ts`                      | 改（计数）    | TC-HOOK-02-4 排序 11→12                         |

**零改动**：6 轨组件（除 BarsView 一行）/ usePlayer / AlgorithmPlayer / 既有 11 排序模块 / 15 结构 / 图算法。

## 7. 向后兼容论证

- `pivotIndices` 可选追加：既有算法不设 → BarsView `stateOf` 短路走原逻辑，TC-VIZ-BARSVIEW-15/16（pivotIndex）零改动通过。
- `DualPivotExecPoint` 仅追加类型；模块复用 Step.stack/pointers/emphasis。
- 排序分类追加第 12 项 + 接线均为追加；改动仅 TC-HOOK-02-4（11→12）。
- 新增 `TC-VIZ-BARSVIEW-23` / `TC-DUALPIVOT-MOD-*` / `TC-VIEW-DUALPIVOT-*` / `TC-E2E-DUALPIVOT-01`。

## 8. 测试策略（详见 test-cases.md）

- **L4 BarsView**：TC-VIZ-BARSVIEW-23 pivotIndices=[0,7] → 两根柱都 pivot 态（且不影响其它柱）。
- **L3 模块**：末步=oracle；不改入参；键集稳定；步点合法+带 stack；`#compare=#less+#between+#greater`；`#pop=#pivotSelect=#pivotPlace=#push`；首 pivotSelect p=3/q=7 且扫描步 pivotIndices=[0,7]；首 pivotPlace 后 `[2,1,3,5,6,4,7,9]` 且 2/6 钉死；三分支各≥1；每 pivotSelect p≤q 且存在换端步；done 全量；compare 步三指针齐；4 语言行号；元信息。
- **L4 视图**：Article h1「双轴快排」+ AlgorithmPlayer + StackView + 8 柱 + counter。
- **L5 e2e**：`/docs/dual-pivot-quick-sort` 正文 + `.stack-view` + 8 `.bar-cell` + 拖末步 `[1,2,3,4,5,6,7,9]`。
- **改** TC-HOOK-02-4：排序 12 项含 dual-pivot-quick-sort。
