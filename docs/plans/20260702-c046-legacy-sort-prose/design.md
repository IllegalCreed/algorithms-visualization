# 设计：老排序页全模板化（批量补介绍正文，M8③）

> Status: verified
> Stable ID: C-20260702-046
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md

## 1. 架构概览（纯视图层，零逻辑改动）

```
仅改 9 个裸排序页（视图 + spec + e2e），算法/播放器/轨道/路由/菜单全部零改动：

src/views/Article/SortAlgorithm/<Name>.vue    裸 <AlgorithmPlayer/> → <Article> 正文 + <AlgorithmPlayer/>
src/views/Article/SortAlgorithm/<Name>.spec.ts +TC-VIEW-*-03（Article + h1）
e2e/<name>-sort.e2e.ts                          + .article h1 断言

9 页：BubbleSort / SelectionSort / InsertionSort / ShellSort / MergeSort /
     QuickSort / HeapSort / CountingSort / RadixSort
```

## 2. 视图统一骨架（每页填算法特定内容）

```vue
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { xxxSortModule } from '@/algorithms/xxx-sort.module';
</script>
<template>
  <Article>
    <h1>中文名 English Name</h1>
    <p class="sub">思想族 · 一句话定位</p>
    <h2>是什么</h2>
    <p>…直观比喻 + 核心思想…</p>
    <h2>怎么做</h2>
    <p>…步骤，引导「点下一步」看播放器里的 X 轨/指针…</p>
    <AlgorithmPlayer :module="xxxSortModule" />
    <h2>复杂度与适用</h2>
    <p>…时间/空间/稳定性/适用场景…</p>
    <Callout>…对照/关联（利用已有对照页）…</Callout>
    <p>…结尾互链相关页…</p>
  </Article>
</template>
```

## 3. 各页正文要点（算法特定 + 演示数据 + 关联钩子）

| 页                     | 定位                   | 讲解重点                                                  | 复杂度                      | Callout / 关联                                           |
| ---------------------- | ---------------------- | --------------------------------------------------------- | --------------------------- | -------------------------------------------------------- |
| **冒泡** BubbleSort    | 交换 · 入门            | 相邻比较交换、每趟最大值冒到末尾（右侧渐绿）              | O(n²) 稳定                  | 对照**鸡尾酒**（双向改进）；提前收工                     |
| **选择** SelectionSort | 选择 · 交换最少        | 每轮扫出最小值 minIndex、一次交换到前缀末（min 高亮）     | O(n²) 不稳定、交换仅 n-1 次 | 对照冒泡（比较同、交换少）；对照**堆排**（选择的高效版） |
| **插入** InsertionSort | 插入 · 近乎有序快      | 取 key、在有序前缀里边比边移插入（keyIndex 玫红）         | O(n²) 稳定、近乎有序 O(n)   | 对照**二分插入**（折半定位）、**希尔**（分组插入）       |
| **希尔** ShellSort     | 插入 · 突破 O(n²)      | gap 递减分组做插入、大步消除逆序（组内 dim 淡出）         | ~O(n^1.3) 不稳定            | 插入排序的突破；gap 序列                                 |
| **归并** MergeSort     | 归并 · 稳定 O(n log n) | 自底向上 width 倍增、两两合并（Aux temp 轨）              | O(n log n) 稳定 O(n) 空间   | 对照**自顶向下归并**（同 merge 两种驱动）                |
| **快速** QuickSort     | 交换 · 最常用          | Lomuto 末位 pivot + 显式区间栈分区（Stack 轨 + pivot 紫） | O(n log n) 平均、原地不稳定 | 对照**三路**（治重复）、**双轴**（Java 用）              |
| **堆排** HeapSort      | 选择 · 原地 O(n log n) | Floyd 建堆 + 反复取堆顶 siftDown（Tree 二叉树轨）         | O(n log n) 原地不稳定       | 选择排序的高效版；对照优先队列                           |
| **计数** CountingSort  | 非比较 · 线性          | 值域计数「萝卜一个坑」+ 回填（Count 桶轨，值域 1-6）      | O(n+k) 稳定                 | 线性三件套之一；对照**基数**（按位计数）、**桶**         |
| **基数** RadixSort     | 非比较 · 线性          | LSD 个位→十位，每轮 10 桶分配收集（Count 桶轨）           | O(d(n+k)) 稳定              | 对照**计数**（单值桶）、**桶**（值域桶）                 |

