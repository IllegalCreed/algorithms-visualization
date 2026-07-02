# 设计：鸡尾酒排序 Cocktail Shaker Sort（全模板 = 正文 + 双端收缩 BarsView + 代码播放器）

> Status: verified
> Stable ID: C-20260702-045
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（镜像 C-003/C-006 冒泡范式，零新轨零框架改动）

```
新页 src/views/Article/SortAlgorithm/CocktailSort.vue
   │  <Article> 正文（乌龟问题 / 双向来回 + 两端收缩 / 提前收工 / 对照冒泡）</Article>
   │  <AlgorithmPlayer :module="cocktailSortModule" />
   ▼
算法模块 src/algorithms/
   cocktail.module.ts   buildCocktailSortSteps + cocktailSortModule
   cocktail.ts          oracle cocktailSortTrace(input)→{result}
   cocktail.sources.ts  4 语言 + lineMap

类型（additive）：types.ts +CocktailExecPoint（9 执行点，带方向）
复用轨（零改动）：BarsView——**sortedFrom（右绿）+ sortedUpTo（左绿）双端并用** + comparing/swapped + 相邻双游标

4 处接线（排序第 15 项，置冒泡后）：
   router +/docs/cocktail-sort；Menu/Home「冒泡排序」后插「鸡尾酒排序」
   src/assets/cocktail.svg（新建：鸡尾酒杯剪影）
改 TC-HOOK-02-4：排序 14→15
```

## 2. 类型（additive）

```ts
/** 鸡尾酒排序的执行点（双向冒泡：forwardPass 左→右冒最大 → backwardPass 右→左沉最小；比较/交换带方向以精确映射两个循环） */
export type CocktailExecPoint =
  | 'forwardPass'
  | 'fCompare'
  | 'fSwap'
  | 'fNoSwap'
  | 'backwardPass'
  | 'bCompare'
  | 'bSwap'
  | 'bNoSwap'
  | 'done';
```

## 3. 算法模块 `cocktail.module.ts`

```ts
const ID_A = '0'; // 红：比较对左格
const ID_B = '1'; // 蓝：比较对右格
export const cocktailSortModule: AlgorithmModule<CocktailExecPoint> = {
  title: '鸡尾酒排序',
  initialInput: () => [4, 2, 6, 3, 8, 5, 7, 1],
  buildSteps: buildCocktailSortSteps,
  sources: cocktailSortSources,
};
```

- **work** `[String(i),v]` 位置键；swap 交换元组 → FLIP（同冒泡）。
- **主循环 while(left<right)**：
  1. `forwardPass`（趟标记，caption「→ 第 k 趟…」）→ `j∈[left,right)`：`fCompare`（comparing=[j,j+1]，红 j/蓝 j+1）→ 大于 `fSwap`（swapped:true）/ 否则 `fNoSwap`；趟毕 `right--`（sortedFrom=right+1 生效），零交换 break。
  2. `backwardPass` → `j∈(left,right]` 降序：`bCompare`（comparing=[j-1,j]，红 j-1/蓝 j）→ `a[j-1]>a[j]` `bSwap` / 否则 `bNoSwap`；趟毕 `left++`（sortedUpTo=left 生效），零交换 break。
- **emphasis 每步**：`{ sortedFrom, sortedUpTo, ... }`——右端绿从 fwd 趟收缩、左端绿从 bwd 趟收缩，**双端渐绿夹住中间乱序区**。
- **vars**（8 行）：n / left / right / 方向(→/←/－) / j / a 对（左值/右值）/ swappedInPass / swapCount。
- 末 `done`：sortedFrom=0（全绿）、无指针。

### 手算（固定 `[4,2,6,3,8,5,7,1]`）

| 趟     | 过程                                                                       | 趟后数组        | 收缩              | 步数 |
| ------ | -------------------------------------------------------------------------- | --------------- | ----------------- | ---- |
| → fwd1 | 4>2 S；4<6 N；6>3 S；6<8 N；8>5 S；8>7 S；8>1 S（7 比较 5 换 2 不换）      | 2,4,3,6,5,7,1,8 | right 7→6         | 15   |
| ← bwd1 | 7>1 S；5>1 S；6>1 S；3>1 S；4>1 S；2>1 S（**六连 swap，乌龟 1 一趟回头**） | 1,2,4,3,6,5,7,8 | left 0→1          | 13   |
| → fwd2 | 2<4 N；4>3 S；4<6 N；6>5 S；6<7 N（5 比较 2 换 3 不换）                    | 1,2,3,4,5,6,7,8 | right 6→5         | 11   |
| ← bwd2 | 5<6 N；4<5 N；3<4 N；2<3 N（**全不换 → swapped=false 提前收工**）          | 不变            | left 1→2 后 break | 9    |
| done   | —                                                                          | ✓ 全序          | sortedFrom=0      | 1    |

