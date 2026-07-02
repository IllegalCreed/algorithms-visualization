# 设计：二分插入排序 Binary Insertion Sort（全模板 = 正文 + 三箭头折半 BarsView + 代码播放器）

> Status: verified
> Stable ID: C-20260702-044
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（镜像 C-008 插入排序范式，零新轨）

```
新页 src/views/Article/SortAlgorithm/BinaryInsertionSort.vue
   │  <Article> 正文（折半定位 / 对照普通插入 / 复杂度与稳定性）</Article>
   │  <AlgorithmPlayer :module="binaryInsertionSortModule" />
   ▼
算法模块 src/algorithms/
   binary-insertion.module.ts   buildBinaryInsertionSortSteps + binaryInsertionSortModule
   binary-insertion.ts          oracle binaryInsertionSortTrace(input)→{result}
   binary-insertion.sources.ts  4 语言 + lineMap

类型（additive）：types.ts +BinaryInsertionExecPoint（8 执行点）
复用轨（零改动）：BarsView（三箭头 + keyIndex 玫红 + sortedUpTo 绿前缀 + comparing 黄）

4 处接线（排序第 14 项，置插入后）：
   router +/docs/binary-insertion-sort；Menu/Home「插入排序」后插「二分插入排序」
   src/assets/binary-insertion.svg（新建：两侧柱夹中央下插箭头）
改 TC-HOOK-02-4：排序 13→14
```

## 2. 类型（additive）

```ts
/** 二分插入排序的执行点（outerLoop 取 key → probe 折半比较 → goLeft/goRight 区间收缩 → found 定位 → shift 搬移 → insert 落位） */
export type BinaryInsertionExecPoint =
  | 'outerLoop'
  | 'probe'
  | 'goLeft'
  | 'goRight'
  | 'found'
  | 'shift'
  | 'insert'
  | 'done';
```

## 3. 算法模块 `binary-insertion.module.ts`

```ts
const ID_LO = '3'; // 绿：搜索区间左界 lo
const ID_MID = '1'; // 蓝：折半探针 mid
const ID_HI = '0'; // 红：搜索区间右界 hi（半开）
export const binaryInsertionSortModule: AlgorithmModule<BinaryInsertionExecPoint> = {
  title: '二分插入排序',
  initialInput: () => [5, 2, 9, 4, 7, 1, 8, 3],
  buildSteps: buildBinaryInsertionSortSteps,
  sources: binaryInsertionSortSources,
};
```

- **work** `[String(i),v]` 位置键；shift 用**相邻交换**（key 元组从 i 逐格滑到 pos → FLIP，同 C-008）。
- **每轮 i=1..n-1**：
  1. `outerLoop`：取 key=a[i]（emphasis.keyIndex=i，玫红）。
  2. 折半 `[lo,hi)=[0,i)`，`while(lo<hi)`：`probe`（mid=(lo+hi)>>1，comparing=[mid,keyIdx]，三指针 lo/mid/hi）→ `key<a[mid]` → `goLeft`（hi=mid）；否则 `goRight`（lo=mid+1，**≥ 保稳定**）。
  3. `found`：pos=lo（lo 绿指针驻 pos）。
  4. `shift`×(i-pos)：k 从 i 降到 pos+1，swap(work[k-1],work[k])——key 元组左滑一格/邻元素右让（keyIndex 跟随）。
  5. `insert`：key 落位 pos；sortedUpTo=i+1。
- 搜索阶段指针 lo/mid/hi 三箭头夹逼；shift/insert 阶段 pos 绿 + keyIndex 玫红。
- **emphasis**：sortedUpTo 绿前缀恒亮（sorted 优先级高于 dim，故不用 groupMembers——区间收缩靠三箭头 + caption）。
- **vars**（9 行）：n / i / key / lo / mid / hi / pos / shiftCount / sortedUpTo。
- 末 `done`：sortedUpTo=n、无指针。

### 手算（固定 `[5,2,9,4,7,1,8,3]`）

| 轮 i | key | 折半路径（probe→收缩）                             | pos | shift | 轮后数组          | 步数 |
| ---- | --- | -------------------------------------------------- | --- | ----- | ----------------- | ---- |
| 1    | 2   | mid0(5) 2<5 goLeft                                 | 0   | 1     | 2,5,9,4,7,1,8,3   | 6    |
| 2    | 9   | mid1(5) 9≥5 goRight                                | 2=i | **0** | 不变（零移动轮）  | 5    |
| 3    | 4   | mid1(5) goLeft → mid0(2) goRight                   | 1   | 2     | 2,4,5,9,7,1,8,3   | 9    |
| 4    | 7   | mid2(5) goRight → mid3(9) goLeft                   | 3   | 1     | 2,4,5,7,9,1,8,3   | 8    |
| 5    | 1   | mid2(5)→mid1(4)→mid0(2) 三连 goLeft                | 0   | **5** | 1,2,4,5,7,9,8,3   | 14   |
| 6    | 8   | mid3(5) goRight → mid5(9) goLeft → mid4(7) goRight | 5   | 1     | 1,2,4,5,7,8,9,3   | 10   |
| 7    | 3   | mid3(5) goLeft → mid1(2) goRight → mid2(4) goLeft  | 2   | 5     | 1,2,3,4,5,7,8,9 ✓ | 14   |

