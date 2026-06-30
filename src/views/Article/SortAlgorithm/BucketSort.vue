<!-- src/views/Article/SortAlgorithm/BucketSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bucketSortModule } from '@/algorithms/bucket-sort.module';
</script>

<template>
  <Article>
    <h1>桶排序 Bucket Sort</h1>
    <p class="sub">经典排序 · 非比较 · 分桶 + 桶内排序 + 合并</p>

    <h2>什么是桶排序</h2>
    <p>
      桶排序不直接两两比较全体，而是<strong>按值域把元素撒进若干「桶」</strong>：每个桶负责一段连续的取值范围。撒完后<strong>每个桶内部各自排序</strong>，最后<strong>按桶的先后顺序把各桶依次倒出</strong>拼接，整体就有序了。它和计数排序、基数排序同属<strong>非比较的线性排序</strong>。
    </p>

    <h2>桶排序怎么做</h2>
    <p>分三步，对应下面播放器里高亮的三段代码：</p>
    <p>
      ①<strong>分配（distribute）</strong>：遍历数组，按值算出该进哪个桶（这里取
      <code>⌊v / 10⌋</code>，每桶宽
      10），把元素追加进去。②<strong>桶内排序（sortBucket）</strong>：对每个桶各自排序——桶内元素少，用插入排序很快；空桶直接跳过。③<strong>合并（concat）</strong>：按桶
      0、1、2…的顺序，把每个桶里已排好的元素依次写回原数组。因为「桶之间已经按值域有序、桶内也各自有序」，拼起来自然全局有序。
    </p>
    <p>
      下面固定 8 个数 <code>[29, 25, 3, 49, 9, 37, 21, 43]</code>，分成 5 个桶（0–9 / 10–19 / 20–29
      / 30–39 / 40–49）。点<strong>「下一步」</strong>看它怎么把数撒进桶（留意 10–19
      是个<strong>空桶</strong>）、桶 20–29 内部 <code>[29, 25, 21]</code> 怎么排成
      <code>[21, 25, 29]</code>，再合并回主轨。
    </p>

    <AlgorithmPlayer :module="bucketSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      设 n 个元素分到 k 个桶。若数据<strong>大致均匀分布</strong>，每桶约 n/k
      个，桶内排序总代价摊薄到接近线性，平均
      <code>O(n + k)</code>；额外空间
      <code>O(n + k)</code
      >，且是<strong>稳定</strong>排序。但分布若极不均匀——所有元素挤进同一个桶——就<strong>退化</strong>成「单个桶内排序」，最坏
      <code>O(n²)</code>（或 O(n log
      n)，取决于桶内用什么排序）。所以桶排序的前提是<strong>对数据分布有把握</strong>。
    </p>

    <Callout>
      <b>计数排序</b>：桶 = 单个值（桶里只记「出现几次」）。<br />
      <b>桶排序</b>：桶 = 一段值域（桶里装<b>实际元素</b>，还要桶内排序）。<br />
      <b>基数排序</b>：按位多轮分配收集，每轮桶 = 一个数字 0–9。
    </Callout>

    <h2>桶排序在哪里用</h2>
    <p>
      最典型的是<strong>把 [0, 1) 上均匀分布的浮点数排序</strong
      >（按小数大小分桶）、或对成绩、年龄这类<strong>取值范围已知且分布较均匀</strong>的数据排序。它也是「<strong>先粗分、再细排</strong>」这一分治思想的直观范例——线性排序三件套（计数
      ✓ 基数 ✓ 桶 ✓）至此补齐。
    </p>
  </Article>
</template>