- 正文引用各页固定演示数据（8 个用 `[7,6,5,10,9,8,4,3,2,1]`、计数 `[3,1,4,1,6,2,3,6,4,1]`、基数 `[42,7,25,63,18,31,56,9]`），描述可视化里能实际看到的现象（如冒泡「右侧渐次变绿」、快排「pivot 紫柱归位」）。

## 4. spec 追加（每页 +1 Case）

```ts
// import Article from '@/components/article/Article.vue'; 加到顶部
it('TC-VIEW-XXX-03 全模板：介绍正文 Article（h1 中文名）', () => {
  const w = mount(XxxSort, { global: { plugins: [createPinia()] } });
  expect(w.findComponent(Article).exists()).toBe(true);
  expect(w.find('h1').text()).toContain('中文名');
});
```

既有 -01（挂载 AlgorithmPlayer）/-02（柱数 + 轨道 + counter）**零改动**——补正文后播放器仍在、柱数不变（Article 内嵌播放器），故既有断言继续通过。

## 5. e2e 扩断言（每页 +1 行）

```ts
await expect(page.locator('.article h1')).toContainText('中文名'); // 加在开头
```

既有断言（`.bar-cell` 数、`.count-view`/`.stack-view`/`.aux-view` 轨、`.scrub` 拖末步升序）保持——Article 包在播放器外层，不影响这些选择器。

## 6. 组件清单与改动面

| 文件（×9 各一组）                                | 类型          | 改动                         |
| ------------------------------------------------ | ------------- | ---------------------------- |
| `src/views/Article/SortAlgorithm/<Name>.vue`     | 改（补正文）  | 裸播放器 → Article 全模板    |
| `src/views/Article/SortAlgorithm/<Name>.spec.ts` | 改（加 Case） | +TC-VIEW-\*-03（Article+h1） |
| `e2e/<name>-sort.e2e.ts`                         | 改（扩断言）  | + `.article h1`              |

**零改动**：全部算法模块 / 6 轨组件 / AlgorithmPlayer / usePlayer / 类型 / 路由 / 菜单 / 首页 / 图标 / 6 个新排序 / 数据结构 / 图算法。

## 7. 向后兼容论证

- 纯视图层追加正文；播放器/轨道/交互零改动 → 9 页 -01/-02 视图 Case、9 e2e 既有断言全部零改动通过（Article 内嵌播放器，Bar 数/轨道/counter/scrub 不变）。
- 无路由/菜单/计数变化 → TC-HOOK 全部不动。
- 仅**追加** 9 个 L4 Case（TC-VIEW-\*-03）+ e2e 各加 1 断言行（不新增 e2e Case）。

## 8. 测试策略（详见 test-cases.md）

- **L4（每页 +1）**：TC-VIEW-\*-03 断言 Article + h1 含中文名（新正文的锚点，TDD 先红后绿）。
- **L5（每页扩断言）**：e2e 加 `.article h1` 断言，真机验证正文渲染（既有升序/轨道断言不动）。
- **零回归**：9 页 -01/-02 + 全站其它 Case 全绿；全量单测 + e2e 跑通。
- **真机抽查**：dev 抽查 3~4 页（无轨的冒泡/选择 + 带轨的快排 Stack/归并 Aux/堆 Tree/计数 Count 各代表），确认正文 + 播放器同屏、末步升序。