**步数 67** = 每轮(outerLoop+probe×p+收缩×p+found+shift×s+insert) 求和 + done 1 = 6+5+9+8+14+10+14+1。
不变量：#outerLoop=#found=#insert=7；#probe=#goLeft+#goRight=15（goLeft 9/goRight 6）；#shift=15。

## 4. oracle + sources

```ts
export function binaryInsertionSortTrace(input: number[]): BinaryInsertionTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
```

sources 4 语言（折半定位 + 赋值搬移语义）TS 骨架 20 行，lineMap(ts)=`{outerLoop:3, probe:6, goLeft:8, goRight:10, found:13, shift:15, insert:17, done:19}`；python 15 行 / go 20 行 / rust 21 行逐行核对。

## 5. 视图（全模板）

Article 正文：h1「二分插入排序 Binary Insertion Sort」+ sub +「普通插入慢在哪（比较也线性）」「折半定位怎么走（lo/mid/hi 夹逼 + ≥ 走右保稳定）」+ 播放器 +「复杂度：比较 O(n log n)、移动仍 O(n²)、总体量级不变但比较开销显著降」+ Callout 普通插入 vs 二分插入对照；结尾提 TimSort 小段用的正是二分插入（钩子）。

## 6. 组件清单与改动面

| 文件                                                      | 类型       | 改动                                   |
| --------------------------------------------------------- | ---------- | -------------------------------------- |
| `src/components/player/types.ts`                          | 改（追加） | +BinaryInsertionExecPoint              |
| `src/algorithms/binary-insertion.module.ts`               | **新增**   | buildBinaryInsertionSortSteps + module |
| `src/algorithms/binary-insertion.ts`                      | **新增**   | oracle                                 |
| `src/algorithms/binary-insertion.sources.ts`              | **新增**   | 4 语言 + lineMap                       |
| `src/views/Article/SortAlgorithm/BinaryInsertionSort.vue` | **新增**   | 全模板                                 |
| `src/assets/binary-insertion.svg`                         | **新增**   | 两侧柱夹下插箭头                       |
| `src/router/index.ts`                                     | 改（接线） | +`/docs/binary-insertion-sort`         |
| `src/views/Docs/Menu/hooks.ts`                            | 改（接线） | 「插入排序」后插「二分插入排序」       |
| `src/views/Home/Main/hooks.ts`                            | 改（接线） | 同上 + import BinaryInsertionIcon      |
| `src/views/Docs/Menu/hooks.spec.ts`                       | 改（计数） | TC-HOOK-02-4 排序 13→14                |

**零改动**：全部 6 轨组件 / AlgorithmPlayer / usePlayer / 既有 13 排序模块 / 15 结构 / 图算法。

## 7. 向后兼容论证

- 仅追加 `BinaryInsertionExecPoint` 类型；纯 BarsView 复用（keyIndex/sortedUpTo/comparing/三指针全为既有能力）。
- 排序第 14 项 + 接线均为追加；改动仅 TC-HOOK-02-4（13→14）。
- 新增 `TC-BININS-MOD-*` / `TC-VIEW-BININS-*` / `TC-E2E-BININS-01`。

## 8. 测试策略（详见 test-cases.md）

- **L3 模块**：末步=oracle；不改入参；键集稳定；步点合法；#outerLoop=#found=#insert=7；#probe=#goLeft+#goRight；#shift=15；零移动轮（key=9：found 后紧跟 insert）；全移动轮（key=1：pos=0、shift×5）；probe 步 comparing+lo/mid/hi 三指针；outerLoop 步 keyIndex=i；done sortedUpTo=n 无指针；4 语言行号；元信息。
- **L4 视图**：Article h1「二分插入排序」+ AlgorithmPlayer + 主轨 8 柱 + counter。
- **L5 e2e**：`/docs/binary-insertion-sort` 正文 + 8 `.bar-cell` + 拖末步 `[1,2,3,4,5,7,8,9]`。
- **改** TC-HOOK-02-4：排序 14 项含 binary-insertion-sort。
