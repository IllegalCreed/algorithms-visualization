<!-- src/views/Article/SortAlgorithm/QuickSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { quickSortModule } from '@/algorithms/quick-sort.module';
</script>

<template>
  <Article>
    <h1>快速排序 Quick Sort</h1>
    <p class="sub">交换排序 · 实践中最快的通用排序</p>

    <h2>什么是快速排序</h2>
    <p>
      快速排序是「<strong>分而治之</strong>」的代表：挑一个<strong>基准 pivot</strong
      >，把数组重排成「比它小的都在左、比它大的都在右」——这一步叫<strong>分区（partition）</strong>，做完后
      pivot 就落到了它最终该在的位置。然后对左右两段各自递归重复。它平均只要 O(n log
      n)、而且<strong>原地</strong>不吃额外内存、常数因子小，是大多数语言标准库通用排序的底子。
    </p>

    <h2>它怎么做</h2>
    <p>
      本页用 <strong>Lomuto 分区</strong>（取区间末位当 pivot）+
      一个<strong>显式区间栈</strong>代替递归：栈里存「待处理的区间」，每次弹出一段做分区、把
      pivot（<strong>品红柱</strong>）换到正确位置钉死，再把左右两个子区间压回栈。点<strong>「下一步」</strong>看
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code
      >：右侧<strong>区间栈</strong>显示还有哪些段待排，主轨上 pivot
      一次次归位、绿色就位块逐渐铺满。
    </p>

    <AlgorithmPlayer :module="quickSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      平均 <code>O(n log n)</code>、原地、<strong>不稳定</strong>。软肋是最坏 <code>O(n²)</code>——当
      pivot 每次都取到极值（如对已有序数组取末位），分区会退化成一头沉。实战用「随机 / 三数取中」选
      pivot 来规避。另外<strong>大量重复元素</strong>也会拖慢它——这正是三路快排要解决的。
    </p>

    <Callout>
      <b>快排的两个变体</b>（本站都有）：<br />
      <b>三路快排</b>：分成 &lt; / == / &gt; 三段，等值元素一次归位——治大量重复。<br />
      <b>双轴快排</b>：用两个基准分三段——Java 基本类型 <code>Arrays.sort</code> 实际采用。
    </Callout>

    <p>
      看懂本页的单轴分区后，去<strong>三路快排</strong>和<strong>双轴快排</strong>页看它在真实世界怎么被打磨——同样的
      lt/i/gt 指针，玩法各不相同。
    </p>
  </Article>
</template>
