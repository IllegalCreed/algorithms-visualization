<!-- src/views/Article/SortAlgorithm/InsertionSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { insertionSortModule } from '@/algorithms/insertion-sort.module';
</script>

<template>
  <Article>
    <h1>插入排序 Insertion Sort</h1>
    <p class="sub">插入排序 · 像整理手里的扑克牌</p>

    <h2>什么是插入排序</h2>
    <p>
      插入排序就是<strong>理牌</strong>的过程：左手里的牌始终有序，每次从右边摸一张新牌（<code>key</code>），从右往左和已有序的牌逐个比较，找到位置插进去。数组里的做法一样——把左侧前缀维护成有序区，逐个把后面的元素<strong>插入到前缀的正确位置</strong>。它实现简单、常数小，在小数据或近乎有序的数据上表现相当好。
    </p>

    <h2>它怎么做</h2>
    <p>
      第 i 轮取出
      <code>key = a[i]</code
      >（<strong>玫红高亮</strong>），在左边有序前缀里<strong>边比较边右移</strong>：比 key
      大的元素依次向右让位，直到腾出 key 该在的空位落下。点<strong>「下一步」</strong>看
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code>：玫红的 key
      一路向左「滑」到位，左侧有序区每轮扩大一格。
    </p>

    <AlgorithmPlayer :module="insertionSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间
      <code>O(n²)</code
      >、常数额外空间、<strong>稳定</strong>。它的亮点是<strong>自适应</strong>：数据越接近有序，每轮要移动的越少——完全有序时退化为一趟
      O(n) 扫描。正因如此，它常被当作更复杂排序的「小数组子程序」（如 TimSort、IntroSort
      在小段上转用插入排序）。
    </p>

    <Callout>
      <b>比较是瓶颈？</b><b>二分插入排序</b>用折半查找定位插入点，把每轮的比较从 O(n) 降到 O(log
      n)（移动仍在）。<br />
      <b>移动是瓶颈？</b><b>希尔排序</b>先按大间隔分组插入，让元素大步归位，跳出 O(n²)。
    </Callout>

    <p>
      两个改进方向本站都有页：<strong>二分插入排序</strong>省比较、<strong>希尔排序</strong>省移动——对照着看，能清楚「插入」这个动作还能怎么优化。
    </p>
  </Article>
</template>
