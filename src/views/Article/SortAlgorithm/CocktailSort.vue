<!-- src/views/Article/SortAlgorithm/CocktailSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { cocktailSortModule } from '@/algorithms/cocktail.module';
</script>

<template>
  <Article>
    <h1>鸡尾酒排序 Cocktail Shaker Sort</h1>
    <p class="sub">交换排序 · 双向冒泡 · 专治「乌龟」</p>

    <h2>冒泡的乌龟问题</h2>
    <p>
      冒泡排序每趟从左往右扫，大元素（<strong>兔子</strong>）一趟就能蹦到右端；可待在尾部的小元素（<strong>乌龟</strong>）每趟只能往左挪
      <strong>一格</strong>——数组 <code>[..., 1]</code> 里的 1 要爬 n-1
      趟才能回家。方向不对称，是单向扫描的天生短板。
    </p>

    <h2>来回摇：双向冒泡</h2>
    <p>
      鸡尾酒排序像调酒一样<strong>来回摇</strong>：先一趟<strong>从左到右</strong>把最大的冒到右端（右边界
      <code>right--</code>），再一趟<strong>从右到左</strong>把最小的沉到左端（左边界
      <code>left++</code>）——活动区 <code>[left, right]</code>
      两端向中间收缩，乌龟也能一趟直达。任何一趟<strong>零交换</strong>，说明区间已有序，直接<strong>提前收工</strong>。
    </p>
    <p>
      下面固定 8 个数 <code>[4, 2, 6, 3, 8, 5, 7, 1]</code>——尾部藏了只乌龟
      1。点<strong>「下一步」</strong>：第 1 趟（→）把 8 冒到右端、<strong>右端变绿</strong>；第 2
      趟（←）<strong>六连交换</strong>把乌龟 1
      一趟送回头、<strong>左端也变绿</strong>——两端绿色逐渐夹住中间乱序区；第 4
      趟（←）全程不交换，<strong>提前收工</strong>。
    </p>

    <AlgorithmPlayer :module="cocktailSortModule" />

    <h2>复杂度：还是 O(n²)，但趟数省了</h2>
    <p>
      最坏与平均仍是
      <code>O(n²)</code
      >、原地、<strong>稳定</strong>——它不改变冒泡的量级，改善的是<strong>趟数</strong>：乌龟场景里单向冒泡要
      n-1
      趟，双向来回一次就解决；对「基本有序、少数元素错位」的数据配合提前收工非常利落。它是「<strong>调整扫描方向</strong>」这个小改动带来大改善的经典教学案例。
    </p>

    <Callout>
      <b>冒泡排序</b>：单向扫，兔子快、乌龟慢——尾部小元素每趟只挪一格。<br />
      <b>鸡尾酒排序（本页）</b>：来回扫 + 两端收缩，乌龟一趟到家；任一趟零交换提前收工。<br />
      两者同为 O(n²) 稳定原地排序，差别全在<b>扫描方向的对称性</b>。
    </Callout>

    <p>
      对照<strong>冒泡排序</strong>页把同一套 compare/swap
      再走一遍，你会发现本页唯一的新东西就是「掉头」——有时候，算法优化就这么朴素。
    </p>
  </Article>
</template>
