<!-- src/views/Article/SortAlgorithm/RadixSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { radixSortModule } from '@/algorithms/radix-sort.module';
</script>

<template>
  <Article>
    <h1>基数排序 Radix Sort</h1>
    <p class="sub">非比较排序 · 按位一轮轮排</p>

    <h2>什么是基数排序</h2>
    <p>
      计数排序适合小值域，可数字一大（比如三位数）桶就爆了。基数排序的巧思是<strong>按位处理</strong>：先只看<strong>个位</strong>把数分到
      0~9
      十个桶再收集，接着看<strong>十位</strong>、再<strong>百位</strong>……每一位都用一次稳定的分配收集。因为每轮都稳定，靠后处理的高位「盖过」低位，几轮下来整体就有序了——只用
      10 个桶，就排好了任意位数的整数。
    </p>

    <h2>它怎么做</h2>
    <p>
      LSD（从最低位起）：第 d 轮，按每个数的第 d 位数字（0~9）分配到 10 个桶，再按桶 0→9
      顺序收集回数组，作为下一轮的输入。点<strong>「下一步」</strong>看
      <code>[42, 7, 25, 63, 18, 31, 56, 9]</code>：<strong>桶轨</strong>显示当前位的 0~9
      分布，先按个位收集成一个序列，再按十位收集——第二轮结束就完全有序。
    </p>

    <AlgorithmPlayer :module="radixSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间 <code>O(d·(n + k))</code>（d 位、每位 k=10 个桶）、额外空间
      <code>O(n + k)</code>、<strong>稳定</strong>。当位数 d 远小于 log n 时，它比 O(n log n)
      的比较排序更快——常用于<strong>定长整数、定长字符串、日期</strong>等键。前提是「每轮分配必须稳定」，否则低位的排序结果会被打乱。
    </p>

    <Callout>
      <b>每轮的桶 = 一次计数排序</b>：基数排序本质是「对每一位做稳定计数排序」。<br />
      <b>三种非比较排序</b>：<b>计数</b>（桶=单个值）、<b>基数</b>（桶=一位数字
      0-9，多轮）、<b>桶排序</b>（桶=一段值域）。
    </Callout>

    <p>
      建议先看<strong>计数排序</strong>理解「稳定分配收集」，再回来体会基数怎么用它逐位攻克大值域；<strong>桶排序</strong>则是另一种分桶粒度。三页构成非比较线性排序的完整拼图。
    </p>
  </Article>
</template>
