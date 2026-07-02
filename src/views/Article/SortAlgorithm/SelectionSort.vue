<!-- src/views/Article/SortAlgorithm/SelectionSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { selectionSortModule } from '@/algorithms/selection-sort.module';
</script>

<template>
  <Article>
    <h1>选择排序 Selection Sort</h1>
    <p class="sub">选择排序 · 交换次数最少</p>

    <h2>什么是选择排序</h2>
    <p>
      选择排序的思路像「每次挑最小的先站队」：<strong>在未排序区间里扫一遍、找出最小值，把它换到未排序区的最前面</strong>，这个位置就此定下来。然后在剩下的区间里再找次小的……前缀有序区从左往右一格格长大。它和冒泡都是
      O(n²)，但有个鲜明特点——<strong>每一轮最多只交换一次</strong>，总交换次数只有 n-1 次。
    </p>

    <h2>它怎么做</h2>
    <p>
      第 i 轮：从下标 i 往右扫，用
      <code>minIndex</code> 记住当前最小值的位置（扫描时被记录的最小值高亮），扫完把
      <code>a[i]</code> 和 <code>a[minIndex]</code> 交换。点<strong>「下一步」</strong>看
      <code>[7, 6, 5, 10, 9, 8, 4, 3, 2, 1]</code
      >：注意<strong>整轮都在「找」</strong>、只有轮末那一下才「换」——比较很多、交换极省。
    </p>

    <AlgorithmPlayer :module="selectionSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间恒为
      <code>O(n²)</code
      >（无论数据是否有序都要扫满）、常数额外空间、<strong>不稳定</strong>（跨越式交换会打乱相等元素的相对次序）。它的比较次数和冒泡一样多，但<strong>交换/写入次数最少</strong>——当「写」的代价远高于「比较」（如元素很大、或写入闪存有损耗）时，这个特性有实际意义。
    </p>

    <Callout>
      <b>选择 vs 冒泡</b>：比较次数相同，但选择每轮只换一次、冒泡边扫边换。<br />
      <b>选择的高效版</b>：<b>堆排序</b>——用二叉堆在 O(log n) 内「选出最大值」，把 O(n²) 降到 O(n
      log n)。
    </Callout>

    <p>
      当你觉得「每次都线性扫描找最值太慢」，就该看<strong>堆排序</strong>怎么用堆结构加速这个「选择」动作——它正是选择排序的进化终点。
    </p>
  </Article>
</template>
