<!-- src/views/Article/SortAlgorithm/BubbleSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
</script>

<template>
  <Article>
    <h1>冒泡排序 Bubble Sort</h1>
    <p class="sub">交换排序 · 最好懂的排序入门</p>

    <h2>什么是冒泡排序</h2>
    <p>
      冒泡排序的名字来自水里的气泡：<strong>相邻两个数两两比较，谁大就往后挪</strong>，一趟扫下来，最大的那个数就像气泡一样一路「冒」到数组末尾。下一趟在剩下的范围里再冒出次大的……如此重复，数组从右往左逐渐排好。它几乎不需要额外空间、也最容易在脑子里跑通，是理解「比较—交换」这类排序的起点。
    </p>

    <h2>它怎么做</h2>
    <p>
      每一趟从左到右走：比较位置 <code>j</code> 和
      <code>j+1</code
      >，如果左边比右边大就交换。走到本趟末尾，最大值必然落到最右的未排序位置——它就<strong>「就位」变绿</strong>、退出后续比较。点<strong>「下一步」</strong>看下面这组
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code
      >：留意<strong>右侧绿色区域每趟长一格</strong>，而黄色的比较对一路向右推。
    </p>

    <AlgorithmPlayer :module="bubbleSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间 <code>O(n²)</code>（n 趟、每趟约 n
      次比较）、只用常数额外空间、<strong>稳定</strong>（相等元素不会交换、保持原序）。它慢在交换太频繁，实际工程几乎不用；价值全在教学——把「排序」这件事拆到最直观。加一个「本趟没发生交换就提前结束」的小判断，可让近乎有序的数据快到
      <code>O(n)</code>。
    </p>

    <Callout>
      <b>冒泡的短板</b>：只从一个方向扫，尾部的小元素（「乌龟」）每趟只能往前挪一格，很慢。<br />
      <b>改进</b>：<b>鸡尾酒排序</b>来回双向冒泡、两端一起收缩，乌龟一趟就能回家。
    </Callout>

    <p>
      想看双向版怎么改进它，去<strong>鸡尾酒排序</strong>页对照着走一遍；两页用的是同一套比较—交换动作，差别只在扫描方向。
    </p>
  </Article>
</template>
