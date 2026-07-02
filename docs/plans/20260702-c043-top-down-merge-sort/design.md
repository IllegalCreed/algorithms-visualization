# 设计：自顶向下归并 Top-Down Merge Sort（全模板 = 正文 + 递归栈/temp 双辅助轨 + 代码播放器）

> Status: verified
> Stable ID: C-20260702-043
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（复用 C-011 merge 粒度 + C-012 StackView，零新轨）

```
新页 src/views/Article/SortAlgorithm/TopDownMergeSort.vue
   │  <Article> 正文（分治递归 / 与自底向上对照 / 复杂度）</Article>
   │  <AlgorithmPlayer :module="topDownMergeSortModule" />
   ▼
算法模块 src/algorithms/
   top-down-merge.module.ts   buildTopDownMergeSortSteps + topDownMergeSortModule
   top-down-merge.ts          oracle topDownMergeSortTrace(input)→{result}
   top-down-merge.sources.ts  4 语言 + lineMap

类型（additive）：types.ts +TopDownMergeExecPoint（9 执行点）
复用轨（零改动）：AuxView（temp，同 C-011）+ StackView（递归调用栈，同 C-012）——首个双辅助轨并存
播放器：AlgorithmPlayer 零改动（各轨独立 v-if 天然支持并存）；spec 补 TC-PLAYER-STACK-04

4 处接线（排序第 13 项，置归并后）：
   router +/docs/top-down-merge-sort；Menu/Home「归并排序」后插「自顶向下归并」
   src/assets/top-down-merge.svg（新建：上下宽条夹两短条，分→合）
改 TC-HOOK-02-4：排序 12→13
```

## 2. 类型（additive）

```ts
/** 自顶向下归并的执行点（递归分治：split 对半下钻 → 回程 merge 七件套同 C-011 → done） */
export type TopDownMergeExecPoint =
  | 'split'
  | 'mergeStart'
  | 'compare'
  | 'takeLeft'
  | 'takeRight'
  | 'drainLeft'
  | 'drainRight'
  | 'writeBack'
  | 'done';
```

## 3. 算法模块 `top-down-merge.module.ts`

```ts
const ID_I = '0'; // 红：左段游标 i（同 C-011）
const ID_J = '1'; // 蓝：右段游标 j
export const topDownMergeSortModule: AlgorithmModule<TopDownMergeExecPoint> = {
  title: '自顶向下归并',
  initialInput: () => [6, 3, 8, 1, 9, 2, 7, 4],
  buildSteps: buildTopDownMergeSortSteps,
  sources: topDownMergeSortSources,
};
```

- **work** `[String(i),v]` 位置键；writeBack 拷回带原 id → 主轨 FLIP（同 C-011）。
- **真递归生成步骤**：`sortRange(lo,hi)`（闭区间）——长度 <2 直接 return（不发步不压栈）；否则 `callStack.push({lo,hi})` → 发 `split`（宣布对半 [lo,mid]/[mid+1,hi]）→ 递归左 → 递归右 → **merge 块**（粒度完全镜像 C-011：mergeStart → while 双段 compare→takeLeft/takeRight → drainLeft/drainRight → 拷回 writeBack；aux 快照 auxSnap(filled,[lo,hi+1),k)、i 红/j 蓝指针、groupMembers=当前区间、writeCount 累计）→ `callStack.pop()`（无单独步，栈快照在后续步自然收缩）。
- **栈快照** stackSnap()：frames = callStack 深拷贝（闭区间帧，StackView 显示 a[lo..hi]，栈顶=当前活动区间=`.top` 高亮）；不用 popped。
- **每步同时带 aux + stack**（首个双辅助轨模块）。
- **vars**（11 行，C-011 的 width 换成 深度）：n / 深度(callStack.length) / lo / mid / hi / i / j / k / a[i] / a[j] / writeCount。
- 末 `done`：sortedFrom: 0、无指针、栈空、aux 清空。

### 手算（固定 `[6,3,8,1,9,2,7,4]`，闭区间）

递归序与栈（split 步时的栈）：

| 步          | 栈（底→顶）        | 动作                                                     |
| ----------- | ------------------ | -------------------------------------------------------- |
| split [0,7] | [0,7]              | 对半 [0,3] / [4,7]                                       |
| split [0,3] | [0,7],[0,3]        | 对半 [0,1] / [2,3]                                       |
| split [0,1] | [0,7],[0,3],[0,1]  | **栈深 3**；对半 [0,0]/[1,1]（单素不发步）               |
| merge [0,1] | 同上（栈顶 [0,1]） | [6],[3] → cmp,takeR3,drainL6 → [3,6]（5 步）             |
| split [2,3] | [0,7],[0,3],[2,3]  |                                                          |
| merge [2,3] | 栈顶 [2,3]         | [8],[1] → [1,8]（5 步）                                  |
| merge [0,3] | 栈顶 [0,3]         | [3,6],[1,8] → 3cmp+3take+drainR8 → [1,3,6,8]（9 步）     |
| split [4,7] | [0,7],[4,7]        |                                                          |
| split [4,5] | [0,7],[4,7],[4,5]  |                                                          |
| merge [4,5] |                    | [9],[2] → [2,9]（5 步）                                  |
| split [6,7] | [0,7],[4,7],[6,7]  |                                                          |
| merge [6,7] |                    | [7],[4] → [4,7]（5 步）                                  |
| merge [4,7] | 栈顶 [4,7]         | [2,9],[4,7] → 3cmp+3take+drainL9 → [2,4,7,9]（9 步）     |
| merge [0,7] | 栈顶 [0,7]         | [1,3,6,8],[2,4,7,9] → 7cmp+7take+drainR9 → 全序（17 步） |
| done        | 空                 | [1,2,3,4,6,7,8,9] ✓                                      |

