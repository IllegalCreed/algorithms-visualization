# 设计：双调排序（C-20260705-085，新建 NetworkView 比较器网络轨）

> Status: verified
> Stable ID: C-20260705-085
> Owner: IllegalCreed
> Created: 2026-07-05
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 固定实例（Python 已核验）

n=8、输入 `[5,2,7,1,8,3,6,4]`。标准位运算展开（k=2,4,8 × j=k/2..1）得 6 列：

- 列 0：(0,1,↑)(2,3,↓)(4,5,↑)(6,7,↓)；列 1：(0,2,↑)(1,3,↑)(4,6,↓)(5,7,↓)；列 2：(0,1,↑)(2,3,↑)(4,5,↓)(6,7,↓)
- 列 3：(0,4,↑)(1,5,↑)(2,6,↑)(3,7,↑)；列 4：(0,2,↑)(1,3,↑)(4,6,↑)(5,7,↑)；列 5：(0,1,↑)(2,3,↑)(4,5,↑)(6,7,↑)
- 列 2 后 `[1,2,5,7,8,6,4,3]`（完美双调）；列 5 后有序。200 随机对拍 ✓。

## T0：类型 + NetworkView

```ts
export interface Comparator {
  col: number;
  a: number;
  b: number;
  dir: 'asc' | 'desc';
}
export interface NetworkTrack {
  wires: number[]; // 各 wire 当前值
  comparators: Comparator[]; // 全部比较器（固定）
  cols: number; // 列数
  currentCol?: number | null; // 当前执行列（琥珀）；已执行 <currentCol 绿
  done?: boolean;
}
export type NetworkExecPoint = 'init' | 'column' | 'done';
```

`Step.network?` + AlgorithmPlayer 一行 v-if。

`NetworkView.vue`：viewBox 460×300；8 条水平 wire 均布（左端 `.net-val` 标值）；比较器竖线按列均布 x，端点圆点 + 大值流向小三角（asc 指下、desc 指上）；类 `.net-comp`（默认灰）/`.net-active`（当前列琥珀）/`.net-done`（已执行绿）。

## T1：oracle + module + sources

`bitonic.ts`：`BS_INPUT`、`buildComparators(n)`（位运算展开）+ `runNetwork(input)`（执行返回逐列快照）+ 200 随机 self-check 函数 `networkSortsAll()`。
`bitonic.module.ts`：init（wires=输入、currentCol=null）→ column×6（执行该列、currentCol=c、wires 更新；列 2 caption 点双调成形）→ done。8 步。vars：n、列 c/6、本列比较器数、深度公式。
`bitonic.sources.ts`：四语言位运算迭代版（三重循环 k/j/i），lineMap init/column/done。

## T2：页面 + 接线

`BitonicSort.vue`（放 `src/views/Article/SortAlgorithm/`）正文（排序网络/双调/两阶段/并行深度/0-1 原理）；路由 `/docs/bitonic-sort`；菜单/首页「经典排序算法」第 16 项；新 svg；改 TC-HOOK（排序 children 15→16）。

## 复用与零回归

新 `Step.network?` additive；既有算法不设 → NetworkView 不渲染。AlgorithmPlayer 仅加一行 v-if。

## 变更历史

- 2026-07-05：创建（draft → approved）。
- 2026-07-05：交付验收（approved → verified）。实现与设计一致：NetworkView（wire+值+比较器竖线+流向三角，三态分色）；bitonic oracle（位运算展开+runNetwork 快照+networkSortsAll(200) 自检）；module 8 步逐列并行。