**步数 49** = 15+13+11+9+1。
不变量：#forwardPass=2、#backwardPass=2；#fCompare=12（7+5）、#bCompare=10（6+4）；#fSwap=7、#bSwap=6、#fNoSwap=5、#bNoSwap=4；compare 22 = swap 13 + noSwap 9。
双端并存：fwd2 趟内步 `sortedFrom=7 且 sortedUpTo=1` 同帧成立。

## 4. oracle + sources

```ts
export function cocktailSortTrace(input: number[]): CocktailTrace {
  return { result: [...input].sort((a, b) => a - b) };
}
```

sources 4 语言（双循环 + 两处零交换 break）。TS 骨架 24 行，lineMap(ts)=`{forwardPass:4, fCompare:6, fSwap:7, fNoSwap:5, backwardPass:13, bCompare:15, bSwap:16, bNoSwap:14, done:23}`；python 20 行 / go 28 行 / rust 29 行逐行核对（noSwap 映射对应循环行——表示「不换、继续扫」）。

## 5. 视图（全模板）

Article 正文：h1「鸡尾酒排序 Cocktail Shaker Sort」+ sub +「冒泡的乌龟问题」「双向来回怎么走（两端收缩 + 提前收工）」+ 播放器 +「复杂度：仍 O(n²)、稳定、原地；趟数对乌龟场景显著减少」+ Callout 冒泡 vs 鸡尾酒对照；结尾互链冒泡页。

## 6. 组件清单与改动面

| 文件                                               | 类型       | 改动                            |
| -------------------------------------------------- | ---------- | ------------------------------- |
| `src/components/player/types.ts`                   | 改（追加） | +CocktailExecPoint              |
| `src/algorithms/cocktail.module.ts`                | **新增**   | buildCocktailSortSteps + module |
| `src/algorithms/cocktail.ts`                       | **新增**   | oracle                          |
| `src/algorithms/cocktail.sources.ts`               | **新增**   | 4 语言 + lineMap                |
| `src/views/Article/SortAlgorithm/CocktailSort.vue` | **新增**   | 全模板                          |
| `src/assets/cocktail.svg`                          | **新增**   | 鸡尾酒杯剪影                    |
| `src/router/index.ts`                              | 改（接线） | +`/docs/cocktail-sort`          |
| `src/views/Docs/Menu/hooks.ts`                     | 改（接线） | 「冒泡排序」后插「鸡尾酒排序」  |
| `src/views/Home/Main/hooks.ts`                     | 改（接线） | 同上 + import CocktailIcon      |
| `src/views/Docs/Menu/hooks.spec.ts`                | 改（计数） | TC-HOOK-02-4 排序 14→15         |

**零改动**：全部 6 轨组件 / AlgorithmPlayer / usePlayer / 既有 14 排序模块 / 15 结构 / 图算法。

## 7. 向后兼容论证

- 仅追加 `CocktailExecPoint` 类型；sortedFrom/sortedUpTo 双端并用为 BarsView 既有能力的组合（stateOf 的 sortedRight/sortedLeft 分支本就并列）。
- 排序第 15 项 + 接线均为追加；改动仅 TC-HOOK-02-4（14→15）。
- 新增 `TC-COCKTAIL-MOD-*` / `TC-VIEW-COCKTAIL-*` / `TC-E2E-COCKTAIL-01`。

## 8. 测试策略（详见 test-cases.md）

- **L3 模块**：末步=oracle；不改入参；键集稳定；步点合法（9 种）；#forwardPass=#backwardPass=2；compare 守恒 22=13swap+9noSwap（分方向断言 f/b 各计数）；**乌龟一趟回头**（bwd1 六个 bSwap 连发、乌龟值 1 从 idx6 到 idx0）；**双端并存**（存在步 sortedFrom=7 且 sortedUpTo=1）；**提前收工**（末 4 比较全 bNoSwap 且其后直接 done）；compare 步 comparing+双指针；done sortedFrom=0 无指针；4 语言行号；元信息。
- **L4 视图**：Article h1「鸡尾酒排序」+ AlgorithmPlayer + 主轨 8 柱 + counter。
- **L5 e2e**：`/docs/cocktail-sort` 正文 + 8 `.bar-cell` + 拖末步 `[1,2,3,4,5,6,7,8]`。
- **改** TC-HOOK-02-4：排序 15 项含 cocktail-sort。
