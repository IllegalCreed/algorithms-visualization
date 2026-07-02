<!-- src/views/Article/SortAlgorithm/CountingSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { countingSortModule } from '@/algorithms/counting-sort.module';
</script>

<template>
  <Article>
    <h1>计数排序 Counting Sort</h1>
    <p class="sub">非比较排序 · 用空间换线性时间</p>

    <h2>什么是计数排序</h2>
    <p>
      前面的排序都靠<strong>两两比较</strong>决定顺序，理论下限是 O(n log
      n)。计数排序换了个思路：<strong>根本不比较</strong>——如果知道数据都是小范围内的整数，那就<strong>数一数每个值出现了几次</strong>，再按值从小到大把它们「倒」回去，天然就有序了。用「统计
      + 回填」代替「比较 + 交换」，时间可以做到<strong>线性</strong>。
    </p>

    <h2>它怎么做</h2>
    <p>
      为值域里每个可能的值准备一个「桶」（计数格）。第一遍扫描：读到值 v，就给桶 v
      <strong>计数 +1</strong>（一个格子 =
      出现一次，「萝卜一个坑」）。第二遍：按桶从小到大，桶里有几个就往结果里写几个。点<strong>「下一步」</strong>看
      <code>[3, 1, 4, 1, 6, 2, 3, 6, 4, 1]</code
      >：下方<strong>计数桶轨</strong>按「值」排开（1~6），读一个数对应桶就高亮 +1；留意值 5
      从没出现，是个<strong>空桶</strong>。
    </p>

    <AlgorithmPlayer :module="countingSortModule" />

    <h2>复杂度与适用</h2>
    <p>
      时间 <code>O(n + k)</code>（n 个元素 + k 个桶）、额外空间
      <code>O(k)</code>、<strong>稳定</strong>。它<strong
        >只适用于取值范围 k 不太大的整数（或可映射为整数的键）</strong
      >——k 远大于 n 时（如排 10 个 32
      位整数）就得不偿失。它是「非比较线性排序」三件套的基础，也是基数排序每一位所用的子过程。
    </p>

    <Callout>
      <b>值域太大怎么办？</b><b>基数排序</b>按位分批计数（每位只需 10
      个桶），把大值域拆成几轮小计数。<br />
      <b>值分布不均怎么办？</b><b>桶排序</b>按值域段分桶、桶内再排序。<br />
      三者同属非比较线性排序，桶的「粒度」不同。
    </Callout>

    <p>
      计数是线性排序的起点：往上一层是<strong>基数排序</strong>（按位计数）、<strong>桶排序</strong>（按段分桶）——对照三页，能看清「用什么当桶」这条主线。
    </p>
  </Article>
</template>