**步数 63** = split 7 + merge 块（5+5+9+5+5+9+17=55）+ done 1。
不变量：#split=7；#mergeStart=#writeBack=7；#compare=17=#takeLeft+#takeRight；写 temp 总数 24（=17 take + 7 drain）；栈深峰值 3；done 栈空。

## 4. oracle + sources

```ts
export function topDownMergeSortTrace(input: number[]): TopDownMergeTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
```

sources 4 语言（闭区间递归，压栈序=源码递归序）TS 骨架 19 行，lineMap(ts)=`{split:3, mergeStart:6, compare:9, takeLeft:10, takeRight:12, drainLeft:15, drainRight:16, writeBack:17, done:18}`；python 26 行 / go 31 行 / rust 30 行各自逐行核对。

## 5. 视图（全模板）

Article 正文：h1「自顶向下归并 Top-Down Merge Sort」+ sub +「分治怎么走（对半下钻+回程合并+递归栈）」+ 播放器 +「复杂度」+ Callout **自底向上（C-011 迭代 width 倍增）vs 自顶向下（本页递归分治）——同一个 merge、两种驱动**；结尾互链归并排序页。

## 6. 组件清单与改动面

| 文件                                                   | 类型          | 改动                                  |
| ------------------------------------------------------ | ------------- | ------------------------------------- |
| `src/components/player/types.ts`                       | 改（追加）    | +TopDownMergeExecPoint                |
| `src/components/player/AlgorithmPlayer.spec.ts`        | 改（加 Case） | +TC-PLAYER-STACK-04（aux+stack 并存） |
| `src/algorithms/top-down-merge.module.ts`              | **新增**      | buildTopDownMergeSortSteps + module   |
| `src/algorithms/top-down-merge.ts`                     | **新增**      | oracle                                |
| `src/algorithms/top-down-merge.sources.ts`             | **新增**      | 4 语言 + lineMap                      |
| `src/views/Article/SortAlgorithm/TopDownMergeSort.vue` | **新增**      | 全模板                                |
| `src/assets/top-down-merge.svg`                        | **新增**      | 分→合剪影                             |
| `src/router/index.ts`                                  | 改（接线）    | +`/docs/top-down-merge-sort`          |
| `src/views/Docs/Menu/hooks.ts`                         | 改（接线）    | 「归并排序」后插「自顶向下归并」      |
| `src/views/Home/Main/hooks.ts`                         | 改（接线）    | 同上 + import TopDownMergeIcon        |
| `src/views/Docs/Menu/hooks.spec.ts`                    | 改（计数）    | TC-HOOK-02-4 排序 12→13               |

**零改动**：全部 6 轨组件 / AlgorithmPlayer.vue / usePlayer / 既有 12 排序模块 / 15 结构 / 图算法。

## 7. 向后兼容论证

- 仅追加 `TopDownMergeExecPoint` 类型；aux/stack 复用既有接口（AuxTrack/StackTrack 零改动）；双轨并存是播放器既有 v-if 结构的自然能力（TC-PLAYER-STACK-04 补验证）。
- 排序第 13 项 + 接线均为追加；改动仅 TC-HOOK-02-4（12→13）。
- 新增 `TC-PLAYER-STACK-04` / `TC-TDMERGE-MOD-*` / `TC-VIEW-TDMERGE-*` / `TC-E2E-TDMERGE-01`。

## 8. 测试策略（详见 test-cases.md）

- **L4 播放器**：TC-PLAYER-STACK-04 同时带 aux+stack → AuxView 与 StackView 都渲染。
- **L3 模块**：末步=oracle；不改入参；键集稳定；步点合法且**每步带 aux+stack**；#split=7 且首 split 栈=[[0,7]]；#mergeStart=#writeBack=7；#compare=#takeL+#takeR 且写 temp 总数=24；首 merge[0,1] writeBack 后 work[0..1]=[3,6]；栈深达 3 且 done 栈空；首 mergeStart 栈顶=[0,1]；done sortedFrom=0 无指针；compare 步 i/j 双指针+comparing；4 语言行号；元信息。
- **L4 视图**：Article h1「自顶向下归并」+ AlgorithmPlayer + AuxView + StackView + 8 柱 + counter。
- **L5 e2e**：`/docs/top-down-merge-sort` 正文 + `.aux-view` + `.stack-view` 同屏 + 8 `.bar-cell` + 拖末步 `[1,2,3,4,6,7,8,9]`。
- **改** TC-HOOK-02-4：排序 13 项含 top-down-merge-sort。
