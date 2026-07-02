<!-- src/views/Article/SortAlgorithm/BinaryInsertionSort.vue -->
<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { binaryInsertionSortModule } from '@/algorithms/binary-insertion.module';
</script>

<template>
  <Article>
    <h1>二分插入排序 Binary Insertion Sort</h1>
    <p class="sub">插入排序 · 折半定位 · 二分思想嫁接经典排序</p>

    <h2>普通插入慢在哪</h2>
    <p>
      插入排序每轮把 key
      插进左边已排序的前缀：<strong>从右往左逐个比较、边比边移</strong>。可仔细想想，「找插入点」和「腾位置」是两件事——既然左边前缀<strong>已经有序</strong>，找位置根本不用一个个问过去，<strong>折半查找</strong>就行：比较次数从
      O(n) 降到 O(log n)。这就是二分插入排序。
    </p>

    <h2>折半定位怎么走</h2>
    <p>
      在前缀 <code>[0, i)</code> 上维护搜索区间 <code>[lo, hi)</code>：取中点
      <code>mid</code>，<code>key &lt; a[mid]</code> 就往<strong>左半</strong>收（<code
        >hi = mid</code
      >）；否则往<strong>右半</strong>收（<code>lo = mid + 1</code
      >——相等也走右边，等值的新元素排到老元素后面，<strong>保持稳定</strong>）。区间一次砍一半，<code
        >lo == hi</code
      >
      时就是插入点 <code>pos</code>；再把 <code>[pos, i)</code>
      整段右移一格、key 落位。
    </p>
    <p>
      下面固定 8 个数
      <code>[5, 2, 9, 4, 7, 1, 8, 3]</code>。点<strong>「下一步」</strong>：看
      <strong>lo（绿）/ mid（蓝）/ hi（红）三个箭头夹逼收缩</strong>定位插入点，然后玫红的 key
      滑动落位。留意两轮对比——key=9 那轮定位后<strong>原位零搬移</strong>，key=1 那轮定位到
      0、<strong>整段搬移 5 格</strong>：折半省的是比较，搬移一格都少不了。
    </p>

    <AlgorithmPlayer :module="binaryInsertionSortModule" />

    <h2>复杂度：比较少了，搬移没少</h2>
    <p>
      比较次数 <code>O(n log n)</code>（每轮 log i 次），但每轮定位后的<strong>搬移仍是 O(n)</strong
      >——总复杂度还是
      <code>O(n²)</code
      >、原地、<strong>稳定</strong>。它的价值在「<strong>比较昂贵</strong>」的场景：当比较是复杂对象/长字符串/远程调用而搬移是便宜的内存操作时，省一半以上的比较非常划算。
    </p>

    <Callout>
      <b>普通插入（插入排序页）</b>：边比边移，比较与搬移耦合，各 O(n)。<br />
      <b>二分插入（本页）</b>：先折半定位（O(log n) 次比较）、再整段搬移——比较与搬移解耦。<br />
      <b>TimSort</b>（Python/Java 实际排序）对小段用的正是二分插入——排序线后面见。
    </Callout>

    <p>
      想复习「边比边移」的原始版本，回看<strong>插入排序</strong>页对照着走一遍；「在有序区间里折半夹逼」这个动作，也正是<strong>二分查找</strong>本身——一个算法思想，两处落地。
    </p>
  </Article>
</template>
