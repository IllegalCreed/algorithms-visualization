<!-- src/views/Article/SortAlgorithm/HeapSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { heapSortModule } from '@/algorithms/heap-sort.module';
</script>

<template>
  <Article>
    <h1>堆排序 Heap Sort</h1>
    <p class="sub">选择排序 · 用二叉堆加速「选最值」</p>

    <h2>什么是堆排序</h2>
    <p>
      堆排序是<strong>选择排序的高效版</strong>。选择排序每轮要线性扫描才能找到最大值；堆排序先把数组组织成一个<strong>大顶堆</strong>（完全二叉树，每个父节点都
      ≥ 子节点，堆顶即全局最大），此后每次「取最值」只需 O(log n)。它把整体复杂度从 O(n²) 拉到
      <code>O(n log n)</code>，而且<strong>原地</strong>、不需要额外数组。
    </p>

    <h2>它怎么做</h2>
    <p>
      两个阶段：①<strong>建堆</strong>（Floyd 方法，从最后一个非叶节点往前逐个
      <code>siftDown</code> 下沉）；②<strong>排序</strong>——反复把堆顶（最大值）和堆末交换、堆缩小
      1、对新堆顶再 siftDown 恢复堆序。点<strong>「下一步」</strong>看
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code
      >：数组按完全二叉树布局显示在<strong>树轨</strong>上，当前正在下沉的节点<strong>深紫高亮</strong>，堆顶不断被「摘」到右端就位变绿。
    </p>

    <AlgorithmPlayer :module="heapSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间 <code>O(n log n)</code>（建堆 O(n) + n 次 O(log n)
      提取）、原地、<strong>不稳定</strong>。它的独特价值是<strong
        >最坏也保证 O(n log n) 且不吃额外内存</strong
      >——这正是 IntroSort
      用它兜底、防快排最坏退化的原因。堆结构本身更常以<strong>优先队列</strong>的形式出现在
      Dijkstra、任务调度、Top-K 等场景。
    </p>

    <Callout>
      <b>堆排 = 选择排序 + 二叉堆</b>：都是「反复取最值放到末尾」，区别在「取最值」用 O(log n)
      的堆代替 O(n) 的线性扫描。<br />
      <b>关联</b>：堆这个结构在<b>数据结构 · 堆</b>页有独立讲解（建堆 / 上浮下沉 / 优先队列）。
    </Callout>

    <p>
      想深入堆本身（而不只是拿它排序），可回看<strong>数据结构 · 堆</strong
      >；想看堆排如何给快排「保底」，见 <strong>IntroSort</strong>（排序线进阶篇）。
    </p>
  </Article>
</template>
