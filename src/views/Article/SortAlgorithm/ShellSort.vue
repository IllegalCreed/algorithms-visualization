<!-- src/views/Article/SortAlgorithm/ShellSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { shellSortModule } from '@/algorithms/shell-sort.module';
</script>

<template>
  <Article>
    <h1>希尔排序 Shell Sort</h1>
    <p class="sub">插入排序 · 用大间隔跳出 O(n²)</p>

    <h2>什么是希尔排序</h2>
    <p>
      希尔排序是<strong>插入排序的加速版</strong>。插入排序每次只和相邻元素比较，一个远在末尾的小元素要一格格挪很久。希尔的点子是：<strong
        >先用一个大的「间隔 gap」把数组分成若干组</strong
      >（每隔 gap
      个取一个元素为一组），对每组各自做插入排序——这样元素能<strong>大步跨越</strong>、快速接近最终位置；然后缩小
      gap 再来一轮，直到 gap=1 做最后一次普通插入。此时数组已「基本有序」，最后一趟极快。
    </p>

    <h2>它怎么做</h2>
    <p>
      外层 gap 逐轮减半（如 5 → 2 → 1），每个 gap
      下对各分组做插入排序。点<strong>「下一步」</strong>看
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code
      >：当前正在处理的<strong>那一组柱子高亮、其余淡出（dimmed）</strong>——你能清楚看到「隔着 gap
      的元素凑成一组比较」，以及大间隔如何让逆序对被快速消除。
    </p>

    <AlgorithmPlayer :module="shellSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      希尔排序<strong>不稳定</strong>、原地，时间复杂度取决于 gap 序列——本页用的减半序列约
      <code>O(n²)</code> 最坏，而 Knuth、Sedgewick 等精心设计的序列可达
      <code>O(n^1.3)</code> 上下。它是第一个突破「相邻交换类
      O(n²)」的排序，证明了「先粗调、再细调」这一思路的威力；工程上偶尔用于中等规模、又想避免递归/额外内存的场景。
    </p>

    <Callout>
      <b>希尔 = 分组插入</b>：gap&gt;1 时各组内部就是普通插入排序；gap=1 那轮就是标准插入排序。<br />
      理解它的前提是先懂<b>插入排序</b>——希尔只是给插入排序加了「大间隔预处理」。
    </Callout>

    <p>
      建议先看<strong>插入排序</strong>页，再回来体会希尔怎么用「间隔」给它提速；同一族的还有
      <strong>二分插入排序</strong>（从比较次数下手优化）。
    </p>
  </Article>
</template>
