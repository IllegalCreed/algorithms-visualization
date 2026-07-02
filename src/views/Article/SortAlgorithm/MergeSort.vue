<!-- src/views/Article/SortAlgorithm/MergeSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { mergeSortModule } from '@/algorithms/merge-sort.module';
</script>

<template>
  <Article>
    <h1>归并排序 Merge Sort</h1>
    <p class="sub">归并排序 · 稳定的 O(n log n)</p>

    <h2>什么是归并排序</h2>
    <p>
      归并排序的核心是<strong>合并两个有序序列</strong>：两个都已排好的小段，用两个指针从头比较、每次取较小的放进结果，就能线性地拼成一个更大的有序段。把这个「合并」反复用到底，整个数组就有序了。它是<strong
        >稳定的</strong
      >
      O(n log n) 排序，代价是需要一块和原数组等大的<strong>辅助空间</strong>。
    </p>

    <h2>它怎么做</h2>
    <p>
      本页用<strong>自底向上</strong>的写法：段宽 <code>width</code> 从 1
      开始，把相邻的两段合并成一段，宽度 1 → 2 → 4 → 8…
      一轮轮翻倍，直到覆盖整个数组。点<strong>「下一步」</strong>看
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code>：下方的
      <strong>辅助轨（temp）</strong>展示当前合并——两段比较、较小者依次填入
      temp，填满后整段拷回主轨（柱子平滑重排）。
    </p>

    <AlgorithmPlayer :module="mergeSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间稳定 <code>O(n log n)</code>（不受输入分布影响）、额外空间
      <code>O(n)</code>、<strong>稳定</strong>。它是「稳定 + 最坏也 O(n log
      n)」时的首选，也是<strong>外部排序</strong>（数据大到放不进内存、多路归并磁盘文件）和链表排序的基础。代价是那块辅助内存——这也是它和原地的快排/堆排最大的权衡点。
    </p>

    <Callout>
      <b>两种写法，同一个 merge</b
      >：本页是<b>自底向上</b>（迭代、段宽翻倍）；<b>自顶向下归并</b>页是<b>递归分治</b>（对半下钻、回程合并，配调用栈看）。合并过程一模一样，只是驱动方式不同。
    </Callout>

    <p>
      想看递归版怎么用「分治 +
      调用栈」组织同一个合并，去<strong>自顶向下归并</strong>页对照——两页并看，「归并」就彻底通了。
    </p>
  </Article>
</template>
