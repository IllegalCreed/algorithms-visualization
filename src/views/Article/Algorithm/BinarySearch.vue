<script setup lang="ts">
import Article from '@/components/article/Article.vue';
import Callout from '@/components/article/Callout.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import { bsearchModule } from '@/algorithms/bsearch.module';
</script>

<template>
  <Article>
    <h1>二分查找</h1>
    <p class="sub">查找 · 有序数组 · 每一步扔掉一半</p>

    <h2>猜数字的最优策略</h2>
    <p>
      「我想了个 1 到 1000
      的数，你每猜一次我告诉你大了还是小了」——最优策略人人都会：<strong>猜中间</strong>。答案「大了」就扔掉下半、「小了」就扔掉上半，每次候选减半，10
      次以内必中。<strong>二分查找</strong>就是这个策略在<strong>有序数组</strong>上的算法化：维护候选区间
      <code>[lo, hi]</code>，每步和中点 <code>arr[mid]</code> 比较，扔掉不可能的一半——<strong
        ><code>O(log n)</code></strong
      >，10 亿元素最多 30 次比较。
    </p>

    <h2>看得见的「扔掉一半」</h2>
    <p>
      下面两次查找：先找 <code>17</code>（命中），再找 <code>4</code>（不存在）。红/蓝/黄箭头是
      <code>lo / mid / hi</code>，<strong>亮着的柱子 = 当前候选区间</strong
      >，暗下去的都是已被证明不可能的。注意第二次：区间收缩到 <code>[2, 1]</code>（lo &gt;
      hi）彻底清空——循环退出、返回 <code>-1</code>。右侧代码随每一步同步高亮。
    </p>

    <AlgorithmPlayer :module="bsearchModule" />

    <h2>不变量与小坑</h2>
    <Callout>
      <b>前提</b>：有序。乱序数组要先排序（O(n log n)），一次查找多、排序摊销就值。<br />
      <b>不变量</b>：目标若存在，必在 [lo, hi] 内——每次收缩都保持这句话为真，正确性就有了。<br />
      <b>溢出坑</b>：<code>(lo + hi) / 2</code> 在大数组下可能溢出，稳妥写
      <code>lo + ((hi - lo) &gt;&gt; 1)</code>。<br />
      <b>复杂度</b>：每步区间减半 → ⌈log₂(n+1)⌉ 次比较封顶。
    </Callout>
    <p>
      基础版只回答「在不在」。真正让二分成为面试与竞赛常客的是它的<strong>变体</strong>：重复元素里找<router-link
        to="/docs/binary-bounds"
        ><strong>左右边界</strong>（lower/upper bound）</router-link
      >、<router-link to="/docs/rotated-search"><strong>旋转有序数组</strong></router-link
      >里定位、以及跳出数组、在<strong>答案空间</strong>上二分（「最小可行速度」「最大最小值」）——这些是查找大类接下来几页的故事。
    </p>
  </Article>
</template>
