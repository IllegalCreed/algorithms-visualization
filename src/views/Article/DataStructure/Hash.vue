<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import Playground from '@/components/article/Playground.vue';
import HashViz from '@/components/structures/HashViz.vue';
</script>

<template>
  <Article>
    <h1>哈希表 Hash</h1>
    <p class="sub">数据结构 · 用散列函数把键直接算成下标</p>

    <h2>什么是哈希表</h2>
    <p>
      前面找一个元素，要么靠下标、要么顺着指针走。哈希表换了个思路——<strong>靠算</strong>：把键丢进一个<strong>散列函数</strong>，算出一个桶下标，<strong>直接跳过去</strong>存或取，平均只要
      <code>O(1)</code>，不用比较、不用遍历。
    </p>
    <p>
      这里用最简单的散列 <code>hash(key) = key % 7</code>（7
      个桶）。但麻烦来了：两个不同的键可能算出<strong>同一个桶</strong>——这叫<strong>哈希冲突</strong>。<strong>拉链法</strong>的办法是：每个桶挂一条<strong>链</strong>，冲突的键就<strong>追加到链尾</strong>。输入一个数试试插入或查找。
    </p>

    <Playground>
      <HashViz />
    </Playground>

    <p>
      看见了吗——插入 <code>11</code>：<code>11 % 7 = 4</code>，跳到 4
      号桶；如果桶里已经有元素，就<strong>挂到链尾</strong>（冲突）。查找也一样：先算出桶号直达，再<strong>沿那条链比较</strong>。只要散列均匀、链都很短，存取就接近
      <code>O(1)</code>；但如果都挤进一个桶、链很长，就退化成
      <code>O(n)</code>——所以<strong>好的散列函数</strong>和<strong>合适的桶数</strong>很关键。
    </p>

    <h2>哈希表在哪里用</h2>
    <Callout>
      <b>字典 / 映射</b>：几乎所有语言的 dict/map/object 底层都是哈希表。<br />
      <b>去重 / 集合</b>：Set 用哈希表 O(1) 判断存在。<br />
      <b>缓存 / 索引</b>：键值缓存、数据库哈希索引。
    </Callout>
    <p>只剩最后一种、也是最一般的结构了——<strong>图</strong>：顶点和边的任意连接。</p>
  </Article>
</template>
